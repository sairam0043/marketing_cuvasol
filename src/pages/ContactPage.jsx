import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';

export function ContactPage({ onNavigate }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'referral', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar onNavigate={onNavigate} />

      {/* Hero Banner */}
      <section style={{ paddingTop: '8.5rem', paddingBottom: '4.5rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 840 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.1rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
            💬 24/7 Agent Help & Support
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Contact Cuvasol Support Team
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 680, margin: '0 auto' }}>
            Have questions about referral eligibility, payout options, or code tracking? Reach out to our team and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Form & Contact Info */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: 1050, margin: '0 auto' }}>

            {/* Left Contact Information Card */}
            <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                  Get in Touch Directly
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
                  {/* Email */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem', background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '14px', lineHeight: 1 }}>📧</div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Email Support</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.2rem' }}>support@cuvasol.com</div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem', background: 'var(--accent-light)', padding: '0.75rem', borderRadius: '14px', lineHeight: 1 }}>📞</div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Phone Number</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.2rem' }}>+91 95385 17963</div>
                    </div>
                  </div>

                  {/* Address */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem', background: 'var(--grow-bg)', padding: '0.75rem', borderRadius: '14px', lineHeight: 1 }}>📍</div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Address</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginTop: '0.2rem', lineHeight: 1.5 }}>
                        HD-169, We Work, 78 Old Madras Road,<br />
                        Salarpuria Magnificia, Tin Factory,<br />
                        Mahadevapura, Bangalore 560016,<br />
                        Karnataka, IN
                      </div>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem', background: 'var(--guide-bg)', padding: '0.75rem', borderRadius: '14px', lineHeight: 1 }}>🕒</div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Operating Hours</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.2rem' }}>Monday – Saturday</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>9:00 AM – 6:00 PM IST</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Looking for quick self-service? </span>
                <button onClick={() => onNavigate('faq')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', fontSize: '0.875rem' }}>
                  Visit FAQ Page ➔
                </button>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                Send Us a Message
              </h2>

              {submitted ? (
                <div style={{ background: 'var(--grow-bg)', border: '1px solid var(--emerald-500)', borderRadius: '18px', padding: '2.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--emerald-500)', marginBottom: '0.5rem' }}>
                    Message Received!
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Thank you for contacting Cuvasol Agent Support. One of our support specialists will get back to you shortly at <strong>{formData.email}</strong>.
                  </p>
                  <button className="btn btn-emerald" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: 'referral', message: '' }); }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label htmlFor="c-name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Your Full Name</label>
                    <input
                      id="c-name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label htmlFor="c-email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Email Address</label>
                      <input
                        id="c-email"
                        type="email"
                        required
                        placeholder="rahul@example.com"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="c-phone" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Phone Number</label>
                      <input
                        id="c-phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label htmlFor="c-subject" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Inquiry Topic</label>
                    <select
                      id="c-subject"
                      className="form-control"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="referral">💰 Referral Reward Inquiry (₹500 Payout)</option>
                      <option value="code">🔑 Referral Code / Link Issue</option>
                      <option value="tutor">📚 Tutor / Course Question</option>
                      <option value="account">👤 Agent Account Assistance</option>
                      <option value="other">💬 General Support Query</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.75rem' }}>
                    <label htmlFor="c-msg" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Message Details</label>
                    <textarea
                      id="c-msg"
                      rows="4"
                      required
                      placeholder="Please describe how we can assist you..."
                      className="form-control"
                      style={{ resize: 'vertical' }}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary w-full btn-lg" style={{ width: '100%', borderRadius: '9999px' }}>
                    <span>Send Inquiry to Support 🚀</span>
                  </button>
                </form>
              )}
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
