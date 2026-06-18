(function () {
  'use strict';

  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewPrev = document.getElementById('reviewPrev');
  const reviewNext = document.getElementById('reviewNext');
  const contactForm = document.getElementById('contactForm');

  let reviewIndex = 0;

  function handleScroll() {
    if (!header) return;
    const scrolled = window.scrollY > 60;
    header.classList.toggle('scrolled', scrolled);
    header.classList.toggle('over-hero', window.scrollY < window.innerHeight * 0.85);
  }

  function toggleMobileNav() {
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  function getVisibleReviews() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateReviews() {
    if (!reviewsTrack) return;
    const cards = reviewsTrack.querySelectorAll('.review-card');
    const total = cards.length;
    const visible = getVisibleReviews();
    const maxIndex = Math.max(0, total - visible);

    if (reviewIndex > maxIndex) reviewIndex = maxIndex;

    const card = cards[0];
    if (!card) return;

    const gap = 24;
    const cardWidth = card.offsetWidth + gap;
    reviewsTrack.style.transform = 'translateX(-' + (reviewIndex * cardWidth) + 'px)';
  }

  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              entry.target.classList.add('visible');
            }, i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        closeMobileNav();

        const offset = header ? header.offsetHeight + 16 : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  function initForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const newPatient = document.getElementById('newPatient').value;
      const message = document.getElementById('message').value;

      const subject = encodeURIComponent('Appointment Request from ' + name);
      const body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Email: ' + (email || 'Not provided') + '\n' +
        'New Patient: ' + newPatient + '\n\n' +
        'Message:\n' + (message || 'No message')
      );

      window.location.href = 'mailto:info@deefamilydental.com?subject=' + subject + '&body=' + body;
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileNav);
  }

  if (reviewPrev) {
    reviewPrev.addEventListener('click', function () {
      reviewIndex = Math.max(0, reviewIndex - 1);
      updateReviews();
    });
  }

  if (reviewNext) {
    reviewNext.addEventListener('click', function () {
      const cards = reviewsTrack ? reviewsTrack.querySelectorAll('.review-card') : [];
      const maxIndex = Math.max(0, cards.length - getVisibleReviews());
      reviewIndex = Math.min(maxIndex, reviewIndex + 1);
      updateReviews();
    });
  }

  window.addEventListener('resize', updateReviews);

  initReveal();
  initSmoothScroll();
  initForm();
  updateReviews();

  setInterval(function () {
    if (!reviewsTrack) return;
    const cards = reviewsTrack.querySelectorAll('.review-card');
    const maxIndex = Math.max(0, cards.length - getVisibleReviews());
    reviewIndex = reviewIndex >= maxIndex ? 0 : reviewIndex + 1;
    updateReviews();
  }, 6000);
})();
