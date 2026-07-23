/* =====================================================================
   HOME PAGE LOGIC
   ===================================================================== */

// tries photos/N.jpg first; if that 404s, tries photos/N.png; only shows
// the placeholder text if neither file exists
function handlePhotoError(img) {
  const index = img.dataset.index;
  if (img.dataset.stage !== 'png') {
    img.dataset.stage = 'png';
    img.src = 'photos/' + index + '.png';
    return;
  }
  img.style.display = 'none';
  img.parentElement.textContent = 'add photos/' + index + '.jpg or .png';
}

document.getElementById('her-name').textContent = CONFIG.herName;
document.getElementById('nav-brand').textContent = CONFIG.herName + ' \u2014 Twenty';
document.getElementById('hero-subtitle').textContent = CONFIG.heroSubtitle;

/* ---------------- build the hanging polaroid line ---------------- */
const line = document.getElementById('washing-line');
const basketEl = document.querySelector('.basket');
const basketPeeks = document.getElementById('basket-peeks');
const basketCountEl = document.getElementById('basket-count');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');

const count = CONFIG.polaroidCount;
let basketItems = []; // { index, src, caption }
let pegItems = [];    // references to DOM nodes, keyed by index

for (let i = 1; i <= count; i++) {
  const caption = CONFIG.polaroidCaptions[i - 1] || ('Memory ' + i);
  const tilt = (Math.random() * 8 - 4).toFixed(1);

  const peg = document.createElement('div');
  peg.className = 'peg-item';
  peg.dataset.index = i;
  peg.innerHTML =
    '<div class="clip"></div>' +
    '<div class="polaroid-card" style="--tilt:' + tilt + 'deg">' +
      '<div class="polaroid-photo">' +
        '<img src="photos/' + i + '.jpg" alt="' + caption + '" data-index="' + i + '" ' +
        'onerror="handlePhotoError(this)">' +
      '</div>' +
      '<div class="polaroid-caption">' + caption + '</div>' +
    '</div>' +
    '<div class="pluck-hint">pluck me</div>';

  line.appendChild(peg);
  pegItems.push(peg);
}

/* ---------------- drag-to-scroll (desktop mouse) ---------------- */
let isDown = false, startX = 0, scrollStart = 0, dragged = false;

line.addEventListener('pointerdown', (e) => {
  isDown = true;
  dragged = false;
  startX = e.clientX;
  scrollStart = line.scrollLeft;
  line.classList.add('dragging');
});
line.addEventListener('pointermove', (e) => {
  if (!isDown) return;
  const walk = e.clientX - startX;
  if (Math.abs(walk) > 5) dragged = true;
  line.scrollLeft = scrollStart - walk;
});
function endDrag() {
  isDown = false;
  line.classList.remove('dragging');
}
line.addEventListener('pointerup', endDrag);
line.addEventListener('pointerleave', endDrag);
line.addEventListener('pointercancel', endDrag);

/* ---------------- pluck interaction ---------------- */
pegItems.forEach((peg) => {
  peg.addEventListener('click', () => {
    if (dragged) { dragged = false; return; }
    if (peg.classList.contains('plucked')) return;
    pluck(peg);
  });
});

function pluck(peg) {
  const index = parseInt(peg.dataset.index, 10);
  const card = peg.querySelector('.polaroid-card');
  const cardRect = card.getBoundingClientRect();
  const basketRect = basketEl.getBoundingClientRect();

  // build a flying clone so the original slot can empty out immediately
  const clone = card.cloneNode(true);
  clone.classList.add('falling-clone');
  clone.style.left = cardRect.left + 'px';
  clone.style.top = cardRect.top + 'px';
  clone.style.width = cardRect.width + 'px';
  clone.style.margin = '0';
  document.body.appendChild(clone);

  const targetX = basketRect.left + basketRect.width / 2 - (cardRect.left + cardRect.width / 2);
  const targetY = basketRect.top + basketRect.height / 2 - cardRect.top;
  const spin = (Math.random() * 260 - 130).toFixed(0);

  requestAnimationFrame(() => {
    clone.style.transform = 'translate(' + targetX + 'px,' + targetY + 'px) rotate(' + spin + 'deg) scale(0.25)';
    clone.style.opacity = '0.15';
  });

  clone.addEventListener('transitionend', () => clone.remove(), { once: true });

  // mark the slot as plucked (leaves an empty hook behind)
  peg.classList.add('plucked');

  // record in the basket, keeping chronological order regardless of
  // pluck order, so the downloaded strip reads like a little timeline
  basketItems.push({ index: index, src: 'photos/' + index, caption: CONFIG.polaroidCaptions[index - 1] || ('Memory ' + index) });
  basketItems.sort((a, b) => a.index - b.index);

  updateBasketUI();
}

function updateBasketUI() {
  basketCountEl.textContent = basketItems.length;
  downloadBtn.disabled = basketItems.length === 0;

  basketPeeks.innerHTML = '';
  basketItems.slice(-6).forEach(() => {
    const peek = document.createElement('div');
    peek.className = 'peek';
    basketPeeks.appendChild(peek);
  });
}

/* ---------------- reset ---------------- */
resetBtn.addEventListener('click', () => {
  basketItems = [];
  pegItems.forEach((peg) => peg.classList.remove('plucked'));
  updateBasketUI();
});

/* ---------------- download as one strip ---------------- */
downloadBtn.addEventListener('click', async () => {
  if (basketItems.length === 0) return;
  downloadBtn.disabled = true;
  const originalLabel = downloadBtn.textContent;
  downloadBtn.textContent = 'Preparing…';

  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const dataUrl = await buildStripImage(basketItems);
    const link = document.createElement('a');
    link.download = (CONFIG.herName || 'our') + '-polaroid-strip.png';
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Strip download failed:', err);
    alert('The download did not go through — this usually happens when the page is opened by double-clicking the file. Try running it through a local server or a hosted link instead.');
  } finally {
    downloadBtn.disabled = basketItems.length === 0;
    downloadBtn.textContent = originalLabel;
  }
});

function buildStripImage(items) {
  return new Promise((resolve, reject) => {
    const cardW = 320, photoSize = cardW - 32, captionH = 56, gap = 22, pad = 26, headerH = 70;
    const cardH = photoSize + 32 + captionH;
    const canvas = document.createElement('canvas');
    canvas.width = cardW + pad * 2;
    canvas.height = headerH + items.length * (cardH + gap) - gap + pad;
    const ctx = canvas.getContext('2d');

    // background
    ctx.fillStyle = '#f4ead5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // header
    ctx.fillStyle = '#100d0a';
    ctx.textAlign = 'center';
    ctx.font = 'italic 26px "Cormorant Garamond", Georgia, serif';
    ctx.fillText((CONFIG.herName || 'Us') + ', Collected', canvas.width / 2, 42);

    let loaded = 0;
    if (items.length === 0) { resolve(canvas.toDataURL('image/png')); return; }

    items.forEach((item, i) => {
      loadImageWithFallback(item.src, (img) => { drawCard(img, i, item); finish(); });
    });

    function loadImageWithFallback(basePath, callback) {
      const img = new Image();
      img.onload = () => callback(img);
      img.onerror = () => {
        const img2 = new Image();
        img2.onload = () => callback(img2);
        img2.onerror = () => callback(null);
        img2.src = basePath + '.png';
      };
      img.src = basePath + '.jpg';
    }

    function drawCard(img, i, item) {
      const y = headerH + i * (cardH + gap);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(pad, y, cardW, cardH);
      if (img) {
        ctx.drawImage(img, pad + 16, y + 16, photoSize, photoSize);
      } else {
        ctx.fillStyle = '#0c3335';
        ctx.fillRect(pad + 16, y + 16, photoSize, photoSize);
        ctx.fillStyle = 'rgba(244,234,213,0.6)';
        ctx.font = 'italic 14px "Cormorant Garamond", Georgia, serif';
        ctx.fillText('photo coming soon', pad + cardW / 2, y + 16 + photoSize / 2);
      }
      ctx.fillStyle = '#100d0a';
      ctx.font = 'italic 20px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(item.caption, pad + cardW / 2, y + photoSize + 16 + 30);
    }

    function finish() {
      loaded++;
      if (loaded === items.length) {
        try {
          resolve(canvas.toDataURL('image/png'));
        } catch (err) {
          reject(err);
        }
      }
    }
  });
}