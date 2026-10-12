// ハンバーガーメニュー
const toggle = document.querySelector('.header__toggle');
const nav = document.querySelector('.header__nav');

if (toggle && nav) {
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    nav.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

// スクロールで表示
const fadeTargets = document.querySelectorAll('.js-fade');

if ('IntersectionObserver' in window) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  fadeTargets.forEach((el) => fadeObserver.observe(el));
} else {
  fadeTargets.forEach((el) => el.classList.add('is-visible'));
}

// ヘッダー：少しスクロールしたら色をつける
const header = document.querySelector('.header');

if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ファーストビューのスライドショー（6秒ごとに切り替え）
const slides = document.querySelectorAll('.hero__slide');
const pauseButton = document.querySelector('.hero__pause');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (slides.length > 1 && !motionQuery.matches) {
  let current = 0;
  let timer = null;
  let paused = false;

  // 2枚目以降の写真は、ページの表示が終わってから読み込む
  const loadSlides = () => {
    document.querySelectorAll('.hero__slide [data-srcset]').forEach((el) => {
      el.srcset = el.dataset.srcset;
      el.removeAttribute('data-srcset');
    });
  };

  const show = (next) => {
    const prev = slides[current];
    prev.classList.remove('is-active');
    prev.classList.add('is-leaving');
    setTimeout(() => prev.classList.remove('is-leaving'), 1600);
    current = next;
    slides[current].classList.add('is-active');
  };

  const start = () => {
    clearInterval(timer);
    timer = setInterval(() => show((current + 1) % slides.length), 6000);
  };
  const stop = () => clearInterval(timer);

  const begin = () => {
    loadSlides();
    start();
    if (pauseButton) pauseButton.hidden = false;
  };
  if (document.readyState === 'complete') begin();
  else window.addEventListener('load', begin);

  // 一時停止ボタン
  if (pauseButton) {
    pauseButton.addEventListener('click', () => {
      paused = !paused;
      pauseButton.setAttribute('aria-pressed', String(paused));
      pauseButton.setAttribute('aria-label', paused ? 'スライドショーを再生' : 'スライドショーを一時停止');
      if (paused) stop(); else start();
    });
  }

  // 別のタブを見ているあいだは止める
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (!paused) start();
  });
}

// 数字のカウントアップ（90℃・16℃など）。動きを減らす設定のときは何もしない
const counters = document.querySelectorAll('[data-count]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
  const countUp = (el) => {
    const end = Number(el.dataset.count);
    const start = performance.now();
    const duration = 1200;
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -15% 0px' });

  counters.forEach((el) => countObserver.observe(el));
}

// デモ用：LINEのボタンを押したら、登録できない旨を通知する
const toast = document.querySelector('.toast');
let toastTimer;

document.querySelectorAll('[data-demo]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (!toast) return;
    toast.textContent = 'ポートフォリオ用のデモサイトのため、LINEの登録はできません。';
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 3000);
  });
});

// 追従ボタン：ファーストビューとクーポンのセクションが見えていないときだけ表示
const fixedCta = document.querySelector('.fixed-cta');
const fv = document.querySelector('.hero');
const reserve = document.querySelector('#coupon');

if (fixedCta && fv && reserve && 'IntersectionObserver' in window) {
  const visible = new Map([[fv, true], [reserve, false]]);

  const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visible.set(entry.target, entry.isIntersecting));
    fixedCta.classList.toggle('is-show', !visible.get(fv) && !visible.get(reserve));
  });

  ctaObserver.observe(fv);
  ctaObserver.observe(reserve);
}
