/* ==========================================================================
   CUVASOL AGENT CLOUD - CLIENT ROUTER (js/router.js)
   ========================================================================== */

import { appState } from './state.js';

let dashController = null;

export function setDashController(ctrl) {
  dashController = ctrl;
}

export function navigateTo(route) {
  window.location.hash = `#${route}`;
}

export function handleRoute() {
  const hash = window.location.hash.slice(1) || 'landing';
  const [mainRoute, subRoute] = hash.split('/');

  const landingView = document.getElementById('view-landing');
  const loginView = document.getElementById('view-login');
  const signupView = document.getElementById('view-signup');
  const dashView = document.getElementById('view-dashboard');

  // Route Guard: Protect Dashboard
  if (mainRoute === 'dashboard' && !appState.isAuthenticated()) {
    window.showToast?.('Please sign in to access the Agent Portal', 'warning');
    navigateTo('login');
    return;
  }

  // If already authenticated and visits login/signup, redirect to dashboard
  if ((mainRoute === 'login' || mainRoute === 'signup') && appState.isAuthenticated()) {
    navigateTo('dashboard');
    return;
  }

  // Hide all main views
  [landingView, loginView, signupView, dashView].forEach(v => {
    if (v) v.classList.remove('active');
  });

  if (mainRoute === 'login') {
    loginView?.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (mainRoute === 'signup') {
    signupView?.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (mainRoute === 'dashboard') {
    dashView?.classList.add('active');
    const activeTab = subRoute || 'overview';
    dashController?.switchDashboardTab(activeTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    landingView?.classList.add('active');
  }
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
