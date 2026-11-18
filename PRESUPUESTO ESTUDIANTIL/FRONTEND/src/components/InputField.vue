<template>
  <div :class="['c-input-field', { 'has-error': !!error, 'is-disabled': disabled }]">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="required-star">*</span>
    </label>
    <div class="input-wrapper">
      <span v-if="prefix" class="input-prefix">{{ prefix }}</span>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="input-control"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
    </div>
    <span v-if="error" class="input-error-msg">{{ error }}</span>
    <span v-else-if="hint" class="input-hint">{{ hint }}</span>
  </div>
</template>

<script setup>
/**
 * Componente Figma: InputField (Page 1)
 * Mapeo 1:1 con las variantes y estados de Figma:
 * - State: Default, Focus, Error, Disabled
 * Colores de Figma:
 * - Default:  Border #CBD5E1, Bg #FFFFFF, Text #1E293B, Placeholder #94A3B8
 * - Focus:    Border #2563EB, Bg #FFFFFF, Text #0B192C, Placeholder #64748B
 * - Error:    Border #DC2626, Bg #FFF5F5, Text #991B1B, Placeholder #DC2626
 * - Disabled: Border #E2E8F0, Bg #F1F5F9, Text #94A3B8, Placeholder #CBD5E1
 */
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  prefix: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

defineEmits(['update:modelValue', 'focus', 'blur'])
</script>

<style scoped>
.c-input-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.input-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.required-star {
  color: var(--color-input-error-border);
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: var(--color-input-default-bg);
  border: 1px solid var(--color-input-default-border);
  border-radius: var(--radius-md);
  padding: 0 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Focus en Figma: Border #2563EB */
.input-wrapper:focus-within {
  border-color: var(--color-input-focus-border);
  box-shadow: 0 0 0 3px var(--color-sky-light);
}

.input-prefix {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-right: 6px;
}

.input-control {
  width: 100%;
  border: none;
  background: transparent;
  padding: 10px 0;
  font-size: 14px;
  color: var(--color-input-default-text);
  outline: none;
  font-family: inherit;
}

.input-control::placeholder {
  color: var(--color-input-default-placeholder);
}

.input-wrapper:focus-within .input-control {
  color: var(--color-input-focus-text);
}

/* Error en Figma: Border #DC2626, Bg #FFF5F5, Text #991B1B */
.has-error .input-wrapper {
  background-color: var(--color-input-error-bg);
  border-color: var(--color-input-error-border);
}

.has-error .input-wrapper:focus-within {
  box-shadow: 0 0 0 3px var(--color-danger-light);
}

.input-error-msg {
  font-size: 12px;
  color: var(--color-input-error-text);
  font-weight: 500;
}

.input-hint {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* Disabled en Figma: Border #E2E8F0, Bg #F1F5F9, Text #94A3B8 */
.is-disabled .input-wrapper {
  background-color: var(--color-input-disabled-bg);
  border-color: var(--color-input-disabled-border);
  cursor: not-allowed;
}

.is-disabled .input-control {
  color: var(--color-input-disabled-text);
  cursor: not-allowed;
}
</style>
