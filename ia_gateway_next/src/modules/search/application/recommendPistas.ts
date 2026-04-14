import { retrieveRelevantPistas } from '@/modules/search/domain/retriever';
import { ChatMessage, RecommendationResult } from '@/modules/search/domain/types';
import { AIGatewayService } from '@/modules/search/application/aiGatewayService';
import { getAllPistas } from '@/modules/search/infrastructure/pistasDataSource';

export async function recommendPistasByPrompt(
  prompt: string,
  aiGatewayService: AIGatewayService
): Promise<RecommendationResult> {
  const pistas = await getAllPistas();
  const relevantPistas = retrieveRelevantPistas(prompt, pistas, 5);

  const systemPrompt = `
Eres un asistente del polideportivo Emotiva Poli.
Debes recomendar pistas deportivas usando solo las pistas relevantes proporcionadas.

Pistas relevantes:
${relevantPistas
  .map(
    (p) => `- ${p.nombre} (${p.tipo ?? 'sin tipo'}): ${p.descripcion ?? 'sin descripcion'} | precio/hora: ${p.precioHora ?? 0}`
  )
  .join('\n')}

Reglas:
- No inventes pistas.
- Explica por que encajan con lo pedido por el usuario.
- Si no hay buen encaje, indicalo claramente.
`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt.trim() },
    { role: 'user', content: prompt },
  ];

  const { text, provider } = await aiGatewayService.recommend(messages);

  return {
    recommendation: text,
    providerUsed: provider,
    relevantPistas,
  };
}
