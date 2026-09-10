/**
 * Semester form component — lets the user create a new semester.
 * Emits a "submit" event with the semester data when submitted.
 */

export function renderSemesterForm(onSubmit) {
  const form = document.createElement("form");
  form.className = "card semester-form";
  form.setAttribute("novalidate", "");

  form.innerHTML = `
    <h2>Create Semester</h2>
    <label class="field">
      <span>Semester name</span>
      <input type="text" id="semester-name" placeholder="e.g. Fall 2026" required />
    </label>
    <label class="field">
      <span>Grading scale</span>
      <select id="semester-scale">
        <option value="5.0">5.0 scale (A=5.0)</option>
        <option value="4.0">4.0 scale (A=4.0)</option>
      </select>
    </label>
    <button type="submit" class="btn btn-primary">Create Semester</button>
    <p class="form-error" id="semester-form-error" role="alert"></p>
  `;

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

    onSubmit({ name, scaleKey });
    form.reset();
  });

  return form;
}