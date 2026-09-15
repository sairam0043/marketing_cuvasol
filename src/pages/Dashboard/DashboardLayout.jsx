import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

import { OverviewTab } from './OverviewTab';
import { ReferralDashboard } from './ReferralDashboard';
import { CampaignsTab } from './CampaignsTab';
import { LeadsTab } from './LeadsTab';
import { AssetsTab } from './AssetsTab';
import { PayoutsTab } from './PayoutsTab';
import { SettingsTab } from './SettingsTab';

import { CreateCampaignModal } from '../../components/Modals/CreateCampaignModal';
import { UtmBuilderModal } from '../../components/Modals/UtmBuilderModal';
import { AddLeadModal } from '../../components/Modals/AddLeadModal';
import { LeadDetailModal } from '../../components/Modals/LeadDetailModal';
import { ScriptPreviewModal } from '../../components/Modals/ScriptPreviewModal';
import { RequestPayoutModal } from '../../components/Modals/RequestPayoutModal';

export function DashboardLayout({ activeTab = 'overview', onTabChange, onNavigateLanding }) {
  const { user, logout } = useAuth();
  const { notifications, campaigns } = useData();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Modals state
  const [isCreateCampOpen, setIsCreateCampOpen] = useState(false);
  const [isUtmBuilderOpen, setIsUtmBuilderOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);

  const handleOpenUtm = (campId) => {
    setSelectedCampaignId(campId);
    setIsUtmBuilderOpen(true);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dash-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <a
            href="#landing"
            onClick={(e) => { e.preventDefault(); onNavigateLanding(); }}
            className="brand-logo"
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}
          >
            <img src="/CuvaLogo-1024.png" alt="Cuvasol" style={{ height: 34, width: 34, objectFit: 'contain' }} />
            <span style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
              Cuvasol
            </span>
          </a>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Grow & Scale</div>
          <button
            className={`dash-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { onTabChange('overview'); setMobileSidebarOpen(false); }}
          >
            <span className="nav-icon">📊</span>
            <span>Growth Overview</span>
          </button>

          <button
            className={`dash-nav-item ${activeTab === 'referrals' ? 'active' : ''}`}
            onClick={() => { onTabChange('referrals'); setMobileSidebarOpen(false); }}
          >
            <span className="nav-icon">🎁</span>
            <span>Student Referrals</span>
            <span className="nav-pill-count" style={{ background: 'rgba(0, 240, 255, 0.15)', color: '#00f0ff' }}>₹500/Class</span>
          </button>

          <button
            className={`dash-nav-item ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => { onTabChange('campaigns'); setMobileSidebarOpen(false); }}
          >
            <span className="nav-icon">🚀</span>
            <span>Grow (Campaigns)</span>
            <span className="nav-pill-count">{campaigns?.length || 0} Active</span>
          </button>

          <button
            className={`dash-nav-item ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => { onTabChange('leads'); setMobileSidebarOpen(false); }}
          >
            <span className="nav-icon">🎯</span>
            <span>Leads Pipeline</span>
            <span className="nav-pill-count">Live</span>
          </button>

          <div className="nav-section-title" style={{ marginTop: '1rem' }}>Teach & Guide</div>
          <button
            className={`dash-nav-item ${activeTab === 'assets' ? 'active' : ''}`}
            onClick={() => { onTabChange('assets'); setMobileSidebarOpen(false); }}
          >
            <span className="nav-icon">🎓</span>
            <span>Teach (Asset Vault)</span>
          </button>

          <button
            className={`dash-nav-item ${activeTab === 'payouts' ? 'active' : ''}`}
            onClick={() => { onTabChange('payouts'); setMobileSidebarOpen(false); }}
          >
            <span className="nav-icon">💳</span>
            <span>Wallet & Payouts</span>
          </button>

          <button
            className={`dash-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { onTabChange('settings'); setMobileSidebarOpen(false); }}
          >
            <span className="nav-icon">🧭</span>
            <span>Agent Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="agent-mini-profile">
            <div className="profile-avatar">{user?.avatar || 'SJ'}</div>
            <div className="profile-info">
              <div className="profile-name">{user?.name || 'Sarah Jenkins'}</div>
              <div className="profile-tier">★ {user?.tier || 'Platinum Agent'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Panel */}
      <main className="dash-main">
        {/* Topbar */}
        <header className="dash-topbar">
          <div className="topbar-left">
            <button
              className="mobile-sidebar-toggle"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              ☰
            </button>
            <div className="search-bar-wrap">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search leads, campaigns, assets..." />
            </div>
          </div>

          <div className="topbar-right">
            <button className="btn btn-secondary btn-sm" onClick={onNavigateLanding} style={{ fontSize: '0.8rem' }}>
              <span>🌐 Public Site</span>
            </button>

            {/* Notification center */}
            <div style={{ position: 'relative' }}>
              <button className="notif-btn" onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifications">
                <span>🔔</span>
                {notifications?.length > 0 && <span className="notif-badge"></span>}
              </button>

              {notifOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 48,
                    width: 320,
                    zIndex: 1000,
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: '0.85rem' }}>
                    Agent Notifications
                  </div>
                  <div>
                    {(!notifications || notifications.length === 0) ? (
                      <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{n.title}</div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{n.text}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--cyan-400)', marginTop: 2 }}>{n.time}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="btn btn-secondary btn-sm" onClick={logout}>Sign Out</button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="dash-content">
          {activeTab === 'overview' && (
            <OverviewTab
              onTabChange={onTabChange}
              onOpenCreateCamp={() => setIsCreateCampOpen(true)}
              onOpenPayout={() => setIsPayoutOpen(true)}
            />
          )}

          {activeTab === 'referrals' && (
            <ReferralDashboard
              onNavigateLanding={onNavigateLanding}
            />
          )}

          {activeTab === 'campaigns' && (
            <CampaignsTab
              onOpenCreateCamp={() => setIsCreateCampOpen(true)}
              onOpenUtmBuilder={handleOpenUtm}
            />
          )}

          {activeTab === 'leads' && (
            <LeadsTab
              onOpenAddLead={() => setIsAddLeadOpen(true)}
              onSelectLead={(lead) => setSelectedLead(lead)}
            />
          )}

          {activeTab === 'assets' && (
            <AssetsTab
              onPreviewAsset={(asset) => setSelectedAsset(asset)}
            />
          )}

          {activeTab === 'payouts' && (
            <PayoutsTab
              onOpenPayout={() => setIsPayoutOpen(true)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab />
          )}
        </div>
      </main>

      {/* Global Dashboard Modals */}
      <CreateCampaignModal
        isOpen={isCreateCampOpen}
        onClose={() => setIsCreateCampOpen(false)}
      />

      <UtmBuilderModal
        isOpen={isUtmBuilderOpen}
        onClose={() => setIsUtmBuilderOpen(false)}
        initialCampaignId={selectedCampaignId}
      />

      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
      />

      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />

      <ScriptPreviewModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />

      <RequestPayoutModal
        isOpen={isPayoutOpen}
        onClose={() => setIsPayoutOpen(false)}
      />
    </div>
  );
}

