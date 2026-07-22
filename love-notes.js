/* =====================================================================
   LOVE NOTES PAGE LOGIC
   ===================================================================== */

document.getElementById('nav-brand').textContent = CONFIG.herName + ' \u2014 Twenty';
document.getElementById('notes-subtitle').textContent = CONFIG.loveNotesSubtitle;
document.getElementById('footer-closing').textContent = CONFIG.footerClosing;
document.getElementById('footer-sign').textContent = 'Yours, ' + CONFIG.yourName;

(function seals() {
  const grid = document.getElementById('seal-grid');
  const sealIcon =
    '<svg viewBox="0 0 34 34">' +
      '<path d="M17,3 C22,3 25,9 21,13.5 C18.5,16.5 19.5,21 24,22.5 ' +
      'C18.5,25.5 11,22.5 9.5,17 C7.5,11 11,5.5 17,3 Z" fill="var(--noir)" opacity="0.55"/>' +
    '</svg>';

  CONFIG.sherMessages.forEach((msg) => {
    const cell = document.createElement('div');
    cell.className = 'seal-flip';
    cell.innerHTML =
      '<div class="seal-inner">' +
        '<div class="seal-face seal-front">' + sealIcon + '</div>' +
        '<div class="seal-face seal-back">' + msg + '</div>' +
      '</div>';
    cell.addEventListener('click', () => cell.classList.toggle('flipped'));
    grid.appendChild(cell);
  });
})();
