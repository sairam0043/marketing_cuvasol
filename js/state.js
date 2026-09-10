/* ==========================================================================
   CUVASOL AGENT CLOUD - STATE MANAGEMENT & STORAGE (js/state.js)
   ========================================================================== */

const STORAGE_KEY = 'cuvasol_agent_state_v2';

const INITIAL_SEED_DATA = {
  currentUser: {
    id: 'CU-7390',
    name: 'Sarah Jenkins',
    email: 'sarah.j@cuvasol-agent.io',
    tier: 'Platinum Agent',
    tierCommission: '15%',
    avatar: 'SJ',
    joinedDate: 'Oct 2025',
    referralCode: 'SARAH-CLEAN-26',
    customSlug: 'cuvasol.energy/a/sarahj',
    payoutMethod: 'Direct Deposit (Chase ****4812)',
    niche: ['Residential Solar', 'Commercial Storage', 'EV Fleet Infra'],
  },
  wallet: {
    availableBalance: 12450.00,
    pendingBalance: 4850.00,
    totalPaidOut: 68900.00,
    lifetimeEarnings: 86200.00,
    transactions: [
      { id: 'TX-9041', date: '2026-03-01', type: 'Commission', desc: 'Solar Commercial Hub (Apex Logistics)', amount: 4200.00, status: 'Paid' },
      { id: 'TX-8912', date: '2026-02-24', type: 'Payout', desc: 'Transfer to Chase ****4812', amount: -15000.00, status: 'Completed' },
      { id: 'TX-8834', date: '2026-02-18', type: 'Bonus', desc: 'Q1 Milestone Accelerator Bonus', amount: 2500.00, status: 'Paid' },
      { id: 'TX-8720', date: '2026-02-10', type: 'Commission', desc: 'Residential SunFlow Pack (5 Units)', amount: 3150.00, status: 'Paid' },
      { id: 'TX-8650', date: '2026-01-28', type: 'Payout', desc: 'USDT Crypto Settlement', amount: -8200.00, status: 'Completed' },
    ]
  },
  kpis: {
    totalRevenueGenerated: 248500,
    activeLeadsCount: 38,
    conversionRate: 19.4,
    monthlyClicks: 4210,
    revenueGrowth: '+24.5%',
    leadsGrowth: '+12%',
    conversionGrowth: '+3.2%'
  },
  campaigns: [
    {
      id: 'cmp-01',
      title: 'Zero-Down Residential Solar 2026',
      channel: 'Meta & TikTok Video Ads',
      status: 'Active',
      clicks: 1840,
      leads: 24,
      conversions: 7,
      revenue: 54600,
      epc: 2.85,
      utmUrl: 'https://cuvasol.energy/solar-residential?ref=SARAH-CLEAN-26&utm_source=tiktok_reels'
    },
    {
      id: 'cmp-02',
      title: 'Commercial CleanTech Micro-Grids',
      channel: 'LinkedIn B2B & Email Blast',
      status: 'Active',
      clicks: 920,
      leads: 18,
      conversions: 4,
      revenue: 142000,
      epc: 8.40,
      utmUrl: 'https://cuvasol.energy/commercial-grid?ref=SARAH-CLEAN-26&utm_source=linkedin_inmail'
    },
    {
      id: 'cmp-03',
      title: 'Smart EV Charger + Battery Bundle',
      channel: 'Google Search & Local SEO',
      status: 'Active',
      clicks: 1450,
      leads: 12,
      conversions: 3,
      revenue: 51900,
      epc: 3.10,
      utmUrl: 'https://cuvasol.energy/ev-storage?ref=SARAH-CLEAN-26&utm_source=google_ads'
    }
  ],
  leads: [
    { id: 'LD-101', name: 'Nexus Logistics Warehouse', contact: 'dave@nexuslog.com', stage: 'closed_won', value: 48000, date: 'Yesterday', source: 'LinkedIn B2B', notes: 'Contract signed for 120kW roof system' },
    { id: 'LD-102', name: 'Marcus & Elena Sterling', contact: 'marcus.s@gmail.com', stage: 'proposal', value: 16500, date: '2 days ago', source: 'TikTok Reels', notes: 'Requested 12kWh backup battery add-on' },
    { id: 'LD-103', name: 'GreenWave Data Centers', contact: 'procure@greenwave.io', stage: 'contacted', value: 95000, date: '3 days ago', source: 'Email Campaign', notes: 'Technical scoping call scheduled for Friday' },
    { id: 'LD-104', name: 'David Cho (Residential)', contact: 'david.cho@outlook.com', stage: 'new', value: 14200, date: '4 hours ago', source: 'Google Ads', notes: 'Submitted utility bill for ROI estimation' },
    { id: 'LD-105', name: 'Heritage Winery Estates', contact: 'ops@heritagewines.com', stage: 'paid', value: 62000, date: 'Last week', source: 'Referral Link', notes: 'Commission disbursed to agent wallet ($9,300)' },
    { id: 'LD-106', name: 'Vanguard Auto Dealership', contact: 'fleet@vanguardauto.com', stage: 'proposal', value: 38000, date: 'Yesterday', source: 'LinkedIn B2B', notes: 'EV Level 3 Charger installation proposal' }
  ],
  assets: [
    {
      id: 'ast-01',
      category: 'ad_copy',
      title: 'High-Converting TikTok Hook: "$0 Electric Bill in 2026"',
      type: 'Video Script',
      downloads: 420,
      content: 'Hook: "Stop paying $400/mo to your monopoly power company."\nBody: Cuvasol qualifies homeowners for zero upfront cost solar panels + battery back-up with guaranteed 40% rate locks. Takes 60 seconds to check eligibility.'
    },
    {
      id: 'ast-02',
      category: 'email_sequence',
      title: 'B2B Commercial CFO Cold Outreach Sequence (3-Touch)',
      type: 'Email Template',
      downloads: 680,
      content: 'Subject: Tax credit & 28% peak-demand shaving for [Company]\n\nHi [Name],\nMost commercial facility managers don\'t realize the 2026 Clean Energy ITC covers up to 40% of microgrid installations with 18-month payback. Would you like a 1-page feasibility report for your location?'
    },
    {
      id: 'ast-03',
      category: 'social_post',
      title: 'Instagram Carousel: 5 Solar Myths Debunked',
      type: 'Social Graphic Pack',
      downloads: 890,
      content: 'Slide 1: "Solar is too expensive" -> Fact: Zero down options exist.\nSlide 2: "What happens during outages?" -> Fact: Cuvasol batteries keep critical loads on 24/7.\nSlide 3: Link in bio to claim government incentives.'
    },
    {
      id: 'ast-04',
      category: 'pitch_deck',
      title: 'Enterprise CleanTech Investor & Commercial Deck 2026',
      type: 'PDF Presentation',
      downloads: 310,
      content: 'Full 18-slide executive pitch deck with financial models, ROI projections, ESG compliance certifications, and customer case studies.'
    }
  ],
  notifications: [
    { id: 'nt-01', title: 'Commission Received!', text: 'You earned $4,200.00 from Nexus Logistics deal.', time: '2h ago', read: false },
    { id: 'nt-02', title: 'New High-Intent Lead', text: 'David Cho submitted rooftop inspection details.', time: '4h ago', read: false },
    { id: 'nt-03', title: 'Tier Milestone Reached', text: 'Congratulations! You unlocked Platinum Tier 15% rate.', time: '1d ago', read: true }
  ]
};

export class AppState {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    this.saveState(INITIAL_SEED_DATA);
    return JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
  }

  saveState(newState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveState(this.state);
    this.listeners.forEach(l => l(this.state));
  }

  get() {
    return this.state;
  }

  isAuthenticated() {
    return !!this.state.currentUser;
  }

  login(email, password) {
    // If it matches demo or any valid email
    const name = email.split('@')[0].replace('.', ' ');
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    this.state.currentUser = {
      id: 'CU-' + Math.floor(1000 + Math.random() * 9000),
      name: formattedName || 'Sarah Jenkins',
      email: email,
      tier: 'Platinum Agent',
      tierCommission: '15%',
      avatar: (formattedName.slice(0, 2) || 'SJ').toUpperCase(),
      joinedDate: 'Oct 2025',
      referralCode: formattedName.toUpperCase().replace(/\s+/g, '') + '-26',
      customSlug: `cuvasol.energy/a/${(formattedName || 'agent').toLowerCase().replace(/\s+/g, '')}`,
      payoutMethod: 'Direct Deposit (Chase ****4812)',
      niche: ['Residential Solar', 'Commercial Storage']
    };
    this.notify();
    return this.state.currentUser;
  }

  demoLogin() {
    this.state.currentUser = JSON.parse(JSON.stringify(INITIAL_SEED_DATA.currentUser));
    this.notify();
    return this.state.currentUser;
  }

  register(userData) {
    const initials = userData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AG';
    this.state.currentUser = {
      id: 'CU-' + Math.floor(1000 + Math.random() * 9000),
      name: userData.name,
      email: userData.email,
      tier: 'Gold Agent',
      tierCommission: '12%',
      avatar: initials,
      joinedDate: 'March 2026',
      referralCode: userData.name.toUpperCase().replace(/[^A-Z]/g, '') + '-26',
      customSlug: `cuvasol.energy/a/${userData.name.toLowerCase().replace(/[^a-z]/g, '')}`,
      payoutMethod: userData.payoutMethod || 'Direct Deposit',
      niche: userData.channels || ['Social Media Ads', 'Direct Outreach']
    };
    this.notify();
    return this.state.currentUser;
  }

  logout() {
    this.state.currentUser = null;
    this.notify();
  }

  addCampaign(campaignData) {
    const newCamp = {
      id: 'cmp-' + Date.now(),
      title: campaignData.title,
      channel: campaignData.channel || 'Multi-Channel Funnel',
      status: 'Active',
      clicks: 0,
      leads: 0,
      conversions: 0,
      revenue: 0,
      epc: 0.00,
      utmUrl: `https://cuvasol.energy/solar-promo?ref=${this.state.currentUser?.referralCode || 'AGENT'}&utm_campaign=${encodeURIComponent(campaignData.title.toLowerCase().replace(/\s+/g, '_'))}`
    };
    this.state.campaigns.unshift(newCamp);
    this.notify();
    return newCamp;
  }

  updateLeadStatus(leadId, nextStage) {
    const lead = this.state.leads.find(l => l.id === leadId);
    if (lead) {
      lead.stage = nextStage;
      if (nextStage === 'closed_won' || nextStage === 'paid') {
        const commission = Math.round(lead.value * 0.15);
        this.state.wallet.availableBalance += commission;
        this.state.wallet.lifetimeEarnings += commission;
        this.state.wallet.transactions.unshift({
          id: 'TX-' + Math.floor(1000 + Math.random() * 9000),
          date: new Date().toISOString().split('T')[0],
          type: 'Commission',
          desc: `Deal Commission (${lead.name})`,
          amount: commission,
          status: 'Paid'
        });
      }
      this.notify();
    }
  }

  addLead(leadData) {
    const newLead = {
      id: 'LD-' + Math.floor(100 + Math.random() * 900),
      name: leadData.name,
      contact: leadData.contact,
      stage: 'new',
      value: Number(leadData.value) || 15000,
      date: 'Just now',
      source: leadData.source || 'Custom Campaign Link',
      notes: leadData.notes || 'Inbound interest via agent link'
    };
    this.state.leads.unshift(newLead);
    this.state.kpis.activeLeadsCount += 1;
    this.notify();
    return newLead;
  }

  requestPayout(amount, method) {
    const numAmount = Number(amount);
    if (numAmount > this.state.wallet.availableBalance) {
      throw new Error('Requested amount exceeds available balance.');
    }
    if (numAmount <= 0) {
      throw new Error('Please enter a valid payout amount.');
    }

    this.state.wallet.availableBalance -= numAmount;
    this.state.wallet.totalPaidOut += numAmount;
    this.state.wallet.transactions.unshift({
      id: 'TX-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split('T')[0],
      type: 'Payout',
      desc: `Withdrawal via ${method}`,
      amount: -numAmount,
      status: 'Completed'
    });
    this.notify();
    return true;
  }
}

export const appState = new AppState();
