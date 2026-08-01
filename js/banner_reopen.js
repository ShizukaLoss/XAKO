const overlay = document.getElementById('introOverlay');
const header = document.querySelector('.header');
const reopenBtn = document.getElementById('introReopenBtn');
const wrapper = document.querySelector('.wrapper');
header.classList.add('header--intro'); // сразу навешиваем доп. класс — для гарантированной специфичности

const PEEK_HEIGHT = 50; // сколько px полоски "выглядывает" из-под хедера

let isCollapsed = false;

document.body.style.overflow = 'hidden';


function syncContentOffset() {
  wrapper.style.paddingTop = (header.offsetHeight + PEEK_HEIGHT) + 'px';
}

syncContentOffset();

function collapseIntro() {
  if (isCollapsed) return;
  isCollapsed = true;

  const headerHeight = header.offsetHeight; // реальная высота хедера прямо сейчас
  overlay.style.height = (headerHeight + PEEK_HEIGHT) + 'px';

  overlay.classList.add('is-collapsed');
  header.classList.add('is-visible');

  document.body.style.overflow = '';
  document.dispatchEvent(new Event('intro:collapse'));
}

function expandIntro() {
  isCollapsed = false;

  overlay.classList.remove('is-collapsed');
  header.classList.remove('is-visible');
  overlay.style.height = ''; // сброс инлайн-высоты — вернётся 100vh из CSS

  document.body.style.overflow = 'hidden';
  document.dispatchEvent(new Event('intro:expand'));
}

function handleScrollAttempt(e) {
  if (!isCollapsed) {
    e.preventDefault();
    collapseIntro();
  }
}

window.addEventListener('wheel', handleScrollAttempt, { passive: false });
window.addEventListener('touchmove', handleScrollAttempt, { passive: false });

window.addEventListener('keydown', function (e) {
  const scrollKeys = ['ArrowDown', 'PageDown', ' '];
  if (!isCollapsed && scrollKeys.includes(e.key)) {
    e.preventDefault();
    collapseIntro();
  }
});

reopenBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  expandIntro();
});

overlay.addEventListener('click', function (e) {
  if (e.target.closest('.intro-overlay__dots')) return; // не закрывать при клике по точкам
  if (!isCollapsed) {
    collapseIntro();
  }
});


window.addEventListener('resize', function () {
  syncContentOffset();
  if (isCollapsed) {
    overlay.style.height = (header.offsetHeight + PEEK_HEIGHT) + 'px';
  }
});
