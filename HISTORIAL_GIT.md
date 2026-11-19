# 📋 Historial Completo de Git — Desde el Fork

> **Proyecto:** Presupuesto Estudiantil (IHC — Interacción Hombre-Computador)
> **Repositorio:** [MarcosLehonti/PROYECTO2-IHC](https://github.com/MarcosLehonti/PROYECTO2-IHC)
> **Autor del fork:** Marcos Lehonti Guzmán Montalvan (`Marcos-Lehonti`)
> **Proyecto base (forkeado de):** `Carmen21-A`
> **Fecha del fork:** 2026-10-27
> **Total de commits propios:** 47 commits (desde `ada8f40` hasta `cc46ea1`)

---

## Tabla de Contenidos

1. [Resumen Estadístico](#resumen-estadístico)
2. [Historia del Proyecto Base (antes del fork)](#1-historia-del-proyecto-base-antes-del-fork)
3. [Historia del Fork — Organizados por Hito](#2-historia-del-fork--organizados-por-hito)
   - [Clase 17 / Análisis inicial del fork](#hito-1--clase-17--análisis-inicial-del-fork)
   - [Tarea 5 — Presupuesto por Categoría](#hito-2--tarea-5--presupuesto-por-categoría)
   - [QA, Semilla y Documentación](#hito-3--qa-semilla-y-documentación)
   - [Tarea 6 — Gastos Recurrentes](#hito-4--tarea-6--gastos-recurrentes)
   - [Tarea 7 — Límites por Categoría y Mes](#hito-5--tarea-7--límites-por-categoría-y-mes)
   - [Clase 20 — Navegación por Propósito](#hito-6--clase-20--navegación-por-propósito)
   - [Tarea 8 — Metas de Ahorro](#hito-7--tarea-8--metas-de-ahorro)
   - [Clase 21 — Telemetría Local](#hito-8--clase-21--telemetría-local)
   - [Tarea 9 — Aviso Preventivo y Telemetría Extendida](#hito-9--tarea-9--aviso-preventivo-y-telemetría-extendida)
   - [Clase 22 — Eliminación de Dark Patterns](#hito-10--clase-22--eliminación-de-dark-patterns)
   - [Tarea 10 — Portabilidad y Baja Ética de Cuenta](#hito-11--tarea-10--portabilidad-y-baja-ética-de-cuenta)
   - [Tarea 23 — Design Tokens y Figma](#hito-12--tarea-23--design-tokens-y-figma)
   - [Despliegue y Tokens Finales](#hito-13--despliegue-y-tokens-finales)
4. [Listado Cronológico Completo de Commits del Fork](#3-listado-cronológico-completo-de-commits-del-fork)

---

## Resumen Estadístico

| Métrica | Valor |
|---|---|
| Commits del proyecto base (Carmen21-A) | ~12 commits (Tareas 1–4) |
| Commits propios del fork (Marcos-Lehonti) | **47 commits** |
| Rango de fechas del fork | 2026-10-27 → 2026-11-18 |
| Hitos cubiertos | 13 hitos (Tareas 5–10 + Clases 17, 20, 21, 22, 23) |
| Ramas activas | `main` |
| Último commit | `cc46ea1` — 2026-11-18 |
| Punto de fork | `ada8f40` — 2026-10-27 |

---

## 1. Historia del Proyecto Base (antes del fork)

Commits realizados por **Carmen21-A** en el repositorio original antes de que se realizara el fork. Representan las Tareas 1 a 4 del curso.

| Hash | Fecha | Mensaje |
|---|---|---|
| `5531e9c` | 2026-10-01 | crea frontend Vue 3 con barra de navegacion, logo y estilos |
| *(commits intermedios)* | 2026-10-01 → 2026-10-27 | Tareas 1–4: Backend Express, PostgreSQL, autenticación, movimientos, historial, heurísticas Nielsen |
| `4948bc2` | ~2026-10-26 | Último commit antes del fork (Tarea 4 / Heurísticas) |

> **Nota:** El fork se realizó tomando como base el estado del repositorio de Carmen21-A el día **2026-10-27**. A partir del commit `ada8f40` todos los commits son de autoría propia (Marcos-Lehonti).

---

## 2. Historia del Fork — Organizados por Hito

---

### Hito 1 — Clase 17 / Análisis inicial del fork

> **Fecha:** 2026-10-27 | **Propósito:** Análisis del proyecto recibido y refactor de código previo a la extensión funcional.

| Hash | Fecha | Mensaje | Tipo |
|---|---|---|---|
| `ada8f40` | 2026-10-27 | docs: analizar proyecto recibido. ⬅ **PUNTO DE FORK** | 📄 Docs |
| `52e72e2` | 2026-10-29 | refactor de la clase 17 | ♻️ Refactor |

**Descripción:** Se tomó el proyecto base, se analizó su arquitectura (Vue 3 + Express + PostgreSQL) y se realizaron refactors de código previo a la implementación de nuevas tareas.

---

### Hito 2 — Tarea 5 — Presupuesto por Categoría

> **Fecha:** 2026-10-29 | **Propósito:** Implementación completa (BD, backend, frontend y tests) del módulo de presupuesto por categoría.

| Hash | Fecha | Mensaje | Tipo |
|---|---|---|---|
| `57c6667` | 2026-10-29 | TAREA5: BASE DE DATOS PRESUPUESTO MENSUAL POR CATEGORIA | 🗄️ BD |
| `dd855e2` | 2026-10-29 | TAREA5: BACKEND + TEST PRESUPUESTO POR CATEGORIA | ⚙️ Backend |
| `b15f4e5` | 2026-10-29 | TAREA5: FRONTEND PRESUPUESTO POR CATEGORIA | 🎨 Frontend |
| `8b99b60` | 2026-10-29 | tarea5.md | 📄 Docs |
| `cbc882f` | 2026-10-29 | test: automatizar flujo principal | 🧪 Test |

**Descripción:** Creación de la tabla `presupuesto_categoria` en PostgreSQL, endpoints REST para CRUD de presupuestos, panel expandible en el frontend para visualizar gastos acumulados vs presupuesto por categoría, documentación en `tarea5.md` y automatización del flujo principal con Playwright.

---

### Hito 3 — QA, Semilla y Documentación

> **Fecha:** 2026-11-01 → 2026-11-02 | **Propósito:** Mejora de datos de semilla, pruebas adicionales y documentación técnica.

| Hash | Fecha | Mensaje | Tipo |
|---|---|---|---|
| `b9fda47` | 2026-11-01 | dato semilla | 🌱 Seed |
| `2ef5e02` | 2026-11-01 | Backend : test de pruebas de flujos y documentacion en el md | 🧪 Test |
| `3ad0342` | 2026-11-02 | Test faltantes | 🧪 Test |
| `3c08341` | 2026-11-02 | documentacion | 📄 Docs |

**Descripción:** Ajuste de datos semilla para pruebas (`global-setup`), adición de tests de flujo faltantes en backend y actualización de la documentación técnica del proyecto.

---

### Hito 4 — Tarea 6 — Gastos Recurrentes

> **Fecha:** 2026-11-03 | **Propósito:** Implementación del módulo de gastos/ingresos recurrentes con soporte de BD, backend, frontend y aislamiento de datos en tests.

| Hash | Fecha | Mensaje | Tipo |
|---|---|---|---|
| `efd2b2e` | 2026-11-03 | cambios sin subir y base de datos para nueva funcionalidad: Gasto recurrente-base de datos | 🗄️ BD |
| `8e70e0d` | 2026-11-03 | Gasto recurrentes: backend | ⚙️ Backend |
| `6a0553d` | 2026-11-03 | Gastos recurrentes: frontend | 🎨 Frontend |
| `f9adda6` | 2026-11-03 | Tarea 6.md | 📄 Docs |
| `c6f87b9` | 2026-11-03 | test: configurar globalSetup para aislamiento de datos y 24/24 tests pasando | 🧪 Test |
| `cf81929` | 2026-11-03 | clase 19 _ feedback | 📄 Docs |

**Descripción:** Tabla `movimientos_recurrentes` en PostgreSQL, lógica de procesamiento automático en backend, UI con modal de creación de recurrentes en el frontend, configuración de `globalSetup` de Playwright para aislamiento total de datos entre tests (logrando 24/24 tests pasando), y feedback de la Clase 19.

---

### Hito 5 — Tarea 7 — Límites por Categoría y Mes

> **Fecha:** 2026-11-05 | **Propósito:** Cálculo dinámico de gasto acumulado vs límite por categoría y mes, con estados visuales (Dentro, ≥80%, Excedido) y suite E2E completa.

| Hash | Fecha | Mensaje | Tipo |
|---|---|---|---|
| `91d1f52` | 2026-11-05 | feat(ux): correciones tarea-7 - renombrar boton y fecha por defecto (feedback Lorgio) | ✨ Feat/UX |
| `1f89d4a` | 2026-11-05 | feat: limites por categoria y mes, calculo dinamico y suite e2e tarea-7 | ✨ Feat |
| `1c4b395` | 2026-11-05 | docs: estructurar tarea-7.md en dos secciones (feedback y nueva funcionalidad) | 📄 Docs |

**Descripción:** Implementación de límites mensuales por categoría con recálculo automático al editar, cambiar categoría o eliminar gastos. Panel de estados con colores (verde/amarillo/rojo). Suite E2E `limite-categoria-mes.spec.js` con 2 escenarios. Documentación organizada con retroalimentación del docente.

---

### Hito 6 — Clase 20 — Navegación por Propósito

> **Fecha:** 2026-11-05 | **Propósito:** Documentación y análisis de la clase 20 sobre navegación orientada a propósito del usuario.

| Hash | Fecha | Mensaje | Tipo |
|---|---|---|---|
| `01362bb` | 2026-11-05 | Tarea clase 20 | 📄 Docs |
| `563e497` | 2026-11-05 | docs: actualizar enlace al commit en clase20.md | 📄 Docs |
| `e0e1c18` | 2026-11-05 | docs: renombrar clase20.md a clase-20.md | 📄 Docs |

**Descripción:** Creación y refinamiento del documento `clase-20.md` con análisis de patrones de navegación por propósito aplicados al proyecto.

---

### Hito 7 — Tarea 8 — Metas de Ahorro

> **Fecha:** 2026-11-09 → 2026-11-10 | **Propósito:** Módulo completo de metas de ahorro con seguimiento de progreso, modales de interacción y pruebas automatizadas.

| Hash | Fecha | Mensaje | Tipo |
|---|---|---|---|
| `3aeac9c` | 2026-11-09 | Tarea-8: modificaciones en los modelos | 🗄️ BD |
| `cafcbf8` | 2026-11-09 | Tarea-8: Esquemas | 🗄️ BD |
| `de125ba` | 2026-11-09 | Tarea*: rutas | ⚙️ Backend |
| `4360c38` | 2026-11-09 | Tarea-8: rutas/metas | ⚙️ Backend |
| `f46202b` | 2026-11-09 | Tarea-8: backend completado | ⚙️ Backend |
| `5df9a2e` | 2026-11-09 | Tarea-8: frontend pestaña de metas de ahorro | 🎨 Frontend |
| `4d9c517` | 2026-11-09 | Tarea-8: Frontend | 🎨 Frontend |
| `d7e0ad4` | 2026-11-09 | Tarea-8: frontend modales de interaccion para metas de ahorro | 🎨 Frontend |
| `590aa6c` | 2026-11-09 | Tarea-8: frontend completo | 🎨 Frontend |
| `36c2ca4` | 2026-11-09 | Tarea-8: Pruebas | 🧪 Test |
| `ec199ad` | 2026-11-10 | Tarea-8 md | 📄 Docs |

**Descripción:** Es el hito más grande del fork (11 commits). Tabla `metas_ahorro` con modelo de progreso, endpoints CRUD completos, pestaña `/metas` en el frontend con barra de progreso visual, modales de creación/edición/eliminación, suite de pruebas E2E para metas de ahorro, y documentación en `tarea-8.md`.

---

### Hito 8 — Clase 21 — Telemetría Local

> **Fecha:** 2026-11-10 | **Propósito:** Implementación de telemetría en frontend con almacenamiento local para análisis de comportamiento del usuario.

| Hash | Fecha | Mensaje | Tipo |
|---|---|---|---|
| `9664eb9` | 2026-11-10 | clase 21 Tarea | 📄 Docs |
| `d468600` | 2026-11-10 | clase 21: telemetria en frontend con almacenamiento local | ✨ Feat |

**Descripción:** Integración de un sistema de telemetría en el frontend que registra eventos de navegación y acciones del usuario en `localStorage`, como base para análisis de embudos en la Tarea 9.

---

### Hito 9 — Tarea 9 — Aviso Preventivo y Telemetría Extendida

> **Fecha:** 2026-11-12 | **Propósito:** Sistema de aviso preventivo antes de superar límite de categoría, panel de embudos en `/analitica` y pruebas E2E con capturas de pantalla.

| Hash | Fecha | Mensaje | Tipo |
|---|---|---|---|
| `541ec2b` | 2026-11-12 | Tarea-9: Aviso predictivo antes de superar limite de categoria | ✨ Feat |
| `d805f06` | 2026-11-12 | Tarea-9 Parte A: Telemetria extendida y panel de embudos en /analitica | ✨ Feat |
| `64a1a7a` | 2026-11-12 | tarea9: evidencias, test E2E y screenshots parte B | 🧪 Test |

**Descripción:** Aviso visual/modal cuando el gasto de una categoría supera el 80% del límite (patrón ético de pre-aviso), panel `/analitica` con visualización de embudos basados en telemetría, tests E2E para ambas funcionalidades con capturas de evidencia.

---

### Hito 10 — Clase 22 — Eliminación de Dark Patterns

> **Fecha:** 2026-11-12 | **Propósito:** Corrección ética de la confirmación con culpa ("confirm-shaming") en el aviso de límite, aplicando Heurística Nielsen #3 (Control y Libertad).

| Hash | Fecha | Mensaje | Tipo |
|---|---|---|---|
| `3cc149e` | 2026-11-12 | fix(etica): corregir confirmacion con culpa en aviso de limite aplicando nielsen 3 control y libertad | 🔧 Fix/Ética |

**Descripción:** Se identificó y corrigió un dark pattern de tipo "confirm-shaming" en el modal de aviso de límite. El texto del botón de cancelación fue cambiado de una frase manipuladora a una opción neutral, aplicando correctamente la heurística de Control y Libertad del Usuario.

---

### Hito 11 — Tarea 10 — Portabilidad y Baja Ética de Cuenta

> **Fecha:** 2026-11-15 | **Propósito:** Endpoints de exportación de datos (JSON/CSV), eliminación honesta de cuenta con "regla difícil", telemetría de baja y pruebas E2E completas.

| Hash | Fecha | Mensaje | Tipo |
|---|---|---|---|
| `cf00931` | 2026-11-15 | Tarea10: feat(backend): endpoints de exportacion de datos y eliminacion de cuenta con regla dificil | ⚙️ Backend |
| `4256998` | 2026-11-15 | Tarea10: feat(frontend): interfaz de mi cuenta, navegacion y portabilidad de datos (JSON/CSV) | 🎨 Frontend |
| `9cd9086` | 2026-11-15 | Tarea10: feat(telemetria): registro de eventos de baja de cuenta y actualizacion de panel analitica | ✨ Feat |
| `04e5492` | 2026-11-15 | Tarea10: test(e2e): pruebas automatizadas de portabilidad y eliminacion honesta de cuenta con capturas | 🧪 Test |
| `e9bd296` | 2026-11-15 | Tarea10: docs: informe de evidencias tarea 10 con tabla de 6 patrones eticos y capturas | 📄 Docs |

**Descripción:** Implementación del derecho a la portabilidad (descarga de datos en JSON/CSV desde `/mi-cuenta`), eliminación de cuenta con confirmación honesta y "regla difícil" (bloqueo si hay movimientos pendientes), registro de eventos de baja en telemetría, suite E2E `tarea10-portabilidad-y-baja-cuenta.spec.js` con capturas de pantalla, e informe de 6 patrones éticos aplicados.

---

### Hito 12 — Tarea 23 — Design Tokens y Figma

> **Fecha:** 2026-11-17 | **Propósito:** Inventario de componentes, design tokens y mapeo de tokens Figma al código.

| Hash | Fecha | Mensaje | Tipo |
|---|---|---|---|
| `77741ac` | 2026-11-17 | Tarea-23.md : Inventario y Tokens | 📄 Docs |

**Descripción:** Creación del inventario de componentes UI del proyecto con mapeo de tokens de diseño (colores, tipografía, espaciado) desde Figma al código Vue 3. Documento `MATRIZ_COMPONENTES_TOKENS_FIGMA.md` generado.

---

### Hito 13 — Despliegue y Tokens Finales

> **Fecha:** 2026-11-18 | **Propósito:** Preparación para despliegue e integración final de tokens de Figma en el código fuente.

| Hash | Fecha | Mensaje | Tipo |
|---|---|---|---|
| `d34f425` | 2026-11-18 | preparado para despliegue | 🚀 Deploy |
| `cc46ea1` | 2026-11-18 | tokens de figma en el codigo ⬅ **HEAD / main** | ✨ Feat |

**Descripción:** Ajustes de configuración para despliegue en producción e integración de los design tokens de Figma directamente en las variables CSS y componentes Vue del proyecto.

---

## 3. Listado Cronológico Completo de Commits del Fork

> Total: **47 commits** propios (desde el punto de fork hasta HEAD).

| # | Hash | Fecha | Mensaje | Hito |
|---|---|---|---|---|
| 1 | `ada8f40` | 2026-10-27 | docs: analizar proyecto recibido. ⬅ FORK | H1 |
| 2 | `52e72e2` | 2026-10-29 | refactor de la clase 17 | H1 |
| 3 | `57c6667` | 2026-10-29 | TAREA5: BASE DE DATOS PRESUPUESTO MENSUAL POR CATEGORIA | H2 |
| 4 | `dd855e2` | 2026-10-29 | TAREA5: BACKEND + TEST PRESUPUESTO POR CATEGORIA | H2 |
| 5 | `b15f4e5` | 2026-10-29 | TAREA5: FRONTEND PRESUPUESTO POR CATEGORIA | H2 |
| 6 | `8b99b60` | 2026-10-29 | tarea5.md | H2 |
| 7 | `cbc882f` | 2026-10-29 | test: automatizar flujo principal | H2 |
| 8 | `b9fda47` | 2026-11-01 | dato semilla | H3 |
| 9 | `2ef5e02` | 2026-11-01 | Backend : test de pruebas de flujos y documentacion en el md | H3 |
| 10 | `3ad0342` | 2026-11-02 | Test faltantes | H3 |
| 11 | `3c08341` | 2026-11-02 | documentacion | H3 |
| 12 | `efd2b2e` | 2026-11-03 | cambios sin subir y base de datos para nueva funcionalidad: Gasto recurrente-base de datos | H4 |
| 13 | `8e70e0d` | 2026-11-03 | Gasto recurrentes: backend | H4 |
| 14 | `6a0553d` | 2026-11-03 | Gastos recurrentes: frontend | H4 |
| 15 | `f9adda6` | 2026-11-03 | Tarea 6.md | H4 |
| 16 | `c6f87b9` | 2026-11-03 | test: configurar globalSetup para aislamiento de datos y 24/24 tests pasando | H4 |
| 17 | `cf81929` | 2026-11-03 | clase 19 _ feedback | H4 |
| 18 | `91d1f52` | 2026-11-05 | feat(ux): correciones tarea-7 - renombrar boton y fecha por defecto (feedback Lorgio) | H5 |
| 19 | `1f89d4a` | 2026-11-05 | feat: limites por categoria y mes, calculo dinamico y suite e2e tarea-7 | H5 |
| 20 | `1c4b395` | 2026-11-05 | docs: estructurar tarea-7.md en dos secciones (feedback y nueva funcionalidad) | H5 |
| 21 | `01362bb` | 2026-11-05 | Tarea clase 20 | H6 |
| 22 | `563e497` | 2026-11-05 | docs: actualizar enlace al commit en clase20.md | H6 |
| 23 | `e0e1c18` | 2026-11-05 | docs: renombrar clase20.md a clase-20.md | H6 |
| 24 | `3aeac9c` | 2026-11-09 | Tarea-8: modificaciones en los modelos | H7 |
| 25 | `cafcbf8` | 2026-11-09 | Tarea-8: Esquemas | H7 |
| 26 | `de125ba` | 2026-11-09 | Tarea*: rutas | H7 |
| 27 | `4360c38` | 2026-11-09 | Tarea-8: rutas/metas | H7 |
| 28 | `f46202b` | 2026-11-09 | Tarea-8: backend completado | H7 |
| 29 | `5df9a2e` | 2026-11-09 | Tarea-8: frontend pestaña de metas de ahorro | H7 |
| 30 | `4d9c517` | 2026-11-09 | Tarea-8: Frontend | H7 |
| 31 | `d7e0ad4` | 2026-11-09 | Tarea-8: frontend modales de interaccion para metas de ahorro | H7 |
| 32 | `590aa6c` | 2026-11-09 | Tarea-8: frontend completo | H7 |
| 33 | `36c2ca4` | 2026-11-09 | Tarea-8: Pruebas | H7 |
| 34 | `ec199ad` | 2026-11-10 | Tarea-8 md | H7 |
| 35 | `9664eb9` | 2026-11-10 | clase 21 Tarea | H8 |
| 36 | `d468600` | 2026-11-10 | clase 21: telemetria en frontend con almacenamiento local | H8 |
| 37 | `541ec2b` | 2026-11-12 | Tarea-9: Aviso predictivo antes de superar limite de categoria | H9 |
| 38 | `d805f06` | 2026-11-12 | Tarea-9 Parte A: Telemetria extendida y panel de embudos en /analitica | H9 |
| 39 | `64a1a7a` | 2026-11-12 | tarea9: evidencias, test E2E y screenshots parte B | H9 |
| 40 | `3cc149e` | 2026-11-12 | fix(etica): corregir confirmacion con culpa en aviso de limite aplicando nielsen 3 control y libertad | H10 |
| 41 | `cf00931` | 2026-11-15 | Tarea10: feat(backend): endpoints de exportacion de datos y eliminacion de cuenta con regla dificil | H11 |
| 42 | `4256998` | 2026-11-15 | Tarea10: feat(frontend): interfaz de mi cuenta, navegacion y portabilidad de datos (JSON/CSV) | H11 |
| 43 | `9cd9086` | 2026-11-15 | Tarea10: feat(telemetria): registro de eventos de baja de cuenta y actualizacion de panel analitica | H11 |
| 44 | `04e5492` | 2026-11-15 | Tarea10: test(e2e): pruebas automatizadas de portabilidad y eliminacion honesta de cuenta con capturas | H11 |
| 45 | `e9bd296` | 2026-11-15 | Tarea10: docs: informe de evidencias tarea 10 con tabla de 6 patrones eticos y capturas | H11 |
| 46 | `77741ac` | 2026-11-17 | Tarea-23.md : Inventario y Tokens | H12 |
| 47 | `d34f425` | 2026-11-18 | preparado para despliegue | H13 |
| 48 | `cc46ea1` | 2026-11-18 | tokens de figma en el codigo ⬅ HEAD | H13 |

---

## Leyenda de Tipos de Commit

| Ícono | Tipo | Descripción |
|---|---|---|
| 📄 | Docs | Documentación o informes |
| ♻️ | Refactor | Reorganización de código sin cambio de funcionalidad |
| 🗄️ | BD | Cambios en base de datos (migraciones, modelos) |
| ⚙️ | Backend | Lógica de servidor, rutas, controladores |
| 🎨 | Frontend | Componentes Vue, estilos, UI |
| 🧪 | Test | Pruebas automatizadas (Playwright E2E) |
| 🌱 | Seed | Datos de semilla para pruebas |
| ✨ | Feat | Nueva funcionalidad |
| 🔧 | Fix | Corrección de errores o mejoras éticas |
| 🚀 | Deploy | Preparación para despliegue |

---

*Documento generado automáticamente a partir del historial de `git log` del repositorio `MarcosLehonti/PROYECTO2-IHC`.*
*Última actualización: 2026-11-18*
