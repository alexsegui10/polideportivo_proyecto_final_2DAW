from sqlalchemy import Column, Integer, String, Float, Boolean
from app.config.database import Base


class Pista(Base):
    __tablename__ = "pistas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    tipo = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False, default='disponible')
    is_active = Column(Boolean, default=True)
    slug = Column(String(150), nullable=False, unique=True)
    precio_hora = Column(Float, nullable=False)
    descripcion = Column(String(500))
    imagen = Column(String(500))

    def __repr__(self):
        return f"<Pista(id={self.id}, nombre={self.nombre}, slug={self.slug})>"
