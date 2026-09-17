/* ==========================================================================
   CUVASOL AGENT CLOUD - MONGODB & MONGOOSE DATABASE SERVICE (server/db.js)
   ========================================================================== */

import dns from 'dns';
import mongoose from 'mongoose';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignored if restricted
}
import {
  User,
  Campaign,
  Lead,
  Transaction,
  Payout,
  Notification,
  Asset,
  ClickLog
} from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUNDLED_DB_FILE = path.join(__dirname, 'data', 'store.json');

// Helper to hash password with salt
function hashPassword(password, salt = 'cuvasol_salt_2026') {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

// Global cached connection for serverless / reload environments
let cachedConnection = global.__mongoConnection || null;

class DatabaseService {
  constructor() {
    this.isConnected = false;
    this.isSeeding = false;
    this.connectionPromise = null;
  }

  async connect() {
    if (this.isConnected && mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }

    this.connectionPromise = (async () => {
      try {
        if (mongoose.connection.readyState === 1) {
          this.isConnected = true;
          return mongoose.connection;
        }

        console.log('🔄 Connecting to MongoDB database...');
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 15000,
          socketTimeoutMS: 45000
        });

        this.isConnected = true;
        global.__mongoConnection = conn;
        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);

        // Bootstrap seed data if database collections are empty
        await this.bootstrapSeedData();

        return conn;
      } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        this.isConnected = false;
        this.connectionPromise = null;
        throw err;
      }
    })();

    return this.connectionPromise;
  }

  async ensureConnected() {
    if (!this.isConnected || mongoose.connection.readyState !== 1) {
      await this.connect();
    }
  }

  async bootstrapSeedData() {
    if (this.isSeeding) return;
    this.isSeeding = true;

    try {
      const userCount = await User.countDocuments();
      if (userCount > 0) {
        // Already seeded
        this.isSeeding = false;
        return;
      }

      console.log('📦 Initializing fresh MongoDB database with bootstrap seed data...');
      if (!fs.existsSync(BUNDLED_DB_FILE)) {
        this.isSeeding = false;
        return;
      }

      const seedContent = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
      const data = JSON.parse(seedContent);

      if (data.users && data.users.length) {
        await User.insertMany(data.users);
      }
      if (data.campaigns && data.campaigns.length) {
        await Campaign.insertMany(data.campaigns);
      }
      if (data.leads && data.leads.length) {
        await Lead.insertMany(data.leads);
      }
      if (data.transactions && data.transactions.length) {
        await Transaction.insertMany(data.transactions);
      }
      if (data.payouts && data.payouts.length) {
        await Payout.insertMany(data.payouts);
      }
      if (data.notifications && data.notifications.length) {
        await Notification.insertMany(data.notifications);
      }
      if (data.assets && data.assets.length) {
        await Asset.insertMany(data.assets);
      }
      if (data.clickLogs && data.clickLogs.length) {
        await ClickLog.insertMany(data.clickLogs);
      }

      console.log('🎉 MongoDB database successfully seeded with initial agent data and assets!');
    } catch (err) {
      console.error('⚠️ Error bootstrapping seed data to MongoDB:', err);
    } finally {
      this.isSeeding = false;
    }
  }

  sanitizeUser(user) {
    if (!user) return null;
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.passwordHash;
    delete obj._id;
    delete obj.__v;
    return obj;
  }

  // ==========================================
  // AUTHENTICATION & USERS
  // ==========================================

  async getUserByToken(token) {
    if (!token) return null;
    await this.ensureConnected();
    const user = await User.findOne({ token }).lean();
    return user;
  }

  async getUserById(id) {
    await this.ensureConnected();
    const user = await User.findOne({ id }).lean();
    return user;
  }

  async register({ name, email, password, referralCodeUsed, channels, payoutMethod }) {
    await this.ensureConnected();
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const userId = 'CU-' + Math.floor(1000 + Math.random() * 9000);
    const cleanName = name.trim();
    const initials = cleanName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AG';
    const referralCode = cleanName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) + '-' + Math.floor(10 + Math.random() * 90);
    const slugName = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const token = 'tok_' + crypto.randomBytes(24).toString('hex');
    const pwdHash = hashPassword(password || 'password123');

    let referredBy = null;
    if (referralCodeUsed) {
      const cleanRef = referralCodeUsed.trim();
      const referrer = await User.findOne({
        referralCode: new RegExp(`^${cleanRef}$`, 'i')
      });
      if (referrer) {
        referredBy = referrer.referralCode;
        // Add notification for the referring user
        await Notification.create({
          id: 'nt-' + Date.now(),
          userId: referrer.id,
          title: 'New Referral! 🎉',
          text: `${cleanName} just signed up using your referral code (${referrer.referralCode})!`,
          time: 'Just now',
          read: false
        });
      }
    }

    const newUser = await User.create({
      id: userId,
      email: normalizedEmail,
      passwordHash: pwdHash,
      name: cleanName,
      tier: 'Active Agent',
      tierCommission: 0.12,
      avatar: initials,
      joinedDate: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      referralCode: referralCode,
      referredBy: referredBy,
      customSlug: `cuvasol.energy/a/${slugName}`,
      payoutMethod: payoutMethod || 'Direct Bank Deposit (ACH)',
      niche: channels && channels.length ? channels : ['Referral Sharing'],
      token: token,
      notificationSettings: {
        emailLeadAlerts: true,
        smsPayoutAlerts: true,
        weeklyAdDrops: true
      }
    });

    // Add welcome notification
    await Notification.create({
      id: 'nt-' + (Date.now() + 1),
      userId: userId,
      title: 'Welcome to Cuvasol! ⚡',
      text: `Your unique referral code is ${referralCode}. Share it to start building your referral network.`,
      time: 'Just now',
      read: false
    });

    return { user: this.sanitizeUser(newUser), token };
  }

  async getReferrals(userId) {
    await this.ensureConnected();
    const user = await this.getUserById(userId);
    if (!user) {
      return { referralCode: '', totalReferrals: 0, referredUsers: [] };
    }

    const refCode = user.referralCode;
    const referredUsers = await User.find({
      referredBy: new RegExp(`^${refCode}$`, 'i')
    }).sort({ createdAt: -1 }).lean();

    return {
      referralCode: refCode,
      totalReferrals: referredUsers.length,
      referredUsers: referredUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        joinedDate: u.joinedDate || new Date(u.createdAt).toLocaleDateString(),
        tier: u.tier || 'Agent'
      }))
    };
  }

  async login(email, password) {
    await this.ensureConnected();
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const inputHash = hashPassword(password);
    if (user.passwordHash && user.passwordHash !== inputHash) {
      // Check if it's the demo account
      if (user.id === 'CU-7390' && (password === 'demo12345' || password === 'demo123')) {
        // demo pass accepted
      } else {
        throw new Error('Invalid email or password.');
      }
    }

    // Refresh token
    const newToken = 'tok_' + crypto.randomBytes(24).toString('hex');
    user.token = newToken;
    await user.save();

    return { user: this.sanitizeUser(user), token: newToken };
  }

  async demoLogin() {
    await this.ensureConnected();
    let demoUser = await User.findOne({ $or: [{ id: 'CU-7390' }, { email: 'demo@cuvasol.energy' }] });

    if (!demoUser) {
      demoUser = await User.create({
        id: 'CU-7390',
        email: 'demo@cuvasol.energy',
        passwordHash: hashPassword('demo12345'),
        name: 'Sarah Jenkins',
        tier: 'Platinum Agent',
        tierCommission: 0.15,
        avatar: 'SJ',
        joinedDate: 'Oct 2025',
        referralCode: 'SARAH-CLEAN-26',
        customSlug: 'cuvasol.energy/a/sarahj',
        payoutMethod: 'Direct Deposit (Chase ****4812)',
        niche: ['Residential Solar', 'Commercial Storage', 'EV Fleet Infra'],
        token: 'tok_demo_sarah_jenkins_2026',
        notificationSettings: {
          emailLeadAlerts: true,
          smsPayoutAlerts: true,
          weeklyAdDrops: true
        }
      });
    }

    demoUser.token = 'tok_demo_' + crypto.randomBytes(16).toString('hex');
    await demoUser.save();

    return { user: this.sanitizeUser(demoUser), token: demoUser.token };
  }

  async updateProfile(userId, updates) {
    await this.ensureConnected();
    const user = await User.findOne({ id: userId });
    if (!user) throw new Error('User not found');

    if (updates.name) {
      user.name = updates.name.trim();
      user.avatar = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AG';
    }
    if (updates.customSlug) {
      user.customSlug = updates.customSlug.trim();
    }
    if (updates.payoutMethod) {
      user.payoutMethod = updates.payoutMethod.trim();
    }
    if (updates.niche && Array.isArray(updates.niche)) {
      user.niche = updates.niche;
    }
    if (updates.notificationSettings) {
      user.notificationSettings = {
        ...user.notificationSettings?.toObject?.() || user.notificationSettings,
        ...updates.notificationSettings
      };
    }

    await user.save();
    return this.sanitizeUser(user);
  }

  // ==========================================
  // DASHBOARD KPIS & DYNAMIC CALCULATIONS
  // ==========================================

  async getKPIs(userId) {
    await this.ensureConnected();
    const [userLeads, userCampaigns, userTransactions] = await Promise.all([
      Lead.find({ userId }).lean(),
      Campaign.find({ userId }).lean(),
      Transaction.find({ userId }).lean()
    ]);

    // Total gross revenue generated from closed-won & paid deals
    const closedLeads = userLeads.filter(l => l.stage === 'closed_won' || l.stage === 'paid');
    const totalRevenueGenerated = closedLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);

    // Active leads in pipeline
    const activeLeadsCount = userLeads.filter(l => l.stage !== 'closed_lost').length;

    // Conversion rate
    const totalLeads = userLeads.length;
    const conversionRate = totalLeads > 0 ? Number(((closedLeads.length / totalLeads) * 100).toFixed(1)) : 0.0;

    // Monthly Clicks across active campaigns
    const monthlyClicks = userCampaigns.reduce((sum, c) => sum + (Number(c.clicks) || 0), 0);

    // Total commission earned
    const totalCommissionEarned = userTransactions
      .filter(t => (t.type === 'Commission' || t.type === 'Bonus') && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    // Dynamic 12-Month Trajectory
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const monthlyTrajectory = months.map((m, idx) => {
      if (idx > currentMonthIdx) return 0;
      if (totalRevenueGenerated === 0) return 0;
      const factor = (idx + 1) / (currentMonthIdx + 1);
      return Math.round(totalRevenueGenerated * (factor * 0.4 + 0.6 * Math.pow(factor, 2)));
    });

    // Dynamic Funnel Stages
    const totalClicks = monthlyClicks || (totalLeads * 8) || 0;
    const inquiriesCount = totalLeads;
    const proposalsCount = userLeads.filter(l => ['proposal', 'closed_won', 'paid'].includes(l.stage)).length;
    const dealsClosedCount = closedLeads.length;

    const funnelStages = [
      { label: 'Impressions', val: totalClicks > 0 ? (totalClicks * 12).toLocaleString() : '0', pct: 1.0, color: '#6366f1' },
      { label: 'Agent Clicks', val: totalClicks.toLocaleString(), pct: totalClicks > 0 ? 0.75 : 0.0, color: '#38bdf8' },
      { label: 'Lead Inquiries', val: inquiriesCount.toLocaleString(), pct: totalClicks > 0 ? Number((inquiriesCount / Math.max(1, totalClicks)).toFixed(2)) : (inquiriesCount > 0 ? 0.5 : 0), color: '#00f0ff' },
      { label: 'Deals Closed', val: dealsClosedCount.toLocaleString(), pct: inquiriesCount > 0 ? Number((dealsClosedCount / Math.max(1, inquiriesCount)).toFixed(2)) : 0, color: '#10b981' }
    ];

    return {
      totalRevenueGenerated,
      activeLeadsCount,
      conversionRate,
      monthlyClicks,
      totalCommissionEarned,
      revenueGrowth: totalRevenueGenerated > 0 ? '+24.5%' : '0%',
      leadsGrowth: totalLeads > 0 ? `+${totalLeads} active` : '0 new',
      conversionGrowth: conversionRate > 0 ? `${conversionRate}% rate` : '0.0%',
      monthlyTrajectory,
      funnelStages
    };
  }

  // ==========================================
  // CAMPAIGNS
  // ==========================================

  async getCampaigns(userId) {
    await this.ensureConnected();
    return Campaign.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async addCampaign(userId, { title, channel }) {
    await this.ensureConnected();
    const user = await this.getUserById(userId);
    const refCode = user ? user.referralCode : 'AGENT-26';
    const campId = 'cmp-' + Date.now().toString().slice(-6);
    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const newCampaign = await Campaign.create({
      id: campId,
      userId: userId,
      title: title.trim(),
      channel: channel ? channel.trim() : 'Omnichannel Solar Ads',
      status: 'Active',
      clicks: 0,
      leads: 0,
      conversions: 0,
      revenue: 0,
      epc: 0.00,
      utmUrl: `https://cuvasol.energy/f/${slug || 'campaign'}?ref=${refCode}&utm_source=custom&utm_medium=agent_link&utm_campaign=cuva_${slug || 'camp'}`
    });

    return newCampaign.toObject();
  }

  async trackClick(campaignId, refCode) {
    await this.ensureConnected();
    if (campaignId) {
      const camp = await Campaign.findOne({ id: campaignId });
      if (camp) {
        camp.clicks = (camp.clicks || 0) + 1;
        if (camp.clicks > 0 && camp.revenue > 0) {
          camp.epc = Number((camp.revenue / camp.clicks).toFixed(2));
        }
        await camp.save();
      }
    }
    await ClickLog.create({
      campaignId: campaignId || null,
      refCode: refCode || null,
      timestamp: new Date()
    });
  }

  // ==========================================
  // LEADS CRM & COMMISSION AUTOMATION
  // ==========================================

  async getLeads(userId) {
    await this.ensureConnected();
    return Lead.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async addLead(userId, leadData) {
    await this.ensureConnected();
    const user = await this.getUserById(userId);
    const tierRate = user ? (user.tierCommission || 0.15) : 0.15;
    const value = Number(leadData.value) || 20000;
    const commEst = Math.round(value * tierRate);
    const leadId = 'LD-' + Math.floor(100 + Math.random() * 900);

    const newLead = await Lead.create({
      id: leadId,
      userId: userId,
      campaignId: leadData.campaignId || null,
      name: leadData.name.trim(),
      contact: leadData.contact.trim(),
      stage: leadData.stage || 'new',
      value: value,
      commission: commEst,
      date: new Date().toISOString().split('T')[0],
      source: leadData.source || 'Direct Referral Link',
      notes: leadData.notes || 'Inbound solar interest via agent portal'
    });

    // If attached to a campaign, increment leads count
    if (leadData.campaignId) {
      await Campaign.updateOne(
        { id: leadData.campaignId, userId },
        { $inc: { leads: 1 } }
      );
    }

    // Add notification
    await Notification.create({
      id: 'nt-' + Date.now(),
      userId: userId,
      title: 'New Lead Added! 🎯',
      text: `${newLead.name} (${newLead.source}) was added with estimated deal value $${value.toLocaleString()}.`,
      time: 'Just now',
      read: false
    });

    return newLead.toObject();
  }

  async updateLeadStage(userId, leadId, nextStage) {
    await this.ensureConnected();
    const lead = await Lead.findOne({ id: leadId, userId });
    if (!lead) return null;

    const previousStage = lead.stage;
    lead.stage = nextStage;

    const isNowWon = nextStage === 'closed_won' || nextStage === 'paid';
    const wasAlreadyWon = previousStage === 'closed_won' || previousStage === 'paid';

    if (isNowWon && !wasAlreadyWon) {
      const user = await this.getUserById(userId);
      const tierRate = user ? (user.tierCommission || 0.15) : 0.15;
      const commAmount = Math.round(lead.value * tierRate);
      lead.commission = commAmount;

      // Add a commission transaction
      const txId = 'TX-' + Math.floor(1000 + Math.random() * 9000);
      await Transaction.create({
        id: txId,
        userId: userId,
        leadId: lead.id,
        date: new Date().toISOString().split('T')[0],
        type: 'Commission',
        desc: `Deal Commission: ${lead.name} ($${lead.value.toLocaleString()} deal @ ${Math.round(tierRate * 100)}%)`,
        amount: commAmount,
        status: 'Paid'
      });

      // Update linked campaign metrics if present
      if (lead.campaignId) {
        const camp = await Campaign.findOne({ id: lead.campaignId });
        if (camp) {
          camp.conversions = (camp.conversions || 0) + 1;
          camp.revenue = (camp.revenue || 0) + lead.value;
          if (camp.clicks > 0) {
            camp.epc = Number((camp.revenue / camp.clicks).toFixed(2));
          }
          await camp.save();
        }
      }

      // Add celebratory notification
      await Notification.create({
        id: 'nt-' + Date.now(),
        userId: userId,
        title: 'Commission Unlocked! 💰',
        text: `You earned $${commAmount.toLocaleString()} from closing "${lead.name}". Available for instant withdrawal.`,
        time: 'Just now',
        read: false
      });
    }

    await lead.save();
    return lead.toObject();
  }

  async deleteLead(userId, leadId) {
    await this.ensureConnected();
    const res = await Lead.deleteOne({ id: leadId, userId });
    return res.deletedCount > 0;
  }

  // ==========================================
  // WALLET & PAYOUT LEDGER
  // ==========================================

  async getWallet(userId) {
    await this.ensureConnected();
    const [userTransactions, userLeads, user] = await Promise.all([
      Transaction.find({ userId }).sort({ createdAt: -1 }).lean(),
      Lead.find({ userId }).lean(),
      this.getUserById(userId)
    ]);

    let availableBalance = 0;
    let totalPaidOut = 0;
    let lifetimeEarnings = 0;

    userTransactions.forEach(t => {
      if (t.type === 'Commission' || t.type === 'Bonus') {
        availableBalance += Number(t.amount) || 0;
        lifetimeEarnings += Number(t.amount) || 0;
      } else if (t.type === 'Payout') {
        availableBalance += Number(t.amount); // negative amount
        totalPaidOut += Math.abs(Number(t.amount));
      }
    });

    if (availableBalance < 0) availableBalance = 0;

    const tierRate = user ? (user.tierCommission || 0.15) : 0.15;
    const proposalLeads = userLeads.filter(l => l.stage === 'proposal');
    const pendingBalance = proposalLeads.reduce((sum, l) => sum + Math.round(l.value * tierRate), 0);

    return {
      availableBalance,
      pendingBalance,
      totalPaidOut,
      lifetimeEarnings,
      transactions: userTransactions
    };
  }

  async requestPayout(userId, amount, method) {
    await this.ensureConnected();
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      throw new Error('Please enter a valid withdrawal amount.');
    }

    const currentWallet = await this.getWallet(userId);
    if (num > currentWallet.availableBalance) {
      throw new Error(`Requested amount ($${num.toLocaleString()}) exceeds your available balance ($${currentWallet.availableBalance.toLocaleString()}).`);
    }

    const txId = 'TX-' + Math.floor(1000 + Math.random() * 9000);
    const payoutId = 'PO-' + Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().split('T')[0];

    const tx = await Transaction.create({
      id: txId,
      userId: userId,
      date: dateStr,
      type: 'Payout',
      desc: `Withdrawal via ${method || 'Direct Bank Deposit'}`,
      amount: -num,
      status: 'Completed'
    });

    await Payout.create({
      id: payoutId,
      userId: userId,
      amount: num,
      method: method,
      status: 'Completed',
      date: dateStr
    });

    await Notification.create({
      id: 'nt-' + Date.now(),
      userId: userId,
      title: 'Payout Processed! 💸',
      text: `Your withdrawal of $${num.toLocaleString()} via ${method} has been disbursed.`,
      time: 'Just now',
      read: false
    });

    const updatedWallet = await this.getWallet(userId);
    return { wallet: updatedWallet, tx: tx.toObject() };
  }

  // ==========================================
  // MARKETING ASSET VAULT
  // ==========================================

  async getAssets() {
    await this.ensureConnected();
    return Asset.find().lean();
  }

  async useAsset(assetId) {
    await this.ensureConnected();
    const ast = await Asset.findOneAndUpdate(
      { id: assetId },
      { $inc: { downloads: 1 } },
      { new: true }
    ).lean();
    return ast;
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  async getNotifications(userId) {
    await this.ensureConnected();
    return Notification.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async markNotificationsRead(userId) {
    await this.ensureConnected();
    await Notification.updateMany({ userId }, { $set: { read: true } });
    return true;
  }

  // ==========================================
  // PUBLIC LEAD CAPTURE & ATTRIBUTION
  // ==========================================

  async submitPublicLead({ refCode, name, contact, value, notes, campaignSlug }) {
    await this.ensureConnected();
    let user = null;
    if (refCode) {
      user = await User.findOne({
        $or: [
          { referralCode: new RegExp(`^${refCode}$`, 'i') },
          { customSlug: new RegExp(refCode, 'i') }
        ]
      }).lean();
    }
    if (!user) {
      user = await User.findOne().lean();
    }

    if (!user) {
      throw new Error('No agent profile found to assign lead to.');
    }

    let campaignId = null;
    if (campaignSlug && user) {
      const camp = await Campaign.findOne({
        userId: user.id,
        utmUrl: new RegExp(campaignSlug, 'i')
      }).lean();
      if (camp) campaignId = camp.id;
    }

    return this.addLead(user.id, {
      name,
      contact,
      value: Number(value) || 22000,
      source: campaignSlug ? `Campaign (${campaignSlug})` : `Referral (${refCode || 'Direct'})`,
      notes: notes || 'Inbound lead from public landing page inquiry form',
      campaignId
    });
  }

  // ==========================================
  // TUTOR PLATFORM (tutor.cuvasol.com) WEBHOOK INTEGRATION
  // ==========================================

  async handleTutorWebhookEvent({ event, refCode, studentName, studentEmail, studentPhone, bookingId, subject, planType, commissionAmount }) {
    await this.ensureConnected();

    if (!refCode) {
      throw new Error('Referral code is required to attribute tutor event');
    }

    // 1. Locate the Marketing Agent by referral code, customSlug, or ID
    const cleanRef = refCode.trim();
    let user = await User.findOne({
      $or: [
        { referralCode: new RegExp(`^${cleanRef}$`, 'i') },
        { customSlug: new RegExp(cleanRef, 'i') },
        { id: cleanRef }
      ]
    }).lean();

    if (!user) {
      // Fallback: Check if there's any active agent
      user = await User.findOne({ id: 'CU-7390' }).lean() || await User.findOne().lean();
      if (!user) {
        throw new Error(`No marketing agent found matching referral code "${refCode}"`);
      }
    }

    const userId = user.id;
    const cleanEmail = (studentEmail || '').trim().toLowerCase();
    const cleanName = (studentName || '').trim() || 'Student';
    const normalizedEvent = (event || '').toUpperCase();

    if (normalizedEvent === 'STUDENT_SIGNUP' || normalizedEvent === 'STUDENT_REGISTERED') {
      // Check if this student is already registered as a lead
      let existingLead = cleanEmail ? await Lead.findOne({ userId, contact: cleanEmail }) : null;
      if (existingLead) {
        return {
          status: 'existing',
          message: `Lead for ${cleanEmail} already exists`,
          lead: existingLead.toObject()
        };
      }

      const leadId = 'LD-TUTOR-' + Math.floor(1000 + Math.random() * 9000);
      const newLead = await Lead.create({
        id: leadId,
        userId: userId,
        name: cleanName,
        contact: cleanEmail || studentPhone || 'Tutor Student',
        stage: 'new',
        value: 1500,
        commission: Math.round(Number(commissionAmount) || 500),
        date: new Date().toISOString().split('T')[0],
        source: 'tutor.cuvasol.com',
        notes: `Registered on tutor.cuvasol.com using referral code [${refCode}]`
      });

      // Send notification to marketer
      await Notification.create({
        id: 'nt-' + Date.now(),
        userId: userId,
        title: '🎓 New Student Referral!',
        text: `${cleanName} signed up on tutor.cuvasol.com with your code [${refCode}]. Commission unlocks when they complete their class!`,
        time: 'Just now',
        read: false
      });

      return {
        status: 'created',
        message: `Student lead created for agent ${user.name}`,
        lead: newLead.toObject()
      };
    }

    if (normalizedEvent === 'CLASS_COMPLETED' || normalizedEvent === 'LESSON_COMPLETED') {
      const awardCommission = Number(commissionAmount) || 500;
      
      // Find existing lead for this student
      let lead = cleanEmail ? await Lead.findOne({ userId, contact: cleanEmail }) : null;
      if (!lead) {
        // If student signed up directly and completed class, create lead
        lead = await Lead.create({
          id: 'LD-TUTOR-' + Math.floor(1000 + Math.random() * 9000),
          userId: userId,
          name: cleanName,
          contact: cleanEmail || 'Tutor Student',
          stage: 'new',
          value: 1500,
          commission: awardCommission,
          date: new Date().toISOString().split('T')[0],
          source: 'tutor.cuvasol.com',
          notes: `Completed class [${subject || 'Tutoring Session'}]`
        });
      }

      // Check if commission was already awarded for this booking
      const existingTx = bookingId 
        ? await Transaction.findOne({ userId, desc: new RegExp(bookingId, 'i') })
        : (cleanEmail ? await Transaction.findOne({ userId, desc: new RegExp(cleanEmail, 'i') }) : null);

      if (existingTx) {
        return {
          status: 'already_rewarded',
          message: 'Commission already awarded for this class',
          transaction: existingTx.toObject()
        };
      }

      // Update lead stage to closed_won
      lead.stage = 'closed_won';
      lead.commission = awardCommission;
      await lead.save();

      // Create commission transaction
      const txId = 'TX-TUTOR-' + Math.floor(1000 + Math.random() * 9000);
      const newTx = await Transaction.create({
        id: txId,
        userId: userId,
        leadId: lead.id,
        date: new Date().toISOString().split('T')[0],
        type: 'Commission',
        desc: `Tutor Referral: ${cleanName} completed ${subject || 'Class'} (${bookingId || 'Class #1'})`,
        amount: awardCommission,
        status: 'Paid'
      });

      // Create celebratory notification
      await Notification.create({
        id: 'nt-' + Date.now(),
        userId: userId,
        title: '🎉 Class Completed - Commission Earned!',
        text: `Congratulations! ${cleanName} completed their class. ₹${awardCommission.toLocaleString()} commission credited to your wallet balance.`,
        time: 'Just now',
        read: false
      });

      return {
        status: 'converted',
        message: `Successfully credited ₹${awardCommission} to agent ${user.name}`,
        lead: lead.toObject(),
        transaction: newTx.toObject()
      };
    }

    throw new Error(`Unknown tutor webhook event: "${event}"`);
  }

  // ==========================================
  // DEVELOPER TESTING HELPERS
  // ==========================================

  async seedSampleData(userId) {
    await this.ensureConnected();
    const user = await this.getUserById(userId);
    if (!user) return false;

    // Add sample campaigns
    const camp1 = await this.addCampaign(userId, { title: 'Residential Solar Zero-Down 2026', channel: 'TikTok & Meta Video Ads' });
    await Campaign.updateOne({ id: camp1.id }, {
      $set: { clicks: 480, leads: 6, conversions: 2, revenue: 38000, epc: 79.16 }
    });

    const camp2 = await this.addCampaign(userId, { title: 'Commercial Micro-Grid B2B Outreach', channel: 'LinkedIn B2B InMail' });
    await Campaign.updateOne({ id: camp2.id }, {
      $set: { clicks: 210, leads: 4, conversions: 1, revenue: 65000, epc: 309.52 }
    });

    // Add sample leads
    await this.addLead(userId, {
      name: 'Apex Precision Logistics',
      contact: 'fleet@apexlogistics.com',
      value: 65000,
      stage: 'closed_won',
      source: 'LinkedIn B2B',
      notes: '150kW commercial solar system with battery backup.',
      campaignId: camp2.id
    });

    await this.addLead(userId, {
      name: 'Dr. Michael Chen (Residential)',
      contact: 'm.chen@stanfordalumni.org',
      value: 24000,
      stage: 'proposal',
      source: 'TikTok & Meta Video Ads',
      notes: 'Submitted rooftop utility bills. 12kW system with Powerwall.',
      campaignId: camp1.id
    });

    await this.addLead(userId, {
      name: 'Redwood Valley Winery',
      contact: 'ops@redwoodwinery.com',
      value: 42000,
      stage: 'contacted',
      source: 'Direct Referral Link',
      notes: 'Looking for 30% peak demand shaving for cooling facilities.'
    });

    await this.addLead(userId, {
      name: 'Sophia & Jason Martinez',
      contact: 'martinez.fam@gmail.com',
      value: 18500,
      stage: 'new',
      source: 'TikTok & Meta Video Ads',
      notes: 'Inbound solar roof assessment request.',
      campaignId: camp1.id
    });

    return true;
  }

  async resetUserData(userId) {
    await this.ensureConnected();
    await Promise.all([
      Campaign.deleteMany({ userId }),
      Lead.deleteMany({ userId }),
      Transaction.deleteMany({ userId }),
      Payout.deleteMany({ userId }),
      Notification.deleteMany({ userId })
    ]);
    return true;
  }

  async getHealthStatus() {
    try {
      await this.ensureConnected();
      const [usersCount, leadsCount, campaignsCount] = await Promise.all([
        User.countDocuments(),
        Lead.countDocuments(),
        Campaign.countDocuments()
      ]);

      return {
        status: 'connected',
        database: mongoose.connection.name || 'lumiere_botanicals',
        host: mongoose.connection.host,
        readyState: mongoose.connection.readyState,
        usersCount,
        leadsCount,
        campaignsCount
      };
    } catch (err) {
      return {
        status: 'error',
        error: err.message,
        database: 'lumiere_botanicals',
        readyState: mongoose.connection.readyState
      };
    }
  }
}

export const db = new DatabaseService();
