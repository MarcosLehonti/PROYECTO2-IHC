<template>
  <div :class="['c-progress-bar', `size-${size}`, `status-${computedStatus}`]">
    <div class="progress-track">
      <div
        class="progress-fill"
        :style="{ width: `${clampedPercentage}%` }"
        role="progressbar"
        :aria-valuenow="clampedPercentage"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
    <div v-if="showLabel" class="progress-labels">
      <span class="progress-caption">{{ label }}</span>
      <span class="progress-percent">{{ percentage.toFixed(1) }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Componente Figma: ProgressBar (Page 1)
 * Mapeo 1:1 con las variantes de Figma:
 * - Status: Normal (<70%), Aviso (70-89%), Peligro (>=90%)
 * - Size: Full, Compact
 * Colores de Figma:
 * - Track:   #E2E8F0
 * - Normal:  #0284C7 (pct 60%)
 * - Aviso:   #F59E0B (pct 82%)
 * - Peligro: #E11D48 (pct 105%)
 */
const props = defineProps({
  percentage: { type: Number, default: 0 },
  status: { type: String, default: 'auto' },
  size: { type: String, default: 'full' },
  label: { type: String, default: '' },
  showLabel: { type: Boolean, default: false }
})

const clampedPercentage = computed(() => Math.min(100, Math.max(0, props.percentage)))

const computedStatus = computed(() => {
  if (props.status !== 'auto') return props.status.toLowerCase()
  if (props.percentage >= 90) return 'peligro'
  if (props.percentage >= 70) return 'aviso'
  return 'normal'
})
</script>

<style scoped>
.c-progress-bar {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-track {
  width: 100%;
  background-color: var(--color-progress-track);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.size-full .progress-track { height: 10px; }
.size-compact .progress-track { height: 6px; }

.progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.4s ease, background-color 0.3s ease;
}

/* Tokens de Figma 1:1 */
.status-normal .progress-fill { background-color: var(--color-progress-normal); }
.status-aviso .progress-fill { background-color: var(--color-progress-aviso); }
.status-peligro .progress-fill { background-color: var(--color-progress-peligro); }

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-muted);
}

.progress-percent {
  font-weight: 700;
  color: var(--color-text-main);
}
</style>
