# Arquitectura Clean - Spring Boot

## Estructura del Proyecto

```
springboot_server/
└── src/
    └── main/
        └── java/
            └── com/
                └── emotivapoli/
                    ├── user/                          # Módulo de Usuarios
                    │   ├── presentation/              # Capa de Presentación
                    │   │   ├── controller/           # Controladores REST
                    │   │   ├── request/              # DTOs de entrada (Request)
                    │   │   └── response/             # DTOs de salida (Response)
                    │   ├── application/               # Capa de Aplicación
                    │   │   └── service/              # Servicios (casos de uso)
                    │   ├── domain/                    # Capa de Dominio
                    │   │   ├── entity/               # Entidades del dominio
                    │   │   ├── repository/           # Interfaces de repositorio
                    │   │   └── dto/                  # DTOs de dominio
                    │   └── infrastructure/            # Capa de Infraestructura
                    │       ├── repository/           # Implementaciones JPA
                    │       └── mapper/               # Mapeadores Entity <-> DTO
                    ├── utils/                         # Utilidades compartidas
                    │   ├── jwt/                      # Utilidades JWT
                    │   ├── exception/                # Excepciones personalizadas
                    │   └── validation/               # Validaciones compartidas
                    └── config/                        # Configuraciones globales
                        ├── SecurityConfig
                        ├── JpaConfig
                        └── CorsConfig
```

## Descripción de Capas

### 📌 Presentation (Capa de Presentación)
- **Controller**: Controladores REST (@RestController)
- **Request**: DTOs para recibir datos del cliente
- **Response**: DTOs para enviar datos al cliente

### 🔧 Application (Capa de Aplicación)
- **Service**: Lógica de negocio y casos de uso
- Orquesta las operaciones del dominio
- No conoce detalles de infraestructura

### 💎 Domain (Capa de Dominio)
- **Entity**: Entidades puras del negocio (@Entity)
- **Repository**: Interfaces de repositorio (puertos)
- **DTO**: DTOs de dominio para transferencia entre capas
- Núcleo de la aplicación, sin dependencias externas

### 🏗️ Infrastructure (Capa de Infraestructura)
- **Repository**: Implementaciones JPA de los repositorios
- **Mapper**: Conversión entre Entity y DTOs
- Detalles técnicos y frameworks

### 🛠️ Utils (Utilidades)
- **JWT**: Generación y validación de tokens
- **Exception**: Excepciones personalizadas globales
- **Validation**: Validadores compartidos

### ⚙️ Config (Configuración)
- Configuraciones de seguridad, CORS, JPA, etc.

## Flujo de Datos

```
Cliente → Controller → Service → Repository Interface → Repository Impl → DB
   ↓          ↓           ↓              ↓                    ↓
Request → Response ← DTO ← Entity ← Entity (JPA) ← PostgreSQL
```

## Dependencias entre Capas

```
Presentation → Application → Domain ← Infrastructure
     ↓              ↓           ↑
   Utils ←────────────────────────┘
```

## Próximos Módulos a Implementar

- [ ] `pista/` - Gestión de pistas deportivas
- [ ] `deporte/` - Gestión de tipos de deportes
- [ ] `reserva/` - Gestión de reservas
- [ ] `auth/` - Autenticación y autorización

## Tecnologías

- **Framework**: Spring Boot 3.x
- **Base de Datos**: PostgreSQL
- **ORM**: JPA/Hibernate
- **Seguridad**: Spring Security + JWT
- **Build**: Maven
