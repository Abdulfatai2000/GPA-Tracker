/**
 * Semester model.
 *
 * A semester groups a set of courses together and records the grading scale
 * used for that semester. GPA is computed from the courses' quality points.
 *
 * Shape:
 *   {
 *     id,            // unique identifier
 *     name,          // e.g. "Fall 2026"
 *     scaleKey,      // key into GRADING_SCALES (e.g. "5.0")
 *     courses: [],  // array of Course objects
 *   }
 */

import { createCourse } from "./Course.js";

export function createSemester({ name = "", session = "", scaleKey = "5.0", courses = [] } = {}) {
  return {
    id: generateId(),
    name: String(name).trim(),
    session: String(session).trim(),
    scaleKey: String(scaleKey).trim() || "5.0",
    courses: Array.isArray(courses) ? courses.map((c) => (c && typeof c === "object" ? createCourse(c) : c)) : [],
  };
}

function generateId() {
  return "s_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

// Validate a semester's basic fields.
export function validateSemester(semester) {
  const errors = [];
  if (!semester.name) errors.push("Semester name is required.");
  return { valid: errors.length === 0, errors };
}