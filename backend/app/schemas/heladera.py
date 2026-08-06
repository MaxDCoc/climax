from typing import Optional, Literal
from app.schemas.equipo import EquipoBase
from pydantic import BaseModel, ConfigDict


class Heladera_Create(EquipoBase):
    capac_litros: int

    tipo: Literal["heladera"]

    tipo_heladera: Optional[str] = None

class Heladera_Response(Heladera_Create):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tipo: str
    cliente_id: int

class Heladera_Update(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    capac_litros: Optional[int] = None
    tipo_heladera: Optional[str] = None