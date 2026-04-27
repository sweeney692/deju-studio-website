// Wire every [data-wa] element to a pre-filled wa.me link.
// Usage: <a class="btn btn-primary" data-wa="gel-manicure">Book a Gel Manicure</a>
(function () {
  const cfg = window.DEJU;
  if (!cfg) return;

  function buildHref(slug) {
    const tpl = cfg.whatsappTemplates[slug] || cfg.whatsappTemplates.generic;
    return `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(tpl)}`;
  }

  function fireConversion() {
    if (typeof window.gtag !== 'function') return;
    const id = cfg.analytics.googleAdsId;
    const label = cfg.analytics.conversionLabel;
    if (id && label && !id.includes('PLACEHOLDER') && !label.includes('PLACEHOLDER')) {
      window.gtag('event', 'conversion', { send_to: `${id}/${label}` });
    }
    window.gtag('event', 'click_whatsapp', { event_category: 'engagement' });
  }

  document.querySelectorAll('[data-wa]').forEach((el) => {
    const slug = el.getAttribute('data-wa') || 'generic';
    el.setAttribute('href', buildHref(slug));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
    el.addEventListener('click', fireConversion);
  });
})();
