/* ===== app.js — Anisou Tiramisu (Camino-inspired) ===== */

/* ============================================================
   STORY INTRO ENGINE
   ============================================================ */
(function () {
  const CHAPTER_DURATION = 3600;
  const chapters = ['ch1', 'ch2', 'ch3', 'ch4'].map(id => document.getElementById(id));
  const dots = ['idot0', 'idot1', 'idot2', 'idot3'].map(id => document.getElementById(id));
  const intro = document.getElementById('storyIntro');
  let current = 0, timer = null, dismissed = false;

  document.body.classList.add('intro-active');

  function showChapter(idx) {
    chapters.forEach((ch, i) => ch.classList.toggle('ch-active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    intro.classList.toggle('last-ch', idx === chapters.length - 1);
  }

  function advance() {
    if (dismissed) return;
    current++;
    if (current >= chapters.length) { current = chapters.length - 1; clearInterval(timer); return; }
    showChapter(current);
  }

  showChapter(0);
  timer = setInterval(advance, CHAPTER_DURATION);

  window.dismissIntro = function () {
    if (dismissed) return;
    dismissed = true;
    clearInterval(timer);
    intro.classList.add('dismiss');
    document.body.classList.remove('intro-active');
    intro.addEventListener('animationend', () => intro.remove(), { once: true });
  };

  /* ---- Particle system ---- */
  const canvas = document.getElementById('introParticles');
  const ctx = canvas.getContext('2d');
  const PCOUNT = 50;
  let particles = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function mkParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.8,
      alpha: Math.random() * 0.45 + 0.15,
      dx: (Math.random() - 0.5) * 0.45,
      dy: -(Math.random() * 0.6 + 0.2),
      color: Math.random() > 0.6 ? '#3D1E0E' : '#5C2E14',
    };
  }
  for (let i = 0; i < PCOUNT; i++) particles.push(mkParticle());

  function tick() {
    if (!document.getElementById('introParticles')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.dx; p.y += p.dy;
      if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
        particles[i] = mkParticle();
        particles[i].y = canvas.height + 10;
      }
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ============================================================
   NAVBAR — transparent → scrolled
   ============================================================ */
const navbar = document.getElementById('navbar');
navbar.classList.add('transparent');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.remove('transparent');
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.add('transparent');
    navbar.classList.remove('scrolled');
  }
});

/* ============================================================
   HAMBURGER
   ============================================================ */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   STORES DATA
   ============================================================ */
const STORES = [
  { city: 'خنشلة', name: 'مقهى المرجان', address: 'شارع الاستقلال، خنشلة المركز', hours: '08:00 – 22:00' },
  { city: 'خنشلة', name: 'حلويات النور', address: 'حي الشهداء، خنشلة', hours: '09:00 – 21:30' },
  { city: 'باتنة', name: 'سويت بيك باتنة', address: 'شارع العربي بن مهيدي، باتنة', hours: '08:30 – 22:00' },
  { city: 'باتنة', name: 'كافيه برييم', address: 'حي البدر، باتنة', hours: '10:00 – 23:00' },
  { city: 'قسنطينة', name: 'حلويات قسنطينة الكبرى', address: 'شارع زيغود يوسف، قسنطينة', hours: '09:00 – 22:00' },
  { city: 'قسنطينة', name: 'ماي سويت', address: 'حي سيدي بروبة، قسنطينة', hours: '10:00 – 21:00' },
  { city: 'سطيف', name: 'تاج الحلويات', address: 'شارع الجيش الأول، سطيف', hours: '08:00 – 22:30' },
  { city: 'سطيف', name: 'دولتشي فيتا سطيف', address: 'حي ابن رشد، سطيف', hours: '09:30 – 22:00' },
  { city: 'الجزائر', name: 'كافيه ديلوكس', address: 'شارع ديدوش مراد، الجزائر العاصمة', hours: '08:00 – 24:00' },
  { city: 'الجزائر', name: 'ميلانو سويتس', address: 'حيدرة، الجزائر', hours: '10:00 – 23:00' },
];

function renderStores(filter) {
  const grid = document.getElementById('storesGrid');
  const list = filter === 'all' ? STORES : STORES.filter(s => s.city === filter);
  grid.innerHTML = list.map(s => `
    <div class="store-card">
      <p class="store-city">${s.city}</p>
      <h3 class="store-name">${s.name}</h3>
      <p class="store-address">${s.address}</p>
      <p class="store-hours">🕐 ${s.hours}</p>
    </div>
  `).join('');
  /* Restore reveal for new cards */
  grid.querySelectorAll('.store-card').forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .5s ${i * 0.05}s ease, transform .5s ${i * 0.05}s ease`;
    requestAnimationFrame(() => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  });
}

window.filterStores = function (city, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderStores(city);
};

renderStores('all');

/* ============================================================
   ORDER MODAL
   ============================================================ */
let currentPrice = 850;

window.openOrderModal = function (product, price) {
  currentPrice = parseInt(price);
  document.getElementById('modalProduct').value = product;
  document.getElementById('qty').value = 1;
  document.getElementById('modalTotal').textContent = price + ' دج';
  document.getElementById('orderModal').classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeOrderModal = function () {
  document.getElementById('orderModal').classList.remove('active');
  document.body.style.overflow = '';
};

document.getElementById('orderModal').addEventListener('click', function (e) {
  if (e.target === this) closeOrderModal();
});

window.changeQty = function (delta) {
  const input = document.getElementById('qty');
  const nv = Math.min(20, Math.max(1, parseInt(input.value) + delta));
  input.value = nv;
  document.getElementById('modalTotal').textContent =
    (currentPrice * nv).toLocaleString('ar-DZ') + ' دج';
};

window.submitOrder = function (e) {
  e.preventDefault();
  const name = document.getElementById('orderName').value;
  const phone = document.getElementById('orderPhone').value;
  if (!name || !phone) { showToast('⚠️ يرجى ملء الحقول المطلوبة'); return; }
  closeOrderModal();
  document.getElementById('orderForm').reset();
  showToast('✅ تم استلام طلبك! سنتواصل معك قريباً 🎉');
};

/* ============================================================
   REVIEWS
   ============================================================ */
const REVIEWS = [
  { stars: 5, text: 'والله ما عمري كليت كيمو هذا! كريمته خفيفة وطعمته ما يتوصفش. شكراً أنيسو! 🤤', name: 'فاطمة الزهراء', city: 'باتنة', color: '#A0472A' },
  { stars: 5, text: 'أنا طلبت علبة فاميلي للعيلة وكلهم عجبهم من كبير لصغير. رجعت نطلب مرة ثانية.', name: 'محمد أمين', city: 'قسنطينة', color: '#3D4233' },
  { stars: 5, text: 'منتج جزائري راقي بصح! ما نحتاجوش نمشيو لبرا. متل ما قالو: خبزة البلاد ولو قرصة 🔥', name: 'سارة بن علي', city: 'سطيف', color: '#586048' },
  { stars: 5, text: 'التوصيل كان سريع والعلبة وصلت مرتبة. المذاق كان متل ما وصفوه بالضبط.', name: 'عمر بوشنتوف', city: 'الجزائر', color: '#7A3320' },
  { stars: 4, text: 'حلو بصراحة، كاين لمسة مميزة ماشي متل باقي التيراميسو. ننوصيه للجميع!', name: 'نسرين حمزة', city: 'خنشلة', color: '#4A2C14' },
  { stars: 5, text: 'اشتريته لعيد ميلاد صديقتي وبقاو منبهرين. شكراً أنيسو على هذا المنتج الرائع!', name: 'إيمان بن عامر', city: 'باتنة', color: '#A0472A' },
];

function renderReviews() {
  document.getElementById('reviewsTrack').innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">
        <div class="review-avatar" style="background:${r.color}">${r.name[0]}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-city">📍 ${r.city}</div>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('reviewsDots').innerHTML = REVIEWS.map((_, i) =>
    `<div class="dot${i === 0 ? ' active' : ''}" onclick="goToReview(${i})"></div>`
  ).join('');
}

let reviewIndex = 0;
window.goToReview = function (i) {
  reviewIndex = i;
  const card = document.querySelector('.review-card');
  const cardW = card ? card.offsetWidth + 20 : 360;
  document.getElementById('reviewsTrack').style.transform = `translateX(${i * cardW}px)`;
  document.querySelectorAll('.dot').forEach((d, j) => d.classList.toggle('active', j === i));
};

setInterval(() => { reviewIndex = (reviewIndex + 1) % REVIEWS.length; goToReview(reviewIndex); }, 4200);
renderReviews();

/* ============================================================
   CONTACT FORM
   ============================================================ */
window.submitContact = function (e) {
  e.preventDefault();
  e.target.reset();
  showToast('✉️ تم إرسال رسالتك! سنرد عليك خلال 24 ساعة.');
};

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' }); }
  });
});

/* ============================================================
   3D PARALLAX INGREDIENTS ENGINE (INFINITE WRAP)
   ============================================================ */
function initParallaxBackground() {
  const container = document.getElementById('parallaxBg');
  if (!container) return;

  const ingredients = ['🍓', '🤎', '☁️', '🥖', '🍫', '🍓', '🥖'];
  const NUM_ITEMS = 35;
  const items = [];
  const vh = window.innerHeight;
  const vw = window.innerWidth;

  for (let i = 0; i < NUM_ITEMS; i++) {
    const el = document.createElement('div');
    el.className = 'parallax-item';
    el.textContent = ingredients[Math.floor(Math.random() * ingredients.length)];

    // depth: < 1 bg, > 1 fg
    const depth = Math.random() * 1.5 + 0.3; // 0.3 to 1.8
    const scale = depth * (Math.random() * 0.7 + 0.5);

    // Random position across the visible screen (slightly offscreen to allow entering)
    let xPos = Math.random() * vw;
    let yPos = Math.random() * (vh * 1.5) - (vh * 0.25); // -25% to 125% vh

    const baseRotation = Math.random() * 360;
    const rotSpeed = (Math.random() - 0.5) * 0.3;

    let blurAmt = 0;
    if (depth < 0.6) blurAmt = (0.6 - depth) * 5;
    if (depth > 1.3) blurAmt = (depth - 1.3) * 6;

    // Set initial static styles
    el.style.left = `0px`; // we will use transform for x and y
    el.style.top = `0px`;
    el.style.fontSize = `${35 * scale}px`;
    el.style.filter = `blur(${blurAmt}px) drop-shadow(0 4px 12px rgba(61,30,14,0.15))`;
    el.style.opacity = Math.min(1, depth + 0.1);

    items.push({ el, depth, xPos, yPos, baseRotation, rotSpeed, currentY: yPos });
    container.appendChild(el);
  }

  let lastScrollY = window.scrollY;
  let scrollDelta = 0;

  window.addEventListener('scroll', () => {
    // We only care about how much we scrolled since last frame
    scrollDelta += (window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
  }, { passive: true });

  function renderParallax() {
    // Apply a fraction of the scrollDelta (smoothing)
    const moveY = scrollDelta * 0.1;
    scrollDelta -= moveY; // drain the delta

    items.forEach(item => {
      // Background items (depth < 1) move SLOWER than scroll (they don't keep up with the page going up, so they visually go UP on the screen)
      // Foreground items (depth > 1) move FASTER than scroll (they visually go DOWN on the screen)
      // Actually, standard parallax: things close up move FASTER.
      // So if I scroll DOWN (+ delta), page goes UP.
      // Emojis should go UP by (delta * depth).

      item.currentY -= (moveY * item.depth);

      // Infinite Wrapping logic
      const outBottom = vh + 150;
      const outTop = -150;

      if (item.currentY < outTop) {
        item.currentY = outBottom; // Wrap to bottom
        item.xPos = Math.random() * vw; // new random X
      } else if (item.currentY > outBottom) {
        item.currentY = outTop; // Wrap to top
        item.xPos = Math.random() * vw;
      }

      // Base slow floating even without scroll
      item.currentY -= (0.2 * item.depth);

      const currentRot = item.baseRotation + (lastScrollY * item.rotSpeed);
      item.el.style.transform = `translate3d(${item.xPos}px, ${item.currentY}px, 0) rotateZ(${currentRot}deg)`;
    });

    requestAnimationFrame(renderParallax);
  }

  renderParallax();
}

// Initialize
initParallaxBackground();
