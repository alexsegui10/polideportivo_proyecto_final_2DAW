-- V10: JWT Blacklist para access tokens revocados en logout
--
-- DIFERENCIA con refresh_sessions.revoked:
--   - refresh_sessions.revoked = familia de refresh tokens comprometida (theft detection)
--   - jwt_blacklist             = access tokens explícitamente invalidados por el usuario (logout)
--
-- Un access token es un JWT stateless: aunque el usuario haga logout, el token
-- seguiría siendo válido hasta su expiración (15 min). La blacklist soluciona esto:
-- se almacena el hash del access token en logout y se verifica en cada request.
--
-- Limpieza: las entradas se borran automáticamente cuando expires_at < NOW().

CREATE TABLE IF NOT EXISTS jwt_blacklist (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_hash  VARCHAR(64) NOT NULL UNIQUE,   -- SHA-256 del access token
    expires_at  TIMESTAMP   NOT NULL,          -- cuando expira el JWT (para limpieza)
    revoked_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas rápidas en cada request
CREATE INDEX IF NOT EXISTS idx_jwt_blacklist_hash ON jwt_blacklist(token_hash);
-- Índice para limpiar entradas expiradas
CREATE INDEX IF NOT EXISTS idx_jwt_blacklist_expires_at ON jwt_blacklist(expires_at);
