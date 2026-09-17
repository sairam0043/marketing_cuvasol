/* ==========================================================================
   CUVASOL AGENT CLOUD - ASSET VAULT (js/components/assetsVault.js)
   ========================================================================== */

import { appState } from '../state.js';

export function initAssetsVault() {
  const container = document.getElementById('asset-vault-list');
  const filterBtns = document.querySelectorAll('.asset-filter-btn');
  const modalScriptPreview = document.getElementById('modal-script-preview');
  const btnCloseScript = document.getElementById('btn-close-script-preview');
  const scriptContentEl = document.getElementById('script-preview-body');
  const btnCopyScriptModal = document.getElementById('btn-copy-script-modal');

  let activeFilter = 'all';

  function renderAssets() {
    if (!container) return;
    const { assets } = appState.get();

    const filtered = activeFilter === 'all' 
      ? assets 
      : assets.filter(a => a.category === activeFilter);

    container.innerHTML = filtered.map(asset => `
      <div class="asset-item-card glass-card">
        <div>
          <div class="asset-badge-type">${asset.type}</div>
          <h4>${asset.title}</h4>
          <div class="asset-preview-text">${escapeHtml(asset.content.slice(0, 140))}...</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle);">
          <span style="font-size: 0.775rem; color: var(--text-muted);">📥 ${asset.downloads} agents used</span>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm btn-preview-asset" data-id="${asset.id}" style="padding: 0.3rem 0.65rem; font-size: 0.775rem;">
              Preview
            </button>
            <button class="btn btn-primary btn-sm btn-copy-asset-fast" data-id="${asset.id}" style="padding: 0.3rem 0.75rem; font-size: 0.775rem;">
              📋 Copy
            </button>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-preview-asset').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = assets.find(a => a.id === id);
        if (item && scriptContentEl) {
          scriptContentEl.textContent = item.content;
          document.getElementById('script-preview-title').textContent = item.title;
          modalScriptPreview?.classList.add('active');
        }
      });
    });

    container.querySelectorAll('.btn-copy-asset-fast').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = assets.find(a => a.id === id);
        if (item) {
          navigator.clipboard.writeText(item.content);
          window.showToast?.('Marketing asset copied to clipboard! 📋', 'success');
        }
      });
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.category || 'all';
      renderAssets();
    });
  });

  btnCloseScript?.addEventListener('click', () => modalScriptPreview?.classList.remove('active'));

  btnCopyScriptModal?.addEventListener('click', () => {
    if (scriptContentEl) {
      navigator.clipboard.writeText(scriptContentEl.textContent);
      window.showToast?.('Full script copied to clipboard! 🚀', 'success');
      modalScriptPreview?.classList.remove('active');
    }
  });

  appState.subscribe(renderAssets);
  renderAssets();
}
