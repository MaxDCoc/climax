from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class ClienteBase(BaseModel):
    nombre: str
    direccion: Optional[str] = None
    telefono: str
    observaciones: Optional[str] = None

class ClienteCreate(ClienteBase):
    pass

class ClienteResponse(ClienteBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
