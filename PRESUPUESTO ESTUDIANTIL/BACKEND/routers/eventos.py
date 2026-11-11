from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from security import get_current_user

router = APIRouter(prefix="/eventos", tags=["Eventos"])

@router.post("", response_model=schemas.EventoOut)
def registrar_evento(
    payload: schemas.EventoCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    nuevo_evento = models.Evento(
        usuario_id=current_user.id if current_user else None,
        nombre=payload.nombre,
        propiedades=payload.propiedades
    )
    db.add(nuevo_evento)
    db.commit()
    db.refresh(nuevo_evento)
    return nuevo_evento

@router.get("", response_model=List[schemas.EventoOut])
def listar_eventos(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    return (
        db.query(models.Evento)
        .filter(models.Evento.usuario_id == current_user.id)
        .order_by(models.Evento.fecha.desc())
        .limit(100)
        .all()
    )

