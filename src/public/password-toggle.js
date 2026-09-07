const eyeIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
    <circle cx="12" cy="12" r="2.5"></circle>
  </svg>`;
const eyeSlashIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M3 3l18 18"></path>
    <path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a16.8 16.8 0 0 1-3.2 3.8M6.2 6.7C3.8 8.4 2.5 12 2.5 12s3.5 6 9.5 6c1.1 0 2.1-.2 3-.5"></path>
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"></path>
  </svg>`;

document.querySelectorAll('[data-password-toggle]').forEach((toggle) => {
  const input = document.getElementById(toggle.getAttribute('aria-controls'));
  if (!input) return;

  toggle.innerHTML = eyeIcon;
  toggle.addEventListener('click', () => {
    const isVisible = input.type === 'text';
    input.type = isVisible ? 'password' : 'text';
    toggle.innerHTML = isVisible ? eyeIcon : eyeSlashIcon;
    toggle.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
    toggle.setAttribute('aria-pressed', String(!isVisible));
  });
});