import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage({ onNavigate }) {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err) {
      // toast shown in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = async () => {
    setIsDemoSubmitting(true);
    try {
      await demoLogin();
      onNavigate('dashboard');
    } catch (err) {
      // toast shown in context
    } finally {
      setIsDemoSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrap" style={{ maxWidth: 460 }}>
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
              <img src="/CuvaLogo-1024.png" alt="Cuvasol" style={{ height: 40, width: 40, objectFit: 'contain' }} />
              <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Cuvasol
              </span>
            </a>
            <h2>Welcome Back</h2>
            <p>Sign in with your email and password to view your referral code and stats.</p>
          </div>

          {/* 1-Click Fast Demo Login */}
          <div className="demo-quick-login-box">
            <div className="demo-login-info">
              <span>⚡ Quick Preview Demo</span>
              <span>Test dashboard with 1 click</span>
            </div>
            <button
              type="button"
              onClick={handleDemoClick}
              className="btn btn-outline-cyan btn-sm"
              disabled={isDemoSubmitting}
            >
              {isDemoSubmitting ? 'Loading...' : 'Instant Demo'}
            </button>
          </div>

          <div className="auth-divider"><span>Or Sign In with Email</span></div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="react-login-email">Email Address</label>
              <input
                id="react-login-email"
                type="email"
                className="form-control"
                placeholder="e.g. yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label className="form-label" htmlFor="react-login-password" style={{ marginBottom: 0 }}>Password</label>
              </div>
              <input
                id="react-login-password"
                type="password"
                className="form-control"
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              style={{ marginTop: '1.25rem' }}
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In to Dashboard ➔'}</span>
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account yet?{' '}
            <a href="#signup" onClick={(e) => { e.preventDefault(); onNavigate('signup'); }}>
              Create an Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
