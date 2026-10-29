"""
Pruebas para Presupuesto Mensual por Categoría
Verifica:
1. Listar presupuestos por categoría y consumo.
2. Asignar presupuesto mensual a una categoría de gasto.
3. Calcular lo consumido (gastado), disponible y porcentaje ante movimientos registrados.
4. Eliminar/resetear presupuesto de una categoría.
"""

from datetime import date
import models

def test_listar_presupuestos_categoria_vacio(client, db_session):
    cat = models.Categoria(id=1, nombre="Comida y Almuerzos", tipo="gasto", icono="utensils")
    db_session.add(cat)
    db_session.commit()

    resp = client.get("/presupuestos-categoria")
    assert resp.status_code == 200
    datos = resp.json()
    assert len(datos) == 1
    assert datos[0]["categoria_nombre"] == "Comida y Almuerzos"
    assert datos[0]["monto_limite"] is None
    assert datos[0]["gastado"] == 0.0
    assert datos[0]["disponible"] is None

def test_guardar_presupuesto_categoria(client, db_session):
    cat = models.Categoria(id=1, nombre="Transporte y Pasajes", tipo="gasto", icono="bus")
    db_session.add(cat)
    db_session.commit()

    mes_actual = date.today().strftime("%Y-%m")
    payload = {
        "categoria_id": 1,
        "monto_limite": 150.0,
        "mes": mes_actual
    }
    resp = client.post("/presupuestos-categoria", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["monto_limite"] == 150.0
    assert data["disponible"] == 150.0
    assert data["gastado"] == 0.0
    assert data["porcentaje"] == 0.0

def test_calculo_consumo_por_categoria(client, db_session):
    cat = models.Categoria(id=1, nombre="Comida y Almuerzos", tipo="gasto", icono="utensils")
    db_session.add(cat)
    db_session.commit()

    mes_actual = date.today().strftime("%Y-%m")
    # Asignar presupuesto de 200 Bs
    client.post("/presupuestos-categoria", json={
        "categoria_id": 1,
        "monto_limite": 200.0,
        "mes": mes_actual
    })

    # Registrar gasto de 50 Bs en esa categoría
    mov = models.Movimiento(
        usuario_id=1,
        categoria_id=1,
        monto=50.0,
        tipo="gasto",
        descripcion="Almuerzo universitario",
        fecha=date.today(),
        estado="pagado"
    )
    db_session.add(mov)
    db_session.commit()

    resp = client.get(f"/presupuestos-categoria?mes={mes_actual}")
    assert resp.status_code == 200
    item = [x for x in resp.json() if x["categoria_id"] == 1][0]
    assert item["monto_limite"] == 200.0
    assert item["gastado"] == 50.0
    assert item["disponible"] == 150.0
    assert item["porcentaje"] == 25.0

def test_eliminar_presupuesto_categoria(client, db_session):
    cat = models.Categoria(id=1, nombre="Fotocopias", tipo="gasto", icono="book-open")
    db_session.add(cat)
    db_session.commit()

    mes_actual = date.today().strftime("%Y-%m")
    client.post("/presupuestos-categoria", json={
        "categoria_id": 1,
        "monto_limite": 80.0,
        "mes": mes_actual
    })

    resp_del = client.delete(f"/presupuestos-categoria/1?mes={mes_actual}")
    assert resp_del.status_code == 200

    resp = client.get(f"/presupuestos-categoria?mes={mes_actual}")
    item = [x for x in resp.json() if x["categoria_id"] == 1][0]
    assert item["monto_limite"] is None

