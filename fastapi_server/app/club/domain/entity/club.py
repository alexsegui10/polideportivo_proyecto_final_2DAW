from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from datetime import datetime
from app.config.database import Base


class Club(Base):
    __tablename__ = "clubs"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(150), nullable=False, unique=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text)
    deporte = Column(String(100))
    imagen = Column(Text)
    entrenador_id = Column(Integer, ForeignKey('usuarios.id'))
    max_miembros = Column(Integer, nullable=False, default=20)
    nivel = Column(String(50))  # principiante, intermedio, avanzado
    precio_mensual = Column(Float, nullable=False)
    status = Column(String(50), nullable=False, default='activo')
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)

    def __repr__(self):
        return f"<Club(id={self.id}, nombre={self.nombre}, slug={self.slug})>"
