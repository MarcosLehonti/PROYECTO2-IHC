# Tarea 5: Presupuesto Mensual por Categoría y Monitoreo de Consumo

* **Proyecto Propio en GitHub:** [https://github.com/MarcosLehonti/ihc_segundo_proyecto](https://github.com/MarcosLehonti/ihc_segundo_proyecto)
* **Estudiante:** GUZMAN MONTALVAN MARCOS LEHONTI
* **Materia:** Interacción Hombre-Computador (IHC)
* **Proyecto:** Presupuesto Estudiantil
* **Fecha:** Octubre 2026

---

## 1. Descripción de la Funcionalidad

El sistema contaba únicamente con un límite de gasto global mensual para el usuario. En esta tarea se implementó la funcionalidad completa de **Presupuesto Mensual por Categoría**, la cual permite:

1. **Definir un límite mensual de gasto específico para cada categoría** (ej. Comida, Transporte, Libros, etc.).
2. **Calcular y mostrar en tiempo real cuánto dinero se consumió** de dicho presupuesto durante el mes.
3. **Calcular el saldo disponible y el porcentaje de consumo** por categoría.
4. **Modificar o eliminar** el presupuesto de cualquier categoría en cualquier momento.

Todo el desarrollo se realizó manteniendo el principio de **código limpio, modular y mínimo**, sin alterar las funcionalidades preexistentes del sistema.

---

## 2. Base de Datos y Modelo ORM

### 2.1 Tabla en PostgreSQL / SQLite (`schema.sql`)
Se añadió la tabla `presupuestos_categoria` con una restricción de unicidad para evitar presupuestos duplicados en el mismo mes:

```sql
CREATE TABLE IF NOT EXISTS presupuestos_categoria (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    monto_limite NUMERIC(10, 2) NOT NULL CHECK (monto_limite > 0),
    mes VARCHAR(7) NOT NULL, -- Formato 'YYYY-MM'
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_usuario_categoria_mes UNIQUE (usuario_id, categoria_id, mes)
);

CREATE INDEX IF NOT EXISTS idx_presupuestos_usuario_mes ON presupuestos_categoria(usuario_id, mes);
```

### 2.2 Modelo SQLAlchemy (`models.py`)
Se mapeó la entidad en el backend mediante la clase `PresupuestoCategoria`:

```python
class PresupuestoCategoria(Base):
    __tablename__ = "presupuestos_categoria"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False, index=True)
    categoria_id = Column(Integer, ForeignKey("categorias.id", ondelete="CASCADE"), nullable=False)
    monto_limite = Column(Numeric(10, 2), nullable=False)
    mes = Column(String(7), nullable=False)  # Formato 'YYYY-MM'
    creado_en = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("usuario_id", "categoria_id", "mes", name="uq_usuario_categoria_mes"),
    )

    usuario = relationship("Usuario")
    categoria = relationship("Categoria")
```

---

## 3. Backend (FastAPI)

### 3.1 Esquemas Pydantic (`schemas.py`)
Se agregaron los modelos de validación para la entrada y salida de datos:

* **`PresupuestoCategoriaIn`**: Recibe `categoria_id`, `monto_limite` y opcionalmente `mes`.
* **`PresupuestoCategoriaOut`**: Devuelve `id`, `categoria_id`, `categoria_nombre`, `categoria_icono`, `monto_limite`, `gastado`, `disponible`, `porcentaje` y `mes`.

### 3.2 Controlador / Router Dedicado (`routers/presupuestos.py`)
Se creó un nuevo controlador modular con prefijo `/presupuestos-categoria`:

1. **`GET /presupuestos-categoria?mes=YYYY-MM`**:
   * Consulta las categorías de gasto activas.
   * Ejecuta la suma de los movimientos de tipo `gasto` realizados por el usuario en esa categoría durante el mes consultado.
   * Retorna para cada categoría: el límite asignado, lo consumido (`gastado`), lo restante (`disponible`) y el `% consumido` (`porcentaje`).
2. **`POST /presupuestos-categoria`**:
   * Valida que el monto sea mayor a 0 y que la categoría sea de tipo gasto.
   * Crea o actualiza el registro mensual de presupuesto para el usuario autenticado.
3. **`DELETE /presupuestos-categoria/{categoria_id}?mes=YYYY-MM`**:
   * Elimina el límite configurado de la categoría seleccionada para ese mes.

### 3.3 Montaje en la aplicación (`main.py`)
Solo se agregaron 2 líneas para registrar el router en la app principal:
```python
from routers import usuarios, movimientos, categorias, limite, presupuestos
...
app.include_router(presupuestos.router)
```

---

## 4. Pruebas Automatizadas Backend (`tests/test_presupuestos_categoria.py`)

Se diseñaron 4 casos de prueba automatizados con `pytest` para certificar el funcionamiento:

1. **`test_listar_presupuestos_categoria_vacio`**: Verifica que al iniciar se muestren las categorías con `gastado: 0.0` y sin presupuesto configurado.
2. **`test_guardar_presupuesto_categoria`**: Prueba la creación y respuesta correcta de un presupuesto (ej. 150 Bs para Transporte).
3. **`test_calculo_consumo_por_categoria`**: Prueba clave de consumo:
   * Asigna un presupuesto de **200 Bs**.
   * Registra un gasto real de **50 Bs**.
   * Verifica que el endpoint retorne exactamente: `gastado == 50.0`, `disponible == 150.0` y `porcentaje == 25.0%`.
4. **`test_eliminar_presupuesto_categoria`**: Verifica que al borrar el presupuesto, la categoría vuelva a quedar sin límite (`None`).

> **Resultado de la suite de pruebas:** **89 passed** (85 pruebas previas del proyecto + 4 pruebas de la nueva funcionalidad).

---

## 5. Frontend (Vue 3)

Para mantener los cambios concisos y naturales, **se modificó un único archivo** sin crear vistas complejas:

### Archivo modificado: [`MovimientosView.vue`](file:///c:/Users/HP/Desktop/Universidad/Interaccion%20Hombre%20Computador/segundo_proyecto_fork/PROYECTO2-IHC/PRESUPUESTO%20ESTUDIANTIL/FRONTEND/src/views/MovimientosView.vue) (+51 líneas)

1. **Sección Visual (Template):**
   * Justo dentro de la tarjeta de *Límite Mensual*, se agregó un botón desplegable:  
     `▼ Ver presupuesto por categoría`.
   * Al desplegarse, lista cada categoría con su consumo actual:  
     *Ejemplo:* `Comida y Almuerzos — Gastado: 25.00 Bs / Límite: 200.00 Bs (12.5%)`
   * Si la categoría no tiene tope, muestra: `Gastado: 25.00 Bs · Sin límite`.
   * Incluye el botón **`Asignar`** o **`Editar`** por cada categoría.

2. **Lógica de Interacción (Script):**
   * `cargarPresupuestosCat()`: Obtiene la lista y consumos desde el backend al expandir.
   * `asignarPresupuestoCat(cat)`: Solicita el monto mediante un diálogo interactivo simple y lo envía al endpoint `POST /presupuestos-categoria`.

3. **Estilos (CSS):**
   * Estilos compactos que se integran con la estética existente de la tarjeta.

---

## 6. Comandos de Ejecución

Para iniciar el proyecto completo en terminales independientes:

### Backend:
```powershell
cd "PRESUPUESTO ESTUDIANTIL\BACKEND"
.\venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload
```

### Frontend:
```powershell
cd "PRESUPUESTO ESTUDIANTIL\FRONTEND"
npm run dev
```

---

## 7. Resumen de Impacto en el Código

| Componente | Archivo | Modificación |
|---|---|---|
| Base de Datos | `schema.sql` | +14 líneas (nueva tabla `presupuestos_categoria`) |
| Modelo ORM | `models.py` | +18 líneas (clase `PresupuestoCategoria`) |
| Schemas | `schemas.py` | +18 líneas (modelos Pydantic In/Out) |
| Controlador | `routers/presupuestos.py` | Nuevo archivo modular con endpoints GET, POST, DELETE |
| App Backend | `main.py` | +2 líneas (inclusión del router) |
| Tests | `tests/test_presupuestos_categoria.py` | 4 tests unitarios automatizados (89 passed) |
| Frontend | `views/MovimientosView.vue` | +51 líneas (lista desplegable con asignación y consumo) |

