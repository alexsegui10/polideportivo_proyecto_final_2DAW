from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ClaseResponse(BaseModel):
    id: int
    slug: str
    nombre: str
    descripcion: Optional[str] = None
    imagen: Optional[str] = None
    entrenador_id: Optional[int] = None
    entrenador: Optional[str] = None  # Nombre del entrenador
    entrenador_nombre: Optional[str] = None  # Alias
    pista_id: Optional[int] = None
    fecha_hora_inicio: datetime
    fecha_hora_fin: datetime
    duracion_minutos: int
    max_participantes: int
    precio: float
    nivel: Optional[str] = None
    deporte: Optional[str] = None
    status: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
