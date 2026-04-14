import { NextResponse } from 'next/server';
import { AIGatewayService } from '@/modules/search/application/aiGatewayService';
import { buildProviders } from '@/modules/search/infrastructure/providerRegistry';

const providers = buildProviders();
const aiGatewayService = new AIGatewayService(providers);

function withCors(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET() {
  const status = await aiGatewayService.getStatus();
  return withCors(NextResponse.json(status));
}
