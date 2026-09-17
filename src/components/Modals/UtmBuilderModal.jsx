import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function UtmBuilderModal({ isOpen, onClose, initialCampaignId }) {
  const { campaigns } = useData();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedCampId, setSelectedCampId] = useState('');
  const [source, setSource] = useState('tiktok_reels');
  const [medium, setMedium] = useState('video_cpc');

  useEffect(() => {
    if (initialCampaignId) {
      setSelectedCampId(initialCampaignId);
    } else if (campaigns.length > 0) {
      setSelectedCampId(campaigns[0].id);
    }
  }, [initialCampaignId, campaigns]);

  if (!isOpen) return null;

  const currentCamp = campaigns.find(c => c.id === selectedCampId) || campaigns[0];
  const refCode = user?.referralCode || 'AGENT-REF';
  const slug = currentCamp?.title?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'solar-promo';
  const finalUrl = `https://cuvasol.energy/f/${slug}?ref=${refCode}&utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=cuva_${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(finalUrl);
    showToast('Custom UTM Tracking Link Copied! 🚀', 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <h3>Campaign UTM Link Generator</h3>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {campaigns.length > 0 ? (
            <div className="form-group">
              <label className="form-label">Select Campaign</label>
              <select
                className="form-control"
                value={selectedCampId}
                onChange={(e) => setSelectedCampId(e.target.value)}
              >
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(0,240,255,0.05)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              💡 Generating tracking link with your agent referral code: <strong>{refCode}</strong>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Traffic Source (utm_source)</label>
            <input
              type="text"
              className="form-control"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. tiktok_reels, meta_ads, google_search"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Marketing Medium (utm_medium)</label>
            <input
              type="text"
              className="form-control"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="e.g. video_cpc, inmail_b2b, search_ad"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Generated Tracking URL</label>
            <textarea
              className="form-control"
              rows="3"
              readOnly
              value={finalUrl}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={handleCopy}>
            📋 Copy Tracking Link
          </button>
        </div>
      </div>
    </div>
  );
}
