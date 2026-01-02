from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.db.database import Base

class Equipo(Base):
    __tablename__ = "equipos"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(20), nullable=False)
    marca = Column(String, nullable=False)
    modelo = Column(String, nullable=True)
    fecha_instalacion = Column(Date, nullable=True)
    fecha_ultimo_servi = Column(Date, nullable=True)
    observaciones = Column(String, nullable=True)

    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)

    cliente = relationship("Cliente", back_populates="equipos")
    servicios = relationship("Servicio", back_populates="equipo")

    __mapper_args__ = {
        "polymorphic_on": tipo,
        "polymorphic_identity": "equipo",
    }
