import { NavLink, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  FlaskConical,
  HeartPulse,
  Clock,
  LogOut,
  Upload,
  Sparkles,
  Settings,
  User,
  Pill,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../ui/Logo'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/reports', label: 'Reports', icon: FlaskConical },
  { to: '/upload-report', label: 'Upload Report', icon: Upload },
  { to: '/prescription', label: 'Prescriptions', icon: Pill },
  { to: '/vitals', label: 'Vitals', icon: HeartPulse },
  { to: '/health-insights', label: 'Health Insights', icon: Sparkles },
  { to: '/history', label: 'History', icon: Clock },
]

const bottomItems = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
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

  const NavItem = ({ to, label, icon: Icon }) => (
    <NavLink to={to}>
      {({ isActive }) => (
        <div
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive
              ? 'bg-primary-50 text-primary-darker shadow-sm'
              : 'text-ink-muted hover:bg-white hover:text-ink'
          }`}
        >
          <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : ''}`} />
          {label}
        </div>
      )}
    </NavLink>
  )

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col bg-white border-r border-border z-30">
      <div className="px-5 py-6 border-b border-border">
        <Logo to="/dashboard" />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <div className="pt-4 mt-4 border-t border-border space-y-1">
          {bottomItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <Link
          to="/profile"
          className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-surface border border-border hover:border-primary/20 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-darker flex items-center justify-center text-sm font-bold">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
            {user?.email && (
              <p className="text-xs text-ink-faint truncate">{user.email}</p>
            )}
          </div>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-ink-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  )
}
