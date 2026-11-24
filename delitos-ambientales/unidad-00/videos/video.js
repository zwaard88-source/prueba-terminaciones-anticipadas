/* Reproductor de casos en video · JP-OVA (reuniones con Juan del 27 y del 30/10/2026)
   Juan (30/10/2026): «que siempre salga el video sin lengua de señas, pero que tenga un botoncito… para ver el video con
   lengua de señas», con la URL lista para poner el video después. Lee la lista de la unidad (script#videos) y muestra el
   pedido en ?video=ID: la versión sin lengua de señas por defecto y la otra al pulsar su botón, cada una con sus
   subtítulos (<track kind="subtitles">). Basta copiar el archivo con su nombre en medios/ para que se vea, sin regenerar:
   si la ruta está vacía o el archivo aún no existe, el marco dice «Video en producción», sin errores. Con &revision=1 se
   ven el título, el estado y las rutas previstas. Nunca se inventa el contenido del video. */
(function () {
  'use strict';
  var lista = JSON.parse(document.getElementById('videos').textContent);
  var raiz = document.querySelector('[data-video]');
  var video = raiz.querySelector('video'), fuente = video.querySelector('source'), pista = video.querySelector('track');
  var pendiente = raiz.querySelector('.video-pendiente'), cc = raiz.querySelector('.video-cc');
  var conSubtitulos = true, cambiando = false;
  var botones = raiz.querySelectorAll('.video-version');
  var params = new URLSearchParams(location.search);
  var pedido = params.get('video'), revision = params.has('revision');
  var actual = lista.filter(function (v) { return v.id === pedido; })[0];
  var ESTADOS = { pendiente_confirmacion: 'Pendiente de confirmación de JP', confirmado: 'Pendiente de entrega del video', entregado: 'Entregado' };
  var AVISOS = {
    normal: ['Video en producción', 'Muy pronto podrá ver aquí este video.'],
    senas: ['Video con lengua de señas en producción', 'Mientras tanto, puede verlo sin lengua de señas.']
  };

  function avisar(v, version) {
    var m = v[version] || {}, t = AVISOS[version] || AVISOS.normal;
    video.pause(); video.hidden = true; cc.hidden = true;
    pendiente.hidden = false;
    pendiente.querySelector('.pendiente-titulo').textContent = t[0];
    pendiente.querySelector('.pendiente-detalle').textContent = t[1];
    var ruta = pendiente.querySelector('.pendiente-ruta');
    ruta.hidden = !revision;
    ruta.textContent = v.id ? 'Archivo previsto: ' + (m.src || 'sin ruta') + ' · Subtítulos: ' + (m.subtitulos || 'sin ruta')
      : 'El video «' + pedido + '» no está en la lista de esta unidad.';
  }
  function cargar(v, version) {
    /* Con o sin señas es el MISMO video (Juan, Sebastián y Esteban, 08/11/2026): solo se pone o se quita el recuadro, sin
       recargar, así que sigue en el mismo minuto. */
    if (senas && v.normal && fuente.getAttribute('src') === v.normal.src) {
      raiz.dataset.version = version;
      botones.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.version === version)); });
      senas.mostrar(version === 'senas');
      return;
    }
    var m = v[version] || {};
    raiz.dataset.version = version;
    botones.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.version === version)); });
    video.pause();
    if (!m.src) { avisar(v, version); return; }
    pendiente.hidden = true; video.hidden = false; cc.hidden = !m.subtitulos;
    fuente.setAttribute('src', m.src);
    /* Una pista nueva por versión: el navegador no siempre recarga una <track> a la que solo se le cambia el src. */
    var nueva = pista.cloneNode(false);
    if (m.subtitulos) nueva.setAttribute('src', m.subtitulos); else nueva.removeAttribute('src');
    nueva.default = !!m.subtitulos && conSubtitulos;
    cambiando = true;
    nueva.addEventListener('error', function () { cc.hidden = true; });
    video.replaceChild(nueva, pista); pista = nueva;
    video.load();
  }
  /* El archivo que falta o no se puede reproducir avisa en el marco, solo si sigue siendo el de la versión elegida. */
  function fallo() {
    var m = actual && actual.normal;
    if (m && fuente.getAttribute('src') === m.src) avisar(actual, 'normal');
  }
  fuente.addEventListener('error', fallo);
  video.addEventListener('error', fallo);
  video.addEventListener('loadedmetadata', function () {
    aplicarSubtitulos();
    setTimeout(function () { cambiando = false; }, 300);   // la pista nueva pasa por «disabled» al cambiar de versión: no es una decisión de la persona
  });
  /* Subtítulos: se encienden y se apagan desde este botón o desde el menú del video, y los dos dicen lo mismo. «hidden» y no
     «disabled», para que la pista siga cargada. La preferencia se conserva al cambiar de versión. */
  function pintarSubtitulos() {
    var txt = cc.querySelector('.video-cc-txt');
    if (txt) txt.textContent = 'Subtítulos: ' + (conSubtitulos ? 'sí' : 'no');
    cc.classList.toggle('apagados', !conSubtitulos);
    cc.title = conSubtitulos ? 'Quitar los subtítulos en español' : 'Mostrar los subtítulos en español';
  }
  function aplicarSubtitulos() {
    var pistas = video.textTracks, t = pistas && pistas[0];
    if (t && pista.getAttribute('src')) t.mode = conSubtitulos ? 'showing' : 'hidden';
    pintarSubtitulos();
  }
  cc.addEventListener('click', function () { conSubtitulos = !conSubtitulos; cambiando = false; aplicarSubtitulos(); });
  if (video.textTracks && video.textTracks.addEventListener) video.textTracks.addEventListener('change', function () {
    var t = video.textTracks[0];
    if (!t || cambiando) return;
    var on = t.mode === 'showing';
    if (on !== conSubtitulos) { conSubtitulos = on; pintarSubtitulos(); }
  });
  /* Al terminar se ofrece repetir el video con un botón visible. */
  var repetir = document.createElement('button');
  repetir.type = 'button'; repetir.className = 'video-repetir'; repetir.hidden = true; repetir.textContent = 'Reproducir nuevamente';
  video.parentNode.appendChild(repetir);
  repetir.addEventListener('click', function () { repetir.hidden = true; video.currentTime = 0; video.play(); video.focus(); });
  video.addEventListener('ended', function () { repetir.hidden = false; });
  video.addEventListener('play', function () { repetir.hidden = true; });

  /* Lengua de señas superpuesta (reunión con Juan y Sebastián, 08/11/2026): «Ver con lengua de señas» pone sobre el mismo video un
     recuadro con la intérprete, sincronizado en reproducción, pausa, salto y velocidad; «Ver sin…» lo quita. Evita exportar cada
     video dos veces. El clip real es medios/<id>-interprete.mp4 (solo la intérprete, fondo blanco o gris; basta copiarlo con ese
     nombre). Mientras no exista, va una figura animada PROVISIONAL (Esteban, 08/11/2026: «un muñeco animado… para mientras tanto»)
     que sigue el habla de la transcripción, siempre según el tiempo del video. Sus gestos son ilustrativos: NO es interpretación en
     lengua de señas, y el recuadro lo dice a la vista. */
  var senas = null, lineasSenas = null;
  var MANOS = {
    abierta: 'M-7 -8 L-11 -21 M-2.5 -10 L-4 -25 M2.5 -10 L4 -25 M7 -8 L11 -21 M-9 3 L-18 -5',
    plana: 'M-6 -8 L-6 -25 M-2 -9 L-2 -27 M2 -9 L2 -27 M6 -8 L6 -25 M-9 3 L-15 -7',
    indice: 'M0 -9 L0 -27 M-9 3 L-15 -4',
    pinza: 'M-1 -9 L6 -22 M5 -8 L6 -22 M-9 2 L-12 -7',
    puno: 'M-6 -9 L6 -9 M-9 3 L-13 -5'
  };
  /* [x e y de la muñeca izquierda en pantalla, x e y de la derecha, mano izq., mano der., giro izq., giro der.] */
  var POSES = [
    [64, 128, 136, 128, 'abierta', 'abierta', -18, 18], [78, 104, 128, 150, 'indice', 'plana', -8, 28], [62, 150, 126, 108, 'plana', 'indice', -32, 6],
    [86, 142, 114, 142, 'puno', 'plana', -4, 4], [56, 116, 142, 152, 'abierta', 'pinza', -30, 20], [72, 100, 128, 100, 'pinza', 'pinza', -14, 14],
    [92, 122, 140, 122, 'plana', 'abierta', 12, 34], [60, 140, 110, 114, 'puno', 'indice', -26, -6], [82, 160, 118, 160, 'abierta', 'abierta', -40, 40],
    [68, 106, 144, 138, 'indice', 'puno', -22, 30], [100, 104, 142, 112, 'pinza', 'plana', 0, 24], [58, 128, 116, 134, 'abierta', 'puno', -36, 10]
  ];
  var REPOSO = [84, 190, 116, 190, 'plana', 'plana', -60, 60];
  function hash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function suave(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
  /* Pose y fase para un instante del video: la misma siempre, por eso al cambiar en el minuto 3:28 arranca en el 3:28. */
  function gesto(t) {
    var l = null;
    if (lineasSenas) for (var i = 0; i < lineasSenas.length; i++) { if (lineasSenas[i].i <= t && t < lineasSenas[i].f) { l = lineasSenas[i]; break; } }
    if (lineasSenas && !l) return { a: REPOSO, b: REPOSO, f: 1, habla: false };
    var palabras = l ? l.t.split(/\s+/).filter(Boolean) : null;
    var d = l ? Math.max(0.3, (l.f - l.i) / palabras.length) : 0.55, base = l ? l.i : 0, k = Math.floor((t - base) / d);
    var clave = function (n) { return palabras ? (palabras[n] || palabras[0]) + n : 'b' + n; };
    return { a: k > 0 ? POSES[hash(clave(k - 1)) % POSES.length] : REPOSO, b: POSES[hash(clave(k)) % POSES.length], f: ((t - base) / d - k) / 0.55, habla: true };
  }
  function brazo(hx, hy, wx, wy, lado) {
    var L1 = 44, L2 = 46, dx = wx - hx, dy = wy - hy, D = Math.min(Math.hypot(dx, dy) || 1, L1 + L2 - 1), a = (L1 * L1 - L2 * L2 + D * D) / (2 * D), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
    var ux = dx / (Math.hypot(dx, dy) || 1), uy = dy / (Math.hypot(dx, dy) || 1);
    var ex = hx + a * ux - lado * h * uy * -1, ey = hy + a * uy + lado * h * ux * -1;
    if (ey < hy + 8) { ex = hx + a * ux + lado * h * uy * -1; ey = hy + a * uy - lado * h * ux * -1; }
    return 'M' + hx + ' ' + hy + ' L' + ex.toFixed(1) + ' ' + ey.toFixed(1) + ' L' + wx.toFixed(1) + ' ' + wy.toFixed(1);
  }
  function montarSenas(v) {
    var marco = raiz.querySelector('.video-marco');
    var caja = document.createElement('div');
    caja.className = 'video-senas'; caja.hidden = true;
    caja.innerHTML = '<svg class="senas-avatar" viewBox="0 0 200 215" role="img" aria-label="Figura animada provisional; no es interpretación en lengua de señas">' +
      '<path class="sn-cuerpo" d="M44 215 C46 140 60 112 100 108 C140 112 154 140 156 215 Z"/><rect class="sn-piel" x="89" y="84" width="22" height="30" rx="9"/>' +
      '<path class="sn-cuello" d="M86 110 L100 126 L114 110 Z"/><circle class="sn-piel" cx="100" cy="62" r="29"/>' +
      '<path class="sn-pelo" d="M70 64 C66 30 92 26 104 28 C128 28 136 46 130 66 C126 52 118 46 108 46 C94 50 80 46 74 50 C72 54 71 58 70 64 Z"/>' +
      '<path class="sn-ceja a" d="M83 56 q6 -4 12 -1"/><path class="sn-ceja b" d="M105 55 q6 -3 12 1"/><circle class="sn-ojo" cx="89" cy="64" r="2.8"/><circle class="sn-ojo" cx="111" cy="64" r="2.8"/>' +
      '<ellipse class="sn-boca" cx="100" cy="78" rx="6.5" ry="1.8"/>' +
      '<path class="sn-brazo-borde i"/><path class="sn-brazo-borde d"/><path class="sn-brazo i"/><path class="sn-brazo d"/>' +
      '<g class="sn-mano i"><circle r="11"/><path/></g><g class="sn-mano d"><circle r="11"/><path/></g></svg>' +
      '<video class="senas-clip" muted playsinline preload="metadata" hidden></video>' +
      '<span class="senas-rotulo" title="Figura ilustrativa mientras llega el video de la intérprete. No es interpretación en lengua de señas.">Intérprete provisional</span>';
    var full = document.createElement('button');
    full.type = 'button'; full.className = 'senas-full'; full.hidden = true; full.setAttribute('aria-label', 'Ver en pantalla completa con la intérprete');
    full.innerHTML = '<i class="fas fa-expand" aria-hidden="true"></i>';
    full.addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen(); else if (marco.requestFullscreen) marco.requestFullscreen().catch(function () {});
    });
    marco.appendChild(caja); marco.appendChild(full);
    /* «senasLado: 'izquierda'» (Esteban, 19/11/2026, Terminaciones: «deberías poner a la intérprete al otro lado, ya que tapa al
       que está hablando»). Se probó también sobre el edificio, a la altura de la cara, pero el óvalo quedaba pequeño, y Esteban
       pidió volver a esta posición: abajo a la izquierda, sobre el piso de la imagen. Si el video deja franja negra abajo (marco
       más alto que 16:9, como en el aula), entra hasta un 60 % en ella. Siempre queda por encima de los controles. Se recalcula al
       cambiar el tamaño y en pantalla completa. Sin la opción, sigue abajo a la derecha (CSS). */
    function colocar() {
      if ((v.senasLado !== 'izquierda' && v.senasLado !== 'derecha-arriba' && v.senasLado !== 'derecha-centro') || caja.hidden) return;
      var W = marco.clientWidth, H = marco.clientHeight, ar = (video.videoWidth / video.videoHeight) || 16 / 9;
      var pw = W, ph = W / ar; if (ph > H) { ph = H; pw = H * ar; }
      var px = (W - pw) / 2, pBajo = (H + ph) / 2;
      /* «senasLado: 'derecha-arriba'» (Esteban, 21/11/2026, presentación de Tráfico, con la imagen marcada: «la intérprete tiene
         que ir a la derecha, en la parte superior, a la altura de la cabeza del que habla… por donde está el árbol»): el óvalo va
         arriba a la derecha de la imagen, al lado de la cabeza de quien habla, sin tapar su rostro, los logos ni el rótulo. */
      /* «senasLado: 'derecha-centro'» (Esteban, 23/11/2026, presentación de Bienes, con la imagen marcada en rojo; «derecha-arriba»
         «quedó muy arriba… y muy pequeño»): óvalo grande (la mitad del alto de la imagen) centrado al 80 % del ancho y al 45 % del
         alto, sobre el fondo a la derecha de quien habla. */
      if (v.senasLado === 'derecha-centro') {
        var hc = Math.max(110, 0.5 * ph), wc = hc * 0.9, pTop = (H - ph) / 2;
        var lc = Math.min(px + 0.8 * pw - wc / 2, px + pw - wc - Math.max(8, 0.012 * pw));
        caja.style.cssText = 'left:' + Math.round(lc) + 'px;right:auto;top:' + Math.round(pTop + 0.45 * ph - hc / 2) + 'px;bottom:auto;height:' + Math.round(hc) + 'px;width:' + Math.round(wc) + 'px';
        return;
      }
      if (v.senasLado === 'derecha-arriba') {
        var ha = Math.max(84, 0.36 * ph), wa = ha * 0.9, pAlto = (H - ph) / 2;
        caja.style.cssText = 'left:' + Math.round(px + pw - wa - Math.max(8, 0.012 * pw)) + 'px;right:auto;top:' + Math.round(pAlto + 0.05 * ph) + 'px;bottom:auto;height:' + Math.round(ha) + 'px;width:' + Math.round(wa) + 'px';
        return;
      }
      var h = Math.max(90, Math.min(0.28 * H, 0.42 * ph + (H - ph) / 2)), w = h * 0.9;
      /* «senasSubir» (Esteban, 20/11/2026, presentación de Tráfico: «la intérprete está tapando las letras, súbela más»): cuando el
         video trae abajo a la izquierda el rótulo con el nombre de quien habla, el óvalo sube esa fracción del alto de la imagen
         (0,27 = su borde inferior queda al 73 % de la imagen, por encima del rótulo). Sin la opción, la posición de siempre. */
      var sube = +v.senasSubir || 0;
      var bajo = sube ? Math.min(H - 52, pBajo - sube * ph) : Math.min(H - 52, pBajo + 0.6 * h);
      caja.style.cssText = 'left:' + Math.round(px + Math.max(10, 0.015 * pw)) + 'px;right:auto;top:' + Math.round(bajo - h) + 'px;bottom:auto;height:' + Math.round(h) + 'px;width:' + Math.round(w) + 'px';
    }
    if (v.senasLado === 'izquierda' || v.senasLado === 'derecha-arriba' || v.senasLado === 'derecha-centro') {
      window.addEventListener('resize', colocar); document.addEventListener('fullscreenchange', function () { setTimeout(colocar, 60); });
      video.addEventListener('loadedmetadata', colocar);
    }
    var q = function (s) { return caja.querySelector(s); }, clip = q('.senas-clip'), avatar = q('.senas-avatar'), rotulo = q('.senas-rotulo'), conClip = false, activo = false, rq = null;
    var bi = q('.sn-brazo.i'), bd = q('.sn-brazo.d'), mi = q('.sn-mano.i'), md = q('.sn-mano.d'), boca = q('.sn-boca'), cejas = caja.querySelectorAll('.sn-ceja');
    var mix = function (x, y, f) { return x + (y - x) * f; };
    var alLlegar = null;
    clip.addEventListener('loadeddata', function () {
      conClip = true; clip.hidden = false; avatar.style.display = 'none'; rotulo.hidden = true;
      if (alLlegar) { alLlegar(); alLlegar = null; }
    });
    clip.addEventListener('error', function () { conClip = false; });
    if (v.id && location.protocol !== 'file:') clip.src = 'medios/' + v.id + '-interprete.mp4';
    function pintar() {
      var t = video.currentTime;
      if (conClip) {
        /* Sincronía (Esteban, 11/11/2026: «debe de estar sincronizado»): si la intérprete se aleja más de 0,25 s salta al
           tiempo del video; con un desfase menor, acelera o frena un 6 % hasta quedar a menos de 0,04 s, sin saltos. */
        var des = clip.currentTime - t;
        /* Un salto a la vez: si se vuelve a pedir en cada cuadro mientras el anterior carga, el clip nunca arranca. */
        if (Math.abs(des) > 0.25) { if (!clip.seeking) clip.currentTime = t + (video.paused ? 0 : 0.1); des = 0; }
        var ritmo = video.playbackRate * (video.paused || Math.abs(des) < 0.04 ? 1 : des > 0 ? 0.94 : 1.06);
        if (Math.abs(clip.playbackRate - ritmo) > 0.001) clip.playbackRate = ritmo;
        if (video.paused !== clip.paused) { if (video.paused) clip.pause(); else clip.play().catch(function () {}); }
      } else {
        var g = gesto(t), f = suave(g.f), A = g.a, B = g.b, vida = g.habla ? Math.sin(t * 7) * 1.6 : 0;
        var lx = mix(A[0], B[0], f) + vida, ly = mix(A[1], B[1], f) - vida, rx = mix(A[2], B[2], f) - vida, ry = mix(A[3], B[3], f) + vida;
        var di = brazo(58, 124, lx, ly, -1), dd = brazo(142, 124, rx, ry, 1); bi.setAttribute('d', di); bd.setAttribute('d', dd); q('.sn-brazo-borde.i').setAttribute('d', di); q('.sn-brazo-borde.d').setAttribute('d', dd);
        mi.setAttribute('transform', 'translate(' + lx.toFixed(1) + ' ' + (ly - 4).toFixed(1) + ') rotate(' + mix(A[6], B[6], f).toFixed(1) + ')');
        md.setAttribute('transform', 'translate(' + rx.toFixed(1) + ' ' + (ry - 4).toFixed(1) + ') rotate(' + mix(A[7], B[7], f).toFixed(1) + ')');
        mi.querySelector('path').setAttribute('d', MANOS[f < 0.5 ? A[4] : B[4]]); md.querySelector('path').setAttribute('d', MANOS[f < 0.5 ? A[5] : B[5]]);
        boca.setAttribute('ry', g.habla && !video.paused ? (2 + Math.abs(Math.sin(t * 11)) * 3.4).toFixed(1) : '1.8');
        var ceja = g.habla ? Math.sin(t * 2.3) * 1.5 : 0;
        cejas.forEach(function (c) { c.setAttribute('transform', 'translate(0 ' + ceja.toFixed(1) + ')'); });
      }
      if (activo) rq = requestAnimationFrame(pintar);
    }
    return {
      /* Avisa cuando el clip real de la intérprete cargó (si ya cargó, de inmediato). */
      conClipReal: function (f) { if (conClip) f(); else alLlegar = f; },
      mostrar: function (si) {
        activo = si; caja.hidden = !si; full.hidden = !si; colocar();
        /* El botón de pantalla completa del navegador solo agranda el video y dejaría fuera el recuadro. */
        video.setAttribute('controlslist', si ? 'nodownload nofullscreen' : 'nodownload');   /* descarga bloqueada (Juan, 09/11/2026: propiedad de los videos) */
        cancelAnimationFrame(rq);
        if (si) pintar(); else { clip.pause(); if (document.fullscreenElement === marco) document.exitFullscreen(); }
      }
    };
  }

  /* Transcripción sincronizada (Esteban, 07/11/2026: «el video hacia la izquierda y a la derecha vaya apareciendo la
     transcripción a medida que va hablando… y que cuando ponga el cursor sobre lo que se ha estado hablando se devuelva el
     video hasta ahí»). Solo si existe medios/<id>.transcripcion.json; si no, el reproductor queda como siempre.
     Cada frase aparece cuando se dice. Dentro de la frase que suena, el resaltado avanza palabra por palabra con la voz
     (Esteban, 11/11/2026: «que el resaltado aparezca a medida que va hablando, se vaya resaltando»): cada palabra toma su
     tiempo de «w» (herramientas/transcripcion_palabras.py, lo que oye Whisper) y, si la transcripción no lo trae, se reparte
     el tiempo de la frase según el largo de sus palabras y sus pausas de puntuación. Sobre una frase ya dicha: al dejar el cursor un instante
     (o al hacer clic, o con Enter) el video vuelve a ese punto. Sirve igual para la versión con lengua de señas. */
  var trans = null;
  function mmss(s) { s = Math.max(0, Math.floor(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
  function montarTranscripcion(datos) {
    lineasSenas = datos.lineas;
    var aside = document.createElement('aside');
    aside.className = 'video-trans'; aside.setAttribute('aria-label', 'Transcripción del video');
    aside.innerHTML = '<div class="trans-cab"><span class="trans-tit"><i class="fas fa-align-left" aria-hidden="true"></i> Transcripción</span>' +
      (datos.automatica && !datos.revisada ? '<span class="trans-aviso">Automática · en revisión</span>' : '') + '</div>' +
      '<p class="trans-vacia">La transcripción aparece a medida que se habla. Pulse reproducir.</p>' +
      '<div class="trans-texto" tabindex="0"></div>' +
      '<p class="trans-ayuda"><i class="fas fa-rotate-left" aria-hidden="true"></i> Ponga el cursor sobre una frase ya dicha para volver a ese punto.</p>';
    var caja = aside.querySelector('.trans-texto'), vacia = aside.querySelector('.trans-vacia');
    var parrafos = {}, frases = [];
    function palabrasDe(l, s) {
      var textos = l.t.split(/\s+/).filter(Boolean), tiempos = l.w && l.w.length === textos.length ? l.w : null;
      if (!tiempos) {
        var pesos = textos.map(function (p) { return p.length + 1 + (/[.;:?!]$/.test(p) ? 6 : /,$/.test(p) ? 3 : 0); });
        var total = pesos.reduce(function (a, b) { return a + b; }, 0) || 1, ac = 0;
        tiempos = pesos.map(function (x) { var t = l.i + (l.f - l.i) * ac / total; ac += x; return t; });
      }
      return textos.map(function (p, k) {
        var e = document.createElement('span'); e.className = 'trans-pal'; e.textContent = p + ' ';
        s.appendChild(e); return { el: e, t: tiempos[k] };
      });
    }
    datos.lineas.forEach(function (l, k) {
      var p = parrafos[l.p];
      if (!p) { p = parrafos[l.p] = document.createElement('p'); p.className = 'trans-p'; caja.appendChild(p); }
      var s = document.createElement('span');
      s.className = 'trans-frase por-decir';
      var pals = palabrasDe(l, s);
      s.setAttribute('role', 'button'); s.tabIndex = -1;
      s.title = 'Volver a ' + mmss(l.i); s.dataset.i = l.i;
      p.appendChild(s); frases.push({ el: s, i: l.i, f: l.f, p: p, pals: pals, n: 0 });
    });
    /* Video, botones y transcripción van en un bloque interno: las reglas angostas (@container ova) no pueden cambiar el
       propio contenedor, sí a sus hijos. */
    var marco = raiz.querySelector('.video-marco'), opciones = raiz.querySelector('.video-opciones');
    var cuerpo = document.createElement('div'); cuerpo.className = 'video-cuerpo';
    marco.parentNode.insertBefore(cuerpo, marco);
    cuerpo.appendChild(marco); cuerpo.appendChild(opciones); cuerpo.appendChild(aside);
    raiz.classList.add('con-transcripcion');
    var espera = null, sobre = false;
    function ir(fr) { video.currentTime = fr.i + 0.01; actualizar(); }
    frases.forEach(function (fr) {
      fr.el.addEventListener('mouseenter', function () {
        if (fr.el.classList.contains('por-decir')) return;
        clearTimeout(espera); espera = setTimeout(function () { ir(fr); }, 600);
      });
      fr.el.addEventListener('mouseleave', function () { clearTimeout(espera); });
      fr.el.addEventListener('click', function () { clearTimeout(espera); ir(fr); if (video.paused) video.play(); });
      fr.el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ir(fr); } });
    });
    caja.addEventListener('mouseenter', function () { sobre = true; });
    caja.addEventListener('mouseleave', function () { sobre = false; });
    /* Resaltado que avanza: en la frase que suena quedan marcadas las palabras ya dichas y subrayada la que suena. */
    var sonando = null;
    function pintarPalabras(fr, t) {
      if (sonando && sonando !== fr) { sonando.pals.forEach(function (p) { p.el.classList.remove('dicha', 'sonando'); }); sonando.n = 0; }
      sonando = fr;
      if (!fr) return;
      var n = 0;
      while (n < fr.pals.length && fr.pals[n].t <= t + 0.05) n++;
      if (n === fr.n) return;
      fr.pals.forEach(function (p, k) { p.el.classList.toggle('dicha', k < n); p.el.classList.toggle('sonando', k === n - 1); });
      fr.n = n;
    }
    var alcanzado = 0;   // lo ya escuchado sigue a la vista aunque se vuelva atrás, para poder ir también hacia adelante
    function actualizar() {
      var t = video.currentTime, actualFr = null, alguna = false;
      alcanzado = Math.max(alcanzado, t);
      frases.forEach(function (fr) {
        var dicha = fr.i <= alcanzado + 0.05;
        fr.el.classList.toggle('por-decir', !dicha);
        fr.el.tabIndex = dicha ? 0 : -1;
        var es = fr.i <= t + 0.05 && t < fr.f;
        fr.el.classList.toggle('actual', es);
        if (es) actualFr = fr;
        if (dicha) alguna = true;
      });
      pintarPalabras(actualFr, t);
      Object.keys(parrafos).forEach(function (k) { parrafos[k].hidden = !parrafos[k].querySelector('.trans-frase:not(.por-decir)'); });
      vacia.hidden = alguna;
      /* La frase que suena queda a la vista, dentro del panel (sin mover la página que contiene el iframe). */
      if (actualFr && !sobre) {
        var top = actualFr.el.getBoundingClientRect().top - caja.getBoundingClientRect().top + caja.scrollTop, alto = caja.clientHeight;
        if (top < caja.scrollTop + 8 || top > caja.scrollTop + alto - 40) caja.scrollTop = Math.max(0, top - alto * 0.35);
      }
    }
    video.addEventListener('timeupdate', actualizar);
    video.addEventListener('seeked', actualizar);
    /* timeupdate llega unas 4 veces por segundo: mientras el video corre, las palabras se pintan en cada cuadro. */
    var cuadro = null;
    function seguir() {
      cuadro = null;
      if (video.paused || video.ended) return;
      var t = video.currentTime;
      if (sonando && sonando.i <= t + 0.05 && t < sonando.f) pintarPalabras(sonando, t); else actualizar();
      cuadro = requestAnimationFrame(seguir);
    }
    video.addEventListener('play', function () { if (!cuadro) cuadro = requestAnimationFrame(seguir); });
    if (!video.paused) cuadro = requestAnimationFrame(seguir);
    trans = { actualizar: actualizar };
    actualizar();
  }
  function cargarTranscripcion(v) {
    if (!v.id || trans || location.protocol === 'file:') return;
    fetch(v.transcripcion || ('medios/' + v.id + '.transcripcion.json'), { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.lineas && d.lineas.length) montarTranscripcion(d); })
      .catch(function () {});
  }

  if (pedido) {
    var v = actual || { id: '' };
    /* La pestaña lleva el título del video, no un rótulo genérico (aula, 12/11/2026: la presentación de la unidad se titulaba
       «Video del caso · Unidad 1»). Sin título de JP, su ubicación (lección y apartado); sin ninguno, el de la plantilla. */
    if (v.titulo || v.ubicacion) document.title = v.titulo || v.ubicacion;
    cargarTranscripcion(v);
    if (revision) {
      raiz.querySelector('.video-cab').hidden = false;
      raiz.querySelector('.video-titulo').textContent = v.titulo || v.ubicacion || 'Título pendiente de JP';
      var estado = raiz.querySelector('.video-estado');
      if (ESTADOS[v.estado]) { estado.hidden = false; estado.textContent = ESTADOS[v.estado]; }
    }
    botones.forEach(function (b) {
      b.addEventListener('click', function () { cargar(v, b.dataset.version); });
    });
    cargar(v, 'normal');
    /* Los casos no llevan lengua de señas, solo los videos que presentan los profesores (Juan, 09/11/2026): sin botones de versión. */
    var opciones = raiz.querySelector('.video-opciones');
    if (v.sinSenas) opciones.hidden = true;
    else if (v.id) {
      senas = montarSenas(v);
      /* «senasConClip» (12/11/2026; reunión del 05/11: sin la versión en lengua de señas, su botón no se presenta como un
         recurso que funciona): los botones de versión solo aparecen cuando existe el clip real de la intérprete
         (medios/<id>-interprete.mp4). Basta copiar el clip con ese nombre, sin tocar el HTML; mientras falte, no hay botones ni
         figura provisional. Los videos sin esta marca se comportan como antes. */
      if (v.senasConClip) { opciones.hidden = true; senas.conClipReal(function () { opciones.hidden = false; }); }
    }
    return;
  }

  /* Sin ?video: lista de revisión con el estado de cada caso de la unidad. */
  raiz.classList.add('modo-lista');
  raiz.querySelector('.video-cab').hidden = false;
  raiz.querySelector('.video-titulo').textContent = 'Videos de casos de la unidad (' + lista.length + ')';
  raiz.querySelector('.video-marco').hidden = true; raiz.querySelector('.video-opciones').hidden = true;
  var nav = raiz.querySelector('.video-lista');
  nav.hidden = false;
  nav.innerHTML = lista.map(function (v) {
    return '<a class="video-item" href="?video=' + encodeURIComponent(v.id) + '&amp;revision=1"><span class="item-id">' + v.id + '</span>' +
      '<span class="item-ubica">' + v.ubicacion + '</span><span class="item-estado e-' + v.estado + '">' + (ESTADOS[v.estado] || 'Entregado') + '</span></a>';
  }).join('');
})();
