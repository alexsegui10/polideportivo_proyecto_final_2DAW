from pydantic import BaseModel, Field
from typing import Optional


class CreatePistaRequest(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100)
    tipo: str = Field(..., min_length=1, max_length=50)
    status: str = Field(default="disponible", max_length=20)
    is_active: bool = True
    slug: str = Field(..., min_length=1, max_length=150)
    precio_hora: float = Field(..., gt=0)
    descripcion: Optional[str] = Field(None, max_length=500)
    imagen: Optional[str] = Field(None, max_length=500)

    class Config:
        json_schema_extra = {
            "example": {
                "nombre": "Pista Padel 3",
                "tipo": "padel",
                "status": "disponible",
                "is_active": True,
                "slug": "pista-padel-3",
                "precio_hora": 25.0,
                "descripcion": "Nueva pista de pádel",
                "imagen": "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"
            }
        }
