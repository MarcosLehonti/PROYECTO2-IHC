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
        <button type="button" class="btn-actualizar" :disabled="actualizando" @click="actualizarMetricas">
          <span :class="{ 'icono-girar': actualizando }">↺</span> {{ actualizando ? 'Actualizando...' : 'Actualizar' }}
        </button>
        <button type="button" class="btn-limpiar" @click="borrarHistorial">
          🗑 Limpiar datos
        </button>
        <transition name="fade">
          <span v-if="mensajeFeedback" class="feedback-badge">{{ mensajeFeedback }}</span>
        </transition>
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
            <h3 class="freno-titulo">Cancelado por Límite</h3>
            <p class="freno-desc">Estudiante canceló el guardado al ver que superaría el presupuesto de categoría.</p>
            <span class="freno-conteo texto-naranja">{{ contarEvento('presupuesto_gasto_cancelado_limite') }} cancelaciones</span>
          </div>
        </div>

        <div class="card-freno">
          <div class="freno-icono">🚫</div>
          <div class="freno-info">
            <h3 class="freno-titulo">Fondos Insuficientes en Metas</h3>
            <p class="freno-desc">Intento de apartar dinero mayor al saldo disponible real en cuenta.</p>
            <span class="freno-conteo texto-rojo">{{ contarEvento('presupuesto_meta_error_fondos') }} bloqueos</span>
          </div>
        </div>

        <div class="card-freno">
          <div class="freno-icono">✏️</div>
          <div class="freno-info">
            <h3 class="freno-titulo">Validación de Formulario Fallida</h3>
            <p class="freno-desc">Campos vacíos o montos menores a 0 en el formulario de gasto o metas.</p>
            <span class="freno-conteo texto-rojo">{{ contarEvento('presupuesto_gasto_error_validacion') + contarEvento('presupuesto_meta_error_validacion') }} errores</span>
          </div>
        </div>

        <div class="card-freno">
          <div class="freno-icono">🔍</div>
          <div class="freno-info">
            <h3 class="freno-titulo">Búsqueda / Filtro sin Resultados</h3>
            <p class="freno-desc">El estudiante aplicó un filtro que no arrojó movimientos en la tabla.</p>
            <span class="freno-conteo texto-azul">{{ contarEvento('presupuesto_busqueda_sin_resultados') }} veces</span>
          </div>
        </div>

        <div class="card-freno">
          <div class="freno-icono">🛑</div>
          <div class="freno-info">
            <h3 class="freno-titulo">Baja Bloqueada por Regla</h3>
            <p class="freno-desc">Intento de eliminación bloqueado por existencia de gastos pendientes de pago.</p>
            <span class="freno-conteo texto-rojo">{{ contarEvento('cuenta_eliminacion_bloqueada') }} bloqueos</span>
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
const actualizando = ref(false)
const mensajeFeedback = ref('')

function actualizarMetricas() {
  actualizando.value = true
  listaEventos.value = obtenerEventos()
  mensajeFeedback.value = `✓ Métricas actualizadas (${listaEventos.value.length} eventos)`
  setTimeout(() => {
    actualizando.value = false
  }, 400)
  setTimeout(() => {
    mensajeFeedback.value = ''
  }, 2500)
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
  return nombre.includes('error') || nombre.includes('cancelado') || nombre.includes('sin_resultados') || nombre.includes('bloqueada')
}

function formatearFecha(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString()
}

// Configuración de los 3 embudos principales
const embudoGasto = computed(() => {
  return calcularEmbudo([
    { nombre: 'iniciado', etiqueta: 'Intención (Clic + Registrar)', evento: 'presupuesto_movimiento_iniciado', color: 'var(--color-border-focus)' },
    { nombre: 'advertido', etiqueta: 'Aviso Límite Evaluado', evento: 'presupuesto_limite_advertido', color: 'var(--color-warning)' },
    { nombre: 'guardado', etiqueta: 'Guardado con Éxito en BD', evento: 'presupuesto_movimiento_guardado', color: 'var(--color-success)' }
  ])
})

const embudoMetas = computed(() => {
  return calcularEmbudo([
    { nombre: 'iniciado', etiqueta: 'Asignación Iniciada', evento: 'presupuesto_meta_asignacion_iniciada', color: 'var(--color-violet)' },
    { nombre: 'completado', etiqueta: 'Fondos Reservados en Meta', evento: 'presupuesto_meta_fondos_asignados', color: 'var(--color-success)' }
  ])
})

const embudoCategorias = computed(() => {
  return calcularEmbudo([
    { nombre: 'iniciado', etiqueta: 'Definir Límite Iniciado', evento: 'presupuesto_categoria_asignacion_iniciada', color: 'var(--color-violet)' },
    { nombre: 'guardado', etiqueta: 'Límite Guardado con Éxito', evento: 'presupuesto_categoria_guardado', color: 'var(--color-success)' }
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
  color: var(--color-text-secondary);
}

.analitica-cabecera {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  border-bottom: 1px solid var(--color-border-subtle);
  padding-bottom: 16px;
}

.badge-modulo {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  background-color: var(--color-primary-subtle);
  color: var(--color-primary);
  padding: 3px 8px;
  border-radius: 9999px;
  margin-bottom: 6px;
}

.analitica-titulo {
  font-size: 26px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.analitica-subtitulo {
  font-size: 15px;
  color: var(--color-text-muted);
  margin: 0;
}

.analitica-acciones-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-volver-dashboard {
  background: white;
  border: 1px solid var(--color-border-default);
  color: var(--color-text-secondary);
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-volver-dashboard:hover {
  background: var(--color-bg-main);
  border-color: var(--color-border-strong);
}

.btn-actualizar {
  background: var(--color-brand-blue-medium);
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.2s;
}

.btn-actualizar:disabled {
  opacity: 0.7;
  cursor: wait;
}

.icono-girar {
  display: inline-block;
  animation: girar 0.6s linear infinite;
}

@keyframes girar {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.feedback-badge {
  background: var(--color-success-bg);
  color: var(--color-success-dark);
  border: 1px solid var(--color-success-border);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.btn-limpiar {
  background: var(--color-danger-bg);
  color: var(--color-danger-dark);
  border: 1px solid var(--color-danger-border);
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
  border: 1px solid var(--color-border-subtle);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.kpi-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
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
  color: var(--color-text-secondary);
}

.texto-azul { color: var(--color-primary); }
.texto-verde { color: var(--color-success); }
.texto-rojo { color: var(--color-danger); }
.texto-naranja { color: var(--color-warning-hover); }

/* Embudos */
.subtitulo-seccion {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-secondary);
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
  border: 1px solid var(--color-border-subtle);
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
  color: var(--color-text-primary);
}

.embudo-desc {
  font-size: 13px;
  color: var(--color-text-muted);
}

.badge-flujo {
  font-size: 11px;
  font-weight: 700;
  background: var(--color-bg-subtle);
  color: var(--color-text-secondary);
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
  color: var(--color-text-secondary);
}

.circulo-indicador {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.circulo-amarillo { background-color: var(--color-warning); }
.circulo-rojo { background-color: var(--color-danger); }

.paso-conteo {
  color: var(--color-text-muted);
}

.barra-contenedor {
  height: 14px;
  background: var(--color-bg-subtle);
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
  color: var(--color-danger-hover);
  background: var(--color-danger-subtle);
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
  color: var(--color-text-muted);
  margin: -6px 0 16px 0;
}

.grid-frenos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.card-freno {
  background: var(--color-surface-white);
  border: 1px solid var(--color-danger-bg);
  border-left: 4px solid var(--color-danger);
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
  color: var(--color-danger-dark);
}

.freno-desc {
  font-size: 12px;
  color: var(--color-danger-dark);
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
  border: 1px solid var(--color-border-subtle);
  border-radius: 12px;
  padding: 20px;
}

.tabla-vacia {
  text-align: center;
  padding: 30px;
  color: var(--color-text-muted);
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
  border-bottom: 1px solid var(--color-bg-subtle);
  text-align: left;
}

.tabla-telemetria th {
  background: var(--color-bg-main);
  color: var(--color-text-secondary);
  font-weight: 600;
}

.badge-tipo-evento {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 9999px;
  font-weight: 600;
}

.badge-exito { background: var(--color-warning-bg); color: var(--color-warning-dark); }
.badge-error { background: var(--color-danger-bg); color: var(--color-danger-dark); }

.nombre-evento-col code {
  font-weight: 600;
  color: var(--color-text-secondary);
  background: var(--color-bg-subtle);
  padding: 2px 5px;
  border-radius: 4px;
}

.props-col code {
  color: var(--color-sky);
  font-family: monospace;
  font-size: 12px;
}

.fecha-col {
  color: var(--color-text-muted);
  white-space: nowrap;
}
</style>

