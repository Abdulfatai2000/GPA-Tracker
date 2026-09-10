import { createSemester } from '../js/models/Semester.js';
import { createCourse } from '../js/models/Course.js';
import { getGradingScale } from '../js/config/gradingScales.js';
import { calculateSemesterGPA, calculateCGPA } from '../js/services/gpaService.js';
import { calculatePerformanceSummary, calculateGPATrend, calculateCGPATrend, calculateGradeDistribution, calculateCreditStatistics, generateAcademicInsights } from '../js/services/analyticsService.js';

function assertEqual(a,b,desc){
  const ok = JSON.stringify(a) === JSON.stringify(b);
  console.log(`${ok? 'PASS':'FAIL'} - ${desc}`);
  if(!ok){
    console.log('  expected:', b);
    console.log('  got     :', a);
  }
}

// Helper: build a semester with courses
function semWithCourses(name, session, scaleKey, courses){
  return createSemester({ name, session, scaleKey, courses });
}

(async function run(){
  console.log('Running Phase 6 automated tests (calculations only)');

  // 1. No academic data
  const emptySummary = calculatePerformanceSummary([]);
  assertEqual(emptySummary.totals, { semesters:0, courses:0, credits:0, totalQualityPoints:0 }, 'No data - totals zero');

  // 2. One semester
  const scale5 = getGradingScale('5.0');
  const sem1 = semWithCourses('S1','2025/2026','5.0',[
    createCourse({ code:'CSC101', name:'Intro', credits:3, grade:'A' }),
    createCourse({ code:'MTH101', name:'Calc', credits:4, grade:'B' }),
  ]);
  const res1 = calculateSemesterGPA(sem1);
  // Grade points: A=5.0, B=4.0 => quality = 3*5 + 4*4 = 15 + 16 = 31; credits = 7; gpa = 31/7 = 4.42857 -> 4.43
  assertEqual(res1.gpa, Math.round((31/7)*100)/100, 'One semester GPA calculation');

  // 3. Multiple semesters
  const sem2 = semWithCourses('S2','2025/2026','5.0',[
    createCourse({ code:'PHY101', name:'Phys', credits:3, grade:'C' }), // 3*3 = 9
    createCourse({ code:'ENG101', name:'Eng', credits:2, grade:'A' }), // 2*5 =10
  ]);
  const cgpa = calculateCGPA([sem1, sem2]);
  // sem1: credits7 q=31; sem2: credits5 q=19 -> total credits 12 q=50 => cgpa=50/12=4.1667 -> 4.17
  assertEqual(cgpa.cgpa, Math.round((50/12)*100)/100, 'Weighted CGPA across two semesters');

  // 4/5/6 Trends: increasing/decreasing/stable
  const sA = semWithCourses('A','2024','5.0', [ createCourse({credits:3, grade:'A'}) ]); // gpa 5.0
  const sB = semWithCourses('B','2025','5.0', [ createCourse({credits:3, grade:'B'}) ]); // gpa 4.0
  const sC = semWithCourses('C','2026','5.0', [ createCourse({credits:3, grade:'A'}) ]); // gpa5
  const gpaTrend = calculateGPATrend([sA,sB,sC]);
  assertEqual(gpaTrend.map(x=>x.gpa), [5,4,5], 'GPA trend values');
  const cgpaTrend = calculateCGPATrend([sA,sB,sC]);
  // cumulative after sA:5; after sB: (5*3 +4*3)/(6)=4.5 -> 4.5; after sC: (15+12+15)/9=42/9=4.6667->4.67
  assertEqual(cgpaTrend.map(x=>x.cgpa), [5, Math.round((15+12)/6*100)/100, Math.round((15+12+15)/9*100)/100], 'CGPA trend values');

  // 7. Correct weighted CGPA already covered

  // 8. Grade distribution
  const dist = calculateGradeDistribution([sem1,sem2]);
  // sem1: A,B ; sem2: C,A => counts A:2 B:1 C:1
  const map = Object.fromEntries(dist.map(d=>[d.label,d.count]));
  assertEqual(map['A'], 2, 'Grade distribution count for A');
  assertEqual(map['B'], 1, 'Grade distribution count for B');

  // 9. Different grading scales: ensure calculation uses scale labels only
  const sem4 = semWithCourses('4.0','2027','4.0', [ createCourse({credits:3, grade:'A'}) ]); // A=4.0 on 4.0 scale
  const res4 = calculateSemesterGPA(sem4);
  assertEqual(res4.gpa, 4.00, '4.0 scale GPA for single A');

  // 10. Insights with insufficient data
  const insightsEmpty = generateAcademicInsights([]);
  assertEqual(insightsEmpty.length>0, true, 'Insights message present when no data');

  // 11/12/13 improvement/decline/stable
  const insightsInc = generateAcademicInsights([sB,sA]); // last gpa 5 > prev 4 -> increased
  console.log('Insights for [4,5]:', insightsInc.slice(0,3));

  // 14/15/16 Target GPA tests are UI; not implemented in analytics service — skip automated
  console.log('\nAutomated calculation tests complete.');
})();
