<template>
  <div :class="['c-alert-banner', `type-${type}`, `style-${bannerStyle}`]" role="alert">
    <div class="banner-icon" v-if="icon || $slots.icon">
      <slot name="icon">{{ icon || defaultIcon }}</slot>
    </div>
    <div class="banner-content">
      <div v-if="title" class="banner-title">{{ title }}</div>
      <div class="banner-message">
        <slot>{{ message }}</slot>
      </div>
    </div>
    <div v-if="$slots.action" class="banner-action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Componente Figma: AlertBanner (Page 1)
 * Mapeo 1:1 con las 4 variantes de Figma:
 * - Warning: Bg #FEF3C7, Border #F59E0B, Text #78350F
 * - Danger:  Bg #FEE2E2, Border #DC2626, Text #7F1D1D
 * - Success: Bg #DCFCE7, Border #16A34A, Text #14532D
 * - Info:    Bg #E0F2FE, Border #0284C7, Text #075985
 */
const props = defineProps({
  type: { type: String, default: 'warning' },
  bannerStyle: { type: String, default: 'full' },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  icon: { type: String, default: '' }
})

const defaultIcon = computed(() => {
  switch (props.type) {
    case 'warning': return '⚠️'
    case 'danger': return '🛑'
    case 'success': return '✓'
    case 'info': default: return 'ℹ️'
  }
})
</script>

<style scoped>
.c-alert-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.style-full {
  padding: 14px 18px;
}

.style-compact {
  padding: 8px 14px;
  align-items: center;
}

.banner-icon {
  font-size: 18px;
  line-height: 1;
}

.banner-content {
  flex: 1;
}

.banner-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 2px;
}

.banner-message {
  font-size: 13px;
  line-height: 1.4;
}

/* Tokens de Figma 1:1 (CERO colores fijos) */
.type-warning {
  background-color: var(--color-banner-warning-bg);
  border-color: var(--color-banner-warning-border);
  color: var(--color-banner-warning-text);
}

.type-danger {
  background-color: var(--color-banner-danger-bg);
  border-color: var(--color-banner-danger-border);
  color: var(--color-banner-danger-text);
}

.type-success {
  background-color: var(--color-banner-success-bg);
  border-color: var(--color-banner-success-border);
  color: var(--color-banner-success-text);
}

.type-info {
  background-color: var(--color-banner-info-bg);
  border-color: var(--color-banner-info-border);
  color: var(--color-banner-info-text);
}
</style>
