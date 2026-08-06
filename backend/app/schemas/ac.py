from typing import Optional, Literal
from app.schemas.equipo import EquipoBase
from pydantic import BaseModel, ConfigDict

class AC_Create(EquipoBase):
    frigorias: int

    tipo: Literal["aire"]

    tipo_aire: Optional[str] = None

class AC_Response(AC_Create):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tipo: str
    cliente_id: int

class AC_Update(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    frigorias: Optional[int] = None
    tipo_aire: Optional[str] = None