from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.db.database import Base
from enum import Enum

class TipoServicioEnum(str, Enum):
    INSTALACION = "INSTALACION"
    SERVICE = "SERVICE"
    REPARACION = "REPARACION"

class Servicio(Base):
    __tablename__ = "servicios"

    id = Column(Integer, primary_key=True, index=True)
    tipo_servicio = Column(SQLEnum(TipoServicioEnum, native_enum=False), nullable=False)
    fecha_serv = Column(Date, nullable=False)
    observaciones = Column(String, nullable=True)
    fecha_prox_serv = Column(Date, nullable=True)

    equipo_id = Column(Integer, ForeignKey("equipos.id"), nullable=False)

    equipo = relationship("Equipo", back_populates="servicios")
