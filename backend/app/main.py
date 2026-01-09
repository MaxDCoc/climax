from fastapi import FastAPI
from app.api import clientes, equipos
from app.db.database import engine, Base
from app.models import cliente, equipo, servicio

app = FastAPI(title="Sistema de Refrigeración")
app.include_router(clientes.router)
app.include_router(equipos.router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def health_check():
    return {"status": "ok"}
