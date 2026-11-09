from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from security import get_current_user
from saldo import saldo_actual

router = APIRouter(prefix="/metas", tags=["Metas de Ahorro"])

def total_fondos_reservados(db: Session, usuario_id: int) -> float:
    """Suma los fondos actualmente apartados en todas las metas del usuario."""
    total = db.query(func.coalesce(func.sum(models.MetaAhorro.monto_actual), 0)).filter(
        models.MetaAhorro.usuario_id == usuario_id
    ).scalar()
    return round(float(total or 0), 2)

def calcular_resumen_saldos(db: Session, usuario_id: int):
    """
    Regla Tarea 8:
    Disponible real = Ingresos menos gastos menos fondos reservados en metas.
    """
    saldo_contable = saldo_actual(db, usuario_id)
    reservados = total_fondos_reservados(db, usuario_id)
    disponible_real = round(saldo_contable - reservados, 2)
    return saldo_contable, reservados, disponible_real

def serializar_meta(meta: models.MetaAhorro) -> dict:
    objetivo = float(meta.monto_objetivo or 0)
    actual = float(meta.monto_actual or 0)
    porcentaje = round((actual / objetivo) * 100, 1) if objetivo > 0 else 0.0
    return {
        "id": meta.id,
        "nombre": meta.nombre,
        "monto_objetivo": objetivo,
        "monto_actual": actual,
        "fecha_limite": str(meta.fecha_limite),
        "porcentaje": min(porcentaje, 100.0),
        "restante": max(round(objetivo - actual, 2), 0.0),
        "completada": actual >= objetivo and objetivo > 0,
        "creado_en": str(meta.creado_en)
    }

@router.get("", response_model=schemas.ResumenMetasOut)
def listar_metas(
    db: Session = Depends(get_db),
    usuario: models.Usuario = Depends(get_current_user)
):
    """Lista las metas de ahorro del estudiante con el cálculo de saldo disponible."""
    metas_db = db.query(models.MetaAhorro).filter(
        models.MetaAhorro.usuario_id == usuario.id
    ).order_by(models.MetaAhorro.creado_en.asc()).all()

    saldo_contable, reservados, disponible_real = calcular_resumen_saldos(db, usuario.id)

    return schemas.ResumenMetasOut(
        metas=[schemas.MetaAhorroOut(**serializar_meta(m)) for m in metas_db],
        total_ahorrado=reservados,
        saldo_contable=saldo_contable,
        fondos_reservados=reservados,
        saldo_disponible_real=disponible_real
    )

@router.post("", response_model=schemas.MetaAhorroOut, status_code=status.HTTP_201_CREATED)
def crear_meta(
    datos: schemas.MetaAhorroCreate,
    db: Session = Depends(get_db),
    usuario: models.Usuario = Depends(get_current_user)
):
    """Crea una meta de ahorro con su objetivo y fecha límite."""
    if datos.monto_objetivo <= 0:
        raise HTTPException(status_code=400, detail="El monto objetivo debe ser mayor a 0 Bs.")

    try:
        fecha_obj = datetime.strptime(datos.fecha_limite, "%Y-%m-%d").date()
    except Exception:
        raise HTTPException(status_code=400, detail="La fecha límite debe tener formato YYYY-MM-DD.")

    nueva_meta = models.MetaAhorro(
        usuario_id=usuario.id,
        nombre=datos.nombre.strip(),
        monto_objetivo=datos.monto_objetivo,
        monto_actual=0.00,
        fecha_limite=fecha_obj
    )
    db.add(nueva_meta)
    db.commit()
    db.refresh(nueva_meta)

    return schemas.MetaAhorroOut(**serializar_meta(nueva_meta))


@router.post("/{meta_id}/asignar", response_model=schemas.MetaAhorroOut)
def asignar_fondos_meta(
    meta_id: int,
    datos: schemas.MetaOperacionFondos,
    db: Session = Depends(get_db),
    usuario: models.Usuario = Depends(get_current_user)
):
    """Asigna fondos del saldo disponible a la meta, validando saldo suficiente."""
    if datos.monto <= 0:
        raise HTTPException(status_code=400, detail="El monto a asignar debe ser mayor a 0 Bs.")

    meta = db.query(models.MetaAhorro).filter(
        models.MetaAhorro.id == meta_id,
        models.MetaAhorro.usuario_id == usuario.id
    ).first()

    if not meta:
        raise HTTPException(status_code=404, detail="Meta de ahorro no encontrada.")

    _, _, disponible_real = calcular_resumen_saldos(db, usuario.id)

    if round(datos.monto, 2) > round(disponible_real, 2):
        raise HTTPException(
            status_code=400,
            detail=f"Fondos insuficientes: intentas apartar {datos.monto:.2f} Bs pero solo tienes {max(disponible_real, 0.0):.2f} Bs disponibles."
        )

    meta.monto_actual = float(meta.monto_actual) + round(datos.monto, 2)
    db.commit()
    db.refresh(meta)
    return schemas.MetaAhorroOut(**serializar_meta(meta))

@router.post("/{meta_id}/retirar", response_model=schemas.MetaAhorroOut)
def retirar_fondos_meta(
    meta_id: int,
    datos: schemas.MetaOperacionFondos,
    db: Session = Depends(get_db),
    usuario: models.Usuario = Depends(get_current_user)
):
    """Devuelve fondos de la meta al saldo disponible general."""
    if datos.monto <= 0:
        raise HTTPException(status_code=400, detail="El monto a retirar debe ser mayor a 0 Bs.")

    meta = db.query(models.MetaAhorro).filter(
        models.MetaAhorro.id == meta_id,
        models.MetaAhorro.usuario_id == usuario.id
    ).first()

    if not meta:
        raise HTTPException(status_code=404, detail="Meta de ahorro no encontrada.")

    actual = float(meta.monto_actual or 0)
    if round(datos.monto, 2) > round(actual, 2):
        raise HTTPException(
            status_code=400,
            detail=f"Fondos insuficientes en la meta: intentas retirar {datos.monto:.2f} Bs pero la meta solo tiene {actual:.2f} Bs."
        )

    meta.monto_actual = round(actual - datos.monto, 2)
    db.commit()
    db.refresh(meta)
    return schemas.MetaAhorroOut(**serializar_meta(meta))