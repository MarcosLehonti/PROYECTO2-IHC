// analitica.js
function guardarEvento(registro) {
  const eventos = JSON.parse(localStorage.getItem('eventos') || '[]');
  eventos.unshift(registro);
  localStorage.setItem('eventos', JSON.stringify(eventos));
}

export function track(evento, props = {}) {
  const registro = {
    evento, props, fecha: new Date().toISOString()
  };
  guardarEvento(registro);
  console.log('[evento]', registro);
}

export function obtenerEventos() {
  return JSON.parse(localStorage.getItem('eventos') || '[]');
}

export function limpiarEventos() {
  localStorage.removeItem('eventos');
}

// Helper para calcular embudos de conversión para la vista /analitica
export function calcularEmbudo(pasos) {
  const eventos = obtenerEventos();
  const conteos = pasos.map(p => ({
    nombre: p.nombre,
    etiqueta: p.etiqueta,
    evento: p.evento,
    color: p.color || '#2563EB',
    conteo: eventos.filter(e => e.evento === p.evento).length
  }));

  const inicial = conteos[0]?.conteo || 0;
  return conteos.map((paso, idx) => {
    const anterior = idx === 0 ? paso.conteo : conteos[idx - 1].conteo;
    const conversionGlobal = inicial > 0 ? Math.round((paso.conteo / inicial) * 100) : 0;
    const caida = anterior > 0 ? Math.round(((anterior - paso.conteo) / anterior) * 100) : 0;
    return {
      ...paso,
      conversionGlobal,
      caida: idx === 0 ? 0 : Math.max(caida, 0)
    };
  });
}
