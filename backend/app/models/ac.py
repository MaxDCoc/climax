from sqlalchemy import Column, Integer, String, ForeignKey
from app.models.equipo import Equipo

class AireAcondicionado(Equipo):
    __tablename__ = "aires_acondicionados"

    id = Column(Integer, ForeignKey("equipos.id"), primary_key=True)

    frigorias = Column(Integer, nullable=False)
    tipo_aire = Column(String, nullable=True)

    __mapper_args__ = {
        "polymorphic_identity": "aire acondicionado",
    }
