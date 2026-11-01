// スクロールしたら、ヘッダーの下に細い線を出す（写真や本文との境目をわかりやすくする）
const header = document.querySelector('.header');

if (header) {
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}
