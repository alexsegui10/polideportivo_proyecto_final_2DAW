from abc import ABC, abstractmethod
from typing import List, Optional
from app.pista.domain.entity.pista import Pista


class PistaRepository(ABC):
    """Interfaz del repositorio de pistas (patrón Repository)"""
    
    @abstractmethod
    def get_all(self) -> List[Pista]:
        """Obtener todas las pistas"""
        pass
    
"""     @abstractmethod
    def get_by_id(self, pista_id: int) -> Optional[Pista]:
        pass
    
    @abstractmethod
    def create(self, pista: Pista) -> Pista:
        pass
 """