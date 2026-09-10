import React, { useState } from 'react';
import { EarningsCalculator } from '../components/EarningsCalculator';
import { PublicInquiryModal } from '../components/Modals/PublicInquiryModal';

export function LandingPage({ onNavigate }) {
  const [activeFaq, setActiveFaq] = useState(0);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: 'What is the Teach • Grow • Guide model at Cuvasol?',
      a: 'Cuvasol combines educational mastery (Teach: turnkey ad scripts, video masterclasses, and B2B swipe files), AI-boosted funnel scaling (Grow: real-time attribution, lead matching, up to 15% commission), and personalized 1-on-1 engineering mentorship (Guide: technical scoping assistance and dedicated deal closers).'
    },
    {
      q: 'How does Cuvasol attribute leads to my agent account?',
      a: 'Every marketing partner receives a unique tracking slug, parameterized UTM tags, and a custom referral domain. Our 90-day cookie window and server-side webhook tracking ensure 100% accurate attribution even if a homeowner or commercial facility converts weeks later on a phone call.'
    },
    {
      q: 'When and how do I receive commission payouts?',
      a: 'Commissions are unlocked within 24 hours of solar proposal contract confirmation or system installation sign-off. You can withdraw instantly to any US bank account via ACH/Wire, Stripe Connect, or receive USDT crypto settlements with zero platform fees.'
    },
    {
      q: 'Can I use my own ad creatives and custom landing pages?',
      a: 'Yes! You can either use our pre-tested, compliant video ads and email sequences from the Asset Vault, or build your own custom landing pages and connect them via your Cuvasol Agent API webhook.'
    },
    {
      q: 'Are there any setup fees or monthly charges to join?',
      a: 'Zero fees. The Cuvasol Agent Cloud is 100% free for approved marketing partners and tutors. We succeed exclusively when you generate verified solar and cleantech deal volume.'
    }
  ];

  return (
    <div className="landing-page-root">
      {/* Hero Section (Matching tutor.cuvasol.com Hero) */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-banner-container text-center">
            <div className="hero-badge-wrap">
              <span className="badge-pulse-dot" style={{ background: '#FFFFFF', boxShadow: '0 0 10px #FFFFFF' }}></span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>
                🎓 Teach • 🌱 Grow • 🧭 Guide — Cuvasol Growth & Learning Platform
              </span>
            </div>

            <h1 className="hero-title">
              Empowering High-Yield Growth for <br />
              <span style={{ color: '#FEE5A5' }}>CleanTech Marketing & Solar Agents</span>
            </h1>

            <p className="hero-subtitle">
              Master the playbooks (Teach), scale multi-channel solar funnels (Grow), and partner with dedicated engineering mentors (Guide) with instant 24-hour commission payouts.
            </p>

            <div className="hero-cta-group">
              <button className="btn btn-hero-primary btn-lg" onClick={() => onNavigate('signup')}>
                <span>🚀 Join as Marketing Agent</span>
              </button>
              <button className="btn btn-hero-secondary btn-lg" onClick={() => onNavigate('login')}>
                <span>⚡ Launch Agent Portal</span>
              </button>
              <button className="btn btn-hero-secondary btn-lg" onClick={() => setIsInquiryOpen(true)}>
                <span>☀️ Request Solar Quote</span>
              </button>
            </div>

            {/* Quick Search / Filter Bar (Tutor Style) */}
            <div className="hero-search-bar">
              <div className="search-input-pill">
                <span style={{ fontSize: '1.2rem' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search campaigns, solar playbooks, or guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="search-input-pill" style={{ maxWidth: '220px' }}>
                <span style={{ fontSize: '1.2rem' }}>🏷️</span>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="all">All Ecosystems</option>
                  <option value="teach">🎓 Teach (Courses & Playbooks)</option>
                  <option value="grow">🌱 Grow (Solar Funnels & Ads)</option>
                  <option value="guide">🧭 Guide (1-on-1 Mentorship)</option>
                </select>
              </div>

              <button
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-md)' }}
                onClick={() => onNavigate('signup')}
              >
                Find & Start
              </button>
            </div>
          </div>

          {/* Hero Stats Strip */}
          <div className="hero-stats-strip">
            <div className="hero-stat-item">
              <div className="hero-stat-value">$14.2M+</div>
              <div className="hero-stat-label">Commissions Distributed</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-value" style={{ color: 'var(--accent)' }}>98.4%</div>
              <div className="hero-stat-label">AI Lead Quality Score</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-value" style={{ color: 'var(--grow-green)' }}>&lt; 24 Hrs</div>
              <div className="hero-stat-label">Instant Payout Settlement</div>
            </div>
            <div className="hero-stat-item">
              <div className="hero-stat-value" style={{ color: '#D97706' }}>Up to 15%</div>
              <div className="hero-stat-label">Top Tier Commission Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3 PILLARS: TEACH • GROW • GUIDE ================= */}
      <section className="section" id="teach" style={{ background: 'var(--bg-secondary)', padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Cuvasol Flywheel</span>
            <h2>How We Power Your Success: <span className="text-primary-brand">Teach • Grow • Guide</span></h2>
            <p>A complete institutional ecosystem taking you from marketing fundamentals to scaling 5-figure monthly recurring clean energy commissions.</p>
          </div>

          <div className="pillars-grid">
            {/* PILLAR 1: TEACH */}
            <div className="pillar-card teach">
              <div className="pillar-icon-box">🎓</div>
              <div>
                <span className="pillar-tag">Pillar 1: Mastery</span>
              </div>
              <h3 className="font-serif">TEACH & Learn</h3>
              <p>
                Access proven video masterclasses, TikTok UGC scripts, B2B CFO outreach sequences, and regulatory ITC tax incentive blueprints crafted by 8-figure clean energy marketers.
              </p>
              <ul className="pillar-features">
                <li><span className="pillar-check">✓</span> Daily updated swipe files in Asset Vault</li>
                <li><span className="pillar-check">✓</span> High-converting TikTok & Meta video hooks</li>
                <li><span className="pillar-check">✓</span> Enterprise CleanTech pitch deck templates</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <button className="btn btn-outline-teal btn-sm" style={{ width: '100%' }} onClick={() => onNavigate('signup')}>
                  Access Learning Vault ➔
                </button>
              </div>
            </div>

            {/* PILLAR 2: GROW */}
            <div className="pillar-card grow" id="grow">
              <div className="pillar-icon-box">🌱</div>
              <div>
                <span className="pillar-tag">Pillar 2: Scaling</span>
              </div>
              <h3 className="font-serif">GROW & Yield</h3>
              <p>
                Deploy AI-scored solar funnels with sub-second UTM attribution. Collect high-ticket commissions starting from 10% up to 15% with accelerated milestone bonuses.
              </p>
              <ul className="pillar-features">
                <li><span className="pillar-check">✓</span> AI pre-qualified rooftop solar intelligence</li>
                <li><span className="pillar-check">✓</span> Real-time multi-channel click tracking</li>
                <li><span className="pillar-check">✓</span> 24-hr instant payouts via ACH, Wire, or USDT</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <a href="#calculator" className="btn btn-primary btn-sm" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  Calculate Earning Potential ➔
                </a>
              </div>
            </div>

            {/* PILLAR 3: GUIDE */}
            <div className="pillar-card guide" id="guide">
              <div className="pillar-icon-box">🧭</div>
              <div>
                <span className="pillar-tag">Pillar 3: Mentorship</span>
              </div>
              <h3 className="font-serif">GUIDE & Close</h3>
              <p>
                You don't need to be an engineer. You generate the leads, and our dedicated sales engineering mentors perform the site surveys, ROI models, and close deals for you.
              </p>
              <ul className="pillar-features">
                <li><span className="pillar-check">✓</span> 1-on-1 growth advisor pairing</li>
                <li><span className="pillar-check">✓</span> Full commercial proposal engineering support</li>
                <li><span className="pillar-check">✓</span> Real-time transparent deal CRM status</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <button className="btn btn-coral btn-sm" style={{ width: '100%' }} onClick={() => onNavigate('signup')}>
                  Connect with Mentor ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Agent Arsenal</span>
            <h2>Everything You Need to <span className="text-primary-brand">Scale Your Growth</span></h2>
            <p>We provide marketing creators, media buyers, and affiliate growth specialists with institutional-grade infrastructure.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠</div>
              <h3 className="font-serif" style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}>AI Lead Intelligence</h3>
              <p style={{ fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                Our machine learning engine pre-qualifies rooftop solar data, utility bill viability, and credit pre-scores so you only get rewarded for high-intent closes.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-teal">98% Accuracy</span>
                <span className="badge badge-blue">Instant Scoring</span>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
              <h3 className="font-serif" style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}>Turnkey Marketing Kits</h3>
              <p style={{ fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                Access high-converting TikTok UGC scripts, Meta video ads, Google search copy, and B2B LinkedIn sequences crafted by 8-figure growth marketers.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-teal">1-Click Copy</span>
                <span className="badge badge-purple">Daily Updates</span>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💸</div>
              <h3 className="font-serif" style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}>Instant 24-Hr Payouts</h3>
              <p style={{ fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                No waiting 60 days for network settlements. As soon as solar installation contracts confirm, commissions hit your wallet via ACH, Wire, or USDT.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-green">Daily Liquidity</span>
                <span className="badge badge-gold">Crypto / Fiat</span>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
              <h3 className="font-serif" style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}>Sub-Second Attribution</h3>
              <p style={{ fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                Deep UTM tracking, custom sub-IDs, webhook integrations, and real-time click-to-conversion analytics to optimize your ad spend with pinpoint precision.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-teal">Zero Data Loss</span>
                <span className="badge badge-blue">Server-Side API</span>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📈</div>
              <h3 className="font-serif" style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}>Tiered Milestone Bonuses</h3>
              <p style={{ fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                Accelerate your baseline 10% rate up to 15% plus monthly cash bonuses up to $10,000 as your deal volume expands month-over-month.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-gold">Diamond Club</span>
                <span className="badge badge-green">Cash Accelerators</span>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤝</div>
              <h3 className="font-serif" style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}>Dedicated Agent Success</h3>
              <p style={{ fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                Get paired with an exclusive growth advisor who provides custom landing page splits, regional tariff insights, and creative optimization audits.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-teal">1-on-1 Mentorship</span>
                <span className="badge badge-purple">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Calculator */}
      <section className="section" id="calculator" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Interactive Estimator</span>
            <h2>Calculate Your <span className="text-primary-brand">Earning Potential</span></h2>
            <p>Adjust the sliders below to see your projected monthly commissions and milestone accelerator bonuses.</p>
          </div>

          <EarningsCalculator onClaim={() => onNavigate('signup')} />
        </div>
      </section>

      {/* Leaderboard */}
      <section className="section" id="leaderboard">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Proof of Performance</span>
            <h2>Top Partner <span className="text-primary-brand">Leaderboard</span></h2>
            <p>Live verified monthly earnings from our top performing clean energy marketing partners.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  #1
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>David K. • SolarWave Media</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Meta Video Ads Specialist</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)' }}>$48,920.00</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>19 Closed Deals</div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  #2
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Sarah Jenkins</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Omnichannel Solar & Storage</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent)' }}>$36,450.00</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>14 Closed Deals</div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0284C7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  #3
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Alex Rivera Growth Labs</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>B2B CleanTech Commercial</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#0284C7' }}>$29,180.00</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>9 Commercial Closes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Frequently Asked Questions</span>
            <h2>Program <span className="text-primary-brand">FAQ</span></h2>
            <p>Everything you need to know about payouts, lead attribution, and compliance.</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <div
                  className="faq-question"
                  onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '1.4rem', color: 'var(--primary)', transform: activeFaq === idx ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease' }}>+</span>
                </div>
                {activeFaq === idx && (
                  <div className="faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Inbound Lead Modal */}
      <PublicInquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#landing" onClick={() => onNavigate('landing')} className="brand-logo" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
                <img src="/assets/logo.png" alt="Cuvasol" style={{ height: 38, width: 38, objectFit: 'contain' }} />
                <span style={{ fontSize: '1.45rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Cuvasol
                </span>
              </a>
              <p>The premier Teach • Grow • Guide ecosystem accelerating clean energy and high-yield marketing partners globally.</p>
            </div>

            <div className="footer-col">
              <h4>Teach & Grow</h4>
              <ul>
                <li><a href="#teach">Mastery & Playbooks</a></li>
                <li><a href="#grow">AI Funnel Engine</a></li>
                <li><a href="#guide">Engineering Mentorship</a></li>
                <li><a href="#calculator">ROI Calculator</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Cuvasol Hub</h4>
              <ul>
                <li><a href="https://tuto.cuvasol.com" target="_blank" rel="noopener noreferrer">Learning Platform (tuto)</a></li>
                <li><a href="https://tutor.cuvasol.com" target="_blank" rel="noopener noreferrer">Student Hub (tutor)</a></li>
                <li><a href="#login" onClick={() => onNavigate('login')}>Agent Portal Login</a></li>
                <li><a href="#signup" onClick={() => onNavigate('signup')}>Join as Partner</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Compliance</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">FTC Guidelines</a></li>
                <li><a href="#">Attribution Network</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>© 2026 Cuvasol Technologies, Inc. All rights reserved. Teach • Grow • Guide.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge-pulse-dot" style={{ width: 6, height: 6 }}></span>
              <span>All Attribution Nodes Operational (99.99%)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
