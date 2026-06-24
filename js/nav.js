(function () {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.setAttribute('data-open', String(open));
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.getAttribute('data-open') === 'true';
    setOpen(!isOpen);
  });

  // Close nav on link click (mobile)
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));

  // Close on resize past breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setOpen(false);
  });
})();

// Fragment-landing fix. When the page is opened at a deep anchor (e.g.
// /#careers via the /careers redirect), the browser jumps to the target at
// parse time, then lazy-loaded images and the map iframe above it finish
// loading and push the target down - parking the viewport on the wrong
// section (careers was landing on #faq). On a phone this reflow can dribble
// in over a couple of seconds, so a single re-scroll isn't enough: we keep
// the target pinned (re-snapping whenever its position drifts) for a short
// window, using the same 96px offset as scroll-padding-top so the sticky
// header doesn't cover the heading. Bails out the moment the visitor scrolls,
// so it never yanks them back.
(function () {
  if (!location.hash) return;

  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;

  let interrupted = false;
  const stop = () => { interrupted = true; };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) =>
    window.addEventListener(ev, stop, { passive: true, once: true })
  );

  function snap() {
    if (interrupted) return;
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 96;
    if (Math.abs(window.pageYOffset - top) > 2) {
      window.scrollTo({ top, behavior: 'auto' });
    }
  }

  // Re-pin every 50ms for ~3s to ride out lazy images / the map iframe / late
  // reflow on slow mobile connections; stops early if the visitor interacts.
  let ticks = 0;
  const iv = setInterval(() => {
    snap();
    if (interrupted || ++ticks > 60) clearInterval(iv);
  }, 50);

  window.addEventListener('load', snap);
})();
