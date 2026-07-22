/* =====================================================================
   COUNTDOWN PAGE LOGIC
   ===================================================================== */

document.getElementById('nav-brand').textContent = CONFIG.herName + ' \u2014 Twenty';
document.getElementById('countdown-subtitle').textContent = CONFIG.countdownSubtitle;
document.getElementById('countdown-note').textContent = CONFIG.countdownNote;
document.getElementById('teaser-text').textContent = CONFIG.countdownTeaser;

(function countdown() {
  const target = new Date(CONFIG.countdownTarget).getTime();
  const start = new Date(CONFIG.countdownStart).getTime();

  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-mins');
  const sEl = document.getElementById('cd-secs');
  const fill = document.getElementById('progress-fill');
  const percentLabel = document.getElementById('progress-percent');

  function tick() {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    dEl.textContent = Math.floor(diff / 86400000);
    hEl.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    mEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    sEl.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

    const total = target - start;
    const elapsed = now - start;
    const pct = total > 0 ? Math.min(100, Math.max(0, (elapsed / total) * 100)) : 100;
    fill.style.width = pct + '%';
    percentLabel.textContent = Math.round(pct) + '%';
  }

  tick();
  setInterval(tick, 1000);
})();
