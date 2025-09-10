const MESSAGES = [
  "I just want to say something… 🥰",
  "Don’t be nervous — it’s just me. 😘",
  "You make ordinary days feel like magic ✨",
  "I replay our chats when I need to smile 😊",
  "I’m excited for Sept 13 — I'll make it special 💕",
  "You’re kind, funny, and impossibly sweet 🥹",
  "Promise: I’ll do my best to make you feel loved 🌸",
  "This is for now — there’s so much more later 💌 — Rein"
];
const MAX = MESSAGES.length;
const messageArea = document.getElementById('messageArea');
const bigHeart = document.getElementById('bigHeart');
const progressBar = document.getElementById('progressBar');
const attemptsEl = document.getElementById('attempts');
const statusEl = document.getElementById('status');
const particlesCanvas = document.getElementById('particles');
const soundToggle = document.getElementById('soundToggle');
const replayBtn = document.getElementById('replayBtn');

let idx = 0;
let taps = 0;
let musicStarted = false;
let musicMuted = false;
particlesCanvas.width = window.innerWidth;
particlesCanvas.height = window.innerHeight;
const ctx = particlesCanvas.getContext('2d');
let particles = [];
function rand(min, max){ return Math.random()*(max-min)+min; }

function spawnHeart(x, y, emoji = '💖'){
  particles.push({
    x, y,
    vx: rand(-1, 1),
    vy: rand(-2, -0.8),
    size: rand(16, 28),
    life: Math.round(rand(60, 100)),
    emoji
  });
}
function animateHearts(){
  ctx.clearRect(0,0,particlesCanvas.width,particlesCanvas.height);
  for(let i = particles.length - 1; i >= 0; i--){
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += -0.015;
    p.life--;
    ctx.globalAlpha = Math.max(0, p.life / 100);
    ctx.font = `${p.size}px serif`;
    ctx.fillText(p.emoji, p.x, p.y);
    if(p.life <= 0) particles.splice(i,1);
  }
  requestAnimationFrame(animateHearts);
}
animateHearts();
let heartPop, bgMusic;
if (window.Howl) {
  heartPop = new Howl({ src: ['./assets/heart-pop.mp3'], volume: 0.55 });
  bgMusic = new Howl({ src: ['./assets/bg-music.mp3'], loop: true, volume: 0.35 });
}
function startBgMusic() {
  if (musicStarted || !bgMusic) return;
  try { bgMusic.play(); } catch(_) {}
  musicStarted = true;
}
function pulseHeart(scale = 1.12, duration = 0.25){
  if (window.gsap) {
    gsap.fromTo(bigHeart, { scale: 1 }, { scale, duration, yoyo: true, repeat: 1, ease: 'power2.inOut' });
  }
}
let typingActive = false;
function typingText(el, text, speed = 18){
  if (typingActive) return; 
  typingActive = true;
  el.textContent = '';
  let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i] || '';
    i++;
    if (i > text.length) {
      clearInterval(iv);
      typingActive = false;
    }
  }, speed);
}

function updateProgress(){
  const pct = Math.min(100, Math.round((idx / MAX) * 100));
  progressBar.style.width = `${pct}%`;
  attemptsEl.textContent = `Taps: ${taps}`;
  statusEl.textContent = idx < MAX ? `Step ${Math.max(0, idx)}/${MAX}` : 'All done 💖';
}

function onTap(){
  startBgMusic();
  taps++;
  if (idx >= MAX) {
    messageArea.innerHTML = `That’s all 💌<br>If you liked this, <a href="https://m.me/jReinMendoza" target="_blank" style="color:#ffebf2;text-decoration:underline;">send me a message ❤️</a>`;
    pulseHeart(1.14, 0.26);
    return;
  }

  idx++;
  const msg = MESSAGES[idx - 1];
  typingText(messageArea, msg, 20);

  try { if (heartPop) heartPop.play(); } catch(e){}

  pulseHeart(1.14, 0.26);
  const rect = bigHeart.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < 5; i++) spawnHeart(cx + rand(-20,20), cy + rand(-15,15));

  if (idx === MAX) {
    setTimeout(() => {
      typingText(messageArea, "Can’t wait to see you on Sept 14 💕 — Rein", 18);
      const cx2 = window.innerWidth/2, cy2 = window.innerHeight/2;
      for (let j = 0; j < 8; j++) spawnHeart(cx2+rand(-200,200), cy2+rand(-150,150), j%3===0?'💞':'💖');
    }, 400);
  }

  tapsUpdate();
  updateProgress();
}
bigHeart.addEventListener('click', onTap);
bigHeart.addEventListener('touchstart', onTap);

document.body.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault(); bigHeart.click();
  }
});
function tapsUpdate(){
  if (taps % 3 === 0 && window.gsap) {
    gsap.to(bigHeart, { rotation: rand(-10,10), duration: 0.18, yoyo:true, repeat:1 });
  }
}
soundToggle.addEventListener('click', () => {
  if (!bgMusic) return;
  if (musicMuted) {
    bgMusic.play();
    soundToggle.textContent = "🔊";
    musicMuted = false;
  } else {
    bgMusic.pause();
    soundToggle.textContent = "🔇";
    musicMuted = true;
  }
});
function init(){
  messageArea.textContent = "Hiii Chae 💖 Tap the heart to see messages.";
  updateProgress();
  if (window.gsap) {
    gsap.from('.card', { y: 36, opacity: 0, duration: 0.9, ease: 'power2.out' });
    gsap.to('#bigHeart', { scale: 1.06, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 });
  }
}
init();
window.addEventListener('resize', () => {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
});
replayBtn.addEventListener('click', () => {
  idx = 0;
  taps = 0;

  messageArea.textContent = "Hiii Chae 💖 Tap the heart to see messages.";
  progressBar.style.width = '0%';
  attemptsEl.textContent = `Taps: 0`;
  statusEl.textContent = `Step 0/${MAX}`;
  particles = [];

  // Reset big heart scale and rotation
  if (window.gsap) {
    gsap.to(bigHeart, { scale: 1, rotation: 0, duration: 0.5, ease: 'power2.out' });
  }
});
