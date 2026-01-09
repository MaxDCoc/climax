from pydantic import BaseModel
from typing import Optional
from datetime import date
from app.models.servicio import TipoServicioEnum

class ServicioBase(BaseModel):
    tipo_servicio: TipoServicioEnum
    fecha_serv: date
    observaciones: Optional[str] = None
    fecha_prox_serv: Optional[date] = None

class ServicioCreate(ServicioBase):
    pass

class ServicioResponse(ServicioBase):
    id: int
    equipo_id: int

    class Config:
        orm_mode = True