from typing import List
from datetime import date, timedelta
from app.clase.domain.repository.clase_repository import ClaseRepository
from app.clase.domain.dto.clase_dto import ClaseDTO
from app.clase.infrastructure.mapper.clase_mapper import ClaseMapper


class ClaseService:
    
    def __init__(self, repository: ClaseRepository):
        self.repository = repository
    
    def get_all_clases(self) -> List[ClaseDTO]:
        """Obtener todas las clases"""
        clases = self.repository.get_all()
        return [ClaseMapper.entity_to_dto(clase) for clase in clases]
    
    def get_stats(self) -> int:
        """Obtener estadísticas - total de entrenadores"""
        return self.repository.count_entrenadores()
    
    def get_clases_hoy(self) -> List[ClaseDTO]:
        """Obtener clases de hoy"""
        hoy = date.today()
        clases = self.repository.get_by_fecha(hoy)
        return [ClaseMapper.entity_to_dto(clase) for clase in clases]
    
    def get_clases_manana(self) -> List[ClaseDTO]:
        """Obtener clases de mañana"""
        manana = date.today() + timedelta(days=1)
        clases = self.repository.get_by_fecha(manana)
        return [ClaseMapper.entity_to_dto(clase) for clase in clases]
