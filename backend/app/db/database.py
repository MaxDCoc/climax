from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import DATABASE_URL, SQL_ECHO

# Pool de conexiones persistentes hacia el pooler de Supabase (modo transaction):
# el backend es un proceso de larga vida (no serverless), así que reusar conexiones
# evita pagar un handshake TCP+TLS nuevo en cada request.
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=5,
    pool_recycle=300,
    pool_pre_ping=True,
    echo=SQL_ECHO,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
