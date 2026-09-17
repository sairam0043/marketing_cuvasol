/* ==========================================================================
   CUVASOL AGENT CLOUD - LEADS & CRM PIPELINE (js/components/leads.js)
   ========================================================================== */

import { appState } from '../state.js';

export function initLeads() {
  const kanbanColumns = {
    new: document.getElementById('kanban-col-new'),
    contacted: document.getElementById('kanban-col-contacted'),
    proposal: document.getElementById('kanban-col-proposal'),
    closed_won: document.getElementById('kanban-col-closed_won'),
    paid: document.getElementById('kanban-col-paid'),
  };

  const modalAddLead = document.getElementById('modal-add-lead');
  const modalLeadDetail = document.getElementById('modal-lead-detail');
  const formAddLead = document.getElementById('form-add-lead');
  const btnOpenAddLead = document.getElementById('btn-open-add-lead');
  const btnCloseAddLead = document.getElementById('btn-close-add-lead');
  const btnCloseLeadDetail = document.getElementById('btn-close-lead-detail');
  const leadSearchInput = document.getElementById('crm-search-input');

  const STAGE_NAMES = {
    new: { label: 'New Lead', next: 'contacted', badge: 'badge-cyan' },
    contacted: { label: 'Contacted', next: 'proposal', badge: 'badge-indigo' },
    proposal: { label: 'Proposal Sent', next: 'closed_won', badge: 'badge-amber' },
    closed_won: { label: 'Closed-Won', next: 'paid', badge: 'badge-emerald' },
    paid: { label: 'Commission Settled', next: null, badge: 'badge-emerald' }
  };

  function renderKanban() {
    const { leads } = appState.get();
    const query = leadSearchInput?.value.toLowerCase() || '';

    // Clear columns
    Object.values(kanbanColumns).forEach(col => {
      if (col) col.innerHTML = '';
    });

    const filteredLeads = leads.filter(l => 
      l.name.toLowerCase().includes(query) || 
      l.contact.toLowerCase().includes(query) ||
      l.source.toLowerCase().includes(query)
    );

    // Update column counters
    Object.keys(kanbanColumns).forEach(stage => {
      const count = filteredLeads.filter(l => l.stage === stage).length;
      const countBadge = document.getElementById(`count-stage-${stage}`);
      if (countBadge) countBadge.textContent = count;
    });

    filteredLeads.forEach(lead => {
      const col = kanbanColumns[lead.stage];
      if (!col) return;

      const stageMeta = STAGE_NAMES[lead.stage];
      const card = document.createElement('div');
      card.className = 'lead-card glass-card';
      card.innerHTML = `
        <div class="lead-card-header">
          <div class="lead-card-name">${lead.name}</div>
          <div class="lead-card-val">$${lead.value.toLocaleString()}</div>
        </div>
        <div class="lead-card-desc">Source: <strong style="color: var(--cyan-400);">${lead.source}</strong></div>
        <div style="font-size: 0.775rem; color: var(--text-secondary); margin-bottom: 0.75rem; line-height: 1.3;">
          ${lead.notes}
        </div>
        <div class="lead-card-footer">
          <span>🕒 ${lead.date}</span>
          <div style="display: flex; gap: 0.35rem;">
            <button class="btn btn-secondary btn-sm btn-view-lead" data-id="${lead.id}" style="padding: 0.2rem 0.45rem; font-size: 0.7rem;">
              Details
            </button>
            ${stageMeta.next ? `
              <button class="btn btn-emerald btn-sm btn-advance-lead" data-id="${lead.id}" data-next="${stageMeta.next}" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;">
                Advance ➔
              </button>
            ` : `<span class="badge badge-emerald" style="font-size: 0.65rem;">✓ Paid</span>`}
          </div>
        </div>
      `;

      col.appendChild(card);
    });

    // Attach advance & view handlers
    document.querySelectorAll('.btn-advance-lead').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const nextStage = btn.dataset.next;
        appState.updateLeadStatus(id, nextStage);
        window.showToast?.(`Lead moved to ${STAGE_NAMES[nextStage].label}! 🎯`, 'success');
      });
    });

    document.querySelectorAll('.btn-view-lead').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        showLeadDetails(id);
      });
    });
  }

  function showLeadDetails(leadId) {
    const { leads } = appState.get();
    const lead = leads.find(l => l.id === leadId);
    if (!lead || !modalLeadDetail) return;

    const commEst = Math.round(lead.value * 0.15);
    document.getElementById('lead-detail-name').textContent = lead.name;
    document.getElementById('lead-detail-email').textContent = lead.contact;
    document.getElementById('lead-detail-val').textContent = `$${lead.value.toLocaleString()}`;
    document.getElementById('lead-detail-comm').textContent = `$${commEst.toLocaleString()} (15%)`;
    document.getElementById('lead-detail-source').textContent = lead.source;
    document.getElementById('lead-detail-stage').textContent = STAGE_NAMES[lead.stage].label;
    document.getElementById('lead-detail-notes').textContent = lead.notes;

    modalLeadDetail.classList.add('active');
  }

  // Event Listeners
  leadSearchInput?.addEventListener('input', renderKanban);

  btnOpenAddLead?.addEventListener('click', () => modalAddLead?.classList.add('active'));
  btnCloseAddLead?.addEventListener('click', () => modalAddLead?.classList.remove('active'));
  btnCloseLeadDetail?.addEventListener('click', () => modalLeadDetail?.classList.remove('active'));

  formAddLead?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('lead-input-name')?.value.trim();
    const contact = document.getElementById('lead-input-contact')?.value.trim();
    const value = document.getElementById('lead-input-value')?.value.trim();
    const source = document.getElementById('lead-input-source')?.value.trim();
    const notes = document.getElementById('lead-input-notes')?.value.trim();

    if (!name || !contact) {
      window.showToast?.('Please provide lead name and email/phone.', 'warning');
      return;
    }

    appState.addLead({ name, contact, value, source, notes });
    window.showToast?.(`Lead for ${name} added to pipeline! ✨`, 'success');
    modalAddLead?.classList.remove('active');
    formAddLead.reset();
  });

  appState.subscribe(renderKanban);
  renderKanban();
}
