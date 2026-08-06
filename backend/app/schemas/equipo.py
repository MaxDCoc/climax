from pydantic import BaseModel, ConfigDict
from typing import Optional, Literal
from datetime import date

class EquipoBase(BaseModel):
    marca: str
    modelo: Optional[str] = None

    tipo: Literal["aire", "heladera", "lavarropas"]

    fecha_instalacion: Optional[date] = None
    fecha_ultimo_servi: Optional[date] = None
    observaciones: Optional[str] = None

class EquipoResponse(EquipoBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tipo: Literal["aire", "heladera", "lavarropas"]
    cliente_id: int