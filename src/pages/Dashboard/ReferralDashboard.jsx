import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function ReferralDashboard({ onNavigateLanding }) {
  const { user, token, logout } = useAuth();
  const { showToast } = useToast();

  const [referralData, setReferralData] = useState({
    referralCode: user?.referralCode || '',
    totalReferrals: 0,
    referredUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick test simulation states
  const [testName, setTestName] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchReferralStats = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/referrals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setReferralData(data);
      }
    } catch (err) {
      console.error('Error loading referrals:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReferralStats();
  }, [fetchReferralStats]);

  const referralCode = referralData?.referralCode || user?.referralCode || 'SARIT1218';
  const studentInviteLink = `https://tutor.cuvasol.com/register/student?ref=${referralCode}`;
  const partnerInviteLink = `${window.location.origin}/#signup?ref=${referralCode}`;

  const formatStudentReferralMessage = (code) => {
    const c = code || 'SARIT1218';
    const link = `https://tutor.cuvasol.com/register/student?ref=${c}`;
    return `Hi there,

🎉 I’m excited to share something new with you!

I’m now part of the Cuvasol Tutor Referral Program! 🙌

The Cuvasol Tutor community has already grown to 250+ tutors, and I can now refer students to the platform and earn rewards. 💰

If you or someone you know is looking for online tutoring, academic support, or extracurricular classes, you can register through my referral link:

A referral is considered successful when the student registers through my link and completes a class on Cuvasol.

I’d really appreciate it if you could share this with students, parents, friends, or anyone looking for a tutor. 

✨ Register through my link and start learning with Cuvasol Tutor!

I invite you to register as a student on Cuvasol Tutor using my referral code: ${c} or link:
${link}

Start your learning journey today!`;
  };

  const formattedStudentMessage = formatStudentReferralMessage(referralCode);

  const [activeLinkTab, setActiveLinkTab] = useState('student'); // 'student' or 'partner'
  const [copiedStudentLink, setCopiedStudentLink] = useState(false);
  const [copiedPartnerLink, setCopiedPartnerLink] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    showToast(`Referral code "${referralCode}" copied to clipboard! 📋`, 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyStudentLink = () => {
    navigator.clipboard.writeText(formattedStudentMessage);
    setCopiedStudentLink(true);
    showToast('Referral invitation copied to clipboard! 📋', 'success');
    setTimeout(() => setCopiedStudentLink(false), 2500);
  };

  const handleCopyPartnerLink = () => {
    navigator.clipboard.writeText(partnerInviteLink);
    setCopiedPartnerLink(true);
    showToast('Marketer partner invite link copied! 🤝', 'success');
    setTimeout(() => setCopiedPartnerLink(false), 2500);
  };

  const handleCopyLink = handleCopyStudentLink;

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedStudentMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handler to simulate a friend signing up with this user's referral code
  const handleSimulateReferral = async (e) => {
    e.preventDefault();
    if (!testName.trim() || !testEmail.trim()) {
      showToast('Please enter a test name and email.', 'warning');
      return;
    }

    setIsSimulating(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: testName.trim(),
          email: testEmail.trim(),
          password: 'password123',
          referralCodeUsed: referralCode
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to simulate referral');
      }

      showToast(`🎉 New referral registered: ${testName}! Counter updated!`, 'success');
      setTestName('');
      setTestEmail('');
      // Refresh real-time referrals count from MongoDB
      await fetchReferralStats();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top Navbar */}
      <header style={{
        background: 'rgba(10, 16, 32, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.85rem 1.5rem'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="#landing"
              onClick={(e) => { e.preventDefault(); onNavigateLanding(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}
            >
              <img src="/CuvaLogo-1024.png" alt="Cuvasol" style={{ height: 36, width: 36, objectFit: 'contain' }} />
              <span style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Cuvasol
              </span>
            </a>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '9999px',
              padding: '2px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>●</span> MongoDB Connected
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={() => onNavigateLanding('dashboard')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>📊 Main Dashboard</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name || 'Agent'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email || 'agent@cuvasol.io'}</div>
              </div>
              <div className="user-avatar" style={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                {user?.avatar || 'AG'}
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem 4rem 1.5rem' }}>
        
        {/* Header Title Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <button
              onClick={() => onNavigateLanding('dashboard')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--cyan-400)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ← Back to Overview
            </button>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
            Referral Rewards & Attribution
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0, maxWidth: 700 }}>
            Share your student referral link for <strong>tutor.cuvasol.com</strong>. When a student registers and completes their first class, you earn <strong>₹500</strong> directly to your wallet!
          </p>
        </div>

        {/* Top Key Metrics / Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          
          {/* Card 1: Your Referral Code */}
          <div className="glass-card" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(0, 240, 255, 0.25)' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, background: 'rgba(0, 240, 255, 0.1)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🎁 Your Personal Referral Code
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.75rem 0', flexWrap: 'nowrap' }}>
              <div style={{
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px dashed var(--cyan-400)',
                color: '#00f0ff',
                fontFamily: 'monospace',
                fontSize: '1.15rem',
                fontWeight: 800,
                padding: '0.55rem 0.9rem',
                borderRadius: '10px',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1
              }}>
                {referralCode}
              </div>

              <button
                onClick={handleCopyCode}
                className="btn btn-primary btn-sm"
                style={{ height: 40, padding: '0 14px', borderRadius: '10px', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {copiedCode ? '✓ Copied' : 'Copy Code'}
              </button>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Works across tutor.cuvasol.com student registrations and partner signups.
            </div>
          </div>

          {/* Card 2: Total Referrals Count */}
          <div className="glass-card" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              👥 Total Referrals Completed
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', margin: '0.5rem 0' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#34d399', lineHeight: 1 }}>
                {loading ? '...' : referralData.totalReferrals}
              </span>
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {referralData.totalReferrals === 1 ? 'Person Referred' : 'People Referred'}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time verified signups tracked in MongoDB Atlas.
            </div>
          </div>

          {/* Card 3: Referral Status */}
          <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ Member Account Status
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0.75rem 0' }}>
              <span style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                padding: '4px 14px',
                borderRadius: '9999px',
                fontSize: '0.9rem',
                fontWeight: 700
              }}>
                {user?.tier || 'Active Member'}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Since {user?.joinedDate || '2026'}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ₹500 instant wallet credit unlocked on each completed class.
            </div>
          </div>

        </div>

        {/* 1-Click Referral Link Share Box with Student & Partner Tabs */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem', border: '1px solid rgba(0, 240, 255, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>🔗</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Your 1-Click Shareable Referral Links</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Choose what type of link you want to share</span>
              </div>
            </div>

            {/* Toggle Tabs */}
            <div style={{ display: 'inline-flex', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
                type="button"
                onClick={() => setActiveLinkTab('student')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: activeLinkTab === 'student' ? 'linear-gradient(135deg, #00f0ff, #3b82f6)' : 'transparent',
                  color: activeLinkTab === 'student' ? '#060913' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                🎓 Student Class Invite (tutor.cuvasol.com)
              </button>
              <button
                type="button"
                onClick={() => setActiveLinkTab('partner')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: activeLinkTab === 'partner' ? 'linear-gradient(135deg, #818cf8, #a855f7)' : 'transparent',
                  color: activeLinkTab === 'partner' ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                🤝 Marketer Partner Invite
              </button>
            </div>
          </div>

          {activeLinkTab === 'student' ? (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                Share your referral link with students and parents. When they click it, your referral code <strong style={{ color: '#00f0ff' }}>{referralCode}</strong> is automatically applied on <strong>tutor.cuvasol.com</strong>. When they complete their first class, you earn <strong>₹500</strong>!
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="text"
                  readOnly
                  value={studentInviteLink}
                  style={{
                    flex: 1,
                    minWidth: 280,
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: '#00f0ff',
                    fontFamily: 'monospace',
                    fontSize: '0.92rem'
                  }}
                />
                <button
                  onClick={handleCopyStudentLink}
                  className="btn btn-primary"
                  style={{ padding: '0 20px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>{copiedStudentLink ? '✓ Copied!' : 'Copy Student Link'}</span>
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="btn"
                  style={{
                    background: '#25D366',
                    color: '#060913',
                    fontWeight: 700,
                    padding: '0 20px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>📲 Share on WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                Share this link with fellow affiliate marketers to invite them to join the Cuvasol marketing network under your referral code.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="text"
                  readOnly
                  value={partnerInviteLink}
                  style={{
                    flex: 1,
                    minWidth: 280,
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(129, 140, 248, 0.3)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: '#818cf8',
                    fontFamily: 'monospace',
                    fontSize: '0.92rem'
                  }}
                />
                <button
                  onClick={handleCopyPartnerLink}
                  className="btn btn-emerald"
                  style={{ padding: '0 20px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>{copiedPartnerLink ? '✓ Copied!' : 'Copy Marketer Link'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Grid: Referred Users Table + Quick Simulator */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
          
          {/* Left Column: List of People Referred */}
          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                  👥 People You Have Referred ({referralData.totalReferrals})
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Users registered with referral code: <strong>{referralCode}</strong>
                </span>
              </div>
              <button
                onClick={fetchReferralStats}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                title="Refresh from MongoDB"
              >
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div className="badge-pulse-dot" style={{ margin: '0 auto 1rem auto' }}></div>
                <p>Loading referral records from MongoDB...</p>
              </div>
            ) : (!referralData?.referredUsers || referralData.referredUsers.length === 0) ? (
              <div style={{
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                border: '1px dashed rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>✨</div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>No Referrals Recorded Yet</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 420, margin: '0 auto 1.5rem auto' }}>
                  Share your referral code <code style={{ color: '#00f0ff', background: 'rgba(0, 240, 255, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{referralCode}</code> with your network. Once someone signs up, their profile will appear here instantly!
                </p>
                <button onClick={handleCopyStudentLink} className="btn btn-primary btn-sm">
                  <span>Copy Student Invite Link ➔</span>
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Referred User</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Date Joined</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(referralData?.referredUsers || []).map((refUser, idx) => (
                      <tr
                        key={refUser.id || idx}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'background 0.2s ease'
                        }}
                      >
                        <td style={{ padding: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'rgba(0, 240, 255, 0.15)',
                            color: '#00f0ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}>
                            {refUser.name ? refUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                          </div>
                          <span>{refUser.name}</span>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {refUser.email}
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {refUser.joinedDate || 'Recently'}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <span style={{
                            background: 'rgba(16, 185, 129, 0.12)',
                            color: '#34d399',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            ✓ Verified Referral
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column: Live Referral Tester Tool */}
          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🧪</span>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Test Your Referral Link</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 1.25rem 0' }}>
              Want to see the referral counter increase? Fill in a name and test email below to simulate a referral signup using your code.
            </p>

            <form onSubmit={handleSimulateReferral}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Friend's Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Jordan Miller"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Friend's Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. jordan.test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '1.25rem'
              }}>
                Referral Code Applied: <strong style={{ color: '#00f0ff' }}>{referralCode}</strong>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSimulating}
                style={{ padding: '10px' }}
              >
                {isSimulating ? 'Creating Referral in DB...' : '⚡ Simulate Referral Signup'}
              </button>
            </form>
          </div>

        </div>

      </main>
    </div>
  );
}
