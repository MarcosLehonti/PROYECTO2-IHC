import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import RecuperarView from '../views/RecuperarView.vue'
import MovimientosView from '../views/MovimientosView.vue'
import HistorialView from '../views/HistorialView.vue'
import EventosView from '../views/EventosView.vue'
import AnaliticaView from '../views/AnaliticaView.vue'
import CuentaView from '../views/CuentaView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { public: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/registro',
    name: 'Registro',
    component: RegisterView,
    meta: { public: true }
  },
  {
    path: '/recuperar',
    name: 'Recuperar',
    component: RecuperarView,
    meta: { public: true }
  },
  {
    path: '/movimientos',
    name: 'Movimientos',
    component: MovimientosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/historial',
    name: 'Historial',
    component: HistorialView,
    meta: { requiresAuth: true }
  },
  {
    path: '/eventos',
    name: 'Eventos',
    component: EventosView,
    meta: { public: true }
  },
  {
    path: '/analitica',
    alias: '/analítica',
    name: 'Analitica',
    component: AnaliticaView,
    meta: { public: true }
  },
  {
    path: '/cuenta',
    name: 'Cuenta',
    component: CuentaView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function validarSesion(token) {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) return false
    localStorage.setItem('usuario', JSON.stringify(await res.json()))
    window.dispatchEvent(new Event('usuario-autenticado'))
    return true
  } catch (e) {
    return false
  }
}

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth) {
    if (token && await validarSesion(token)) {
      next()
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      next({ name: 'Login', query: { redirect: to.fullPath } })
    }
  } else if ((to.name === 'Login' || to.name === 'Registro') && token) {
    next({ name: 'Movimientos' })
  } else {
    next()
  }
})

export default router
