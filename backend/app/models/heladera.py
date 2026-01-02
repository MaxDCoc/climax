from sqlalchemy import Column, Integer, String, ForeignKey
from app.models.equipo import Equipo

class Heladera(Equipo):
    __tablename__ = "heladeras"

    id = Column(Integer, ForeignKey("equipos.id"), primary_key=True)

    capac_litros = Column(Integer, nullable=False)
    tipo_heladera = Column(String, nullable=True)

    __mapper_args__ = {
        "polymorphic_identity": "heladera",
    }
