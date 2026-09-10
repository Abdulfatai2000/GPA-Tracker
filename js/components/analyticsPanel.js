import { calculatePerformanceSummary, calculateGPATrend, calculateCGPATrend, calculateGradeDistribution, calculateCreditStatistics, generateAcademicInsights } from "../services/analyticsService.js";
import { formatNumber } from "../utils/helpers.js";

export function renderAnalyticsPanel(semesters = []) {
  const panel = document.createElement('section');
  panel.className = 'card analytics-panel';
  panel.setAttribute('aria-label', 'Academic analytics');

  const summary = calculatePerformanceSummary(semesters);
  const gpaTrend = calculateGPATrend(semesters);
  const cgpaTrend = calculateCGPATrend(semesters);
  const dist = calculateGradeDistribution(semesters);
  const credits = calculateCreditStatistics(semesters);
  const insights = generateAcademicInsights(semesters);

  // Metrics row
  const metricsHtml = `
    <div class="analytics-metrics">
      <div class="metric">
        <div class="metric-value">${summary.semesterResults.length ? formatNumber(summary.semesterResults[summary.semesterResults.length-1].gpa) : '—'}</div>
        <div class="metric-label">Current GPA</div>
      </div>
      <div class="metric">
        <div class="metric-value">${summary.overallCGPA ? formatNumber(summary.overallCGPA) : '—'}</div>
        <div class="metric-label">Overall CGPA</div>
      </div>
      <div class="metric">
        <div class="metric-value">${summary.totals.semesters}</div>
        <div class="metric-label">Semesters</div>
      </div>
      <div class="metric">
        <div class="metric-value">${summary.totals.courses}</div>
        <div class="metric-label">Courses</div>
      </div>
      <div class="metric">
        <div class="metric-value">${summary.totals.credits}</div>
        <div class="metric-label">Total Credits</div>
      </div>
    </div>
  `;

  // Simple SVG line chart for GPA trend
  function renderTrendSVG(points, labelKey = 'gpa') {
    if (!points || points.length === 0) return '<div class="empty-state">No trend data</div>';
    const width = 360; const height = 120; const padding = 18;
    const values = points.map(p => Number(p[labelKey]) || 0);
    const max = Math.max(...values, 4);
    const min = Math.min(...values, 0);
    const range = max - min || 1;
    const stepX = (width - padding*2) / Math.max(points.length - 1, 1);
    const path = values.map((v,i) => {
      const x = padding + i*stepX;
      const y = padding + (1 - (v - min)/range) * (height - padding*2);
      return `${i===0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');
    const labels = points.map((p,i) => `<text x='${(padding + i*stepX).toFixed(2)}' y='${height - 2}' font-size='10' text-anchor='middle' fill='var(--muted)'>${p.label}</text>`).join('');
    return `
      <svg viewBox='0 0 ${width} ${height}' role='img' aria-label='GPA trend chart'>
        <path d='${path}' fill='none' stroke='var(--primary)' stroke-width='2' stroke-linejoin='round' stroke-linecap='round'></path>
        ${labels}
      </svg>
    `;
  }

  // Grade distribution list
  const distHtml = dist.length ? dist.map(d => `<div class="dist-row"><div class="dist-label">${d.label}</div><div class="dist-count">${d.count}</div></div>`).join('') : '<div class="empty-state">No grades</div>';

  // Insights
  const insightsHtml = insights.map(i => `<li>${i}</li>`).join('');

  panel.innerHTML = `
    <h2>Performance Overview</h2>
    ${metricsHtml}
    <div class="analytics-grid">
      <div class="card small-card">
        <h3>GPA Trend</h3>
        <div class="chart">${renderTrendSVG(gpaTrend, 'gpa')}</div>
      </div>
      <div class="card small-card">
        <h3>CGPA Trend</h3>
        <div class="chart">${renderTrendSVG(cgpaTrend, 'cgpa')}</div>
      </div>
      <div class="card small-card">
        <h3>Grade Distribution</h3>
        <div class="dist-wrap">${distHtml}</div>
      </div>
      <div class="card small-card">
        <h3>Credits</h3>
        <div class="credits-wrap">
          <div>Total: <strong>${credits.totalCredits}</strong></div>
          <div>Avg / Sem: <strong>${credits.averageCredits}</strong></div>
          <div>Highest Sem: <strong>${credits.highestCredits}</strong></div>
        </div>
      </div>
    </div>
    <div class="card insights-card">
      <h3>Insights</h3>
      <ul>${insightsHtml}</ul>
    </div>
  `;

  return panel;
}
