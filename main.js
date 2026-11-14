(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');

  /* ------------------------------------------------------------------
     Chrome: header, progress, hero parallax
     ------------------------------------------------------------------ */
  const header = $('[data-header]');
  const progress = $('[data-scroll-progress]');
  const hero = $('#overview');
  const experience = $('[data-experience]');

  const updateScrollUI = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = max > 0 ? `${Math.min(100, (y / max) * 100)}%` : '0%';
    }
    if (hero && !reducedMotion.matches) {
      const shift = Math.min(y, 900);
      hero.style.setProperty('--hero-shift', `${(-shift * 0.02).toFixed(2)}px`);
      hero.style.setProperty('--hero-shift-phone', `${(shift * 0.025).toFixed(2)}px`);
    }
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI, { passive: true });

  /* ------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------ */
  const menuToggle = $('[data-menu-toggle]');
  const mobileMenu = $('[data-mobile-menu]');
  let menuOpen = false;
  let menuFocusTimer = 0;
  let menuReturnTimer = 0;
  let menuTrigger = null;
  const menuFocusable = () => mobileMenu ? $$('a[href], button:not([disabled])', mobileMenu) : [];

  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    menuOpen = open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    window.clearTimeout(menuFocusTimer);
    window.clearTimeout(menuReturnTimer);
    if (!open) {
      if (mobileMenu.contains(document.activeElement)) document.activeElement.blur();
      if (menuTrigger) {
        menuReturnTimer = window.setTimeout(() => menuTrigger.focus({ preventScroll: true }), 0);
      }
    }
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    if (open) {
      menuTrigger = menuToggle;
      menuFocusTimer = window.setTimeout(() => {
        if (menuOpen) mobileMenu.focus({ preventScroll: true });
      }, 220);
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => setMenu(!menuOpen));
    $$('a', mobileMenu).forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => {
      if (!menuOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenu(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = menuFocusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === mobileMenu)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980 && menuOpen) setMenu(false);
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     Section state: nav + chapter rail
     ------------------------------------------------------------------ */
  const navLinks = $$('[data-nav] a');
  const chapterLinks = $$('[data-chapter]');
  const chapterIds = chapterLinks.map((link) => link.getAttribute('href').slice(1));
  const watchedIds = [...new Set([...chapterIds, 'overview', 'features', 'experience', 'development'])];

  const navSectionMap = {
    overview: 'overview',
    features: 'features',
    experience: 'experience',
    beyond: 'experience',
    control: 'experience',
    visual: 'experience',
    development: 'development',
    download: 'development',
  };

  const setNavActive = (id) => {
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  const setChapterActive = (id) => {
    chapterLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setChapterActive(entry.target.id);
        const navId = navSectionMap[entry.target.id];
        if (navId) setNavActive(navId);
      });
    }, { rootMargin: '-36% 0px -56% 0px', threshold: 0 });
    watchedIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------ */
  const revealItems = $$('.reveal');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    revealItems.forEach((item) => {
      const group = item.parentElement;
      const siblings = group ? $$(':scope > .reveal', group) : [];
      const index = siblings.indexOf(item);
      if (siblings.length > 1 && index > 0) {
        item.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 60}ms`);
      }
    });
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* ------------------------------------------------------------------
     Hero pointer tilt
     ------------------------------------------------------------------ */
  const tilt = $('[data-tilt]');
  if (tilt && finePointer.matches && !reducedMotion.matches) {
    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const apply = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      tilt.style.transform = `perspective(1400px) rotateX(${currentY.toFixed(3)}deg) rotateY(${currentX.toFixed(3)}deg)`;
      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        raf = requestAnimationFrame(apply);
      } else {
        raf = 0;
      }
    };
    tilt.addEventListener('pointermove', (event) => {
      const rect = tilt.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = px * 3.2;
      targetY = -py * 2.2;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    const reset = () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    tilt.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
  }

  /* ------------------------------------------------------------------
     Experience: sticky visual switches with the active chapter
     ------------------------------------------------------------------ */
  if (experience) {
    const steps = $$('[data-exp-step]', experience);
    let currentExperienceIndex = -1;
    const shots = $$('[data-exp-shot]', experience);
    const kicker = $('[data-exp-kicker]', experience);
    const labels = ['THE SHELL / 01', 'THE LIBRARY / 02', 'THEMES / 03'];

    const activateStep = (index) => {
      steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
      shots.forEach((shot, i) => shot.classList.toggle('is-active', i === index));
      if (kicker && labels[index]) kicker.textContent = labels[index];
    };

    const updateExperience = () => {
      const viewport = window.innerHeight;
      const focusLine = viewport * 0.42;
      let bestIndex = -1;
      let bestDistance = Infinity;
      steps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewport) return;
        const distance = Math.abs((rect.top + rect.height / 2) - focusLine);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });
      if (bestIndex >= 0 && bestIndex !== currentExperienceIndex) {
        currentExperienceIndex = bestIndex;
        activateStep(bestIndex);
      }
    };
    window.addEventListener('scroll', updateExperience, { passive: true });
    window.addEventListener('resize', updateExperience, { passive: true });
    updateExperience();
  }

  /* ------------------------------------------------------------------
     Touchpad demo
     ------------------------------------------------------------------ */
  const touchpad = $('[data-touchpad]');
  const touchSurface = touchpad ? $('.touchpad-surface', touchpad) : null;
  const touchCursor = touchpad ? $('[data-touch-cursor]', touchpad) : null;
  if (touchpad && touchSurface && touchCursor) {
    const moveCursor = (event) => {
      const rect = touchSurface.getBoundingClientRect();
      const x = Math.max(6, Math.min(94, ((event.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(6, Math.min(94, ((event.clientY - rect.top) / rect.height) * 100));
      touchCursor.style.left = `${x}%`;
      touchCursor.style.top = `${y}%`;
    };
    touchSurface.addEventListener('pointermove', moveCursor, { passive: true });
    touchSurface.addEventListener('pointerdown', (event) => {
      touchpad.classList.add('is-dragging');
      moveCursor(event);
      if (typeof touchSurface.setPointerCapture === 'function') {
        try { touchSurface.setPointerCapture(event.pointerId); } catch (error) { /* optional */ }
      }
    });
    const release = () => touchpad.classList.remove('is-dragging');
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('pointercancel', release, { passive: true });
    touchSurface.addEventListener('click', () => {
      touchpad.classList.remove('is-tap');
      void touchpad.offsetWidth;
      touchpad.classList.add('is-tap');
      window.setTimeout(() => touchpad.classList.remove('is-tap'), 320);
    });
  }

  /* ------------------------------------------------------------------
     Material demo
     ------------------------------------------------------------------ */
  const glassScene = $('[data-glass]');
  const glassPanel = glassScene ? $('.glass-panel', glassScene) : null;
  if (glassScene && glassPanel && finePointer.matches) {
    glassScene.addEventListener('pointermove', (event) => {
      const rect = glassPanel.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
      glassPanel.style.setProperty('--mx', `${x}%`);
      glassPanel.style.setProperty('--my', `${y}%`);
    }, { passive: true });
    glassScene.addEventListener('pointerleave', () => {
      glassPanel.style.removeProperty('--mx');
      glassPanel.style.removeProperty('--my');
    });
  }
  const transparencyToggle = $('[data-reduce-transparency]');
  if (transparencyToggle) {
    const demo = transparencyToggle.closest('.material-demo');
    const note = demo ? $('.material-control-note', demo) : null;
    transparencyToggle.addEventListener('change', () => {
      if (demo) demo.classList.toggle('is-solid', transparencyToggle.checked);
      if (note) note.textContent = transparencyToggle.checked ? 'fallback / active' : 'fallback / solid';
    });
  }

  /* ------------------------------------------------------------------
     Dialogs + lightbox
     ------------------------------------------------------------------ */
  const filmDialog = $('#film-dialog');
  const privacyDialog = $('#privacy-dialog');
  const filmVideo = $('#film-video');

  function openDialog(dialog) {
    if (!dialog || typeof dialog.showModal !== 'function' || dialog.open) return;
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }

  function closeDialog(dialog) {
    if (!dialog || !dialog.open) return;
    if (dialog === filmDialog && filmVideo) {
      filmVideo.pause();
      try { filmVideo.currentTime = 0; } catch (error) { /* metadata may not be ready */ }
    }
    dialog.close();
    document.body.classList.remove('dialog-open');
  }

  $$('[data-open-film]').forEach((button) => button.addEventListener('click', () => openDialog(filmDialog)));
  $$('[data-open-privacy]').forEach((button) => button.addEventListener('click', () => openDialog(privacyDialog)));
  $$('dialog').forEach((dialog) => {
    $$('[data-close-dialog]', dialog).forEach((button) => button.addEventListener('click', () => closeDialog(dialog)));
    dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(dialog); });
    dialog.addEventListener('close', () => {
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
    });
  });
  if (filmDialog) {
    filmDialog.addEventListener('cancel', () => {
      if (filmVideo) {
        filmVideo.pause();
        try { filmVideo.currentTime = 0; } catch (error) { /* metadata may not be ready */ }
      }
      document.body.classList.remove('dialog-open');
    });
  }


  /* ------------------------------------------------------------------
     SHA-256 copy
     ------------------------------------------------------------------ */
  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  };

  $$('[data-copy-hash]').forEach((button) => {
    button.addEventListener('click', async () => {
      const holder = button.closest('.spec-row-hash, .hash-box');
      const code = holder ? $('[data-hash]', holder) : null;
      if (!code) return;
      const label = $('span', button);
      try {
        await copyText(code.textContent.trim());
        button.classList.add('is-copied');
        button.setAttribute('aria-label', '已复制 SHA-256');
        if (label) label.textContent = '已复制';
        window.setTimeout(() => {
          button.classList.remove('is-copied');
          button.setAttribute('aria-label', '复制 SHA-256');
          if (label) label.textContent = '复制';
        }, 1600);
      } catch (error) {
        if (label) label.textContent = '复制失败';
        window.setTimeout(() => { if (label) label.textContent = '复制'; }, 1600);
      }
    });
  });
})();
