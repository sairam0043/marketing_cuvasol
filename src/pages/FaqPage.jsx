import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';

export function FaqPage({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'earning',
      question: 'How much money do I earn for each referred student?',
      answer: 'You earn ₹500 for every eligible student who joins Cuvasol Tutor using your unique referral code. Earnings scale directly with your referrals (e.g. 5 students = ₹2,500, 10 students = ₹5,000, 50 students = ₹25,000).'
    },
    {
      category: 'earning',
      question: 'When and how are referral earnings paid to me?',
      answer: 'Once a referred student completes program eligibility verification, your ₹500 reward is credited to your dashboard account balance. You can withdraw payouts directly to your linked UPI ID or bank account.'
    },
    {
      category: 'program',
      question: 'Is there any fee or hidden charge to join as a Referral Agent?',
      answer: 'No! Registration as a Cuvasol Referral Agent is 100% free with zero registration, membership, or maintenance fees ever.'
    },
    {
      category: 'program',
      question: 'Who is eligible to become a Cuvasol Referral Agent?',
      answer: 'Anyone can join! No prior sales experience is required. Teachers, college students, parents, working professionals, homemakers, and social media influencers are all welcome.'
    },
    {
      category: 'account',
      question: 'How do I obtain my unique referral code and link?',
      answer: 'Immediately after signing up for your free account, your unique referral code (e.g. CUVASOL-8850) and 1-click shareable registration link become available in your dashboard.'
    },
    {
      category: 'account',
      question: 'How can I track the status of students I referred?',
      answer: 'Log into your Cuvasol Agent Dashboard to view live counters for Total Referrals, Successful Referrals, Pending Verification, Total Earnings, Paid Amount, and Pending Amount.'
    },
    {
      category: 'program',
      question: 'Which subjects and courses does Cuvasol Tutor cover?',
      answer: 'Cuvasol Tutor supports School Subjects (Maths, Science, CBSE/ICSE), College & University degrees, Coding & Technology, Foreign Languages, Competitive Exams (JEE/NEET/CUET/GRE), Music, and Arts.'
    },
    {
      category: 'account',
      question: 'Is there a limit on how many students I can refer?',
      answer: 'There is no upper limit! You can refer as many students as you like and earn ₹500 for every single qualifying referral.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar onNavigate={onNavigate} />

      {/* Hero Banner */}
      <section style={{ paddingTop: '8.5rem', paddingBottom: '4.5rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 840 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.1rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
            ❓ Help & FAQ Center
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 680, margin: '0 auto 2rem auto' }}>
            Find quick answers to common questions about earning ₹500 per referral, getting your code, and managing your dashboard.
          </p>

          {/* Live Search Input */}
          <div style={{ maxWidth: 540, margin: '0 auto', position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.1rem',
                color: 'var(--primary)',
                pointerEvents: 'none',
                zIndex: 2
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search questions (e.g., payouts, earnings, code)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control faq-search-input"
              style={{
                width: '100%',
                padding: '1rem 3rem 1rem 3.1rem',
                borderRadius: '9999px',
                fontSize: '1rem',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '1.1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--bg-tertiary)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  transition: 'all 0.2s ease'
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Tabs & FAQ List */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: 900 }}>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'earning', label: '💰 Earnings & Payouts' },
              { id: 'program', label: '📋 Program Rules' },
              { id: 'account', label: '🔑 Code & Dashboard' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '0.6rem 1.3rem',
                  borderRadius: '9999px',
                  border: activeCategory === cat.id ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                  background: activeCategory === cat.id ? 'var(--primary-light)' : 'var(--bg-card)',
                  color: activeCategory === cat.id ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: activeCategory === cat.id ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion FAQ Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '4rem' }}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{
                      borderRadius: '18px',
                      overflow: 'hidden',
                      border: isOpen ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '1.5rem 2rem',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '1.1rem', fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {faq.question}
                      </span>
                      <span style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 800, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}>
                        ▼
                      </span>
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0 2rem 1.5rem 2rem', color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.65, borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                <p>No questions found matching "{searchTerm}".</p>
              </div>
            )}
          </div>

          {/* Still Have Questions Banner */}
          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border-medium)' }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Still Have Questions?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Our dedicated support team is available to assist you with registration, code tracking, or payouts.
            </p>
            <button className="btn btn-primary" onClick={() => onNavigate('contact')} style={{ padding: '0.85rem 2rem', borderRadius: '9999px' }}>
              <span>Contact Support Team ✉️</span>
            </button>
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
