/* Sala Vacía · horario semanal interactivo + reserva simulada en localStorage */
(function () {
  'use strict';

  var raiz = document.getElementById('horario-rejilla');
  if (!raiz) return;

  var DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  var DIAS_CORTO = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  var PROFES = {
    ana: 'Ana Rebollo',
    marcos: 'Marcos Vinagre',
    lucia: 'Lucía Trejo',
    jorge: 'Jorge Carmona'
  };
  var DISCIPLINAS = {
    yoga: 'Yoga',
    pilates: 'Pilates',
    yin: 'Yin',
    meditacion: 'Meditación'
  };
  var NIVELES = {
    todos: 'Todos los niveles',
    iniciacion: 'Iniciación',
    intermedio: 'Intermedio'
  };
  var SALAS = { norte: 'Sala Norte', patio: 'Sala Patio', reformer: 'Sala Reformer' };

  /* dia: 0 = lunes … 6 = domingo. plazas = aforo total. libres = plazas simuladas libres antes de tus reservas. */
  var CLASES = [
    /* Lunes */
    { id: 'l0730', dia: 0, hora: '07:30', min: 60, disc: 'yoga', nombre: 'Vinyasa al amanecer', nivel: 'todos', profe: 'ana', sala: 'norte', plazas: 14, libres: 5 },
    { id: 'l0930', dia: 0, hora: '09:30', min: 55, disc: 'pilates', nombre: 'Pilates suelo', nivel: 'iniciacion', profe: 'marcos', sala: 'patio', plazas: 12, libres: 7 },
    { id: 'l1230', dia: 0, hora: '12:30', min: 50, disc: 'pilates', nombre: 'Reformer', nivel: 'intermedio', profe: 'jorge', sala: 'reformer', plazas: 6, libres: 1 },
    { id: 'l1800', dia: 0, hora: '18:00', min: 60, disc: 'yoga', nombre: 'Hatha suave', nivel: 'iniciacion', profe: 'jorge', sala: 'norte', plazas: 14, libres: 9 },
    { id: 'l1930', dia: 0, hora: '19:30', min: 75, disc: 'yin', nombre: 'Yin para cerrar el día', nivel: 'todos', profe: 'lucia', sala: 'patio', plazas: 12, libres: 3 },
    /* Martes */
    { id: 'm0800', dia: 1, hora: '08:00', min: 50, disc: 'pilates', nombre: 'Reformer', nivel: 'iniciacion', profe: 'jorge', sala: 'reformer', plazas: 6, libres: 2 },
    { id: 'm1000', dia: 1, hora: '10:00', min: 60, disc: 'yoga', nombre: 'Yoga para la espalda', nivel: 'todos', profe: 'ana', sala: 'norte', plazas: 14, libres: 8 },
    { id: 'm1400', dia: 1, hora: '14:00', min: 30, disc: 'meditacion', nombre: 'Pausa de mediodía', nivel: 'todos', profe: 'lucia', sala: 'patio', plazas: 16, libres: 12 },
    { id: 'm1830', dia: 1, hora: '18:30', min: 55, disc: 'pilates', nombre: 'Pilates suelo', nivel: 'intermedio', profe: 'marcos', sala: 'patio', plazas: 12, libres: 0 },
    { id: 'm2000', dia: 1, hora: '20:00', min: 60, disc: 'yoga', nombre: 'Vinyasa fluido', nivel: 'intermedio', profe: 'ana', sala: 'norte', plazas: 14, libres: 4 },
    /* Miércoles */
    { id: 'x0730', dia: 2, hora: '07:30', min: 60, disc: 'yoga', nombre: 'Vinyasa al amanecer', nivel: 'todos', profe: 'ana', sala: 'norte', plazas: 14, libres: 6 },
    { id: 'x0930', dia: 2, hora: '09:30', min: 55, disc: 'pilates', nombre: 'Pilates suelo', nivel: 'iniciacion', profe: 'marcos', sala: 'patio', plazas: 12, libres: 5 },
    { id: 'x1230', dia: 2, hora: '12:30', min: 50, disc: 'pilates', nombre: 'Reformer', nivel: 'intermedio', profe: 'jorge', sala: 'reformer', plazas: 6, libres: 3 },
    { id: 'x1800', dia: 2, hora: '18:00', min: 60, disc: 'yoga', nombre: 'Hatha suave', nivel: 'iniciacion', profe: 'jorge', sala: 'norte', plazas: 14, libres: 10 },
    { id: 'x1930', dia: 2, hora: '19:30', min: 45, disc: 'meditacion', nombre: 'Meditación guiada', nivel: 'todos', profe: 'lucia', sala: 'patio', plazas: 16, libres: 9 },
    /* Jueves */
    { id: 'j0800', dia: 3, hora: '08:00', min: 50, disc: 'pilates', nombre: 'Reformer', nivel: 'iniciacion', profe: 'jorge', sala: 'reformer', plazas: 6, libres: 1 },
    { id: 'j1000', dia: 3, hora: '10:00', min: 60, disc: 'yoga', nombre: 'Yoga para la espalda', nivel: 'todos', profe: 'ana', sala: 'norte', plazas: 14, libres: 7 },
    { id: 'j1830', dia: 3, hora: '18:30', min: 55, disc: 'pilates', nombre: 'Pilates suelo', nivel: 'intermedio', profe: 'marcos', sala: 'patio', plazas: 12, libres: 2 },
    { id: 'j2000', dia: 3, hora: '20:00', min: 75, disc: 'yin', nombre: 'Yin y respiración', nivel: 'todos', profe: 'lucia', sala: 'norte', plazas: 14, libres: 6 },
    /* Viernes */
    { id: 'v0730', dia: 4, hora: '07:30', min: 60, disc: 'yoga', nombre: 'Vinyasa al amanecer', nivel: 'todos', profe: 'ana', sala: 'norte', plazas: 14, libres: 8 },
    { id: 'v0930', dia: 4, hora: '09:30', min: 55, disc: 'pilates', nombre: 'Pilates suelo', nivel: 'todos', profe: 'marcos', sala: 'patio', plazas: 12, libres: 6 },
    { id: 'v1230', dia: 4, hora: '12:30', min: 50, disc: 'pilates', nombre: 'Reformer', nivel: 'todos', profe: 'marcos', sala: 'reformer', plazas: 6, libres: 4 },
    { id: 'v1800', dia: 4, hora: '18:00', min: 60, disc: 'yoga', nombre: 'Hatha para soltar la semana', nivel: 'todos', profe: 'jorge', sala: 'norte', plazas: 14, libres: 5 },
    /* Sábado */
    { id: 's0930', dia: 5, hora: '09:30', min: 90, disc: 'yoga', nombre: 'Práctica larga de sábado', nivel: 'intermedio', profe: 'ana', sala: 'norte', plazas: 14, libres: 3 },
    { id: 's1130', dia: 5, hora: '11:30', min: 55, disc: 'pilates', nombre: 'Pilates en familia', nivel: 'iniciacion', profe: 'marcos', sala: 'patio', plazas: 12, libres: 8 },
    { id: 's1800', dia: 5, hora: '18:00', min: 75, disc: 'yin', nombre: 'Yin con cuencos', nivel: 'todos', profe: 'lucia', sala: 'patio', plazas: 12, libres: 0 },
    /* Domingo */
    { id: 'd1000', dia: 6, hora: '10:00', min: 60, disc: 'yoga', nombre: 'Yoga lento de domingo', nivel: 'iniciacion', profe: 'jorge', sala: 'norte', plazas: 14, libres: 11 },
    { id: 'd1130', dia: 6, hora: '11:30', min: 45, disc: 'meditacion', nombre: 'Silencio compartido', nivel: 'todos', profe: 'lucia', sala: 'patio', plazas: 16, libres: 14 }
  ];

  var CLAVE_LS = 'salavacia.reservas';
  var CLAVE_NOMBRE = 'salavacia.nombre';
  var TELEFONO_WA = '34924009900';

  /* ---- Estado ---- */
  var filtros = { disc: '', nivel: '', profe: '' };
  var diaActivo = Math.max(0, (new Date().getDay() + 6) % 7); /* hoy, en índice L=0 */
  var reservas = leerReservas();

  function leerReservas() {
    try {
      var r = JSON.parse(localStorage.getItem(CLAVE_LS) || '[]');
      return Array.isArray(r) ? r : [];
    } catch (e) { return []; }
  }
  function guardarReservas() {
    try { localStorage.setItem(CLAVE_LS, JSON.stringify(reservas)); } catch (e) { /* modo privado: la sesión sigue en memoria */ }
  }
  function estaReservada(id) { return reservas.indexOf(id) !== -1; }
  function libresReales(c) { return estaReservada(c.id) ? c.libres - 1 : c.libres; }

  /* ---- Elementos ---- */
  var selDisc = document.getElementById('f-disciplina');
  var selNivel = document.getElementById('f-nivel');
  var selProfe = document.getElementById('f-profesor');
  var btnLimpiar = document.getElementById('f-limpiar');
  var tabs = document.getElementById('horario-dias');
  var listaTus = document.getElementById('tus-clases-lista');
  var vacioTus = document.getElementById('tus-clases-vacio');
  var btnWa = document.getElementById('tus-clases-whatsapp');
  var inputNombre = document.getElementById('tus-clases-nombre');
  var contador = document.getElementById('horario-contador');

  /* ---- Parámetro ?profesor=ana desde profesores.html ---- */
  (function leerURL() {
    var params = new URLSearchParams(location.search);
    var p = params.get('profesor');
    if (p && PROFES[p]) {
      filtros.profe = p;
      selProfe.value = p;
    }
    var d = params.get('disciplina');
    if (d && DISCIPLINAS[d]) {
      filtros.disc = d;
      selDisc.value = d;
    }
  })();

  try { inputNombre.value = localStorage.getItem(CLAVE_NOMBRE) || ''; } catch (e) { /* nada */ }

  /* ---- Pestañas de día (móvil) ---- */
  function pintarTabs() {
    tabs.innerHTML = '';
    DIAS.forEach(function (d, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dia-tab';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', i === diaActivo ? 'true' : 'false');
      b.setAttribute('aria-controls', 'dia-' + i);
      b.setAttribute('aria-label', d);
      b.innerHTML = DIAS_CORTO[i] + '<span>' + d.slice(1, 3) + '</span>';
      b.addEventListener('click', function () {
        diaActivo = i;
        pintarTabs();
        actualizarColumnas();
      });
      tabs.appendChild(b);
    });
  }

  function actualizarColumnas() {
    raiz.querySelectorAll('.columna-dia').forEach(function (col, i) {
      col.classList.toggle('activa', i === diaActivo);
    });
  }

  /* ---- Rejilla ---- */
  function pasaFiltros(c) {
    return (!filtros.disc || c.disc === filtros.disc) &&
           (!filtros.nivel || c.nivel === filtros.nivel || (filtros.nivel !== 'todos' && c.nivel === 'todos')) &&
           (!filtros.profe || c.profe === filtros.profe);
  }

  function tarjeta(c) {
    var libres = libresReales(c);
    var reservada = estaReservada(c.id);
    var art = document.createElement('article');
    art.className = 'clase' + (reservada ? ' clase--reservada' : '') + (libres <= 0 && !reservada ? ' clase--llena' : '');
    art.setAttribute('aria-label', c.nombre + ', ' + DIAS[c.dia] + ' ' + c.hora);

    var clasePlazas = libres <= 0 ? 'sin' : (libres <= 2 ? 'pocas' : '');
    var textoPlazas = libres <= 0 ? 'Completa' : (libres === 1 ? '1 plaza libre' : libres + ' plazas libres');

    art.innerHTML =
      '<span class="etiqueta-disc etiqueta-disc--' + c.disc + '">' + DISCIPLINAS[c.disc] + '</span>' +
      '<div class="clase__hora">' + c.hora + '<small>' + c.min + ' min</small></div>' +
      '<div class="clase__nombre">' + c.nombre + '</div>' +
      '<div class="clase__meta">' + PROFES[c.profe].split(' ')[0] + ' · ' + NIVELES[c.nivel] + ' · ' + SALAS[c.sala] + '</div>' +
      '<div class="clase__plazas ' + clasePlazas + '">' + (reservada ? 'Reservada' : textoPlazas) + '</div>';

    var btn = document.createElement('button');
    btn.type = 'button';
    if (reservada) {
      btn.className = 'boton boton--borde boton--pequeno';
      btn.textContent = 'Cancelar';
      btn.addEventListener('click', function () { cancelar(c.id); });
    } else if (libres <= 0) {
      btn.className = 'boton boton--borde boton--pequeno';
      btn.textContent = 'Avisarme si queda plaza';
      btn.addEventListener('click', function () {
        window.SalaVacia.aviso('Te avisaríamos por WhatsApp si se libera una plaza (demo).');
      });
    } else {
      btn.className = 'boton boton--ciruela boton--pequeno';
      btn.textContent = 'Reservar plaza';
      btn.addEventListener('click', function () { reservar(c.id); });
    }
    art.appendChild(btn);
    return art;
  }

  function pintar() {
    raiz.innerHTML = '';
    var total = 0;
    DIAS.forEach(function (d, i) {
      var col = document.createElement('section');
      col.className = 'columna-dia' + (i === diaActivo ? ' activa' : '');
      col.id = 'dia-' + i;
      col.setAttribute('aria-label', d);
      var clasesDia = CLASES.filter(function (c) { return c.dia === i && pasaFiltros(c); });
      total += clasesDia.length;
      var h = document.createElement('h3');
      h.className = 'columna-dia__titulo';
      h.innerHTML = d + '<small>' + (clasesDia.length === 1 ? '1 clase' : clasesDia.length + ' clases') + '</small>';
      col.appendChild(h);
      if (!clasesDia.length) {
        var v = document.createElement('p');
        v.className = 'columna-dia__vacio';
        v.textContent = filtros.disc || filtros.nivel || filtros.profe ? 'Nada con estos filtros' : 'Sala en silencio';
        col.appendChild(v);
      } else {
        clasesDia.forEach(function (c) { col.appendChild(tarjeta(c)); });
      }
      raiz.appendChild(col);
    });
    if (contador) {
      var partes = [];
      if (filtros.disc) partes.push(DISCIPLINAS[filtros.disc]);
      if (filtros.nivel) partes.push(NIVELES[filtros.nivel].toLowerCase());
      if (filtros.profe) partes.push('con ' + PROFES[filtros.profe].split(' ')[0]);
      contador.textContent = total + (total === 1 ? ' clase' : ' clases') + ' esta semana' + (partes.length ? ' · ' + partes.join(' · ') : '');
    }
    pintarTusClases();
  }

  /* ---- Reservas ---- */
  function buscar(id) {
    for (var i = 0; i < CLASES.length; i++) if (CLASES[i].id === id) return CLASES[i];
    return null;
  }
  function reservar(id) {
    var c = buscar(id);
    if (!c || estaReservada(id) || c.libres <= 0) return;
    reservas.push(id);
    guardarReservas();
    pintar();
    window.SalaVacia.aviso('Plaza guardada: ' + c.nombre + ', ' + DIAS[c.dia].toLowerCase() + ' a las ' + c.hora);
  }
  function cancelar(id) {
    var c = buscar(id);
    reservas = reservas.filter(function (r) { return r !== id; });
    guardarReservas();
    pintar();
    if (c) window.SalaVacia.aviso('Reserva cancelada: ' + c.nombre);
  }

  function ordenarPorSemana(a, b) {
    var ca = buscar(a), cb = buscar(b);
    if (!ca || !cb) return 0;
    return (ca.dia - cb.dia) || ca.hora.localeCompare(cb.hora);
  }

  function pintarTusClases() {
    listaTus.innerHTML = '';
    var validas = reservas.filter(buscar).sort(ordenarPorSemana);
    if (!validas.length) {
      vacioTus.hidden = false;
      btnWa.hidden = true;
      inputNombre.parentElement.hidden = true;
      return;
    }
    vacioTus.hidden = true;
    btnWa.hidden = false;
    inputNombre.parentElement.hidden = false;
    validas.forEach(function (id) {
      var c = buscar(id);
      var li = document.createElement('li');
      var info = document.createElement('div');
      info.innerHTML = '<strong>' + c.nombre + '</strong><br><span>' + DIAS[c.dia] + ' · ' + c.hora + ' · ' + PROFES[c.profe].split(' ')[0] + ' · ' + SALAS[c.sala] + '</span>';
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'boton boton--borde boton--pequeno';
      b.textContent = 'Cancelar';
      b.setAttribute('aria-label', 'Cancelar ' + c.nombre + ' del ' + DIAS[c.dia].toLowerCase());
      b.addEventListener('click', function () { cancelar(id); });
      li.appendChild(info);
      li.appendChild(b);
      listaTus.appendChild(li);
    });
    actualizarWhatsApp(validas);
  }

  function actualizarWhatsApp(validas) {
    var nombre = (inputNombre.value || '').trim();
    var lineas = validas.map(function (id) {
      var c = buscar(id);
      return '• ' + DIAS[c.dia] + ' ' + c.hora + ' — ' + c.nombre + ' (' + PROFES[c.profe].split(' ')[0] + ')';
    });
    var texto = 'Hola, Sala Vacía. ' + (nombre ? 'Soy ' + nombre + ' y quiero' : 'Quiero') + ' confirmar estas plazas:\n' +
      lineas.join('\n') + '\n¿Me las guardáis? Gracias.';
    btnWa.href = 'https://wa.me/' + TELEFONO_WA + '?text=' + encodeURIComponent(texto);
  }

  inputNombre.addEventListener('input', function () {
    try { localStorage.setItem(CLAVE_NOMBRE, inputNombre.value); } catch (e) { /* nada */ }
    actualizarWhatsApp(reservas.filter(buscar).sort(ordenarPorSemana));
  });

  /* ---- Filtros ---- */
  function alCambiar() {
    filtros.disc = selDisc.value;
    filtros.nivel = selNivel.value;
    filtros.profe = selProfe.value;
    pintar();
  }
  selDisc.addEventListener('change', alCambiar);
  selNivel.addEventListener('change', alCambiar);
  selProfe.addEventListener('change', alCambiar);
  btnLimpiar.addEventListener('click', function () {
    selDisc.value = ''; selNivel.value = ''; selProfe.value = '';
    alCambiar();
    if (location.search) history.replaceState(null, '', location.pathname + '#horario');
  });

  /* Botones "ver horario de X" en otras partes de la misma página */
  document.querySelectorAll('[data-filtro-disc]').forEach(function (a) {
    a.addEventListener('click', function () {
      selDisc.value = a.getAttribute('data-filtro-disc');
      selNivel.value = ''; selProfe.value = '';
      alCambiar();
    });
  });
  document.querySelectorAll('[data-filtro-profe]').forEach(function (a) {
    a.addEventListener('click', function () {
      selProfe.value = a.getAttribute('data-filtro-profe');
      selDisc.value = ''; selNivel.value = '';
      alCambiar();
    });
  });

  pintarTabs();
  pintar();
})();
