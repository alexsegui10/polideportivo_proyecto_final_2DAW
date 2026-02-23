import { useEffect, useState } from 'react';
import { Box, CircularProgress, ThemeProvider, createTheme } from '@mui/material';
import { useUrlState, useDebouncedValue, usePistasShopQueries } from '../../hooks';
import { Pista } from '../../types';
import { FiltrosPistas } from '../../components/Shop/FiltrosPistas';
import { ListaPistas } from '../../components/Shop/ListaPistas';
import { PaginacionPistas } from '../../components/Shop/PaginacionPistas';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#144bb8' },
    background: { default: '#0a0e1a', paper: '#111722' },
  },
});

const ShopPage = () => {
  const url = useUrlState();
  const { searchPistas, error: contextError } = usePistasShopQueries();

  // --- estado desde URL ---
  const q = url.get("q", "");
  const tipo = url.get("tipo", "");
  const precioMax = url.get("precioMax", "");
  const page = Number(url.get("page", "1"));
  const limit = Number(url.get("limit", "12"));
  const sort = url.get("sort", "default");

  // --- search con debounce ---
  const [qInput, setQInput] = useState(q);
  const debouncedQ = useDebouncedValue(qInput, 300);

  // sincroniza input cuando navegas con back/forward
  useEffect(() => {
    setQInput(q);
  }, [q]);

  // search → replace + reset page solo si el query cambió de verdad
  useEffect(() => {
    if (debouncedQ !== q) {
      url.setMany({ q: debouncedQ, page: 1 }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  // --- filtros ---
  const setTipo = (v: string) => url.setMany({ tipo: v, page: 1 });
  const setPrecioMax = (v: string) => url.setMany({ precioMax: v, page: 1 });
  const setSort = (v: string) => url.setMany({ sort: v, page: 1 });
  const clearFilters = () => url.setMany({ tipo: "", precioMax: "", page: 1 });

  // --- paginación ---
  const setPage = (p: number) => url.set("page", p);
  const setLimit = (s: number) => url.setMany({ limit: s, page: 1 });

  // --- estado de resultados ---
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: Pista[];
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

    const apiParams = {
      q: debouncedQ || undefined,
      tipo: tipo || undefined,
      precioMax: precioMax ? Number(precioMax) : undefined,
      page,
      limit,
      sort,
    };

    searchPistas(apiParams)
      .then((res) => {
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
  }, [debouncedQ, tipo, precioMax, page, limit, sort]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* SIDEBAR FIJO CON FILTROS */}
      <Box 
        sx={{ 
          width: 320,
          position: 'sticky',
          top: 0,
          height: '100vh',
          flexShrink: 0,
          overflowY: 'auto',
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <FiltrosPistas
          qInput={qInput}
          setQInput={setQInput}
          tipo={tipo}
          setTipo={setTipo}
          precioMax={precioMax}
          setPrecioMax={setPrecioMax}
          sort={sort}
          setSort={setSort}
          limit={limit}
          setLimit={setLimit}
          clearFilters={clearFilters}
        />
      </Box>

      {/* CONTENIDO PRINCIPAL */}
      <Box sx={{ flex: 1, bgcolor: 'background.default' }}>
        <Box sx={{ p: { xs: 3, md: 4, lg: 6 }, maxWidth: 1600, mx: 'auto' }}>
          {/* RESULTADOS */}
          {state.loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          )}

          {(state.error || contextError) && (
            <Box sx={{ p: 6, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
              <Box sx={{ fontSize: 48, mb: 2 }}>⚠️</Box>
              <Box sx={{ fontSize: 18, fontWeight: 600, color: 'error.main', mb: 1 }}>
                Error al cargar las pistas
              </Box>
              <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
                {state.error || contextError}
              </Box>
            </Box>
          )}

          {!state.loading && !state.error && (
            <>
              <ListaPistas 
                pistas={state.data} 
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

export default ShopPage;
