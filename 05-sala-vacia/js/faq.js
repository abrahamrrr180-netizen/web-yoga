/* Sala Vacía · acordeón accesible de preguntas frecuentes */
(function () {
  'use strict';

  var botones = document.querySelectorAll('.acordeon__boton');
  if (!botones.length) return;

  function abrir(boton, panel) {
    boton.setAttribute('aria-expanded', 'true');
    panel.classList.add('abierto');
    panel.removeAttribute('hidden');
  }
  function cerrar(boton, panel) {
    boton.setAttribute('aria-expanded', 'false');
    panel.classList.remove('abierto');
  }

  botones.forEach(function (boton) {
    var panel = document.getElementById(boton.getAttribute('aria-controls'));
    if (!panel) return;
    panel.removeAttribute('hidden'); /* el CSS gestiona el colapso con grid-template-rows */
    boton.addEventListener('click', function () {
      var abierto = boton.getAttribute('aria-expanded') === 'true';
      if (abierto) cerrar(boton, panel); else abrir(boton, panel);
    });
    /* Flechas arriba/abajo entre preguntas del mismo grupo */
    boton.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var grupo = Array.prototype.slice.call(boton.closest('.acordeon').querySelectorAll('.acordeon__boton'));
      var i = grupo.indexOf(boton);
      var siguiente = e.key === 'ArrowDown' ? grupo[(i + 1) % grupo.length] : grupo[(i - 1 + grupo.length) % grupo.length];
      e.preventDefault();
      siguiente.focus();
    });
  });

  /* Abrir directamente una pregunta si llegan con #id */
  function abrirDesdeHash() {
    var id = location.hash.replace('#', '');
    if (!id) return;
    var objetivo = document.getElementById(id);
    if (!objetivo) return;
    var boton = objetivo.querySelector('.acordeon__boton');
    if (boton) {
      var panel = document.getElementById(boton.getAttribute('aria-controls'));
      if (panel) abrir(boton, panel);
    }
  }
  abrirDesdeHash();
  window.addEventListener('hashchange', abrirDesdeHash);
})();
