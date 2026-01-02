from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Servicio(Base):
    __tablename__ = "servicios"

    id = Column(Integer, primary_key=True, index=True)
    tipo_servicio = Column(String, nullable=False)
    fecha_serv = Column(Date, nullable=False)
    observaciones = Column(String, nullable=True)
    fecha_prox_serv = Column(Date, nullable=False)

    equipo_id = Column(Integer, ForeignKey("equipos.id"), nullable=False)

    equipo = relationship("Equipo", back_populates="servicios")
