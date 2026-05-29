'use strict';

/* ══ MENÚ HAMBURGUESA ═════════════════════════════════════════════════ */
(function () {
  const toggle  = document.getElementById('menuToggle');
  const panel   = document.getElementById('navPanel');
  const overlay = document.getElementById('menuOverlay');
  if (!toggle || !panel || !overlay) return;

  function closeMenu() {
    toggle.classList.remove('active');
    panel.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    if (panel.classList.contains('active')) { closeMenu(); return; }
    toggle.classList.add('active');
    panel.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  });

  overlay.addEventListener('click', closeMenu);
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();

/* ══ HEADER: SCROLL BEHAVIOR ══════════════════════════════════════════ */
(function () {
  const hdr = document.getElementById('site-header');
  if (!hdr) return;

  let lastY   = 0;
  let ticking = false;
  const THRESHOLD = 80;

  function update() {
    const currentY = window.scrollY;
    const delta    = currentY - lastY;

    hdr.classList.toggle('scrolled', currentY > 40);

    if (currentY < THRESHOLD) {
      hdr.classList.remove('nav-hidden');
    } else if (delta > 6) {
      hdr.classList.add('nav-hidden');
    } else if (delta < -4) {
      hdr.classList.remove('nav-hidden');
    }

    lastY   = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
})();

/* ══ SMOOTH SCROLL ════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const hh = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--hh-sm') || '72',
      10
    );
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - hh - 16,
      behavior: 'smooth'
    });
  });
});

/* ══ ACORDEÓN DE SERVICIOS ════════════════════════════════════════════ */
document.querySelectorAll('.svc-header').forEach(hd => {
  hd.addEventListener('click', () => {
    const item   = hd.closest('.svc-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.svc-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
  hd.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hd.click(); }
  });
});

/* ══ LIGHTBOX — Especialidades y Portafolio ═══════════════════════════ */
(function () {
  const lb    = document.getElementById('portfolioLightbox');
  const btnX  = document.getElementById('lbClose');
  const lbImg = document.getElementById('lbImg');
  const lbTit = document.getElementById('lbTitle');
  const lbTxt = document.getElementById('lbText');
  if (!lb) return;

  function openLightbox(item) {
    const t      = item.dataset.title || '';
    const tx     = item.dataset.text  || '';
    const rawSrc = item.dataset.img !== undefined ? item.dataset.img : '';
    const inner  = item.querySelector('img');
    const imgSrc = rawSrc || (inner ? inner.src : '');

    if (lbImg) {
      lbImg.src              = imgSrc;
      lbImg.alt              = t;
      lbImg.style.display    = imgSrc ? 'block' : 'none';
      lbImg.style.marginBottom = imgSrc ? '20px' : '0';
    }
    if (lbTit) lbTit.textContent = t;
    if (lbTxt) lbTxt.textContent = tx;

    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('.portfolio-item, .esp-card').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => openLightbox(item));
  });

  function closeLb() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnX) btnX.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
})();

/* ══ ANIMACIONES FADE-UP ══════════════════════════════════════════════ */
(function () {
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CARDS    = '.esp-card, .portfolio-item, .exp-card, .master-card, .prox-card, .cachivache-item';

  document.querySelectorAll(CARDS).forEach((el, i) => {
    el.classList.add('fade-up');
    if (!noMotion) el.style.transitionDelay = (i % 4) * 0.08 + 's';
  });

  if (noMotion) {
    document.querySelectorAll('.fade-up').forEach(el => {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 20px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

  requestAnimationFrame(() => {
    document.querySelectorAll('.fade-up:not(.visible)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight + 50 && r.bottom > -50) {
        el.classList.add('visible');
        obs.unobserve(el);
      }
    });
  });
})();

/* ══ SUBASTA CARD — hover sutil ══════════════════════════════════════ */
(function () {
  const subastaCard = document.querySelector('.subasta-card');
  if (!subastaCard) return;
  subastaCard.addEventListener('mouseenter', () => {
    subastaCard.style.boxShadow = '0 24px 64px rgba(196,154,42,0.22), 0 0 0 1px rgba(196,154,42,0.35)';
    subastaCard.style.transition = 'box-shadow 0.38s ease';
  });
  subastaCard.addEventListener('mouseleave', () => {
    subastaCard.style.boxShadow = '';
  });
})();

/* ══ FORMULARIO — Guardar en Firebase + envío opcional por WhatsApp ══ */
async function handleFormSubmit(e) {
  e.preventDefault();
  const form     = e.target;
  const nombre   = (form.nombre   && form.nombre.value.trim())   || '';
  const email    = (form.email    && form.email.value.trim())    || '';
  const tel      = (form.telefono && form.telefono.value.trim()) || '';
  const servicio = (form.servicio && form.servicio.value)        || '';
  const msg      = (form.mensaje  && form.mensaje.value.trim())  || '';
  const btn      = form.querySelector('button[type="submit"]');
  const orig     = btn ? btn.innerHTML : '';

  // Validación mínima
  if (!nombre || !servicio) {
    alert('Por favor completa al menos el nombre y el tipo de servicio.');
    return;
  }

  // Estado: guardando…
  if (btn) {
    btn.disabled  = true;
    btn.innerHTML = '⏳ Enviando reserva…';
  }

  // ══ 1) GUARDAR EN FIREBASE (Firestore) ══════════════════════════════
  let guardadoOk = false;
  if (typeof window.guardarReserva === 'function') {
    try {
      const res = await window.guardarReserva({
        nombre:   nombre,
        email:    email,
        telefono: tel,
        servicio: servicio,
        mensaje:  msg
      });
      guardadoOk = !!(res && res.ok);
      if (guardadoOk) {
        console.log('Reserva guardada en Firebase:', res.id);
      } else {
        console.warn('No se pudo guardar la reserva en Firebase', res);
      }
    } catch (err) {
      console.error('Error al guardar en Firebase:', err);
    }
  } else {
    console.warn('Firebase no disponible (window.guardarReserva no existe).');
  }

  // Si falló el guardado, avisar y NO abrir WhatsApp.
  if (!guardadoOk) {
    if (btn) {
      btn.innerHTML = '✕ No se pudo enviar la reserva';
      setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 4000);
    }
    alert('No se pudo enviar la reserva. Verifica tu conexión e inténtalo de nuevo.');
    return;
  }

  // ══ 2) CONFIRMAR AL USUARIO ════════════════════════════════════════
  if (btn) {
    btn.innerHTML = '✓ Reserva enviada';
  }
  form.reset();

  // ══ 3) WHATSAPP OPCIONAL — el usuario decide si quiere enviar también
  const serviceMap = {
    catering:      'Catering & Eventos',
    cocteles:      'Coctelería de Autor',
    'chef-privado':'Chef Privado / Chef\'s Table',
    consultoria:   'Consultoría Gastronómica',
    academia:      'Academia & Masterclases',
    subasta:       'Subasta del Mes',
    obsequios:     'Obsequios & Canastas',
    cachivaches:   'Cachivaches & Utensilios',
    otro:          'Otro'
  };
  const svcLabel = serviceMap[servicio] || servicio;
  const texto = [
    '🍽️ *Solicitud — Les Clefs Food Design*',
    '',
    `*Nombre:* ${nombre}`,
    email    ? `*Email:* ${email}` : '',
    tel      ? `*Teléfono:* ${tel}` : '',
    svcLabel ? `*Servicio:* ${svcLabel}` : '',
    '',
    msg ? `*Mensaje:*\n${msg}` : ''
  ].filter(Boolean).join('\n');

  const waNumber = '573000000000';
  const waUrl    = `https://wa.me/${waNumber}?text=${encodeURIComponent(texto)}`;

  if (confirm('Tu reserva fue registrada con éxito.\n\n¿Quieres además enviar el mensaje por WhatsApp al equipo del Chef?')) {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  // Restaurar el botón
  if (btn) {
    setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 2500);
  }
}

/* ══ LOG ════════════════════════════════════════════════════════════════ */
console.log(
  '%c Les Clefs Food Design v14.0',
  'color:#C49A2A;font-size:16px;font-weight:700;background:#1A1A1A;padding:6px 14px;border-radius:6px;'
);