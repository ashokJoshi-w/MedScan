import { Link } from 'react-router-dom'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function DashboardHeader({ title, subtitle }) {
  const { user } = useAuth()
  const displayName = user?.name || user?.email?.split('@')[0] || 'User'
  const firstName = displayName.split(' ')[0]
  const initial = displayName.charAt(0).toUpperCase()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8  bg-blur rounded-2xl px-5 py-4 lg:px-6 lg:py-5 shadow-card">
      <div>
        <p className="text-sm text-ink-muted mb-1">
          {greeting}, {firstName}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-ink-muted mt-1 max-w-xl">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block flex-1 lg:flex-none">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="search"
            placeholder="Search reports, vitals..."
            className="search-bar w-full sm:w-56 lg:w-72 shadow-2xl border-black "
            aria-label="Search"
          />
        </div>

        <button
          type="button"
          className="relative p-2.5 rounded-xl border border-border bg-white text-ink-muted hover:text-ink hover:border-accent-blue/30 hover:shadow-card transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
        </button>

        <Link
          to="/profile"
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-border bg-white hover:border-primary/20 hover:shadow-card transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-50 to-accent-blue-soft text-primary-darker flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
          <span className="hidden md:block text-sm font-medium text-ink max-w-[100px] truncate">
            {displayName}
          </span>
          <ChevronDown className="w-4 h-4 text-ink-faint hidden md:block" />
        </Link>
      </div>
    </div>
  )
}
