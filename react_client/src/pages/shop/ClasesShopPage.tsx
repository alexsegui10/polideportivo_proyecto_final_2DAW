import { useEffect, useState } from 'react';
import { Box, CircularProgress, ThemeProvider, createTheme } from '@mui/material';
import { useUrlState, useDebouncedValue, useClasesShopQueries } from '../../hooks';
import { ClasePublica } from '../../types';
import { FiltrosClases } from '../../components/Shop/FiltrosClases';
import { ListaClases } from '../../components/Shop/ListaClases';
import { PaginacionPistas } from '../../components/Shop/PaginacionPistas';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#144bb8' },
    background: { default: '#0a0e1a', paper: '#111722' },
  },
});

const ClasesShopPage = () => {
  const url = useUrlState();
  const { searchClases, error: contextError } = useClasesShopQueries();

  // --- estado desde URL ---
  const q = url.get('q', '');
  const deporte = url.get('deporte', '');
  const nivel = url.get('nivel', '');
  const page = Number(url.get('page', '1'));
  const limit = Number(url.get('limit', '12'));
  const sort = url.get('sort', 'default');

  // --- search con debounce ---
  const [qInput, setQInput] = useState(q);
  const debouncedQ = useDebouncedValue(qInput, 300);

  useEffect(() => {
    setQInput(q);
  }, [q]);

  useEffect(() => {
    if (debouncedQ !== q) {
      url.setMany({ q: debouncedQ, page: 1 }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  // --- filtros ---
  const setDeporte = (v: string) => url.setMany({ deporte: v, page: 1 });
  const setNivel = (v: string) => url.setMany({ nivel: v, page: 1 });
  const setSort = (v: string) => url.setMany({ sort: v, page: 1 });
  const clearFilters = () => url.setMany({ deporte: '', nivel: '', page: 1 });

  // --- paginación ---
  const setPage = (p: number) => url.set('page', p);
  const setLimit = (s: number) => url.setMany({ limit: s, page: 1 });

  // --- estado de resultados ---
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: ClasePublica[];
    totalPages: number;
    totalElements: number;
  }>({
    loading: false,
    error: null,
    data: [],
    totalPages: 1,
    totalElements: 0,
  });

  // --- fetch con AbortController ---
  useEffect(() => {
    const ac = new AbortController();
    setState(s => ({ ...s, loading: true }));

    searchClases({
      q: debouncedQ || undefined,
      deporte: deporte || undefined,
      nivel: nivel || undefined,
      page,
      limit,
      sort,
    })
      .then(res => {
        setState({
          loading: false,
          error: null,
          data: res.content,
          totalPages: res.totalPages,
          totalElements: res.totalElements,
        });
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setState(s => ({ ...s, loading: false, error: err.message }));
        }
      });

    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, deporte, nivel, page, limit, sort]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* SIDEBAR FIJO CON FILTROS */}
        <Box sx={{
          width: 320, position: 'sticky', top: 0, height: '100vh',
          flexShrink: 0, overflowY: 'auto',
          borderRight: '1px solid', borderColor: 'divider', bgcolor: 'background.paper',
        }}>
          <FiltrosClases
            qInput={qInput} setQInput={setQInput}
            deporte={deporte} setDeporte={setDeporte}
            nivel={nivel} setNivel={setNivel}
            limit={limit} setLimit={setLimit}
            clearFilters={clearFilters}
          />
        </Box>

        {/* CONTENIDO PRINCIPAL */}
        <Box sx={{ flex: 1, bgcolor: 'background.default' }}>
          <Box sx={{ p: { xs: 3, md: 4, lg: 6 }, maxWidth: 1600, mx: 'auto' }}>
            {state.loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
                <CircularProgress size={60} thickness={4} />
              </Box>
            )}

            {(state.error || contextError) && (
              <Box sx={{ p: 6, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
                <Box sx={{ fontSize: 48, mb: 2 }}>⚠️</Box>
                <Box sx={{ fontSize: 18, fontWeight: 600, color: 'error.main', mb: 1 }}>
                  Error al cargar las clases
                </Box>
                <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
                  {state.error || contextError}
                </Box>
              </Box>
            )}

            {!state.loading && !state.error && (
              <>
                <ListaClases
                  clases={state.data}
                  totalElements={state.totalElements}
                  sort={sort}
                  setSort={setSort}
                />
                {state.data.length > 0 && (
                  <Box sx={{ mt: 6 }}>
                    <PaginacionPistas page={page} totalPages={state.totalPages} setPage={setPage} />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ClasesShopPage;
