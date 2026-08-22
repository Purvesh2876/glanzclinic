/* ==========================================================================
   GLANZ — service.js
   Behaviour specific to /service/: expandable treatment details and the
   sticky category navigation.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Accordions — one open item per group
   -------------------------------------------------------------------------- */
function initAccordions() {
  const groups = document.querySelectorAll('[data-acc]');
  if (!groups.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  groups.forEach((group, groupIndex) => {
    const items = Array.from(group.querySelectorAll('.acc__item'));

    items.forEach((item, index) => {
      const btn = item.querySelector('.acc__btn');
      const panel = item.querySelector('.acc__panel');
      if (!btn || !panel) return;

      /* Wire up the ARIA relationship between trigger and panel */
      const id = `acc-${groupIndex + 1}-${index + 1}`;
      panel.id = id;
      panel.setAttribute('role', 'region');
      btn.setAttribute('aria-controls', id);
      if (!btn.id) btn.id = `${id}-btn`;
      panel.setAttribute('aria-labelledby', btn.id);

      const close = () => {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.height = reduced ? '0px' : `${panel.scrollHeight}px`;
        requestAnimationFrame(() => { panel.style.height = '0px'; });
      };

      const open = () => {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        const inner = panel.firstElementChild;
        panel.style.height = `${inner.offsetHeight}px`;
        /* Release the fixed height once the transition finishes so the panel
           can reflow freely (e.g. on rotate or text resize). */
        const onEnd = (e) => {
          if (e.propertyName !== 'height') return;
          if (item.classList.contains('is-open')) panel.style.height = 'auto';
          panel.removeEventListener('transitionend', onEnd);
        };
        panel.addEventListener('transitionend', onEnd);
      };

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        /* Collapse siblings for a calmer, more readable page */
        items.forEach((other) => {
          if (other !== item && other.classList.contains('is-open')) {
            const otherPanel = other.querySelector('.acc__panel');
            otherPanel.style.height = `${otherPanel.scrollHeight}px`;
            requestAnimationFrame(() => { otherPanel.style.height = '0px'; });
            other.classList.remove('is-open');
            other.querySelector('.acc__btn').setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) close(); else open();
      });
    });
  });

  /* Keep an open panel correctly sized after a resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll('.acc__item.is-open .acc__panel').forEach((panel) => {
        panel.style.height = 'auto';
      });
    }, 150);
  });
}

/* --------------------------------------------------------------------------
   2. Category navigation — active state follows the section in view
   -------------------------------------------------------------------------- */
function initCategoryNav() {
  const links = Array.from(document.querySelectorAll('.catnav__link'));
  if (!links.length) return;

  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    /* Pick the entry closest to the top of the viewport */
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (visible) setActive(visible.target.id);
  }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   3. Boot
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initAccordions();
  initCategoryNav();
});
