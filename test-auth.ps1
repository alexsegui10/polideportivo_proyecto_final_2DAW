$B = "http://localhost:8080/api"; $PASS = 0; $FAIL = 0
function Check($name, $got, $expected) { if ("$got" -eq "$expected") { Write-Host "  [OK]  $name" -ForegroundColor Green; $script:PASS++ } else { Write-Host "  [FAIL] $name => esperado=$expected | obtenido=$got" -ForegroundColor Red; $script:FAIL++ } }
function Req($uri, $method="GET", $headers=@{}, $body=$null) {
    try { $p=@{Uri=$uri;Method=$method;Headers=$headers;ErrorAction="Stop"}; if($body){$p.Body=$body;$p.ContentType="application/json"}; $r=Invoke-WebRequest @p; return @{status=[int]$r.StatusCode;content=$r.Content;hdrs=$r.Headers} }
    catch { $resp=$_.Exception.Response; $s=if($resp){[int]$resp.StatusCode}else{0}; $c=""; try{$sr=New-Object System.IO.StreamReader($resp.GetResponseStream());$c=$sr.ReadToEnd()}catch{}; return @{status=$s;content=$c;hdrs=if($resp){$resp.Headers}else{@{}}} }
}
$ts=[DateTimeOffset]::UtcNow.ToUnixTimeSeconds(); $email="test$ts@test.com"
Write-Host "[1] REGISTER" -ForegroundColor Cyan
$r=Req "$B/auth/register" POST @{} "{`"nombre`":`"T`",`"apellidos`":`"U`",`"email`":`"$email`",`"password`":`"TestPass123!`"}"; $d=$r.content|ConvertFrom-Json; $ACC=$d.accessToken; $REF=($r.hdrs["Set-Cookie"] -split ";")[0] -replace "^refreshToken=",""
Check "Status 201" $r.status 201; Check "AccessToken" ([bool]($ACC.Length-gt10)) True; Check "Cookie" ([bool]($REF.Length-gt10)) True
Write-Host "[2] LOGIN" -ForegroundColor Cyan
$r2=Req "$B/auth/login" POST @{} "{`"email`":`"$email`",`"password`":`"TestPass123!`"}"; $d2=$r2.content|ConvertFrom-Json; $ACC=$d2.accessToken; $REF=($r2.hdrs["Set-Cookie"] -split ";")[0] -replace "^refreshToken=",""
Check "Status 200" $r2.status 200; Check "AccessToken" ([bool]($ACC.Length-gt10)) True; Check "Cookie" ([bool]($REF.Length-gt10)) True
Write-Host "[3] ACCESS TOKEN valido" -ForegroundColor Cyan
$r3=Req "$B/usuario" GET @{"Authorization"="Bearer $ACC"}; Check "Status 200" $r3.status 200
Write-Host "[4] TOKEN INVALIDO" -ForegroundColor Cyan
$r4=Req "$B/usuario" GET @{"Authorization"="Bearer fake.token.here"}; Check "Status 401" $r4.status 401
Write-Host "[5] REFRESH - rotacion" -ForegroundColor Cyan
$OACC=$ACC;$OREF=$REF; $r5=Req "$B/auth/refresh" POST @{"Cookie"="refreshToken=$REF";"X-Device-Id"="d1"}; $d5=$r5.content|ConvertFrom-Json; $ACC=$d5.accessToken; $REF=($r5.hdrs["Set-Cookie"] -split ";")[0] -replace "^refreshToken=",""
Check "Status 200" $r5.status 200; Check "Access token rotado" ($ACC -ne $OACC) True; Check "Cookie rotada" ($REF -ne $OREF) True
Write-Host "[6] REUSE DETECTION" -ForegroundColor Cyan
$r6=Req "$B/auth/refresh" POST @{"Cookie"="refreshToken=$OREF";"X-Device-Id"="d1"}; Check "Status 401 (reuse)" $r6.status 401
Write-Host "[7] FAMILIA REVOCADA" -ForegroundColor Cyan
$r7=Req "$B/auth/refresh" POST @{"Cookie"="refreshToken=$REF";"X-Device-Id"="d1"}; Check "Status 401 (familia)" $r7.status 401
Write-Host "[8] LOGOUT + BLACKLIST" -ForegroundColor Cyan
$r8=Req "$B/auth/login" POST @{} "{`"email`":`"$email`",`"password`":`"TestPass123!`"}"; $d8=$r8.content|ConvertFrom-Json; $ACC2=$d8.accessToken; $REF2=($r8.hdrs["Set-Cookie"] -split ";")[0] -replace "^refreshToken=",""
$rlo=Req "$B/auth/logout" POST @{"Authorization"="Bearer $ACC2";"Cookie"="refreshToken=$REF2"}; Check "Logout 204" $rlo.status 204
$rbl=Req "$B/usuario" GET @{"Authorization"="Bearer $ACC2"}; Check "Blacklist 401" $rbl.status 401
$rbl2=Req "$B/auth/refresh" POST @{"Cookie"="refreshToken=$REF2";"X-Device-Id"="d1"}; Check "Refresh revocado 401" $rbl2.status 401
Write-Host "[9] RBAC" -ForegroundColor Cyan
$r9=Req "$B/auth/login" POST @{} "{`"email`":`"$email`",`"password`":`"TestPass123!`"}"; $ACC3=($r9.content|ConvertFrom-Json).accessToken
$ra=Req "$B/usuarios" GET @{"Authorization"="Bearer $ACC3"}; Check "RBAC 403 Forbidden" $ra.status 403
Write-Host "[10] SIN TOKEN" -ForegroundColor Cyan
$r10=Req "$B/usuario"; Check "Sin token 401" $r10.status 401
Write-Host ""
$col=if($script:FAIL-eq 0){"Green"}else{"Red"}
Write-Host "══════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  PASS: $script:PASS   FAIL: $script:FAIL" -ForegroundColor $col
Write-Host "══════════════════════════════════════" -ForegroundColor Yellow
