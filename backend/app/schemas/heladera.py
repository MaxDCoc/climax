from typing import Optional, Literal
from app.schemas.equipo import EquipoBase
from pydantic import BaseModel


class Heladera_Create(EquipoBase):
    capac_litros: int

    tipo: Literal["heladera"]

    tipo_heladera: Optional[str] = None

class Heladera_Response(Heladera_Create):
    id: int
    tipo: str
    cliente_id: int

    class Config:
        orm_mode = True

class Heladera_Update(BaseModel):
    marca: Optional[str]
    modelo: Optional[str]
    capac_litros: Optional[int]
    tipo_heladera: Optional[str]