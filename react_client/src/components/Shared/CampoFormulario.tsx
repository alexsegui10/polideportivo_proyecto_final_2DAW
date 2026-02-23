/**
 * CampoFormulario - Campo de input reutilizable para formularios de auth
 */

import { ReactNode } from 'react';
import { TextField, InputAdornment, type TextFieldProps } from '@mui/material';

interface CampoFormularioProps {
  icono?: ReactNode;
}

export const CampoFormulario = ({ icono, ...props }: CampoFormularioProps & TextFieldProps) => {
  return (
    <TextField
      {...props}
      fullWidth
      sx={{
        mb: 2,
        '& .MuiInputBase-root': {
          color: 'white',
          backgroundColor: 'rgba(15, 25, 35, 0.6)',
        },
        '& .MuiInputLabel-root': {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(6, 127, 249, 0.5)',
        },
        ...props.sx,
      }}
      InputProps={{
        ...props.InputProps,
        startAdornment: icono ? (
          <InputAdornment position="start" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {icono}
          </InputAdornment>
        ) : props.InputProps?.startAdornment,
      }}
    />
  );
};
