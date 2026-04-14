export type Role = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface PistaDocument {
  id: number;
  slug?: string;
  nombre: string;
  tipo?: string;
  descripcion?: string;
  precioHora?: number;
  imagen?: string;
}

export interface AIProvider {
  name: string;
  chat: (messages: ChatMessage[]) => Promise<string>;
  healthcheck: () => Promise<void>;
}

export interface RecommendationResult {
  recommendation: string;
  providerUsed: string;
  relevantPistas: PistaDocument[];
}
