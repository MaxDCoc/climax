from typing import Optional, Literal
from app.schemas.equipo import EquipoBase
from pydantic import BaseModel

class AC_Create(EquipoBase):
    frigorias: int
    
    tipo: Literal["aire"]

    tipo_aire: Optional[str] = None

class AC_Response(AC_Create):
    id: int
    tipo: str
    cliente_id: int

    class Config:
        orm_mode = True

class AC_Update(BaseModel):
    marca: Optional[str]
    modelo: Optional[str]
    frigorias: Optional[int]
    tipo_aire: Optional[str]