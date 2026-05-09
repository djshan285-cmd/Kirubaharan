/* ============================================================
   SHAN PORTFOLIO — JavaScript
   Cursor | Loader | Navbar | Typing | Particles | Animations
   ============================================================ */

'use strict';

// ---- UTILS ----
const qs  = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

// ============================================================
// 1. PAGE LOADER
// ============================================================
window.addEventListener('load', () => {
  const loader = qs('#loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    initAnimations();
  }, 1800);
});
document.body.style.overflow = 'hidden';

// ============================================================
// 2. CUSTOM CURSOR
// ============================================================
(function initCursor() {
  const cursor   = qs('#cursor');
  const follower = qs('#cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Scale on interactive elements
  const interactives = 'a, button, .project-card, .tool-card, .social-link, input, textarea';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      follower.style.transform = 'translate(-50%, -50%) scale(0.5)';
      follower.style.opacity = '0.5';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.opacity = '1';
    }
  });
})();

// ============================================================
// 3. NAVBAR
// ============================================================
(function initNavbar() {
  const navbar    = qs('#navbar');
  const hamburger = qs('#hamburger');
  const navLinks  = qs('#navLinks');
  const links     = qsa('.nav-link');

  // Scroll class
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightNavLink();
    toggleScrollTop();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navLinks?.classList.remove('open');
    });
  });

  // Active link on scroll
  function highlightNavLink() {
    const sections = qsa('section[id]');
    const scrollY  = window.scrollY + 140;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = qs(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }
})();

// ============================================================
// 4. THEME TOGGLE
// ============================================================
(function initTheme() {
  const btn  = qs('#themeToggle');
  const icon = qs('#themeIcon');
  const html = document.documentElement;

  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateIcon(saved);

  btn?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
})();

// ============================================================
// 5. TYPING ANIMATION
// ============================================================
(function initTyping() {
  const el = qs('#typingText');
  if (!el) return;

  const phrases = [
    'Fleet Operations Incharge',
    'Transport & Logistics Incharge',
    'Fuel & Fleet Operations Expert',
    'GPS Fleet Tracking Specialist',
    'Logistics Operations Manager',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function type() {
    if (paused) return;
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; }, 2200);
      }
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    setTimeout(type, deleting ? 60 : 100);
  }
  setTimeout(type, 1200);
})();

// ============================================================
// 6. PARTICLE SYSTEM
// ============================================================
(function initParticles() {
  const container = qs('#particles');
  if (!container) return;

  const COUNT = 30;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.7 + 0.3};
    `;
    container.appendChild(p);
  }
})();

// ============================================================
// 7. SCROLL REVEAL
// ============================================================
function initAnimations() {
  const elements = qsa('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
          // Trigger skill bars if inside skills section
          const fills = qsa('.skill-fill', entry.target);
          fills.forEach(fill => animateSkillBar(fill));
          // Trigger counters if inside hero
          const counters = qsa('[data-count]', entry.target);
          counters.forEach(counter => animateCounter(counter));
        }, +delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  // Stagger siblings with data-reveal
  const groups = {};
  elements.forEach(el => {
    const parent = el.parentElement;
    const key    = parent ? parent.className : 'root';
    groups[key]  = groups[key] || [];
    groups[key].push(el);
  });

  Object.values(groups).forEach(group => {
    group.forEach((el, i) => {
      if (group.length > 1) el.dataset.delay = i * 120;
    });
  });

  elements.forEach(el => observer.observe(el));
}

// ============================================================
// 8. SKILL BAR ANIMATION (triggered on scroll reveal)
// ============================================================
function animateSkillBar(fill) {
  const target = parseInt(fill.dataset.width) || 0;
  fill.style.width = target + '%';
}

// Also trigger bars when skills section appears
(function initSkillsObserver() {
  const skillsSection = qs('#skills');
  if (!skillsSection) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      qsa('.skill-fill').forEach(fill => animateSkillBar(fill));
      observer.disconnect();
    }
  }, { threshold: 0.2 });
  observer.observe(skillsSection);
})();

// ============================================================
// 9. COUNTER ANIMATION
// ============================================================
function animateCounter(el) {
  const target   = parseInt(el.dataset.count) || 0;
  const duration = 2000;
  const step     = 30;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

// Also trigger on hero reveal
(function initHeroCounters() {
  const heroSection = qs('#hero');
  if (!heroSection) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      qsa('[data-count]').forEach(el => animateCounter(el));
      observer.disconnect();
    }
  }, { threshold: 0.4 });
  observer.observe(heroSection);
})();

// ============================================================
// 10. PROJECTS FILTER
// ============================================================
(function initFilter() {
  const filterBtns = qsa('.filter-btn');
  const cards      = qsa('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const category = card.dataset.category;
        const show     = filter === 'all' || category === filter;

        card.style.transition = `opacity 0.3s ${i * 50}ms, transform 0.3s ${i * 50}ms`;

        if (show) {
          card.classList.remove('hidden');
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => card.classList.add('hidden'), 300 + i * 50);
        }
      });
    });
  });
})();

// ============================================================
// 11. ABOUT READ MORE
// ============================================================
(function initReadMore() {
  const btn   = qs('#readMoreBtn');
  const extra = qs('#aboutExtra');
  if (!btn || !extra) return;

  btn.addEventListener('click', () => {
    const expanded = btn.classList.toggle('expanded');
    extra.style.display = expanded ? 'block' : 'none';
    btn.querySelector('span').textContent = expanded ? 'Read Less' : 'Read More';
  });
})();

// ============================================================
// 12. CONTACT FORM VALIDATION
// ============================================================
(function initContactForm() {
  const form      = qs('#contactForm');
  const submitBtn = qs('#submitBtn');
  const success   = qs('#formSuccess');
  if (!form) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(id, msg) {
    const el = qs(`#${id}`);
    if (el) el.textContent = msg;
  }

  function clearErrors() {
    qsa('.form-error').forEach(el => el.textContent = '');
    qsa('.input-wrap input, .input-wrap textarea').forEach(el => el.style.borderColor = '');
  }

  function markInvalid(inputId) {
    const input = qs(`#${inputId}`);
    if (input) input.style.borderColor = '#ef4444';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name    = qs('#name').value.trim();
    const email   = qs('#email').value.trim();
    const message = qs('#message').value.trim();

    let valid = true;

    if (name.length < 2) {
      setError('nameError', 'Please enter your name (at least 2 characters).');
      markInvalid('name');
      valid = false;
    }
    if (!validateEmail(email)) {
      setError('emailError', 'Please enter a valid email address.');
      markInvalid('email');
      valid = false;
    }
    if (message.length < 10) {
      setError('messageError', 'Message must be at least 10 characters.');
      markInvalid('message');
      valid = false;
    }

    if (!valid) return;

    // Send to Firestore
    const btnText   = submitBtn.querySelector('.btn-text');
    const btnIcon   = submitBtn.querySelector('.btn-icon');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    submitBtn.disabled = true;
    btnText.textContent = 'Sending…';
    btnIcon.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    const subject = qs('#subject')?.value.trim() || '(No subject)';

    try {
      // 1. Save to Firestore
      await window.db.collection('messages').add({
        name,
        email,
        subject,
        message,
        sentAt: new Date().toISOString()
      });

      // 2. Send email via EmailJS
      // Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID with values from emailjs.com
      await emailjs.send('service_b87m9s4', 'YOUR_TEMPLATE_ID', {
        from_name:  name,
        from_email: email,
        subject:    subject,
        message:    message,
        reply_to:   email,
      });
    } catch (err) {
      console.error('Send error:', err);
      setError('messageError', 'Failed to send. Please try again.');
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
      btnIcon.style.display = '';
      btnLoader.style.display = 'none';
      return;
    }

    submitBtn.disabled = false;
    btnText.textContent = 'Send Message';
    btnIcon.style.display = '';
    btnLoader.style.display = 'none';

    form.reset();
    success.style.display = 'flex';
    setTimeout(() => (success.style.display = 'none'), 5000);
  });

  // Live validation
  qsa('#name, #email, #message').forEach(input => {
    input.addEventListener('input', () => {
      input.style.borderColor = '';
      const errorId = input.id + 'Error';
      setError(errorId, '');
    });
  });
})();

// ============================================================
// 13. SCROLL TO TOP + PROGRESS RING
// ============================================================
function toggleScrollTop() {
  const btn  = qs('#scrollTop');
  const ring = qs('#progressRingFill');
  if (!btn) return;

  btn.classList.toggle('visible', window.scrollY > 400);

  if (ring) {
    const scrollable   = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled     = scrollable > 0 ? window.scrollY / scrollable : 0;
    const circumference = 113.1;
    ring.style.strokeDashoffset = (circumference * (1 - scrolled)).toFixed(2);
  }
}

qs('#scrollTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 14. SMOOTH ANCHOR SCROLL (for older browsers)
// ============================================================
qsa('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = qs(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ============================================================
// 15. TILT EFFECT ON PROJECT CARDS
// ============================================================
(function initTilt() {
  const cards = qsa('.project-card, .timeline-card');
  if (window.matchMedia('(max-width: 768px)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const tiltX  = -(y / rect.height) * 6;
      const tiltY  =  (x / rect.width)  * 6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ============================================================
// 16. GLOWING BORDER FOLLOW ON GLASS CARDS
// ============================================================
(function initGlowFollow() {
  const glassCards = qsa('.glass-card');
  if (window.matchMedia('(max-width: 768px)').matches) return;

  glassCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(139,92,246,0.08) 0%, var(--glass) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

// ============================================================
// 17. ACTIVE NAV HIGHLIGHT (initial)
// ============================================================
window.dispatchEvent(new Event('scroll'));

// ============================================================
// 18. FLEET DASHBOARD — CHART BAR ANIMATION
// ============================================================
(function initFleetChart() {
  const section = qs('#dashboard');
  if (!section) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const chartArea = qs('.chart-area', section);
      const areaH = chartArea ? chartArea.clientHeight : 180;
      qsa('.chart-bar', section).forEach((bar, i) => {
        const pct = parseInt(bar.dataset.height) || 0;
        setTimeout(() => {
          bar.style.height = Math.round(pct / 100 * areaH) + 'px';
        }, i * 80);
      });
      observer.disconnect();
    }
  }, { threshold: 0.25 });

  observer.observe(section);
})();
