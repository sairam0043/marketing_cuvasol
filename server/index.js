/* ==========================================================================
   CUVASOL AGENT CLOUD - NODE.JS EXPRESS BACKEND (server/index.js)
   ========================================================================== */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- AUTHENTICATION MIDDLEWARE ---
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
    let token = null;

    if (authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7).trim();
      } else {
        token = authHeader.trim();
      }
    }

    if (!token) {
      // If no token is provided, check if demo user exists as fallback for dev convenience
      const demoUser = await db.getUserById('CU-7390');
      if (demoUser) {
        req.user = demoUser;
        return next();
      }
      return res.status(401).json({ error: 'Authentication required. Please sign in.' });
    }

    const user = await db.getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('requireAuth error:', err);
    res.status(500).json({ error: 'Internal authentication error' });
  }
}

// --- ROOT & HEALTH ENDPOINTS ---
app.get('/', async (req, res) => {
  const health = await db.getHealthStatus();
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cuvasol Node.js API Server - MongoDB Atlas</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: #060913;
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
        }
        .card {
          background: rgba(16, 24, 44, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 20px;
          padding: 40px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.2);
          text-align: center;
        }
        h1 {
          color: #00f0ff;
          margin-bottom: 8px;
          font-size: 26px;
        }
        .badge {
          display: inline-block;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 4px 14px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .db-info {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #38bdf8;
          word-break: break-all;
        }
        p {
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 25px;
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #00f0ff 0%, #6366f1 100%);
          color: #060913;
          font-weight: 700;
          padding: 14px 28px;
          border-radius: 9999px;
          text-decoration: none;
          font-size: 16px;
          box-shadow: 0 4px 18px rgba(0, 240, 255, 0.4);
          margin-bottom: 10px;
          transition: transform 0.2s ease;
        }
        .btn:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>⚡ Cuvasol Node.js API Server</h1>
        <div class="badge">● ONLINE • MongoDB Database: ${health.database || 'lumiere_botanicals'}</div>
        <div class="db-info">
          🍃 Connected: <strong>${health.status === 'connected' ? 'MongoDB Atlas Cluster (lumiere_botanicals)' : 'Connecting...'}</strong><br/>
          📊 Agents: <strong>${health.usersCount ?? 0}</strong> | 🎯 Leads: <strong>${health.leadsCount ?? 0}</strong> | ⚡ Campaigns: <strong>${health.campaignsCount ?? 0}</strong>
        </div>
        <p>The backend REST API server is running smoothly connected directly to MongoDB Atlas database.</p>
        <a href="http://localhost:3000" class="btn">🚀 Open React Frontend App (Port 3000)</a>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/health', async (req, res) => {
  const health = await db.getHealthStatus();
  res.json({
    status: 'ok',
    database: health,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/db-status', async (req, res) => {
  const health = await db.getHealthStatus();
  res.json(health);
});

// --- AUTHENTICATION ROUTES ---

app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
    let token = null;

    if (authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7).trim();
      } else {
        token = authHeader.trim();
      }
    }

    if (!token) {
      return res.json({ user: null, isAuthenticated: false });
    }

    const user = await db.getUserByToken(token);
    if (!user) {
      return res.json({ user: null, isAuthenticated: false });
    }

    res.json({ user: db.sanitizeUser(user), isAuthenticated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await db.login(email, password);
    res.json({ success: true, user: result.user, token: result.token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.post('/api/auth/demo-login', async (req, res) => {
  try {
    const result = await db.demoLogin();
    res.json({ success: true, user: result.user, token: result.token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to authenticate demo agent: ' + err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, referralCodeUsed, referralCode, channels, payoutMethod } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const result = await db.register({
      name,
      email,
      password,
      referralCodeUsed: referralCodeUsed || referralCode,
      channels,
      payoutMethod
    });
    res.json({ success: true, user: result.user, token: result.token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- REFERRALS SYSTEM ---
app.get('/api/referrals', requireAuth, async (req, res) => {
  try {
    const data = await db.getReferrals(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/profile', requireAuth, async (req, res) => {
  try {
    const updatedUser = await db.updateProfile(req.user.id, req.body);
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

// --- DASHBOARD METRICS & KPIS ---
app.get('/api/kpis', requireAuth, async (req, res) => {
  try {
    const kpis = await db.getKPIs(req.user.id);
    res.json(kpis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CAMPAIGNS ---
app.get('/api/campaigns', requireAuth, async (req, res) => {
  try {
    const campaigns = await db.getCampaigns(req.user.id);
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/campaigns', requireAuth, async (req, res) => {
  const { title, channel } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Campaign title is required' });
  }
  try {
    const campaign = await db.addCampaign(req.user.id, { title, channel });
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LEADS CRM PIPELINE ---
app.get('/api/leads', requireAuth, async (req, res) => {
  try {
    const leads = await db.getLeads(req.user.id);
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leads', requireAuth, async (req, res) => {
  const { name, contact, value, source, notes, campaignId } = req.body;
  if (!name || !contact) {
    return res.status(400).json({ error: 'Lead name and contact are required' });
  }
  try {
    const lead = await db.addLead(req.user.id, { name, contact, value, source, notes, campaignId });
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/leads/:id/stage', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;
  if (!stage) {
    return res.status(400).json({ error: 'Stage is required' });
  }
  try {
    const lead = await db.updateLeadStage(req.user.id, id, stage);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/leads/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const success = await db.deleteLead(req.user.id, id);
    if (!success) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- WALLET & COMMISSION LEDGER ---
app.get('/api/wallet', requireAuth, async (req, res) => {
  try {
    const wallet = await db.getWallet(req.user.id);
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/wallet/payout', requireAuth, async (req, res) => {
  const { amount, method } = req.body;
  try {
    const result = await db.requestPayout(req.user.id, amount, method);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- MARKETING ASSET VAULT ---
app.get('/api/assets', async (req, res) => {
  try {
    const assets = await db.getAssets();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/assets/:id/use', async (req, res) => {
  const { id } = req.params;
  try {
    const asset = await db.useAsset(id);
    res.json(asset || { success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NOTIFICATIONS ---
app.get('/api/notifications', requireAuth, async (req, res) => {
  try {
    const notifs = await db.getNotifications(req.user.id);
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications/read', requireAuth, async (req, res) => {
  try {
    await db.markNotificationsRead(req.user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PUBLIC INQUIRY & TRACKING ---
app.post('/api/public/lead', async (req, res) => {
  const { refCode, name, contact, value, notes, campaignSlug } = req.body;
  if (!name || !contact) {
    return res.status(400).json({ error: 'Name and contact are required' });
  }
  try {
    const lead = await db.submitPublicLead({ refCode, name, contact, value, notes, campaignSlug });
    res.status(201).json({ success: true, leadId: lead.id, message: 'Consultation request received successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/track/click', async (req, res) => {
  const { campaignId, ref } = req.query;
  if (campaignId || ref) {
    try {
      await db.trackClick(campaignId, ref);
    } catch (err) {
      console.error('trackClick error:', err);
    }
  }
  res.json({ success: true });
});

// --- TUTOR PLATFORM (tutor.cuvasol.com) WEBHOOK RECEIVER ---
app.get('/api/webhooks/tutor-event', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Cuvasol Marketing Webhook Receiver',
    supportedEvents: ['STUDENT_SIGNUP', 'CLASS_COMPLETED'],
    timestamp: new Date().toISOString()
  });
});

app.post('/api/webhooks/tutor-event', async (req, res) => {
  try {
    const { event, refCode, studentName, studentEmail, studentPhone, bookingId, subject, planType, commissionAmount } = req.body;

    if (!refCode) {
      return res.status(400).json({ error: 'Referral code (refCode) is required' });
    }
    if (!event) {
      return res.status(400).json({ error: 'Event type (event) is required' });
    }

    const result = await db.handleTutorWebhookEvent({
      event,
      refCode,
      studentName,
      studentEmail,
      studentPhone,
      bookingId,
      subject,
      planType,
      commissionAmount
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[Tutor Webhook Error]:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// --- DEVELOPER / TESTING TOOLS ---
app.post('/api/agent/seed-data', requireAuth, async (req, res) => {
  try {
    await db.seedSampleData(req.user.id);
    res.json({ success: true, message: 'Sample test data loaded successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/agent/reset-data', requireAuth, async (req, res) => {
  try {
    await db.resetUserData(req.user.id);
    res.json({ success: true, message: 'Agent data reset to clean initial state.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (!process.env.VERCEL) {
  const HOST = process.env.HOST || '127.0.0.1';
  const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Cuvasol Node.js API Server running on http://${HOST}:${PORT}`);
    // Trigger initial DB connection
    db.connect().catch(err => {
      console.error('Initial MongoDB connection attempt error:', err.message);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n⚠️  Port ${PORT} is currently in use by another running instance.`);
      console.error(`💡 Tip: Close any existing terminal running 'npm run dev' or kill the existing node process, then try again.\n`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

export { app };
export default app;
