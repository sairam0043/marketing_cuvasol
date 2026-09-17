import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

export function LeadsTab({ onOpenAddLead, onSelectLead }) {
  const { leads, updateLeadStage, deleteLead } = useData();
  const [search, setSearch] = useState('');

  const STAGES = [
    { id: 'new', label: 'New Leads', dotColor: 'var(--cyan-400)', next: 'contacted' },
    { id: 'contacted', label: 'Contacted', dotColor: 'var(--indigo-500)', next: 'proposal' },
    { id: 'proposal', label: 'Proposal Sent', dotColor: 'var(--amber-400)', next: 'closed_won' },
    { id: 'closed_won', label: 'Closed-Won', dotColor: 'var(--emerald-400)', next: 'paid' },
    { id: 'paid', label: 'Commission Settled', dotColor: 'var(--emerald-500)', next: null }
  ];

  const filtered = leads.filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.contact?.toLowerCase().includes(search.toLowerCase()) ||
    l.source?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Leads & Deal CRM Pipeline</h2>
          <p>Track prospective solar customers from initial inquiry to funded installation & commission payout.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search leads by name, contact, source..."
            style={{ width: 280 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-emerald" onClick={onOpenAddLead}>
            <span>➕ Add Inbound Lead</span>
          </button>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', margin: '2rem 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your CRM Pipeline is Clean & Ready</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 1.5rem auto' }}>
            No leads in your CRM yet. Add an inbound solar deal manually, or share your campaign links to collect leads automatically!
          </p>
          <button className="btn btn-emerald btn-lg" onClick={onOpenAddLead}>
            ➕ Add Your First Inbound Lead
          </button>
        </div>
      ) : (
        <div className="kanban-board">
          {STAGES.map(st => {
            const colLeads = filtered.filter(l => l.stage === st.id);
            return (
              <div key={st.id} className="kanban-col">
                <div className="kanban-col-header">
                  <div className="kanban-col-title">
                    <span className="badge-pulse-dot" style={{ background: st.dotColor }}></span>
                    <span>{st.label}</span>
                  </div>
                  <span className="badge badge-cyan">{colLeads.length}</span>
                </div>

                <div className="kanban-cards-list">
                  {colLeads.length === 0 ? (
                    <div style={{
                      padding: '1.5rem 1rem',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.8rem',
                      border: '1px dashed var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      No leads in this stage
                    </div>
                  ) : (
                    colLeads.map(lead => (
                      <div key={lead.id} className="lead-card glass-card">
                        <div className="lead-card-header">
                          <div className="lead-card-name">{lead.name}</div>
                          <div className="lead-card-val">${Number(lead.value || 0).toLocaleString()}</div>
                        </div>
                        <div className="lead-card-desc">
                          Source: <strong style={{ color: 'var(--cyan-400)' }}>{lead.source}</strong>
                        </div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                          {lead.notes}
                        </div>
                        <div className="lead-card-footer">
                          <span>🕒 {lead.date || 'Today'}</span>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => onSelectLead(lead)}
                              style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem' }}
                            >
                              Details
                            </button>
                            {st.next ? (
                              <button
                                className="btn btn-emerald btn-sm"
                                onClick={() => updateLeadStage(lead.id, st.next)}
                                style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                              >
                                Advance ➔
                              </button>
                            ) : (
                              <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>✓ Settled</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
