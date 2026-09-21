import React from 'react';
import { useAuth } from '../context/AuthContext';
import { EarningsCalculator } from '../components/EarningsCalculator';

export function LandingPage({ onNavigate }) {
  const { isAuthenticated } = useAuth();

  const handleCTA = () => {
    if (isAuthenticated) {
      onNavigate('dashboard');
    } else {
      onNavigate('signup');
    }
  };

  return (
    <div className="landing-page-root" style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* =========================================================================
         SECTION 1: HERO SECTION
         ========================================================================= */}
      <section className="hero-section" style={{ paddingTop: '8rem', paddingBottom: '4.5rem', position: 'relative' }}>
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
                ⚡ Cuvasol Tutor Referral Program
              </span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              color: 'var(--text-primary)'
            }}>
              Refer Students &<br />
              <span style={{
                background: 'var(--grad-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                Earn ₹500 for Every Successful Referral.
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: 760,
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.65
            }}>
              Join the Cuvasol Tutor Referral Program and turn your network into an earning opportunity. Register for free, get your unique referral code, share it with students looking for tutors, and earn ₹500 for every eligible student who joins.
            </p>

            {/* Hero CTAs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
              marginBottom: '4rem'
            }}>
              {isAuthenticated ? (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => onNavigate('dashboard')}
                  style={{ padding: '1.1rem 2.6rem', fontSize: '1.1rem', borderRadius: '9999px' }}
                >
                  <span>🚀 Open My Referral Dashboard ➔</span>
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => onNavigate('signup')}
                    style={{ padding: '1.1rem 2.4rem', fontSize: '1.08rem', borderRadius: '9999px' }}
                  >
                    <span>🚀 Get Your Referral Code</span>
                  </button>
                  <button
                    className="btn btn-secondary btn-lg"
                    onClick={() => onNavigate('login')}
                    style={{ padding: '1.1rem 2.4rem', fontSize: '1.08rem', borderRadius: '9999px' }}
                  >
                    <span>⚡ Sign In to Account</span>
                  </button>
                </>
              )}
            </div>

            {/* 4 Feature Highlights Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              padding: '1.5rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-card)',
              textAlign: 'left'
            }}>
              <div style={{ padding: '0.5rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>🔑</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.975rem', marginBottom: '0.2rem' }}>Unique Code</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Assigned instantly upon registration.</div>
              </div>

              <div style={{ padding: '0.5rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>💰</div>
                <div style={{ fontWeight: 700, color: 'var(--emerald-500)', fontSize: '0.975rem', marginBottom: '0.2rem' }}>Earn ₹500</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Paid per eligible student referral.</div>
              </div>

              <div style={{ padding: '0.5rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>📊</div>
                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.975rem', marginBottom: '0.2rem' }}>Live Tracking</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Real-time referral & payout dashboard.</div>
              </div>

              <div style={{ padding: '0.5rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>✨</div>
                <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.975rem', marginBottom: '0.2rem' }}>100% Free</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>No signup or membership fee ever.</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
         SECTION 2: SIMPLE EXPLANATION
         ========================================================================= */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 3.5rem auto' }}>
            <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Simple Explanation
            </div>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Turn Your Network Into an Earning Opportunity
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Know students, parents, teachers, or families looking for tutors?
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 680, margin: '0 auto' }}>
              Simply share Cuvasol Tutor with them using your personal referral code. When an eligible student joins Cuvasol Tutor using your referral code, you earn <strong style={{ color: 'var(--emerald-500)' }}>₹500</strong>.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {/* Point 1 */}
            <div className="glass-card" style={{ padding: '2.25rem', borderRadius: '20px', textAlignment: 'left' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📝</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Step 1
              </div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                Register
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Create your free agent account in under 60 seconds. No hidden fees or prerequisites.
              </p>
            </div>

            {/* Point 2 */}
            <div className="glass-card" style={{ padding: '2.25rem', borderRadius: '20px', textAlignment: 'left' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔗</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Step 2
              </div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                Share
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Get your unique referral code and share it with students, parents, and friends who need tutoring.
              </p>
            </div>

            {/* Point 3 */}
            <div className="glass-card" style={{ padding: '2.25rem', borderRadius: '20px', textAlignment: 'left', border: '1px solid var(--border-glow)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💸</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--emerald-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Step 3
              </div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                Earn ₹500
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Earn ₹500 for every eligible student who joins Cuvasol Tutor through your referral code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         SECTION 3: HOW THE REFERRAL PROGRAM WORKS
         ========================================================================= */}
      <section id="how-it-works" style={{ padding: '5.5rem 0', borderTop: '1px solid var(--border-subtle)', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3.5rem auto' }}>
            <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              How the Referral Program Works
            </div>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
              Start Earning in 3 Easy Steps
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              A straightforward process designed for maximum transparency and fast payouts.
            </p>
          </div>

          {/* 4 Step Process Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {/* 01 Register */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', position: 'relative' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                01 — Register
              </div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Create Account
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                Create your account on the Cuvasol Referral Platform with basic details.
              </p>
            </div>

            {/* 02 Get Referral Code */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', position: 'relative' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.75rem' }}>
                02 — Get Code
              </div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Unique Referral Code
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                After registration, you'll instantly receive your unique referral code.
              </p>
            </div>

            {/* 03 Refer Students */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', position: 'relative' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--solar-amber)', marginBottom: '0.75rem' }}>
                03 — Refer
              </div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Refer Students
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                Share your code with students interested in joining Cuvasol Tutor.
              </p>
            </div>

            {/* 04 Earn ₹500 */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', position: 'relative', border: '1px solid var(--emerald-500)' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--emerald-500)', marginBottom: '0.75rem' }}>
                04 — Earn ₹500
              </div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Receive ₹500
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                When an eligible student joins through your referral code, you earn ₹500.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleCTA}
              style={{ padding: '1rem 2.4rem', fontSize: '1.05rem' }}
            >
              <span>Create Your Referral Account ➔</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
         SECTION 4: WHO CAN BECOME AN AGENT?
         ========================================================================= */}
      <section id="who-can-join" style={{ padding: '5.5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 3.5rem auto' }}>
            <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Who Can Become an Agent?
            </div>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Anyone Can Join
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
              You don't need to be a professional salesperson or have previous experience.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              If you know students or parents who may need tutoring, you can participate.
            </p>
          </div>

          {/* 6 Target Persona Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Persona 1 */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '18px', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1, background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '14px' }}>👩‍🏫</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  Teachers & Tutors
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Refer students outside your teaching network or subject area.
                </p>
              </div>
            </div>

            {/* Persona 2 */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '18px', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1, background: 'var(--accent-light)', padding: '0.75rem', borderRadius: '14px' }}>🎓</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  College Students
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Share with classmates, juniors, friends, and campus network.
                </p>
              </div>
            </div>

            {/* Persona 3 */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '18px', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1, background: 'var(--teach-bg)', padding: '0.75rem', borderRadius: '14px' }}>👨‍👩‍👧</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  Parents
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Recommend Cuvasol Tutor to other parents in your community & school groups.
                </p>
              </div>
            </div>

            {/* Persona 4 */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '18px', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1, background: 'var(--grow-bg)', padding: '0.75rem', borderRadius: '14px' }}>💼</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  Working Professionals
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Earn additional income flexibly through your professional & social network.
                </p>
              </div>
            </div>

            {/* Persona 5 */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '18px', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1, background: 'var(--guide-bg)', padding: '0.75rem', borderRadius: '14px' }}>🏠</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  Homemakers
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Share with students and families in your neighborhood and community circles.
                </p>
              </div>
            </div>

            {/* Persona 6 */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '18px', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1, background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '14px' }}>📱</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  Social Media Users
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Share your referral code through your personal network and social channels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         SECTION 5: EARNING POTENTIAL & CALCULATOR
         ========================================================================= */}
      <section id="earning-potential" style={{ padding: '5.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3.5rem auto' }}>
            <div style={{ color: 'var(--emerald-500)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Earning Potential
            </div>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Earn ₹500 for Every Eligible Student
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Your earning grows with every successful referral.
            </p>
          </div>

          {/* Embedded Interactive Calculator */}
          <EarningsCalculator onClaim={handleCTA} />
        </div>
      </section>

      {/* =========================================================================
         SECTION 6: WHY BECOME A CUVASOL REFERRAL AGENT?
         ========================================================================= */}
      <section id="why-us" style={{ padding: '5.5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3.5rem auto' }}>
            <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Why Join Us?
            </div>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
              Why Become a Cuvasol Referral Agent?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              Everything you need to effortlessly refer and earn money on your own schedule.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem'
          }}>
            {/* Point 1 */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.85rem' }}>🆓</div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                Free to Join
              </h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                No registration fee to become a referral agent. Zero risk, 100% free forever.
              </p>
            </div>

            {/* Point 2 */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.85rem' }}>🏷️</div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                Unique Referral Code
              </h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Get your own personalized code immediately after registration.
              </p>
            </div>

            {/* Point 3 */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.85rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                Simple Referral Process
              </h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Share your code with students who need tutoring—no complex paperwork.
              </p>
            </div>

            {/* Point 4 */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.85rem' }}>💰</div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                Earn Per Successful Referral
              </h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Receive ₹500 for each eligible student who joins through your referral.
              </p>
            </div>

            {/* Point 5 */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.85rem' }}>📊</div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                Track Your Referrals
              </h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Access your agent dashboard to monitor real-time referral status and earnings.
              </p>
            </div>

            {/* Point 6 */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.85rem' }}>⏰</div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                Flexible
              </h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Refer students whenever and wherever you want—work on your terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         SECTION 7: HOW STUDENTS BENEFIT
         ========================================================================= */}
      <section id="student-benefits" style={{ padding: '5.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 3.5rem auto' }}>
            <div style={{ color: 'var(--teach-blue)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              How Students Benefit
            </div>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Refer Students to a Learning Platform They Can Use
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Cuvasol Tutor helps students find expert tutors across diverse learning subjects:
            </p>
          </div>

          {/* Subjects Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3rem'
          }}>
            {[
              { icon: '📚', title: 'School Subjects', desc: 'Maths, Science, Physics, Chemistry, Biology & CBSE/ICSE' },
              { icon: '🎓', title: 'College & University', desc: 'Engineering, Commerce, Arts, Business & Higher Ed' },
              { icon: '💻', title: 'Coding & Tech', desc: 'Python, Web Dev, Java, Data Science & AI skills' },
              { icon: '🗣️', title: 'Languages', desc: 'English, French, German, Spanish & Spoken English' },
              { icon: '🏆', title: 'Competitive Exams', desc: 'JEE, NEET, CUET, SAT, IELTS, TOEFL & GRE' },
              { icon: '🎵', title: 'Music', desc: 'Vocal training, Guitar, Keyboard & Classical music' },
              { icon: '🎨', title: 'Arts & Creative', desc: 'Drawing, Painting, Design & Creative Writing' },
              { icon: '💡', title: 'Other Learning', desc: 'Custom 1-on-1 tutoring for specialized courses' },
            ].map((subject, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{subject.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  {subject.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {subject.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Learning Options Strip */}
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid var(--border-medium)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Flexible Learning Options Available:
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {['🌐 Online', '🏫 Offline', '🔄 Hybrid', '👤 1-to-1 Tutoring'].map((opt, i) => (
                <span
                  key={i}
                  style={{
                    padding: '0.6rem 1.4rem',
                    borderRadius: '9999px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-medium)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         SECTION 8: WHAT HAPPENS AFTER YOU REGISTER? (YOUR REFERRAL JOURNEY)
         ========================================================================= */}
      <section style={{ padding: '5.5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3.5rem auto' }}>
            <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Step-by-Step Flow
            </div>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
              What Happens After You Register?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              Your complete referral journey from signup to earning ₹500.
            </p>
          </div>

          {/* Journey Steps Pipeline */}
          <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { step: '1. Create Account', text: 'Register as a Cuvasol referral agent for free in seconds.' },
              { step: '2. Receive Your Code', text: 'Your unique referral code becomes available immediately.' },
              { step: '3. Share Your Code', text: 'Give your code to students or parents interested in joining Cuvasol Tutor.' },
              { step: '4. Student Registers', text: 'The student joins Cuvasol Tutor using your referral code during signup.' },
              { step: '5. Referral Is Tracked', text: 'The referral is automatically associated with your agent dashboard account.' },
              { step: '6. Earn ₹500', text: 'Once the referral meets eligibility requirements, ₹500 is credited according to payment terms.' },
            ].map((item, idx, arr) => (
              <React.Fragment key={idx}>
                <div
                  className="glass-card"
                  style={{
                    padding: '1.5rem 2rem',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    borderLeft: idx === arr.length - 1 ? '4px solid var(--emerald-500)' : '4px solid var(--primary)'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: idx === arr.length - 1 ? 'var(--emerald-500)' : 'var(--primary)', minWidth: 200 }}>
                    {item.step}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', flex: 1, textAlign: 'left' }}>
                    {item.text}
                  </div>
                </div>
                {idx < arr.length - 1 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '1.25rem', lineHeight: 1 }}>
                    ↓
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>




      {/* =========================================================================
         SECTION: ABOUT US
         ========================================================================= */}
      <section id="about-us" style={{ padding: '5.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 3.5rem auto' }}>
            <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              About Us
            </div>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Empowering Education Through Community
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Cuvasol Tutor connects students with top educators across India. Our referral platform empowers individuals from all walks of life to recommend quality education while building a reliable stream of income.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🎯</div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Our Mission
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                To bridge the gap between quality tutors and students while creating rewarding referral opportunities for everyone.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🤝</div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Community Focused
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Built for teachers, parents, students, homemakers, and professionals to leverage their personal networks seamlessly.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>💎</div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Transparent Payouts
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Earn ₹500 for every qualifying referral with real-time tracking and reliable payout terms.
              </p>
            </div>
          </div>
        </div>
      </section>


      

      {/* =========================================================================
         SECTION 10: STRONG CTA SECTION
         ========================================================================= */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{
            background: 'var(--grad-hero)',
            color: '#FFFFFF',
            borderRadius: '28px',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(27, 147, 130, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'inline-block', padding: '0.35rem 1rem', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                🔥 Get Started Today
              </div>

              <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                Your Network Can Become Your Opportunity
              </h2>

              <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#E6F5F3', marginBottom: '1rem' }}>
                Know a student looking for a tutor?
              </p>

              <p style={{ fontSize: '1.05rem', color: '#D1FAE5', lineHeight: 1.6, maxWidth: 680, margin: '0 auto 2.5rem auto' }}>
                Don't just recommend Cuvasol Tutor — refer them using your unique code and earn ₹500 when the referral qualifies.
              </p>

              <button
                className="btn"
                onClick={() => onNavigate('signup')}
                style={{
                  background: '#FFFFFF',
                  color: '#1B9382',
                  padding: '1.1rem 2.8rem',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  borderRadius: '9999px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span>Register Free & Get Your Code 🚀</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '2.5rem 0',
        background: 'var(--bg-card)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img src="/CuvaLogo-1024.png" alt="Cuvasol" style={{ height: 28, width: 28, objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Cuvasol</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Cuvasol Agent Cloud. Referral Program & MongoDB Integrated.
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
