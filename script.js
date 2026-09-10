// ==========================================================================
// Vaishnavi Soni - Personal Portfolio Interactions
// Vanilla JavaScript for smooth navigation and subtle animations
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Menu Toggle ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    // Open or close the dropdown on click
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('open');
    });

    // Close the menu when any section link is tapped
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('open');
      });
    });
  }

  // --- 2. Smooth Scrolling for Internal Links ---
  const internalAnchors = document.querySelectorAll('a[href^="#"]');

  internalAnchors.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // --- 3. Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, {
      threshold: 0.12
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: display directly if IntersectionObserver is unsupported
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // --- 4. Active Navigation Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-link');
          } else {
            link.classList.remove('active-link');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

});
