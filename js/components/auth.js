/* ==========================================================================
   CUVASOL AGENT CLOUD - AUTHENTICATION COMPONENT (js/components/auth.js)
   ========================================================================== */

import { appState } from '../state.js';
import { navigateTo } from '../router.js';

export function initAuth() {
  // Login Form
  const loginForm = document.getElementById('form-login');
  const demoLoginBtn = document.getElementById('btn-demo-login');

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) {
      window.showToast?.('Please enter your email and password.', 'error');
      return;
    }

    try {
      const user = appState.login(email, password);
      window.showToast?.(`Welcome back, ${user.name}! 🚀`, 'success');
      navigateTo('dashboard');
    } catch (err) {
      window.showToast?.('Authentication failed. Please try again.', 'error');
    }
  });

  demoLoginBtn?.addEventListener('click', () => {
    const user = appState.demoLogin();
    window.showToast?.(`Logged in as Demo Agent: ${user.name} ⚡`, 'success');
    navigateTo('dashboard');
  });

  // Multi-step Sign Up
  let currentStep = 1;
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const stepPanes = document.querySelectorAll('.signup-step-pane');
  const btnNextStep1 = document.getElementById('btn-signup-step-1');
  const btnNextStep2 = document.getElementById('btn-signup-step-2');
  const btnBackStep2 = document.getElementById('btn-back-step-2');
  const btnBackStep3 = document.getElementById('btn-back-step-3');
  const signupForm = document.getElementById('form-signup');

  function showStep(step) {
    currentStep = step;
    stepPanes.forEach((pane, idx) => {
      pane.style.display = idx + 1 === step ? 'block' : 'none';
    });

    stepIndicators.forEach((ind, idx) => {
      ind.classList.remove('active', 'completed');
      if (idx + 1 === step) {
        ind.classList.add('active');
      } else if (idx + 1 < step) {
        ind.classList.add('completed');
      }
    });
  }

  btnNextStep1?.addEventListener('click', () => {
    const name = document.getElementById('signup-name')?.value.trim();
    const email = document.getElementById('signup-email')?.value.trim();
    const pass = document.getElementById('signup-password')?.value;

    if (!name || !email || !pass) {
      window.showToast?.('Please fill in your name, email, and password.', 'warning');
      return;
    }
    showStep(2);
  });

  btnBackStep2?.addEventListener('click', () => showStep(1));

  btnNextStep2?.addEventListener('click', () => {
    const checkedChannels = Array.from(document.querySelectorAll('input[name="signup_channels"]:checked'));
    if (checkedChannels.length === 0) {
      window.showToast?.('Please select at least one marketing channel.', 'warning');
      return;
    }
    showStep(3);
  });

  btnBackStep3?.addEventListener('click', () => showStep(2));

  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name')?.value.trim();
    const email = document.getElementById('signup-email')?.value.trim();
    const channels = Array.from(document.querySelectorAll('input[name="signup_channels"]:checked')).map(c => c.value);
    const payoutMethod = document.querySelector('input[name="signup_payout"]:checked')?.value || 'Direct Deposit';

    const user = appState.register({
      name,
      email,
      channels,
      payoutMethod
    });

    window.showToast?.(`Agent Account Activated! Welcome to Cuvasol, ${user.name}! 🎉`, 'success');
    showStep(1); // reset step for next time
    navigateTo('dashboard');
  });

  // Switch between Login and Signup view triggers
  document.getElementById('goto-signup')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('signup');
  });

  document.getElementById('goto-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('login');
  });
}
