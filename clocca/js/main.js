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

const canObserve = 'IntersectionObserver' in window;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// スクロールで表示
const fadeTargets = document.querySelectorAll('.js-fade');

if (canObserve) {
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

// 数字のカウントアップ（HTMLには最終の数字を書いておき、見えたときだけ 0 から動かす）
const counters = document.querySelectorAll('[data-count]');

if (canObserve && !reduceMotion) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.count);
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(end * eased).toLocaleString('ja-JP');
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach((el) => countObserver.observe(el));
}

// デモ用の通知
const toast = document.querySelector('.toast');
let toastTimer;

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-show'), 4000);
};

// 資料請求フォーム（デモ）：入力チェックだけを行い、内容はどこにも送信しない
const form = document.querySelector('.form');

if (form) {
  const error = form.querySelector('.form__error');
  const fields = form.querySelectorAll('input, select');

  const markInvalid = (field) => {
    const target = field.type === 'checkbox' ? field.closest('.form__agree') : field;
    target.classList.toggle('is-invalid', !field.checkValidity());
    field.setAttribute('aria-invalid', String(!field.checkValidity()));
  };

  fields.forEach((field) => {
    field.addEventListener('change', () => markInvalid(field));
    field.addEventListener('blur', () => markInvalid(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    fields.forEach(markInvalid);

    const firstInvalid = form.querySelector(':invalid');
    if (firstInvalid) {
      error.hidden = false;
      firstInvalid.focus();
      return;
    }

    error.hidden = true;
    form.reset();
    fields.forEach((field) => field.removeAttribute('aria-invalid'));
    showToast('デモサイトのため送信されません（入力内容はどこにも保存・送信していません）');
  });
}

// 追従ボタン：ファーストビューとフォームが見えていないときだけ表示
const fixedCta = document.querySelector('.fixed-cta');
const fv = document.querySelector('.fv');
const formSection = document.querySelector('#form');

if (fixedCta && fv && formSection && canObserve) {
  const visible = new Map([[fv, true], [formSection, false]]);

  const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => visible.set(entry.target, entry.isIntersecting));
    fixedCta.classList.toggle('is-show', !visible.get(fv) && !visible.get(formSection));
  });

  ctaObserver.observe(fv);
  ctaObserver.observe(formSection);
}
