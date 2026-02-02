from app.pista.domain.entity.pista import Pista
from app.pista.domain.dto.pista_dto import PistaDTO
from app.pista.presentation.schemas.request.pista_request import CreatePistaRequest


class PistaMapper:
    """Mapper para convertir entre entidades, DTOs y schemas"""
    
    @staticmethod
    def entity_to_dto(entity: Pista) -> PistaDTO:
        """Convierte Entity a DTO"""
        return PistaDTO(
            id=entity.id,
            nombre=entity.nombre,
            tipo=entity.tipo,
            status=entity.status,
            is_active=entity.is_active,
            slug=entity.slug,
            precio_hora=entity.precio_hora,
            descripcion=entity.descripcion,
            imagen=entity.imagen
        )
    
    @staticmethod
    def dto_to_entity(dto: PistaDTO) -> Pista:
        """Convierte DTO a Entity"""
        return Pista(
            id=dto.id,
            nombre=dto.nombre,
            tipo=dto.tipo,
            status=dto.status,
            is_active=dto.is_active,
            slug=dto.slug,
            precio_hora=dto.precio_hora,
            descripcion=dto.descripcion,
            imagen=dto.imagen
        )
    
    @staticmethod
    def request_to_entity(request: CreatePistaRequest) -> Pista:
        """Convierte Request a Entity"""
        return Pista(
            nombre=request.nombre,
            tipo=request.tipo,
            status=request.status,
            is_active=request.is_active,
            slug=request.slug,
            precio_hora=request.precio_hora,
            descripcion=request.descripcion,
            imagen=request.imagen
        )
