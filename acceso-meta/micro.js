(function () {
  'use strict';

  var TEXTO_COPIADO = '¡Copiado!';
  var TEXTO_FALLO = 'Copialo a mano';

  function tieneClase(el, nombre) {
    return (' ' + el.className + ' ').indexOf(' ' + nombre + ' ') !== -1;
  }

  function buscarContenedor(boton) {
    var el = boton.parentNode;
    while (el && el.nodeType === 1) {
      if (tieneClase(el, 'm-copiar')) { return el; }
      el = el.parentNode;
    }
    return null;
  }

  function buscarTexto(contenedor) {
    var hijos = contenedor.getElementsByTagName('*');
    var i;
    for (i = 0; i < hijos.length; i++) {
      if (tieneClase(hijos[i], 'm-texto')) { return hijos[i]; }
    }
    return null;
  }

  function copiarViejo(texto) {
    var ta = document.createElement('textarea');
    var ok = false;
    ta.value = texto;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '-9999px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    try {
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, texto.length);
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  function preparar(boton) {
    var original = boton.textContent;
    var timer = null;

    function avisar(leyenda) {
      boton.textContent = leyenda;
      if (timer) { window.clearTimeout(timer); }
      timer = window.setTimeout(function () {
        boton.textContent = original;
        timer = null;
      }, 2000);
    }

    boton.addEventListener('click', function () {
      var contenedor = buscarContenedor(boton);
      var bloque = contenedor ? buscarTexto(contenedor) : null;
      var texto;
      if (!bloque) { return; }
      texto = (bloque.textContent || bloque.innerText || '').replace(/^\s+|\s+$/g, '');

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(function () {
          avisar(TEXTO_COPIADO);
        }, function () {
          avisar(copiarViejo(texto) ? TEXTO_COPIADO : TEXTO_FALLO);
        });
      } else {
        avisar(copiarViejo(texto) ? TEXTO_COPIADO : TEXTO_FALLO);
      }
    }, false);
  }

  var botones = document.querySelectorAll('button.m-copiar-boton');
  var i;
  for (i = 0; i < botones.length; i++) {
    preparar(botones[i]);
  }
})();
