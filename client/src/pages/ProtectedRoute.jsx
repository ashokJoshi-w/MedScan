import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingState from '../components/ui/LoadingState'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <LoadingState message="Loading your session..." />
      </div>
    )
  }
  return user ? children : <Navigate to="/login" replace />
}
