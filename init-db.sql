-- Initialization script for PostgreSQL
-- Este script solo crea extensiones y datos iniciales
-- El schema completo lo maneja Flyway (V1 + V2)

-- Conectar a la base de datos
\c emotivapoli;

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Garantizar permisos
GRANT ALL PRIVILEGES ON DATABASE emotivapoli TO admin;

-- Datos iniciales se insertarán después de que Flyway cree el schema
-- (Los inserts se pueden hacer en una migración V3__Insert_initial_data.sql si se necesita)

-- Log de inicialización exitosa
SELECT 'Database emotivapoli initialized - schema managed by Flyway!' AS message;

