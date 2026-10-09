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

// デモ用：予約ボタンを押したら、予約できない旨を通知する
const toast = document.querySelector('.toast');
let toastTimer;

document.querySelectorAll('[data-demo]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (!toast) return;
    toast.textContent = 'ポートフォリオ用のデモサイトのため、予約はできません。';
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 3000);
  });
});

// 追従予約ボタン：ファーストビューと予約セクションが見えていないときだけ表示
const fixedCta = document.querySelector('.fixed-cta');
const fv = document.querySelector('.fv');
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
