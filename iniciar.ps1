# Script de inicio - Emotiva Poli
# Este script inicia todos los servicios en Docker

Write-Host "=== INICIANDO EMOTIVA POLI ===" -ForegroundColor Cyan
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

# Iniciar PostgreSQL primero
Write-Host "Iniciando PostgreSQL..." -ForegroundColor Yellow
docker-compose up -d postgres
Start-Sleep -Seconds 5
Write-Host "✓ PostgreSQL iniciado" -ForegroundColor Green
Write-Host ""

# Iniciar pgAdmin, FastAPI y Spring Boot
Write-Host "Iniciando pgAdmin, FastAPI y Spring Boot..." -ForegroundColor Yellow
docker-compose up -d pgadmin fastapi_server springboot_server
Start-Sleep -Seconds 5
Write-Host "✓ pgAdmin, FastAPI y Spring Boot iniciados" -ForegroundColor Green
Write-Host ""

# Iniciar React
Write-Host "Iniciando React..." -ForegroundColor Yellow
docker-compose up -d react_client
Start-Sleep -Seconds 5
Write-Host "✓ React iniciado" -ForegroundColor Green
Write-Host ""

# Mostrar estado de los servicios
Write-Host "=== ESTADO DE LOS SERVICIOS ===" -ForegroundColor Cyan
docker-compose ps
Write-Host ""

Write-Host "=== SERVICIOS DISPONIBLES ===" -ForegroundColor Green
Write-Host "✓ React Frontend:     http://localhost:3001" -ForegroundColor White
Write-Host "✓ FastAPI Backend:    http://localhost:8000" -ForegroundColor White
Write-Host "✓ FastAPI Docs:       http://localhost:8000/docs" -ForegroundColor White
Write-Host "✓ Spring Boot API:    http://localhost:8080" -ForegroundColor White
Write-Host "✓ Spring Boot Swagger: http://localhost:8080/swagger-ui/index.html" -ForegroundColor White
Write-Host "✓ Spring Boot Pistas: http://localhost:8080/api/pistas" -ForegroundColor White
Write-Host "✓ pgAdmin:            http://localhost:5050" -ForegroundColor White
Write-Host "   - Email:    admin@emotivapoli.com" -ForegroundColor Gray
Write-Host "   - Password: admin123" -ForegroundColor Gray
Write-Host "✓ PostgreSQL:         localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "Para ver los logs en tiempo real:" -ForegroundColor Cyan
Write-Host "  docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "Para detener todos los servicios:" -ForegroundColor Cyan
Write-Host "  docker-compose down" -ForegroundColor White
Write-Host ""
