import { AIProvider, ChatMessage } from '@/modules/search/domain/types';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export function createOpenRouterProvider(apiKey: string): AIProvider {
  return {
    name: 'OpenRouter',
    async chat(messages: ChatMessage[]) {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free',
          messages,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter error ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content ?? 'Sin respuesta de OpenRouter';
    },
    async healthcheck() {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5,
        }),
      });

      if (!res.ok) throw new Error(`OpenRouter health ${res.status}`);
    },
  };
}
