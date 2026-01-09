from .cliente import ClienteBase, ClienteCreate, ClienteResponse
from .equipo import EquipoBase, EquipoResponse
from .ac import AC_Create, AC_Response, AC_Update
from .heladera import Heladera_Create, Heladera_Response, Heladera_Update
from .lavarropa import Lavarropa_Create, Lavarropa_Response, Lavarropas_Update
from .servicio import ServicioBase, ServicioCreate, ServicioResponse
from typing import Union

EquipoCreate = Union[
    AC_Create,
    Heladera_Create,
    Lavarropa_Create
]

EquipoUpdate = Union[
    AC_Update,
    Heladera_Update,
    Lavarropas_Update
]