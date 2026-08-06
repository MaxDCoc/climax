from pydantic import BaseModel, ConfigDict
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
    model_config = ConfigDict(from_attributes=True)

    id: int
    equipo_id: int