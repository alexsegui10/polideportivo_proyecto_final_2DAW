from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ClubResponse(BaseModel):
    id: int
    slug: str
    nombre: str
    descripcion: Optional[str] = None
    deporte: Optional[str] = None
    imagen: Optional[str] = None
    entrenador_id: Optional[int] = None
    max_miembros: int
    nivel: Optional[str] = None
    precio_mensual: float
    status: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    num_miembros: int

    class Config:
        from_attributes = True
