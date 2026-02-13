from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.club.presentation.schemas.response.club_response import ClubResponse
from app.club.application.service.club_service import ClubService
from app.club.infrastructure.repository.club_repository_impl import ClubRepositoryImpl

router = APIRouter(
    prefix="/api/clubs",
    tags=["Clubs"]
)


@router.get("/", response_model=List[ClubResponse], status_code=status.HTTP_200_OK)
async def get_all_clubs(db: Session = Depends(get_db)):
    """
    Obtener todos los clubs con número de miembros
    """
    repository = ClubRepositoryImpl(db)
    service = ClubService(repository)
    clubs_dto = service.get_all_clubs()
    
    return [ClubResponse.model_validate(dto) for dto in clubs_dto]


@router.get("/stats", status_code=status.HTTP_200_OK)
async def get_clubs_stats(db: Session = Depends(get_db)):
    """
    Obtener estadísticas de clubs - total
    """
    repository = ClubRepositoryImpl(db)
    service = ClubService(repository)
    total = service.get_stats()
    
    return {"total": total}
