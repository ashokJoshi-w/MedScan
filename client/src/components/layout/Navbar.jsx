import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  FlaskConical,
  HeartPulse,
  Clock,
  Menu,
  X,
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
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <HeartPulse className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-gray-900">MedScan</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <span className="font-bold text-gray-900">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border-l-4 ${
                  isActive
                    ? 'bg-primary-light text-primary-darker border-primary'
                    : 'text-gray-500 hover:bg-gray-50 border-transparent'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-900 mb-2">{displayName}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </div>
    </>
  )
}
