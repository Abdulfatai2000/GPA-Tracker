/**
 * Semester workspace component.
 *
 * Visually communicates the current semester context. Two states:
 *   - Empty: a form to create the first semester (name + scale).
 *   - Active: a banner showing the semester name and grading scale.
 *
 * The grading scale options come from the existing config so the UI stays
 * in sync with the configurable scales defined in gradingScales.js.
 */

import { GRADING_SCALES, getGradingScale } from "../config/gradingScales.js";

export function renderSemesterWorkspace(semester, onSubmitCreate) {
  const section = document.createElement("section");
  section.className = "card semester-workspace";
  section.setAttribute("aria-label", "Semester workspace");

  if (!semester) {
    section.innerHTML = `
      <div class="section-head">
        <h2>Your semester</h2>
        <span class="section-hint">Create one to get started</span>
      </div>
      <form class="semester-form" novalidate>
        <label class="field">
          <span for="semester-name">Semester name</span>
          <input type="text" id="semester-name" placeholder="e.g. Fall 2026" required />
        </label>
        <label class="field">
          <span for="semester-scale">Grading scale</span>
          <select id="semester-scale"></select>
        </label>
        <p class="form-error" id="semester-form-error" role="alert"></p>
        <button type="submit" class="btn btn-primary">Create semester</button>
      </form>
    `;

    const scaleSelect = section.querySelector("#semester-scale");
    scaleSelect.innerHTML = Object.entries(GRADING_SCALES)
      .map(([key, scale]) => {
        const maxPoint = Math.max(...scale.map((s) => s.gradePoint));
        return `<option value="${key}">${key} scale (max ${maxPoint.toFixed(1)})</option>`;
      })
      .join("");

    const form = section.querySelector("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = form.querySelector("#semester-name").value.trim();
      const scaleKey = form.querySelector("#semester-scale").value;
      const errorEl = form.querySelector("#semester-form-error");

      if (!name) {
        errorEl.textContent = "Semester name is required.";
        return;
      }
      errorEl.textContent = "";
      onSubmitCreate({ name, scaleKey });
    });

    return section;
  }

  // Active semester banner.
  const scale = getGradingScale(semester.scaleKey);
  const maxPoint = Math.max(...scale.map((s) => s.gradePoint));

  section.innerHTML = `
    <div class="section-head">
      <h2>Your semester</h2>
      <span class="section-hint">Active semester</span>
    </div>
    <div class="semester-banner">
      <div class="semester-info">
        <span class="semester-name">${semester.name}</span>
        <span class="semester-meta">Grading scale: ${semester.scaleKey} (max ${maxPoint.toFixed(1)})</span>
      </div>
    </div>
  `;

  return section;
}