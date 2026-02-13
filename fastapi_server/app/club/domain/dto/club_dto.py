from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ClubDTO(BaseModel):
    id: int
    slug: str
    nombre: str
    descripcion: Optional[str] = None
    deporte: Optional[str] = None
    imagen: Optional[str] = None
    entrenador_id: Optional[int] = None
    max_miembros: int = 20
    nivel: Optional[str] = None
    precio_mensual: float
    status: str = "activo"
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    num_miembros: int = 0  # Campo calculado, no está en la entidad

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "slug": "runners-club",
                "nombre": "Marathon Runners",
                "descripcion": "Club de corredores de maratón",
                "deporte": "running",
                "imagen": "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
                "entrenador_id": 3,
                "max_miembros": 20,
                "nivel": "avanzado",
                "precio_mensual": 45.0,
                "status": "activo",
                "is_active": True,
                "created_at": "2024-01-10T10:00:00",
                "updated_at": "2024-01-10T10:00:00",
                "num_miembros": 12
            }
        }
