/* ==========================================================================
   CUVASOL AGENT CLOUD - MONGOOSE MODELS (server/models/index.js)
   ========================================================================== */

import mongoose from 'mongoose';

const { Schema } = mongoose;

// --- USER SCHEMA ---
const userSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  tier: { type: String, default: 'Gold Agent' },
  tierCommission: { type: Number, default: 0.12 },
  avatar: { type: String, default: 'AG' },
  joinedDate: { type: String, default: () => new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }) },
  referralCode: { type: String, required: true, index: true },
  referredBy: { type: String, default: null, index: true },
  customSlug: { type: String, default: '' },
  payoutMethod: { type: String, default: 'Direct Bank Deposit (ACH)' },
  niche: { type: [String], default: ['Social Media Ads', 'Direct Outreach'] },
  token: { type: String, index: true },
  notificationSettings: {
    emailLeadAlerts: { type: Boolean, default: true },
    smsPayoutAlerts: { type: Boolean, default: true },
    weeklyAdDrops: { type: Boolean, default: true }
  }
}, { timestamps: true });

// --- CAMPAIGN SCHEMA ---
const campaignSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true, trim: true },
  channel: { type: String, default: 'Omnichannel Solar Ads' },
  status: { type: String, default: 'Active' },
  clicks: { type: Number, default: 0 },
  leads: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  epc: { type: Number, default: 0.00 },
  utmUrl: { type: String, default: '' }
}, { timestamps: true });

// --- LEAD SCHEMA ---
const leadSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  campaignId: { type: String, default: null, index: true },
  name: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  stage: { type: String, default: 'new', enum: ['new', 'contacted', 'audit_booked', 'proposal', 'closed_won', 'paid', 'closed_lost'] },
  value: { type: Number, default: 20000 },
  commission: { type: Number, default: 0 },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  source: { type: String, default: 'Direct Referral Link' },
  notes: { type: String, default: 'Inbound solar interest via agent portal' }
}, { timestamps: true });

// --- TRANSACTION SCHEMA ---
const transactionSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  leadId: { type: String, default: null },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  type: { type: String, required: true, enum: ['Commission', 'Bonus', 'Payout', 'Adjustment'] },
  desc: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Completed', enum: ['Paid', 'Completed', 'Pending', 'Processing'] }
}, { timestamps: true });

// --- PAYOUT SCHEMA ---
const payoutSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  status: { type: String, default: 'Completed' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

// --- NOTIFICATION SCHEMA ---
const notificationSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, default: 'Just now' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

// --- ASSET SCHEMA ---
const assetSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  category: { type: String, default: 'Video Ads' },
  tag: { type: String, default: 'High CTR' },
  downloads: { type: Number, default: 0 },
  format: { type: String, default: 'MP4 9:16' },
  preview: { type: String, default: '' },
  desc: { type: String, default: '' },
  copy: { type: String, default: '' },
  url: { type: String, default: '#' }
}, { timestamps: true });

// --- CLICK LOG SCHEMA ---
const clickLogSchema = new Schema({
  campaignId: { type: String, default: null, index: true },
  refCode: { type: String, default: null, index: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);
export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
export const Payout = mongoose.models.Payout || mongoose.model('Payout', payoutSchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export const Asset = mongoose.models.Asset || mongoose.model('Asset', assetSchema);
export const ClickLog = mongoose.models.ClickLog || mongoose.model('ClickLog', clickLogSchema);
