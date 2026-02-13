from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.config.database import Base


class Clase(Base):
    __tablename__ = "clases_publicas"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(150), nullable=False, unique=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text)
    imagen = Column(Text)
    entrenador_id = Column(Integer, ForeignKey('usuarios.id'))
    pista_id = Column(Integer, ForeignKey('pistas.id'))
    fecha_hora_inicio = Column(DateTime, nullable=False)
    fecha_hora_fin = Column(DateTime, nullable=False)
    duracion_minutos = Column(Integer, nullable=False)
    max_participantes = Column(Integer, nullable=False, default=15)
    precio = Column(Float, nullable=False, default=0.0)
    nivel = Column(String(50))  # principiante, intermedio, avanzado
    deporte = Column(String(100))
    status = Column(String(50), nullable=False, default='pendiente')
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)

    def __repr__(self):
        return f"<Clase(id={self.id}, nombre={self.nombre}, slug={self.slug})>"
