from app.club.domain.entity.club import Club
from app.club.domain.dto.club_dto import ClubDTO


class ClubMapper:
    """Mapper para convertir entre entidades y DTOs de Club"""
    
    @staticmethod
    def entity_to_dto(club: Club, num_miembros: int = 0) -> ClubDTO:
        """Convierte una entidad Club a ClubDTO"""
        return ClubDTO(
            id=club.id,
            slug=club.slug,
            nombre=club.nombre,
            descripcion=club.descripcion,
            deporte=club.deporte,
            imagen=club.imagen,
            entrenador_id=club.entrenador_id,
            max_miembros=club.max_miembros,
            nivel=club.nivel,
            precio_mensual=club.precio_mensual,
            status=club.status,
            is_active=club.is_active,
            created_at=club.created_at,
            updated_at=club.updated_at,
            num_miembros=num_miembros
        )
