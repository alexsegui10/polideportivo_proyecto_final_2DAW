from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.clase.presentation.schemas.response.clase_response import ClaseResponse
from app.clase.application.service.clase_service import ClaseService
from app.clase.infrastructure.repository.clase_repository_impl import ClaseRepositoryImpl

router = APIRouter(
    prefix="/api/clases",
    tags=["Clases"]
)


@router.get("/", response_model=List[ClaseResponse], status_code=status.HTTP_200_OK)
async def get_all_clases(fecha: str = None, db: Session = Depends(get_db)):
    """
    Obtener clases. Si se pasa ?fecha=hoy o ?fecha=mañana filtra por esa fecha
    """
    repository = ClaseRepositoryImpl(db)
    service = ClaseService(repository)
    
    if fecha == "hoy":
        clases_dto = service.get_clases_hoy()
    elif fecha == "mañana":
        clases_dto = service.get_clases_manana()
    else:
        clases_dto = service.get_all_clases()
    
    # Agregar nombre del entrenador
    responses = []
    for dto in clases_dto:
        response = ClaseResponse.model_validate(dto)
        
        # Obtener nombre del entrenador si existe
        if dto.entrenador_id:
            try:
                entrenador = db.execute(
                    "SELECT nombre FROM usuarios WHERE id = :id",
                    {"id": dto.entrenador_id}
                ).fetchone()
                response.entrenador = entrenador[0] if entrenador else "Coach Profesional"
            except:
                response.entrenador = "Coach Profesional"
        else:
            response.entrenador = "Coach Profesional"
        
        responses.append(response)
    
    return responses


@router.get("/stats", status_code=status.HTTP_200_OK)
async def get_clases_stats(db: Session = Depends(get_db)):
    """
    Obtener estadísticas de clases - total de entrenadores
    """
    repository = ClaseRepositoryImpl(db)
    service = ClaseService(repository)
    total = service.get_stats()
    
    return {"total": total}
