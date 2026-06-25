import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight, LogOut, HeartPulse } from 'lucide-react'
import LoadingState from '../components/ui/LoadingState'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Login from './Login'
import Signup from './Signup'

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loading, logout } = useAuth()
  const isSignup = location.pathname === '/signup'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <LoadingState message="Loading your session..." />
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-6">
        <Card className="w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <HeartPulse className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-ink">Already signed in</h2>
          <p className="text-sm text-ink-muted mt-2">
            You&apos;re logged in as <span className="font-medium text-ink">{user.name || user.email}</span>
          </p>
          <div className="flex flex-col gap-3 mt-6">
            <Link to="/dashboard" className="btn-primary justify-center">
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Button
              variant="secondary"
              onClick={() => {
                logout()
                navigate('/login', { replace: true })
              }}
              className="w-full justify-center"
            >
              <LogOut className="w-4 h-4" />
              Sign out & use another account
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return isSignup ? (
    <Signup onSwitch={() => navigate('/login')} />
  ) : (
    <Login onSwitch={() => navigate('/signup')} />
  )
}
