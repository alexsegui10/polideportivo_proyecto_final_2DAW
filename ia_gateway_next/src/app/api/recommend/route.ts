import { NextRequest, NextResponse } from 'next/server';
import { AIGatewayService } from '@/modules/search/application/aiGatewayService';
import { recommendPistasByPrompt } from '@/modules/search/application/recommendPistas';
import { buildProviders } from '@/modules/search/infrastructure/providerRegistry';

const providers = buildProviders();
const aiGatewayService = new AIGatewayService(providers);

function withCors(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== 'string') {
      return withCors(
        NextResponse.json({ error: "Falta el campo 'prompt'" }, { status: 400 })
      );
    }

    const result = await recommendPistasByPrompt(prompt, aiGatewayService);

    return withCors(
      NextResponse.json({
        success: true,
        provider_used: result.providerUsed,
        recommendation: result.recommendation,
        items_found: result.relevantPistas.length,
        pistas_relevantes: result.relevantPistas,
      })
    );
  } catch (error: unknown) {
    return withCors(
      NextResponse.json(
        { error: error instanceof Error ? error.message : 'Error interno' },
        { status: 500 }
      )
    );
  }
}
