import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CircularProgress, Box } from '@mui/material'
import { theme } from './theme/theme'
import { AuthProvider } from './context/AuthContext'
import { AdminGuard } from './components/Shared/AdminGuard'
import { PistasProvider } from './context/PistasContext'
import { UsuariosProvider } from './context/UsuariosContext'
import { PagosProvider } from './context/PagosContext'
import { ClubsProvider } from './context/ClubsContext'
import { ClasesProvider } from './context/ClasesContext'
import { ClaseInscripcionProvider } from './context/ClaseInscripcionContext'
import { ClubMiembroProvider } from './context/ClubMiembroContext'
import { ReservasProvider } from './context/ReservasContext'
import { Layout, DashboardLayout } from './components/Layout'

const HomePage = lazy(() => import('./pages/home/HomePage'))
const AuthPage = lazy(() => import('./pages/auth/AuthPage').then(m => ({ default: m.AuthPage })))
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const PistasPage = lazy(() => import('./pages/admin/PistasPage'))
const UsuariosPage = lazy(() => import('./pages/admin/UsuariosPage'))
const ReservasPage = lazy(() => import('./pages/admin/ReservasPage'))
const ClubsPage = lazy(() => import('./pages/admin/ClubsPage'))
const ClasesPage = lazy(() => import('./pages/admin/ClasesPage'))
const PagosPage = lazy(() => import('./pages/admin/PagosPage'))
const NotFoundPage = lazy(() => import('./pages/notfound/NotFoundPage'))
const ShopPage = lazy(() => import('./pages/shop/ShopPage'))
const ClasesShopPage = lazy(() => import('./pages/shop/ClasesShopPage'))
const ClubsShopPage = lazy(() => import('./pages/shop/ClubsShopPage'))
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'))

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
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Rutas públicas con Header y Footer */}
              <Route path="/" element={
                <Layout>
                  <PistasProvider>
                    <ClasesProvider>
                      <ClubsProvider>
                        <HomePage />
                      </ClubsProvider>
                    </ClasesProvider>
                  </PistasProvider>
                </Layout>
              } />

              {/* Rutas de autenticación (login, register, recover) */}
              <Route path="/auth/*" element={<Layout><AuthPage /></Layout>} />

              {/* Mantener compatibilidad con rutas antiguas */}
              <Route path="/login" element={<Layout><AuthPage /></Layout>} />
              <Route path="/register" element={<Layout><AuthPage /></Layout>} />

              {/* Rutas de Shop */}
              <Route path="/shop" element={
                <Layout>
                  <PistasProvider>
                    <ShopPage />
                  </PistasProvider>
                </Layout>
              } />

              <Route path="/clases" element={
                <Layout>
                  <ClasesProvider>
                    <ClasesShopPage />
                  </ClasesProvider>
                </Layout>
              } />

              <Route path="/clubs" element={
                <Layout>
                  <ClubsProvider>
                    <ClubsShopPage />
                  </ClubsProvider>
                </Layout>
              } />

              {/* Ruta de perfil público (por slug) - Si eres el dueño puedes editar */}
              <Route path="/profile/:slug" element={
                <Layout>
                  <ProfilePage />
                </Layout>
              } />

              {/* Rutas de dashboard protegidas con AdminGuard */}
              <Route element={<AdminGuard />}>
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
                          <ClaseInscripcionProvider>
                            <ReservasProvider>
                              <ReservasPage />
                            </ReservasProvider>
                          </ClaseInscripcionProvider>
                        </ClasesProvider>
                      </UsuariosProvider>
                    </PistasProvider>
                  </DashboardLayout>
                } />

                <Route path="/dashboard/clubs" element={
                  <DashboardLayout>
                    <UsuariosProvider>
                      <ClubsProvider>
                        <ClubMiembroProvider>
                          <ClubsPage />
                        </ClubMiembroProvider>
                      </ClubsProvider>
                    </UsuariosProvider>
                  </DashboardLayout>
                } />

                <Route path="/dashboard/clases" element={
                  <DashboardLayout>
                    <PistasProvider>
                      <UsuariosProvider>
                        <ClasesProvider>
                          <ClaseInscripcionProvider>
                            <ClasesPage />
                          </ClaseInscripcionProvider>
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
              </Route>

              {/* Ruta 404 - debe estar al final */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
