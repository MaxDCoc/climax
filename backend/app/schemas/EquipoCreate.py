from typing import Union, Literal, Optional
from app.schemas.ac import AC_Create
from app.schemas.heladera import Heladera_Create
from app.schemas.lavarropa import Lavarropa_Create

EquipoCreate = Union[
    AC_Create,
    Heladera_Create,
    Lavarropa_Create
]