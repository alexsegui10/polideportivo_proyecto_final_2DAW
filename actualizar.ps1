#!/usr/bin/env pwsh
# Script para actualizar y reiniciar todo el entorno de Emotiva Poli

Write-Host "🔧 Actualizando Emotiva Poli..." -ForegroundColor Cyan
Write-Host ""

# 1. Detener contenedores
Write-Host "📦 Deteniendo contenedores Docker..." -ForegroundColor Yellow
docker-compose down
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al detener contenedores" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Contenedores detenidos" -ForegroundColor Green
Write-Host ""

# 2. Instalar dependencias frontend
Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
Set-Location -Path "react_client"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias del frontend" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}
Set-Location -Path ".."
Write-Host "✅ Dependencias del frontend instaladas" -ForegroundColor Green
Write-Host ""

# 3. Limpiar imágenes antiguas (opcional, comentar si no se necesita)
# Write-Host "🧹 Limpiando imágenes antiguas..." -ForegroundColor Yellow
# docker-compose rm -f
# docker image prune -f

# 4. Construir imágenes Docker
Write-Host "🔨 Construyendo imágenes Docker..." -ForegroundColor Yellow
docker-compose build --no-cache
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al construir imágenes Docker" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Imágenes construidas exitosamente" -ForegroundColor Green
Write-Host ""

# 5. Iniciar contenedores
Write-Host "🚀 Iniciando contenedores..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al iniciar contenedores" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Contenedores iniciados" -ForegroundColor Green
Write-Host ""

# 6. Mostrar estado de los servicios
Write-Host "📊 Estado de los servicios:" -ForegroundColor Cyan
docker-compose ps
Write-Host ""

# 7. Mostrar logs del backend (primeros 50 líneas)
Write-Host "📋 Primeras líneas de logs del backend:" -ForegroundColor Cyan
Start-Sleep -Seconds 5
docker-compose logs springboot_server --tail=50

Write-Host ""
Write-Host "🎉 Actualización completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📌 URLs disponibles:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8080" -ForegroundColor White
Write-Host "   Swagger:  http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "   PgAdmin:  http://localhost:5050" -ForegroundColor White
Write-Host ""
Write-Host "💡 Para ver logs en tiempo real:" -ForegroundColor Yellow
Write-Host "   docker-compose logs -f springboot_server" -ForegroundColor White
Write-Host "   docker-compose logs -f react_client" -ForegroundColor White
