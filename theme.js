/* =====================================================================
   THEME TOGGLE LOGIC
   Rose Gold (default) <-> Burgundy Gold, persisted across pages via
   localStorage. The anti-flash snippet in each page's <head> already
   applies the saved theme before first paint — this file just wires up
   the visible switch and keeps its label in sync.
   ===================================================================== */
(function () {
  const STORAGE_KEY = 'siteTheme';
  const toggle = document.getElementById('theme-toggle');
  const label = document.getElementById('theme-toggle-label');
  if (!toggle || !label) return;

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'burgundy' ? 'burgundy' : 'rose';
  }

  function applyLabel() {
    label.textContent = currentTheme() === 'burgundy' ? 'Burgundy Gold' : 'Rose Gold';
  }

  function setTheme(theme) {
    if (theme === 'burgundy') {
      document.documentElement.setAttribute('data-theme', 'burgundy');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
    applyLabel();
  }

  toggle.addEventListener('click', () => {
    setTheme(currentTheme() === 'burgundy' ? 'rose' : 'burgundy');
  });

  applyLabel();
})();
