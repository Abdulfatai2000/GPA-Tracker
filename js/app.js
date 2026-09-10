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
import { applyTheme, getPreferredTheme, toggleTheme } from "./utils/theme.js";

const App = {
  state: {
    semesters: [],
    activeSemesterId: null,
    theme: getPreferredTheme(),
  },

  init() {
    applyTheme(this.state.theme);
    this.bindThemeToggle();
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

  bindThemeToggle() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-theme-toggle]");
      if (!button) return;
      this.state.theme = toggleTheme(this.state.theme);
      applyTheme(this.state.theme);
    });
  },

  // ----- Rendering -----

  render() {
    const app = document.getElementById("app");
    app.innerHTML = "";

    const header = document.createElement("header");
    header.className = "app-header";
    header.innerHTML = `
      <div class="brand">
        <h1>GPA Tracker</h1>
        <p class="tagline">Plan. Track. Succeed.</p>
      </div>
      <button type="button" class="btn btn-ghost" data-theme-toggle aria-label="Toggle theme">
        ${this.state.theme === "dark" ? "Light" : "Dark"}
      </button>
    `;
    app.appendChild(header);

    const main = document.createElement("main");
    main.className = "app-main";

    // If no active semester, show only the create-semester form.
    const semester = this.getActiveSemester();
    if (!semester) {
      main.appendChild(
        renderSemesterForm(({ name, scaleKey }) =>
          this.handleCreateSemester({ name, scaleKey })
        )
      );
      main.appendChild(this.renderEmptyState());
    } else {
      // Active semester banner.
      main.appendChild(this.renderActiveBanner(semester));

      // Course form bound to the semester's scale.
      main.appendChild(
        renderCourseForm(semester.scaleKey, (data) => this.handleAddCourse(data))
      );

      // Course list.
      const scale = getGradingScale(semester.scaleKey);
      main.appendChild(
        renderCourseList(semester.courses, scale, {
          onEdit: (i) => this.handleEditCourse(i),
          onDelete: (i) => this.handleDeleteCourse(i),
        })
      );

      // GPA result.
      const result = calculateSemesterGPA(semester);
      main.appendChild(renderGPAResult(result));
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