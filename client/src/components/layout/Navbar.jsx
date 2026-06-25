import { useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  FlaskConical,
  HeartPulse,
  Clock,
  Menu,
  X,
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
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.name || user?.email?.split('@')[0] || 'User'

  const handleLogout = () => {
    logout()
    navigate('/login')
    setOpen(false)
  }

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 nav-blur px-4 py-3 flex items-center justify-between">
        <Logo to="/dashboard" size="sm" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-2 text-ink-muted hover:text-ink hover:bg-white rounded-xl transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-ink/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-soft transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-semibold text-ink">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-2 text-ink-muted hover:bg-surface rounded-xl transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-darker'
                    : 'text-ink-muted hover:bg-surface hover:text-ink'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-border bg-white">
          <p className="text-sm font-medium text-ink mb-3 px-1">{displayName}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-ink-muted hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </div>
    </>
  )
}
