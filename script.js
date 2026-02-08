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
})();
