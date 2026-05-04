// Wire every [data-wa] element to a pre-filled wa.me link.
// Usage: <a class="btn btn-primary" data-wa="gel-manicure">Book a Gel Manicure</a>
(function () {
  const cfg = window.DEJU;
  if (!cfg) return;

  // Capture ?ref=<slug> on landing and persist for the session so the
  // partner tag survives in-page anchor navigation (#services, #visit).
  const params = new URLSearchParams(window.location.search);
  const incomingRef = params.get('ref');
  if (incomingRef) {
    try { sessionStorage.setItem('dejuRef', incomingRef); } catch (_) {}
  }
  let storedRef = null;
  try { storedRef = sessionStorage.getItem('dejuRef'); } catch (_) {}
  const partnerName = storedRef && cfg.partnerNames && cfg.partnerNames[storedRef];

  function buildHref(slug) {
    // Partner-tagged sessions always use the generic message so the studio
    // sees a single recognisable opener regardless of which CTA was clicked.
    const tpl = partnerName
      ? cfg.whatsappTemplates.generic
      : (cfg.whatsappTemplates[slug] || cfg.whatsappTemplates.generic);
    const text = partnerName ? `${tpl} (Sent from ${partnerName})` : tpl;
    return `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }

  function fireConversion() {
    if (typeof window.gtag !== 'function') return;
    const id = cfg.analytics.googleAdsId;
    const label = cfg.analytics.conversionLabel;
    if (id && label && !id.includes('PLACEHOLDER') && !label.includes('PLACEHOLDER')) {
      window.gtag('event', 'conversion', { send_to: `${id}/${label}` });
    }
    window.gtag('event', 'click_whatsapp', {
      event_category: 'engagement',
      partner: partnerName || '(none)',
    });
  }

  document.querySelectorAll('[data-wa]').forEach((el) => {
    const slug = el.getAttribute('data-wa') || 'generic';
    el.setAttribute('href', buildHref(slug));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
    el.addEventListener('click', fireConversion);
  });
})();
