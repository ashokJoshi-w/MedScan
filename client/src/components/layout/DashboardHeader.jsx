import { Link } from 'react-router-dom'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function DashboardHeader({ title, subtitle }) {
  const { user } = useAuth()
  const displayName = user?.name || user?.email?.split('@')[0] || 'User'
  const initial = displayName.charAt(0).toUpperCase()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
      <div>
        <p className="text-sm text-ink-muted mb-1">{greeting}, {displayName.split(' ')[0]}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="search"
            placeholder="Search..."
            className="w-48 lg:w-56 pl-9 pr-4 py-2 text-sm border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            aria-label="Search"
          />
        </div>

        <button
          type="button"
          className="relative p-2.5 rounded-xl border border-border bg-white text-ink-muted hover:text-ink hover:border-primary/20 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </button>

        <Link
          to="/profile"
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-border bg-white hover:border-primary/20 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-darker flex items-center justify-center text-sm font-semibold">
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
