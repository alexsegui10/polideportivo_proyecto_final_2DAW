# 📚 EXPLICACIÓN COMPLETA DEL FRONTEND - Paso a Paso

## 🎯 ARQUITECTURA GENERAL

```
Usuario → Componente → Hook → Service → Datos Mock
         (UI)        (Lógica) (API Fake)
```

---

## 📁 ESTRUCTURA DE CARPETAS

### 1️⃣ services/api.ts - DATOS Y FUNCIONES
**QUÉ HACE:** Almacena datos fake y funciones para obtenerlos

**PASO A PASO:**
```typescript
// PASO 1: Declarar arrays con datos simulados
export const usuariosMock = [...]  // Lista de usuarios fake
export const pistasMock = [...]    // Lista de pistas fake
export const reservasMock = [...]  // Lista de reservas fake

// PASO 2: Función para simular delay de red (como si fuera servidor)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// PASO 3: Función async que devuelve usuarios
export const getUsuarios = async () => {
  await delay(500)          // Espera 500ms (simula carga)
  return usuariosMock       // Devuelve el array
}

// PASO 4: Igual para pistas y reservas
export const getPistas = async () => { ... }
export const getReservas = async () => { ... }

// PASO 5: Crear nueva reserva
export const crearReserva = async (reserva: any) => {
  await delay(800)
  const nuevaReserva = { ...reserva, id: reservasMock.length + 1 }
  reservasMock.push(nuevaReserva)  // Añade al array
  return nuevaReserva
}
```

**FLUJO:**
1. Exportas arrays con datos
2. Creas funciones async que simulan peticiones
3. Usas `delay()` para simular tiempo de carga
4. Devuelves los datos

---

### 2️⃣ hooks/usePistas.ts - CARGAR PISTAS AUTOMÁTICAMENTE
**QUÉ HACE:** Hook que carga pistas cuando se monta el componente

**PASO A PASO:**
```typescript
import { useState, useEffect } from 'react'
import { getPistas } from '../services/api'

export const usePistas = () => {
  // PASO 1: Crear estados locales
  const [pistas, setPistas] = useState<any[]>([])     // Estado para pistas
  const [loading, setLoading] = useState(true)        // Estado de carga

  // PASO 2: useEffect se ejecuta al montar el componente
  useEffect(() => {
    // PASO 3: Función async dentro de useEffect
    const cargarPistas = async () => {
      setLoading(true)                  // Activar loading
      const data = await getPistas()    // Llamar a la función del service
      setPistas(data)                   // Guardar datos en estado
      setLoading(false)                 // Desactivar loading
    }

    cargarPistas()  // PASO 4: Ejecutar la función
  }, [])  // PASO 5: [] = solo se ejecuta una vez

  // PASO 6: Devolver estados para usar en componentes
  return { pistas, loading }
}
```

**FLUJO:**
1. Componente se monta → useEffect se ejecuta
2. `setLoading(true)` → Muestra "Cargando..."
3. `await getPistas()` → Llama a la función del service
4. `setPistas(data)` → Guarda los datos
5. `setLoading(false)` → Oculta "Cargando..."
6. Componente puede usar `const { pistas, loading } = usePistas()`

---

### 3️⃣ hooks/useUsuarios.ts - CARGAR USUARIOS
**IGUAL QUE usePistas pero con usuarios**

```typescript
export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarUsuarios = async () => {
      setLoading(true)
      const data = await getUsuarios()
      setUsuarios(data)
      setLoading(false)
    }
    cargarUsuarios()
  }, [])

  return { usuarios, loading }
}
```

---

### 4️⃣ context/ReservaContext.tsx - ESTADO GLOBAL
**QUÉ HACE:** Almacén compartido entre todas las páginas

**PASO A PASO:**
```typescript
import { createContext, useContext, useState, ReactNode } from 'react'

// PASO 1: Definir el tipo de datos del contexto
type ReservaContextType = {
  reservaActual: any
  setReservaActual: (reserva: any) => void
  carrito: any[]
  agregarAlCarrito: (item: any) => void
}

// PASO 2: Crear el contexto
const ReservaContext = createContext<ReservaContextType | undefined>(undefined)

// PASO 3: Crear el Provider (proveedor que envuelve la app)
export const ReservaProvider = ({ children }: { children: ReactNode }) => {
  // PASO 4: Estados internos del contexto
  const [reservaActual, setReservaActual] = useState<any>(null)
  const [carrito, setCarrito] = useState<any[]>([])

  // PASO 5: Funciones para modificar el estado
  const agregarAlCarrito = (item: any) => {
    setCarrito([...carrito, item])
  }

  // PASO 6: Proveer el valor a todos los hijos
  return (
    <ReservaContext.Provider
      value={{
        reservaActual,
        setReservaActual,
        carrito,
        agregarAlCarrito,
      }}
    >
      {children}
    </ReservaContext.Provider>
  )
}

// PASO 7: Hook personalizado para usar el contexto
export const useReserva = () => {
  const context = useContext(ReservaContext)
  if (!context) {
    throw new Error('useReserva debe usarse dentro de ReservaProvider')
  }
  return context
}
```

**FLUJO DE USO:**
1. En App.tsx envuelves todo con `<ReservaProvider>`
2. Cualquier componente usa `const { reservaActual, setReservaActual } = useReserva()`
3. Cambias el estado: `setReservaActual({ pista: 1, fecha: '2026-01-15' })`
4. Todos los componentes que usan `useReserva()` ven el cambio

---

## 📄 PÁGINAS - CÓMO FUNCIONAN

### 5️⃣ HomePage.tsx - PÁGINA PRINCIPAL
**QUÉ HACE:** Muestra deportes y botón para ir a pistas

**PASO A PASO:**
```typescript
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  // PASO 1: Hook de navegación
  const navigate = useNavigate()

  // PASO 2: Array de deportes (datos locales)
  const deportes = [
    { nombre: 'Tenis', icon: <SportsTennisIcon />, color: '#FF5722' },
    ...
  ]

  // PASO 3: Renderizar UI
  return (
    <Box>
      <Header />
      
      {/* PASO 4: Botón que navega a /pistas */}
      <Button onClick={() => navigate('/pistas')}>
        Ver Pistas
      </Button>

      {/* PASO 5: Mapear deportes */}
      {deportes.map((deporte) => (
        <Card key={deporte.nombre}>
          {deporte.icon}
          <Typography>{deporte.nombre}</Typography>
        </Card>
      ))}

      <Footer />
    </Box>
  )
}
```

**FLUJO:**
1. Usuario entra → HomePage se renderiza
2. `const deportes = [...]` → Define datos locales
3. `deportes.map()` → Crea 3 tarjetas (una por deporte)
4. Click en botón → `navigate('/pistas')` → Va a ShopPage

---

### 6️⃣ ShopPage.tsx (Pistas) - LISTA DE PISTAS
**QUÉ HACE:** Muestra todas las pistas disponibles

**PASO A PASO:**
```typescript
import { usePistas } from '../hooks/usePistas'

const PistasPage = () => {
  const navigate = useNavigate()
  
  // PASO 1: Usar el hook personalizado
  const { pistas, loading } = usePistas()

  // PASO 2: Mostrar loading si está cargando
  if (loading) {
    return <Typography>Cargando pistas...</Typography>
  }

  // PASO 3: Renderizar pistas
  return (
    <Box>
      <Header />
      
      {/* PASO 4: Mapear pistas */}
      {pistas.map((pista) => (
        <Card key={pista.id}>
          <Typography>{pista.nombre}</Typography>
          <Typography>€{pista.precio}/hora</Typography>
          
          {/* PASO 5: Botón que navega a horarios con ID */}
          <Button 
            onClick={() => navigate(`/horarios/${pista.id}`)}
            disabled={!pista.disponible}
          >
            Reservar
          </Button>
        </Card>
      ))}

      <Footer />
    </Box>
  )
}
```

**FLUJO:**
1. Componente se monta → `usePistas()` se ejecuta
2. `usePistas()` → llama `getPistas()` → devuelve datos
3. Mientras carga → muestra "Cargando pistas..."
4. Cuando termina → `loading = false` → renderiza lista
5. `pistas.map()` → crea tarjetas
6. Click en "Reservar" → `navigate('/horarios/1')` → Va a HorariosPage con id=1

---

### 7️⃣ HorariosPage.tsx - SELECCIONAR HORARIO
**QUÉ HACE:** Seleccionar fecha y hora para reservar

**PASO A PASO:**
```typescript
import { useParams } from 'react-router-dom'
import { useReserva } from '../context/ReservaContext'

const HorariosPage = () => {
  // PASO 1: Obtener ID de la URL
  const { id } = useParams()  // Si URL es /horarios/1 → id = "1"
  
  // PASO 2: Obtener contexto global
  const { setReservaActual } = useReserva()
  
  // PASO 3: Estados locales
  const [horaSeleccionada, setHoraSeleccionada] = useState('')
  const [fechaSeleccionada, setFechaSeleccionada] = useState('')

  // PASO 4: Arrays de horarios y fechas
  const horarios = ['08:00', '09:00', '10:00', ...]
  const fechas = Array.from({ length: 5 }, (_, i) => { ... })

  // PASO 5: Función para confirmar reserva
  const confirmarReserva = () => {
    if (!horaSeleccionada || !fechaSeleccionada) {
      alert('Selecciona fecha y hora')
      return
    }

    // PASO 6: Crear objeto reserva
    const reserva = {
      pista: id,
      fecha: fechaSeleccionada,
      hora: horaSeleccionada,
      precio: 15,
    }
    
    // PASO 7: Guardar en contexto global
    setReservaActual(reserva)
    
    alert('¡Reserva confirmada!')
    navigate('/pistas')
  }

  // PASO 8: Renderizar
  return (
    <Box>
      {/* PASO 9: Botones de fechas */}
      {fechas.map((fecha) => (
        <Button 
          variant={fechaSeleccionada === fecha ? 'contained' : 'outlined'}
          onClick={() => setFechaSeleccionada(fecha)}
        >
          {fecha}
        </Button>
      ))}

      {/* PASO 10: Botones de horas */}
      {horarios.map((hora) => (
        <Button 
          variant={horaSeleccionada === hora ? 'contained' : 'outlined'}
          onClick={() => setHoraSeleccionada(hora)}
        >
          {hora}
        </Button>
      ))}

      {/* PASO 11: Botón confirmar */}
      <Button onClick={confirmarReserva}>
        Confirmar Reserva
      </Button>
    </Box>
  )
}
```

**FLUJO:**
1. Usuario llega desde ShopPage con URL `/horarios/1`
2. `useParams()` → extrae `id = "1"` de la URL
3. `useState` → crea estados locales para hora y fecha
4. User click en fecha → `setFechaSeleccionada('2026-01-15')`
5. User click en hora → `setHoraSeleccionada('10:00')`
6. User click "Confirmar" → ejecuta `confirmarReserva()`
7. `setReservaActual({ pista: 1, fecha: ..., hora: ... })` → guarda en contexto
8. `navigate('/pistas')` → vuelve a pistas

---

### 8️⃣ DashboardPage.tsx - PANEL ADMIN
**QUÉ HACE:** Muestra usuarios y pistas en panel admin

**PASO A PASO:**
```typescript
import { useUsuarios } from '../hooks/useUsuarios'
import { usePistas } from '../hooks/usePistas'

const DashboardPage = () => {
  // PASO 1: Cargar datos con hooks
  const { usuarios, loading: loadingUsuarios } = useUsuarios()
  const { pistas, loading: loadingPistas } = usePistas()

  // PASO 2: Estado para sección activa
  const [seccionActiva, setSeccionActiva] = useState('usuarios')

  // PASO 3: Mostrar loading
  if (loadingUsuarios || loadingPistas) {
    return <Typography>Cargando...</Typography>
  }

  // PASO 4: Renderizar
  return (
    <Box>
      {/* PASO 5: Tarjetas de estadísticas */}
      <Card>
        <Typography>{usuarios.length}</Typography>
        <Typography>Total Usuarios</Typography>
      </Card>

      <Card>
        <Typography>{pistas.length}</Typography>
        <Typography>Pistas Activas</Typography>
      </Card>

      {/* PASO 6: Botones de navegación */}
      <Button onClick={() => setSeccionActiva('usuarios')}>
        Ver Usuarios
      </Button>
      <Button onClick={() => setSeccionActiva('pistas')}>
        Ver Pistas
      </Button>

      {/* PASO 7: Renderizado condicional */}
      {seccionActiva === 'usuarios' && (
        <Card>
          {usuarios.map((usuario) => (
            <Box key={usuario.id}>
              <Typography>{usuario.nombre}</Typography>
              <Typography>{usuario.email}</Typography>
            </Box>
          ))}
        </Card>
      )}

      {seccionActiva === 'pistas' && (
        <Card>
          {pistas.map((pista) => (
            <Box key={pista.id}>
              <Typography>{pista.nombre}</Typography>
              <Typography>€{pista.precio}/hora</Typography>
            </Box>
          ))}
        </Card>
      )}
    </Box>
  )
}
```

**FLUJO:**
1. Componente se monta → `useUsuarios()` y `usePistas()` se ejecutan
2. Hooks cargan datos desde `services/api.ts`
3. `useState('usuarios')` → por defecto muestra sección usuarios
4. User click "Ver Pistas" → `setSeccionActiva('pistas')`
5. Renderizado condicional → muestra solo la sección activa
6. `.map()` → crea lista de usuarios o pistas según sección

---

## 🔄 FLUJO COMPLETO DE LA APP

### EJEMPLO: Usuario reserva una pista

```
1. HomePage
   └─> User click "Ver Pistas"
   └─> navigate('/pistas')

2. ShopPage
   └─> usePistas() carga datos
   └─> getPistas() devuelve pistasMock
   └─> Renderiza 4 pistas
   └─> User click "Reservar" en Pista 1
   └─> navigate('/horarios/1')

3. HorariosPage
   └─> useParams() obtiene id = "1"
   └─> User selecciona fecha "2026-01-15"
   └─> setFechaSeleccionada('2026-01-15')
   └─> User selecciona hora "10:00"
   └─> setHoraSeleccionada('10:00')
   └─> User click "Confirmar Reserva"
   └─> confirmarReserva() se ejecuta
   └─> setReservaActual({ pista: 1, fecha: '2026-01-15', hora: '10:00' })
   └─> Reserva guardada en CONTEXTO GLOBAL
   └─> navigate('/pistas')

4. Cualquier página puede usar:
   const { reservaActual } = useReserva()
   console.log(reservaActual)
   // { pista: 1, fecha: '2026-01-15', hora: '10:00', precio: 15 }
```

---

## 🎓 CONCEPTOS CLAVE

### useState
```typescript
const [valor, setValor] = useState('inicial')
// valor = estado actual
// setValor = función para cambiar el estado
// 'inicial' = valor por defecto
```

### useEffect
```typescript
useEffect(() => {
  // Código que se ejecuta al montar componente
}, [])  // [] = solo una vez
```

### async/await
```typescript
const cargarDatos = async () => {
  const data = await getPistas()  // Espera a que termine
  setPistas(data)                 // Luego guarda
}
```

### map
```typescript
pistas.map((pista) => (
  <Card key={pista.id}>  // key es obligatorio en listas
    {pista.nombre}
  </Card>
))
// Crea un componente por cada elemento del array
```

### Renderizado condicional
```typescript
{loading && <Typography>Cargando...</Typography>}
// Si loading es true → muestra el Typography

{seccion === 'usuarios' && <ListaUsuarios />}
// Si seccion es 'usuarios' → muestra el componente
```

---

## 🚀 PRÓXIMOS PASOS

### Para conectar a backend REAL:

1. **Instalar axios:**
   ```bash
   npm install axios
   ```

2. **Modificar services/api.ts:**
   ```typescript
   import axios from 'axios'

   const api = axios.create({
     baseURL: 'http://localhost:8000/api'
   })

   export const getPistas = async () => {
     const response = await api.get('/pistas')
     return response.data
   }
   ```

3. **Todo lo demás sigue igual** → Los hooks y componentes no cambian

---

## ✅ RESUMEN FINAL

**services/api.ts** → Datos fake y funciones para obtenerlos
**hooks/** → Lógica reutilizable para cargar datos
**context/** → Estado compartido globalmente
**pages/** → Usan hooks y contexto para mostrar UI

**Flujo:**
Componente → Hook → Service → Datos → Estado → UI
