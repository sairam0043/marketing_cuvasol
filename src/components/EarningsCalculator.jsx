import React, { useState, useMemo } from 'react';

export function EarningsCalculator({ onClaim }) {
  const [studentsCount, setStudentsCount] = useState(10);

  const totalEarnings = useMemo(() => {
    return studentsCount * 500;
  }, [studentsCount]);

  const presetTiers = [
    { count: 1, earning: 500 },
    { count: 5, earning: 2500 },
    { count: 10, earning: 5000 },
    { count: 20, earning: 10000 },
    { count: 50, earning: 25000 },
  ];

  return (
    <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
        
        {/* Left Controls & Slider */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            💰 Live Earning Estimator
          </div>
          <h3 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Calculate Your Referral Income
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            Adjust the slider to see how much you can earn by referring eligible students to Cuvasol Tutor.
          </p>

          {/* Slider */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <label htmlFor="student-slider" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                Students Referred:
              </label>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.25rem 0.85rem', borderRadius: '9999px' }}>
                {studentsCount} {studentsCount === 1 ? 'Student' : 'Students'}
              </span>
            </div>
            <input
              id="student-slider"
              type="range"
              min="1"
              max="100"
              value={studentsCount}
              onChange={(e) => setStudentsCount(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: 'var(--primary)', height: '8px', cursor: 'pointer', marginBottom: '0.65rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>1 Student (₹500)</span>
              <span>25 Students</span>
              <span>50 Students (₹25k)</span>
              <span>100 Students (₹50k)</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Quick Preset Targets:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[1, 5, 10, 20, 50, 100].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setStudentsCount(num)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '9999px',
                    border: studentsCount === num ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    background: studentsCount === num ? 'var(--primary-light)' : 'var(--bg-card)',
                    color: studentsCount === num ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: studentsCount === num ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {num} {num === 1 ? 'Student' : 'Students'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Card & Table */}
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-medium)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>
            Estimated Total Earnings
          </div>
          <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--emerald-500)', lineHeight: 1.1, marginBottom: '0.5rem' }}>
            ₹{totalEarnings.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
            Calculated at <strong style={{ color: 'var(--text-primary)' }}>₹500</strong> per eligible referred student
          </div>

          {/* Reference Table */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0.65rem 1rem', background: 'var(--bg-tertiary)', fontWeight: 700, fontSize: '0.825rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
              <span>Successful Referrals</span>
              <span style={{ textAlign: 'right' }}>Earnings</span>
            </div>
            {presetTiers.map((tier, idx) => (
              <div
                key={tier.count}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  padding: '0.55rem 1rem',
                  fontSize: '0.85rem',
                  background: studentsCount === tier.count ? 'var(--primary-light)' : (idx % 2 === 0 ? 'transparent' : 'var(--bg-card-subtle)'),
                  fontWeight: studentsCount === tier.count ? 700 : 500,
                  color: studentsCount === tier.count ? 'var(--primary)' : 'var(--text-primary)',
                  borderBottom: idx < presetTiers.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                }}
              >
                <span>{tier.count} {tier.count === 1 ? 'Student' : 'Students'}</span>
                <span style={{ textAlign: 'right', fontWeight: 700, color: 'var(--emerald-500)' }}>₹{tier.earning.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary btn-lg w-full"
            onClick={onClaim}
            style={{ width: '100%', padding: '0.9rem 1.5rem', fontSize: '1rem' }}
          >
            <span>🚀 Start Earning ₹500 Today</span>
          </button>
        </div>

      </div>

      {/* Small Disclaimer */}
      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: 850, margin: '0 auto' }}>
          💡 <strong>Disclaimer:</strong> Earnings shown are examples based on ₹500 per eligible referral. Actual earnings depend on the number of qualifying students referred and the program's eligibility and payment terms.
        </p>
      </div>
    </div>
  );
}

