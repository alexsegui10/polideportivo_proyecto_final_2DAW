# IA Gateway Next (Polideportivo)

Servidor Next.js con arquitectura por capas estilo Spring:
- presentation: rutas API Next (`src/app/api`)
- application: casos de uso y orquestacion
- domain: tipos y retriever
- infrastructure: proveedores IA y datasource de pistas

## Endpoints

- POST `/api/recommend`
  - body: `{ "prompt": "quiero una pista para yoga suave" }`
- GET `/api/status`

## Variables de entorno

Copia `.env.example` a `.env.local`:

- `SPRING_API_URL` -> API Spring con `/api/pistas`
- `GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY`

## Ejecucion

```bash
npm install
npm run dev
```

Servidor por defecto: `http://localhost:3000`
