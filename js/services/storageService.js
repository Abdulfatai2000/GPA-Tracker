/**
 * Storage service — thin wrapper around localStorage for persistence.
 * All data is stored locally in the browser; no backend required.
 */

const STORAGE_KEY = "gpa_tracker_semesters_v1";

export function loadSemesters() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Failed to load saved semesters:", error);
    return [];
  }
}

export function saveSemesters(semesters) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(semesters));
    return true;
  } catch (error) {
    console.warn("Failed to save semesters:", error);
    return false;
  }
}

export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn("Failed to clear storage:", error);
    return false;
  }
}