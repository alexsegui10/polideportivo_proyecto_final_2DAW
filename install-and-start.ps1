# Script para instalar dependencias e iniciar todos los servicios de Emotiva Poli

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Emotiva Poli - Setup & Start" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Obtener el directorio del script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Instalar dependencias de React
Write-Host "[1/4] Instalando dependencias de React..." -ForegroundColor Yellow
Set-Location "$scriptPath\react_client"
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Dependencias de React instaladas correctamente" -ForegroundColor Green
    } else {
        Write-Host "✗ Error al instalar dependencias de React" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✗ No se encontró package.json en react_client" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/4] Instalando dependencias de Python (FastAPI)..." -ForegroundColor Yellow
Set-Location "$scriptPath\fastapi_server"
if (Test-Path "requirements.txt") {
    pip install -r requirements.txt
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Dependencias de Python instaladas correctamente" -ForegroundColor Green
    } else {
        Write-Host "✗ Error al instalar dependencias de Python" -ForegroundColor Red
        Write-Host "  Puede que necesites activar un entorno virtual primero" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ No se encontró requirements.txt en fastapi_server" -ForegroundColor Red
}

Write-Host ""
Write-Host "[3/4] Verificando Spring Boot..." -ForegroundColor Yellow
Set-Location "$scriptPath\springboot_server"
if (Test-Path "pom.xml") {
    Write-Host "✓ Proyecto Spring Boot encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ No se encontró pom.xml en springboot_server" -ForegroundColor Red
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Iniciando servicios..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar FastAPI en una nueva terminal
Write-Host "[4/4] Iniciando FastAPI (Puerto 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\fastapi_server'; Write-Host 'FastAPI Server - Puerto 5000' -ForegroundColor Green; python main.py"

Start-Sleep -Seconds 2

# Iniciar Spring Boot en una nueva terminal
Write-Host "Iniciando Spring Boot (Puerto 6000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\springboot_server'; Write-Host 'Spring Boot Server - Puerto 6000' -ForegroundColor Green; mvn spring-boot:run"

Start-Sleep -Seconds 2

# Iniciar React en una nueva terminal
Write-Host "Iniciando React Client (Puerto 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\react_client'; Write-Host 'React Client - Puerto 3000' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  ✓ Todos los servicios iniciados" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs de acceso:" -ForegroundColor Cyan
Write-Host "  • React:       http://localhost:3000" -ForegroundColor White
Write-Host "  • Spring Boot: http://localhost:6000/api" -ForegroundColor White
Write-Host "  • FastAPI:     http://localhost:5000" -ForegroundColor White
Write-Host "  • Swagger:     http://localhost:5000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
