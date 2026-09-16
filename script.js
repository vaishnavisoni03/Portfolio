// ==========================================================================
// Vaishnavi Soni - Personal Portfolio Interactions
// Vanilla JavaScript: Canvas Particles, Reading Progress, Roadmap Switcher,
// Filter Bars, Modals (Projects, Certifications, Full-Screen Resume),
// Lightbox, Print Handler, Clipboard Copy & Toast Notifications
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
        const colors = ['212, 43, 93', '245, 202, 169', '158, 28, 62', '255, 214, 227'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

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

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

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

      requestAnimationFrame(animate);
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

    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPercent * 100}%`;
    }

    if (progressCircle) {
      const offset = circumference - (scrollPercent * circumference);
      progressCircle.style.strokeDashoffset = offset;
    }

    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

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

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

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
    }, { threshold: 0.08 });

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

  // --- 7. 4-Year Roadmap Year Switcher ---
  const roadmapNav = document.getElementById('roadmap-nav');
  if (roadmapNav) {
    const tabBtns = roadmapNav.querySelectorAll('.roadmap-tab-btn');
    const panels = document.querySelectorAll('.roadmap-year-panel');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const year = btn.getAttribute('data-year');
        panels.forEach((panel) => {
          if (panel.id === `roadmap-year-${year}`) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  // --- 8. Interactive Skills Filter ---
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

  // --- 9. Interactive Projects Filter & Modal ---
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

  // --- 10. Certifications Verification Modal ---
  const certModal = document.getElementById('cert-modal');
  const certModalBody = document.getElementById('cert-modal-body');
  const certModalClose = document.getElementById('cert-modal-close');

  const certDetailsData = {
    '1': {
      title: 'Python for Data Science & Machine Learning Bootcamp',
      issuer: 'DeepLearning.AI &bull; Coursera',
      issuedDate: 'January 2026',
      credentialId: 'DL-PY-2026-9812',
      grade: '98.5% with Academic Honors',
      summary: 'Comprehensive curriculum covering vectorization, multidimensional numerical computing with NumPy, data transformation pipelines with Pandas, and exploratory visualization with Matplotlib & Seaborn.',
      topics: [
        'Advanced vector and matrix operations with NumPy',
        'Data cleaning, missing value handling, and grouping in Pandas',
        'Feature scaling, normalization, and train/test evaluation split',
        'Capstone project analyzing multi-variable real estate and census datasets'
      ]
    },
    '2': {
      title: 'CS50: Introduction to Computer Science',
      issuer: 'Harvard University &bull; edX',
      issuedDate: 'December 2025',
      credentialId: 'CS50-VS-2025-4102',
      grade: 'Certificate of Satisfactory Completion',
      summary: 'Rigorous introduction to the intellectual enterprises of computer science and the art of programming. Topics include algorithmic thinking, data structures, memory management in C, and software engineering principles.',
      topics: [
        'Manual memory management, pointers, and memory leaks with Valgrind',
        'Implementation of linked lists, hash tables, binary search trees, and tries',
        'Asymptotic runtime analysis (Big-O, Big-Omega, Big-Theta)',
        'Full software problem set solutions in C, Python, and SQL'
      ]
    },
    '3': {
      title: 'Foundations of AI & Machine Learning Concepts',
      issuer: 'IBM &bull; Google Professional Certificate',
      issuedDate: 'February 2026',
      credentialId: 'IBM-AI-2026-6734',
      grade: 'Professional Credential Verified',
      summary: 'Deep dive into machine learning workflows, linear regression, logistic classification, decision trees, bias-variance tradeoff, neural network terminology, and trustworthy AI frameworks.',
      topics: [
        'Supervised, unsupervised, and reinforcement learning paradigms',
        'Loss function optimization and gradient descent fundamentals',
        'Evaluation metrics: Precision, Recall, F1-score, ROC-AUC',
        'Ethical implications, data bias mitigation, and algorithmic accountability'
      ]
    },
    '4': {
      title: 'Responsive Web Design & Semantic UI Engineering',
      issuer: 'Meta &bull; FreeCodeCamp',
      issuedDate: 'November 2025',
      credentialId: 'META-WD-2025-8821',
      grade: '300-Hour Developer Certification',
      summary: 'Modern front-end architecture, semantic HTML5 structure, CSS3 Flexbox & Grid layouts, accessibility standards (WCAG 2.1 AA), and cross-browser responsive design.',
      topics: [
        'Mobile-first responsive layouts and media query architecture',
        'CSS custom properties (design tokens) and dark/light themes',
        'Accessible DOM navigation, ARIA landmarks, and focus management',
        'Completion of 5 certified production-grade web application layouts'
      ]
    }
  };

  const openCertModal = (certId) => {
    const data = certDetailsData[certId];
    if (!data || !certModal || !certModalBody) return;

    certModalBody.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <span class="cert-verified-pill" style="margin-bottom: 0.5rem; display: inline-block;">&#10003; Verified Micro-Credential</span>
        <h2 style="font-size: 1.6rem; color: #fff2f6; margin-top: 0.4rem; font-family: var(--font-serif);">${data.title}</h2>
        <p style="color: var(--color-rose-gold); font-size: 0.95rem; font-weight: 700; margin-top: 0.25rem;">${data.issuer}</p>
      </div>

      <div style="background: rgba(15, 5, 11, 0.7); border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 0.85rem 1.1rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; font-size: 0.86rem;">
        <span><strong>Issued:</strong> ${data.issuedDate}</span>
        <span><strong>Status:</strong> ${data.grade}</span>
        <span style="font-family: monospace; color: var(--color-rose-gold);"><strong>Credential ID:</strong> ${data.credentialId}</span>
      </div>

      <p style="color: var(--text-body); font-size: 0.98rem; line-height: 1.7; margin-bottom: 1.2rem;">${data.summary}</p>
      
      <h4 style="font-size: 1.05rem; color: #fff2f6; margin-bottom: 0.65rem; font-family: var(--font-sans); font-weight: 700;">Core Curricular Competencies:</h4>
      <ul style="color: var(--text-body); font-size: 0.92rem; margin-left: 1.25rem; line-height: 1.75; margin-bottom: 1.6rem;">
        ${data.topics.map(t => `<li>${t}</li>`).join('')}
      </ul>

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid var(--border-light);">
        <span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">Cryptographically authentic credential record</span>
        <button type="button" class="btn btn-primary btn-sm" onclick="navigator.clipboard.writeText('${data.credentialId}'); alert('Credential ID ${data.credentialId} copied!');">
          Copy Credential ID
        </button>
      </div>
    `;

    certModal.classList.add('active');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeCertModal = () => {
    if (!certModal) return;
    certModal.classList.remove('active');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const id = card.getAttribute('data-cert-id');
      if (id) openCertModal(id);
    });
  });

  const certVerifyBtns = document.querySelectorAll('.cert-verify-btn');
  certVerifyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-cert-id');
      if (id) openCertModal(id);
    });
  });

  if (certModalClose) {
    certModalClose.addEventListener('click', closeCertModal);
  }

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });
  }

  // --- 11. Full-Screen Resume Modal & Print Handling ---
  const resumePrintBtn = document.getElementById('resume-print-btn');
  const resumeFullscreenBtn = document.getElementById('resume-fullscreen-btn');
  const resumeModal = document.getElementById('resume-modal');
  const resumeModalBody = document.getElementById('resume-modal-body');
  const resumeModalClose = document.getElementById('resume-modal-close');
  const resumeDocument = document.getElementById('resume-document');

  if (resumePrintBtn) {
    resumePrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const openResumeModal = () => {
    if (!resumeModal || !resumeModalBody || !resumeDocument) return;
    resumeModalBody.innerHTML = resumeDocument.innerHTML;
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeResumeModal = () => {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (resumeFullscreenBtn) {
    resumeFullscreenBtn.addEventListener('click', openResumeModal);
  }

  if (resumeModalClose) {
    resumeModalClose.addEventListener('click', closeResumeModal);
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModal();
    });
  }

  // --- 12. Photography Lightbox Modal ---
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
      closeCertModal();
      closeResumeModal();
      closeLightbox();
    }
  });

  // --- 13. Toast Notification System ---
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

  // --- 14. Copy Email to Clipboard ---
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

  // --- 15. Interactive Contact Form Submission ---
  const contactForm = document.getElementById('contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const name = nameInput ? nameInput.value.trim() : 'there';

      if (formSubmitBtn) {
        formSubmitBtn.disabled = true;
        formSubmitBtn.innerHTML = '<span>Sending...</span>';
      }

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
