<template>
  <div class="contenedor-eventos">
    <h2>Registro de Eventos de Telemetría</h2>
    <p class="descripcion">Tabla para inspección de eventos disparados.</p>

    <div v-if="cargando" class="cargando">Cargando eventos...</div>
    <div v-else-if="eventos.length === 0" class="vacio">No hay eventos registrados aún.</div>

    <table v-else class="tabla-eventos">
      <thead>
        <tr>
          <th>Evento</th>
          <th>Propiedades</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in eventos" :key="e.id">
          <td class="nombre-evento">{{ e.nombre }}</td>
          <td class="props-evento">
            <code>{{ JSON.stringify(e.propiedades) }}</code>
          </td>
          <td class="fecha-evento">{{ formatearFecha(e.fecha) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const eventos = ref([])
const cargando = ref(false)

async function cargarEventos() {
  cargando.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:8000/eventos', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
    if (res.ok) {
      eventos.value = await res.json()
    }
  } catch (error) {
    console.error('Error cargando eventos:', error)
  } finally {
    cargando.value = false
  }
}

function formatearFecha(f) {
  if (!f) return ''
  const d = new Date(f)
  return d.toLocaleString()
}

onMounted(() => {
  cargarEventos()
})
</script>

<style scoped>
.contenedor-eventos {
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
  font-family: sans-serif;
}

h2 {
  color: #1e293b;
  margin-bottom: 5px;
}

.descripcion {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 20px;
}

.tabla-eventos {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  font-size: 14px;
}

.tabla-eventos th,
.tabla-eventos td {
  border: 1px solid #cbd5e1;
  padding: 10px 12px;
  text-align: left;
}

.tabla-eventos th {
  background-color: #f1f5f9;
  color: #334155;
  font-weight: 600;
}

.tabla-eventos tr:nth-child(even) {
  background-color: #f8fafc;
}

.nombre-evento {
  font-weight: 600;
  color: #0f172a;
}

.props-evento code {
  background-color: #f1f5f9;
  padding: 3px 6px;
  border-radius: 4px;
  color: #0284c7;
  font-family: monospace;
}

.fecha-evento {
  color: #64748b;
  white-space: nowrap;
}

.cargando,
.vacio {
  padding: 20px;
  color: #64748b;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  text-align: center;
}
</style>

