/**
 * GPA result card — displays semester GPA and supporting totals.
 */

import { formatNumber } from "../utils/helpers.js";

export function renderGPAResult(result) {
  const card = document.createElement("section");
  card.className = "card gpa-result";

  card.innerHTML = `
    <h2>Semester GPA</h2>
    <div class="gpa-grid">
      <div class="gpa-big">
        <span class="gpa-value">${formatNumber(result.gpa)}</span>
        <span class="gpa-label">GPA</span>
      </div>
      <div class="gpa-stats">
        <div class="stat">
          <span class="stat-value">${formatNumber(result.totalCredits)}</span>
          <span class="stat-label">Total Credits</span>
        </div>
        <div class="stat">
          <span class="stat-value">${formatNumber(result.totalQualityPoints)}</span>
          <span class="stat-label">Quality Points</span>
        </div>
        <div class="stat">
          <span class="stat-value">${result.courseCount}</span>
          <span class="stat-label">Courses</span>
        </div>
      </div>
    </div>
  `;

  return card;
}