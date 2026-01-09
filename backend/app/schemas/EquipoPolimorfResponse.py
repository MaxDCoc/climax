from typing import Union
from app.schemas.ac import AC_Response
from app.schemas.heladera import Heladera_Response
from app.schemas.lavarropa import Lavarropa_Response

EquipoPolimorficoResponse = Union[
    AC_Response,
    Heladera_Response,
    Lavarropa_Response
]