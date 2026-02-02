import { Box, Typography, Paper, Alert } from '@mui/material';
import { TablaClubs } from '../../components/Admin/TablaClubs';
import { useClubs, useClubsMutations } from '../../hooks';

/**
 * Page de Clubs - Gestión completa de clubs deportivos
 */
export default function ClubsPage() {
  const { clubs, loading, error } = useClubs();
  const { createClub, updateClub, deleteClub } = useClubsMutations();

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestión de Clubs
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Administra los clubs deportivos del polideportivo
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        {loading ? (
          <Typography>Cargando clubs...</Typography>
        ) : (
          <TablaClubs 
            clubs={clubs}
            onCreate={createClub}
            onUpdate={updateClub}
            onDelete={deleteClub}
          />
        )}
      </Paper>
    </Box>
  );
}
