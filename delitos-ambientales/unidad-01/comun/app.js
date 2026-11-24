/* Motor de escenas · Audiencias preliminares · JP-OVA
   Cada escena trae su texto en SEGMENTOS LITERALES (generar_audiencias.py + diseno_audiencias.py
   comprueban que juntos reproducen la fuente sin omisiones) y bloques de mediación elegidos por la
   intención del contenido: mapa, lámina, giro, fichas, ruta, línea, balanza, empareja y caso.
   Estética de la última versión aprobada de Ley 1826; patrones de Juan: manito en todo lo que abre
   contenido, visto con fa-circle-check, barra de avance, caja clave y celebración al completar.
   ?escena=N muestra una sola escena para el iframe de Genially (767 × 510).
   Unidades 2–4 (producir_unidad.py): párrafos, viñetas y notas al pie de la fuente se conservan al leer;
   las tablas de la fuente se exploran por pestañas (bloque «tabla»). */
(function () {
  'use strict';
  var raiz = document.getElementById('ova');
  var datos = JSON.parse(document.getElementById('contenido').textContent);
  var O = window.Objetos;
  /* Colores del curso para los objetos dibujados (Bienes, 27/10/2026: los de su plantilla de Genially). Sin «paleta» en los
     datos, los objetos conservan la de JP. */
  if (datos.paleta) Object.keys(datos.paleta).forEach(function (k) { O.C[k] = datos.paleta[k]; });
  var fijo = Number(new URLSearchParams(location.search).get('escena'));
  var embebido = Number.isInteger(fijo) && fijo >= 1 && fijo <= datos.scenes.length;
  /* Dentro del SCORM del aula, la lección tiene su propio botón «Pantalla completa» en el centro del pie, en todas las páginas
     (JP, 14/11/2026: «navegar en pantalla completa siempre»): el de la escena, que hacía lo mismo, no se repite. */
  /* (la clase «pc-leccion» se pone al pintar la escena, con las demás de la raíz) */
  var actual = embebido ? fijo - 1 : 0;
  var escena, vistos, total, retornoFoco = null;
  /* Pestañas dentro de la página (Juan, 19/11/2026, estándar de Justicia restaurativa: «una diapositiva por título… con sus
     pestañas»): una escena con «pestanas» = [subescena, …] muestra arriba una pestaña por subtítulo de la ficha (A, B, C…, con su
     marca de leído) y, debajo, la mediación de la pestaña elegida, que es una escena completa del motor. Sin «pestanas», nada cambia.
     ?pestana=M abre la pestaña M (QA). */
  var padre = null, pestana = 0, pHechas = {};
  (function () { var p0 = Number(new URLSearchParams(location.search).get('pestana')); if (Number.isInteger(p0) && p0 >= 1) pestana = p0 - 1; })();
  function subEscenas(e) { return e.pestanas && e.pestanas.length ? e.pestanas : [e]; }
  function claveLectura() { return actual + (padre ? '.' + pestana : '') + ':'; }
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };
  /* La guía va arriba y lo que se toca, debajo: la mano apunta hacia abajo (revisor, 10/11/2026: «el icono indica hacia arriba
     entonces no sé qué debo oprimir»). */
  var mano = '<i class="fas fa-hand-point-down" aria-hidden="true"></i>';
  var visto = '<i class="fas fa-circle-check" aria-hidden="true"></i>';
  var guias = {
    mapa: 'Toque cada rama del mapa para descubrirla.',
    lamina: 'Toque los puntos sobre la ilustración.',
    giro: 'Pase el cursor o toque cada tarjeta para girarla y leerla.',
    fichas: 'Elija cada ficha para leer su contenido.',
    ruta: 'Recorra la ruta paso a paso.',
    linea: 'Avance por la historia del caso.',
    balanza: 'Coloque cada criterio en la balanza.',
    empareja: 'Arrastre cada nombre y suéltelo sobre su descripción.',   // 14/11/2026: «Arrastre o toque» va sobre los nombres
    caso: 'Resuelva el caso del expediente paso a paso.',
    tabla: 'Elija cada pestaña para recorrer la tabla.',
    rejilla: 'Abra cada ventana para ver su contenido.',
    acordeon: 'Despliegue cada apartado para leerlo.',
    puntos: 'Toque los puntos sobre la ilustración.',
    mental: 'Explore cada rama del mapa mental.',
    esquema: 'Recorra el mapa conceptual.',
    compara: 'Toque cada columna para compararla.',
    eje: 'Toque cada categoría del eje y compare las dos columnas.',
    cuadro: 'Lea la tabla: «Seguir leyendo» muestra las filas siguientes.',
    ramas: 'Toque cada entidad de las ramas para leer su contenido.',
    red: 'Abra cada institución de la red: al leerla se revela su papel en el sistema.',
    conexiones: 'Lea cada fragmento: cada uno revela una conexión del mapa.',
    condiciones: 'Lea los fragmentos y marque si cada requisito se cumple: la consecuencia cambia.',
    apertura: 'Lea la pregunta que orienta la lección y las ideas que la responden.',
    actividad: 'Elija una respuesta: si no es la correcta, lea la retroalimentación e inténtelo de nuevo.'
  };
  // Con datos.puntosSoloLeyenda (ver B.puntos), lo que se toca son los rótulos de la derecha.
  if (datos.puntosSoloLeyenda) guias.puntos = 'Toque cada rótulo de la derecha; su número señala el lugar en la ilustración.';
  /* Juan (26–27/10/2026): mayúscula inicial en rótulos, títulos y en todo bloque de texto (párrafo, viñeta, celda, extracto);
     artículos, leyes, sentencias y la Corte se ven y titilan. Solo cambia la letra con que arranca el bloque: si empieza
     con un número no se toca, y la marca de una enumeración («(ii)», «a)», «b.», «1.») se conserva. Una dirección web
     («https://…», «www.…») tampoco: «Https://» no es la dirección de la ficha (SRPA, U2-L1-E06). */
  /* Rótulo que es pregunta o exclamación (revisión del 19/11/2026, Enfoque: «Cerrar la pregunta con signo de interrogación…
     revisar en todos los cursos»): el rótulo breve toma las primeras palabras de la ficha y quedaba «¿Debe el tendero romper
     los lazos», sin el cierre. Si el bloque abre con «¿» (o «¡») y no trae ningún «?» (o «!»), se cierra al pintar. Un texto
     completo de la ficha que abre con «¿» siempre trae su «?», así que no cambia. */
  function cerrarSignos(s) {
    var ini = /^[\s•«"“'(*\-–—]*(?:(?:[ivx]{1,5}|[a-j]|\d{1,2})[.)]\s+)?([¿¡])/.exec(s);
    if (!ini) return s;
    var cierre = ini[1] === '¿' ? '?' : '!';
    if (s.indexOf(cierre) >= 0) return s;
    return s.replace(/[\s,;:.]+$/, '') + cierre;   // «¿Debe…» → «¿Debe…?»: el «…» de un extracto se conserva
  }
  function may(s) {
    s = cerrarSignos(String(s));
    var p = /^[\s•«"“'(¿¡*\-–—]*(?:(?:[ivx]{1,5}|[a-j]|\d{1,2})[.)]\s+)?/.exec(s)[0];
    if (/^(?:https?:\/\/|www\.)/i.test(s.slice(p.length))) return s;
    return p + s.slice(p.length).replace(/^\p{Ll}/u, function (c) { return c.toUpperCase(); });
  }
  var REF = /(?:\b[Aa]rt(?:ículos?|\.)\s*\d+[A-Za-z]?(?:\s(?:del|de la)\s(?:CPP|CN|Constitución Política|Ley\s\d+(?:\sde\s\d{4})?))?|\bLey\s\d+(?:\s?(?:de\s|\/)\d{4})?|\b(?:Sentencias?\s)?(?:C|T|SU)-\d+(?:\/\d+|\sde\s\d{4})?|\b(?:STP|STC|AP|SP|STS)\s?\d+[-\/]\d{4}|Corte Constitucional|Corte Suprema de Justicia|Constitución Política|Resolución\s[\d‐-]+\sde\s\d{4}|Directiva\s\d+(?:\sde\s\d{4})?)/g;
  function esRef(s) { REF.lastIndex = 0; var r = REF.test(String(s)); REF.lastIndex = 0; return r; }
  function refc(s) { return esRef(s) ? ' ref' : ''; }
  function rot(s) { return (esRef(s) ? '<i class="fas fa-book-open ref-ico" aria-hidden="true"></i>' : '') + esc(may(s)); }
  /* Cada línea es un párrafo de la fuente; «[^n] …» al inicio es una nota al pie y «[^n]» en el texto, su llamada. */
  function marcado(s) {
    var h = esc(formatoFuente(s)).replace(REF, function (m) { return '<mark class="ref-texto">' + m + '</mark>'; })
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[\^(\d+)\]/g, '<sup class="llamada">$1</sup>')
      .replace(//g, '<strong class="ff">').replace(//g, '</strong>').replace(//g, '<em class="ff">').replace(//g, '</em>');
    /* «comillasCursiva» (Tráfico y trata, 21/11/2026: «los encomillados van en itálica»): lo citado entre «» va en cursiva; las
       comillas quedan en redonda. El texto no cambia. */
    /* Ley 1826 (21/11/2026): sus citas van entre “…” (“consta en la carpeta”); reciben el mismo trato. */
    if (datos.comillasCursiva) h = h.replace(/«([^«»]+?)»/g, '«<em class="cita">$1</em>»').replace(/“([^“”<>]+?)”/g, '“<em class="cita">$1</em>”');
    return h;
  }
  /* «formatoFuente» (Tráfico y trata, 21/11/2026: «faltan las negritas, cursivas…»): [{a, t, d, f}] con los tramos que la ficha
     pone en negrita (f 'N'), cursiva ('C') o ambas, con un poco de texto antes (a) y después (d) para ubicarlos sin confundirlos
     con otra aparición. Se marcan con caracteres privados antes de escapar y se vuelven <strong>/<em> al final. Si el contexto no
     está en este tramo de lectura, se acepta el tramo solo cuando aparece una sola vez y es largo. El texto no cambia. */
  function formatoFuente(s) {
    var L = datos.formatoFuente;
    s = String(s);
    if (!L || !L.length) return s;
    var bajo = s.toLowerCase(), marcas = [];
    L.forEach(function (x) {
      var t = x.t.toLowerCase(), i = -1, k;
      if (x.a && (k = bajo.indexOf((x.a + x.t).toLowerCase())) >= 0) i = k + x.a.length;
      else if (x.d && (k = bajo.indexOf((x.t + x.d).toLowerCase())) >= 0) i = k;
      else if (t.length >= 12 && (k = bajo.indexOf(t)) >= 0 && bajo.indexOf(t, k + 1) < 0) i = k;
      if (i < 0) return;
      var f = i + t.length;
      if (marcas.some(function (m) { return i < m[1] && f > m[0]; })) return;   // sin solapes
      marcas.push([i, f, x.f]);
    });
    if (!marcas.length) return s;
    marcas.sort(function (p, q) { return q[0] - p[0]; });
    marcas.forEach(function (m) {
      var ab = (m[2].indexOf('N') >= 0 ? '' : '') + (m[2].indexOf('C') >= 0 ? '' : '');
      var ci = (m[2].indexOf('C') >= 0 ? '' : '') + (m[2].indexOf('N') >= 0 ? '' : '');
      s = s.slice(0, m[0]) + ab + s.slice(m[0], m[1]) + ci + s.slice(m[1]);
    });
    return s;
  }
  /* Párrafos con aire (Bienes, revisión de Juan: «que haga respirar un poquitico el párrafo»): con datos.respiro (caracteres
     por tramo), un párrafo largo se muestra en tramos de pocas oraciones, cada uno como párrafo visual, sin cambiar una
     letra. No corta tras abreviaturas, numerales de lista («1.»), iniciales ni dentro de una negrita. */
  var FIN_ORACION = /(?:[.!?][”’»")\]]*\s+(?=[«“"(¿¡A-ZÁÉÍÓÚÑ]|\d{1,2}\.\s)|:\s+(?=\d{1,2}\.\s))/g;
  /* Antes de la abreviatura no puede haber una letra: «\b» de JavaScript no reconoce las tildes y tomaría «acción.» por «n.». */
  var NO_CORTA = /(?:(?<![A-Za-zÁÉÍÓÚÜÑáéíóúüñ])(?:art|arts|núm|num|inc|lit|par|No|p|pp|M\.P|Rad|ss|cfr|Cfr|ibid|Ibid|vgr|etc|S\.A|Dr|Sr|Sra|aprox|ed|Ed|vol|n|N|ord|cap|Ob|cit|op)|(?:^|\s)\d{1,2}|(?:^|[\s(«“"])[A-ZÁÉÍÓÚÑ])\.\s+$/;
  function tramos(t) {
    var lim = datos.respiro;
    if (!lim || t.length <= lim * 1.3) return [t];
    var oraciones = [], desde = 0, m;
    FIN_ORACION.lastIndex = 0;
    while ((m = FIN_ORACION.exec(t))) {
      var hasta = m.index + m[0].length, previo = t.slice(0, hasta);
      if (NO_CORTA.test(previo) || previo.split('**').length % 2 === 0) continue;
      oraciones.push(t.slice(desde, hasta).trim());
      desde = hasta;
    }
    oraciones.push(t.slice(desde).trim());
    /* Una oración muy larga (citas legales) se divide en sus punto y coma, que la cierran a medias: el texto no cambia. */
    /* Con datos.desplazarLectura la lectura entera se desplaza y no hace falta: la oración queda en un solo bloque, sin salto de
       línea tras el punto y coma (María Paula Hernández, Bienes, 22/11/2026: «mantener la continuación de la idea en el mismo
       párrafo después del punto y coma»). */
    if (!datos.desplazarLectura) oraciones = oraciones.reduce(function (a, o) {
      if (o.length <= lim * 1.3) return a.concat([o]);
      return a.concat(o.split(/(?<=;)\s+/).filter(function (x) { return x; }));
    }, []);
    /* datos.partirComas (SRPA, 30/10/2026: párrafos de una sola oración de hasta 1 000 caracteres, sin punto ni punto y coma):
       la oración que sigue siendo muy larga se divide en las comas que abren una cláusula («, ya que», «, por el contrario»,
       «, es decir»…) o, si no hay, en cualquier coma, en tramos de hasta «respiro». El texto no cambia: solo descansa. */
    if (datos.partirComas) oraciones = oraciones.reduce(function (a, o) {
      if (o.length <= lim * 1.3) return a.concat([o]);
      var CLAUSULA = /,\s+(?=(?:por el contrario|ya que|es decir|lo cual|lo que|según|sino|pues|porque|mientras|aunque|toda vez que|en tanto|así como|de manera que|dado que|puesto que|sin embargo|no obstante|por lo tanto|por tanto|en consecuencia|razón por la cual|con lo cual|además|igualmente|siempre que|siempre y cuando|tal como|de acuerdo con|conforme|en el que|en la que|en los que|en las que|en donde|donde|cuando|quienes?|el cual|la cual|los cuales|las cuales|cuy[oa]s?|con el fin|a fin de|para que|de modo que|de forma que|en especial|particularmente|esto es|en (?:este|ese|tal) sentido|por ello|por esta razón|de ahí que|pero|o sea)\b)/gi;
      /* También los dos puntos que abren una cita o una enumeración («en dos grandes categorías: “…”»). */
      var cortes = [], comas = [], m, re = /[,:]\s+/g;
      CLAUSULA.lastIndex = 0;
      while ((m = CLAUSULA.exec(o))) cortes.push(m.index + 1);
      while ((m = re.exec(o))) comas.push(m.index + 1);
      var piezas = [], desde = 0, sigue = false, espacios = [];
      re = /\s+/g;
      while ((m = re.exec(o))) espacios.push(m.index);
      function enVentana(c) { return c - desde >= lim * 0.35 && c - desde <= lim * 1.15; }
      while (o.length - desde > lim * 1.3) {
        /* Primero una coma de cláusula dentro del tramo; si no hay, cualquier coma dentro del tramo. */
        var dentro = cortes.filter(enVentana), enEspacio = false;
        if (!dentro.length) dentro = comas.filter(enVentana);
        /* Sin coma en el tramo, la más cercana con un margen mayor: una oración de 658 caracteres quedaba entera (U1-L3-E07). */
        if (!dentro.length) dentro = comas.filter(function (c) { return c - desde >= lim * 0.25 && c - desde <= lim * 1.3; });
        /* Último recurso: una oración casi sin comas (U2-L3-E13, 1 132 caracteres a la vista) se reparte en un espacio y la
           continuación empieza con «…», en minúscula (convención de AGENTS.md). Solo para leer: el texto no cambia. */
        if (!dentro.length) { dentro = espacios.filter(function (c) { return c - desde >= lim * 0.6 && c - desde <= lim * 1.1; }); enEspacio = true; }
        if (!dentro.length) break;
        var c = enEspacio ? dentro[dentro.length - 1]
          : dentro.reduce(function (b, x) { return Math.abs(x - desde - lim * 0.85) < Math.abs(b - desde - lim * 0.85) ? x : b; });
        piezas.push((sigue ? '…' : '') + o.slice(desde, c).trim()); desde = c; sigue = enEspacio;
      }
      piezas.push((sigue ? '…' : '') + o.slice(desde).trim());
      return a.concat(piezas.filter(function (x) { return x && x !== '…'; }));
    }, []);
    var out = [];
    oraciones.forEach(function (o) {
      var u = out.length - 1;
      var junto = u >= 0 ? out[u].length + o.length + 1 : Infinity;
      if (u >= 0 && (junto <= lim || (out[u].length < lim * 0.6 && junto <= lim * 1.3))) out[u] += ' ' + o; else out.push(o);
    });
    var ultimo = out[out.length - 1];
    if (out.length > 1 && ultimo.length < lim * 0.35 && out[out.length - 2].length + ultimo.length + 1 <= lim * 1.3) out[out.length - 2] += ' ' + out.pop();
    return out;
  }
  function linea(t) {
    var nota = /^\[\^(\d+)\]\s*/.exec(t), cuerpo = may(nota ? t.slice(nota[0].length) : t);
    /* La nota al pie también descansa en tramos (la nota del artículo 534 en Ley 1826 L3 era un bloque de 1 500 caracteres
       que ni la lectura por partes podía repartir; pulido del 29/10/2026): la llamada va en el primero. */
    if (nota) return tramos(cuerpo).map(function (x, i) {
      return '<span class="parr nota-pie' + (i ? ' tramo' : '') + '">' + (i ? '' : '<sup>' + nota[1] + '</sup> ') + marcado(x) + '</span>';
    }).join('');
    var vin = /^• /.test(t);
    return tramos(cuerpo).map(function (x, i) {
      return '<span class="parr' + (vin ? (i ? ' tramo vineta-sigue' : ' vineta') : i ? ' tramo' : '') + '">' + marcado(x) + '</span>';
    }).join('');
  }
  /* Cuatro o más viñetas breves seguidas (los porcentajes del artículo 91 en Bienes) van en dos columnas: una por renglón
     dejaba vacía la mitad derecha de la lectura (QA del pulido, 29/10/2026). El texto no cambia. */
  function rico(s) {
    var lineas = String(s).split('\n'), out = [], k = 0;
    while (k < lineas.length) {
      var j = k;
      // Una palabra de 20 caracteres o más («indagación/investigación.») no cabe en media columna y se montaba sobre la
      // vecina (Estándares U5 al regenerar; revisión de choques, 30/10/2026): esas viñetas siguen en una columna.
      while (j < lineas.length && /^• /.test(lineas[j]) && lineas[j].length <= 72 && !/\S{20,}/.test(lineas[j])) j++;
      if (j - k >= 4) { out.push('<span class="vinetas-breves">' + lineas.slice(k, j).map(linea).join('') + '</span>'); k = j; }
      else { out.push(linea(lineas[k])); k++; }
    }
    return out.join('');
  }
  function seg(i) { return (escena.vineta && escena.vineta.indexOf(i) >= 0 ? '• ' : '') + escena.segmentos[i]; }
  function segs(a) {
    return (a || []).map(function (i, n) { return (n && escena.parrafo && escena.parrafo.indexOf(i) >= 0 ? '\n' : n ? ' ' : '') + seg(i); }).join('');
  }
  function svgObjeto(nombre, ancho) {
    return '<svg class="obj-svg" viewBox="-6 -6 132 132" width="' + (ancho || 100) + '" aria-hidden="true">' + O.dibujar(nombre, 60, 120, 1) + '</svg>';
  }
  /* Si el texto no cabe junto a la ilustración, la ilustración se achica o se oculta: nunca desplazamiento. */
  function ajustarLectura(caja) {
    caja.classList.remove('apretada', 'sin-arte', 'mini');
    if (caja.scrollHeight > caja.clientHeight + 1) caja.classList.add('apretada');
    if (caja.scrollHeight > caja.clientHeight + 1) caja.classList.add('sin-arte');
    if (caja.scrollHeight > caja.clientHeight + 1) caja.classList.add('mini');
  }
  /* Texto breve en la ruta o la historia: crece hasta 18 px; si no cabe, ajustarLectura achica ilustración y letra. */
  /* ¿Cabe el contenido de la caja con un margen? Se suma la altura real de los hijos (scrollHeight nunca baja de clientHeight). */
  function cabe(caja, margen) {
    var cs = getComputedStyle(caja), libre = caja.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - (margen || 0), alto = 0, n = 0;
    for (var c = caja.firstElementChild; c; c = c.nextElementSibling) {
      var m = getComputedStyle(c);
      if (m.display !== 'none') { alto += c.offsetHeight + parseFloat(m.marginTop) + parseFloat(m.marginBottom); n++; }
    }
    return alto + Math.max(0, n - 1) * (parseFloat(cs.rowGap) || 0) <= libre;
  }
  /* ---------- Sin espacios en blanco (Esteban, 28/10/2026: «recuerda no dejar esos espacios en blanco») ----------
     Con datos.sinHuecos, la letra de las cajas de lectura de alto fijo crece hasta 25 px (antes 22) y, si con ella queda bajo el
     texto un hueco de 110 px o más, la caja recibe allí la ilustración de relleno de la escena (escena.relleno: aprobada,
     del tema del texto y distinta de las que la escena ya muestra). */
  /* Marco ancho (SRPA, iframe de 1113 × 448): solo el curso que lo declara en datos.marco. Las reglas de base.css para ese
     marco van con .marco-ancho dentro de su @container: un curso de 767 × 510 abierto en una pestaña ancha (la que abre
     «Pantalla completa» sin permiso) no cambia de composición (revisión de choques, 30/10/2026). */
  function marcoAncho() { return !!(datos.marco && datos.marco[0] >= 900); }
  function anchoReal() { return marcoAncho() && raiz.clientWidth >= 900; }
  /* Recuadro «Alerta» (Juan, 19/11/2026: «un elemento muy llamativo que diga alerta» para las advertencias del documento): el ítem
     que trae «alerta: true» en sus datos se marca con el rótulo «Alerta» y late; su ventana se abre con el mismo marco. Solo lo usa
     el curso que lo pone en sus datos (Terminaciones). */
  function marcarAlertas(b, el) {
    (b.items || []).forEach(function (it, i) {
      if (!it.alerta) return;
      el.querySelectorAll('[data-i="' + i + '"],[data-n="' + i + '"]').forEach(function (x) {
        if (x.classList.contains('es-alerta')) return;
        x.classList.add('es-alerta');
        (x.querySelector('.esq-tarjeta') || x).insertAdjacentHTML('afterbegin', '<span class="alerta-sello"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i> Alerta</span>');
      });
    });
  }
  /* Letra mínima al encajar: con datos.desplazarLectura (Terminaciones) no baja de 15 px; lo que no cabe se desplaza. */
  function pisoLetra() { return datos.desplazarLectura ? 15 : 11.5; }
  function topeLetra(normal) { return datos.sinHuecos ? Math.max(normal, 25) : normal; }
  /* Holgura del encaje: con datos.sinHuecos se deja 4 px libres, porque otro navegador dibuja la misma fuente 1–3 px más alta y
     el panel abriría una barra de desplazamiento. */
  function holgura() { return datos.sinHuecos ? -3 : 1; }
  /* ¿Cabe el contenido de la caja? Sin desplazamiento y, con datos.sinHuecos, con el texto terminando al menos 3 px antes de su
     borde de abajo. scrollHeight nunca baja de clientHeight: con la holgura negativa, «scrollHeight <= clientHeight − 3» no se
     cumplía nunca y la letra bajaba siempre al mínimo, con un hueco debajo (Esteban, 28/10/2026, U1-L1-E04: «ese espacio
     debajo… tiene que ser rellenado»). Sin datos.sinHuecos, la misma prueba de antes. */
  function entra(caja) {
    if (caja.scrollHeight > caja.clientHeight + 1) return false;
    if (holgura() >= 0) return true;
    var cs = getComputedStyle(caja), r = caja.getBoundingClientRect(), e = caja.offsetHeight ? r.height / caja.offsetHeight : 1;
    var fondo = r.bottom - (parseFloat(cs.paddingBottom) + parseFloat(cs.borderBottomWidth)) * e, fin = -Infinity;
    var w = document.createTreeWalker(caja, NodeFilter.SHOW_TEXT), n, rg = document.createRange(), q;
    while ((n = w.nextNode())) {
      if (!n.textContent.trim() || !n.parentElement || !n.parentElement.getClientRects().length) continue;
      rg.selectNodeContents(n); q = rg.getBoundingClientRect();
      if (q.height > 0) fin = Math.max(fin, q.bottom);
    }
    return fin <= fondo + holgura() * e;
  }
  function alturaContenido(caja) {
    var arriba = Infinity, abajo = -Infinity, w = document.createTreeWalker(caja, NodeFilter.SHOW_TEXT), n, r = document.createRange();
    function sumar(b) { if (b.width > 0 && b.height > 0) { arriba = Math.min(arriba, b.top); abajo = Math.max(abajo, b.bottom); } }
    while ((n = w.nextNode())) {
      if (!n.textContent.trim() || !n.parentElement || !n.parentElement.getClientRects().length) continue;
      r.selectNodeContents(n); sumar(r.getBoundingClientRect());
    }
    caja.querySelectorAll('img,svg').forEach(function (m) { if (m.getClientRects().length && !m.closest('svg svg')) sumar(m.getBoundingClientRect()); });
    return abajo > arriba ? abajo - arriba : 0;
  }
  function quitarRelleno(caja) {
    if (!caja) return;
    [].slice.call(caja.querySelectorAll('.relleno-arte')).forEach(function (f) { caja.dataset.tuvoRelleno = '1'; f.remove(); });
    caja.classList.remove('con-relleno');
  }
  /* «columna»: dónde va la ilustración dentro de la caja (el texto de la ruta o de las fichas); por omisión, la caja. */
  function rellenar(caja, columna) {
    quitarRelleno(caja);
    if (!datos.sinHuecos || !datos.ilustraciones || !escena.relleno || !caja || !caja.getClientRects().length) return;
    var cs = getComputedStyle(caja), disp = caja.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom), usado = alturaContenido(caja);
    if (disp < 160 || disp - usado < 110) return;
    var dentro = columna || caja, f = document.createElement('figure');
    f.className = 'relleno-arte'; f.setAttribute('aria-hidden', 'true');
    // Al re-encajar (cambio de tamaño, fuentes) la ilustración que ya estaba no vuelve a entrar con su animación: parpadeaba.
    if (caja.dataset.tuvoRelleno) f.style.animation = 'none';
    f.innerHTML = '<img src="' + srcImagen(escena.relleno) + '" alt="">';
    dentro.classList.add('con-relleno'); dentro.appendChild(f);
  }
  function crecerLectura(caja) {
    var texto = caja.querySelector('.ruta-texto');
    caja.classList.remove('apretada', 'sin-arte', 'mini');
    quitarRelleno(caja);
    if (texto) for (var fs = topeLetra(24); fs > 14.2; fs -= 0.5) { caja.style.setProperty('--fs', fs + 'px'); if (cabe(texto, 4) && caja.scrollHeight <= caja.clientHeight + 1) { rellenar(caja, texto); return; } }
    /* «huecosFinos» (Tráfico, 20/11/2026: «sin huecos»): en una caja baja, la ilustración grande no deja crecer la letra de un texto
       breve; se prueba con la ilustración menor antes de achicarla. */
    if (texto && datos.huecosFinos) {
      caja.classList.add('apretada');
      for (var f2 = topeLetra(24); f2 > 14.2; f2 -= 0.5) { caja.style.setProperty('--fs', f2 + 'px'); if (cabe(texto, 4) && caja.scrollHeight <= caja.clientHeight + 1) return; }
      caja.classList.remove('apretada');
    }
    caja.style.removeProperty('--fs'); ajustarLectura(caja);
  }
  function reanimar(el) { el.classList.remove('aparece'); void el.offsetWidth; el.classList.add('aparece'); }

  /* ---------- Aprovechar el espacio (Juan, R8): texto a un lado e imagen de contexto al otro ----------
     Ilustraciones de Esteban del 27/10/2026, sin balanza ni martillo. Se elige la del tema de la escena y nunca
     la misma en dos escenas seguidas; sin tema reconocible se dibujan en grande los objetos de la escena. */
  var BASE = ((document.currentScript && document.currentScript.src) || '').replace(/app\.js(\?.*)?$/, '') || '../comun/';
  var CONTEXTO = [
    ['fundamento', /enfoques? de g[eé]nero|interseccional|lideresa/i],
    ['investigacion', /investigaci|interceptaci|allanamiento|vigilancia|encubiert|entregas? vigiladas?|b[uú]squeda selectiva|bases? de datos|evidencia|elementos? materia|polic[ií]a judicial|seguimiento/i],
    ['terminos', /vencimiento de t[eé]rminos|\bplazos?\b|caducidad|preclusi/i],
    ['captura', /captur|aprehen|detenci|detenid|privaci[oó]n de (la )?libertad|medidas? de aseguramiento|flagrancia|indiciad/i],
    ['clasificacion', /clasific|categor|\btipos\b|\bclases\b|cat[aá]logo|nominadas|concursos?|rutas? procesal|delimitaci/i],
    ['sustentacion', /sustent|argument|teor[ií]a del caso|motivos fundados|inferencia|controversia|probatori|alegat/i],
    ['fundamento', /fundament|constituci|marco normativo|legal|jurisprudenc|sentencia|corte|principio|garant|finalidad|\bley\b/i]
  ];
  function temaDeTexto(t) { if (datos.ilustraciones) return null; for (var i = 0; i < CONTEXTO.length; i++) if (CONTEXTO[i][1].test(t)) return CONTEXTO[i][0]; return null; }
  /* Un curso con ilustraciones propias («ilustraciones»: carpeta dentro de comun/) trae la de cada escena en «ilustracion»,
     elegida por el generador según el tema; las de Audiencias (assets/contexto) no se usan. */
  function tema(e) {
    if (datos.ilustraciones) return e.ilustracion || null;
    var propio = [e.titulo_genially || '', e.rotulo || ''].concat(e.bloques.reduce(function (a, b) { return a.concat((b.items || []).map(function (x) { return x.label; })); }, [])).join(' ');
    return temaDeTexto(propio) || temaDeTexto((e.seccion || '') + ' ' + datos.heading);
  }
  function arteEn(pos) { return !!(datos.ilustraciones && escena && escena.arte && escena.arte.pos === pos); }
  function srcImagen(t) { return BASE + (datos.ilustraciones ? datos.ilustraciones + '/' + t : 'assets/contexto/' + t + '.webp'); }
  /* Escena con poco contenido: un solo bloque de lámina o giro con 1–2 elementos, mapa con hasta 3 ramas o balanza (U1). */
  function escasa(e) {
    if (e.bloques.length !== 1) return false;
    var b = e.bloques[0], n = (b.items || []).length;
    return ((b.tipo === 'lamina' || b.tipo === 'giro') && n <= 2) || (b.tipo === 'mapa' && n <= 4) || b.tipo === 'balanza';
  }
  function conFigura(e) {
    var b = e.bloques[0];
    return escasa(e) || (e.bloques.length === 1 && b.tipo === 'fichas') || (e.bloques.length === 1 && b.tipo === 'empareja' && b.items.length <= 2);
  }
  var IMAGEN = datos.scenes.map(function (e) { return e.pestanas && e.pestanas.length ? e.pestanas.map(function (x) { return conFigura(x) ? tema(x) : null; }) : conFigura(e) ? tema(e) : null; });
  function imagenActual() { var t = IMAGEN[actual]; return Array.isArray(t) ? t[pestana] || null : t; }
  IMAGEN.forEach(function (t, i) { if (t && i && IMAGEN[i - 1] === t) IMAGEN[i] = null; });
  function figura(objs, acomp) {
    var t = imagenActual();
    if (t) return '<figure class="ctx-arte foto" aria-hidden="true"><img src="' + srcImagen(t) + '" alt=""></figure>';
    var C = O.C, n = Math.min(objs.length, 3), xs = [[150], [98, 206], [66, 150, 236]][n - 1], s = [1.85, 1.25, 0.95][n - 1];
    /* Lámina de un solo punto (segunda pasada de U3–U4): su objeto al centro y, detrás, dos objetos tomados de su mismo texto. */
    if (objs.length === 1 && acomp && acomp.length) {
      return '<figure class="ctx-arte" aria-hidden="true"><svg viewBox="0 0 300 260"><circle cx="150" cy="128" r="112" fill="' + C.hielo + '"/>' +
        '<ellipse cx="150" cy="238" rx="128" ry="12" fill="' + C.piso + '"/>' +
        acomp.slice(0, 2).map(function (o, j) { return O.dibujar(o, j ? 234 : 66, 226, 0.8, 'entra e' + (j + 1)); }).join('') +
        O.dibujar(objs[0], 150, 238, 1.5, 'entra e0') + '</svg></figure>';
    }
    return '<figure class="ctx-arte" aria-hidden="true"><svg viewBox="0 0 300 260"><circle cx="150" cy="128" r="112" fill="' + C.hielo + '"/>' +
      '<ellipse cx="150" cy="238" rx="128" ry="12" fill="' + C.piso + '"/>' + O.dibujar('planta', 24, 238, 0.62, 'deco') +
      objs.slice(0, 3).map(function (o, j) { return O.dibujar(o, xs[j], 238, s, 'entra e' + j); }).join('') + '</svg></figure>';
  }
  /* El texto crece hasta llenar su caja (máx. 22 px) y se reduce si no cabe. Un texto breve lleva encima el objeto del
     punto en grande; si con él el texto quedaría por debajo de 16 px, el objeto se retira; si ni así cabe, la imagen. */
  /* «minimo»: letra más pequeña aceptable (12,5 px por omisión); la bitácora del marco ancho pide 14 y, si no cabe, se reparte en partes. */
  function encajarTexto(cont, caja, minimo) {
    quitarRelleno(caja);
    encajarTextoBase(cont, caja, minimo);
    rellenar(caja);
  }
  function encajarTextoBase(cont, caja, minimo) {
    var fs, min = minimo || 12.5;
    function probar(min) { for (fs = topeLetra(22); fs >= min; fs -= 0.5) { caja.style.setProperty('--fs', fs + 'px'); if (cabe(caja, 4)) return true; } return false; }
    cont.classList.remove('sin-arte'); caja.classList.remove('sin-icono');
    if (caja.querySelector('.ctx-icono') && probar(16)) return;
    caja.classList.add('sin-icono');
    if (!probar(min)) { cont.classList.add('sin-arte'); probar(min); }
  }

  /* ---------- Avance, visto y celebración ---------- */
  /* Leer el 100 % antes de avanzar (Estándares interamericanos; Esteban, 28/10/2026: «cuando hay uno de seguir leyendo… que no
     lo dejes seguir a la siguiente página… hey, no has leído el 100 %… tienes que completar el 100 % para poder avanzar»).
     Con datos.completar, lo que se abre en una lectura por partes queda visto al llegar a su última parte: el toque que abre
     y marca un elemento es un solo «turno», y la lectura creada en ese turno decide cuándo se marca. Sin datos.completar,
     marcar() es marcarYa(), como antes. */
  var turno = 0, ultimaLectura = null, generacion = 0, restaurando = false;
  document.addEventListener('pointerdown', function () { turno++; }, true);
  document.addEventListener('keydown', function () { turno++; }, true);
  /* Curso gamificado (Esteban, 08/11/2026: «que el estudiante sienta que va ganando y va subiendo los puntos… avanzando de secciones»).
     Con «datos.juego» ({clave, niveles}), cada lectura suma 10 puntos y cada escena completa es un tramo superado (+25). Se guarda en
     este navegador, por lección, y se comparte entre las páginas. No es la calificación del aula. */
  function juegoEstado() { var s = {}; try { s = JSON.parse(localStorage.getItem(datos.juego.clave) || '{}'); } catch (e) { /* sin almacenamiento */ } s.v = s.v || {}; s.t = s.t || {}; s.p = s.p || {}; return s; }
  function juegoGuardar(s) { try { localStorage.setItem(datos.juego.clave, JSON.stringify(s)); } catch (e) { /* sin almacenamiento */ } }
  function juegoPuntos(s) { return Object.keys(s.v).length * 10 + Object.keys(s.t).length * 25; }
  function juegoMax() { return datos.scenes.reduce(function (a, e) { return a + 25 + subEscenas(e).reduce(function (d, x) { return d + 10 * x.bloques.reduce(function (c, b) { return c + (b.items ? b.items.length : 2); }, 0); }, 0); }, 0); }
  function juegoNivel(p) { var N = datos.juego.niveles, f = p / juegoMax(); return f >= 0.8 ? N.length - 1 : f >= 0.45 ? Math.min(2, N.length - 1) : f >= 0.15 ? 1 : 0; }
  function juegoHtml() {
    if (!datos.juego) return '';
    var s = juegoEstado(), p = juegoPuntos(s);
    return '<div class="juego" role="status"><span class="j-tramos" title="Página ' + (actual + 1) + ' de ' + datos.scenes.length + ' de la lección. El punto se marca al leer todo el contenido de la página." aria-label="Tramo ' + (actual + 1) + ' de ' + datos.scenes.length + '">' + datos.scenes.map(function (_, i) {
      return '<i class="' + (s.t[i] ? 'hecho' : '') + (i === actual ? ' aqui' : '') + '"></i>'; }).join('') + '</span>' +
      '<span class="j-nivel"><i class="fas fa-medal" aria-hidden="true"></i> <b>' + esc(datos.juego.niveles[juegoNivel(p)]) + '</b></span>' +
      '<span class="j-puntos"><i class="fas fa-star" aria-hidden="true"></i> <output>' + p + '</output> pts</span></div>';
  }
  function juegoAviso(texto, clase) {
    var a = document.createElement('div'); a.className = 'j-aviso ' + (clase || ''); a.textContent = texto; a.setAttribute('role', 'status'); raiz.appendChild(a);
    setTimeout(function () { a.remove(); }, 2600);
  }
  function juegoSuma(s, antes) {
    juegoGuardar(s);
    var p = juegoPuntos(s), out = raiz.querySelector('.j-puntos output'); if (!out) return;
    out.textContent = p;
    var c = raiz.querySelector('.j-puntos'); c.classList.remove('sube'); void c.offsetWidth; c.classList.add('sube');
    if (juegoNivel(p) > juegoNivel(antes)) { raiz.querySelector('.j-nivel b').textContent = datos.juego.niveles[juegoNivel(p)]; juegoAviso('¡Nuevo nivel: ' + datos.juego.niveles[juegoNivel(p)] + '!', 'nivel'); }
  }
  function juegoLectura(id) {
    if (!datos.juego) return;
    var s = juegoEstado(), k = claveLectura() + id; if (s.v[k]) return;
    var antes = juegoPuntos(s); s.v[k] = 1; juegoSuma(s, antes);
  }
  function juegoTramo() {
    if (!datos.juego) return;
    var s = juegoEstado(); if (s.t[actual]) return;
    var antes = juegoPuntos(s); s.t[actual] = 1; juegoSuma(s, antes);
    var d = raiz.querySelectorAll('.j-tramos i')[actual]; if (d) d.classList.add('hecho');
    juegoAviso('¡Tramo ' + (actual + 1) + ' superado! +25');
  }
  function marcar(id) {
    if (vistos[id]) return;
    if (!datos.completar) { marcarYa(id); return; }
    var t = turno, g = generacion;
    setTimeout(function () {
      if (g !== generacion) return;
      var L = ultimaLectura;
      if (L && L.turno === t && !L.completa) L.alCompletar.push(function () { if (g === generacion) marcarYa(id); });
      else marcarYa(id);
    }, 0);
  }
  function marcarYa(id) {
    if (vistos[id]) return;
    vistos[id] = true;
    raiz.querySelectorAll('[data-id="' + id + '"]').forEach(function (b) { b.classList.add('visto'); });
    /* Las familias que cambian al leer (red, conexiones) escuchan este aviso en su bloque. */
    var origen = raiz.querySelector('[data-id="' + id + '"]');
    if (origen) origen.dispatchEvent(new CustomEvent('ova-visto', { bubbles: true, detail: id }));
    if (datos.sinHuecos) midiendo(function () { encajarTarjetas(); ajustarExtractos(); });
    juegoLectura(id);
    var n = Object.keys(vistos).length, barra = raiz.querySelector('.barra i');
    if (!barra) return;
    barra.style.width = (100 * n / total) + '%';
    raiz.querySelector('.avance output').textContent = n + ' / ' + total;
    /* Con el visto diferido, «Exploración completa» llega después de encajar los textos: se vuelven a encajar. */
    if (n === total) { if (padre) completarPestana(); else { celebrar(); juegoTramo(); } if (datos.completar) window.dispatchEvent(new Event('resize')); }
  }
  function pestanaHecha(i) {
    var c = actual + '.' + i; if (pHechas[c]) return true;
    return !!(datos.juego && juegoEstado().p[c]);
  }
  /* Una pestaña leída por completo queda marcada; con todas leídas, la página es un tramo superado y «Exploración completa». */
  function completarPestana() {
    if (!padre) return;
    var c = actual + '.' + pestana; pHechas[c] = true;
    if (datos.juego) { var s = juegoEstado(); if (!s.p[c]) { s.p[c] = 1; juegoGuardar(s); } }
    var b = raiz.querySelector('.pestana[data-p="' + pestana + '"]'); if (b) { b.classList.add('visto'); b.classList.remove('pulsa'); }
    var falta = -1;
    padre.pestanas.forEach(function (_, i) { if (falta < 0 && !pestanaHecha(i)) falta = i; });
    if (falta < 0) { celebrar(); juegoTramo(); return; }
    var av = raiz.querySelector('.avance');
    if (av) { av.classList.add('completo'); av.querySelector('output').innerHTML = visto + ' Pestaña leída'; }
    raiz.querySelectorAll('.tras-completar').forEach(function (e) { e.hidden = false; reanimar(e); });
    raiz.querySelectorAll('.ruta-lectura').forEach(crecerLectura);
    var sig = raiz.querySelector('.pestana[data-p="' + falta + '"]'); if (sig) sig.classList.add('pulsa');
    if (!restaurando) juegoAviso('¡Pestaña leída! Siga con la pestaña ' + String.fromCharCode(65 + falta));
  }
  function celebrar() {
    var av = raiz.querySelector('.avance');
    if (av) {
      av.classList.add('completo');
      av.querySelector('output').innerHTML = visto + ' Exploración completa';
    }
    /* El confeti va en su propia capa, por encima de toda la escena (antes nacía dentro del encabezado y la escena lo
       tapaba): sale del distintivo «Exploración completa», salta y cae sobre la escena. Sin animación si el usuario la reduce. */
    if (av && !restaurando && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      var caja = raiz.getBoundingClientRect(), insignia = av.querySelector('output').getBoundingClientRect();
      var c = document.createElement('div');
      c.className = 'confeti'; c.setAttribute('aria-hidden', 'true');
      c.style.left = (insignia.left + insignia.width / 2 - caja.left) + 'px';
      c.style.top = (insignia.top + insignia.height / 2 - caja.top) + 'px';
      for (var k = 0; k < 48; k++) {
        var p = document.createElement('i');
        p.style.setProperty('--x', (-Math.random() * caja.width * 0.75 + 60) + 'px');
        p.style.setProperty('--s', (20 + Math.random() * 60) + 'px');
        p.style.setProperty('--y', (30 + Math.random() * 40) + 'px');
        p.style.setProperty('--r', (Math.random() * 900 - 450) + 'deg');
        p.style.setProperty('--t', (Math.random() * 0.25) + 's');
        c.appendChild(p);
      }
      raiz.appendChild(c);
      setTimeout(function () { c.remove(); }, 2400);
    }
    raiz.querySelectorAll('.tras-completar').forEach(function (e) { e.hidden = false; reanimar(e); });
    raiz.querySelectorAll('.ruta-lectura').forEach(crecerLectura);
  }

  /* ---------- Lector superpuesto común ---------- */
  /* Textos que descansan (Juan y Esteban, 27/10/2026: «donde había textos largos hay que dejarlos descansar… un texto
     larguísimo le hace dormir el cerebro»): con datos.pagina (caracteres por parte), una lectura más larga se muestra por
     partes de uno o dos tramos, con «Seguir leyendo» y su posición; nada se recorta y todo queda en la página. «ajustar»
     vuelve a encajar la letra en cada parte. */
  function dosificar(caja, ajustar, limite) {
    var lim = limite || datos.pagina, t = caja && caja.querySelector('.lectura-texto'), viejo = caja && caja.querySelector('.lectura-paginas');
    if (viejo) viejo.remove();
    if (caja) caja.classList.remove('lectura-pendiente');
    /* datos.desplazarLectura (Terminaciones; Esteban y Juan, 19/11/2026: «mucho Seguir leyendo… mucho clic, que es lo que no
       quieren»): la lectura no se parte; va entera en su caja, con letra legible, y se desplaza. Las notas al pie, al final. */
    if (datos.desplazarLectura && t) {
      caja.classList.add('lectura-desplazable');
      notasAlFinal(t, [].slice.call(t.querySelectorAll('.parr')));
      return false;
    }
    if (!lim || !t) return false;
    var partes = [].slice.call(t.querySelectorAll('.parr')), total = 0;
    partes.forEach(function (x) { x.hidden = false; total += x.textContent.length; });
    if (total <= lim * 1.08) { notasAlFinal(t, partes); return false; }
    var paginas = [[]], largo = 0, previo = '';
    partes.forEach(function (x) {
      var L = x.textContent.length, nota = x.classList.contains('nota-pie');
      /* Una nota al pie se queda en la parte de su llamada. Con datos.ideasCompletas (Enfoque, revisión del 19/11/2026: «esta idea
         no se puede cortar ni en idea, ni gráficamente»), tampoco se pasa de parte después de un texto que anuncia con «:» lo que
         sigue ni de uno que queda colgando en «,». */
      var pegado = nota || (datos.ideasCompletas && /[:,]\s*$/.test(previo));
      if (!pegado && paginas[paginas.length - 1].length && largo + L > lim && (largo >= lim * 0.3 || largo + L > lim * 1.08)) { paginas.push([]); largo = 0; }
      paginas[paginas.length - 1].push(x); largo += L;
      if (!nota) previo = x.textContent;
    });
    if (paginas.length < 2) { notasAlFinal(t, partes); return false; }
    paginas.forEach(function (pg) { notasAlFinal(t, pg); });
    var pos = 0, nav = document.createElement('div');
    nav.className = 'lectura-paginas';
    nav.innerHTML = '<button type="button" class="pag-anterior" aria-label="Parte anterior"><i class="fas fa-arrow-left" aria-hidden="true"></i></button>' +
      '<span class="pag-puntos" aria-hidden="true">' + paginas.map(function () { return '<i></i>'; }).join('') + '</span><span class="pag-estado" aria-live="polite"></span>' +
      '<button type="button" class="pag-siguiente">Seguir leyendo <i class="fas fa-arrow-right" aria-hidden="true"></i></button>';
    t.parentNode.insertBefore(nav, t.nextSibling);
    /* Partes leídas de esta lectura (datos.completar): el visto y los «Siguiente» esperan a la última. */
    var L = { partes: paginas.length, leidas: {}, completa: false, turno: turno, alCompletar: [], sig: nav.querySelector('.pag-siguiente') };
    nav.lectura = L;
    if (datos.completar) { ultimaLectura = L; caja.classList.add('lectura-pendiente'); }
    function ir(i) {
      pos = i;
      L.leidas[i] = true;
      if (!L.completa && Object.keys(L.leidas).length === L.partes) {
        L.completa = true; caja.classList.remove('lectura-pendiente');
        L.alCompletar.splice(0).forEach(function (f) { f(); });
        caja.dispatchEvent(new CustomEvent('lectura-completa', { bubbles: true }));
      }
      paginas.forEach(function (pg, j) { pg.forEach(function (x) { x.hidden = j !== i; }); });
      nav.querySelector('.pag-estado').textContent = 'Parte ' + (i + 1) + ' de ' + paginas.length;
      nav.querySelectorAll('.pag-puntos i').forEach(function (d, j) { d.classList.toggle('activo', j <= i); });
      nav.querySelector('.pag-anterior').disabled = i === 0;
      nav.querySelector('.pag-siguiente').disabled = i === paginas.length - 1;
      senalarSiguiente(nav, caja);
      if (ajustar) ajustar();
      reanimar(t);
    }
    nav.querySelector('.pag-anterior').addEventListener('click', function (e) { e.stopPropagation(); ir(Math.max(0, pos - 1)); });
    nav.querySelector('.pag-siguiente').addEventListener('click', function (e) { e.stopPropagation(); ir(Math.min(paginas.length - 1, pos + 1)); });
    ir(0);
    return true;
  }
  /* Notas al pie al final de su parte (Esteban, 19/11/2026: «Pie de página mal ubicado», Enfoque U4-L5: la nota 12 salía entre el
     párrafo que la llama y el siguiente). Las notas («.nota-pie») de «grupo» pasan, en su orden, detrás del último párrafo del grupo
     que no es nota; el texto no cambia. «grupo»: los párrafos de una parte, o todos si no hay partes. */
  function notasAlFinal(t, grupo) {
    var notas = grupo.filter(function (x) { return x.classList.contains('nota-pie'); });
    var cuerpo = grupo.filter(function (x) { return !x.classList.contains('nota-pie'); });
    if (!notas.length || !cuerpo.length) return;
    var ultimo = cuerpo[cuerpo.length - 1];
    if (grupo.indexOf(ultimo) < grupo.indexOf(notas[0])) return;   // ya están al final
    /* Un párrafo dentro de un envoltorio (dos columnas de viñetas breves): la nota va detrás del envoltorio. */
    while (ultimo.parentNode && ultimo.parentNode !== t && t.contains(ultimo.parentNode)) ultimo = ultimo.parentNode;
    var ancla = ultimo.nextSibling;
    notas.forEach(function (n) { ultimo.parentNode.insertBefore(n, ancla); });
  }
  /* Sin escritura en curso (lectura ya leída que se vuelve a abrir, «reducir movimiento» o texto ya mostrado completo), la parte
     a la vista también señala «Seguir leyendo» si hay otra después (Esteban, 01/11/2026: «que cuando termine de escribir le diga o
     le señale dónde tiene que darle para seguir leyendo»). Mientras se escribe, lo señala la escritura al terminar la parte. */
  function senalarSiguiente(nav, caja) {
    var sig = nav.querySelector('.pag-siguiente');
    sig.classList.remove('sigue-aqui');
    setTimeout(function () {
      if (!nav.isConnected || sig.disabled || caja.classList.contains('escribiendo') || caja.querySelector('.escribiendo')) return;
      sig.classList.add('sigue-aqui');
    }, 0);
  }
  /* Cajas de varios párrafos (el caso de la «Actividad de aprendizaje») que no caben ni a 15 px: sus párrafos se reparten en
     partes con «Seguir leyendo», igual que dosificar(), sin recortar nada (Esteban, 28/10/2026: «que no aparezca letra así
     cortada»). Si un párrafo solo no cabe, la letra baja hasta 13 px. «medida»: la caja de alto fijo que no debe desbordarse, si
     no es la misma que reparte (las celdas de una fila de tabla dentro de su panel). Devuelve si hizo partes. */
  function quitarPartes(caja) {
    [].slice.call(caja.children).forEach(function (x) { if (x.classList.contains('lectura-paginas')) x.remove(); else x.classList.remove('parte-oculta'); });
    caja.classList.remove('lectura-pendiente');
  }
  function partirBloques(caja, medida) {
    quitarPartes(caja);
    medida = medida || caja;
    var unidades = [].slice.call(caja.children).filter(function (x) { return !x.classList.contains('cursor-escritura'); });
    if (unidades.length < 2) return false;
    var nav = document.createElement('div');
    nav.className = 'lectura-paginas';
    nav.innerHTML = '<button type="button" class="pag-anterior" aria-label="Parte anterior"><i class="fas fa-arrow-left" aria-hidden="true"></i></button>' +
      '<span class="pag-puntos" aria-hidden="true"></span><span class="pag-estado" aria-live="polite">Parte 1 de 2</span>' +
      '<button type="button" class="pag-siguiente">Seguir leyendo <i class="fas fa-arrow-right" aria-hidden="true"></i></button>';
    caja.appendChild(nav);
    function desborda() { return medida.scrollHeight > medida.clientHeight + 1; }
    var paginas;
    for (var fs = 15; fs >= 13; fs -= 1) {
      caja.style.setProperty('--fs', fs + 'px');
      paginas = [[]];
      unidades.forEach(function (x) { x.classList.add('parte-oculta'); });
      unidades.forEach(function (x) {
        var pg = paginas[paginas.length - 1];
        x.classList.remove('parte-oculta');
        if (pg.length && desborda()) { pg.forEach(function (y) { y.classList.add('parte-oculta'); }); paginas.push([x]); }
        else pg.push(x);
      });
      var caben = paginas.every(function (pg) {
        unidades.forEach(function (x) { x.classList.toggle('parte-oculta', pg.indexOf(x) < 0); });
        return !desborda();
      });
      if (caben) break;
    }
    if (paginas.length < 2) { nav.remove(); unidades.forEach(function (x) { x.classList.remove('parte-oculta'); }); return false; }
    nav.querySelector('.pag-puntos').innerHTML = paginas.map(function () { return '<i></i>'; }).join('');
    var L = { partes: paginas.length, leidas: {}, completa: false, turno: turno, alCompletar: [], sig: nav.querySelector('.pag-siguiente') }, pos = 0;
    nav.lectura = L;
    /* Una página ya leída completa no vuelve a pedir lectura al regresar a ella. */
    if (caja.dataset.leida) L.completa = true;
    else if (datos.completar) { ultimaLectura = L; caja.classList.add('lectura-pendiente'); }
    function ir(i) {
      pos = i;
      L.leidas[i] = true;
      if (!L.completa && Object.keys(L.leidas).length === L.partes) {
        L.completa = true; caja.dataset.leida = '1'; caja.classList.remove('lectura-pendiente');
        L.alCompletar.splice(0).forEach(function (f) { f(); });
        caja.dispatchEvent(new CustomEvent('lectura-completa', { bubbles: true }));
      }
      paginas.forEach(function (pg, j) { pg.forEach(function (x) { x.classList.toggle('parte-oculta', j !== i); }); });
      nav.querySelector('.pag-estado').textContent = 'Parte ' + (i + 1) + ' de ' + paginas.length;
      nav.querySelectorAll('.pag-puntos i').forEach(function (d, j) { d.classList.toggle('activo', j <= i); });
      nav.querySelector('.pag-anterior').disabled = i === 0;
      nav.querySelector('.pag-siguiente').disabled = i === paginas.length - 1;
      senalarSiguiente(nav, caja);
      reanimar(caja);
    }
    nav.querySelector('.pag-anterior').addEventListener('click', function (e) { e.stopPropagation(); ir(Math.max(0, pos - 1)); });
    nav.querySelector('.pag-siguiente').addEventListener('click', function (e) { e.stopPropagation(); ir(Math.min(paginas.length - 1, pos + 1)); });
    ir(0);
    return true;
  }
  /* Lectura por partes sin terminar a la vista dentro de «cont», o null (siempre null sin datos.completar). */
  function faltaLeer(cont) {
    if (!datos.completar || !cont) return null;
    var navs = cont.querySelectorAll('.lectura-paginas');
    for (var i = 0; i < navs.length; i++) { var L = navs[i].lectura; if (L && !L.completa && navs[i].offsetParent !== null) return L; }
    return null;
  }
  function textoFalta(L, que) {
    var leidas = Object.keys(L.leidas).length, faltan = L.partes - leidas;
    return 'Aún no ha leído el 100 % de ' + que + ': lleva el ' + Math.round(100 * leidas / L.partes) + ' % y ' +
      (faltan === 1 ? 'le falta 1 parte' : 'le faltan ' + faltan + ' partes') + '. Use «Seguir leyendo» para completarla y poder avanzar.';
  }
  /* Aviso breve sobre la mediación (o la tarjeta); «pulsar», el «Seguir leyendo» pendiente, late para mostrar qué falta. */
  function avisar(lugar, texto, pulsar) {
    var a = null;
    [].forEach.call(lugar.children, function (c) { if (c.classList.contains('aviso-completar')) a = c; });
    if (!a) { a = document.createElement('p'); a.className = 'aviso-completar'; a.setAttribute('role', 'alert'); lugar.appendChild(a); }
    a.innerHTML = '<i class="fas fa-lock" aria-hidden="true"></i><span>' + esc(texto) + '</span>';
    a.classList.remove('sale'); void a.offsetWidth; a.classList.add('sale');
    clearTimeout(a.reloj); a.reloj = setTimeout(function () { a.classList.remove('sale'); }, 4500);
    if (pulsar) { pulsar.classList.remove('llamar'); void pulsar.offsetWidth; pulsar.classList.add('llamar'); pulsar.focus({ preventScroll: true }); }
  }
  /* «Siguiente» con candado: sigue activo para explicar qué falta, pero no avanza. */
  function candado(boton, si) { boton.classList.toggle('bloqueado', !!si); boton.setAttribute('aria-disabled', String(!!si)); }
  var alCerrarLector = null;
  /* Ventana con el video del caso (escena.boton_video). */
  function abrirVideo(v, desde) {
    var l = raiz.querySelector('.lector');
    retornoFoco = desde || null;
    l.classList.remove('en-hoja'); l.classList.add('amplia', 'con-video-caso');
    l.innerHTML = '<div class="lector-caja" role="dialog" aria-modal="true" aria-label="' + esc(may(v.titulo || 'Video del caso')) + '" tabindex="-1">' +
      '<div class="hoja-cab"><p class="lectura-eyebrow">' + esc(may(v.titulo || 'Video del caso')) + '</p><button type="button" class="cerrar" aria-label="Cerrar el video">Cerrar ×</button></div>' +
      '<video class="video-caso" controls autoplay playsinline src="' + esc(v.src) + '">' + (v.vtt ? '<track kind="subtitles" srclang="es" label="Español" src="' + esc(v.vtt) + '">' : '') + '</video></div>';
    l.hidden = false;
    l.querySelector('.cerrar').onclick = function () { var vid = l.querySelector('video'); if (vid) vid.pause(); l.classList.remove('con-video-caso'); cerrarLector(); };
    l.firstChild.focus({ preventScroll: true });
  }
  /* «destacar» (Tráfico y trata; Juan, 20/11/2026: la «regla de decisión» como recuadro con negritas y fondo; los tips, con su
     estilo propio): dentro de una ventana, el párrafo que empieza por «Regla…» o «TIP —» va en su recuadro, con sus tramos, y su
     comienzo en negrita. Solo el curso que lo pone en sus datos; el texto no cambia. */
  function destacarParrafos(cont) {
    if (!datos.destacar || !cont) return;
    var clase = '';
    [].slice.call(cont.querySelectorAll('.parr')).forEach(function (p) {
      if (p.classList.contains('nota-pie')) { clase = ''; return; }
      if (!p.classList.contains('tramo')) {
        var t = p.textContent;
        clase = /^Regla\b/.test(t) ? 'parr-regla' : /^TIP\s+—/.test(t) ? 'parr-tip' : '';
        if (clase) {
          p.classList.add('parr-ini');
          var m = /^(?:Regla[^.:]{0,90}[.:]|TIP\s+—[^.]{0,140}\.)/.exec(t), n0 = p.firstChild;
          /* Negrita solo si el comienzo está en un nodo de texto (sin una referencia marcada dentro). */
          if (m && n0 && n0.nodeType === 3 && n0.nodeValue.length >= m[0].length) {
            var resto = n0.splitText(m[0].length), fuerte = document.createElement('strong');
            fuerte.textContent = n0.nodeValue; p.replaceChild(fuerte, n0); void resto;
          }
        }
      }
      if (clase) p.classList.add(clase);
    });
  }
  function leer(titulo, texto, obj, desde, hoja, html) {
    var l = raiz.querySelector('.lector');
    l.classList.toggle('lector-alerta', !!(desde && desde.classList && desde.classList.contains('es-alerta')));
    l.classList.toggle('lector-tip', !!(desde && desde.classList && desde.classList.contains('cmp-tip')));
    if (alCerrarLector && !hoja) { var f0 = alCerrarLector; alCerrarLector = null; f0(); }
    retornoFoco = desde || null;
    /* «hoja»: {izq}, la ventana como hoja de cuaderno a la derecha de la tarjeta que se abre (B.giro). */
    l.classList.toggle('en-hoja', !!hoja);
    /* «ventanaAmplia» (Terminaciones, doctora Clara, 18/11/2026: «ventanas más amplias, más texto y menos clics»): la ventana es
       grande, trae el texto completo de la idea y se desplaza si es largo, sin partes ni «Seguir leyendo»; queda leída al final. */
    var amplia = !hoja && !!datos.ventanaAmplia;
    l.classList.toggle('amplia', amplia);
    /* «html»: la ventana trae una tabla completa ya pintada (malla de la página compacta); solo con ventana amplia. */
    if (!amplia) html = null;
    l.classList.toggle('con-tabla', !!html);
    if (hoja) l.style.setProperty('--hoja-izq', hoja.izq + 'px'); else l.style.removeProperty('--hoja-izq');
    var cerrar = '<button type="button" class="cerrar" aria-label="Cerrar lectura">Cerrar ×</button>', arte = obj ? '<span class="lector-arte">' + svgObjeto(obj, 78) + '</span>' : '';
    l.innerHTML = '<div class="lector-caja" role="dialog" aria-modal="true" aria-label="' + esc(may(titulo)) + '" tabindex="-1">' + (hoja || amplia
      /* La hoja de cuaderno del giro (Esteban, 30/10/2026: «en el de seguir leyendo, en la vista escritorio, que sea scroll»): el
         texto completo se desplaza dentro de la hoja, con su avance; queda leído al llegar al final. */
      ? '<div class="hoja-cab"><p class="lectura-eyebrow">' + esc(may(titulo)) + '</p>' + arte + cerrar + '</div>' +
        '<div class="lectura-texto hoja-texto desplazable" tabindex="0">' + (html || rico(texto)) + '</div><p class="hoja-pie" aria-live="polite"></p>'
      : cerrar + arte + '<p class="lectura-eyebrow">' + esc(may(titulo)) + '</p><p class="lectura-texto">' + rico(texto) + '</p>') + '</div>';
    l.hidden = false;
    /* La ventana también se escribe letra por letra y, al terminar cada parte, «Seguir leyendo» dice «¡Siga aquí!» (Esteban,
       31/10/2026: prioridad 1 del diagnóstico de detalles, el lector del esquema, los puntos, la lámina, el mapa mental y el mapa).
       Las letras se envuelven antes de medir y repartir la lectura, para que nada cambie de lugar al escribirse. */
    var lt = !hoja && !amplia && !quieto ? l.firstChild.querySelector('.lectura-texto') : null, letras = lt ? envolverLetras(lt) : null, partes = false;
    if ((hoja || amplia) && !html) { var ht = l.firstChild.querySelector('.lectura-texto'); notasAlFinal(ht, [].slice.call(ht.querySelectorAll('.parr'))); destacarParrafos(ht); }
    if (hoja) { leerDesplazando(l.firstChild, !!datos.ventanaAmplia); rellenarHoja(l.firstChild); }   // con ventana amplia, sin escribir letra por letra
    else if (amplia) {
      /* «huecosFinos» (Tráfico, 20/11/2026): una ventana amplia con poco texto, o con renglones cortos (una lista), dejaba vacía la
         mitad derecha; lleva el objeto de su tema a la derecha y, si es breve, letra más grande. */
      if (datos.huecosFinos && !html) {
        var hx = l.firstChild.querySelector('.hoja-texto'), ps = [].slice.call(hx.querySelectorAll('.parr')), tot = hx.textContent.length;
        if (tot < 420) hx.classList.add('hoja-breve');
        else if (ps.length >= 4 && tot / ps.length < 120) {
          var fg = document.createElement('span'); fg.className = 'lector-figura'; fg.setAttribute('aria-hidden', 'true');
          fg.innerHTML = svgObjeto(obj || 'documento', 170); hx.insertBefore(fg, hx.firstChild);
        }            
      }
      leerDesplazando(l.firstChild, true);
    }
    else if (!(partes = !!dosificar(l.firstChild, function () { encajarLector(l.firstChild); }))) encajarLector(l.firstChild);
    if (!animarApertura(l, desde)) reanimar(l.firstChild);
    if (letras) escribirVentana(lt, letras, partes);
    /* Lo que se abrió y aún no está visto (le falta una parte) late hasta completarse: el estudiante sabe dónde le falta leer. */
    if (desde && desde.classList) desde.classList.add('abierta');
    l.querySelector('.cerrar').onclick = cerrarLector;
    l.firstChild.focus({ preventScroll: true });
  }
  /* La ventana nace del elemento que la abre y se expande al centro con un rebote breve; su contenido entra escalonado (Esteban,
     30/10/2026: «que aparezca el modal… de forma animada, bien chévere»). Web Animations API, sin bibliotecas; nada con «reducir
     movimiento». Dura menos de 0,4 s, para que la lectura esté quieta al medirla. */
  var quieto = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  /* Escritura letra por letra (revisores externos, 10/11/2026: «si quiero devolverme para ver una lección se me hace muy lento
     hasta que se escriba todo… debería haber alguna opción de deshabilitar»; «si se pasa antes de que acabe el texto se queda
     trabada la lección»):
     - un texto que ya se escribió una vez aparece completo al volver (se recuerda en el navegador, por curso);
     - el botón «Escritura» de la franja de abajo la apaga o la enciende para todo el curso (preferencia del navegador);
     - al pasar de escena, de parte o de página, lo que se estaba escribiendo se completa de una vez: nada queda a medias. */
  var CLAVE_ESC = 'ova-escritura', CLAVE_ESCRITOS = 'ova-escritos-' + (datos.clave_curso || 'curso');
  function escrituraAnimada() { try { return localStorage.getItem(CLAVE_ESC) !== 'inmediata'; } catch (e) { return true; } }
  var escritos = (function () { try { return JSON.parse(localStorage.getItem(CLAVE_ESCRITOS) || '[]'); } catch (e) { return []; } })();
  function huella(t) {
    var x = (t.textContent || '').replace(/\s+/g, ' ').trim(), h = 0;
    for (var k = 0; k < x.length; k++) h = (h * 31 + x.charCodeAt(k)) | 0;
    return x.length + ':' + h;
  }
  function anotarEscrito(t) {
    var h = huella(t);
    if (escritos.indexOf(h) >= 0) return;
    escritos.push(h);
    if (escritos.length > 800) escritos.splice(0, escritos.length - 800);
    try { localStorage.setItem(CLAVE_ESCRITOS, JSON.stringify(escritos)); } catch (e) {}
  }
  /* Contraste de los iconos (revisores externos, 10/11/2026: «se pierden los iconos, los colores son del mismo color del fondo…
     pasa en todas las lecciones»; docs/directrices-cursos.md, sección 15). Cada icono visible se mide contra el fondo que tiene
     detrás (las capas de color de sus antepasados); si queda por debajo de 3:1, toma el color oscuro del tema o el blanco, el que
     contraste más. Se repite cuando algo cambia (ventanas, estados); no toca los dibujos (obj-svg). Lo mide herramientas/qa_iconos.js. */
  function contrasteIconos() {
    if (contrasteIconos.listo) return;   // un solo observador; las escenas siguientes se miden al cambiar el contenido
    contrasteIconos.listo = true;
    var rgb = function (s) {
      s = String(s).trim();
      if (s[0] === '#') { var h = s.slice(1); if (h.length === 3) h = h.replace(/./g, '$&$&'); return { c: [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }), a: 1 }; }
      var q = s.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);   // color-mix()
      if (q) return { c: [q[1], q[2], q[3]].map(function (x) { return Number(x) * 255; }), a: q[4] === undefined ? 1 : Number(q[4]) };
      var m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null;
      var v = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return { c: v.slice(0, 3), a: v.length > 3 ? v[3] : 1 };
    };
    var lum = function (c) { var p = [0.2126, 0.7152, 0.0722]; return c.reduce(function (s, x, i) { x /= 255; return s + p[i] * (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)); }, 0); };
    var con = function (a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    var mezcla = function (a, b, k) { return a.map(function (v, i) { return v * k + b[i] * (1 - k); }); };
    var oscuro = (rgb(getComputedStyle(document.documentElement).getPropertyValue('--marino')) || { c: [52, 52, 52] }).c;
    function fondo(e) {
      var capas = [];
      for (var x = e; x && x.nodeType === 1; x = x.parentElement) {
        var cs = getComputedStyle(x);
        if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;   // imagen o degradado: no se mide
        var b = rgb(cs.backgroundColor);
        if (b && b.a > 0) { capas.push(b); if (b.a >= 0.99) break; }
      }
      var c = [255, 255, 255];
      for (var i = capas.length - 1; i >= 0; i--) c = mezcla(capas[i].c, c, capas[i].a);
      return c;
    }
    function pasar() {
      raiz.querySelectorAll('i[class*="fa-"]').forEach(function (e) {
        if (e.closest('.obj-svg')) return;
        if (e.dataset.contraste) { e.style.color = ''; delete e.dataset.contraste; }
        if (!e.getClientRects().length) return;
        var col = rgb(getComputedStyle(e).color), bg = fondo(e.parentElement);
        if (!col || !bg) return;
        var c = col.a < 1 ? mezcla(col.c, bg, col.a) : col.c;
        if (con(c, bg) >= 3) return;
        var mejor = con(oscuro, bg) >= con([255, 255, 255], bg) ? oscuro : [255, 255, 255];
        e.style.color = 'rgb(' + mejor.map(Math.round).join(',') + ')';
        e.dataset.contraste = '1';
      });
    }
    var pendiente = null;
    function pronto() { clearTimeout(pendiente); pendiente = setTimeout(function () { requestAnimationFrame(pasar); }, 120); }
    pasar();
    if (window.MutationObserver) new MutationObserver(pronto).observe(raiz, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(pronto);
  }
  var escritores = [];   // terminar() de cada escritura en curso
  function completarEscrituras() { escritores.splice(0).forEach(function (f) { f(); }); }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.pag-siguiente, .pag-anterior, [data-ir], .caso-nav button, .nav-local button')) completarEscrituras();
  }, true);
  window.addEventListener('pagehide', completarEscrituras);
  function animarApertura(l, desde) {
    var caja = l.firstChild;
    if (quieto || !caja || !caja.animate || !desde || !desde.getBoundingClientRect) return false;
    var o = desde.getBoundingClientRect(), c = caja.getBoundingClientRect();
    if (!o.width || !c.width) return false;
    var dx = o.left + o.width / 2 - (c.left + c.width / 2), dy = o.top + o.height / 2 - (c.top + c.height / 2);
    var s = Math.max(0.15, Math.min(1, o.width / c.width, o.height / c.height));
    l.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
    if (l.classList.contains('en-hoja')) {
      caja.animate([{ transform: 'translateX(-70px) rotate(-4deg) scale(.96)', opacity: 0 }, { transform: 'translateX(4px) rotate(.2deg)', opacity: 1, offset: 0.75 },
        { transform: 'rotate(-.4deg)', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.2,.9,.3,1)' });
    } else caja.animate([{ transform: 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + s.toFixed(3) + ')', opacity: 0.35 },
      { transform: 'translate(0,0) scale(1.015)', opacity: 1, offset: 0.78 }, { transform: 'none', opacity: 1 }],
      { duration: 340, easing: 'cubic-bezier(.2,.9,.3,1)' });
    [].forEach.call(caja.querySelectorAll('.lector-arte,.lectura-eyebrow,.lectura-texto,.lectura-paginas,.cerrar,.hoja-pie'), function (x, i) {
      x.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
        { duration: 220, delay: Math.min(130, 70 + i * 30), easing: 'ease-out', fill: 'backwards' });
    });
    return true;
  }
  /* Lectura con desplazamiento dentro de la hoja: un indicador dice cuánto falta («Deslice para seguir leyendo · 40 %») y la línea del
     margen se llena con lo leído. Con datos.completar, el visto llega al llegar al final del texto (leer el 100 %). */
  function leerDesplazando(caja, sinEscribir) {
    var t = caja.querySelector('.hoja-texto'), pie = caja.querySelector('.hoja-pie');
    var L = { partes: 1, leidas: {}, completa: false, turno: turno, alCompletar: [] };
    if (datos.completar) ultimaLectura = L;
    var escribiendo = !sinEscribir;
    function revisar() {
      if (!t.isConnected) return;
      if (escribiendo) {
        pie.innerHTML = '<i class="fas fa-pen-nib" aria-hidden="true"></i> Escribiendo… toque la hoja para verla completa';
        return;
      }
      var sobra = t.scrollHeight - t.clientHeight, pct = sobra <= 2 ? 100 : Math.min(100, Math.round(100 * (t.scrollTop + t.clientHeight) / t.scrollHeight));
      caja.style.setProperty('--leido', pct + '%');
      if (sobra - t.scrollTop <= 4) {
        if (!L.completa) { L.completa = true; L.alCompletar.splice(0).forEach(function (f) { f(); }); }
        caja.classList.add('hoja-leida');
        pie.innerHTML = visto + ' Leído completo';
      } else pie.innerHTML = '<i class="fas fa-angles-down" aria-hidden="true"></i> Deslice para seguir leyendo · ' + pct + ' %';
    }
    t.addEventListener('scroll', revisar, { passive: true });
    revisar();
    if (sinEscribir) requestAnimationFrame(revisar);
    else escribir(t, function () { escribiendo = false; revisar(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(revisar);
  }
  /* El texto de la hoja se va escribiendo, palabra por palabra, con un cursor que parpadea, y la hoja baja sola siguiéndolo
     (Esteban, 30/10/2026: «que las letras no aparezcan de una, que se vaya escribiendo, así el usuario va leyendo»). Tocar la hoja,
     girar la rueda o usar el teclado lo muestra completo de una vez. El texto está entero en el documento desde el principio (los
     lectores de pantalla lo leen completo); con «reducir movimiento» aparece de una vez. */
  function escribir(t, fin) {
    if (quieto) { fin(); return; }
    escribirLetras(t, envolverLetras(t), fin);
  }
  /* Cada carácter del texto en su propia letra («l»), sin cambiar el texto: se hace antes de medir y repartir la lectura. */
  function envolverLetras(t) {
    /* Escritura real (Esteban, 31/10/2026: «ponle como escritura real, la animación de aparición está muy lag»): letra por
       letra, con el texto ya en su lugar (cada letra existe desde el principio y solo se hace visible: nada se reacomoda) y un
       cursor que se desliza detrás de la última letra. Va con requestAnimationFrame, sin temporizadores a saltos. */
    var letras = [], nodos = [], n, w = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
    while ((n = w.nextNode())) if (n.nodeValue.trim()) nodos.push(n);
    nodos.forEach(function (nodo) {
      /* Un resaltado (referencia jurídica, caja) no se ve vacío antes de tiempo: aparece con su primera letra. */
      var pa = nodo.parentNode;
      if (pa !== t && pa.nodeType === 1) {
        var cs = getComputedStyle(pa);
        if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.borderBottomStyle !== 'none' || cs.boxShadow !== 'none') pa.classList.add('caja-letras');
      }
      var frag = document.createDocumentFragment();
      Array.from(nodo.nodeValue).forEach(function (ch) {
        var s = document.createElement('span');
        s.className = 'l'; s.textContent = ch; frag.appendChild(s); letras.push(s);
      });
      nodo.parentNode.replaceChild(frag, nodo);
    });
    return letras;
  }
  /* Las letras se hacen visibles al ritmo de lectura; si la siguiente está en una parte oculta (lectura por partes), la
     escritura espera hasta que esa parte se muestre con «Seguir leyendo». */
  function escribirLetras(t, letras, fin) {
    if (!letras || !letras.length) { fin(); return; }
    /* Si una nota al pie pasó al final de su parte (notasAlFinal), las letras se escriben en el orden en que se ven. */
    if (t.querySelector && t.querySelector('.nota-pie')) letras.sort(function (a, b) { return a.compareDocumentPosition(b) & 4 ? -1 : 1; });
    if (!escrituraAnimada() || (escena && escena.textoFijo) || escritos.indexOf(huella(t)) >= 0) {
      /* Escritura apagada o texto ya escrito antes: aparece completo de una vez. */
      letras.forEach(function (s) {
        var pa = s.parentNode;
        if (pa.classList && pa.classList.contains('caja-letras')) pa.classList.add('con-letra');
        s.classList.add('vista');
      });
      fin(); return;
    }
    /* Al ritmo de quien lee con fluidez (Esteban, 31/10/2026): en español, unas 220 palabras o 1 000 caracteres por minuto
       (IReST): 58 ms por carácter, con una variación mínima, una pausa breve tras la coma y otra mayor al cerrar la oración. */
    var cuando = [], acum = 250;
    letras.forEach(function (s, k) {
      cuando.push(acum);
      var ch = s.textContent, sig = letras[k + 1] ? letras[k + 1].textContent : ' ';
      acum += 58 * (0.85 + 0.3 * ((k * 7919) % 13) / 12);
      if (/\s/.test(sig)) { if (/[,;:]/.test(ch)) acum += 180; else if (/[.?!…]/.test(ch)) acum += 320; }
    });
    var cursor = document.createElement('span');
    cursor.className = 'cursor-escritura'; cursor.setAttribute('aria-hidden', 'true');
    t.appendChild(cursor);
    t.classList.add('escribiendo');
    var i = 0, tiempo = 0, ultimo = null, cuadro = null, listo = false, esperando = false;
    /* Terminada una parte (Esteban, 31/10/2026: «que cuando termine le indique al usuario que tiene que darle seguir»): «Seguir
       leyendo» late y un globo dice «¡Siga aquí!» hasta que lo toca. */
    function seguirAqui(si) {
      /* Desde la propia lectura hacia afuera, sin salir de su página del caso: cada página tiene su «Seguir leyendo». */
      var cont = t, sig = null;
      for (var k = 0; k < 5 && cont && !sig; k++, cont = cont.parentNode) {
        sig = cont.querySelector && cont.querySelector('.pag-siguiente');
        if (cont.classList && cont.classList.contains('caso-pagina')) break;
      }
      if (!sig) return;
      sig.classList.toggle('sigue-aqui', si && !sig.disabled);
    }
    function terminar() {
      if (listo) return;
      listo = true; cancelAnimationFrame(cuadro);
      var k0 = escritores.indexOf(terminar);
      if (k0 >= 0) escritores.splice(k0, 1);
      /* Lo que quedaba por escribir aparece de una vez (también lo de las partes que siguen) y el texto queda anotado. */
      letras.forEach(function (s) {
        var pa = s.parentNode;
        if (pa && pa.classList && pa.classList.contains('caja-letras')) pa.classList.add('con-letra');
        s.classList.add('vista');
      });
      anotarEscrito(t);
      seguirAqui(true);   // terminada (o mostrada completa con un toque), señala «Seguir leyendo» si queda otra parte
      t.classList.remove('escribiendo'); cursor.remove();
      ['click', 'wheel', 'touchstart', 'keydown'].forEach(function (e) { t.removeEventListener(e, terminar); });
      fin();
    }
    ['click', 'wheel', 'touchstart', 'keydown'].forEach(function (e) { t.addEventListener(e, terminar, { passive: true }); });
    escritores.push(terminar);
    function cuadroDe(ahora) {
      if (!t.isConnected || listo) return;
      var dt = ultimo === null ? 0 : Math.min(100, ahora - ultimo), antes = i;
      ultimo = ahora;
      if (i < letras.length && !letras[i].offsetParent) {
        /* Parte oculta: espera y le indica al estudiante que siga. Si lo oculto es toda la lectura (otra página del caso), espera
           callada y sigue donde iba al volver. */
        var toda = !t.getClientRects().length;
        if (esperando === toda) { esperando = !toda; seguirAqui(esperando); }
        cuadro = requestAnimationFrame(cuadroDe); return;
      }
      if (esperando) { esperando = false; seguirAqui(false); }
      tiempo += dt;
      while (i < letras.length && cuando[i] <= tiempo && letras[i].offsetParent) {
        var pa = letras[i].parentNode;
        if (pa.classList && pa.classList.contains('caja-letras')) pa.classList.add('con-letra');
        letras[i++].classList.add('vista');
      }
      if (i > antes) {
        var ult = letras[i - 1], r = ult.getBoundingClientRect(), c = t.getBoundingClientRect();
        cursor.style.transform = 'translate(' + (r.right - c.left + t.scrollLeft).toFixed(1) + 'px,' + (r.top - c.top + t.scrollTop).toFixed(1) + 'px)';
        cursor.style.height = r.height + 'px';
        if (r.bottom > c.bottom - 8) t.scrollTop += r.bottom - c.bottom + 30;   // la hoja baja con lo que se escribe
      }
      if (i >= letras.length) { setTimeout(terminar, 450); return; }
      cuadro = requestAnimationFrame(cuadroDe);
    }
    cuadro = requestAnimationFrame(cuadroDe);
  }
  /* Escribe la lectura de una ventana (lector, comparación). Con datos.completar y sin partes, queda leída al terminar de
     escribirse, como la hoja del giro; con partes, al pasar la última. Tocar el texto lo muestra completo. */
  function escribirVentana(t, letras, conPartes) {
    var L = null;
    if (datos.completar && !conPartes) { L = { partes: 1, leidas: {}, completa: false, turno: turno, alCompletar: [] }; ultimaLectura = L; }
    escribirLetras(t, letras, function () { if (L && !L.completa) { L.completa = true; L.alCompletar.splice(0).forEach(function (f) { f(); }); } });
    return L;
  }
  /* Al cerrar una lectura sin terminarla, un aviso lo dice por escrito (Esteban, 31/10/2026: «que le diga que le falta leer… ya que
     ahora solo titilan»). No tapa nada que se pueda tocar y se va solo. */
  function avisarFalta(titulo, mensaje) {
    if (titulo) titulo = titulo.replace(/^\d+ de \d+ · /, '');   // el eje rotula su ventana «1 de 10 · …»
    var v = raiz.querySelector('.aviso-falta');
    if (v) v.remove();
    v = document.createElement('p');
    v.className = 'aviso-falta'; v.setAttribute('role', 'status');
    v.innerHTML = '<i class="fas fa-book-open" aria-hidden="true"></i><span>' + (mensaje || 'Falta leer' + (titulo ? ' «' + esc(titulo) + '»' : '') + '. Ábrala de nuevo para terminar.') + '</span>';
    raiz.appendChild(v);
    setTimeout(function () { v.classList.add('sale'); setTimeout(function () { v.remove(); }, 400); }, 3400);
  }
  /* Estado escrito de lo que abre una lectura: «Por leer», «Falta leer» (abierta sin terminar) o «Leída» (base.css). */
  var estado = '<span class="estado-lectura"><span class="est-por">Por leer</span><span class="est-falta"><i class="fas fa-book-open" aria-hidden="true"></i> Falta leer</span>' +
    '<span class="est-leida"><i class="fas fa-circle-check" aria-hidden="true"></i> Leída</span></span>';
  /* Si el texto no cabe en el lector, la letra baja de a medio punto (hasta 12 px): nunca desplazamiento. */
  /* Hoja de cuaderno con un texto breve (datos.rellenoHoja, Desaparición forzada, 04/11/2026; Esteban: «recuerda no dejar esos
     espacios en blanco»): si el texto cabe sin desplazarse, la hoja ocupa el alto del lector y la imagen de relleno de la escena
     llena el espacio bajo el texto. Con un texto largo (se desplaza), nada cambia. */
  function rellenarHoja(caja) {
    if (!datos.rellenoHoja || !datos.ilustraciones || !escena.relleno) return;
    var t = caja.querySelector('.hoja-texto');
    if (!t || t.scrollHeight > t.clientHeight + 2) return;   // texto largo: se lee desplazándolo, sin relleno
    caja.classList.add('hoja-con-relleno');
    var f = document.createElement('figure');
    f.className = 'relleno-arte hoja-relleno'; f.setAttribute('aria-hidden', 'true');
    f.innerHTML = '<img src="' + srcImagen(escena.relleno) + '" alt="">';
    t.insertAdjacentElement('afterend', f);
    // 1. Debajo del texto, solo si de verdad sobra espacio (110 px o más, como en rellenar()) y nada se sale de la hoja.
    if (f.clientHeight >= 110 && caja.scrollHeight <= caja.clientHeight + 1) return;
    f.remove(); caja.classList.remove('hoja-con-relleno');
    // 2. Al lado: renglones breves (una lista corta) dejan libre la parte derecha de la hoja; la imagen va allí, a la altura del texto.
    var libre = t.clientWidth - anchoOcupado(t), alto = t.clientHeight;
    if (libre >= 200 && alto >= 100) {
      f.className = 'relleno-arte hoja-relleno al-lado';
      f.style.width = Math.min(libre - 24, 300) + 'px'; f.style.height = alto + 'px';
      t.insertBefore(f, t.firstChild);   // sin animación de entrada (base.css): su desplazamiento contaba como desborde
      if (caja.scrollHeight <= caja.clientHeight + 1 && t.scrollHeight <= t.clientHeight + 2) return;
      f.remove();
    }
    // 3. Sin lugar para la imagen: la hoja toma el alto del lector y la letra crece hasta llenarla (sin salirse).
    caja.classList.add('hoja-con-relleno', 'hoja-llena');
    var fs = parseFloat(getComputedStyle(t).fontSize), mejor = fs;
    for (var x = fs + 0.5; x <= 21; x += 0.5) {
      t.style.fontSize = x + 'px';
      // Estricto: un solo píxel de más abría la barra de desplazamiento de la hoja.
      if (caja.scrollHeight > caja.clientHeight || t.scrollHeight > t.clientHeight) break;
      mejor = x;
    }
    t.style.fontSize = mejor + 'px';
  }
  /* Ancho que ocupa el texto: hasta el final de su renglón más largo. */
  function anchoOcupado(t) {
    var r = t.getBoundingClientRect(), max = 0, w = document.createTreeWalker(t, NodeFilter.SHOW_TEXT), n, rg = document.createRange();
    while ((n = w.nextNode())) {
      if (!n.textContent.trim()) continue;
      rg.selectNodeContents(n);
      [].forEach.call(rg.getClientRects(), function (q) { max = Math.max(max, q.right - r.left); });
    }
    return max;
  }
  function encajarLector(caja) {
    var t = caja.querySelector('.lectura-texto'), fs = parseFloat(getComputedStyle(t).fontSize);
    while (caja.scrollHeight > caja.clientHeight + 1 && fs > 12) { fs -= 0.5; t.style.fontSize = fs + 'px'; }
  }
  function cerrarLector() {
    var l = raiz.querySelector('.lector');
    if (!l || l.hidden) return false;
    var d = retornoFoco, titulo = l.firstChild && l.firstChild.getAttribute && l.firstChild.getAttribute('aria-label'), hoja = l.classList.contains('en-hoja');
    l.hidden = true; l.innerHTML = '';
    if (alCerrarLector) { var f = alCerrarLector; alCerrarLector = null; f(); }
    if (!hoja && datos.completar && d && d.dataset && d.dataset.id && !vistos[d.dataset.id]) avisarFalta(titulo);
    if (retornoFoco && retornoFoco.isConnected) retornoFoco.focus({ preventScroll: true });
    return true;
  }

  /* Nada de bloques largos a la vista: un encabezado de bloque breve se muestra; uno largo se abre al tocarlo. */
  function tituloBloque(b, k) {
    if (!b.titulo || !b.titulo.length) return '';
    var t = segs(b.titulo);
    if (t.length <= 110) return '<p class="bloque-titulo">' + esc(may(t)) + '</p>';
    return fichaIntro('bt' + k, b.rotulo || primerasPalabras(t), t, 'documento');
  }
  function primerasPalabras(t) { var w = t.split(/\s+/); return cerrarSignos(w.length > 6 ? w.slice(0, 6).join(' ') + '…' : t); }
  function fichaIntro(id, rotulo, texto, obj) {
    return '<button type="button" class="intro' + refc(rotulo) + '" data-id="' + id + '" data-rotulo="' + esc(rotulo) + '" data-obj="' + obj + '" data-texto="' + esc(texto) + '">' +
      '<span class="intro-arte">' + svgObjeto(obj, 34) + '</span><span class="intro-rotulo">' + rot(rotulo) + '</span>' +
      '<span class="intro-toca">' + mano + ' Toque para leer</span><span class="intro-visto">' + visto + '</span></button>';
  }

  /* ---------- Bloques ---------- */
  var B = {};

  B.mapa = function (b, k) {
    var centro = b.items.filter(function (x) { return x.centro; })[0], ramas = b.items.filter(function (x) { return !x.centro; });
    var n = ramas.length, nodos = '', lineas = '';
    ramas.forEach(function (r, i) {
      var ang = -Math.PI / 2 + i * 2 * Math.PI / n, x = 50 + 37 * Math.cos(ang), y = 52 + 36 * Math.sin(ang);
      lineas += '<line x1="50" y1="52" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" style="--d:' + (0.15 + i * 0.1) + 's"/>';
      nodos += boton('rama', r, k, i + 1, 'left:' + x.toFixed(1) + '%;top:' + y.toFixed(1) + '%;--d:' + (0.25 + i * 0.1) + 's');
    });
    return '<div class="mapa"><svg class="mapa-lineas" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + lineas + '</svg>' +
      boton('nucleo', centro, k, 0, 'left:50%;top:52%') + nodos + '</div>';
  };
  function boton(clase, item, k, i, estilo) {
    return '<button type="button" class="nodo ' + clase + refc(item.label) + '" data-id="' + k + '-' + i + '" data-b="' + k + '" data-i="' + i + '" style="' + estilo + '">' +
      '<span class="nodo-arte">' + svgObjeto(item.obj, clase === 'nucleo' ? 70 : 48) + '</span><span class="nodo-rotulo">' + rot(item.label) + '</span>' +
      '<span class="nodo-marca">' + mano + visto + '</span>' + estado + '</button>';
  }
  B.mapa.activar = function (b, k, el) {
    var orden = [b.items.filter(function (x) { return x.centro; })[0]].concat(b.items.filter(function (x) { return !x.centro; }));
    el.querySelectorAll('.nodo').forEach(function (n) {
      n.addEventListener('click', function () {
        var it = orden[Number(n.dataset.i)];
        leer(it.label, segs(it.segs), it.obj, n); marcar(n.dataset.id);
      });
    });
  };

  var LW = 720, LH = 340, LBASE = 300;
  B.lamina = function (b, k) {
    var n = b.items.length, s = n === 1 ? 1.75 : n === 2 ? 1.5 : n === 3 ? 1.62 : n === 4 ? 1.38 : 1.2, C = O.C, xs = [];
    for (var i = 0; i < n; i++) xs.push(n === 1 ? 360 : Math.round(150 + i * (420 / (n - 1))));
    var pared = '<rect width="' + LW + '" height="' + (LBASE - 4) + '" fill="#EEF8F5"/><rect y="' + (LBASE - 70) + '" width="' + LW + '" height="66" fill="#E2F2EE"/>' +
      '<rect x="40" y="26" width="64" height="48" rx="4" fill="' + C.blanco + '" stroke="' + C.niebla + '" stroke-width="4"/><path d="M48 66 L64 48 L76 58 L86 44 L96 66 Z" fill="' + C.celeste + '"/>' +
      '<rect x="616" y="22" width="56" height="62" rx="4" fill="' + C.blanco + '" stroke="' + C.niebla + '" stroke-width="4"/><circle cx="644" cy="46" r="12" fill="' + C.coral + '"/><rect x="628" y="64" width="32" height="5" rx="2" fill="' + C.celeste + '"/>';
    var svg = '<svg class="lamina-svg" viewBox="0 0 ' + LW + ' ' + LH + '" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' + pared +
      '<rect y="' + (LBASE - 4) + '" width="' + LW + '" height="' + (LH - LBASE + 4) + '" fill="' + C.piso + '"/>' +
      O.dibujar('planta', 34, LBASE + 8, 0.7, 'deco') + O.dibujar('planta', 690, LBASE + 8, 0.56, 'deco') +
      b.items.map(function (it, i) { return O.dibujar(it.obj, xs[i], LBASE, s, 'entra e' + i); }).join('') + '</svg>';
    return '<div class="lamina">' + svg + b.items.map(function (it, i) {
      return '<button type="button" class="punto' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '" data-x="' + xs[i] + '" data-y="' + Math.round(LBASE - 120 * s) + '">' +
        '<span class="punto-n">' + (i + 1) + '</span><span class="punto-rotulo">' + rot(it.label) + '</span>' + mano + '<span class="punto-visto">' + visto + '</span>' + estado + '</button>';
    }).join('') + '</div>';
  };
  function posicionarPuntos() {
    raiz.querySelectorAll('.lamina').forEach(function (lam) {
      var svg = lam.querySelector('.lamina-svg'), ctm = svg.getScreenCTM(), r = lam.getBoundingClientRect();
      if (!ctm) return;
      lam.querySelectorAll('.punto').forEach(function (p) {
        var pt = svg.createSVGPoint(); pt.x = Number(p.dataset.x); pt.y = Number(p.dataset.y) - 4;
        var q = pt.matrixTransform(ctm);
        p.style.left = Math.max(p.offsetWidth / 2 + 4, Math.min(r.width - p.offsetWidth / 2 - 4, q.x - r.left)) + 'px';
        p.style.top = Math.max(p.offsetHeight + 4, q.y - r.top) + 'px';
      });
    });
  }
  window.addEventListener('resize', posicionarPuntos);
  B.lamina.activar = function (b, k, el) {
    posicionarPuntos(); requestAnimationFrame(posicionarPuntos);
    if (document.fonts) document.fonts.ready.then(posicionarPuntos);
    var objs = el.querySelectorAll('.objeto:not(.deco)');
    el.querySelectorAll('.punto').forEach(function (p) {
      p.addEventListener('click', function () {
        var i = Number(p.dataset.i), it = b.items[i];
        objs.forEach(function (o, j) { o.classList.toggle('activo', j === i); });
        leer(it.label, segs(it.segs), it.obj, p); marcar(p.dataset.id);
      });
    });
  };

  /* Comienzo literal del texto (sin notas ni marcas) para que la cara de la tarjeta no quede vacía; el texto completo se lee al girarla. */
  /* Ninguna letra cortada (Esteban, 28/10/2026: «que no aparezca letra así cortada… déjalo en directrices»): un extracto que no
     cabe en sus líneas se acorta por palabras completas y termina en «…» (el texto completo está en su lector); si no caben ni
     tres palabras, no se muestra. Reemplaza el corte de -webkit-line-clamp, que dejaba palabras partidas. */
  function ajustarExtractos() {
    raiz.querySelectorAll('.giro-extracto,.rama-extracto,.esquema-extracto').forEach(function (e) {
      if (!e.dataset.completo) e.dataset.completo = e.textContent;
      var base = e.dataset.completo, puntos = /…$/.test(base), palabras = base.replace(/…$/, '').split(/\s+/), lo = 0, hi = palabras.length;
      function poner(n) { e.textContent = cerrarSignos(palabras.slice(0, n).join(' ') + (n < palabras.length || puntos ? '…' : '')); }
      var caja = e.closest('.cara') || e.closest('button');
      function cabe() { return e.scrollHeight <= e.clientHeight + 1 && e.scrollWidth <= e.clientWidth + 1 && (!caja || caja.scrollHeight <= caja.clientHeight + 1); }
      e.style.display = ''; e.style.fontSize = ''; e.style.webkitLineClamp = '';
      poner(hi);
      /* Con datos.sinHuecos, el extracto completo crece (hasta 17 px) mientras quepa en su tarjeta: la tarjeta no queda medio
         vacía con letra pequeña («no dejar esos espacios en blanco»). */
      var tarjeta = e.closest('.cara') || e.closest('button');
      /* Con «ventanaAmplia» (Terminaciones, doctora Clara) los extractos no crecen: todas las tarjetas con la misma letra. */
      if (datos.sinHuecos && !datos.ventanaAmplia && tarjeta && !e.classList.contains('giro-extracto') && cabe()) {
        var fs0 = parseFloat(getComputedStyle(e).fontSize), mejor = 0;
        e.style.webkitLineClamp = 'unset';
        for (var fs = 17; fs > fs0; fs -= 0.5) {
          e.style.fontSize = fs + 'px';
          if (tarjeta.scrollHeight <= tarjeta.clientHeight + 1 && cabe()) { mejor = fs; break; }
        }
        if (!mejor) { e.style.fontSize = ''; e.style.webkitLineClamp = ''; }
        return;
      }
      if (cabe()) return;
      while (lo < hi) { var m = Math.ceil((lo + hi) / 2); poner(m); if (cabe()) lo = m; else hi = m - 1; }
      if (lo < 3) { e.style.display = 'none'; return; }
      poner(lo);
    });
  }
  /* Giro en dos filas (Esteban, 28/10/2026, sobre las cinco tarjetas angostas de U1-L3-E28: «organizarla de una distinta
     manera… para que no queden así esas líneas largas… agradable a la vista»): con datos.sinHuecos, si cada tarjeta quedaría de
     menos de 150 px de ancho, van en dos filas (3 + 2 centradas, 2 + 2, 3 + 3), con el dibujo más pequeño. */
  function organizarGiros() {
    raiz.querySelectorAll('.giros').forEach(function (g) {
      var n = g.children.length;
      g.style.removeProperty('--c'); g.classList.remove('dos-filas');
      if (!datos.sinHuecos || n < 4 || g.clientWidth / n >= 150) return;
      g.classList.add('dos-filas');
      g.style.setProperty('--c', String(Math.ceil(n / 2) * 2));
    });
  }
  /* Si la tarjeta aún no cabe (rótulo largo), primero se quita el dibujo de la cara y luego baja la letra del rótulo hasta
     10 px: el rótulo nunca queda cortado. */
  /* El borde que late en lo no visto (::after con «latido», que escala hasta 1,35) agranda el scrollHeight de su tarjeta según
     el momento de la animación: medida a destiempo, la tarjeta «no cabía» y perdía su dibujo y su extracto (SRPA U2-L3-E10
     al cargar en Genially, 30/10/2026). Mientras se mide, ese borde se oculta; la medida y la vuelta ocurren sin pintar. */
  function midiendo(fn) { raiz.classList.add('midiendo'); try { fn(); } finally { raiz.classList.remove('midiendo'); } }
  function encajarTarjetas() {
    raiz.querySelectorAll('.giro .cara, .nodo-esquema').forEach(function (t) {
      var r = t.querySelector('.giro-rotulo, .esquema-rotulo'), arte = t.querySelector('.giro-arte'), ex = t.querySelector('.giro-extracto, .esquema-extracto');
      if (!r) return;
      /* El rótulo y el dibujo se ajustan sin el extracto; luego ajustarExtractos() le da al extracto lo que queda. */
      var antes = ex ? ex.style.display : null;
      if (ex) ex.style.display = 'none';
      encajarRotulo(t, r, arte);
      if (ex) ex.style.display = antes;
    });
  }
  function encajarRotulo(t, r, arte) {
    (function () {
      r.style.fontSize = ''; r.style.overflowWrap = ''; if (arte) arte.style.display = '';
      /* Ancho útil de la tarjeta: una palabra larga («Responsabilización») no puede ser más ancha que ella. */
      var cs = getComputedStyle(t), ancho = t.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      function cabe() { return t.scrollHeight <= t.clientHeight + 1 && r.scrollWidth <= ancho + 1; }
      if (cabe()) return;
      if (arte) { arte.style.display = 'none'; if (cabe()) return; }
      for (var fs = parseFloat(getComputedStyle(r).fontSize) - 0.5; fs >= 10.5; fs -= 0.5) { r.style.fontSize = fs + 'px'; if (cabe()) return; }
      /* Último recurso: la palabra se parte (con guion donde el navegador sabe hacerlo) antes que cortarse. */
      r.style.overflowWrap = 'anywhere';
      for (fs = 12; fs >= 10.5; fs -= 0.5) { r.style.fontSize = fs + 'px'; if (cabe()) return; }
    })();
  }
  function extracto(s, lim) {
    var t = String(s).replace(/\s*\n\s*/g, ' ').replace(/\[\^\d+\]/g, '').replace(/^• /, '').replace(/\*\*/g, '');
    return cerrarSignos(t.length > lim + 5 ? t.slice(0, lim).replace(/\s+\S*$/, '') + '…' : t);
  }
  B.giro = function (b, k) {
    return tituloBloque(b, k) +
      '<div class="giros n' + b.items.length + (b.compacto ? ' compacto' : '') + '">' + b.items.map(function (it, i) {
        return '<button type="button" class="giro' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '" style="--d:' + (i * 0.08) + 's"><span class="giro-int">' +
          '<span class="cara frente"><span class="giro-n">' + (i + 1) + '</span><span class="giro-arte">' + svgObjeto(it.obj, b.compacto ? 44 : 96) + '</span>' +
          '<span class="giro-rotulo">' + rot(it.label) + '</span>' + (b.compacto ? '' : '<span class="giro-extracto">' + esc(may(extracto(segs(it.segs), 150))) + '</span>') +
          '<span class="giro-toca">' + mano + ' Toque para girar</span>' +
          '<span class="giro-releer">' + visto + ' Leída · toque para releer</span>' +
          '<span class="giro-pendiente"><i class="fas fa-book-open" aria-hidden="true"></i> Falta leer · toque para seguir</span>' +
          '<span class="giro-sello" aria-hidden="true">' + visto + ' Leída</span>' +
          '<span class="giro-carga" aria-hidden="true"></span><span class="destello" aria-hidden="true"></span></span>' +
          '<span class="cara dorso"><span class="giro-rotulo">' + rot(it.label) + '</span><span class="giro-leido">' + visto + ' Leído · toque para releer</span>' +
          '<span class="giro-falta"><i class="fas fa-book-open" aria-hidden="true"></i> Falta leer · toque para seguir</span><span class="destello" aria-hidden="true"></span></span>' +
          '</span></button>';
      }).join('') + '</div>' +
      /* Celular: las mismas tarjetas como lista que se desplaza; cada una lleva su texto completo, que se revela al pasar. */
      '<ol class="giro-lista desplazable" tabindex="0" aria-label="Tarjetas: deslice para leerlas">' +
      /* En celular, la ilustración de la escena encabeza la lista (en el iframe ancho va al lado de las tarjetas). La versión alta
         de la columna no cabe en esa franja sin cortar cabezas: ahí va la ilustración entera de la escena. */
      (datos.ilustraciones && ((escena.arte && !escena.arte.alta && escena.arte.img) || escena.ilustracion) ? '<li class="giro-lista-arte" aria-hidden="true"><img src="' + srcImagen((escena.arte && !escena.arte.alta && escena.arte.img) || escena.ilustracion) + '" alt=""></li>' : '') +
      b.items.map(function (it, i) {
        return '<li class="giro-paso' + refc(it.label) + '" data-id="' + k + '-' + i + '"><p class="giro-paso-cab"><span class="giro-n">' + (i + 1) + '</span>' +
          '<span class="giro-arte">' + svgObjeto(it.obj, 34) + '</span><span class="giro-rotulo">' + rot(it.label) + '</span><span class="giro-paso-visto">' + visto + '</span></p>' +
          '<div class="giro-paso-texto">' + rico(segs(it.segs)) + '</div><span class="giro-fin" aria-hidden="true"></span></li>';
      }).join('') + '<li class="giro-mas" aria-hidden="true"><i class="fas fa-chevron-down"></i></li></ol>';
  };
  B.giro.activar = function (b, k, el) {
    el.querySelectorAll('.giro').forEach(function (g) {
      g.addEventListener('click', function () {
        if (g.classList.contains('volteando')) return;
        var it = b.items[Number(g.dataset.i)], porCursor = g._porCursor;
        g._porCursor = false;
        voltear(g, function () {
          var h = aLaEsquina(g);
          leer(it.label, segs(it.segs), it.obj, g, h); marcar(g.dataset.id);
          /* Al cerrar, la tarjeta da la vuelta de regreso y muestra otra vez su cara (icono, rótulo, extracto) con su estado:
             leída, en otro color y con su sello; a medias, «Falta leer» (Esteban, 31/10/2026: «que después de leído quede de
             otro color pero con la información que tiene cuando no está volteada… y los identificativos de lectura claros»). */
          if (!h) alCerrarLector = function () { g.classList.remove('girada'); g._calma = performance.now() + 1500; };
          if (porCursor) vigilarCursor(g);
        });
      });
    });
    giroConCursor(el);
    giroAlDesplazar(el);
    var gs = el.querySelector('.giros');
    if (gs) setTimeout(function () { gs.classList.add('ya-entraron'); }, 1300);
  };
  /* El giro, protagonista (Esteban, 30/10/2026: «al pasar el cursor no se ve la animación de la tarjeta al voltearse… que sea épico,
     premium»): la tarjeta sale hacia el frente y gira en 3D con perspectiva, creciendo a mitad de la vuelta; la cruza un destello y
     saltan chispas con los colores del curso. Solo al terminar la vuelta pasa a la esquina y sale la hoja. Una tarjeta ya girada
     abre su hoja de una vez; con «reducir movimiento», todo directo. */
  function voltear(g, listo) {
    var int = g.querySelector('.giro-int');
    if (g.classList.contains('girada') || quieto || !int || !int.animate) { g.classList.add('girada'); listo(); return; }
    g.classList.add('volteando', 'girada');
    var a = int.animate([
      { transform: 'translateZ(0) rotateY(0deg) scale(1)' },
      { transform: 'translateZ(50px) rotateY(-16deg) scale(1.06)', offset: 0.14 },
      { transform: 'translateZ(110px) rotateY(96deg) scale(1.16)', offset: 0.56 },
      { transform: 'translateZ(30px) rotateY(194deg) scale(1.04)', offset: 0.86 },
      { transform: 'translateZ(0) rotateY(180deg) scale(1)' }
    ], { duration: 680, easing: 'cubic-bezier(.45,.05,.25,1)' });
    chispas(g);
    var hecho = false;
    a.onfinish = a.oncancel = function () { if (hecho) return; hecho = true; g.classList.remove('volteando'); listo(); };
  }
  /* Chispas desde el centro de `g` o, con `o`, desde el punto {x, y} de la pantalla (n, distancia d y retraso en ms). */
  function chispas(g, o) {
    o = o || {};
    var r = g.getBoundingClientRect(), base = raiz.getBoundingClientRect(), n = o.n || 16;
    var cx = (o.x != null ? o.x : r.left + r.width / 2) - base.left, cy = (o.y != null ? o.y : r.top + r.height / 2) - base.top;
    var colores = ['var(--coral)', 'var(--niebla)', 'var(--marino)', 'var(--crema)', 'var(--teal)'];
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span'), ang = (i / n) * Math.PI * 2 + (i % 2) * 0.2, d = (o.d || 70) + (i % 4) * (o.d ? o.d * 0.4 : 28);
      s.className = 'chispa'; s.setAttribute('aria-hidden', 'true');
      s.style.left = cx + 'px'; s.style.top = cy + 'px';
      s.style.background = colores[i % colores.length];
      raiz.appendChild(s);
      var fin = 'translate(calc(-50% + ' + (Math.cos(ang) * d).toFixed(1) + 'px),calc(-50% + ' + (Math.sin(ang) * d * 0.85).toFixed(1) + 'px))';
      s.animate([{ transform: 'translate(-50%,-50%) scale(0)', opacity: 1 }, { transform: fin + ' scale(1)', opacity: 1, offset: 0.55 },
        { transform: fin + ' scale(.3)', opacity: 0 }], { duration: 640, delay: o.retraso != null ? o.retraso : 260, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'both' })
        .onfinish = (function (x) { return function () { x.remove(); }; })(s);
    }
  }
  /* La tarjeta que se abre gira, pasa a la primera posición (la esquina izquierda) y las demás se apartan; a su lado sale la
     hoja con su texto, que no tapa el giro (Esteban, 30/10/2026: «que la tarjeta gira y se posicione de primera… hacia la
     esquina… y que el cajón de información… como un cuadernito, una hoja de esas antiguas»). Al cerrar, todo vuelve a su sitio.
     Sin espacio para la hoja (una sola tarjeta muy ancha), la ventana va al centro, como antes. */
  function aLaEsquina(g) {
    if (alCerrarLector) { var f = alCerrarLector; alCerrarLector = null; f(); }   // la tarjeta anterior vuelve a su sitio
    var giros = g.closest('.giros'), esc = raiz.querySelector('.escenario');
    if (!giros || !esc || !g.offsetParent) return null;
    var G = giros.getBoundingClientRect(), r = g.getBoundingClientRect(), E = esc.getBoundingClientRect();
    var izq = G.left - E.left + r.width + 18;
    if (E.width - izq < 420) return null;
    /* Posición en la rejilla (offsetLeft/Top no cambian con la animación): al reabrir, la tarjeta puede estar aún volviendo. */
    var primera = giros.querySelector('.giro');
    g.style.setProperty('--dx', (primera.offsetLeft - g.offsetLeft) + 'px');
    g.style.setProperty('--dy', (primera.offsetTop - g.offsetTop) + 'px');
    giros.classList.add('con-hoja'); g.classList.add('al-frente');
    /* Al cerrar, la tarjeta vuelve a su lugar; si el cursor quedó ahí, no se reabre sola: hay que salir y volver a entrar. */
    alCerrarLector = function () { giros.classList.remove('con-hoja'); g.classList.remove('al-frente', 'girada'); g._calma = performance.now() + 1500; };
    return { izq: Math.round(izq) };
  }
  /* Con ratón (Esteban, 30/10/2026: «que ese modal salga cuando le pase el cursor por encima… en todas las partes donde tenga
     esta mediación»): posar el cursor un momento sobre una tarjeta la gira y abre su ventana, como el clic. La ventana abierta así
     se cierra sola cuando el cursor sale de ella y de su tarjeta, salvo que se use: un clic dentro («Seguir leyendo») la deja fija.
     Tocar y el teclado, como antes; con datos.completar, el visto sigue llegando al leer la última parte. */
  function giroConCursor(el) {
    if (!(window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches)) return;
    var espera = null;
    el.querySelectorAll('.giro').forEach(function (g) {
      g.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse' || !raiz.querySelector('.lector').hidden || el.querySelector('.volteando')) return;
        clearTimeout(espera);
        g.classList.add('por-abrir');   // una barra se llena: la tarjeta está por abrirse
        espera = setTimeout(function () {
          g.classList.remove('por-abrir');
          if (!g.isConnected || !g.offsetParent || !g.matches(':hover') || !raiz.querySelector('.lector').hidden || el.querySelector('.volteando') || performance.now() < (g._calma || 0)) return;
          turno++;   // un «turno» propio: el visto diferido de esta lectura no se cuelga de la anterior
          g._porCursor = true;
          g.click();
        }, 400);
      });
      g.addEventListener('pointerleave', function () { clearTimeout(espera); g.classList.remove('por-abrir'); });
    });
  }
  function vigilarCursor(g) {
    var l = raiz.querySelector('.lector'), caja = l.querySelector('.lector-caja'), reloj = null;
    if (!caja) return;
    function dentro(r, e) { return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; }
    function fin() { clearTimeout(reloj); document.removeEventListener('pointermove', mover, true); caja.removeEventListener('pointerdown', fin, true); }
    function mover(e) {
      if (l.hidden || !caja.isConnected) { fin(); return; }
      if (dentro(caja.getBoundingClientRect(), e) || dentro(g.getBoundingClientRect(), e)) { clearTimeout(reloj); reloj = null; return; }
      if (!reloj) reloj = setTimeout(function () { fin(); if (!l.hidden && caja.isConnected) cerrarLector(); }, 450);
    }
    document.addEventListener('pointermove', mover, true);
    caja.addEventListener('pointerdown', fin, true);
  }
  /* Celular (Esteban, 30/10/2026: «que cuando esté haciendo scroll estas se vayan revelando a medida que va haciendo scroll, así
     ya va haciendo el scroll y leyendo a la vez»): en pantalla angosta las tarjetas son una lista que se desplaza; cada una se
     revela con su texto completo al entrar en pantalla y queda vista cuando su final pasa por la pantalla (leer el 100 %). Es la
     única excepción, pedida por Esteban, a la regla de no desplazar dentro de la escena. */
  function giroAlDesplazar(el) {
    var lista = el.querySelector('.giro-lista');
    if (!lista) return;
    if (!('IntersectionObserver' in window)) { lista.classList.add('sin-observador'); return; }
    var revela = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('revelada'); });
    }, { root: lista, threshold: 0.15 });
    var lee = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var p = e.target.closest('.giro-paso'); if (e.isIntersecting && p && lista.offsetParent) marcar(p.dataset.id); });
    }, { root: lista, threshold: 1, rootMargin: '0px 0px 8px 0px' });   // el final de 1 px justo en el borde también cuenta
    lista.querySelectorAll('.giro-paso').forEach(function (p) { revela.observe(p); lee.observe(p.querySelector('.giro-fin')); });
    /* La flecha «hay más» solo hasta el primer desplazamiento: después taparía el texto que se va leyendo. */
    function final() {
      lista.classList.toggle('al-final', lista.scrollTop + lista.clientHeight >= lista.scrollHeight - 6);
      if (lista.scrollTop > 8) lista.classList.add('desplazada');
      /* Al llegar al final de la lista, la última tarjeta queda vista: su final ya pasó (QA del 31/10: quedaba 3 / 4 cuando el
         final de la última se detenía en el borde). */
      var pasos = lista.querySelectorAll('.giro-paso'), u = pasos[pasos.length - 1];
      if (lista.classList.contains('al-final') && lista.classList.contains('desplazada') && u && lista.offsetParent) marcar(u.dataset.id);
    }
    lista.addEventListener('scroll', final, { passive: true });
    final();
  }

  B.fichas = function (b, k) {
    return '<div class="fichas" role="tablist">' + b.items.map(function (it, i) {
      return '<button type="button" role="tab" class="ficha' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '" aria-selected="false" style="--d:' + (i * 0.07) + 's"><span class="ficha-n">' + (i + 1) + '</span>' +
        '<span class="ficha-arte" aria-hidden="true">' + svgObjeto(it.obj, 30) + '</span>' + rot(it.label) + '<span class="ficha-visto">' + visto + '</span>' +
        '<span class="ficha-estado ficha-por-leer">Por leer</span><span class="ficha-estado ficha-falta"><i class="fas fa-book-open" aria-hidden="true"></i> Falta leer</span>' +
        '<span class="ficha-estado ficha-leida"><i class="fas fa-circle-check" aria-hidden="true"></i> Leída</span></button>';
    }).join('') + '</div><div class="panel-fichas' + (conFigura(escena) ? ' con-figura' : '') + '" role="tabpanel" tabindex="-1">' +
      (conFigura(escena) && imagenActual() ? figura([]) : '<span class="panel-arte"></span>') +
      '<div class="panel-texto"><p class="panel-vacio">' + mano + ' Elija una ficha para leer su contenido.</p></div></div>';
  };
  B.fichas.activar = function (b, k, el) {
    var panel = el.querySelector('.panel-fichas'), reajuste = null, primera = true;
    window.addEventListener('resize', function () { if (reajuste) reajuste(); });
    el.querySelectorAll('.ficha').forEach(function (f) {
      f.addEventListener('click', function () {
        if (panel.classList.contains('volteando')) return;
        /* Giro premium (Esteban, 31/10/2026: «aquí también dame un giro premium»): la ficha se hunde y rebota con chispas; el
           panel gira en 3D como una página (se va la ficha anterior, entra la nueva con un leve rebote y un destello) y después
           empieza a escribirse. La primera, al cargar, sin vuelta; con «reducir movimiento», directo. */
        if (quieto || primera || !panel.animate) { primera = false; mostrar(f, true); return; }
        panel.classList.add('volteando');
        /* En el marco ancho la ficha elegida se monta un poco sobre el panel (base.css). El panel conserva su giro de golpe (se va
           la ficha anterior y entra la nueva con un rebote) y, en el golpe, choca contra la ficha montada, que lo detiene: la
           ficha acusa el golpe y saltan chispas en el punto de contacto (Esteban, 31/10/2026: «que parezca que cuando voltea y
           llega, la ficha de la sección es la que lo detiene… pero conserva el giro de golpe»). En pantalla angosta, sin choque. */
        var montada = getComputedStyle(panel.parentNode).display === 'grid';
        el.querySelectorAll('.ficha').forEach(function (o) { o.setAttribute('aria-selected', String(o === f)); });
        f.animate([{ transform: 'scale(1)' }, { transform: 'scale(.94)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'ease-out' });
        if (!montada) chispas(f);
        var ida = panel.animate([{ transform: 'perspective(1100px) rotateY(0deg)', opacity: 1 }, { transform: 'perspective(1100px) rotateY(88deg) scale(.96)', opacity: 0.55 }],
          { duration: 230, easing: 'cubic-bezier(.5,0,.8,.4)', fill: 'forwards' });
        ida.onfinish = function () {
          mostrar(f, false);
          ida.cancel();
          var brillo = document.createElement('span');
          brillo.className = 'panel-destello'; brillo.setAttribute('aria-hidden', 'true'); panel.appendChild(brillo);
          brillo.animate([{ opacity: 0, backgroundPosition: '120% 0' }, { opacity: 1, offset: 0.3 }, { opacity: 0, backgroundPosition: '-60% 0' }], { duration: 640, easing: 'ease-out' });
          var dur = 430, vuelta = panel.animate([{ transform: 'perspective(1100px) rotateY(-88deg) scale(.96)', opacity: 0.55 },
            { transform: 'perspective(1100px) rotateY(7deg) scale(1.01)', opacity: 1, offset: 0.7 }, { transform: 'none', opacity: 1 }],
            { duration: dur, easing: 'cubic-bezier(.2,.9,.3,1)' });
          if (montada) {
            /* Con esta curva el borde del panel alcanza la ficha a un quinto de la vuelta (medido: 80 ms de 430): ahí es el golpe. */
            var golpe = dur * 0.2, r = f.getBoundingClientRect();
            f.animate([{ transform: 'none' }, { transform: 'translateX(6px) rotate(-1.4deg) scale(1.04)', offset: 0.28 }, { transform: 'translateX(-2px) rotate(.4deg)', offset: 0.62 }, { transform: 'none' }],
              { duration: 360, delay: golpe, easing: 'ease-out' });
            chispas(f, { x: r.right - 3, y: r.top + r.height / 2, n: 12, d: 34, retraso: golpe });   // en el borde de la ficha, donde llega el panel
          }
          vuelta.onfinish = vuelta.oncancel = function () { panel.classList.remove('volteando'); setTimeout(function () { brillo.remove(); }, 300); };
        };
      });
    });
    function mostrar(f, animar) {
      var i = Number(f.dataset.i), it = b.items[i];
      el.querySelectorAll('.ficha').forEach(function (o) { o.setAttribute('aria-selected', String(o === f)); });
      f.classList.add('abierta');   // abierta y sin leer completa: «Falta leer» (base.css)
      var arte = panel.querySelector('.panel-arte'), grande = panel.classList.contains('con-figura');
      if (arte) arte.innerHTML = svgObjeto(it.obj, grande ? 150 : 92);
      panel.querySelector('.panel-texto').innerHTML = '<p class="lectura-eyebrow">' + (i + 1) + ' de ' + b.items.length + ' · ' + esc(may(it.label)) + '</p><p class="lectura-texto">' + rico(segs(it.segs)) + '</p>';
      /* El texto no aparece de golpe: se escribe letra por letra, como en la hoja del giro (Esteban, 31/10/2026). Las letras se
         envuelven antes de medir y repartir la lectura, para que nada cambie de lugar al escribirse. */
      var lt = panel.querySelector('.panel-texto .lectura-texto'), letras = quieto ? null : envolverLetras(lt);
      marcar(f.dataset.id);
      var pt = panel.querySelector('.panel-texto'), ajustar = grande ? function () { encajarTexto(panel, pt); } : null;
      reajuste = ajustar;
      if (!dosificar(pt, ajustar) && ajustar) ajustar();
      if (animar) reanimar(panel);
      if (letras) escribirLetras(lt, letras, function () {});
    }
    el.querySelector('.ficha').click();
  };

  function pasos(b, k, clase) {
    return '<div class="' + clase + ' p' + b.items.length + '"><span class="camino" aria-hidden="true"><b></b><i class="ficha-avance"></i></span>' + b.items.map(function (it, i) {
      return '<button type="button" class="paso' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '" style="--d:' + (i * 0.09) + 's"' + (clase === 'linea' && i > 0 ? ' disabled' : '') + '>' +
        '<span class="paso-arte">' + svgObjeto(it.obj, 56) + '</span><span class="paso-n">' + (i + 1) + '</span>' +
        '<span class="paso-rotulo">' + rot(it.label) + '</span><span class="paso-visto">' + visto + '</span>' + estado + '</button>';
    }).join('') + '</div>';
  }
  B.ruta = function (b, k) {
    return '<div class="ruta-lectura" tabindex="-1" aria-live="polite"><p class="panel-vacio">' + mano + ' Empiece por el paso 1.</p></div>' + pasos(b, k, 'ruta') +
      '<div class="ruta-pie"><button type="button" class="btn-siguiente">Siguiente paso <i class="fas fa-arrow-right" aria-hidden="true"></i></button></div>';
  };
  B.ruta.activar = function (b, k, el, linea) {
    var caja = el.querySelector('.ruta-lectura'), n = b.items.length, ficha = el.querySelector('.ficha-avance'), traza = el.querySelector('.camino b'), sig = el.querySelector('.btn-siguiente'), pos = -1;
    function ir(i) {
      /* Detalles de lectura (Esteban, 31/10/2026: prioridad 3 del diagnóstico de detalles): el paso dice «Por leer», «Te falta
         leer» o «Leída», su texto se escribe letra por letra la primera vez y, si se deja a medias, un aviso lo dice. */
      if (pos >= 0 && pos !== i && datos.completar && !vistos[k + '-' + pos])
        avisarFalta(null, 'Falta leer «' + esc(may(b.items[pos].label)) + '». Vuelva a ' + (linea ? 'ese momento' : 'ese paso') + ' para terminar.');
      pos = i;
      el.querySelectorAll('.paso').forEach(function (o, j) { o.setAttribute('aria-current', String(j === i)); o.classList.toggle('pasado', j < i); if (j === i) o.classList.add('abierta'); if (linea && j === i + 1 && !datos.completar) o.disabled = false; });
      var pct = n === 1 ? 50 : 100 * i / (n - 1);
      ficha.style.left = pct + '%'; traza.style.width = pct + '%';
      var it = b.items[i];
      caja.innerHTML = '<div class="ruta-texto"><p class="lectura-eyebrow">' + (linea ? 'Momento ' : 'Paso ') + (i + 1) + ' de ' + n + ' · ' + esc(may(it.label)) + '</p><p class="lectura-texto">' + rico(segs(it.segs)) + '</p></div>' +
        '<span class="ruta-arte">' + svgObjeto(it.obj, 150) + '</span>';
      var lt = quieto || vistos[k + '-' + i] ? null : caja.querySelector('.ruta-texto .lectura-texto'), letras = lt ? envolverLetras(lt) : null;
      var partes = !!dosificar(caja.querySelector('.ruta-texto'), function () { crecerLectura(caja); });
      if (!partes) crecerLectura(caja);
      else if (vistos[k + '-' + i]) {   // ya leído: sus partes no vuelven a cerrar «Siguiente paso» ni «Continuar la historia»
        var nv = caja.querySelector('.lectura-paginas');
        if (nv && nv.lectura) nv.lectura.completa = true;
        caja.querySelector('.ruta-texto').classList.remove('lectura-pendiente');
      }
      reanimar(caja);
      if (letras) escribirVentana(lt, letras, partes);
      sig.disabled = i >= n - 1;
      marcar(k + '-' + i);
      if (datos.completar) { if (faltaLeer(caja)) candado(sig, !sig.disabled); else listo(); }
    }
    /* Paso leído completo: se quita el candado y, en la historia, se abre el momento siguiente. */
    function listo() {
      candado(sig, false);
      var o = linea && el.querySelectorAll('.paso')[pos + 1];
      if (o) o.disabled = false;
    }
    caja.addEventListener('lectura-completa', listo);
    el.querySelectorAll('.paso').forEach(function (p) { p.addEventListener('click', function () { ir(Number(p.dataset.i)); }); });
    sig.addEventListener('click', function () {
      var L = faltaLeer(caja);
      if (L) { avisar(raiz.querySelector('.escenario'), textoFalta(L, linea ? 'este momento' : 'este paso'), L.sig); return; }
      ir(Math.min(n - 1, pos + 1));
    });
    ir(0); /* el primer paso abre solo: la escena nunca empieza en blanco */
  };
  B.linea = function (b, k) {
    return pasos(b, k, 'linea') + '<div class="ruta-lectura historia" tabindex="-1" aria-live="polite"><p class="panel-vacio">' + mano + ' Toque el primer momento del caso.</p></div>' +
      '<div class="ruta-pie"><button type="button" class="btn-siguiente">Continuar la historia <i class="fas fa-arrow-right" aria-hidden="true"></i></button></div>';
  };
  B.linea.activar = function (b, k, el) { B.ruta.activar(b, k, el, true); };

  B.balanza = function (b, k) {
    var C = O.C;
    var escala = '<svg class="balanza-svg" viewBox="0 0 360 230" aria-hidden="true"><ellipse cx="180" cy="222" rx="90" ry="6" fill="' + C.gris + '"/>' +
      '<rect x="172" y="40" width="16" height="170" rx="5" fill="' + C.marino + '"/><path d="M120 222 Q180 186 240 222 Z" fill="' + C.marino + '"/>' +
      '<g class="viga" style="transform:rotate(-14deg)"><rect x="40" y="42" width="280" height="10" rx="5" fill="' + C.teal + '"/>' +
      '<path d="M62 52 L38 120 M62 52 L86 120 M298 52 L274 120 M298 52 L322 120" stroke="' + C.marino + '" stroke-width="2.5"/>' +
      '<path d="M28 120 H96 Q92 146 62 146 Q32 146 28 120 Z" fill="' + C.oxido + '"/><path d="M264 120 H332 Q328 146 298 146 Q268 146 264 120 Z" fill="' + C.oxido + '"/>' +
      '<rect x="40" y="100" width="44" height="22" rx="4" fill="' + C.marino + '"/><text x="62" y="115" text-anchor="middle" font-family="Montserrat,Arial" font-weight="800" font-size="9" fill="#fff">Reserva</text>' +
      '<g class="platillo"></g></g><circle cx="180" cy="44" r="13" fill="' + C.crema + '" stroke="' + C.marino + '" stroke-width="4"/></svg>';
    return '<div class="balanza-zona"><div class="pesas">' + tituloBloque(b, k) +
      b.items.map(function (it, i) {
        return '<button type="button" class="pesa" data-id="' + k + '-' + i + '" data-i="' + i + '" style="--d:' + (i * 0.08) + 's"><span class="pesa-n">' + (i + 1) + '</span>' + esc(may(it.label)) + mano + '<span class="pesa-visto">' + visto + '</span></button>';
      }).join('') + '</div><div class="balanza-centro">' + escala + '<ol class="criterios" aria-live="polite"></ol></div></div>';
  };
  /* Juan (26/10/2026): sin balanza como icono. El bloque «balanza» (U1) se presenta como fichas: los mismos criterios y su
     texto íntegro, con el encabezado del bloque, sin la escala. */
  B.criterios = function (b, k) { return tituloBloque(b, k) + B.fichas(b, k); };
  B.criterios.activar = function (b, k, el) { B.fichas.activar(b, k, el); };
  function tipo(b) { return b.tipo === 'balanza' ? 'criterios' : b.tipo; }
  B.balanza.activar = function (b, k, el) {
    var viga = el.querySelector('.viga'), plat = el.querySelector('.platillo'), lista = el.querySelector('.criterios'), puestos = 0, n = b.items.length;
    el.querySelectorAll('.pesa').forEach(function (p) {
      p.addEventListener('click', function () {
        if (p.classList.contains('puesta')) return;
        var it = b.items[Number(p.dataset.i)];
        p.classList.add('puesta'); puestos++;
        viga.style.transform = 'rotate(' + (-14 + 14 * puestos / n) + 'deg)';
        plat.insertAdjacentHTML('beforeend', '<rect class="pesa-svg" x="' + (270 + (puestos - 1) % 2 * 30) + '" y="' + (100 - Math.floor((puestos - 1) / 2) * 16) + '" width="26" height="16" rx="4" fill="' + O.C.marino + '"/>');
        lista.insertAdjacentHTML('beforeend', '<li class="aparece">' + rico(segs(it.segs)) + '</li>');
        marcar(p.dataset.id);
        if (puestos === n) el.querySelector('.balanza-centro').classList.add('equilibrio');
      });
    });
  };

  B.empareja = function (b, k) {
    var orden = b.items.map(function (_, i) { return i; });
    for (var i = orden.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = orden[i]; orden[i] = orden[j]; orden[j] = t; }
    if (orden.every(function (v, i) { return v === i; }) && orden.length > 1) orden.push(orden.shift());
    /* Con espacio (un solo bloque y hasta tres descripciones) el texto completo aparece dentro de la tarjeta. */
    var amplio = escena.bloques.length === 1 && b.items.length <= 3, fig = amplio && conFigura(escena);
    b.amplio = amplio;
    return tituloBloque(b, k) +
      '<div class="empareja' + (amplio ? ' amplio' : '') + (fig ? ' con-figura' : '') + '"><div class="nombres" role="group" aria-label="Nombres para arrastrar">' +
      '<p class="nombres-guia"><i class="fas fa-hand-pointer" aria-hidden="true"></i> Arrastre o toque</p>' + orden.map(function (i) {
        return '<button type="button" class="nombre" data-i="' + i + '" aria-pressed="false"><span class="agarre" aria-hidden="true">⋮⋮</span>' + esc(may(b.items[i].label)) + '</button>';
      }).join('') + '</div><div class="defs n' + b.items.length + '">' + b.items.map(function (it, i) {
        var t = segs(it.segs).replace(/\n/g, ' ').replace(/\[\^\d+\]/g, ''), lim = amplio ? 230 : 100;
        /* La descripción no empieza con su propio término («• Duplicación de términos: Los plazos…» regalaba la respuesta;
           pulido del 29/10/2026): antes de acertar se ve desde los dos puntos; al acertar, el texto completo con el término. */
        var pre = t.match(/^[\s•\-–]*(?:\(?(?:[ivx]+|\d+|[a-z])[.)]\s*)?([^:.;]{3,60}):\s+/i);
        /* También con la letra de la ficha («e) Artículos 350 y 351: regulan…»): sin quitarla, la descripción traía el nombre que hay
           que arrastrar (Juan, 14/11/2026, U5 L1: «no se conecta bien»). */
        if (pre && it.label && pre[1].trim().toLowerCase() === String(it.label).trim().toLowerCase()) t = may(t.slice(pre[0].length));
        var corto = cerrarSignos(t.length > lim + 5 ? t.slice(0, lim).replace(/\s+\S*$/, '') + '…' : t);
        return '<button type="button" class="def" data-id="' + k + '-' + i + '" data-i="' + i + '" style="--d:' + (i * 0.08) + 's"><span class="def-arte">' + svgObjeto(it.obj, amplio ? 64 : 36) + '</span>' +
          '<span class="def-texto">' + esc(corto) + '</span><span class="def-ranura">' + mano + ' Suelte aquí el nombre</span></button>';
      }).join('') + '</div>' + (fig ? figura(b.items.map(function (x) { return x.obj; })) : '') + '</div><p class="empareja-aviso" aria-live="polite"></p>';
  };
  B.empareja.activar = function (b, k, el) {
    var elegido = null, aviso = el.querySelector('.empareja-aviso');
    function encabezado(it) { return typeof it.nombre === 'number' ? may(seg(it.nombre)) + ' ' : ''; }
    function elegir(n) {
      el.querySelectorAll('.nombre').forEach(function (o) { o.setAttribute('aria-pressed', String(o === n)); });
      elegido = n; aviso.textContent = 'Ahora suelte o toque «' + n.textContent.replace('⋮⋮', '') + '» sobre su descripción.';
    }
    function intentar(n, d) {
      var i = Number(d.dataset.i), it = b.items[i];
      if (Number(n.dataset.i) === i) {
        d.classList.add('acierto'); n.disabled = true; n.classList.add('usado'); n.setAttribute('aria-pressed', 'false');
        d.querySelector('.def-ranura').innerHTML = visto + ' ' + esc(may(it.label));
        elegido = null;
        if (b.amplio) {
          d.querySelector('.def-texto').innerHTML = '<b>' + esc(encabezado(it)) + '</b>' + rico(segs(it.segs));
          /* Esteban (27/10/2026): la tarjeta que se expande lleva debajo del texto una imagen acorde, de fondo suave, en el
             espacio que sobra (si el texto es largo, se achica o desaparece). La imagen de contexto de la escena, o el objeto
             del elemento en grande si la escena ya muestra su imagen al lado o no tiene tema. */
          if (!d.querySelector('.def-ilus')) {
            var tm = conFigura(escena) ? null : (imagenActual() || tema(escena));
            d.querySelector('.def-ranura').insertAdjacentHTML('beforebegin', '<span class="def-ilus" aria-hidden="true">' +
              (tm ? '<img src="' + srcImagen(tm) + '" alt="">' : svgObjeto(it.obj, 170)) + '</span>');
          }
          d.classList.add('completa'); enfocar(d); reanimar(d);
          aviso.textContent = '¡Correcto! La descripción completa quedó en la tarjeta.';
        } else {
          aviso.textContent = '¡Correcto! Lea la descripción completa.';
          leer('¡Correcto! · ' + may(it.label), encabezado(it) + segs(it.segs), it.obj, d);
        }
        marcar(d.dataset.id);
      } else {
        d.classList.remove('error'); void d.offsetWidth; d.classList.add('error');
        aviso.textContent = 'Esa descripción no corresponde a «' + n.textContent.replace('⋮⋮', '') + '». Intente con otra.';
      }
    }
    el.querySelectorAll('.nombre').forEach(function (n) {
      n.addEventListener('click', function () { if (!n.disabled && !n.dataset.arrastrado) elegir(n); delete n.dataset.arrastrado; });
      /* Arrastrar y soltar con puntero (ratón o táctil); el toque sigue funcionando como alternativa. */
      n.addEventListener('pointerdown', function (e) {
        if (n.disabled) return;
        var x0 = e.clientX, y0 = e.clientY, fantasma = null, sobre = null;
        function mover(ev) {
          if (!fantasma && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 6) return;
          if (!fantasma) {
            fantasma = n.cloneNode(true); fantasma.className = 'nombre fantasma'; document.body.appendChild(fantasma);
            n.classList.add('arrastrando'); elegir(n);
          }
          fantasma.style.left = ev.clientX + 'px'; fantasma.style.top = ev.clientY + 'px';
          fantasma.hidden = true; var bajo = document.elementFromPoint(ev.clientX, ev.clientY); fantasma.hidden = false;
          var d = bajo && bajo.closest('.def:not(.acierto)');
          if (sobre && sobre !== d) sobre.classList.remove('sobre');
          sobre = d; if (d) d.classList.add('sobre');
        }
        function soltar() {
          n.removeEventListener('pointermove', mover); n.removeEventListener('pointerup', soltar); n.removeEventListener('pointercancel', soltar);
          if (!fantasma) return;
          fantasma.remove(); n.classList.remove('arrastrando'); n.dataset.arrastrado = '1';
          if (sobre) { sobre.classList.remove('sobre'); intentar(n, sobre); }
        }
        try { n.setPointerCapture(e.pointerId); } catch (er) { /* sin captura */ }
        n.addEventListener('pointermove', mover); n.addEventListener('pointerup', soltar); n.addEventListener('pointercancel', soltar);
      });
    });
    /* La tarjeta en foco se ensancha para leer su texto completo; las demás se compactan. */
    function enfocar(d) {
      var defs = el.querySelector('.defs'), n = b.items.length, i = Number(d.dataset.i);
      el.querySelectorAll('.def').forEach(function (o) { o.classList.toggle('foco', o === d); });
      defs.style.gridTemplateColumns = b.items.map(function (_, j) { return j === i ? (n === 2 ? '1.7fr' : '2.7fr') : '1fr'; }).join(' ');
      setTimeout(recortes, 260); setTimeout(recortes, 520); setTimeout(recortes, 900); /* durante y tras la transición de las columnas */
    }
    /* Una tarjeta angosta cuyo texto no cabe lo desvanece al pie en vez de cortarlo bajo el borde; se lee completo al enfocarla. */
    /* 14/11/2026 (QA a 1113 × 448, U5-L4-E05: la tarjeta compacta perdía 5 px de texto): antes de desvanecer, la letra de la tarjeta
       angosta baja de a medio punto hasta 10,5 px para que el texto quepa completo («nada cortado»). */
    function recortes() {
      el.querySelectorAll('.def-texto').forEach(function (t) {
        t.style.fontSize = '';
        if (!t.closest('.def').classList.contains('foco')) {
          var fs = parseFloat(getComputedStyle(t).fontSize);
          while (t.scrollHeight > t.clientHeight + 1 && fs > 10.5) { fs -= 0.5; t.style.fontSize = fs + 'px'; }
        }
        t.classList.toggle('recortado', t.scrollHeight > t.clientHeight + 1);
      });
    }
    if (b.amplio) { setTimeout(recortes, 120); window.addEventListener('resize', recortes); }
    el.querySelectorAll('.def').forEach(function (d) {
      d.addEventListener('click', function () {
        var it = b.items[Number(d.dataset.i)];
        if (d.classList.contains('acierto')) { if (b.amplio) enfocar(d); else leer(it.label, encabezado(it) + segs(it.segs), it.obj, d); return; }
        if (!elegido) { aviso.textContent = 'Primero tome un nombre de la lista y arrástrelo hasta aquí.'; reanimar(aviso); return; }
        intentar(elegido, d);
      });
    });
  };

  /* Tabla de la fuente: una pestaña por columna o por grupo de filas; el panel muestra sus celdas con su encabezado. */
  /* Tabla breve (Esteban, 28/10/2026, sobre los nueve artículos de U1-L3-E22: «siento que hay demasiado de artículos»): con
     datos.sinHuecos, si cada fila es una sola celda y todo junto cabe a la vista (de 2 a 12 filas y 640 caracteres), la tabla se
     muestra completa, con su encabezado, en vez de una pestaña por fila con un panel casi vacío. Nada que abrir de a una: no
     cuenta en la exploración. Desde 2 filas (Esteban, 28/10/2026, sobre U1-L1-E04, «Respetar» y «Garantizar»: «ese espacio
     debajo… tiene que ser rellenado acorde con lo del contenido»); debajo entra la ilustración de relleno del tema. */
  function celdaTexto(c) { return c === null || c === undefined ? '' : typeof c === 'number' ? seg(c) : c; }
  function tablaBreve(b) {
    if (!datos.sinHuecos || !b || b.tipo !== 'tabla' || b.items.length < 2 || b.items.length > 12) return false;
    if (!b.items.every(function (it) { return it.filas.length === 1 && it.filas[0].length === 1; })) return false;
    return b.items.reduce(function (a, it) { return a + String(it.label).length + celdaTexto(it.filas[0][0][1]).length; }, 0) <= 640;
  }
  function tablaCompleta(b, k) {
    var encs = b.items.map(function (it) { return celdaTexto(it.filas[0][0][0]); }), comun = encs.every(function (e) { return e === encs[0]; }) ? encs[0] : '';
    var primera = b.titulo && b.titulo.length ? segs(b.titulo) : '';
    return '<div class="tabla-breve-caja"><table class="tabla-breve">' +
      (primera || comun ? '<thead><tr><th scope="col">' + esc(may(primera)) + '</th><th scope="col">' + esc(may(comun)) + '</th></tr></thead>' : '') +
      '<tbody>' + b.items.map(function (it, i) {
        return '<tr style="--d:' + (i * 0.05) + 's"><th scope="row">' + rot(it.label) + '</th><td>' + (comun ? '' : '<b class="tabla-enc">' + esc(may(encs[i])) + '</b> ') +
          '<span class="lectura-texto">' + rico(celdaTexto(it.filas[0][0][1]) || '–') + '</span></td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function encajarTablaBreve(el) {
    var c = el.querySelector('.tabla-breve-caja');
    if (!c) return;
    quitarRelleno(c);
    for (var fs = 21; fs >= 12; fs -= 0.5) { c.style.setProperty('--fs', fs + 'px'); if (c.scrollHeight <= c.clientHeight + 1) break; }
    rellenar(c);
  }
  B.tabla = function (b, k) {
    if (tablaBreve(b)) return tablaCompleta(b, k);
    return tituloBloque(b, k) + '<div class="fichas tabla-pestanas" role="tablist">' + b.items.map(function (it, i) {
      return '<button type="button" role="tab" class="ficha' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '" aria-selected="false" style="--d:' + (i * 0.07) + 's"><span class="ficha-n">' + (i + 1) + '</span>' + rot(it.label) + '<span class="ficha-visto">' + visto + '</span></button>';
    }).join('') + '</div><div class="panel-fichas panel-tabla" role="tabpanel" tabindex="-1"><div class="panel-texto"></div></div>';
  };
  /* La fila en grande (19 px) baja de a medio punto hasta caber en el panel; si a 14,5 px aún no cabe, la figura cede su
     sitio (Estándares interamericanos: pestañas con rótulos largos dejan menos alto). Nunca desplazamiento. */
  function encajarTabla(panel) {
    var f = panel.querySelector('.tabla-ficha');
    if (!f) return;
    f.classList.remove('sin-figura');
    /* También el panel de texto de adentro (con ficha, alto 100 % y su propio desplazamiento): el panel de afuera podía caber
       mientras el de adentro se desplazaba 5 a 11 px (QA del 11/11/2026, Delitos y Desaparición). */
    var interno = panel.querySelector('.panel-texto');
    function cabeTodo() { return entra(panel) && (!interno || interno.scrollHeight <= interno.clientHeight + 1); }
    function encajar() {
      for (var fs = topeLetra(19); fs >= 12; fs -= 0.5) {
        f.style.setProperty('--fs', fs + 'px');
        if (cabeTodo()) return;
        if (fs <= 14.5 && !f.classList.contains('sin-figura')) { f.classList.add('sin-figura'); fs = 17.5; }
      }
    }
    encajar();
    /* La ilustración apilada a la que la letra grande deja menos de 100 px sale (diminuta parece un error) y la letra vuelve
       a encajar sin ella. */
    var fig = f.classList.contains('apilada') && !f.classList.contains('sin-figura') && f.querySelector('.relleno-arte');
    if (fig && fig.getBoundingClientRect().height < 100) { f.classList.add('sin-figura'); encajar(); }
  }
  /* Fila de varios campos (datos.sinHuecos): la letra crece hasta 17 px y baja hasta caber en el panel; nunca desplazamiento. */
  function encajarFilas(panel) {
    var l = panel.querySelector('.tabla-filas');
    if (!datos.sinHuecos || !l) return;
    for (var fs = 17; fs >= 11.5; fs -= 0.5) { l.style.setProperty('--fs', fs + 'px'); if (entra(panel)) return; }
  }
  B.tabla.activar = function (b, k, el) {
    if (tablaBreve(b)) {
      encajarTablaBreve(el);
      if (document.fonts) document.fonts.ready.then(function () { encajarTablaBreve(el); });
      window.addEventListener('resize', function () { encajarTablaBreve(el); });
      return;
    }
    var panel = el.querySelector('.panel-fichas');
    function celda(c) { return c === null || c === undefined ? '' : typeof c === 'number' ? seg(c) : c; }
    el.querySelectorAll('.ficha').forEach(function (f) {
      f.addEventListener('click', function () {
        var i = Number(f.dataset.i), it = b.items[i];
        el.querySelectorAll('.ficha').forEach(function (o) { o.setAttribute('aria-selected', String(o === f)); });
        var lista = '<ul class="tabla-filas' + (it.filas.every(function (f) { return f.length === 1 && f[0][0] === null; }) && it.filas.length > 5 ? ' compacta' : '') + '">' + it.filas.map(function (fila) {
          return '<li>' + fila.map(function (par) {
            var enc = celda(par[0]), val = celda(par[1]);
            return '<span class="tabla-celda">' + (enc ? '<b class="tabla-enc">' + esc(enc) + '</b>' : '') + '<span class="lectura-texto">' + rico(val || '–') + '</span></span>';
          }).join('') + '</li>';
        }).join('') + '</ul>';
        /* Con datos.sinHuecos, la figura es la ilustración de relleno de la escena, del tema del texto (Esteban, 28/10/2026:
           «tener algo relacionado al tema»), en vez del objeto genérico. */
        var conImg = datos.sinHuecos && datos.ilustraciones && escena.relleno;
        /* Tabla comparativa con una fila por pestaña (Bienes 1.3): sus celdas en grande junto al objeto, sin franja vacía. Con la
           ilustración de relleno, también la fila sin objeto. */
        var ficha = it.filas.length === 1 && (it.obj || conImg);
        quitarRelleno(panel);
        /* Apilada: la celda arriba, con letra grande, y la ilustración del tema llenando el resto del panel (sin franjas vacías
           arriba y abajo de una celda breve centrada). */
        if (ficha) lista = conImg ? '<div class="tabla-ficha apilada">' + lista + '<figure class="relleno-arte" aria-hidden="true"><img src="' + srcImagen(escena.relleno) + '" alt=""></figure></div>'
          : '<div class="tabla-ficha"><figure aria-hidden="true">' + svgObjeto(it.obj, 170) + '</figure>' + lista + '</div>';
        var texto = panel.querySelector('.panel-texto');
        texto.classList.toggle('con-ficha', !!ficha);
        texto.innerHTML = '<p class="lectura-eyebrow">' + (i + 1) + ' de ' + b.items.length + ' · ' + esc(may(it.label)) + '</p>' + lista;
        if (ficha) encajarTabla(panel); else { encajarFilas(panel); rellenar(panel); }   // varias filas breves: el tema debajo
        /* Una fila que ni con la letra más pequeña cabe en el panel (U3-L1 de Delitos: cuatro columnas de texto largo) reparte sus
           celdas en partes con «Seguir leyendo», sin la ilustración: nunca letra cortada ni desplazamiento. */
        var li = panel.querySelector('.tabla-filas li');
        if (li && li.children.length > 1 && !entra(panel)) {
          var tf = panel.querySelector('.tabla-ficha');
          if (tf) tf.classList.add('sin-figura');
          quitarRelleno(panel);
          partirBloques(li, panel);
        }
        reanimar(panel); marcar(f.dataset.id);
      });
    });
    el.querySelector('.ficha').click();
  };

  /* Matriz en un eje (Juan, reunión del 30/10/2026, sobre la matriz comparativa de SRPA: «te coloque la categoría como un eje
     y te dé un pop-up… para comparar las dos dimensiones»): las categorías de la primera columna son nodos de un eje vertical
     (en dos columnas si son más de seis) y, al lado, las dos dimensiones que se comparan. Cada nodo abre una ventana con las
     dos columnas lado a lado, con su encabezado; marca visto. Las filas usan el formato de la tabla (filas: [[enc, valor], …]).
     Sin categorías (tabla de dos columnas), el rótulo del nodo es el comienzo literal de la primera celda. */
  B.eje = function (b, k) {
    var dims = (b.dims || []).map(function (d) { return celdaTexto(d); }), esquina = b.titulo && b.titulo.length ? segs(b.titulo) : '';
    var dos = b.items.length > 6;
    return '<div class="eje' + (dos ? ' dos-col' : '') + '"><div class="eje-cuerpo">' + (esquina ? '<p class="eje-esquina"><i class="fas fa-arrows-up-down" aria-hidden="true"></i>' + esc(may(esquina)) + '</p>' : '') +
      '<ol class="eje-lista n' + b.items.length + '">' + b.items.map(function (it, i) {
        return '<li style="--d:' + (i * 0.05) + 's"><button type="button" class="eje-nodo' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '">' +
          '<span class="eje-punto" aria-hidden="true">' + (i + 1) + '</span><span class="eje-rotulo">' + rot(it.label) + '</span>' +
          '<span class="eje-marca">' + mano + visto + '</span>' + estado + '</button></li>';
      }).join('') + '</ol></div>' +
      /* Panel de espera: la ilustración de la escena arriba de las dos dimensiones, para que no quede un hueco (SRPA, 01/11/2026). */
      '<div class="eje-dims" aria-hidden="true">' + (datos.ilustraciones && escena.ilustracion ? '<figure class="eje-arte"><img src="' + srcImagen(escena.ilustracion) + '" alt=""></figure>' : '') + dims.map(function (d, j) {
        return (j ? '<span class="eje-vs">frente a</span>' : '') + '<p class="eje-dim d' + (j + 1) + '"><span class="eje-dim-arte">' + svgObjeto(j ? 'escudo' : 'documento', 54) + '</span><span>' + esc(may(d)) + '</span></p>';
      }).join('') + '<p class="eje-toca">' + mano + ' Elija una categoría</p></div></div>';
  };
  function leerComparado(titulo, columnas, desde) {
    var l = raiz.querySelector('.lector');
    retornoFoco = desde || null;
    l.innerHTML = '<div class="lector-caja lector-eje" role="dialog" aria-modal="true" aria-label="' + esc(may(titulo)) + '" tabindex="-1">' +
      '<button type="button" class="cerrar" aria-label="Cerrar comparación">Cerrar ×</button><p class="lectura-eyebrow">' + esc(may(titulo)) + '</p>' +
      '<div class="eje-comparado">' + columnas.map(function (c, j) {
        return '<div class="eje-col d' + (j + 1) + '">' + (c[0] ? '<p class="eje-col-cab">' + esc(may(c[0])) + '</p>' : '') + '<p class="lectura-texto">' + rico(c[1] || '–') + '</p></div>';
      }).join('') + '</div></div>';
    l.hidden = false;
    var caja = l.firstChild, textos = caja.querySelectorAll('.lectura-texto');
    /* La letra crece hasta 22 px si el texto es breve y baja de a medio punto (hasta 12 px) hasta caber: nunca desplazamiento. */
    for (var fs = topeLetra(22); fs >= 12; fs -= 0.5) {
      textos.forEach(function (t) { t.style.fontSize = fs + 'px'; });
      if (caja.scrollHeight <= caja.clientHeight + 1) break;
    }
    reanimar(caja);
    if (desde && desde.classList) desde.classList.add('abierta');
    var cmp = caja.querySelector('.eje-comparado'), letras = quieto ? null : envolverLetras(cmp);
    if (letras) escribirVentana(cmp, letras, false);
    l.querySelector('.cerrar').onclick = cerrarLector;
    caja.focus({ preventScroll: true });
  }
  B.eje.activar = function (b, k, el) {
    el.querySelectorAll('.eje-nodo').forEach(function (n) {
      n.addEventListener('click', function () {
        var i = Number(n.dataset.i), it = b.items[i], fila = it.filas[0] || [];
        var cols = fila.map(function (par) { return [celdaTexto(par[0]), celdaTexto(par[1])]; });
        leerComparado((i + 1) + ' de ' + b.items.length + ' · ' + it.label, cols, n);
        marcar(n.dataset.id);
      });
    });
  };

  /* Cuadro visible por partes (delitos ambientales, revisor experto de la Fiscalía, 18/11/2026: «las tablas, los cuadros resumen
     y las matrices… deben verse como tablas, con sus columnas a la vista»; Juan, 18:10: «tablas e infografías»). Solo lo usa el
     curso que lo pone en sus datos ({tipo:'cuadro'}); ningún otro cambia. El encabezado de columnas queda siempre a la vista y las
     filas se muestran por partes («Filas 1 a 2»…), con «Anterior» y «Seguir leyendo»: así la lectura a la vista no pasa de 520
     caracteres y nada se recorta (una celda nunca lleva «…»; si no cabe, la parte es más corta). Cada parte queda vista al
     mostrarse (puntos y avance como las demás mediaciones). En pantalla angosta (@container), cada fila es una ficha con los
     rótulos de sus columnas.
     Datos: {tipo:'cuadro', columnas:[seg|texto…], items:[{label:'Filas 1 a 2', segs:[…], celdas:[[seg|texto, …], …]}], titulo:[seg…]}
     «columnas»: encabezado; cada item es una parte, con sus filas en «celdas» (la primera celda de la fila es su encabezado, <th
     scope="row">); «segs» reúne los segmentos de la parte (cobertura). */
  /* Rótulo de una parte de la tabla (DDHH, Esteban, 20/11/2026: «eso de las filas no se entiende»): nunca «Fila N» ni «Filas N a M»,
     sino lo que contiene, con el texto de la primera columna de sus filas («Respetar», «Respetar y garantizar», «Prevenir, investigar
     y sancionar»), cortado por palabras completas con «…» si es largo. Un rótulo propio de los datos que no sea «Fila…» se respeta. */
  function rotuloParte(it, total, extra) {
    var lim = (total > 3 ? 22 : 30) + (extra || 0);   // con muchas partes, la barra de partes cabe en un renglón
    // Solo en los cursos con «huecosFinos» (DDHH y Tráfico): en ambiental, ya aprobado, los rótulos más largos apretaban la tabla (QA).
    if (!datos.huecosFinos || !/^Filas? \d+( a \d+)?$/.test(String(it.label || ''))) return it.label;
    var nombres = (it.celdas || []).map(function (f) {
      return Array.isArray(f) ? celdaTexto(f[0]) : (f && f.grupo) || '';
    }).map(function (x) { return String(x).replace(/\s+/g, ' ').replace(/[.:;,]+$/, '').trim(); }).filter(Boolean);
    if (!nombres.length) return it.label;
    // «Respetar y garantizar»: un nombre de una sola palabra, después del primero, va en minúscula; los demás (nombres propios), igual.
    nombres = nombres.map(function (x, i) { return i && !/\s/.test(x) ? x.replace(/^[A-ZÁÉÍÓÚÑ](?=[a-záéíóúñ]+$)/, function (c) { return c.toLowerCase(); }) : x; });
    var t = nombres.length === 1 ? nombres[0] : nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1];
    if (t.length <= lim) return t;
    var w = t.split(' '), out = '';
    for (var i = 0; i < w.length && (out + ' ' + w[i]).trim().length <= lim - 2; i++) out = (out + ' ' + w[i]).trim();
    return (out || w[0]).replace(/[,;:]$/, '') + '…';
  }
  B.cuadro = function (b, k) {
    var cols = (b.columnas || []).map(function (c) { return may(celdaTexto(c)); }), cap = b.titulo && b.titulo.length ? segs(b.titulo) : (escena.titulo_genially || '');
    var n = 0;
    var filas = b.items.map(function (it, i) {
      return it.celdas.map(function (fila) {
        n++;
        /* Fila de grupo ({grupo: texto}): el título del grupo de filas que sigue, a todo lo ancho (U4-L3: tipo de afectación). */
        if (!Array.isArray(fila)) return '<tr class="cuadro-fila cuadro-grupo" data-parte="' + i + '"' + (i ? ' hidden' : '') + '><th scope="colgroup" colspan="' + cols.length + '">' + rot(fila.grupo) + '</th></tr>';
        return '<tr class="cuadro-fila" data-parte="' + i + '"' + (i ? ' hidden' : '') + '>' + fila.map(function (c, j) {
          var t = '<span class="lectura-texto">' + rico(celdaTexto(c) || '–') + '</span>';
          /* «pares» (SRPA U4-L1, tabla 2: «Justicia Penal | Justicia Restaurativa»): las columnas se comparan entre sí y ninguna es
             el encabezado de la fila; la primera celda es una celda más y las columnas miden lo mismo. */
          return j || b.pares ? '<td data-rot="' + esc(cols[j] || '') + '">' + t + '</td>' : '<th scope="row" data-rot="' + esc(cols[0] || '') + '">' + t + '</th>';
        }).join('') + '</tr>';
      }).join('');
    }).join('');
    var partes = b.items.length > 1;
    /* Dos partes con el mismo rótulo cortado («Peligro para la…»): esas dos se alargan hasta distinguirse. */
    var rotP = b.items.map(function (it) { return rotuloParte(it, b.items.length); });
    for (var ex = 6; ex <= 36; ex += 6) {
      var rep = rotP.filter(function (x, i) { return rotP.indexOf(x) !== i; });
      if (!rep.length) break;
      rotP = rotP.map(function (x, i) { return rep.indexOf(x) >= 0 ? rotuloParte(b.items[i], b.items.length, ex) : x; });
    }
    /* Párrafo que presenta la tabla y su fuente («Tabla 1. Construcción propia»), a la vista en la misma figura (SRPA U4-L1; Jennifer,
       FGN, 20/11/2026: «la fuente de la tabla… aparece de forma separada en la siguiente diapositiva»; «el párrafo que da entrada a la
       siguiente tabla debería estar acompañado de la tabla»). Solo si el bloque los trae: roles.entrada y roles.fuente (segmentos). */
    var rolC = b.roles || {};
    var entradaC = rolC.entrada && rolC.entrada.length ? '<p class="cuadro-entrada">' + rico(segs(rolC.entrada)) + '</p>' : '';
    var fuenteC = rolC.fuente && rolC.fuente.length ? '<p class="cuadro-fuente">' + esc(may(segs(rolC.fuente))) + '</p>' : '';
    return tituloBloque(b, k) + '<div class="cuadro' + (partes ? ' con-partes' : '') + (b.pares ? ' pares' : '') + '">' + entradaC +
      (partes ? '<div class="cuadro-partes" role="group" aria-label="Partes de la tabla">' + b.items.map(function (it, i) {
        return '<button type="button" class="cuadro-tab" data-id="' + k + '-' + i + '" data-i="' + i + '" aria-pressed="' + (i ? 'false' : 'true') + '">' +
          '<span class="cuadro-tab-n">' + (i + 1) + '</span>' + esc(may(rotP[i])) + '<span class="cuadro-tab-visto">' + visto + '</span></button>';
      }).join('') + '</div>' : '') +
      '<div class="cuadro-caja"><table class="cuadro-tabla">' + (cap ? '<caption class="sr-only">' + esc(may(cap)) + '</caption>' : '') +
      '<thead><tr>' + cols.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' + filas + '</tbody></table></div>' + fuenteC +
      (partes ? '<div class="cuadro-nav"><button type="button" class="cuadro-ant"><i class="fas fa-arrow-left" aria-hidden="true"></i> Anterior</button>' +
        '<span class="cuadro-donde" aria-live="polite"></span>' +
        '<button type="button" class="cuadro-sig">Seguir leyendo <i class="fas fa-arrow-right" aria-hidden="true"></i></button></div>' : '') + '</div>';
  };
  /* La letra crece hasta 19 px si la parte es breve y baja de a medio punto (hasta 11,5 px) hasta caber: nunca desplazamiento. */
  function encajarCuadro(el) {
    var c = el.querySelector('.cuadro-caja');
    if (!c || !c.getClientRects().length) return;
    /* Con «ventanaAmplia» (Terminaciones; Juan, 18/11/2026: «una tablita bien organizada… con desplazamiento») la tabla va entera en
       un solo escenario, con letra legible fija, y se desplaza si tiene muchas filas. */
    /* Con «cuadroAjuste» (Tráfico, 20/11/2026: «simplificar las tablas largas que se desplazaban»), la tabla larga llega partida en
       partes de pocas filas y cada parte se encaja sin desplazamiento (letra de 16 a 13 px); solo si una parte no cabe, se desplaza. */
    var ajuste = datos.cuadroAjuste && (datos.huecosFinos || el.querySelector('.cuadro.con-partes'));
    if (datos.ventanaAmplia && !ajuste) { c.style.setProperty('--fs', '15px'); c.classList.add('desplazable'); return; }
    var tope = ajuste ? 16 : 19, piso = ajuste ? 13 : 11.5;
    if (ajuste) c.classList.remove('desplazable');
    /* Con «huecosFinos» (DDHH, 20/11/2026: «tablas… la gente no tiene que dar clics»): columnas equilibradas para que la tabla quepa
       entera. La primera (la que nombra la fila) toma su ancho natural, entre el 12 y el 30 %; las demás se reparten por igual (antes
       una columna ancha y otra angosta hacían filas de muchos renglones). En pantalla angosta la tabla es de fichas: no se toca. */
    if (datos.huecosFinos) {
      var tb = c.querySelector('.cuadro-tabla'), ths = tb ? tb.querySelectorAll('thead th') : [];
      if (tb) { tb.style.tableLayout = ''; ths.forEach(function (x) { x.style.width = ''; }); }
      if (tb && ths.length >= 3 && ths[0].getBoundingClientRect().width > 0) {
        c.style.setProperty('--fs', tope + 'px');
        /* Ninguna palabra de la primera columna se parte («Contradicció-n», «Indisponibilid-ad»; Tráfico U5-L2, 20/11/2026): la
           columna mide al menos su palabra más larga, de todas las partes de la tabla (así no cambia de ancho entre partes). */
        var th0 = tb.querySelector('tbody th'), largo = 0;
        if (th0) {
          var med = document.createElement('span');
          med.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;top:0';
          med.style.font = getComputedStyle(th0).font;
          c.appendChild(med);
          tb.querySelectorAll('tbody th[scope="row"]').forEach(function (x) {
            x.textContent.split(/[\s/]+/).forEach(function (pal) { if (pal.length > 8) { med.textContent = pal; largo = Math.max(largo, med.getBoundingClientRect().width); } });
          });
          c.removeChild(med);
        }
        var w = tb.clientWidth, p = Math.min(Math.max(ths[0].getBoundingClientRect().width, w * 0.12, largo ? largo + 30 : 0), w * 0.3);
        tb.style.tableLayout = 'fixed';
        ths.forEach(function (x, i) { x.style.width = (i ? (w - p) / (ths.length - 1) : p) + 'px'; });
      }
    }
    for (var fs = tope; fs >= piso; fs -= 0.5) { c.style.setProperty('--fs', fs + 'px'); if (c.scrollHeight <= c.clientHeight + 1) break; }
    if (ajuste && c.scrollHeight > c.clientHeight + 1) c.classList.add('desplazable');
  }
  B.cuadro.activar = function (b, k, el) {
    var actualP = 0, tabs = el.querySelectorAll('.cuadro-tab'), ant = el.querySelector('.cuadro-ant'), sig = el.querySelector('.cuadro-sig'), donde = el.querySelector('.cuadro-donde');
    function mostrar(i) {
      actualP = i;
      el.querySelectorAll('.cuadro-fila').forEach(function (tr) { tr.hidden = Number(tr.dataset.parte) !== i; });
      tabs.forEach(function (t) { t.setAttribute('aria-pressed', String(Number(t.dataset.i) === i)); });
      if (ant) ant.disabled = i === 0;
      if (sig) { sig.disabled = i === b.items.length - 1; sig.classList.toggle('late', i < b.items.length - 1); }
      if (donde) donde.textContent = 'Parte ' + (i + 1) + ' de ' + b.items.length + (i < b.items.length - 1 ? ' · La tabla continúa' : ' · Fin de la tabla');
      encajarCuadro(el);
      reanimar(el.querySelector('.cuadro-caja'));
      marcar(k + '-' + i);
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { mostrar(Number(t.dataset.i)); }); });
    if (ant) ant.addEventListener('click', function () { if (actualP > 0) mostrar(actualP - 1); });
    if (sig) sig.addEventListener('click', function () { if (actualP < b.items.length - 1) mostrar(actualP + 1); });
    mostrar(0); /* la primera parte a la vista desde el inicio */
    if (document.fonts) document.fonts.ready.then(function () { encajarCuadro(el); });
    window.addEventListener('resize', function () { encajarCuadro(el); });
  };

  /* Infografía de ramas (delitos ambientales, Juan, 18/11/2026, U1-L3: «Sector central» y «Sector descentralizado» en una sola
     diapositiva, cada rama abre sus entidades): un eje al centro y dos o tres ramas, cada una con su título de la ficha, su frase de
     entrada y su nota a la vista; cada entidad es un botón que abre su texto literal en el lector y queda vista. Solo lo usa el
     curso que lo pone en sus datos.
     Datos: {tipo:'ramas', grupos:[{titulo:'2.1. Sector central', intro:[seg…], nota:[seg…]}], items:[{label, segs, obj, grupo}],
     roles:{intro:[…], nota:[…]}} («roles» solo para la cobertura). */
  B.ramas = function (b, k) {
    var grupos = b.grupos.map(function (g, j) {
      var its = b.items.map(function (it, i) { return [it, i]; }).filter(function (p) { return (p[0].grupo || 0) === j; });
      return '<section class="rama-grupo g' + (j + 1) + '" style="--d:' + (0.15 + j * 0.2) + 's"><p class="rama-titulo"><span class="rama-num">' + (j + 1) + '</span>' + esc(may(g.titulo)) + '</p>' +
        (g.intro && g.intro.length ? '<p class="rama-intro">' + esc(may(segs(g.intro))) + '</p>' : '') +
        '<ul class="rama-entidades n' + its.length + '">' + its.map(function (p, m) {
          var it = p[0], i = p[1];
          return '<li style="--d:' + (0.3 + j * 0.2 + m * 0.06) + 's"><button type="button" class="rama-entidad' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '">' +
            '<span class="rama-ent-arte">' + svgObjeto(it.obj, 30) + '</span><span class="rama-ent-rotulo">' + rot(it.label) + '</span><span class="rama-ent-marca">' + mano + visto + '</span>' + estado + '</button></li>';
        }).join('') + '</ul>' +
        (g.nota && g.nota.length ? '<p class="rama-nota"><i class="fas fa-circle-info" aria-hidden="true"></i><span>' + esc(may(segs(g.nota))) + '</span></p>' : '') + '</section>';
    });
    return '<div class="ramas n' + b.grupos.length + '">' + grupos[0] + '<div class="ramas-eje" aria-hidden="true"><span class="ramas-hub"><i class="fas fa-sitemap"></i></span></div>' + grupos.slice(1).join('') + '</div>';
  };
  B.ramas.activar = function (b, k, el) { abreLector(el, b); };

  /* Página compacta (Tráfico y trata; Juan, 20/11/2026, 19:01–22:15, al revisar la Lección 1.1 en el aula: «quedó con mucho texto»,
     menos pestañas y ventanas, «una tablita completa sin segmentar… baje con el scroll para ver el contenido completo», «los tips hay
     que dejarlos aparte… por aquí a un lado», la «regla de decisión» como recuadro con negritas y fondo, la pregunta y la respuesta
     «en un solo texto… un pequeño scroll», un popup por verbo sobre las fases). Solo lo usa el curso que lo pone en sus datos.
     Una columna de lectura que se desplaza (es la excepción pedida por Juan a «nunca hay desplazamiento») y, a un lado, los tips:
     Datos: {tipo:'compacta', flujo:[pieza…], items:[{label, segs, clase:'flujo'|'tip'|'celda', obj, extracto}], lado:[ítem…],
     objetos:[…]}. Piezas del flujo: {t:'p', s:[seg…], c:''|'regla'|'alerta'|'tip'|'clave', n: letras en negrita de la ficha},
     {t:'sub', x}, {t:'lista', s:[seg…], n:[negrita…]}, {t:'tabla'|'flechas', cols:[seg…], filas:[[seg…]…]}, {t:'malla', cols:[texto…], filas:[{rot, celdas:[[ítem…]…]}],
     intro}. El ítem «flujo» (el primero, si hay lectura) queda leído al llegar al final de la columna; los demás, al abrir su ventana. */
  var CMP_SELLO = { regla: ['fa-code-branch', 'Regla de decisión'], alerta: ['fa-triangle-exclamation', 'Alerta'], tip: ['fa-lightbulb', 'Tip'], clave: ['fa-star', 'Elemento clave'] };
  function cmpTexto(ss, n) {
    return ss.map(function (i, j) {
      var t = seg(i);
      return !j && n > 0 && n < t.length ? '**' + may(t.slice(0, n)) + '**' + t.slice(n) : t;
    }).join('\n');
  }
  function cmpExtracto(t, lim) {
    t = String(t).replace(/\s+/g, ' ');
    if (t.length <= lim) return t;
    var c = t.slice(0, lim), u = c.lastIndexOf(' ');
    return cerrarSignos(c.slice(0, u > 40 ? u : lim).replace(/[\s,;:.(«“]+$/, '') + '…');
  }
  /* La tabla completa de la página compacta. También va dentro de una ventana (Juan, 20/11/2026, Tráfico 2.1, 1.1.1: «metámosle
     un pop-up "Estereotipos que excluyen a la víctima real" y que se abra la tablita completa»). */
  function cmpTabla(z) {
    function celda(c) { return c === null || c === undefined ? '' : seg(c); }
      /* Ancho de cada columna según lo que trae (raíz del largo medio de sus celdas): una columna de «Sí», «No» o «a)» no ocupa
         lo mismo que la de las notas (antes, un hueco de 288 px en la columna de la Ley 2608; QA del 21/11/2026). */
      var pesos = z.cols.map(function (c, j) {
        var suma = z.filas.reduce(function (a, f) { return a + celda(f[j]).length; }, 0) / Math.max(1, z.filas.length);
        return Math.max(2.4, Math.min(10, Math.sqrt(suma)), Math.sqrt(celda(c).length) * 0.85);
      }), totalP = pesos.reduce(function (a, x) { return a + x; }, 0);
      /* Ninguna columna queda más angosta que su palabra más larga («Desistimiento», «Resarcimiento»: se partían en cualquier
         letra; Terminaciones 2.1, 22/11/2026). Se calcula sobre unos 900 px de tabla y nunca pasa de un 30 % por columna; lo que
         una columna gana se lo ceden las demás en proporción. En pantalla angosta la tabla ya pasa a fichas. */
      var partes = pesos.map(function (p) { return p / totalP; });
      var piso = z.cols.map(function (c, j) {
        var largo = 0;
        [celda(c)].concat(z.filas.map(function (f) { return celda(f[j]); })).forEach(function (x) {
          String(x).split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/).forEach(function (w) { if (w.length > largo) largo = w.length; });
        });
        return Math.min(0.3, (largo * 9.2 + 24) / 900);
      });
      var fijas = partes.map(function (s, j) { return s < piso[j]; });
      if (fijas.some(Boolean) && !fijas.every(Boolean)) {
        var sumaFijas = piso.reduce(function (a, x, j) { return a + (fijas[j] ? x : 0); }, 0);
        var sumaLibres = partes.reduce(function (a, x, j) { return a + (fijas[j] ? 0 : x); }, 0);
        if (sumaFijas < 0.8) partes = partes.map(function (s, j) { return fijas[j] ? piso[j] : s * (1 - sumaFijas) / sumaLibres; });
      }
      pesos = partes; totalP = 1;
      /* Matriz para diligenciar (Tráfico U3, 1.2): si la ficha trae vacías todas las celdas menos la primera columna, van en blanco. */
      var vacia = z.filas.every(function (f) { return f.slice(1).every(function (c) { return !celda(c); }); });
      /* La primera columna va en negrita solo si es el rótulo de la fila: corta frente a las demás, o la de una matriz por
         diligenciar. En una tabla que compara dos textos parejos («Legítimo | Ilegítimo», «Bloque 1 | Bloque 2») todas las celdas
         van igual (Juan, 20/11/2026: «una columna en negrilla y la otra no»). */
      var largoCol = function (j) { return z.filas.reduce(function (a, f) { return a + celda(f[j]).length; }, 0) / Math.max(1, z.filas.length); };
      var m0 = largoCol(0), mr = z.cols.slice(1).reduce(function (a, c, j) { return a + largoCol(j + 1); }, 0) / Math.max(1, z.cols.length - 1);
      /* Con dos columnas la tabla suele comparar: la primera solo es rótulo si es mucho más corta que la segunda. */
      var rotFila = z.filas.length > 1 && (vacia || (z.cols.length > 2 ? m0 <= 48 || m0 <= 0.6 * mr : m0 <= 0.4 * mr));
      return '<div class="cmp-tabla-caja"><table class="cmp-tabla c' + z.cols.length + (vacia ? ' vacia' : '') + '"><colgroup>' + pesos.map(function (p) { return '<col style="width:' + (100 * p / totalP).toFixed(1) + '%">'; }).join('') + '</colgroup><thead><tr>' + z.cols.map(function (c) { return '<th scope="col">' + esc(may(celda(c))) + '</th>'; }).join('') +
        '</tr></thead><tbody>' + z.filas.map(function (f) {
          return '<tr>' + f.map(function (c, j) {
            /* «a)», «b)»… en una celda es el literal del artículo, no una enumeración: va tal cual, en minúscula. */
            /* Una celda que la ficha dibuja como árbol («┌── Obstrucción… ├── Peligro… └── No comparecencia», Tráfico U4, 2.2):
               cada rama en su renglón, con su marca, en vez de los trazos seguidos en una línea. Las palabras no cambian. */
            var crudo = celda(c), ramas = /[┌├└]─+/.test(crudo) ? crudo.split(/\s*[┌├└]─+\s*/).filter(function (x) { return x.trim(); }) : null;
            /* Una celda que la ficha dibuja como cadena («Medio ──► Hecho indicador ──► HJR», Tráfico U5, 1.4): cada eslabón en
               su recuadro, unidos por una flecha. Las palabras no cambian. */
            var cadena = !ramas && /─+►/.test(crudo) ? crudo.split(/\s*─+►\s*/).filter(function (x) { return x.trim(); }) : null;
            var t = ramas ? '<ul class="cmp-arbol">' + ramas.map(function (x) { return '<li><span class="lectura-texto">' + rico(x) + '</span></li>'; }).join('') + '</ul>' :
              cadena ? '<span class="cmp-cadena">' + cadena.map(function (x) { return '<span class="cmp-eslabon lectura-texto">' + rico(x) + '</span>'; }).join('<i class="fas fa-arrow-right" aria-hidden="true"></i>') + '</span>' :
              '<span class="lectura-texto">' + (/^[a-zñ]\)$/.test(crudo.trim()) ? '<span class="parr">' + esc(crudo.trim()) + '</span>' : (crudo || !vacia ? rico(crudo || '–') : '')) + '</span>';
            var r = ' data-rot="' + esc(may(celda(z.cols[j]))) + '"';
            /* En una tabla de una sola fila la primera celda no es el rótulo de la fila: todas van igual (Juan, 20/11/2026:
               «una columna en negrilla y la otra no»). */
            return j || !rotFila ? '<td' + r + '>' + t + '</td>' : '<th scope="row"' + r + '>' + t + '</th>';
          }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>';
  }
  function cmpVentanaTabla(it) {
    return (it.tabla.antes || []).map(function (i) { return '<div class="cmp-p"><p class="lectura-texto">' + rico(seg(i)) + '</p></div>'; }).join('') + cmpTabla(it.tabla);
  }
  /* Cita textual larga entre comillas inglesas, en cursiva (Clara Vargas, 21/11/2026: «las menciones a citas textuales deben
     resaltarse con letra cursiva o negrilla… se pierde la distinción entre dos voces: la de la Corte y la del autor»). Solo donde la
     hoja lo pide («citasCursiva») y si el tramo no parte ninguna etiqueta. */
  function cmpCitas(html) {
    return html.replace(/“[^“”]{60,}”/g, function (m) {
      if (/<[/]?(?:p|div|li|td|th)[ >]/.test(m)) return m;
      /* La cita puede cruzar tramos de lectura (cada uno es un «span.parr»): la cursiva va por tramo, sin partir etiquetas. */
      var partes = m.split(/(<[/]span><span class="parr[^"]*">)/), bien = true;
      partes.forEach(function (x, i) {
        if (i % 2) return;
        if ((x.match(/<span[ >]/g) || []).length !== (x.match(/<[/]span>/g) || []).length) bien = false;
      });
      if (!bien) return m;
      return partes.map(function (x, i) { return i % 2 || !x ? x : '<em class="cmp-cita-txt">' + x + '</em>'; }).join('');
    });
  }
  B.compacta = function (b, k) {
    var hayFlujo = !!(b.items.length && b.items[0].clase === 'flujo');
    function celda(c) { return c === null || c === undefined ? '' : seg(c); }
    var oculto = false;   // en la malla con rótulo de fila y de columna, el rótulo del recuadro solo lo lee el lector de pantalla
    function boton(i) {
      var it = b.items[i], txt = segs(it.segs);
      return '<button type="button" class="cmp-celda' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '">' +
        '<span class="cmp-celda-rot' + (oculto ? ' sr-only' : '') + '">' + rot(it.label) + '</span>' +
        (it.extracto ? '<span class="cmp-celda-ext">' + esc(may(cmpExtracto(txt, 150))) + '</span>' : '') +
        '<span class="cmp-celda-pie">' + mano + '<span class="cmp-pie-por">' + (it.tabla ? 'Clic para ver la tabla' : 'Clic para leer') + '</span><span class="cmp-pie-visto">Leído · clic para releer</span>' + visto + '</span></button>';
    }
    /* Árbol de decisión de la ficha como infografía (Juan, 20/11/2026, Tráfico 1.3, 3.4: «hagamos una infografía y le colocamos
       el resto, la regla de decisión»): nodo {q (pregunta) | x (resultado), ramas:[{r:'Sí'|'No', …nodo}], hojas:[…]}. */
    function arbol(n) {
      var hijos = n.ramas ? '<div class="arb-ramas">' + n.ramas.map(function (h) { return '<div class="arb-rama"><span class="arb-r">' + esc(h.r) + '</span>' + arbol(h) + '</div>'; }).join('') + '</div>'
        : n.hojas ? '<div class="arb-hojas">' + n.hojas.map(function (h) { return '<span class="arb-hoja">' + esc(may(h)) + '</span>'; }).join('') + '</div>' : '';
      return '<div class="arb-nodo"><div class="arb-caja ' + (n.q ? 'arb-q' : 'arb-x') + '">' + esc(may(n.q || n.x)) + '</div>' + hijos + '</div>';
    }
    var cuerpo = b.flujo.map(function (z) {
      if (z.t === 'sub') return '<h3 class="cmp-sub">' + esc(may(z.x)) + '</h3>';
      if (z.t === 'arbol') return '<div class="cmp-arbolq">' + arbol(z.raiz) + '</div>';
      /* Pasos con dos salidas (Juan, 20/11/2026, Tráfico 1.3, 3.4.1: «el flujo de proceso 0, 1… de izquierda a derecha; cuando le
         da clic aparece este sí o no»): la tabla «Paso y pregunta | Si la respuesta es sí | Si la respuesta es no» de la ficha, un
         botón por paso y, al elegirlo, su pregunta y sus dos salidas. Texto literal de las celdas. */
      if (z.t === 'pasos') {
        return '<div class="cmp-pasos" data-pasos><div class="cmp-pasos-fila" role="tablist" aria-label="' + esc(celda(z.cols[0])) + '">' + z.filas.map(function (f, j) {
          var m = /^\((\d+)\)/.exec(celda(f.c[0]).trim()), n = m ? m[1] : String(j + 1);
          return '<button type="button" class="cmp-paso" role="tab" aria-selected="false" data-id="' + k + '-' + f.i + '" data-paso="' + j + '"><span class="cmp-paso-n">' + esc(n) + '</span>' +
            '<span class="sr-only">' + esc(celda(f.c[0])) + '</span>' + visto + '</button>' + (j < z.filas.length - 1 ? '<i class="cmp-paso-con" aria-hidden="true"></i>' : '');
        }).join('') + '</div><p class="cmp-pasos-guia">' + mano + ' Elija cada paso, de izquierda a derecha, para ver su pregunta y sus dos salidas.</p>' +
          z.filas.map(function (f, j) {
            return '<div class="cmp-paso-panel" role="tabpanel" data-panel="' + j + '" hidden><p class="cmp-paso-q lectura-texto">' + rico(celda(f.c[0])) + '</p><div class="cmp-paso-sal">' +
              '<div class="cmp-paso-si"><span class="cmp-paso-rot"><i class="fas fa-check" aria-hidden="true"></i> ' + esc(may(celda(z.cols[1]))) + '</span><span class="lectura-texto">' + rico(celda(f.c[1])) + '</span></div>' +
              '<div class="cmp-paso-no"><span class="cmp-paso-rot"><i class="fas fa-xmark" aria-hidden="true"></i> ' + esc(may(celda(z.cols[2]))) + '</span><span class="lectura-texto">' + rico(celda(f.c[2])) + '</span></div></div></div>';
          }).join('') + '</div>';
      }
      if (z.t === 'lista') return '<ul class="cmp-lista' + (z.num ? ' num' : '') + (z.cadena ? ' cadena' : '') + (z.dos ? ' dos' : '') + '">' + z.s.map(function (i, j) { return '<li><span class="lectura-texto">' + rico(cmpTexto([i], (z.n || [])[j] || 0)) + '</span></li>'; }).join('') + '</ul>';
      if (z.t === 'p') {
        var s = CMP_SELLO[z.c];
        /* El texto de la ficha ya dice «Regla de decisión» y «TIP —»: su sello es solo el icono (no se repite el rótulo). */
        var solo = z.c === 'regla' || z.c === 'tip';
        return '<div class="cmp-p' + (z.c ? ' cmp-c-' + z.c : '') + '">' + (s ? '<span class="cmp-sello' + (solo ? ' solo' : '') + '"><i class="fas ' + s[0] + '" aria-hidden="true"></i>' + (solo ? '' : ' ' + s[1]) + '</span>' : '') +
          '<p class="lectura-texto">' + (b.citasCursiva ? cmpCitas(rico(cmpTexto(z.s, z.n))) : rico(cmpTexto(z.s, z.n))) + '</p></div>';
      }
      if (z.t === 'tabla') return cmpTabla(z);
      if (z.t === 'flechas') {
        /* Tabla de la ficha con columnas de flecha («→»): cada fila es un recorrido de cajas unidas por flechas. */
        var esFlecha = function (c) { return /^[→➔➜>]+$/.test(celda(c).trim()); };
        /* La flecha puede venir en las celdas de cada fila (U1 L1) o solo en el encabezado, con las celdas vacías (U2 L2, 2.1). */
        var colF = z.cols.map(function (c, j) { return esFlecha(c) || (z.filas.length > 0 && z.filas.every(function (f) { return esFlecha(f[j]); })); });
        var cab = z.cols.map(function (c, j) { return { j: j, t: celda(c) }; }).filter(function (x) { return x.t && !colF[x.j]; });
        return '<div class="cmp-flechas n' + cab.length + '"><div class="cmp-fl-cab" aria-hidden="true">' + cab.map(function (x) { return '<span>' + esc(may(x.t)) + '</span>'; }).join('<i></i>') + '</div>' +
          z.filas.map(function (f, m) {
            return '<div class="cmp-fl-fila" style="--d:' + (0.15 + m * 0.15) + 's">' + f.map(function (c, j) {
              if (colF[j]) return '<span class="cmp-fl-flecha"><i class="fas fa-arrow-right" aria-hidden="true"></i><span class="sr-only">' + esc(celda(c) || celda(z.cols[j])) + '</span></span>';
              return '<div class="cmp-fl-caja p' + j + '"><span class="sr-only">' + esc(may(celda(z.cols[j]))) + ': </span><span class="lectura-texto">' + rico(celda(c)) + '</span></div>';
            }).join('') + '</div>';
          }).join('') + '</div>';
      }
      if (z.t === 'malla') {
        var conRot = z.filas.some(function (f) { return f.rot; });
        oculto = conRot;
        /* Sin columnas («cols» vacío): recuadros apilados, uno por fila, sin encabezado (escenario con recuadros, Tráfico 1.2). */
        return '<div class="cmp-malla c' + (z.cols.length || z.columnas || 1) + (conRot ? ' con-rot' : '') + (z.cols.length ? '' : ' sin-cab') + '">' + (z.intro ? '<p class="cmp-malla-intro">' + esc(may(z.intro)) + '</p>' : '') +
          (z.cols.length ? '<div class="cmp-malla-cab">' + (conRot ? '<span></span>' : '') + z.cols.map(function (c, j) { return '<span class="cmp-malla-col t' + (j % 3) + '">' + esc(may(c)) + '</span>'; }).join('') + '</div>' : '') +
          z.filas.map(function (f) {
            return '<div class="cmp-malla-fila">' + (conRot ? '<p class="cmp-malla-rot">' + rot(f.rot || '') + '</p>' : '') +
              f.celdas.map(function (c, j) { return '<div class="cmp-malla-celda t' + (j % 3) + ' n' + c.length + '">' + c.map(boton).join('') + '</div>'; }).join('') + '</div>';
          }).join('') + '</div>';
      }
      /* Lista de verificación con simulación (Juan, hoja de virtualización de Derecho de petición, 22/11/2026: «lista de chequeo
         con simulación para que la persona haga click en cada uno de los ítems»): cada ítem, con su texto literal completo, se
         marca con un clic (o con Enter o la barra espaciadora), queda visto, avanza la barra de la lista y, con todos marcados,
         aparece el aviso de lista completa. Solo si la hoja de la página la pide («chequeo»). Datos: {t:'chequeo', i:[ítems]}. */
      if (z.t === 'chequeo') {
        return '<div class="cmp-chequeo" data-chequeo><p class="cmp-chq-guia">' + mano + ' Haga clic en cada ítem para marcarlo como revisado.</p>' +
          '<ul class="cmp-chq-lista">' + z.i.map(function (i) {
            var it = b.items[i];
            return '<li><button type="button" class="cmp-chq" role="checkbox" aria-checked="false" data-id="' + k + '-' + i + '" data-chq="' + i + '">' +
              '<span class="cmp-chq-caja" aria-hidden="true"><i class="fas fa-check"></i></span><span class="lectura-texto">' + rico(cmpTexto(it.segs, 0)) + '</span></button></li>';
          }).join('') + '</ul><div class="cmp-chq-avance"><span class="cmp-chq-barra" aria-hidden="true"><i></i></span><output aria-live="polite">0 de ' + z.i.length + ' ítems revisados</output></div>' +
          '<p class="cmp-chq-fin" role="status" hidden><i class="fas fa-circle-check" aria-hidden="true"></i> Lista completa: todos los ítems quedaron revisados.</p></div>';
      }
      return '';
    }).join('');
    var lado = b.lado || [], objs = b.objetos || ['documento', 'lupa', 'carpetas'];
    /* Curso con ilustraciones aprobadas (Bienes, piloto del 21/11/2026): en una página sin tips, la ilustración de la escena va
       entera a un lado de la lectura, en vez de los tres objetos, y la columna de texto queda más angosta y cómoda de leer. */
    var ilus = !lado.length && datos.ilustraciones && escena.ilustracion ? escena.ilustracion : null;
    /* A un lado pueden ir, además de los tips, una regla de decisión o una advertencia que la hoja mande allí (Juan, 20/11/2026,
       Tráfico 1.3: «al lado derecho los tres tips»; «"Advertencia sobre precedentes"… como un clic de algo especial»). */
    var claseLado = function (i) { return b.items[i].clase === 'regla' ? 'regla' : b.items[i].clase === 'alerta' ? 'alerta' : 'tip'; };
    var nLado = { tip: 0, regla: 0, alerta: 0 };
    lado.forEach(function (i) { nLado[claseLado(i)]++; });
    var titLado = [nLado.tip ? (nLado.tip > 1 ? 'Tips' : 'Tip') : '', nLado.regla ? (nLado.regla > 1 ? 'reglas de decisión' : 'regla de decisión') : '', nLado.alerta ? (nLado.alerta > 1 ? 'advertencias' : 'advertencia') : '']
      .filter(Boolean).join(' y ');
    var verLado = { tip: 'Clic para ver el tip', regla: 'Clic para ver la regla', alerta: 'Clic para ver la advertencia' };
    var icoLado = nLado.tip ? 'fa-lightbulb' : nLado.regla ? 'fa-code-branch' : 'fa-triangle-exclamation';
    /* «escenario» (Juan, 20/11/2026, Tráfico 1.2, 2.5 y 2.6: «esta figura, una persona y con un par de pop-ups»; «le metería un
       fondo… y con esto al frente»): los dibujos del tema, grandes, en un panel a la izquierda, y los recuadros apilados al frente. */
    var esc_ = !!b.escenario && !lado.length;
    return '<div class="compacta' + (lado.length ? ' con-tips' : ' sin-tips') + (ilus ? ' con-ilus' : '') + (esc_ ? ' cmp-esc' : '') + (lado.length > 2 ? ' muchos-tips' : '') + (hayFlujo ? '' : ' sin-lectura') + '">' +
      '<div class="cmp-col"><div class="cmp-flujo lectura-desplazable" tabindex="0"' + (hayFlujo ? ' data-id="' + k + '-0"' : '') + '>' + cuerpo + '</div>' +
      '<p class="cmp-baje" hidden><i class="fas fa-angles-down" aria-hidden="true"></i> Baje con la barra de desplazamiento para ver el contenido completo</p></div>' +
      '<aside class="cmp-lado"' + (lado.length ? ' aria-label="Tips de esta página"' : ' aria-hidden="true"') + '>' +
      (ilus ? '<figure class="cmp-ilus" aria-hidden="true"><img src="' + srcImagen(ilus) + '" alt=""></figure>' : '') +
      '<div class="cmp-arte" aria-hidden="true"' + (ilus ? ' hidden' : '') + '>' +
      objs.slice(0, lado.length > 2 ? 1 : esc_ ? 2 : 3).map(function (o, i) { return '<span style="--d:' + (0.2 + i * 0.15) + 's">' + svgObjeto(o, esc_ ? 150 : 64) + '</span>'; }).join('') + '</div>' +
      (lado.length ? '<p class="cmp-lado-tit"><i class="fas ' + icoLado + '" aria-hidden="true"></i> ' + esc(may(titLado)) + '</p>' + lado.map(function (i) {
        var it = b.items[i], cl = claseLado(i);
        return '<button type="button" class="cmp-tip' + (cl === 'tip' ? '' : ' cmp-lado-' + cl + (cl === 'alerta' ? ' es-alerta' : '')) + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '"><span class="cmp-tip-rot">' + esc(may(String(it.label).replace(/^TIP\s+—\s*/, ''))) + '</span>' +
          '<span class="cmp-tip-ver">' + mano + '<span class="cmp-pie-por">' + verLado[cl] + '</span><span class="cmp-pie-visto">Visto · clic para releer</span>' + visto + '</span></button>';
      }).join('') : '') + '</aside></div>';
  };
  B.compacta.activar = function (b, k, el) {
    var caja = el.querySelector('.cmp-flujo'), aviso = el.querySelector('.cmp-baje'), hayFlujo = caja.hasAttribute('data-id'), g = generacion;
    el.querySelectorAll('button[data-i]').forEach(function (c) {
      c.addEventListener('click', function () {
        if (!quieto && c.animate) c.animate([{ scale: '1' }, { scale: '.96' }, { scale: '1.02' }, { scale: '1' }], { duration: 320, easing: 'ease-out' });
        var it = b.items[Number(c.dataset.i)];
        leer(it.label, segs(it.segs), it.obj, c, null, it.tabla ? cmpVentanaTabla(it) : null); marcar(c.dataset.id);
      });
    });
    el.querySelectorAll('[data-pasos]').forEach(function (p) {
      var bs = p.querySelectorAll('.cmp-paso'), ps = p.querySelectorAll('.cmp-paso-panel'), guia = p.querySelector('.cmp-pasos-guia');
      bs.forEach(function (bt) {
        bt.addEventListener('click', function () {
          bs.forEach(function (x) { x.classList.toggle('activo', x === bt); x.setAttribute('aria-selected', x === bt ? 'true' : 'false'); });
          ps.forEach(function (x) { x.hidden = x.dataset.panel !== bt.dataset.paso; });
          guia.hidden = true;
          marcarYa(bt.dataset.id);
          setTimeout(revisar, 60);
        });
      });
    });
    el.querySelectorAll('[data-chequeo]').forEach(function (q) {
      var bs = q.querySelectorAll('.cmp-chq'), out = q.querySelector('output'), barra = q.querySelector('.cmp-chq-barra i'), fin = q.querySelector('.cmp-chq-fin');
      function cuenta() {
        var n = q.querySelectorAll('.cmp-chq[aria-checked="true"]').length, todo = n === bs.length;
        out.textContent = n + ' de ' + bs.length + ' ítems revisados';
        barra.style.width = (100 * n / bs.length) + '%';
        if (todo && fin.hidden && !quieto && fin.animate) fin.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'ease-out' });
        fin.hidden = !todo;
        q.classList.toggle('completa', todo);
      }
      bs.forEach(function (bt) {
        bt.addEventListener('click', function () {
          var si = bt.getAttribute('aria-checked') !== 'true';
          bt.setAttribute('aria-checked', String(si));
          if (si) { if (!quieto && bt.animate) bt.animate([{ scale: '1' }, { scale: '.98' }, { scale: '1' }], { duration: 240, easing: 'ease-out' }); marcarYa(bt.dataset.id); }
          cuenta();
          setTimeout(revisar, 60);
        });
      });
    });
    function revisar() {
      if (g !== generacion || !caja.getClientRects().length) return;
      var desborda = caja.scrollHeight > caja.clientHeight + 6, falta = caja.scrollHeight - caja.clientHeight - caja.scrollTop;
      var fin = !desborda || falta < 28;
      aviso.hidden = fin;
      caja.classList.toggle('desborda', desborda);
      if (hayFlujo && fin) marcarYa(k + '-0');
    }
    /* Página breve, solo de lectura (sin tabla, malla ni infografía): la letra crece hasta ocupar la columna, sin llegar a
       desplazarse (AGENTS.md: «la letra crece si el texto es breve»; QA del 21/11/2026: hueco bajo un solo párrafo). */
    function crecer() {
      /* También crece la página que es solo una tabla breve (Tráfico 1.3, 3.3: la tabla del artículo 188C con sus recuadros a un lado). */
      if (g !== generacion || !caja.getClientRects().length || caja.querySelector('.cmp-malla,.cmp-flechas,.cmp-pasos,.cmp-arbolq,.cmp-chequeo')) return;
      if (getComputedStyle(caja).overflowY === 'visible') return;   /* variante angosta: la página se desplaza entera */
      caja.style.fontSize = '';
      if (caja.scrollHeight > caja.clientHeight + 2) return;
      var base = parseFloat(getComputedStyle(caja).fontSize), fs = base;
      while (fs < 22) {
        caja.style.fontSize = (fs + 0.5) + 'px';
        if (caja.scrollHeight > caja.clientHeight + 2) { caja.style.fontSize = fs === base ? '' : fs + 'px'; break; }
        fs += 0.5;
      }
    }
    crecer();
    if (document.fonts) document.fonts.ready.then(crecer);
    caja.addEventListener('scroll', revisar, { passive: true });
    setTimeout(revisar, 1100);
    /* Respaldo del aviso de desplazamiento: en un iframe en segundo plano el navegador puede no avisar del desplazamiento; mientras
       falte llegar al final, se comprueba cada tanto. */
    var reloj = setInterval(function () {
      if (g !== generacion || !document.body.contains(caja)) { clearInterval(reloj); return; }
      revisar();
      if (aviso.hidden) clearInterval(reloj);
    }, 800);
    if (document.fonts) document.fonts.ready.then(function () { setTimeout(revisar, 1100); });
    window.addEventListener('resize', function () { if (g === generacion && aviso.hidden === false) revisar(); });
  };

  /* Apertura de la lección (Terminaciones; Esteban, 19/11/2026: «estaba muy simple, ¿la podrías mejorar su presentación?»): la
     pregunta orientadora en un recuadro destacado, los objetos del tema y las ideas que la responden, unidas por flechas, con su
     texto literal completo a la vista (sin «…» ni clic para leer lo esencial). Solo lo usa el curso que lo pone en sus datos.
     Datos: {tipo:'apertura', pregunta:[seg…], items:[{label, segs, obj}], objetos:['carpetas', …]}. */
  B.apertura = function (b, k) {
    var objs = b.objetos || ['carpetas', 'lupa', 'expediente'];
    return '<div class="apertura n' + b.items.length + '"><div class="ap-cab"><div class="ap-pregunta"><p class="ap-sello"><i class="fas fa-circle-question" aria-hidden="true"></i> Pregunta orientadora</p>' +
      '<p class="lectura-texto">' + rico(segs(b.pregunta)) + '</p></div><div class="ap-arte" aria-hidden="true">' + objs.map(function (o, i) {
        return '<span style="--d:' + (0.2 + i * 0.15) + 's">' + svgObjeto(o, 96) + '</span>';
      }).join('') + '</div></div><div class="ap-ideas">' + b.items.map(function (it, i) {
        return (i ? '<span class="ap-flecha" aria-hidden="true"><i class="fas fa-arrow-right"></i></span>' : '') +
          '<section class="ap-idea" data-id="' + k + '-' + i + '" style="--d:' + (0.35 + i * 0.2) + 's"><p class="ap-rotulo"><span class="ap-n">' + (i + 1) + '</span>' + rot(it.label) + '</p>' +
          '<p class="lectura-texto">' + rico(segs(it.segs)) + '</p></section>';
      }).join('') + '</div></div>';
  };
  B.apertura.activar = function (b, k, el) {
    /* Todo está a la vista: las ideas quedan leídas al mostrarse, sin clics. */
    b.items.forEach(function (_, i) { setTimeout(function () { marcarYa(k + '-' + i); }, 600 + i * 300); });
  };

  /* ---------- Mediaciones para variar (Juan, 27/10/2026: «varíe con mapas conceptuales, mapa mental, acordeones, grids,
     una imagen de fondo con hotspots») ----------
     Rejilla que llena el marco, acordeón, puntos sobre la ilustración aprobada, mapa mental y mapa conceptual jerárquico.
     Salvo el acordeón, que despliega el texto en su sitio, todas lo abren completo en el lector y marcan visto. */
  function centroTitulo() { return String(escena.titulo_genially || datos.heading || '').replace(/\s*\(\d+ de \d+\)$/, ''); }
  function abreLector(el, b) {
    el.querySelectorAll('button[data-i]').forEach(function (c) {
      c.addEventListener('click', function () {
        /* El botón se hunde y rebota, y saltan chispas, mientras la ventana nace de él (Esteban, 31/10/2026: apertura premium). */
        if (!quieto && c.animate) { c.animate([{ scale: '1' }, { scale: '.95' }, { scale: '1.03' }, { scale: '1' }], { duration: 380, easing: 'ease-out' }); chispas(c, { n: 10, d: 44, retraso: 60 }); }
        var it = b.items[Number(c.dataset.i)]; leer(it.label, segs(it.segs), it.obj, c); marcar(c.dataset.id);
      });
    });
  }

  /* Rejilla en collage (Esteban, 27/10/2026: «unos recuadros… con una imagen… al tocarlos se abre un modal con el texto…
     como un collage»): ventanas de distinto tamaño que llenan el marco, cada una con su rótulo arriba y, debajo, una
     ilustración aprobada distinta («ilus», la elige el generador); el texto nunca va sobre la imagen. Al tocarla, el texto
     completo se abre en el lector. Sin «ilus» (otros cursos) se dibuja su objeto. */
  B.rejilla = function (b, k) {
    return tituloBloque(b, k) + '<div class="rejilla n' + b.items.length + '">' + b.items.map(function (it, i) {
      return '<button type="button" class="celda' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '" style="--d:' + (i * 0.07) + 's">' +
        '<span class="celda-cab"><span class="celda-n">' + (i + 1) + '</span><span class="celda-rotulo">' + rot(it.label) + '</span>' +
        '<span class="celda-marca">' + mano + visto + '</span></span>' +
        (it.ilus ? '<span class="celda-foto"><img src="' + srcImagen(it.ilus) + '" alt=""></span>' : '<span class="celda-foto sin-foto">' + svgObjeto(it.obj, 96) + '</span>') + '</button>';
    }).join('') + '</div>';
  };
  B.rejilla.activar = function (b, k, el) { abreLector(el, b); };

  B.acordeon = function (b, k) {
    return tituloBloque(b, k) + '<div class="acordeon">' + b.items.map(function (it, i) {
      return '<div class="acordeon-item" style="--d:' + (i * 0.06) + 's"><button type="button" class="acordeon-cab' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-n="' + i + '" aria-expanded="false">' +
        '<span class="acordeon-num">' + (i + 1) + '</span><span class="acordeon-ico">' + svgObjeto(it.obj, 28) + '</span><span class="acordeon-rotulo">' + rot(it.label) + '</span>' +
        '<span class="acordeon-visto">' + visto + '</span><i class="fas fa-chevron-down acordeon-flecha" aria-hidden="true"></i></button>' +
        '<div class="acordeon-panel" hidden><p class="lectura-texto">' + rico(segs(it.segs)) + '</p></div></div>';
    }).join('') + '</div>';
  };
  /* El apartado abierto ocupa el espacio que dejan los demás; la letra crece si el texto es breve (hasta 22 px) y se reduce hasta que cabe: nunca desplazamiento. */
  function encajarPanel(p) {
    quitarRelleno(p);
    for (var fs = topeLetra(22); fs >= pisoLetra(); fs -= 0.5) { p.style.setProperty('--fs', fs + 'px'); if (entra(p)) break; }
    rellenar(p);
  }
  B.acordeon.activar = function (b, k, el) {
    var cabs = el.querySelectorAll('.acordeon-cab');
    function abrir(c) {
      cabs.forEach(function (o) {
        var si = o === c;
        if (!si) quitarRelleno(o.nextElementSibling);   // el que se cierra suelta su ilustración: con ella seguía a la vista
        o.setAttribute('aria-expanded', String(si)); o.nextElementSibling.hidden = !si; o.parentNode.classList.toggle('abierto', si);
      });
      var p = c.nextElementSibling;
      if (!dosificar(p, function () { encajarPanel(p); })) encajarPanel(p);
      reanimar(p); marcar(c.dataset.id);
    }
    cabs.forEach(function (c) { c.addEventListener('click', function () { abrir(c); }); });
    abrir(cabs[0]); /* la escena nunca empieza en blanco */
    window.addEventListener('resize', function () { var p = el.querySelector('.acordeon-panel:not([hidden])'); if (p) encajarPanel(p); });
  };

  /* Puntos sobre la ilustración aprobada de la escena: círculos numerados sobre los objetos (nunca en las cabezas) y, al
     lado, la leyenda con los rótulos, para que ningún texto tape a los personajes. Las posiciones vienen en
     datos.anclas[imagen] = {r: ancho/alto, p: [[x %, y %], …]}; el lienzo toma la proporción de la imagen para que cada
     punto quede sobre su objeto con cualquier tamaño de iframe. Círculo y rótulo abren el mismo texto; con teclado se
     recorre la leyenda. */
  B.puntos = function (b, k) {
    var img = escena.ilustracion, a = (datos.anclas && datos.anclas[img]) || { r: 1.5, p: [] }, n = b.items.length, circulos = '', leyenda = '';
    b.items.forEach(function (it, i) {
      var p = a.p[i] || [12 + 76 * i / Math.max(1, n - 1), 90], id = k + '-' + i;
      /* datos.puntosSoloLeyenda (SRPA, observación de la Fiscalía del 18/11/2026: el número sobre la ilustración y el cajón de la
         derecha abrían lo mismo): el número solo señala el objeto (no abre nada; se pone en verde cuando su cajón ya se leyó) y
         el texto se abre únicamente desde la leyenda. Sin la opción, como siempre: círculo y rótulo abren el mismo texto. */
      circulos += datos.puntosSoloLeyenda
        ? '<span class="hotspot hotspot-marca" data-id="' + id + '" aria-hidden="true" style="left:' + p[0] + '%;top:' + p[1] + '%;--d:' + (0.25 + i * 0.12) + 's">' +
          '<span class="hotspot-n">' + (i + 1) + '</span></span>'
        : '<button type="button" class="hotspot" data-id="' + id + '" data-i="' + i + '" tabindex="-1" aria-hidden="true" style="left:' + p[0] + '%;top:' + p[1] + '%;--d:' + (0.25 + i * 0.12) + 's">' +
          '<span class="hotspot-n">' + (i + 1) + '</span></button>';
      leyenda += '<li><button type="button" class="punto-leyenda' + refc(it.label) + '" data-id="' + id + '" data-i="' + i + '" style="--d:' + (0.2 + i * 0.08) + 's">' +
        '<span class="hotspot-n">' + (i + 1) + '</span><span class="leyenda-rotulo">' + rot(it.label) + '</span><span class="hotspot-visto">' + visto + '</span>' + estado + '</button></li>';
    });
    /* Inmersiva (Esteban, 01/11/2026: «para que esté en todo el fondo y se sienta como una experiencia inmersiva»): la ilustración,
       con sus puntos, pasa al fondo de toda la escena (B.puntos.activar la lleva a la raíz) y la leyenda flota a la derecha. */
    var inm = !!escena.inmersiva;
    return tituloBloque(b, k) + '<div class="puntos-escena' + (inm ? ' inmersiva' : '') + '"><div class="puntos-marco' + (inm ? ' puntos-fondo' : '') + '">' +
      '<div class="puntos-lienzo" data-r="' + a.r + '"' + (a.c ? ' data-cx="' + a.c + '"' : '') + (a.v ? ' data-cy="' + a.v + '"' : '') + '><img src="' + srcImagen(img) + '" alt="">' +
      circulos + '</div></div><ol class="puntos-leyenda">' + leyenda + '</ol></div>';
  };
  function ajustarLienzo(el) {
    var c = el.querySelector('.puntos-marco') || raiz.querySelector('.puntos-fondo'), l = c && c.querySelector('.puntos-lienzo');
    if (!c || !l || !c.clientWidth || !c.clientHeight) return;
    var r = Number(l.dataset.r) || 1.5;
    if (c.classList.contains('puntos-fondo')) {
      /* Cubre todo el fondo, como «object-fit: cover»: recorta arriba la fracción que trae la ilustración (data-cy; 45 % por omisión: aire para las cabezas y el piso entero) y, si recorta de lado,
         deja a los personajes (data-cx) en el centro. Los puntos son porcentajes del lienzo: siguen sobre sus objetos. */
      var W = c.clientWidth, H = c.clientHeight, w = Math.max(W, H * r), h = w / r, cx = Number(l.dataset.cx) || 0.5;
      l.style.width = w + 'px'; l.style.height = h + 'px';
      l.style.top = ((H - h) * (Number(l.dataset.cy) || 0.45)) + 'px';
      l.style.left = Math.min(0, Math.max(W - w, W / 2 - w * cx)) + 'px';
      /* En pantalla angosta la ilustración va arriba y la leyenda empieza debajo de ella, sin tapar ningún punto. */
      var pe = el.querySelector('.puntos-escena.inmersiva'), esc = raiz.querySelector('.escenario');
      if (pe) pe.style.paddingTop = raiz.clientWidth <= 600
        ? Math.max(0, Math.round(c.getBoundingClientRect().bottom - (pe.getBoundingClientRect().top + (esc ? esc.scrollTop : 0)) + 10)) + 'px' : '';
      return;
    }
    var w0 = Math.min(c.clientWidth - 8, (c.clientHeight - 8) * r);
    l.style.width = w0 + 'px'; l.style.height = (w0 / r) + 'px';
  }
  B.puntos.activar = function (b, k, el) {
    abreLector(el, b);   // antes de mover el fondo: sus puntos conservan el clic
    var fondo = el.querySelector('.puntos-fondo');
    if (fondo) { raiz.insertBefore(fondo, raiz.firstChild); raiz.classList.add('con-fondo'); }
    ajustarLienzo(el);
    if (window.ResizeObserver) new ResizeObserver(function () { ajustarLienzo(el); }).observe(fondo || el.querySelector('.puntos-marco'));
    else window.addEventListener('resize', function () { ajustarLienzo(el); });
  };

  /* Mapa mental: la idea central (título de la escena) y sus ramas a izquierda y derecha, con trazos curvos. */
  B.mental = function (b, k) {
    /* Con 2–3 ramas cada una muestra además el comienzo de su texto, para que el mapa no quede vacío. */
    var n = b.items.length, izq = Math.ceil(n / 2), lineas = '', nodos = '', conTexto = n <= 3;
    b.items.forEach(function (it, i) {
      var der = i >= izq, fila = der ? i - izq : i, filas = der ? n - izq : izq;
      var y = filas === 1 ? 50 : conTexto ? 25 + 50 * fila / (filas - 1) : 13 + 74 * fila / (filas - 1), x = der ? 82 : 18, borde = der ? 66 : 34;
      if (datos.ventanaAmplia && filas === 2 && !conTexto) y = fila ? 72 : 28;   // Terminaciones: sin hueco a media altura (QA)
      lineas += '<path d="M50 50 C ' + (der ? 60 : 40) + ' 50, ' + (der ? 60 : 40) + ' ' + y.toFixed(1) + ', ' + borde + ' ' + y.toFixed(1) + '" style="--d:' + (0.15 + i * 0.1) + 's"/>';
      nodos += '<button type="button" class="rama-mental' + (der ? ' der' : '') + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '" style="left:' + x + '%;top:' + y.toFixed(1) + '%;--d:' + (0.3 + i * 0.1) + 's">' +
        '<span class="rama-arte">' + svgObjeto(it.obj, 40) + '</span><span class="rama-rotulo">' + rot(it.label) + '</span><span class="rama-marca">' + mano + visto + '</span>' +
        (conTexto ? '<span class="rama-extracto">' + esc(may(extracto(segs(it.segs), n <= 2 ? 330 : 130))) + '</span>' : '') + estado + '</button>';
    });
    return '<div class="mental n' + n + (conTexto ? ' con-extracto' : '') + '"><svg class="mental-lineas" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + lineas + '</svg>' +
      /* Sin ilustración al centro y con «objetos_raiz» (Terminaciones, ajuste de Clara y Juan, 18/11/2026: el curso no tiene
         ilustraciones de escena y el centro quedaba vacío en la QA), van los objetos dibujados del tema, como en la raíz del mapa. */
      '<div class="mental-centro' + (!arteEn('centro') && escena.objetos_raiz ? ' con-objetos' : '') + '">' + (arteEn('centro') ? '<img class="mental-arte" src="' + srcImagen(escena.arte.img) + '" alt="">'
        : escena.objetos_raiz ? '<span class="mental-objetos" aria-hidden="true">' + escena.objetos_raiz.map(function (o) { return svgObjeto(o, 92); }).join('') + '</span>'
        : '<i class="fas fa-lightbulb" aria-hidden="true"></i>') +
      (datos.tituloFuera ? '' : '<span>' + esc(may(centroTitulo())) + '</span>') + '</div>' + nodos + '</div>';
  };
  B.mental.activar = function (b, k, el) { abreLector(el, b); };

  /* Mapa conceptual jerárquico: el concepto de la escena arriba y, unidos por conectores, sus elementos debajo. Con
     datos.tituloFuera (Delitos informáticos; Esteban, 29/10/2026: el título de la escena «va en la plantilla de Genially… no
     mezcles más la información»), la raíz no repite ese título: es la ilustración aprobada de la escena, y el título queda en
     Genially, encima o al lado del HTML. */
  /* Mapa conceptual inmersivo (Juan, 08/11/2026: «el css con las nubes y todo… una vaina light, bien pensada»; Esteban: «la variación
     tiene que ser según lo que se esté representando… tiene que ir como avanzando de secciones»). Con «escena.escenario»
     ({bioma, camino}), los nodos son paradas de un camino en un paisaje del tema de la escena, hecho con SVG y CSS. La hora del día
     cambia con el avance de la lección y la última escena trae la meta. Los botones son los del esquema: el lector, las marcas y
     el avance no cambian, y el texto completo sigue en la ventana. Colores en el tema del curso. */
  var CAMINOS = {
    asciende: [[0, 96], [22, 90], [44, 82], [66, 74], [86, 67], [100, 62]],
    meandro: [[0, 86], [18, 92], [38, 72], [58, 90], [78, 70], [100, 84]],
    llano: [[0, 92], [25, 86], [47, 88], [66, 78], [86, 75], [100, 72]]
  };
  function caminoY(forma, x) {
    var p = CAMINOS[forma] || CAMINOS.llano, i = 0;
    while (i < p.length - 2 && x > p[i + 1][0]) i++;
    return p[i][1] + (p[i + 1][1] - p[i][1]) * (x - p[i][0]) / (p[i + 1][0] - p[i][0]);
  }
  function caminoD(forma) {
    var p = (CAMINOS[forma] || CAMINOS.llano).map(function (q) { return [q[0] * 10, q[1] * 4]; }), d = 'M' + p[0][0] + ' ' + p[0][1];
    for (var i = 1; i < p.length; i++) { var mx = (p[i - 1][0] + p[i][0]) / 2; d += ' C' + mx + ' ' + p[i - 1][1] + ' ' + mx + ' ' + p[i][1] + ' ' + p[i][0] + ' ' + p[i][1]; }
    return d;
  }
  function arbolesEscena(lista) {
    return lista.map(function (a) {
      return a[2] === 'p' ? '<g class="esq-pino" transform="translate(' + a[0] + ' ' + a[1] + ')"><rect x="-3" y="-4" width="6" height="22" rx="2"/><path d="M0 -40 L18 -2 L-18 -2 Z"/></g>'
        : '<g class="esq-arbol ' + (a[2] || '') + '" transform="translate(' + a[0] + ' ' + a[1] + ')"><rect x="-3" y="-6" width="6" height="26" rx="2"/><circle cx="0" cy="-16" r="16"/><circle cx="-9" cy="-8" r="10"/><circle cx="9" cy="-8" r="10"/></g>';
    }).join('');
  }
  /* Personas del paisaje (Enfoque diferencial, 10/11/2026: «acordes al contenido… que no sean tan genéricos»): figuras planas sin
     rasgos, con edades, cuerpos y pieles diversos. [x, y, escala, tipo (a adulto, s silla de ruedas, b bastón, h sombrero),
     ropa 1–4, piel 1–3]. */
  function personasEscena(lista) {
    return lista.map(function (p) {
      var t = p[3] || 'a', g = '<g class="esq-per r' + (p[4] || 1) + ' k' + (p[5] || 1) + '" transform="translate(' + p[0] + ' ' + p[1] + ') scale(' + (p[2] || 1) + ')">';
      if (t === 's') g += '<circle class="rueda" cx="3" cy="-11" r="11"/><path class="silla" d="M-8 -26 V-8 H12"/><path class="piernas" d="M4 -24 H15 V-6"/><path class="cuerpo" d="M-10 -22 Q-11 -46 0 -48 Q10 -46 8 -22 Z"/><circle class="cara" cx="0" cy="-57" r="8"/>';
      else {
        g += '<path class="cuerpo" d="M-9 -2 Q-11 -34 0 -36 Q11 -34 9 -2 Z"/><circle class="cara" cx="0" cy="-45" r="8"/>';
        if (t === 'b') g += '<path class="baston" d="M13 0 L15 -32"/>';
        if (t === 'h') g += '<path class="sombrero" d="M-14 -50 H14"/><path class="sombrero copa" d="M-7 -50 Q0 -63 7 -50"/>';
      }
      return g + '</g>';
    }).join('');
  }
  function casitaEscena(x, y, w, h, cl) {
    return '<g class="' + cl + '" transform="translate(' + x + ' ' + y + ')"><rect x="' + (-w / 2) + '" y="' + (-h) + '" width="' + w + '" height="' + h + '"/><path class="techo" d="M' + (-w / 2 - 8) + ' ' + (2 - h) + ' L0 ' + (-h - w * 0.42) + ' L' + (w / 2 + 8) + ' ' + (2 - h) + ' Z"/><rect class="p" x="-7" y="-20" width="14" height="20"/></g>';
  }
  function biomaEnfoque(b) {
    var s = '', i;
    if (b === 'plaza') {
      s = '<g class="esq-kiosco" transform="translate(500 298) scale(1.45)"><rect class="base" x="-62" y="-10" width="124" height="10"/><path class="col" d="M-48 -10 V-72 M-16 -10 V-72 M16 -10 V-72 M48 -10 V-72"/><path class="techo" d="M-70 -70 L0 -112 L70 -70 Z"/></g>';
      [[300, 302], [700, 300]].forEach(function (q) { s += '<g class="esq-banca" transform="translate(' + q[0] + ' ' + q[1] + ')"><path d="M-26 -14 H26 M-22 -14 V0 M22 -14 V0 M-26 -24 H26"/></g>'; });
      s += arbolesEscena([[90, 316], [160, 312, 'b'], [890, 298], [950, 300, 'b']]) +
        personasEscena([[236, 394, 0.85, 'a', 1, 1], [262, 394, 0.56, 'a', 2, 2], [366, 394, 0.85, 'b', 4, 3], [612, 394, 0.85, 's', 3, 2], [760, 394, 0.85, 'a', 2, 3], [810, 394, 0.85, 'a', 3, 1]]);
    } else if (b === 'parque') {
      s = '<g class="esq-escuela" transform="translate(790 300) scale(1.4)"><rect x="-90" y="-82" width="180" height="82"/><path class="techo" d="M-102 -80 L0 -132 L102 -80 Z"/><circle class="reloj" cx="0" cy="-102" r="13"/><path class="aguja" d="M0 -102 V-111 M0 -102 H7"/>';
      for (i = -66; i <= 54; i += 40) s += '<rect class="v" x="' + i + '" y="-64" width="22" height="18"/>';
      s += '<rect class="p" x="-12" y="-34" width="24" height="34"/></g>' +
        '<g class="esq-columpio" transform="translate(300 302) scale(1.3)"><path class="marco" d="M-44 0 L-32 -76 L32 -76 L44 0"/><g class="vaiven"><path class="cuerda" d="M-10 -76 V-26 M10 -76 V-26"/><rect class="asiento" x="-15" y="-27" width="30" height="6" rx="2"/></g></g>' +
        '<g class="esq-tobogan" transform="translate(470 302) scale(1.3)"><path class="escalera" d="M-30 0 V-70 M-14 0 V-70 M-30 -18 H-14 M-30 -36 H-14 M-30 -54 H-14"/><path class="rampa" d="M-14 -70 C10 -70 22 -10 52 0"/></g>' +
        arbolesEscena([[120, 316, 'b'], [180, 312], [620, 304, 'p']]) +
        personasEscena([[350, 394, 0.53, 'a', 2, 1], [420, 394, 0.51, 'a', 1, 3], [560, 394, 0.56, 'a', 3, 2], [590, 394, 0.85, 'b', 4, 1], [660, 394, 0.85, 'a', 2, 2]]);
    } else if (b === 'accesible') {
      s = '<g class="esq-ed2" transform="translate(680 300) scale(1.4)"><rect x="-100" y="-120" width="200" height="120"/>';
      for (i = -80; i <= 60; i += 36) s += '<rect class="v" x="' + i + '" y="-100" width="20" height="22"/><rect class="v" x="' + i + '" y="-66" width="20" height="22"/>';
      s += '<rect class="p" x="54" y="-34" width="28" height="34"/></g>' +
        '<path class="esq-rampa" d="M460 302 L580 268 L580 302 Z"/><path class="esq-baranda" d="M462 288 L580 254 M580 254 V268"/>' +
        '<g class="esq-senal" transform="translate(400 300) scale(1.3)"><path class="poste" d="M0 0 V-84"/><rect x="-18" y="-120" width="36" height="36" rx="5"/><circle class="g" cx="2" cy="-109" r="4"/><path class="g" d="M-4 -102 v12 h12 l4 8"/><path class="g2" d="M-6 -96 a10 10 0 1 0 14 10"/></g>' +
        '<g class="esq-cebra">' + [250, 280, 310, 340].map(function (x) { return '<rect x="' + x + '" y="322" width="18" height="34" rx="2"/>'; }).join('') + '</g>' +
        '<g class="esq-semaforo" transform="translate(880 300) scale(1.3)"><path class="poste" d="M0 0 V-70"/><rect x="-12" y="-112" width="24" height="44" rx="6"/><circle class="l1" cx="0" cy="-100" r="6"/><circle class="l2" cx="0" cy="-82" r="6"/></g>' +
        arbolesEscena([[100, 316], [160, 312, 'b']]) +
        personasEscena([[520, 394, 0.85, 's', 1, 3], [200, 394, 0.85, 'b', 2, 1], [830, 394, 0.85, 'a', 3, 2]]);
    } else if (b === 'vereda') {
      s = '<path class="esq-terraza2 t1" d="M560 250 C680 230 820 236 1000 222 L1000 262 C820 270 690 268 560 282 Z"/><path class="esq-terraza2 t2" d="M600 276 C720 262 850 266 1000 256 L1000 292 C850 300 720 298 600 306 Z"/>';
      for (i = 610; i <= 980; i += 28) s += '<circle class="esq-mata" cx="' + i + '" cy="' + (i % 56 ? 262 : 286) + '" r="7"/>';
      s += '<g class="esq-finca" transform="translate(300 300) scale(1.45)"><rect x="-70" y="-62" width="140" height="62"/><path class="techo" d="M-88 -58 L0 -104 L88 -58 Z"/><path class="corredor" d="M-70 -30 H70 M-50 -30 V0 M0 -30 V0 M50 -30 V0"/><rect class="p" x="-10" y="-28" width="20" height="28"/></g>' +
        '<path class="esq-cerca" d="M400 304 H560 M400 290 H560 M410 284 V310 M450 284 V310 M490 284 V310 M530 284 V310"/>' +
        arbolesEscena([[110, 316, 'b'], [170, 312]]) +
        personasEscena([[460, 394, 0.85, 'h', 3, 3], [196, 394, 0.85, 'a', 2, 2], [222, 394, 0.54, 'a', 1, 1]]) +
        '<path class="esq-azadon" d="M474 394 L467 358 M467 358 l-9 4"/>';
    } else if (b === 'resguardo') {
      s = '<path class="esq-rio" d="M0 352 C160 330 260 346 380 334 C520 320 640 344 820 326 C900 318 960 324 1000 318 L1000 340 C900 346 780 352 640 360 C520 368 300 360 0 372 Z"/>';
      [[300, 300, 1], [690, 296, 1.15]].forEach(function (m) {
        s += '<g class="esq-maloca" transform="translate(' + m[0] + ' ' + m[1] + ') scale(' + m[2] + ')"><rect x="-56" y="-40" width="112" height="40" rx="6"/><path class="techo" d="M-64 -38 L0 -126 L64 -38 Z"/><path class="paja" d="M-30 -40 L0 -120 M30 -40 L0 -120 M0 -40 V-120 M-48 -40 L-6 -116 M48 -40 L6 -116"/><rect class="p" x="-10" y="-28" width="20" height="28"/></g>';
      });
      s += '<g class="esq-fogon" transform="translate(500 304)"><path class="piedra" d="M-18 0 a8 6 0 0 1 12 0 M-4 0 a8 6 0 0 1 12 0 M10 0 a8 6 0 0 1 12 0"/><path class="llama" d="M2 -4 C-14 -18 -2 -30 2 -44 C8 -30 18 -20 2 -4 Z"/><path class="llama l2" d="M2 -6 C-4 -14 0 -22 2 -28 C6 -22 8 -14 2 -6 Z"/></g>' +
        arbolesEscena([[90, 316, 'p'], [150, 312], [880, 298, 'b'], [950, 300, 'p']]) +
        personasEscena([[410, 394, 0.85, 'b', 2, 3], [560, 394, 0.54, 'a', 3, 2], [590, 394, 0.85, 'a', 4, 3], [800, 394, 0.85, 'a', 1, 2]]);
    } else if (b === 'palafito') {
      s = '<path class="esq-agua" d="M0 322 C200 306 400 334 600 316 C780 300 900 314 1000 306 L1000 400 L0 400 Z"/>';
      [[230, 300, 'c1'], [420, 290, 'c2'], [790, 284, 'c3']].forEach(function (c) {
        s += '<g class="esq-palafito ' + c[2] + '" transform="translate(' + c[0] + ' ' + c[1] + ')"><path class="pilote" d="M-36 0 V34 M-12 0 V36 M12 0 V36 M36 0 V34"/><rect x="-44" y="-50" width="88" height="50"/><path class="techo" d="M-54 -48 L0 -88 L54 -48 Z"/><rect class="p" x="-9" y="-30" width="18" height="30"/><path class="pilote" d="M-44 0 H44"/></g>';
      });
      [[110, 300], [600, 296], [940, 290]].forEach(function (q) {
        s += '<g class="esq-palma" transform="translate(' + q[0] + ' ' + q[1] + ')"><path class="tallo" d="M0 0 C-4 -40 6 -80 0 -110"/><path class="hoja" d="M0 -110 C-30 -116 -50 -100 -60 -86 C-36 -98 -18 -102 0 -108 Z M0 -110 C30 -116 50 -100 60 -86 C36 -98 18 -102 0 -108 Z M0 -110 C-16 -132 -36 -136 -46 -132 C-26 -126 -12 -120 0 -110 Z M0 -110 C16 -132 36 -136 46 -132 C26 -126 12 -120 0 -110 Z"/></g>';
      });
      s += '<g class="esq-potrillo"><path d="M540 384 h96 l-14 13 h-68 Z"/><path class="remo" d="M606 382 L630 352"/>' + personasEscena([[590, 386, 0.72, 'a', 2, 3]]) + '</g>';
    } else if (b === 'ruta') {
      s = casitaEscena(140, 304, 92, 70, 'esq-casa2') +
        '<g class="esq-hospital" transform="translate(400 302) scale(1.5)"><rect x="-70" y="-96" width="140" height="96"/><rect class="cruz" x="-7" y="-84" width="14" height="38"/><rect class="cruz" x="-19" y="-72" width="38" height="14"/><rect class="p" x="-14" y="-32" width="28" height="32"/></g>' +
        '<g class="esq-justicia" transform="translate(690 300) scale(1.4)"><rect x="-90" y="-100" width="180" height="100"/><path class="techo" d="M-100 -98 L0 -138 L100 -98 Z"/><circle class="escudo" cx="0" cy="-116" r="10"/>';
      for (i = -66; i <= 66; i += 33) s += '<rect class="v" x="' + (i - 6) + '" y="-82" width="12" height="44"/>';
      s += '<rect class="p" x="-14" y="-34" width="28" height="34"/></g>';
      [[260, 304], [540, 302], [870, 298]].forEach(function (q) { s += '<g class="esq-senal2" transform="translate(' + q[0] + ' ' + q[1] + ')"><path class="poste" d="M0 0 V-62"/><path class="flecha" d="M-4 -72 H26 L36 -62 L26 -52 H-4 Z"/></g>'; });
      s += arbolesEscena([[60, 318, 'b'], [940, 298]]) +
        personasEscena([[300, 394, 0.85, 'a', 2, 2], [326, 394, 0.85, 'a', 1, 3], [600, 394, 0.85, 'a', 3, 1], [810, 394, 0.85, 'b', 4, 3]]);
    } else return null;
    return s;
  }
  /* Justicia restaurativa en la práctica del fiscal (JP, 10/11/2026: «el escenario del paisaje ese solo aplica para ambiental»; en
     los demás cursos, oficina o ciudad). Escenarios propios, que solo usa ese curso (producir_restaurativa.py, BIOMAS): interiores
     (despacho, sala de diálogo con su círculo de sillas, sala de audiencias) con pared, ventanal y piso; exteriores (sede de la
     Fiscalía, barrio, centro de la ciudad) con edificios, andén y calle. Sin martillo ni balanza. Colores: tema-curso.css del curso. */
  var JR_INTERIOR = { despacho: 1, sala: 1, audiencia: 1 }, JR_CALLE = { fiscalia: 1, barrio: 1, centro: 1 };
  function jrEdificio(x, w, h, cl, cols, filas, puerta) {
    var g = '<g class="jr-edificio ' + cl + '"><rect x="' + x + '" y="' + (300 - h) + '" width="' + w + '" height="' + h + '"/>', i, j;
    var pw = (w - 16) / cols, ph = (h - (puerta ? 46 : 18)) / filas;
    for (i = 0; i < cols; i++) for (j = 0; j < filas; j++)
      g += '<rect class="v" x="' + (x + 8 + i * pw + pw * 0.18).toFixed(1) + '" y="' + (300 - h + 10 + j * ph).toFixed(1) + '" width="' + (pw * 0.64).toFixed(1) + '" height="' + (ph * 0.6).toFixed(1) + '"/>';
    if (puerta) g += '<rect class="p" x="' + (x + w / 2 - 11) + '" y="266" width="22" height="34"/>';
    return g + '</g>';
  }
  function jrSilla(x, y, cl) {
    return '<g class="jr-silla ' + (cl || '') + '" transform="translate(' + x + ' ' + y + ')"><path class="pata" d="M-9 0 V-16 M9 0 V-16"/><rect class="asiento" x="-12" y="-21" width="24" height="6" rx="2"/><rect class="espaldar" x="-11" y="-44" width="22" height="21" rx="4"/></g>';
  }
  function jrPlanta(x, y) {
    return '<g class="jr-planta" transform="translate(' + x + ' ' + y + ')"><path class="hoja" d="M0 -18 C-20 -34 -22 -58 -8 -70 C-2 -52 2 -38 0 -18 Z M0 -18 C20 -30 26 -52 16 -66 C6 -50 2 -36 0 -18 Z M0 -18 C-4 -44 2 -70 4 -82 C10 -62 8 -40 0 -18 Z"/><path class="matera" d="M-12 -20 H12 L8 0 H-8 Z"/></g>';
  }
  function fondoRestaurativa(b) {
    var s = '', i;
    if (JR_INTERIOR[b]) {
      s = '<rect class="jr-pared" x="0" y="0" width="1000" height="296"/><rect class="jr-zocalo" x="0" y="290" width="1000" height="10"/><rect class="jr-piso" x="0" y="300" width="1000" height="100"/>';
      for (i = 60; i < 1000; i += 120) s += '<path class="jr-junta" d="M' + i + ' 300 L' + (i - 40) + ' 400"/>';
      return s;
    }
    if (JR_CALLE[b]) {
      s = '<path class="jr-lejos" d="M0 300 V214 h40 v-34 h36 v52 h30 v-70 h44 v40 h34 v-26 h30 v50 h42 v-62 h38 v36 h46 v-48 h34 v70 h40 v-40 h44 v28 h36 v-58 h40 v44 h38 v-30 h42 v52 h34 v-66 h38 v48 h44 v-34 h36 v60 h30 V300 Z"/>' +
        '<rect class="jr-anden" x="0" y="300" width="1000" height="24"/><rect class="jr-calle" x="0" y="324" width="1000" height="76"/>';
      return s;
    }
    return null;
  }
  function biomaRestaurativa(b) {
    var s = '', i;
    if (b === 'fiscalia') {
      s = '<g class="jr-sede"><rect class="ala" x="250" y="176" width="500" height="124"/><rect class="cuerpo" x="360" y="120" width="280" height="180"/><rect class="cornisa" x="350" y="112" width="300" height="12"/>';
      for (i = 0; i < 5; i++) s += '<rect class="columna" x="' + (382 + i * 54) + '" y="150" width="14" height="118"/>';
      for (i = 0; i < 4; i++) s += '<rect class="v" x="' + (268 + i * 23) + '" y="196" width="14" height="26"/><rect class="v" x="' + (268 + i * 23) + '" y="240" width="14" height="26"/><rect class="v" x="' + (662 + i * 23) + '" y="196" width="14" height="26"/><rect class="v" x="' + (662 + i * 23) + '" y="240" width="14" height="26"/>';
      s += '<rect class="p" x="478" y="232" width="44" height="68"/><path class="escalon" d="M344 300 H656 V290 H360 V280 H640 V270 H376"/><path class="mastil" d="M500 112 V62"/><path class="bandera" d="M500 62 l36 9 l-36 9 Z"/></g>';
      [[200, 300], [800, 300]].forEach(function (q) { s += '<g class="jr-farol" transform="translate(' + q[0] + ' ' + q[1] + ')"><path class="poste" d="M0 0 V-78"/><circle class="luz" cx="0" cy="-84" r="8"/></g>'; });
      s += arbolesEscena([[90, 300], [150, 300, 'b'], [870, 300, 'b'], [940, 300]]) +
        personasEscena([[300, 394, 0.85, 'a', 1, 2], [326, 394, 0.85, 'a', 2, 1], [560, 394, 0.85, 'a', 3, 3], [712, 394, 0.85, 's', 4, 1], [760, 394, 0.85, 'b', 2, 2]]);
    } else if (b === 'barrio') {
      s = jrEdificio(60, 110, 96, 'c1', 3, 2, true) + jrEdificio(182, 96, 150, 'c2', 3, 4, true) + jrEdificio(700, 104, 128, 'c3', 3, 3, true) + jrEdificio(820, 120, 90, 'c1', 3, 2, true) +
        '<g class="jr-tienda"><rect x="300" y="218" width="150" height="82"/><path class="toldo" d="M292 218 H458 L446 244 H304 Z"/><rect class="vitrina" x="316" y="254" width="62" height="34"/><rect class="p" x="400" y="252" width="26" height="48"/></g>' +
        '<g class="jr-cancha"><path class="arco" d="M520 300 V246 H600 V300"/><path class="malla" d="M520 264 H600 M520 282 H600 M540 246 V300 M560 246 V300 M580 246 V300"/></g>' +
        '<g class="jr-banca" transform="translate(640 300)"><path d="M-26 -14 H26 M-22 -14 V0 M22 -14 V0 M-26 -26 H26"/></g>' +
        arbolesEscena([[486, 300, 'b'], [676, 300]]) +
        personasEscena([[236, 394, 0.85, 'a', 1, 1], [262, 394, 0.55, 'a', 2, 2], [430, 394, 0.85, 'b', 4, 3], [560, 394, 0.55, 'a', 3, 1], [590, 394, 0.85, 'a', 2, 3], [800, 394, 0.85, 's', 1, 2]]);
    } else if (b === 'centro') {
      s = jrEdificio(70, 90, 170, 'c2', 3, 5) + jrEdificio(170, 120, 230, 'c1', 4, 7, true) + jrEdificio(300, 86, 140, 'c3', 3, 4) + jrEdificio(640, 110, 200, 'c3', 4, 6, true) + jrEdificio(760, 96, 150, 'c2', 3, 4) + jrEdificio(864, 90, 110, 'c1', 3, 3) +
        '<g class="jr-paradero"><path class="techo" d="M430 232 H590"/><path class="poste" d="M444 232 V300 M576 232 V300"/><rect class="vidrio" x="452" y="242" width="116" height="42"/><path class="banco" d="M462 290 H558"/></g>' +
        '<g class="jr-semaforo" transform="translate(620 300)"><path class="poste" d="M0 0 V-70"/><rect x="-11" y="-112" width="22" height="44" rx="6"/><circle class="l1" cx="0" cy="-100" r="6"/><circle class="l2" cx="0" cy="-82" r="6"/></g>' +
        '<g class="jr-cebra">' + [250, 280, 310, 340].map(function (x) { return '<rect x="' + x + '" y="330" width="18" height="34" rx="2"/>'; }).join('') + '</g>' +
        personasEscena([[470, 394, 0.85, 'a', 1, 3], [500, 394, 0.85, 'a', 2, 1], [540, 394, 0.85, 'b', 3, 2], [700, 394, 0.85, 'a', 4, 1], [880, 394, 0.85, 's', 2, 3]]);
    } else if (b === 'despacho') {
      s = '<g class="jr-ventanal"><rect class="marco" x="70" y="46" width="230" height="140" rx="4"/><path class="ciudad" d="M74 182 V150 h28 v-26 h24 v40 h28 v-56 h32 v36 h26 v-20 h30 v32 h24 v-44 h30 V182 Z"/><path class="cruz" d="M185 46 V186 M70 116 H300"/></g>' +
        '<g class="jr-estante"><rect x="700" y="70" width="210" height="226"/><path class="tabla" d="M700 126 H910 M700 182 H910 M700 238 H910"/>';
      for (i = 0; i < 9; i++) s += '<rect class="az a' + (i % 3) + '" x="' + (712 + i * 21) + '" y="' + (84 + (i % 2) * 4) + '" width="15" height="' + (40 - (i % 2) * 4) + '"/><rect class="az a' + ((i + 1) % 3) + '" x="' + (712 + i * 21) + '" y="' + (140 + ((i + 1) % 2) * 5) + '" width="15" height="' + (40 - ((i + 1) % 2) * 5) + '"/>';
      s += '<rect class="caja" x="716" y="196" width="60" height="40"/><rect class="caja" x="790" y="204" width="50" height="32"/><rect class="caja" x="716" y="252" width="84" height="42"/></g>' +
        '<g class="jr-escritorio"><rect class="tapa" x="360" y="232" width="260" height="12" rx="3"/><path class="pata" d="M374 244 V300 M606 244 V300"/><rect class="cajon" x="540" y="244" width="66" height="40"/><rect class="pantalla" x="440" y="176" width="92" height="50" rx="4"/><path class="pie" d="M486 226 V232 M466 232 H506"/><rect class="papel" x="384" y="222" width="40" height="10"/></g>' +
        jrSilla(490, 300, 'giratoria') + jrSilla(330, 300) + jrSilla(650, 300) + jrPlanta(626, 300) +
        '<g class="jr-reloj"><circle cx="560" cy="86" r="22"/><path d="M560 86 V72 M560 86 H570"/></g>' +
        personasEscena([[300, 394, 0.85, 'a', 2, 2], [460, 394, 0.85, 'a', 1, 1], [680, 394, 0.85, 'a', 3, 3]]);
    } else if (b === 'sala') {
      s = '<g class="jr-ventanal"><rect class="marco" x="60" y="46" width="200" height="140" rx="4"/><path class="ciudad" d="M64 182 V152 h26 v-24 h22 v36 h26 v-50 h30 v34 h24 v-18 h28 v30 h20 v-40 h20 V182 Z"/><path class="cruz" d="M160 46 V186 M60 116 H260"/></g>' +
        '<g class="jr-tablero"><rect x="720" y="56" width="190" height="120" rx="4"/><path class="trazo" d="M740 84 H860 M740 106 H890 M740 128 H840 M740 150 H876"/><path class="pata" d="M760 176 L744 296 M870 176 L886 296"/></g>' +
        '<ellipse class="jr-tapete" cx="500" cy="330" rx="230" ry="44"/>';
      [[300, 318], [372, 300], [456, 292], [544, 292], [628, 300], [700, 318]].forEach(function (q, k) { s += jrSilla(q[0], q[1], 'c' + (k % 3)); });
      s += jrPlanta(310, 300) + '<g class="jr-mesita"><ellipse cx="500" cy="322" rx="34" ry="9"/><path d="M500 331 V352"/><circle class="objeto" cx="500" cy="316" r="6"/></g>' +
        personasEscena([[262, 394, 0.85, 'a', 1, 3], [404, 394, 0.85, 'a', 2, 1], [596, 394, 0.85, 'b', 4, 2], [742, 394, 0.85, 's', 3, 1]]);
    } else if (b === 'audiencia') {
      s = '<g class="jr-estrado"><rect class="panel" x="340" y="70" width="320" height="130" rx="6"/><circle class="escudo" cx="500" cy="118" r="26"/><rect class="tarima" x="300" y="268" width="400" height="32"/><rect class="mesa" x="340" y="214" width="320" height="56" rx="4"/><rect class="frente" x="356" y="226" width="288" height="32" rx="3"/></g>' +
        jrSilla(500, 222, 'alta') +
        [[250, 300], [750, 300]].map(function (q, k) { return '<g class="jr-asta" transform="translate(' + q[0] + ' ' + q[1] + ')"><path class="palo" d="M0 0 V-190"/><path class="tela t' + k + '" d="M0 -190 C22 -184 36 -176 40 -150 C38 -120 20 -116 0 -110 Z"/><ellipse class="base" cx="0" cy="0" rx="16" ry="5"/></g>'; }).join('') +
        '<g class="jr-mesa-parte"><rect x="120" y="262" width="150" height="10" rx="3"/><path d="M134 272 V300 M256 272 V300"/></g><g class="jr-mesa-parte"><rect x="730" y="262" width="150" height="10" rx="3"/><path d="M744 272 V300 M866 272 V300"/></g>' +
        jrSilla(160, 300) + jrSilla(230, 300) + jrSilla(770, 300) + jrSilla(840, 300) +
        '<path class="jr-baranda" d="M60 352 H940 M60 352 V330 M940 352 V330 M280 352 V330 M500 352 V330 M720 352 V330"/>' +
        personasEscena([[196, 394, 0.85, 'a', 1, 1], [420, 394, 0.85, 'a', 2, 3], [580, 394, 0.85, 'b', 3, 2], [806, 394, 0.85, 'a', 4, 1]]);
    } else return null;
    return s;
  }
  function biomaEscena(b) {
    var y, s = biomaEnfoque(b);
    if (s === null) s = biomaRestaurativa(b);
    if (s !== null) return '<g class="esq-bioma">' + s + '</g>';
    s = '';
    if (b === 'tala') {
      s = arbolesEscena([[60, 318], [96, 322, 'p'], [138, 314, 'b'], [182, 318, 'p'], [390, 306], [428, 304, 'p']]);
      [[620, 300], [680, 310], [740, 296], [800, 306], [860, 298], [930, 304]].forEach(function (q) { s += '<g class="esq-tocon" transform="translate(' + q[0] + ' ' + q[1] + ')"><path d="M-9 0 L-7 -12 L7 -12 L9 0 Z"/><ellipse cx="0" cy="-12" rx="7" ry="2.6"/></g>'; });
      s += '<path class="esq-tronco" d="M640 322 l46 -7M760 326 l42 -9"/>';
    } else if (b === 'rio') {
      s = '<path class="esq-rio" d="M250 400 C330 372 270 356 390 338 C520 320 640 330 760 312 L860 312 C700 344 600 340 510 352 C410 366 490 384 450 400 Z"/>' + arbolesEscena([[70, 316], [120, 322, 'p'], [180, 314, 'b'], [860, 304], [920, 300, 'p'], [965, 298, 'b']]) +
        '<g class="esq-barca"><path d="M560 334 h62 l-11 13 h-40 Z"/><path d="M590 334 v-24 l18 18 h-18"/></g>';
    } else if (b === 'mina') {
      s = '<path class="esq-terraza t1" d="M520 300 L980 296 L1000 400 L470 400 Z"/><path class="esq-terraza t2" d="M580 322 L930 318 L950 400 L540 400 Z"/><path class="esq-terraza t3" d="M650 346 L860 342 L880 400 L620 400 Z"/>' +
        '<path class="esq-pila" d="M380 318 L440 262 L500 318 Z"/><g class="esq-draga"><rect x="700" y="262" width="66" height="30" rx="4"/><path d="M766 270 L826 226 L846 250" fill="none"/><circle cx="716" cy="298" r="9"/><circle cx="750" cy="298" r="9"/></g>' +
        arbolesEscena([[80, 316], [130, 322, 'p'], [230, 314, 'b']]);
    } else if (b === 'ciudad') {
      [[300, 180, 60], [366, 150, 48], [420, 196, 70], [496, 130, 56], [558, 174, 62], [626, 156, 50], [682, 200, 66]].forEach(function (e) {
        s += '<rect class="esq-edificio" x="' + e[0] + '" y="' + e[1] + '" width="' + e[2] + '" height="' + (300 - e[1]) + '"/>';
        for (y = e[1] + 12; y < 270; y += 22) s += '<path class="esq-ventana" d="M' + (e[0] + 10) + ' ' + y + ' h' + (e[2] - 20) + '"/>';
      });
      s += '<rect class="esq-chimenea" x="780" y="150" width="20" height="150"/><rect class="esq-chimenea" x="820" y="178" width="18" height="122"/>' +
        '<g class="esq-humo"><circle cx="790" cy="130" r="14"/><circle cx="812" cy="108" r="19"/><circle cx="842" cy="86" r="24"/></g>' + arbolesEscena([[90, 318], [160, 314, 'p']]);
    } else if (b === 'norma') {
      s = '<path class="esq-frontis" d="M380 186 L500 136 L620 186 Z"/><rect class="esq-friso" x="392" y="186" width="216" height="14"/>';
      for (y = 406; y <= 582; y += 44) s += '<rect class="esq-columna" x="' + y + '" y="200" width="16" height="88"/>';
      s += '<rect class="esq-friso" x="380" y="288" width="240" height="14"/><path class="esq-mastil" d="M500 136 v-44"/><path class="esq-bandera" d="M500 92 l34 10 l-34 10 Z"/>' + arbolesEscena([[120, 318], [200, 312, 'p'], [760, 304], [840, 300, 'b'], [920, 300, 'p']]);
    } else if (b === 'comunidad') {
      [[260, 294], [360, 286], [640, 288], [742, 296]].forEach(function (c) { s += '<g class="esq-casa" transform="translate(' + c[0] + ' ' + c[1] + ')"><rect x="-26" y="-34" width="52" height="34"/><path d="M-34 -32 L0 -60 L34 -32 Z"/><rect class="p" x="-7" y="-20" width="14" height="20"/></g>'; });
      s += '<g class="esq-molino" transform="translate(500 286)"><path class="poste" d="M0 0 V-96"/><g class="aspas"><path d="M0 -96 L-6 -146 L6 -146 Z"/><path d="M0 -96 L-6 -146 L6 -146 Z" transform="rotate(120 0 -96)"/><path d="M0 -96 L-6 -146 L6 -146 Z" transform="rotate(240 0 -96)"/></g></g>' + arbolesEscena([[90, 318, 'b'], [150, 314], [880, 300], [950, 298, 'p']]);
    } else if (b === 'campo') {
      s = '<g class="esq-carpa"><path d="M330 300 L420 214 L510 300 Z"/><path class="p" d="M420 214 L392 300 H448 Z"/></g>';
      [[600, 306], [670, 296], [740, 308], [820, 298]].forEach(function (c) { s += '<g class="esq-testigo" transform="translate(' + c[0] + ' ' + c[1] + ')"><path d="M0 0 V-34"/><path class="f" d="M0 -34 L22 -27 L0 -20 Z"/></g>'; });
      s += '<g class="esq-lupa"><circle cx="0" cy="0" r="26"/><path d="M18 19 L42 44"/></g>' + arbolesEscena([[90, 316, 'p'], [150, 318], [920, 298, 'b'], [965, 300, 'p']]);
    } else {
      [[230, 246], [420, 226], [640, 232], [820, 220]].forEach(function (c) { s += '<path class="esq-nieve" d="M' + (c[0] - 34) + ' ' + (c[1] + 16) + ' L' + c[0] + ' ' + (c[1] - 40) + ' L' + (c[0] + 34) + ' ' + (c[1] + 16) + ' L' + (c[0] + 12) + ' ' + (c[1] + 4) + ' L' + c[0] + ' ' + (c[1] + 18) + ' L' + (c[0] - 14) + ' ' + (c[1] + 4) + ' Z"/>'; });
      s += arbolesEscena([[60, 320, 'p'], [104, 316, 'p'], [320, 306, 'p'], [372, 304, 'b'], [560, 300, 'p'], [900, 296, 'p'], [950, 296, 'b']]);
    }
    return '<g class="esq-bioma">' + s + '</g>';
  }
  function paisajeEscena(e) {
    var n = datos.scenes.length, pos = n > 1 ? actual / (n - 1) : 0, hora = Math.min(3, Math.floor(pos * 4));
    var sx = Math.round(120 + 760 * pos), sy = Math.round(120 - 76 * Math.sin(Math.PI * pos));
    var fondoJR = fondoRestaurativa(e.bioma), interior = !!JR_INTERIOR[e.bioma];
    var meta = actual === n - 1 ? '<g class="esq-meta"><path d="M968 270 V196"/><path class="f" d="M968 196 L1000 208 L968 220 Z"/></g>' : '';
    if (fondoJR !== null) return '<svg class="esq-paisaje jr-esc ' + (interior ? 'jr-interior' : 'jr-calle') + ' b-' + e.bioma + ' h-' + hora + '" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<rect class="esq-cielo" width="1000" height="400"/>' +
      (interior ? '' : '<circle class="esq-halo" cx="' + sx + '" cy="' + sy + '" r="84"/><circle class="esq-sol" cx="' + sx + '" cy="' + sy + '" r="32"/>' +
        '<g class="esq-nube n1"><ellipse cx="170" cy="62" rx="44" ry="14"/><ellipse cx="200" cy="52" rx="28" ry="16"/></g>' +
        '<g class="esq-nube n2"><ellipse cx="560" cy="46" rx="38" ry="12"/><ellipse cx="585" cy="38" rx="22" ry="13"/></g>') +
      fondoJR + biomaEscena(e.bioma) + meta + '<path class="esq-camino" d="' + caminoD(e.camino) + '"/></svg>';
    return '<svg class="esq-paisaje b-' + e.bioma + ' h-' + hora + '" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<rect class="esq-cielo" width="1000" height="400"/>' +
      '<circle class="esq-halo" cx="' + sx + '" cy="' + sy + '" r="84"/><circle class="esq-sol" cx="' + sx + '" cy="' + sy + '" r="32"/>' +
      '<g class="esq-nube n1"><ellipse cx="170" cy="62" rx="44" ry="14"/><ellipse cx="200" cy="52" rx="28" ry="16"/></g>' +
      '<g class="esq-nube n2"><ellipse cx="560" cy="46" rx="38" ry="12"/><ellipse cx="585" cy="38" rx="22" ry="13"/></g>' +
      '<path class="esq-ave a1" d="M640 104 q7 -7 14 0 q7 -7 14 0"/><path class="esq-ave a2" d="M676 124 q5 -5 10 0 q5 -5 10 0"/>' +
      '<path class="esq-monte m1" d="M0 250 L120 170 L230 220 L340 150 L470 215 L590 160 L720 210 L850 150 L1000 205 L1000 400 L0 400 Z"/>' +
      '<path class="esq-monte m2" d="M0 282 C120 240 220 262 330 240 C450 216 560 260 690 236 C800 216 900 238 1000 226 L1000 400 L0 400 Z"/>' +
      '<path class="esq-suelo s1" d="M0 318 C140 284 260 300 380 290 C520 278 640 300 780 286 C880 276 950 282 1000 278 L1000 400 L0 400 Z"/>' +
      '<path class="esq-suelo s2" d="M0 350 C160 322 300 336 460 330 C620 324 760 344 1000 322 L1000 400 L0 400 Z"/>' +
      biomaEscena(e.bioma) + meta + '<path class="esq-camino" d="' + caminoD(e.camino) + '"/></svg>';
  }
  function esquemaEscenario(b, k) {
    var n = b.items.length, m = n <= 2 ? 21 : n === 3 ? 16 : 11.5, forma = escena.escenario.camino;
    var lamina = n === 2 && datos.ilustraciones && escena.ilustracion ? '<span class="esq-lamina" aria-hidden="true"><img src="' + srcImagen(escena.ilustracion) + '" alt=""></span>' : '';
    return '<div class="esquema esq-esc n' + n + '">' + paisajeEscena(escena.escenario) + lamina + '<div class="esquema-hijos">' + b.items.map(function (it, i) {
      var x = n === 1 ? 50 : m + i * (100 - 2 * m) / (n - 1);
      return '<button type="button" class="nodo-esquema esq-parada' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '" style="--d:' + (0.25 + i * 0.12) + 's;--x:' + x.toFixed(2) + '%;--y:' + caminoY(forma, x).toFixed(2) + '%">' +
        '<span class="esq-tarjeta"><span class="esquema-arte">' + svgObjeto(it.obj, 46) + '</span><span class="esquema-rotulo">' + rot(it.label) + '</span>' +
        '<span class="esquema-extracto">' + esc(may(extracto(segs(it.segs), 60))) + '</span>' +
        '<span class="esquema-marca"><span class="marca-ver">' + mano + ' Explorar</span><span class="marca-falta"><i class="fas fa-book-open" aria-hidden="true"></i> Falta leer</span>' +
        '<span class="marca-leida">' + visto + ' +10</span></span></span><span class="esq-pin" aria-hidden="true"><b>' + (i + 1) + '</b></span>' +
        '<span class="esq-clic" aria-hidden="true"><i class="fas fa-hand-pointer"></i> Clic aquí</span></button>';
    }).join('') + '<span class="esq-yo" aria-hidden="true"><svg viewBox="0 0 30 44"><circle cx="15" cy="9" r="7"/><path d="M6 22 Q15 13 24 22 L22 34 H8 Z"/><path class="pierna" d="M11 34 V43 M19 34 V43"/></svg></span></div></div>';
  }
  /* El caminante está en la siguiente parada por leer; al leerla avanza a la otra. Esa parada lleva además «Clic aquí»
     (revisión de la Fiscalía, 13/11/2026; Jennifer: «una señalización pequeñita de dónde debe hacer el clic para que no entienda
     que esto es una escalera, sino que le permite desplegar acá y seguir leyendo»); cuando todas están leídas, ninguna. */
  function moverCaminante(el) {
    var pend = el.querySelector('.esq-parada:not(.visto)');
    var yo = el.querySelector('.esq-yo'), sig = pend || [].slice.call(el.querySelectorAll('.esq-parada')).pop();
    if (yo && sig) { yo.style.setProperty('--x', sig.style.getPropertyValue('--x')); yo.style.setProperty('--y', sig.style.getPropertyValue('--y')); }
    el.querySelectorAll('.esq-parada').forEach(function (p) { p.classList.toggle('esq-sig', p === pend); });
  }
  B.esquema = function (b, k) {
    if (escena.escenario) return esquemaEscenario(b, k);
    var n = b.items.length, xs = b.items.map(function (_, i) { return (i + 0.5) * 100 / n; });
    var arte = !!(datos.tituloFuera && datos.ilustraciones && escena.ilustracion);
    /* Sin ilustración aprobada del tema (SRPA: solo cinco), la raíz es el objeto dibujado del tema («objeto_raiz»), no el
       título: el título ya está en la barra de Genially (Esteban, 29/10/2026: «no mezcles más la información»). */
    var objeto = !arte && datos.tituloFuera && escena.objeto_raiz, y = arte || objeto ? [31, 36, 41] : [21, 31, 40];
    if (datos.ventanaAmplia && !arte && !objeto) y = [14, 22, 30];   // Terminaciones (Juan, 18/11/2026): más alto para las ramas
    var lineas = '<line x1="50" y1="' + y[0] + '" x2="50" y2="' + y[1] + '"/>' + (n > 1 ? '<line x1="' + xs[0] + '" y1="' + y[1] + '" x2="' + xs[n - 1] + '" y2="' + y[1] + '"/>' : '') +
      xs.map(function (x) { return '<line x1="' + x + '" y1="' + y[1] + '" x2="' + x + '" y2="' + y[2] + '"/>'; }).join('');
    var cabeza = arte ? '<div class="esquema-raiz con-arte" aria-hidden="true"><img src="' + srcImagen(escena.ilustracion) + '" alt=""></div>'
      /* Con «objetos_raiz» (Derechos humanos, 31/10/2026: sin ilustraciones todavía), tres objetos del tema repartidos en la
         raíz: uno solo dejaba vacía la franja de arriba en el marco de 1000 px (hueco de la QA). */
      : objeto ? '<div class="esquema-raiz con-arte con-objeto' + (escena.objetos_raiz ? ' varios' : '') + '" aria-hidden="true">' +
        (escena.objetos_raiz || [escena.objeto_raiz]).map(function (o) { return svgObjeto(o, 120); }).join('') + '</div>'
      : '<div class="esquema-raiz"><span>' + esc(may(centroTitulo())) + '</span></div>';
    return '<div class="esquema n' + n + '"><svg class="esquema-lineas" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + lineas + '</svg>' +
      cabeza + '<div class="esquema-hijos">' + b.items.map(function (it, i) {
        return '<button type="button" class="nodo-esquema' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '" style="--d:' + (0.3 + i * 0.08) + 's">' +
          '<span class="esquema-arte">' + svgObjeto(it.obj, 46) + '</span><span class="esquema-rotulo">' + rot(it.label) + '</span>' +
          '<span class="esquema-extracto">' + esc(may(extracto(segs(it.segs), n <= 2 ? 330 : n <= 3 ? 170 : 105))) + '</span>' +
          '<span class="esquema-marca"><span class="marca-ver">' + mano + ' Ver más</span><span class="marca-falta"><i class="fas fa-book-open" aria-hidden="true"></i> Falta leer</span>' +
          '<span class="marca-leida">' + visto + ' Leída</span></span></button>';
      }).join('') + '</div></div>';
  };
  B.esquema.activar = function (b, k, el) { abreLector(el, b); if (escena.escenario) { moverCaminante(el); el.addEventListener('ova-visto', function () { moverCaminante(el); }); } };

  /* ---------- Familias de la segunda pasada (SRPA, 30/10/2026) ----------
     Conservan el recorrido de Juan (entrada breve, exploración, texto íntegro en la ventana, visto y avance) y cambian la acción
     según lo que la ficha permite hacer con su información. Cada rótulo, papel, conexión, requisito o consecuencia es una frase
     literal de la ficha (el generador lo comprueba) y cada elemento abre su texto completo en el lector. */

  /* Red de instituciones: la norma al centro y, alrededor, las instituciones que la ficha nombra con la referencia que les da
     («el numeral 5°»). Al leer cada una, su enlace se completa y aparece en la red el papel que la ficha le asigna («la dirección
     de las investigaciones»): al terminar queda a la vista quién integra el sistema y qué hace cada uno. */
  B.red = function (b, k) {
    var n = b.items.length, izq = Math.ceil(n / 2), lineas = '', nodos = '';
    b.items.forEach(function (it, i) {
      var der = i >= izq, fila = der ? i - izq : i, filas = der ? n - izq : izq;
      var y = filas === 1 ? 50 : 22 + 56 * fila / (filas - 1), x = der ? 82 : 18, borde = der ? 66 : 34;
      lineas += '<path data-id="' + k + '-' + i + '" d="M50 50 C ' + (der ? 58 : 42) + ' 50, ' + (der ? 58 : 42) + ' ' + y.toFixed(1) + ', ' + borde + ' ' + y.toFixed(1) + '"/>';
      nodos += '<button type="button" class="red-nodo' + (der ? ' der' : '') + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '" style="left:' + x + '%;top:' + y.toFixed(1) + '%;--d:' + (0.2 + i * 0.1) + 's">' +
        '<span class="red-cab"><span class="red-arte">' + svgObjeto(it.obj, 34) + '</span><span class="red-rotulo">' + rot(it.label) + '</span><span class="red-marca">' + mano + visto + '</span></span>' + estado +
        (it.norma ? '<span class="red-norma">' + esc(may(it.norma)) + '</span>' : '') +
        (it.papel ? '<span class="red-papel"><span class="red-pista">Ábrala para completar la red</span><span class="red-revela">' + esc(may(it.papel)) + '</span></span>' : '') + '</button>';
    });
    return '<div class="red n' + n + '"><svg class="red-lineas" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + lineas + '</svg>' +
      '<div class="red-centro"><i class="fas fa-sitemap" aria-hidden="true"></i><span>' + esc(may(b.centro || centroTitulo())) + '</span></div>' + nodos + '</div>';
  };
  B.red.activar = function (b, k, el) { abreLector(el, b); };

  /* Conexiones: a un lado, los conceptos que la ficha nombra, todavía sin unir; al otro, los fragmentos que los relacionan. Al
     leer cada fragmento aparece la conexión que la ficha establece, con sus palabras («guarda una íntima conexión con»), y se
     cuentan las conexiones descubiertas. El mapa es una síntesis visual: el texto íntegro está en cada fragmento y cada conexión
     nueva se anuncia también en texto. */
  B.conexiones = function (b, k) {
    var C = b.conceptos || [], E = b.enlaces || [], pos = {};
    C.forEach(function (c, i) {
      var a = -Math.PI / 2 + 2 * Math.PI * i / C.length;
      pos[c.id] = [c.x != null ? c.x : 50 + 33 * Math.cos(a), c.y != null ? c.y : 50 + 34 * Math.sin(a)];
    });
    var lineas = E.map(function (e) {
      var p = pos[e.de], q = pos[e.a];
      return '<line data-id="' + k + '-' + e.item + '" x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '"/>';
    }).join('');
    var frases = E.map(function (e) {
      var p = pos[e.de], q = pos[e.a], m = e.medio || [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      return '<span class="cx-frase" data-id="' + k + '-' + e.item + '" style="left:' + m[0] + '%;top:' + m[1] + '%">' + esc(may(e.frase)) + '</span>';
    }).join('');
    var conceptos = C.map(function (c, i) {
      var ids = E.filter(function (e) { return e.de === c.id || e.a === c.id; }).map(function (e) { return k + '-' + e.item; });
      return '<span class="cx-concepto" data-items="' + ids.join(' ') + '" style="left:' + pos[c.id][0] + '%;top:' + pos[c.id][1] + '%;--d:' + (0.15 + i * 0.08) + 's">' + esc(may(c.texto)) + '</span>';
    }).join('');
    var fuentes = b.items.map(function (it, i) {
      var n = E.filter(function (e) { return e.item === i; }).length;
      return '<button type="button" class="cx-fuente' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '" style="--d:' + (0.2 + i * 0.08) + 's">' +
        '<span class="cx-n">' + (i + 1) + '</span><span class="cx-rotulo">' + rot(it.label) + '</span><span class="cx-marca">' + mano + visto + '</span>' + estado +
        (n ? '<span class="cx-chip"><i class="fas fa-link" aria-hidden="true"></i> ' + (n === 1 ? 'Revela 1 conexión' : 'Revela ' + n + ' conexiones') + '</span>' : '') + '</button>';
    }).join('');
    /* En pantalla angosta el mapa no cabe: cada conexión es una fila «concepto · frase · concepto» que se completa al leer. */
    var T = {};
    C.forEach(function (c) { T[c.id] = c.texto; });
    var filas = E.map(function (e) {
      return '<li class="cx-fila" data-id="' + k + '-' + e.item + '"><span class="cx-c">' + esc(may(T[e.de])) + '</span><span class="cx-f"><span class="cx-f-pista">· · ·</span><span class="cx-f-texto">' +
        esc(e.frase) + '</span></span><span class="cx-c">' + esc(may(T[e.a])) + '</span></li>';
    }).join('');
    return '<div class="conexiones n' + b.items.length + '"><div class="cx-mapa" aria-hidden="true"><svg class="cx-lineas" viewBox="0 0 100 100" preserveAspectRatio="none">' + lineas + '</svg>' +
      frases + conceptos + '<ul class="cx-lista">' + filas + '</ul><p class="cx-cuenta"></p></div><div class="cx-fuentes">' + fuentes + '</div><p class="sr-only cx-anuncio" aria-live="polite"></p></div>';
  };
  B.conexiones.activar = function (b, k, el) {
    abreLector(el, b);
    var E = b.enlaces || [], T = {};
    (b.conceptos || []).forEach(function (c) { T[c.id] = c.texto; });
    function pintar(id) {
      el.querySelectorAll('.cx-concepto').forEach(function (c) {
        if (c.dataset.items.split(' ').some(function (x) { return x && vistos[x]; })) c.classList.add('unido');
      });
      var hechas = E.filter(function (e) { return vistos[k + '-' + e.item]; }).length, cuenta = el.querySelector('.cx-cuenta');
      if (cuenta) cuenta.innerHTML = '<i class="fas fa-link" aria-hidden="true"></i> Conexiones descubiertas: ' + hechas + ' de ' + E.length;
      if (id) el.querySelector('.cx-anuncio').textContent = E.filter(function (e) { return k + '-' + e.item === id; })
        .map(function (e) { return may(T[e.de]) + ': ' + e.frase + ' ' + T[e.a]; }).join('. ');
    }
    pintar();
    el.addEventListener('ova-visto', function (ev) { pintar(ev.detail); });
  };

  /* Requisitos y consecuencia: los escenarios que la ficha distingue (U5-L3: inciso 1 e inciso 3 del artículo 187), cada uno con
     sus requisitos y «Se cumple» / «No se cumple». Cuando todos los requisitos de un escenario se cumplen aparece, citada, la
     consecuencia que la ficha le asigna («…tendrá una duración desde 2 hasta 8 años»); cuando cada escenario tiene alguno que no
     se cumple, la que la ficha prevé para los demás casos. La ficha manda: no se decide nada que ella no diga. Los fragmentos se
     leen completos desde la lista; en pantalla angosta cada requisito se abrevia por palabras completas («…»). */
  B.condiciones = function (b, k) {
    var S = b.escenarios || [], O = b.otro;
    var lista = b.items.map(function (it, i) {
      return '<button type="button" class="cond-fuente' + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '" style="--d:' + (0.15 + i * 0.07) + 's">' +
        '<span class="cond-arte">' + svgObjeto(it.obj, 30) + '</span><span class="cond-rotulo">' + rot(it.label) + '</span><span class="cond-marca">' + mano + visto + '</span>' + estado + '</button>';
    }).join('');
    var escenarios = S.map(function (s, j) {
      return '<div class="cond-esc" data-e="' + j + '" style="--d:' + (0.2 + j * 0.1) + 's"><p class="cond-esc-titulo">' + rot(s.titulo) +
        '<span class="cond-esc-marca"><i class="fas fa-circle-check" aria-hidden="true"></i></span></p><ul class="cond-reqs">' +
        s.requisitos.map(function (r, q) {
          var nombre = esc(may(r));
          return '<li class="cond-req"><span class="cond-req-texto"><span class="cond-largo">' + nombre + '</span><span class="cond-corto" aria-hidden="true">' + esc(may(extracto(r, 34))) + '</span></span>' +
            '<span class="cond-opciones" role="group" aria-label="' + nombre + '">' +
            '<button type="button" class="cond-op si" data-e="' + j + '" data-q="' + q + '" data-v="1" aria-pressed="false" aria-label="Se cumple"><span class="cond-op-l">Se cumple</span><span class="cond-op-c" aria-hidden="true">Sí</span></button>' +
            '<button type="button" class="cond-op no" data-e="' + j + '" data-q="' + q + '" data-v="0" aria-pressed="false" aria-label="No se cumple"><span class="cond-op-l">No se cumple</span><span class="cond-op-c" aria-hidden="true">No</span></button></span></li>';
        }).join('') + '</ul></div>';
    }).join('');
    var cita = function (t) { return '«…' + esc(t) + (/[.;:]$/.test(t) ? '' : '…') + '»'; };
    var resultado = '<div class="cond-resultado" data-estado="pendiente"><span class="cond-icono"><i class="fas fa-lock" aria-hidden="true"></i></span><div class="cond-res-texto" aria-live="polite">' +
      '<p class="cond-pista">Marque si se cumple cada requisito para ver su consecuencia.</p>' +
      S.map(function (s, j) { return '<p class="cond-cons" data-e="' + j + '" hidden><span class="cond-cons-de">' + esc(may(s.titulo)) + '</span> ' + cita(s.consecuencia) + '</p>'; }).join('') +
      (O ? '<p class="cond-cons otro" data-e="otro" hidden>' + cita(O.consecuencia) + '</p>' : '') + '</div></div>';
    return '<div class="condiciones"><div class="cond-lista">' + lista + '</div><div class="cond-panel"><div class="cond-escenarios n' + S.length + '">' + escenarios + '</div>' + resultado + '</div></div>';
  };
  B.condiciones.activar = function (b, k, el) {
    abreLector(el, b);
    var S = b.escenarios || [], marca = {}, res = el.querySelector('.cond-resultado');
    function estado() {
      var cumple = S.map(function (s, j) { return s.requisitos.every(function (_, q) { return marca[j + '-' + q] === '1'; }); });
      var falla = S.map(function (s, j) { return s.requisitos.some(function (_, q) { return marca[j + '-' + q] === '0'; }); });
      var e = cumple.some(Boolean) ? 'si' : falla.every(Boolean) ? 'no' : 'pendiente';
      res.dataset.estado = e;
      res.querySelector('.cond-icono i').className = 'fas ' + (e === 'si' ? 'fa-lock-open' : e === 'no' ? 'fa-lock' : 'fa-lock');
      res.querySelector('.cond-pista').hidden = e !== 'pendiente';
      res.querySelectorAll('.cond-cons').forEach(function (p) { p.hidden = p.dataset.e === 'otro' ? e !== 'no' : !cumple[Number(p.dataset.e)]; });
      el.querySelectorAll('.cond-esc').forEach(function (c, j) { c.classList.toggle('cumple', cumple[j]); c.classList.toggle('falla', falla[j]); });
    }
    el.querySelectorAll('.cond-op').forEach(function (o) {
      o.addEventListener('click', function () {
        marca[o.dataset.e + '-' + o.dataset.q] = o.dataset.v;
        el.querySelectorAll('.cond-op[data-e="' + o.dataset.e + '"][data-q="' + o.dataset.q + '"]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === o)); });
        estado(); reanimar(res);
      });
    });
    estado();
  };
  /* Comparador (contenido que contrasta figuras: «a diferencia de…», «buena fe simple y… exenta de culpa», «frente al
     comiso»): columnas lado a lado; la que se toca se ensancha con su texto completo y las demás se compactan. Usa los
     estilos .columnas del motor. */
  B.compara = function (b, k) {
    /* «ilus» en los elementos (hoja de virtualización de Derecho de petición, 22/11/2026: «imágenes verticales que al tocarse se
       despliegan horizontalmente»): cada columna cerrada es una franja vertical con su ilustración aprobada; la que se toca se
       ensancha con su texto. Sin «ilus» (los demás cursos), el objeto dibujado de siempre. */
    var conIlus = !!datos.ilustraciones && b.items.some(function (it) { return it.ilus; });
    return tituloBloque(b, k) + '<div class="columnas comparador c' + b.items.length + (conIlus ? ' con-ilus' : '') + '">' + b.items.map(function (it, i) {
      return '<div class="columna tono' + (i % 3 + 1) + refc(it.label) + '" data-id="' + k + '-' + i + '" data-i="' + i + '" style="--d:' + (i * 0.08) + 's">' +
        '<button type="button" class="col-boton" aria-expanded="false"><span class="col-cabeza"><span class="col-n">' + (i + 1) + '</span>' +
        '<span class="col-visto">' + visto + ' Leído</span></span><span class="col-arte">' + (conIlus && it.ilus ? '<img src="' + srcImagen(it.ilus) + '" alt="">' : svgObjeto(it.obj, 104)) + '</span>' +
        '<span class="col-rotulo">' + rot(it.label) + '</span><span class="col-toca">' + mano + (conIlus ? ' Clic para desplegar' : ' Comparar') + '</span></button>' +
        '<div class="col-lectura" hidden></div></div>';
    }).join('') + '</div>';
  };
  B.compara.activar = function (b, k, el) {
    var cont = el.querySelector('.columnas'), cols = el.querySelectorAll('.columna'), n = b.items.length;
    function abrir(c) {
      var i = Number(c.dataset.i);
      cols.forEach(function (o, j) {
        var si = j === i, lec = o.querySelector('.col-lectura');
        o.classList.toggle('abierta', si);
        o.querySelector('.col-boton').setAttribute('aria-expanded', String(si));
        if (!si) quitarRelleno(lec);   // la columna que se cierra no guarda la ilustración de relleno de cuando estuvo abierta
        lec.hidden = !si;
        lec.innerHTML = si ? '<p class="lectura-texto">' + rico(segs(b.items[j].segs)) + '</p>' : '';
      });
      cont.classList.add('con-abierta');
      cont.style.gridTemplateColumns = b.items.map(function (_, j) { return j === i ? (n === 2 ? '2.6fr' : '3.2fr') : '1fr'; }).join(' ');
      var lec = c.querySelector('.col-lectura');
      if (!dosificar(lec, function () { encajarPanel(lec); })) encajarPanel(lec);
      reanimar(lec); marcar(c.dataset.id);
    }
    cols.forEach(function (c) { c.querySelector('.col-boton').addEventListener('click', function () { abrir(c); }); });
    abrir(cols[0]); /* la escena nunca empieza en blanco */
    window.addEventListener('resize', function () { var l = el.querySelector('.columna.abierta .col-lectura'); if (l) encajarPanel(l); });
  };

  /* ---------- Actividad con retroalimentación (Estándares interamericanos; reunión con Juan del 28/10/2026) ----------
     Las actividades que el autor de la ficha preparó para H5P (pregunta de opción múltiple, conjunto de preguntas, decisiones,
     verdadero o falso, escenario de decisiones encadenadas, clasificación). Juan: «en cuanto el estudiante presione una
     respuesta incorrecta, le dé la retroalimentación para que él estudie y vuelva y responda la pregunta y si responde bien
     pues pasa a la siguiente». Páginas: introducción (si la hay) → una pregunta por página → cierre. La retroalimentación se
     abre en el lector; «Siguiente» se habilita al acertar. Tras acertar, cada opción vuelve a abrir la suya para repasar.
     Datos (producir_estandares.py): intro y cierre [{tipo: p|li|rot|tabla, segs | filas}], preguntas [{cab, enunciado,
     caption, opciones [{seg | texto, letra, ok, cab, retro}], respuesta, cab_retro, retro, fuente}]; modo «clasifica»: cada
     afirmación con las categorías de la matriz de solución como opciones. */
  function textoLineas(ls) {
    return ls.map(function (l) {
      if (l.tipo === 'tabla') return l.filas.map(function (f) { return f.map(seg).join(' · '); }).join('\n');
      return segs(l.segs);
    }).join('\n');
  }
  /* En la hoja de la actividad (introducción, situación, cierre), con datos.sinHuecos, los rótulos breves seguidos («Actividad
     inicial», «Pregunta») van en una sola línea separados por « · », en el orden de la ficha: uno bajo otro dejaban una franja
     vacía a su derecha (U3-L3-E05, U5-L1-E03). */
  function lineasHoja(ls) {
    if (!datos.sinHuecos) return textoLineas(ls);
    var out = [], rot = [];
    ls.forEach(function (l) {
      if (l.tipo === 'rot' && segs(l.segs).length <= 60) { rot.push(segs(l.segs)); return; }
      if (rot.length) { out.push(rot.join(' · ')); rot = []; }
      out.push(textoLineas([l]));
    });
    if (rot.length) out.push(rot.join(' · '));
    return out.join('\n');
  }
  /* ---------- Tarjeta de retroalimentación con memes (Estándares interamericanos; Esteban, 28/10/2026, tras la reunión con Juan:
     «cuando le dé una opción que es incorrecta le aparezca la imagen y le dé como para volver… si le da otra incorrecta le vuelve
     a aparecer otra imagen según el meme… y solo cuando elige la correcta ya lo deja avanzar a la siguiente pregunta») ----------
     Con datos.retro {reacciones, frases, acierto, rotulo}, en el lector:
     · «meme»: la tarjeta aprobada de ese error (imagen con su texto dibujado, que va también como texto alternativo), con botones
       reales sobre su «Vuelva a intentarlo» y su cierre, y «Leer la retroalimentación de la ficha», con el texto literal;
     · «mal»: el mismo diseño en HTML, con un personaje de reacción distinto en cada intento, su globo, la lección, «¿La opción B?»
       y la retroalimentación literal de la ficha;
     · «bien»: «¡Respuesta correcta!», la retroalimentación, la respuesta y la fuente; su botón lleva a la página siguiente.
     Escape o el cierre vuelven a la misma pregunta. */
  function encajarTarjeta(caja) {
    var zona = caja.querySelector('.tr-texto'), t = zona && zona.querySelector('.lectura-texto');
    if (!t) return;
    /* Con datos.sinHuecos, la retroalimentación breve crece hasta 24 px y llena su zona (sin franja vacía sobre el botón). */
    for (var fs = datos.sinHuecos ? 24 : 17; fs >= pisoLetra(); fs -= 0.5) {
      t.style.fontSize = fs + 'px';
      if (zona.scrollHeight <= zona.clientHeight + 1 && caja.scrollHeight <= caja.clientHeight + 1) return;
    }
  }
  function tarjeta(op) {
    var l = raiz.querySelector('.lector'), RR = datos.retro, n = op.idx || 0, html;
    retornoFoco = op.desde || null;
    if (op.tipo === 'meme') {
      html = '<div class="lector-caja tarjeta-retro con-meme" role="dialog" aria-modal="true" aria-label="Respuesta incorrecta" tabindex="-1">' +
        '<div class="tr-meme"><img src="' + srcImagen(op.meme.img) + '" alt="' + esc(op.meme.alt) + '">' +
        '<button type="button" class="tr-volver-img">' + esc(op.boton) + '</button>' +
        '<button type="button" class="tr-x-img" aria-label="Cerrar y volver a la pregunta"></button></div>' +
        (op.texto ? '<p class="tr-pie"><button type="button" class="tr-leer"><i class="fas fa-book-open" aria-hidden="true"></i> Leer la retroalimentación</button></p>' : '') +
        '</div>';
    } else {
      var bien = op.tipo === 'bien';
      var pers = bien ? RR.acierto[n % RR.acierto.length] : RR.reacciones[n % RR.reacciones.length];
      var globo = bien ? ['¡Muy bien!', '¡Eso es!', '¡Así es!'][n % 3] : RR.frases[n % RR.frases.length];
      var titulo = bien ? '¡Respuesta <b>correcta!</b>' : op.clasifica ? '¿Esa <b>categoría?</b>' : '¿La opción <b>' + esc(op.letra) + '?</b>';
      /* «Explicación:» y no «Así lo explica la ficha:» (Jennifer, FGN, 20/11/2026, SRPA U4-L2): «la ficha» es jerga de producción. */
      var sub = bien ? (op.texto ? 'Explicación:' : '¡Muy bien!') : op.clasifica ? '¡Esa no es la clasificación!' : op.texto ? '¡No es la respuesta! Revise por qué:' : '¡No es la respuesta!';   // sin explicación de la ficha no hay «por qué» que revisar
      /* Sin texto de la ficha: el acierto nombra la categoría elegida; nunca muestra el aviso de error (antes, «¡Respuesta
         correcta!» con «Esta afirmación no corresponde a esa categoría…», en las clasificaciones de U5). */
      var texto = op.texto || (bien ? (op.categoria ? 'Esta afirmación corresponde a la categoría «' + op.categoria + '».' : '')
        : op.clasifica ? 'Esta afirmación no corresponde a esa categoría. Vuelva a leerla e inténtelo de nuevo.'
        : 'Vuelva a leer la pregunta e inténtelo de nuevo.');
      html = '<div class="lector-caja tarjeta-retro ' + (bien ? 'bien' : 'mal') + '" role="dialog" aria-modal="true" aria-label="' +
        (bien ? 'Respuesta correcta' : 'Respuesta incorrecta') + '" tabindex="-1">' +
        '<div class="tr-izq" aria-hidden="true"><span class="tr-globo">' + esc(globo) + '</span><img class="tr-personaje" src="' + srcImagen(pers) + '" alt=""></div>' +
        '<div class="tr-der"><p class="tr-chip">' + esc(op.chip) + '</p>' +
        '<button type="button" class="tr-x" aria-label="Cerrar y volver a la pregunta"><i class="fas fa-xmark" aria-hidden="true"></i></button>' +
        '<p class="tr-titulo">' + titulo + '</p><span class="tr-linea" aria-hidden="true"></span><p class="tr-sub">' + esc(sub) + '</p>' +
        '<div class="tr-texto"><p class="lectura-texto">' + rico(texto) + '</p></div>' +
        '<button type="button" class="tr-boton">' + esc(op.boton) + ' <i class="fas fa-' + (bien ? 'arrow-right' : 'rotate-left') + '" aria-hidden="true"></i></button></div></div>';
    }
    l.innerHTML = html;
    l.hidden = false;
    var caja = l.firstChild;
    function salir() {
      var L = op.alBoton && faltaLeer(caja);
      if (L) { avisar(caja, textoFalta(L, 'la retroalimentación'), L.sig); return; }
      cerrarLector(); if (op.alBoton) op.alBoton();
    }
    caja.querySelectorAll('.tr-volver-img,.tr-boton').forEach(function (x) { x.addEventListener('click', salir); });
    caja.querySelectorAll('.tr-x-img,.tr-x').forEach(function (x) { x.addEventListener('click', cerrarLector); });
    var leerFicha = caja.querySelector('.tr-leer');
    if (leerFicha) leerFicha.addEventListener('click', function () {
      tarjeta({ tipo: 'mal', idx: n, chip: op.chip, letra: op.letra, texto: op.texto, boton: op.boton, desde: op.desde, clasifica: op.clasifica });
    });
    if (op.tipo !== 'meme') {
      var zona = caja.querySelector('.tr-texto');
      /* La tarjeta tiene menos alto que un panel: su retroalimentación se parte en tramos de 300 caracteres, para que
         «Seguir leyendo» nunca quede cortado al fondo. */
      if (!dosificar(zona, function () { encajarTarjeta(caja); }, datos.sinHuecos ? 300 : null)) encajarTarjeta(caja);
      var bt = caja.querySelector('.tr-boton');
      if (op.alBoton && faltaLeer(caja)) { candado(bt, true); caja.addEventListener('lectura-completa', function () { candado(bt, false); }); }
    }
    reanimar(caja);
    var foco = caja.querySelector('.tr-volver-img,.tr-boton');
    (foco || caja).focus({ preventScroll: true });
  }
  function sinMarca(t) { return String(t).replace(/^(?:Opción\s+)?[A-Da-d][.:)]\s+/, ''); }
  B.actividad = function (b, k) {
    var paginas = [];
    if (b.intro.length) paginas.push('intro');
    /* Una pregunta con su propia situación («Segunda situación. …» y sus hechos) la lee antes, en su página («x»). */
    b.preguntas.forEach(function (q, i) { if (q.contexto && q.contexto.length) paginas.push('x' + i); paginas.push('q' + i); });
    if (b.cierre.length) paginas.push('cierre');
    b.paginas = paginas;
    var nombre = b.modo === 'clasifica' ? 'Afirmación ' : 'Pregunta ';
    var html = paginas.map(function (p, n) {
      var cuerpo;
      if (p === 'intro' || p === 'cierre' || p[0] === 'x') {
        var ls = p === 'intro' ? b.intro : p === 'cierre' ? b.cierre : b.preguntas[Number(p.slice(1))].contexto;
        var rotulo = p === 'intro' ? 'Actividad' : p === 'cierre' ? 'Para cerrar la actividad' : 'Antes de la pregunta ' + (Number(p.slice(1)) + 1);
        cuerpo = '<div class="act-hoja act-encaja"><p class="act-eyebrow"><i class="fas ' + (p === 'cierre' ? 'fa-flag-checkered' : p === 'intro' ? 'fa-puzzle-piece' : 'fa-folder-open') + '" aria-hidden="true"></i> ' +
          rotulo + '</p><p class="lectura-texto">' + rico(lineasHoja(ls)) + '</p></div>' +
          '<figure class="act-figura" aria-hidden="true">' + (datos.ilustraciones && escena.ilustracion ? '<img src="' + srcImagen(escena.ilustracion) + '" alt="">'
            : svgObjeto(p === 'cierre' ? 'libros' : p === 'intro' ? 'expediente' : 'documento', 150)) + '</figure>';
      } else {
        var i = Number(p.slice(1)), q = b.preguntas[i], dos = q.opciones.length <= 2;
        cuerpo = '<div class="act-pregunta act-encaja"><p class="act-eyebrow"><i class="fas fa-circle-question" aria-hidden="true"></i> ' + nombre + (i + 1) + ' de ' + b.preguntas.length + '</p>' +
          (q.cab !== null && q.cab !== undefined ? '<p class="act-cab">' + marcado(may(seg(q.cab))) + '</p>' : '') +
          (q.enunciado.length ? '<p class="lectura-texto act-enunciado">' + rico(segs(q.enunciado)) + '</p>' : '') +
          (q.caption !== null && q.caption !== undefined ? '<p class="act-caption">' + esc(may(seg(q.caption))) + '</p>' : '') +
          '<div class="act-opciones' + (dos ? ' en-fila' : '') + '" role="group" aria-label="Opciones">' + q.opciones.map(function (o, j) {
            var t = o.seg !== undefined && o.seg !== null ? sinMarca(seg(o.seg)) : o.texto;
            return '<button type="button" class="act-opcion" data-q="' + i + '" data-j="' + j + '" style="--d:' + (j * 0.06) + 's"><span class="act-letra">' + esc(o.letra) + '</span>' +
              '<span class="act-texto">' + marcado(may(t)) + '</span><span class="act-marca" aria-hidden="true"></span></button>';
          }).join('') + '</div><p class="act-aviso" aria-live="polite"></p></div>';
      }
      return '<section class="act-pagina pag-' + (p[0] === 'q' ? 'pregunta' : p[0] === 'x' ? 'contexto' : p) + '" data-p="' + n + '"' + (n ? ' hidden' : '') + '>' + cuerpo + '</section>';
    }).join('');
    return '<div class="actividad" data-modo="' + b.modo + '">' + html +
      '<nav class="act-nav" aria-label="Partes de la actividad"><button type="button" class="act-ant"><i class="fas fa-arrow-left" aria-hidden="true"></i> Anterior</button>' +
      '<span class="act-puntos">' + paginas.map(function (p, n) {
        var r = p === 'intro' ? 'Introducción' : p === 'cierre' ? 'Cierre' : p[0] === 'x' ? 'Situación de la ' + nombre.toLowerCase() + (Number(p.slice(1)) + 1) : nombre + (Number(p.slice(1)) + 1);
        return '<button type="button" class="act-punto' + (p[0] === 'x' ? ' contexto' : '') + '" data-ir="' + n + '" aria-label="' + r + '"><span>' + (p[0] === 'q' ? Number(p.slice(1)) + 1 : p === 'intro' ? '<i class="fas fa-play" aria-hidden="true"></i>' : p[0] === 'x' ? '<i class="fas fa-folder-open" aria-hidden="true"></i>' : '<i class="fas fa-flag" aria-hidden="true"></i>') + '</span></button>';
      }).join('') + '</span><button type="button" class="act-sig">Siguiente <i class="fas fa-arrow-right" aria-hidden="true"></i></button></nav></div>';
  };
  /* La letra de la página baja de a medio punto hasta que todo cabe (nunca desplazamiento); el texto breve crece hasta 19 px. */
  function encajarAct(pg) {
    var c = pg.querySelector('.act-encaja'), ops = pg.querySelector('.act-opciones');
    if (!c) return;
    pg.classList.remove('sin-arte');
    if (ops) c.classList.remove('lectura-desplazable');
    quitarRelleno(c);
    /* datos.filaOpciones (Justicia restaurativa: 3): hasta cuántas opciones van en fila desde el comienzo; las demás cursos, 2. */
    if (ops) ops.classList.toggle('en-fila', ops.children.length <= (datos.filaOpciones || 2));
    /* datos.preguntaDosColumnas (Justicia restaurativa): con un enunciado de hasta ese número de caracteres, la página lleva la clase
       «act-dos» y el tema del curso pone el enunciado a un lado y las opciones al otro. Los demás cursos no la usan. */
    if (datos.preguntaDosColumnas) {
      var enun = c.querySelector('.act-enunciado');
      pg.classList.toggle('act-dos', !!ops && !!enun && enun.textContent.length <= datos.preguntaDosColumnas);
    }
    for (var fs = datos.sinHuecos ? 22 : 19; fs >= pisoLetra(); fs -= 0.5) {
      c.style.setProperty('--fs', fs + 'px');
      if (c.scrollHeight <= c.clientHeight + 1 && pg.scrollHeight <= pg.clientHeight + 1) { if (!ops && c.classList.contains('act-hoja')) rellenar(c); return; }
      if (fs <= (datos.desplazarLectura ? 17 : 14) && !pg.classList.contains('sin-arte') && pg.querySelector('.act-figura')) { pg.classList.add('sin-arte'); fs = 19.5; }
      /* Opciones largas que no caben una debajo de otra: van en dos columnas. */
      else if (fs <= 12.5 && ops && !ops.classList.contains('en-fila')) { ops.classList.add('en-fila'); fs = 16.5; }
    }
    /* Con datos.desplazarLectura la letra no baja de 15 px: si la pregunta con sus opciones aún no cabe, la página se desplaza
       (como la lectura) en lugar de cortar el texto (Terminaciones 1.1, pregunta de la absolución perentoria, 22/11/2026). */
    if (datos.desplazarLectura && ops) c.classList.add('lectura-desplazable');
  }
  B.actividad.activar = function (b, k, el) {
    var pags = el.querySelectorAll('.act-pagina'), puntos = el.querySelectorAll('.act-punto'), ant = el.querySelector('.act-ant'), sig = el.querySelector('.act-sig');
    var pos = 0, resueltas = {}, leidas = {};
    function pregunta(n) { var p = b.paginas[n]; return p && p[0] === 'q' ? Number(p.slice(1)) : null; }
    /* No se pasa de una pregunta sin acertarla («no lo deja pasar si no responde lo que es») ni, con datos.completar, de una
       página sin leerla completa. */
    function cerrada(n) { for (var m = 0; m < n; m++) { var q = pregunta(m); if (q !== null ? !resueltas[q] : datos.completar && !leidas[m]) return true; } return false; }
    /* Qué falta para avanzar desde la página actual (datos.completar): la respuesta correcta o alguna parte de la lectura. */
    function falta() {
      var q = pregunta(pos);
      if (q !== null && !resueltas[q]) return { texto: 'Aún no ha completado esta página: ' + (b.modo === 'clasifica' ? 'ubique la afirmación en su categoría correcta' : 'elija la respuesta correcta') + ' para poder avanzar.' };
      var L = !leidas[pos] && faltaLeer(pags[pos]);
      return L ? { texto: textoFalta(L, 'esta página'), pulsar: L.sig } : null;
    }
    function estado() {
      puntos.forEach(function (p, j) { p.disabled = cerrada(j); });
      if (datos.completar) { sig.disabled = pos === pags.length - 1; candado(sig, !sig.disabled && falta()); }
    }
    function ir(n) {
      if (cerrada(n)) return;
      pos = n;
      pags.forEach(function (p, j) { p.hidden = j !== n; });
      puntos.forEach(function (p, j) { p.setAttribute('aria-current', j === n ? 'step' : 'false'); p.classList.toggle('pasado', j < n); });
      var q = pregunta(n);
      ant.disabled = n === 0;
      sig.disabled = n === pags.length - 1 || (q !== null && !resueltas[q]);
      var pg = pags[n];
      if (b.paginas[n][0] !== 'q') {
        var hoja = pg.querySelector('.act-hoja');
        if (!dosificar(hoja, function () { encajarAct(pg); })) encajarAct(pg);
        if (!faltaLeer(pg)) leidas[n] = true;
      } else encajarAct(pg);
      estado();
      reanimar(pg);
    }
    el.addEventListener('lectura-completa', function () { if (pregunta(pos) === null) leidas[pos] = true; estado(); });
    var intentos = 0, aciertos = 0, R = datos.retro;
    /* Qué ofrece el botón de la tarjeta de acierto: la página que sigue. */
    function rotuloSiguiente() {
      var p = b.paginas[pos + 1];
      return !p ? 'Terminar' : p[0] === 'q' ? 'Siguiente pregunta' : p[0] === 'x' ? 'Siguiente situación' : p === 'cierre' ? 'Ir al cierre' : 'Continuar';
    }
    el.querySelectorAll('.act-opcion').forEach(function (o) {
      o.addEventListener('click', function () {
        var i = Number(o.dataset.q), q = b.preguntas[i], op = q.opciones[Number(o.dataset.j)], aviso = o.closest('.act-pregunta').querySelector('.act-aviso');
        var propia = (op.cab !== null && op.cab !== undefined ? seg(op.cab) + '\n' : '') + (op.retro ? segs(op.retro) : '');
        var cabRetro = q.cab_retro !== null && q.cab_retro !== undefined ? seg(q.cab_retro) : '', retroGeneral = segs(q.retro || []);
        var general = [cabRetro, retroGeneral].filter(Boolean).join('\n');
        var fuente = (q.fuente || []).length ? '\n' + segs(q.fuente) : '';
        var clave = q.respuesta !== null && q.respuesta !== undefined ? seg(q.respuesta) : '';
        var chip = R ? R.rotulo + ' · ' + (b.modo === 'clasifica' ? 'Afirmación ' : 'Pregunta ') + (i + 1) : '';
        var categoria = b.modo === 'clasifica' ? (op.seg !== undefined && op.seg !== null ? sinMarca(seg(op.seg)) : op.texto || '') : '';
        /* En el orden de la ficha: «Retroalimentación automática», la de la opción, la general y «Respuesta correcta: …». */
        var textoBien = [cabRetro, propia.trim(), retroGeneral, clave].filter(Boolean).join('\n') + fuente;
        var textoMal = ((propia.trim() || general) + fuente).trim();
        if (resueltas[i]) {
          /* Repaso: cada opción abre su propia retroalimentación. */
          var t = op.ok ? textoBien : textoMal;
          if (R && (t.trim() || op.meme || (op.ok && categoria))) tarjeta({ tipo: op.ok ? 'bien' : op.meme ? 'meme' : 'mal', idx: op.ok ? aciertos : intentos, meme: op.meme, chip: chip,
            letra: op.letra, texto: t, boton: 'Volver a la pregunta', desde: o, clasifica: b.modo === 'clasifica', categoria: categoria });
          else if (t.trim()) leer((op.ok ? 'Respuesta correcta · ' : 'Repaso · ') + 'opción ' + op.letra, t, null, o);
          return;
        }
        if (op.ok) {
          resueltas[i] = true;
          o.classList.add('acierto');
          o.querySelector('.act-marca').innerHTML = visto;
          o.closest('.act-opciones').classList.add('resuelta');
          aviso.className = 'act-aviso bien';
          aviso.innerHTML = visto + ' ¡Correcto! ' + (pos < pags.length - 1 ? 'Ya puede continuar.' : '');
          marcarYa(k + '-' + i);
          sig.disabled = pos === pags.length - 1;
          estado();
          /* Solo la respuesta correcta deja avanzar: su tarjeta lleva el botón a la página siguiente. */
          if (R) tarjeta({ tipo: 'bien', idx: aciertos++, chip: chip, letra: op.letra, texto: textoBien, desde: o, clasifica: b.modo === 'clasifica',
            categoria: categoria, boton: rotuloSiguiente(), alBoton: function () { if (pos < pags.length - 1) ir(pos + 1); } });
          else if (textoBien.trim()) leer('¡Correcto! · ' + (b.modo === 'clasifica' ? 'Afirmación ' : 'Pregunta ') + (i + 1), textoBien, null, o);
        } else {
          o.classList.remove('error'); void o.offsetWidth; o.classList.add('error', 'intentada');
          o.querySelector('.act-marca').innerHTML = '<i class="fas fa-xmark" aria-hidden="true"></i>';
          aviso.className = 'act-aviso mal';
          aviso.textContent = 'Respuesta incorrecta. ' + (textoMal || op.meme ? 'Lea la retroalimentación y vuelva a intentarlo.' : 'Vuelva a intentarlo.');
          /* Cada error trae otra imagen: el meme aprobado de ese error o, si no lo hay, otro personaje de reacción. */
          if (R) tarjeta({ tipo: op.meme ? 'meme' : 'mal', idx: intentos++, meme: op.meme, chip: chip, letra: op.letra, texto: textoMal, desde: o,
            clasifica: b.modo === 'clasifica', boton: 'Vuelva a intentarlo' });
          else if (textoMal) leer('Respuesta incorrecta · opción ' + op.letra, textoMal, null, o);
        }
      });
    });
    puntos.forEach(function (p) { p.addEventListener('click', function () { ir(Number(p.dataset.ir)); }); });
    ant.addEventListener('click', function () { ir(Math.max(0, pos - 1)); });
    sig.addEventListener('click', function () {
      var f = datos.completar && falta();
      if (f) { avisar(raiz.querySelector('.escenario'), f.texto, f.pulsar); return; }
      ir(Math.min(pags.length - 1, pos + 1));
    });
    ir(0);
    if (document.fonts) document.fonts.ready.then(function () { encajarAct(pags[pos]); });
    window.addEventListener('resize', function () { encajarAct(pags[pos]); });
  };

  /* Ver en pantalla completa (Juan, 27/10/2026: en todas las mediaciones, como prueba). Si el navegador o el iframe no lo
     permiten (sin allowfullscreen), la escena se abre en una pestaña nueva. */
  /* Pantalla completa de toda la lección (revisión de la Fiscalía, 13/11/2026; Jennifer: «cuando yo le hago pantalla completa,
     solo me abre esta página… no es posible que se pueda navegar todo continuo en ventana completa»): dentro del SCORM dibujado
     desde Genially (herramientas/genially_scorm.py, que publica window.ovaLeccion), el botón pone en pantalla completa la
     lección entera, con sus flechas y su índice, y se sigue pasando de página sin salir. Fuera de ese SCORM (Genially, Pages),
     la escena se amplía sola, como antes. */
  function leccionPadre() {
    try { var w = window.parent; return w && w !== window && w.ovaLeccion && w.ovaLeccion.pantallaCompleta ? w.ovaLeccion : null; } catch (e) { return null; }
  }
  function pantallaCompleta() {
    var d = document, el = d.documentElement, L = leccionPadre();
    if (L && !(d.fullscreenElement || d.webkitFullscreenElement) && L.pantallaCompleta() !== false) return;
    if (d.fullscreenElement || d.webkitFullscreenElement) { (d.exitFullscreen || d.webkitExitFullscreen).call(d); return; }
    var pedir = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!pedir || d.fullscreenEnabled === false) { window.open(location.href, '_blank', 'noopener'); return; }
    var p = pedir.call(el);
    if (p && p.catch) p.catch(function () { window.open(location.href, '_blank', 'noopener'); });
  }
  /* En pantalla completa la escena conserva la composición del iframe (767 × 510) y crece con zoom, que vuelve a dibujar
     la letra nítida en vez de agrandar una imagen (base.css centra la escena). En una pantalla más pequeña que el iframe,
     como un celular acostado (844 × 390), se reduce hasta caber completa: si no, se cortaba abajo con el botón «Salir».
     «datos.marco» = [ancho, alto] del iframe de un curso con otro marco (SRPA: 1113 × 448, todo el recuadro de la plantilla);
     su tema-curso.css fija ese tamaño en pantalla completa. */
  function zoomPantalla() {
    var on = document.documentElement.classList.contains('en-pantalla-completa'), m = datos.marco || [767, 510];
    raiz.style.zoom = on ? String(Math.min(innerWidth / m[0], innerHeight / m[1])) : '';
  }
  function estadoPantalla() {
    /* «propio»: la escena sola en pantalla completa (crece con zoom). Con la lección entera en pantalla completa, la escena
       conserva su composición (la lección la escala) y el botón solo pasa a «Salir». */
    var propio = !!(document.fullscreenElement || document.webkitFullscreenElement), L = leccionPadre(), b = raiz.querySelector('.pantalla-completa');
    var on = propio || !!(L && L.enPantallaCompleta && L.enPantallaCompleta());
    document.documentElement.classList.toggle('en-pantalla-completa', propio);
    zoomPantalla();
    if (!b) return;
    b.querySelector('i').className = 'fas ' + (on ? 'fa-compress' : 'fa-expand');
    b.querySelector('span').textContent = on ? 'Salir' : 'Pantalla completa';
    b.setAttribute('aria-label', on ? 'Salir de pantalla completa' : 'Ver en pantalla completa');
  }
  document.addEventListener('fullscreenchange', estadoPantalla);
  document.addEventListener('webkitfullscreenchange', estadoPantalla);
  /* La lección avisa a sus escenas cuando entra o sale de pantalla completa (genially_scorm.py). */
  window.addEventListener('message', function (e) { if (e.data && e.data.ova === 'pantalla') estadoPantalla(); });
  window.addEventListener('resize', zoomPantalla);
  window.addEventListener('resize', function () { midiendo(function () { organizarGiros(); encajarTarjetas(); ajustarExtractos(); }); });

  /* ---------- Caso de estudio (patrón de Juan, caso1.html; Esteban, 27/10/2026) ----------
     «Aplicación al expediente del curso» como un expediente en páginas: El caso → Su tarea → Su respuesta, con puntos de
     posición y Anterior/Siguiente. Todo el texto de la fuente aparece en su orden: la situación, las preguntas y consignas,
     la pista, la instrucción de respuesta y la nota. Admite los roles fijos de U1 y los párrafos de U2–U4. */
  var ENCABEZADO = /^(Aplicación al expediente del curso)\s*/;
  var TAREA = /¿|\b(analice|determine|clasifique|explique|identifique|examine|deberá encontrar|establezca|indique|describa)\b/i;
  /* No corta tras el numeral de una pregunta numerada («1. ¿Qué necesidad…?», Derecho de petición U1-L1): el número quedaba
     suelto en la situación y la pregunta sin él (31/10/2026). */
  function oraciones(t) { return String(t).split(/(?<=[.?!])(?<!(?:^|\s)\d{1,2}\.)\s+(?=[¿¡A-ZÁÉÍÓÚÑ])/).filter(function (x) { return x.trim(); }); }
  function modeloCaso(b) {
    /* «encabezado» y «nombre» del bloque (Estándares interamericanos: «Actividad de aprendizaje») reemplazan los de Audiencias. */
    var r = b.roles, m = { encabezado: b.encabezado || 'Aplicación al expediente del curso', situacion: [], tareas: [], pista: [], instruccion: [], nota: [] };
    function clasificar(t, porRol) {
      /* «Tome nota de sus respuestas…» (bitácoras de SRPA) es la instrucción para responder: va junto al espacio de respuesta. */
      if (/^Responda\b/.test(t) || (datos.bitacora && /^(?:Tome (?:atenta )?nota|Escr[ií]balas|Justifique (?:su|la) respuesta|Reflexione sobre)\b/i.test(t))) m.instruccion.push(t);
      else if (/^Adicionalmente\b/.test(t)) m.nota.push(t);
      else if (/^Para ello\b/.test(t)) m.pista.push(t);
      else if (porRol === 'tarea' || TAREA.test(t)) m.tareas.push(t);
      else m.situacion.push(t);
    }
    var titulo = typeof r.titulo === 'number' ? seg(r.titulo) : (r.titulo || ''), resto = titulo.replace(ENCABEZADO, '');
    if (ENCABEZADO.test(titulo)) m.encabezado = ENCABEZADO.exec(titulo)[1];
    if (r.parrafos) {
      if (resto) clasificar(resto);
      /* «Nota: …» después de las preguntas (lista de verificación de Derecho de petición U4-L1) es el último punto de la lista,
         en su orden; como situación salía antes de las preguntas (31/10/2026). */
      r.parrafos.forEach(function (i) {
        if (m.tareas.length && /^Nota\s*:/.test(seg(i))) { m.tareas.push(seg(i)); return; }
        oraciones(seg(i)).forEach(function (o) { clasificar(o); });
      });
    } else {
      if (resto) m.situacion.push(resto);
      if (r.hecho !== undefined) m.situacion.push(seg(r.hecho));
      if (r.pregunta !== undefined) m.tareas.push(seg(r.pregunta));
      if (r.pista !== undefined) m.tareas.push(seg(r.pista));
      if (r.instruccion !== undefined) m.instruccion.push(seg(r.instruccion));
      if (r.nota !== undefined) m.nota.push(seg(r.nota));
    }
    /* Una situación que no cierra la frase («En la indagación acerca del caso de …,») se lee junto a la primera tarea. */
    var sit = m.situacion.join(' ');
    if (sit && /[,:;]$/.test(sit.trim()) && m.tareas.length) { m.tareas[0] = sit + ' ' + m.tareas[0]; m.situacion = []; }
    var nombre = /caso de ((?:[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s?){2,4})/.exec(m.situacion.concat(m.tareas).join(' '));
    m.nombre = b.nombre || (nombre ? 'Caso de ' + nombre[1].trim() : 'Expediente del curso');
    m.situacion = m.situacion.reduce(function (a, x) { if (a.length && /,$/.test(a[a.length - 1].trim())) a[a.length - 1] += ' ' + x; else a.push(x); return a; }, []);
    /* Caso y tarea breves comparten página («El caso y su tarea»); si no, cada uno tiene la suya. */
    m.junto = m.situacion.length > 0 && (m.situacion.join(' ') + m.tareas.join(' ') + m.pista.join(' ')).length <= 460;
    m.paginas = m.junto ? ['caso', 'respuesta'] : (m.situacion.length ? ['caso'] : []).concat(['tarea', 'respuesta']);
    return m;
  }
  function totalCaso(b) { var m = modeloCaso(b); return m.paginas.length + m.tareas.length; }

  /* Pregunta abierta = «Actividad de reflexión» (JP, 14/11/2026: «todo lo que son preguntas abiertas deben quedar como actividad
     de reflexión… no le das espacio para que registre nada… ni copiar ni descargar»; docs/directrices-cursos.md, sección 19;
     modelo: el recurso u1-preguntas-orientadoras de delitos ambientales, aprobado). La última página del caso ya no tiene cuadro
     de respuesta, contador ni «Copiar»: lleva una pausa de reflexión con sus pasos y «Clic aquí cuando termine de reflexionar»,
     que deja la página leída. La instrucción de la ficha que pedía escribir («Responda…», «Tome nota…») se reemplaza por la de
     reflexión, como lo autorizó JP («siempre que encuentres una de ellas la modificas… tómese un tiempo corto para que
     reflexione profundamente»); cada curso la registra en plan/observaciones-fuente.md. Las preguntas siguen literales en
     «Su tarea». datos.reflexion === false conserva la respuesta escrita. */
  function reflexion() { return datos.reflexion !== false; }
  function reflexionHtml(m) {
    var una = m.tareas.length === 1;
    var pasos = ['Lea de nuevo ' + (una ? 'la pregunta' : 'las preguntas') + ' de su tarea.',
      'Piense cómo ' + (una ? 'la' : 'las') + ' respondería a partir de lo estudiado en la lección.',
      'Relacione su idea con su labor en la Fiscalía.'];
    return '<div class="caso-escribir caso-reflexion">' +
      '<div class="caso-pausa"><span class="caso-pausa-icono" aria-hidden="true"><i class="fas fa-brain"></i></span>' +
      '<p class="caso-eyebrow">Actividad de reflexión</p>' +
      '<p class="caso-pausa-tit">Este es un espacio para la reflexión</p>' +
      '<p class="caso-instruccion">Tómese un tiempo corto para reflexionar profundamente sobre ' + (una ? 'la pregunta' : 'las preguntas') +
      '. No necesita escribir ni enviar una respuesta: piense con calma su posición a partir de los contenidos estudiados.</p>' +
      '<ol class="caso-pausa-pasos">' + pasos.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol></div>' +
      '<button type="button" class="caso-reflexion-listo" aria-pressed="false"><i class="fas fa-circle-check" aria-hidden="true"></i> ' +
      '<span class="crl-pendiente">Clic aquí cuando termine de reflexionar</span><span class="crl-hecho">Reflexión terminada</span></button></div>' +
      '<aside class="caso-recuerde"><p class="caso-eyebrow"><i class="fas fa-list-check" aria-hidden="true"></i> Su tarea</p><ol>' +
      m.tareas.map(function (t) { return '<li>' + rico(t) + '</li>'; }).join('') + '</ol>' +
      m.nota.map(function (t) { return '<p class="caja-clave">' + rico(t) + '</p>'; }).join('') + '</aside>';
  }
  /* Pregunta de control abierta = «Actividad práctica» (Juan, Ley 1826, 21/11/2026: «las preguntas de control siempre son
     actividad práctica»): b.practica. Misma forma que la reflexión, sin cuadro de respuesta, con el rompecabezas; la pausa pide
     pensar la respuesta y, si la ficha la trae en la página siguiente (b.siguiente), compararla con ella. */
  function practicaHtml(m, b) {
    var una = m.tareas.length === 1;
    var pasos = ['Lea de nuevo ' + (una ? 'la pregunta' : 'las preguntas') + ' de su tarea.',
      'Piense su respuesta a partir de lo estudiado en la lección.',
      b.siguiente ? 'Compárela con la respuesta del documento, en la página siguiente.' : 'Relacione su respuesta con su labor en la Fiscalía.'];
    return '<div class="caso-escribir caso-reflexion caso-practica">' +
      '<div class="caso-pausa"><span class="caso-pausa-icono" aria-hidden="true"><i class="fas fa-puzzle-piece"></i></span>' +
      '<p class="caso-eyebrow">Actividad práctica</p>' +
      '<p class="caso-pausa-tit">Ponga a prueba lo aprendido</p>' +
      '<p class="caso-instruccion">Responda ' + (una ? 'la pregunta' : 'las preguntas') + ' con sus propias palabras. No necesita escribir ni ' +
      'enviar la respuesta: piénsela con calma a partir de los contenidos estudiados' + (b.siguiente ? ' y luego compárela.' : '.') + '</p>' +
      '<ol class="caso-pausa-pasos">' + pasos.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol></div>' +
      '<button type="button" class="caso-reflexion-listo" aria-pressed="false"><i class="fas fa-circle-check" aria-hidden="true"></i> ' +
      '<span class="crl-pendiente">Clic aquí cuando tenga su respuesta</span><span class="crl-hecho">Respuesta pensada</span></button></div>' +
      '<aside class="caso-recuerde"><p class="caso-eyebrow"><i class="fas fa-list-check" aria-hidden="true"></i> Su tarea</p><ol>' +
      m.tareas.map(function (t) { return '<li>' + rico(t) + '</li>'; }).join('') + '</ol>' +
      m.nota.map(function (t) { return '<p class="caja-clave">' + rico(t) + '</p>'; }).join('') + '</aside>';
  }
  B.caso = function (b, k) {
    /* La imagen del caso sale del texto del propio caso; si no hay tema, del de la escena y la lección. */
    var m = modeloCaso(b), tm = temaDeTexto(m.situacion.concat(m.tareas).join(' ')) || tema(escena) || (datos.ilustraciones ? null : 'fundamento');
    var arte = tm ? '<figure class="ctx-arte foto caso-figura" aria-hidden="true"><img src="' + srcImagen(tm) + '" alt=""></figure>'
      : '<figure class="caso-figura caso-objeto" aria-hidden="true">' + svgObjeto(b.obj || 'expediente', 170) + '</figure>';
    var ficha = '<p class="caso-eyebrow"><i class="fas ' + (b.practica ? 'fa-puzzle-piece' : 'fa-folder-open') + '" aria-hidden="true"></i> ' + esc(m.encabezado) + '</p><p class="caso-nombre">' + esc(m.nombre) + '</p>';
    var nombres = b.practica ? { caso: 'La pregunta', tarea: 'La pregunta', respuesta: 'Su respuesta' }
      : { caso: m.junto ? 'El caso y su tarea' : 'El caso', tarea: 'Su tarea', respuesta: reflexion() ? 'Su reflexión' : 'Su respuesta' };
    /* Cada pregunta o consigna es una tarjeta que se marca como revisada; la pista de la fuente va resaltada debajo. */
    function tareasHtml() {
      return m.tareas.map(function (t, i) {
        return '<button type="button" class="caso-tarea" data-id="' + k + '-t' + i + '" aria-pressed="false"><span class="caso-n">' + (i + 1) + '</span><span class="lectura-texto">' + rico(t) + '</span>' +
          '<span class="caso-marca">' + mano + ' Lo tendré en cuenta</span><span class="caso-visto">' + visto + ' Revisado</span></button>';
      }).join('') + m.pista.map(function (t) { return '<p class="caso-pista"><i class="fas fa-lightbulb" aria-hidden="true"></i><span class="lectura-texto">' + rico(t) + '</span></p>'; }).join('');
    }
    var pag = {
      caso: '<div class="caso-hoja">' + ficha + '<div class="caso-situacion caso-encaja">' + m.situacion.map(function (t) { return '<p class="lectura-texto">' + rico(t) + '</p>'; }).join('') +
        (m.junto ? tareasHtml() : '') + '</div></div>' + arte,
      tarea: '<div class="caso-hoja">' + ficha + '<div class="caso-tareas caso-encaja">' + tareasHtml() + '</div></div>' +
        (m.situacion.length ? '<figure class="caso-figura caso-objeto" aria-hidden="true">' + svgObjeto(b.obj && b.obj !== 'expediente' ? b.obj : 'documento', 170) + '</figure>' : arte),
      respuesta: b.practica ? practicaHtml(m, b) : reflexion() ? reflexionHtml(m) : '<div class="caso-escribir">' + m.instruccion.map(function (t) { return '<p class="caso-instruccion">' + rico(t) + '</p>'; }).join('') +
        '<label class="caso-respuesta"><span class="sr-only">Su respuesta</span><textarea placeholder="Escriba aquí su respuesta…"></textarea></label>' +
        '<div class="caso-pie"><span class="caso-cuenta"><output>0</output> / 500 palabras</span><span class="caso-barra"><i></i></span>' +
        '<button type="button" class="caso-copiar"><i class="fas fa-copy" aria-hidden="true"></i> Copiar respuesta</button></div></div>' +
        '<aside class="caso-recuerde"><p class="caso-eyebrow"><i class="fas fa-list-check" aria-hidden="true"></i> Su tarea</p><ol>' +
        m.tareas.map(function (t) { return '<li>' + rico(t) + '</li>'; }).join('') + '</ol>' +
        m.nota.map(function (t) { return '<p class="caja-clave">' + rico(t) + '</p>'; }).join('') + '</aside>'
    };
    return '<div class="caso2" data-paginas="' + m.paginas.length + '">' + m.paginas.map(function (p, i) {
      return '<section class="caso-pagina pag-' + p + (i ? '' : ' activa') + '" data-p="' + i + '" data-id="' + k + '-p' + i + '" aria-label="' + nombres[p] + '"' + (i ? ' hidden' : '') + '>' + pag[p] + '</section>';
    }).join('') +
      '<nav class="caso-nav" aria-label="Páginas del caso"><button type="button" class="caso-ant"><i class="fas fa-arrow-left" aria-hidden="true"></i> Anterior</button>' +
      '<span class="caso-puntos">' + m.paginas.map(function (p, i) { return '<button type="button" class="caso-punto" data-ir="' + i + '" aria-label="' + nombres[p] + '"><span>' + nombres[p] + '</span>' + estado + '</button>'; }).join('') + '</span>' +
      '<button type="button" class="caso-sig">Siguiente <i class="fas fa-arrow-right" aria-hidden="true"></i></button></nav></div>';
  };
  B.caso.activar = function (b, k, el) {
    var paginas = el.querySelectorAll('.caso-pagina'), puntos = el.querySelectorAll('.caso-punto'), ant = el.querySelector('.caso-ant'), sig = el.querySelector('.caso-sig'), pos = -1;
    /* Detalles de lectura (Esteban, 31/10/2026: prioridad 2 del diagnóstico de detalles). Cada página se escribe letra por letra
       la primera vez que se abre; si se sale a medias, la escritura espera y sigue donde iba al volver. Cada punto dice su estado:
       «Falta leer» (abierta sin terminar: la lectura o algún «Lo tendré en cuenta») o «Leída»; al salir de una página sin
       terminarla, un aviso lo dice. */
    var abiertas = {}, escritas = {}, lecturas = {};
    function completa(j) {
      return !!vistos[k + '-p' + j] && [].every.call(paginas[j].querySelectorAll('.caso-tarea'), function (t) { return !!vistos[t.dataset.id]; });
    }
    function estadoPuntos() {
      puntos.forEach(function (p, j) {
        var lista = completa(j), nombre = paginas[j].getAttribute('aria-label');
        p.classList.toggle('abierta', !!abiertas[j]); p.classList.toggle('visto', lista);
        p.setAttribute('aria-label', nombre + (lista ? ' · leída' : abiertas[j] && j !== pos ? ' · falta leer' : ''));
      });
    }
    function avisarSalida(j) {
      if (!datos.completar || j < 0 || completa(j)) return;
      var nombre = esc(paginas[j].getAttribute('aria-label')), tareas = [].filter.call(paginas[j].querySelectorAll('.caso-tarea'), function (t) { return !vistos[t.dataset.id]; }).length;
      if ((b.practica || reflexion()) && paginas[j].classList.contains('pag-respuesta') && !vistos[k + '-p' + j]) { avisarFalta(null, 'En «' + nombre + '» falta hacer clic en «' + (b.practica ? 'Clic aquí cuando tenga su respuesta' : 'Clic aquí cuando termine de reflexionar') + '».'); return; }
      avisarFalta(null, vistos[k + '-p' + j] || !abiertas[j] ? 'En «' + nombre + '» falta marcar «Lo tendré en cuenta» en ' + (tareas === 1 ? '1 pregunta' : tareas + ' preguntas') + '.'
        : 'Falta leer «' + nombre + '». Vuelva a esa página para terminar.');
    }
    function ir(i) {
      var antes = pos;
      pos = i; abiertas[i] = true;
      paginas.forEach(function (p, j) { p.hidden = j !== i; p.classList.toggle('activa', j === i); });
      puntos.forEach(function (p, j) { p.setAttribute('aria-current', j === i ? 'step' : 'false'); p.classList.toggle('pasado', j < i); });
      ant.disabled = i === 0; sig.disabled = i === paginas.length - 1;
      /* En la última página no hay a dónde seguir: el botón no se muestra apagado (revisora del SRPA, 13/11/2026: «aunque se
         responda la nota, el botón de siguiente no se activa»). Se oculta sin mover el resto del pie. */
      sig.style.visibility = sig.disabled ? 'hidden' : '';
      var pg = paginas[i], c = pg.querySelector('.caso-encaja'), letras = null;
      reanimar(pg);
      /* Las letras se envuelven antes de medir y repartir la página, para que nada cambie de lugar al escribirse. */
      if (c && !quieto && !escritas[i]) { escritas[i] = true; letras = [].concat.apply([], [].map.call(c.querySelectorAll('.lectura-texto'), envolverLetras)); }
      encajarCaso(pg, true);
      var partes = !!(c && [].some.call(c.children, function (x) { return x.classList.contains('lectura-paginas'); }));
      if (letras && letras.length) lecturas[i] = escribirVentana(c, letras, partes);
      else if (lecturas[i] && !lecturas[i].completa) { lecturas[i].turno = turno; ultimaLectura = lecturas[i]; }
      else for (var j in lecturas) if (Number(j) !== i && lecturas[j] === ultimaLectura) ultimaLectura = null;   // la de otra página no decide el visto de esta
      /* La página de reflexión queda leída con «Clic aquí cuando termine de reflexionar», no al entrar. */
      if (!((b.practica || reflexion()) && pg.classList.contains('pag-respuesta'))) marcar(k + '-p' + i);
      if (datos.completar) candado(sig, !sig.disabled && !!faltaLeer(pg));
      if (antes !== i) avisarSalida(antes);
      estadoPuntos();
    }
    el.addEventListener('ova-visto', estadoPuntos);
    /* Al entrar a la página, el texto que no cabe ni a 15 px se reparte en partes; al cambiar el tamaño, solo se reencaja. */
    function encajarCaso(pg, entrada) {
      pg.querySelectorAll('.caso-encaja').forEach(function (c) {
        var partido = [].some.call(c.children, function (x) { return x.classList.contains('lectura-paginas'); });
        if (partido && !entrada) return;
        if (partido) { quitarPartes(c); c.style.removeProperty('--fs'); }
        /* En el marco ancho (SRPA, 1113 × 448) la letra no baja de 14 px: lo que no cabe se lee por partes. El desborde se
           confirma con la suma de los bloques: la ilustración de relleno entra con «aparece» (translateY de 8 px) y ese
           movimiento inflaba scrollHeight, de modo que la página perdía su imagen y quedaba un hueco (SRPA U2-L3-E23). */
        encajarTexto(pg, c, anchoReal() ? 14 : 0);
        if (c.scrollHeight > c.clientHeight + 1 && !cabe(c, 0)) { quitarRelleno(c); pg.classList.add('sin-arte'); partirBloques(c); }
        /* Una sola pregunta llena la hoja del marco ancho (la tarjeta se estira): su letra se mide contra el alto de la propia
           tarjeta, de 25 px hacia abajo, para que nunca quede cortada (SRPA U1-L3-E31). */
        var tareas = c.querySelectorAll('.caso-tarea');
        var sola = tareas.length === 1 && [].every.call(c.children, function (x) { return x === tareas[0] || x.classList.contains('relleno-arte'); }) && tareas[0];
        if (sola && anchoReal()) {
          quitarRelleno(c);   // la tarjeta ocupa todo el alto; la ilustración de relleno la dejaba pequeña (U1-L3-E19)
          // La tarjeta crece con su texto (flex con min-height automático): se mide también la caja que la contiene.
          for (var fs = 25; fs >= 12.5; fs -= 0.5) {
            c.style.setProperty('--fs', fs + 'px');
            if (sola.scrollHeight <= sola.clientHeight + 1 && c.scrollHeight <= c.clientHeight + 1) break;
          }
        }
      });
    }
    el.addEventListener('lectura-completa', function () { if (datos.completar) candado(sig, false); });
    /* Con datos.completar, no se pasa a otra página del caso sin leer todas las partes de la actual. */
    function pendiente(j) {
      var L = j > pos && faltaLeer(paginas[pos]);
      if (L) avisar(raiz.querySelector('.escenario'), textoFalta(L, 'esta página'), L.sig);
      return !!L;
    }
    puntos.forEach(function (p) { p.addEventListener('click', function () { var j = Number(p.dataset.ir); if (!pendiente(j)) ir(j); }); });
    ant.addEventListener('click', function () { ir(Math.max(0, pos - 1)); });
    sig.addEventListener('click', function () { if (!pendiente(pos + 1)) ir(Math.min(paginas.length - 1, pos + 1)); });
    el.querySelectorAll('.caso-tarea').forEach(function (t) {
      t.addEventListener('click', function () { t.setAttribute('aria-pressed', 'true'); t.classList.add('visto'); marcar(t.dataset.id); });
    });
    /* «Su tarea» junto a la respuesta (Esteban, 28/10/2026: «no dejar esos espacios en blanco»): la lista crece hasta 17 px y,
       si aún sobra espacio, lleva la ilustración de relleno debajo. */
    function encajarRecuerde() {
      var a = el.querySelector('.caso-recuerde'), ol = a && a.querySelector('ol');
      if (!ol || !datos.sinHuecos || !a.getClientRects().length) return;
      quitarRelleno(a);
      for (var fs = 17; fs >= 12; fs -= 0.5) { ol.style.fontSize = fs + 'px'; if (a.scrollHeight <= a.clientHeight + 1) break; }
      rellenar(a);
    }
    paginas.forEach(function (pg) { if (pg.classList.contains('pag-respuesta')) new MutationObserver(function () { if (!pg.hidden) encajarRecuerde(); }).observe(pg, { attributes: true, attributeFilter: ['hidden'] }); });
    window.addEventListener('resize', encajarRecuerde);
    var listoRef = el.querySelector('.caso-reflexion-listo');
    if (listoRef) listoRef.addEventListener('click', function () {
      listoRef.setAttribute('aria-pressed', 'true');
      marcar(listoRef.closest('.caso-pagina').dataset.id); estadoPuntos();
    });
    if (el.querySelector('textarea')) (function () {
    var t = el.querySelector('textarea'), out = el.querySelector('.caso-cuenta output'), barra = el.querySelector('.caso-barra i'), clave = 'ap-respuesta-' + (datos.clave_curso ? datos.clave_curso + '-' : '') + (datos.unit || 1) + '-' + datos.lesson + '-' + actual;
    try { t.value = localStorage.getItem(clave) || ''; } catch (e) { /* sin almacenamiento */ }
    function contar() {
      var palabras = t.value.trim() ? t.value.trim().split(/\s+/) : [];
      if (palabras.length > 500) { t.value = palabras.slice(0, 500).join(' '); palabras.length = 500; }
      out.textContent = palabras.length; barra.style.width = (palabras.length / 5) + '%';
      try { localStorage.setItem(clave, t.value); } catch (e) { /* sin almacenamiento */ }
    }
    t.addEventListener('input', contar); contar();
    var copiar = el.querySelector('.caso-copiar');
    copiar.addEventListener('click', function () {
      function listo() { copiar.innerHTML = visto + ' Respuesta copiada'; setTimeout(function () { copiar.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i> Copiar respuesta'; }, 1800); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t.value).then(listo, function () { t.select(); try { document.execCommand('copy'); listo(); } catch (e) { /* sin portapapeles */ } });
      else { t.select(); try { document.execCommand('copy'); listo(); } catch (e) { /* sin portapapeles */ } }
    });
    })();
    ir(0);
    /* Las tipografías llegan después: se vuelve a encajar el texto de la página visible. */
    function reencajar() { encajarCaso(paginas[pos], false); }
    if (document.fonts) document.fonts.ready.then(reencajar);
    window.addEventListener('resize', reencajar);
  };

  /* Escena escasa: los puntos (si hay más de uno) arriba, su texto completo a la vista y la imagen de contexto al lado.
     Reúne la ficha de entrada, el encabezado largo del bloque y los elementos, en el mismo orden y con las mismas marcas de visto. */
  function contexto(k) {
    var b = escena.bloques[k], lista = [], cabeza = '';
    if (escena.lead.length) {
      var primero = seg(escena.lead[0]);
      lista.push({ id: 'lead', label: escena.rotulo || (primero.length <= 70 ? primero : primerasPalabras(primero)), texto: segs(escena.lead), obj: (b.items[0] && b.items[0].obj) || 'documento' });
    }
    if (b.titulo && b.titulo.length) {
      var t = segs(b.titulo);
      if (t.length > 110) lista.push({ id: 'bt' + k, label: b.rotulo || primerasPalabras(t), texto: t, obj: 'documento' }); else cabeza = t;
    }
    var orden = b.tipo === 'mapa' ? b.items.filter(function (x) { return x.centro; }).concat(b.items.filter(function (x) { return !x.centro; })) : b.items;
    orden.forEach(function (it, i) { lista.push({ id: k + '-' + i, label: it.label, texto: segs(it.segs), obj: it.obj, acomp: it.acomp }); });
    var n = lista.length;
    var html = '<div class="contexto n' + n + '">' + (cabeza ? '<p class="bloque-titulo">' + esc(may(cabeza)) + '</p>' : '') +
      (n > 1 ? '<div class="ctx-puntos" role="tablist">' + lista.map(function (it, i) {
        return '<button type="button" role="tab" class="ctx-punto' + refc(it.label) + '" data-id="' + it.id + '" data-i="' + i + '" aria-selected="false" style="--d:' + (i * 0.07) + 's">' +
          '<span class="ctx-n">' + (i + 1) + '</span><span class="ctx-ico">' + svgObjeto(it.obj, 28) + '</span><span class="ctx-rotulo">' + rot(it.label) + '</span><span class="ctx-visto">' + visto + '</span>' + estado + '</button>';
      }).join('') + '</div>' : '') +
      '<article class="ctx-texto" tabindex="-1" aria-live="polite"></article>' + figura(lista.map(function (x) { return x.obj; }), n === 1 ? lista[0].acomp : null) + '</div>';
    return { html: html, lista: lista };
  }
  function activarContexto(el, lista) {
    var caja = el.querySelector('.ctx-texto'), cont = el.querySelector('.contexto'), botones = el.querySelectorAll('.ctx-punto'), pos = 0;
    function abrir(i) {
      var it = lista[i]; pos = i;
      botones.forEach(function (o, j) { o.setAttribute('aria-selected', String(j === i)); });
      caja.innerHTML = '<span class="ctx-icono">' + svgObjeto(it.obj, 84) + '</span><p class="lectura-eyebrow">' + (lista.length > 1 ? (i + 1) + ' de ' + lista.length + ' · ' : '') + rot(it.label) + '</p><p class="lectura-texto">' + rico(it.texto) + '</p>';
      if (botones[i]) botones[i].classList.add('abierta');
      /* El texto se escribe letra por letra, como en las fichas (Esteban, 31/10/2026: detalles en las 5 unidades). */
      var lt = caja.querySelector('.lectura-texto'), letras = quieto || !lt ? null : envolverLetras(lt);
      marcar(it.id); /* marcar primero: «Exploración completa» cambia la altura */
      if (!dosificar(caja, function () { encajarTexto(cont, caja); })) encajarTexto(cont, caja);
      reanimar(caja);
      if (letras) escribirLetras(lt, letras, function () {});
    }
    botones.forEach(function (o) { o.addEventListener('click', function () { abrir(Number(o.dataset.i)); }); });
    abrir(0); /* la escena nunca empieza en blanco */
    if (document.fonts) document.fonts.ready.then(function () { encajarTexto(cont, caja); });
    window.addEventListener('resize', function () { encajarTexto(cont, caja); });
    var img = el.querySelector('.ctx-arte img');
    if (img && !img.complete) img.addEventListener('load', function () { encajarTexto(cont, caja); });
  }

  /* ---------- Mapa conceptual para descargar (hoja de virtualización de Derecho de petición, 22/11/2026: «mapa conceptual con
     imagen para descarga») ----------
     Con «?escena=N&lamina=mapa», la escena se dibuja como lámina estática para la imagen PNG que se genera al producir
     (herramientas/lamina_mapa.js, Chrome local, sin servicios externos): la idea de la escena arriba, sus ramas unidas por líneas y,
     en cada rama, su rótulo y su texto literal completo; la entrada y la idea clave, si las hay. Nadie navega esta vista: el
     estudiante descarga la imagen con el botón de la escena («descarga»). */
  var modoLamina = new URLSearchParams(location.search).get('lamina') === 'mapa';
  function laminaMapa() {
    var b = escena.bloques.filter(function (x) { return x.items && x.items.length; })[0] || { items: [] }, n = b.items.length;
    var cols = n <= 4 ? n : n === 5 || n === 6 ? 3 : 4, titulo = centroTitulo();
    raiz.className = 'ova lamina-modo';
    document.documentElement.classList.add('modo-lamina');
    raiz.innerHTML = '<div class="lamina-mapa"><header class="lm-cab"><p class="lm-leccion">Unidad ' + esc(String(datos.unit)) + ' · Lección ' + esc(String(datos.lesson)) + '</p>' +
      '<p class="lm-curso">' + esc(may(String(datos.heading || '').replace(/^Lección\s+[\d.]+\.?\s*/, ''))) + '</p></header>' +
      (escena.lead.length ? '<p class="lm-intro">' + rico(segs(escena.lead)) + '</p>' : '') +
      '<div class="lm-raiz"><span class="lm-raiz-arte" aria-hidden="true">' + (b.items.slice(0, 1).map(function (it) { return svgObjeto(it.obj, 54); }).join('')) + '</span>' +
      '<span class="lm-raiz-rot">' + esc(may(titulo)) + '</span></div>' +
      '<div class="lm-ramas" style="--c:' + cols + '">' + b.items.map(function (it, i) {
        return '<section class="lm-rama t' + (i % 3) + '"><p class="lm-rot"><span class="lm-n">' + (i + 1) + '</span><span class="lm-obj" aria-hidden="true">' + svgObjeto(it.obj, 40) + '</span>' +
          '<span>' + rot(it.label) + '</span></p><p class="lm-texto">' + rico(segs(it.segs)) + '</p></section>';
      }).join('') + '</div>' +
      (escena.tail.length ? '<p class="lm-clave"><span class="clave-rotulo"><i class="fas fa-star" aria-hidden="true"></i> Idea clave</span> ' + rico(segs(escena.tail)) + '</p>' : '') +
      '<svg class="lm-lineas" aria-hidden="true"></svg></div>';
    function lineas() {
      var lam = raiz.querySelector('.lamina-mapa'), svg = lam.querySelector('.lm-lineas'), r0 = lam.getBoundingClientRect();
      var rr = lam.querySelector('.lm-raiz').getBoundingClientRect(), x0 = rr.left + rr.width / 2 - r0.left, y0 = rr.bottom - r0.top;
      svg.setAttribute('width', r0.width); svg.setAttribute('height', r0.height);
      /* La primera fila de ramas cuelga de la idea central; cada rama de las filas siguientes, de la que tiene encima en su columna,
         con un trazo corto. Antes todas salían de la idea central y la curva hacia la segunda fila asomaba por el espacio entre dos
         recuadros como una línea suelta (Derecho de petición, U1 L4, 22/11/2026). */
      var cajas = [].map.call(lam.querySelectorAll('.lm-rama'), function (s) {
        var r = s.getBoundingClientRect();
        return { x: r.left + r.width / 2 - r0.left, top: r.top - r0.top, bottom: r.bottom - r0.top };
      });
      var primeraFila = cajas.length ? Math.min.apply(null, cajas.map(function (c) { return c.top; })) : 0;
      svg.innerHTML = cajas.map(function (c) {
        if (c.top - primeraFila < 4) {
          var m = (y0 + c.top) / 2;
          return '<path d="M' + x0 + ' ' + y0 + ' C' + x0 + ' ' + m + ' ' + c.x + ' ' + m + ' ' + c.x + ' ' + c.top + '"/>';
        }
        var arriba = cajas.filter(function (o) { return o.bottom <= c.top + 1 && Math.abs(o.x - c.x) < 4; })
          .sort(function (a, z) { return z.bottom - a.bottom; })[0];
        return arriba ? '<path d="M' + c.x + ' ' + arriba.bottom + ' L' + c.x + ' ' + c.top + '"/>' : '';
      }).join('');
      window.ovaLaminaLista = true;
    }
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () { requestAnimationFrame(lineas); });
  }

  /* ---------- Escena ---------- */
  function render() {
    var propia = datos.scenes[actual];
    padre = propia.pestanas && propia.pestanas.length ? propia : null;
    if (padre && (pestana < 0 || pestana >= padre.pestanas.length)) pestana = 0;
    escena = padre ? padre.pestanas[pestana] : propia; vistos = {}; retornoFoco = null; generacion++; ultimaLectura = null;
    if (modoLamina) { laminaMapa(); return; }
    total =escena.bloques.reduce(function (a, b) { return a + (b.tipo === 'caso' ? totalCaso(b) : tablaBreve(b) ? 0 : b.items.length) + (b.titulo && b.titulo.length && segs(b.titulo).length > 110 ? 1 : 0); }, 0) + (escena.lead.length ? 1 : 0);
    var ctx = escasa(escena) ? contexto(0) : null;
    var guia = ctx ? (ctx.lista.length > 1 ? 'Elija cada punto y lea su contenido junto a la ilustración.' : 'Lea el contenido junto a la ilustración.') : guias[escena.layout === 'balanza' ? 'fichas' : escena.layout];
    /* El cuadro de una sola parte no tiene «Seguir leyendo»: su guía no lo nombra (SRPA U4-L1, 20/11/2026). */
    if (escena.layout === 'cuadro' && escena.bloques.every(function (x) { return x.tipo !== 'cuadro' || x.items.length === 1; })) guia = 'Lea la tabla: todas sus filas están a la vista.';
    if (escena.guia) guia = escena.guia;
    /* La tabla breve se ve completa: no hay pestañas que elegir. */
    if (escena.layout === 'tabla' && escena.bloques.length && escena.bloques.every(tablaBreve)) guia = 'Lea la tabla completa.';
    /* Sin nada que explorar (un solo texto a la vista o un caso) no hay barra de avance y la idea clave se ve desde el inicio. */
    var conAvance = total > 0 && !(ctx && ctx.lista.length === 1);
    /* En pantalla angosta las tarjetas que giran se recorren desplazándose (B.giro): su guía lo dice. */
    var angosta = escena.layout === 'giro' && !escena.guia ? '<span class="guia-angosta">Deslice hacia abajo: cada tarjeta se revela y se lee al pasar.</span>' : '';
    var cab = '<header class="guia"><p class="guia-texto">' + mano + '<span' + (angosta ? ' class="guia-ancha"' : '') + '>' + guia + '</span>' + angosta + '</p>' + juegoHtml() +
      (conAvance ? '<div class="avance" role="status"><span class="avance-rotulo">Exploración</span><span class="barra"><i></i></span><output>0 / ' + total + '</output></div>' : '') +
      '<button type="button" class="pantalla-completa" aria-label="Ver en pantalla completa"><i class="fas fa-expand" aria-hidden="true"></i><span>Pantalla completa</span></button>' +
      '<button type="button" class="escritura-btn" aria-pressed="true"><i class="fas fa-keyboard" aria-hidden="true"></i><span>Clic para texto fijo</span></button>' +
      /* Mapa o imagen para descargar (Juan, Ley 1826, 21/11/2026: «un botoncito que diga Descargar imagen, Descargar mapa»):
         escena.descargaMapa = {archivo, nombre, boton}; el archivo va en la carpeta de la lección. Ícono de descarga de la hoja de JP.
         Distinto de escena.descarga (SRPA, documento que la ficha remite a consultar, dentro de la escena). */
      (escena.descargaMapa ? '<a class="descarga-btn" href="' + esc(escena.descargaMapa.archivo) + '" download="' + esc(escena.descargaMapa.nombre || '') + '" target="_blank" rel="noopener">' +
        '<i class="fas fa-file-arrow-down" aria-hidden="true"></i><span>' + esc(escena.descargaMapa.boton || 'Clic para descargar') + '</span></a>' : '') +
      '</header>';
    var cuerpo = '';
    if (escena.titulo.length) cuerpo += '<p class="escena-titulo">' + esc(may(segs(escena.titulo))) + '</p>';
    if (escena.lead.length && !ctx) {
      var primero = seg(escena.lead[0]), rotLead = escena.rotulo || (primero.length <= 70 ? primero : primerasPalabras(primero));
      var objLead = (escena.bloques[0].items && escena.bloques[0].items[0] && escena.bloques[0].items[0].obj) || 'documento';
      cuerpo += fichaIntro('lead', rotLead, segs(escena.lead), objLead);
    }
    cuerpo += ctx ? '<div class="bloque bloque-contexto" data-k="0">' + ctx.html + '</div>' :
      escena.bloques.map(function (b, k) { return '<div class="bloque bloque-' + tipo(b) + (b.compacto ? ' es-compacto' : '') + '" data-k="' + k + '">' + B[tipo(b)](b, k) + '</div>'; }).join('');
    if (escena.chips.length) cuerpo += '<ul class="chips' + (escena.layout === 'lamina' && !escena.tail.length ? '' : '') + '">' + escena.chips.map(function (c, i) {
      return '<li style="--d:' + (0.4 + i * 0.1) + 's"><i class="fas fa-circle-check" aria-hidden="true"></i>' + esc(may(c)) + '</li>';
    }).join('') + '</ul>';
    /* Pie de una tabla de la ficha («Fuente. Elaboración propia», Derechos humanos, 31/10/2026): en la franja de abajo. */
    if (escena.pie && escena.pie.length) cuerpo += '<p class="escena-pie">' + esc(may(segs(escena.pie))) + '</p>';
    /* Documento que la ficha remite a consultar («(ver informes)», SRPA U2-L3, revisión del 18/11/2026): un botón que dice lo que
       hace y descarga la copia local que viaja en el paquete, con el nombre completo del documento al pie. Solo si la escena lo trae. */
    if (escena.descarga) cuerpo += '<p class="escena-descarga"><a class="boton-descarga" href="' + esc(escena.descarga.href) + '" download>' +
      '<i class="fas fa-file-arrow-down" aria-hidden="true"></i> ' + esc(escena.descarga.rotulo) + '</a><span class="descarga-nombre">' +
      esc(escena.descarga.nombre) + '</span></p>';
    if (escena.tail.length) cuerpo += '<p class="caja-clave' + (conAvance ? ' tras-completar" hidden' : '"') + '><span class="clave-rotulo"><i class="fas fa-star" aria-hidden="true"></i> ' +
      (conAvance ? 'Idea clave desbloqueada' : 'Idea clave') + '</span>' + rico(segs(escena.tail)) + '</p>';
    raiz.className = 'ova layout-' + (ctx ? 'contexto' : escena.layout === 'balanza' ? 'fichas' : escena.layout) + (embebido ? ' embebido' : '') + (embebido && leccionPadre() ? ' pc-leccion' : '') + (datos.sinHuecos ? ' sin-huecos' : '') +
      (marcoAncho() ? ' marco-ancho' : '') + (escena.siluetas ? ' con-siluetas' : '') + (datos.ventanaAmplia ? ' ventana-amplia' : '') + (datos.huecosFinos ? ' huecos-finos' : '') + (escena.descargaMapa ? ' con-descarga' : '');
    /* Ilustración de la escena en un lugar que varía (Estándares interamericanos; Esteban, 28/10/2026: «a la izquierda, a la
       derecha, en el medio o atrás… de forma embebida para que no sea invasivo»). «arte» = {img, pos}: «izq» o «der», una columna
       propia junto a la mediación; «fondo», la ilustración tenue en la esquina inferior, detrás y sin recibir clics; «centro», en
       el nodo central del mapa mental. En las mediaciones que ya muestran la ilustración (texto con ilustración, fichas), «izq»
       la pasa a la izquierda del texto. Sin «arte», la escena queda como antes. */
    var claseArte = '';
    if (datos.tituloFuera && escena.layout === 'esquema') { /* la ilustración es la raíz del mapa conceptual */ }
    else if (arteEn('izq') || arteEn('der')) {
      if (imagenActual()) claseArte = ' arte-volteado';
      else {
        cuerpo = '<figure class="arte-escena' + (escena.arte.alta ? ' arte-alta' : '') + '" aria-hidden="true"><img src="' + srcImagen(escena.arte.img) + '" alt=""></figure><div class="escenario-contenido">' + cuerpo + '</div>';
        claseArte = ' arte-lado arte-' + escena.arte.pos;
      }
    } else if (arteEn('fondo')) {
      cuerpo = '<figure class="arte-escena arte-fondo-fig" aria-hidden="true"><img src="' + srcImagen(escena.arte.img) + '" alt=""></figure>' + cuerpo;
      claseArte = ' arte-fondo';
    }
    /* Video dentro de la escena (Terminaciones; Juan, 18/11/2026: «el video a la izquierda y las afirmaciones… a la derecha, como en
       Enfoque diferencial»): «escena.video» = {src, vtt, titulo}. El botón «Ver el video del caso» («escena.boton_video») lo abre en
       una ventana. Solo si la escena lo trae. */
    if (escena.video) {
      cuerpo = '<figure class="escena-video"><video controls preload="metadata" playsinline src="' + esc(escena.video.src) + '">' +
        (escena.video.vtt ? '<track kind="subtitles" srclang="es" label="Español" src="' + esc(escena.video.vtt) + '">' : '') + '</video>' +
        (escena.video.titulo ? '<figcaption>' + esc(may(escena.video.titulo)) + '</figcaption>' : '') + '</figure><div class="escenario-contenido">' + cuerpo + '</div>';
      claseArte += ' con-video';
    }
    /* Varios videos (Terminaciones; Juan, 19/11/2026: la actividad práctica «en una sola diapositiva, el video con un popup que abra y
       al ladito las preguntas»): «escena.videos» = [{src, vtt, titulo, etiqueta}], botones a la izquierda que abren cada uno en una
       ventana. Solo si la escena lo trae. */
    if (escena.videos && escena.videos.length) {
      cuerpo = '<aside class="escena-videos" aria-label="Videos de la actividad"><p class="ev-titulo"><i class="fas fa-film" aria-hidden="true"></i> Videos de la actividad</p>' +
        escena.videos.map(function (v, i) {
          return '<button type="button" class="ev-boton" data-v="' + i + '"><i class="fas fa-circle-play" aria-hidden="true"></i><span>Ver video · ' + esc(may(v.etiqueta || v.titulo || '')) + '</span>' +
            '<i class="fas fa-circle-check ev-visto" aria-hidden="true"></i></button>';
        }).join('') + '<p class="ev-nota">Clic para abrir el video en una ventana; al cerrarlo, siga con las afirmaciones de la derecha.</p></aside>' +
        '<div class="escenario-contenido">' + cuerpo + '</div>';
      claseArte += ' con-videos';
    }
    if (escena.boton_video) cuerpo += '<p class="escena-descarga escena-video-boton"><button type="button" class="boton-descarga boton-video">' +
      '<i class="fas fa-circle-play" aria-hidden="true"></i> Ver el video del caso</button><span class="descarga-nombre">' + esc(may(escena.boton_video.titulo || '')) + '</span></p>';
    var barraP = padre ? '<div class="pestanas n' + padre.pestanas.length + '" role="tablist" aria-label="Apartados de esta página">' + padre.pestanas.map(function (p, i) {
      return '<button type="button" role="tab" id="pestana-' + i + '" class="pestana' + (i === pestana ? ' activa' : '') + (pestanaHecha(i) ? ' visto' : '') + '" data-p="' + i + '" aria-selected="' + (i === pestana) +
        '" aria-controls="panel-pestana" tabindex="' + (i === pestana ? 0 : -1) + '"><span class="pestana-letra">' + String.fromCharCode(65 + i) + '</span><span class="pestana-rotulo">' + esc(may(p.pestana || '')) +
        '</span><span class="pestana-visto">' + visto + '</span></button>';
    }).join('') + '</div>' : '';
    /* Casos con audio (Ley 1826, Samir, 22/11/2026: «que no ocupe la diapositiva sino que sea un pop up de botón con el ícono de
       audio»; «no se ve casi la ubicación… organízalo mejor»): una cinta propia debajo de la escena, sin tapar nada, con una tarjeta por
       caso (número, nombre y tema, ícono «Audio» de la hoja de JP); cada una abre el caso en una ventana. escena.casosAudio = [{id, titulo, url}]. */
    var cinta = '';
    if (escena.casosAudio && escena.casosAudio.length) {
      var palabrasHasta = function (s, n) { if (s.length <= n) return s; var c = s.slice(0, n).replace(/\s+\S*$/, ''); return c.replace(/[,;:]$/, '') + '…'; };
      cinta = '<div class="cinta-casos' + (escena.casosAudio.length > 2 ? ' muchos' : '') + '" role="group" aria-label="Casos con audio"><p class="cc-rot"><span class="cc-ico" aria-hidden="true"><i class="fas fa-headphones"></i></span>' +
        '<span><b>' + (escena.casosAudio.length === 1 ? 'Caso con audio' : 'Casos con audio') + '</b><small>Clic para escuchar' + (escena.casosAudio.length === 1 ? 'lo' : 'los') + '</small></span></p>' +
        '<div class="cc-lista">' + escena.casosAudio.map(function (c, k) {
          var m = /^([^:]+):\s*(.+)$/.exec(c.titulo), nombre = m ? m[1] : c.titulo, tema = m ? may(m[2]) : '';
          return '<button type="button" class="caso-audio-btn cc-caso" data-i="' + k + '" title="' + esc(c.titulo) + '" aria-label="Clic para escuchar el ' + esc(c.titulo) + '">' +
            '<span class="cc-num" aria-hidden="true">' + (k + 1) + '</span><span class="cc-txt"><b>' + esc(nombre) + '</b>' + (tema ? '<small>' + esc(palabrasHasta(tema, escena.casosAudio.length > 3 ? 20 : escena.casosAudio.length > 2 ? 32 : 44)) + '</small>' : '') + '</span></button>';
        }).join('') + '</div></div>';
    }
    raiz.className += cinta ? ' con-casos' : '';
    raiz.innerHTML = cab + barraP + '<section class="escenario' + claseArte + '"' + (padre ? ' id="panel-pestana" role="tabpanel" aria-labelledby="pestana-' + pestana + '"' : '') + ' aria-label="Escena ' + (actual + 1) + '">' + cuerpo + '<div class="lector" hidden></div></section>' + cinta +
      (embebido ? '' : '<nav class="nav-local" aria-label="Escenas de la lección"><button type="button" data-ir="-1"><i class="fas fa-arrow-left" aria-hidden="true"></i> Anterior</button>' +
        '<span>' + (actual + 1) + ' de ' + datos.scenes.length + '</span><button type="button" data-ir="1">Siguiente <i class="fas fa-arrow-right" aria-hidden="true"></i></button></nav>');
    var botonVideo = raiz.querySelector('.boton-video');
    if (botonVideo) botonVideo.addEventListener('click', function () { abrirVideo(escena.boton_video, botonVideo); });
    raiz.querySelectorAll('.ev-boton').forEach(function (bt) {
      bt.addEventListener('click', function () { bt.classList.add('visto'); abrirVideo(escena.videos[Number(bt.dataset.v)], bt); });
    });
    if (!conAvance) { var gP = generacion; setTimeout(function () { if (gP === generacion) { if (padre) completarPestana(); else juegoTramo(); } }, 1200); }
    if (padre) {
      var irP = function (i) { if (i === pestana) return; pestana = i; render(); var n = raiz.querySelector('.pestana[data-p="' + i + '"]'); if (n) n.focus(); };
      raiz.querySelectorAll('.pestana').forEach(function (bt) {
        bt.addEventListener('click', function () { irP(Number(bt.dataset.p)); });
        bt.addEventListener('keydown', function (e) {
          var n = padre.pestanas.length, i = Number(bt.dataset.p), j = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i + n - 1) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
          if (j < 0) return; e.preventDefault(); irP(j);
        });
      });
    }
    raiz.querySelectorAll('.bloque').forEach(function (el) {
      var k = Number(el.dataset.k), b = escena.bloques[k];
      if (ctx) activarContexto(el, ctx.lista); else B[tipo(b)].activar(b, k, el);
      marcarAlertas(b, el);
    });
    /* Lo ya leído en este navegador se conserva al volver a la página (revisora del SRPA, 13/11/2026: «me devolví para revisar
       algunos cuadros y me indicaba de nuevo leer elementos que ya había leído»). Los puntos ya estaban guardados por lección
       («datos.juego»); ahora también la marca de visto, el avance y lo que desbloquea, sin repetir el confeti ni los puntos. */
    if (datos.juego) {
      var previo = juegoEstado(), pref = claveLectura();
      restaurando = true;
      Object.keys(previo.v).forEach(function (c) {
        var id = c.slice(pref.length);
        if (c.indexOf(pref) === 0 && raiz.querySelector('[data-id="' + id.replace(/"/g, '') + '"]')) marcarYa(id);
      });
      restaurando = false;
    }
    raiz.querySelectorAll('.intro').forEach(function (b) {
      b.addEventListener('click', function () { leer(b.dataset.rotulo, b.dataset.texto, b.dataset.obj, b); marcar(b.dataset.id); });
    });
    raiz.querySelector('.lector').addEventListener('click', function (e) { if (e.target.classList.contains('lector')) cerrarLector(); });
    raiz.querySelector('.pantalla-completa').addEventListener('click', pantallaCompleta);
    /* «Escritura animada» / «Texto inmediato» (revisores, 10/11/2026): la preferencia vale para todo el curso en este navegador.
       Revisión de la Fiscalía del 13/11/2026 (Jennifer: «le coloquemos ahí texto fijo… o texto animado… bajar un poquito el tamaño
       de la fuente y escribirle allí: clic para texto animado, clic para texto fijo»; «siempre mencionar el clic»): el botón dice
       lo que hace el clic, no el modo en que está. */
    /* Ventana del caso con audio: el reproductor del caso (casos/index.html?caso=…) sobre la escena, con «Cerrar» visible y Escape. */
    raiz.querySelectorAll('.caso-audio-btn').forEach(function (bt) {
      bt.addEventListener('click', function () {
        var c = escena.casosAudio[Number(bt.dataset.i)], previo = document.activeElement;
        var v = document.createElement('div');
        v.className = 'ventana-caso'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', c.titulo);
        v.innerHTML = '<div class="vc-caja"><div class="vc-cab"><i class="fas fa-headphones" aria-hidden="true"></i><span class="vc-tit">Caso con audio</span>' +
          '<button type="button" class="vc-cerrar"><i class="fas fa-xmark" aria-hidden="true"></i> Cerrar</button></div>' +
          '<iframe src="' + esc(c.url) + '" title="' + esc(c.titulo) + '" allow="fullscreen; autoplay" allowfullscreen></iframe></div>';
        raiz.appendChild(v);
        bt.classList.add('visto');
        var nu = bt.querySelector('.cc-num'); if (nu) nu.innerHTML = '<i class="fas fa-check"></i>';
        var cerrar = function () { document.removeEventListener('keydown', tecla); v.remove(); if (previo && previo.focus) previo.focus(); };
        var tecla = function (e) { if (e.key === 'Escape') cerrar(); };
        v.querySelector('.vc-cerrar').addEventListener('click', cerrar);
        v.addEventListener('click', function (e) { if (e.target === v) cerrar(); });
        document.addEventListener('keydown', tecla);
        v.querySelector('.vc-cerrar').focus();
      });
    });
    var bEsc = raiz.querySelector('.escritura-btn');
    function pintarEscritura() {
      var on = escrituraAnimada();
      bEsc.setAttribute('aria-pressed', String(on));
      bEsc.querySelector('span').textContent = on ? 'Clic para texto fijo' : 'Clic para texto animado';
      bEsc.setAttribute('aria-label', on ? 'Texto animado: clic para mostrar el texto fijo, de una vez' : 'Texto fijo: clic para volver al texto animado');
    }
    if (bEsc) {
      pintarEscritura();
      bEsc.addEventListener('click', function () {
        try { localStorage.setItem(CLAVE_ESC, escrituraAnimada() ? 'inmediata' : 'animada'); } catch (e) {}
        if (!escrituraAnimada()) completarEscrituras();
        pintarEscritura();
      });
    }
    estadoPantalla();
    contrasteIconos();
    midiendo(function () { organizarGiros(); encajarTarjetas(); ajustarExtractos(); });
    /* Con las fuentes ya cargadas (Roboto es más ancha que la de reserva), todo se vuelve a encajar: el texto que cabía con la
       fuente de reserva podía quedar cortado. */
    if (document.fonts) document.fonts.ready.then(function () { window.dispatchEvent(new Event('resize')); });
    /* En una carga en frío (el iframe de Genially) una fuente puede terminar después de fonts.ready: se vuelve a encajar al
       terminar cada carga de fuentes. Las funciones de encaje parten siempre de cero, así que repetirlas no acumula cambios. */
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', function () { window.dispatchEvent(new Event('resize')); });
    if (!embebido) {
      var nav = raiz.querySelector('.nav-local');
      nav.querySelector('[data-ir="-1"]').disabled = actual === 0;
      nav.querySelector('[data-ir="1"]').disabled = actual === datos.scenes.length - 1;
      nav.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-ir]'); if (!b) return;
        actual = Math.max(0, Math.min(datos.scenes.length - 1, actual + Number(b.dataset.ir))); pestana = 0; render();
      });
    }
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarLector(); });
  render();
})();
