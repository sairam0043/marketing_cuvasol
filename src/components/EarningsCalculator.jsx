import React, { useState, useMemo } from 'react';

export function EarningsCalculator({ onClaim }) {
  const [deals, setDeals] = useState(8);
  const [avgVal, setAvgVal] = useState(22000);
  const [tierRate, setTierRate] = useState(0.15);

  const calculations = useMemo(() => {
    const grossVolume = deals * avgVal;
    const baseComm = grossVolume * tierRate;

    let bonus = 0;
    if (deals >= 30) bonus = 8500;
    else if (deals >= 15) bonus = 3500;
    else if (deals >= 6) bonus = 1200;

    const monthlyTotal = baseComm + bonus;
    const annualTotal = monthlyTotal * 12;

    return { grossVolume, baseComm, bonus, monthlyTotal, annualTotal };
  }, [deals, avgVal, tierRate]);

  return (
    <div className="calc-card-container">
      <div className="calc-controls">
        {/* Slider 1: Deals */}
        <div className="slider-group">
          <div className="slider-header">
            <label htmlFor="react-calc-deals">Estimated Closed Deals / Month</label>
            <span className="slider-value-badge">{deals} Deals / mo</span>
          </div>
          <input
            id="react-calc-deals"
            type="range"
            className="calc-slider"
            min="1"
            max="40"
            value={deals}
            onChange={(e) => setDeals(parseInt(e.target.value, 10))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>1 Deal</span>
            <span>20 Deals</span>
            <span>40 Deals</span>
          </div>
        </div>

        {/* Slider 2: Deal Value */}
        <div className="slider-group">
          <div className="slider-header">
            <label htmlFor="react-calc-val">Average Solar / CleanTech Deal Size</label>
            <span className="slider-value-badge">${avgVal.toLocaleString()}</span>
          </div>
          <input
            id="react-calc-val"
            type="range"
            className="calc-slider"
            min="8000"
            max="60000"
            step="1000"
            value={avgVal}
            onChange={(e) => setAvgVal(parseInt(e.target.value, 10))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>$8,000 (Residential)</span>
            <span>$30,000 (Bundle)</span>
            <span>$60,000 (Commercial)</span>
          </div>
        </div>

        {/* Tier Buttons */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>
            Agent Commission Tier
          </label>
          <div className="calc-tier-selector">
            <button
              type="button"
              className={`tier-btn ${tierRate === 0.10 ? 'active' : ''}`}
              onClick={() => setTierRate(0.10)}
            >
              Silver (10%)
            </button>
            <button
              type="button"
              className={`tier-btn ${tierRate === 0.12 ? 'active' : ''}`}
              onClick={() => setTierRate(0.12)}
            >
              Gold (12%)
            </button>
            <button
              type="button"
              className={`tier-btn ${tierRate === 0.15 ? 'active' : ''}`}
              onClick={() => setTierRate(0.15)}
            >
              Platinum (15%)
            </button>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="calc-results-panel">
        <div>
          <div className="calc-res-heading">Projected Monthly Earnings</div>
          <div className="calc-res-big">${Math.round(calculations.monthlyTotal).toLocaleString()}</div>

          <div className="calc-breakdown">
            <div className="calc-breakdown-row">
              <span>Gross Monthly Volume:</span>
              <span>${calculations.grossVolume.toLocaleString()}</span>
            </div>
            <div className="calc-breakdown-row">
              <span>Base Commission:</span>
              <span>${Math.round(calculations.baseComm).toLocaleString()}</span>
            </div>
            <div className="calc-breakdown-row">
              <span>Milestone Cash Bonus:</span>
              <span style={{ color: 'var(--emerald-400)' }}>+${calculations.bonus.toLocaleString()}</span>
            </div>
            <div className="calc-breakdown-row">
              <span>Projected Annual Run-Rate:</span>
              <span style={{ color: 'var(--cyan-400)' }}>${Math.round(calculations.annualTotal).toLocaleString()} / yr</span>
            </div>
          </div>
        </div>

        <button className="btn btn-primary w-full btn-lg" onClick={onClaim}>
          <span>🚀 Claim Your Agent Link & Start Earning</span>
        </button>
      </div>
    </div>
  );
}
