from app.clase.domain.entity.clase import Clase
from app.clase.domain.dto.clase_dto import ClaseDTO


class ClaseMapper:
    """Mapper para convertir entre entidades y DTOs de Clase"""
    
    @staticmethod
    def entity_to_dto(clase: Clase) -> ClaseDTO:
        """Convierte una entidad Clase a ClaseDTO"""
        return ClaseDTO(
            id=clase.id,
            slug=clase.slug,
            nombre=clase.nombre,
            descripcion=clase.descripcion,
            imagen=clase.imagen,
            entrenador_id=clase.entrenador_id,
            pista_id=clase.pista_id,
            fecha_hora_inicio=clase.fecha_hora_inicio,
            fecha_hora_fin=clase.fecha_hora_fin,
            duracion_minutos=clase.duracion_minutos,
            max_participantes=clase.max_participantes,
            precio=clase.precio,
            nivel=clase.nivel,
            deporte=clase.deporte,
            status=clase.status,
            is_active=clase.is_active,
            created_at=clase.created_at,
            updated_at=clase.updated_at
        )
