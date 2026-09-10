/**
 * Welcome / page-intro component.
 *
 * A short, honest introduction that tells the user what GPA Tracker is and
 * what they can do with it. Uses default/empty content — no fake data.
 */

export function renderWelcome() {
  const section = document.createElement("section");
  section.className = "card welcome";
  section.setAttribute("aria-label", "Welcome");

  section.innerHTML = `
    <p class="welcome-eyebrow">Your academic dashboard</p>
    <h2>Track your GPA in minutes</h2>
    <p class="welcome-text">
      GPA Tracker helps you calculate semester GPA from your courses and credit
      units. Add a semester, enter your courses with grades, and watch your
      academic performance update instantly. Everything is saved locally in
      your browser.
    </p>
  `;

  return section;
}