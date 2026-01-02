from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    direccion = Column(String, index=True, nullable=False)
    telefono = Column(String, nullable=False)
    observaciones = Column(String, nullable=True)
    
    equipos = relationship("Equipo", back_populates="cliente")
