# INSTRUCCIONES — Estado de la Tarea 6 (IHC)

> **IMPORTANTE:** Este archivo es para que el agente de IA (Antigravity) sepa
> exactamente dónde quedamos y qué falta. Léelo completo antes de hacer cualquier cosa.

---

## Datos del proyecto

- **Alumno:** Guzmán Montalván Marcos Lehonti
- **Materia:** Interacción Hombre-Computador (IHC)
- **Proyecto:** Presupuesto Estudiantil (fork)
- **Entrega:** martes 03/11/2026 a las 18:00
- **Workspace:** `PROYECTO2-IHC/`

---

## Datos técnicos

| Componente | Detalle |
|---|---|
| Backend | FastAPI + SQLAlchemy, puerto 8000 |
| Frontend | Vue 3 + Vite, puerto 5173 |
| BD | PostgreSQL `presupuesto_estudiantil2`, localhost:5432, user `postgres` |
| Test runner | Playwright (JS/Node), pnpm |
| pnpm path | `C:\Users\HP\AppData\Local\pnpm\bin\pnpm.cmd` |
| Node | v22.17.0 |
| Usuario de prueba | `marcos@gmail.com` / `123456` |
| Semilla | `pnpm run seed` (limpia BD y carga datos conocidos) |

### Cómo arrancar el entorno

1. Backend: ejecutar `iniciar_backend.bat` o manualmente activar venv + `uvicorn main:app --reload` en `PRESUPUESTO ESTUDIANTIL/BACKEND/`
2. Frontend: ejecutar `iniciar_frontend.bat` o `npm run dev` en `PRESUPUESTO ESTUDIANTIL/FRONTEND/`
3. Antes de cada tanda de tests: `pnpm run seed` para resetear datos limpios

### Cómo ejecutar tests

```powershell
# Todos los tests
pnpm exec playwright test

# Un test específico (ejemplo)
pnpm exec playwright test login --headed

# Con reporte visual
pnpm exec playwright test --reporter=html
```

---

## Reglas de trabajo (MUY IMPORTANTE)

1. **NUNCA reescribir archivos completos** — usar `edit_file` quirúrgico. El profesor revisa git diff.
2. **Max ~50-100 líneas** por cambio en el diff (evitar que se vea artificial).
3. **Un test a la vez** — el alumno lo ejecuta, verifica, y luego se continúa.
4. **workers: 1** ya configurado en `playwright.config.js` (los tests corren en serie).
5. **Capturas automáticas** de Playwright van a `docs/evidencias/tarea-6/`.
6. **Evidencia completa** en `docs/evidencias/tarea-6.md` — cada test tiene su sección con tabla de verificaciones + imágenes.
7. **Solo pnpm**, nunca npm.
8. Al hacer el `selectOption` del mes en el formulario de registro, usar `.col-fecha-mes select` (NO `.select-mes-custom` porque esa clase está duplicada en el select de categoría).

---

## ✅ Tests COMPLETADOS (todos en verde)

| # | Test | Archivo | Estado |
|---|------|---------|--------|
| 1 | Login y Logout (principal + contraseña incorrecta) | `tests/login.spec.js` | ✅ 2 passed |
| 2 | Registrar Gasto (principal + cancelar) | `tests/registrar-gasto.spec.js` | ✅ 2 passed |
| 3 | Marcar como Pagado (transición + bloqueo doble pago) | `tests/marcar-pagado.spec.js` | ✅ 2 passed |
| 4 | Editar y Eliminar (editar desc + monto bloqueado + eliminar con confirm) | `tests/editar-eliminar.spec.js` | ✅ 3 passed |
| 5 | Buscar y Filtrar (búsqueda texto + filtro tipo + lista vacía) | `tests/filtros.spec.js` | ✅ 3 passed |

**Total completado: 12 tests, 18 capturas en `docs/evidencias/tarea-6/`**

---

## 🔲 Tests PENDIENTES por crear

Estos deben seguir el mismo patrón: archivo `.spec.js` en `tests/`, capturas en `docs/evidencias/tarea-6/`, sección documentada en `docs/evidencias/tarea-6.md`.

### 6. Definir límite mensual — `tests/limite-mensual.spec.js`
- Flujo principal: Abrir modal "Cambiar límite", poner un nuevo valor, guardar y verificar que la barra y cifras se actualicen.
- Flujo alternativo: Registrar un gasto que supere el límite → verificar mensaje de error.
- Selectores clave: `button.btn-limite` (abre modal), modal tiene clase `.dashboard-modal-card`, input de límite, `button.btn-guardar-principal`.

### 7. Presupuesto por categoría — `tests/presupuesto-categoria.spec.js`
- Flujo: Pulsar "▼ Ver presupuesto por categoría", asignar presupuesto a una categoría con `prompt()` (la app usa `prompt()`), verificar que aparezca el consumo.
- Nota: El frontend usa `prompt()` nativo para pedir el monto. Playwright puede interceptarlo con `page.on('dialog')`.

### 8. Ver historial — `tests/historial.spec.js`
- Flujo: Navegar a `/historial`, verificar que aparezca el mes actual, verificar que se muestren los movimientos.
- Selectores: link "Historial" en el navbar (`a[href="/historial"]`).

### 9. Accesibilidad (axe-core) — `tests/accesibilidad.spec.js`
- Ya tenemos instalado `@axe-core/playwright`.
- Flujo: Cargar la página principal de movimientos, correr `new AxeBuilder({ page }).analyze()`, verificar que no haya violaciones críticas.
- Captura: screenshot de la página + log de violaciones encontradas.

### 10. Gastos recurrentes (NUEVA FEATURE - Parte B) — `tests/recurrentes.spec.js`
- **PRIMERO hay que implementar la feature** (ver sección siguiente).
- Luego crear el test: registrar gasto con recurrencia "semanal", marcarlo como pagado, verificar que aparezca automáticamente el siguiente con fecha +7 días.

---

## 🔲 PARTE B: Implementar Feature "Gastos Recurrentes"

Esta es la feature nueva que pide la tarea. Debe implementarse DESPUÉS de tener la evidencia "ANTES" (todos los tests en verde sin la feature).

### Diseño acordado

- Al crear un movimiento, se elige "se repite: ninguna / semanal / mensual".
- Cuando marcas como pagado un gasto recurrente, el sistema crea automáticamente la siguiente ocurrencia (fecha +7 días o +1 mes).
- El test verifica: marcar pagado → aparece nueva fila con fecha correcta → el consumo de la categoría sube.

### Cambios necesarios (quirúrgicos)

1. **`BACKEND/models.py`** — Agregar columna `recurrencia = Column(String(10), default="ninguna")` al modelo `Movimiento`.
2. **`BASE DE DATOS/schema.sql`** — Agregar columna `recurrencia VARCHAR(10) DEFAULT 'ninguna'` a la tabla.
3. **`BACKEND/main.py`** — En el bloque `inspect()`, agregar migración para la columna nueva (mismo patrón que `estado` y `limite_mensual`).
4. **`BACKEND/schemas.py`** — Agregar `recurrencia: Optional[str] = "ninguna"` a `MovimientoCreate` y `MovimientoOut`.
5. **`BACKEND/routers/movimientos.py`** — En `marcar_como_pagado()`: si `recurrencia != "ninguna"`, crear nuevo movimiento con `fecha + 7 días` o `fecha + 1 mes` y `estado="pendiente"`.
6. **`FRONTEND/.../MovimientosView.vue`** — En el formulario de registro, agregar un selector con opciones: ninguna / semanal / mensual (~10-15 líneas).
7. **`tests/recurrentes.spec.js`** — Test E2E completo.

---

## Orden de los pasos restantes

```
[Paso 1] Crear tests pendientes: limite-mensual, presupuesto-categoria, historial, accesibilidad
    ↓
[Paso 2] Correr TODA la suite: pnpm exec playwright test → TODOS en verde
    ↓
[Paso 3] Evidencia "ANTES": captura de terminal mostrando todos los tests pasando
    ↓
[Paso 4] Implementar feature "Gastos Recurrentes" (backend + frontend + test)
    ↓
[Paso 5] Correr TODA la suite de nuevo → TODOS en verde incluyendo recurrentes
    ↓
[Paso 6] Evidencia "DESPUÉS": captura de terminal + completar docs/evidencias/tarea-6.md
    ↓
[Paso 7] Commit y push al fork
```

---

## Archivos clave del proyecto

| Archivo | Propósito |
|---------|-----------|
| `playwright.config.js` | Config: baseURL localhost:5173, workers:1, solo chromium |
| `package.json` | Scripts: seed, test:e2e, test:e2e:ui, test:e2e:headed |
| `seed.js` + `BACKEND/seed.py` | Semilla: limpia BD y carga datos conocidos |
| `tests/*.spec.js` | Tests E2E de Playwright |
| `docs/evidencias/tarea-6.md` | Documento maestro de evidencias con matriz y capturas |
| `docs/evidencias/tarea-6/*.png` | Capturas automáticas de Playwright |
| `PRESUPUESTO ESTUDIANTIL/FRONTEND/src/views/MovimientosView.vue` | Vista principal (~2900 líneas) |
| `PRESUPUESTO ESTUDIANTIL/BACKEND/routers/movimientos.py` | API de movimientos |
| `PRESUPUESTO ESTUDIANTIL/BACKEND/models.py` | Modelos SQLAlchemy |
| `PRESUPUESTO ESTUDIANTIL/BACKEND/schemas.py` | Schemas Pydantic |

---

*Última actualización: 01/11/2026 15:30*




[Paso 1] Semilla: Comando para reiniciar datos de prueba limpios.
   ↓
[Paso 2] E2E Base: Escribir los tests de los flujos actuales con Playwright.
   ↓
[Paso 3] Accesibilidad y visual: Revisión con @axe-core y capturas.
   ↓
[Paso 4] Evidencia "ANTES": Ejecutar todo y guardar el reporte en verde.
   ↓
[Paso 5] Nueva Feature (Recurrentes): Agregar base de datos, backend y frontend.
   ↓
[Paso 6] Evidencia "DESPUÉS": Correr todo, verificar que pase y llenar docs/evidencias/tarea-6.md.