import { GoogleLogin } from '@react-oauth/google'

function Login() {
  return (
    <div className="login-page">
      <h1>Sign in</h1>
      <p>Please sign in with Google to access your trips.</p>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log('Google credential:', credentialResponse.credential)
        }}
        onError={() => {
          console.log('Google sign-in failed')
        }}
      />
    </div>
  )
}

export default Login
