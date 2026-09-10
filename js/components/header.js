/**
 * App header component.
 *
 * Renders the brand block and theme toggle. Designed to stay visually clean
 * on small screens: the brand wraps vertically and the toggle remains.
 *
 * Emits no events directly; the parent wires the toggle button.
 */

export function renderHeader(theme, onToggleTheme) {
  const header = document.createElement("header");
  header.className = "app-header";

  const brand = document.createElement("div");
  brand.className = "brand";
  brand.innerHTML = `
    <h1>GPA Tracker</h1>
    <p class="tagline">Plan. Track. Succeed.</p>
  `;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "btn btn-ghost";
  toggle.setAttribute("data-theme-toggle", "");
  toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  toggle.setAttribute("aria-label", "Toggle color theme");
  toggle.textContent = theme === "dark" ? "Light" : "Dark";

  toggle.addEventListener("click", () => onToggleTheme());

  header.appendChild(brand);
  header.appendChild(toggle);
  return header;
}