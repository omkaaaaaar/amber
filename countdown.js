/* =====================================================================
   COUNTDOWN PAGE LOGIC
   ===================================================================== */

document.getElementById('nav-brand').textContent = CONFIG.herName + ' \u2014 Twenty';
document.getElementById('countdown-subtitle').textContent = CONFIG.countdownSubtitle;
document.getElementById('countdown-note').textContent = CONFIG.countdownNote;
document.getElementById('teaser-text').textContent = CONFIG.countdownTeaser;

// formats a Date as "August 2nd" or, with short=true, "Aug 2nd"
function formatOrdinalDate(date, short) {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const monthsShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day = date.getDate();
  const suffix = (day % 10 === 1 && day !== 11) ? 'st'
    : (day % 10 === 2 && day !== 12) ? 'nd'
    : (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
  return (short ? monthsShort[date.getMonth()] : months[date.getMonth()]) + ' ' + day + suffix;
}

// formats a Date's time as "5:00 PM"
function formatTime(date) {
  let h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (h === 0) h = 12;
  return h + ':' + m + ' ' + ampm;
}

(function countdown() {
  const targetDate = new Date(CONFIG.countdownTarget);
  const startDate = new Date(CONFIG.countdownStart);
  const target = targetDate.getTime();
  const start = startDate.getTime();

  // these all now come straight from CONFIG.countdownTarget / countdownStart —
  // change the date in config.js and every label below updates with it
  document.getElementById('countdown-eyebrow').textContent =
    formatOrdinalDate(targetDate, false) + ' \u00b7 ' + formatTime(targetDate);
  document.getElementById('progress-start-label').textContent = formatOrdinalDate(startDate, true);
  document.getElementById('progress-end-label').textContent = formatOrdinalDate(targetDate, true);

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
