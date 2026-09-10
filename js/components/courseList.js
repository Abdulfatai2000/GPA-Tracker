/**
 * Course list component — renders the table of courses for the active semester.
 * Includes edit/delete actions per row.
 */

import { escapeHtml } from "../utils/helpers.js";

export function renderCourseList(courses, scale, { onEdit, onDelete }) {
  const section = document.createElement("section");
  section.className = "card course-list";

  if (!courses || courses.length === 0) {
    section.innerHTML = `
      <h2>Courses</h2>
      <p class="empty-state">No courses added yet. Add your first course above.</p>
    `;
    return section;
  }

  const header = `
    <h2>Courses (${courses.length})</h2>
    <table>
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Credits</th>
          <th>Grade</th>
          <th>Quality Pts</th>
          <th class="col-actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${courses
          .map((course, index) => {
            const point = gradePointFor(scale, course.grade);
            const quality = (Number(course.credits) || 0) * point;
            return `
              <tr data-index="${index}">
                <td>${escapeHtml(course.code)}</td>
                <td>${escapeHtml(course.name)}</td>
                <td>${escapeHtml(String(course.credits))}</td>
                <td>${escapeHtml(String(course.grade))}</td>
                <td>${escapeHtml(String(quality))}</td>
                <td>
                  <button type="button" class="btn btn-ghost btn-sm" data-edit="${index}">Edit</button>
                  <button type="button" class="btn btn-danger btn-sm" data-delete="${index}">Delete</button>
                </td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;

  section.innerHTML = header;

  section.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => onEdit(Number(btn.dataset.edit)));
  });
  section.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => onDelete(Number(btn.dataset.delete)));
  });

  return section;
}

function gradePointFor(scale, label) {
  const entry = scale.find((e) => e.label === label);
  return entry ? entry.gradePoint : 0;
}