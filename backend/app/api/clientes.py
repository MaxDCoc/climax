from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate, ClienteResponse

router = APIRouter(
    prefix="/api/v1/clientes",
    tags=["Clientes"],
)

@router.post(
    "",
    response_model= ClienteResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_cliente(
    cliente: ClienteCreate,
    db: Session = Depends(get_db),
):
    nuevo_cliente = Cliente(**cliente.dict())
    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    return nuevo_cliente

@router.get(
    "",
    response_model=list[ClienteResponse]
)
def listar_clientes(
    db: Session = Depends(get_db)
    ):
    clientes = db.query(Cliente).all()
    return clientes

@router.get(
    "/{cliente_id}",
    response_model=ClienteResponse
)
def obtener_cliente(
    cliente_id: int,
    db: Session = Depends(get_db),
):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Cliente no encontrado"
        )
    return cliente

@router.put(
    "/{cliente_id}",
    response_model=ClienteResponse
)
def actualizar_cliente(
    cliente_id: int,
    cliente: ClienteCreate,
    db: Session = Depends(get_db),
):
    cliente_actualizado = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente_actualizado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Cliente no encontrado"
        )
    for key, value in cliente.dict().items():
        setattr(cliente_actualizado, key, value)
    db.commit()
    db.refresh(cliente_actualizado)
    return cliente_actualizado

@router.delete(
    "/{cliente_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_cliente(
    cliente_id: int,
    db: Session = Depends(get_db),
):
    cliente_eliminado = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente_eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Cliente no encontrado"
        )
    db.delete(cliente_eliminado)
    db.commit()
    return
