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

  const saved = (() => {
    try { return localStorage.getItem('tojemoje_lang'); } catch (_) { return null; }
  })();

  setLang(saved === 'en' ? 'en' : 'pl');
})();
