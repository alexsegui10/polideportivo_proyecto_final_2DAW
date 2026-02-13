from abc import ABC, abstractmethod
from typing import List
from app.club.domain.entity.club import Club


class ClubRepository(ABC):
    """Interface del repositorio de clubs"""
    
    @abstractmethod
    def get_all(self) -> List[Club]:
        pass
    
    @abstractmethod
    def count_all(self) -> int:
        """Contar total de clubs activos"""
        pass
    
    @abstractmethod
    def count_miembros(self, club_id: int) -> int:
        """Contar miembros de un club específico"""
        pass
