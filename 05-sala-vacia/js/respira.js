/* Sala Vacía · círculo de respiración 4-4-6
   Estado 1: ritmo en bucle, sin cuenta (invitación).
   Estado 2 (al pulsar): respiración guiada de 1 minuto con cuenta atrás. */
(function () {
  'use strict';

  var boton = document.getElementById('respira');
  if (!boton) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fase = boton.querySelector('.respira__fase');
  var cuenta = boton.querySelector('.respira__cuenta');
  var pista = document.getElementById('respira-pista');
  var mensaje = document.getElementById('respira-mensaje');
  var progreso = boton.querySelector('.respira__progreso');

  var FASES = [
    { clave: 'inhala', texto: 'inhala…', seg: 4 },
    { clave: 'manten', texto: 'mantén…', seg: 4 },
    { clave: 'exhala', texto: 'exhala…', seg: 6 }
  ];
  var CICLO = 14;           /* segundos por ciclo */
  var DURACION = 60;        /* segundos de la sesión guiada */

  var modo = 'bucle';       /* 'bucle' | 'guiada' */
  var temporizador = null;
  var tick = null;

  /* Modo reduced-motion: círculo estático, texto fijo, pero la guía de 1 min sigue siendo útil (solo con números). */
  if (reduceMotion) {
    boton.removeAttribute('data-fase');
    fase.textContent = 'respira';
    cuenta.textContent = '4 · 4 · 6';
    pista.textContent = 'Pulsa para una respiración guiada de un minuto';
  }

  function ponerFase(indice) {
    var f = FASES[indice];
    if (!reduceMotion) boton.setAttribute('data-fase', f.clave);
    fase.textContent = f.texto;
    return f.seg;
  }

  /* ---- Bucle de invitación ---- */
  function bucle(indice) {
    if (modo !== 'bucle') return;
    var seg = ponerFase(indice);
    if (reduceMotion) return;
    temporizador = setTimeout(function () { bucle((indice + 1) % FASES.length); }, seg * 1000);
  }

  function arrancarBucle() {
    modo = 'bucle';
    boton.classList.remove('respira--activo');
    progreso.style.strokeDashoffset = 100;
    cuenta.textContent = reduceMotion ? '4 · 4 · 6' : '';
    pista.textContent = 'Pulsa el círculo y respira conmigo un minuto';
    boton.setAttribute('aria-label', 'Empezar una respiración guiada de un minuto');
    if (!reduceMotion) bucle(0); else { fase.textContent = 'respira'; }
  }

  /* ---- Sesión guiada de 1 minuto ---- */
  function guiada() {
    modo = 'guiada';
    clearTimeout(temporizador);
    boton.classList.add('respira--activo');
    boton.setAttribute('aria-label', 'Detener la respiración guiada');
    mensaje.classList.remove('visible');
    pista.textContent = 'Un minuto. Si te mareas, para y respira a tu ritmo.';

    var transcurrido = 0;      /* segundos */
    var indice = 0;
    var enFase = 0;            /* segundos dentro de la fase */
    ponerFase(0);
    cuenta.textContent = FASES[0].seg;
    progreso.style.strokeDashoffset = 100;

    tick = setInterval(function () {
      transcurrido += 1;
      enFase += 1;
      progreso.style.strokeDashoffset = 100 - (transcurrido / DURACION) * 100;

      if (transcurrido >= DURACION) {
        terminar();
        return;
      }
      if (enFase >= FASES[indice].seg) {
        indice = (indice + 1) % FASES.length;
        enFase = 0;
        ponerFase(indice);
      }
      cuenta.textContent = (FASES[indice].seg - enFase) + '';
      if (transcurrido % 10 === 0) {
        pista.textContent = (DURACION - transcurrido) + ' segundos';
      }
    }, 1000);
  }

  function terminar() {
    clearInterval(tick);
    tick = null;
    fase.textContent = 'gracias';
    cuenta.textContent = '';
    if (!reduceMotion) boton.setAttribute('data-fase', 'exhala');
    progreso.style.strokeDashoffset = 0;
    mensaje.textContent = 'Así empieza cada clase en Sala Vacía.';
    mensaje.classList.add('visible');
    pista.textContent = 'La primera clase es gratis. Te esperamos.';
    boton.setAttribute('aria-label', 'Repetir la respiración guiada');
    modo = 'fin';
    temporizador = setTimeout(function () {
      mensaje.classList.remove('visible');
      arrancarBucle();
    }, 9000);
  }

  function detener() {
    clearInterval(tick);
    tick = null;
    clearTimeout(temporizador);
    arrancarBucle();
  }

  boton.addEventListener('click', function () {
    if (modo === 'guiada') { detener(); return; }
    clearTimeout(temporizador);
    guiada();
  });

  /* Pausar el bucle cuando la pestaña no está visible (ahorra batería y evita desincronías) */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearTimeout(temporizador);
      if (modo === 'guiada') detener();
    } else if (modo === 'bucle') {
      clearTimeout(temporizador);
      bucle(0);
    }
  });

  arrancarBucle();
})();
