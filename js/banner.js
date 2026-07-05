document.addEventListener('DOMContentLoaded', function () {
   const slides = document.querySelectorAll('.intro-overlay__slide');
   const dots = document.querySelectorAll('.intro-overlay__dots button');

   let current = 0;
   const intervalMs = 3000; // 3 секунды на слайд — при желании поменяйте
   let timer = null;

   function showSlide(index) {
      slides[current].classList.remove('is-active');
      if (dots.length) dots[current].classList.remove('is-active');

      current = index;

      slides[current].classList.add('is-active');
      if (dots.length) dots[current].classList.add('is-active');
   }

   function nextSlide() {
      showSlide((current + 1) % slides.length);
   }

   function startAutoplay() {
      timer = setInterval(nextSlide, intervalMs);
   }

   function stopAutoplay() {
      clearInterval(timer);
   }

   function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
   }

   // Клик по точке — переключение вручную + сброс таймера автопрокрутки
   dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
         if (index === current) return;
         showSlide(index);
         restartAutoplay();
      });
   });

   startAutoplay();
});