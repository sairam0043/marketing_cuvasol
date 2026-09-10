/* ==========================================================================
   CUVASOL AGENT CLOUD - CAMPAIGNS COMPONENT (js/components/campaigns.js)
   ========================================================================== */

import { appState } from '../state.js';

export function initCampaigns() {
  const container = document.getElementById('campaigns-list-container');
  const modalCreateCamp = document.getElementById('modal-create-campaign');
  const modalUtmBuilder = document.getElementById('modal-utm-builder');
  const formCreateCamp = document.getElementById('form-create-campaign');
  const btnOpenCreate = document.getElementById('btn-open-create-campaign');
  const btnCloseCreate = document.getElementById('btn-close-create-campaign');
  const btnCloseUtm = document.getElementById('btn-close-utm-modal');

  // UTM Builder elements
  const selectUtmCamp = document.getElementById('utm-select-campaign');
  const inputUtmSource = document.getElementById('utm-input-source');
  const inputUtmMedium = document.getElementById('utm-input-medium');
  const resultUtmLink = document.getElementById('utm-result-link');
  const btnCopyUtm = document.getElementById('btn-copy-utm');

  function renderCampaigns() {
    if (!container) return;
    const { campaigns } = appState.get();

    container.innerHTML = campaigns.map(c => `
      <div class="campaign-card glass-card">
        <div class="campaign-card-header">
          <span class="badge badge-emerald"><span class="badge-pulse-dot" style="width:6px;height:6px;"></span> ${c.status}</span>
          <button class="btn btn-secondary btn-sm btn-generate-link" data-id="${c.id}" style="padding: 0.25rem 0.65rem; font-size: 0.775rem;">
            🔗 Get Link
          </button>
        </div>
        <h3>${c.title}</h3>
        <p style="font-size: 0.85rem; color: var(--cyan-400); margin-bottom: 0.5rem;">Channel: ${c.channel}</p>
        
        <div class="campaign-stats-row">
          <div>
            <div class="camp-stat-num">${c.clicks.toLocaleString()}</div>
            <div class="camp-stat-lbl">Clicks</div>
          </div>
          <div>
            <div class="camp-stat-num" style="color: var(--cyan-400);">${c.leads}</div>
            <div class="camp-stat-lbl">Leads</div>
          </div>
          <div>
            <div class="camp-stat-num" style="color: var(--emerald-400);">$${c.revenue.toLocaleString()}</div>
            <div class="camp-stat-lbl">Revenue</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted); margin-top: auto;">
          <span>EPC: <strong style="color: #fff;">$${c.epc.toFixed(2)}</strong></span>
          <button class="btn btn-outline-cyan btn-sm btn-copy-raw-link" data-url="${c.utmUrl}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">
            📋 Copy UTM
          </button>
        </div>
      </div>
    `).join('');

    // Attach link click handlers
    container.querySelectorAll('.btn-generate-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const campId = btn.dataset.id;
        openUtmBuilder(campId);
      });
    });

    container.querySelectorAll('.btn-copy-raw-link').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.url);
        window.showToast?.('Campaign tracking URL copied to clipboard! 📋', 'success');
      });
    });
  }

  function openUtmBuilder(campId) {
    const { campaigns, currentUser } = appState.get();
    if (selectUtmCamp) {
      selectUtmCamp.innerHTML = campaigns.map(c => `
        <option value="${c.id}" ${c.id === campId ? 'selected' : ''}>${c.title}</option>
      `).join('');
    }
    updateGeneratedLink();
    modalUtmBuilder?.classList.add('active');
  }

  function updateGeneratedLink() {
    const { campaigns, currentUser } = appState.get();
    const selCampId = selectUtmCamp?.value;
    const camp = campaigns.find(c => c.id === selCampId) || campaigns[0];
    const source = inputUtmSource?.value || 'social';
    const medium = inputUtmMedium?.value || 'cpc';
    const refCode = currentUser?.referralCode || 'AGENT-REF';

    const slug = camp?.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'solar-promo';
    const finalUrl = `https://cuvasol.energy/f/${slug}?ref=${refCode}&utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=cuva_${slug}`;

    if (resultUtmLink) {
      resultUtmLink.value = finalUrl;
    }
  }

  selectUtmCamp?.addEventListener('change', updateGeneratedLink);
  inputUtmSource?.addEventListener('input', updateGeneratedLink);
  inputUtmMedium?.addEventListener('input', updateGeneratedLink);

  btnCopyUtm?.addEventListener('click', () => {
    if (resultUtmLink) {
      navigator.clipboard.writeText(resultUtmLink.value);
      window.showToast?.('Custom UTM Tracking Link Copied! 🚀', 'success');
      modalUtmBuilder?.classList.remove('active');
    }
  });

  // Modal actions
  btnOpenCreate?.addEventListener('click', () => modalCreateCamp?.classList.add('active'));
  btnCloseCreate?.addEventListener('click', () => modalCreateCamp?.classList.remove('active'));
  btnCloseUtm?.addEventListener('click', () => modalUtmBuilder?.classList.remove('active'));

  formCreateCamp?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('camp-input-title')?.value.trim();
    const channel = document.getElementById('camp-input-channel')?.value.trim();

    if (!title) {
      window.showToast?.('Please enter a campaign name.', 'warning');
      return;
    }

    appState.addCampaign({ title, channel });
    window.showToast?.(`Campaign "${title}" successfully launched! ⚡`, 'success');
    modalCreateCamp?.classList.remove('active');
    formCreateCamp.reset();
  });

  appState.subscribe(renderCampaigns);
  renderCampaigns();
}
