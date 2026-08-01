const topbar = document.querySelector('.header-topbar-container');
const topbarHeaderEl = document.querySelector('.header');

function syncTopbarOffset() {
   if (!topbar) return;
   document.documentElement.style.setProperty('--topbar-height', topbar.offsetHeight + 'px');
}

function updateHeaderStuck() {
   if (!topbar || !topbarHeaderEl) return;
   const wasStuck = topbarHeaderEl.classList.contains('header--stuck');
   const isStuck = window.scrollY >= topbar.offsetHeight;
   if (isStuck !== wasStuck) {
      topbarHeaderEl.classList.toggle('header--stuck', isStuck);
      document.dispatchEvent(new CustomEvent('topbar:stuckchange'));
   }
}

syncTopbarOffset();
updateHeaderStuck();

window.addEventListener('scroll', updateHeaderStuck, { passive: true });
window.addEventListener('resize', function () {
   syncTopbarOffset();
   updateHeaderStuck();
});