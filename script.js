(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('[data-tilt]').forEach(card => {
    let frame;
    card.addEventListener('pointermove', event => {
      if (motion.matches || !pointer.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width - .5;
        const y = (event.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(1100px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      });
    });
    const reset = () => { cancelAnimationFrame(frame); card.style.transform = ''; };
    card.addEventListener('pointerleave', reset);
    motion.addEventListener('change', reset);
    pointer.addEventListener('change', reset);
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!motion.matches) entry.target.animate(
          [{ opacity: .55, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 550, easing: 'cubic-bezier(.2,.7,.3,1)' }
        );
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    document.querySelectorAll('.section-header, .about-content, .card, .combinacoes-inner, .filtro-inner, .accordion, .footer-cta').forEach(el => observer.observe(el));
  }
})();
