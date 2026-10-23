/* Sala Vacía · comportamiento común: menú móvil, revelado suave, avisos */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Menú móvil ---- */
  var botonMenu = document.querySelector('.boton-menu');
  var menu = document.getElementById('menu-movil');
  var botonCerrar = menu ? menu.querySelector('.menu-movil__cerrar') : null;

  function abrirMenu() {
    if (!menu) return;
    menu.classList.add('abierto');
    menu.removeAttribute('hidden');
    botonMenu.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var primero = menu.querySelector('a');
    if (primero) primero.focus();
  }
  function cerrarMenu() {
    if (!menu) return;
    menu.classList.remove('abierto');
    botonMenu.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    botonMenu.focus();
  }
  if (botonMenu && menu) {
    menu.removeAttribute('hidden');
    botonMenu.addEventListener('click', function () {
      var abierto = botonMenu.getAttribute('aria-expanded') === 'true';
      if (abierto) cerrarMenu(); else abrirMenu();
    });
    if (botonCerrar) botonCerrar.addEventListener('click', cerrarMenu);
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('abierto');
        botonMenu.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('abierto')) cerrarMenu();
    });
  }

  /* ---- Página actual en el menú ---- */
  var actual = (location.pathname.split('/').pop() || 'index.html').split('?')[0];
  document.querySelectorAll('.nav a, .menu-movil a').forEach(function (a) {
    var destino = (a.getAttribute('href') || '').split('#')[0].split('?')[0];
    if (destino && destino === actual && !a.classList.contains('nav__cta')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---- Revelado con IntersectionObserver ---- */
  var revelables = document.querySelectorAll('.revela');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revelables.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revelables.forEach(function (el) { io.observe(el); });
    /* Red de seguridad: si algo no llega a observarse (impresión, lectores), se muestra igual */
    setTimeout(function () {
      revelables.forEach(function (el) { el.classList.add('visible'); });
    }, 2500);
  }

  /* ---- Aviso flotante (toast) ---- */
  var aviso = document.createElement('div');
  aviso.className = 'aviso';
  aviso.setAttribute('role', 'status');
  aviso.setAttribute('aria-live', 'polite');
  document.body.appendChild(aviso);
  var temporizadorAviso = null;
  window.SalaVacia = window.SalaVacia || {};
  window.SalaVacia.aviso = function (texto) {
    aviso.textContent = texto;
    aviso.classList.add('visible');
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(function () { aviso.classList.remove('visible'); }, 3200);
  };
  window.SalaVacia.reduceMotion = reduceMotion;
})();
