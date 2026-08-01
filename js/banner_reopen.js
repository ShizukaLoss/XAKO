const overlay = document.getElementById('introOverlay');
const header = document.querySelector('.header');
const reopenBtn = document.getElementById('introReopenBtn');
const wrapper = document.querySelector('.wrapper');
header.classList.add('header--intro');

const PEEK_HEIGHT = 50;

let isCollapsed = false;

const cameFromSameSite = document.referrer &&
  new URL(document.referrer).hostname === window.location.hostname;

function getHeaderTop() {
  return parseFloat(getComputedStyle(header).top) || 0;
}

function syncCollapsedOverlayGeometry() {
  if (!isCollapsed) return;
  const headerTop = getHeaderTop();
  const headerHeight = header.offsetHeight;
  overlay.style.top = headerTop + 'px';
  overlay.style.height = (headerHeight + PEEK_HEIGHT) + 'px';
}

if (cameFromSameSite) {
  overlay.classList.add('intro-overlay--no-transition');
  header.classList.add('intro-overlay--no-transition');

  isCollapsed = true;
  overlay.classList.add('is-collapsed');
  header.classList.add('is-visible');
  document.body.style.overflow = '';
} else {
  document.body.style.overflow = 'hidden';
}

function syncContentOffset() {
  wrapper.style.paddingTop = (header.offsetHeight + PEEK_HEIGHT) + 'px';
}

syncContentOffset();
syncCollapsedOverlayGeometry();

requestAnimationFrame(function () {
  requestAnimationFrame(function () {
    overlay.classList.remove('intro-overlay--no-transition');
    header.classList.remove('intro-overlay--no-transition');
  });
});

function collapseIntro() {
  if (isCollapsed) return;
  isCollapsed = true;

  overlay.classList.add('is-collapsed');
  header.classList.add('is-visible');
  syncCollapsedOverlayGeometry();

  document.body.style.overflow = '';
  document.dispatchEvent(new Event('intro:collapse'));
}

function expandIntro() {
  isCollapsed = false;

  overlay.classList.remove('is-collapsed');
  header.classList.remove('is-visible');
  overlay.style.height = '';
  overlay.style.top = '';

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
  if (e.target.closest('.intro-overlay__dots')) return;
  if (!isCollapsed) {
    collapseIntro();
  }
});

window.addEventListener('resize', function () {
  syncContentOffset();
  syncCollapsedOverlayGeometry();
});

document.addEventListener('topbar:stuckchange', syncCollapsedOverlayGeometry);