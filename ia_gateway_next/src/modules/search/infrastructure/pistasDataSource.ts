import { PistaDocument } from '@/modules/search/domain/types';

const SPRING_API_URL = process.env.SPRING_API_URL ?? 'http://localhost:8080/api';

interface SpringPista {
  id: number;
  slug?: string;
  nombre?: string;
  tipo?: string;
  descripcion?: string;
  precioHora?: number;
  imagen?: string;
}

export async function getAllPistas(): Promise<PistaDocument[]> {
  const response = await fetch(`${SPRING_API_URL}/pistas`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Error cargando pistas desde Spring: ${response.status}`);
  }

  const data = (await response.json()) as SpringPista[];

  const mapped = data.map((p) => ({
    id: p.id,
    slug: p.slug,
    nombre: p.nombre ?? `Pista ${p.id}`,
    tipo: p.tipo,
    descripcion: p.descripcion,
    precioHora: p.precioHora,
    imagen: p.imagen,
  }));

  // Filtro rapido de calidad para evitar entradas de prueba que ensucian el search IA.
  const filtered = mapped.filter((p) => {
    const nombre = (p.nombre || '').toLowerCase();
    const slug = (p.slug || '').toLowerCase();
    const looksLikeRealPista = /\b(pista|cancha)\b/.test(nombre) || slug.startsWith('pista-');
    const hasCoreData = Boolean(p.tipo) && (p.precioHora ?? 0) > 0;
    return looksLikeRealPista && hasCoreData;
  });

  return filtered.length > 0 ? filtered : mapped;
}
