from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, extract
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from security import get_current_user

router = APIRouter(prefix="/presupuestos-categoria", tags=["Presupuestos por Categoría"])

def gasto_categoria_mes(db: Session, usuario_id: int, categoria_id: int, anio: int, mes_num: int) -> float:
    """Suma los gastos de una categoría específica para el usuario en el mes dado."""
    total = db.query(func.coalesce(func.sum(models.Movimiento.monto), 0)).filter(
        models.Movimiento.usuario_id == usuario_id,
        models.Movimiento.categoria_id == categoria_id,
        models.Movimiento.tipo == "gasto",
        extract("year", models.Movimiento.fecha) == anio,
        extract("month", models.Movimiento.fecha) == mes_num,
    ).scalar()
    return round(float(total or 0), 2)

@router.get("", response_model=List[schemas.PresupuestoCategoriaOut])
def listar_presupuestos_categoria(
    mes: Optional[str] = None,
    db: Session = Depends(get_db),
    usuario: models.Usuario = Depends(get_current_user)
):
    """Devuelve el presupuesto y lo consumido por cada categoría de gasto en el mes indicado."""
    hoy = date.today()
    mes_str = mes if (mes and len(mes) == 7 and mes[4] == '-') else hoy.strftime("%Y-%m")
    try:
        anio, mes_num = [int(p) for p in mes_str.split("-")]
    except Exception:
        anio, mes_num = hoy.year, hoy.month
        mes_str = hoy.strftime("%Y-%m")

    categorias_gasto = db.query(models.Categoria).filter(models.Categoria.tipo == "gasto").all()
    
    # Presupuestos definidos por el usuario en este mes
    presupuestos_db = db.query(models.PresupuestoCategoria).filter(
        models.PresupuestoCategoria.usuario_id == usuario.id,
        models.PresupuestoCategoria.mes == mes_str
    ).all()
    mapa_presupuestos = {p.categoria_id: p for p in presupuestos_db}

    resultado = []
    for cat in categorias_gasto:
        pres = mapa_presupuestos.get(cat.id)
        gastado = gasto_categoria_mes(db, usuario.id, cat.id, anio, mes_num)
        monto_limite = float(pres.monto_limite) if pres else None
        
        disponible = round(monto_limite - gastado, 2) if monto_limite is not None else None
        porcentaje = 0.0
        if monto_limite and monto_limite > 0:
            porcentaje = min(round((gastado / monto_limite) * 100, 1), 100.0)

        resultado.append({
            "id": pres.id if pres else None,
            "categoria_id": cat.id,
            "categoria_nombre": cat.nombre,
            "categoria_icono": cat.icono or "tag",
            "monto_limite": monto_limite,
            "gastado": gastado,
            "disponible": disponible,
            "porcentaje": porcentaje,
            "mes": mes_str
        })

    return resultado

@router.post("", response_model=schemas.PresupuestoCategoriaOut)
def guardar_presupuesto_categoria(
    datos: schemas.PresupuestoCategoriaIn,
    db: Session = Depends(get_db),
    usuario: models.Usuario = Depends(get_current_user)
):
    """Crea o actualiza el presupuesto mensual para una categoría."""
    if usuario.es_demo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Modo demo: no se pueden configurar presupuestos."
        )

    if datos.monto_limite <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El presupuesto asignado debe ser mayor a 0."
        )

    cat = db.query(models.Categoria).filter(
        models.Categoria.id == datos.categoria_id,
        models.Categoria.tipo == "gasto"
    ).first()
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría de gasto no encontrada."
        )

    hoy = date.today()
    mes_str = datos.mes if (datos.mes and len(datos.mes) == 7 and datos.mes[4] == '-') else hoy.strftime("%Y-%m")
    anio, mes_num = [int(p) for p in mes_str.split("-")]

    pres = db.query(models.PresupuestoCategoria).filter(
        models.PresupuestoCategoria.usuario_id == usuario.id,
        models.PresupuestoCategoria.categoria_id == cat.id,
        models.PresupuestoCategoria.mes == mes_str
    ).first()

    if pres:
        pres.monto_limite = datos.monto_limite
    else:
        pres = models.PresupuestoCategoria(
            usuario_id=usuario.id,
            categoria_id=cat.id,
            monto_limite=datos.monto_limite,
            mes=mes_str
        )
        db.add(pres)

    db.commit()
    db.refresh(pres)

    gastado = gasto_categoria_mes(db, usuario.id, cat.id, anio, mes_num)
    monto_limite = float(pres.monto_limite)
    disponible = round(monto_limite - gastado, 2)
    porcentaje = min(round((gastado / monto_limite) * 100, 1), 100.0) if monto_limite > 0 else 0.0

    return {
        "id": pres.id,
        "categoria_id": cat.id,
        "categoria_nombre": cat.nombre,
        "categoria_icono": cat.icono or "tag",
        "monto_limite": monto_limite,
        "gastado": gastado,
        "disponible": disponible,
        "porcentaje": porcentaje,
        "mes": mes_str
    }

@router.delete("/{categoria_id}")
def eliminar_presupuesto_categoria(
    categoria_id: int,
    mes: Optional[str] = None,
    db: Session = Depends(get_db),
    usuario: models.Usuario = Depends(get_current_user)
):
    """Elimina el presupuesto de una categoría para el mes."""
    if usuario.es_demo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Modo demo: no se pueden modificar presupuestos."
        )

    hoy = date.today()
    mes_str = mes if (mes and len(mes) == 7 and mes[4] == '-') else hoy.strftime("%Y-%m")

    pres = db.query(models.PresupuestoCategoria).filter(
        models.PresupuestoCategoria.usuario_id == usuario.id,
        models.PresupuestoCategoria.categoria_id == categoria_id,
        models.PresupuestoCategoria.mes == mes_str
    ).first()

    if pres:
        db.delete(pres)
        db.commit()

    return {"ok": True, "categoria_id": categoria_id, "mes": mes_str}

