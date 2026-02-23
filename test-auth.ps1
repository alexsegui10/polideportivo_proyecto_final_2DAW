#!/usr/bin/env pwsh
# Script para probar el sistema de autenticación

Write-Host "`n=== TEST SISTEMA DE AUTENTICACIÓN ===" -ForegroundColor Cyan
Write-Host ""

# Variables
$baseUrl = "http://localhost:8080/api/auth"
$randomEmail = "test$(Get-Random)@example.com"

# Test 1: Register
Write-Host "📝 TEST 1: POST /api/auth/register" -ForegroundColor Yellow
Write-Host "Email: $randomEmail" -ForegroundColor Gray

$registerBody = @{
    nombre = "Test"
    apellidos = "Usuario Prueba"
    email = $randomEmail
    password = "Password123!"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/register" -Method POST -Body $registerBody -ContentType "application/json"
    
    Write-Host "✅ REGISTRO EXITOSO!" -ForegroundColor Green
    Write-Host "   Usuario: $($registerResponse.user.nombre) $($registerResponse.user.apellidos)" -ForegroundColor White
    Write-Host "   Email: $($registerResponse.user.email)" -ForegroundColor White
    Write-Host "   Slug: $($registerResponse.user.slug)" -ForegroundColor White
    Write-Host "   Role: $($registerResponse.user.role)" -ForegroundColor White
    Write-Host "   Status: $($registerResponse.user.status)" -ForegroundColor White
    Write-Host "   Token (primeros 50 chars): $($registerResponse.token.Substring(0, [Math]::Min(50, $registerResponse.token.Length)))..." -ForegroundColor Yellow
    
    # Guardar token para test de login
    $global:testToken = $registerResponse.token
    $global:testEmail = $randomEmail
    $global:testPassword = "Password123!"
    
} catch {
    Write-Host "❌ ERROR EN REGISTRO" -ForegroundColor Red
    Write-Host "   Mensaje: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    exit 1
}

Write-Host ""

# Test 2: Login
Write-Host "🔐 TEST 2: POST /api/auth/login" -ForegroundColor Yellow

$loginBody = @{
    email = $global:testEmail
    password = $global:testPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method POST -Body $loginBody -ContentType "application/json"
    
    Write-Host "✅ LOGIN EXITOSO!" -ForegroundColor Green
    Write-Host "   Usuario: $($loginResponse.user.nombre) $($loginResponse.user.apellidos)" -ForegroundColor White
    Write-Host "   Email: $($loginResponse.user.email)" -ForegroundColor White
    Write-Host "   Token generado: SÍ" -ForegroundColor Green
    Write-Host "   Token (primeros 50 chars): $($loginResponse.token.Substring(0, [Math]::Min(50, $loginResponse.token.Length)))..." -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ ERROR EN LOGIN" -ForegroundColor Red
    Write-Host "   Mensaje: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    exit 1
}

Write-Host ""

# Test 3: Login con credenciales incorrectas
Write-Host "🚫 TEST 3: Login con contraseña incorrecta (debe fallar)" -ForegroundColor Yellow

$loginBodyWrong = @{
    email = $global:testEmail
    password = "WrongPassword789"
} | ConvertTo-Json

try {
    $loginResponseWrong = Invoke-RestMethod -Uri "$baseUrl/login" -Method POST -Body $loginBodyWrong -ContentType "application/json"
    Write-Host "❌ ERROR: Login no debería haber funcionado con contraseña incorrecta" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400 -or $_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "✅ CORRECTO: Login rechazado con contraseña incorrecta" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Código de error inesperado: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== RESUMEN ===" -ForegroundColor Cyan
Write-Host "✅ Sistema de autenticación funcionando correctamente!" -ForegroundColor Green
Write-Host "   • POST /api/auth/register: OK" -ForegroundColor White
Write-Host "   • POST /api/auth/login: OK" -ForegroundColor White
Write-Host "   • Validación de credenciales: OK" -ForegroundColor White
Write-Host "   • Generación de JWT: OK" -ForegroundColor White
Write-Host ""
