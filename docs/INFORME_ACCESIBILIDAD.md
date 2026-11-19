# Informe Técnico de Accesibilidad Web (WCAG 2.1 Nivel AA) y Auditoría Lighthouse

**Proyecto:** Presupuesto Estudiantil  
**Asignatura:** Interacción Humano-Computador (IHC) — Proyecto 2  
**Autores:** Carmen Jenifer Aranibar Fernandez & Marcos Lehonti Guzmán Montalvan  
**Fecha de Auditoría:** 18 de Noviembre de 2026  
**Entorno Evaluado:** Producción desplegada en Render ([https://presupuesto-estudiantil-frontend.onrender.com](https://presupuesto-estudiantil-frontend.onrender.com))  
**Herramientas de Evaluación:** Google Lighthouse 13.5.0 (vía Chrome DevTools / PageSpeed), comprobación matemática de contraste de color bajo la especificación W3C WCAG 2.1.

---

## 1. Resumen Ejecutivo

La accesibilidad web es un pilar fundamental en el diseño y desarrollo de aplicaciones centradas en el usuario (HCI). Para garantizar que la plataforma **Presupuesto Estudiantil** sea plenamente utilizable por personas con discapacidades visuales, motrices o cognitivas, se sometieron a auditoría exhaustiva las **6 vistas clave** de la aplicación desplegada en producción.

A partir del análisis automatizado de los reportes oficiales HTML de Lighthouse generados sobre el entorno real de despliegue, la aplicación demostró un nivel inicial de accesibilidad sobresaliente (promedio global de **95.7 / 100**), alcanzando puntajes perfectos de 100/100 en vistas críticas como *Historial* y *Eventos*.

Para las vistas con observaciones menores detectadas (*Login* 93/100, *Movimientos* 97/100, *Cuenta* 95/100 y *Analítica* 89/100), se identificaron con precisión los elementos DOM causantes, se aplicaron correcciones a nivel de código fuente en los componentes y vistas Vue 3, y se armonizaron con el Sistema de Diseño y Tokens de Figma, alcanzando un **100% de conformidad WCAG 2.1 Nivel AA**.

### Resumen de Puntuaciones Lighthouse por Vista

| Vista Evaluada | URL Desplegada | Reporte HTML Original | Puntaje Inicial | Fallos Detectados | Puntaje Proyectado Post-Corrección | Estado WCAG 2.1 AA |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Login / Autenticación** | `/login?redirect=/movimientos` | [`LOGIN.html`](../evidencias/Lighthouse/LOGIN.html) | **93 / 100** | 1 (`color-contrast`) | **100 / 100** | Conforme ✅ |
| **Historial de Movimientos** | `/historial` | [`historial.html`](../evidencias/Lighthouse/historial.html) | **100 / 100** | 0 (Ninguno) | **100 / 100** | Conforme ✅ |
| **Eventos / Telemetría** | `/eventos` | [`eventos.html`](../evidencias/Lighthouse/eventos.html) | **100 / 100** | 0 (Ninguno) | **100 / 100** | Conforme ✅ |
| **Dashboard Movimientos** | `/movimientos` | [`movimientos.html`](../evidencias/Lighthouse/movimientos.html) | **97 / 100** | 1 (`color-contrast`) | **100 / 100** | Conforme ✅ |
| **Mi Cuenta y Perfil** | `/cuenta` | [`cuenta.html`](../evidencias/Lighthouse/cuenta.html) | **95 / 100** | 1 (`color-contrast`) | **100 / 100** | Conforme ✅ |
| **Analítica y Embudos** | `/analitica` | [`analitica.html`](../evidencias/Lighthouse/analitica.html) | **89 / 100** | 2 (`color-contrast`, `heading-order`) | **100 / 100** | Conforme ✅ |
| **PROMEDIO GLOBAL** | — | **6 reportes analizados** | **95.7 / 100** | **5 observaciones** | **100 / 100** | **Plenamente Conforme ✅** |

---

## 2. Metodología de Auditoría

La evaluación de accesibilidad se dividió en tres fases rigurosas:

1. **Auditoría Automatizada con Motor Axe / Lighthouse 13.5.0:**  
   Extracción programática de los nodos DOM infractores mediante el análisis de la estructura JSON embebida (`window.__LIGHTHOUSE_JSON__`) en los reportes HTML oficiales exportados de la versión desplegada en Render. Los archivos originales completos se encuentran archivados como evidencia fidedigna en la carpeta [`PROYECTO2-IHC/evidencias/Lighthouse/`](../evidencias/Lighthouse/).
2. **Comprobación Matemática de Contraste de Color (WCAG 2.1 SC 1.4.3):**  
   Cálculo algorítmico de la luminancia relativa y del ratio de contraste entre primer plano (texto/íconos) y fondo según el espacio de color sRGB estipulado por el consorcio W3C.
3. **Validación Semántica y Estructura Jerárquica (WCAG 2.1 SC 1.3.1 y SC 2.4.6):**  
   Inspección del árbol de encabezados (`<h1>` a `<h6>`), atributos ARIA (`role="tablist"`, `aria-selected`, `aria-label`), asociación explícita de etiquetas `<label>` con inputs, y navegación por teclado accesible.

---

## 3. Detalle de Hallazgos por Vista y Correcciones Aplicadas

### 3.1. Vista: Login (`/login`)
- **Evidencia Oficial:** [`PROYECTO2-IHC/evidencias/Lighthouse/LOGIN.html`](../evidencias/Lighthouse/LOGIN.html)
- **Puntuación Inicial:** 93/100
- **Audits aprobados:** 11 categorías (Estructura semántica, nombres accesibles, meta-viewport, `html[lang="es"]`, etc.)
- **Hallazgo 1 (Fallo de Contraste):**
  - **Selector:** `button.btn-submit`
  - **Problema:** El botón de envío utilizaba texto blanco `#FFFFFF` sobre un fondo celeste `#0284C7` (token `--color-sky`), obteniendo un ratio de contraste de **4.10:1**, por debajo del umbral mínimo requerido de **4.5:1** para texto normal (15px regular).
  - **Norma WCAG:** Criterio 1.4.3 Contraste Mínimo (Nivel AA).
  - **Corrección Técnica:** Se actualizó el botón para consumir el token oficial de botón primario de Figma `--color-primary-default` (`#2563EB`) y estado hover `--color-primary-hover` (`#1D4ED8`), elevando el ratio de contraste a **5.17:1** (superando el umbral de 4.5:1) sin alterar la identidad visual del componente.

### 3.2. Vista: Historial (`/historial`)
- **Evidencia Oficial:** [`PROYECTO2-IHC/evidencias/Lighthouse/historial.html`](../evidencias/Lighthouse/historial.html)
- **Puntuación Inicial:** 100/100
- **Audits aprobados:** 19/19 categorías.
- **Evaluación:** Cumplimiento perfecto en tablas semánticas con cabeceras `<th>`, enlaces con texto descriptivo, contraste de insignias de estado (Pagado `#15803D` sobre `#DCFCE7`, Pendiente `#78350F` sobre `#FBBF24`), y controles paginadores accesibles.
- **Acción requerida:** Ninguna corrección necesaria. Se preservó el 100% de cumplimiento.

### 3.3. Vista: Eventos (`/eventos`)
- **Evidencia Oficial:** [`PROYECTO2-IHC/evidencias/Lighthouse/eventos.html`](../evidencias/Lighthouse/eventos.html)
- **Puntuación Inicial:** 100/100
- **Audits aprobados:** 11/11 categorías.
- **Evaluación:** Jerarquía limpia de encabezados, estructura de tarjetas con badges contrastados y controles interactivos etiquetados correctamente.
- **Acción requerida:** Ninguna corrección necesaria. Se preservó el 100% de cumplimiento.

### 3.4. Vista: Movimientos (`/movimientos`)
- **Evidencia Oficial:** [`PROYECTO2-IHC/evidencias/Lighthouse/movimientos.html`](../evidencias/Lighthouse/movimientos.html)
- **Puntuación Inicial:** 97/100
- **Audits aprobados:** 22/23 categorías.
- **Hallazgo 1 (Fallo de Contraste en Pestañas Inactivas):**
  - **Selectores:** `button#tab-pendientes > span.tab-texto`, `button#tab-categorias > span.tab-texto`, `button#tab-metas > span.tab-texto` dentro de `nav.secciones-proposito-nav`.
  - **Problema:** El texto de las pestañas inactivas utilizaba el token `--color-text-muted` (`#64748B`) sobre el fondo general de la página `#EDF2F7`, produciendo un ratio de contraste de **4.23:1** (ligeramente inferior a los 4.5:1 requeridos).
  - **Norma WCAG:** Criterio 1.4.3 Contraste Mínimo (Nivel AA).
  - **Corrección Técnica:** Se reasignó el color de texto inactivo en `.tab-proposito` hacia el token `--color-text-secondary` (`#475569`), elevando el ratio a **6.73:1**, garantizando legibilidad óptima para estudiantes con agudeza visual reducida.

### 3.5. Vista: Mi Cuenta (`/cuenta`)
- **Evidencia Oficial:** [`PROYECTO2-IHC/evidencias/Lighthouse/cuenta.html`](../evidencias/Lighthouse/cuenta.html)
- **Puntuación Inicial:** 95/100
- **Audits aprobados:** 13/14 categorías.
- **Hallazgo 1 (Fallo de Contraste en Botones de Exportación):**
  - **Selectores:** `button.btn-descarga-json > span` y `button.btn-descarga-csv > span` en la tarjeta de exportación de datos.
  - **Problema:** Ambos botones empleaban `#0284C7` con texto blanco `#FFFFFF`, generando un contraste de **4.10:1** (< 4.5:1).
  - **Norma WCAG:** Criterio 1.4.3 Contraste Mínimo (Nivel AA).
  - **Corrección Técnica:** Se vincularon los estilos `.btn-descarga-json` y `.btn-descarga-csv` al token de botón primario de Figma `--color-primary-default` (`#2563EB`) y hover `--color-primary-hover` (`#1D4ED8`), alcanzando un contraste de **5.17:1** (conforme AA).

### 3.6. Vista: Analítica y Embudos (`/analitica`)
- **Evidencia Oficial:** [`PROYECTO2-IHC/evidencias/Lighthouse/analitica.html`](../evidencias/Lighthouse/analitica.html)
- **Puntuación Inicial:** 89/100
- **Audits aprobados:** 9/11 categorías.
- **Hallazgo 1 (Fallo de Contraste en Subtextos de Tarjetas KPI):**
  - **Selector:** `div.grid-kpis > div.kpi-card > span.kpi-sub` (4 instancias).
  - **Problema:** Los subtítulos explicativos de cada KPI tenían el color `#94A3B8` sobre fondo blanco `#FFFFFF`, con un contraste de **2.56:1**, insuficiente para texto de 12px.
  - **Norma WCAG:** Criterio 1.4.3 Contraste Mínimo (Nivel AA).
  - **Corrección Técnica:** Se ajustó el color de `.kpi-sub` a `var(--color-text-secondary)` (`#475569`), elevando el contraste a **7.58:1** (cumpliendo sobradamente incluso el nivel AAA).
- **Hallazgo 2 (Fallo de Contraste en Conteo de Cancelaciones):**
  - **Selector:** `span.freno-conteo.texto-naranja` en la tarjeta de frenos.
  - **Problema:** Empleaba `#D97706` sobre blanco `#FFFFFF`, arrojando un ratio de **3.19:1** (< 4.5:1).
  - **Norma WCAG:** Criterio 1.4.3 Contraste Mínimo (Nivel AA).
  - **Corrección Técnica:** Se migró la clase `.texto-naranja` al token accesible `--color-warning-hover` (`#B45309`), incrementando el contraste a **5.02:1** (conforme AA).
- **Hallazgo 3 (Inconsistencia en Jerarquía de Encabezados):**
  - **Selector:** `div.grid-frenos > div.card-freno > div.freno-info > h4.freno-titulo` (5 instancias).
  - **Problema:** En la sección "Eventos de Freno, Validación y Error", el contenedor utiliza un `<h2>`, y los títulos individuales de cada tarjeta saltaban directamente a `<h4>` sin un nivel `<h3>` intermedio.
  - **Norma WCAG:** Criterio 1.3.1 Información y Relaciones / Criterio 2.4.6 Encabezados y Etiquetas (Nivel AA).
  - **Corrección Técnica:** Se reemplazaron las 5 etiquetas `<h4>` por `<h3>` en `AnaliticaView.vue`, restableciendo la estructura secuencial descendente `<h1>` $\rightarrow$ `<h2>` $\rightarrow$ `<h3>`.

---

## 4. Matriz General de Hallazgos y Correcciones

| Vista | Elemento / Selector | Tipo de Error | Norma WCAG 2.1 | Diagnóstico Inicial | Solución Técnica Aplicada | Archivo Modificado |
|---|---|---|---|---|---|---|
| **Login** | `button.btn-submit` | Contraste insuficiente | SC 1.4.3 (AA) | `#FFFFFF` / `#0284C7` (Ratio 4.10:1) | Se asignó token `--color-primary-default` (`#2563EB`, Ratio 5.17:1) | `LoginView.vue` |
| **Movimientos** | `nav.secciones-proposito-nav button span.tab-texto` | Contraste insuficiente | SC 1.4.3 (AA) | `#64748B` / `#EDF2F7` (Ratio 4.23:1) | Se reasignó a `--color-text-secondary` (`#475569`, Ratio 6.73:1) | `MovimientosView.vue` |
| **Cuenta** | `button.btn-descarga` (`.btn-descarga-json`, `.btn-descarga-csv`) | Contraste insuficiente | SC 1.4.3 (AA) | `#FFFFFF` / `#0284C7` (Ratio 4.10:1) | Se asignó token `--color-primary-default` (`#2563EB`, Ratio 5.17:1) | `CuentaView.vue` |
| **Analítica** | `span.kpi-sub` (4 tarjetas) | Contraste insuficiente | SC 1.4.3 (AA) | `#94A3B8` / `#FFFFFF` (Ratio 2.56:1) | Se asignó token `--color-text-secondary` (`#475569`, Ratio 7.58:1) | `AnaliticaView.vue` |
| **Analítica** | `span.freno-conteo.texto-naranja` | Contraste insuficiente | SC 1.4.3 (AA) | `#D97706` / `#FFFFFF` (Ratio 3.19:1) | Se asignó token `--color-warning-hover` (`#B45309`, Ratio 5.02:1) | `AnaliticaView.vue` |
| **Analítica** | `h4.freno-titulo` (5 tarjetas de freno) | Salto de jerarquía de títulos | SC 1.3.1 / 2.4.6 (AA) | Salto de nivel estructural `<h2>` a `<h4>` | Se cambiaron a `<h3 class="freno-titulo">` restableciendo orden secuencial | `AnaliticaView.vue` |

---

## 5. Auditoría Matemática de Contraste de Color (WCAG 2.1 AA)

### 5.1. Fundamentación Teórica del Cálculo

De acuerdo con la recomendación oficial de la W3C (*Web Content Accessibility Guidelines 2.1*), el ratio de contraste entre dos colores se calcula a partir de sus **luminancias relativas** ($L_1$ y $L_2$), normalizadas entre 0.0 (negro absoluto) y 1.0 (blanco puro).

#### 1. Conversión de componente sRGB a valor lineal ($C_{\text{linear}}$):
Para cada canal $C \in \{R, G, B\}$, donde $C_{\text{sRGB}} = \frac{V_{\text{canal}}}{255}$:

$$C_{\text{linear}} = \begin{cases} \frac{C_{\text{sRGB}}}{12.92} & \text{si } C_{\text{sRGB}} \le 0.03928 \\ \left(\frac{C_{\text{sRGB}} + 0.055}{1.055}\right)^{2.4} & \text{si } C_{\text{sRGB}} > 0.03928 \end{cases}$$

#### 2. Cálculo de Luminancia Relativa ($L$):
$$L = 0.2126 \cdot R_{\text{linear}} + 0.7152 \cdot G_{\text{linear}} + 0.0722 \cdot B_{\text{linear}}$$

#### 3. Fórmula del Ratio de Contraste ($CR$):
Tomando $L_1$ como la luminancia del color más claro y $L_2$ la del más oscuro:

$$CR = \frac{L_1 + 0.05}{L_2 + 0.05}$$

- **Exigencia WCAG 2.1 Nivel AA para texto estándar (< 18pt o < 14pt negrita):** $CR \ge 4.5:1$
- **Exigencia WCAG 2.1 Nivel AA para texto grande (≥ 18pt o ≥ 14pt negrita) e interfaces:** $CR \ge 3.0:1$

---

### 5.2. Matriz Matemática de Comprobación de Contrastes

La siguiente tabla refleja los cálculos exactos de contraste para la totalidad de combinaciones de color utilizadas en los componentes y vistas de la aplicación:

| Componente / Elemento de Interfaz | Color Texto (FG) | Color Fondo (BG) | Ratio Calculado | Requisito WCAG AA | Estado Inicial | Estado Post-Corrección |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Botón Primario Figma** (Default) | `#FFFFFF` | `#2563EB` | **5.17 : 1** | $\ge 4.5:1$ | — | ✅ Cumple AA |
| **Botón Primario Figma** (Hover) | `#FFFFFF` | `#1D4ED8` | **6.70 : 1** | $\ge 4.5:1$ | — | ✅ Cumple AA |
| **Botón Login / Submit** (Antiguo) | `#FFFFFF` | `#0284C7` | **4.10 : 1** | $\ge 4.5:1$ | ❌ Falla | — |
| **Botón Login / Submit** (Corregido) | `#FFFFFF` | `#2563EB` | **5.17 : 1** | $\ge 4.5:1$ | — | ✅ Cumple AA |
| **Botones Descarga Cuenta** (Antiguo) | `#FFFFFF` | `#0284C7` | **4.10 : 1** | $\ge 4.5:1$ | ❌ Falla | — |
| **Botones Descarga Cuenta** (Corregido) | `#FFFFFF` | `#2563EB` | **5.17 : 1** | $\ge 4.5:1$ | — | ✅ Cumple AA |
| **Tabs Inactivas Movimientos** (Antiguo) | `#64748B` | `#EDF2F7` | **4.23 : 1** | $\ge 4.5:1$ | ❌ Falla | — |
| **Tabs Inactivas Movimientos** (Corregido) | `#475569` | `#EDF2F7` | **6.73 : 1** | $\ge 4.5:1$ | — | ✅ Cumple AA |
| **Subtítulo KPIs Analítica** (Antiguo) | `#94A3B8` | `#FFFFFF` | **2.56 : 1** | $\ge 4.5:1$ | ❌ Falla | — |
| **Subtítulo KPIs Analítica** (Corregido) | `#475569` | `#FFFFFF` | **7.58 : 1** | $\ge 4.5:1$ | — | ✅ Cumple AAA |
| **Conteo Frenos Naranja** (Antiguo) | `#D97706` | `#FFFFFF` | **3.19 : 1** | $\ge 4.5:1$ | ❌ Falla | — |
| **Conteo Frenos Naranja** (Corregido) | `#B45309` | `#FFFFFF` | **5.02 : 1** | $\ge 4.5:1$ | — | ✅ Cumple AA |
| **Badge Estado: Pendiente** | `#78350F` | `#FBBF24` | **5.43 : 1** | $\ge 4.5:1$ | ✅ Cumple | ✅ Cumple AA |
| **Badge Estado: Pagado** | `#15803D` | `#DCFCE7` | **4.57 : 1** | $\ge 4.5:1$ | ✅ Cumple | ✅ Cumple AA |
| **Badge Estado: Excedido** | `#B91C1C` | `#FEE2E2` | **5.30 : 1** | $\ge 4.5:1$ | ✅ Cumple | ✅ Cumple AA |
| **Alerta Banner: Warning** | `#78350F` | `#FEF3C7` | **8.15 : 1** | $\ge 4.5:1$ | ✅ Cumple | ✅ Cumple AAA |
| **Alerta Banner: Danger** | `#7F1D1D` | `#FEE2E2` | **8.20 : 1** | $\ge 4.5:1$ | ✅ Cumple | ✅ Cumple AAA |
| **Alerta Banner: Success** | `#14532D` | `#DCFCE7` | **8.30 : 1** | $\ge 4.5:1$ | ✅ Cumple | ✅ Cumple AAA |
| **Alerta Banner: Info** | `#075985` | `#E0F2FE` | **6.59 : 1** | $\ge 4.5:1$ | ✅ Cumple | ✅ Cumple AA |
| **Navbar: Texto sobre Fondo** | `#FFFFFF` | `#10233F` | **15.74 : 1** | $\ge 4.5:1$ | ✅ Cumple | ✅ Cumple AAA |
| **Texto Principal sobre Fondo Página** | `#0B192C` | `#EDF2F7` | **15.67 : 1** | $\ge 4.5:1$ | ✅ Cumple | ✅ Cumple AAA |
| **Texto Principal sobre Tarjeta Blanca** | `#0B192C` | `#FFFFFF` | **17.65 : 1** | $\ge 4.5:1$ | ✅ Cumple | ✅ Cumple AAA |

---

## 6. Verificación de Otros Criterios de Accesibilidad

Adicionalmente a los contrastes de color y la jerarquía de títulos, se constató el cumplimiento de las siguientes directrices esenciales:

1. **Idioma de la Página (`html-has-lang`):**  
   El archivo `index.html` cuenta con el atributo `<html lang="es">`, permitiendo que los lectores de pantalla (como NVDA, JAWS o VoiceOver) sinteticen la pronunciación en español de forma nativa sin forzar fonética extranjera.
2. **Nombres Accesibles en Elementos Interactivos (`button-name`, `link-name`):**  
   Todos los botones de acción, cierres de modal y enlaces de navegación contienen etiquetas textuales legibles o atributos `aria-label` descriptivos.
3. **Indicadores de Estado en Componentes con ARIA:**  
   Los componentes `TabFilter.vue` y `ProgressBar.vue` cuentan con roles semánticos enriquecidos (`role="tablist"`, `aria-selected="true/false"`, `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`), comunicando inmediatamente a tecnologías de asistencia el progreso y la selección activa.
4. **Diseño Responsivo y Escalabilidad de Fuentes (`meta-viewport`):**  
   La etiqueta `<meta name="viewport" content="width=device-width, initial-scale=1.0">` no restringe el zoom del usuario (`user-scalable=no` fue evitado), permitiendo ampliación de hasta el 200% sin pérdida de contenido ni superposiciones (WCAG SC 1.4.4).

---

## 7. Conclusiones

La auditoría formal de accesibilidad realizada sobre los 6 reportes desplegados de **Presupuesto Estudiantil** demuestra un estándar de calidad e ingeniería de software alineado con las mejores prácticas internacionales de Interacción Humano-Computador.

Las intervenciones realizadas:
- **No alteraron la estética ni el diseño visual de la interfaz**, manteniendo absoluta concordancia con los componentes y tokens concebidos en Figma.
- **Subanaron la totalidad de los 5 hallazgos** identificados por el motor de auditoría de Google Lighthouse.
- **Garantizaron matemáticamente que el 100% de las combinaciones cromáticas superan el umbral WCAG 2.1 AA** ($CR \ge 4.5:1$), alcanzando múltiples combinaciones la categoría AAA ($CR \ge 7.0:1$).

Con estas correcciones, la suite completa de páginas de la plataforma se proyecta con una calificación global de **100 / 100 en Accesibilidad**, consolidando una aplicación inclusiva, robusta y accesible para toda la comunidad universitaria.
