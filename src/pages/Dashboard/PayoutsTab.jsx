import React from 'react';
import { useData } from '../../context/DataContext';

export function PayoutsTab({ onOpenPayout }) {
  const { wallet } = useData();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Wallet & Commission Ledger</h2>
          <p>Review cleared funds, transaction records, and request instant 24-hr payouts.</p>
        </div>
        {wallet.availableBalance > 0 && (
          <button className="btn btn-emerald" onClick={onOpenPayout}>
            <span>💸 Request Payout</span>
          </button>
        )}
      </div>

      <div className="wallet-hero-grid">
        <div className="wallet-card-primary">
          <div>
            <span className="wallet-bal-title">Available for Withdrawal</span>
            <div className="wallet-bal-amount">
              ${(wallet.availableBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>Direct settlement available via ACH, Wire, or USDT</p>
          </div>
          {wallet.availableBalance > 0 ? (
            <button className="btn btn-primary" onClick={onOpenPayout} style={{ marginTop: '1rem' }}>
              Withdraw Balance Now ➔
            </button>
          ) : (
            <div style={{ marginTop: '1rem', fontSize: '0.825rem', color: 'rgba(255,255,255,0.7)' }}>
              Commissions are automatically credited when deals in your CRM advance to "Closed-Won".
            </div>
          )}
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Pending In Pipeline
          </span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '0.35rem 0' }}>
            ${(wallet.pendingBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>Estimated commission on active proposals</p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Lifetime Paid Out
          </span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-400)', margin: '0.35rem 0' }}>
            ${(wallet.totalPaidOut || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
            Total Lifetime Earned: <span style={{ color: '#fff', fontWeight: 600 }}>${(wallet.lifetimeEarnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Transaction Ledger</h3>
        {!wallet.transactions || wallet.transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📜</div>
            <p style={{ fontSize: '0.9rem' }}>No transactions recorded yet.</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Commissions and payout receipts will appear here in real time.
            </span>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {wallet.transactions.map(tx => {
                  const isPos = tx.amount > 0;
                  return (
                    <tr key={tx.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>{tx.id}</td>
                      <td>{tx.date}</td>
                      <td>
                        <span className={`badge ${tx.type === 'Payout' ? 'badge-cyan' : tx.type === 'Bonus' ? 'badge-amber' : 'badge-emerald'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td>{tx.desc}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: isPos ? 'var(--emerald-400)' : '#fff' }}>
                        {isPos ? '+' : ''}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td><span className="badge badge-emerald">✓ {tx.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
