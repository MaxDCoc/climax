from datetime import date
from dateutil.relativedelta import relativedelta
from app.models.servicio import TipoServicioEnum

def calcular_fecha_proximo_servicio(fecha_serv: date, tipo_servicio: TipoServicioEnum) -> date:
    if tipo_servicio == TipoServicioEnum.INSTALACION:
        return fecha_serv + relativedelta(months=12)
    elif tipo_servicio == TipoServicioEnum.SERVICE:
        return fecha_serv + relativedelta(months=18)
    elif tipo_servicio == TipoServicioEnum.REPARACION:
        return fecha_serv + relativedelta(months=3)
    else:
        raise ValueError("Tipo de servicio desconocido")
