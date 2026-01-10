from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import date, timedelta

from app.db.dependencies import get_db
from app.models.servicio import Servicio
from app.models.equipo import Equipo
from app.schemas.servicio import ServicioCreate, ServicioResponse
from app.services.proxServ_logic import calcular_fecha_proximo_servicio

router = APIRouter(
    prefix="/api/v1",
    tags=["Servicios"]
)

@router.get("/servicios/oportunidades")
def oportunidades_servicio(
    dias: int = 30,
    db: Session = Depends(get_db)
):
    fecha_limite = date.today() + timedelta(days=dias)
    servicios_oportunidad = db.query(Servicio).filter(
        and_(
            Servicio.fecha_prox_serv != None,
            Servicio.fecha_prox_serv <= fecha_limite
        )
    ).all()
    return servicios_oportunidad

@router.post("/equipos/{equipo_id}/servicios", 
             response_model=ServicioResponse, 
             status_code=status.HTTP_201_CREATED
)
def crear_servicio(
    equipo_id: int,
    servicio: ServicioCreate,
    db: Session = Depends(get_db)
):
    equipo = db.query(Equipo).filter(Equipo.id == equipo_id).first()
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    nuevo_servicio = Servicio(
        tipo_servicio=servicio.tipo_servicio,
        fecha_serv=servicio.fecha_serv,
        observaciones=servicio.observaciones,
        fecha_prox_serv=calcular_fecha_proximo_servicio(servicio.fecha_serv, servicio.tipo_servicio),
        equipo_id=equipo_id
    )

    db.add(nuevo_servicio)
    db.commit()
    db.refresh(nuevo_servicio)

    return nuevo_servicio

@router.get("/equipos/{equipo_id}/servicios", 
            response_model=list[ServicioResponse])
def listar_servicios_equipo(
    equipo_id: int,
    db: Session = Depends(get_db)
):
    equipo = db.query(Equipo).filter(Equipo.id == equipo_id).first()
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    servicios = db.query(Servicio).filter(Servicio.equipo_id == equipo_id).all()
    return servicios

@router.get("/servicios/{servicio_id}", 
            response_model=ServicioResponse)
def obtener_servicio(
    servicio_id: int,
    db: Session = Depends(get_db)
):
    servicio = db.query(Servicio).filter(Servicio.id == servicio_id).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return servicio

@router.delete("/servicios/{servicio_id}", 
               status_code=status.HTTP_204_NO_CONTENT)
def eliminar_servicio(
    servicio_id: int,
    db: Session = Depends(get_db)
):
    servicio = db.query(Servicio).filter(Servicio.id == servicio_id).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")

    db.delete(servicio)
    db.commit()
    return

@router.put("/servicios/{servicio_id}", 
            response_model=ServicioResponse)
def actualizar_servicio(
    servicio_id: int,
    servicio_actualizado: ServicioCreate,
    db: Session = Depends(get_db)
):
    servicio = db.query(Servicio).filter(Servicio.id == servicio_id).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")

    servicio.tipo_servicio = servicio_actualizado.tipo_servicio
    servicio.fecha_serv = servicio_actualizado.fecha_serv
    servicio.observaciones = servicio_actualizado.observaciones
    servicio.fecha_prox_serv = servicio_actualizado.fecha_prox_serv

    db.commit()
    db.refresh(servicio)

    return servicio