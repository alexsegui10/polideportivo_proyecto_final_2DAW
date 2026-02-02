# 📝 EXPLICACIÓN: SOFT-DELETE EN EMOTIVA POLI

## ¿Qué es el Soft-Delete?

El **soft-delete** (eliminación lógica) es un patrón de diseño donde **NO se eliminan físicamente los registros** de la base de datos. En lugar de hacer `DELETE FROM usuarios WHERE id = 1`, simplemente marcamos el registro como "inactivo" con un campo booleano `is_active = false`.

---

## ❓ Pregunta 1: ¿Por qué al eliminar un usuario NO se muestra?

### Respuesta Corta
**Se implementa en el BACKEND (capa de servicio)**, no en el frontend.

### Respuesta Detallada

#### 🔍 Dónde ocurre el filtrado

**Backend** (`UsuarioService.java`):
```java
@Service
public class UsuarioService {
    
    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll()
            .stream()
            .filter(Usuario::getIsActive)  // ⬅️ AQUÍ SE FILTRA
            .map(usuarioMapper::toDTO)
            .collect(Collectors.toList());
    }
}
```

#### 📊 Flujo Completo

```
1. Frontend hace: GET http://localhost:8080/api/usuarios

2. UsuarioRouter recibe la request
   └─> Delega a UsuarioController
       └─> Controller llama a UsuarioService.getAllUsuarios()
       
3. Service ejecuta:
   usuarioRepository.findAll()  → Devuelve TODOS (activos e inactivos)
   .filter(Usuario::getIsActive) → FILTRA solo is_active = true
   .map(usuarioMapper::toDTO)    → Convierte a DTO
   
4. Controller devuelve ResponseEntity.ok(usuarios)

5. Frontend recibe SOLO usuarios activos
   └─> No necesita filtrar nada
   └─> Los usuarios eliminados NUNCA llegan
```

#### 💾 ¿Qué hay en la Base de Datos?

```sql
SELECT id, nombre, email, is_active FROM usuarios;

-- Resultado:
-- id | nombre        | email                | is_active
-- 1  | Admin         | admin@emotiva.com    | true      ← SE ENVÍA
-- 2  | Juan Pérez    | juan@email.com       | true      ← SE ENVÍA  
-- 3  | María García  | maria@email.com      | false     ← NO SE ENVÍA (eliminado)
-- 4  | Pedro López   | pedro@email.com      | true      ← SE ENVÍA
```

**El backend solo envía los IDs 1, 2 y 4**. María García (ID 3) existe en la DB pero **NO se envía al frontend**.

#### 🎯 Frontend NO necesita filtrar

```typescript
// hooks/queries/useUsuarios.ts
export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  
  const fetchUsuarios = async () => {
    const data = await getUsuarios();  // Ya viene filtrado
    setUsuarios(data);  // Solo usuarios activos
  };
  
  // NO HAY .filter() aquí porque el backend ya filtró
};
```

#### 🔄 ¿Cómo se "elimina" un usuario?

**Frontend** (`TablaUsuarios.tsx`):
```typescript
const handleEliminar = async (id: number) => {
  if (window.confirm('¿Estás seguro?')) {
    await deleteUsuario(id);  // PATCH /api/usuarios/1/soft-delete
    await refetch();           // Vuelve a pedir la lista
  }
};
```

**Backend** (`UsuarioService.java`):
```java
public void softDeleteUsuario(Long id) {
    Usuario usuario = usuarioRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    
    usuario.setIsActive(false);  // ⬅️ MARCA COMO INACTIVO
    usuario.setUpdatedAt(LocalDateTime.now());
    usuarioRepository.save(usuario);
    
    // NO se ejecuta DELETE, se ejecuta UPDATE
}
```

**SQL ejecutada**:
```sql
-- NO se ejecuta esto:
DELETE FROM usuarios WHERE id = 1;

-- Se ejecuta esto:
UPDATE usuarios 
SET is_active = false, updated_at = NOW()
WHERE id = 1;
```

---

## ❓ Pregunta 2: Si elimino y creo el mismo usuario, ¿da error por credenciales?

### Respuesta Corta
**NO**, porque la validación solo verifica usuarios **ACTIVOS**.

### Respuesta Detallada

#### ✅ Escenario Completo

**Paso 1: Crear usuario inicial**
```sql
INSERT INTO usuarios (nombre, email, dni, is_active)
VALUES ('Juan Pérez', 'juan@email.com', '12345678A', true);

-- Resultado: id = 5, is_active = true
```

**Paso 2: Eliminar usuario (soft-delete)**
```typescript
await deleteUsuario(5);  // Frontend
```

```java
// Backend
public void softDeleteUsuario(Long id) {
    usuario.setIsActive(false);  // ⬅️ Ahora is_active = false
    usuarioRepository.save(usuario);
}
```

```sql
-- SQL ejecutada:
UPDATE usuarios SET is_active = false WHERE id = 5;

-- Estado en DB:
-- id | nombre     | email           | dni       | is_active
-- 5  | Juan Pérez | juan@email.com  | 12345678A | false     ← Eliminado lógicamente
```

**Paso 3: Intentar crear usuario con mismo email/DNI**
```typescript
await createUsuario({
  nombre: 'Juan Pérez',
  email: 'juan@email.com',  // MISMO EMAIL
  dni: '12345678A',         // MISMO DNI
  // ...resto de datos
});
```

**Backend valida**:
```java
public UsuarioDTO createUsuario(UsuarioDTO usuarioDTO) {
    // Verificar EMAIL solo en usuarios ACTIVOS
    usuarioRepository.findByEmail("juan@email.com")
        .filter(Usuario::getIsActive)  // ⬅️ Filtra: is_active = true
        .ifPresent(u -> {
            throw new RuntimeException("Ya existe usuario activo con ese email");
        });
    // Usuario con ID 5 tiene is_active = false
    // .filter() lo descarta
    // .ifPresent() NO se ejecuta
    // ✅ NO lanza excepción
    
    // Verificar DNI solo en usuarios ACTIVOS
    usuarioRepository.findByDni("12345678A")
        .filter(Usuario::getIsActive)  // ⬅️ Filtra: is_active = true
        .ifPresent(u -> {
            throw new RuntimeException("Ya existe usuario activo con ese DNI");
        });
    // Usuario con ID 5 tiene is_active = false
    // .filter() lo descarta
    // .ifPresent() NO se ejecuta
    // ✅ NO lanza excepción
    
    // Crear nuevo usuario
    Usuario nuevoUsuario = usuarioMapper.toEntity(usuarioDTO);
    nuevoUsuario.setUid(UUID.randomUUID());
    nuevoUsuario.setIsActive(true);  // ⬅️ Nuevo usuario ACTIVO
    return usuarioMapper.toDTO(usuarioRepository.save(nuevoUsuario));
}
```

**Resultado**:
```sql
INSERT INTO usuarios (nombre, email, dni, is_active)
VALUES ('Juan Pérez', 'juan@email.com', '12345678A', true);

-- Nuevo registro: id = 6, is_active = true

-- Estado final en DB:
-- id | nombre     | email           | dni       | is_active
-- 5  | Juan Pérez | juan@email.com  | 12345678A | false     ← Viejo (eliminado)
-- 6  | Juan Pérez | juan@email.com  | 12345678A | true      ← Nuevo (activo)
```

#### ⚠️ Código INCORRECTO (lo que NO debes hacer)

**MAL**: Usar `existsBy` (no filtra):
```java
// ❌ ESTO ESTÁ MAL
if (usuarioRepository.existsByEmail(email)) {
    throw new RuntimeException("Email ya existe");
}
// Problema: existsBy encuentra TODOS los usuarios (activos e inactivos)
// Si hay uno inactivo con ese email, lanza error INCORRECTAMENTE
```

**BIEN**: Usar `findBy` + `filter`:
```java
// ✅ ESTO ESTÁ BIEN
usuarioRepository.findByEmail(email)
    .filter(Usuario::getIsActive)  // Solo activos
    .ifPresent(u -> {
        throw new RuntimeException("Email ya existe");
    });
// Solo lanza error si hay un usuario ACTIVO con ese email
```

---

## 🔧 Implementación Completa: Soft-Delete en Pistas

### 1. Backend

#### Entity
```java
@Entity
@Table(name = "pistas")
public class Pista {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    private String slug;
    private Boolean isActive = true;  // ⬅️ Campo clave
}
```

#### Repository
```java
public interface PistaRepository extends JpaRepository<Pista, Long> {
    Optional<Pista> findBySlug(String slug);
}
```

#### Service
```java
@Service
public class PistaService {
    
    // GET - Solo pistas activas
    public List<PistaResponse> getAllPistas() {
        return pistaRepository.findAll()
            .stream()
            .filter(Pista::getIsActive)  // ⬅️ FILTRO
            .map(pistaMapper::toResponse)
            .collect(Collectors.toList());
    }
    
    // POST - Verificar slug solo en activas
    public PistaResponse createPista(PistaRequest request) {
        pistaRepository.findBySlug(request.slug())
            .filter(Pista::getIsActive)  // ⬅️ Solo activas
            .ifPresent(p -> {
                throw new RuntimeException("Ya existe pista activa con ese slug");
            });
        
        Pista pista = pistaMapper.toEntity(request);
        pista.setIsActive(true);
        return pistaMapper.toResponse(pistaRepository.save(pista));
    }
    
    // PATCH - Soft delete (no DELETE)
    public void softDeletePista(Long id) {
        Pista pista = pistaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pista no encontrada"));
        
        pista.setIsActive(false);  // ⬅️ MARCA COMO INACTIVA
        pistaRepository.save(pista);
    }
}
```

#### Router
```java
@RestController
@RequestMapping("/api/pistas")
public class PistaRouter {
    
    @GetMapping
    public ResponseEntity<List<PistaResponse>> getAll() {
        return ResponseEntity.ok(pistaService.getAllPistas());
    }
    
    @PostMapping
    public ResponseEntity<PistaResponse> create(@RequestBody PistaRequest request) {
        return ResponseEntity.ok(pistaService.createPista(request));
    }
    
    @PatchMapping("/{id}/soft-delete")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        pistaService.softDeletePista(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 2. Frontend

#### Service
```typescript
// services/mutations/pistasMutations.ts
export const deletePista = async (id: number): Promise<void> => {
  await api.patch(`/api/pistas/${id}/soft-delete`);
};
```

#### Component
```typescript
// components/Admin/TablaPistas.tsx
export const TablaPistas = ({ onDelete }: Props) => {
  const { pistas } = usePistas();  // Solo pistas activas
  
  return (
    <Table>
      {pistas.map(pista => (
        <TableRow key={pista.id}>
          <TableCell>{pista.nombre}</TableCell>
          <IconButton onClick={() => onDelete(pista.id)}>
            <DeleteIcon />
          </IconButton>
        </TableRow>
      ))}
    </Table>
  );
};
```

---

## 📊 Comparación: Hard-Delete vs Soft-Delete

### Hard-Delete (Eliminación Física)
```sql
-- Se ejecuta:
DELETE FROM usuarios WHERE id = 5;

-- El registro DESAPARECE completamente
-- ❌ No se puede recuperar
-- ❌ Pierde historial
-- ❌ Rompe relaciones (si hay FK)
-- ❌ No se puede auditar
```

### Soft-Delete (Eliminación Lógica)
```sql
-- Se ejecuta:
UPDATE usuarios SET is_active = false WHERE id = 5;

-- El registro PERMANECE en la DB
-- ✅ Se puede recuperar (cambiar is_active = true)
-- ✅ Mantiene historial
-- ✅ No rompe relaciones
-- ✅ Se puede auditar
-- ✅ Permite reutilizar credenciales
```

---

## 🎯 Ventajas del Soft-Delete

1. **Auditoría**: Puedes saber quién se eliminó y cuándo
2. **Recuperación**: Puedes "des-eliminar" un registro
3. **Historial**: Mantienes el historial completo
4. **Integridad**: No rompes foreign keys
5. **Reutilización**: Puedes reutilizar emails/DNIs de usuarios eliminados
6. **Análisis**: Puedes hacer reportes de usuarios eliminados

---

## 🔍 Consultas SQL Útiles

### Ver todos los usuarios (incluyendo eliminados)
```sql
SELECT id, nombre, email, is_active 
FROM usuarios;
```

### Ver solo usuarios activos (lo que ve el frontend)
```sql
SELECT id, nombre, email 
FROM usuarios 
WHERE is_active = true;
```

### Ver solo usuarios eliminados
```sql
SELECT id, nombre, email, updated_at as fecha_eliminacion
FROM usuarios 
WHERE is_active = false;
```

### Recuperar un usuario eliminado
```sql
UPDATE usuarios 
SET is_active = true, updated_at = NOW()
WHERE id = 5;
```

### Contar usuarios activos vs eliminados
```sql
SELECT 
    COUNT(*) FILTER (WHERE is_active = true) as activos,
    COUNT(*) FILTER (WHERE is_active = false) as eliminados,
    COUNT(*) as total
FROM usuarios;
```

---

## ✅ Checklist: Implementar Soft-Delete

- [ ] Añadir columna `is_active BOOLEAN DEFAULT true` en la tabla
- [ ] Migración Flyway con `ALTER TABLE` si es tabla existente
- [ ] Entity con campo `private Boolean isActive = true;`
- [ ] Repository con métodos `findBy...` (NO `existsBy...`)
- [ ] Service con `.filter(Entity::getIsActive)` en todos los GET
- [ ] Service con verificación `filter(Entity::getIsActive)` en POST
- [ ] Endpoint `PATCH /{id}/soft-delete` (NO `DELETE /{id}`)
- [ ] Frontend con `api.patch()` en deleteFunction
- [ ] Probar: crear → eliminar → crear mismo recurso (debe funcionar)

---

## 🚨 Errores Comunes

### Error 1: Usar `existsBy` en validaciones
```java
// ❌ MAL
if (usuarioRepository.existsByEmail(email)) {
    throw new RuntimeException("Email ya existe");
}

// ✅ BIEN
usuarioRepository.findByEmail(email)
    .filter(Usuario::getIsActive)
    .ifPresent(u -> {
        throw new RuntimeException("Email ya existe");
    });
```

### Error 2: No filtrar en GET
```java
// ❌ MAL
public List<UsuarioDTO> getAllUsuarios() {
    return usuarioRepository.findAll()
        .stream()
        .map(usuarioMapper::toDTO)  // Devuelve TODOS
        .collect(Collectors.toList());
}

// ✅ BIEN
public List<UsuarioDTO> getAllUsuarios() {
    return usuarioRepository.findAll()
        .stream()
        .filter(Usuario::getIsActive)  // Solo activos
        .map(usuarioMapper::toDTO)
        .collect(Collectors.toList());
}
```

### Error 3: Filtrar en el frontend
```typescript
// ❌ MAL (el backend debería filtrar)
const usuariosActivos = usuarios.filter(u => u.isActive);

// ✅ BIEN (el backend ya filtró)
const { usuarios } = useUsuarios();  // Ya vienen filtrados
```

---

**Fecha**: 23 de enero de 2026  
**Versión**: 1.0
