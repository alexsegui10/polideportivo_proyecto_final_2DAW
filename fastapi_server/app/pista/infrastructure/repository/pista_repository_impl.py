from typing import List, Optional
from sqlalchemy.orm import Session
from app.pista.domain.entity.pista import Pista
from app.pista.domain.repository.pista_repository import PistaRepository


class PistaRepositoryImpl(PistaRepository):
    """Implementación del repositorio de pistas con SQLAlchemy"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[Pista]:
        return self.db.query(Pista).all()
    
    def count_all(self) -> int:
        """Contar total de pistas"""
        return self.db.query(Pista).count()
    
    def get_destacadas(self, limit: int = 6) -> List[Pista]:
        """Obtener pistas destacadas - todas las activas"""
        return self.db.query(Pista).filter(Pista.is_active == True).limit(limit).all()
"""     
    def get_by_id(self, pista_id: int) -> Optional[Pista]:
        return self.db.query(Pista).filter(Pista.id == pista_id).first()
    
    def create(self, pista: Pista) -> Pista:
        self.db.add(pista)
        self.db.commit()
        self.db.refresh(pista)
        return pista """
