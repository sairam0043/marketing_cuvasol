import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export function AssetsTab({ onPreviewAsset }) {
  const { assets, useAsset } = useData();
  const { showToast } = useToast();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? assets
    : assets.filter(a => a.category === filter);

  const handleFastCopy = (ast) => {
    navigator.clipboard.writeText(ast.content);
    if (useAsset) useAsset(ast.id);
    showToast('Marketing asset copied to clipboard! 📋', 'success');
  };

  const handlePreview = (ast) => {
    if (useAsset) useAsset(ast.id);
    onPreviewAsset(ast);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Marketing Asset & Copy Vault</h2>
          <p>Pre-written hooks, high-converting video scripts, B2B email templates, and pitch decks to boost conversions.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Assets' },
          { id: 'ad_copy', label: 'TikTok & Meta Scripts' },
          { id: 'email_sequence', label: 'B2B Email Sequences' },
          { id: 'social_post', label: 'Social Carousels' },
          { id: 'pitch_deck', label: 'Pitch Decks' }
        ].map(cat => (
          <button
            key={cat.id}
            className={`btn btn-secondary btn-sm ${filter === cat.id ? 'active' : ''}`}
            style={filter === cat.id ? { background: 'rgba(99,102,241,0.2)', borderColor: 'var(--indigo-500)', color: '#fff' } : {}}
            onClick={() => setFilter(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="asset-vault-grid">
        {filtered.map(ast => (
          <div key={ast.id} className="asset-item-card glass-card">
            <div>
              <div className="asset-badge-type">{ast.type}</div>
              <h4>{ast.title}</h4>
              <div className="asset-preview-text">
                {ast.content.slice(0, 140)}...
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                📥 {ast.downloads || 0} copies used
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handlePreview(ast)}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.775rem' }}
                >
                  Preview
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleFastCopy(ast)}
                  style={{ padding: '0.3rem 0.75rem', fontSize: '0.775rem' }}
                >
                  📋 Copy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
