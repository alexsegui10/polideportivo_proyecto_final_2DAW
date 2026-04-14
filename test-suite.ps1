$ErrorActionPreference = "Continue"
$B = "http://localhost:8080/api"
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$email = "suite$ts@test.com"
$PASS = 0
$FAIL = 0
$T = [System.IO.Path]::GetTempPath()

function Check($label, $got, $exp) {
    if ($got -eq $exp) { Write-Host "[OK]  $label => $got"; $script:PASS++ }
    else { Write-Host "[FAIL] $label => esperado=$exp obtenido=$got"; $script:FAIL++ }
}

# Hace una peticion curl guardando headers en archivo separado.
# Devuelve [statusCode, bodyString, headerFileContent]
function CurlReq($args_list) {
    $hFile = $T + [System.IO.Path]::GetRandomFileName() + ".hdr"
    $bFile = $T + [System.IO.Path]::GetRandomFileName() + ".body"
    $allArgs = @("--dump-header", $hFile, "-o", $bFile, "-s") + $args_list
    & curl.exe $allArgs 2>&1 | Out-Null
    $headers = if (Test-Path $hFile) { [IO.File]::ReadAllText($hFile) } else { "" }
    $body    = if (Test-Path $bFile) { [IO.File]::ReadAllText($bFile) } else { "" }
    # Extract status (last HTTP line in dump)
    $status = "???"
    foreach ($line in ($headers -split "`r?`n")) {
        if ($line -match "^HTTP/\S+ (\d+)") { $status = $Matches[1] }
    }
    # Extract cookie
    $cookie = ""
    foreach ($line in ($headers -split "`r?`n")) {
        if ($line -match "(?i)Set-Cookie:\s*refreshToken=([^;]+)") { $cookie = $Matches[1].Trim() }
    }
    # Extract accessToken from body
    $token = ""
    if ($body -match '"accessToken"\s*:\s*"([^"]+)"') { $token = $Matches[1] }
    Remove-Item $hFile -ErrorAction SilentlyContinue
    Remove-Item $bFile -ErrorAction SilentlyContinue
    return @{ status=$status; token=$token; cookie=$cookie; body=$body }
}

function TmpJson($content) {
    $f = $T + [IO.Path]::GetRandomFileName() + ".json"
    [IO.File]::WriteAllText($f, $content, [Text.Encoding]::UTF8)
    return $f
}

Write-Host "=== TEST SUITE AUTH ===" -ForegroundColor Cyan
Write-Host "Email: $email"
Write-Host ""

# TEST 1: REGISTER
$jReg = TmpJson ('{"nombre":"TestUser","apellidos":"AuthTest","email":"' + $email + '","password":"TestPass123!"}')
$r1 = CurlReq @("-X","POST","$B/auth/register","-H","Content-Type: application/json","--data-binary","@$jReg")
$ACC = $r1.token; $REF = $r1.cookie
Check "REGISTER" $r1.status "201"
if ($ACC.Length -lt 10) { Write-Host "  WARN: No accessToken. Body=$($r1.body)" }
if ($REF.Length -lt 10) { Write-Host "  WARN: No refreshToken cookie" }

# TEST 2: LOGIN
$jLog = TmpJson ('{"email":"' + $email + '","password":"TestPass123!"}')
$r2 = CurlReq @("-X","POST","$B/auth/login","-H","Content-Type: application/json","--data-binary","@$jLog")
$ACC = $r2.token; $REF = $r2.cookie
Check "LOGIN" $r2.status "200"
if ($ACC.Length -lt 10) { Write-Host "  WARN: No accessToken"; exit 1 }
if ($REF.Length -lt 10) { Write-Host "  WARN: No refreshToken cookie"; exit 1 }

# TEST 3: TOKEN VALIDO
$r3 = CurlReq @("$B/usuario","-H","Authorization: Bearer $ACC")
Check "TOKEN VALIDO /usuario => 200" $r3.status "200"

# TEST 4: TOKEN INVALIDO
$r4 = CurlReq @("$B/usuario","-H","Authorization: Bearer fake.jwt.token")
Check "TOKEN INVALIDO => 401" $r4.status "401"

# TEST 5: REFRESH ROTATION
$OldACC = $ACC; $OldREF = $REF
$r5 = CurlReq @("-X","POST","$B/auth/refresh","-H","Cookie: refreshToken=$REF","-H","X-Device-Id: testdevice1")
$NewACC = $r5.token; $NewREF = $r5.cookie
Check "REFRESH => 200" $r5.status "200"
if ($NewACC.Length -gt 10 -and $NewACC -ne $OldACC) { Write-Host "[OK]  REFRESH access rotado"; $PASS++ }
else { Write-Host "[FAIL] REFRESH access NO rotado (new=$($NewACC.Substring(0,[Math]::Min(30,$NewACC.Length))))"; $FAIL++ }
if ($NewREF.Length -gt 10 -and $NewREF -ne $OldREF) { Write-Host "[OK]  REFRESH cookie rotada"; $PASS++ }
else { Write-Host "[FAIL] REFRESH cookie NO rotada (new=$(if($NewREF.Length -gt 10){$NewREF.Substring(0,15)} else {$NewREF}))"; $FAIL++ }
$ACC = $NewACC; $REF = $NewREF

# TEST 6: REUSE DETECTION (token viejo)
$r6 = CurlReq @("-X","POST","$B/auth/refresh","-H","Cookie: refreshToken=$OldREF","-H","X-Device-Id: testdevice1")
Check "REUSE DETECT (token viejo) => 401" $r6.status "401"

# TEST 7: FAMILIA REVOCADA (token actual tras reuse)
$r7 = CurlReq @("-X","POST","$B/auth/refresh","-H","Cookie: refreshToken=$REF","-H","X-Device-Id: testdevice1")
Check "FAMILIA REVOCADA => 401" $r7.status "401"

# TEST 8a/b/c: LOGOUT + BLACKLIST
$jL8 = TmpJson ('{"email":"' + $email + '","password":"TestPass123!"}')
$r8l = CurlReq @("-X","POST","$B/auth/login","-H","Content-Type: application/json","--data-binary","@$jL8")
$ACC8 = $r8l.token; $REF8 = $r8l.cookie
$r8lo = CurlReq @("-X","POST","$B/auth/logout","-H","Authorization: Bearer $ACC8","-H","Cookie: refreshToken=$REF8")
Check "LOGOUT => 204" $r8lo.status "204"
$r8bl = CurlReq @("$B/usuario","-H","Authorization: Bearer $ACC8")
Check "BLACKLIST access token => 401" $r8bl.status "401"
$r8rf = CurlReq @("-X","POST","$B/auth/refresh","-H","Cookie: refreshToken=$REF8","-H","X-Device-Id: testdevice1")
Check "BLACKLIST refresh token => 401" $r8rf.status "401"

# TEST 9: RBAC
$jL9 = TmpJson ('{"email":"' + $email + '","password":"TestPass123!"}')
$r9l = CurlReq @("-X","POST","$B/auth/login","-H","Content-Type: application/json","--data-binary","@$jL9")
$ACC9 = $r9l.token
$r9 = CurlReq @("$B/usuarios","-H","Authorization: Bearer $ACC9")
Check "RBAC user->admin => 403" $r9.status "403"

# TEST 10: SIN TOKEN
$r10 = CurlReq @("$B/usuario")
Check "SIN TOKEN => 401" $r10.status "401"

# RESUMEN
Write-Host ""
Write-Host "================================"
Write-Host "RESULTADOS: $PASS OK | $FAIL FAIL"
if ($FAIL -eq 0) { Write-Host "TODAS LAS PRUEBAS PASARON!" } else { Write-Host "HAY $FAIL FALLOS" }
Write-Host "================================"
