// analitica.js
async function guardarEvento(registro) {
  try {
    const token = localStorage.getItem('token')
    await fetch('http://localhost:8000/eventos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ nombre: registro.evento, propiedades: registro.props })
    })
  } catch (e) {
    console.warn('Error enviando evento al backend:', e)
  }
}

export function track(evento, props) {
  const registro = {
    evento, props, fecha: new Date().toISOString()
  };
  guardarEvento(registro);
  console.log('[evento]', registro);
}

