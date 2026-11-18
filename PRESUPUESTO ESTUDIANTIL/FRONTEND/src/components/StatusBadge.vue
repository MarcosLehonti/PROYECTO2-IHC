<template>
  <span :class="['c-status-badge', `status-${status.toLowerCase()}`, `size-${size}`]">
    <span class="badge-dot"></span>
    <slot>{{ label || status }}</slot>
  </span>
</template>

<script setup>
/**
 * Componente Figma: StatusBadge (Page 1)
 * Mapeo 1:1 con las 6 variantes de Figma:
 * - Status: Pendiente, Pagado, Excedido
 * - Size: Default, Small
 * Colores de Figma:
 * - Pendiente: Fill #FEF3C7 (o #FBBF24 en píldora activa), Stroke #F59E0B, Text #78350F
 * - Pagado:    Fill #DCFCE7, Stroke #86EFAC, Text #15803D
 * - Excedido:  Fill #FEE2E2, Stroke #FECACA, Text #B91C1C
 */
defineProps({
  status: { type: String, default: 'Pendiente' },
  label: { type: String, default: '' },
  size: { type: String, default: 'default' }
})
</script>

<style scoped>
.c-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: var(--radius-full);
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.2px;
}

.size-default {
  padding: 6px 16px;
  font-size: 12px;
}

.size-small {
  padding: 4px 10px;
  font-size: 11px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
}

/* Tokens de Figma 1:1 (CERO colores fijos) */
.status-pendiente {
  background-color: var(--color-status-pending-bg);
  color: var(--color-status-pending-text);
  border: 1px solid var(--color-status-pending-border);
}
.status-pendiente .badge-dot {
  background-color: var(--color-status-pending-dot);
}

.status-pagado {
  background-color: var(--color-badge-pagado-bg);
  color: var(--color-badge-pagado-text);
  border: 1px solid var(--color-badge-pagado-border);
}
.status-pagado .badge-dot {
  background-color: var(--color-badge-pagado-text);
}

.status-excedido {
  background-color: var(--color-badge-excedido-bg);
  color: var(--color-badge-excedido-text);
  border: 1px solid var(--color-badge-excedido-border);
}
.status-excedido .badge-dot {
  background-color: var(--color-badge-excedido-text);
}
</style>
