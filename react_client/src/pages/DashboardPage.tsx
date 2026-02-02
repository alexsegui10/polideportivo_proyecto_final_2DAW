import { useState } from 'react';
import { Container, Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import { PistasProvider } from '../context/PistasContext';
import { UsuariosProvider } from '../context/UsuariosContext';
import PistasPage from './admin/PistasPage';
import UsuariosPage from './admin/UsuariosPage';
import ReservasPage from './admin/ReservasPage';
import ClubsPage from './admin/ClubsPage';
import ClasesPage from './admin/ClasesPage';
import PagosPage from './admin/PagosPage';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [tabActual, setTabActual] = useState(0);

  const handleCambioTab = (_event: React.SyntheticEvent, nuevoValor: number) => {
    setTabActual(nuevoValor);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Panel de Administración
      </Typography>
      
      <Paper sx={{ mt: 3 }}>
        <Tabs value={tabActual} onChange={handleCambioTab} aria-label="Dashboard tabs">
          <Tab label="Pistas" />
          <Tab label="Usuarios" />
          <Tab label="Reservas" />
          <Tab label="Clubs" />
          <Tab label="Clases" />
          <Tab label="Pagos" />
        </Tabs>

        <TabPanel value={tabActual} index={0}>
          <PistasProvider>
            <PistasPage />
          </PistasProvider>
        </TabPanel>

        <TabPanel value={tabActual} index={1}>
          <UsuariosProvider>
            <UsuariosPage />
          </UsuariosProvider>
        </TabPanel>

        <TabPanel value={tabActual} index={2}>
          <PistasProvider>
            <UsuariosProvider>
              <ReservasPage />
            </UsuariosProvider>
          </PistasProvider>
        </TabPanel>

        <TabPanel value={tabActual} index={3}>
          <UsuariosProvider>
            <ClubsPage />
          </UsuariosProvider>
        </TabPanel>

        <TabPanel value={tabActual} index={4}>
          <PistasProvider>
            <UsuariosProvider>
              <ClasesPage />
            </UsuariosProvider>
          </PistasProvider>
        </TabPanel>

        <TabPanel value={tabActual} index={5}>
          <PagosPage />
        </TabPanel>
      </Paper>
    </Container>
  );
}
