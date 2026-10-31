// hair salon Lumio（ポートフォリオ用・架空）
(() => {
  // スマホの追従予約バー：FVを過ぎたら出し、予約セクションが見えている間は隠す
  const bar = document.querySelector('.fixed-bar');
  const fv = document.querySelector('.fv');
  const reserve = document.querySelector('#reserve');

  if (bar && fv && reserve && 'IntersectionObserver' in window) {
    let pastFv = false;
    let inReserve = false;
    const update = () => bar.classList.toggle('is-show', pastFv && !inReserve);

    new IntersectionObserver(([entry]) => {
      pastFv = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    }).observe(fv);

    new IntersectionObserver(([entry]) => {
      inReserve = entry.isIntersecting;
      update();
    }).observe(reserve);
  }

  // デモ用：予約セクションのボタンを押したら通知を出す（架空のサロンのため予約ページはない）
  const toast = document.querySelector('.toast');
  let timer;
  document.querySelectorAll('[data-demo]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (!toast) return;
      toast.textContent = '見本のページのため、予約ページはありません。';
      toast.classList.add('is-show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('is-show'), 3200);
    });
  });
})();
