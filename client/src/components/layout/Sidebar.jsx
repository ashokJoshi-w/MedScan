import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col bg-white/80 backdrop-blur-xl border-r border-gray-200/80 z-30 shadow-sm">
      <div className="flex items-center gap-2.5 px-5 py-6 border-b border-gray-100">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md shadow-primary/20"
        >
          <HeartPulse className="w-5 h-5 text-white" />
        </motion.div>
        <span className="text-lg font-bold text-ink">MedScan</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border-l-[3px] ${
                  isActive
                    ? 'bg-primary-light text-primary-darker border-primary shadow-sm'
                    : 'text-ink-muted hover:bg-gray-50 hover:text-ink border-transparent'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {label}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-gray-50/80">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-light to-teal-100 text-primary-darker flex items-center justify-center text-sm font-bold ring-2 ring-white">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
            {user?.email && (
              <p className="text-xs text-ink-faint truncate">{user.email}</p>
            )}
          </div>
        </div>
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-ink-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </motion.button>
      </div>
    </aside>
  )
}
