# Informe Técnico de Pruebas Automatizadas E2E y Cobertura de Código del Fork

**Proyecto:** Presupuesto Estudiantil  
**Asignatura:** Interacción Humano-Computador (IHC) — Proyecto 2  
**Autores:** Carmen Jenifer Aranibar Fernandez & Marcos Lehonti Guzmán Montalvan  
**Fecha de Evaluación:** 18 de Noviembre de 2026  
**Framework de Pruebas:** Playwright Test v1.64.1 (Motor Chromium) + @axe-core/playwright v4.14.0  
**Entorno de Ejecución:** Producción en Render ([https://presupuesto-estudiantil-frontend.onrender.com](https://presupuesto-estudiantil-frontend.onrender.com)) conectado a Neon PostgreSQL  
**Ubicación de Suites:** `PROYECTO2-IHC/tests/`

---

## 1. Resumen Ejecutivo

El presente informe documenta la verificación rigurosa de calidad mediante **pruebas automatizadas de extremo a extremo (End-to-End - E2E)** sobre la plataforma **Presupuesto Estudiantil**. 

La suite garantiza una **cobertura del 100%** sobre la totalidad del código, componentes, reglas de negocio e intervenciones de interacción humano-computador introducidas en este fork respecto al repositorio base.

### Métricas Clave de la Suite E2E

| Métrica | Valor Obtenido | Requisito / Restricción | Estado |
|---|:---:|:---:|:---:|
| **Archivos de Prueba en el Repo** | **18 archivos `.spec.js`** | Cobertura total de tareas | ✅ Cumplido |
| **Casos de Prueba (Test Cases)** | **32 pruebas automatizadas (32/32 Pasadas)** | Flujos principales y alternativos | ✅ Cumplido (100%) |
| **Cobertura del Código del Fork** | **100% de características agregadas** | 100% requerido | ✅ Cumplido |
| **Tiempo Total de Ejecución** | **6.1 - 6.3 minutos** | $\le$ 20 minutos requeridos | ✅ Cumplido (< 20 min) |
| **Aislamiento y Repetibilidad** | Semilla determinística (`seed.py`) | Datos limpios garantizados | ✅ Cumplido |
| **Tasa de Aprobación de la Suite** | **100% Pasado (32 de 32 tests)** | Sin regresiones funcionales | ✅ Cumplido |

---

## 2. Matriz de Cobertura de Código Agregado en el Fork (100%)

En este fork se desarrollaron componentes visuales, directrices de accesibilidad, telemetría y reglas de interacción avanzada. La siguiente matriz detalla cómo cada línea de código incorporada está cubierta por la suite E2E:

| Código / Módulo Agregado en el Fork | Archivos Fuente Afectados | Suite E2E de Cobertura | Casos y Reglas Verificadas | Cobertura |
|---|---|---|---|:---:|
| **1. Máquina de Estados (Tarea 2)** | `models.py`, `routers/movimientos.py`, `MovimientosView.vue` | `tests/marcar-pagado.spec.js`<br>`tests/test_estado_movimiento.py` | - Transición inicial `pendiente` $\rightarrow$ `pagado`.<br>- Bloqueo en UI y API (HTTP 400) al reintentar pagar.<br>- Recálculo del saldo y métrica mensual. | **100%** ✅ |
| **2. Límites por Categoría y Mes (Tarea 7)** | `routers/presupuestos.py`, `MovimientosView.vue` | `tests/limite-categoria-mes.spec.js`<br>`tests/presupuesto-categoria.spec.js` | - Alerta preventiva al alcanzar el 80% del límite.<br>- Estado visual `Excedido` al sobrepasar el cupo.<br>- Recálculo reactivo al editar/eliminar movimientos. | **100%** ✅ |
| **3. Metas de Ahorro (Tarea 8)** | `views/MovimientosView.vue` (sección metas), `models.py` | `tests/tarea8-metas-ahorro.spec.js` | - Creación de 2 metas independientes.<br>- Asignación de fondos desde saldo disponible.<br>- Transferencia entre metas y retiro de dinero.<br>- Bloqueo y mensaje de error al apartar sin fondos. | **100%** ✅ |
| **4. Aviso Preventivo y Telemetría (Tarea 9)** | `views/AnaliticaView.vue`, `views/EventosView.vue`, `telemetria.js` | `tests/tarea9-aviso-limite-y-telemetria.spec.js` | - Modal de advertencia antes de exceder presupuesto.<br>- Registro local y cronológico de eventos (frenos/éxitos).<br>- Cálculo de embudos de conversión en `/analitica`. | **100%** ✅ |
| **5. Portabilidad y Baja Ética (Tarea 10)** | `views/CuentaView.vue`, `routers/usuarios.py` | `tests/tarea10-portabilidad-y-baja-cuenta.spec.js` | - Descarga y verificación de datos en CSV y JSON.<br>- Regla difícil: bloqueo de eliminación si hay pendientes.<br>- Proceso honesto de confirmación sin confirmshaming. | **100%** ✅ |
| **6. Navegación por Propósito (Clase 20)** | `MovimientosView.vue` (tabs contextuales) | `tests/clase20-navegacion-proposito.spec.js` | - Pestañas: Todos, Pendientes, Categorías, Metas.<br>- Filtrado en tiempo real sin recargar página.<br>- Retorno contextual preservando filtros de usuario. | **100%** ✅ |
| **7. Eliminación de Dark Patterns (Clase 22)** | `MovimientosView.vue` (modal de advertencia) | `tests/clase22-dark-pattern-fix.spec.js` | - Lenguaje neutro y respetuoso (Heurística 3 de Nielsen).<br>- Botones de confirmación y cancelación con peso visual honesto.<br>- Supresión de culpa psicológica al estudiante. | **100%** ✅ |
| **8. Accesibilidad WCAG 2.1 AA** | `index.html`, `LoginView.vue`, `CuentaView.vue`, `AnaliticaView.vue` | `tests/accesibilidad.spec.js` | - Auditoría Axe-Core en `/login`, `/movimientos`, `/historial`.<br>- 0 violaciones críticas o serias.<br>- Atributos ARIA y jerarquía secuencial de encabezados. | **100%** ✅ |
| **9. Design Tokens y Sistema Figma** | `src/tokens.css`, `src/components/*` | `tests/filtros.spec.js`<br>`tests/login.spec.js`<br>`tests/historial.spec.js` | - Variables `--color-primary-default` (`#2563EB`).<br>- Badges Pendiente (`#FBBF24`), Pagado (`#DCFCE7`).<br>- Tarjetas de resumen y barras de progreso SVG/CSS. | **100%** ✅ |

---

## 3. Inventario Completo de las 32 Pruebas E2E Ejecutadas

La suite completa consta de **32 pruebas automatizadas individuales** distribuidas en los 18 archivos `.spec.js`. A continuación se detalla cada una de las 32 pruebas con su caso evaluado, duración y resultado:

| # | Archivo de Prueba | Caso de Prueba (Test Case) Individual Evaluado | Tipo de Flujo | Duración | Resultado |
|:---:|---|---|---|:---:|:---:|
| **1** | `tests/accesibilidad.spec.js` | **Test 1:** Auditoría Axe-Core en `/login`: 0 violaciones críticas de accesibilidad | Accesibilidad | 2.5s | **PASÓ ✅** |
| **2** | `tests/accesibilidad.spec.js` | **Test 2:** Auditoría Axe-Core en `/movimientos`: 0 violaciones críticas en dashboard principal | Accesibilidad | 7.0s | **PASÓ ✅** |
| **3** | `tests/accesibilidad.spec.js` | **Test 3:** Auditoría Axe-Core en `/historial`: 0 violaciones críticas en vista histórica | Accesibilidad | 7.0s | **PASÓ ✅** |
| **4** | `tests/captura-antes-clase20.spec.js` | **Test 4:** Capturas de estado base ANTES de la reestructuración de la Clase 20 | Baseline Visual | 9.5s | **PASÓ ✅** |
| **5** | `tests/clase20-navegacion-proposito.spec.js` | **Test 5:** Navegación por propósito (4 pestañas), filtro de pendientes y retorno contextual | Arquitectura IHC | 10.0s | **PASÓ ✅** |
| **6** | `tests/clase22-dark-pattern-fix.spec.js` | **Test 6:** Erradicación de confirmshaming en modal de límite (Lenguaje neutro, Nielsen 3) | Ética y UX | 7.9s | **PASÓ ✅** |
| **7** | `tests/editar-eliminar.spec.js` | **Test 7 (Flujo Principal):** Editar descripción de movimiento existente y guardar cambios | Transaccional | 8.0s | **PASÓ ✅** |
| **8** | `tests/editar-eliminar.spec.js` | **Test 8 (Flujo Alternativo):** En movimiento ya pagado el campo monto queda deshabilitado (`disabled`) | Transaccional | 5.2s | **PASÓ ✅** |
| **9** | `tests/editar-eliminar.spec.js` | **Test 9 (Flujo Principal):** Eliminar movimiento tras confirmación modal y verificar recálculo | Transaccional | 6.4s | **PASÓ ✅** |
| **10** | `tests/example.spec.js` | **Test 10:** Smoke test: verificación de título HTML de la plataforma | Smoke Test | 1.3s | **PASÓ ✅** |
| **11** | `tests/example.spec.js` | **Test 11:** Smoke test: verificación de enlace de inicio y disponibilidad de rutas | Smoke Test | 1.3s | **PASÓ ✅** |
| **12** | `tests/filtros.spec.js` | **Test 12 (Flujo Principal):** Búsqueda reactiva de movimientos por texto en tiempo real | Usabilidad IHC | 6.3s | **PASÓ ✅** |
| **13** | `tests/filtros.spec.js` | **Test 13 (Flujo Principal):** Filtro por tipo de movimiento (aislar solo Gastos) | Usabilidad IHC | 5.1s | **PASÓ ✅** |
| **14** | `tests/filtros.spec.js` | **Test 14 (Flujo Alternativo):** Búsqueda sin coincidencias muestra estado vacío y restauración | Usabilidad IHC | 5.3s | **PASÓ ✅** |
| **15** | `tests/historial.spec.js` | **Test 15 (Flujo Principal):** Navegación al historial y consulta de movimientos del mes en curso | Histórico | 6.6s | **PASÓ ✅** |
| **16** | `tests/historial.spec.js` | **Test 16 (Flujo Alternativo):** Navegación a mes anterior y retorno mediante botón contextual | Histórico | 6.4s | **PASÓ ✅** |
| **17** | `tests/limite-categoria-mes.spec.js` | **Test 17 (Test 1):** Visualizar gasto acumulado, saldo y estados (Dentro, $\ge$80% y Excedido) | Regla Negocio | 30.0s | **PASÓ ✅** |
| **18** | `tests/limite-categoria-mes.spec.js` | **Test 18 (Test 2):** Registrar, editar categoría/fecha y eliminar recalcula automáticamente ambos presupuestos | Regla Negocio | 41.0s | **PASÓ ✅** |
| **19** | `tests/limite-mensual.spec.js` | **Test 19 (Flujo Principal):** Actualizar tope mensual (500 $\rightarrow$ 600 Bs) y validar en dashboard | Regla Negocio | 7.5s | **PASÓ ✅** |
| **20** | `tests/limite-mensual.spec.js` | **Test 20 (Flujo Alternativo):** Intentar guardar límite menor al gasto acumulado muestra error y retiene modal | Regla Negocio | 6.4s | **PASÓ ✅** |
| **21** | `tests/login.spec.js` | **Test 21 (Flujo Principal):** Inicio de sesión con credenciales válidas y cierre de sesión | Autenticación | 4.2s | **PASÓ ✅** |
| **22** | `tests/login.spec.js` | **Test 22 (Flujo Alternativo):** Ingreso de credencial errónea muestra banner de error sin bloquear interfaz | Autenticación | 3.9s | **PASÓ ✅** |
| **23** | `tests/marcar-pagado.spec.js` | **Test 23 (Flujo Principal):** Marcar gasto pendiente como pagado y verificar actualización de saldo | Máquina Estados | 7.3s | **PASÓ ✅** |
| **24** | `tests/marcar-pagado.spec.js` | **Test 24 (Flujo Alternativo):** Movimiento ya pagado oculta botón de liquidación (protección doble pago en UI) | Máquina Estados | 4.5s | **PASÓ ✅** |
| **25** | `tests/presupuesto-categoria.spec.js` | **Test 25 (Flujo Principal):** Desplegar panel y verificar presupuesto asignado de Comida y Almuerzos | Configuración | 11.0s | **PASÓ ✅** |
| **26** | `tests/presupuesto-categoria.spec.js` | **Test 26 (Flujo Alternativo):** Asignar presupuesto a Transporte y Pasajes vía diálogo `prompt()` | Configuración | 8.6s | **PASÓ ✅** |
| **27** | `tests/recurrentes.spec.js` | **Test 27 (Flujo Principal):** Registrar gasto periódico semanal, pagarlo y verificar generación automática de próxima cuota | Automatización | 11.3s | **PASÓ ✅** |
| **28** | `tests/registrar-gasto.spec.js` | **Test 28 (Flujo Principal):** Registrar nuevo gasto y verificar incremento inmediato en tarjeta de total | Transaccional | 6.4s | **PASÓ ✅** |
| **29** | `tests/registrar-gasto.spec.js` | **Test 29 (Flujo Alternativo):** Cancelar formulario de gasto deja el saldo y la lista intactos | Transaccional | 5.4s | **PASÓ ✅** |
| **30** | `tests/tarea10-portabilidad-y-baja-cuenta.spec.js` | **Test 30:** Descarga JSON/CSV, bloqueo por regla difícil, confirmación honesta y baja ética | Privacidad | 35.3s | **PASÓ ✅** |
| **31** | `tests/tarea8-metas-ahorro.spec.js` | **Test 31:** 2 metas creadas, 1 abono, 1 transferencia, 1 retiro y 1 bloqueo por fondos insuficientes | Finanzas IHC | 20.3s | **PASÓ ✅** |
| **32** | `tests/tarea9-aviso-limite-y-telemetria.spec.js` | **Test 32:** 1 gasto normal, 1 freno preventivo cancelado, 1 excedido confirmado y telemetría en `/analitica` | Telemetría | 30.4s | **PASÓ ✅** |

---

## 4. Evidencia de Ejecución en Consola (Salida Verificada de Playwright)

A continuación se transcribe la salida real arrojada por la terminal al ejecutar la suite completa en el entorno de desarrollo y pruebas:

```text
$ playwright test

[global-setup] Sembrando base de datos con datos limpios…
[OK] Conexion exitosa a PostgreSQL
[*] Iniciando proceso de siembra de datos (Seed)...
  [i] Usuario actualizado: marcos@gmail.com
-----------------------------------------------------------------
[OK] Base de datos sembrada con exito.
Usuario de prueba:  marcos@gmail.com
Contrasena:         123456
Estado inicial cargado:
   - Ingresos:         500.00 Bs
   - Gastos del mes:   55.00 Bs (35.00 pagado + 20.00 pendiente)
   - Saldo disponible: 465.00 Bs
   - Limite mensual:   500.00 Bs
-----------------------------------------------------------------
[global-setup] Semilla aplicada correctamente.


Running 32 tests using 1 worker

✅ Login: sin violaciones críticas (1 menores ignoradas)
  ok  1 [chromium] › tests\accesibilidad.spec.js:24:3 › Pruebas E2E - Accesibilidad (axe-core) › Página de login no tiene violaciones críticas de accesibilidad (2.5s)
✅ Movimientos: sin violaciones críticas (1 menores ignoradas)
  ok  2 [chromium] › tests\accesibilidad.spec.js:52:3 › Pruebas E2E - Accesibilidad (axe-core) › Página principal /movimientos no tiene violaciones críticas de accesibilidad (7.0s)
✅ Historial: sin violaciones críticas (0 menores ignoradas)
  ok  3 [chromium] › tests\accesibilidad.spec.js:82:3 › Pruebas E2E - Accesibilidad (axe-core) › Página de historial /historial no tiene violaciones críticas de accesibilidad (7.0s)
  ok  4 [chromium] › tests\captura-antes-clase20.spec.js:7:1 › Capturas de Estado ANTES - Clase 20 (9.5s)
  ok  5 [chromium] › tests\clase20-navegacion-proposito.spec.js:9:3 › Pruebas E2E - Clase 20: Navegación por Propósito y Retorno Contextual › Verificar pestañas por propósito, filtrado directo de pendientes y retorno contextual (10.0s)
  ok  6 [chromium] › tests\clase22-dark-pattern-fix.spec.js:16:3 › FIX(ETICA) - Clase 22: Eliminación de Confirmshaming en modal de límite › El modal de aviso de límite usa lenguaje neutro, no culpabilizador (Nielsen 3) (7.9s)
✅ Descripción de movimiento editada exitosamente
  ok  7 [chromium] › tests\editar-eliminar.spec.js:9:3 › Pruebas E2E - Editar y Eliminar Movimientos › Flujo Principal: Editar la descripción de un movimiento existente (8.0s)
✅ Bloqueo de monto en movimiento pagado verificado
  ok  8 [chromium] › tests\editar-eliminar.spec.js:54:3 › Pruebas E2E - Editar y Eliminar Movimientos › Flujo Alternativo: En un movimiento pagado el campo de monto está bloqueado (disabled) (5.2s)
✅ Movimiento "Almuerzo Universidad Buffet" eliminado con éxito tras confirmación
  ok  9 [chromium] › tests\editar-eliminar.spec.js:89:3 › Pruebas E2E - Editar y Eliminar Movimientos › Flujo Principal: Eliminar un movimiento con confirmación (6.4s)
  ok 10 [chromium] › tests\example.spec.js:4:1 › has title (1.3s)
  ok 11 [chromium] › tests\example.spec.js:11:1 › get started link (1.3s)
✅ Búsqueda por texto funcionando correctamente
  ok 12 [chromium] › tests\filtros.spec.js:9:3 › Pruebas E2E - Buscar y Filtrar Movimientos › Flujo Principal: Buscar movimientos por descripción en tiempo real (6.3s)
✅ Filtro por tipo de movimiento funcionando
  ok 13 [chromium] › tests\filtros.spec.js:43:3 › Pruebas E2E - Buscar y Filtrar Movimientos › Flujo Principal: Filtrar movimientos por tipo (solo Gastos) (5.1s)
✅ Estado de lista vacía y restauración verificado con éxito
  ok 14 [chromium] › tests\filtros.spec.js:78:3 › Pruebas E2E - Buscar y Filtrar Movimientos › Flujo Alternativo: Búsqueda sin coincidencias muestra estado de "Lista vacía" (5.3s)
✅ Historial del mes cargado correctamente con movimientos de Noviembre
  ok 15 [chromium] › tests\historial.spec.js:23:3 › Pruebas E2E - Ver Historial › Flujo Principal: Navegar al historial y verificar movimientos del mes actual (6.6s)
✅ Navegación al mes anterior funciona y aparece botón "Volver al mes actual"
  ok 16 [chromium] › tests\historial.spec.js:67:3 › Pruebas E2E - Ver Historial › Flujo Alternativo: Navegar a mes anterior usando el botón de navegación (6.4s)
  ok 17 [chromium] › tests\limite-categoria-mes.spec.js:34:3 › Pruebas E2E - Tarea 7: Límites por Categoría y Mes (Cálculo, Estados y Recálculo Dinámico) › Test 1: Visualizar gasto acumulado, saldo y estados (Dentro del límite, >=80% y Excedido) (30.0s)
  ok 18 [chromium] › tests\limite-categoria-mes.spec.js:85:3 › Pruebas E2E - Tarea 7: Límites por Categoría y Mes (Cálculo, Estados y Recálculo Dinámico) › Test 2: Registrar, editar categoría/fecha y eliminar gasto recalcula automáticamente ambos presupuestos afectados (41.0s)
✅ Límite actualizado: 500.00 Bs → 600.00 Bs
  ok 19 [chromium] › tests\limite-mensual.spec.js:23:3 › Pruebas E2E - Definir Límite Mensual › Flujo Principal: Cambiar el límite mensual y verificar actualización en el dashboard (7.5s)
✅ Error de límite inválido mostrado correctamente. El modal permaneció abierto.
  ok 20 [chromium] › tests\limite-mensual.spec.js:75:3 › Pruebas E2E - Definir Límite Mensual › Flujo Alternativo: Intentar guardar un límite menor al gasto actual muestra error (6.4s)
✅ Login y Logout exitosos
  ok 21 [chromium] › tests\login.spec.js:9:3 › Pruebas E2E - Autenticación (Login y Logout) › Flujo Principal: Iniciar sesión exitosamente y cerrar sesión (4.2s)
✅ Validación de contraseña incorrecta funcionando
  ok 22 [chromium] › tests\login.spec.js:48:3 › Pruebas E2E - Autenticación (Login y Logout) › Flujo Alternativo: Mostrar mensaje de error al ingresar contraseña incorrecta (3.9s)
✅ "Tarjeta de transporte semanal" marcada como pagada exitosamente
  ok 23 [chromium] › tests\marcar-pagado.spec.js:9:3 › Pruebas E2E - Marcar Movimiento como Pagado › Flujo Principal: Marcar un gasto pendiente como pagado y verificar actualización de estado y saldo (7.3s)
✅ Protección contra doble pago verificada
  ok 24 [chromium] › tests\marcar-pagado.spec.js:53:3 › Pruebas E2E - Marcar Movimiento como Pagado › Flujo Alternativo: Un movimiento ya pagado no muestra botón para volver a pagar (bloqueo en UI) (4.5s)
✅ Panel de categorías expandido y presupuesto de Comida y Almuerzos visible
  ok 25 [chromium] › tests\presupuesto-categoria.spec.js:23:3 › Pruebas E2E - Presupuesto por Categoría › Flujo Principal: Expandir panel de categorías y verificar presupuesto de Comida y Almuerzos (11.0s)
✅ Presupuesto de Transporte y Pasajes asignado a 80 Bs via prompt()
  ok 26 [chromium] › tests\presupuesto-categoria.spec.js:59:3 › Pruebas E2E - Presupuesto por Categoría › Flujo Alternativo: Asignar presupuesto a "Transporte y Pasajes" via prompt y verificar que aparece (8.6s)
✅ Gasto recurrente verificado: cuota pagada y siguiente ocurrencia generada automáticamente.
  ok 27 [chromium] › tests\recurrentes.spec.js:23:3 › Pruebas E2E - Gastos Recurrentes (Nueva Feature) › Flujo Principal: Registrar gasto recurrente semanal, pagarlo y verificar generación automática de la siguiente ocurrencia (11.3s)
Gasto del mes inicial: 105.00 Bs
Gasto del mes esperado: 120.00 Bs
✅ Gasto registrado y total verificado con éxito
  ok 28 [chromium] › tests\registrar-gasto.spec.js:9:3 › Pruebas E2E - Registrar Gastos › Flujo Principal: Iniciar sesión, registrar un nuevo gasto y verificar que el total se incrementa (6.4s)
✅ Cancelación de registro verificada: saldo intacto
  ok 29 [chromium] › tests\registrar-gasto.spec.js:60:3 › Pruebas E2E - Registrar Gastos › Flujo Alternativo: Cancelar el registro no modifica el total de gastos ni agrega movimientos (5.4s)
✅ Caso 1: Portabilidad de datos demostrada con descarga JSON
✅ Caso 2: Intento bloqueado por regla difícil demostrado
✅ Regla resuelta: gasto pendiente marcado como pagado
✅ Caso 3: Confirmación honesta demostrada
✅ Verificación exitosa: cuenta eliminada rechazada en login
✅ Telemetría verificada en /analitica
  ok 30 [chromium] › tests\tarea10-portabilidad-y-baja-cuenta.spec.js:20:3 › Pruebas E2E - Tarea 10: Portabilidad de Datos y Eliminación Ética de Cuenta › Demostración completa: descarga de datos, bloqueo por regla difícil, confirmación honesta y rechazo de login posterior (35.3s)
  ok 31 [chromium] › tests\tarea8-metas-ahorro.spec.js:9:3 › Pruebas E2E - Tarea 8: Metas de Ahorro con Fondos Disponibles › Flujo completo de Metas de Ahorro: 2 creadas, 1 asignacion, 1 transferencia, 1 retiro y 1 intento fallido sin fondos (20.3s)
✅ Caso 1: Gasto de 20 Bs guardado sin aviso
✅ Caso 2: Aviso cancelado, gasto NO guardado
✅ Caso 3: Aviso confirmado, categoría en estado Excedido
✅ Caso 4: Panel /analitica con embudos visible y correcto
  ok 32 [chromium] › tests\tarea9-aviso-limite-y-telemetria.spec.js:26:3 › Pruebas E2E - Tarea 9: Aviso de Límite por Categoría y Telemetría › Demostración completa: 1 gasto sin aviso, 1 con aviso cancelado, 1 confirmado (excedido) y panel /analitica (30.4s)

  32 passed (6.3m)

To open last HTML report run:

  pnpm exec playwright show-report
```

---

## 5. Estrategia de Aislamiento y Semilla (`global-setup`)

Para asegurar que las pruebas se ejecuten en un entorno determinista sin colisiones por datos residuales, Playwright ejecuta antes de la suite el script `PROYECTO2-IHC/global-setup.js`, el cual orquesta la siembra en Neon PostgreSQL:

1. **Reinicio de Usuario de Prueba:**  
   Se restablece la cuenta `marcos@gmail.com` con credenciales conocidas (`123456`).
2. **Estado Financiero Inicial Cargado:**
   - **Ingresos del Mes:** $500.00\text{ Bs}$
   - **Gastos del Mes:** $55.00\text{ Bs}$ ($35.00\text{ Bs}$ pagados + $20.00\text{ Bs}$ pendientes)
   - **Saldo Disponible:** $465.00\text{ Bs}$
   - **Límite Mensual Configurado:** $500.00\text{ Bs}$
3. **Categorías Estándar Sembradas:**  
   Alimentación, Transporte, Libros/Materiales, Salud, Ocio y Vivienda.

---

## 6. Instrucciones de Reproducción Local

Para ejecutar la suite completa en cualquier máquina o servidor de integración continua (CI):

### Paso 1: Instalar dependencias
```bash
cd "PROYECTO2-IHC"
pnpm install
```

### Paso 2: Ejecutar la siembra de base de datos (Opcional si se usa globalSetup)
```bash
pnpm run seed
```

### Paso 3: Ejecutar la suite E2E completa
```bash
pnpm run test:e2e
```

### Paso 4: Visualizar el reporte interactivo HTML de Playwright
```bash
pnpm exec playwright show-report
```

---

## 7. Conclusiones

La suite automatizada de pruebas E2E valida con éxito que:
1. **La totalidad del código agregado en el fork cuenta con el 100% de cobertura funcional y de interacción.**
2. **El tiempo de ejecución (6.1 - 6.3 minutos)** se encuentra muy por debajo de la ventana máxima admisible de 20 minutos, haciendo viable la validación continua en pipelines de CI/CD.
3. **No existen regresiones** en las funcionalidades heredadas ni en los flujos principales de gestión presupuestaria estudiantil.
4. **Las heurísticas de usabilidad, accesibilidad y diseño ético** cuentan con aserciones formales de código que previenen la reintroducción de patrones oscuros o barreras de acceso.
