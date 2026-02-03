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
    Typography,
    Checkbox
} from '@mui/material';
import { Usuario } from '../../types';

interface MultiUserSelectorProps {
    open: boolean;
    onClose: () => void;
    onSelectUsers: (users: Usuario[]) => void;
    usuarios: Usuario[];
    roleFilter?: 'admin' | 'cliente' | 'entrenador';
    title?: string;
}

export const MultiUserSelector = ({
    open,
    onClose,
    onSelectUsers,
    usuarios,
    roleFilter,
    title = 'Seleccionar Usuarios'
}: MultiUserSelectorProps) => {
    const [busqueda, setBusqueda] = useState('');
    const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<Usuario[]>([]);

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

    const handleToggleUser = (user: Usuario) => {
        setUsuariosSeleccionados(prev => {
            const exists = prev.find(u => u.id === user.id);
            if (exists) {
                return prev.filter(u => u.id !== user.id);
            } else {
                return [...prev, user];
            }
        });
    };

    const isSelected = (user: Usuario) => {
        return usuariosSeleccionados.some(u => u.id === user.id);
    };

    const handleConfirm = () => {
        if (usuariosSeleccionados.length > 0) {
            onSelectUsers(usuariosSeleccionados);
            handleClose();
        }
    };

    const handleClose = () => {
        setBusqueda('');
        setUsuariosSeleccionados([]);
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
                <Box sx={{ mb: 2, mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Buscar usuario"
                        placeholder="Nombre, apellidos o email..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        size="small"
                    />
                </Box>

                {usuariosSeleccionados.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            {usuariosSeleccionados.length} usuario{usuariosSeleccionados.length !== 1 ? 's' : ''} seleccionado{usuariosSeleccionados.length !== 1 ? 's' : ''}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {usuariosSeleccionados.map(user => (
                                <Chip
                                    key={user.id}
                                    label={`${user.nombre} ${user.apellidos || ''}`}
                                    size="small"
                                    onDelete={() => handleToggleUser(user)}
                                    color="primary"
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {usuariosFiltrados.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                            No se encontraron usuarios
                        </Typography>
                    ) : (
                        usuariosFiltrados.map((usuario) => (
                            <ListItem
                                key={usuario.id}
                                disablePadding
                            >
                                <ListItemButton
                                    onClick={() => handleToggleUser(usuario)}
                                    selected={isSelected(usuario)}
                                >
                                    <Checkbox
                                        edge="start"
                                        checked={isSelected(usuario)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                    <ListItemText
                                        primary={`${usuario.nombre} ${usuario.apellidos || ''}`}
                                        secondary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                <Typography variant="caption" component="span">
                                                    {usuario.email}
                                                </Typography>
                                                <Chip
                                                    label={usuario.role}
                                                    size="small"
                                                    color={getRoleColor(usuario.role)}
                                                />
                                            </Box>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    )}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={usuariosSeleccionados.length === 0}
                >
                    Confirmar ({usuariosSeleccionados.length})
                </Button>
            </DialogActions>
        </Dialog>
    );
};
