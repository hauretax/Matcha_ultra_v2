import { Routes, Route } from "react-router-dom";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider, useAuth } from './context/AuthProvider';
import SnackBarProvider from "./context/SnackBar";

import LoginPage from "./pages/LoginPage"

import Layout from "./components/Layout";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordRequestPage from "./pages/ResetPasswordRequestPage";
import ProfilePage from './pages/ProfilePage'

import RequireAuth from "./components/RequireAuth";

import themeOptions from './theme/classical'

import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";
import ValideMailPage from "./pages/ValideMailPage";


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
              <Route path="/valide_mail" element={<ValideMailPage />} />
              <Route path="/reset_password" element={<ResetPasswordRequestPage />} />
              <Route path='/404' element={<div>404</div>} />
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
  const [accessToken, setAccessToken] = useState<string | null>('')
  const [refreshToken, setRefreshToken] = useState<string | null>('')
  const auth = useAuth();

  useEffect(() => {
    setAccessToken(localStorage.getItem('accessToken'))
    setRefreshToken(localStorage.getItem('refreshToken'))
  }, [])

  const getProfile = () => {
    auth.getProfile()
  }

  const refresh = () => {
    axios.post('http://localhost:8080/api/newToken', { 'refreshToken': refreshToken })
      .then((res) => {
        setAccessToken(res.data.token)
        setRefreshToken(res.data.refreshToken)
      })
  }

  return (
    <>
      <button onClick={getProfile}>get Profile</button>
      <button onClick={refresh}>Refresh token</button>
      <p>Protected page</p>
      <p>Access token : {accessToken}</p>
      <p>Refresh token : {refreshToken}</p>
    </>
  )
}

export default App;
