#!/usr/bin/env pwsh
# Script rápido de actualización (sin --no-cache, más rápido)

Write-Host "⚡ Actualización rápida de Emotiva Poli..." -ForegroundColor Cyan
Write-Host ""

# 1. Detener contenedores
Write-Host "📦 Deteniendo contenedores..." -ForegroundColor Yellow
docker-compose down

# 2. NPM install (solo si hay cambios en package.json)
Write-Host "📦 Verificando dependencias del frontend..." -ForegroundColor Yellow
Set-Location -Path "react_client"
npm install
Set-Location -Path ".."

# 3. Build (con cache para ser más rápido)
Write-Host "🔨 Construyendo imágenes (con cache)..." -ForegroundColor Yellow
docker-compose build

# 4. Iniciar
Write-Host "🚀 Iniciando servicios..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "✅ Actualización rápida completada!" -ForegroundColor Green
Write-Host "📋 Ver logs: docker-compose logs -f springboot_server" -ForegroundColor Cyan
