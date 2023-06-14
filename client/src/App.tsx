import {
  Routes,
  Route
} from "react-router-dom";

import { AuthProvider } from './context/AuthProvider';

import LoginPage from './pages/LoginPage'

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PublicPage />} />
          <Route path="/login" element={<LoginPage />} />
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
