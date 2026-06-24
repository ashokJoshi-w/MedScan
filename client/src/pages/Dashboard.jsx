import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import {
  TrendingUp,
  FileText,
  FlaskConical,
  HeartPulse,
  ArrowRight,
} from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'

const recentActivity = [
  { id: 1, type: 'prescription', title: 'Amoxicillin Prescription', date: new Date(2026, 5, 22), status: 'normal' },
  { id: 2, type: 'lab', title: 'Complete Blood Count', date: new Date(2026, 5, 20), status: 'abnormal' },
  { id: 3, type: 'vitals', title: 'Blood Pressure Log', date: new Date(2026, 5, 19), status: 'normal' },
  { id: 4, type: 'prescription', title: 'Metformin Refill', date: new Date(2026, 5, 17), status: 'pending' },
  { id: 5, type: 'lab', title: 'Liver Function Panel', date: new Date(2026, 5, 15), status: 'normal' },
]

const typeIcons = {
  prescription: { icon: FileText, color: 'text-teal-600 bg-teal-50' },
  lab: { icon: FlaskConical, color: 'text-blue-600 bg-blue-50' },
  vitals: { icon: HeartPulse, color: 'text-rose-600 bg-rose-50' },
}

const quickActions = [
  { to: '/prescription', label: 'Analyse Prescription', icon: FileText, color: 'bg-teal-50 text-teal-700 hover:bg-teal-100' },
  { to: '/lab-reports', label: 'View Lab Reports', icon: FlaskConical, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
  { to: '/vitals', label: 'Log Vitals', icon: HeartPulse, color: 'bg-rose-50 text-rose-700 hover:bg-rose-100' },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your health analyses and activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Analyses" value={24} icon={TrendingUp} color="teal" trend={12} trendLabel="vs last month" />
        <StatCard title="Prescriptions" value={12} icon={FileText} color="blue" trend={8} trendLabel="vs last month" />
        <StatCard title="Lab Reports" value={8} icon={FlaskConical} color="purple" trend={-3} trendLabel="vs last month" />
        <StatCard title="Vitals Logged" value={47} icon={HeartPulse} color="rose" trend={15} trendLabel="vs last month" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <ul className="divide-y divide-gray-50">
          {recentActivity.map(({ id, type, title, date, status }) => {
            const { icon: Icon, color } = typeIcons[type]
            return (
              <li key={id} className="flex items-center gap-4 px-6 py-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                  <p className="text-xs text-gray-400">{format(date, 'MMM d, yyyy')}</p>
                </div>
                <Badge status={status} />
              </li>
            )
          })}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickActions.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl font-medium text-sm transition-colors ${color}`}
            >
              <span className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {label}
              </span>
              <ArrowRight className="w-4 h-4 opacity-60" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
