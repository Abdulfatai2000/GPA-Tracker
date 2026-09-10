/**
 * App header component.
 *
 * Renders the brand block and theme toggle. Designed to stay visually clean
 * on small screens: the brand wraps vertically and the toggle remains.
 *
 * Emits no events directly; the parent wires the toggle button.
 */

export function renderHeader(theme, onToggleTheme/*, onOpenSettings - ignored */) {
  const header = document.createElement("header");
  header.className = "app-header";

  const brand = document.createElement("div");
  brand.className = "brand";
  // Inline SVG logo + name for crisp rendering across sizes
  brand.innerHTML = `
    <div class="brand-logo" aria-hidden="true"> 
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="22" height="22" rx="5" fill="var(--primary)" />
        <path d="M7 14.5c.9-1 2.2-2 3.5-2.5 1.3-.5 2.6-.6 3.3-1" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7.5 10.5h.01" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="brand-text">
      <h1>GPA Tracker</h1>
      <p class="tagline">Plan. Track. Succeed.</p>
    </div>
  `;

  // Primary navigation (anchors to landing sections / dashboard)
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML = `
    <a href="#dashboard" class="nav-link">Dashboard</a>
    <a href="#features" class="nav-link">Features</a>
    <a href="#how" class="nav-link">How it works</a>
    <a href="https://github.com/Abdulfatai2000/GPA-Tracker" target="_blank" rel="noopener" class="nav-link">GitHub</a>
  `;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "btn btn-ghost theme-toggle";
  toggle.setAttribute("data-theme-toggle", "");
  toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  toggle.setAttribute("aria-label", "Toggle color theme");
  toggle.textContent = theme === "dark" ? "Light" : "Dark";
  toggle.addEventListener("click", () => onToggleTheme());

  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.appendChild(toggle);

  header.appendChild(brand);
  header.appendChild(nav);
  header.appendChild(controls);
  return header;
}