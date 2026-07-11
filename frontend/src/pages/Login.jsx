import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { API_BASE_URL, setSession } from '../lib/auth'

function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const handleSuccess = async (credentialResponse) => {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: credentialResponse.credential }),
    })

    if (!response.ok) {
      setError('Sign-in failed. Please try again.')
      return
    }

    const { token, user } = await response.json()
    setSession(token, user)
    navigate('/')
  }

  return (
    <div className="login-page">
      <h1>Sign in</h1>
      <p>Please sign in with Google to access your trips.</p>
      {error && <p className="error">{error}</p>}
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => setError('Google sign-in failed. Please try again.')}
      />
    </div>
  )
}

export default Login
