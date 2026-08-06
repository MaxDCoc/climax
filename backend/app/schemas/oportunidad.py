from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

from app.models.servicio import TipoServicioEnum


class ClienteMini(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    telefono: str


class EquipoMini(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tipo: str
    marca: str
    modelo: Optional[str] = None


class OportunidadResponse(BaseModel):
    servicio_id: int
    tipo_servicio: TipoServicioEnum
    fecha_proximo_servicio: date
    cliente: ClienteMini
    equipo: EquipoMini
