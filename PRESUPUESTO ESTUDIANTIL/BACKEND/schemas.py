from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class UsuarioRegistro(BaseModel):
    nombre: str
    email: str
    password: str

class UsuarioLogin(BaseModel):
    email: str
    password: str

class UsuarioOut(BaseModel):
    id: int
    nombre: str
    email: str
    es_demo: bool = False

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    token: str
    usuario: UsuarioOut

class SolicitarCodigo(BaseModel):
    email: str

class VerificarCodigo(BaseModel):
    email: str
    codigo: str

class RestablecerPassword(BaseModel):
    email: str
    codigo: str
    nueva_password: str

class MovimientoCreate(BaseModel):
    descripcion: str
    categoria: Optional[str] = "General"
    monto: float
    tipo: Optional[str] = "gasto"
    fecha: Optional[str] = None
    estado: Optional[str] = "pendiente"
    recurrencia: Optional[str] = "ninguna"

class MovimientoUpdate(BaseModel):
    descripcion: Optional[str] = None
    monto: Optional[float] = None
    fecha: Optional[str] = None
    categoria: Optional[str] = None

class MovimientoOut(BaseModel):
    id: int
    descripcion: str
    categoria: str
    monto: float
    tipo: str
    fecha: str
    estado: str = "pendiente"
    recurrencia: Optional[str] = "ninguna"

    class Config:
        from_attributes = True

class ResumenMes(BaseModel):
    ingresos_del_mes: float
    gastos_del_mes: float
    saldo_disponible: float

class ResumenFinanciero(BaseModel):
    saldo_disponible: float
    ingresos_del_mes: float
    gastos_del_mes: float
    resumen_mes: Optional[ResumenMes] = None
    movimientos: List[MovimientoOut]
    fondos_reservados: Optional[float] = 0.0
    saldo_disponible_real: Optional[float] = None

class ResultadoFiltro(BaseModel):
    movimientos: List[MovimientoOut]
    cantidad: int
    total_ingresos: float
    total_gastos: float

class ResumenHistorial(BaseModel):
    cantidad: int
    ingresos: float
    gastos: float
    balance: float

class DiaHistorial(BaseModel):
    fecha: str
    movimientos: List[MovimientoOut]

class HistorialMes(BaseModel):
    mes: str
    mes_texto: str
    resumen: ResumenHistorial
    dias: List[DiaHistorial]

class CategoriaOut(BaseModel):
    id: int
    nombre: str
    tipo: str
    icono: str

    class Config:
        from_attributes = True

class LimiteMensualIn(BaseModel):
    # Se recibe tal cual lo escribió el estudiante; la regla decide si es válido
    limite: Any = None

class LimiteMensualOut(BaseModel):
    limite: Optional[float] = None
    gastado_mes: float
    disponible: Optional[float] = None
    mes: str


class PresupuestoCategoriaIn(BaseModel):
    categoria_id: int
    monto_limite: float
    mes: Optional[str] = None

class PresupuestoCategoriaOut(BaseModel):
    id: Optional[int] = None
    categoria_id: int
    categoria_nombre: str
    categoria_icono: Optional[str] = "tag"
    monto_limite: Optional[float] = None
    gastado: float = 0.0
    disponible: Optional[float] = None
    porcentaje: float = 0.0
    saldo: Optional[float] = None
    estado: Optional[str] = 'sin_limite'
    mes: str


# ===================== Metas de Ahorro (Tarea 8) =====================

class MetaAhorroCreate(BaseModel):
    nombre: str
    monto_objetivo: float
    fecha_limite: str  # Formato 'YYYY-MM-DD'

class MetaAhorroUpdate(BaseModel):
    nombre: Optional[str] = None
    monto_objetivo: Optional[float] = None
    fecha_limite: Optional[str] = None

class MetaAhorroOut(BaseModel):
    id: int
    nombre: str
    monto_objetivo: float
    monto_actual: float
    fecha_limite: str
    porcentaje: float = 0.0
    restante: float = 0.0
    completada: bool = False
    creado_en: Optional[str] = None

    class Config:
        from_attributes = True

class MetaOperacionFondos(BaseModel):
    monto: float

class MetaTransferencia(BaseModel):
    meta_origen_id: int
    meta_destino_id: int
    monto: float

class ResumenMetasOut(BaseModel):
    metas: List[MetaAhorroOut]
    total_ahorrado: float
    saldo_contable: float
    fondos_reservados: float
    saldo_disponible_real: float

class EventoCreate(BaseModel):
    nombre: str
    propiedades: dict = {}

class EventoOut(BaseModel):
    id: int
    nombre: str
    propiedades: dict
    fecha: datetime

    class Config:
        from_attributes = True