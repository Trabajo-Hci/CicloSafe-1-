document.addEventListener('DOMContentLoaded', () => {
  const btnModoDiscreto = document.getElementById('btnModoDiscreto');
  const btnToggleNightCard = document.getElementById('btnToggleNightCard');

  function actualizarModoDiscreto() {
    const estaActivo = document.body.classList.toggle('modo-discreto');

    if (btnModoDiscreto) {
      btnModoDiscreto.textContent = estaActivo ? 'Modo Discreto: ON' : 'Modo Discreto: OFF';
      btnModoDiscreto.setAttribute('aria-pressed', String(estaActivo));
    }

    if (btnToggleNightCard) {
      btnToggleNightCard.setAttribute('aria-pressed', String(estaActivo));
      btnToggleNightCard.textContent = estaActivo
        ? 'Desactivar Modo Discreto en esta página'
        : 'Alternar Modo Discreto en esta página';
    }
  }

  btnModoDiscreto?.addEventListener('click', actualizarModoDiscreto);
  btnToggleNightCard?.addEventListener('click', actualizarModoDiscreto);

  const navbar = document.querySelector('.navbar');
  const navToggle = document.getElementById('navToggle');
  const esPantallaChica = window.matchMedia('(max-width: 1024px)');

  function cambiarEstadoMenu(abierto) {
    if (!navbar || !navToggle) return;
    navbar.classList.toggle('nav-open', abierto);
    navToggle.setAttribute('aria-expanded', String(abierto));
    navToggle.setAttribute('aria-label', abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  }

  if (navbar && navToggle) {
    navToggle.addEventListener('click', () => {
      cambiarEstadoMenu(!navbar.classList.contains('nav-open'));
    });

    navbar.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (esPantallaChica.matches) cambiarEstadoMenu(false);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navbar.classList.contains('nav-open')) {
        cambiarEstadoMenu(false);
        navToggle.focus();
      }
    });

    esPantallaChica.addEventListener('change', (e) => {
      if (!e.matches) cambiarEstadoMenu(false);
    });
  }

  const rutasBase = {
    'miraflores-upc': {
      titulo: 'Av. Arequipa → Ciclovía Velasco Astete → UPC',
      minutos: 28,
      km: 8.4,
      segregada: '92% Ciclovía Segregada',
      detalle: 'Tramo con árboles y vigilancia constante; evita cruces conflictivos.'
    },
    'miraflores-centro': {
      titulo: 'Av. Arequipa → Av. Garcilaso',
      minutos: 24,
      km: 7.1,
      segregada: '96% Ciclovía Segregada',
      detalle: 'Ruta continua con semáforos para bicicletas en los cruces principales.'
    },
    'miraflores-sanborja': {
      titulo: 'Av. Angamos → Av. San Borja Norte → Pentagonito',
      minutos: 19,
      km: 5.6,
      segregada: '89% Ciclovía Segregada',
      detalle: 'Recorrido por zonas residenciales con buena iluminación.'
    },
    'sanisidro-upc': {
      titulo: 'Av. Aramburú → Av. República de Panamá → Surco',
      minutos: 26,
      km: 7.9,
      segregada: '85% Ciclovía Segregada',
      detalle: 'Busca calles más tranquilas para no ir pegado a Javier Prado.'
    },
    'sanisidro-centro': {
      titulo: 'Parque El Olivar → Av. Salaverry → Paseo Colón',
      minutos: 21,
      km: 6.3,
      segregada: '95% Ciclovía Segregada',
      detalle: 'Buena sombra y tramo segregado en gran parte del recorrido.'
    },
    'sanisidro-sanborja': {
      titulo: 'Av. Andrés Reyes → Puente Quiñones → San Borja Sur',
      minutos: 14,
      km: 4.1,
      segregada: '91% Ciclovía Segregada',
      detalle: 'Trayecto corto con cruces señalizados.'
    },
    'pueblolibre-upc': {
      titulo: 'Av. Bolívar → Av. Salaverry → Av. Canadá → Surco',
      minutos: 39,
      km: 11.8,
      segregada: '82% Ciclovía Segregada',
      detalle: 'Ruta larga pensada para evitar vías rápidas sin protección.'
    },
    'pueblolibre-centro': {
      titulo: 'Av. Brasil → Plaza Bolognesi → Centro',
      minutos: 17,
      km: 4.8,
      segregada: '94% Ciclovía Segregada',
      detalle: 'Avance directo por el eje de la Av. Brasil.'
    },
    'pueblolibre-sanborja': {
      titulo: 'Av. Mariátegui → Av. Salaverry → San Borja',
      minutos: 27,
      km: 8.0,
      segregada: '87% Ciclovía Segregada',
      detalle: 'Alternativa por vías con menor carga vehicular pesada.'
    }
  };

  const selectOrigen = document.getElementById('selectOrigen');
  const selectDestino = document.getElementById('selectDestino');
  const chkSegregada = document.getElementById('chkSegregada');
  const chkSombra = document.getElementById('chkSombra');
  const chkIluminacion = document.getElementById('chkIluminacion');
  const chkEvitarRiesgo = document.getElementById('chkEvitarRiesgo');

  function calcularRuta() {
    if (!selectOrigen || !selectDestino) return;

    const clave = `${selectOrigen.value}-${selectDestino.value}`;
    const base = rutasBase[clave] || rutasBase['miraflores-upc'];

    let minutosAjustados = base.minutos;
    let kmAjustados = base.km;
    const criterios = [];

    if (chkSegregada?.checked) {
      criterios.push('ciclovía segregada');
    } else {
      minutosAjustados = Math.max(10, minutosAjustados - 2);
      kmAjustados = Number((kmAjustados - 0.5).toFixed(1));
    }

    if (chkSombra?.checked) {
      minutosAjustados += 1;
      criterios.push('sombra');
    }

    if (chkIluminacion?.checked) {
      minutosAjustados += 1;
      criterios.push('iluminación nocturna');
    }

    if (chkEvitarRiesgo?.checked) {
      minutosAjustados += 2;
      kmAjustados = Number((kmAjustados + 0.4).toFixed(1));
      criterios.push('evitar zonas críticas');
    }

    const rutaTitulo = document.getElementById('rutaTitulo');
    const rutaTiempo = document.getElementById('rutaTiempo');
    const rutaDistancia = document.getElementById('rutaDistancia');
    const rutaBadge = document.getElementById('rutaBadge');
    const rutaDetalle = document.getElementById('rutaDetalle');

    if (rutaTitulo) rutaTitulo.textContent = base.titulo;
    if (rutaTiempo) rutaTiempo.textContent = `${minutosAjustados} min`;
    if (rutaDistancia) rutaDistancia.textContent = `${kmAjustados} km`;
    if (rutaBadge) {
      rutaBadge.textContent = chkSegregada?.checked === false
        ? 'Ruta más directa (menor segregación)'
        : base.segregada;
    }
    if (rutaDetalle) {
      const resumenFiltros = criterios.length ? criterios.join(', ') : 'sin filtros extra';
      rutaDetalle.textContent = `${base.detalle} Filtros aplicados: ${resumenFiltros}.`;
    }
  }

  [selectOrigen, selectDestino, chkSegregada, chkSombra, chkIluminacion, chkEvitarRiesgo]
    .filter(Boolean)
    .forEach((control) => control.addEventListener('change', calcularRuta));

  const btnDescargarOffline = document.getElementById('btnDescargarOffline');
  const offlineStatus = document.getElementById('offlineStatus');

  if (btnDescargarOffline && offlineStatus) {
    btnDescargarOffline.addEventListener('click', () => {
      const horaActual = new Date().toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit'
      });
      offlineStatus.textContent = `Mapa guardado (4.2 MB) · Actualizado a las ${horaActual}`;
      btnDescargarOffline.textContent = 'Mapa Offline Listo';
    });
  }

  const botonesAlerta = document.querySelectorAll('.sim-btn');
  const monitorBadge = document.getElementById('monitorEstadoBadge');
  const monitorTimer = document.getElementById('monitorTimer');
  const monitorMensaje = document.getElementById('monitorMensaje');
  const hapticBar = document.getElementById('hapticBar');

  const escenarios = {
    giro: {
      claseBadge: 'badge badge-safe',
      estado: 'Audio izq. + 1 vibración',
      tiempo: 'Latencia: 0.2 s',
      mensaje: 'A 40 m: gira a la izquierda hacia la ciclovía de Av. Salaverry.'
    },
    bache: {
      claseBadge: 'badge badge-warn',
      estado: 'Alerta preventiva',
      tiempo: 'Latencia: 0.4 s',
      mensaje: 'A 25 m: bache reportado a la derecha. Baja un poco el ritmo.'
    },
    bloqueo: {
      claseBadge: 'badge badge-danger',
      estado: 'Bloqueo · Ruta recalculada',
      tiempo: 'Recálculo: 1.8 s',
      mensaje: 'Ciclovía bloqueada adelante. Te paso a una calle paralela en 1.8 s.'
    }
  };

  botonesAlerta.forEach((boton) => {
    boton.addEventListener('click', () => {
      botonesAlerta.forEach((b) => b.classList.remove('is-active'));
      boton.classList.add('is-active');

      if (hapticBar) {
        hapticBar.classList.remove('haptic-active');
        requestAnimationFrame(() => {
          hapticBar.classList.add('haptic-active');
        });
        setTimeout(() => hapticBar.classList.remove('haptic-active'), 1400);
      }

      const info = escenarios[boton.dataset.evento];
      if (!info || !monitorBadge || !monitorTimer || !monitorMensaje) return;

      monitorBadge.className = info.claseBadge;
      monitorBadge.textContent = info.estado;
      monitorTimer.textContent = info.tiempo;
      monitorMensaje.textContent = info.mensaje;
    });
  });

  const btnSOS = document.getElementById('btnSOS');
  const sosFeedback = document.getElementById('sosFeedback');
  let timerSOS = null;

  if (btnSOS && sosFeedback) {
    btnSOS.addEventListener('click', () => {
      if (timerSOS) clearInterval(timerSOS);

      let restante = 3;
      btnSOS.disabled = true;
      sosFeedback.textContent = `Enviando ubicación en ${restante} s...`;

      timerSOS = setInterval(() => {
        restante -= 1;
        if (restante > 0) {
          sosFeedback.textContent = `Enviando ubicación en ${restante} s...`;
        } else {
          clearInterval(timerSOS);
          timerSOS = null;
          sosFeedback.textContent = 'Alerta enviada: ubicación compartida con contactos y Serenazgo.';
          btnSOS.disabled = false;
          btnSOS.textContent = 'Probar SOS de nuevo';
        }
      }, 1000);
    });
  }

  function escaparHTML(texto) {
    return String(texto ?? '')
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"');
  }

  const botonesVoz = document.querySelectorAll('.voice-cmd');
  const feedComunidad = document.getElementById('feedComunidad');

  botonesVoz.forEach((boton) => {
    boton.addEventListener('click', () => {
      if (!feedComunidad) return;

      const esCritico = boton.dataset.tipo === 'danger';
      const descripcion = boton.dataset.texto || 'Reporte registrado por voz.';

      const articulo = document.createElement('article');
      articulo.className = `feed-item ${esCritico ? 'feed-danger' : 'feed-warn'}`;
      articulo.innerHTML = `
        <div>
          <span class="badge ${esCritico ? 'badge-danger' : 'badge-warn'}">Voz · Recién reportado</span>
          <p>${escaparHTML(descripcion)}</p>
        </div>
        <button type="button" class="btn-vote" data-votes="1">Validar (1)</button>
      `;

      feedComunidad.prepend(articulo);
    });
  });

  feedComunidad?.addEventListener('click', (e) => {
    const btnVotar = e.target.closest('.btn-vote');
    if (!btnVotar) return;

    const votosActuales = Number(btnVotar.dataset.votes || 0) + 1;
    btnVotar.dataset.votes = String(votosActuales);
    btnVotar.classList.add('is-voted');
    btnVotar.textContent = `Validar (${votosActuales})`;
  });

  const filtroParqueo = document.getElementById('filtroParqueo');
  const itemsParqueo = document.querySelectorAll('.parking-item');
  const parqueoFeedback = document.getElementById('parqueoFeedback');

  if (filtroParqueo) {
    filtroParqueo.addEventListener('change', () => {
      const seleccion = filtroParqueo.value;
      let visibles = 0;

      itemsParqueo.forEach((item) => {
        const categorias = item.dataset.categoria || '';
        const coincide = seleccion === 'todos' || categorias.includes(seleccion);
        item.style.display = coincide ? 'flex' : 'none';
        if (coincide) visibles += 1;
      });

      if (parqueoFeedback) {
        const etiqueta = filtroParqueo.options[filtroParqueo.selectedIndex]?.text || seleccion;
        parqueoFeedback.textContent = seleccion === 'todos'
          ? `${visibles} cicloparqueaderos disponibles.`
          : `${visibles} resultado(s) para "${etiqueta}".`;
      }
    });
  }

  const btnExportarCSV = document.getElementById('btnExportarCSV');
  const exportFeedback = document.getElementById('exportFeedback');

  if (btnExportarCSV && exportFeedback) {
    btnExportarCSV.addEventListener('click', () => {
      const filas = [['ID', 'Distrito / Eje Vial', 'Incidencia', 'Severidad', 'Estado']];

      document.querySelectorAll('.data-table tbody tr').forEach((fila) => {
        const columnas = Array.from(fila.querySelectorAll('td')).map(
          (celda) => `"${celda.textContent.trim().replace(/"/g, '""')}"`
        );
        if (columnas.length) filas.push(columnas);
      });

      const contenidoCSV = filas.map((f) => f.join(',')).join('\n');
      const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
      const urlDescarga = URL.createObjectURL(blob);

      const linkDescarga = document.createElement('a');
      linkDescarga.href = urlDescarga;
      linkDescarga.download = 'ciclosafe_incidencias_lima.csv';
      document.body.appendChild(linkDescarga);
      linkDescarga.click();
      linkDescarga.remove();
      setTimeout(() => URL.revokeObjectURL(urlDescarga), 1000);

      exportFeedback.textContent = 'CSV descargado: ciclosafe_incidencias_lima.csv';
    });
  }

  const imgsPrototipo = document.querySelectorAll('.media-frame img');
  if (imgsPrototipo.length > 0) {
    const visor = document.createElement('div');
    visor.className = 'lightbox-overlay';
    visor.setAttribute('role', 'dialog');
    visor.setAttribute('aria-modal', 'true');
    visor.setAttribute('aria-label', 'Vista ampliada de imagen');
    visor.setAttribute('tabindex', '-1');
    visor.innerHTML = '<button type="button" class="lightbox-close" aria-label="Cerrar imagen ampliada">Cerrar</button><img src="" alt="" />';
    document.body.appendChild(visor);

    const visorImg = visor.querySelector('img');
    const btnCerrarVisor = visor.querySelector('.lightbox-close');
    let elementoAnterior = null;

    const cerrarVisor = () => {
      visor.classList.remove('active');
      if (elementoAnterior) elementoAnterior.focus();
    };

    const abrirVisor = (img) => {
      elementoAnterior = img;
      visorImg.src = img.currentSrc || img.src;
      visorImg.alt = img.alt;
      visor.classList.add('active');
      btnCerrarVisor.focus();
    };

    imgsPrototipo.forEach((img) => {
      img.addEventListener('click', () => abrirVisor(img));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          abrirVisor(img);
        }
      });
    });

    btnCerrarVisor.addEventListener('click', cerrarVisor);
    visor.addEventListener('click', (e) => {
      if (e.target === visor) cerrarVisor();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && visor.classList.contains('active')) cerrarVisor();
    });
  }
});