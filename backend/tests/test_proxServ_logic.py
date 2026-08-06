from datetime import date

import pytest

from app.models.servicio import TipoServicioEnum
from app.services.proxServ_logic import calcular_fecha_proximo_servicio


@pytest.mark.parametrize(
    "tipo,meses",
    [
        (TipoServicioEnum.INSTALACION, 12),
        (TipoServicioEnum.SERVICE, 18),
        (TipoServicioEnum.REPARACION, 3),
    ],
)
def test_calcula_fecha_prox_servicio_por_tipo(tipo, meses):
    fecha_serv = date(2026, 1, 15)

    resultado = calcular_fecha_proximo_servicio(fecha_serv, tipo)

    mes_esperado = (fecha_serv.month - 1 + meses) % 12 + 1
    anio_esperado = fecha_serv.year + (fecha_serv.month - 1 + meses) // 12
    assert resultado == date(anio_esperado, mes_esperado, fecha_serv.day)
