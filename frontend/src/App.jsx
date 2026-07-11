import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import RequireAuth from './components/RequireAuth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
