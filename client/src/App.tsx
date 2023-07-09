import { Routes, Route } from "react-router-dom";
import { useEffect } from 'react'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './context/AuthProvider';
import SnackBarProvider from "./context/SnackBar";

import LoginPage from "./pages/LoginPage"

import Layout from "./components/Layout";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordRequestPage from "./pages/ResetPasswordRequestPage";
import ProfilePage from './pages/ProfilePage'
import ValideMailPage from "./pages/ValideMailPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";

import RequireAuth from "./components/RequireAuth";

import themeOptions from './theme/classical'

import './App.css';
import { getLocation, getLocationByIp } from "./utils";
import FinderPage from "./pages/FinderPage";
import apiProvider from "./services/apiProvider";

const theme = createTheme(themeOptions)



function App() {

  useEffect(() => {
    apiProvider.getUsers({
      latitude:48.7932202, 
      longitude:3.27131, 
      distanceMax:500, 
      ageMin:18, 
      ageMax:23, 
      orientation:["Female","Male"], 
      interestWanted:["video-game"]})
      .then((res: any) => {
        console.log(res.data)
      })
  }, [])

  return (
    <SnackBarProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <Routes>
            <Route element={<Layout />}>
              <Route path='/test' element={
                <>
                  <button onClick={getLocation}>Obtenir la géolocalisation</button>
                  <button onClick={getLocationByIp}>ip2</button>
                </>} />
              <Route path="/" element={<PublicPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/valide_mail" element={<ValideMailPage />} />
              <Route path="/reset_password_request" element={<ResetPasswordRequestPage />} />
              <Route path="/reset_password" element={<ResetPasswordPage />} />
              <Route path='/404' element={<div>404</div>} />
              <Route element={<RequireAuth />} >
                <Route path='/home' element={<HomePage />} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/finder' element={<FinderPage />} />
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

export default App;
