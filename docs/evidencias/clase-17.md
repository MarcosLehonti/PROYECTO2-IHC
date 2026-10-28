# Clase 17 - Recorrido de Interacción y Propuesta de Refactorización

* **Proyecto recibido del repositorio de (hice fork en mi git):** [https://github.com/Carmen21-A/PROYECTO2-IHC](https://github.com/Carmen21-A/PROYECTO2-IHC)
* **Proyecto propio en el repo de:** [https://github.com/MarcosLehonti/ihc_segundo_proyecto](https://github.com/MarcosLehonti/ihc_segundo_proyecto) - **Estudiante:** GUZMAN MONTALVAN MARCOS LEHONTI

**Estudiante:** GUZMAN MONTALVAN MARCOS LEHONTI  
**Materia:** Interacción Hombre-Computador (IHC)  
**Proyecto:** Presupuesto Estudiantil  
**Tipo de actividad:** Evidencias de Interacción y Propuesta de Refactorización sin alterar el comportamiento observable  
**Estado:** Propuesta técnica documentada  

---

## 1. Recorrido y Flujo de Interacción del Sistema (Evidencias)

A continuación se documenta el recorrido visual completo por la aplicación, evidenciando el correcto funcionamiento de los servicios y el flujo de trabajo del usuario:

### 1.1 Captura 1: Dashboard Principal
* **Paso:** Pantalla principal y dashboard de inicio del sistema (*Presupuesto Estudiantil* en `http://localhost:5173`), punto de entrada para iniciar sesión o acceder a la plataforma.
* **Evidencia visual:**
  ![Captura 1: Dashboard Principal](clase-17/Captura%20de%20proyecto%20corriendo%201.png)

---

### 1.2 Captura 2: Menú "Mis Movimientos"
* **Paso:** Se navega al menú de **Mis Movimientos** (`/movimientos`). Se observan las métricas en cero (*Saldo Disponible 0.00 Bs*, *Ingresos 0.00 Bs*, *Gastos 0.00 Bs*), el configurador del límite mensual, el estado vacío y el botón para registrar movimientos.
* **Evidencia visual:**
  ![Captura 2: Menú Mis Movimientos](clase-17/captura%20de%20proyecto%20corriendo%202.png)

---

### 1.3 Captura 21: Formulario donde rellenamos el gasto
* **Paso:** Al presionar el botón **`+ Registrar Movimiento`**, se abre el formulario modal donde rellenamos los datos del gasto: Tipo (*Gasto*), Cantidad (*25 Bs*), Descripción (*"Almuerzo"*), Categoría (*"Comida y Almuerzos"*) y Fecha (*27 de Octubre*).
* **Evidencia visual:**
  ![Captura 21: Formulario donde rellenamos el gasto](clase-17/captura%20de%20proyecto%20corriendo%2021.png)

---

### 1.4 Captura 3: Gasto ya creado en la tabla
* **Paso:** Tras guardar, vemos el gasto de 25.00 Bs ya creado y listado en la tabla en estado **`Pendiente`** (amarillo), con sus botones de acción (*Marcar como pagado*, *Editar*, *Eliminar*) y el límite mensual actualizado.
* **Evidencia visual:**
  ![Captura 3: Gasto ya creado](clase-17/Captura%20de%20proyecto%20corriendo%203.png)

---

### 1.5 Captura 4: Selección por filtros para escoger qué movimientos ver por tipo
* **Paso:** Seleccionamos los filtros de búsqueda para escoger qué movimientos ver; en este caso filtramos por el tipo **`Gastos`**, visualizando los egresos correspondientes (*"libro de tecno"* y *"Almuerzo"*) con el total acumulado.
* **Evidencia visual:**
  ![Captura 4: Selección por filtros para escoger qué movimientos ver por tipo](clase-17/Captura%20de%20proyecto%20corriendo%204.png)

---

## 2. Ejecución de los Servicios (Backend y Frontend)

Para poner en funcionamiento el sistema completo se requiere iniciar ambos servicios en terminales independientes:

### 2.1 Comandos y Ejecución del Backend (FastAPI)
En la primera terminal (estando en la carpeta del proyecto):
```powershell
cd "PRESUPUESTO ESTUDIANTIL\BACKEND"
.\venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload
```

* **Evidencia visual 1 (Backend corriendo):** Conexión exitosa a la base de datos PostgreSQL (`presupuesto_estudiantil2`) y servidor Uvicorn inicializado en el puerto 8000:
  ![Evidencia Backend Corriendo](clase-17/evidencia%20backend%20corriendo.png)

---

### 2.2 Comandos y Ejecución del Frontend (Vue 3 + Vite)
En la segunda terminal:
```powershell
cd "PRESUPUESTO ESTUDIANTIL\FRONTEND"
npm run dev
```

* **Evidencia visual 2 (Frontend corriendo):** Servidor de desarrollo Vite activo en `http://localhost:5173`:
  ![Evidencia Frontend Corriendo](clase-17/evidencia%20fronted%20corriendo.png)

---

### 2.3 Registro de Peticiones HTTP en el Backend
* **Evidencia visual 3 (Backend peticiones en vivo):** Consola del backend recibiendo y respondiendo exitosamente las solicitudes del frontend (`GET /movimientos`, `POST /movimientos`, `GET /categorias`):
  ![Evidencia Backend Peticiones](clase-17/evidencia%20backend%20peticiones.png)

---

## 3. Impacto

### 3.1 ¿Qué es una Refactorización (Refactoring)?

Una **refactorización** es una técnica disciplinada para reestructurar el cuerpo de código existente, alterando su estructura interna sin cambiar en lo absoluto su **comportamiento observable** externo (Martin Fowler).

* **Lo que SÍ hace:** Mejora la legibilidad, reduce la duplicación (principio DRY: *Don't Repeat Yourself*), simplifica la complejidad ciclomática y facilita el mantenimiento futuro.
* **Lo que NO hace:** No agrega nuevas funcionalidades, no modifica contratos de API (las entradas y salidas JSON siguen siendo exactamente iguales) y no altera los códigos de estado HTTP ni las validaciones de negocio.

---

## 4. Diagnóstico: Detección del "Code Smell" (Olor de código)

* **Archivo afectado:** [`routers/movimientos.py`](file:///c:/Users/HP/Desktop/Universidad/Interaccion%20Hombre%20Computador/segundo_proyecto_fork/PROYECTO2-IHC/PRESUPUESTO%20ESTUDIANTIL/BACKEND/routers/movimientos.py)
* **Code Smell detectado:** **Código Duplicado (Duplicated Code)** y **Falta de Reutilización de Helpers Existentes**.

### Situación actual:
En el archivo [`routers/movimientos.py`](file:///c:/Users/HP/Desktop/Universidad/Interaccion%20Hombre%20Computador/segundo_proyecto_fork/PROYECTO2-IHC/PRESUPUESTO%20ESTUDIANTIL/BACKEND/routers/movimientos.py) ya existen dos funciones auxiliares bien testeadas y limpias:
1. `obtener_movimiento_propio(movimiento_id, db, usuario)` (líneas 52–59): Busca el movimiento en la base de datos validando que pertenezca al usuario autenticado, y si no existe lanza un error `404 Not Found`.
2. `serializar_movimiento(mov, db)` (líneas 62–76): Transforma la entidad de SQLAlchemy a un diccionario serializable con el formato estándar que espera el Frontend (con su categoría, formato de fecha `AAAA-MM-DD` y estado).

Funciones como `editar_movimiento` y `eliminar_movimiento` ya aprovechan estos helpers. Sin embargo, en la función **`marcar_como_pagado()`** (creada en la Tarea 2), se volvió a escribir manualmente la consulta a la base de datos y la serialización completa del diccionario de respuesta, duplicando cerca de 20 líneas de lógica innecesariamente.

---

## 5. Propuesta de Refactorización: "Reutilizar Helpers en `marcar_como_pagado`"

La propuesta consiste en aplicar la técnica de refactoring **"Substitute Algorithm / Use Existing Helper"** en el endpoint `PATCH /movimientos/{movimiento_id}/pagar`.

### Objetivos del Refactor:
1. Reemplazar la búsqueda manual y validación del 404 por una sola llamada a `obtener_movimiento_propio(movimiento_id, db, usuario)`.
2. Reemplazar la construcción manual del diccionario de respuesta por `return serializar_movimiento(mov, db)`.

---

## 6. Comparativa de Código: Antes vs. Después

### Código Actual (Antes del refactor):

```python
@router.patch("/{movimiento_id}/pagar", response_model=schemas.MovimientoOut)
def marcar_como_pagado(
    movimiento_id: int,
    db: Session = Depends(get_db),
    usuario: models.Usuario = Depends(get_current_user)
):
    bloquear_demo(usuario)

    # ❌ CÓDIGO DUPLICADO: Búsqueda manual y validación de 404 repetida
    mov = db.query(models.Movimiento).filter(
        models.Movimiento.id == movimiento_id,
        models.Movimiento.usuario_id == usuario.id
    ).first()

    if not mov:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado.")

    if getattr(mov, "estado", "pendiente") == "pagado":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transición inválida: el movimiento ya se encuentra en estado pagado."
        )

    if mov.tipo == "gasto":
        verificar_saldo_para_pago(db, usuario, mov.monto)

    mov.estado = "pagado"
    db.commit()
    db.refresh(mov)

    # ❌ CÓDIGO DUPLICADO: Serialización manual repetida
    categoria_nombre = "General"
    if mov.categoria_id:
        cat = db.query(models.Categoria).filter(models.Categoria.id == mov.categoria_id).first()
        if cat:
            categoria_nombre = cat.nombre

    return {
        "id": mov.id,
        "descripcion": mov.descripcion,
        "categoria": categoria_nombre,
        "monto": float(mov.monto),
        "tipo": mov.tipo,
        "fecha": mov.fecha.strftime("%Y-%m-%d") if hasattr(mov.fecha, 'strftime') else str(mov.fecha),
        "estado": mov.estado
    }
```

---

### Código Propuesto (Después del refactor):

```python
@router.patch("/{movimiento_id}/pagar", response_model=schemas.MovimientoOut)
def marcar_como_pagado(
    movimiento_id: int,
    db: Session = Depends(get_db),
    usuario: models.Usuario = Depends(get_current_user)
):
    bloquear_demo(usuario)

    # ✅ REFACTOR: Uso del helper estándar (más limpio y consistente)
    mov = obtener_movimiento_propio(movimiento_id, db, usuario)

    if getattr(mov, "estado", "pendiente") == "pagado":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transición inválida: el movimiento ya se encuentra en estado pagado."
        )

    if mov.tipo == "gasto":
        verificar_saldo_para_pago(db, usuario, mov.monto)

    mov.estado = "pagado"
    db.commit()
    db.refresh(mov)

    # ✅ REFACTOR: Serialización unificada a través del helper existente
    return serializar_movimiento(mov, db)
```

---

## 7. Beneficios de la Refactorización

1. **Reducción de líneas:** La función pasa de tener 44 líneas a únicamente 21 líneas (reducción de más del 50%).
2. **Principio DRY (Don't Repeat Yourself):** Se evita la divergencia de código. Si en el futuro se añade un nuevo atributo a la serialización o se ajusta el formato de fecha, el cambio se hace en un único punto central (`serializar_movimiento`).
3. **Mantenibilidad y Legibilidad:** El código resulta mucho más claro y expresivo para cualquier desarrollador que lea el endpoint.
4. **Cero riesgo de regresión:** Se aprovechan funciones auxiliares que ya cuentan con pruebas unitarias específicas.

---

## 8. Verificación del Comportamiento Observable

Para certificar que el comportamiento observable no se vio alterado, se debe ejecutar la suite de pruebas automatizadas antes y después de aplicar el cambio:

```bash
# Estando en la carpeta BACKEND con el entorno venv activado:
pytest tests/test_estado_movimiento.py -v
```

O para verificar el sistema completo:
```bash
pytest tests/ -v
```

**Criterio de éxito:**
* Los 4 casos de prueba de estado (`test_estado_movimiento.py`) y las 85 pruebas totales del proyecto deben terminar en verde (`85 passed`).
* El Frontend debe seguir recibiendo exactamente la misma respuesta JSON con los mismos campos (`id`, `descripcion`, `categoria`, `monto`, `tipo`, `fecha`, `estado`).
