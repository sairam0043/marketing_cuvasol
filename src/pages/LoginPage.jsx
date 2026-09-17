import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage({ onNavigate }) {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input
                  id="react-login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
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
