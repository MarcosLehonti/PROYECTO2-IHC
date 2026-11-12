<template>
  <div class="analitica-contenedor">
    <div class="analitica-cabecera">
      <div>
        <div class="badge-modulo">Módulo de Analítica UX</div>
        <h1 class="analitica-titulo">📊 Embudos de Conversión y Telemetría</h1>
        <p class="analitica-subtitulo">
          Muestra en qué pasos del recorrido se traban o abandonan los estudiantes.
        </p>
      </div>
      <div class="analitica-acciones-header">
        <router-link to="/movimientos" class="btn-volver-dashboard">
          ← Volver a Mis Movimientos
        </router-link>
        <button type="button" class="btn-actualizar" @click="actualizarMetricas">
          ↺ Actualizar
        </button>
        <button type="button" class="btn-limpiar" @click="borrarHistorial">
          🗑 Limpiar datos
        </button>
      </div>
    </div>

    <!-- KPIs Rápidos -->
    <div class="grid-kpis">
      <div class="kpi-card">
        <span class="kpi-label">Total eventos capturados</span>
        <strong class="kpi-valor texto-azul">{{ listaEventos.length }}</strong>
        <span class="kpi-sub">En almacenamiento local</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Flujos con embudo activo</span>
        <strong class="kpi-valor texto-verde">3</strong>
        <span class="kpi-sub">Gasto, Metas y Categorías</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Eventos de freno / error</span>
        <strong class="kpi-valor texto-rojo">{{ totalErrores }}</strong>
        <span class="kpi-sub">Alertas, cancelaciones y validaciones</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Tasa éxito Registro Gasto</span>
        <strong class="kpi-valor texto-naranja">{{ conversionGasto }}%</strong>
        <span class="kpi-sub">Conversión final del embudo</span>
      </div>
    </div>

    <!-- SECCIÓN DE EMBUDOS PRINCIPALES -->
    <div class="seccion-embudos">
      <h2 class="subtitulo-seccion">Embudos de Conversión por Flujo Principal</h2>

      <div class="grid-embudos">
        <!-- EMBUDO 1: Registro de Gasto con Aviso de Límite (Tarea 9) -->
        <div class="card-embudo">
          <div class="card-embudo-header">
            <div>
              <h3 class="embudo-nombre">1. Flujo: Registro de Gasto y Aviso de Límite</h3>
              <span class="embudo-desc">Recorrido desde la intención hasta el guardado en base de datos.</span>
            </div>
            <span class="badge-flujo">Tarea 9</span>
          </div>

          <div class="pasos-embudo">
            <div v-for="(paso, i) in embudoGasto" :key="i" class="paso-item">
              <div class="paso-cabecera">
                <span class="paso-etiqueta">
                  <span class="circulo-indicador circulo-amarillo"></span>
                  Paso {{ i + 1 }}: {{ paso.etiqueta }}
                </span>
                <span class="paso-conteo"><strong>{{ paso.conteo }}</strong> eventos ({{ paso.conversionGlobal }}%)</span>
              </div>
              <div class="barra-contenedor">
                <div class="barra-relleno" :style="{ width: Math.max(paso.conversionGlobal, 4) + '%', backgroundColor: paso.color }"></div>
              </div>
              <div v-if="i > 0 && paso.caida > 0" class="badge-caida">
                🔻 Caída entre pasos: <strong>{{ paso.caida }}%</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- EMBUDO 2: Metas de Ahorro - Asignación (Tarea 8) -->
        <div class="card-embudo">
          <div class="card-embudo-header">
            <div>
              <h3 class="embudo-nombre">2. Flujo: Metas de Ahorro (Asignación)</h3>
              <span class="embudo-desc">Medición de intentos de asignación y retención de fondos.</span>
            </div>
            <span class="badge-flujo">Tarea 8</span>
          </div>

          <div class="pasos-embudo">
            <div v-for="(paso, i) in embudoMetas" :key="i" class="paso-item">
              <div class="paso-cabecera">
                <span class="paso-etiqueta">
                  <span class="circulo-indicador circulo-amarillo"></span>
                  Paso {{ i + 1 }}: {{ paso.etiqueta }}
                </span>
                <span class="paso-conteo"><strong>{{ paso.conteo }}</strong> eventos ({{ paso.conversionGlobal }}%)</span>
              </div>
              <div class="barra-contenedor">
                <div class="barra-relleno" :style="{ width: Math.max(paso.conversionGlobal, 4) + '%', backgroundColor: paso.color }"></div>
              </div>
              <div v-if="i > 0 && paso.caida > 0" class="badge-caida">
                🔻 Caída entre pasos: <strong>{{ paso.caida }}%</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- EMBUDO 3: Presupuesto por Categoría (Tarea 7 / 9) -->
        <div class="card-embudo">
          <div class="card-embudo-header">
            <div>
              <h3 class="embudo-nombre">3. Flujo: Asignación de Presupuesto por Categoría</h3>
              <span class="embudo-desc">Control de límites mensuales fijados por los estudiantes.</span>
            </div>
            <span class="badge-flujo">Tarea 7</span>
          </div>

          <div class="pasos-embudo">
            <div v-for="(paso, i) in embudoCategorias" :key="i" class="paso-item">
              <div class="paso-cabecera">
                <span class="paso-etiqueta">
                  <span class="circulo-indicador circulo-amarillo"></span>
                  Paso {{ i + 1 }}: {{ paso.etiqueta }}
                </span>
                <span class="paso-conteo"><strong>{{ paso.conteo }}</strong> eventos ({{ paso.conversionGlobal }}%)</span>
              </div>
              <div class="barra-contenedor">
                <div class="barra-relleno" :style="{ width: Math.max(paso.conversionGlobal, 4) + '%', backgroundColor: paso.color }"></div>
              </div>
              <div v-if="i > 0 && paso.caida > 0" class="badge-caida">
                🔻 Caída entre pasos: <strong>{{ paso.caida }}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SECCIÓN DE ERRORES Y FRENOS (CÍRCULOS ROJOS) -->
    <div class="seccion-frenos">
      <h2 class="subtitulo-seccion">🔴 Eventos de Freno, Validación y Error</h2>
      <p class="desc-frenos">Puntos de fricción que impidieron al estudiante completar la tarea con éxito:</p>

      <div class="grid-frenos">
        <div class="card-freno">
          <div class="freno-icono">⚠️</div>
          <div class="freno-info">
            <h4 class="freno-titulo">Cancelado por Límite</h4>
            <p class="freno-desc">Estudiante canceló el guardado al ver que superaría el presupuesto de categoría.</p>
            <span class="freno-conteo texto-naranja">{{ contarEvento('presupuesto_gasto_cancelado_limite') }} cancelaciones</span>
          </div>
        </div>

        <div class="card-freno">
          <div class="freno-icono">🚫</div>
          <div class="freno-info">
            <h4 class="freno-titulo">Fondos Insuficientes en Metas</h4>
            <p class="freno-desc">Intento de apartar dinero mayor al saldo disponible real en cuenta.</p>
            <span class="freno-conteo texto-rojo">{{ contarEvento('presupuesto_meta_error_fondos') }} bloqueos</span>
          </div>
        </div>

        <div class="card-freno">
          <div class="freno-icono">✏️</div>
          <div class="freno-info">
            <h4 class="freno-titulo">Validación de Formulario Fallida</h4>
            <p class="freno-desc">Campos vacíos o montos menores a 0 en el formulario de gasto o metas.</p>
            <span class="freno-conteo texto-rojo">{{ contarEvento('presupuesto_gasto_error_validacion') + contarEvento('presupuesto_meta_error_validacion') }} errores</span>
          </div>
        </div>

        <div class="card-freno">
          <div class="freno-icono">🔍</div>
          <div class="freno-info">
            <h4 class="freno-titulo">Búsqueda / Filtro sin Resultados</h4>
            <p class="freno-desc">El estudiante aplicó un filtro que no arrojó movimientos en la tabla.</p>
            <span class="freno-conteo texto-azul">{{ contarEvento('presupuesto_busqueda_sin_resultados') }} veces</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLA DE EVENTOS RECIENTES -->
    <div class="seccion-tabla-eventos">
      <h2 class="subtitulo-seccion">Registro Cronológico de Eventos</h2>
      <div v-if="listaEventos.length === 0" class="tabla-vacia">
        Aún no se han registrado eventos. Interactúa con la aplicación para ver la telemetría en tiempo real.
      </div>
      <table v-else class="tabla-telemetria">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Evento</th>
            <th>Propiedades Mínimas</th>
            <th>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ev, idx) in listaEventos.slice(0, 15)" :key="idx">
            <td>
              <span :class="['badge-tipo-evento', esError(ev.evento) ? 'badge-error' : 'badge-exito']">
                {{ esError(ev.evento) ? '🔴 Freno' : '🟡 Flujo' }}
              </span>
            </td>
            <td class="nombre-evento-col">
              <code>{{ ev.evento }}</code>
            </td>
            <td class="props-col">
              <code>{{ JSON.stringify(ev.props) }}</code>
            </td>
            <td class="fecha-col">{{ formatearFecha(ev.fecha) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { obtenerEventos, limpiarEventos, calcularEmbudo } from '../utils/analitica'

const listaEventos = ref([])

function actualizarMetricas() {
  listaEventos.value = obtenerEventos()
}

function borrarHistorial() {
  if (confirm('¿Deseas reiniciar todos los eventos de telemetría registrados?')) {
    limpiarEventos()
    actualizarMetricas()
  }
}

function contarEvento(nombre) {
  return listaEventos.value.filter(e => e.evento === nombre).length
}

function esError(nombre) {
  return nombre.includes('error') || nombre.includes('cancelado') || nombre.includes('sin_resultados')
}

function formatearFecha(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString()
}

// Configuración de los 3 embudos principales
const embudoGasto = computed(() => {
  return calcularEmbudo([
    { nombre: 'iniciado', etiqueta: 'Intención (Clic + Registrar)', evento: 'presupuesto_movimiento_iniciado', color: '#3B82F6' },
    { nombre: 'advertido', etiqueta: 'Aviso Límite Evaluado', evento: 'presupuesto_limite_advertido', color: '#F59E0B' },
    { nombre: 'guardado', etiqueta: 'Guardado con Éxito en BD', evento: 'presupuesto_movimiento_guardado', color: '#10B981' }
  ])
})

const embudoMetas = computed(() => {
  return calcularEmbudo([
    { nombre: 'iniciado', etiqueta: 'Asignación Iniciada', evento: 'presupuesto_meta_asignacion_iniciada', color: '#6366F1' },
    { nombre: 'completado', etiqueta: 'Fondos Reservados en Meta', evento: 'presupuesto_meta_fondos_asignados', color: '#10B981' }
  ])
})

const embudoCategorias = computed(() => {
  return calcularEmbudo([
    { nombre: 'iniciado', etiqueta: 'Definir Límite Iniciado', evento: 'presupuesto_categoria_asignacion_iniciada', color: '#8B5CF6' },
    { nombre: 'guardado', etiqueta: 'Límite Guardado con Éxito', evento: 'presupuesto_categoria_guardado', color: '#10B981' }
  ])
})

const totalErrores = computed(() => {
  return listaEventos.value.filter(e => esError(e.evento)).length
})

const conversionGasto = computed(() => {
  const paso1 = embudoGasto.value[0]?.conteo || 0
  const pasoFinal = embudoGasto.value[2]?.conteo || 0
  if (paso1 === 0) return 0
  return Math.round((pasoFinal / paso1) * 100)
})

onMounted(() => {
  actualizarMetricas()
})
</script>

<style scoped>
.analitica-contenedor {
  max-width: 1200px;
  margin: 20px auto 50px auto;
  padding: 0 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1E293B;
}

.analitica-cabecera {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  border-bottom: 1px solid #E2E8F0;
  padding-bottom: 16px;
}

.badge-modulo {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  background-color: #EFF6FF;
  color: #1D4ED8;
  padding: 3px 8px;
  border-radius: 9999px;
  margin-bottom: 6px;
}

.analitica-titulo {
  font-size: 26px;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 4px 0;
}

.analitica-subtitulo {
  font-size: 15px;
  color: #64748B;
  margin: 0;
}

.analitica-acciones-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-volver-dashboard {
  background: white;
  border: 1px solid #CBD5E1;
  color: #1E293B;
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-volver-dashboard:hover {
  background: #F8FAFC;
  border-color: #94A3B8;
}

.btn-actualizar {
  background: #154C86;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-limpiar {
  background: #FEE2E2;
  color: #991B1B;
  border: 1px solid #FECACA;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* KPIs */
.grid-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.kpi-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.kpi-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  margin-bottom: 6px;
}

.kpi-valor {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 4px;
}

.kpi-sub {
  font-size: 12px;
  color: #94A3B8;
}

.texto-azul { color: #2563EB; }
.texto-verde { color: #10B981; }
.texto-rojo { color: #DC2626; }
.texto-naranja { color: #D97706; }

/* Embudos */
.subtitulo-seccion {
  font-size: 18px;
  font-weight: 700;
  color: #1E293B;
  margin: 0 0 14px 0;
}

.grid-embudos {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.card-embudo {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.card-embudo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.embudo-nombre {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #0F172A;
}

.embudo-desc {
  font-size: 13px;
  color: #64748B;
}

.badge-flujo {
  font-size: 11px;
  font-weight: 700;
  background: #F1F5F9;
  color: #475569;
  padding: 3px 8px;
  border-radius: 6px;
}

.pasos-embudo {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.paso-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.paso-cabecera {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.paso-etiqueta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #334155;
}

.circulo-indicador {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.circulo-amarillo { background-color: #F59E0B; }
.circulo-rojo { background-color: #EF4444; }

.paso-conteo {
  color: #64748B;
}

.barra-contenedor {
  height: 14px;
  background: #F1F5F9;
  border-radius: 9999px;
  overflow: hidden;
}

.barra-relleno {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.4s ease;
}

.badge-caida {
  font-size: 12px;
  color: #B91C1C;
  background: #FEF2F2;
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-block;
  align-self: flex-start;
  font-weight: 500;
}

/* FRENOS */
.seccion-frenos {
  margin-bottom: 32px;
}

.desc-frenos {
  font-size: 14px;
  color: #64748B;
  margin: -6px 0 16px 0;
}

.grid-frenos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.card-freno {
  background: #FFF;
  border: 1px solid #FEE2E2;
  border-left: 4px solid #EF4444;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  gap: 14px;
}

.freno-icono {
  font-size: 24px;
}

.freno-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.freno-titulo {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  color: #991B1B;
}

.freno-desc {
  font-size: 12px;
  color: #7F1D1D;
  margin: 0;
}

.freno-conteo {
  font-size: 13px;
  font-weight: 700;
  margin-top: 4px;
}

/* TABLA */
.seccion-tabla-eventos {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 20px;
}

.tabla-vacia {
  text-align: center;
  padding: 30px;
  color: #64748B;
  font-size: 14px;
}

.tabla-telemetria {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 10px;
}

.tabla-telemetria th,
.tabla-telemetria td {
  padding: 10px 12px;
  border-bottom: 1px solid #F1F5F9;
  text-align: left;
}

.tabla-telemetria th {
  background: #F8FAFC;
  color: #475569;
  font-weight: 600;
}

.badge-tipo-evento {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 9999px;
  font-weight: 600;
}

.badge-exito { background: #FEF3C7; color: #92400E; }
.badge-error { background: #FEE2E2; color: #991B1B; }

.nombre-evento-col code {
  font-weight: 600;
  color: #1E293B;
  background: #F1F5F9;
  padding: 2px 5px;
  border-radius: 4px;
}

.props-col code {
  color: #0284C7;
  font-family: monospace;
  font-size: 12px;
}

.fecha-col {
  color: #64748B;
  white-space: nowrap;
}
</style>

