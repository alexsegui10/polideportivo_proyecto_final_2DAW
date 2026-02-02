# Arquitectura Clean - FastAPI

## Estructura del Proyecto

```
fastapi_server/
└── app/
    ├── pista/                             # Módulo de Pistas
    │   ├── presentation/                  # Capa de Presentación
    │   │   ├── router/                   # Routers FastAPI (@router)
    │   │   │   └── pista_router.py
    │   │   └── schemas/                  # Schemas Pydantic
    │   │       ├── request/              # Schemas de entrada
    │   │       │   ├── __init__.py
    │   │       │   ├── create_pista_request.py
    │   │       │   └── update_pista_request.py
    │   │       └── response/             # Schemas de salida
    │   │           ├── __init__.py
    │   │           └── pista_response.py
    │   ├── application/                   # Capa de Aplicación
    │   │   └── service/                  # Servicios (casos de uso)
    │   │       ├── __init__.py
    │   │       └── pista_service.py
    │   ├── domain/                        # Capa de Dominio
    │   │   ├── entity/                   # Entidades del dominio
    │   │   │   ├── __init__.py
    │   │   │   └── pista.py             # Modelo SQLAlchemy
    │   │   ├── repository/               # Interfaces de repositorio (ABC)
    │   │   │   ├── __init__.py
    │   │   │   └── pista_repository.py
    │   │   └── dto/                      # DTOs de dominio
    │   │       ├── __init__.py
    │   │       └── pista_dto.py
    │   └── infrastructure/                # Capa de Infraestructura
    │       ├── repository/               # Implementaciones SQLAlchemy
    │       │   ├── __init__.py
    │       │   └── pista_repository_impl.py
    │       └── mapper/                   # Mapeadores Entity <-> DTO
    │           ├── __init__.py
    │           └── pista_mapper.py
    ├── utils/                             # Utilidades compartidas
    │   ├── jwt/                          # Utilidades JWT
    │   │   ├── __init__.py
    │   │   ├── jwt_handler.py
    │   │   └── jwt_bearer.py
    │   ├── exception/                    # Excepciones personalizadas
    │   │   ├── __init__.py
    │   │   ├── custom_exceptions.py
    │   │   └── exception_handler.py
    │   └── validation/                   # Validaciones compartidas
    │       ├── __init__.py
    │       └── validators.py
    └── config/                            # Configuraciones globales
        ├── __init__.py
        ├── database.py                   # Conexión PostgreSQL
        ├── settings.py                   # Variables de entorno
        └── cors.py                       # Configuración CORS
```

## Descripción de Capas

### 📌 Presentation (Capa de Presentación)
- **Router**: Endpoints REST con FastAPI (@router)
- **Schemas/Request**: Pydantic schemas para validar entrada
- **Schemas/Response**: Pydantic schemas para respuestas

### 🔧 Application (Capa de Aplicación)
- **Service**: Lógica de negocio y casos de uso
- Orquesta las operaciones del dominio
- No conoce detalles de infraestructura

### 💎 Domain (Capa de Dominio)
- **Entity**: Modelos SQLAlchemy (Base)
- **Repository**: Interfaces abstractas (ABC) de repositorio
- **DTO**: DTOs de dominio para transferencia entre capas
- Núcleo de la aplicación, sin dependencias externas

### 🏗️ Infrastructure (Capa de Infraestructura)
- **Repository**: Implementaciones SQLAlchemy de los repositorios
- **Mapper**: Conversión entre Entity y DTOs
- Detalles técnicos y frameworks

### 🛠️ Utils (Utilidades)
- **JWT**: Generación y validación de tokens JWT
- **Exception**: Excepciones personalizadas y handlers globales
- **Validation**: Validadores compartidos (Pydantic)

### ⚙️ Config (Configuración)
- **database.py**: Configuración de PostgreSQL con SQLAlchemy
- **settings.py**: Variables de entorno (BaseSettings)
- **cors.py**: Configuración de CORS

## Flujo de Datos

```
Cliente → Router → Service → Repository ABC → Repository Impl → DB
   ↓         ↓         ↓            ↓               ↓
Request → Response ← DTO ← Entity ← SQLAlchemy ← PostgreSQL
Schema    Schema
```

## Dependencias entre Capas

```
Presentation → Application → Domain ← Infrastructure
     ↓              ↓           ↑
   Utils ←────────────────────────┘
```

## Ejemplo de Archivos

### `pista_router.py` (Presentation)
```python
from fastapi import APIRouter, Depends
from app.pista.presentation.schemas.request import CreatePistaRequest
from app.pista.presentation.schemas.response import PistaResponse
from app.pista.application.service import PistaService

router = APIRouter(prefix="/api/pistas", tags=["Pistas"])

@router.post("/", response_model=PistaResponse)
async def create_pista(request: CreatePistaRequest, service: PistaService = Depends()):
    return await service.create(request)
```

### `pista.py` (Domain Entity)
```python
from sqlalchemy import Column, Integer, String, Float, Boolean
from app.config.database import Base

class Pista(Base):
    __tablename__ = "pistas"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    deporte = Column(String(50), nullable=False)
    precio_hora = Column(Float, nullable=False)
    disponible = Column(Boolean, default=True)
```

### `pista_repository.py` (Domain Repository Interface)
```python
from abc import ABC, abstractmethod
from typing import List, Optional
from app.pista.domain.entity import Pista

class PistaRepository(ABC):
    @abstractmethod
    async def create(self, pista: Pista) -> Pista:
        pass
    
    @abstractmethod
    async def find_all(self) -> List[Pista]:
        pass
```

## Próximos Módulos a Implementar

- [ ] `user/` - Gestión de usuarios
- [ ] `deporte/` - Gestión de tipos de deportes
- [ ] `reserva/` - Gestión de reservas
- [ ] `auth/` - Autenticación y autorización

## Tecnologías

- **Framework**: FastAPI 0.115+
- **Base de Datos**: PostgreSQL
- **ORM**: SQLAlchemy 2.0
- **Validación**: Pydantic 2.10
- **Seguridad**: JWT (PyJWT)
- **Gestión de dependencias**: pip / poetry

## Archivos __init__.py

Todos los directorios Python deben tener `__init__.py` para ser reconocidos como paquetes.
