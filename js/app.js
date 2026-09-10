/**
 * GPA Tracker — main application controller.
 *
 * Wires together the models, services, and UI components. Keeps state in a
 * single `state` object and re-renders the relevant views on change.
 */

import { createSemester } from "./models/Semester.js";
import { createCourse, validateCourse } from "./models/Course.js";
import { calculateSemesterGPA, calculateCGPA } from "./services/gpaService.js";
import { loadAppState, saveAppState } from "./services/storageService.js";
import { getGradingScale } from "./config/gradingScales.js";
import { renderSemesterForm } from "./components/semesterForm.js";
import { renderSemesterList } from "./components/semesterList.js";
import { renderCourseForm } from "./components/courseForm.js";
import { renderCourseList } from "./components/courseList.js";
import { renderGPAResult } from "./components/gpaResult.js";
import { renderHeader } from "./components/header.js";
import { showToast } from "./components/toast.js";
import { showConfirm } from "./components/confirm.js";
import { renderSettings } from "./components/settings.js";
import { renderCourseSection } from "./components/courseSection.js";
import { applyTheme, getPreferredTheme, toggleTheme } from "./utils/theme.js";
import { renderAnalyticsPanel } from "./components/analyticsPanel.js";

const App = {
  state: {
    semesters: [],
    activeSemesterId: null,
    theme: getPreferredTheme(),
  },

  init() {
    applyTheme(this.state.theme);
    this.restoreData();
    this.render();
  },

  // ----- Data management -----

  restoreData() {
    const { semesters, activeSemesterId } = loadAppState();
    // Normalize older or malformed entries conservatively.
    this.state.semesters = Array.isArray(semesters) ? semesters.map((s) => ({
      id: s.id || null,
      name: s.name || "",
      session: s.session || "",
      scaleKey: s.scaleKey || "5.0",
      courses: Array.isArray(s.courses) ? s.courses : [],
    })) : [];
    // load settings if present
    const raw = loadAppState();
    this.state.settings = raw.settings || { defaultScaleKey: '5.0' };
    this.state.activeSemesterId = activeSemesterId || (this.state.semesters.length > 0 ? this.state.semesters[0].id : null);
  },

  persist() {
    saveAppState({ semesters: this.state.semesters, activeSemesterId: this.state.activeSemesterId, settings: this.state.settings });
  },

  getActiveSemester() {
    return this.state.semesters.find((s) => s.id === this.state.activeSemesterId) || null;
  },

  // ----- Actions -----

  handleCreateSemester({ name, scaleKey }) {
    const semester = createSemester({ name, scaleKey });
    this.state.semesters.unshift(semester);
    this.state.activeSemesterId = semester.id;
    this.persist();
    this.render();
  },

  handleCreateSemesterWithSession({ name, session, scaleKey }) {
    const semester = createSemester({ name, session, scaleKey });
    this.state.semesters.unshift(semester);
    this.state.activeSemesterId = semester.id;
    this.persist();
    this.render();
  },

  handleSelectSemester(id) {
    if (!id) return;
    const found = this.state.semesters.find((s) => s.id === id);
    if (!found) {
      showToast('Selected semester not found.', 'error');
      return;
    }
    this.state.activeSemesterId = id;
    this.persist();
    this.render();
  },

  handleRenameSemester(id) {
    const sem = this.state.semesters.find((s) => s.id === id);
    if (!sem) return;
    const name = prompt('Rename semester:', sem.name);
    if (name === null) return;
    const session = prompt('Academic session (e.g. 2025/2026):', sem.session || '');
    if (session === null) return;
    sem.name = String(name).trim() || sem.name;
    sem.session = String(session).trim() || sem.session;
    this.persist();
    showToast('Semester renamed', 'success');
    this.render();
  },

  async handleDeleteSemester(id) {
    const idx = this.state.semesters.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const sem = this.state.semesters[idx];
    const msg = (sem.courses || []).length > 0
      ? `Delete semester "${sem.name}" and its ${sem.courses.length} courses? This cannot be undone.`
      : `Delete semester "${sem.name}"?`;
    const ok = await showConfirm(msg);
    if (!ok) return;
    this.state.semesters.splice(idx, 1);
    // Choose a sensible active semester.
    if (this.state.activeSemesterId === id) {
      this.state.activeSemesterId = this.state.semesters.length > 0 ? this.state.semesters[0].id : null;
    }
    this.persist();
    showToast('Semester deleted', 'success');
    this.render();
  },

  handleAddCourse({ code, name, credits, grade }) {
    const semester = this.getActiveSemester();
    if (!semester) return;
    const scale = getGradingScale(semester.scaleKey);
    const course = createCourse({ code, name, credits, grade });

    // Validate course against scale.
    const { valid, errors } = validateCourse(course, scale);
    if (!valid) {
      showToast(errors.join('\n'), 'error');
      return;
    }

    semester.courses.push(course);
    this.persist();
    this.render();
  },

  handleEditCourse(index) {
    const semester = this.getActiveSemester();
    if (!semester || !semester.courses[index]) return;
    const course = semester.courses[index];

    const code = prompt("Course code:", course.code);
    if (code === null) return;
    const name = prompt("Course name:", course.name);
    if (name === null) return;
    const creditsStr = prompt("Credit units:", String(course.credits));
    if (creditsStr === null) return;
    const grade = prompt("Grade:", course.grade);
    if (grade === null) return;

    const updated = {
      ...course,
      code: String(code).trim(),
      name: String(name).trim(),
      credits: Number(creditsStr) || 0,
      grade: String(grade).trim(),
    };

    const scale = getGradingScale(semester.scaleKey);
    const { valid, errors } = validateCourse(updated, scale);
    if (!valid) {
      showToast(errors.join('\n'), 'error');
      return;
    }

    semester.courses[index] = updated;
    this.persist();
    this.render();
  },

  async handleDeleteCourse(index) {
    const semester = this.getActiveSemester();
    if (!semester || !semester.courses[index]) return;
    const ok = await showConfirm('Delete this course?');
    if (!ok) return;
    semester.courses.splice(index, 1);
    this.persist();
    showToast('Course deleted', 'success');
    this.render();
  },

  // ----- Theme -----

  // Toggle theme and re-render header so toggle label updates.
  toggleTheme() {
    this.state.theme = toggleTheme(this.state.theme);
    applyTheme(this.state.theme);
    this.render();
  },

  // ----- Rendering -----

  render() {
    const app = document.getElementById("app");
    app.innerHTML = "";
    // Render header component (keeps branding + theme toggle consistent)
    app.appendChild(renderHeader(this.state.theme, () => this.toggleTheme(), () => {
      // Open settings modal
      const overlay = renderSettings({ currentTheme: this.state.theme, defaultScaleKey: this.state.settings?.defaultScaleKey || '5.0' }, {
        onClose: () => {},
        onSave: ({ theme, defaultScaleKey }) => {
          // Apply theme choice (system means use preferred)
          const newTheme = theme === 'system' ? getPreferredTheme() : theme;
          this.state.theme = newTheme;
          applyTheme(this.state.theme);
          this.state.settings = this.state.settings || {};
          this.state.settings.defaultScaleKey = defaultScaleKey;
          this.persist();
          showToast('Settings saved', 'success');
          this.render();
        },
        onClear: async () => {
          const ok = await showConfirm('This will permanently delete all academic data (semesters and courses). Your theme preference will be kept. Continue?');
          if (!ok) return;
          // Clear semesters but keep settings and theme
          this.state.semesters = [];
          this.state.activeSemesterId = null;
          this.persist();
          showToast('Academic data cleared', 'success');
          overlay.remove();
          this.render();
        }
      });
      document.body.appendChild(overlay);
    }));

    const main = document.createElement("main");
    main.className = "app-main";

    // Page intro
    const intro = document.createElement("section");
    intro.className = "card intro";
    intro.innerHTML = `
      <h2>Welcome</h2>
      <p class="muted">Create semesters, add courses, and calculate your semester GPA. This dashboard is responsive and supports light/dark themes.</p>
    `;
    main.appendChild(intro);

    // Layout: two-column responsive dashboard
    const grid = document.createElement("div");
    grid.className = "dashboard-grid";

    // If no active semester, show only the create-semester form.
    const semester = this.getActiveSemester();
    if (!semester) {
      const left = document.createElement("div");
      left.className = "col left";
      left.appendChild(renderSemesterForm(({ name, session, scaleKey }) =>
        this.handleCreateSemesterWithSession({ name, session, scaleKey })
      ));

      const right = document.createElement("div");
      right.className = "col right";
      right.appendChild(this.renderEmptyState());

      grid.appendChild(left);
      grid.appendChild(right);
      main.appendChild(grid);
    } else {
      // Active semester banner.
      main.appendChild(this.renderActiveBanner(semester));

      const left = document.createElement("div");
      left.className = "col left";
      // Semester list (history)
      left.appendChild(renderSemesterList(this.state.semesters, this.state.activeSemesterId, {
        onSelect: (id) => this.handleSelectSemester(id),
        onEdit: (id) => this.handleRenameSemester(id),
        onDelete: (id) => this.handleDeleteSemester(id),
        onCreate: () => {
          // focus create form by rendering and focusing later
          this.state.activeSemesterId = null;
          this.render();
        }
      }));

      // Semester form (edit / context) — prepared for later functionality
      left.appendChild(renderSemesterForm(({ name, session, scaleKey }) => this.handleCreateSemesterWithSession({ name, session, scaleKey })));
      // Course form
      left.appendChild(renderCourseForm(semester.scaleKey, (data) => this.handleAddCourse(data)));
      // Course section (table + actions)
      const scale = getGradingScale(semester.scaleKey);
      left.appendChild(renderCourseSection(semester.courses, scale, {
        onAddCourse: () => {
          // focus the add-course form's first input
          const el = document.querySelector('.course-form #course-code');
          if (el) el.focus();
        },
        onEdit: (i) => this.handleEditCourse(i),
        onDelete: (i) => this.handleDeleteCourse(i),
      }));

      const right = document.createElement("div");
      right.className = "col right";
      // GPA & CGPA summary card
      const result = calculateSemesterGPA(semester);
      const overall = calculateCGPA(this.state.semesters);
      const summary = document.createElement('section');
      summary.className = 'card summary-card';
      summary.innerHTML = `
        <h2>Academic Summary</h2>
        <div class="gpa-grid">
          <div class="gpa-big">
            <span class="gpa-value">${result.gpa === 0 ? '—' : result.gpa.toFixed(2)}</span>
            <span class="gpa-label">Current Semester GPA</span>
          </div>
          <div class="gpa-stats">
            <div class="stat">
              <span class="stat-value">${overall.cgpa === 0 ? '—' : overall.cgpa.toFixed(2)}</span>
              <span class="stat-label">Overall CGPA</span>
            </div>
            <div class="stat">
              <span class="stat-value">${overall.totalCredits || 0}</span>
              <span class="stat-label">Total Credits (all semesters)</span>
            </div>
            <div class="stat">
              <span class="stat-value">${this.state.semesters.length || 0}</span>
              <span class="stat-label">Semesters</span>
            </div>
          </div>
        </div>
        <div style="margin-top:0.75rem">
          <div class="muted small">This view shows the active semester and your cumulative CGPA across all saved semesters.</div>
        </div>
      `;
      right.appendChild(summary);

      // Full GPA result card (detail)
      right.appendChild(renderGPAResult(result));

      // Analytics panel
      right.appendChild(renderAnalyticsPanel(this.state.semesters));

      grid.appendChild(left);
      grid.appendChild(right);
      main.appendChild(grid);
    }

    app.appendChild(main);
  },

  renderActiveBanner(semester) {
    const banner = document.createElement("div");
    banner.className = "card banner";
    banner.innerHTML = `
      <div>
        <span class="banner-label">Active semester</span>
        <strong>${semester.name}</strong>
        <span class="banner-scale">Scale: ${semester.scaleKey}</span>
      </div>
    `;
    return banner;
  },

  renderEmptyState() {
    const note = document.createElement("div");
    note.className = "card empty-state";
    note.innerHTML = `
      <h3>No semester yet</h3>
      <p>Create your first semester to start tracking courses and GPA.</p>
    `;
    return note;
  },
};

// Boot the app once the DOM is ready.
document.addEventListener("DOMContentLoaded", () => App.init());