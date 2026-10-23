/* Sala Vacía · comparador de tarifas según clases por semana */
(function () {
  'use strict';

  var slider = document.getElementById('clases-semana');
  if (!slider) return;

  var SEMANAS_MES = 4.33;
  var TARIFAS = [
    { id: 'suelta', nombre: 'Clase suelta', precio: 14, clases: 1, meses: 0 },
    { id: 'bono5', nombre: 'Bono 5', precio: 60, clases: 5, meses: 0 },
    { id: 'bono10', nombre: 'Bono 10', precio: 105, clases: 10, meses: 0 },
    { id: 'mensual', nombre: 'Mensual ilimitado', precio: 65, clases: 0, meses: 1 },
    { id: 'trimestral', nombre: 'Trimestral ilimitado', precio: 165, clases: 0, meses: 3 }
  ];

  var valor = document.getElementById('clases-semana-valor');
  var resumen = document.getElementById('comparador-resumen');

  function euros(n) {
    return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  function calcular() {
    var porSemana = parseInt(slider.value, 10);
    var clasesMes = porSemana * SEMANAS_MES;

    valor.innerHTML = porSemana + '<small>' + (porSemana === 1 ? 'clase a la semana' : 'clases a la semana') + '</small>';

    var resultados = TARIFAS.map(function (t) {
      var costeMes, porClase;
      if (t.meses) {
        costeMes = t.precio / t.meses;
        porClase = costeMes / clasesMes;
      } else {
        porClase = t.precio / t.clases;
        costeMes = porClase * clasesMes;
      }
      return { t: t, costeMes: costeMes, porClase: porClase };
    });

    var mejor = resultados.reduce(function (a, b) { return b.costeMes < a.costeMes - 0.005 ? b : a; });

    resultados.forEach(function (r) {
      var tarjeta = document.getElementById('tarifa-' + r.t.id);
      if (!tarjeta) return;
      var esMejor = r === mejor;
      tarjeta.classList.toggle('tarifa--mejor', esMejor);
      tarjeta.setAttribute('aria-label', r.t.nombre + (esMejor ? ', la más económica para ti' : ''));
      var pc = tarjeta.querySelector('[data-por-clase]');
      var pm = tarjeta.querySelector('[data-por-mes]');
      if (pc) pc.textContent = euros(r.porClase);
      if (pm) pm.textContent = 'unos ' + euros(costeRedondo(r.costeMes)) + ' al mes';
    });

    var ahorro = resultados.filter(function (r) { return r.t.id === 'suelta'; })[0].costeMes - mejor.costeMes;
    var texto = 'Con <strong>' + porSemana + (porSemana === 1 ? ' clase' : ' clases') + ' a la semana</strong> (' +
      Math.round(clasesMes) + ' al mes) te sale mejor <strong>' + mejor.t.nombre + '</strong>: ' +
      euros(mejor.porClase) + ' por clase y unos ' + euros(costeRedondo(mejor.costeMes)) + ' al mes.';
    if (ahorro > 1) texto += ' Ahorras ' + euros(costeRedondo(ahorro)) + ' al mes frente a las clases sueltas.';
    if (mejor.t.id === 'mensual' || mejor.t.id === 'trimestral') texto += ' Y si un día quieres venir más, no cuesta nada.';
    resumen.innerHTML = texto;
  }

  function costeRedondo(n) { return Math.round(n * 2) / 2; }

  slider.addEventListener('input', calcular);
  calcular();
})();
