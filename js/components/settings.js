import { getGradingScale, GRADING_SCALES } from "../config/gradingScales.js";

export function renderSettings({ currentTheme, defaultScaleKey }, { onClose, onSave, onClear }) {
  const overlay = document.createElement('div');
  overlay.className = 'settings-overlay';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.35)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = 10000;

  const dialog = document.createElement('div');
  dialog.className = 'card settings-card';
  dialog.style.maxWidth = '540px';
  dialog.style.width = '94%';

  const scaleOptions = Object.keys(GRADING_SCALES).map((k) => `<option value="${k}" ${k===defaultScaleKey? 'selected':''}>${k} scale</option>`).join('');

  dialog.innerHTML = `
    <h2>Settings</h2>
    <div class="field">
      <span>Appearance</span>
      <select id="settings-theme">
        <option value="system">System preference</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
    <div class="field">
      <span>Default grading scale</span>
      <select id="settings-scale">
        ${scaleOptions}
      </select>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.75rem">
      <div style="display:flex;gap:0.5rem">
        <button class="btn btn-secondary" data-close>Close</button>
        <button class="btn btn-primary" data-save>Save</button>
      </div>
      <div>
        <button class="btn btn-danger" data-clear>Clear Academic Data</button>
      </div>
    </div>
  `;

  overlay.appendChild(dialog);

  // Set initial theme select
  const themeSelect = dialog.querySelector('#settings-theme');
  themeSelect.value = currentTheme === 'system' ? 'system' : currentTheme;

  overlay.querySelector('[data-close]').addEventListener('click', () => {
    overlay.remove();
    onClose && onClose();
  });
  overlay.querySelector('[data-save]').addEventListener('click', () => {
    const theme = dialog.querySelector('#settings-theme').value;
    const scale = dialog.querySelector('#settings-scale').value;
    onSave && onSave({ theme, defaultScaleKey: scale });
    overlay.remove();
  });
  overlay.querySelector('[data-clear]').addEventListener('click', () => {
    onClear && onClear();
  });

  return overlay;
}
