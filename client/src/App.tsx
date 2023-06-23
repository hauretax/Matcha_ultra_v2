import { Routes, Route } from "react-router-dom";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './context/AuthProvider';
import SnackBarProvider from "./context/SnackBar";

import LoginPage from "./pages/LoginPage"

import Layout from "./components/Layout";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordRequestPage from "./pages/ResetPasswordRequestPage";

import RequireAuth from "./components/RequireAuth";

import themeOptions from './theme/classical'

import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";


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
  const [profile, setProfile] = useState({
    username: '',
  })

  useEffect(() => {
    setAccessToken(localStorage.getItem('jwtToken'))
    setRefreshToken(localStorage.getItem('jwtRefreshToken'))
  }, [])

  const getProfile = () => {
    axios.get('http://localhost:8080/api/profile', { 'headers': { 'Authorization': 'CetteStringPeutEtreNimporteQuoi ' + accessToken } })
      .then((res) => {
        console.log(res)
      })
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
