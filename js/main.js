/* ==========================================================================
   GLANZ — main.js
   Shared behaviour for the homepage and the services page:
   central contact config, navigation, scroll reveal, image fallbacks and the
   (front-end only) appointment form.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. SITE CONFIG — edit these values in one place
   -------------------------------------------------------------------------- */
const GLANZ_CONFIG = {
  phone:      '+918320636243',
  phoneLabel: '+91 83206 36243',
  whatsapp:   '918320636243',
  whatsappMessage: 'Hello GLANZ, I would like to book a consultation.',
  email:      'glanzbydrsakshi@gmail.com',
  instagram:  'https://www.instagram.com/glanz_skin.hair.homeo/',
  website:    'https://www.glanzhealth.com/',
  address:    '312/A, The Crown, opp. Kalhar Bungalows, Nr. Gangotri Circle, Nikol, Ahmedabad',

  // TODO: replace with the clinic's exact Google Maps / Google Business Profile link.
  // A search URL is used until then so directions always resolve to the right area.
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' +
           encodeURIComponent('GLANZ Skin Hair Homoeopathy, The Crown, Nikol, Ahmedabad'),

  // TODO: replace with a real booking destination (booking platform, form endpoint
  // or a WhatsApp link). Until then the button scrolls to the contact section.
  bookingUrl: '#contact'
};

/* Convenience: build the WhatsApp deep link once. */
GLANZ_CONFIG.whatsappUrl =
  'https://wa.me/' + GLANZ_CONFIG.whatsapp +
  '?text=' + encodeURIComponent(GLANZ_CONFIG.whatsappMessage);

/* --------------------------------------------------------------------------
   2. Apply config to any element carrying data-glanz="..."
   -------------------------------------------------------------------------- */
function applyConfig(root) {
  const scope = root || document;

  scope.querySelectorAll('[data-glanz]').forEach((el) => {
    const key = el.dataset.glanz;

    switch (key) {
      case 'book': {
        // While bookingUrl is an in-page anchor, pages without that anchor
        // (e.g. /service/, /scan/) fall back to data-fallback instead.
        const isAnchor = GLANZ_CONFIG.bookingUrl.startsWith('#');
        const anchorExists = isAnchor && document.querySelector(GLANZ_CONFIG.bookingUrl);
        el.setAttribute('href', (!isAnchor || anchorExists)
          ? GLANZ_CONFIG.bookingUrl
          : (el.dataset.fallback || GLANZ_CONFIG.website + '#contact'));
        break;
      }
      case 'maps':
        el.setAttribute('href', GLANZ_CONFIG.mapsUrl);
        break;
      case 'phone':
        el.setAttribute('href', 'tel:' + GLANZ_CONFIG.phone);
        break;
      case 'whatsapp':
        el.setAttribute('href', GLANZ_CONFIG.whatsappUrl);
        break;
      case 'email':
        el.setAttribute('href', 'mailto:' + GLANZ_CONFIG.email);
        break;
      case 'instagram':
        el.setAttribute('href', GLANZ_CONFIG.instagram);
        break;
      case 'year':
        el.textContent = new Date().getFullYear();
        break;
      default:
        break;
    }
  });
}

/* --------------------------------------------------------------------------
   3. Navigation — sticky state, mobile drawer, active link
   -------------------------------------------------------------------------- */
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('navDrawer');

  /* Sticky / translucent navbar */
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (!toggle || !drawer) return;

  /* The drawer starts hidden for no-JS visitors; CSS handles it from here. */
  drawer.hidden = false;

  const setOpen = (open) => {
    drawer.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('is-locked', open);

    /* Stagger the drawer links in */
    drawer.querySelectorAll('.nav__drawer-list a').forEach((link, i) => {
      link.style.transitionDelay = open ? `${0.12 + i * 0.06}s` : '0s';
    });
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 940) setOpen(false);
  });
}

/* Highlights the nav link matching the section currently in view (homepage). */
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav__menu--desktop .nav__link[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   4. Scroll reveal
   -------------------------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      /* A short stagger keeps grouped elements from arriving all at once. */
      entry.target.style.transitionDelay = `${Math.min(i * 0.09, 0.36)}s`;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

  items.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. Image fallback — a missing file must never break the layout
   -------------------------------------------------------------------------- */
function initImageFallback() {
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.classList.add('img-missing');           /* frame keeps its blush gradient */
      img.setAttribute('aria-hidden', 'true');
    });
  });
}

/* --------------------------------------------------------------------------
   6. Appointment form — validates, then submits to Web3Forms
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  const submitLabel = submitBtn ? submitBtn.querySelector('.btn__label') : null;
  if (!form) return;

  const setError = (field, message) => {
    const wrap = field.closest('.field');
    const slot = form.querySelector(`[data-error-for="${field.id}"]`);
    wrap.classList.toggle('has-error', Boolean(message));
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (slot) slot.textContent = message || '';
  };

  const validators = {
    'cf-name':    (v) => (v.trim().length >= 2 ? '' : 'Please enter your name.'),
    'cf-phone':   (v) => (/^[+\d][\d\s-]{7,17}$/.test(v.trim()) ? '' : 'Please enter a valid phone number.'),
    'cf-email':   (v) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'),
    'cf-service': (v) => (v ? '' : 'Please choose a service.')
  };

  const validateField = (field) => {
    const check = validators[field.id];
    if (!check) return true;
    const message = check(field.value);
    setError(field, message);
    return !message;
  };

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.field').classList.contains('has-error')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let firstInvalid = null;
    form.querySelectorAll('input, select, textarea').forEach((field) => {
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      if (status) {
        status.textContent = 'Please review the highlighted fields and try again.';
        status.classList.add('is-visible');
      }
      return;
    }

    /* Web3Forms — access_key/subject/from_name/botcheck are hidden fields
       already sitting in the form markup (index.html), so FormData picks
       them up alongside the visible fields automatically. */
    if (submitBtn) {
      submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = 'Sending…';
    }

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message || 'Submission failed');

        /* Success sends the visitor to /thank-you/, which auto-redirects back
           to the homepage after 5s (see thank-you/index.html). */
        form.reset();
        window.location.href = (window.location.protocol === 'file:')
          ? 'thank-you/index.html'
          : 'thank-you/';
      })
      .catch(() => {
        if (status) {
          status.innerHTML =
            '<strong>Something went wrong sending your request.</strong><br>' +
            'Please try again, or call <a href="tel:' + GLANZ_CONFIG.phone + '">' + GLANZ_CONFIG.phoneLabel + '</a> or ' +
            '<a href="' + GLANZ_CONFIG.whatsappUrl + '" target="_blank" rel="noopener">message us on WhatsApp</a> instead.';
          status.classList.add('is-error', 'is-visible');
          status.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitLabel) submitLabel.textContent = 'Send Request';
        }
      });
  });
}

/* --------------------------------------------------------------------------
   Folder links when the site is opened straight from disk (file://)
   VS Code "Go Live" / any web server resolves /service/ on its own; a raw
   double-clicked file does not, so rewrite those links to /index.html.
   -------------------------------------------------------------------------- */
function initFileProtocolLinks() {
  if (window.location.protocol !== 'file:') return;
  document.querySelectorAll('a[href$="/"]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && !/^https?:/i.test(href)) a.setAttribute('href', href + 'index.html');
  });
}

/* --------------------------------------------------------------------------
   8. Boot
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  initFileProtocolLinks();
  initNav();
  initScrollSpy();
  initReveal();
  initImageFallback();
  initContactForm();
});
