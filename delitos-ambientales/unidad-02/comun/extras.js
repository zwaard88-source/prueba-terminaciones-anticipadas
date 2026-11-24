/* DA revisado (24 nov 2026): apoyos de cada página, fuera del motor. La escena del iframe es fija (?escena=N); la página
   puede traer: «pildora» (audio corto con el objetivo), «mapaMental» (PNG en ventana, con descarga) y «lectura» (PDF). */
(function () {
  'use strict';
  var R = function (u) { return typeof window.__R === 'function' ? window.__R(u) : u; };
  var datos = JSON.parse(document.getElementById('contenido').textContent);
  var q = new URLSearchParams(window.__Q || location.search), n = Number(q.get('escena')) || 1;
  var e = datos.scenes[n - 1];
  if (!e || !(e.pildora || e.mapaMental || e.lectura || e.nota)) return;
  var audio = null;
  function mmss(s) { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function barra() {
    var h = '<div class="extra-barra" role="group" aria-label="Apoyos de esta página">';
    if (e.pildora) h += '<button type="button" class="extra-btn ex-audio" aria-pressed="false"><i class="fas fa-headphones" aria-hidden="true"></i><span class="ex-r">' + e.pildora.titulo + '</span><span class="ex-t"></span></button>';
    if (e.nota) h += '<button type="button" class="extra-btn ex-nota"><i class="fas fa-note-sticky" aria-hidden="true"></i><span class="ex-r">Nota</span></button>';
    if (e.mapaMental) h += '<button type="button" class="extra-btn ex-mapa"><i class="fas fa-diagram-project" aria-hidden="true"></i><span class="ex-r">Mapa mental</span></button>';
    if (e.lectura) h += '<a class="extra-btn ex-pdf" href="' + R(e.lectura.href) + '" download="' + e.lectura.nombre.replace(/"/g, '') + '" target="_blank" rel="noopener"><i class="fas fa-file-pdf" aria-hidden="true"></i><span class="ex-r">Lectura en PDF</span></a>';
    return h + '</div>';
  }
  function poner() {
    var raiz = document.getElementById('ova');
    if (!raiz || raiz.querySelector('.extra-barra')) return;
    raiz.insertAdjacentHTML('beforeend', barra());
    var b = raiz.querySelector('.ex-audio');
    if (b) {
      if (!audio) { audio = new Audio(R(e.pildora.audio)); audio.preload = 'metadata'; }
      var t = b.querySelector('.ex-t');
      var pinta = function () { b.classList.toggle('sonando', !audio.paused); b.setAttribute('aria-pressed', String(!audio.paused)); t.textContent = audio.duration ? ' ' + mmss(audio.paused && !audio.currentTime ? audio.duration : audio.duration - audio.currentTime) : ''; };
      ['play', 'pause', 'ended', 'timeupdate', 'loadedmetadata'].forEach(function (ev) { audio.addEventListener(ev, pinta); });
      b.addEventListener('click', function () { if (audio.paused) audio.play(); else audio.pause(); });
      pinta();
    }
    var m = raiz.querySelector('.ex-mapa');
    if (m) m.addEventListener('click', function () { abrirMapa(raiz, m); });
    var nt = raiz.querySelector('.ex-nota');
    if (nt) nt.addEventListener('click', function () { abrirNota(raiz, nt); });
  }
  function abrirNota(raiz, desde) {
    var v = document.createElement('div');
    v.className = 'mm-velo'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', 'Nota');
    v.innerHTML = '<div class="mm-caja nota-caja"><div class="mm-cab"><i class="fas fa-note-sticky" aria-hidden="true"></i><b>Nota</b><button type="button">Cerrar</button></div>' +
      '<div class="nota-cuerpo"></div></div>';
    v.querySelector('.nota-cuerpo').textContent = e.nota.texto;
    var cerrar = function () { v.remove(); document.removeEventListener('keydown', tecla); if (desde) desde.focus(); };
    var tecla = function (ev) { if (ev.key === 'Escape') cerrar(); };
    v.querySelector('button').addEventListener('click', cerrar);
    v.addEventListener('click', function (ev) { if (ev.target === v) cerrar(); });
    document.addEventListener('keydown', tecla);
    raiz.appendChild(v);
    v.querySelector('button').focus();
  }
  function abrirMapa(raiz, desde) {
    var src = R(e.mapaMental.src);
    var v = document.createElement('div');
    v.className = 'mm-velo'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', 'Mapa mental: ' + e.mapaMental.titulo);
    v.innerHTML = '<div class="mm-caja"><div class="mm-cab"><i class="fas fa-diagram-project" aria-hidden="true"></i><b>Mapa mental · ' + e.mapaMental.titulo.replace(/</g, '&lt;') +
      '</b><a href="' + src + '" download="Mapa mental · ' + e.mapaMental.titulo.replace(/"/g, '') + '.png"><i class="fas fa-download" aria-hidden="true"></i> Descargar</a><button type="button">Cerrar</button></div>' +
      '<div class="mm-cuerpo"><img alt="Mapa mental de la página: ' + e.mapaMental.titulo.replace(/"/g, '') + '" src="' + src + '"></div></div>';
    var cerrar = function () { v.remove(); document.removeEventListener('keydown', tecla); if (desde) desde.focus(); };
    var tecla = function (ev) { if (ev.key === 'Escape') cerrar(); };
    v.querySelector('button').addEventListener('click', cerrar);
    v.addEventListener('click', function (ev) { if (ev.target === v) cerrar(); });
    v.querySelector('img').addEventListener('click', function () { this.classList.toggle('grande'); });
    document.addEventListener('keydown', tecla);
    raiz.appendChild(v);
    v.querySelector('button').focus();
  }
  new MutationObserver(poner).observe(document.getElementById('ova'), {childList: true});
  poner();
})();
