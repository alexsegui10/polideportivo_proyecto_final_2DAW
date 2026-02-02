# Emotiva Poli

Sistema completo con 3 aplicaciones: FastAPI, Spring Boot y React.

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

**Windows PowerShell:**
```powershell
.\install-and-start.ps1
```

**Windows CMD:**
```cmd
install-and-start.bat
```

Esto instalará todas las dependencias e iniciará los 3 servicios automáticamente.

### Opción 2: Manual

#### 1. FastAPI Server (Puerto 8000)
```bash
cd fastapi_server
pip install -r requirements.txt
python main.py
```

#### 2. Spring Boot Server (Puerto 8080)
```bash
cd springboot_server
mvn spring-boot:run
```

#### 3. React Client (Puerto 3000)
```bash
cd react_client
npm install
npm run dev
```

## 📂 Estructura del Proyecto

```
Emotiva_poli/
├── fastapi_server/         # Backend FastAPI
│   ├── main.py
│   └── requirements.txt
│
├── springboot_server/      # Backend Spring Boot
│   ├── pom.xml
│   └── src/
│
└── react_client/           # Frontend React
    ├── src/
    │   ├── components/     # Componentes reutilizables
    │   ├── pages/          # Páginas
    │   ├── context/        # React Context
    │   ├── hooks/          # Custom Hooks
    │   ├── services/       # Servicios API
    │   ├── queries/        # React Query queries
    │   └── mutations/      # React Query mutations
    └── package.json
```

## 🌐 URLs de Acceso

- **React Client:** http://localhost:3000
- **Spring Boot API:** http://localhost:6000/api
- **FastAPI:** http://localhost:5000
- **FastAPI Swagger Docs:** http://localhost:5000/docs

## 🛠️ Tecnologías

- **Frontend:** React 18 + TypeScript + Vite + React Query + React Router
- **Backend 1:** FastAPI + Python
- **Backend 2:** Spring Boot + Java 17

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- Python 3.8+
- Java 17+
- Maven 3.6+

## 🔧 Desarrollo

Cada servicio tiene su propio README con instrucciones detalladas:
- [fastapi_server/README.md](fastapi_server/README.md)
- [springboot_server/README.md](springboot_server/README.md)
- [react_client/README.md](react_client/README.md)
