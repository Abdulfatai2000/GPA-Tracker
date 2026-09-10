/**
 * GPA summary card component.
 *
 * Visually prominent dashboard card showing the current semester GPA and
 * supporting totals. Accepts a result object from the GPA service; when no
 * data exists yet it renders sensible empty/default values.
 *
 * Expected `result` shape (from gpaService.calculateSemesterGPA):
 *   { gpa, totalCredits, totalQualityPoints, courseCount }
 * A null/undefined result renders the empty state.
 */

import { formatNumber } from "../utils/helpers.js";

export function renderGpaSummary(result) {
  const card = document.createElement("section");
  card.className = "card gpa-summary";
  card.setAttribute("aria-label", "GPA summary");

  const isEmpty = !result || result.courseCount === 0;

  if (isEmpty) {
    card.innerHTML = `
      <div class="gpa-summary-head">
        <span class="gpa-summary-label">Current GPA</span>
        <span class="gpa-summary-hint">No courses added yet</span>
      </div>
      <div class="gpa-big">
        <span class="gpa-value">0.00</span>
        <span class="gpa-label">GPA</span>
      </div>
      <ul class="gpa-stats">
        <li>
          <span class="stat-value">0</span>
          <span class="stat-label">Total Credits</span>
        </li>
        <li>
          <span class="stat-value">0</span>
          <span class="stat-label">Quality Points</span>
        </li>
        <li>
          <span class="stat-value">0</span>
          <span class="stat-label">Courses</span>
        </li>
      </ul>
    `;
    return card;
  }

  card.innerHTML = `
    <div class="gpa-summary-head">
      <span class="gpa-summary-label">Current GPA</span>
    </div>
    <div class="gpa-big">
      <span class="gpa-value">${formatNumber(result.gpa)}</span>
      <span class="gpa-label">GPA</span>
    </div>
    <ul class="gpa-stats">
      <li>
        <span class="stat-value">${formatNumber(result.totalCredits)}</span>
        <span class="stat-label">Total Credits</span>
      </li>
      <li>
        <span class="stat-value">${formatNumber(result.totalQualityPoints)}</span>
        <span class="stat-label">Quality Points</span>
      </li>
      <li>
        <span class="stat-value">${result.courseCount}</span>
        <span class="stat-label">Courses</span>
      </li>
    </ul>
  `;

  return card;
}