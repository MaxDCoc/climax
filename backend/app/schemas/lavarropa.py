from typing import Optional, Literal
from app.schemas.equipo import EquipoBase
from pydantic import BaseModel, ConfigDict

class Lavarropa_Create(EquipoBase):
    capac_kilos: int

    tipo: Literal["lavarropas"]

    tipo_lavarropas: Optional[str] = None

class Lavarropa_Response(Lavarropa_Create):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tipo: str
    cliente_id: int

class Lavarropas_Update(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    capac_kilos: Optional[int] = None
    tipo_lavarropas: Optional[str] = None