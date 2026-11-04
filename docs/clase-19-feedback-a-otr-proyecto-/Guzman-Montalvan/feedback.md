# Evaluación y Feedback a Otro Proyecto

**Nombre completo del evaluador:** Guzman Montalvan Marcos Lehonti  
**Mi grupo y caso de estudio:** Presupuesto Estudiantil - Registrar un gasto con categoría y buscarlo con un filtro  
**Grupo y caso de estudio evaluado:** Unisports - Buscar un partido con cupo e inscribirse  
**Integrantes del proyecto evaluado:** Choque Severiche Lorgio Leonardo  
**URL de la app y repositorio evaluado:** https://github.com/Lorgio09/proyecto2_ihc  
**Fecha y versión:** 03 de Noviembre de 2026  

---

# FLUJO 1: Buscar un partido con cupo e inscribirse (Caso de Estudio Asignado)

## Primera impresión
- **¿Qué entendí al entrar?**  
  Al ingresar a la aplicación, la estructura del menú principal es comprensible y clara; supe inmediatamente a dónde dirigirme para buscar los partidos deportivos disponibles desde la navegación principal.
- **¿Qué me confundió?**  
  Me confundió un poco el nombre de la sección "Explorar partidos". Para un usuario que entra con un objetivo concreto, tal vez sonaría más intuitivo y directo llamarlo "Buscar partidos" o "Partidos disponibles".

---

## Funcionalidad asignada y resultado
**Descripción de la tarea indicada por el docente:**  
Buscar un partido con cupo e inscribirse.

**Marcar solo una opción:**
- [x] La completé sin ayuda
- [ ] La completé con ayuda, ¿cuál?  
- [ ] No pude completarla, ¿dónde me detuve?  

---

## ¿Qué no funcionó?
- **Pasos:**  
  1. Ingresar a la sección "Explorar partidos" desde el menú principal.
  2. Revisar la lista de partidos presentados en pantalla para encontrar uno con cupo.
  3. Observar la sección inferior de la lista donde figuran partidos cuya fecha/horario ya venció.
  4. Tener que activar manualmente el filtro de "Solo con cupos abiertos" para filtrar los partidos válidos.
- **Resultado esperado:**  
  Que al entrar a la sección se muestren de forma directa y prioritaria únicamente los partidos vigentes con cupos abiertos disponibles para inscripción inmediata, sin obligar al usuario a filtrar para descartar eventos caducados.
- **Resultado observado:**  
  Aparecen mezclados o en la parte inferior partidos ya vencidos/concluidos, lo cual genera confusión sobre si aún es posible unirse y añade pasos extra innecesarios al flujo de usuario.

---

## ¿Qué mejoraría y por qué?
1. **Filtro de cupos activos por defecto:** Configurar para que la vista cargue por defecto mostrando únicamente los partidos vigentes con cupos disponibles. Esto optimiza la experiencia y reduce la carga cognitiva al buscar jugar un partido.
2. **Estilo visual de tarjetas y paleta de colores:** Mejorar el diseño de las tarjetas (cards) de los partidos y la coherencia de colores para alinearlos mejor con la identidad visual y deportiva de Unisports (por ejemplo, usando badges con colores semánticos: verde para "Cupos disponibles", amarillo para "Últimos cupos", etc.).
3. **Claridad en el botón de acción:** Asegurar que el botón de "Inscribirse" resalte con mayor contraste en las tarjetas disponibles.

---

## ¿Qué quitaría y por qué?
- **Quitar los partidos vencidos de la vista principal de exploración:**  
  Omitiría por completo mostrar partidos cuya fecha o cupo ya venció en la sección principal de "Explorar partidos". Mostrar partidos pasados no aporta utilidad a un usuario que busca inscribirse en ese instante y satura la interfaz con información obsoleta. Si se desea mantener un registro de partidos jugados, sería mucho más conveniente trasladarlo a una vista o pestaña separada de "Historial de partidos".

---

# FLUJO 2 (Evaluación Adicional): Crear un nuevo partido - Campo "Estado" no interactivo

## Primera impresión
- **¿Qué entendí al entrar?**  
  Al ingresar al formulario de "Crear nuevo partido", se observan varios campos de entrada para definir los detalles del partido (deporte, fecha, lugar, cupos, etc.).
- **¿Qué me confundió?**  
  En la parte inferior del formulario se muestra un campo rotulado como "Estado", el cual tiene apariencia de campo de entrada o selección pero no reacciona al hacer clic ni permite escribir.

---

## Funcionalidad asignada y resultado
**Descripción de la tarea probada por iniciativa propia:**  
Crear un nuevo partido y definir o revisar su estado en el formulario de creación.

**Marcar solo una opción:**
- [ ] La completé sin ayuda
- [ ] La completé con ayuda, ¿cuál?  
- [x] No pude completarla, ¿dónde me detuve? Me detuve en el campo "Estado" del formulario, ya que está bloqueado sin ninguna indicación o mensaje de por qué no responde.

---

## ¿Qué no funcionó?
- **Pasos:**  
  1. Dirigirse a la opción para crear un nuevo partido.
  2. Completar los campos requeridos del formulario.
  3. Desplazarse hasta la parte inferior donde figura el campo "Estado".
  4. Intentar hacer clic para desplegar opciones o intentar escribir texto dentro del campo.
- **Resultado esperado:**  
  Poder seleccionar un estado inicial válido (por ejemplo: "Borrador", "Abierto", "Convocatoria") mediante un selector funcional, o bien, si el estado lo asigna automáticamente el sistema (ej. "Abierto"), que se muestre como una etiqueta de solo lectura debidamente indicada para evitar confusión.
- **Resultado observado:**  
  El campo "Estado" se presenta como un control inerte: no permite escribir, no despliega opciones ni tampoco comunica al usuario que se trata de un valor automático de solo lectura.

---

## ¿Qué mejoraría y por qué?
- **Claridad del campo y feedback de estado:** Si el estado es gestionado de manera automática por el sistema al crearse el partido, se debería reemplazar el campo de texto inerte por un badge informativo fijo (por ejemplo: *"Estado inicial: Abierto para inscripciones"*). Esto evita la frustración del usuario al intentar interactuar con un elemento que no admite entrada.
- **Selector de estado si aplica:** Si la intención de diseño es que el creador decida el estado, habilitar un `<select>` con opciones claras y accesibles.

---

## ¿Qué quitaría y por qué?
- **Quitar el input interactivo falso de "Estado":**  
  Eliminaría el control de entrada que simula ser editable cuando en realidad está inhabilitado sin explicación. Mantener un campo que no responde genera la sensación de que el formulario está roto o congelado.

---

# FLUJO 3 (Evaluación Adicional): Gestión de cupos de equipo - Validación de "Completar equipo" con cupos vacíos (0/18)

## Primera impresión
- **¿Qué entendí al entrar?**  
  En la vista del partido o gestión de equipos se visualiza el estado de los cupos y la lista de jugadores inscritos para cada equipo con un contador numérico (ejemplo: 0/18).
- **¿Qué me confundió?**  
  Me confundió que existiendo un contador explícito de cupos en `0/18` (es decir, sin jugadores registrados aún en el equipo), la acción de "Completar equipo" se encuentre disponible y habilitada para marcarse libremente.

---

## Funcionalidad asignada y resultado
**Descripción de la tarea probada por iniciativa propia:**  
Gestionar el cupo de jugadores de un equipo y verificar la validación de la opción "Completar equipo".

**Marcar solo una opción:**
- [x] La completé sin ayuda (se pudo accionar la opción, pero el comportamiento del sistema no valida la regla de negocio)
- [ ] La completé con ayuda, ¿cuál?  
- [ ] No pude completarla, ¿dónde me detuve?  

---

## ¿Qué no funcionó?
- **Pasos:**  
  1. Acceder al detalle o configuración de un partido con equipos asignados.
  2. Observar que el equipo cuenta con `0/18` jugadores registrados (cupos vacíos).
  3. Hacer clic en la opción o botón "Completar equipo".
- **Resultado esperado:**  
  Que el sistema impida marcar un equipo como "Completo" si no cuenta con la cantidad mínima de jugadores requerida (o si está en 0/18), mostrando una alerta de validación o manteniendo el botón deshabilitado con un mensaje tipo *"Faltan 18 jugadores para completar el equipo"*.
- **Resultado observado:**  
  El sistema permite seleccionar y marcar "Completar equipo" de manera directa a pesar de tener 0/18 jugadores, dejando el equipo en un estado inconsistente (marcado como completo pero sin integrantes).

---

## ¿Qué mejoraría y por qué?
- **Validación de reglas de negocio en la interfaz:** Condicionar la acción de "Completar equipo" a que se alcance efectivamente el límite de cupos o un mínimo requerido. Mientras no se cumpla, el botón debe permanecer deshabilitado con un tooltip explicativo que indique la cantidad de cupos pendientes.
- **Confirmación antes de forzar el cierre:** Si un organizador necesita cerrar el equipo anticipadamente con menos jugadores, la acción no debería llamarse "Completar equipo", sino "Cerrar inscripciones de equipo" y pedir una confirmación explícita para evitar errores accidentales.

---

## ¿Qué quitaría y por qué?
- **Quitar la activación libre de "Completar equipo" sin validación:**  
  Eliminaría la posibilidad de que el usuario marque como "Completo" un equipo con cupos en 0 o incompletos sin ninguna comprobación previa, ya que compromete la integridad de los datos del partido y desorienta al resto de participantes que buscan unirse.
