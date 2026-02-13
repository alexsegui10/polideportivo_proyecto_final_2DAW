import { useEffect, useState } from 'react';
import { Box, CircularProgress, ThemeProvider, createTheme } from '@mui/material';
import { HeroSection } from '../components/Home/HeroSection';
import { StatsSection } from '../components/Home/StatsSection';
import { PremierFacilities } from '../components/Home/PremierFacilities';
import { EliteClasses } from '../components/Home/EliteClasses';
import { ExclusiveClubs } from '../components/Home/ExclusiveClubs';
import { usePistasHomeQueries } from '../hooks/queries/usePistasHomeQueries';
import { useClasesHomeQueries } from '../hooks/queries/useClasesHomeQueries';
import { useClubsHomeQueries } from '../hooks/queries/useClubsHomeQueries';
import { Pista, ClasePublica, Club } from '../types';

// Tema oscuro solo para Home
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#144bb8',
      light: '#4a73c9',
      dark: '#0d3280',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#0a0e1a',
      paper: '#111722',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
});

const HomePage = () => {
  const pistasQueries = usePistasHomeQueries();
  const clasesQueries = useClasesHomeQueries();
  const clubsQueries = useClubsHomeQueries();

  const [stats, setStats] = useState({ pistas: 0, entrenadores: 0, clubs: 0 });
  const [pistasDestacadas, setPistasDestacadas] = useState<Pista[]>([]);
  const [clasesHoy, setClasesHoy] = useState<ClasePublica[]>([]);
  const [clasesMañana, setClasesMañana] = useState<ClasePublica[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Stats en paralelo
        const [pistasStats, clasesStats, clubsStats] = await Promise.all([
          pistasQueries.getStats(),
          clasesQueries.getStats(),
          clubsQueries.getStats()
        ]);
        
        setStats({
          pistas: pistasStats.total,
          entrenadores: clasesStats.total,
          clubs: clubsStats.total
        });

        // Resto de datos en paralelo
        const [destacadas, hoy, mañana, clubsData] = await Promise.all([
          pistasQueries.getDestacadas(6),
          clasesQueries.getClasesPorFecha('hoy'),
          clasesQueries.getClasesPorFecha('mañana'),
          clubsQueries.getClubs()
        ]);

        setPistasDestacadas(destacadas);
        setClasesHoy(hoy);
        setClasesMañana(mañana);
        setClubs(clubsData.slice(0, 6));
      } catch (error) {
        console.error('Error cargando datos del home:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" bgcolor="background.default">
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor="background.default">
        <HeroSection />
        <StatsSection stats={stats} />
        <PremierFacilities pistas={pistasDestacadas} />
        <EliteClasses clasesHoy={clasesHoy} clasesMañana={clasesMañana} />
        <ExclusiveClubs clubs={clubs} />
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
