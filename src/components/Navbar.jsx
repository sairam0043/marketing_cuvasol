import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function Navbar({ onNavigate }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme, THEMES } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentThemeObj = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <header className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        {/* Clean Single Brand Logo */}
        <a href="#landing" onClick={() => onNavigate('landing')} className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="Cuvasol Logo" style={{ height: 38, width: 38, objectFit: 'contain' }} />
          <span className="brand-title-main" style={{ fontSize: '1.45rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
            Cuvasol
          </span>
        </a>

        {/* Clean Essential Links */}
        <ul className="nav-menu">
          <li>
            <a href="#teach" className="nav-link">Programs</a>
          </li>
          <li>
            <a href="#calculator" className="nav-link">Calculator</a>
          </li>
          <li>
            <a href="#faq" className="nav-link">FAQ</a>
          </li>
        </ul>

        {/* Right Actions & Theme Switcher */}
        <div className="nav-actions">
          {/* Theme Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="theme-toggle-btn"
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              title="Change Theme"
            >
              <span>{currentThemeObj.icon}</span>
              <span style={{ fontSize: '0.8rem' }}>{currentThemeObj.name.split(' ')[0]}</span>
            </button>

            {themeDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  minWidth: '160px',
                  zIndex: 200,
                }}
              >
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setThemeDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.65rem',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      background: theme === t.id ? 'var(--primary-light)' : 'transparent',
                      color: theme === t.id ? 'var(--primary)' : 'var(--text-primary)',
                      fontWeight: theme === t.id ? 700 : 500,
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated && user ? (
            <>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('dashboard')}
              >
                <span>Portal</span>
              </button>
              <button className="btn btn-secondary btn-sm" onClick={logout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('login')}>
                Sign In
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => onNavigate('signup')}>
                Join as Agent
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
