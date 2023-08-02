import './App.css';

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
import ValideMailPage from "./pages/ValideMailPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import BrowsePage from './pages/BrowsePage';
import Chat from './components/chat/Chat';

import RequireAuth from "./components/RequireAuth";

import themeOptions from './theme/classical'

import { SocketProvider } from "./context/SocketProvider";
import socketIOClient from 'socket.io-client';


const theme = createTheme(themeOptions)


function App() {

  return (
    <SnackBarProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SocketProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<PublicPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/valide_mail" element={<ValideMailPage />} />
                <Route path="/reset_password_request" element={<ResetPasswordRequestPage />} />
                <Route path="/reset_password" element={<ResetPasswordPage />} />
                <Route path='/404' element={<div>404</div>} />
                <Route element={<RequireAuth />} >
                  <Route path='/home' element={<BrowsePage />} />
                  <Route path='/profile' element={<ProfilePage />} />
                  <Route path='/chat' element={<Chat />} />
                </Route>
              </Route>
            </Routes>
          </SocketProvider>
        </ThemeProvider>
      </AuthProvider >
    </SnackBarProvider >
  );
}

const socket = socketIOClient('http://localhost:8080');

function testMessage() {
  socket.emit('sendMessage', { message: 'HELOOOOOOO', idFrom: 8, idTo: 1 })
}
function PublicPage() {
  return (<>
    <button onClick={testMessage}>helo</button>

    <p>Public page</p></>
  )
}

export default App;
