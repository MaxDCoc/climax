from sqlalchemy import Column, Integer, String, ForeignKey
from app.models.equipo import Equipo

class Lavarropas(Equipo):
    __tablename__ = "lavarropas"

    id = Column(Integer, ForeignKey("equipos.id"), primary_key=True)

    capac_kilos = Column(Integer, nullable=False)
    tipo_lavarropas = Column(String, nullable=True)

    __mapper_args__ = {
        "polymorphic_identity": "lavarropas",
    }
