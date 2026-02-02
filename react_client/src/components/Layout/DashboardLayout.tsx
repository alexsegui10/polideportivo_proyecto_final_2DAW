import { Box } from '@mui/material';
import { Sidebar } from './Sidebar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: '256px',
          bgcolor: '#fafafa',
          minHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
