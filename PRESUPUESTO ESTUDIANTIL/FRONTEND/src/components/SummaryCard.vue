<template>
  <div :class="['c-summary-card', `type-${type.toLowerCase()}`, { 'is-alert': alert }]">
    <div class="card-header">
      <span class="card-title">{{ title }}</span>
      <div class="card-icon" v-if="icon || $slots.icon">
        <slot name="icon">{{ icon }}</slot>
      </div>
    </div>
    <div class="card-amount">{{ amount }}</div>
    <div class="card-subtitle" v-if="subtitle || $slots.subtitle">
      <slot name="subtitle">{{ subtitle }}</slot>
    </div>
  </div>
</template>

<script setup>
/**
 * Componente Figma: SummaryCard (Page 1)
 * Mapeo 1:1 con las 6 variantes de Figma:
 * - Type: Saldo, Ingreso, Gasto
 * - State: Normal, Alerta
 * Colores de Figma:
 * - Saldo: Normal (#1E3A5F) / Alerta (#E11D48, bg #FFF5F5, border #FECACA)
 * - Ingreso: Normal (#16A34A) / Alerta (#64748B)
 * - Gasto: Normal (#4A7A9B) / Alerta (#A63A3A, bg #FFF5F5, border #FECACA)
 */
defineProps({
  title: { type: String, required: true },
  amount: { type: [String, Number], required: true },
  subtitle: { type: String, default: '' },
  type: { type: String, default: 'saldo' },
  icon: { type: String, default: '' },
  alert: { type: Boolean, default: false }
})
</script>

<style scoped>
.c-summary-card {
  background-color: var(--color-surface-card);
  border: 1.5px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.c-summary-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-muted);
}

.card-amount {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-text-main);
  line-height: 1.2;
}

.card-subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 8px;
}

/* Tokens de Figma 1:1 */
.type-saldo .card-amount { color: var(--color-card-saldo-amount); }
.type-ingreso .card-amount { color: var(--color-card-ingreso-amount); }
.type-gasto .card-amount { color: var(--color-card-gasto-amount); }
.type-limite .card-amount { color: var(--color-brand-navy); }

/* Estados de Alerta en Figma */
.is-alert.type-saldo {
  background-color: var(--color-card-saldo-alert-bg);
  border-color: var(--color-card-saldo-alert-border);
}
.is-alert.type-saldo .card-amount {
  color: var(--color-card-saldo-alert-amount);
}

.is-alert.type-gasto {
  background-color: var(--color-card-gasto-alert-bg);
  border-color: var(--color-card-gasto-alert-border);
}
.is-alert.type-gasto .card-amount {
  color: var(--color-card-gasto-alert-amount);
}
</style>
