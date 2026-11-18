<template>
  <div :class="['c-movement-item', `type-${type.toLowerCase()}`]">
    <div class="item-left">
      <div class="item-icon-box">
        <slot name="icon">
          <span>{{ categoryIcon }}</span>
        </slot>
      </div>
      <div class="item-info">
        <div class="item-description">{{ description }}</div>
        <div class="item-meta">
          <span class="item-category">{{ category }}</span>
          <span class="item-dot">•</span>
          <span class="item-date">{{ date }}</span>
        </div>
      </div>
    </div>
    
    <div class="item-right">
      <div :class="['item-amount', isIncome ? 'is-income' : 'is-expense']">
        {{ isIncome ? '+' : '-' }} Bs {{ Number(amount).toFixed(2) }}
      </div>
      <div class="item-action" v-if="$slots.action || showStatus">
        <slot name="action">
          <span v-if="status" :class="['item-badge', `status-${status.toLowerCase()}`]">
            {{ status }}
          </span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Componente Figma: MovementItem (Page 1)
 * Variantes: Type=GastoPendiente, GastoPagado, Ingreso | State=Default, Hover
 * Tokens consumidos: --color-surface-white, --color-surface-hover, --color-border-subtle,
 *                   --color-text-main, --color-danger, --color-success, --radius-md
 */
const props = defineProps({
  description: { type: String, required: true },
  amount: { type: [Number, String], required: true },
  category: { type: String, default: 'General' },
  date: { type: String, default: '' },
  type: { type: String, default: 'GastoPagado' }, // GastoPendiente, GastoPagado, Ingreso
  status: { type: String, default: '' },
  showStatus: { type: Boolean, default: true }
})

const isIncome = computed(() => props.type.toLowerCase().includes('ingreso'))

const categoryIcon = computed(() => {
  const cat = props.category.toLowerCase()
  if (cat.includes('transporte')) return '🚌'
  if (cat.includes('comida') || cat.includes('alimento')) return '🍽️'
  if (cat.includes('libro') || cat.includes('educa') || cat.includes('fotocopia')) return '📚'
  if (cat.includes('salud')) return '💊'
  if (cat.includes('beca') || cat.includes('ingreso')) return '🎓'
  return '💳'
})
</script>

<style scoped>
.c-movement-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background-color: var(--color-surface-white);
  border-bottom: 1px solid var(--color-border-subtle);
  transition: background-color 0.15s ease;
}

.c-movement-item:hover {
  background-color: var(--color-surface-hover);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.item-icon-box {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background-color: var(--color-bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.item-description {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-main);
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.item-dot {
  font-size: 8px;
  opacity: 0.6;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-amount {
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.is-income { color: var(--color-success); }
.is-expense { color: var(--color-danger); }

.item-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.item-badge.status-pendiente {
  background-color: var(--color-status-pending-bg);
  color: var(--color-status-pending-text);
  border: 1px solid var(--color-status-pending-border);
}

.item-badge.status-pagado {
  background-color: var(--color-success-bg);
  color: var(--color-success-dark);
}
</style>
