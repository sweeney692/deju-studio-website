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
