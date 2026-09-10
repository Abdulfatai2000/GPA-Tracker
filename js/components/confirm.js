// Accessible confirm modal returning a Promise<boolean>
export function showConfirm(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.4)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 10000;

    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog card';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.style.maxWidth = '420px';
    dialog.style.width = '90%';

    dialog.innerHTML = `
      <p style="margin:0 0 1rem">${escapeHtml(message)}</p>
      <div style="display:flex;gap:0.5rem;justify-content:flex-end">
        <button class="btn btn-secondary" data-cancel>Cancel</button>
        <button class="btn btn-danger" data-confirm>Delete</button>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    function cleanup(result) {
      overlay.remove();
      resolve(result);
    }

    overlay.querySelector('[data-cancel]').addEventListener('click', () => cleanup(false));
    overlay.querySelector('[data-confirm]').addEventListener('click', () => cleanup(true));
    // Escape key
    function onKey(e) {
      if (e.key === 'Escape') { cleanup(false); }
    }
    document.addEventListener('keydown', onKey, { once: true });
  });
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
