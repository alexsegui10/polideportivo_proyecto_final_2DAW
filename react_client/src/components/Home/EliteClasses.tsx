import { useState } from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { CalendarMonth, Person, Schedule } from '@mui/icons-material';
import { ClasePublica } from '../../types';
import { useNavigate } from 'react-router-dom';

interface EliteClassesProps {
  clasesHoy: ClasePublica[];
  clasesMañana: ClasePublica[];
}

export const EliteClasses = ({ clasesHoy, clasesMañana }: EliteClassesProps) => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState<'hoy' | 'mañana'>('hoy');
  const clases = tabValue === 'hoy' ? clasesHoy : clasesMañana;

  const formatTime = (dateTime: string) => {
    if (!dateTime) return '--:--';
    const date = new Date(dateTime);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateTime: string) => {
    if (!dateTime) return '--';
    const date = new Date(dateTime);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  const getDuration = (inicio: string, fin: string) => {
    if (!inicio || !fin) return '-- min';
    const start = new Date(inicio);
    const end = new Date(fin);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60);
    return `${Math.round(diff)} min`;
  };

  // Helper para acceder a campos en snake_case o camelCase
  const getField = (obj: any, camelCase: string, snakeCase: string) => {
    return obj[camelCase] || obj[snakeCase];
  };

  return (
    <Paper
      sx={{
        bgcolor: '#1a2232',
        border: '1px solid #243047',
        borderRadius: 4,
        p: { xs: 3, md: 4 },
        maxWidth: 1280,
        mx: 'auto',
        mb: 10
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CalendarMonth sx={{ color: '#144bb8', fontSize: 32 }} />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              color: 'white',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Clases Elite de Hoy
          </Typography>
        </Box>
        
        {/* Tabs + Ver Todas */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={() => setTabValue('hoy')}
            variant={tabValue === 'hoy' ? 'contained' : 'outlined'}
            size="small"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 'bold',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              ...(tabValue === 'hoy' ? {
                bgcolor: '#144bb8',
                color: 'white'
              } : {
                borderColor: '#243047',
                color: '#93a5c8',
                '&:hover': {
                  bgcolor: 'rgba(36, 48, 71, 0.8)',
                  borderColor: '#243047'
                }
              })
            }}
          >
            Hoy
          </Button>
          <Button
            onClick={() => setTabValue('mañana')}
            variant={tabValue === 'mañana' ? 'contained' : 'outlined'}
            size="small"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 'bold',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              ...(tabValue === 'mañana' ? {
                bgcolor: '#144bb8',
                color: 'white'
              } : {
                borderColor: '#243047',
                color: '#93a5c8',
                '&:hover': {
                  bgcolor: 'rgba(36, 48, 71, 0.8)',
                  borderColor: '#243047'
                }
              })
            }}
          >
            Mañana
          </Button>
          <Box
            onClick={() => navigate('/clases')}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.5,
              color: '#144bb8',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              pl: 1,
              borderLeft: '1px solid #243047',
              '&:hover': { color: 'white' }
            }}
          >
            Ver Todas
          </Box>
        </Box>
      </Box>

      {/* Classes List */}
      <Stack spacing={2}>
        {clases.length === 0 ? (
          <Typography align="center" color="#93a5c8" sx={{ py: 4 }}>
            No hay clases programadas para {tabValue}
          </Typography>
        ) : (
          clases.slice(0, 3).map((clase) => (
            <Paper
              key={clase.id}
              onClick={() => navigate(`/clases?deporte=${encodeURIComponent(clase.deporte || '')}`)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, md: 3 },
                p: 2,
                borderRadius: 3,
                bgcolor: '#111722',
                border: '1px solid #243047',
                transition: 'all 0.3s',
                flexDirection: { xs: 'column', md: 'row' },
                '&:hover': {
                  borderColor: 'rgba(20, 75, 184, 0.3)',
                  bgcolor: '#1a2232'
                }
              }}
            >
              {/* Time Box */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: '100%', md: 100 },
                  bgcolor: 'rgba(36, 48, 71, 0.3)',
                  borderRadius: 2,
                  py: 1.5,
                  px: 2
                }}
              >
                <Typography variant="caption" sx={{ color: '#93a5c8', fontWeight: 'bold', fontSize: '0.65rem' }}>
                  {formatDate(getField(clase, 'fechaHoraInicio', 'fecha_hora_inicio')).toUpperCase()}
                </Typography>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1, my: 0.5 }}>
                  {formatTime(getField(clase, 'fechaHoraInicio', 'fecha_hora_inicio'))}
                </Typography>
                <Typography variant="caption" sx={{ color: '#93a5c8', fontSize: '0.7rem' }}>
                  {(() => {
                    const time = formatTime(getField(clase, 'fechaHoraInicio', 'fecha_hora_inicio'));
                    const hour = parseInt(time.split(':')[0]);
                    return hour < 12 ? 'AM' : 'PM';
                  })()}
                </Typography>
              </Box>

              {/* Class Info */}
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 0.5,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    transition: 'color 0.3s',
                    '&:hover': {
                      color: '#144bb8'
                    }
                  }}
                >
                  {clase.nombre}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 2, md: 3 },
                  color: '#93a5c8',
                  fontSize: '0.875rem',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Person sx={{ fontSize: 16 }} />
                    <span>{getField(clase, 'entrenador', 'entrenador_nombre') || 'Coach Profesional'}</span>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Schedule sx={{ fontSize: 16 }} />
                    <span>{getField(clase, 'duracionMinutos', 'duracion_minutos') ? `${getField(clase, 'duracionMinutos', 'duracion_minutos')} min` : getDuration(getField(clase, 'fechaHoraInicio', 'fecha_hora_inicio'), getField(clase, 'fechaHoraFin', 'fecha_hora_fin'))}</span>
                  </Box>
                </Box>
              </Box>

              {/* Book Button */}
              <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={(e) => { e.stopPropagation(); navigate(`/clases?deporte=${encodeURIComponent(clase.deporte || '')}`); }}
                  sx={{
                    px: 4,
                    py: 1,
                    borderRadius: 2,
                    borderColor: '#144bb8',
                    color: '#144bb8',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    '&:hover': {
                      bgcolor: '#144bb8',
                      color: 'white',
                      borderColor: '#144bb8'
                    }
                  }}
                >
                  Reservar
                </Button>
              </Box>
            </Paper>
          ))
        )}
      </Stack>
    </Paper>
  );
};
