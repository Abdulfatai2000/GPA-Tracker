/**
 * GPA Tracker — main application controller.
 *
 * Wires together the models, services, and UI components. Keeps state in a
 * single `state` object and re-renders the relevant views on change.
 */

import { createSemester } from "./models/Semester.js";
import { createCourse } from "./models/Course.js";
import { calculateSemesterGPA } from "./services/gpaService.js";
import { loadSemesters, saveSemesters } from "./services/storageService.js";
import { getGradingScale } from "./config/gradingScales.js";
import { renderSemesterForm } from "./components/semesterForm.js";
import { renderCourseForm } from "./components/courseForm.js";
import { renderCourseList } from "./components/courseList.js";
import { renderGPAResult } from "./components/gpaResult.js";
import { renderHeader } from "./components/header.js";
import { renderCourseSection } from "./components/courseSection.js";
import { applyTheme, getPreferredTheme, toggleTheme } from "./utils/theme.js";

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
    this.state.semesters = loadSemesters();
    this.state.activeSemesterId =
      this.state.semesters.length > 0 ? this.state.semesters[0].id : null;
  },

  persist() {
    saveSemesters(this.state.semesters);
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

  handleAddCourse({ code, name, credits, grade }) {
    const semester = this.getActiveSemester();
    if (!semester) return;
    const course = createCourse({ code, name, credits, grade });
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

    semester.courses[index] = {
      ...course,
      code: code.trim(),
      name: name.trim(),
      credits: Number(creditsStr) || 0,
      grade: grade.trim(),
    };
    this.persist();
    this.render();
  },

  handleDeleteCourse(index) {
    const semester = this.getActiveSemester();
    if (!semester || !semester.courses[index]) return;
    if (!confirm("Delete this course?")) return;
    semester.courses.splice(index, 1);
    this.persist();
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
    app.appendChild(renderHeader(this.state.theme, () => this.toggleTheme()));

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
      left.appendChild(renderSemesterForm(({ name, scaleKey }) =>
        this.handleCreateSemester({ name, scaleKey })
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
      // Semester form (edit / context) — prepared for later functionality
      left.appendChild(renderSemesterForm(({ name, scaleKey }) => this.handleCreateSemester({ name, scaleKey })));
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
      // GPA summary card
      const result = calculateSemesterGPA(semester);
      const summary = document.createElement('section');
      summary.className = 'card summary-card';
      summary.innerHTML = `
        <h2>Summary</h2>
        <div class="gpa-grid">
          <div class="gpa-big">
            <span class="gpa-value">${result.gpa === 0 ? '—' : result.gpa.toFixed(2)}</span>
            <span class="gpa-label">GPA</span>
          </div>
          <div class="gpa-stats">
            <div class="stat">
              <span class="stat-value">${result.totalCredits || 0}</span>
              <span class="stat-label">Total Credits</span>
            </div>
            <div class="stat">
              <span class="stat-value">${result.totalQualityPoints || 0}</span>
              <span class="stat-label">Quality Points</span>
            </div>
            <div class="stat">
              <span class="stat-value">${result.courseCount || 0}</span>
              <span class="stat-label">Courses</span>
            </div>
          </div>
        </div>
      `;
      right.appendChild(summary);

      // Full GPA result card (detail)
      right.appendChild(renderGPAResult(result));

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