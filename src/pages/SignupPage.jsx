import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function SignupPage({ onNavigate }) {
  const { register } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [channels, setChannels] = useState(['TikTok & Reels', 'Meta / FB Ads']);
  const [payoutMethod, setPayoutMethod] = useState('Direct Bank Deposit (ACH)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChannelToggle = (channelName) => {
    if (channels.includes(channelName)) {
      setChannels(channels.filter(c => c !== channelName));
    } else {
      setChannels([...channels, channelName]);
    }
  };

  const handleStep1Next = () => {
    if (!name.trim() || !email.trim() || !password) {
      showToast('Please fill in your name, business email, and password.', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    if (channels.length === 0) {
      showToast('Please select at least one marketing channel.', 'warning');
      return;
    }
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register({ name, email, password, channels, payoutMethod });
      onNavigate('dashboard');
    } catch (err) {
      // Toast handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrap" style={{ maxWidth: 540 }}>
        <button onClick={() => onNavigate('landing')} className="auth-back-link">
          ← Back to Cuvasol Home
        </button>

        <div className="auth-card glass-card">
          <div className="auth-header">
            <a href="#landing" onClick={() => onNavigate('landing')} className="auth-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <img src="/assets/logo.png" alt="Cuvasol" style={{ height: 40, width: 40, objectFit: 'contain' }} />
              <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Cuvasol
              </span>
            </a>
            <h2>Join Cuvasol Agent Cloud</h2>
            <p>Start earning up to 15% clean energy marketing commissions.</p>
          </div>

          {/* Wizard Steps Bar */}
          <div className="signup-steps-bar">
            <div className={`step-indicator ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
              <div className="step-dot">1</div>
              <span className="step-label">Account</span>
            </div>
            <div className={`step-indicator ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
              <div className="step-dot">2</div>
              <span className="step-label">Channels</span>
            </div>
            <div className={`step-indicator ${step === 3 ? 'active' : ''}`}>
              <div className="step-dot">3</div>
              <span className="step-label">Payouts</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div>
                <div className="form-group">
                  <label className="form-label" htmlFor="su-name">Full Name / Agency Name</label>
                  <input
                    id="su-name"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Jordan Hayes or Apex Growth"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="su-email">Business Email</label>
                  <input
                    id="su-email"
                    type="email"
                    className="form-control"
                    placeholder="e.g. jordan@apexgrowth.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="su-pass">Create Secure Password</label>
                  <input
                    id="su-pass"
                    type="password"
                    className="form-control"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="button" className="btn btn-primary w-full btn-lg" onClick={handleStep1Next}>
                  <span>Continue to Marketing Channels ➔</span>
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Select your primary traffic and distribution channels:
                </p>

                <div className="channel-select-grid">
                  {['TikTok & Reels', 'Meta / FB Ads', 'Google PPC & SEO', 'B2B LinkedIn & Outreach'].map(ch => (
                    <label key={ch} className={`channel-card-option ${channels.includes(ch) ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={channels.includes(ch)}
                        onChange={() => handleChannelToggle(ch)}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ch}</span>
                    </label>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-secondary w-full" onClick={() => setStep(1)}>Back</button>
                  <button type="button" className="btn btn-primary w-full" onClick={handleStep2Next}>Next: Payout Setup ➔</button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Select how you'd like to receive your 24-hr commission payouts:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {[
                    { val: 'Direct Bank Deposit (ACH)', title: 'Direct Bank Deposit (ACH / Wire)', desc: 'Instant US bank settlement with 0% fees' },
                    { val: 'Crypto USDT (TRC-20)', title: 'USDT Stablecoin (Crypto Wallet)', desc: 'Global instantaneous borderless payout' },
                    { val: 'Stripe Connect', title: 'Stripe Connect Express', desc: 'International debit card fast-transfer' }
                  ].map(opt => (
                    <label key={opt.val} className="channel-card-option">
                      <input
                        type="radio"
                        name="signup_payout_rad"
                        value={opt.val}
                        checked={payoutMethod === opt.val}
                        onChange={() => setPayoutMethod(opt.val)}
                      />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{opt.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className="btn btn-secondary w-full" onClick={() => setStep(2)}>Back</button>
                  <button type="submit" className="btn btn-emerald w-full btn-lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Activating Account...' : 'Activate Agent Account 🚀'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="auth-footer">
            Already registered?{' '}
            <a href="#login" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>
              Sign In here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
