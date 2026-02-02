import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CircularProgress, Box } from '@mui/material'
import { theme } from './theme/theme'
import { PistasProvider } from './context/PistasContext'
import { UsuariosProvider } from './context/UsuariosContext'
import { PagosProvider } from './context/PagosContext'
import { ClubsProvider } from './context/ClubsContext'
import { ClasesProvider } from './context/ClasesContext'
import { ReservasProvider } from './context/ReservasContext'
import { Layout, DashboardLayout } from './components/Layout'

const HomePage = lazy(() => import('./pages/HomePage'))
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const PistasPage = lazy(() => import('./pages/admin/PistasPage'))
const UsuariosPage = lazy(() => import('./pages/admin/UsuariosPage'))
const ReservasPage = lazy(() => import('./pages/admin/ReservasPage'))
const ClubsPage = lazy(() => import('./pages/admin/ClubsPage'))
const ClasesPage = lazy(() => import('./pages/admin/ClasesPage'))
const PagosPage = lazy(() => import('./pages/admin/PagosPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
/* const HorariosPage = lazy(() => import('./pages/HorariosPage'))
const ShopPage = lazy(() => import('./pages/ShopPage')) */

const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
    }}
  >
    <CircularProgress size={60} />
  </Box>
)

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PistasProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Rutas públicas con Header y Footer */}
              <Route path="/" element={
                <Layout>
                  <HomePage />
                </Layout>
              } />

              {/* Rutas de dashboard con Sidebar */}
              <Route path="/dashboard" element={
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              } />

              <Route path="/dashboard/pistas" element={
                <DashboardLayout>
                  <PistasProvider>
                    <PistasPage />
                  </PistasProvider>
                </DashboardLayout>
              } />

              <Route path="/dashboard/usuarios" element={
                <DashboardLayout>
                  <UsuariosProvider>
                    <UsuariosPage />
                  </UsuariosProvider>
                </DashboardLayout>
              } />

              <Route path="/dashboard/reservas" element={
                <DashboardLayout>
                  <PistasProvider>
                    <UsuariosProvider>
                      <ClasesProvider>
                        <ReservasProvider>
                          <ReservasPage />
                        </ReservasProvider>
                      </ClasesProvider>
                    </UsuariosProvider>
                  </PistasProvider>
                </DashboardLayout>
              } />

              <Route path="/dashboard/clubs" element={
                <DashboardLayout>
                  <UsuariosProvider>
                    <ClubsProvider>
                      <ClubsPage />
                    </ClubsProvider>
                  </UsuariosProvider>
                </DashboardLayout>
              } />

              <Route path="/dashboard/clases" element={
                <DashboardLayout>
                  <PistasProvider>
                    <UsuariosProvider>
                      <ClasesProvider>
                        <ClasesPage />
                      </ClasesProvider>
                    </UsuariosProvider>
                  </PistasProvider>
                </DashboardLayout>
              } />

              <Route path="/dashboard/pagos" element={
                <DashboardLayout>
                  <PagosProvider>
                    <PagosPage />
                  </PagosProvider>
                </DashboardLayout>
              } />

              {/* <Route path="/horarios" element={<HorariosPage />} /> */}
              {/* <Route path="/shop" element={<ShopPage />} /> */}

              {/* Ruta 404 - debe estar al final */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </PistasProvider>
    </ThemeProvider>
  )
}

export default App
