# Sala Vacía · estudio de yoga y pilates (Mérida)

Web de muestra para un estudio ficticio de yoga, pilates, yin y meditación. Diseño sereno y espacioso: arena, salvia, piedra y un acento ciruela; Cormorant para titulares y Nunito para el texto; fotos recortadas en arcos y transiciones lentas.

## Qué tiene

- **Círculo de respiración** en el hero (SVG, ritmo 4-4-6). Al pulsarlo guía una respiración de un minuto con cuenta atrás. Con `prefers-reduced-motion` el círculo queda estático.
- **Horario semanal** generado desde datos en `js/horario.js`, con filtros por disciplina, nivel y profesor; pestañas L–D en móvil y rejilla de 7 columnas en escritorio.
- **Reserva simulada**: cada clase tiene plazas libres; «Reservar plaza» guarda en `localStorage`, aparece en «Tus clases» con opción de cancelar y un botón de WhatsApp con el mensaje ya escrito.
- `index.html?profesor=ana#horario` (o `?disciplina=yin`) abre el horario ya filtrado; lo usan las fichas de `profesores.html`.
- **Comparador de tarifas** en `precios.html`: un slider de clases por semana resalta el bono más económico y calcula el precio por clase.
- Acordeón accesible en `faq.html` (teclado, `aria-expanded`, apertura por `#id`).

## Abrir en local

Doble clic en `index.html` funciona (todo es `file://` compatible). Para probar con servidor:

```
python -m http.server 8000
```

y abrir `http://localhost:8000/`.

## Qué personalizar

- **Clases y profesores**: el array `CLASES` y los objetos `PROFES`, `DISCIPLINAS`, `SALAS` en `js/horario.js`.
- **Tarifas**: el array `TARIFAS` en `js/precios.js` y las tarjetas de `precios.html`.
- **Teléfono/WhatsApp**: `924 00 99 00` y `34924009900` en los HTML y en `TELEFONO_WA` de `js/horario.js`.
- **Colores y tipografías**: variables en `:root` de `css/estilos.css`.
- **Fotos**: URLs de Unsplash en cada `<img>`; si una falla se pinta un degradado de la paleta.

Sitio de demostración · negocio ficticio · Fotografías: Unsplash.
