// あさひ台内科クリニック 看護師募集（ポートフォリオ用・架空）
(() => {
  // スマホの追従ボタン：FVを過ぎたら出し、見学・応募の欄が見えている間は隠す
  const bar = document.querySelector('.fixed-bar');
  const fv = document.querySelector('.fv');
  const apply = document.querySelector('#apply');
  if (bar && fv && apply && 'IntersectionObserver' in window) {
    let pastFv = false;
    let inApply = false;
    const update = () => bar.classList.toggle('is-show', pastFv && !inApply);
    new IntersectionObserver(([e]) => { pastFv = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }).observe(fv);
    new IntersectionObserver(([e]) => { inApply = e.isIntersecting; update(); }).observe(apply);
  }

  // デモ用のフォーム：送信せずに通知だけ出す（架空のクリニックのため）
  const form = document.querySelector('[data-demo-form]');
  const toast = document.querySelector('.toast');
  let timer;
  if (form && toast) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      toast.textContent = 'ポートフォリオ用の架空のクリニックのため、送信はされません。';
      toast.classList.add('is-show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('is-show'), 3200);
    });
  }
})();
