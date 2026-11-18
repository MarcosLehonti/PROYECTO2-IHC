<template>
  <header :class="['c-navbar', `type-${type}`]">
    <div class="navbar-container">
      <div class="navbar-brand">
        <slot name="brand">
          <img v-if="logoSrc" :src="logoSrc" alt="Logo" class="navbar-logo" />
          <span class="navbar-title">{{ title }}</span>
        </slot>
      </div>

      <nav class="navbar-links" v-if="$slots.links">
        <slot name="links"></slot>
      </nav>

      <div class="navbar-user" v-if="user || $slots.user">
        <slot name="user">
          <div class="user-badge" v-if="user">
            <span class="user-avatar">{{ user.initials || 'EST' }}</span>
            <div class="user-info">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-role">{{ user.role || 'Estudiante UMSA' }}</span>
            </div>
          </div>
        </slot>
      </div>

      <div class="navbar-actions" v-if="$slots.actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </header>
</template>

<script setup>
/**
 * Componente Figma: Navbar (Page 1)
 * Mapeo 1:1 con Figma:
 * - Background: #10233F (--color-navbar-bg)
 * - Text:       #FFFFFF (--color-navbar-text)
 * - Border:     #E2E8F0 (--color-navbar-border)
 * - Action CTA: #2563EB (--color-btn-primary-bg)
 */
defineProps({
  title: { type: String, default: 'Presupuesto Estudiantil' },
  type: { type: String, default: 'dashboard' },
  logoSrc: { type: String, default: '' },
  user: { type: Object, default: null }
})
</script>

<style scoped>
.c-navbar {
  width: 100%;
  background-color: var(--color-navbar-bg);
  color: var(--color-navbar-text);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.navbar-logo {
  height: 38px;
  width: auto;
  border-radius: var(--radius-sm);
}

.navbar-title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: var(--color-navbar-text);
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.navbar-user {
  display: flex;
  align-items: center;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.08);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background-color: var(--color-sky);
  color: var(--color-navbar-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-navbar-text);
}

.user-role {
  font-size: 10px;
  color: var(--color-text-subtle);
}
</style>
