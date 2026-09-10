/**
 * Course model.
 *
 * A single course belongs to one semester and carries:
 *   - code:     course code (e.g. "CS101")
 *   - name:     course name
 *   - credits:  credit units (positive number)
 *   - grade:    selected grade label (must exist in the semester's scale)
 *
 * The model is intentionally a plain data object so it can be serialized to
 * localStorage easily and reconstructed later.
 */

export function createCourse({ code = "", name = "", credits = 0, grade = "" } = {}) {
  return {
    id: generateId(),
    code: String(code).trim(),
    name: String(name).trim(),
    credits: Number(credits) || 0,
    grade: String(grade).trim(),
  };
}

// Simple unique id generator (sufficient for client-side data).
function generateId() {
  return "c_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

// Validate a course against a grading scale.
// Returns an object with `valid` boolean and an array of error messages.
export function validateCourse(course, scale) {
  const errors = [];

  if (!course.code) errors.push("Course code is required.");
  if (!course.name) errors.push("Course name is required.");
  if (!(course.credits > 0)) errors.push("Credit units must be a positive number.");
  if (!course.grade) errors.push("A grade must be selected.");
  else if (scale && !scale.some((entry) => entry.label === course.grade)) {
    errors.push(`Grade "${course.grade}" is not valid for the selected scale.`);
  }

  return { valid: errors.length === 0, errors };
}