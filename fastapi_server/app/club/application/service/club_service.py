from typing import List
from app.club.domain.repository.club_repository import ClubRepository
from app.club.domain.dto.club_dto import ClubDTO
from app.club.infrastructure.mapper.club_mapper import ClubMapper


class ClubService:
    
    def __init__(self, repository: ClubRepository):
        self.repository = repository
    
    def get_all_clubs(self) -> List[ClubDTO]:
        """Obtener todos los clubs con número de miembros"""
        clubs = self.repository.get_all()
        clubs_dto = []
        for club in clubs:
            num_miembros = self.repository.count_miembros(club.id)
            clubs_dto.append(ClubMapper.entity_to_dto(club, num_miembros))
        return clubs_dto
    
    def get_stats(self) -> int:
        """Obtener estadísticas - total de clubs"""
        return self.repository.count_all()
