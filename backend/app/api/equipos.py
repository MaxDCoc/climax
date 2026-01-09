from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Union

from app.db.dependencies import get_db
from app.models.cliente import Cliente
from app.models.ac import AireAcondicionado
from app.models.heladera import Heladera
from app.models.lavarropa import Lavarropas
from app.models.equipo import Equipo

from app.schemas.equipo import EquipoResponse
from app.schemas.EquipoCreate import EquipoCreate
from app.schemas.EquipoPolimorfResponse import EquipoPolimorficoResponse
from app.schemas.EquipoUpdate import EquipoUpdate

from app.schemas.ac import AC_Create, AC_Response, AC_Update
from app.schemas.heladera import Heladera_Create, Heladera_Response, Heladera_Update
from app.schemas.lavarropa import Lavarropa_Create, Lavarropa_Response, Lavarropas_Update

from typing import Union

router = APIRouter(
    prefix="/api/v1",
    tags=["Equipos"],
)


@router.post("/clientes/{cliente_id}/equipos", status_code=201)
def create_equipo(
    cliente_id: int,
    equipo: EquipoCreate,
    db: Session = Depends(get_db)
):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    nuevo_equipo = build_equipo(equipo, cliente_id)

    db.add(nuevo_equipo)
    db.commit()
    db.refresh(nuevo_equipo)

    return nuevo_equipo

def build_equipo(equipo, cliente_id: int):
    if equipo.tipo == "aire":
        return AireAcondicionado(
            cliente_id=cliente_id,
            marca=equipo.marca,
            modelo=equipo.modelo,
            frigorias=equipo.frigorias,
            tipo_aire=equipo.tipo_aire,
            fecha_instalacion=equipo.fecha_instalacion,
            fecha_ultimo_servi=equipo.fecha_ultimo_servi,
            observaciones=equipo.observaciones
        )

    elif equipo.tipo == "heladera":
        return Heladera(
            cliente_id=cliente_id,
            marca=equipo.marca,
            modelo=equipo.modelo,
            capac_litros=equipo.capac_litros,
            tipo_heladera=equipo.tipo_heladera,
            fecha_instalacion=equipo.fecha_instalacion,
            fecha_ultimo_servi=equipo.fecha_ultimo_servi,
            observaciones=equipo.observaciones
        )

    elif equipo.tipo == "lavarropas":
        return Lavarropas(
            cliente_id=cliente_id,
            marca=equipo.marca,
            modelo=equipo.modelo,
            capac_kilos=equipo.capac_kilos,
            tipo_lavarropas=equipo.tipo_lavarropas,
            fecha_instalacion=equipo.fecha_instalacion,
            fecha_ultimo_servi=equipo.fecha_ultimo_servi,
            observaciones=equipo.observaciones
        )

    else:
        raise ValueError(f"Tipo de equipo no soportado: {equipo.tipo}")

@router.get(
    "/clientes/{cliente_id}/equipos",
    response_model=list[EquipoPolimorficoResponse]
)
def listar_equipos(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    return cliente.equipos



@router.get(
    "/equipos/{equipo_id}",
    response_model=EquipoPolimorficoResponse
)
def obtener_equipo(equipo_id: int, db: Session = Depends(get_db)):
    equipo = db.query(Equipo).filter(Equipo.id == equipo_id).first()

    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    return equipo




@router.put("/{equipo_id}", response_model=EquipoResponse)
def actualizar_equipo(
    equipo_id: int,
    data: EquipoUpdate,
    db: Session = Depends(get_db)
):
    equipo = db.query(Equipo).filter(Equipo.id == equipo_id).first()

    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    for campo, valor in data.dict(exclude_unset=True).items():
        setattr(equipo, campo, valor)

    db.commit()
    db.refresh(equipo)
    return equipo



@router.delete(
    "/equipos/{equipo_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_equipo(equipo_id: int, db: Session = Depends(get_db)):
    equipo = db.query(Equipo).filter(Equipo.id == equipo_id).first()
    if not equipo:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    db.delete(equipo)
    db.commit()

