from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import engine, Base
from app.pista.presentation.controllers import pista_controller

# NO crear tablas - Spring Boot maneja las migraciones
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Emotiva Poli API",
    version="1.0.0",
    description="API para gestión de polideportivo"
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir controllers
app.include_router(pista_controller.router)

@app.get("/")
async def root():
    return {"message": "Bienvenido a Emotiva Poli API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
