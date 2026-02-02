#!/bin/bash

# Script de instalación completa - Emotiva Poli

echo "=== INSTALACIÓN EMOTIVA POLI ==="
echo ""

# Verificar que Docker está corriendo
echo "Verificando Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker no está corriendo. Por favor, inicia Docker."
    exit 1
fi
echo "✓ Docker está corriendo"
echo ""

# Detener y limpiar contenedores existentes
echo "Limpiando contenedores y volúmenes antiguos..."
docker-compose down -v
echo "✓ Limpieza completada"
echo ""

# Construir todas las imágenes
echo "Construyendo imágenes Docker (esto puede tardar varios minutos)..."
docker-compose build --no-cache postgres pgadmin fastapi_server react_client

if [ $? -eq 0 ]; then
    echo ""
    echo "=== INSTALACIÓN COMPLETADA ==="
    echo ""
    echo "Para iniciar todos los servicios, ejecuta:"
    echo "  ./iniciar.sh"
    echo ""
else
    echo ""
    echo "ERROR: La construcción de imágenes falló."
    exit 1
fi
