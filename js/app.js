/* ==========================================================================
   CUVASOL AGENT CLOUD - APPLICATION ROOT (js/app.js)
   ========================================================================== */

import { initNavbar } from './components/navbar.js';
import { initCalculator } from './components/calculator.js';
import { initAuth } from './components/auth.js';
import { initDashboard } from './components/dashboard.js';
import { initCampaigns } from './components/campaigns.js';
import { initLeads } from './components/leads.js';
import { initAssetsVault } from './components/assetsVault.js';
import { initPayouts } from './components/payouts.js';
import { initRouter, setDashController, handleRoute } from './router.js';

// Global Toast System
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  else if (type === 'error') icon = '❌';
  else if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `
    <span style="font-size: 1.1rem;">${icon}</span>
    <span style="flex-grow: 1; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// FAQ Accordion Initialization
function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item?.classList.contains('active');
      
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      if (!wasActive && item) {
        item.classList.add('active');
      }
    });
  });
}

// Global Modal Backdrop Close
function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

// Application Startup
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCalculator();
  initAuth();
  
  const dashController = initDashboard();
  setDashController(dashController);

  initCampaigns();
  initLeads();
  initAssetsVault();
  initPayouts();
  initFaq();
  initModals();

  initRouter();
});
