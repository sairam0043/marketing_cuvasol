/* ==========================================================================
   CUVASOL AGENT CLOUD - PAYOUTS & WALLET (js/components/payouts.js)
   ========================================================================== */

import { appState } from '../state.js';

export function initPayouts() {
  const modalPayout = document.getElementById('modal-request-payout');
  const btnOpenPayout = document.getElementById('btn-open-request-payout');
  const btnClosePayout = document.getElementById('btn-close-request-payout');
  const formPayout = document.getElementById('form-request-payout');
  const txTableBody = document.getElementById('wallet-tx-tbody');

  // Balances
  const elAvailable = document.getElementById('wallet-val-available');
  const elPending = document.getElementById('wallet-val-pending');
  const elTotalPaid = document.getElementById('wallet-val-totalpaid');
  const elLifetime = document.getElementById('wallet-val-lifetime');

  function renderWallet() {
    const { wallet } = appState.get();

    if (elAvailable) elAvailable.textContent = `$${wallet.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (elPending) elPending.textContent = `$${wallet.pendingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (elTotalPaid) elTotalPaid.textContent = `$${wallet.totalPaidOut.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (elLifetime) elLifetime.textContent = `$${wallet.lifetimeEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (txTableBody) {
      txTableBody.innerHTML = wallet.transactions.map(tx => {
        const isPos = tx.amount > 0;
        const statusBadge = tx.status === 'Paid' || tx.status === 'Completed' ? 'badge-emerald' : 'badge-amber';
        return `
          <tr>
            <td style="font-family: var(--font-mono); font-weight: 600; color: #fff;">${tx.id}</td>
            <td>${tx.date}</td>
            <td><span class="badge ${tx.type === 'Payout' ? 'badge-cyan' : 'badge-indigo'}">${tx.type}</span></td>
            <td>${tx.desc}</td>
            <td style="font-family: var(--font-mono); font-weight: 700; color: ${isPos ? 'var(--emerald-400)' : '#fff'};">
              ${isPos ? '+' : ''}$${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </td>
            <td><span class="badge ${statusBadge}">✓ ${tx.status}</span></td>
          </tr>
        `;
      }).join('');
    }
  }

  btnOpenPayout?.addEventListener('click', () => {
    const { wallet } = appState.get();
    const maxBalEl = document.getElementById('payout-max-balance');
    const inputAmount = document.getElementById('payout-input-amount');
    if (maxBalEl) maxBalEl.textContent = `$${wallet.availableBalance.toLocaleString()}`;
    if (inputAmount) inputAmount.value = wallet.availableBalance > 0 ? wallet.availableBalance : '';
    modalPayout?.classList.add('active');
  });

  btnClosePayout?.addEventListener('click', () => modalPayout?.classList.remove('active'));

  formPayout?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('payout-input-amount')?.value;
    const method = document.getElementById('payout-select-method')?.value || 'Direct Deposit';

    try {
      appState.requestPayout(amount, method);
      window.showToast?.(`Payout of $${Number(amount).toLocaleString()} initiated via ${method}! 💸`, 'success');
      modalPayout?.classList.remove('active');
      formPayout.reset();
    } catch (err) {
      window.showToast?.(err.message, 'error');
    }
  });

  appState.subscribe(renderWallet);
  renderWallet();
}
