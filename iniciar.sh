#!/bin/bash

# Script de inicio - Emotiva Poli

echo "=== INICIANDO EMOTIVA POLI ==="
echo ""

# Verificar que Docker está corriendo
echo "Verificando Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker no está corriendo. Por favor, inicia Docker."
    exit 1
fi
echo "✓ Docker está corriendo"
echo ""

# Iniciar PostgreSQL primero
echo "Iniciando PostgreSQL..."
docker-compose up -d postgres
sleep 5
echo "✓ PostgreSQL iniciado"
echo ""

# Iniciar pgAdmin y FastAPI
echo "Iniciando pgAdmin y FastAPI..."
docker-compose up -d pgadmin fastapi_server
sleep 3
echo "✓ pgAdmin y FastAPI iniciados"
echo ""

# Iniciar React
echo "Iniciando React..."
docker-compose up -d react_client
sleep 5
echo "✓ React iniciado"
echo ""

# Mostrar estado de los servicios
echo "=== ESTADO DE LOS SERVICIOS ==="
docker-compose ps
echo ""

echo "=== SERVICIOS DISPONIBLES ==="
echo "✓ React Frontend:     http://localhost:3000"
echo "✓ FastAPI Backend:    http://localhost:8000"
echo "✓ FastAPI Docs:       http://localhost:8000/docs"
echo "✓ pgAdmin:            http://localhost:5050"
echo "   - Email:    admin@emotivapoli.com"
echo "   - Password: admin123"
echo "✓ PostgreSQL:         localhost:5432"
echo ""
echo "Para ver los logs en tiempo real:"
echo "  docker-compose logs -f"
echo ""
echo "Para detener todos los servicios:"
echo "  docker-compose down"
echo ""
