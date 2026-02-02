# CONTEXTO TÉCNICO - EMOTIVA POLI

## 🎯 STACK TECNOLÓGICO

### Backend
- **Framework**: Spring Boot 3.2.1 + Java 17
- **Base de Datos**: PostgreSQL 15
- **Migraciones**: Flyway 9.22.3 (baseline-on-migrate: true)
- **ORM**: Hibernate/JPA
- **Puerto**: 8080

### Frontend
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **UI**: Material-UI (MUI)
- **Estado**: Context API
- **HTTP**: Axios
- **Puerto**: 3002

### Infraestructura
- **Contenedores**: Docker + Docker Compose
- **Servicios**: 5 contenedores (postgres, pgadmin, springboot, react, fastapi)
- **Admin DB**: pgAdmin en puerto 5050

---

## 📐 ARQUITECTURA BACKEND

### Patrón: Hexagonal (Clean Architecture)

```
Bounded Context/
├── domain/              ← Núcleo (entidades, interfaces)
│   ├── entity/         → @Entity JPA
│   ├── dto/            → DTOs de dominio
│   └── repository/     → Interfaces de repositorio
├── application/         ← Lógica de negocio
│   └── service/        → Business logic, validaciones
├── infrastructure/      ← Implementaciones técnicas
│   ├── repository/     → Implementaciones JPA
│   └── mapper/         → Entity ↔ DTO
└── presentation/        ← Capa de exposición
    ├── router/         → @RestController (endpoints)
    ├── controller/     → Coordinación
    └── schemas/        → Request/Response DTOs
```

### Bounded Contexts Implementados
1. **Usuario**: Gestión de usuarios (admin, entrenador, cliente)
2. **Pista**: Gestión de instalaciones deportivas
3. **Reserva**: Sistema de reservas
4. **ClasePublica**: Clases grupales
5. **Club**: Clubs deportivos

### Flujo de Request
```
HTTP → Router → Controller → Service → Repository → Database
                    ↓           ↓
                Validación  Lógica Negocio
                DTO Mapping  + Filtros
```

---

## 🗄️ BASE DE DATOS

### Migraciones Flyway (3 archivos)

**V1__Initial_schema.sql** (7 tablas core):
- usuarios
- pistas
- reservas
- clases_publicas
- clubs
- club_miembros
- clase_inscripciones

**V2__Add_new_tables.sql** (4 tablas avanzadas):
- eventos_pista
- club_suscripciones (sin FK ultimo_pago_id)
- pagos
- ALTER TABLE club_suscripciones (añadir FK circular)
- clase_waitlist

**V3__Insert_initial_data.sql**:
- 1 usuario admin
- 5 pistas de ejemplo

### Resolución Circular FK
Problema: `club_suscripciones.ultimo_pago_id` → `pagos.id` y `pagos.club_suscripcion_id` → `club_suscripciones.id`

Solución:
1. CREATE TABLE club_suscripciones (ultimo_pago_id BIGINT sin FK)
2. CREATE TABLE pagos (con FK a club_suscripciones)
3. ALTER TABLE club_suscripciones ADD CONSTRAINT FK

### Esquema Actual
- **Total**: 11 tablas
- **Versión Flyway**: 3
- **Estado**: Schema up to date

---

## 🔄 SOFT-DELETE PATTERN

### Implementación
- **Nivel**: Service Layer (backend)
- **Campos**: `status VARCHAR(50)` + `is_active BOOLEAN DEFAULT true`
- **Comportamiento**:
  - DELETE → UPDATE status = 'eliminado' AND is_active = false
  - GET → Filtro `.filter(e -> !"eliminado".equals(e.getStatus()))`
  - POST → Validación con filtro de status (permite reutilizar credenciales)

### Entidades con Soft-Delete
- ✅ Usuario (status + is_active)
- ✅ Pista (status + is_active)
- ✅ Todas las demás entidades tienen ambos campos

### Ventajas
1. Mantiene historial completo de estados (activo → inactivo → suspendido → eliminado)
2. Permite reutilizar emails/DNIs/slugs de usuarios eliminados
3. No rompe foreign keys
4. Auditoría completa con tracking de status
5. Recuperación posible con contexto de estado
6. `is_active` como flag secundario para compatibilidad

---

## 🌐 ARQUITECTURA FRONTEND

### Estructura
```
src/
├── components/          → Componentes reutilizables
│   ├── Admin/          → TablaPistas, TablaUsuarios, etc.
│   ├── Cliente/        → Vista cliente
│   └── Comun/          → Cabecera, Footer
├── pages/              → Páginas completas
│   ├── HomePage.tsx
│   ├── DashboardPage.tsx
│   └── admin/          → PistasPage, UsuariosPage
├── hooks/              → Custom hooks
│   ├── queries/        → usePistas, useUsuarios (GET)
│   └── mutations/      → Mutations (POST/PUT/DELETE)
├── services/           → API calls
│   ├── api.ts          → Axios config
│   ├── queries/        → GET requests
│   └── mutations/      → POST/PUT/DELETE requests
├── context/            → React Context
│   ├── PistasContext.tsx
│   └── UsuariosContext.tsx
├── types/              → TypeScript interfaces
└── theme/              → MUI theme
```

### Patrón de Datos
1. **Context API**: Estado global (pistas, usuarios)
2. **Custom Hooks**: Encapsulan lógica (usePistas, useUsuarios)
3. **Services**: Llamadas HTTP separadas (queries + mutations)
4. **Components**: Solo presentación, reciben props
5. **Pages**: Coordinan lógica + componentes

### Axios Config
- Base URL: http://localhost:8080
- withCredentials: true (CORS)
- Headers: Content-Type: application/json

---

## 🔐 CORS CONFIGURATION

### Backend (CorsConfig.java)
- **Patrón**: `allowedOriginPatterns("http://localhost:*")`
- **Métodos**: GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Credentials**: true
- **Max Age**: 3600

### ⚠️ REGLA CRÍTICA
**NUNCA** usar `allowedOrigins("*")` con `allowCredentials(true)` → ERROR

**NUNCA** usar `@CrossOrigin` en routers individuales → Conflicto con config global

---

## 🔑 SLUG GENERATION (AUTO)

### Backend
- **Usuario**: nombre + apellidos → "juan-perez-garcia"
- **Pista**: nombre → "padel-central"
- **Proceso**:
  1. toLowerCase()
  2. Quitar acentos (á→a, é→e, etc.)
  3. Espacios/especiales → guión (-)
  4. Trim guiones inicio/fin

### Frontend
- **NO** pide slug en formularios
- Campo slug ausente en `PistaRequest` y `UsuarioCreateRequest`
- Backend genera y retorna el slug en la response

---

## 📡 API ENDPOINTS

### Estructura
```
/api/pistas
    GET /                    → Lista activas (status != 'eliminado')
    POST /                   → Crear (slug auto)
    GET /{id}               → Ver una
    PUT /{id}               → Actualizar (slug auto si cambia nombre)
    PATCH /{id}/soft-delete → Eliminar (status='eliminado', is_active=false)

/api/usuarios
    GET /                    → Lista activos (status != 'eliminado')
    POST /                   → Crear (slug auto)
    GET /{id}               → Ver uno
    PUT /{id}               → Actualizar
    PATCH /{id}/soft-delete → Eliminar (status='eliminado', is_active=false)
    GET /role/{role}        → Por rol (status != 'eliminado')
```

### Códigos HTTP
- 200 OK → GET exitoso
- 201 Created → POST exitoso
- 204 No Content → DELETE exitoso
- 400 Bad Request → Validación fallida
- 404 Not Found → No existe
- 409 Conflict → Duplicado
- 500 Internal → Error servidor

---

## 🚀 SCRIPTS Y COMANDOS

### Desarrollo
```powershell
.\actualizar.ps1          # Rebuild completo
.\iniciar.ps1             # Start containers
docker-compose down       # Stop containers
docker-compose logs -f    # Ver logs en tiempo real
```

### Verificación
```powershell
docker-compose ps                    # Estado contenedores
docker logs emotivapoli_springboot   # Logs Spring Boot
docker logs emotivapoli_react        # Logs React
```

### Base de Datos
```sql
-- Ver migraciones aplicadas
SELECT * FROM flyway_schema_history ORDER BY installed_rank;

-- Ver usuarios activos
SELECT id, nombre, email FROM usuarios WHERE is_active = true;

-- Ver pistas activas
SELECT id, nombre, tipo FROM pistas WHERE is_active = true;
```

---

## 🔍 VALIDACIONES BACKEND

### Crear Usuario
1. Email único en activos (permite reutilizar de eliminados)
2. DNI único en activos (permite reutilizar de eliminados)
3. Slug generado único en activos
4. Password hash requerido
5. Role válido (admin, entrenador, cliente)

### Crear Pista
1. Nombre único (slug generado debe ser único en activas)
2. Tipo válido
3. Precio > 0
4. Status válido (disponible, mantenimiento, reservada)

### Actualizar
- Solo se validan campos que cambian
- Slug se regenera si cambia el nombre
- Verificación de unicidad excluye el registro actual

---

## 📦 DEPENDENCIAS CLAVE

### Backend (pom.xml)
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- postgresql
- flyway-core
- lombok (opcional)

### Frontend (package.json)
- react + react-dom
- typescript
- @mui/material + @emotion
- axios
- react-router-dom
- vite

---

## 🐳 DOCKER COMPOSE

### Servicios
1. **postgres**: PostgreSQL 15 (puerto 5432)
2. **pgadmin**: Admin DB (puerto 5050)
3. **springboot_server**: Backend Java (puerto 8080)
4. **react_client**: Frontend React (puerto 3002)
5. **fastapi_server**: Python API (puerto 8000, reservado)

### Health Checks
- postgres: `pg_isready -U emotiva`
- springboot: HTTP GET /actuator/health
- Otros: sin health check

### Volúmenes
- postgres: Datos persistentes
- pgadmin: Configuración persistente

---

## 🎨 CONVENCIONES NAMING

### Backend (Java)
- Clases: PascalCase (Usuario, PistaService)
- Métodos: camelCase (getAllUsuarios, createPista)
- Campos: camelCase (isActive, createdAt)

### Base de Datos (SQL)
- Tablas: snake_case plural (usuarios, clases_publicas)
- Columnas: snake_case (is_active, created_at)

### Frontend (TypeScript)
- Componentes: PascalCase (TablaPistas, HomePage)
- Funciones: camelCase (handleEdit, fetchUsuarios)
- Variables: camelCase (formData, isLoading)

---

## 🔄 CICLO DE DESARROLLO

### Flujo Normal
1. Hacer cambios en código
2. Ejecutar `.\actualizar.ps1`
3. Esperar build (Spring Boot + React)
4. Verificar logs sin errores
5. Acceder a http://localhost:3002

### Si hay errores
1. Ver logs: `docker-compose logs springboot_server`
2. Verificar migraciones Flyway
3. Revisar errores TypeScript en build React
4. Comprobar CORS si hay errores de red

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### Completado ✅
- Arquitectura hexagonal implementada
- 11 entidades con relaciones
- Soft-delete en todas las entidades
- Slug generación automática
- CRUD completo usuarios y pistas
- Formularios modales create/edit
- Filtros activos/inactivos
- Migraciones Flyway (V1, V2, V3)
- CORS configurado correctamente
- Docker Compose funcional

### Características Técnicas
- **Backend detecta**: 11 entities, 2 JPA repositories
- **Flyway**: 3 migrations validated
- **Frontend**: TypeScript strict mode
- **Build**: Multi-stage Docker builds
- **Hot reload**: Vite en desarrollo

### Pendiente (futuro)
- Autenticación JWT
- Roles y permisos granulares
- Sistema de pagos completo
- Notificaciones
- FastAPI integration
- Tests unitarios/integración

---

## 💡 DECISIONES ARQUITECTÓNICAS CLAVE

1. **Soft-Delete con Status**: Todas las entidades tienen status + is_active, filtrado por `status != 'eliminado'` en Service Layer
2. **Slug Automático**: Backend genera slugs, frontend NO los pide
3. **Arquitectura Hexagonal**: Separación clara de capas, domain independiente
4. **Flyway Only**: Única fuente de verdad para schema DB
5. **Context API**: Estado global sin Redux/MobX
6. **TypeScript Strict**: Tipado fuerte en todo el frontend
7. **CORS Patterns**: allowedOriginPatterns para flexibilidad localhost
8. **Monorepo**: Backend y frontend en mismo repo
9. **Docker First**: Desarrollo y producción con containers

---

**Última actualización**: 26 de enero de 2026  
**Versión**: 2.0 (Concisa)
