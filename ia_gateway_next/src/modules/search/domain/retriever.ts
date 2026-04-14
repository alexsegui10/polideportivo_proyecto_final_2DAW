import { PistaDocument } from './types';

const QUERY_STOPWORDS = new Set([
  'pista', 'pistas', 'cancha', 'canchas', 'deporte', 'deportes',
  'con', 'sin', 'de', 'del', 'la', 'el', 'los', 'las', 'un', 'una',
  'quiero', 'busco', 'buscar', 'necesito', 'para', 'por', 'en',
]);

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function buildVocabulary(pistas: PistaDocument[]): string[] {
  const set = new Set<string>();
  pistas.forEach((p) => {
    const words = normalize(`${p.nombre} ${p.tipo ?? ''} ${p.descripcion ?? ''}`);
    words.forEach((w) => set.add(w));
  });
  return Array.from(set);
}

function textToVector(words: string[], vocabulary: string[]): number[] {
  return vocabulary.map((word) => words.filter((w) => w === word).length);
}

function hasAnyVocabularyMatch(words: string[], vocabulary: string[]): boolean {
  const vocabSet = new Set(vocabulary);
  return words.some((w) => vocabSet.has(w));
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

export function retrieveRelevantPistas(query: string, pistas: PistaDocument[], topK = 5): PistaDocument[] {
  if (!query.trim()) return pistas.slice(0, topK);

  const vocab = buildVocabulary(pistas);
  const rawQueryWords = normalize(query);
  const filteredQueryWords = rawQueryWords.filter((w) => !QUERY_STOPWORDS.has(w));
  if (filteredQueryWords.length === 0) {
    return [];
  }
  const hasSpecificMatch = hasAnyVocabularyMatch(filteredQueryWords, vocab);
  if (!hasSpecificMatch) {
    return [];
  }

  const queryWords = filteredQueryWords;
  const queryVector = textToVector(queryWords, vocab);

  const scored = pistas
    .map((pista) => {
      const pistaWords = normalize(`${pista.nombre} ${pista.tipo ?? ''} ${pista.descripcion ?? ''}`);
      const pistaVector = textToVector(pistaWords, vocab);
      const score = cosineSimilarity(queryVector, pistaVector);
      const hasTermOverlap = queryWords.some((qw) => pistaWords.includes(qw));
      return { pista, score, hasTermOverlap };
    });

  const MIN_SIMILARITY = 0.08;
  const relevant = scored
    .filter((x) => x.hasTermOverlap && x.score >= MIN_SIMILARITY)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((x) => x.pista);

  return relevant;
}
