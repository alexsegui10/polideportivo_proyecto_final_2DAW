-- V9: Refresh tokens con rotación, familyId y sessionVersion

-- 1. Añadir session_version a usuarios para logout global
ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS session_version INT NOT NULL DEFAULT 0;

-- 2. Tabla de sesiones de refresh token
CREATE TABLE IF NOT EXISTS refresh_sessions (
    id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          BIGINT      NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    device_id        VARCHAR(255) NOT NULL,
    family_id        UUID        NOT NULL,
    current_token_hash VARCHAR(64) NOT NULL,       -- SHA-256 del refresh token
    revoked          BOOLEAN     NOT NULL DEFAULT FALSE,
    session_version  INT         NOT NULL DEFAULT 0, -- copia de users.session_version al crear
    created_at       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at     TIMESTAMP
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_refresh_sessions_family_id  ON refresh_sessions(family_id);
CREATE INDEX IF NOT EXISTS idx_refresh_sessions_user_id    ON refresh_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_sessions_device     ON refresh_sessions(user_id, device_id);
