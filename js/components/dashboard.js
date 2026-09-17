/* ==========================================================================
   CUVASOL AGENT CLOUD - DASHBOARD CONTROLLER (js/components/dashboard.js)
   ========================================================================== */

import { appState } from '../state.js';
import { renderRevenueChart, renderFunnelChart } from '../utils/charts.js';
import { navigateTo } from '../router.js';

export function initDashboard() {
  const sidebarNavItems = document.querySelectorAll('.dash-nav-item');
  const tabPanes = document.querySelectorAll('.dash-tab-pane');
  const mobileToggle = document.getElementById('mobile-sidebar-toggle');
  const sidebar = document.querySelector('.dash-sidebar');
  const notifBtn = document.getElementById('btn-notif');
  const notifDropdown = document.getElementById('notif-dropdown');

  // Switch tabs
  function switchDashboardTab(tabName) {
    sidebarNavItems.forEach(item => {
      item.classList.toggle('active', item.dataset.tab === tabName);
    });

    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-pane-${tabName}`);
    });

    if (tabName === 'overview') {
      setTimeout(() => {
        renderRevenueChart('chart-revenue-velocity');
        renderFunnelChart('chart-conversion-funnel');
      }, 50);
    }

    if (sidebar) sidebar.classList.remove('mobile-open');
  }

  sidebarNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.dataset.tab;
      if (tab) {
        window.location.hash = `#dashboard/${tab}`;
      }
    });
  });

  mobileToggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('mobile-open');
  });

  // Notif center toggle
  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown?.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    notifDropdown?.classList.remove('active');
  });

  // Logout from dashboard
  document.getElementById('btn-dash-logout')?.addEventListener('click', () => {
    appState.logout();
    window.showToast?.('Logged out of Agent Cloud', 'info');
    navigateTo('landing');
  });

  // Quick action buttons in overview
  document.getElementById('dash-quick-link')?.addEventListener('click', () => {
    window.location.hash = '#dashboard/campaigns';
  });
  document.getElementById('dash-quick-campaign')?.addEventListener('click', () => {
    window.location.hash = '#dashboard/campaigns';
    document.getElementById('modal-create-campaign')?.classList.add('active');
  });
  document.getElementById('dash-quick-payout')?.addEventListener('click', () => {
    window.location.hash = '#dashboard/payouts';
    document.getElementById('modal-request-payout')?.classList.add('active');
  });

  // Update Agent Profile UI Elements
  function updateProfileUI() {
    const { currentUser, kpis, leads, wallet, notifications } = appState.get();
    if (!currentUser) return;

    // Sidebar Profile
    const elName = document.getElementById('dash-agent-name');
    const elTier = document.getElementById('dash-agent-tier');
    const elAvatar = document.getElementById('dash-agent-avatar');
    const elGreeting = document.getElementById('dash-greeting-name');

    if (elName) elName.textContent = currentUser.name;
    if (elTier) elTier.textContent = `★ ${currentUser.tier}`;
    if (elAvatar) elAvatar.textContent = currentUser.avatar;
    if (elGreeting) elGreeting.textContent = currentUser.name.split(' ')[0];

    // Settings fields
    const setCode = document.getElementById('setting-ref-code');
    const setUrl = document.getElementById('setting-agent-url');
    if (setCode) setCode.textContent = currentUser.referralCode;
    if (setUrl) setUrl.value = `https://${currentUser.customSlug}`;

    // KPI Summary
    const kpiRev = document.getElementById('kpi-total-revenue');
    const kpiComm = document.getElementById('kpi-pending-comm');
    const kpiLeads = document.getElementById('kpi-active-leads');
    const kpiConv = document.getElementById('kpi-conv-rate');

    if (kpiRev) kpiRev.textContent = `$${kpis.totalRevenueGenerated.toLocaleString()}`;
    if (kpiComm) kpiComm.textContent = `$${wallet.availableBalance.toLocaleString()}`;
    if (kpiLeads) kpiLeads.textContent = kpis.activeLeadsCount;
    if (kpiConv) kpiConv.textContent = `${kpis.conversionRate}%`;

    // Notifications List
    const notifContainer = document.getElementById('notif-list-container');
    if (notifContainer) {
      notifContainer.innerHTML = notifications.map(n => `
        <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 2px;">
          <div style="font-size: 0.85rem; font-weight: 700; color: #fff;">${n.title}</div>
          <div style="font-size: 0.775rem; color: var(--text-secondary);">${n.text}</div>
          <div style="font-size: 0.7rem; color: var(--cyan-400); margin-top: 2px;">${n.time}</div>
        </div>
      `).join('');
    }

    // Recent overview leads table
    const recentLeadsTbody = document.getElementById('overview-recent-leads-tbody');
    if (recentLeadsTbody) {
      const top4 = leads.slice(0, 4);
      recentLeadsTbody.innerHTML = top4.map(l => `
        <tr>
          <td style="font-weight: 600; color: #fff;">${l.name}</td>
          <td><span class="badge badge-cyan">${l.source}</span></td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: var(--emerald-400);">$${l.value.toLocaleString()}</td>
          <td><span class="badge ${l.stage === 'closed_won' || l.stage === 'paid' ? 'badge-emerald' : 'badge-indigo'}">${l.stage.replace('_', ' ')}</span></td>
        </tr>
      `).join('');
    }
  }

  appState.subscribe(updateProfileUI);
  updateProfileUI();

  return { switchDashboardTab };
}
