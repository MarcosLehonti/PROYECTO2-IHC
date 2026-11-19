<template>
  <div class="auth-page">
    <div class="auth-card">

      <div class="auth-tabs">
        <button class="tab-btn active">
          Iniciar Sesión
        </button>
        <router-link to="/registro" class="tab-btn">
          Registrarse
        </router-link>
      </div>

      <div v-if="esDemo" class="demo-alert">
        <strong>Modo demo:</strong> verás datos de ejemplo. Es solo una muestra, no podrás registrar movimientos ni cambiar la contraseña.
      </div>

      <div v-if="cuentaEliminada" class="exito-alert" role="status">
        ✓ Tu cuenta y todos tus datos fueron eliminados de forma permanente.
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">

        <div class="form-group">
          <label class="form-label">Correo Electrónico</label>
          <div class="input-wrapper">
            <span class="input-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M5 16c.5-1.5 1.7-2 3-2s2.5.5 3 2M14 10h5M14 14h4"/></svg></span>
            <input
              v-model="email"
              type="email"
              placeholder="estudiante@universidad.edu"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <div class="label-row">
            <label class="form-label">Contraseña</label>
            <button type="button" class="btn-toggle-pass" @click="mostrarPassword = !mostrarPassword">
              {{ mostrarPassword ? 'Hide Password' : 'Show Password' }}
            </button>
          </div>
          <div class="input-wrapper">
            <span class="input-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span>
            <input
              v-model="password"
              :type="mostrarPassword ? 'text' : 'password'"
              placeholder="•••••••••"
              class="form-input"
              required
            />
            <span class="eye-icon" @click="mostrarPassword = !mostrarPassword">
              {{ mostrarPassword ? '👁️' : '🙈' }}
            </span>
          </div>
        </div>

        <div v-if="errorMsg" class="error-alert">
          {{ errorMsg }}
        </div>

        <button type="submit" class="btn-submit" :disabled="cargando">
          {{ cargando ? 'Iniciando...' : (esDemo ? 'Entrar a la Demo' : 'Iniciar Sesión') }}
        </button>

        <div class="auth-footer-links">
          <p v-if="!esDemo" class="footer-link-text">
            ¿Olvidaste tu contraseña?
            <router-link to="/recuperar" class="link-highlight">Recuperar aquí</router-link>
          </p>
          <p class="footer-link-text">
            ¿No tienes cuenta?
            <router-link to="/registro" class="link-highlight">Regístrate gratis</router-link>
          </p>
        </div>

      </form>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const DEMO_EMAIL = 'estudiante@demo.com'
const DEMO_PASSWORD = 'estudiante123'
const esDemo = computed(() => route.query.demo === '1')
const cuentaEliminada = computed(() => route.query.cuenta_eliminada === 'true')

const email = ref('')
const password = ref('')
const mostrarPassword = ref(false)
const cargando = ref(false)
const errorMsg = ref('')

watch(esDemo, (demo) => {
  email.value = demo ? DEMO_EMAIL : ''
  password.value = demo ? DEMO_PASSWORD : ''
  errorMsg.value = ''
}, { immediate: true })

async function handleLogin() {
  cargando.value = true
  errorMsg.value = ''

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      window.dispatchEvent(new Event('usuario-autenticado'))
      router.push('/movimientos')
    } else {
      const err = await res.json()
      errorMsg.value = err.detail || 'Credenciales incorrectas. Verifica tu correo y clave.'
    }
  } catch (e) {
    errorMsg.value = 'No se pudo conectar con el servidor. Verifica que el backend esté encendido.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: calc(100vh - 75px);
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-sky-light) 40%, var(--color-sky-light) 60%, var(--color-violet-light) 100%);
}

.auth-card {
  background: var(--color-surface-white);
  width: 100%;
  max-width: clamp(420px, 30vw, 580px);
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(30, 64, 120, 0.16);
  padding: clamp(20px, 1.6vw, 28px);
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border-subtle);
  margin-bottom: 22px;
}

.tab-btn {
  flex: 1;
  text-align: center;
  padding: clamp(10px, 0.7vw, 13px) 0;
  font-size: clamp(15px, 1vw, 18px);
  font-weight: 500;
  color: var(--color-text-muted);
  background: none;
  border: none;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.tab-btn.active {
  background-color: var(--color-brand-blue-medium);
  color: var(--color-surface-white);
}

.tab-btn:hover:not(.active) {
  color: var(--color-brand-blue-medium);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: clamp(14px, 0.95vw, 17px);
  font-weight: 600;
  color: var(--color-text-primary);
}

.btn-toggle-pass {
  background: none;
  border: none;
  font-size: clamp(13px, 0.85vw, 15px);
  color: var(--color-text-primary);
  font-weight: 500;
  cursor: pointer;
}

.btn-toggle-pass:hover {
  color: var(--color-brand-blue-medium);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 13px;
  display: flex;
  color: var(--color-text-secondary);
}

.eye-icon {
  position: absolute;
  right: 14px;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.6;
}

.form-input {
  width: 100%;
  padding: clamp(10px, 0.7vw, 13px) 42px;
  font-size: clamp(14px, 0.95vw, 17px);
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  color: var(--color-text-secondary);
  background-color: var(--color-surface-white);
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-sky);
  box-shadow: 0 0 0 3px rgba(46, 125, 154, 0.15);
}

.error-alert {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
}

.exito-alert {
  background-color: var(--color-success-subtle);
  border: 1px solid var(--color-success-border);
  color: var(--color-success-dark);
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
}

.btn-submit {
  background-color: var(--color-primary-default);
  color: var(--color-surface-white);
  border: none;
  padding: clamp(12px, 0.8vw, 15px);
  border-radius: 6px;
  font-size: clamp(15px, 1.05vw, 19px);
  font-weight: 500;
  cursor: pointer;
  margin-top: 4px;
  transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.demo-alert {
  background-color: var(--color-bg-page);
  border: 1px solid var(--color-sky-light);
  color: var(--color-brand-blue-deep);
  padding: 10px 14px;
  border-radius: 6px;
  font-size: clamp(13px, 0.85vw, 15px);
  line-height: 1.45;
  margin-bottom: 18px;
}

.auth-footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
  margin-top: 10px;
}

.footer-link-text {
  font-size: clamp(13px, 0.9vw, 16px);
  color: var(--color-text-primary);
}

.link-highlight {
  color: var(--color-brand-blue-medium);
  font-weight: 500;
  text-decoration: none;
}

.link-highlight:hover {
  text-decoration: underline;
}
</style>
