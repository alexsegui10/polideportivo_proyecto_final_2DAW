/* import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const ShopPage = () => {
  const productos = [
    {
      id: 1,
      nombre: 'Raqueta Professional',
      precio: 89.99,
      imagen: 'https://images.unsplash.com/photo-1617083942535-4f567f1ac75a?w=400',
      descripcion: 'Raqueta de alta calidad para jugadores profesionales'
    },
    {
      id: 2,
      nombre: 'Pelotas Pack x3',
      precio: 12.50,
      imagen: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
      descripcion: 'Pack de 3 pelotas de tenis premium'
    },
    {
      id: 3,
      nombre: 'Bolsa Deportiva',
      precio: 45.00,
      imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      descripcion: 'Bolsa deportiva con múltiples compartimentos'
    },
    {
      id: 4,
      nombre: 'Zapatillas Sport',
      precio: 120.00,
      imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      descripcion: 'Zapatillas de alto rendimiento'
    }
  ]

  return (
    <Container maxWidth="lg">
      <Box py={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <ShoppingCartIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h3" component="h1">
            Tienda
          </Typography>
        </Box>
        
        <Typography variant="h6" color="text.secondary" paragraph align="center" mb={6}>
          Encuentra todo el equipamiento que necesitas
        </Typography>

        <Grid container spacing={4}>
          {productos.map((producto) => (
            <Grid item xs={12} sm={6} md={3} key={producto.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={producto.imagen}
                  alt={producto.nombre}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {producto.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {producto.descripcion}
                  </Typography>
                  <Typography variant="h5" color="primary" gutterBottom>
                    €{producto.precio}
                  </Typography>
                  <Button variant="contained" fullWidth>
                    Añadir al Carrito
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}

export default ShopPage
 */