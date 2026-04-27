(function () {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;
  const track = carousel.querySelector('[data-carousel-track]');
  const slides = Array.from(track.querySelectorAll('[data-slide]'));
  const prev = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const dotsHost = carousel.querySelector('[data-carousel-dots]');
  if (!track || slides.length === 0) return;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    b.addEventListener('click', () => scrollToIndex(i));
    dotsHost.appendChild(b);
  });
  const dots = Array.from(dotsHost.children);

  function currentIndex() {
    const x = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((s, i) => {
      const center = s.offsetLeft + s.clientWidth / 2;
      const d = Math.abs(center - x);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  function scrollToIndex(i) {
    const target = slides[Math.max(0, Math.min(slides.length - 1, i))];
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }

  function update() {
    const i = currentIndex();
    dots.forEach((d, j) => d.setAttribute('aria-current', j === i ? 'true' : 'false'));
    if (prev) prev.toggleAttribute('disabled', i === 0);
    if (next) next.toggleAttribute('disabled', i === slides.length - 1);
  }

  if (prev) prev.addEventListener('click', () => scrollToIndex(currentIndex() - 1));
  if (next) next.addEventListener('click', () => scrollToIndex(currentIndex() + 1));

  let raf;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  });

  update();
})();
