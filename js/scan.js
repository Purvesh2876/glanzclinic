/* ==========================================================================
   GLANZ — scan.js
   Powers /scan/ — the digital visiting card opened by the QR code printed on
   the physical card (https://www.glanzhealth.com/scan/).

   >>> EVERYTHING EDITABLE LIVES IN THE scanContent OBJECT BELOW. <<<
   Change a phone number, add a service, reword the statement — no other file
   needs to be touched.
   ========================================================================== */

const scanContent = {
  /* ---- Identity ---------------------------------------------------- */
  brand:     'GLANZ',
  tagline:   'Skin | Hair | Homoeopathy',
  doctor:    'Dr. Sakshi Prajapati',
  statement: 'Personalised skin, hair and homoeopathic care — planned around you, in Nikol, Ahmedabad.',

  /* ---- Contact ----------------------------------------------------- */
  phone:      '+918320636243',          // used for tel: links
  phoneLabel: '+91 83206 36243',        // shown on screen
  whatsapp:   '918320636243',           // country code + number, no symbols
  whatsappMessage: 'Hello GLANZ, I would like to book a consultation.',
  email:      'glanzbydrsakshi@gmail.com',
  instagram:  'https://www.instagram.com/glanz_skin.hair.homeo/',
  instagramHandle: '@glanz_skin.hair.homeo',

  /* ---- Location ---------------------------------------------------- */
  addressLines: [
    '312/A, The Crown, opp. Kalhar Bungalows,',
    'Nr. Gangotri Circle, Nikol, Ahmedabad.'
  ],
  // TODO: replace with the clinic's exact Google Maps / Business Profile link.
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' +
           encodeURIComponent('GLANZ Skin Hair Homoeopathy, The Crown, Nikol, Ahmedabad'),

  /* ---- Destinations ------------------------------------------------ */
  website:      'https://www.glanzhealth.com/',
  websiteLabel: 'www.glanzhealth.com',
  websitePath:  '../',                  // relative link used by this page
  servicesPath: '../service/',
  // TODO: swap for a real booking destination when one exists.
  // Until then the button opens the contact section of the homepage.
  bookingUrl:   '../#contact',

  /* ---- Services shown on this page --------------------------------- */
  services: [
    {
      title: 'Skin',
      note: 'Aesthetic & clinical care',
      tint: 'skin',
      link: '../service/#skin',
      items: [
        'Q-Switch Nd:YAG Laser',
        'Chemical Peels',
        'Hydrafacial',
        'Carbon Facial',
        'BB Glow',
        'Microneedling',
        'Korean Glass Treatment',
        'Acne & Acne Scar Care',
        'Pigmentation Care',
        'Skin Polishing'
      ]
    },
    {
      title: 'Hair',
      note: 'Hair fall & growth support',
      tint: 'hair',
      link: '../service/#hair',
      items: [
        'Laser Hair Reduction (LHR)',
        'PRP',
        'GFC',
        'Mesotherapy',
        'Microneedling for Hair',
        'Hair Fall Management',
        'Scalp Care',
        'Diet Planning for Hair'
      ]
    },
    {
      title: 'Homoeopathy',
      note: 'Individualised consultation',
      tint: 'homoeo',
      link: '../service/#homoeopathy',
      items: [
        'Individualised Consultation',
        'Constitutional Assessment',
        'Support for Chronic Complaints',
        'Lifestyle & Wellness Guidance',
        'Follow-Up Care'
      ]
    },
    {
      title: 'Bridal & Groom',
      note: 'Planned around your date',
      tint: 'bridal',
      link: '../service/#bridal',
      items: [
        'Pre-Bridal Skin Preparation',
        'Glow & Rejuvenation Sessions',
        'Hair & Scalp Care',
        'Personalised Diet Guidance'
      ]
    }
  ]
};

/* Derived values ----------------------------------------------------- */
scanContent.whatsappUrl =
  'https://wa.me/' + scanContent.whatsapp +
  '?text=' + encodeURIComponent(scanContent.whatsappMessage);

/* --------------------------------------------------------------------------
   1. Fill text and links from the config
   -------------------------------------------------------------------------- */
function renderIdentity() {
  const text = {
    doctor:          scanContent.doctor,
    statement:       scanContent.statement,
    website:         scanContent.websiteLabel,
    instagramHandle: scanContent.instagramHandle,
    email:           scanContent.email,
    year:            String(new Date().getFullYear())
  };

  Object.keys(text).forEach((key) => {
    document.querySelectorAll(`[data-scan="${key}"]`).forEach((el) => {
      el.textContent = text[key];
    });
  });

  document.querySelectorAll('[data-scan="address"]').forEach((el) => {
    el.innerHTML = scanContent.addressLines.join('<br>');
  });

  const hrefs = {
    book:      scanContent.bookingUrl,
    phone:     'tel:' + scanContent.phone,
    whatsapp:  scanContent.whatsappUrl,
    maps:      scanContent.mapsUrl,
    website:   scanContent.websitePath,
    instagram: scanContent.instagram,
    email:     'mailto:' + scanContent.email
  };

  Object.keys(hrefs).forEach((key) => {
    document.querySelectorAll(`[data-scan-link="${key}"]`).forEach((el) => {
      el.setAttribute('href', hrefs[key]);
    });
  });
}

/* --------------------------------------------------------------------------
   2. Service categories — expandable, built from scanContent.services
   -------------------------------------------------------------------------- */
function renderServices() {
  const host = document.getElementById('scanCats');
  if (!host) return;

  const chevron =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 6l5 5 5-5"/></svg>';

  host.innerHTML = scanContent.services.map((cat, i) => `
    <article class="scan-cat scan-cat--${cat.tint || 'bridal'}" data-cat>
      <h3 style="margin:0">
        <button class="scan-cat__btn" type="button" aria-expanded="false" aria-controls="scan-cat-${i}">
          <span class="scan-cat__dot" aria-hidden="true"></span>
          <span class="scan-cat__label">
            <b>${cat.title}</b>
            <span>${cat.note}</span>
          </span>
          <span class="scan-cat__chev">${chevron}</span>
        </button>
      </h3>
      <div class="scan-cat__panel" id="scan-cat-${i}" role="region">
        <ul class="scan-cat__list">
          ${cat.items.map((item) => `<li>${item}</li>`).join('')}
        </ul>
        <a class="scan-cat__more" href="${cat.link}">View details</a>
      </div>
    </article>
  `).join('');

  const cards = Array.from(host.querySelectorAll('[data-cat]'));

  cards.forEach((card) => {
    const btn = card.querySelector('.scan-cat__btn');
    const panel = card.querySelector('.scan-cat__panel');

    const collapse = (target) => {
      const p = target.querySelector('.scan-cat__panel');
      p.style.height = `${p.scrollHeight}px`;
      requestAnimationFrame(() => { p.style.height = '0px'; });
      target.classList.remove('is-open');
      target.querySelector('.scan-cat__btn').setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-open');
      cards.forEach((other) => {
        if (other !== card && other.classList.contains('is-open')) collapse(other);
      });

      if (isOpen) {
        collapse(card);
        return;
      }

      card.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      panel.style.height = `${panel.scrollHeight}px`;
      const onEnd = (e) => {
        if (e.propertyName !== 'height') return;
        if (card.classList.contains('is-open')) panel.style.height = 'auto';
        panel.removeEventListener('transitionend', onEnd);
      };
      panel.addEventListener('transitionend', onEnd);
    });
  });

  /* Open the first category so the page never looks empty */
  const first = cards[0];
  if (first) first.querySelector('.scan-cat__btn').click();
}

/* --------------------------------------------------------------------------
   3. Save Contact — generates a vCard from the same config
   -------------------------------------------------------------------------- */
function initSaveContact() {
  const btn = document.getElementById('saveContact');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const card = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:Prajapati;Sakshi;;Dr.;`,
      `FN:${scanContent.doctor} (GLANZ)`,
      'ORG:GLANZ — Skin, Hair & Homoeopathy',
      `TEL;TYPE=CELL:${scanContent.phone}`,
      `EMAIL;TYPE=INTERNET:${scanContent.email}`,
      `URL:${scanContent.website}`,
      `ADR;TYPE=WORK:;;${scanContent.addressLines.join(' ').replace(/,$/, '')};Ahmedabad;Gujarat;;India`,
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([card], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'GLANZ-Dr-Sakshi-Prajapati.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    const label = btn.lastChild;
    if (label && label.nodeType === Node.TEXT_NODE) {
      const original = label.textContent;
      label.textContent = ' Saved';
      setTimeout(() => { label.textContent = original; }, 2200);
    }
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
   4. Boot
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderIdentity();
  renderServices();
  initSaveContact();
  initFileProtocolLinks();
});
