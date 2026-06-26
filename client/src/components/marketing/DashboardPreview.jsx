import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  FlaskConical,
  HeartPulse,
  Clock,
  Upload,
  Sparkles,
  Pill,
  Search,
  Bell,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { FadeIn } from '../ui/motion'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: FlaskConical, label: 'Reports' },
  { icon: Upload, label: 'Upload Report' },
  { icon: Pill, label: 'Prescriptions' },
  { icon: HeartPulse, label: 'Vitals' },
  { icon: Sparkles, label: 'Health Insights' },
  { icon: Clock, label: 'History' },
]

const stats = [
  { label: 'Reports', value: '12', trend: '+25%', icon: FlaskConical, color: 'icon-badge-blue' },
  { label: 'Prescriptions', value: '8', trend: '+12%', icon: Pill, color: 'icon-badge-green' },
  { label: 'Vitals Logged', value: '24', trend: '+18%', icon: HeartPulse, color: 'icon-badge-green' },
  { label: 'Total Records', value: '44', trend: '+15%', icon: FileText, color: 'icon-badge-green' },
]

const activities = [
  { label: 'Lab report analysed', time: '2 hours ago', status: 'Normal', statusClass: 'status-info' },
  { label: 'Prescription decoded', time: 'Yesterday', status: 'Done', statusClass: 'status-success' },
  { label: 'Vitals logged', time: '2 days ago', status: 'Normal', statusClass: 'status-info' },
]

const reminders = [
  { label: 'Log blood pressure', icon: HeartPulse, color: 'text-primary' },
  { label: 'Review flagged results', icon: FlaskConical, color: 'text-warning' },
  { label: 'Weekly health check-in', icon: Calendar, color: 'text-accent-blue' },
]

export default function DashboardPreview() {
  return (
    <FadeIn>
      <div className="text-center mb-12 md:mb-16">
        <span className="section-label mb-4">Product Preview</span>
        <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight text-balance">
          Your health dashboard, simplified
        </h2>
        <p className="mt-4 text-ink-muted max-w-xl mx-auto text-pretty">
          Track reports, prescriptions, and vitals in one calm, organized workspace.
        </p>
      </div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mx-auto max-w-5xl"
      >
        <div className="absolute -inset-4 bg-primary/5 rounded-[28px] blur-2xl pointer-events-none" />
        <div className="relative rounded-2xl border border-border bg-white shadow-soft overflow-hidden">
          <div className="flex min-h-[420px] md:min-h-[480px]">
            {/* Sidebar */}
            <aside className="hidden sm:flex flex-col w-52 shrink-0 bg-section border-r border-border p-4">
              <div className="flex items-center gap-2 mb-8 px-1">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <HeartPulse className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-ink">MedScan</span>
              </div>
              <nav className="space-y-1 flex-1">
                {sidebarItems.map(({ icon: Icon, label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium ${
                      active
                        ? 'bg-primary-50 text-primary-darker'
                        : 'text-ink-muted'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-primary' : ''}`} />
                    {label}
                  </div>
                ))}
              </nav>
              <div className="mt-auto pt-4 border-t border-border">
                <div className="flex items-center gap-2 px-2 py-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-darker flex items-center justify-center text-xs font-semibold">
                    A
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink truncate">Ashok</p>
                    <p className="text-[10px] text-ink-faint">Free plan</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0 bg-surface p-4 md:p-6">
              {/* Top bar */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs text-ink-muted">Good afternoon</p>
                  <p className="text-sm font-bold text-ink">Dashboard</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-white text-xs text-ink-faint">
                    <Search className="w-3.5 h-3.5" />
                    Search...
                  </div>
                  <div className="relative p-2 rounded-xl border border-border bg-white">
                    <Bell className="w-4 h-4 text-ink-muted" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full" />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-darker flex items-center justify-center text-xs font-semibold">
                    A
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-5">
                {stats.map(({ label, value, trend, icon: Icon, color }) => (
                  <motion.div
                    key={label}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className="bg-white rounded-xl border border-border p-3 shadow-card"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={`${color} !p-1.5`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-success">
                        <TrendingUp className="w-2.5 h-2.5" />
                        {trend}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-ink">{value}</p>
                    <p className="text-[10px] text-ink-muted">{label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                {/* Recent activity */}
                <div className="md:col-span-2 bg-white rounded-xl border border-border p-4">
                  <p className="text-xs font-semibold text-ink mb-3">Recent Activity</p>
                  <div className="space-y-2">
                    {activities.map(({ label, time, status, statusClass }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="text-xs font-medium text-ink">{label}</p>
                          <p className="text-[10px] text-ink-faint">{time}</p>
                        </div>
                        <span className={statusClass}>{status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Health score + reminders */}
                <div className="space-y-3">
                  <div className="bg-white rounded-xl border border-border p-4 flex flex-col items-center">
                    <p className="text-xs font-semibold text-ink self-start mb-3">Health Score</p>
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={264}
                          strokeDashoffset={21}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-success">92</span>
                        <span className="text-[9px] text-ink-faint">/ 100</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-success font-semibold mt-2">Great</p>
                  </div>

                  <div className="bg-white rounded-xl border border-border p-4">
                    <p className="text-xs font-semibold text-ink mb-3">Reminders</p>
                    <div className="space-y-2">
                      {reminders.map(({ label, icon: Icon, color }) => (
                        <div key={label} className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${color}`} />
                          <span className="text-[10px] text-ink-muted">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </FadeIn>
  )
}
