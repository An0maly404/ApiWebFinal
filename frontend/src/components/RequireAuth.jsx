import { Navigate } from 'react-router-dom'
import session from '../mocks/session.json'

function RequireAuth({ children }) {
  if (!session.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RequireAuth
