/**
 * GPA calculation service.
 *
 * Uses the standard weighted-credit approach:
 *
 *   Quality Points = Credit Units × Grade Point
 *   GPA = Total Quality Points ÷ Total Credit Units
 *
 * The service is scale-agnostic: it accepts a grading scale (array of grade
 * entries) and resolves each course's grade label to its grade point, then
 * performs the weighted calculation. This keeps the math decoupled from any
 * single university's scale.
 */

import { getGradingScale, getGradePointForLabel } from "../config/gradingScales.js";

/**
 * Compute quality points for a single course.
 * @param {object} course - Course object with credits and grade.
 * @param {object[]} scale - Grading scale entries.
 * @returns {number} quality points (credits × grade point).
 */
export function courseQualityPoints(course, scale) {
  if (!course || !(course.credits > 0)) return 0;
  const point = getGradePointForLabel(scale, course.grade);
  return course.credits * point;
}

/**
 * Calculate semester GPA and supporting totals.
 * @param {object} semester - Semester with courses and scaleKey.
 * @param {object} [scales] - Optional overrides; defaults to GRADING_SCALES.
 * @returns {object} totals and GPA, rounded to 2 decimals.
 */
export function calculateSemesterGPA(semester, scales) {
  const scale = getGradingScale(semester.scaleKey);
  const courses = semester.courses || [];

  let totalCredits = 0;
  let totalQualityPoints = 0;

  for (const course of courses) {
    const credits = Number(course.credits) || 0;
    if (!(credits > 0)) continue;

    const point = getGradePointForLabel(scale, course.grade);
    totalCredits += credits;
    totalQualityPoints += credits * point;
  }

  const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    totalCredits: round2(totalCredits),
    totalQualityPoints: round2(totalQualityPoints),
    gpa: round2(gpa),
    courseCount: courses.length,
    scaleKey: semester.scaleKey,
  };
}

/**
 * Calculate cumulative CGPA across multiple semesters.
 * @param {object[]} semesters
 * @returns {object} cumulative totals and CGPA.
 */
export function calculateCGPA(semesters) {
  let totalCredits = 0;
  let totalQualityPoints = 0;

  for (const semester of semesters) {
    const result = calculateSemesterGPA(semester);
    totalCredits += result.totalCredits;
    totalQualityPoints += result.totalQualityPoints;
  }

  const cgpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    totalCredits: round2(totalCredits),
    totalQualityPoints: round2(totalQualityPoints),
    cgpa: round2(cgpa),
    semesterCount: semesters.length,
  };
}

function round2(value) {
  return Math.round(value * 100) / 100;
}