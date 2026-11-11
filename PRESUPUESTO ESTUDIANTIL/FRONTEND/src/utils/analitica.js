// analitica.js
function guardarEvento(registro) {
  const eventos = JSON.parse(localStorage.getItem('eventos') || '[]');
  eventos.unshift(registro);
  localStorage.setItem('eventos', JSON.stringify(eventos));
}

export function track(evento, props) {
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
