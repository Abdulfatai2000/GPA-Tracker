/**
 * Course section component.
 *
 * Visual structure for course management. Includes:
 *   - Section header with "Add Course" action
 *   - Course table (desktop) with the expected columns
 *   - Empty state when no courses exist
 *
 * On small screens the table is horizontally scrollable so it never breaks
 * the layout. Edit/delete actions are wired via callbacks.
 */

import { escapeHtml } from "../utils/helpers.js";

export function renderCourseSection(courses, scale, { onAddCourse, onEdit, onDelete }) {
  const section = document.createElement("section");
  section.className = "card course-section";
  section.setAttribute("aria-label", "Courses");

  const hasCourses = Array.isArray(courses) && courses.length > 0;

  section.innerHTML = `
    <div class="section-head">
      <h2>Courses</h2>
      <button type="button" class="btn btn-primary btn-sm" data-add-course>+ Add course</button>
    </div>

    ${hasCourses ? renderCourseTable(courses, scale, onEdit, onDelete) : renderEmptyState(onAddCourse)}
  `;

  // Wire the add-course button.
  section.querySelector("[data-add-course]")?.addEventListener("click", onAddCourse);

  return section;
}

function renderCourseTable(courses, scale, onEdit, onDelete) {
  const rows = courses
    .map((course, index) => {
      const point = gradePointFor(scale, course.grade);
      const quality = (Number(course.credits) || 0) * point;
      return `
        <tr>
          <td>${escapeHtml(course.code)}</td>
          <td>${escapeHtml(course.name)}</td>
          <td>${escapeHtml(String(course.credits))}</td>
          <td>${escapeHtml(String(course.grade))}</td>
          <td>${escapeHtml(String(point))}</td>
          <td>
            <div class="col-actions">
              <button type="button" class="btn btn-ghost btn-sm" data-edit="${index}">Edit</button>
              <button type="button" class="btn btn-danger btn-sm" data-delete="${index}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Credits</th>
            <th>Grade</th>
            <th>Grade Pt</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

function renderEmptyState(onAddCourse) {
  return `
    <div class="empty-state empty-state-courses">
      <p class="empty-state-eyebrow">No courses yet</p>
      <h3>Add your first course to start calculating your GPA</h3>
      <p>Enter the course code, name, credit units, and grade — we will do the math.</p>
      <button type="button" class="btn btn-primary" data-add-course>Add course</button>
    </div>
  `;
}

function gradePointFor(scale, label) {
  const entry = scale.find((e) => e.label === label);
  return entry ? entry.gradePoint : 0;
}