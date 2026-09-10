/**
 * Storage service — thin wrapper around localStorage for persistence.
 * All data is stored locally in the browser; no backend required.
 */

const STORAGE_KEY = "gpa_tracker_state_v1";

// Backwards-compatible loader: supports older storage formats (array of
// semesters) and the new object shape { semesters, activeSemesterId }.
export function loadAppState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { semesters: [], activeSemesterId: null };
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Older format: raw array of semesters.
      return { semesters: parsed, activeSemesterId: parsed.length > 0 ? parsed[0].id : null };
    }
    if (parsed && typeof parsed === "object") {
      return {
        semesters: Array.isArray(parsed.semesters) ? parsed.semesters : [],
        activeSemesterId: parsed.activeSemesterId || null,
      };
    }
    return { semesters: [], activeSemesterId: null };
  } catch (error) {
    console.warn("Failed to load saved state:", error);
    return { semesters: [], activeSemesterId: null };
  }
}

export function saveAppState({ semesters, activeSemesterId }) {
  try {
    const payload = { semesters: Array.isArray(semesters) ? semesters : [], activeSemesterId: activeSemesterId || null };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.warn("Failed to save app state:", error);
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