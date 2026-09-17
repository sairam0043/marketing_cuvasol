import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export function RequestPayoutModal({ isOpen, onClose }) {
  const { wallet, requestPayout } = useData();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(user?.payoutMethod || 'Direct Bank Deposit (ACH)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.payoutMethod) {
      setMethod(user.payoutMethod);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setIsSubmitting(true);
    try {
      await requestPayout(amount, method);
      setAmount('');
      onClose();
    } catch (err) {
      // Error toast handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <h3>Request Commission Payout</h3>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              padding: '0.9rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--emerald-400)', fontWeight: 600 }}>Available Cleared Balance:</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                ${(wallet.availableBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="payout-amount">Withdrawal Amount ($)</label>
              <input
                id="payout-amount"
                type="number"
                className="form-control"
                placeholder="Enter amount to withdraw"
                min="10"
                max={wallet.availableBalance || 0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={(wallet.availableBalance || 0) <= 0}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="payout-method">Payout Settlement Method</label>
              <select
                id="payout-method"
                className="form-control"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="Direct Bank Deposit (ACH)">Direct Bank Deposit (ACH / Wire)</option>
                <option value="Crypto USDT (TRC-20)">USDT TRC-20 Crypto Wallet</option>
                <option value="Stripe Connect Express">Stripe Connect Express</option>
                <option value="PayPal Business">PayPal Business</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-emerald"
              disabled={isSubmitting || (wallet.availableBalance || 0) <= 0 || !amount || Number(amount) > wallet.availableBalance}
            >
              {isSubmitting ? 'Processing...' : '💸 Confirm Instant Withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
