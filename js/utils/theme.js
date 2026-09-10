/**
 * Theme utility — manages light/dark mode preference in localStorage and
 * applies a `data-theme` attribute on the root element so CSS custom
 * properties can switch the entire UI.
 */

const THEME_KEY = "gpa_tracker_theme";
const THEMES = ["light", "dark"];

export function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

export function getPreferredTheme() {
  const saved = getSavedTheme();
  if (saved && THEMES.includes(saved)) return saved;

  // Fall back to OS preference.
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

export function toggleTheme(current) {
  return current === "dark" ? "light" : "dark";
}