import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
            <Outlet />
        </Container>
      </Box>
      <Box component="footer" sx={{ p: 2, mt: 'auto', backgroundColor: 'lightgray' }}>
        <Container maxWidth="lg">
          <Typography variant="body1">
            Footer content
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;