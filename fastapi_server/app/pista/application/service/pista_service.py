from typing import List, Optional
from app.pista.domain.repository.pista_repository import PistaRepository
from app.pista.domain.dto.pista_dto import PistaDTO
from app.pista.domain.entity.pista import Pista
from app.pista.infrastructure.mapper.pista_mapper import PistaMapper


class PistaService:
    
    def __init__(self, repository: PistaRepository):
        self.repository = repository
    
    def get_all_pistas(self) -> List[PistaDTO]:
        """Obtener todas las pistas"""
        pistas = self.repository.get_all()
        return [PistaMapper.entity_to_dto(pista) for pista in pistas]
    
    """ def get_pista_by_id(self, pista_id: int) -> Optional[PistaDTO]:
        pista = self.repository.get_by_id(pista_id)
        if pista:
            return PistaMapper.entity_to_dto(pista)
        return None
    
    def create_pista(self, pista: Pista) -> PistaDTO:
        nueva_pista = self.repository.create(pista)
        return PistaMapper.entity_to_dto(nueva_pista) """
