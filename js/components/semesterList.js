/**
 * Semester list component — shows available semesters and allows selection,
 * renaming and deletion. Keeps UI minimal and accessible.
 */

import { escapeHtml } from "../utils/helpers.js";

export function renderSemesterList(semesters = [], activeId = null, { onSelect, onEdit, onDelete, onCreate } = {}) {
  const section = document.createElement("section");
  section.className = "card semester-list";
  section.setAttribute("aria-label", "Semester history");

  if (!Array.isArray(semesters) || semesters.length === 0) {
    section.innerHTML = `
      <h2>Semesters</h2>
      <div class="empty-state">
        <p class="empty-state-eyebrow">No semesters yet</p>
        <p>Create your first semester to begin tracking courses and CGPA.</p>
        <div style="margin-top:0.5rem"><button class="btn btn-primary" data-create>+ Create semester</button></div>
      </div>
    `;
    section.querySelector("[data-create]")?.addEventListener("click", () => onCreate && onCreate());
    return section;
  }

  const rows = semesters
    .map((s) => {
      const isActive = s.id === activeId;
      return `
        <div class="semester-row ${isActive ? 'active' : ''}" data-id="${s.id}">
          <div class="semester-meta">
            <strong>${escapeHtml(s.name)}</strong>
            <div class="muted small">${escapeHtml(s.session || '')} • Scale: ${escapeHtml(s.scaleKey || '')}</div>
          </div>
          <div class="semester-actions">
            <button class="btn btn-secondary btn-sm" data-select="${s.id}" aria-label="Select ${escapeHtml(s.name)}">View</button>
            <button class="btn btn-ghost btn-sm" data-edit="${s.id}" aria-label="Rename ${escapeHtml(s.name)}">Rename</button>
            <button class="btn btn-danger btn-sm" data-delete="${s.id}" aria-label="Delete ${escapeHtml(s.name)}">Delete</button>
          </div>
        </div>
      `;
    })
    .join("");

  section.innerHTML = `
    <h2>Semesters</h2>
    <div class="semester-list-rows">${rows}</div>
    <div style="margin-top:0.5rem"><button class="btn btn-primary" data-create>+ Create semester</button></div>
  `;

  // Wire events
  section.querySelectorAll('[data-select]').forEach((btn) => {
    btn.addEventListener('click', () => onSelect && onSelect(btn.dataset.select));
  });
  section.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => onEdit && onEdit(btn.dataset.edit));
  });
  section.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => onDelete && onDelete(btn.dataset.delete));
  });
  section.querySelector('[data-create]')?.addEventListener('click', () => onCreate && onCreate());

  return section;
}
