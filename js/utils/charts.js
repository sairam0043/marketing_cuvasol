/* ==========================================================================
   CUVASOL AGENT CLOUD - CANVAS CHART UTILITIES (js/utils/charts.js)
   ========================================================================== */

export function renderRevenueChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Set resolution for retina / high-DPI
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const padding = { top: 20, right: 20, bottom: 35, left: 45 };

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [42000, 58000, 71000, 65000, 89000, 112000, 134000, 158000, 185000, 210000, 232000, 248500];

  const maxVal = 300000;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Clear
  ctx.clearRect(0, 0, width, height);

  // Draw Horizontal Grid Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#64748b';
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'right';

  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const y = padding.top + (chartH / gridSteps) * i;
    const val = maxVal - (maxVal / gridSteps) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(`$${val / 1000}k`, padding.left - 8, y + 4);
  }

  // Draw X Labels
  ctx.textAlign = 'center';
  const stepX = chartW / (data.length - 1);
  labels.forEach((lbl, i) => {
    const x = padding.left + i * stepX;
    ctx.fillText(lbl, x, height - 10);
  });

  // Calculate Points
  const points = data.map((val, i) => {
    return {
      x: padding.left + i * stepX,
      y: padding.top + chartH - (val / maxVal) * chartH
    };
  });

  // Fill Gradient Under Curve
  const grad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  grad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
  grad.addColorStop(0.6, 'rgba(99, 102, 241, 0.12)');
  grad.addColorStop(1, 'rgba(6, 9, 19, 0)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
  ctx.lineTo(points[0].x, height - padding.bottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Stroke Curve
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3;
  ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Draw Highlight Dots on latest points
  const lastPoint = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(lastPoint.x, lastPoint.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#00f0ff';
  ctx.stroke();
}

export function renderFunnelChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  const stages = [
    { label: 'Impressions', val: '48.2k', pct: 1.0, color: '#6366f1' },
    { label: 'Agent Clicks', val: '4,210', pct: 0.72, color: '#38bdf8' },
    { label: 'Lead Inquiries', val: '438', pct: 0.48, color: '#00f0ff' },
    { label: 'Deals Closed', val: '42', pct: 0.28, color: '#10b981' }
  ];

  const rowHeight = (height - 20) / stages.length;
  stages.forEach((stage, i) => {
    const y = 15 + i * rowHeight;
    const barW = (width - 140) * stage.pct;

    // Label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(stage.label, 10, y + 14);

    // Value
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText(stage.val, width - 10, y + 14);

    // Bar background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.roundRect(110, y + 4, width - 210, 12, 6);
    ctx.fill();

    // Bar fill
    ctx.fillStyle = stage.color;
    ctx.beginPath();
    ctx.roundRect(110, y + 4, barW * 0.7, 12, 6);
    ctx.fill();
  });
}
