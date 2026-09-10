import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

export function CreateCampaignModal({ isOpen, onClose }) {
  const { addCampaign } = useData();
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    await addCampaign({ title, channel });
    setTitle('');
    setChannel('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <h3>Launch New Solar Campaign</h3>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="modal-camp-title">Campaign Name</label>
              <input
                id="modal-camp-title"
                type="text"
                className="form-control"
                placeholder="e.g. Texas Solar Summer Blast"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="modal-camp-channel">Primary Channel</label>
              <input
                id="modal-camp-channel"
                type="text"
                className="form-control"
                placeholder="e.g. Meta Ads & Instagram Reels"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">🚀 Launch & Generate Links</button>
          </div>
        </form>
      </div>
    </div>
  );
}
