import { AIProvider, ChatMessage } from '@/modules/search/domain/types';

type BlacklistMap = Map<string, number>;

export class AIGatewayService {
  private currentServiceIndex = 0;
  private readonly blacklist: BlacklistMap = new Map();
  private readonly blacklistMs = 2 * 60 * 1000;

  constructor(private readonly providers: AIProvider[]) {}

  private isBlacklisted(name: string): boolean {
    const until = this.blacklist.get(name);
    if (!until) return false;
    if (Date.now() > until) {
      this.blacklist.delete(name);
      return false;
    }
    return true;
  }

  private blacklistProvider(name: string) {
    this.blacklist.set(name, Date.now() + this.blacklistMs);
  }

  async recommend(messages: ChatMessage[]): Promise<{ text: string; provider: string }> {
    if (this.providers.length === 0) {
      throw new Error('No hay proveedores IA configurados');
    }

    let attempts = 0;
    while (attempts < this.providers.length) {
      const provider = this.providers[this.currentServiceIndex];
      this.currentServiceIndex = (this.currentServiceIndex + 1) % this.providers.length;

      if (this.isBlacklisted(provider.name)) {
        attempts++;
        continue;
      }

      try {
        const text = await provider.chat(messages);
        return { text, provider: provider.name };
      } catch {
        this.blacklistProvider(provider.name);
        attempts++;
      }
    }

    throw new Error('Todos los proveedores de IA fallaron');
  }

  async getStatus() {
    const report: Array<{ provider: string; status: string; latency: string; error: string | null }> = [];

    for (const provider of this.providers) {
      const start = Date.now();
      try {
        await provider.healthcheck();
        this.blacklist.delete(provider.name);
        report.push({
          provider: provider.name,
          status: 'ONLINE',
          latency: `${Date.now() - start}ms`,
          error: null,
        });
      } catch (error: unknown) {
        this.blacklistProvider(provider.name);
        report.push({
          provider: provider.name,
          status: 'OFFLINE',
          latency: 'N/A',
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
    }

    return {
      timestamp: new Date().toISOString(),
      totalProviders: this.providers.length,
      activeBlacklist: Array.from(this.blacklist.keys()),
      report,
    };
  }
}
