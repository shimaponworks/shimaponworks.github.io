// なな湯 v3：固定ボタンの出し入れと、デモ用リンクのお知らせ
(() => {
  const fixed = document.querySelector('.fixed-cta');
  const cover = document.querySelector('.cover__action');
  const last = document.querySelector('#line');
  if (fixed && cover && last && 'IntersectionObserver' in window) {
    fixed.hidden = false;
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target, e.isIntersecting));
      const passedCover = cover.getBoundingClientRect().bottom < 0;
      const show = passedCover && !seen.get(last);
      fixed.classList.toggle('is-show', show);
      fixed.querySelector('a').tabIndex = show ? 0 : -1;
    });
    io.observe(cover);
    io.observe(last);
  }

  const toast = document.querySelector('.toast');
  let timer;
  document.querySelectorAll('[data-demo]').forEach((a) => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (!toast) return;
      toast.textContent = '見本のページのため、LINEには移動しません。';
      toast.classList.add('is-show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('is-show'), 3000);
    });
  });
})();
