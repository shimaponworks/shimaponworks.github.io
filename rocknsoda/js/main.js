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

// 1日の流れ（11:00 → 15:00 → 20:00）を、見えたら順番に表示
const day = document.querySelector('.day');
if (day && 'IntersectionObserver' in window) {
  const dayObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      day.classList.add('is-visible');
      dayObserver.disconnect();
    }
  }, { rootMargin: '0px 0px -10% 0px' });
  dayObserver.observe(day);
} else if (day) {
  day.classList.add('is-visible');
}

// ファーストビュー：昼の店内 → 夜の店内 を、7秒ごとに切り替える
const slides = document.querySelectorAll('.hero__slide');
const clock = document.querySelector('.hero__clock');
const pauseButton = document.querySelector('.hero__pause');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (slides.length > 1 && !reduceMotion) {
  let current = 0;
  let timer = null;
  let paused = false;

  const show = (next) => {
    const prev = slides[current];
    prev.classList.remove('is-active');
    prev.classList.add('is-leaving');
    setTimeout(() => prev.classList.remove('is-leaving'), 1800);
    current = next;
    slides[current].classList.add('is-active');
    if (clock) {
      clock.querySelector('span').textContent = slides[current].dataset.time;
      clock.classList.remove('is-changing');
      void clock.offsetWidth; // アニメーションをやり直す
      clock.classList.add('is-changing');
    }
  };
  const start = () => { clearInterval(timer); timer = setInterval(() => show((current + 1) % slides.length), 7000); };
  const stop = () => clearInterval(timer);

  // 夜の写真は、ページの表示が終わってから読み込む
  const begin = () => {
    document.querySelectorAll('.hero__slide [data-srcset]').forEach((el) => {
      el.srcset = el.dataset.srcset;
      el.removeAttribute('data-srcset');
    });
    start();
    if (pauseButton) pauseButton.hidden = false;
  };
  if (document.readyState === 'complete') begin();
  else window.addEventListener('load', begin);

  if (pauseButton) {
    pauseButton.addEventListener('click', () => {
      paused = !paused;
      pauseButton.setAttribute('aria-pressed', String(paused));
      pauseButton.setAttribute('aria-label', paused ? '写真の切り替えを再開' : '写真の切り替えを一時停止');
      if (paused) stop(); else start();
    });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (!paused) start();
  });
}

// デモ用：予約ボタンを押したら、予約できない旨を通知する
const toast = document.querySelector('.toast');
let toastTimer;

document.querySelectorAll('[data-demo]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (!toast) return;
    toast.textContent = '見本のページのため、予約はできません。';
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 3000);
  });
});

// 追従ボタン：ファーストビューと予約のセクションが見えていないときだけ表示
const fixedCta = document.querySelector('.fixed-cta');
const fv = document.querySelector('.hero');
const reserve = document.querySelector('#reserve');

if (fixedCta && fv && reserve && 'IntersectionObserver' in window) {
  const visible = new Map([[fv, true], [reserve, false]]);

  const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visible.set(entry.target, entry.isIntersecting));
    fixedCta.classList.toggle('is-show', !visible.get(fv) && !visible.get(reserve));
  });

  ctaObserver.observe(fv);
  ctaObserver.observe(reserve);
}
