import { AIProvider } from '@/modules/search/domain/types';
import { createGeminiProvider } from '@/modules/search/infrastructure/providers/geminiProvider';
import { createGroqProvider } from '@/modules/search/infrastructure/providers/groqProvider';
import { createOpenRouterProvider } from '@/modules/search/infrastructure/providers/openRouterProvider';

export function buildProviders(): AIProvider[] {
  const providers: AIProvider[] = [];

  if (process.env.GROQ_API_KEY) providers.push(createGroqProvider(process.env.GROQ_API_KEY));
  if (process.env.GEMINI_API_KEY) providers.push(createGeminiProvider(process.env.GEMINI_API_KEY));
  if (process.env.OPENROUTER_API_KEY) providers.push(createOpenRouterProvider(process.env.OPENROUTER_API_KEY));

  return providers;
}
