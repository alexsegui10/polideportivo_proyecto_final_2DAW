from pydantic import BaseModel
from typing import Optional


class PistaResponse(BaseModel):
    id: int
    nombre: str
    tipo: str
    status: str
    is_active: bool
    slug: str
    precio_hora: float
    descripcion: Optional[str] = None
    imagen: Optional[str] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "nombre": "Pista Padel 1",
                "tipo": "padel",
                "status": "disponible",
                "is_active": True,
                "slug": "pista-padel-1",
                "precio_hora": 25.0,
                "descripcion": "Pista de pádel con cristal panorámico",
                "imagen": "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800"
            }
        }
