/**
 * GPA result area component.
 *
 * Dedicated card where semester GPA results will appear. In this phase it
 * renders a clear placeholder state so the user understands what belongs here
 * without any calculation logic being wired up yet.
 *
 * Accepts an optional `result` object (from gpaService.calculateSemesterGPA).
 * When absent, the placeholder state is shown.
 */

import { formatNumber } from "../utils/helpers.js";

export function renderGpaResultArea(result) {
  const card = document.createElement("section");
  card.className = "card gpa-result";
  card.setAttribute("aria-label", "GPA result");

  if (!result) {
    card.innerHTML = `
      <div class="section-head">
        <h2>GPA result</h2>
        <span class="section-hint">Calculated after courses are added</span>
      </div>
      <div class="result-placeholder">
        <span class="result-value">—</span>
        <span class="result-label">GPA</span>
        <ul class="result-stats">
          <li>
            <span class="stat-value">0</span>
            <span class="stat-label">Credits</span>
          </li>
          <li>
            <span class="stat-value">0</span>
            <span class="stat-label">Quality pts</span>
          </li>
          <li>
            <span class="stat-value">0</span>
            <span class="stat-label">Courses</span>
          </li>
        </ul>
      </div>
    `;
    return card;
  }

  card.innerHTML = `
    <div class="section-head">
      <h2>GPA result</h2>
    </div>
    <div class="result-content">
      <span class="result-value">${formatNumber(result.gpa)}</span>
      <span class="result-label">GPA</span>
      <ul class="result-stats">
        <li>
          <span class="stat-value">${formatNumber(result.totalCredits)}</span>
          <span class="stat-label">Credits</span>
        </li>
        <li>
          <span class="stat-value">${formatNumber(result.totalQualityPoints)}</span>
          <span class="stat-label">Quality pts</span>
        </li>
        <li>
          <span class="stat-value">${result.courseCount}</span>
          <span class="stat-label">Courses</span>
        </li>
      </ul>
    </div>
  `;

  return card;
}