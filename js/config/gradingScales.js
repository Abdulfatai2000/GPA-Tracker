/**
 * Configurable grading scales.
 *
 * Each scale is an ordered array of grade entries. A student's selected grade
 * maps to a `gradePoint`, which is multiplied by credit units to produce
 * quality points.
 *
 * To support a new university, add another scale entry to `GRADING_SCALES`
 * and reference its key when creating a semester.
 *
 * Scale entry shape:
 *   {
 *     label: "A",          // grade letter shown in the UI
 *     minScore: 80,        // minimum percentage required (informational)
 *     gradePoint: 5.0,     // quality point value for this grade
 *     description: "Excellent" // optional human label
 *   }
 */

// 5.0 scale — default for universities where A = 5.0 (CGPA max 5.0)
const GRADING_SCALE_5_0 = [
  { label: "A", minScore: 80, gradePoint: 5.0, description: "Excellent" },
  { label: "B", minScore: 70, gradePoint: 4.0, description: "Good" },
  { label: "C", minScore: 60, gradePoint: 3.0, description: "Fair" },
  { label: "D", minScore: 50, gradePoint: 2.0, description: "Pass" },
  { label: "E", minScore: 40, gradePoint: 1.0, description: "Marginal" },
  { label: "F", minScore: 0, gradePoint: 0.0, description: "Fail" },
];

// 4.0 scale — common US-style scale (GPA max 4.0)
const GRADING_SCALE_4_0 = [
  { label: "A", minScore: 90, gradePoint: 4.0, description: "Excellent" },
  { label: "B", minScore: 80, gradePoint: 3.0, description: "Good" },
  { label: "C", minScore: 70, gradePoint: 2.0, description: "Satisfactory" },
  { label: "D", minScore: 60, gradePoint: 1.0, description: "Passing" },
  { label: "F", minScore: 0, gradePoint: 0.0, description: "Fail" },
];

// Registry of all available scales. New scales can be added here.
export const GRADING_SCALES = {
  "5.0": GRADING_SCALE_5_0,
  "4.0": GRADING_SCALE_4_0,
};

// Default scale key used when none is specified.
export const DEFAULT_SCALE_KEY = "5.0";

// Helper: get a scale by key, falling back to the default.
export function getGradingScale(key) {
  return GRADING_SCALES[key] || GRADING_SCALES[DEFAULT_SCALE_KEY];
}

// Helper: look up a grade entry by its label within a scale.
export function getGradeEntry(scale, label) {
  return scale.find((entry) => entry.label === label);
}

// Helper: get the grade point for a given label, or 0 if unknown.
export function getGradePointForLabel(scale, label) {
  const entry = getGradeEntry(scale, label);
  return entry ? entry.gradePoint : 0;
}

// Helper: produce a flat list of grade options for UI select elements.
export function getGradeOptions(scale) {
  return scale.map((entry) => ({
    label: entry.label,
    gradePoint: entry.gradePoint,
    description: entry.description,
  }));
}