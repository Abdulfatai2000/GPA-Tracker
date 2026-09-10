/**
 * Analytics service — read-only computations derived from semesters and courses.
 * All functions are pure and do not modify input data.
 */
import { calculateSemesterGPA } from "./gpaService.js";

// Summarize overall performance across all semesters.
export function calculatePerformanceSummary(semesters = []) {
  const totals = { semesters: 0, courses: 0, credits: 0, totalQualityPoints: 0 };
  const semesterResults = [];

  for (const s of semesters) {
    if (!s) continue;
    const res = calculateSemesterGPA(s);
    semesterResults.push({ id: s.id, name: s.name || s.session || 'Semester', ...res });
    totals.semesters += 1;
    totals.courses += res.courseCount || 0;
    totals.credits += Number(res.totalCredits) || 0;
    totals.totalQualityPoints += Number(res.totalQualityPoints) || 0;
  }

  const gpas = semesterResults.map((r) => r.gpa).filter((v) => typeof v === 'number');
  const avgSemesterGPA = gpas.length ? Math.round((gpas.reduce((a,b) => a+b,0)/gpas.length)*100)/100 : 0;
  const highest = gpas.length ? Math.max(...gpas) : 0;
  const lowest = gpas.length ? Math.min(...gpas) : 0;

  const overallCGPA = totals.credits > 0 ? Math.round((totals.totalQualityPoints / totals.credits)*100)/100 : 0;

  return {
    totals,
    semesterResults,
    avgSemesterGPA,
    highestSemesterGPA: highest,
    lowestSemesterGPA: lowest,
    overallCGPA
  };
}

// Produce GPA trend: array of { label, gpa }
export function calculateGPATrend(semesters = []) {
  const rows = [];
  for (const s of semesters) {
    const res = calculateSemesterGPA(s);
    rows.push({ id: s.id, label: s.name || s.session || 'Semester', gpa: res.gpa || 0 });
  }
  return rows;
}

// Cumulative CGPA trend across semesters in order
export function calculateCGPATrend(semesters = []) {
  const rows = [];
  let cumulativeCredits = 0;
  let cumulativeQuality = 0;
  for (const s of semesters) {
    const res = calculateSemesterGPA(s);
    cumulativeCredits += Number(res.totalCredits) || 0;
    cumulativeQuality += Number(res.totalQualityPoints) || 0;
    const cgpa = cumulativeCredits > 0 ? Math.round((cumulativeQuality / cumulativeCredits)*100)/100 : 0;
    rows.push({ id: s.id, label: s.name || s.session || 'Semester', cgpa });
  }
  return rows;
}

// Grade distribution across all courses using provided grading scale mapping (labels).
export function calculateGradeDistribution(semesters = []) {
  const map = new Map();
  for (const s of semesters) {
    for (const c of (s.courses || [])) {
      const label = c.grade || '—';
      map.set(label, (map.get(label) || 0) + 1);
    }
  }
  // Convert to array sorted by count desc
  return Array.from(map.entries()).map(([label,count]) => ({ label, count })).sort((a,b) => b.count - a.count);
}

// Credit statistics per semester
export function calculateCreditStatistics(semesters = []) {
  const bySemester = semesters.map(s => ({ id: s.id, name: s.name || s.session || 'Semester', credits: (s.courses||[]).reduce((a,c)=>a+((Number(c.credits)||0)),0) }));
  const total = bySemester.reduce((a,b)=>a+b.credits,0);
  const average = bySemester.length ? Math.round((total / bySemester.length)*100)/100 : 0;
  const highest = bySemester.length ? bySemester.reduce((max,s)=> s.credits>max ? s.credits : max,0) : 0;
  return { bySemester, totalCredits: total, averageCredits: average, highestCredits: highest };
}

// Simple academic insights generator — returns factual statements based on data.
export function generateAcademicInsights(semesters = []) {
  const insights = [];
  const summary = calculatePerformanceSummary(semesters);
  const { semesterResults } = summary;
  if (!semesterResults.length) {
    insights.push('No academic records yet. Create a semester and add courses to get insights.');
    return insights;
  }

  // Highest / lowest
  if (summary.highestSemesterGPA) insights.push(`Highest semester GPA: ${summary.highestSemesterGPA.toFixed(2)}.`);
  if (summary.lowestSemesterGPA) insights.push(`Lowest semester GPA: ${summary.lowestSemesterGPA.toFixed(2)}.`);

  // Recent change
  if (semesterResults.length >= 2) {
    const last = semesterResults[semesterResults.length-1].gpa;
    const prev = semesterResults[semesterResults.length-2].gpa;
    if (last > prev) insights.push('Your current GPA increased compared to the previous semester.');
    else if (last < prev) insights.push('Your current GPA decreased compared to the previous semester.');
    else insights.push('Your current GPA is unchanged from the previous semester.');
  }

  // Totals
  insights.push(`Total semesters: ${summary.totals.semesters}.`);
  insights.push(`Total courses: ${summary.totals.courses}.`);
  insights.push(`Total credits: ${summary.totals.credits}.`);

  return insights;
}
