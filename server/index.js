/* ==========================================================================
   CUVASOL AGENT CLOUD - NODE.JS EXPRESS BACKEND (server/index.js)
   ========================================================================== */

import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- AUTHENTICATION MIDDLEWARE ---
function requireAuth(req, res, next) {
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
    const demoUser = db.getUserById('CU-7390') || db.data.users[0];
    if (demoUser) {
      req.user = demoUser;
      return next();
    }
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const user = db.getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }

  req.user = user;
  next();
}

// --- ROOT & HEALTH ENDPOINTS ---
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cuvasol Node.js API Server</title>
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
          margin-bottom: 30px;
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
        <div class="badge">● ONLINE • Persistent Database Engine</div>
        <p>The backend REST API server is running smoothly with persistent multi-user data storage and live attribution tracking.</p>
        <a href="http://localhost:3000" class="btn">🚀 Open React Frontend App (Port 3000)</a>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    usersCount: db.data.users.length,
    leadsCount: db.data.leads.length
  });
});

// --- AUTHENTICATION ROUTES ---

app.get('/api/auth/me', (req, res) => {
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

  const user = db.getUserByToken(token);
  if (!user) {
    return res.json({ user: null, isAuthenticated: false });
  }

  res.json({ user: db.sanitizeUser(user), isAuthenticated: true });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = db.login(email, password);
    res.json({ success: true, user: result.user, token: result.token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.post('/api/auth/demo-login', (req, res) => {
  try {
    const result = db.demoLogin();
    res.json({ success: true, user: result.user, token: result.token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to authenticate demo agent' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, channels, payoutMethod } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const result = db.register({ name, email, password, channels, payoutMethod });
    res.json({ success: true, user: result.user, token: result.token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/auth/profile', requireAuth, (req, res) => {
  try {
    const updatedUser = db.updateProfile(req.user.id, req.body);
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

// --- DASHBOARD METRICS & KPIS ---
app.get('/api/kpis', requireAuth, (req, res) => {
  res.json(db.getKPIs(req.user.id));
});

// --- CAMPAIGNS ---
app.get('/api/campaigns', requireAuth, (req, res) => {
  res.json(db.getCampaigns(req.user.id));
});

app.post('/api/campaigns', requireAuth, (req, res) => {
  const { title, channel } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Campaign title is required' });
  }
  const campaign = db.addCampaign(req.user.id, { title, channel });
  res.status(201).json(campaign);
});

// --- LEADS CRM PIPELINE ---
app.get('/api/leads', requireAuth, (req, res) => {
  res.json(db.getLeads(req.user.id));
});

app.post('/api/leads', requireAuth, (req, res) => {
  const { name, contact, value, source, notes, campaignId } = req.body;
  if (!name || !contact) {
    return res.status(400).json({ error: 'Lead name and contact are required' });
  }
  const lead = db.addLead(req.user.id, { name, contact, value, source, notes, campaignId });
  res.status(201).json(lead);
});

app.patch('/api/leads/:id/stage', requireAuth, (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;
  if (!stage) {
    return res.status(400).json({ error: 'Stage is required' });
  }
  const lead = db.updateLeadStage(req.user.id, id, stage);
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' });
  }
  res.json(lead);
});

app.delete('/api/leads/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const success = db.deleteLead(req.user.id, id);
  if (!success) {
    return res.status(404).json({ error: 'Lead not found' });
  }
  res.json({ success: true });
});

// --- WALLET & COMMISSION LEDGER ---
app.get('/api/wallet', requireAuth, (req, res) => {
  res.json(db.getWallet(req.user.id));
});

app.post('/api/wallet/payout', requireAuth, (req, res) => {
  const { amount, method } = req.body;
  try {
    const result = db.requestPayout(req.user.id, amount, method);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- MARKETING ASSET VAULT ---
app.get('/api/assets', (req, res) => {
  res.json(db.getAssets());
});

app.post('/api/assets/:id/use', (req, res) => {
  const { id } = req.params;
  const asset = db.useAsset(id);
  res.json(asset || { success: true });
});

// --- NOTIFICATIONS ---
app.get('/api/notifications', requireAuth, (req, res) => {
  res.json(db.getNotifications(req.user.id));
});

app.post('/api/notifications/read', requireAuth, (req, res) => {
  db.markNotificationsRead(req.user.id);
  res.json({ success: true });
});

// --- PUBLIC INQUIRY & TRACKING ---
app.post('/api/public/lead', (req, res) => {
  const { refCode, name, contact, value, notes, campaignSlug } = req.body;
  if (!name || !contact) {
    return res.status(400).json({ error: 'Name and contact are required' });
  }
  try {
    const lead = db.submitPublicLead({ refCode, name, contact, value, notes, campaignSlug });
    res.status(201).json({ success: true, leadId: lead.id, message: 'Consultation request received successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/track/click', (req, res) => {
  const { campaignId, ref } = req.query;
  if (campaignId || ref) {
    db.trackClick(campaignId, ref);
  }
  res.json({ success: true });
});

// --- DEVELOPER / TESTING TOOLS ---
app.post('/api/agent/seed-data', requireAuth, (req, res) => {
  db.seedSampleData(req.user.id);
  res.json({ success: true, message: 'Sample test data loaded successfully!' });
});

app.post('/api/agent/reset-data', requireAuth, (req, res) => {
  db.resetUserData(req.user.id);
  res.json({ success: true, message: 'Agent data reset to clean initial state.' });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Cuvasol Node.js API Server running on http://localhost:${PORT}`);
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
