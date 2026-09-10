import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export function LeadDetailModal({ lead, onClose }) {
  const { updateLeadStage, deleteLead } = useData();
  const { user } = useAuth();

  if (!lead) return null;

  const tierRate = user ? (user.tierCommission || 0.15) : 0.15;
  const commEst = Math.round((Number(lead.value) || 0) * tierRate);

  const STAGES = [
    { id: 'new', label: 'New Lead' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'proposal', label: 'Proposal Sent' },
    { id: 'closed_won', label: 'Closed-Won (Commission Credited)' },
    { id: 'paid', label: 'Settled & Paid' }
  ];

  const handleStageChange = async (newStage) => {
    await updateLeadStage(lead.id, newStage);
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove "${lead.name}" from your CRM?`)) {
      await deleteLead(lead.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <h3>Lead & Deal Details</h3>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div className="calc-breakdown-row">
              <span>Customer / Business:</span>
              <strong style={{ color: '#fff' }}>{lead.name}</strong>
            </div>
            <div className="calc-breakdown-row">
              <span>Contact (Email / Phone):</span>
              <strong style={{ color: '#fff' }}>{lead.contact}</strong>
            </div>
            <div className="calc-breakdown-row">
              <span>Estimated Project Deal Value:</span>
              <strong style={{ color: 'var(--emerald-400)' }}>${Number(lead.value || 0).toLocaleString()}</strong>
            </div>
            <div className="calc-breakdown-row">
              <span>Estimated Agent Commission ({Math.round(tierRate * 100)}%):</span>
              <strong style={{ color: 'var(--cyan-400)' }}>${commEst.toLocaleString()}</strong>
            </div>
            <div className="calc-breakdown-row">
              <span>Source Channel:</span>
              <strong style={{ color: '#fff' }}>{lead.source}</strong>
            </div>
            <div className="calc-breakdown-row">
              <span>Current Pipeline Stage:</span>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '0.2rem 0.5rem', fontSize: '0.85rem' }}
                value={lead.stage}
                onChange={(e) => handleStageChange(e.target.value)}
              >
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Notes / Scope:</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '6px' }}>
                {lead.notes || 'No additional notes recorded.'}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleDelete} style={{ color: '#f87171' }}>
            🗑️ Delete Lead
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
