import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const DataContext = createContext(null);

const DEFAULT_KPIS = {
  totalRevenueGenerated: 0,
  activeLeadsCount: 0,
  conversionRate: 0,
  monthlyClicks: 0,
  totalCommissionEarned: 0,
  revenueGrowth: '0%',
  leadsGrowth: '0 new',
  conversionGrowth: '0.0%',
  monthlyTrajectory: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  funnelStages: []
};

const DEFAULT_WALLET = {
  availableBalance: 0,
  pendingBalance: 0,
  totalPaidOut: 0,
  lifetimeEarnings: 0,
  transactions: []
};

export function DataProvider({ children }) {
  const { isAuthenticated, token } = useAuth();
  const { showToast } = useToast();

  const [kpis, setKpis] = useState(DEFAULT_KPIS);
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [wallet, setWallet] = useState(DEFAULT_WALLET);
  const [assets, setAssets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const getHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  const fetchAllData = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setKpis(DEFAULT_KPIS);
      setCampaigns([]);
      setLeads([]);
      setWallet(DEFAULT_WALLET);
      setNotifications([]);
      return;
    }

    setLoadingData(true);
    try {
      const headers = getHeaders();
      const [kpiRes, campRes, leadsRes, walletRes, assetsRes, notifRes] = await Promise.all([
        fetch('/api/kpis', { headers }).then(r => r.ok ? r.json() : DEFAULT_KPIS),
        fetch('/api/campaigns', { headers }).then(r => r.ok ? r.json() : []),
        fetch('/api/leads', { headers }).then(r => r.ok ? r.json() : []),
        fetch('/api/wallet', { headers }).then(r => r.ok ? r.json() : DEFAULT_WALLET),
        fetch('/api/assets').then(r => r.ok ? r.json() : []),
        fetch('/api/notifications', { headers }).then(r => r.ok ? r.json() : [])
      ]);

      setKpis(kpiRes || DEFAULT_KPIS);
      setCampaigns(Array.isArray(campRes) ? campRes : []);
      setLeads(Array.isArray(leadsRes) ? leadsRes : []);
      setWallet(walletRes || DEFAULT_WALLET);
      setAssets(Array.isArray(assetsRes) ? assetsRes : []);
      setNotifications(Array.isArray(notifRes) ? notifRes : []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  }, [isAuthenticated, token, getHeaders]);

  useEffect(() => {
    fetchAllData();
  }, [isAuthenticated, fetchAllData]);

  const addCampaign = async ({ title, channel }) => {
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title, channel })
      });
      const newCamp = await res.json();
      if (!res.ok) throw new Error(newCamp.error || 'Failed to create campaign');

      setCampaigns(prev => [newCamp, ...prev]);
      fetchAllData(); // refresh KPIs
      showToast(`Campaign "${title}" launched! ⚡`, 'success');
      return newCamp;
    } catch (err) {
      showToast(err.message || 'Failed to create campaign', 'error');
      throw err;
    }
  };

  const addLead = async (leadData) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(leadData)
      });
      const newLead = await res.json();
      if (!res.ok) throw new Error(newLead.error || 'Failed to add lead');

      setLeads(prev => [newLead, ...prev]);
      fetchAllData(); // refresh KPIs and notifications
      showToast(`Lead for ${leadData.name} added! 🎯`, 'success');
      return newLead;
    } catch (err) {
      showToast(err.message || 'Failed to add lead', 'error');
      throw err;
    }
  };

  const updateLeadStage = async (id, stage) => {
    try {
      const res = await fetch(`/api/leads/${id}/stage`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ stage })
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || 'Failed to update stage');

      setLeads(prev => prev.map(l => l.id === id ? updated : l));
      fetchAllData(); // refresh wallet & KPIs
      showToast(`Lead advanced to ${stage.replace('_', ' ')}! ✨`, 'success');
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update stage', 'error');
      throw err;
    }
  };

  const deleteLead = async (id) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete lead');

      setLeads(prev => prev.filter(l => l.id !== id));
      fetchAllData();
      showToast('Lead removed from CRM', 'info');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const requestPayout = async (amount, method) => {
    try {
      const res = await fetch('/api/wallet/payout', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ amount, method })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payout failed');

      setWallet(data.wallet);
      fetchAllData();
      showToast(`Payout of $${Number(amount).toLocaleString()} initiated! 💸`, 'success');
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const useAsset = async (id) => {
    try {
      const res = await fetch(`/api/assets/${id}/use`, {
        method: 'POST',
        headers: getHeaders()
      });
      const updatedAsset = await res.json();
      setAssets(prev => prev.map(a => a.id === id ? { ...a, downloads: (a.downloads || 0) + 1 } : a));
      return updatedAsset;
    } catch (err) {
      console.error('Failed to log asset use:', err);
    }
  };

  const markNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: getHeaders()
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const seedSampleData = async () => {
    try {
      const res = await fetch('/api/agent/seed-data', {
        method: 'POST',
        headers: getHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load sample data');
      await fetchAllData();
      showToast('Sample realistic test data loaded! 🚀', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const resetData = async () => {
    try {
      const res = await fetch('/api/agent/reset-data', {
        method: 'POST',
        headers: getHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset data');
      await fetchAllData();
      showToast('Account data reset to clean $0 state.', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <DataContext.Provider value={{
      kpis,
      campaigns,
      leads,
      wallet,
      assets,
      notifications,
      loadingData,
      addCampaign,
      addLead,
      updateLeadStage,
      deleteLead,
      requestPayout,
      useAsset,
      markNotificationsRead,
      seedSampleData,
      resetData,
      refreshData: fetchAllData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
