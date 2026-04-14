import { AIProvider, ChatMessage } from '@/modules/search/domain/types';

const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export function createGroqProvider(apiKey: string): AIProvider {
  return {
    name: 'Groq',
    async chat(messages: ChatMessage[]) {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          temperature: 0.1,
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq error ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content ?? 'Sin respuesta de Groq';
    },
    async healthcheck() {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5,
        }),
      });

      if (!res.ok) throw new Error(`Groq health ${res.status}`);
    },
  };
}
