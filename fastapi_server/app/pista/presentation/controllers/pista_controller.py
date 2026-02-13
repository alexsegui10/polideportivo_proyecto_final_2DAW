from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.pista.presentation.schemas.response.pista_response import PistaResponse
from app.pista.presentation.schemas.request.pista_request import CreatePistaRequest
from app.pista.application.service.pista_service import PistaService
from app.pista.infrastructure.repository.pista_repository_impl import PistaRepositoryImpl
from app.pista.infrastructure.mapper.pista_mapper import PistaMapper

router = APIRouter(
    prefix="/api/pistas",
    tags=["Pistas"]
)


@router.get("/", response_model=List[PistaResponse], status_code=status.HTTP_200_OK)
async def get_all_pistas(db: Session = Depends(get_db)):
    """
    Obtener todas las pistas disponibles
    """
    repository = PistaRepositoryImpl(db)
    service = PistaService(repository)
    pistas_dto = service.get_all_pistas()
    
    # Convertir DTOs a Response
    return [PistaResponse.model_validate(dto) for dto in pistas_dto]


@router.get("/stats", status_code=status.HTTP_200_OK)
async def get_pistas_stats(db: Session = Depends(get_db)):
    """
    Obtener estadísticas de pistas - total
    """
    repository = PistaRepositoryImpl(db)
    service = PistaService(repository)
    total = service.get_stats()
    
    return {"total": total}


@router.get("/destacadas", response_model=List[PistaResponse], status_code=status.HTTP_200_OK)
async def get_pistas_destacadas(limit: int = 6, db: Session = Depends(get_db)):
    """
    Obtener pistas destacadas (fútbol sala, pádel, tenis)
    """
    repository = PistaRepositoryImpl(db)
    service = PistaService(repository)
    pistas_dto = service.get_destacadas(limit)
    
    return [PistaResponse.model_validate(dto) for dto in pistas_dto]

""" 
@router.get("/{pista_id}", response_model=PistaResponse, status_code=status.HTTP_200_OK)
async def get_pista_by_id(pista_id: int, db: Session = Depends(get_db)):

    repository = PistaRepositoryImpl(db)
    service = PistaService(repository)
    pista_dto = service.get_pista_by_id(pista_id)
    
    if not pista_dto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pista con ID {pista_id} no encontrada"
        )
    
    return PistaResponse.model_validate(pista_dto)


@router.post("/", response_model=PistaResponse, status_code=status.HTTP_201_CREATED)
async def create_pista(request: CreatePistaRequest, db: Session = Depends(get_db)):

    repository = PistaRepositoryImpl(db)
    service = PistaService(repository)
    
    pista_entity = PistaMapper.request_to_entity(request)
    
    nueva_pista_dto = service.create_pista(pista_entity)
    
    return PistaResponse.model_validate(nueva_pista_dto) """
