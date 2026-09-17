import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export function SettingsTab() {
  const { user, updateProfile } = useAuth();
  const { seedSampleData, resetData } = useData();
  const { showToast } = useToast();
  const { theme, setTheme, THEMES } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [customSlug, setCustomSlug] = useState(user?.customSlug || '');
  const [payoutMethod, setPayoutMethod] = useState(user?.payoutMethod || 'Direct Bank Deposit (ACH)');
  const [emailAlerts, setEmailAlerts] = useState(user?.notificationSettings?.emailLeadAlerts ?? true);
  const [smsAlerts, setSmsAlerts] = useState(user?.notificationSettings?.smsPayoutAlerts ?? true);
  const [adAlerts, setAdAlerts] = useState(user?.notificationSettings?.weeklyAdDrops ?? true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCustomSlug(user.customSlug || '');
      setPayoutMethod(user.payoutMethod || 'Direct Bank Deposit (ACH)');
      if (user.notificationSettings) {
        setEmailAlerts(user.notificationSettings.emailLeadAlerts ?? true);
        setSmsAlerts(user.notificationSettings.smsPayoutAlerts ?? true);
        setAdAlerts(user.notificationSettings.weeklyAdDrops ?? true);
      }
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        customSlug,
        payoutMethod,
        notificationSettings: {
          emailLeadAlerts: emailAlerts,
          smsPayoutAlerts: smsAlerts,
          weeklyAdDrops: adAlerts
        }
      });
    } catch (err) {
      // Toast handled in context
    } finally {
      setIsSaving(false);
    }
  };

  const referralUrl = `https://${customSlug || user?.customSlug || 'cuvasol.energy/a/agent'}`;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Agent Profile & Commission Settings</h2>
        <p>Manage your custom referral URLs, payout methods, and live pipeline preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Agent Profile & Identity */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Agent Identity & Payouts</h3>
          
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name / Agency</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Referral Code</label>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--cyan-400)', fontSize: '1.1rem' }}>
                {user?.referralCode || 'AGENT-26'}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Active Commission Tier</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-amber" style={{ fontSize: '0.85rem' }}>
                  ★ {user?.tier || 'Gold Agent'} ({Math.round((user?.tierCommission || 0.12) * 100)}%)
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>+ Monthly Milestone Bonus</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Default Payout Method</label>
              <select
                className="form-control"
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
              >
                <option value="Direct Bank Deposit (ACH)">Direct Bank Deposit (ACH / Wire)</option>
                <option value="Crypto USDT (TRC-20)">Crypto USDT (TRC-20 Wallet)</option>
                <option value="Stripe Connect Express">Stripe Connect Express</option>
                <option value="PayPal Business">PayPal Business</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Personal Agent Referral URL</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-control"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="cuvasol.energy/a/yourname"
                />
                <button
                  type="button"
                  className="btn btn-outline-cyan btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(referralUrl);
                    showToast('Referral link copied! 📋', 'success');
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSaving} style={{ marginTop: '1rem' }}>
              {isSaving ? 'Saving Changes...' : '💾 Save Profile Settings'}
            </button>
          </form>
        </div>

        {/* Notification Preferences & Testing Sandbox */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Appearance & Theme</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Choose your preferred visual theme (defaults to Cuvasol Tutor Day Mode):
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {THEMES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: theme === t.id ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    background: theme === t.id ? 'var(--primary-light)' : 'var(--bg-secondary)',
                    color: theme === t.id ? 'var(--primary)' : 'var(--text-primary)',
                    fontWeight: theme === t.id ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{t.icon}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Notification Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label className="channel-card-option">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                />
                <span>Instant email alert on new inbound lead submission</span>
              </label>
              <label className="channel-card-option">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                />
                <span>Commission clearance & instant payout notifications</span>
              </label>
              <label className="channel-card-option">
                <input
                  type="checkbox"
                  checked={adAlerts}
                  onChange={(e) => setAdAlerts(e.target.checked)}
                />
                <span>Weekly high-converting ad copy drops in Asset Vault</span>
              </label>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(0,240,255,0.2)' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>🛠️ Developer & Testing Sandbox</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Easily switch between testing full populated pipeline metrics or starting from a clean $0 state.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={seedSampleData}
              >
                ⚡ Load Sample Pipeline Data
              </button>
              <button
                type="button"
                className="btn btn-outline-cyan btn-sm"
                style={{ borderColor: 'rgba(239,68,68,0.5)', color: '#f87171' }}
                onClick={() => {
                  if (window.confirm('Reset all your campaigns, leads, and wallet transactions back to clean $0 state?')) {
                    resetData();
                  }
                }}
              >
                🗑️ Reset Data to $0
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
