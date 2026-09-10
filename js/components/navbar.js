/* ==========================================================================
   CUVASOL AGENT CLOUD - NAVBAR COMPONENT (js/components/navbar.js)
   ========================================================================== */

import { appState } from '../state.js';
import { navigateTo } from '../router.js';

export function initNavbar() {
  const navElement = document.querySelector('.landing-nav');
  const authNavActions = document.getElementById('landing-nav-actions');

  // Scroll glass effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navElement?.classList.add('scrolled');
    } else {
      navElement?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('landing-nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Render auth actions based on login state
  function renderNavAuth() {
    if (!authNavActions) return;
    const isAuth = appState.isAuthenticated();
    const user = appState.get().currentUser;

    if (isAuth && user) {
      authNavActions.innerHTML = `
        <button class="btn btn-outline-cyan btn-sm" id="nav-btn-dashboard">
          <span>⚡ Agent Portal</span>
          <span class="badge badge-cyan" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;">${user.tier.split(' ')[0]}</span>
        </button>
        <button class="btn btn-secondary btn-sm" id="nav-btn-logout">Sign Out</button>
      `;

      document.getElementById('nav-btn-dashboard')?.addEventListener('click', () => {
        navigateTo('dashboard');
      });

      document.getElementById('nav-btn-logout')?.addEventListener('click', () => {
        appState.logout();
        window.showToast?.('Signed out successfully', 'info');
      });
    } else {
      authNavActions.innerHTML = `
        <button class="btn btn-secondary btn-sm" id="nav-btn-login">Sign In</button>
        <button class="btn btn-primary btn-sm" id="nav-btn-signup">Join as Agent</button>
      `;

      document.getElementById('nav-btn-login')?.addEventListener('click', () => {
        navigateTo('login');
      });

      document.getElementById('nav-btn-signup')?.addEventListener('click', () => {
        navigateTo('signup');
      });
    }
  }

  appState.subscribe(renderNavAuth);
  renderNavAuth();
}
