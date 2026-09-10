/**
 * Course form component — lets the user add a course to the active semester.
 * Grade options are generated from the semester's grading scale.
 */

import { getGradingScale, getGradeOptions } from "../config/gradingScales.js";

export function renderCourseForm(scaleKey = "5.0", onSubmit) {
  const form = document.createElement("form");
  form.className = "card course-form";
  form.setAttribute("novalidate", "");

  const options = getGradeOptions(getGradingScale(scaleKey));

  form.innerHTML = `
    <h2>Add Course</h2>
    <label class="field">
      <span>Course code</span>
      <input type="text" id="course-code" placeholder="e.g. CS101" required />
    </label>
    <label class="field">
      <span>Course name</span>
      <input type="text" id="course-name" placeholder="e.g. Introduction to Programming" required />
    </label>
    <label class="field">
      <span>Credit units</span>
      <input type="number" id="course-credits" min="0.5" step="0.5" placeholder="3" required />
    </label>
    <label class="field">
      <span>Grade</span>
      <select id="course-grade" required></select>
    </label>
    <button type="submit" class="btn btn-primary">Add Course</button>
    <p class="form-error" id="course-form-error" role="alert"></p>
  `;

  // Populate grade options from the active scale.
  const gradeSelect = form.querySelector("#course-grade");
  gradeSelect.innerHTML = options
    .map((g) => `<option value="${g.label}">${g.label}</option>`)
    .join("");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = form.querySelector("#course-code").value.trim();
    const name = form.querySelector("#course-name").value.trim();
    const credits = Number(form.querySelector("#course-credits").value);
    const grade = form.querySelector("#course-grade").value;
    const errorEl = form.querySelector("#course-form-error");

    if (!code) {
      errorEl.textContent = "Course code is required.";
      return;
    }
    if (!name) {
      errorEl.textContent = "Course name is required.";
      return;
    }
    if (!(credits > 0)) {
      errorEl.textContent = "Credit units must be a positive number.";
      return;
    }
    if (!grade) {
      errorEl.textContent = "A grade must be selected.";
      return;
    }
    errorEl.textContent = "";

    onSubmit({ code, name, credits, grade });
    form.reset();
  });

  return form;
}