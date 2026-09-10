import React from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export function CampaignsTab({ onOpenCreateCamp, onOpenUtmBuilder }) {
  const { campaigns } = useData();
  const { showToast } = useToast();

  const handleCopyRaw = (url) => {
    navigator.clipboard.writeText(url);
    showToast('Campaign tracking URL copied to clipboard! 📋', 'success');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Marketing Campaigns & UTM Links</h2>
          <p>Deploy multi-channel solar funnels and generate custom tracking links for attribution.</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenCreateCamp}>
          <span>➕ Launch New Campaign</span>
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', margin: '2rem 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Active Campaigns Yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 1.5rem auto' }}>
            Create your first marketing campaign to generate customized tracking links, track ad clicks, and measure conversion earnings.
          </p>
          <button className="btn btn-primary btn-lg" onClick={onOpenCreateCamp}>
            ➕ Launch Your First Campaign
          </button>
        </div>
      ) : (
        <div className="campaigns-grid">
          {campaigns.map(c => (
            <div key={c.id} className="campaign-card glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-emerald">
                  <span className="badge-pulse-dot" style={{ width: 6, height: 6 }}></span> {c.status || 'Active'}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onOpenUtmBuilder(c.id)}
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.775rem' }}
                >
                  🔗 Get Link
                </button>
              </div>

              <h3>{c.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--cyan-400)', marginBottom: '0.5rem' }}>
                Channel: {c.channel}
              </p>

              <div className="campaign-stats-row">
                <div>
                  <div className="camp-stat-num">{Number(c.clicks || 0).toLocaleString()}</div>
                  <div className="camp-stat-lbl">Clicks</div>
                </div>
                <div>
                  <div className="camp-stat-num" style={{ color: 'var(--cyan-400)' }}>{c.leads || 0}</div>
                  <div className="camp-stat-lbl">Leads</div>
                </div>
                <div>
                  <div className="camp-stat-num" style={{ color: 'var(--emerald-400)' }}>${Number(c.revenue || 0).toLocaleString()}</div>
                  <div className="camp-stat-lbl">Revenue</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
                <span>EPC: <strong style={{ color: '#fff' }}>${Number(c.epc || 0).toFixed(2)}</strong></span>
                <button
                  className="btn btn-outline-cyan btn-sm"
                  onClick={() => handleCopyRaw(c.utmUrl)}
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                >
                  📋 Copy UTM
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
