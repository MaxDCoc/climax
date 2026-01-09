from typing import Optional, Literal
from app.schemas.equipo import EquipoBase
from pydantic import BaseModel

class Lavarropa_Create(EquipoBase):
    capac_kilos: int

    tipo: Literal["lavarropas"]

    tipo_lavarropas: Optional[str] = None

class Lavarropa_Response(Lavarropa_Create):
    id: int
    tipo: str
    cliente_id: int

    class Config:
        orm_mode = True

class Lavarropas_Update(BaseModel):
    marca: Optional[str]
    modelo: Optional[str]
    capac_kilos: Optional[int]
    tipo_lavarropas: Optional[str]