import { useState, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Chip,
    Box,
    Typography
} from '@mui/material';
import { Usuario } from '../../types';

interface UserSelectorProps {
    open: boolean;
    onClose: () => void;
    onSelectUser: (user: Usuario) => void;
    usuarios: Usuario[];
    roleFilter?: 'admin' | 'cliente' | 'entrenador';
    title?: string;
    defaultUser?: Usuario;
}

export const UserSelector = ({
    open,
    onClose,
    onSelectUser,
    usuarios,
    roleFilter,
    title = 'Seleccionar Usuario',
    defaultUser
}: UserSelectorProps) => {
    const [busqueda, setBusqueda] = useState('');
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(defaultUser || null);

    // Filtrar usuarios
    const usuariosFiltrados = useMemo(() => {
        const search = busqueda.toLowerCase();
        return usuarios.filter(u => {
            // Filtro por rol si se especifica
            if (roleFilter && u.role !== roleFilter) return false;

            // Filtro por búsqueda
            return (
                u.nombre?.toLowerCase().includes(search) ||
                u.apellidos?.toLowerCase().includes(search) ||
                u.email?.toLowerCase().includes(search)
            );
        });
    }, [usuarios, busqueda, roleFilter]);

    const handleConfirm = () => {
        if (usuarioSeleccionado) {
            onSelectUser(usuarioSeleccionado);
            handleClose();
        }
    };

    const handleClose = () => {
        setBusqueda('');
        setUsuarioSeleccionado(defaultUser || null);
        onClose();
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'error';
            case 'entrenador': return 'warning';
            case 'cliente': return 'primary';
            default: return 'default';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    <TextField
                        fullWidth
                        label="Buscar usuario"
                        placeholder="Nombre, apellidos o email..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        sx={{ mb: 2 }}
                        autoFocus
                    />

                    {usuariosFiltrados.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                            No se encontraron usuarios
                        </Typography>
                    ) : (
                        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {usuariosFiltrados.map((usuario) => (
                                <ListItem key={usuario.id} disablePadding>
                                    <ListItemButton
                                        selected={usuarioSeleccionado?.id === usuario.id}
                                        onClick={() => setUsuarioSeleccionado(usuario)}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {usuario.nombre} {usuario.apellidos}
                                                    <Chip
                                                        label={usuario.role}
                                                        size="small"
                                                        color={getRoleColor(usuario.role)}
                                                    />
                                                </Box>
                                            }
                                            secondary={usuario.email}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    )}

                    {usuarioSeleccionado && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Usuario seleccionado:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellidos}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {usuarioSeleccionado.email}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!usuarioSeleccionado}
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
