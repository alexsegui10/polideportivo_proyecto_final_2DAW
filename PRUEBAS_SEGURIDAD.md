# Pruebas de Seguridad — Sistema Auth Emotiva Poli

**Fecha de realización:** 23 de febrero de 2026  
**Servidor:** SpringBoot (puerto 8080), JWT HS512, PostgreSQL  
**Ejecutadas con:** PowerShell `Invoke-WebRequest` contra `http://localhost:8080`

---

## Resumen de resultados

| # | Prueba | Endpoint | Resultado | Estado |
|---|--------|---------|-----------|--------|
| 1 | Register crea usuario y devuelve cookie+token | `POST /api/auth/register` | 201 + accessToken + cookie HttpOnly | ✅ PASS |
| 2 | Login devuelve tokens correctos | `POST /api/auth/login` | 200 + accessToken + cookie refreshToken | ✅ PASS |
| 3 | Endpoint protegido sin auth devuelve 401 | `GET /api/reservas` (sin Bearer) | 401 "No autenticado. Token requerido." | ✅ PASS |
| 4 | Endpoint protegido con JWT válido devuelve 200 | `GET /api/reservas` (con Bearer) | 200 con datos | ✅ PASS |
| 5 | Refresh rota el token | `POST /api/auth/refresh` (con cookie) | 200 + nuevo token ≠ anterior | ✅ PASS |
| 6 | Detección de robo de token (reuse viejo) | Reenviar refresh token ya rotado | 400 "Hash no coincide. Sesión revocada." | ✅ PASS |
| 7 | Toda la familia queda revocada tras robo | Usar token nuevo post-reuse | 400 "Token reutilizado detectado." | ✅ PASS |
| 8 | Logout borra la cookie correctamente | `POST /api/auth/logout` | 204 + `Set-Cookie: Max-Age=0; Expires=1970` | ✅ PASS |
| 9 | Refresh rechazado tras logout | Usar refreshToken después de logout | 400 rechazado | ✅ PASS |
| 10 | Aislamiento multi-dispositivo | Logout device-C, refresh device-D | device-D sigue activo (200) | ✅ PASS |

---

## Descripción detallada

### Test 1 — Register
**Por qué funciona:**  
`POST /api/auth/register` está en `permitAll()` en `SecurityConfig`. El servicio crea el usuario con contraseña Argon2, genera un access token (HS512, 15 min) y un refresh token (HS512, 30 días). La cookie se establece como `HttpOnly; SameSite=Strict; Path=/; Max-Age=2592000`.

---

### Test 2 — Login
**Por qué funciona:**  
`AuthenticationManager.authenticate()` valida el email/contraseña. El access token incluye claims `{email, role, type: "access"}`. El refresh token incluye `{familyId, type: "refresh"}`. Los secretos de firma son distintos para access y refresh (`JWT_ACCESS_SECRET` vs `JWT_REFRESH_SECRET`).

---

### Test 3 — Endpoint protegido sin auth → 401
**Por qué funciona:**  
`SecurityFilter.doFilterInternal()` sólo establece el `SecurityContextHolder` si hay un `Authorization: Bearer …` válido. Sin él, Spring Security llanza `AuthenticationEntryPoint` → 401 con JSON `{"error": "No autenticado. Token requerido."}`.

---

### Test 4 — Endpoint protegido con JWT → 200
**Por qué funciona:**  
`TokenService.isTokenValid()` verifica: firma HS512 con `JWT_ACCESS_SECRET`, fecha de expiración, y que el email exista en base de datos. A partir de 2025, también se comprueba que el token **no esté en la JWT blacklist** (`JwtBlacklistService.isBlacklisted()`).

---

### Test 5 — Refresh Token Rotation
**Por qué funciona:**  
`RefreshTokenService.rotate()` realiza:
1. Verifica firma y expiración del JWT refresh (secreto distinto al access)
2. Busca la sesión por `familyId` (UUID embebido en el JWT)
3. Compara `SHA-256(token_recibido)` con `current_token_hash` en BD
4. Si coincide: genera nuevo refresh token, actualiza el hash en BD, genera nuevo access token
5. El token anterior queda inválido (su hash ya no está en BD)

---

### Test 6 — Detección de robo de token (Token Theft Detection)
**Por qué funciona:**  
Si se reutiliza un refresh token ya rotado (hash no coincide con el almacenado en BD), `RefreshTokenService.rotate()` llama a `sessionRepository.revokeByFamilyId(familyId)` para revocar toda la familia de tokens antes de lanzar la excepción.

**Bug corregido durante las pruebas:**  
`@Transactional` sin `noRollbackFor` hacía rollback del `revokeByFamilyId` al lanzar la `SecurityException`, dejando la sesión activa. **Fix:** `@Transactional(noRollbackFor = SecurityException.class)` en `rotate()`.

---

### Test 7 — Familia entera revocada
**Por qué funciona:**  
Todos los tokens de una misma familia comparten el mismo `familyId`. `revokeByFamilyId()` hace `UPDATE refresh_sessions SET revoked = true WHERE family_id = ?`. En el siguiente uso del token nuevo (REFRESH2), la verificación en paso 3 detecta `session.getRevoked() == true` y devuelve 400.

**Distinción conceptual:**
- `refresh_sessions.revoked = true` → familia comprometida por **theft detection** (involuntario)
- `jwt_blacklist` → access token revocado **voluntariamente** por el usuario en logout

---

### Test 8 — Logout borra la cookie
**Por qué funciona:**  
`AuthService.logout()` hace dos cosas:
1. `refreshTokenService.invalidateSession()` → `revoked = true` en BD
2. `jwtBlacklistService.revoke(accessToken)` → SHA-256 del access token en `jwt_blacklist`
3. `clearRefreshCookie()` → `Set-Cookie: refreshToken=; Max-Age=0; Expires=Thu, 01 Jan 1970`

El navegador elimina la cookie al recibir `Max-Age=0`.

---

### Test 9 — Refresh rechazado tras logout
**Por qué funciona:**  
El refresh token fue revocado en BD (`revoked = true`) durante el logout. La verificación en `rotate()` detecta `session.getRevoked() == true` → 400.

Además, el **access token** también está en la blacklist → `SecurityFilter` rechaza cualquier request con ese token aunque no haya expirado todavía.

---

### Test 10 — Aislamiento multi-dispositivo
**Por qué funciona:**  
Cada login con un `X-Device-Id` diferente crea una `RefreshSession` con un `familyId` distinto en BD. El logout por dispositivo revoca SÓLO la sesión con ese `familyId`. Los demás dispositivos tienen su propio `familyId` y su propia fila en `refresh_sessions`, totalmente independiente.

---

## Arquitectura de tokens

```
LOGIN
  ├─ Access Token  (JWT, 15 min, HS512/JWT_ACCESS_SECRET)
  │    └─ Claims: {email, role, type: "access"}
  └─ Refresh Token (JWT, 30 días, HS512/JWT_REFRESH_SECRET) → cookie HttpOnly
       └─ Claims: {email, familyId, type: "refresh"}
            │
            └── Almacenado como SHA-256 en refresh_sessions
                 ├── familyId   → detectar reuse (theft)
                 ├── deviceId   → logout por dispositivo
                 ├── revoked    → blacklist de refresh (theft detection)
                 └── sessionVersion → logout global

LOGOUT
  ├─ refresh_sessions.revoked = true    (refresh token invalidado)
  └─ jwt_blacklist (SHA-256 access token, hasta su expiración natural)
```

---

## Tabla `jwt_blacklist` vs `refresh_sessions.revoked`

| Campo | Cuándo se usa | Quién lo activa | Para qué token |
|-------|--------------|----------------|----------------|
| `jwt_blacklist` | Usuario hace logout | Voluntario | Access token (JWT stateless) |
| `refresh_sessions.revoked` | Reuse detectado o logout | Automático / voluntario | Refresh token (familia) |

La necesidad de la blacklist de access tokens viene del **principio stateless** de los JWT: una vez emitido, un JWT es válido hasta su expiración aunque el usuario haya cerrado sesión. La blacklist "revoca" ese token de forma anticipada.

---

## Limpieza automática

```java
// JwtBlacklistService.java
@Scheduled(fixedDelay = 3_600_000) // cada 1 hora
public void cleanupExpiredEntries() {
    blacklistRepository.deleteExpiredBefore(LocalDateTime.now());
}
```

Las entradas de la blacklist se eliminan automáticamente cuando el JWT ya ha expirado (no tienen utilidad una vez que el token ha caducado naturalmente), manteniendo la tabla pequeña.
