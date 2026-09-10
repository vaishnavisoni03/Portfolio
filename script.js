// ==========================================================================
// Vaishnavi Soni - Portfolio Scripts
// Simple, beginner-friendly JavaScript for interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Navigation Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    // Open/close mobile menu when clicking the hamburger icon
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('open');
    });

    // Close the mobile menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('open');
      });
    });
  }

  // 2. Smooth Scrolling for Internal Links
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      // Only proceed if target points to a valid ID on the page
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

  // 3. Scroll Reveal Animation
  // Automatically reveals elements as you scroll down the page
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once revealed, no need to observe again
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12 // Trigger when 12% of the element is visible
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers: show all elements directly
    revealElements.forEach((el) => el.classList.add('active'));
  }

});
