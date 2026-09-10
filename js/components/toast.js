// Simple toast utility — shows transient messages to the user.
const TOAST_CONTAINER_ID = 'toast-container';

function ensureContainer() {
  let c = document.getElementById(TOAST_CONTAINER_ID);
  if (!c) {
    c = document.createElement('div');
    c.id = TOAST_CONTAINER_ID;
    c.style.position = 'fixed';
    c.style.right = '1rem';
    c.style.bottom = '1rem';
    c.style.zIndex = 9999;
    c.style.display = 'flex';
    c.style.flexDirection = 'column';
    c.style.gap = '0.5rem';
    document.body.appendChild(c);
  }
  return c;
}

export function showToast(message, type = 'success', timeout = 3500) {
  const container = ensureContainer();
  const el = document.createElement('div');
  el.className = 'toast ' + (type === 'error' ? 'toast-error' : 'toast-success');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.style.background = type === 'error' ? 'rgba(220,38,38,0.95)' : 'rgba(31,35,48,0.95)';
  el.style.color = '#fff';
  el.style.padding = '0.6rem 0.9rem';
  el.style.borderRadius = '8px';
  el.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
  el.style.fontSize = '0.95rem';
  el.textContent = message;
  container.appendChild(el);
  const timer = setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
    clearTimeout(timer);
  }, timeout);
  return () => {
    clearTimeout(timer);
    el.remove();
  };
}
