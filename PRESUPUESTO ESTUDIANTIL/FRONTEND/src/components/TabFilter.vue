<template>
  <div class="c-tab-filter" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['tab-item', `tab-${tab.id}`, { 'is-active': modelValue === tab.id }]"
      role="tab"
      :aria-selected="modelValue === tab.id"
      @click="$emit('update:modelValue', tab.id)"
    >
      <span>{{ tab.label }}</span>
      <span v-if="tab.count !== undefined" class="tab-badge">{{ tab.count }}</span>
    </button>
  </div>
</template>

<script setup>
/**
 * Componente Figma: TabFilter (Page 1)
 * Mapeo 1:1 con las 4 pestañas de Figma y sus 2 estados (Active / Inactive):
 * - Todos:      Active (#1D4ED8 / #FFFFFF) | Inactive (#F1F5F9 / #475569)
 * - Pendientes: Active (#FBBF24 / #78350F) | Inactive (#FEF3C7 / #B45309)
 * - Pagados:    Active (#16A34A / #FFFFFF) | Inactive (#F1F5F9 / #475569)
 * - Ingresos:   Active (#0284C7 / #FFFFFF) | Inactive (#F1F5F9 / #475569)
 */
defineProps({
  modelValue: { type: [String, Number], required: true },
  tabs: {
    type: Array,
    default: () => [
      { id: 'todos', label: '📋 Todos' },
      { id: 'pendientes', label: '⏳ Pendientes' },
      { id: 'pagados', label: '✓ Pagados' },
      { id: 'ingresos', label: '💰 Ingresos' }
    ]
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.c-tab-filter {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  border: 1px solid var(--color-border-subtle);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  white-space: nowrap;
}

/* 1. Todos en Figma */
.tab-todos {
  background-color: var(--color-tab-todos-inact-bg);
  color: var(--color-tab-todos-inact-text);
}
.tab-todos.is-active {
  background-color: var(--color-tab-todos-act-bg);
  color: var(--color-tab-todos-act-text);
  border-color: var(--color-tab-todos-act-bg);
}

/* 2. Pendientes en Figma (Active: #FBBF24 / #78350F, Inactive: #FEF3C7 / #B45309) */
.tab-pendientes {
  background-color: var(--color-tab-pendientes-inact-bg);
  color: var(--color-tab-pendientes-inact-text);
  border-color: var(--color-status-pending-border);
}
.tab-pendientes.is-active {
  background-color: var(--color-tab-pendientes-act-bg);
  color: var(--color-tab-pendientes-act-text);
  border-color: var(--color-status-pending-border);
}

/* 3. Pagados en Figma */
.tab-pagados {
  background-color: var(--color-tab-pagados-inact-bg);
  color: var(--color-tab-pagados-inact-text);
}
.tab-pagados.is-active {
  background-color: var(--color-tab-pagados-act-bg);
  color: var(--color-tab-pagados-act-text);
  border-color: var(--color-tab-pagados-act-bg);
}

/* 4. Ingresos en Figma */
.tab-ingresos {
  background-color: var(--color-tab-ingresos-inact-bg);
  color: var(--color-tab-ingresos-inact-text);
}
.tab-ingresos.is-active {
  background-color: var(--color-tab-ingresos-act-bg);
  color: var(--color-tab-ingresos-act-text);
  border-color: var(--color-tab-ingresos-act-bg);
}

.tab-badge {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.4);
  font-weight: 700;
}
</style>
