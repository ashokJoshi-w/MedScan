import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  FlaskConical,
  HeartPulse,
  Clock,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/prescription', label: 'Prescription', icon: FileText },
  { to: '/lab-reports', label: 'Lab Reports', icon: FlaskConical },
  { to: '/vitals', label: 'Vitals', icon: HeartPulse },
  { to: '/history', label: 'History', icon: Clock },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.name || user?.email?.split('@')[0] || 'User'
  const initial = displayName.charAt(0).toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col bg-white border-r border-gray-200 z-30">
      <div className="flex items-center gap-2.5 px-5 py-6 border-b border-gray-100">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <HeartPulse className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">MedScan</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border-l-4 ${
                isActive
                  ? 'bg-primary-light text-primary-darker border-primary'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-transparent'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-primary-light text-primary-darker flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            {user?.email && (
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  )
}
