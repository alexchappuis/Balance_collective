(function () {
  'use strict';

  // Sticky header — solid background once scrolled
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Auto-dismiss flash messages
  document.querySelectorAll('.flash').forEach((el) => {
    setTimeout(() => {
      el.style.transition = 'opacity .4s ease';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 450);
    }, 5000);
  });

  // Gallery carousel — scroll-snap with arrows, dots, swipe, and keyboard
  document.querySelectorAll('.gallery-carousel').forEach((root) => {
    const track = root.querySelector('.carousel-track');
    const slides = root.querySelectorAll('.carousel-slide');
    const dots = root.querySelectorAll('.carousel-dot');
    const prev = root.querySelector('.carousel-prev');
    const next = root.querySelector('.carousel-next');
    if (!track || !slides.length) return;

    const currentIndex = () => {
      const w = slides[0].offsetWidth;
      return w ? Math.round(track.scrollLeft / w) : 0;
    };

    const goTo = (i) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, i));
      const target = slides[clamped];
      if (target) track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    };

    const update = () => {
      const idx = currentIndex();
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx === slides.length - 1;
    };

    prev?.addEventListener('click', () => goTo(currentIndex() - 1));
    next?.addEventListener('click', () => goTo(currentIndex() + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Update active dot / arrow state as the user scrolls or swipes
    let t;
    track.addEventListener('scroll', () => {
      clearTimeout(t);
      t = setTimeout(update, 80);
    }, { passive: true });

    // Keyboard nav when the carousel area is focused
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(currentIndex() - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex() + 1); }
    });
    root.tabIndex = 0;

    update();
  });
})();