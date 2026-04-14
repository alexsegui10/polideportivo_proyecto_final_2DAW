$B='http://localhost:8080/api'; $T=[IO.Path]::GetTempPath()

function CurlReq($al) {
    $hF = $T + [IO.Path]::GetRandomFileName() + '.hdr'
    $bF = $T + [IO.Path]::GetRandomFileName() + '.body'
    $a = @('--dump-header', $hF, '-o', $bF, '-s') + $al
    & curl.exe $a 2>&1 | Out-Null
    $hd = if (Test-Path $hF) { [IO.File]::ReadAllText($hF) } else { "" }
    $bd = if (Test-Path $bF) { [IO.File]::ReadAllText($bF) } else { "" }
    $st = '???'
    foreach ($l in ($hd -split "`r?`n")) { if ($l -match '^HTTP/\S+ (\d+)') { $st = $Matches[1] } }
    $ck = ''
    foreach ($l in ($hd -split "`r?`n")) { if ($l -match '(?i)Set-Cookie:\s*refreshToken=([^;]+)') { $ck = $Matches[1].Trim() } }
    $tk = ''
    if ($bd -match '"accessToken"\s*:\s*"([^"]+)"') { $tk = $Matches[1] }
    Remove-Item $hF -EA 0; Remove-Item $bF -EA 0
    return @{ status = $st; token = $tk; cookie = $ck; body = $bd }
}

$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$jf = $T + 'dbgtest.json'
$email2 = 'dbg' + $ts + '@test.com'
[IO.File]::WriteAllText($jf, '{"nombre":"DbgUser","apellidos":"Test","email":"' + $email2 + '","password":"TestPass123!"}')

Write-Host "--- REGISTER ---"
$r = CurlReq @('-X', 'POST', "$B/auth/register", '-H', 'Content-Type: application/json', '--data-binary', "@$jf")
Write-Host "REG status=$($r.status) tokenLen=$($r.token.Length) cookieLen=$($r.cookie.Length)"

$jf2 = $T + 'dbglogin.json'
[IO.File]::WriteAllText($jf2, '{"email":"' + $email2 + '","password":"TestPass123!"}')

Write-Host "--- LOGIN ---"
$r2 = CurlReq @('-X', 'POST', "$B/auth/login", '-H', 'Content-Type: application/json', '--data-binary', "@$jf2")
Write-Host "LOGIN status=$($r2.status) tokenLen=$($r2.token.Length) cookieLen=$($r2.cookie.Length)"
$ACC = $r2.token; $REF = $r2.cookie

Write-Host "--- REFRESH (token del login) ---"
$r3 = CurlReq @('-X', 'POST', "$B/auth/refresh", '-H', "Cookie: refreshToken=$REF", '-H', 'X-Device-Id: testdevice1')
Write-Host "REFRESH status=$($r3.status) tokenLen=$($r3.token.Length) cookieLen=$($r3.cookie.Length)"
Write-Host "SAME_ACC=$($r3.token -eq $ACC)  SAME_REF=$($r3.cookie -eq $REF)"
$OldREF = $REF; $NewREF = $r3.cookie

Write-Host "--- REUSE DETECT (token viejo del login) ---"
$r4 = CurlReq @('-X', 'POST', "$B/auth/refresh", '-H', "Cookie: refreshToken=$OldREF", '-H', 'X-Device-Id: testdevice1')
Write-Host "REUSE status=$($r4.status) (esperado 401)"

Write-Host "--- FAMILIA REVOCADA (token nuevo tras reuse) ---"
$r5 = CurlReq @('-X', 'POST', "$B/auth/refresh", '-H', "Cookie: refreshToken=$NewREF", '-H', 'X-Device-Id: testdevice1')
Write-Host "FAMILIA status=$($r5.status) (esperado 401)"
