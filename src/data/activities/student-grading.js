export default {
  slug: 'student-grading',
  order: 4,
  title: 'Student Grade Management System',
  short: 'Student Grading',
  term: 'prelim',
  date: '2026-07-28',
  kind: 'Activity',
  team: null,
  stack: ['JavaScript (ES modules)', 'HTML', 'CSS', 'node:test'],
  summary:
    'A browser dashboard called Grade Ledger that takes prelim, midterm and final grades for each course in a BSIT term and updates a report card with term averages and a units-weighted cumulative GPA.',
  objective:
    'Practice JavaScript variable declarations and basic program logic. The activity called for student information declared with let, system information with var and fixed academic values with const, then using them in grade calculations. I built that into a small dashboard and checked the declarations and the grade math with unit tests in Node\'s built-in test runner.',
  built: [
    'Student information declared with let, system version and status with var, and MAX_SCORE and PASSING_SCORE with const, all exported from app.js',
    'A CURRICULUM array of 53 BSIT courses with code, title, units, year, term and prerequisites',
    'Subject grade = 30% prelim + 30% midterm + 40% final, clamped to the 1.0 to 5.0 scale, marked passed at 3.0 or better',
    'Units-weighted cumulative GPA, counting failed subjects as 5.0, with a Good Standing or Academic Probation pill',
    'Profile editor (name, student ID, year level, term, regular standing) and a grade input matrix that re-renders for the selected year and term',
    'Report card with prelim, midterm and final averages and a checksheet table showing units and prerequisites for the selected term',
    'Five node:test tests covering the declarations, grade scale, subject formula, prerequisite check and weighted GPA; all 5 pass',
  ],
  screenshots: [
    { src: '/work/student-grading/01-report-card.webp', caption: 'Report card after entering sample grades for a test student: averages, weighted GPA and checksheet' },
    { src: '/work/student-grading/02-default-load.webp', caption: 'The dashboard as it first loads, before any grades are entered (student ID redacted)' },
    { src: '/work/student-grading/03-third-year.webp', caption: 'Switching to Third Year loads that term\'s courses and prerequisites; the cumulative GPA carries over' },
  ],
  code: [
    {
      title: 'let, var and const declarations',
      file: 'app.js',
      lang: 'javascript',
      code: `// Student Information (Use let)
export let studentName = "Keith Alan Speirs";
export let studentID = "25-XXXXXX"; // real ID redacted for the portfolio
export let yearLevel = 2;
export let currentSemester = "1st Term";
export let isRegularStudent = true;

export let studentProfile = {
  name: studentName,
  id: studentID,
  year: yearLevel,
  isRegular: isRegularStudent
};


// System Information (Use var)
var systemVersion = "1.1.0";
var isSystemActive = true;
export { systemVersion, isSystemActive };

// Academic Records Constants
export const MAX_SCORE = 5.0;
export const PASSING_SCORE = 3.0; // 3.0 passing grade threshold`,
    },
    {
      title: 'Prerequisite check and weighted GPA',
      file: 'app.js',
      lang: 'javascript',
      code: `export function isPrerequisiteSatisfied(courseCode, courses) {
  const course = courses.find(c => c.code === courseCode);
  if (!course || !course.prerequisites || course.prerequisites.length === 0) {
    return true;
  }
  // Check if ALL listed prerequisites have status "P"
  return course.prerequisites.every(prereqCode => {
    const prereq = courses.find(c => c.code === prereqCode);
    return prereq && prereq.status === "P";
  });
}

export function calculateCumulativeGPA(courses) {
  let totalGradePoints = 0;
  let totalUnits = 0;
  courses.forEach(c => {
    if (c.grade !== null && c.status === "P") {
      totalGradePoints += c.grade * c.units;
      totalUnits += c.units;
    } else if (c.grade !== null && c.status === "F") {
      // Failing grades are factored in as 5.0
      totalGradePoints += 5.0 * c.units;
      totalUnits += c.units;
    }
  });
  if (totalUnits === 0) return 0;
  return parseFloat((totalGradePoints / totalUnits).toFixed(2));
}`,
    },
    {
      title: 'GPA unit test',
      file: 'app.test.js',
      lang: 'javascript',
      code: `test('Weighted Cumulative GPA Calculation', (t) => {
  const mockCurriculum = [
    { code: "A", grade: 1.5, units: 3.0, status: "P" },
    { code: "B", grade: 2.0, units: 3.0, status: "P" },
    { code: "C", grade: 1.0, units: 2.0, status: "P" },
    { code: "D", grade: null, units: 3.0, status: "" } // Ungraded
  ];
  // GPA = ((1.5 * 3) + (2.0 * 3) + (1.0 * 2)) / (3 + 3 + 2)
  // GPA = (4.5 + 6.0 + 2.0) / 8 = 12.5 / 8 = 1.5625
  assert.equal(appModule.calculateCumulativeGPA(mockCurriculum), 1.56);
});`,
    },
  ],
  reflection:
    'This activity made the difference between let, var and const concrete. The student fields are declared with let because updateDashboard() reassigns them whenever the form changes, the system info uses var as the activity asked, and the score limits are const because nothing should change them. Exporting them from app.js also let me test them directly: app.test.js imports the module in Node, which works because all the DOM code sits inside a typeof document check. Working out the GPA test by hand, with 12.5 / 8 = 1.5625 in a comment, also made it clear that the function rounds to two decimals and should return 1.56.\n\nOne bug I had to fix was a crash when the dashboard loaded: updateDashboard() assigned to studentProfile, which had not been declared or exported yet, and module code runs in strict mode, so that assignment throws instead of creating a global. If I did it again I would rename convertPercentageToGrade, since it clamps a 1.0 to 5.0 grade and never works with percentages, and I would update the README. It says to open index.html directly, but Chrome blocks module scripts on file:// pages, so the dashboard stays empty unless the folder is served from a local server.',
  docs: [],
}
