import { Box, Pagination } from '@mui/material';

interface PaginacionPistasProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export const PaginacionPistas = ({ page, totalPages, setPage }: PaginacionPistasProps) => {
  if (totalPages <= 1) return null;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        p: 4,
        bgcolor: 'rgba(17, 23, 34, 0.6)',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.3)'
      }}
    >
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => setPage(value)}
        size="large"
        color="primary"
        showFirstButton
        showLastButton
        sx={{
          '& .MuiPaginationItem-root': {
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: 2,
            minWidth: 40,
            height: 40,
            color: 'rgba(255, 255, 255, 0.85)',
            '&:hover': {
              bgcolor: 'rgba(59, 130, 246, 0.2)'
            }
          },
          '& .Mui-selected': {
            bgcolor: '#2563eb !important',
            color: 'white',
            '&:hover': {
              bgcolor: '#1d4ed8 !important'
            }
          },
          '& .MuiPaginationItem-previousNext': {
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      />
    </Box>
  );
};
