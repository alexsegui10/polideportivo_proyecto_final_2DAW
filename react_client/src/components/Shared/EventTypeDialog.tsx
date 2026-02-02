import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Box,
    Typography,
    Stack
} from '@mui/material';
import { Event as ClaseIcon, SportsTennis as ReservaIcon } from '@mui/icons-material';

interface EventTypeDialogProps {
    open: boolean;
    onClose: () => void;
    onSelectClase: () => void;
    onSelectReserva: () => void;
    pistaName?: string;
    startTime?: string;
}

export const EventTypeDialog = ({
    open,
    onClose,
    onSelectClase,
    onSelectReserva,
    pistaName,
    startTime
}: EventTypeDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6" fontWeight="bold">
                    Crear Nuevo Evento
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, pb: 2 }}>
                    {pistaName && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Pista:</strong> {pistaName}
                            </Typography>
                            {startTime && (
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Horario:</strong> {new Date(startTime).toLocaleString('es-ES')}
                                </Typography>
                            )}
                        </Box>
                    )}

                    <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                        Selecciona el tipo de evento que deseas crear:
                    </Typography>

                    <Stack spacing={2}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={onSelectClase}
                            sx={{
                                p: 3,
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2,
                                    bgcolor: 'primary.lighter',
                                    borderColor: 'primary.main'
                                }
                            }}
                        >
                            <ClaseIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    Clase Pública
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Programar una clase con instructor para múltiples participantes
                                </Typography>
                            </Box>
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            onClick={onSelectReserva}
                            sx={{
                                p: 3,
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2,
                                    bgcolor: 'secondary.lighter',
                                    borderColor: 'secondary.main'
                                }
                            }}
                        >
                            <ReservaIcon sx={{ fontSize: 40, mr: 2, color: 'secondary.main' }} />
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    Reserva
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Reservar la pista para un usuario o grupo específico
                                </Typography>
                            </Box>
                        </Button>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
