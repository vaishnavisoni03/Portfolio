// ==========================================================================
// Vaishnavi Soni - Portfolio Interactive Scripts
// Beginner-friendly vanilla JavaScript for UI interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. Mobile Navigation Toggle
  // ------------------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    // Open/close mobile menu when clicking hamburger icon
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('open');
    });

    // Close the mobile dropdown whenever a navigation link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('open');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 2. Smooth Scrolling for Internal Anchor Links
  // ------------------------------------------------------------------------
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((anchor) => {
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

  // ------------------------------------------------------------------------
  // 3. Highlight Active Navigation Link on Scroll
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active-link');
          } else {
            link.classList.remove('active-link');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ------------------------------------------------------------------------
  // 4. Scroll Reveal Animation using IntersectionObserver
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger once per element
        }
      });
    }, {
      threshold: 0.12
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Direct fallback for older browsers
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // ------------------------------------------------------------------------
  // 5. Work & Projects Category Filtering
  // ------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active filter button style
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      // Filter projects smoothly
      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 6. Interactive Contact Form Submission Handler
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill in all required fields.';
        formStatus.className = 'form-status';
        return;
      }

      // Display friendly success notice
      formStatus.textContent = `Thank you, ${name}! Your message has been prepared. Opening your email client...`;
      formStatus.className = 'form-status success';

      // Open mailto link so message can actually be sent without a backend server
      const mailtoSubject = encodeURIComponent(`Portfolio Message from ${name}`);
      const mailtoBody = encodeURIComponent(`Hi Vaishnavi,\n\n${message}\n\nFrom: ${name} (${email})`);
      
      setTimeout(() => {
        window.location.href = `mailto:vaishnavi.soni@example.com?subject=${mailtoSubject}&body=${mailtoBody}`;
      }, 700);

      // Reset form
      contactForm.reset();
    });
  }

});
