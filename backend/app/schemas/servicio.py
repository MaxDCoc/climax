from pydantic import BaseModel
from typing import Optional
from datetime import date

class ServicioBase(BaseModel):
    tipo_servicio: str
    fecha_servicio: date
    observaciones: Optional[str] = None
    proximo_servicio: date

class ServicioCreate(ServicioBase):
    pass

class ServicioResponse(ServicioBase):
    id: int
    equipo_id: int

    class Config:
        orm_mode = True