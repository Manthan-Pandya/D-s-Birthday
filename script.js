/* Birthday site script — vanilla JS, no dependencies */
const $ = s => document.querySelector(s);

/* ---------- Confetti (canvas) ---------- */
const cv = $('#confetti'), ctx = cv.getContext('2d');
let bits = [], raf = null;
const fit = () => { cv.width = innerWidth; cv.height = innerHeight; };
addEventListener('resize', fit); fit();
function confetti(n = 140, x = innerWidth / 2, y = innerHeight / 2) {
  const colors = ['#ff8a3d', '#ff6a1a', '#2bb3a3', '#ffe8a8', '#4aa8ff'];
  for (let i = 0; i < n; i++) bits.push({
    x, y, vx: (Math.random() - .5) * 14, vy: Math.random() * -12 - 3,
    s: 4 + Math.random() * 6, c: colors[i % 5], r: Math.random() * 6, life: 110 });
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  bits = bits.filter(b => b.life-- > 0);
  bits.forEach(b => { b.x += b.vx; b.y += b.vy; b.vy += .35; b.r += .2;
    ctx.fillStyle = b.c; ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
    ctx.fillRect(-b.s / 2, -b.s / 2, b.s, b.s * .6); ctx.restore(); });
  raf = bits.length ? requestAnimationFrame(tick) : null;
}

/* ---------- Floating hearts / balloons / devils ---------- */
const emojis = ['⚡', '✨', '🎈', '😈', '⭐', '🔥'];
setInterval(() => {
  if (document.hidden) return;
  const f = document.createElement('span');
  f.className = 'floater'; f.textContent = emojis[Math.random() * emojis.length | 0];
  f.style.left = Math.random() * 100 + 'vw';
  f.style.fontSize = 18 + Math.random() * 22 + 'px';
  f.style.animationDuration = 8 + Math.random() * 6 + 's';
  $('#float-layer').appendChild(f); setTimeout(() => f.remove(), 15000);
}, 900);

/* ---------- Sparkle cursor trail ---------- */
let lastTrail = 0;
addEventListener('pointermove', e => {
  if (e.pointerType === 'touch' || Date.now() - lastTrail < 60) return;
  lastTrail = Date.now();
  const t = document.createElement('span');
  t.className = 'trail'; t.textContent = Math.random() > .5 ? '⭐' : '✨';
  t.style.left = e.clientX + 'px'; t.style.top = e.clientY + 'px';
  document.body.appendChild(t); setTimeout(() => t.remove(), 800);
});

/* ---------- Opening gift ---------- */
$('#openGift').onclick = () => {
  $('#gift').classList.add('open'); confetti(220);
  setTimeout(() => {
    $('#opening').hidden = true; $('#main').hidden = false;
    scrollTo(0, 0); confetti(120);
  }, 1100);
};

/* ---------- Roast cards ---------- */
document.querySelectorAll('.card').forEach(c => c.onclick = () => {
  c.classList.remove('popped'); void c.offsetWidth; c.classList.add('popped');
  const r = c.getBoundingClientRect(); confetti(30, r.left + r.width / 2, r.top);
});

/* ---------- Runaway button ---------- */
const lines = ['Look at this overconfidence 😂', 'Someone needs a reality check.',
  'Handsome? Who told you that? 😭', "Don't make me regret being your friend.",
  'Your delusion deserves an award 🏆', 'Just click the other button, drama king!',
  'Stop running away from compliments, idiot ❤️'];
let tries = 0;
const no = $('#no');
function dodge(e) {
  e.preventDefault();
  $('#qText').textContent = lines[Math.min(tries++, lines.length - 1)];
  no.classList.add('run');
  const w = no.offsetWidth, h = no.offsetHeight, pad = 10;
  // Random position that always stays fully inside the viewport
  no.style.left = pad + Math.random() * Math.max(0, innerWidth - w - 2 * pad) + 'px';
  no.style.top = pad + Math.random() * Math.max(0, innerHeight - h - 2 * pad) + 'px';
}
no.addEventListener('mouseenter', dodge);
no.addEventListener('touchstart', dodge, { passive: false });
no.addEventListener('click', dodge);
$('#yes').onclick = () => {
  $('#qText').textContent = 'Correct. Ego: inflated. Birthday privileges: granted 😎❤️';
  confetti(200); for (let i = 0; i < 12; i++) setTimeout(() => floatHeart(), i * 80);
};
function floatHeart() {
  const f = document.createElement('span'); f.className = 'floater'; f.textContent = '🎉';
  f.style.left = Math.random() * 100 + 'vw'; f.style.fontSize = '32px'; f.style.animationDuration = '4s';
  $('#float-layer').appendChild(f); setTimeout(() => f.remove(), 4200);
}

/* ---------- Letter + final ---------- */
$('#envelope').onclick = e => {
  $('#letter').hidden = false; e.currentTarget.setAttribute('aria-expanded', 'true');
  e.currentTarget.hidden = true; confetti(60);
};
$('#claim').onclick = e => { $('#reveal').hidden = false; e.currentTarget.hidden = true; confetti(260); };
$('#secret').onclick = () => { $('#secretMsg').hidden = false; confetti(40); };

/* ---------- Music (optional): put a file at audio/bgm.mp3 ---------- */
let audio = null;
$('#music').onclick = e => {
  if (!audio) audio = new Audio('Chote Tera Birthday Aaya 💕 #nazarbattu #yt #ytshorts #comedy #funnyvideos #skits #birthday.mp3'), audio.loop = true;
  if (audio.paused) audio.play().then(() => e.target.textContent = '🎶 Music on').catch(() => e.target.textContent = '🎵 Add audio/bgm.mp3');
  else { audio.pause(); e.target.textContent = '🎵 Music off'; }
};

/* ---------- Back to top / replay ---------- */
addEventListener('scroll', () => $('#top').hidden = scrollY < 600, { passive: true });
$('#top').onclick = () => scrollTo({ top: 0 });
$('#replay').onclick = () => location.reload();

