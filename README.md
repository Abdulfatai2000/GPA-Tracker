# GPA Tracker

A clean, lightweight GPA/CGPA tracking web application for university students.

## Problem Solved

Students often struggle to track academic performance across multiple courses
and semesters. Manual grade-point averaging is error-prone and time-consuming.
This application provides a simple, reliable, and responsive tool to calculate
semester GPA and cumulative performance, with a configurable grading scale so it
works across different universities.

## Initial MVP Goals (Phase 1)

- Create a semester
- Add courses (code, name, credit units)
- Select grades from a configurable scale
- Calculate semester GPA using the weighted-credit method
- View the result clearly
- Save academic data locally in the browser
- Switch between light and dark themes
- Responsive layout for mobile, tablet, and desktop

## Planned Major Features (Later Phases)

- Multiple semester history
- Cumulative CGPA calculation
- Edit and delete courses
- Configurable grading scales (per university)
- Academic performance summaries
- Data import/export
- Accessibility enhancements

## Technology Stack

- **HTML5** — semantic structure
- **CSS3** — responsive, light/dark theme (custom properties)
- **Vanilla JavaScript (ES6+)** — no frameworks, no build step
- **localStorage** — offline persistence

## Project Status

Phase 1 — Initial MVP in progress.

## How to Run

Open `index.html` directly in a browser, or serve the folder with any static server:

```bash
# Option A: open directly
start index.html

# Option B: simple Python server
python -m http.server 8000

# Option C: Node.js (if installed)
npx serve .
```

No build step, no dependencies, no installation required.