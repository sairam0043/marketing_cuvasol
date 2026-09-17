import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

export function PublicInquiryModal({ isOpen, onClose }) {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [propertyType, setPropertyType] = useState('Residential Rooftop');
  const [billAmount, setBillAmount] = useState('250');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [refCode, setRefCode] = useState('');

  useEffect(() => {
    // Check URL parameters for ?ref= or #ref=
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || window.location.hash.split('ref=')[1]?.split('&')[0] || '';
    if (ref) setRefCode(ref);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    setIsSubmitting(true);
    try {
      const estimatedValue = propertyType === 'Commercial Facility / Microgrid' ? 65000 : 22000;
      const res = await fetch('/api/public/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          value: estimatedValue,
          refCode: refCode || 'DIRECT',
          notes: `${propertyType} • Est. Monthly Bill: $${billAmount}/mo. ${notes}`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');

      setSubmittedSuccess(true);
      showToast('Solar estimate request received! Sales engineering team notified. ☀️', 'success');
    } catch (err) {
      showToast(err.message || 'Submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedSuccess(false);
    setName('');
    setContact('');
    setNotes('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-card" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <h3>Request Instant Solar & Battery Feasibility</h3>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={handleClose}>✕</button>
        </div>

        {submittedSuccess ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>Consultation Request Submitted!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your rooftop satellite solar assessment is being processed. An authorized clean energy specialist will reach out within 2 hours.
            </p>
            <button className="btn btn-primary" onClick={handleClose}>Close Window</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label" htmlFor="pub-name">Full Name / Business Name</label>
                <input
                  id="pub-name"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Robert Vance or Vance Refrigeration"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pub-contact">Contact Email or Phone</label>
                <input
                  id="pub-contact"
                  type="text"
                  className="form-control"
                  placeholder="e.g. robert@vancerefrig.com or (555) 342-1890"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Property Installation Type</label>
                <select
                  className="form-control"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="Residential Rooftop">Residential Single Family Home ($0 Down)</option>
                  <option value="Commercial Facility / Microgrid">Commercial Warehouse / Office ($40k-$150k)</option>
                  <option value="EV Charging & Battery Storage">EV Fleet Charging + Smart Battery Bundle</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pub-bill">Average Monthly Electric Bill ($)</label>
                <input
                  id="pub-bill"
                  type="number"
                  className="form-control"
                  placeholder="250"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pub-notes">Additional Notes or Roof Address (Optional)</label>
                <textarea
                  id="pub-notes"
                  className="form-control"
                  rows="2"
                  placeholder="e.g. 1420 Sunburst Way, Austin TX - Southern facing roof"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-emerald w-full btn-lg" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : '☀️ Submit for Free AI Solar Quote'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
