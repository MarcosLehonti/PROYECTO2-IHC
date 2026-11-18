<template>
  <button
    :type="type"
    :class="['c-button', `variant-${variant}`, `size-${size}`, { 'is-disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot name="icon-left"></slot>
    <slot>{{ label }}</slot>
    <slot name="icon-right"></slot>
  </button>
</template>

<script setup>
/**
 * Componente Figma: Button (Page 1)
 * Mapeo 1:1 con las 12 variantes de Figma:
 * - Variant: Primary, Secondary, Success, Danger
 * - State: Default, Hover, Disabled
 * Tokens consumidos de Figma:
 *   --color-btn-primary-*, --color-btn-secondary-*,
 *   --color-btn-success-*, --color-btn-danger-*
 */
defineProps({
  label: { type: String, default: '' },
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>

<style scoped>
.c-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  font-family: inherit;
  box-shadow: var(--shadow-sm);
}

.size-sm { padding: 6px 12px; font-size: 13px; }
.size-md { padding: 10px 20px; font-size: 14px; min-height: 44px; }
.size-lg { padding: 14px 28px; font-size: 16px; min-height: 48px; }

/* 1. Primary (Figma: Default #2563EB, Hover #1D4ED8, Disabled #93C5FD) */
.variant-primary {
  background-color: var(--color-btn-primary-bg);
  color: var(--color-btn-primary-text);
}
.variant-primary:hover:not(:disabled) {
  background-color: var(--color-btn-primary-hover);
}
.variant-primary:disabled {
  background-color: var(--color-btn-primary-disabled);
}

/* 2. Secondary (Figma: Default #FFFFFF / #CBD5E1, Hover #F1F5F9, Disabled #F8FAFC) */
.variant-secondary {
  background-color: var(--color-btn-secondary-bg);
  color: var(--color-btn-secondary-text);
  border-color: var(--color-btn-secondary-border);
}
.variant-secondary:hover:not(:disabled) {
  background-color: var(--color-btn-secondary-hover-bg);
  color: var(--color-btn-secondary-hover-text);
  border-color: var(--color-btn-secondary-hover-border);
}
.variant-secondary:disabled {
  background-color: var(--color-btn-secondary-disabled-bg);
  color: var(--color-btn-secondary-disabled-text);
  border-color: var(--color-btn-secondary-disabled-border);
}

/* 3. Success (Figma: Default #16A34A, Hover #15803D, Disabled #86EFAC) */
.variant-success {
  background-color: var(--color-btn-success-bg);
  color: var(--color-btn-success-text);
}
.variant-success:hover:not(:disabled) {
  background-color: var(--color-btn-success-hover);
}
.variant-success:disabled {
  background-color: var(--color-btn-success-disabled);
}

/* 4. Danger (Figma: Default #E11D48, Hover #BE123C, Disabled #FDA4AF) */
.variant-danger {
  background-color: var(--color-btn-danger-bg);
  color: var(--color-btn-danger-text);
}
.variant-danger:hover:not(:disabled) {
  background-color: var(--color-btn-danger-hover);
}
.variant-danger:disabled {
  background-color: var(--color-btn-danger-disabled);
}

.is-disabled, .c-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
