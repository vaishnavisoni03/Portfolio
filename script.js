// ==========================================================================
// Vaishnavi Soni - Personal Portfolio Interactions
// Vanilla JavaScript: Canvas Particles, Reading Progress, Filter Bars,
// Lightbox, Project Modal, Clipboard Copy & Glassmorphic Toast Notifications
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Ambient Background Canvas Particles ---
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;
    let mouse = { x: null, y: null, radius: 120 };

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    }, { passive: true });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.8 + 1;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.alpha = Math.random() * 0.4 + 0.15;
        // Warm palette colors: burgundy, crimson, rose gold
        const colors = ['212, 43, 93', '245, 202, 169', '158, 28, 62', '255, 214, 227'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Gentle reaction to cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= Math.cos(angle) * force * 1.5;
            this.y -= Math.sin(angle) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${this.color}, 0.5)`;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with subtle gossamer lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 43, 93, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animId = requestAnimationFrame(animate);
    };

    animate();
  }

  // --- 2. Reading Progress & Back-to-Top Circular Ring ---
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircle = document.querySelector('.progress-ring-circle');
  const circumference = 2 * Math.PI * 23; // r = 23

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;
  }

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;

    // Linear progress bar at top
    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPercent * 100}%`;
    }

    // Circular ring on floating back-to-top button
    if (progressCircle) {
      const offset = circumference - (scrollPercent * circumference);
      progressCircle.style.strokeDashoffset = offset;
    }

    // Show or hide floating back-to-top button
    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Add scrolled class to header for deeper background
    const header = document.getElementById('header');
    if (header) {
      if (scrollTop > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 3. Mobile Navigation Menu Toggle ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('active');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside of nav menu
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 4. Smooth Scrolling for Internal Links ---
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

  // --- 5. Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // --- 6. Active Navigation Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const highlightNavOnScroll = () => {
    const scrollPosition = window.scrollY + 140;

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

  // --- 7. Interactive Skills Filter ---
  const skillsFilter = document.getElementById('skills-filter');
  const skillCards = document.querySelectorAll('#skills-grid .skill-card');

  if (skillsFilter) {
    const filterButtons = skillsFilter.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        skillCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(8px)';
            setTimeout(() => {
              card.style.transition = 'all 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 8. Interactive Projects Filter ---
  const projectsFilter = document.getElementById('projects-filter');
  const projectCards = document.querySelectorAll('#projects-grid .project-card');

  if (projectsFilter) {
    const filterButtons = projectsFilter.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(8px)';
            setTimeout(() => {
              card.style.transition = 'all 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 9. Project Details Modal ---
  const projectModal = document.getElementById('project-modal');
  const projectModalBody = document.getElementById('project-modal-body');
  const projectModalClose = document.getElementById('project-modal-close');

  const projectDetailsData = {
    '1': {
      title: 'Algorithmic Foundations & Lab Solutions',
      category: 'Python &bull; Logic &amp; Foundations',
      status: 'In Progress (Semester 1 Lab)',
      description: 'A comprehensive academic repository implementing fundamental data structures, mathematical routines, recursion paradigms, and sorting algorithms in pure Python.',
      highlights: [
        'Implementation of sorting benchmarks (Merge, Quick, Insertion)',
        'Custom linked list and stack data structures',
        'Mathematical problem sets exploring algorithmic complexity & Big-O notation',
        'Built to adhere to clean code standards and test assertions'
      ],
      techStack: ['Python 3.12', 'Algorithms', 'Data Structures', 'Unit Testing'],
      links: [
        { label: 'View Academic Repository', url: 'https://github.com/vaishnavisoni03' }
      ]
    },
    '2': {
      title: 'Personal Portfolio Website (Dark Burgundy Edition)',
      category: 'Web Engineering &bull; UI/UX',
      status: 'Live &amp; Active',
      description: 'A high-performance, responsive personal website developed with pure semantic HTML5, Vanilla CSS3 tokens, and accessible JavaScript interactions with a dark burgundy palette.',
      highlights: [
        'Dark Burgundy and Rose Gold design system with frosted glassmorphism',
        'Custom interactive canvas particle system with mouse repulsion physics',
        'Full-screen responsive photography lightbox and project modal dialogs',
        '100% dependency-free vanilla code for ultra-fast load times'
      ],
      techStack: ['HTML5', 'CSS3 Variables', 'Vanilla JavaScript', 'Canvas API'],
      links: [
        { label: 'View Source on GitHub', url: 'https://github.com/vaishnavisoni03/Portfolio' }
      ]
    },
    '3': {
      title: 'Data Insights & Predictive ML Exploration',
      category: 'Machine Learning &bull; Data Science',
      status: 'Planned Exploratory Experiment',
      description: 'An introductory machine learning research project focused on statistical exploration of structured datasets, feature scaling, exploratory data analysis, and baseline classification models.',
      highlights: [
        'Exploratory Data Analysis (EDA) on public benchmark datasets',
        'Feature engineering, correlation analysis, and data normalization pipelines',
        'Baseline regression and classification models using scikit-learn',
        'Jupyter notebook documentation of findings and evaluation metrics'
      ],
      techStack: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib'],
      links: [
        { label: 'Project Roadmap on GitHub', url: 'https://github.com/vaishnavisoni03' }
      ]
    }
  };

  const openProjectModal = (projectId) => {
    const data = projectDetailsData[projectId];
    if (!data || !projectModal || !projectModalBody) return;

    projectModalBody.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <span class="status-tag" style="margin-bottom: 0.5rem;">${data.status}</span>
        <h2 style="font-size: 1.7rem; color: #fff2f6; margin-top: 0.35rem; font-family: var(--font-serif);">${data.title}</h2>
        <p style="color: var(--color-rose-gold); font-size: 0.9rem; font-weight: 700;">${data.category}</p>
      </div>
      <p style="color: var(--text-body); font-size: 1rem; line-height: 1.7; margin-bottom: 1.4rem;">${data.description}</p>
      
      <h4 style="font-size: 1.05rem; color: #fff2f6; margin-bottom: 0.65rem; font-family: var(--font-sans); font-weight: 700;">Key Technical Highlights:</h4>
      <ul style="color: var(--text-body); font-size: 0.94rem; margin-left: 1.25rem; line-height: 1.75; margin-bottom: 1.5rem;">
        ${data.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>

      <h4 style="font-size: 1.05rem; color: #fff2f6; margin-bottom: 0.65rem; font-family: var(--font-sans); font-weight: 700;">Technologies Used:</h4>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.8rem;">
        ${data.techStack.map(t => `<span class="skill-tag">${t}</span>`).join('')}
      </div>

      <div style="display: flex; gap: 0.85rem; flex-wrap: wrap;">
        ${data.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 0.88rem; padding: 0.6rem 1.25rem;">${l.label} &rarr;</a>`).join('')}
      </div>
    `;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-project-id');
      if (id) openProjectModal(id);
    });
  });

  if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  // --- 10. Photography Lightbox Modal ---
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxModalClose = document.getElementById('lightbox-modal-close');
  const photoCards = document.querySelectorAll('.photo-card');

  const openLightbox = (src, title, desc) => {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  photoCards.forEach((card) => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-lightbox-src');
      const title = card.getAttribute('data-lightbox-title');
      const desc = card.getAttribute('data-lightbox-desc');
      if (src) openLightbox(src, title, desc);
    });
  });

  if (lightboxModalClose) {
    lightboxModalClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard Escape to close any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeLightbox();
    }
  });

  // --- 11. Toast Notification System ---
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimer;

  const showToast = (message) => {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  };

  // --- 12. Copy Email to Clipboard ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailTextEl = document.getElementById('contact-email');

  if (copyEmailBtn && emailTextEl) {
    copyEmailBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const emailToCopy = emailTextEl.textContent.trim();

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback
          const tempInput = document.createElement('input');
          tempInput.value = emailToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied!';
        copyEmailBtn.style.background = 'var(--color-crimson)';
        copyEmailBtn.style.color = '#ffffff';

        showToast('Email address copied to clipboard!');

        setTimeout(() => {
          copyEmailBtn.textContent = originalText;
          copyEmailBtn.style.background = '';
          copyEmailBtn.style.color = '';
        }, 2200);
      } catch (err) {
        showToast('Could not copy email automatically.');
      }
    });
  }

  // --- 13. Interactive Contact Form Submission ---
  const contactForm = document.getElementById('contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');

      const name = nameInput ? nameInput.value.trim() : 'there';

      if (formSubmitBtn) {
        formSubmitBtn.disabled = true;
        formSubmitBtn.innerHTML = '<span>Sending...</span>';
      }

      // Simulate instantaneous responsive feedback
      setTimeout(() => {
        if (formSubmitBtn) {
          formSubmitBtn.disabled = false;
          formSubmitBtn.innerHTML = '<span>Message Sent!</span> <span aria-hidden="true">&#10003;</span>';
        }

        showToast(`Thank you, ${name}! Your message has been received.`);
        contactForm.reset();

        setTimeout(() => {
          if (formSubmitBtn) {
            formSubmitBtn.innerHTML = '<span>Send Message</span> <span aria-hidden="true">&rarr;</span>';
          }
        }, 3000);
      }, 600);
    });
  }

});
