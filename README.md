# Climax

Sistema de gestión para un técnico de refrigeración independiente: clientes, equipos instalados, historial de servicios y detección de oportunidades de mantenimiento (RF1-RF6 en [contexto.md](contexto.md)).

## Arquitectura

- **Backend**: FastAPI + SQLAlchemy (`backend/`). Modelos polimórficos por tabla (`Equipo` → `AireAcondicionado` / `Heladera` / `Lavarropas`), migraciones con Alembic.
- **Base de datos y autenticación**: Supabase. Postgres gestionado (accedido vía SQLAlchemy) + Supabase Auth para el login del único usuario técnico.
- **Frontend**: React + Vite + TypeScript + Tailwind CSS, mobile-first, con PWA (`frontend/`).
- **Auth**: el frontend inicia sesión contra Supabase Auth (`@supabase/supabase-js`) y adjunta el JWT de sesión a cada request; el backend lo valida contra el JWKS público de Supabase (`PyJWT` + `PyJWKClient`), sin secretos compartidos.

## Setup local

### 1. Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com) (elegir la región más cercana a donde se use la app).
2. En **Authentication → Users → Add user**, crear el usuario técnico (email + password, marcado como confirmado).
3. En **Authentication → Settings**, desactivar "Enable sign ups" (no hay pantalla de registro en la app).
4. Copiar de **Settings → Database → Connection string → Transaction pooler** la cadena de conexión (puerto `6543`).
5. Copiar de **Settings → API** la `Project URL` y la `anon public key`.

### 2. Backend

```bash
cd backend
python -m venv ../venv        # si no existe
../venv/Scripts/activate       # Windows; en Unix: source ../venv/bin/activate
pip install -r requirements.txt
cp .env.example .env           # completar con los datos de Supabase
alembic upgrade head
uvicorn app.main:app --reload
```

Variables de entorno (`backend/.env`, ver `.env.example`):

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Connection string del pooler de Supabase (modo *Transaction*, puerto 6543) |
| `SUPABASE_URL` | Project URL de Supabase |
| `SUPABASE_JWT_AUD` | Audience esperado en el JWT (`authenticated`) |
| `ENVIRONMENT` | `development` o `production` (controla CORS) |
| `SQL_ECHO` | `true` para loguear SQL (solo debug) |
| `FRONTEND_URL` | URL del frontend, usada como origen CORS permitido en producción |

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env    # completar con los datos de Supabase y la URL del backend
npm run dev
```

Variables de entorno (`frontend/.env`, ver `.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`.

### Docker (solo backend)

```bash
cd backend
docker compose up --build
```

Requiere `backend/.env` ya configurado. La base de datos es siempre Supabase (no hay Postgres local en el compose).

## Tests

```bash
cd backend
pytest
```

Corren contra SQLite en memoria (sin tocar Supabase) y sin necesitar red: la autenticación se sobreescribe con un usuario fake vía `app.dependency_overrides`.

## Deploy

- **Backend → Render**: conectar el repo (usa `backend/Dockerfile`, hay un `render.yaml` de referencia en la raíz), configurar las mismas variables de entorno que en local con `ENVIRONMENT=production` y `FRONTEND_URL` apuntando al dominio de Vercel. El contenedor corre `alembic upgrade head` antes de levantar la API. Railway es intercambiable (mismo Dockerfile).
- **Frontend → Vercel**: conectar el repo, configurar **Root Directory = `frontend`**, y cargar `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL` (apuntando al dominio de Render) como variables de entorno. Deploy automático en cada push a `main`.
- **CI**: `.github/workflows/backend-tests.yml` corre la suite de pytest en cada push/PR que toque `backend/`.

## Limitaciones conocidas

- Un solo usuario técnico, sin roles ni multi-tenant (por diseño, ver RNF5).
- Sin soporte offline real: RNF2 se cubre con estados de error + reintento manual, no con sincronización offline-first.
- El contacto por WhatsApp (RF5) usa un link `wa.me`, no la API de WhatsApp Business.
