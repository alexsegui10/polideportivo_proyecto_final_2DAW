# Script de instalación completa - Emotiva Poli
# Este script construye todas las imágenes Docker

Write-Host "=== INSTALACIÓN EMOTIVA POLI ===" -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker está corriendo
Write-Host "Verificando Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker no está corriendo. Por favor, inicia Docker Desktop." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker está corriendo" -ForegroundColor Green
Write-Host ""

# Detener y limpiar contenedores existentes
Write-Host "Limpiando contenedores y volúmenes antiguos..." -ForegroundColor Yellow
docker-compose down -v
Write-Host "✓ Limpieza completada" -ForegroundColor Green
Write-Host ""

# Construir todas las imágenes
Write-Host "Construyendo imágenes Docker (esto puede tardar varios minutos)..." -ForegroundColor Yellow
docker-compose build --no-cache postgres pgadmin fastapi_server react_client

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== INSTALACIÓN COMPLETADA ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para iniciar todos los servicios, ejecuta:" -ForegroundColor Cyan
    Write-Host "  .\iniciar.ps1" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERROR: La construcción de imágenes falló." -ForegroundColor Red
    exit 1
}
