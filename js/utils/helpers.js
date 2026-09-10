/**
 * Utility helpers — small, pure functions with no side effects.
 */

// Debounce a function (useful for resize handlers, etc.).
export function debounce(fn, wait = 250) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Escape HTML to prevent XSS when injecting user text into the DOM.
export function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Format a number to a fixed number of decimals (default 2).
export function formatNumber(value, decimals = 2) {
  const num = Number(value);
  if (!isFinite(num)) return "0." + "0".repeat(decimals);
  return num.toFixed(decimals);
}

// Get a human-friendly label for a grade point range (informational).
export function gradeLabelFor(point) {
  if (point >= 4.0) return "Excellent";
  if (point >= 3.0) return "Good";
  if (point >= 2.0) return "Satisfactory";
  if (point >= 1.0) return "Marginal";
  if (point === 0) return "Fail";
  return "—";
}