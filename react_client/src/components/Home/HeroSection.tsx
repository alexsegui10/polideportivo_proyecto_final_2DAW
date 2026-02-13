import { Box, Container, Typography, TextField, Button, Chip } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&h=1000&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(17, 23, 34, 0.6) 0%, rgba(17, 23, 34, 0.4) 50%, rgba(17, 23, 34, 1) 100%)'
          }
        }}
      />

      {/* Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 10,
          textAlign: 'center',
          pt: 8,
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          {/* Badge */}
          <Chip 
            label="WORLD CLASS SPORTS COMPLEX"
            sx={{
              bgcolor: 'rgba(20, 75, 184, 0.2)',
              border: '1px solid rgba(20, 75, 184, 0.3)',
              backdropFilter: 'blur(8px)',
              color: '#144bb8',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              px: 1
            }}
          />

          {/* Title */}
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '3rem', md: '4.5rem' },
              fontWeight: 900,
              lineHeight: 1.1,
              textShadow: '0 10px 40px rgba(0,0,0,0.8)',
              mb: 2
            }}
          >
            Entrena Como un Pro
          </Typography>

          {/* Subtitle */}
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              color: '#e5e7eb',
              maxWidth: 800,
              fontWeight: 300,
              lineHeight: 1.6,
              textShadow: '0 2px 10px rgba(0,0,0,0.6)',
              mb: 2
            }}
          >
            Instalaciones de clase mundial para atletas de élite diseñadas para tu máximo rendimiento. Eleva tu juego hoy.
          </Typography>

          {/* Search Bar */}
          <Box sx={{ 
            width: '100%',
            maxWidth: 700,
            mt: 2,
            position: 'relative'
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(26, 34, 50, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(36, 48, 71, 1)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              transition: 'all 0.3s',
              '&:focus-within': {
                borderColor: '#144bb8',
                boxShadow: '0 0 0 2px rgba(20, 75, 184, 0.5)'
              }
            }}>
              <Box sx={{ 
                pl: 3, 
                pr: 2, 
                display: 'flex', 
                alignItems: 'center',
                color: '#93a5c8'
              }}>
                <Search />
              </Box>
              <TextField
                fullWidth
                placeholder="Busca pistas, clases o clubs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    '& fieldset': { border: 'none' },
                    color: 'white',
                    fontSize: '1.125rem',
                    py: 1
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#93a5c8',
                    opacity: 1
                  }
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleSearch}
                sx={{ 
                  m: 1,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#144bb8',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  '&:hover': {
                    bgcolor: '#1e40af'
                  }
                }}
              >
                Buscar
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
