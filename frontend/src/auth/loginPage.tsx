import { useNavigate } from 'react-router-dom'
import { LoginForm } from './loginForm'
import { useAuth } from './useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = (credentials: Parameters<typeof login>[0]): boolean => {
    const success = login(credentials)
    if (success) {
      navigate('/nippo', { replace: true })
    }
    return success
  }

  return <LoginForm onLogin={handleLogin} />
}
