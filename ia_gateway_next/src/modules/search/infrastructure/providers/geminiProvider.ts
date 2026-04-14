import { AIProvider, ChatMessage } from '@/modules/search/domain/types';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

function toGeminiParts(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));
}

export function createGeminiProvider(apiKey: string): AIProvider {
  return {
    name: 'Gemini',
    async chat(messages: ChatMessage[]) {
      const response = await fetch(`${API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: toGeminiParts(messages),
          generationConfig: { temperature: 0.1, maxOutputTokens: 800 },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini error ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sin respuesta de Gemini';
    },
    async healthcheck() {
      const res = await fetch(`${API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      });

      if (!res.ok) throw new Error(`Gemini health ${res.status}`);
    },
  };
}
