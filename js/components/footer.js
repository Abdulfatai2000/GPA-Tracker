export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <div class="footer-inner card">
      <div class="footer-brand">
        <div class="brand-logo-small" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="22" height="22" rx="4" fill="var(--primary)" />
            <path d="M6.5 13.5c.8-0.9 2-1.7 3.1-2.1 1.1-.4 2.2-.5 2.8-.9" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/>
          </svg>
        </div>
        <div>
          <strong>GPA Tracker</strong>
          <div class="muted">Simple GPA tracking for students</div>
        </div>
      </div>

      <div class="footer-links">
        <div>
          <h4>Product</h4>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
        </div>
        <div>
          <h4>Resources</h4>
          <a href="https://github.com/Abdulfatai2000/GPA-Tracker" target="_blank" rel="noopener">Source on GitHub</a>
          <a href="#">README</a>
        </div>
      </div>

      <div class="footer-copy muted">© ${year} GPA Tracker — Built with care.</div>
    </div>
  `;
  return footer;
}
