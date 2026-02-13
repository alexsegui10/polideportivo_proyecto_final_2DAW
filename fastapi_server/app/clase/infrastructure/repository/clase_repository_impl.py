from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime, timedelta
from app.clase.domain.entity.clase import Clase
from app.clase.domain.repository.clase_repository import ClaseRepository


class ClaseRepositoryImpl(ClaseRepository):
    """Implementación del repositorio de clases con SQLAlchemy"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[Clase]:
        return self.db.query(Clase).filter(Clase.is_active == True).all()
    
    def count_entrenadores(self) -> int:
        """Contar entrenadores únicos en clases activas"""
        result = self.db.query(func.count(func.distinct(Clase.entrenador_id))).filter(
            Clase.is_active == True,
            Clase.entrenador_id.isnot(None)
        ).scalar()
        return result or 0
    
    def get_by_fecha(self, fecha: date) -> List[Clase]:
        """Obtener clases por fecha específica"""
        inicio_dia = datetime.combine(fecha, datetime.min.time())
        fin_dia = datetime.combine(fecha, datetime.max.time())
        
        return self.db.query(Clase).filter(
            Clase.is_active == True,
            Clase.fecha_hora_inicio >= inicio_dia,
            Clase.fecha_hora_inicio <= fin_dia
        ).all()
