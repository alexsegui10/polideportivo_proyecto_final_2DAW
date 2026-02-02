# 🐳 Docker Setup - Emotiva Poli

## Arquitectura de Contenedores

```
┌─────────────────────────────────────────────────────┐
│                   Docker Network                     │
│                emotivapoli_network                   │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   React      │  │   FastAPI    │  │  Spring   │ │
│  │   (Nginx)    │  │   (Python)   │  │   Boot    │ │
│  │   Port 3000  │  │   Port 5000  │  │  Port 6000│ │
│  └──────┬───────┘  └──────┬───────┘  └─────┬─────┘ │
│         │                 │                 │       │
│         └─────────────────┼─────────────────┘       │
│                           │                         │
│         ┌─────────────────▼─────────────────┐       │
│         │         PostgreSQL                │       │
│         │         Port 5432                 │       │
│         └─────────────────┬─────────────────┘       │
│                           │                         │
│                  ┌────────▼────────┐                │
│                  │     pgAdmin     │                │
│                  │    Port 5050    │                │
│                  └─────────────────┘                │
└─────────────────────────────────────────────────────┘
```

## 📋 Prerequisitos

- Docker Desktop instalado
- Docker Compose v2.0+
- Al menos 4GB de RAM disponible

## 🚀 Comandos Rápidos

### Iniciar toda la aplicación
```bash
docker-compose up -d
```

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f react_client
docker-compose logs -f fastapi_server
docker-compose logs -f springboot_server
docker-compose logs -f postgres
```

### Detener todos los servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ borra datos de BD)
```bash
docker-compose down -v
```

### Reconstruir imágenes
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Reiniciar un servicio específico
```bash
docker-compose restart fastapi_server
```

## 📦 Servicios

### 1. PostgreSQL (Base de Datos)
- **Puerto**: 5432
- **Usuario**: admin
- **Contraseña**: admin123
- **Base de datos**: emotivapoli
- **Volumen**: Datos persistentes en `postgres_data`

### 2. pgAdmin (Administrador de PostgreSQL)
- **Puerto**: 5050
- **URL**: http://localhost:5050
- **Email**: admin@emotivapoli.com
- **Contraseña**: admin123
- **Conexión preconfigurada**: Servidor "Emotiva Poli - PostgreSQL"
### 4. Spring Boot Server (Backend Java)
- **Puerto**: 6000
- **URL**: http://localhost:6000/api
- **Health check**: http://localhost:6000/actuator/health
- **Hibernate**: DDL auto-update

### 5. React Client (Frontend)n desarrollo

### 3. Spring Boot Server (Backend Java)
- **Puerto**: 6000
- **URL**: http://localhost:6000/api
- **Health check**: http://localhost:6000/actuator/health
- **Hibernate**: DDL auto-update

### 4. React Client (Frontend)
- **Puerto**: 3000
- **URL**: http://localhost:3000
- **Servidor**: Nginx
- **Proxy API**:
  - `/api/fastapi/*` → http://fastapi_server:5000
  - `/api/springboot/*` → http://springboot_server:6000/api

## 🔧 Configuración

### Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Edita `.env` con tus valores

### Base de Datos

El script `init-db.sql` se ejecuta automáticamente la primera vez que se crea el contenedor de PostgreSQL.

#### Conectar con psql (CLI)
```bash
docker exec -it emotivapoli_postgres psql -U admin -d emotivapoli
```

#### Conectar con pgAdmin (GUI)

1. Abre http://localhost:5050
2. Inicia sesión:
   - **Email**: admin@emotivapoli.com
   - **Contraseña**: admin123
3. El servidor ya está preconfigurado automáticamente
4. Si necesitas conectar manualmente:
   - **Host**: postgres
   - **Puerto**: 5432
   - **Base de datos**: emotivapoli
   - **Usuario**: admin
   - **Contraseña**: admin123

## 🛠️ Desarrollo

### Modo desarrollo con hot reload

FastAPI ya tiene hot reload habilitado por el volumen montado.

Para React en desarrollo (sin Docker):
```bash
cd react_client
npm run dev
```

### Ejecutar comandos dentro de contenedores

```bash
# Bash en FastAPI
docker exec -it emotivapoli_fastapi sh

# Bash en Spring Boot
docker exec -it emotivapoli_springboot sh

# PostgreSQL CLI
docker exec -it emotivapoli_postgres psql -U admin -d emotivapoli
```

## 📊 Monitoreo

### Ver estado de contenedores
```bash
docker-compose ps
```

### Ver uso de recursos
```bash
docker stats
```

### Inspeccionar red
```bash
docker network inspect emotivapoli_network
```

## 🐛 Troubleshooting

### Error: "Port already in use"
```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :3000
# Matar proceso (Windows)
taskkill /PID <PID> /F
```

### Limpiar todo Docker (⚠️ cuidado)
```bash
docker system prune -a --volumes
```

### Reconstruir un servicio específico
```bash
docker-compose build --no-cache springboot_server
docker-compose up -d springboot_server
```

### Base de datos no conecta
```bash
# Verificar salud de PostgreSQL
docker-compose exec postgres pg_isready -U admin

# Reiniciar PostgreSQL
docker-compose restart postgres
```

## 📈 Producción

Para producción, modifica:

1. **Eliminar hot reload** en FastAPI (quitar `--reload`)
2. **Variables de entorno** en `.env` con valores seguros
3. **Cambiar contraseñas** de PostgreSQL
4. **Configurar CORS** apropiadamente
5. **Usar secretos** de Docker/Kubernetes

### Build de producción
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Seguridad

- ⚠️ Cambia las credenciales por defecto en `.env`
- ⚠️ No commits `.env` al repositorio
- ✅ Usa Docker secrets en producción
- ✅ Configura firewall/security groups
- ✅ Habilita SSL/TLS con certificados

## 📝 Notas

- Los volúmenes de datos persisten entre reinicios
- `docker-compose down -v` elimina los volúmenes (datos perdidos)
- Spring Boot tarda ~30s en iniciar la primera vez
- FastAPI inicia en ~2-3s
- React build tarda ~1-2min la primera vez
