import React from 'react';
import { useToast } from '../../context/ToastContext';

export function ScriptPreviewModal({ asset, onClose }) {
  const { showToast } = useToast();

  if (!asset) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.content);
    showToast('Marketing script copied to clipboard! 📋', 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <h3>{asset.title}</h3>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <pre style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            background: 'rgba(0,0,0,0.3)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            color: '#fff',
            lineHeight: 1.5
          }}>
            {asset.content}
          </pre>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={handleCopy}>
            📋 Copy Full Script
          </button>
        </div>
      </div>
    </div>
  );
}
