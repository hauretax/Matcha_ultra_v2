import { Routes, Route } from "react-router-dom";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './context/AuthProvider';
import SnackBarProvider from "./context/SnackBar";

import LoginPage from "./pages/LoginPage"

import Layout from "./components/Layout";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordRequestPage from "./pages/ResetPasswordRequestPage";
import ProfilePage from './pages/ProfilePage'

import RequireAuth from "./components/RequireAuth";

import themeOptions from './theme/classical'

import './App.css';


const theme = createTheme(themeOptions)

function App() {
  return (
    <SnackBarProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<PublicPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset_password" element={<ResetPasswordRequestPage />} />
              <Route element={<RequireAuth />} >
                <Route path='/home' element={<ProtectedPage />} />
                <Route path='/profile' element={<ProfilePage />} />
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </AuthProvider >
    </SnackBarProvider >
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
