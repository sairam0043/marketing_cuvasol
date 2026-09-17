import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

export function AddLeadModal({ isOpen, onClose }) {
  const { addLead, campaigns } = useData();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [value, setValue] = useState(25000);
  const [campaignId, setCampaignId] = useState('');
  const [customSource, setCustomSource] = useState('Direct Referral Link');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedCamp = campaigns.find(c => c.id === campaignId);
      const source = selectedCamp ? selectedCamp.title : (customSource || 'Direct Inbound');

      await addLead({
        name,
        contact,
        value: Number(value) || 20000,
        source,
        campaignId: campaignId || null,
        notes
      });

      setName('');
      setContact('');
      setValue(25000);
      setCampaignId('');
      setCustomSource('Direct Referral Link');
      setNotes('');
      onClose();
    } catch (err) {
      // Toast handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <h3>Add Inbound Solar Lead</h3>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="modal-lead-name">Lead / Business / Homeowner Name</label>
              <input
                id="modal-lead-name"
                type="text"
                className="form-control"
                placeholder="e.g. Apex Industrial Center or John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modal-lead-contact">Contact Email or Phone Number</label>
              <input
                id="modal-lead-contact"
                type="text"
                className="form-control"
                placeholder="e.g. contact@apexindustrial.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modal-lead-val">Estimated Project Deal Value ($)</label>
              <input
                id="modal-lead-val"
                type="number"
                className="form-control"
                min="1000"
                step="500"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Attributed Campaign / Source</label>
              {campaigns.length > 0 ? (
                <select
                  className="form-control"
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                >
                  <option value="">-- Custom Source / Direct Link --</option>
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>Campaign: {c.title} ({c.channel})</option>
                  ))}
                </select>
              ) : null}

              {!campaignId && (
                <input
                  type="text"
                  className="form-control"
                  style={{ marginTop: '0.5rem' }}
                  placeholder="e.g. TikTok Ad, Meta Reels, B2B Outreach"
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modal-lead-notes">Project Scope & Customer Notes</label>
              <textarea
                id="modal-lead-notes"
                className="form-control"
                rows="2"
                placeholder="e.g. 75kW rooftop solar panels + commercial battery backup"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-emerald" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : '➕ Add to CRM Pipeline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
