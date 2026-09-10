/* ==========================================================================
   CUVASOL AGENT CLOUD - INTERACTIVE CALCULATOR (js/components/calculator.js)
   ========================================================================== */

import { navigateTo } from '../router.js';

export function initCalculator() {
  const dealsSlider = document.getElementById('calc-deals-slider');
  const dealValueSlider = document.getElementById('calc-val-slider');
  const dealsDisplay = document.getElementById('calc-deals-val');
  const valDisplay = document.getElementById('calc-avg-val');
  const tierBtns = document.querySelectorAll('.tier-btn');

  const resMonthlyTotal = document.getElementById('calc-res-monthly');
  const resAnnualTotal = document.getElementById('calc-res-annual');
  const resBaseComm = document.getElementById('calc-res-base');
  const resBonus = document.getElementById('calc-res-bonus');
  const resVolume = document.getElementById('calc-res-volume');
  const ctaBtn = document.getElementById('calc-claim-btn');

  let currentTierRate = 0.15; // default Platinum (15%)

  function updateCalculations() {
    const deals = parseInt(dealsSlider?.value || 8, 10);
    const avgVal = parseInt(dealValueSlider?.value || 22000, 10);

    if (dealsDisplay) dealsDisplay.textContent = `${deals} Deals / mo`;
    if (valDisplay) valDisplay.textContent = `$${avgVal.toLocaleString()}`;

    const grossVolume = deals * avgVal;
    const baseComm = grossVolume * currentTierRate;

    // Bonus accelerator
    let bonus = 0;
    if (deals >= 30) bonus = 8500;
    else if (deals >= 15) bonus = 3500;
    else if (deals >= 6) bonus = 1200;

    const monthlyTotal = baseComm + bonus;
    const annualTotal = monthlyTotal * 12;

    if (resMonthlyTotal) resMonthlyTotal.textContent = `$${Math.round(monthlyTotal).toLocaleString()}`;
    if (resAnnualTotal) resAnnualTotal.textContent = `$${Math.round(annualTotal).toLocaleString()}`;
    if (resBaseComm) resBaseComm.textContent = `$${Math.round(baseComm).toLocaleString()}`;
    if (resBonus) resBonus.textContent = `+$${bonus.toLocaleString()}`;
    if (resVolume) resVolume.textContent = `$${grossVolume.toLocaleString()}`;
  }

  dealsSlider?.addEventListener('input', updateCalculations);
  dealValueSlider?.addEventListener('input', updateCalculations);

  tierBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tierBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTierRate = parseFloat(btn.dataset.rate || '0.15');
      updateCalculations();
    });
  });

  ctaBtn?.addEventListener('click', () => {
    navigateTo('signup');
  });

  // Initial calculation
  updateCalculations();
}
