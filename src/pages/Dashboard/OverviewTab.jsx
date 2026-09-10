import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export function OverviewTab({ onTabChange, onOpenCreateCamp, onOpenPayout }) {
  const { user } = useAuth();
  const { kpis, leads, wallet } = useData();
  const { showToast } = useToast();

  const revCanvasRef = useRef(null);
  const funnelCanvasRef = useRef(null);

  useEffect(() => {
    // Draw Dynamic Revenue Velocity Curve
    const canvas = revCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 35, left: 48 };

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = kpis?.monthlyTrajectory && kpis.monthlyTrajectory.length === 12
      ? kpis.monthlyTrajectory
      : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const maxVal = Math.max(10000, ...data, kpis.totalRevenueGenerated * 1.2 || 10000);
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    const isDark = document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme')?.startsWith('dark');
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(29, 35, 42, 0.08)';
    ctx.lineWidth = 1;
    ctx.fillStyle = isDark ? '#94a3b8' : '#6b7280';
    ctx.font = '11px "DM Sans", sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      const val = Math.round(maxVal - (maxVal / 4) * i);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText(val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`, padding.left - 8, y + 4);
    }

    // X Labels
    ctx.textAlign = 'center';
    const stepX = chartW / (data.length - 1);
    labels.forEach((lbl, i) => {
      ctx.fillText(lbl, padding.left + i * stepX, height - 10);
    });

    // Points
    const points = data.map((val, i) => ({
      x: padding.left + i * stepX,
      y: padding.top + chartH - (val / maxVal) * chartH
    }));

    // Gradient Fill
    const grad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    grad.addColorStop(0, 'rgba(27, 147, 130, 0.35)');
    grad.addColorStop(0.6, 'rgba(27, 147, 130, 0.12)');
    grad.addColorStop(1, 'rgba(27, 147, 130, 0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.lineTo(points[0].x, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Stroke
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = '#1B9382';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(27, 147, 130, 0.4)';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [kpis]);

  useEffect(() => {
    // Draw Dynamic Funnel Bars
    const canvas = funnelCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    const stages = kpis?.funnelStages && kpis.funnelStages.length
      ? kpis.funnelStages
      : [
        { label: 'Impressions', val: '0', pct: 1.0, color: '#6366f1' },
        { label: 'Agent Clicks', val: '0', pct: 0.0, color: '#38bdf8' },
        { label: 'Lead Inquiries', val: '0', pct: 0.0, color: '#00f0ff' },
        { label: 'Deals Closed', val: '0', pct: 0.0, color: '#10b981' }
      ];

    const rowHeight = (height - 20) / stages.length;
    stages.forEach((stage, i) => {
      const y = 15 + i * rowHeight;
      const pct = Math.max(0.04, Math.min(1.0, stage.pct || 0.04));
      const barW = (width - 140) * pct;

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(stage.label, 10, y + 14);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(stage.val, width - 10, y + 14);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath();
      ctx.roundRect(110, y + 4, width - 210, 12, 6);
      ctx.fill();

      ctx.fillStyle = stage.color;
      ctx.beginPath();
      ctx.roundRect(110, y + 4, Math.max(6, barW * 0.7), 12, 6);
      ctx.fill();
    });
  }, [kpis]);

  const referralUrl = `https://${user?.customSlug || 'cuvasol.energy/a/' + (user?.name || 'agent').toLowerCase().replace(/\s+/g, '')}`;

  return (
    <div>
      {/* Greeting Banner */}
      <div className="agent-banner">
        <div>
          <h2>Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Agent'}</span>! 👋</h2>
          <p>
            {kpis.totalRevenueGenerated > 0 ? (
              <>Your clean energy funnels have generated <strong style={{ color: 'var(--emerald-400)' }}>${kpis.totalRevenueGenerated.toLocaleString()} in verified deal volume</strong>. Keep scaling!</>
            ) : (
              <>Your agent pipeline is ready. Launch your first campaign or add a solar lead to unlock instant commission settlements!</>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-outline-cyan btn-sm" onClick={() => onTabChange('campaigns')}>
            🔗 Get Link
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOpenCreateCamp}>
            ⚡ Launch Campaign
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card glass-card">
          <div className="kpi-header">
            <span className="kpi-title">Gross Revenue</span>
            <div className="kpi-icon" style={{ background: 'rgba(0,240,255,0.15)', color: 'var(--cyan-400)' }}>📈</div>
          </div>
          <div className="kpi-value text-gradient">${kpis.totalRevenueGenerated.toLocaleString()}</div>
          <div className="kpi-footer">
            <span className="kpi-trend-positive">{kpis.revenueGrowth || '0%'}</span>
            <span style={{ color: 'var(--text-muted)' }}>closed deals value</span>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-header">
            <span className="kpi-title">Available Commission</span>
            <div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--emerald-400)' }}>💰</div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--emerald-400)' }}>
            ${wallet.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="kpi-footer">
            {wallet.availableBalance > 0 ? (
              <button
                className="btn btn-emerald btn-sm"
                onClick={onOpenPayout}
                style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
              >
                Withdraw Funds ➔
              </button>
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Settles automatically upon deal won</span>
            )}
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Leads</span>
            <div className="kpi-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}>🎯</div>
          </div>
          <div className="kpi-value">{kpis.activeLeadsCount}</div>
          <div className="kpi-footer">
            <span className="kpi-trend-positive">{kpis.leadsGrowth || '0 active'}</span>
            <span style={{ color: 'var(--text-muted)' }}>in pipeline CRM</span>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-header">
            <span className="kpi-title">Conversion Rate</span>
            <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--amber-400)' }}>⚡</div>
          </div>
          <div className="kpi-value text-gold">{kpis.conversionRate}%</div>
          <div className="kpi-footer">
            <span className="kpi-trend-positive">{kpis.conversionGrowth || '0.0%'}</span>
            <span style={{ color: 'var(--text-muted)' }}>inquiry to close</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card glass-card">
          <div className="chart-card-header">
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Revenue Velocity & Commission Trajectory</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Live monthly closed deal trajectory</p>
            </div>
            <span className="badge badge-cyan">2026 Live</span>
          </div>
          <div className="chart-canvas-container">
            <canvas ref={revCanvasRef} style={{ width: '100%', height: '100%' }}></canvas>
          </div>
        </div>

        <div className="chart-card glass-card">
          <div className="chart-card-header">
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Traffic & Conversion Funnel</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real funnel metrics from ad clicks to closed deal payouts</p>
            </div>
          </div>
          <div className="chart-canvas-container">
            <canvas ref={funnelCanvasRef} style={{ width: '100%', height: '100%' }}></canvas>
          </div>
        </div>
      </div>

      {/* Recent Leads & Referral Link */}
      <div className="overview-bottom-grid">
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Live Inbound Leads</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onTabChange('leads')} style={{ fontSize: '0.75rem' }}>
              View Full CRM ({leads.length}) ➔
            </button>
          </div>
          {leads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>No leads in your pipeline yet.</p>
              <button className="btn btn-emerald btn-sm" onClick={() => onTabChange('leads')}>
                ➕ Add First Inbound Lead
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Source Channel</th>
                    <th>Est. Deal</th>
                    <th>Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 4).map(l => (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{l.name}</td>
                      <td><span className="badge badge-cyan">{l.source}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--emerald-400)' }}>
                        ${Number(l.value || 0).toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge ${l.stage === 'closed_won' || l.stage === 'paid' ? 'badge-emerald' : 'badge-indigo'}`}>
                          {l.stage.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Agent Direct Link</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Share your personal verified portal URL to automatically attribute inbound solar inquiries:
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                className="form-control"
                readOnly
                value={referralUrl}
              />
            </div>
          </div>
          <button
            className="btn btn-outline-cyan w-full"
            onClick={() => {
              navigator.clipboard.writeText(referralUrl);
              showToast('Direct Agent URL copied! 📋', 'success');
            }}
          >
            📋 Copy Referral Link
          </button>
        </div>
      </div>
    </div>
  );
}
