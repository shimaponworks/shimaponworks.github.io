// スクロールしたら、見出し・カードなどを下から順番に表示する
// （HTML に印をつけなくてよいように、対象はここでまとめて指定する）
const groups = [
  '.heading',
  '.worry li', '.worry__answer',
  '.skills li',
  '.work',
  '.price__item',
  '.flow li',
  '.policy__list li',
  '.faq',
  '.about',
  '.contact__inner > *',
];

const targets = [];
groups.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--delay', `${Math.min(i % 6, 5) * 80}ms`); // 同じ並びの中で少しずつ遅らせる
    targets.push(el);
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  targets.forEach((el) => observer.observe(el));
} else {
  targets.forEach((el) => el.classList.add('is-visible'));
}

// スクロールしたらヘッダーに影をつける
const header = document.querySelector('.header');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
