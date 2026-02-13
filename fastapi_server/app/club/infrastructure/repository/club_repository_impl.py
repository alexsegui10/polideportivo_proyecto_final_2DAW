from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.club.domain.entity.club import Club
from app.club.domain.repository.club_repository import ClubRepository


class ClubRepositoryImpl(ClubRepository):
    """Implementación del repositorio de clubs con SQLAlchemy"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[Club]:
        return self.db.query(Club).filter(Club.is_active == True).all()
    
    def count_all(self) -> int:
        """Contar clubs activos"""
        return self.db.query(Club).filter(Club.is_active == True).count()
    
    def count_miembros(self, club_id: int) -> int:
        """Contar miembros de un club - para futuro con tabla club_miembros"""
        # Por ahora retorna 0, cuando se cree la tabla club_miembros se implementará
        return 0
