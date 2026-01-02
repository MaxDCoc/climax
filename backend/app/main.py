from fastapi import FastAPI
from app.db.database import engine, Base
from app.models import cliente, equipo, servicio

app = FastAPI(title="Sistema de Refrigeración")

Base.metadata.create_all(bind=engine)

@app.get("/")
def health_check():
    return {"status": "ok"}
