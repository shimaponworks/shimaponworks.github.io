// こもれび歯科 定期健診のご案内（ポートフォリオ用・架空）
(() => {
  // スマホの追従ボタン：FVを過ぎたら出し、予約の欄が見えている間は隠す
  const bar = document.querySelector('.fixed-bar');
  const fv = document.querySelector('.fv');
  const reserve = document.querySelector('#reserve');
  if (bar && fv && reserve && 'IntersectionObserver' in window) {
    let pastFv = false;
    let inReserve = false;
    const update = () => bar.classList.toggle('is-show', pastFv && !inReserve);
    new IntersectionObserver(([e]) => { pastFv = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }).observe(fv);
    new IntersectionObserver(([e]) => { inReserve = e.isIntersecting; update(); }).observe(reserve);
  }

  // デモ用のフォーム：送信せずに通知だけ出す（架空の歯科医院のため）
  const form = document.querySelector('[data-demo-form]');
  const toast = document.querySelector('.toast');
  let timer;
  if (form && toast) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      toast.textContent = 'ポートフォリオ用の架空の歯科医院のため、送信はされません。';
      toast.classList.add('is-show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('is-show'), 3200);
    });
  }

  // 院長あいさつ：最初の3行ほどだけ見せて「続きを読む」で開く。JS が動かないときは全文が見えたまま
  const body = document.querySelector('[data-fold]');
  const more = document.querySelector('.message__more');
  if (body && more) {
    const set = (open) => {
      body.classList.toggle('is-folded', !open);
      more.setAttribute('aria-expanded', String(open));
      more.textContent = open ? '閉じる' : '続きを読む';
    };
    set(false);
    more.hidden = false;
    more.addEventListener('click', () => {
      const open = more.getAttribute('aria-expanded') !== 'true';
      set(open);
      // 閉じたときにボタンが画面の上に消えていたら、ボタンの所まで戻す
      if (!open && more.getBoundingClientRect().top < 0) more.scrollIntoView({ block: 'center' });
    });
  }
})();
