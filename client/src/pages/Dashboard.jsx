import { Link } from 'react-router-dom'
import {
  TrendingUp,
  FileText,
  FlaskConical,
  HeartPulse,
  ArrowRight,
  History,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { HoverLift } from '../components/ui/motion'
import useDashboardStats from '../hooks/useDashboardStats'
import { useAuth } from '../context/AuthContext'

const typeIcons = {
  prescription: { icon: FileText, color: 'text-teal-600 bg-teal-50 ring-teal-100' },
  lab: { icon: FlaskConical, color: 'text-blue-600 bg-blue-50 ring-blue-100' },
  vitals: { icon: HeartPulse, color: 'text-rose-600 bg-rose-50 ring-rose-100' },
}

const quickActions = [
  {
    to: '/prescription',
    label: 'Analyse Prescription',
    desc: 'Upload or paste Rx text',
    icon: FileText,
    gradient: 'from-teal-500 to-emerald-600',
    bg: 'bg-teal-50 hover:bg-teal-100/80',
  },
  {
    to: '/lab-reports',
    label: 'Analyse Lab Report',
    desc: 'Decode test results',
    icon: FlaskConical,
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 hover:bg-blue-100/80',
  },
  {
    to: '/vitals',
    label: 'Log Vitals',
    desc: 'Track BP, HR & weight',
    icon: HeartPulse,
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 hover:bg-rose-100/80',
  },
]

export default function Dashboard() {
  const { user } = useAuth()
  const stats = useDashboardStats()
  const name = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-hero-dark p-6 md:p-8 text-white shadow-glow-lg">
        <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-teal-200/80 text-sm font-medium mb-1">Welcome back, {name}</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Health Dashboard</h1>
            <p className="text-teal-100/70 text-sm mt-2 max-w-md">
              {stats.total === 0
                ? 'Start by analysing a prescription, lab report, or logging vitals.'
                : `You have ${stats.total} recorded ${stats.total === 1 ? 'analysis' : 'analyses'} across your account.`}
            </p>
          </div>
          <Link to="/prescription" className="btn-primary shrink-0 self-start md:self-center">
            <Sparkles className="w-4 h-4" />
            New Analysis
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Analyses" value={stats.total} icon={TrendingUp} color="teal" trend={stats.trends.total} trendLabel="vs last week" index={0} />
        <StatCard title="Prescriptions" value={stats.prescriptions} icon={FileText} color="blue" trend={stats.trends.prescriptions} trendLabel="vs last week" index={1} />
        <StatCard title="Lab Reports" value={stats.labReports} icon={FlaskConical} color="purple" trend={stats.trends.labReports} trendLabel="vs last week" index={2} />
        <StatCard title="Vitals Logged" value={stats.vitalsLogged} icon={HeartPulse} color="rose" trend={stats.trends.vitals} trendLabel="vs last week" index={3} />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Recent Activity</h2>
            {stats.total > 0 && (
              <Link to="/history" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
                View all
              </Link>
            )}
          </div>

          {stats.recentActivity.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <History className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-ink-muted">No activity yet</p>
              <p className="text-xs text-ink-faint mt-1">Your analyses will appear here automatically</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {stats.recentActivity.map((item, i) => {
                const { icon: Icon, color } = typeIcons[item.type] || typeIcons.prescription
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/80 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ring-1 ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{item.title}</p>
                      <p className="text-xs text-ink-faint">{item.date}</p>
                    </div>
                    <Badge status={item.status} />
                  </motion.li>
                )
              })}
            </ul>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45 }}
          className="lg:col-span-2"
        >
          <h2 className="text-lg font-bold text-ink mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map(({ to, label, desc, icon: Icon, gradient, bg }, i) => (
              <HoverLift key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-4 p-4 rounded-2xl border border-gray-100 ${bg} transition-all group`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink">{label}</p>
                    <p className="text-xs text-ink-muted">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink-faint group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </Link>
              </HoverLift>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
