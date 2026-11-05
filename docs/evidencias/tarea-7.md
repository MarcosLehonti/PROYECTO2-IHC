# Tarea 7 — Mejoras de UX basadas en Feedback entre Pares

**Proyecto:** Presupuesto Estudiantil  
**Alumno:** Guzmán Montalvan Marcos Lehonti  
**Fecha:** 05 de Noviembre de 2026  
**Repositorio propio:** https://github.com/MarcosLehonti/PROYECTO2-IHC.git  
**Repositorio evaluado (grupo que nos evaluó):** https://github.com/Lorgio09/proyecto2_ihc.git

---

## Contexto: Feedback recibido en Clase 19

Durante la **Clase 19 — Evaluación entre Pares**, el compañero **Lorgio Choque Severiche** (grupo Unisports) evaluó nuestra aplicación *Presupuesto Estudiantil* con el caso de uso asignado de **registrar un gasto con categoría y buscarlo con un filtro**.

El evaluador logró completar la tarea sin ayuda, pero identificó **4 puntos de fricción** de UX:

| # | Problema detectado | Severidad |
|---|---|---|
| 1 | El botón principal se llama **"Registrar Movimiento"** — término contable genérico que no deja claro si se registra un gasto, ingreso u otra cosa | Media |
| 2 | **La fecha no viene precargada** con el día actual al abrir el formulario — el usuario debe buscarla manualmente en el selector | Media |
| 3 | Faltan opciones de repetición **diaria** en el campo "¿Se repite?" | Baja |
| 4 | El campo **Estado (Pendiente/Pagado)** genera confusión — el estudiante asume que si anota un gasto ya lo pagó | Baja |

> Para esta tarea se implementaron las correcciones de los problemas **1 y 2** por ser los de mayor impacto en la usabilidad del flujo principal.

---

## Corrección 1 — Renombrar botón "Registrar Movimiento" → "Registrar Gasto"

### Problema original
El botón principal de la vista de movimientos usaba el texto técnico/contable **"Registrar Movimiento"**, que resulta ambiguo para un estudiante que no está familiarizado con terminología bancaria.

**Feedback literal del evaluador:**
> *"Lo que me confundió fue el botón 'Registrar movimiento': la palabra 'movimiento' es genérica y no deja claro si voy a registrar un gasto, un ingreso u otra cosa."*

### Archivos modificados

| Archivo | Línea | Cambio |
|---|---|---|
| [`MovimientosView.vue`](../../PRESUPUESTO%20ESTUDIANTIL/FRONTEND/src/views/MovimientosView.vue) | 149 | `"+ Registrar Movimiento"` → `"+ Registrar Gasto"` |
| [`MovimientosView.vue`](../../PRESUPUESTO%20ESTUDIANTIL/FRONTEND/src/views/MovimientosView.vue) | 265 | Texto del estado vacío actualizado al nuevo nombre |
| [`HistorialView.vue`](../../PRESUPUESTO%20ESTUDIANTIL/FRONTEND/src/views/HistorialView.vue) | 50 | Botón de historial vacío también actualizado |

### Diff del cambio principal

**Antes:**
```html
<span class="plus-icon">+</span> Registrar Movimiento
```

**Después:**
```html
<span class="plus-icon">+</span> Registrar Gasto
```

---

## Corrección 2 — Fecha del día actual por defecto en el formulario

### Problema original
Al abrir el formulario de registro, los campos de **Día** y **Mes** tenían valores hardcodeados (`1` y `'Octubre'` respectivamente). Esto obligaba al usuario a navegar manualmente hasta la fecha correcta cada vez que quería registrar un gasto del día.

Adicionalmente, el año estaba hardcodeado como `2026` en la lógica de construcción de la fecha ISO, lo que rompería la app en un año diferente.

**Feedback literal del evaluador:**
> *"La fecha no viene cargada por defecto. Resultado esperado: que la fecha de hoy aparezca seleccionada, ya que la mayoría de los gastos se anotan el mismo día en que ocurren."*

### Archivos modificados

| Archivo | Línea | Cambio |
|---|---|---|
| [`MovimientosView.vue`](../../PRESUPUESTO%20ESTUDIANTIL/FRONTEND/src/views/MovimientosView.vue) | 1262 | `ref(1)` → `ref(hoy.getDate())` |
| [`MovimientosView.vue`](../../PRESUPUESTO%20ESTUDIANTIL/FRONTEND/src/views/MovimientosView.vue) | 1263 | `ref('Octubre')` → `ref(mesesDisponibles[hoy.getMonth()])` |
| [`MovimientosView.vue`](../../PRESUPUESTO%20ESTUDIANTIL/FRONTEND/src/views/MovimientosView.vue) | 1280 | `\`2026-${mesStr}-${diaStr}\`` → `\`${hoy.getFullYear()}-${mesStr}-${diaStr}\`` |
| [`MovimientosView.vue`](../../PRESUPUESTO%20ESTUDIANTIL/FRONTEND/src/views/MovimientosView.vue) | 1338 | `const anio = 2026` → `const anio = hoy.getFullYear()` |
| [`MovimientosView.vue`](../../PRESUPUESTO%20ESTUDIANTIL/FRONTEND/src/views/MovimientosView.vue) | 1411–1412 | `limpiarFormularioGasto()` también restaura a la fecha actual |

### Diff del cambio principal

**Antes:**
```js
const diaGasto = ref(1)
const mesGasto = ref('Octubre')
```

**Después:**
```js
const diaGasto = ref(hoy.getDate())
const mesGasto = ref(mesesDisponibles[hoy.getMonth()])
```

> [!NOTE]
> `hoy` ya estaba declarado como `const hoy = new Date()` a nivel de módulo (línea 851), por lo que no fue necesario agregar ninguna dependencia nueva. El campo sigue siendo **totalmente editable** — el usuario puede seleccionar cualquier fecha pasada o futura.

### Comportamiento resultante

| Situación | Antes | Después |
|---|---|---|
| Abrir el formulario hoy, 5 de noviembre | Día: `1`, Mes: `Octubre` | Día: `5`, Mes: `Noviembre` ✅ |
| Registrar un gasto de un día anterior | Usuario debía cambiar ambos campos | Puede cambiar solo el día (mes ya es correcto) ✅ |
| Registrar un gasto futuro | Usuario debía cambiar ambos campos | Solo cambia los que necesite ✅ |
| Reutilizar el formulario (cancelar y abrir de nuevo) | Siempre volvía a `1 / Octubre` | Restaura al día actual del sistema ✅ |

---

## Capturas de evidencia

> Para obtener las capturas del estado corregido, inicia la aplicación y toma una captura del formulario abierto mostrando:
> - El botón principal que ahora dice **"+ Registrar Gasto"**
> - El campo Día con el número de hoy precargado
> - El campo Mes con el mes actual seleccionado

Guarda las capturas como:
- `docs/evidencias/tarea-7/tarea7-01-boton-registrar-gasto.png`
- `docs/evidencias/tarea-7/tarea7-02-fecha-por-defecto.png`

---

## Problemas identificados pero no implementados en esta tarea

| # | Problema | Razón de no implementación |
|---|---|---|
| 3 | Agregar opción "Diario" en recurrencia | Requiere cambios en BD, backend y frontend — scope de tarea futura |
| 4 | Campo Estado genera confusión | El sistema de pendiente/pagado es una funcionalidad central de la app y cambiarla requeriría rediseño del flujo de pagos |

---

## Referencias

- **Feedback recibido de:** Lorgio Choque Severiche  
- **Repositorio del evaluador:** https://github.com/Lorgio09/proyecto2_ihc.git  
- **Archivo de feedback dado:** [`docs/clase-19-feedback-a-otr-proyecto-/Guzman-Montalvan/feedback.md`](../clase-19-feedback-a-otr-proyecto-/Guzman-Montalvan/feedback.md)  
- **Vista modificada:** [`PRESUPUESTO ESTUDIANTIL/FRONTEND/src/views/MovimientosView.vue`](../../PRESUPUESTO%20ESTUDIANTIL/FRONTEND/src/views/MovimientosView.vue)  
- **Vista de historial modificada:** [`PRESUPUESTO ESTUDIANTIL/FRONTEND/src/views/HistorialView.vue`](../../PRESUPUESTO%20ESTUDIANTIL/FRONTEND/src/views/HistorialView.vue)
