<template>
  <div class="cuenta-contenedor">
    <div class="cuenta-header">
      <div class="header-titulos">
        <h1 class="cuenta-titulo">Mi Cuenta y Mis Datos</h1>
        <p class="cuenta-subtitulo">
          Transparencia, portabilidad de tu información y control total sobre tu cuenta.
        </p>
      </div>
      <router-link to="/movimientos" class="btn-volver-dashboard">
        ← Volver al Dashboard
      </router-link>
    </div>

    <!-- Alertas informativas globales -->
    <div v-if="mensajeExito" class="alerta-exito" role="alert">
      {{ mensajeExito }}
    </div>
    <div v-if="mensajeError" class="alerta-error" role="alert">
      {{ mensajeError }}
    </div>

    <!-- Tarjeta 1: Información de Usuario -->
    <section class="tarjeta-cuenta">
      <h2 class="seccion-titulo">👤 Datos del Perfil</h2>
      <div class="perfil-grid">
        <div class="perfil-campo">
          <span class="campo-etiqueta">Nombre completo:</span>
          <strong class="campo-valor">{{ usuario.nombre || 'Estudiante' }}</strong>
        </div>
        <div class="perfil-campo">
          <span class="campo-etiqueta">Correo electrónico:</span>
          <strong class="campo-valor">{{ usuario.email || '—' }}</strong>
        </div>
        <div class="perfil-campo">
          <span class="campo-etiqueta">Tipo de cuenta:</span>
          <span class="badge-cuenta-activa">Activa · Estudiantil</span>
        </div>
      </div>
    </section>

    <!-- Tarjeta 2: Portabilidad de Datos (Minimización y Control) -->
    <section class="tarjeta-cuenta">
      <div class="seccion-header-icono">
        <h2 class="seccion-titulo">📦 Portabilidad y Descarga de tus Datos</h2>
        <span class="badge-derecho">Principio Ético · Tus Datos son Tuyos</span>
      </div>
      <p class="seccion-descripcion">
        Puedes descargar una copia íntegra de toda tu actividad registrada en la aplicación
        (movimientos, presupuestos asignados por categoría y metas de ahorro). No almacenamos
        más información de la necesaria para tus finanzas.
      </p>

      <div class="botones-descarga">
        <button
          type="button"
          class="btn-descarga btn-descarga-json"
          :disabled="descargando"
          @click="descargarDatos('json')"
        >
          <span class="icono-btn">📄</span>
          <span>{{ descargando ? 'Generando archivo...' : 'Descargar datos completos (JSON)' }}</span>
        </button>

        <button
          type="button"
          class="btn-descarga btn-descarga-csv"
          :disabled="descargando"
          @click="descargarDatos('csv')"
        >
          <span class="icono-btn">📊</span>
          <span>{{ descargando ? 'Generando archivo...' : 'Descargar movimientos (CSV)' }}</span>
        </button>
      </div>
    </section>

    <!-- Tarjeta 3: Zona de Eliminación Ética de Cuenta -->
    <section class="tarjeta-cuenta tarjeta-zona-peligro">
      <h2 class="seccion-titulo texto-peligro">⚠️ Zona de Seguridad: Eliminación de Cuenta</h2>
      <p class="seccion-descripcion">
        Creemos que <strong>la salida debe ser tan clara y accesible como la entrada</strong> (Nielsen #3: Control y Libertad).
        Puedes solicitar la baja permanente de tu cuenta en cualquier momento, sin laberintos, sin confirmar con culpa ni trampas.
      </p>

      <div class="aviso-regla-app">
        <strong>Regla de negocio de la aplicación:</strong>
        Para poder eliminar tu cuenta, no debes tener gastos pendientes de pago sin resolver. Si los tienes,
        el sistema te indicará con precisión qué gastos debes regularizar primero.
      </div>

      <div class="acciones-zona-peligro">
        <button
          type="button"
          class="btn-solicitar-baja"
          @click="iniciarProcesoEliminacion"
        >
          Dar de baja mi cuenta permanentemente...
        </button>
      </div>
    </section>

    <!-- ===================================================================== -->
    <!-- MODAL DE CONFIRMACIÓN HONESTA (Tarea 10 / Sin Confirmshaming)          -->
    <!-- ===================================================================== -->
    <div
      v-if="modalEliminarVisible"
      class="modal-overlay"
      @click.self="cerrarModalEliminar"
    >
      <div
        class="modal-card modal-confirmacion-honesta"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="titulo-baja"
      >
        <h2 id="titulo-baja" class="modal-titulo-honesto">
          {{ bloqueoActivo ? '⚠️ Acción Requerida Antes de Continuar' : 'Eliminar Cuenta Permanentemente' }}
        </h2>

        <!-- CASO A: BLOQUEADO POR LA REGLA DIFÍCIL DE LA APP -->
        <div v-if="bloqueoActivo" class="bloqueo-mensaje-contenedor">
          <p class="texto-bloqueo">
            {{ detalleBloqueo }}
          </p>

          <div class="caja-instrucciones-bloqueo">
            <strong>¿Qué debes hacer para poder eliminarla?</strong>
            <p>
              Ve a tu lista de movimientos y marca tus gastos como <em>pagados</em> o elimínalos
              si fueron registrados por error.
            </p>
          </div>

          <div class="modal-acciones-simetricas">
            <button
              type="button"
              class="btn-accion-modal btn-modal-cancelar"
              @click="cerrarModalEliminar"
            >
              Entendido, volver
            </button>
            <router-link
              to="/movimientos"
              class="btn-accion-modal btn-modal-resolver"
            >
              Ir a Mis Movimientos
            </router-link>
          </div>
        </div>

        <!-- CASO B: SIN BLOQUEOS -> CONFIRMACIÓN HONESTA -->
        <div v-else class="confirmacion-libre-contenedor">
          <p class="modal-descripcion-honesta">
            Vas a eliminar tu cuenta de <strong>Presupuesto Estudiantil</strong>. Esta decisión es completamente tuya
            y queremos informarte con total transparencia qué sucederá:
          </p>

          <ul class="lista-consecuencias">
            <li>
              <strong>Se borrará todo:</strong> Tus movimientos registrados, presupuestos por categoría y metas de ahorro.
            </li>
            <li>
              <strong>No podrás volver a entrar:</strong> Tus credenciales quedarán invalidadas en nuestro servidor.
            </li>
            <li>
              <strong>Descarga previa recomendada:</strong> Si deseas guardar un respaldo, cancela este aviso y descarga tu archivo JSON o CSV antes de continuar.
            </li>
          </ul>

          <p v-if="errorEliminando" class="alerta-error" role="alert">
            {{ errorEliminando }}
          </p>

          <p class="pregunta-decision">¿Confirmas la eliminación permanente de tu cuenta?</p>

          <!-- Botones del mismo tamaño, sin trampas de color ni confirmshaming (Nielsen 3 y 5) -->
          <div class="modal-acciones-simetricas">
            <button
              type="button"
              class="btn-accion-modal btn-modal-cancelar"
              :disabled="eliminando"
              @click="cerrarModalEliminar"
            >
              Cancelar (conservar mi cuenta)
            </button>
            <button
              type="button"
              class="btn-accion-modal btn-modal-confirmar-baja"
              :disabled="eliminando"
              @click="confirmarEliminacionFinal"
            >
              {{ eliminando ? 'Eliminando cuenta...' : 'Eliminar mi cuenta permanentemente' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { track } from '../utils/analitica.js'

const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const usuario = ref({
  nombre: '',
  email: ''
})

const descargando = ref(false)
const modalEliminarVisible = ref(false)
const bloqueoActivo = ref(false)
const detalleBloqueo = ref('')
const eliminando = ref(false)
const errorEliminando = ref('')
const mensajeExito = ref('')
const mensajeError = ref('')

function authHeaders() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  }
}

async function cargarPerfil() {
  try {
    const rawUser = localStorage.getItem('usuario') || sessionStorage.getItem('usuario')
    if (rawUser) {
      usuario.value = JSON.parse(rawUser)
    }
    const res = await fetch(`${API_URL}/auth/me`, { headers: authHeaders() })
    if (res.ok) {
      usuario.value = await res.json()
    }
  } catch (err) {
    console.warn('No se pudo actualizar el perfil desde el servidor.')
  }
}

// ============================================================================
// PASO 1: Descarga de Datos (JSON o CSV)
// ============================================================================
async function descargarDatos(formato = 'json') {
  descargando.value = true
  mensajeError.value = ''
  mensajeExito.value = ''

  try {
    const res = await fetch(`${API_URL}/auth/exportar-datos`, {
      headers: authHeaders()
    })

    if (!res.ok) {
      throw new Error('Error al obtener los datos para exportación.')
    }

    const data = await res.json()

    if (formato === 'json') {
      const contenidoStr = JSON.stringify(data, null, 2)
      const blob = new Blob([contenidoStr], { type: 'application/json;charset=utf-8' })
      descargarBlob(blob, `mis-datos-presupuesto-${data.usuario?.email || 'estudiante'}.json`)
    } else {
      // Exportar en CSV los movimientos
      const encabezados = ['ID', 'Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto_Bs', 'Estado', 'Recurrencia']
      const filas = (data.movimientos || []).map(m => [
        m.id,
        m.fecha,
        m.tipo,
        `"${m.categoria || 'General'}"`,
        `"${(m.descripcion || '').replace(/"/g, '""')}"`,
        m.monto_bs,
        m.estado,
        m.recurrencia || 'ninguna'
      ])
      const csvContenido = [encabezados.join(','), ...filas.map(f => f.join(','))].join('\n')
      const blob = new Blob([csvContenido], { type: 'text/csv;charset=utf-8' })
      descargarBlob(blob, `movimientos-presupuesto-${data.usuario?.email || 'estudiante'}.csv`)
    }

    // Telemetría Tarea 10: registro de la acción sin datos personales
    track('cuenta_descarga_datos', {
      formato,
      total_movimientos: (data.movimientos || []).length
    })

    mensajeExito.value = `¡Tus datos se descargaron exitosamente en formato ${formato.toUpperCase()}!`
  } catch (err) {
    mensajeError.value = 'No se pudo descargar el archivo. Verifica tu conexión.'
  } finally {
    descargando.value = false
  }
}

function descargarBlob(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreArchivo
  document.body.appendChild(enlace)
  enlace.click()
  document.body.removeChild(enlace)
  URL.revokeObjectURL(url)
}

// ============================================================================
// PASO 2: Eliminación de Cuenta con Regla de la App y Confirmación Honesta
// ============================================================================
async function iniciarProcesoEliminacion() {
  bloqueoActivo.value = false
  detalleBloqueo.value = ''
  errorEliminando.value = ''

  // Telemetría Tarea 10: inicio de la intención de baja
  track('cuenta_eliminacion_iniciada', { origen: 'perfil_usuario' })

  // Comprobación previa de la regla difícil llamando al backend
  try {
    const res = await fetch(`${API_URL}/movimientos`, { headers: authHeaders() })
    if (res.ok) {
      const data = await res.json()
      const lista = Array.isArray(data) ? data : (data.movimientos || [])
      const pendientes = lista.filter(m => m.tipo === 'gasto' && m.estado === 'pendiente')
      if (pendientes.length > 0) {
        const total = pendientes.reduce((sum, m) => sum + Number(m.monto || 0), 0)
        bloqueoActivo.value = true
        detalleBloqueo.value = `No puedes eliminar tu cuenta porque tienes ${pendientes.length} gasto(s) pendiente(s) de pago por un total de ${total.toFixed(2)} Bs.`

        // Telemetría Tarea 10: intento bloqueado por la regla de la app
        track('cuenta_eliminacion_bloqueada', {
          motivo: 'gastos_pendientes_activos',
          cantidad_pendientes: pendientes.length
        })
      }
    }
  } catch (err) {
    // Si falla la verificación rápida, el endpoint DELETE backend validará igualmente
  }

  modalEliminarVisible.value = true
}

function cerrarModalEliminar() {
  modalEliminarVisible.value = false
  bloqueoActivo.value = false
  detalleBloqueo.value = ''
  errorEliminando.value = ''
}

async function confirmarEliminacionFinal() {
  eliminando.value = true
  errorEliminando.value = ''

  try {
    const res = await fetch(`${API_URL}/auth/cuenta`, {
      method: 'DELETE',
      headers: authHeaders()
    })

    if (res.status === 409) {
      // Bloqueado por regla del backend
      const data = await res.json()
      bloqueoActivo.value = true
      detalleBloqueo.value = typeof data.detail === 'string' ? data.detail : (data.detail?.mensaje || 'Tienes gastos pendientes que bloquean la eliminación.')
      track('cuenta_eliminacion_bloqueada', { motivo: 'gastos_pendientes_backend' })
      return
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.detail || 'Ocurrió un error al procesar la eliminación.')
    }

    // Éxito: Telemetría final
    track('cuenta_eliminacion_confirmada', {
      resultado: 'cuenta_destruida'
    })

    // Limpieza de sesión
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('usuario')

    modalEliminarVisible.value = false

    // Redirección con aviso al usuario
    router.push({
      path: '/login',
      query: { cuenta_eliminada: 'true' }
    })
  } catch (err) {
    errorEliminando.value = err.message || 'No se pudo eliminar la cuenta. Inténtalo más tarde.'
  } finally {
    eliminando.value = false
  }
}

onMounted(() => {
  cargarPerfil()
})
</script>

<style scoped>
.cuenta-contenedor {
  max-width: 900px;
  margin: 32px auto;
  padding: 0 20px;
  font-family: inherit;
}

.cuenta-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.cuenta-titulo {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.cuenta-subtitulo {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.btn-volver-dashboard {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #f1f5f9;
  color: #334155;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  transition: all 0.2s;
}

.btn-volver-dashboard:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

.alerta-exito {
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
}

.alerta-error {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
}

.tarjeta-cuenta {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.seccion-header-icono {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.seccion-titulo {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.texto-peligro {
  color: #b91c1c;
}

.badge-derecho {
  display: inline-block;
  background-color: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #bfdbfe;
}

.seccion-descripcion {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 20px;
}

.perfil-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.perfil-campo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.campo-etiqueta {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.campo-valor {
  font-size: 15px;
  color: #0f172a;
}

.badge-cuenta-activa {
  display: inline-block;
  width: fit-content;
  background-color: #f0fdf4;
  color: #166534;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid #bbf7d0;
}

.botones-descarga {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-descarga {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.btn-descarga-json {
  background-color: #0284c7;
  color: #ffffff;
}

.btn-descarga-json:hover:not(:disabled) {
  background-color: #0369a1;
}

.btn-descarga-csv {
  background-color: #0d9488;
  color: #ffffff;
}

.btn-descarga-csv:hover:not(:disabled) {
  background-color: #0f766e;
}

.btn-descarga:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tarjeta-zona-peligro {
  border-color: #fca5a5;
  background-color: #fffaf0;
}

.aviso-regla-app {
  background-color: #fff7ed;
  border-left: 4px solid #ea580c;
  padding: 12px 16px;
  font-size: 13px;
  color: #7c2d12;
  margin-bottom: 20px;
  border-radius: 4px;
}

.btn-solicitar-baja {
  padding: 10px 20px;
  background-color: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-solicitar-baja:hover {
  background-color: #dc2626;
}

/* Modales */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-confirmacion-honesta {
  background: #ffffff;
  border-radius: 14px;
  padding: 28px;
  max-width: 540px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.modal-titulo-honesto {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 14px 0;
}

.modal-descripcion-honesta {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 16px;
}

.lista-consecuencias {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 18px 14px 34px;
  font-size: 13px;
  color: #334155;
  line-height: 1.6;
  margin-bottom: 20px;
}

.pregunta-decision {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
  text-align: center;
}

.texto-bloqueo {
  font-size: 14px;
  color: #991b1b;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  padding: 12px 16px;
  border-radius: 8px;
  line-height: 1.5;
  margin-bottom: 16px;
  font-weight: 500;
}

.caja-instrucciones-bloqueo {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  color: #334155;
  margin-bottom: 24px;
}

.caja-instrucciones-bloqueo p {
  margin: 6px 0 0 0;
  color: #64748b;
}

/* Principio de botones simétricos del mismo tamaño (Nielsen 3 y 5) */
.modal-acciones-simetricas {
  display: flex;
  gap: 14px;
  justify-content: stretch;
}

.btn-accion-modal {
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  border: 1px solid transparent;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-modal-cancelar {
  background-color: #f1f5f9;
  color: #334155;
  border-color: #cbd5e1;
}

.btn-modal-cancelar:hover:not(:disabled) {
  background-color: #e2e8f0;
  color: #0f172a;
}

.btn-modal-confirmar-baja {
  background-color: #dc2626;
  color: #ffffff;
}

.btn-modal-confirmar-baja:hover:not(:disabled) {
  background-color: #b91c1c;
}

.btn-modal-resolver {
  background-color: #2563eb;
  color: #ffffff;
}

.btn-modal-resolver:hover {
  background-color: #1d4ed8;
}

.btn-accion-modal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .modal-acciones-simetricas {
    flex-direction: column;
  }
}
</style>
