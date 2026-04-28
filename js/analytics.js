// Loads Google Analytics 4 + Google Ads tags using IDs from config.js.
// Skips loading if the IDs are still placeholders.
(function () {
  const cfg = window.DEJU && window.DEJU.analytics;
  if (!cfg) return;

  const ga4 = cfg.ga4Id;
  const ads = cfg.googleAdsId;
  const ga4Active = ga4 && !ga4.includes('PLACEHOLDER');
  const adsActive = ads && !ads.includes('PLACEHOLDER');
  if (!ga4Active && !adsActive) return;

  // gtag.js loads off the first id; the rest are configured via gtag('config', ...).
  const primary = ga4Active ? ga4 : ads;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${primary}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  if (ga4Active) window.gtag('config', ga4, { anonymize_ip: true });
  if (adsActive) window.gtag('config', ads);
})();
