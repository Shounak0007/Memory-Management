import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Login } from './components/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import App from './App.tsx'
import './index.css'

const LoginRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null;
  if (user) return <Navigate to="/" replace />;
  return <Login />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
