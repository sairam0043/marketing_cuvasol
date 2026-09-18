import React from 'react';
import { Navbar } from '../components/Navbar';

export function AboutPage({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar onNavigate={onNavigate} />

      {/* Hero Banner */}
      <section style={{ paddingTop: '8.5rem', paddingBottom: '4.5rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 840 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.1rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
            ⚡ About Cuvasol Tutor
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Empowering Education Across India Through Community Networks
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 740, margin: '0 auto' }}>
            Cuvasol Tutor is a premier learning platform connecting students with expert tutors. Our Referral Network enables teachers, parents, college students, professionals, and community members to recommend quality education while earning <strong style={{ color: 'var(--emerald-500)' }}>₹500</strong> for every successful student referral.
          </p>
        </div>
      </section>

      {/* Stats Banner */}
      <section style={{ padding: '3.5rem 0', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)' }}>50,000+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Students Connected</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--emerald-500)' }}>10,000+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Verified Tutors</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)' }}>₹500</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Fixed Referral Reward</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--solar-amber)' }}>100%</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Free Agent Signup</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Mission */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            
            {/* Mission Box */}
            <div className="glass-card" style={{ padding: '3rem', borderRadius: '24px', marginBottom: '3.5rem' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                Our Core Mission
              </div>
              <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                Making Quality Learning Accessible to Every Student
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                At Cuvasol, we believe that finding the right tutor should be effortless, personalized, and accessible to families everywhere. Whether a student needs support in school academics, college engineering, competitive exams (JEE/NEET/CUET), coding, or creative arts, Cuvasol Tutor provides 1-to-1, online, offline, and hybrid learning options tailored to their needs.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                To accelerate learning access, we established the <strong>Cuvasol Tutor Referral Program</strong>. By turning word-of-mouth recommendations into a structured earning opportunity, we reward community members with ₹500 for every qualifying student they introduce to Cuvasol.
              </p>
            </div>

            {/* Core Values */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Our Core Values
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.35rem' }}>
                Guided by integrity, transparency, and educational excellence.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem', marginBottom: '4rem' }}>
              <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🎯</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Integrity & Fairness</h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Guaranteed payouts of ₹500 per qualifying referral with transparent dashboard tracking and zero hidden rules.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🤝</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Community Empowerment</h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Creating flexible earning opportunities for teachers, college students, homemakers, and working professionals.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>📚</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Educational Quality</h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Vetted tutors across 50+ academic, professional, and skill subjects ensure students get the best guidance.
                </p>
              </div>
            </div>

            {/* Bottom CTA Banner */}
            <div style={{ background: 'var(--grad-hero)', color: '#FFFFFF', padding: '3.5rem 2rem', borderRadius: '24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem', color: '#FFFFFF' }}>
                Ready to Join the Cuvasol Network?
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#D1FAE5', marginBottom: '2rem', maxWidth: 600, margin: '0 auto 2rem auto' }}>
                Register for free today, get your personal referral code, and start earning ₹500 per referral.
              </p>
              <button className="btn" onClick={() => onNavigate('signup')} style={{ background: '#FFFFFF', color: '#1B9382', padding: '1rem 2.5rem', fontWeight: 800, borderRadius: '9999px', fontSize: '1.05rem' }}>
                Create Free Account 🚀
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '2.5rem 0', background: 'var(--bg-card)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img src="/CuvaLogo-1024.png" alt="Cuvasol" style={{ height: 28, width: 28, objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Cuvasol</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Cuvasol Agent Cloud. All rights reserved.
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
