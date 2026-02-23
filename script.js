(function () {
  const langButtons = document.querySelectorAll('[data-lang-btn]');
  const langBlocks = document.querySelectorAll('[data-lang]');

  function setLang(lang) {
    document.documentElement.setAttribute('lang', lang);
    langButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.langBtn === lang)));
    langBlocks.forEach((el) => {
      el.style.display = el.dataset.lang === lang ? '' : 'none';
    });
    try { localStorage.setItem('tojemoje_lang', lang); } catch (_) {}
  }

  langButtons.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.langBtn)));

  setLang('pl');

  const gallery = document.querySelector('[data-gallery]');
  const galleryToggle = document.querySelector('[data-gallery-toggle]');
  if (gallery && galleryToggle) {
    const photoCount = gallery.querySelectorAll('.photo').length;
    if (photoCount <= 6) {
      galleryToggle.style.display = 'none';
    } else {
      gallery.dataset.collapsed = 'true';
      galleryToggle.dataset.expanded = 'false';
      galleryToggle.setAttribute('aria-expanded', 'false');

      galleryToggle.addEventListener('click', () => {
        const isCollapsed = gallery.dataset.collapsed !== 'false';
        gallery.dataset.collapsed = isCollapsed ? 'false' : 'true';
        galleryToggle.dataset.expanded = isCollapsed ? 'true' : 'false';
        galleryToggle.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
      });
    }
  }

  const lightbox = document.querySelector('[data-lightbox]');
  if (gallery && lightbox) {
    const thumbnails = Array.from(gallery.querySelectorAll('img'));
    const sources = thumbnails
      .map((img) => ({
        img,
        get src() { return img.currentSrc || img.getAttribute('src') || ''; },
        get alt() { return img.getAttribute('alt') || ''; },
      }))
      .filter((x) => Boolean(x.src));

    const lightboxImg = lightbox.querySelector('[data-lightbox-img]');
    const btnClose = lightbox.querySelector('[data-lightbox-close]');
    const btnPrev = lightbox.querySelector('[data-lightbox-prev]');
    const btnNext = lightbox.querySelector('[data-lightbox-next]');
    const backdrop = lightbox.querySelector('[data-lightbox-backdrop]');

    if (sources.length && lightboxImg && btnClose && btnPrev && btnNext && backdrop) {
      let currentIndex = 0;
      let lastActiveEl = null;

      const focusables = [btnClose, btnPrev, btnNext];

      function setIndex(nextIndex) {
        const count = sources.length;
        currentIndex = ((nextIndex % count) + count) % count;
        lightboxImg.src = sources[currentIndex].src;
        lightboxImg.alt = sources[currentIndex].alt;
      }

      function openAt(index) {
        lastActiveEl = document.activeElement;
        setIndex(index);
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightboxOpen');
        btnClose.focus();
      }

      function close() {
        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightboxOpen');
        lightboxImg.removeAttribute('src');
        lightboxImg.alt = '';
        if (lastActiveEl && typeof lastActiveEl.focus === 'function') lastActiveEl.focus();
      }

      function go(delta) {
        setIndex(currentIndex + delta);
      }

      sources.forEach((item, index) => {
        const target = item.img.closest('.photo') || item.img;
        target.setAttribute('role', 'button');
        target.tabIndex = 0;
        target.setAttribute('aria-label', item.alt || 'Open photo');

        target.addEventListener('click', () => openAt(index));
        target.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openAt(index);
          }
        });
      });

      btnClose.addEventListener('click', close);
      backdrop.addEventListener('click', close);
      btnPrev.addEventListener('click', () => go(-1));
      btnNext.addEventListener('click', () => go(1));

      document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;

        if (e.key === 'Escape') {
          e.preventDefault();
          close();
          return;
        }

        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          go(-1);
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          go(1);
          return;
        }

        if (e.key === 'Tab') {
          const activeIndex = focusables.indexOf(document.activeElement);
          const next = e.shiftKey
            ? (activeIndex <= 0 ? focusables.length - 1 : activeIndex - 1)
            : (activeIndex === -1 || activeIndex >= focusables.length - 1 ? 0 : activeIndex + 1);

          e.preventDefault();
          focusables[next].focus();
        }
      });
    }
  }
})();
