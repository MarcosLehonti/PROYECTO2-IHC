<template>
  <button
    type="button"
    :class="['c-category-chip', `cat-${categorySlug}`, { 'is-selected': selected }]"
    @click="$emit('click', category)"
  >
    <span class="chip-icon">{{ icon || defaultIcon }}</span>
    <span class="chip-label">{{ category }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Componente Figma: CategoryChip (Page 1)
 * Mapeo 1:1 con las 4 categorías de Figma:
 * - Transporte: Icon 🚌, Color #2E8BA8, Bg #E0F2FE
 * - Comida:     Icon 🍔, Color #1E3A5F, Bg #BFE0F5
 * - Libros:     Icon 📚, Color #8E6BBF, Bg #EDE9FE
 * - Salud:      Icon 💊, Color #E11D48, Bg #FFE4E6
 * - State Selected: Fill = Color, Stroke = #0B192C (2px), Text = #FFFFFF
 */
const props = defineProps({
  category: { type: String, required: true },
  icon: { type: String, default: '' },
  selected: { type: Boolean, default: false }
})

defineEmits(['click'])

const categorySlug = computed(() => {
  const norm = props.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  if (norm.includes('trans')) return 'transporte'
  if (norm.includes('comid') || norm.includes('alim')) return 'comida'
  if (norm.includes('libr') || norm.includes('estud') || norm.includes('foto')) return 'libros'
  if (norm.includes('salud')) return 'salud'
  if (norm.includes('beca')) return 'beca'
  return 'general'
})

const defaultIcon = computed(() => {
  switch (categorySlug.value) {
    case 'transporte': return '🚌'
    case 'comida': return '🍔'
    case 'libros': return '📚'
    case 'salud': return '💊'
    case 'beca': return '🎓'
    default: return '🏷️'
  }
})
</script>

<style scoped>
.c-category-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.c-category-chip:hover {
  transform: translateY(-1px);
}

.chip-icon {
  font-size: 14px;
}

/* Tokens de Categorías de Figma (Unselected) */
.cat-transporte { background-color: var(--color-chip-transporte-bg); color: var(--color-chip-transporte-color); }
.cat-comida { background-color: var(--color-chip-comida-bg); color: var(--color-chip-comida-color); }
.cat-libros { background-color: var(--color-chip-libros-bg); color: var(--color-chip-libros-color); }
.cat-salud { background-color: var(--color-chip-salud-bg); color: var(--color-chip-salud-color); }
.cat-beca { background-color: var(--color-cat-beca-bg); color: var(--color-cat-beca-text); }

/* State Selected en Figma: Fill = Color, Stroke = #0B192C (2px), Text = #FFFFFF */
.cat-transporte.is-selected { background-color: var(--color-chip-transporte-color); color: var(--color-white); border-color: var(--color-chip-selected-stroke); border-width: 2px; }
.cat-comida.is-selected { background-color: var(--color-chip-comida-color); color: var(--color-white); border-color: var(--color-chip-selected-stroke); border-width: 2px; }
.cat-libros.is-selected { background-color: var(--color-chip-libros-color); color: var(--color-white); border-color: var(--color-chip-selected-stroke); border-width: 2px; }
.cat-salud.is-selected { background-color: var(--color-chip-salud-color); color: var(--color-white); border-color: var(--color-chip-selected-stroke); border-width: 2px; }
</style>
