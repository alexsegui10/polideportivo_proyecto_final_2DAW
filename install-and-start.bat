@echo off
chcp 65001 >nul
setlocal

echo =====================================
echo   Emotiva Poli - Setup ^& Start
echo =====================================
echo.

cd /d "%~dp0"

:: Instalar dependencias de React
echo [1/4] Instalando dependencias de React...
cd react_client
if exist package.json (
    call npm install
    if errorlevel 1 (
        echo ✗ Error al instalar dependencias de React
        pause
        exit /b 1
    )
    echo ✓ Dependencias de React instaladas correctamente
) else (
    echo ✗ No se encontró package.json en react_client
    pause
    exit /b 1
)
cd ..

echo.
echo [2/4] Instalando dependencias de Python (FastAPI)...
cd fastapi_server
if exist requirements.txt (
    pip install -r requirements.txt
    echo ✓ Dependencias de Python instaladas
) else (
    echo ✗ No se encontró requirements.txt
)
cd ..

echo.
echo [3/4] Verificando Spring Boot...
cd springboot_server
if exist pom.xml (
    echo ✓ Proyecto Spring Boot encontrado
) else (
    echo ✗ No se encontró pom.xml
)
cd ..

echo.
echo =====================================
echo   Iniciando servicios...
echo =====================================
echo.

:: Iniciar FastAPI
echo [4/4] Iniciando FastAPI (Puerto 5000)...
start "FastAPI Server" cmd /k "cd /d "%~dp0fastapi_server" && python main.py"

timeout /t 2 /nobreak >nul

:: Iniciar Spring Boot
echo Iniciando Spring Boot (Puerto 6000)...
start "Spring Boot Server" cmd /k "cd /d "%~dp0springboot_server" && mvn spring-boot:run"

timeout /t 2 /nobreak >nul

:: Iniciar React
echo Iniciando React Client (Puerto 3000)...
start "React Client" cmd /k "cd /d "%~dp0react_client" && npm run dev"

echo.
echo =====================================
echo   ✓ Todos los servicios iniciados
echo =====================================
echo.
echo URLs de acceso:
echo   • React:       http://localhost:3000
echo   • Spring Boot: http://localhost:6000/api
echo   • FastAPI:     http://localhost:5000
echo   • Swagger:     http://localhost:5000/docs
echo.
pause
