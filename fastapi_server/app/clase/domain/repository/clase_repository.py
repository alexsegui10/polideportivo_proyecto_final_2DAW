from abc import ABC, abstractmethod
from typing import List, Optional
from datetime import date
from app.clase.domain.entity.clase import Clase


class ClaseRepository(ABC):
    """Interface del repositorio de clases"""
    
    @abstractmethod
    def get_all(self) -> List[Clase]:
        pass
    
    @abstractmethod
    def count_entrenadores(self) -> int:
        """Contar entrenadores únicos en clases activas"""
        pass
    
    @abstractmethod
    def get_by_fecha(self, fecha: date) -> List[Clase]:
        """Obtener clases por fecha"""
        pass
