from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ClaseDTO(BaseModel):
    id: int
    slug: str
    nombre: str
    descripcion: Optional[str] = None
    imagen: Optional[str] = None
    entrenador_id: Optional[int] = None
    pista_id: Optional[int] = None
    fecha_hora_inicio: datetime
    fecha_hora_fin: datetime
    duracion_minutos: int
    max_participantes: int = 15
    precio: float = 0.0
    nivel: Optional[str] = None
    deporte: Optional[str] = None
    status: str = "pendiente"
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "slug": "yoga-matutino-principiante",
                "nombre": "Yoga Matutino",
                "descripcion": "Clase de yoga para principiantes",
                "imagen": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
                "entrenador_id": 5,
                "pista_id": 2,
                "fecha_hora_inicio": "2024-01-20T08:00:00",
                "fecha_hora_fin": "2024-01-20T09:30:00",
                "duracion_minutos": 90,
                "max_participantes": 15,
                "precio": 15.0,
                "nivel": "principiante",
                "deporte": "yoga",
                "status": "confirmado",
                "is_active": True,
                "created_at": "2024-01-15T10:00:00",
                "updated_at": "2024-01-15T10:00:00"
            }
        }
