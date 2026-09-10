/* ==========================================================================
   CUVASOL AGENT CLOUD - NODE.JS PERSISTENT DATABASE (server/db.js)
   ========================================================================== */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'store.json')
  : path.join(__dirname, 'data', 'store.json');

const BUNDLED_DB_FILE = path.join(__dirname, 'data', 'store.json');

// Helper to hash password with salt
function hashPassword(password, salt = 'cuvasol_salt_2026') {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

class Database {
  constructor() {
    this.ensureDbExists();
    this.data = this.loadData();
  }

  ensureDbExists() {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      if (fs.existsSync(BUNDLED_DB_FILE)) {
        try {
          const bundledContent = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
          fs.writeFileSync(DB_FILE, bundledContent, 'utf-8');
          return;
        } catch (e) {
          console.warn('Could not copy bundled DB file:', e);
        }
      }
      const initial = {
        users: [],
        campaigns: [],
        leads: [],
        transactions: [],
        payouts: [],
        notifications: [],
        assets: [],
        clickLogs: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    }
  }

  loadData() {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading database file, using fallback:', err);
      return {
        users: [],
        campaigns: [],
        leads: [],
        transactions: [],
        payouts: [],
        notifications: [],
        assets: [],
        clickLogs: []
      };
    }
  }

  saveData() {
    try {
      const tempPath = DB_FILE + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  // ==========================================
  // AUTHENTICATION & USERS
  // ==========================================

  getUserByToken(token) {
    if (!token) return null;
    return this.data.users.find(u => u.token === token) || null;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id) || null;
  }

  sanitizeUser(user) {
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  register({ name, email, password, channels, payoutMethod }) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = this.data.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('An agent account with this email address already exists.');
    }

    const userId = 'CU-' + Math.floor(1000 + Math.random() * 9000);
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AG';
    const cleanName = name.trim();
    const referralCode = cleanName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) + '-26';
    const slugName = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const token = 'tok_' + crypto.randomBytes(24).toString('hex');
    const pwdHash = hashPassword(password || 'password123');

    const newUser = {
      id: userId,
      email: normalizedEmail,
      passwordHash: pwdHash,
      name: cleanName,
      tier: 'Gold Agent',
      tierCommission: 0.12,
      avatar: initials,
      joinedDate: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      referralCode: referralCode,
      customSlug: `cuvasol.energy/a/${slugName}`,
      payoutMethod: payoutMethod || 'Direct Bank Deposit (ACH)',
      niche: channels && channels.length ? channels : ['Social Media Ads', 'Direct Outreach'],
      token: token,
      notificationSettings: {
        emailLeadAlerts: true,
        smsPayoutAlerts: true,
        weeklyAdDrops: true
      }
    };

    this.data.users.push(newUser);

    // Add welcome notification
    this.data.notifications.unshift({
      id: 'nt-' + Date.now(),
      userId: userId,
      title: 'Welcome to Cuvasol Agent Cloud! ⚡',
      text: `Your referral code is ${referralCode}. Launch your first campaign to start earning.`,
      time: 'Just now',
      read: false,
      createdAt: new Date().toISOString()
    });

    this.saveData();
    return { user: this.sanitizeUser(newUser), token };
  }

  login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.data.users.find(u => u.email.toLowerCase() === normalizedEmail);
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
    user.token = 'tok_' + crypto.randomBytes(24).toString('hex');
    this.saveData();

    return { user: this.sanitizeUser(user), token: user.token };
  }

  demoLogin() {
    let demoUser = this.data.users.find(u => u.id === 'CU-7390' || u.email === 'demo@cuvasol.energy');
    if (!demoUser) {
      // Re-create demo user if somehow deleted
      demoUser = {
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
      };
      this.data.users.push(demoUser);
    }

    demoUser.token = 'tok_demo_' + crypto.randomBytes(16).toString('hex');
    this.saveData();

    return { user: this.sanitizeUser(demoUser), token: demoUser.token };
  }

  updateProfile(userId, updates) {
    const user = this.data.users.find(u => u.id === userId);
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
      user.notificationSettings = { ...user.notificationSettings, ...updates.notificationSettings };
    }

    this.saveData();
    return this.sanitizeUser(user);
  }

  // ==========================================
  // DASHBOARD KPIS & DYNAMIC CALCULATIONS
  // ==========================================

  getKPIs(userId) {
    const userLeads = this.data.leads.filter(l => l.userId === userId);
    const userCampaigns = this.data.campaigns.filter(c => c.userId === userId);
    const userTransactions = this.data.transactions.filter(t => t.userId === userId);

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
    // Build array based on current deals
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const monthlyTrajectory = months.map((m, idx) => {
      if (idx > currentMonthIdx) return 0;
      if (totalRevenueGenerated === 0) return 0;
      // Distribute revenue curve up to current month
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

  getCampaigns(userId) {
    return this.data.campaigns.filter(c => c.userId === userId);
  }

  addCampaign(userId, { title, channel }) {
    const user = this.getUserById(userId);
    const refCode = user ? user.referralCode : 'AGENT-26';
    const campId = 'cmp-' + Date.now().toString().slice(-6);
    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const newCampaign = {
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
      utmUrl: `https://cuvasol.energy/f/${slug || 'campaign'}?ref=${refCode}&utm_source=custom&utm_medium=agent_link&utm_campaign=cuva_${slug || 'camp'}`,
      createdAt: new Date().toISOString()
    };

    this.data.campaigns.unshift(newCampaign);
    this.saveData();
    return newCampaign;
  }

  trackClick(campaignId, refCode) {
    const camp = this.data.campaigns.find(c => c.id === campaignId);
    if (camp) {
      camp.clicks = (camp.clicks || 0) + 1;
      if (camp.clicks > 0 && camp.revenue > 0) {
        camp.epc = Number((camp.revenue / camp.clicks).toFixed(2));
      }
    }
    this.data.clickLogs.push({
      campaignId,
      refCode,
      timestamp: new Date().toISOString()
    });
    this.saveData();
  }

  // ==========================================
  // LEADS CRM & COMMISSION AUTOMATION
  // ==========================================

  getLeads(userId) {
    return this.data.leads.filter(l => l.userId === userId);
  }

  addLead(userId, leadData) {
    const user = this.getUserById(userId);
    const tierRate = user ? (user.tierCommission || 0.15) : 0.15;
    const value = Number(leadData.value) || 20000;
    const commEst = Math.round(value * tierRate);
    const leadId = 'LD-' + Math.floor(100 + Math.random() * 900);

    const newLead = {
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
      notes: leadData.notes || 'Inbound solar interest via agent portal',
      createdAt: new Date().toISOString()
    };

    this.data.leads.unshift(newLead);

    // If attached to a campaign, increment leads count
    if (leadData.campaignId) {
      const camp = this.data.campaigns.find(c => c.id === leadData.campaignId && c.userId === userId);
      if (camp) camp.leads = (camp.leads || 0) + 1;
    }

    // Add notification
    this.data.notifications.unshift({
      id: 'nt-' + Date.now(),
      userId: userId,
      title: 'New Lead Added! 🎯',
      text: `${newLead.name} (${newLead.source}) was added with estimated deal value $${value.toLocaleString()}.`,
      time: 'Just now',
      read: false,
      createdAt: new Date().toISOString()
    });

    this.saveData();
    return newLead;
  }

  updateLeadStage(userId, leadId, nextStage) {
    const lead = this.data.leads.find(l => l.id === leadId && l.userId === userId);
    if (!lead) return null;

    const previousStage = lead.stage;
    lead.stage = nextStage;

    // Check if transitioning to closed_won or paid
    const isNowWon = nextStage === 'closed_won' || nextStage === 'paid';
    const wasAlreadyWon = previousStage === 'closed_won' || previousStage === 'paid';

    if (isNowWon && !wasAlreadyWon) {
      const user = this.getUserById(userId);
      const tierRate = user ? (user.tierCommission || 0.15) : 0.15;
      const commAmount = Math.round(lead.value * tierRate);
      lead.commission = commAmount;

      // Add a commission transaction
      const txId = 'TX-' + Math.floor(1000 + Math.random() * 9000);
      this.data.transactions.unshift({
        id: txId,
        userId: userId,
        leadId: lead.id,
        date: new Date().toISOString().split('T')[0],
        type: 'Commission',
        desc: `Deal Commission: ${lead.name} ($${lead.value.toLocaleString()} deal @ ${Math.round(tierRate * 100)}%)`,
        amount: commAmount,
        status: 'Paid',
        createdAt: new Date().toISOString()
      });

      // Update linked campaign metrics if present
      if (lead.campaignId) {
        const camp = this.data.campaigns.find(c => c.id === lead.campaignId);
        if (camp) {
          camp.conversions = (camp.conversions || 0) + 1;
          camp.revenue = (camp.revenue || 0) + lead.value;
          if (camp.clicks > 0) {
            camp.epc = Number((camp.revenue / camp.clicks).toFixed(2));
          }
        }
      }

      // Add celebratory notification
      this.data.notifications.unshift({
        id: 'nt-' + Date.now(),
        userId: userId,
        title: 'Commission Unlocked! 💰',
        text: `You earned $${commAmount.toLocaleString()} from closing "${lead.name}". Available for instant withdrawal.`,
        time: 'Just now',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    this.saveData();
    return lead;
  }

  deleteLead(userId, leadId) {
    const idx = this.data.leads.findIndex(l => l.id === leadId && l.userId === userId);
    if (idx !== -1) {
      this.data.leads.splice(idx, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  // ==========================================
  // WALLET & PAYOUT LEDGER
  // ==========================================

  getWallet(userId) {
    const userTransactions = this.data.transactions.filter(t => t.userId === userId);
    const userLeads = this.data.leads.filter(l => l.userId === userId);

    // Available balance = Sum of positive transactions (Commission, Bonus) + Payout deductions (negative)
    let availableBalance = 0;
    let totalPaidOut = 0;
    let lifetimeEarnings = 0;

    userTransactions.forEach(t => {
      if (t.type === 'Commission' || t.type === 'Bonus') {
        availableBalance += Number(t.amount) || 0;
        lifetimeEarnings += Number(t.amount) || 0;
      } else if (t.type === 'Payout') {
        availableBalance += Number(t.amount); // negative number
        totalPaidOut += Math.abs(Number(t.amount));
      }
    });

    if (availableBalance < 0) availableBalance = 0;

    // Pending in pipeline = estimated commissions for leads in 'proposal'
    const user = this.getUserById(userId);
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

  requestPayout(userId, amount, method) {
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      throw new Error('Please enter a valid withdrawal amount.');
    }

    const currentWallet = this.getWallet(userId);
    if (num > currentWallet.availableBalance) {
      throw new Error(`Requested amount ($${num.toLocaleString()}) exceeds your available balance ($${currentWallet.availableBalance.toLocaleString()}).`);
    }

    const txId = 'TX-' + Math.floor(1000 + Math.random() * 9000);
    const payoutId = 'PO-' + Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().split('T')[0];

    // Add negative transaction
    const tx = {
      id: txId,
      userId: userId,
      date: dateStr,
      type: 'Payout',
      desc: `Withdrawal via ${method || 'Direct Bank Deposit'}`,
      amount: -num,
      status: 'Completed',
      createdAt: new Date().toISOString()
    };
    this.data.transactions.unshift(tx);

    this.data.payouts.unshift({
      id: payoutId,
      userId: userId,
      amount: num,
      method: method,
      status: 'Completed',
      date: dateStr,
      createdAt: new Date().toISOString()
    });

    this.data.notifications.unshift({
      id: 'nt-' + Date.now(),
      userId: userId,
      title: 'Payout Processed! 💸',
      text: `Your withdrawal of $${num.toLocaleString()} via ${method} has been disbursed.`,
      time: 'Just now',
      read: false,
      createdAt: new Date().toISOString()
    });

    this.saveData();
    return { wallet: this.getWallet(userId), tx };
  }

  // ==========================================
  // MARKETING ASSET VAULT
  // ==========================================

  getAssets() {
    return this.data.assets;
  }

  useAsset(assetId) {
    const ast = this.data.assets.find(a => a.id === assetId);
    if (ast) {
      ast.downloads = (ast.downloads || 0) + 1;
      this.saveData();
      return ast;
    }
    return null;
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  getNotifications(userId) {
    return this.data.notifications.filter(n => n.userId === userId);
  }

  markNotificationsRead(userId) {
    this.data.notifications.forEach(n => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    this.saveData();
    return true;
  }

  // ==========================================
  // PUBLIC LEAD CAPTURE & ATTRIBUTION
  // ==========================================

  submitPublicLead({ refCode, name, contact, value, notes, campaignSlug }) {
    // Find matching agent
    let user = null;
    if (refCode) {
      user = this.data.users.find(u =>
        u.referralCode?.toLowerCase() === refCode.toLowerCase() ||
        u.customSlug?.toLowerCase().includes(refCode.toLowerCase())
      );
    }
    if (!user) {
      // Fallback to default active agent
      user = this.data.users[0];
    }

    let campaignId = null;
    if (campaignSlug && user) {
      const camp = this.data.campaigns.find(c => c.userId === user.id && c.utmUrl?.includes(campaignSlug));
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
  // DEVELOPER TESTING HELPERS
  // ==========================================

  seedSampleData(userId) {
    const user = this.getUserById(userId);
    if (!user) return false;

    // Add sample campaigns
    const camp1 = this.addCampaign(userId, { title: 'Residential Solar Zero-Down 2026', channel: 'TikTok & Meta Video Ads' });
    camp1.clicks = 480;
    camp1.leads = 6;
    camp1.conversions = 2;
    camp1.revenue = 38000;
    camp1.epc = 79.16;

    const camp2 = this.addCampaign(userId, { title: 'Commercial Micro-Grid B2B Outreach', channel: 'LinkedIn B2B InMail' });
    camp2.clicks = 210;
    camp2.leads = 4;
    camp2.conversions = 1;
    camp2.revenue = 65000;
    camp2.epc = 309.52;

    // Add sample leads
    this.addLead(userId, {
      name: 'Apex Precision Logistics',
      contact: 'fleet@apexlogistics.com',
      value: 65000,
      stage: 'closed_won',
      source: 'LinkedIn B2B',
      notes: '150kW commercial solar system with battery backup.',
      campaignId: camp2.id
    });

    this.addLead(userId, {
      name: 'Dr. Michael Chen (Residential)',
      contact: 'm.chen@stanfordalumni.org',
      value: 24000,
      stage: 'proposal',
      source: 'TikTok & Meta Video Ads',
      notes: 'Submitted rooftop utility bills. 12kW system with Powerwall.',
      campaignId: camp1.id
    });

    this.addLead(userId, {
      name: 'Redwood Valley Winery',
      contact: 'ops@redwoodwinery.com',
      value: 42000,
      stage: 'contacted',
      source: 'Direct Referral Link',
      notes: 'Looking for 30% peak demand shaving for cooling facilities.'
    });

    this.addLead(userId, {
      name: 'Sophia & Jason Martinez',
      contact: 'martinez.fam@gmail.com',
      value: 18500,
      stage: 'new',
      source: 'TikTok & Meta Video Ads',
      notes: 'Inbound solar roof assessment request.',
      campaignId: camp1.id
    });

    this.saveData();
    return true;
  }

  resetUserData(userId) {
    this.data.campaigns = this.data.campaigns.filter(c => c.userId !== userId);
    this.data.leads = this.data.leads.filter(l => l.userId !== userId);
    this.data.transactions = this.data.transactions.filter(t => t.userId !== userId);
    this.data.payouts = this.data.payouts.filter(p => p.userId !== userId);
    this.data.notifications = this.data.notifications.filter(n => n.userId !== userId);
    this.saveData();
    return true;
  }
}

export const db = new Database();
