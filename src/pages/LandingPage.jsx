import React from 'react';
import { useAuth } from '../context/AuthContext';

export function LandingPage({ onNavigate }) {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="landing-page-root" style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      
      {/* Hero Section */}
      <section className="hero-section" style={{ paddingTop: '8.5rem', paddingBottom: '5rem' }}>
        <div className="container">
          <div style={{ maxWidth: 920, margin: '0 auto', textAlign: 'center' }}>
            
            {/* Top Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.45rem 1.25rem',
              borderRadius: '9999px',
              background: 'var(--primary-light)',
              border: '1px solid var(--border-glow)',
              marginBottom: '1.75rem'
            }}>
              <span className="badge-pulse-dot"></span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                ⚡ Cuvasol Referral & Member Network
              </span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              color: 'var(--text-primary)'
            }}>
              Empowering High-Yield Growth for <br />
              <span style={{
                background: 'var(--grad-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                CleanTech & Referral Agents
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: 720,
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6
            }}>
              Create your account in seconds, receive your personal referral code, and track every person you refer in real-time backed by MongoDB.
            </p>

            {/* Hero CTAs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '4rem'
            }}>
              {isAuthenticated ? (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => onNavigate('dashboard')}
                  style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
                >
                  <span>🚀 Open My Referral Dashboard ➔</span>
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => onNavigate('signup')}
                    style={{ padding: '1rem 2.2rem', fontSize: '1.05rem' }}
                  >
                    <span>🚀 Get Your Referral Code</span>
                  </button>
                  <button
                    className="btn btn-secondary btn-lg"
                    onClick={() => onNavigate('login')}
                    style={{ padding: '1rem 2.2rem', fontSize: '1.05rem' }}
                  >
                    <span>⚡ Sign In to Account</span>
                  </button>
                </>
              )}
            </div>

            {/* 4 Feature Highlights Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              padding: '1.5rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-card)',
              textAlign: 'left'
            }}>
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>🎁</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.2rem' }}>Personal Code</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Unique referral code assigned instantly upon signup.</div>
              </div>

              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>👥</div>
                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem', marginBottom: '0.2rem' }}>Referral Counter</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Live breakdown of every user who signed up with your code.</div>
              </div>

              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>🔗</div>
                <div style={{ fontWeight: 700, color: 'var(--emerald-500)', fontSize: '1rem', marginBottom: '0.2rem' }}>1-Click Share</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Direct referral link that automatically pre-fills your code.</div>
              </div>

              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>🍃</div>
                <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1rem', marginBottom: '0.2rem' }}>MongoDB Cloud</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Connected to MongoDB Atlas for 24/7 persistent storage.</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid var(--border-subtle)', position: 'relative', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 3.5rem auto' }}>
            <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Simple 3-Step Process
            </div>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
              How the Referral System Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Start sharing and tracking your referral network in just a few clicks.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {/* Step 1 */}
            <div className="glass-card" style={{ padding: '2.25rem', position: 'relative' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#FFFFFF',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                marginBottom: '1.25rem',
                boxShadow: '0 4px 12px var(--primary-glow)'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                Sign Up with Your Details
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Create your agent account with your name, email, and password. If you were invited by someone, their referral code is automatically attached.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card" style={{ padding: '2.25rem', position: 'relative' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--accent)',
                color: '#FFFFFF',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                marginBottom: '1.25rem',
                boxShadow: '0 4px 12px rgba(240, 106, 67, 0.35)'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                Get Your Unique Code & Link
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Instantly access your personalized referral code (e.g. <code>SARAH-CLEAN-26</code>) and shareable 1-click registration link in your dashboard.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card" style={{ padding: '2.25rem', position: 'relative' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--emerald-500)',
                color: '#FFFFFF',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                marginBottom: '1.25rem',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                Track Your Referrals Live
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Whenever someone joins using your code, your dashboard automatically increments your referral counter and lists their profile details.
              </p>
            </div>
          </div>

          {/* Bottom CTA Box */}
          <div style={{
            marginTop: '4rem',
            padding: '3rem 2rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-card)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Ready to Get Started?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto 1.75rem auto' }}>
              Join Cuvasol today and start building your referral network.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('signup')}
            >
              <span>Create Free Account & Get Referral Code 🚀</span>
            </button>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '2.5rem 0',
        background: 'var(--bg-card)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img src="/assets/logo.png" alt="Cuvasol" style={{ height: 28, width: 28, objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Cuvasol</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Cuvasol Agent Cloud. MongoDB Database Integrated.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button onClick={() => onNavigate('login')} className="btn-ghost" style={{ fontSize: '0.85rem' }}>Sign In</button>
            <button onClick={() => onNavigate('signup')} className="btn-ghost" style={{ fontSize: '0.85rem' }}>Sign Up</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
