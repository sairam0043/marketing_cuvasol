import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function SignupPage({ onNavigate }) {
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-detect referral code from URL search query or hash query
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let ref = urlParams.get('ref');

      if (!ref && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        ref = hashParams.get('ref');
      }

      if (ref) {
        setReferralCode(ref.trim());
      }
    } catch (e) {
      console.error('Error parsing referral code:', e);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      showToast('Please fill in your name, email, and password.', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        referralCodeUsed: referralCode.trim() || undefined
      });
      onNavigate('dashboard');
    } catch (err) {
      // Toast handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrap" style={{ maxWidth: 480 }}>
        <button onClick={() => onNavigate('landing')} className="auth-back-link">
          ← Back to Home
        </button>

        <div className="auth-card glass-card">
          <div className="auth-header">
            <a
              href="#landing"
              onClick={() => onNavigate('landing')}
              className="auth-logo"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', marginBottom: '1.25rem' }}
            >
              <img src="/assets/logo.png" alt="Cuvasol" style={{ height: 40, width: 40, objectFit: 'contain' }} />
              <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Cuvasol
              </span>
            </a>
            <h2>Create Your Account</h2>
            <p>Sign up in seconds to get your personal referral code and track your referrals.</p>
          </div>

          {referralCode && (
            <div style={{
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#38bdf8',
              fontSize: '0.9rem'
            }}>
              <span style={{ fontSize: '1.3rem' }}>🎁</span>
              <div>
                <strong>Referred by:</strong> <span style={{ color: '#00f0ff', fontWeight: 700 }}>{referralCode}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="su-name">Full Name</label>
              <input
                id="su-name"
                type="text"
                className="form-control"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="su-email">Email Address</label>
              <input
                id="su-email"
                type="email"
                className="form-control"
                placeholder="e.g. alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="su-pass">Create Password</label>
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

            <div className="form-group">
              <label className="form-label" htmlFor="su-ref">
                Referral Code <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                id="su-ref"
                type="text"
                className="form-control"
                placeholder="e.g. SARAH-CLEAN-26"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              style={{ marginTop: '1.25rem' }}
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Sign Up & Get Referral Code 🚀'}</span>
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <a href="#login" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>
              Sign In here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
