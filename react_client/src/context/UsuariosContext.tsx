import { createContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, UsuarioCreateRequest, UsuarioUpdateRequest } from '../types';
import { getUsuarios } from '../services/queries/usuariosQueries';
import { 
  createUsuario as createUsuarioService, 
  updateUsuario as updateUsuarioService, 
  deleteUsuario as deleteUsuarioService 
} from '../services/mutations/usuariosMutations';

interface UsuariosContextType {
  usuarios: Usuario[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createUsuario: (usuario: UsuarioCreateRequest) => Promise<Usuario>;
  updateUsuario: (slug: string, usuario: UsuarioUpdateRequest) => Promise<Usuario>;
  deleteUsuario: (slug: string) => Promise<void>;
}

export const UsuariosContext = createContext<UsuariosContextType | undefined>(undefined);

interface UsuariosProviderProps {
  children: ReactNode;
}

export const UsuariosProvider = ({ children }: UsuariosProviderProps) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching usuarios...');
      const data = await getUsuarios();
      console.log('Usuarios obtenidos:', data);
      setUsuarios(data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const createUsuario = async (usuario: UsuarioCreateRequest): Promise<Usuario> => {
    try {
      const nuevoUsuario = await createUsuarioService(usuario);
      setUsuarios(prev => [...prev, nuevoUsuario]);
      return nuevoUsuario;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
      throw err;
    }
  };

  const updateUsuario = async (slug: string, usuario: UsuarioUpdateRequest): Promise<Usuario> => {
    try {
      const usuarioActualizado = await updateUsuarioService(slug, usuario);
      setUsuarios(prev => prev.map(u => u.slug === slug ? usuarioActualizado : u));
      return usuarioActualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar usuario');
      throw err;
    }
  };

  const deleteUsuario = async (slug: string): Promise<void> => {
    try {
      await deleteUsuarioService(slug);
      // Recargar para obtener el usuario con status='eliminado'
      await fetchUsuarios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
      throw err;
    }
  };

  return (
    <UsuariosContext.Provider value={{
      usuarios,
      loading,
      error,
      refetch: fetchUsuarios,
      createUsuario,
      updateUsuario,
      deleteUsuario
    }}>
      {children}
    </UsuariosContext.Provider>
  );
};
