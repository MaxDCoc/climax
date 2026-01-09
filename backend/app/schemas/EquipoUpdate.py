from typing import Union, Literal, Optional
from app.schemas.ac import AC_Update
from app.schemas.heladera import Heladera_Update
from app.schemas.lavarropa import Lavarropas_Update

EquipoUpdate = Union[
    AC_Update,
    Heladera_Update,
    Lavarropas_Update
]