"""
Script de Semilla (Seed) para Pruebas E2E - Tarea 6
Materia: Interaccion Hombre-Computador (IHC)
Estudiante: GUZMAN MONTALVAN MARCOS LEHONTI

Deja la base de datos en un estado conocido y limpio con el usuario de prueba documentado.
Comando: pnpm run seed
"""

import sys
import os
from datetime import date, datetime

# Forzar codificacion utf-8 si es necesario
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Permitir importar modulos locales del backend
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from database import engine, SessionLocal, Base
import models
from security import hash_password

USUARIO_TEST_EMAIL = "marcos@gmail.com"
USUARIO_TEST_PASSWORD = "123456"
USUARIO_TEST_NOMBRE = "Marcos Lehonti"

def sembrar_base_de_datos():
    print("[*] Iniciando proceso de siembra de datos (Seed)...")
    
    # 1. Asegurar que las tablas existan
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 2. Asegurar categorias iniciales
        for nombre, tipo, icono in models.CATEGORIAS_INICIALES:
            cat = db.query(models.Categoria).filter_by(nombre=nombre).first()
            if not cat:
                db.add(models.Categoria(nombre=nombre, tipo=tipo, icono=icono))
        db.commit()

        # 3. Crear o reiniciar el usuario de prueba
        user = db.query(models.Usuario).filter_by(email=USUARIO_TEST_EMAIL).first()
        if not user:
            user = models.Usuario(
                nombre=USUARIO_TEST_NOMBRE,
                email=USUARIO_TEST_EMAIL,
                password_hash=hash_password(USUARIO_TEST_PASSWORD),
                limite_mensual=500.00
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"  [+] Usuario creado: {USUARIO_TEST_EMAIL}")
        else:
            user.password_hash = hash_password(USUARIO_TEST_PASSWORD)
            user.limite_mensual = 500.00
            db.commit()
            print(f"  [i] Usuario actualizado: {USUARIO_TEST_EMAIL}")

        # 4. Limpiar movimientos previos del usuario de prueba para garantizar repetibilidad
        db.query(models.Movimiento).filter_by(usuario_id=user.id).delete()
        if hasattr(models, 'PresupuestoCategoria'):
            db.query(models.PresupuestoCategoria).filter_by(usuario_id=user.id).delete()
        db.commit()

        # 5. Obtener categorias necesarias
        cat_beca = db.query(models.Categoria).filter_by(nombre="Beca Universitaria").first()
        cat_comida = db.query(models.Categoria).filter_by(nombre="Comida y Almuerzos").first()
        cat_transporte = db.query(models.Categoria).filter_by(nombre="Transporte y Pasajes").first()

        hoy = date.today()

        # 6. Insertar movimientos base conocidos
        movimientos_base = [
            models.Movimiento(
                usuario_id=user.id,
                categoria_id=cat_beca.id if cat_beca else None,
                monto=500.00,
                tipo="ingreso",
                descripcion="Deposito Beca Universitaria",
                fecha=hoy,
                estado="pagado"
            ),
            models.Movimiento(
                usuario_id=user.id,
                categoria_id=cat_comida.id if cat_comida else None,
                monto=35.00,
                tipo="gasto",
                descripcion="Almuerzo Universidad",
                fecha=hoy,
                estado="pagado"
            ),
            models.Movimiento(
                usuario_id=user.id,
                categoria_id=cat_transporte.id if cat_transporte else None,
                monto=20.00,
                tipo="gasto",
                descripcion="Tarjeta de transporte semanal",
                fecha=hoy,
                estado="pendiente"
            )
        ]

        db.add_all(movimientos_base)

        # 7. Presupuesto por categoria inicial (Comida: 150 Bs)
        if hasattr(models, 'PresupuestoCategoria') and cat_comida:
            mes_actual = hoy.strftime("%Y-%m")
            db.add(models.PresupuestoCategoria(
                usuario_id=user.id,
                categoria_id=cat_comida.id,
                monto_limite=150.00,
                mes=mes_actual
            ))

        db.commit()

        print("-----------------------------------------------------------------")
        print("[OK] Base de datos sembrada con exito.")
        print(f"Usuario de prueba:  {USUARIO_TEST_EMAIL}")
        print(f"Contrasena:         {USUARIO_TEST_PASSWORD}")
        print("Estado inicial cargado:")
        print("   - Ingresos:         500.00 Bs")
        print("   - Gastos del mes:   55.00 Bs (35.00 pagado + 20.00 pendiente)")
        print("   - Saldo disponible: 465.00 Bs")
        print("   - Limite mensual:   500.00 Bs")
        print("-----------------------------------------------------------------")

    except Exception as e:
        db.rollback()
        print(f"[!] Error al sembrar base de datos: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    sembrar_base_de_datos()
