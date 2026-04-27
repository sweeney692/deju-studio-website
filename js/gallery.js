(function () {
  const grid = document.querySelector('[data-gallery]');
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll('.gallery-item'));
  const filterButtons = document.querySelectorAll('[data-filter]');

  // Filtering
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      filterButtons.forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
      items.forEach((item) => {
        const itemCat = item.getAttribute('data-category');
        const visible = cat === 'all' || itemCat === cat;
        item.style.display = visible ? '' : 'none';
      });
    });
  });

  // Lightbox
  const lightbox = document.querySelector('[data-lightbox]');
  if (!lightbox) return;
  const lbImg = lightbox.querySelector('img');
  const lbClose = lightbox.querySelector('[data-lightbox-close]');
  const lbPrev = lightbox.querySelector('[data-lightbox-prev]');
  const lbNext = lightbox.querySelector('[data-lightbox-next]');
  let activeIndex = -1;
  let lastFocused = null;

  function visibleItems() {
    return items.filter((i) => i.style.display !== 'none');
  }

  function openAt(index) {
    const list = visibleItems();
    if (!list.length) return;
    activeIndex = (index + list.length) % list.length;
    const item = list[activeIndex];
    const fullSrc = item.getAttribute('data-full') || item.querySelector('img').currentSrc || item.querySelector('img').src;
    const altText = item.querySelector('img').alt || '';
    lbImg.setAttribute('src', fullSrc);
    lbImg.setAttribute('alt', altText);
    lightbox.setAttribute('data-open', 'true');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function close() {
    lightbox.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  items.forEach((item, idx) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      lastFocused = item;
      const list = visibleItems();
      const visibleIdx = list.indexOf(item);
      openAt(visibleIdx);
    });
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => openAt(activeIndex - 1));
  lbNext.addEventListener('click', () => openAt(activeIndex + 1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('data-open') !== 'true') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') openAt(activeIndex - 1);
    if (e.key === 'ArrowRight') openAt(activeIndex + 1);
  });
})();
