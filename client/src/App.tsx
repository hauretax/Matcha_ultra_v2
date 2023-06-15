import {
  Routes,
  Route
} from "react-router-dom";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './context/AuthProvider';

import LoginPage from './pages/LoginPage'

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

import themeOptions from './theme/classical'

import './App.css';
import RegisterPage from "./pages/RegisterPage";

const theme = createTheme(themeOptions)

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<PublicPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/protected"
              element={
                <RequireAuth>
                  <ProtectedPage />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

function PublicPage() {
  return (
    <p>Public page</p>
  )
}

function ProtectedPage() {
  return (
    <p>Protected page</p>
  )
}

export default App;
