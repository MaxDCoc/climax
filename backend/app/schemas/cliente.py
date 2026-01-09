from pydantic import BaseModel
from typing import List, Optional

class ClienteBase(BaseModel):
    nombre: str
    direccion: str
    telefono: str
    observaciones: Optional[str] = None

class ClienteCreate(ClienteBase):
    pass

class ClienteResponse(ClienteBase):
    id: int

    class Config:
        orm_mode = True
