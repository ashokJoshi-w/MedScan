import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { HeartPulse, ArrowRight, LogOut } from 'lucide-react'
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
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center animate-pulse">
            <HeartPulse className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-lg p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-4">
            <HeartPulse className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Already signed in</h2>
          <p className="text-sm text-gray-500 mt-2">
            You&apos;re logged in as <span className="font-medium text-gray-700">{user.name || user.email}</span>
          </p>
          <div className="flex flex-col gap-3 mt-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/login', { replace: true })
              }}
              className="inline-flex items-center justify-center gap-2 text-gray-600 px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign out & use another account
            </button>
          </div>
        </div>
      </div>
    )
  }

  return isSignup ? (
    <Signup onSwitch={() => navigate('/login')} />
  ) : (
    <Login onSwitch={() => navigate('/signup')} />
  )
}
