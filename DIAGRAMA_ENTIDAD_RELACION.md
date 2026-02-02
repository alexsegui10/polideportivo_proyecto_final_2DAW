# DIAGRAMA ENTIDAD-RELACIÓN COMPLETO
# Sistema de Gestión de Polideportivo - Emotiva Poli

## 📊 ENTIDADES Y ATRIBUTOS

### 1️⃣ USUARIO (usuarios)
**Atributos:**
- id: BIGINT (PK) AUTO_INCREMENT
- uid: UUID UNIQUE NOT NULL
- slug: VARCHAR(255) UNIQUE NOT NULL
- nombre: VARCHAR(100) NOT NULL
- apellidos: VARCHAR(150)
- email: VARCHAR(255) UNIQUE NOT NULL
- telefono: VARCHAR(20)
- dni: VARCHAR(20) UNIQUE
- fecha_nacimiento: DATE
- avatar: TEXT
- password_hash: VARCHAR(255) NOT NULL
- role: VARCHAR(50) NOT NULL DEFAULT 'cliente' [admin, cliente, entrenador]
- status: VARCHAR(50) NOT NULL DEFAULT 'activo' [activo, inactivo, suspendido, eliminado]
- is_active: BOOLEAN NOT NULL DEFAULT TRUE
- especialidad: VARCHAR(100)
- certificaciones: TEXT
- bio: TEXT
- direccion: TEXT
- ciudad: VARCHAR(100)
- codigo_postal: VARCHAR(10)
- created_at: TIMESTAMP NOT NULL
- updated_at: TIMESTAMP NOT NULL
- last_login: TIMESTAMP

**Relaciones:**
- 🔗 ONE-TO-MANY → Club (como entrenador)
- 🔗 ONE-TO-MANY → ClasePublica (como entrenador)
- 🔗 ONE-TO-MANY → Reserva (como usuario)
- 🔗 MANY-TO-MANY → Club (como miembro, vía ClubMiembro)
- 🔗 MANY-TO-MANY → ClasePublica (como participante, vía ClaseInscripcion)

---

### 2️⃣ PISTA (pistas)
**Atributos:**
- id: BIGINT (PK) AUTO_INCREMENT
- nombre: VARCHAR(100) NOT NULL
- tipo: VARCHAR(50) NOT NULL [padel, tenis, futbol-sala, baloncesto]
- status: VARCHAR(50) NOT NULL DEFAULT 'disponible' [disponible, mantenimiento, eliminado]
- is_active: BOOLEAN NOT NULL DEFAULT TRUE
- slug: VARCHAR(255) UNIQUE NOT NULL
- precio_hora: DECIMAL(10,2) NOT NULL
- descripcion: TEXT
- imagen: TEXT

**NOTA:** La ocupación de la pista NO se controla por status, sino por eventos_pista según horario.

**Relaciones:**
- 🔗 ONE-TO-MANY → Reserva
- 🔗 ONE-TO-MANY → ClasePublica

---

### 3️⃣ CLUB (clubs)
**Atributos:**
- id: BIGINT (PK) AUTO_INCREMENT
- uid: UUID UNIQUE NOT NULL
- slug: VARCHAR(255) UNIQUE NOT NULL
- nombre: VARCHAR(100) NOT NULL
- descripcion: TEXT
- deporte: VARCHAR(100)
- imagen: TEXT
- entrenador_id: BIGINT (FK → Usuario)
- max_miembros: INTEGER NOT NULL DEFAULT 20
- nivel: VARCHAR(50) [principiante, intermedio, avanzado]
- precio_mensual: DECIMAL(10,2) NOT NULL
- status: VARCHAR(50) NOT NULL DEFAULT 'activo' [activo, inactivo, completo, eliminado]
- is_active: BOOLEAN NOT NULL DEFAULT TRUE
- created_at: TIMESTAMP NOT NULL
- updated_at: TIMESTAMP NOT NULL

**Relaciones:**
- 🔗 MANY-TO-ONE → Usuario (entrenador)
- 🔗 ONE-TO-MANY → Reserva
- 🔗 MANY-TO-MANY → Usuario (miembros, vía ClubMiembro)

---

### 4️⃣ CLASE_PUBLICA (clases_publicas)
**Atributos:**
- id: BIGINT (PK) AUTO_INCREMENT
- uid: UUID UNIQUE NOT NULL
- slug: VARCHAR(255) UNIQUE NOT NULL
- nombre: VARCHAR(100) NOT NULL
- descripcion: TEXT
- imagen: TEXT
- entrenador_id: BIGINT (FK → Usuario)
- pista_id: BIGINT (FK → Pista)
- fecha_hora_inicio: TIMESTAMP NOT NULL
- fecha_hora_fin: TIMESTAMP NOT NULL
- duracion_minutos: INTEGER NOT NULL
- max_participantes: INTEGER NOT NULL DEFAULT 15
- precio: DECIMAL(10,2) NOT NULL
- nivel: VARCHAR(50) [principiante, intermedio, avanzado]
- deporte: VARCHAR(100)
- status: VARCHAR(50) NOT NULL DEFAULT 'programada' [programada, en_curso, finalizada, cancelada, eliminado]
- is_active: BOOLEAN NOT NULL DEFAULT TRUE
- created_at: TIMESTAMP NOT NULL
- updated_at: TIMESTAMP NOT NULL
- **CONSTRAINT**: fecha_hora_inicio < fecha_hora_fin

**Relaciones:**
- 🔗 MANY-TO-ONE → Usuario (entrenador)
- 🔗 MANY-TO-ONE → Pista
- 🔗 MANY-TO-MANY → Usuario (participantes, vía ClaseInscripcion)

---

### 5️⃣ RESERVA (reservas)
**Atributos:**
- id: BIGINT (PK) AUTO_INCREMENT
- uid: UUID UNIQUE NOT NULL
- slug: VARCHAR(255) UNIQUE NOT NULL
- pista_id: BIGINT (FK → Pista) NOT NULL
- usuario_id: BIGINT (FK → Usuario) NOT NULL
- club_id: BIGINT (FK → Club)
- fecha_hora_inicio: TIMESTAMP NOT NULL
- fecha_hora_fin: TIMESTAMP NOT NULL
- precio: DECIMAL(10,2) NOT NULL
- metodo_pago: VARCHAR(50)
- status: VARCHAR(50) NOT NULL DEFAULT 'confirmada' [pendiente, confirmada, cancelada, completada, eliminado]
- is_active: BOOLEAN NOT NULL DEFAULT TRUE
- notas: TEXT
- tipo_reserva: VARCHAR(50) DEFAULT 'individual' [individual, club]
- cancelled_at: TIMESTAMP
- cancel_reason: TEXT
- refund_status: VARCHAR(50) [no_aplica, pendiente, procesado, rechazado]
- refund_amount: DECIMAL(10,2)
- created_at: TIMESTAMP NOT NULL
- updated_at: TIMESTAMP NOT NULL
- **CONSTRAINT**: fecha_hora_inicio < fecha_hora_fin

**Relaciones:**
- 🔗 MANY-TO-ONE → Pista
- 🔗 MANY-TO-ONE → Usuario
- 🔗 MANY-TO-ONE → Club (opcional)

---

### 6️⃣ CLUB_MIEMBRO (club_miembros) [TABLA INTERMEDIA Many-to-Many]
**Atributos:**
- id: BIGINT (PK) AUTO_INCREMENT
- uid: UUID UNIQUE NOT NULL
- club_id: BIGINT (FK → Club) NOT NULL
- usuario_id: BIGINT (FK → Usuario) NOT NULL
- status: VARCHAR(50) NOT NULL DEFAULT 'activo' [activo, inactivo, expulsado, eliminado]
- is_active: BOOLEAN NOT NULL DEFAULT TRUE
- fecha_inscripcion: TIMESTAMP NOT NULL
- fecha_baja: TIMESTAMP
- created_at: TIMESTAMP NOT NULL
- updated_at: TIMESTAMP NOT NULL
- UNIQUE(club_id, usuario_id)

**Relaciones:**
- 🔗 MANY-TO-ONE → Club
- 🔗 MANY-TO-ONE → Usuario

---

### 7️⃣ CLASE_INSCRIPCION (clase_inscripciones) [TABLA INTERMEDIA Many-to-Many]
**Atributos:**
- id: BIGINT (PK) AUTO_INCREMENT
- uid: UUID UNIQUE NOT NULL
- clase_id: BIGINT (FK → ClasePublica) NOT NULL
- usuario_id: BIGINT (FK → Usuario) NOT NULL
- status: VARCHAR(50) NOT NULL DEFAULT 'confirmada' [confirmada, cancelada, asistio, ausente, eliminado]
- is_active: BOOLEAN NOT NULL DEFAULT TRUE
- precio_pagado: DECIMAL(10,2) NOT NULL
- metodo_pago: VARCHAR(50)
- fecha_inscripcion: TIMESTAMP NOT NULL
- cancelled_at: TIMESTAMP
- cancel_reason: TEXT
- refund_status: VARCHAR(50) [no_aplica, pendiente, procesado, rechazado]
- refund_amount: DECIMAL(10,2)
- created_at: TIMESTAMP NOT NULL
- updated_at: TIMESTAMP NOT NULL
- UNIQUE(clase_id, usuario_id)

**Relaciones:**
- 🔗 MANY-TO-ONE → ClasePublica
- 🔗 MANY-TO-ONE → Usuario

---

## 🔗 RESUMEN DE RELACIONES

### USUARIO (centro del sistema)
```
Usuario 1 ──── N Club (como entrenador)
Usuario 1 ──── N ClasePublica (como entrenador)
Usuario 1 ──── N Reserva (como cliente)
Usuario N ──── N Club (como miembro, vía ClubMiembro)
Usuario N ──── N ClasePublica (como participante, vía ClaseInscripcion)
```

### PISTA
```
Pista 1 ──── N Reserva
Pista 1 ──── N ClasePublica
```

### CLUB
```
Club N ──── 1 Usuario (entrenador)
Club 1 ──── N Reserva
Club N ──── N Usuario (miembros, vía ClubMiembro)
```

### CLASE_PUBLICA
```
ClasePublica N ──── 1 Usuario (entrenador)
ClasePublica N ──── 1 Pista
ClasePublica N ──── N Usuario (participantes, vía ClaseInscripcion)
```

### RESERVA
```
Reserva N ──── 1 Pista
Reserva N ──── 1 Usuario
Reserva N ──── 1 Club (opcional)
```

---

## 📈 CARDINALIDADES COMPLETAS

| Relación | Tipo | Desde | Hacia | Cardinalidad |
|----------|------|-------|-------|--------------|
| Entrenar Club | 1:N | Usuario | Club | Un usuario puede entrenar varios clubs |
| Impartir Clase | 1:N | Usuario | ClasePublica | Un usuario puede impartir varias clases |
| Hacer Reserva | 1:N | Usuario | Reserva | Un usuario puede hacer varias reservas |
| Miembro de Club | N:M | Usuario | Club | Usuarios pueden ser miembros de varios clubs, clubs tienen varios miembros |
| Participar en Clase | N:M | Usuario | ClasePublica | Usuarios pueden inscribirse en varias clases, clases tienen varios participantes |
| Reservar Pista | 1:N | Pista | Reserva | Una pista puede tener varias reservas |
| Clase en Pista | 1:N | Pista | ClasePublica | Una pista puede alojar varias clases |
| Reserva de Club | 1:N | Club | Reserva | Un club puede tener varias reservas |
| Reserva por Usuario | 1:N | Usuario | Reserva | Un usuario hace varias reservas |

---

## 🔑 CLAVES FORÁNEAS (Foreign Keys)

1. **clubs.entrenador_id** → usuarios.id (ON DELETE SET NULL)
2. **clases_publicas.entrenador_id** → usuarios.id (ON DELETE SET NULL)
3. **clases_publicas.pista_id** → pistas.id (ON DELETE SET NULL)
4. **reservas.pista_id** → pistas.id (ON DELETE CASCADE)
5. **reservas.usuario_id** → usuarios.id (ON DELETE CASCADE)
6. **reservas.club_id** → clubs.id (ON DELETE SET NULL)
7. **club_miembros.club_id** → clubs.id (ON DELETE CASCADE)
8. **club_miembros.usuario_id** → usuarios.id (ON DELETE CASCADE)
9. **clase_inscripciones.clase_id** → clases_publicas.id (ON DELETE CASCADE)
10. **clase_inscripciones.usuario_id** → usuarios.id (ON DELETE CASCADE)

---

## 📋 ÍNDICES PARA OPTIMIZACIÓN

```sql
-- Usuarios
idx_usuarios_email ON usuarios(email)
idx_usuarios_role ON usuarios(role)
idx_usuarios_status ON usuarios(status)

-- Pistas
idx_pistas_status ON pistas(status)

-- Clubs
idx_clubs_entrenador ON clubs(entrenador_id)

-- Clases Públicas
idx_clases_entrenador ON clases_publicas(entrenador_id)
idx_clases_pista ON clases_publicas(pista_id)

-- Reservas
idx_reservas_pista ON reservas(pista_id)
idx_reservas_usuario ON reservas(usuario_id)
idx_reservas_fecha ON reservas(fecha_hora_inicio)

-- Club Miembros
idx_club_miembros_club ON club_miembros(club_id)
idx_club_miembros_usuario ON club_miembros(usuario_id)

-- Clase Inscripciones
idx_clase_inscripciones_clase ON clase_inscripciones(clase_id)
idx_clase_inscripciones_usuario ON clase_inscripciones(usuario_id)
```

---

## 🎯 DIAGRAMA ASCII COMPLETO

```
┌─────────────────┐
│    USUARIO      │
│ ─────────────── │
│ id (PK)         │──┐
│ uid             │  │
│ slug            │  │ 1:N (entrenador)
│ nombre          │  │
│ email           │  ├─────────────┐
│ role            │  │             ↓
│ status          │  │      ┌──────────────┐
│ ...             │  │      │     CLUB     │
└─────────────────┘  │      │ ──────────── │
        │            │      │ id (PK)      │
        │            │      │ entrenador_id│──┐
        │ 1:N        │      │ nombre       │  │
        │            │      │ deporte      │  │ 1:N
        ↓            │      │ status       │  │
┌─────────────────┐  │      └──────────────┘  │
│    RESERVA      │  │             │           │
│ ─────────────── │  │             │ N:M       ↓
│ id (PK)         │  │             │      ┌────────────────┐
│ pista_id (FK)   │  │             │      │ CLUB_MIEMBRO   │
│ usuario_id (FK) │──┘             │      │ ────────────── │
│ club_id (FK)    │────────────────┘      │ id (PK)        │
│ fecha_inicio    │                       │ club_id (FK)   │
│ status          │                       │ usuario_id (FK)│
└─────────────────┘                       │ status         │
        ↑                                  └────────────────┘
        │ N:1
        │
┌─────────────────┐          1:N      ┌──────────────────────┐
│     PISTA       │──────────────────→ │   CLASE_PUBLICA      │
│ ─────────────── │                    │ ──────────────────── │
│ id (PK)         │                    │ id (PK)              │
│ nombre          │                    │ pista_id (FK)        │
│ tipo            │                    │ entrenador_id (FK)───┘ (desde USUARIO)
│ precio_hora     │                    │ fecha_hora_inicio    │
│ status          │                    │ max_participantes    │
└─────────────────┘                    │ status               │
                                       └──────────────────────┘
                                              │
                                              │ N:M
                                              ↓
                                       ┌─────────────────────────┐
                                       │  CLASE_INSCRIPCION      │
                                       │ ─────────────────────── │
                                       │ id (PK)                 │
                                       │ clase_id (FK)           │
                                       │ usuario_id (FK)─────────┘ (hacia USUARIO)
                                       │ precio_pagado           │
                                       │ status                  │
                                       └─────────────────────────┘
```

---

## ✅ VALIDACIONES Y REGLAS DE NEGOCIO

### SOFT DELETE (todas las entidades):
- status puede ser 'eliminado'
- is_active puede ser FALSE
- No se borra físicamente, se marca como eliminado

### CONSTRAINTS:
- **usuarios**: email UNIQUE, dni UNIQUE, role IN (admin, cliente, entrenador)
- **pistas**: slug UNIQUE, status IN (disponible, mantenimiento, eliminado)
- **clubs**: slug UNIQUE, UNIQUE(club_id, usuario_id) en club_miembros
- **clases_publicas**: slug UNIQUE, UNIQUE(clase_id, usuario_id) en clase_inscripciones
- **reservas**: slug UNIQUE, tipo_reserva IN (individual, club)

### CASCADAS:
- Eliminar PISTA → CASCADE en Reservas
- Eliminar USUARIO → CASCADE en Reservas
- Eliminar CLUB → SET NULL en Reservas
- Eliminar ENTRENADOR → SET NULL en Clubs/Clases

---

---

### 8️⃣ EVENTO_PISTA (eventos_pista) [CONTROL DE SOLAPES]
**Atributos:**
- id: BIGINT (PK) AUTO_INCREMENT
- uid: UUID UNIQUE NOT NULL
- pista_id: BIGINT (FK → Pista) NOT NULL
- tipo_evento: VARCHAR(50) NOT NULL [reserva, clase, mantenimiento, bloqueo]
- reserva_id: BIGINT (FK → Reserva) NULL
- clase_publica_id: BIGINT (FK → ClasePublica) NULL
- fecha_hora_inicio: TIMESTAMP NOT NULL
- fecha_hora_fin: TIMESTAMP NOT NULL
- status: VARCHAR(50) NOT NULL DEFAULT 'confirmado' [confirmado, cancelado, eliminado]
- is_active: BOOLEAN NOT NULL DEFAULT TRUE
- created_at: TIMESTAMP NOT NULL
- updated_at: TIMESTAMP NOT NULL
- **CONSTRAINT**: fecha_hora_inicio < fecha_hora_fin
- **CONSTRAINT**: CHECK ((tipo_evento = 'reserva' AND reserva_id IS NOT NULL AND clase_publica_id IS NULL) OR (tipo_evento = 'clase' AND clase_publica_id IS NOT NULL AND reserva_id IS NULL) OR (tipo_evento IN ('mantenimiento', 'bloqueo') AND reserva_id IS NULL AND clase_publica_id IS NULL))

**Relaciones:**
- 🔗 MANY-TO-ONE → Pista
- 🔗 MANY-TO-ONE → Reserva (opcional)
- 🔗 MANY-TO-ONE → ClasePublica (opcional)

**Propósito:** Evitar solapes de agenda. Antes de crear reserva/clase, verificar que no hay eventos activos en ese rango horario.

---

### 9️⃣ PAGO (pagos) [TRAZABILIDAD DE PAGOS]
**Atributos:**
- id: BIGINT (PK) AUTO_INCREMENT
- uid: UUID UNIQUE NOT NULL
- usuario_id: BIGINT (FK → Usuario) NOT NULL
- reserva_id: BIGINT (FK → Reserva) NULL
- clase_inscripcion_id: BIGINT (FK → ClaseInscripcion) NULL
- club_suscripcion_id: BIGINT (FK → ClubSuscripcion) NULL
- amount: DECIMAL(10,2) NOT NULL
- currency: VARCHAR(3) NOT NULL DEFAULT 'EUR'
- provider: VARCHAR(50) [stripe, paypal, efectivo, transferencia]
- provider_payment_id: VARCHAR(255)
- status: VARCHAR(50) NOT NULL DEFAULT 'pendiente' [pendiente, completado, fallido, reembolsado]
- is_active: BOOLEAN NOT NULL DEFAULT TRUE
- created_at: TIMESTAMP NOT NULL
- updated_at: TIMESTAMP NOT NULL
- **CONSTRAINT**: Exactamente uno de (reserva_id, clase_inscripcion_id, club_suscripcion_id) debe estar lleno

**Relaciones:**
- 🔗 MANY-TO-ONE → Usuario
- 🔗 MANY-TO-ONE → Reserva (opcional)
- 🔗 MANY-TO-ONE → ClaseInscripcion (opcional)
- 🔗 MANY-TO-ONE → ClubSuscripcion (opcional)

---

### 🔟 CLUB_SUSCRIPCION (club_suscripciones) [COBROS RECURRENTES]
**Atributos:**
- id: BIGINT (PK) AUTO_INCREMENT
- uid: UUID UNIQUE NOT NULL
- club_miembro_id: BIGINT (FK → ClubMiembro) NOT NULL
- fecha_inicio: DATE NOT NULL
- fecha_fin: DATE
- precio_mensual: DECIMAL(10,2) NOT NULL
- status: VARCHAR(50) NOT NULL DEFAULT 'activa' [activa, pausada, cancelada, vencida, impago]
- is_active: BOOLEAN NOT NULL DEFAULT TRUE
- proximo_cobro: DATE NOT NULL
- intentos_cobro: INTEGER DEFAULT 0
- ultimo_pago_id: BIGINT (FK → Pago)
- created_at: TIMESTAMP NOT NULL
- updated_at: TIMESTAMP NOT NULL

**Relaciones:**
- 🔗 MANY-TO-ONE → ClubMiembro
- 🔗 MANY-TO-ONE → Pago (último pago)
- 🔗 ONE-TO-MANY → Pago (historial de pagos)

---

### 1️⃣1️⃣ CLASE_WAITLIST (clase_waitlist) [LISTA DE ESPERA]
**Atributos:**
- id: BIGINT (PK) AUTO_INCREMENT
- uid: UUID UNIQUE NOT NULL
- clase_id: BIGINT (FK → ClasePublica) NOT NULL
- usuario_id: BIGINT (FK → Usuario) NOT NULL
- posicion: INTEGER NOT NULL
- status: VARCHAR(50) NOT NULL DEFAULT 'esperando' [esperando, notificado, convertido, cancelado, expirado]
- is_active: BOOLEAN NOT NULL DEFAULT TRUE
- fecha_registro: TIMESTAMP NOT NULL
- fecha_notificacion: TIMESTAMP
- fecha_expiracion: TIMESTAMP
- created_at: TIMESTAMP NOT NULL
- updated_at: TIMESTAMP NOT NULL
- UNIQUE(clase_id, usuario_id)

**Relaciones:**
- 🔗 MANY-TO-ONE → ClasePublica
- 🔗 MANY-TO-ONE → Usuario

**Propósito:** Cuando una clase alcanza max_participantes, los siguientes interesados entran en lista de espera ordenada por posición.

---

## 🔗 RESUMEN DE RELACIONES ACTUALIZADO

### USUARIO (centro del sistema)
```
Usuario 1 ──── N Club (como entrenador)
Usuario 1 ──── N ClasePublica (como entrenador)
Usuario 1 ──── N Reserva (como usuario)
Usuario 1 ──── N Pago
Usuario 1 ──── N ClaseWaitlist
Usuario N ──── N Club (como miembro, vía ClubMiembro)
Usuario N ──── N ClasePublica (como participante, vía ClaseInscripcion)
```

### PISTA
```
Pista 1 ──── N Reserva
Pista 1 ──── N ClasePublica
Pista 1 ──── N EventoPista (control de solapes)
```

### CLUB
```
Club N ──── 1 Usuario (entrenador)
Club 1 ──── N Reserva
Club N ──── N Usuario (miembros, vía ClubMiembro)
ClubMiembro 1 ──── N ClubSuscripcion
```

### CLASE_PUBLICA
```
ClasePublica N ──── 1 Usuario (entrenador)
ClasePublica N ──── 1 Pista
ClasePublica N ──── N Usuario (participantes, vía ClaseInscripcion)
ClasePublica 1 ──── N ClaseWaitlist (lista de espera)
ClasePublica 1 ──── N EventoPista (bloqueo de agenda)
```

### RESERVA
```
Reserva N ──── 1 Pista
Reserva N ──── 1 Usuario
Reserva N ──── 1 Club (opcional)
Reserva 1 ──── N EventoPista (bloqueo de agenda)
Reserva 1 ──── N Pago
```

### NUEVAS ENTIDADES
```
EventoPista N ──── 1 Pista
EventoPista N ──── 1 Reserva (opcional)
EventoPista N ──── 1 ClasePublica (opcional)

Pago N ──── 1 Usuario
Pago N ──── 1 Reserva (opcional)
Pago N ──── 1 ClaseInscripcion (opcional)
Pago N ──── 1 ClubSuscripcion (opcional)

ClubSuscripcion N ──── 1 ClubMiembro
ClubSuscripcion 1 ──── N Pago

ClaseWaitlist N ──── 1 ClasePublica
ClaseWaitlist N ──── 1 Usuario
```

---

## 📈 CARDINALIDADES COMPLETAS ACTUALIZADO

| Relación | Tipo | Desde | Hacia | Cardinalidad |
|----------|------|-------|-------|--------------|
| Entrenar Club | 1:N | Usuario | Club | Un usuario puede entrenar varios clubs |
| Impartir Clase | 1:N | Usuario | ClasePublica | Un usuario puede impartir varias clases |
| Hacer Reserva | 1:N | Usuario | Reserva | Un usuario puede hacer varias reservas |
| Realizar Pago | 1:N | Usuario | Pago | Un usuario puede hacer varios pagos |
| Esperar Clase | 1:N | Usuario | ClaseWaitlist | Un usuario puede estar en varias listas de espera |
| Miembro de Club | N:M | Usuario | Club | Usuarios pueden ser miembros de varios clubs |
| Participar en Clase | N:M | Usuario | ClasePublica | Usuarios pueden inscribirse en varias clases |
| Reservar Pista | 1:N | Pista | Reserva | Una pista puede tener varias reservas |
| Clase en Pista | 1:N | Pista | ClasePublica | Una pista puede alojar varias clases |
| Eventos de Pista | 1:N | Pista | EventoPista | Una pista tiene varios eventos para evitar solapes |
| Reserva de Club | 1:N | Club | Reserva | Un club puede tener varias reservas |
| Suscripción de Miembro | 1:N | ClubMiembro | ClubSuscripcion | Un miembro puede tener varias suscripciones |
| Lista de Espera | 1:N | ClasePublica | ClaseWaitlist | Una clase puede tener varios usuarios en espera |
| Pagos de Suscripción | 1:N | ClubSuscripcion | Pago | Una suscripción genera varios pagos mensuales |

---

## 🔑 CLAVES FORÁNEAS (Foreign Keys) ACTUALIZADO

1. **clubs.entrenador_id** → usuarios.id (ON DELETE SET NULL)
2. **clases_publicas.entrenador_id** → usuarios.id (ON DELETE SET NULL)
3. **clases_publicas.pista_id** → pistas.id (ON DELETE SET NULL)
4. **reservas.pista_id** → pistas.id (ON DELETE CASCADE)
5. **reservas.usuario_id** → usuarios.id (ON DELETE CASCADE)
6. **reservas.club_id** → clubs.id (ON DELETE SET NULL)
7. **club_miembros.club_id** → clubs.id (ON DELETE CASCADE)
8. **club_miembros.usuario_id** → usuarios.id (ON DELETE CASCADE)
9. **clase_inscripciones.clase_id** → clases_publicas.id (ON DELETE CASCADE)
10. **clase_inscripciones.usuario_id** → usuarios.id (ON DELETE CASCADE)
11. **eventos_pista.pista_id** → pistas.id (ON DELETE CASCADE)
12. **eventos_pista.reserva_id** → reservas.id (ON DELETE CASCADE)
13. **eventos_pista.clase_publica_id** → clases_publicas.id (ON DELETE CASCADE)
14. **pagos.usuario_id** → usuarios.id (ON DELETE CASCADE)
15. **pagos.reserva_id** → reservas.id (ON DELETE SET NULL)
16. **pagos.clase_inscripcion_id** → clase_inscripciones.id (ON DELETE SET NULL)
17. **pagos.club_suscripcion_id** → club_suscripciones.id (ON DELETE SET NULL)
18. **club_suscripciones.club_miembro_id** → club_miembros.id (ON DELETE CASCADE)
19. **club_suscripciones.ultimo_pago_id** → pagos.id (ON DELETE SET NULL)
20. **clase_waitlist.clase_id** → clases_publicas.id (ON DELETE CASCADE)
21. **clase_waitlist.usuario_id** → usuarios.id (ON DELETE CASCADE)

---

## 📋 ÍNDICES PARA OPTIMIZACIÓN ACTUALIZADO

```sql
-- Usuarios
idx_usuarios_email ON usuarios(email)
idx_usuarios_role ON usuarios(role)
idx_usuarios_status ON usuarios(status)

-- Pistas
idx_pistas_status ON pistas(status)

-- Clubs
idx_clubs_entrenador ON clubs(entrenador_id)

-- Clases Públicas
idx_clases_entrenador ON clases_publicas(entrenador_id)
idx_clases_pista ON clases_publicas(pista_id)

-- Reservas
idx_reservas_pista ON reservas(pista_id)
idx_reservas_usuario ON reservas(usuario_id)
idx_reservas_fecha ON reservas(fecha_hora_inicio)

-- Club Miembros
idx_club_miembros_club ON club_miembros(club_id)
idx_club_miembros_usuario ON club_miembros(usuario_id)

-- Clase Inscripciones
idx_clase_inscripciones_clase ON clase_inscripciones(clase_id)
idx_clase_inscripciones_usuario ON clase_inscripciones(usuario_id)

-- Eventos Pista (CRÍTICO para evitar solapes)
idx_eventos_pista_pista ON eventos_pista(pista_id)
idx_eventos_pista_fecha_inicio ON eventos_pista(fecha_hora_inicio)
idx_eventos_pista_fecha_fin ON eventos_pista(fecha_hora_fin)
idx_eventos_pista_rango ON eventos_pista(pista_id, fecha_hora_inicio, fecha_hora_fin)
idx_eventos_pista_solapes ON eventos_pista(pista_id, status, is_active, fecha_hora_inicio, fecha_hora_fin)

-- Pagos
idx_pagos_usuario ON pagos(usuario_id)
idx_pagos_reserva ON pagos(reserva_id)
idx_pagos_clase_inscripcion ON pagos(clase_inscripcion_id)
idx_pagos_club_suscripcion ON pagos(club_suscripcion_id)
idx_pagos_status ON pagos(status)
idx_pagos_usuario_status ON pagos(usuario_id, status)

-- Club Suscripciones
idx_club_suscripciones_miembro ON club_suscripciones(club_miembro_id)
idx_club_suscripciones_proximo_cobro ON club_suscripciones(proximo_cobro)
idx_club_suscripciones_status ON club_suscripciones(status)

-- Clase Waitlist
idx_clase_waitlist_clase ON clase_waitlist(clase_id)
idx_clase_waitlist_usuario ON clase_waitlist(usuario_id)
idx_clase_waitlist_posicion ON clase_waitlist(clase_id, posicion)
```

---

## ✅ VALIDACIONES Y REGLAS DE NEGOCIO ACTUALIZADO

### SOFT DELETE (todas las entidades):
- status puede ser 'eliminado'
- is_active puede ser FALSE
- No se borra físicamente, se marca como eliminado
- **NOTA**: Los CASCADE en FKs permiten borrado físico administrativo/purga de datos antiguos. En operaciones normales se usa soft delete.

### CONTROL DE SOLAPES (eventos_pista):
```sql
-- Antes de crear Reserva o ClasePublica, verificar:
-- Hay solape si: nuevo_inicio < fin_existente AND nuevo_fin > inicio_existente
SELECT COUNT(*) FROM eventos_pista 
WHERE pista_id = ? 
AND is_active = TRUE
AND status = 'confirmado'
AND (fecha_hora_inicio < ? AND fecha_hora_fin > ?)
-- Parámetros: (pista_id, nuevo_fin, nuevo_inicio)
-- Si COUNT > 0 → HAY SOLAPE, rechazar
```

### CANCELACIONES Y DEVOLUCIONES:
**Reservas:**
- cancelled_at: TIMESTAMP
- cancel_reason: TEXT
- refund_status: VARCHAR(50) [no_aplica, pendiente, procesado, rechazado]
- refund_amount: DECIMAL(10,2)

**ClaseInscripcion:**
- cancelled_at: TIMESTAMP
- cancel_reason: TEXT
- refund_status: VARCHAR(50)
- refund_amount: DECIMAL(10,2)

### CONTROL DE AFORO (clases_publicas):
```sql
-- Antes de inscribir a un usuario:
SELECT COUNT(*) FROM clase_inscripciones 
WHERE clase_id = ? AND is_active = TRUE AND status = 'confirmada'

-- Si COUNT >= max_participantes → Añadir a clase_waitlist
-- Si COUNT < max_participantes → Inscribir directamente
```

### LISTA DE ESPERA (clase_waitlist):
- Al cancelar una inscripción confirmada:
  1. Buscar primer usuario en waitlist (posicion ASC, status='esperando')
  2. Notificar al usuario (status='notificado', fecha_notificacion=NOW())
  3. Establecer fecha_expiracion (ej: +24 horas)
  4. Si acepta → crear inscripción, status='convertido'
  5. Si rechaza/expira → siguiente en lista

### SUSCRIPCIONES (club_suscripciones):
- Cron job diario: verificar proximo_cobro <= HOY
- Intentar cobro → crear registro en pagos
- Si éxito: actualizar ultimo_pago_id, proximo_cobro += 1 mes, intentos_cobro = 0
- Si fallo: intentos_cobro += 1
- Si intentos_cobro > 3 → status = 'impago', notificar, suspender acceso

### CONSTRAINTS:
- **usuarios**: email UNIQUE, dni UNIQUE, role IN (admin, cliente, entrenador)
- **pistas**: slug UNIQUE, status IN (disponible, mantenimiento, eliminado)
- **clubs**: slug UNIQUE, UNIQUE(club_id, usuario_id) en club_miembros
- **clases_publicas**: slug UNIQUE, UNIQUE(clase_id, usuario_id) en clase_inscripciones, fecha_hora_inicio < fecha_hora_fin
- **reservas**: slug UNIQUE, tipo_reserva IN (individual, club), fecha_hora_inicio < fecha_hora_fin
- **eventos_pista**: NO puede haber 2 eventos activos con rango solapado en misma pista, fecha_hora_inicio < fecha_hora_fin, CHECK ((tipo_evento = 'reserva' AND reserva_id IS NOT NULL AND clase_publica_id IS NULL) OR (tipo_evento = 'clase' AND clase_publica_id IS NOT NULL AND reserva_id IS NULL) OR (tipo_evento IN ('mantenimiento', 'bloqueo') AND reserva_id IS NULL AND clase_publica_id IS NULL))
- **pagos**: CHECK ((reserva_id IS NOT NULL AND clase_inscripcion_id IS NULL AND club_suscripcion_id IS NULL) OR (reserva_id IS NULL AND clase_inscripcion_id IS NOT NULL AND club_suscripcion_id IS NULL) OR (reserva_id IS NULL AND clase_inscripcion_id IS NULL AND club_suscripcion_id IS NOT NULL))
- **clase_waitlist**: UNIQUE(clase_id, usuario_id), posicion ordenada

### CASCADAS (solo para purga administrativa):
- Eliminar PISTA físicamente → CASCADE en Reservas, EventosPista
- Eliminar USUARIO físicamente → CASCADE en Reservas, Pagos
- Eliminar RESERVA físicamente → CASCADE en EventosPista asociados
- Eliminar CLASE_PUBLICA físicamente → CASCADE en EventosPista asociados
- Eliminar CLUB → SET NULL en Reservas
- Eliminar ENTRENADOR → SET NULL en Clubs/Clases
- Eliminar CLUB_MIEMBRO → CASCADE en ClubSuscripciones

---

## 📊 ESTADÍSTICAS DEL MODELO ACTUALIZADO

- **Total Entidades**: 11 (7 base + 4 nuevas)
- **Relaciones 1:N**: 19 (eliminadas polimórficas, añadidas FKs directas)
- **Relaciones N:M**: 2 (implementadas con tablas intermedias)
- **Relaciones Polimórficas**: 0 (eliminadas por seguridad)
- **Foreign Keys**: 21
- **Índices**: 33
- **Campos con UNIQUE**: 15
- **Campos con DEFAULT**: 25
- **Constraints de fechas**: 3 (reservas, clases, eventos)
- **Constraints de exclusividad**: 2 (eventos_pista, pagos)
- **Timestamps automáticos**: Todas las entidades tienen created_at/updated_at
- **Control de solapes**: ✅ eventos_pista con lógica correcta
- **Trazabilidad de pagos**: ✅ pagos con FKs directas
- **Cobros recurrentes**: ✅ club_suscripciones
- **Lista de espera**: ✅ clase_waitlist
- **Cancelaciones y devoluciones**: ✅ Campos añadidos a reservas/inscripciones
