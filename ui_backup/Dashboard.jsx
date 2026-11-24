import { Link } from 'react-router-dom'
import {
  FileText,
  FlaskConical,
  HeartPulse,
  ArrowRight,
  History,
  Upload,
  Sparkles,
  Bell,
  Pill,
} from 'lucide-react'
import StatCard, { HealthScoreCard } from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import DashboardHeader from '../components/layout/DashboardHeader'
import useDashboardStats from '../hooks/useDashboardStats'
import { HoverLift } from '../components/ui/motion'

const typeIcons = {
  prescription: { icon: Pill, color: 'bg-green-100 text-primary ring-primary/10' },
  lab: { icon: FlaskConical, color: 'bg-blue-100 text-accent-blue ring-blue-100' },
  vitals: { icon: HeartPulse, color: 'bg-yellow-200 text-success ring-green-100' },
}

const quickActions = [
  { to: '/upload-report', label: 'Upload Report', desc: 'Analyse lab results', icon: Upload, color: 'bg-blue-50 text-accent-blue' },
  { to: '/prescription', label: 'Add Prescription', desc: 'Decode medicines', icon: Pill, color: 'bg-primary-50 text-primary' },
  { to: '/vitals', label: 'Log Vitals', desc: 'Track health metrics', icon: HeartPulse, color: 'bg-red-50 text-success' },
  { to: '/health-insights', label: 'View Insights', desc: 'AI recommendations', icon: Sparkles, color: 'bg-amber-50 text-warning' },
]

/**
 * Overall health score.
 *
 * Aggregates every individual report's score (normalised 0-100) instead of
 * assuming a near-perfect baseline. Uses each report's actual value-level
 * findings (high / low / critical) so the number moves with real data.
 *
 * Weighting: recent records count more than old ones, so a fresh critical
 * result drags the score down even if the history was clean.
 */
function scoreReport(report) {
  const values = report.analysisResult?.values
  const readings = report.analysisResult?.readings

  let score = 100
  let critical = 0
  let abnormal = 0

  if (Array.isArray(values)) {
    values.forEach((v) => {
      const st = String(v.status || '').toLowerCase()
      if (st === 'critical_high' || st === 'critical_low' || st === 'critical') {
        critical++
        score -= 25
      } else if (st === 'high' || st === 'low' || st === 'concerning') {
        abnormal++
        score -= 10
      }
    })
  }

  if (Array.isArray(readings)) {
    readings.forEach((r) => {
      const st = String(r.status || '').toLowerCase()
      if (st === 'critical') {
        critical++
        score -= 25
      } else if (st === 'high' || st === 'low' || st === 'concerning') {
        abnormal++
        score -= 10
      }
    })
  }

  // Fall back to the coarse status when per-value data is missing
  if (!Array.isArray(values) && !Array.isArray(readings)) {
    const st = String(report.status || '').toLowerCase()
    if (st === 'critical') score -= 40
    else if (st === 'abnormal') score -= 20
  }

  if (report.analysisResult?.requiresAttention === true && critical === 0 && abnormal === 0) {
    score -= 15
  }

  return Math.max(0, Math.min(100, score))
}

function computeHealthScore(stats) {
  // No records yet — nothing to judge. Returning null lets the UI show a dash.
  if (stats.total === 0 || !stats.recentActivity?.length) return null

  // Newest first; weight recent entries more heavily.
  const scored = stats.recentActivity.map((report, i) => {
    const weight = 1 / (i + 1) // 1, 1/2, 1/3, ...
    return { score: scoreReport(report), weight }
  })

  const totalWeight = scored.reduce((sum, s) => sum + s.weight, 0)
  const weightedAvg =
    scored.reduce((sum, s) => sum + s.score * s.weight, 0) / totalWeight

  return Math.round(Math.max(0, Math.min(100, weightedAvg)))
}

export default function Dashboard() {
  const stats = useDashboardStats()
  const healthScore = computeHealthScore(stats)

  return (
    <div>
      <DashboardHeader
        title="Dashboard"
        subtitle={stats.total === 0 ? 'Get started by uploading your first report' : `${stats.total} records in your health profile`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Reports" value={stats.labReports} icon={FlaskConical} color="blue" trend={stats.trends.labReports} trendLabel="vs last week" index={0} />
        <StatCard title="Prescriptions" value={stats.prescriptions} icon={Pill} color="teal" trend={stats.trends.prescriptions} trendLabel="vs last week" index={1} />
        <StatCard title="Vitals Logged" value={stats.vitalsLogged} icon={HeartPulse} color="green" trend={stats.trends.vitals} trendLabel="vs last week" index={2} />
        <StatCard title="Total Records" value={stats.total} icon={FileText} color="teal" trend={stats.trends.total} trendLabel="vs last week" index={3} />
        <HealthScoreCard score={healthScore} index={4} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" padding={false}>
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Recent Reports</h2>
            {stats.total > 0 && (
              <Link to="/reports" className="text-sm font-medium hover:text-primary-dark transition-colors">
                View all
              </Link>
            )}
          </div>

          {stats.recentActivity.length === 0 ? (
            <EmptyState
              icon={History}
              title="No reports yet"
              description="Upload a lab report or prescription to see your recent activity here."
              actionLabel="Upload Report"
              actionTo="/upload-report"
            />
          ) : (
            <ul className="divide-y divide-border">
              {stats.recentActivity.map((item) => {
                const { icon: Icon, color } = typeIcons[item.type] || typeIcons.prescription
                return (
                  <li key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface/80 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ring-1 ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                      <p className="text-xs text-ink-faint mt-0.5">{item.date}</p>
                    </div>
                    <Badge status={item.status} />
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card padding={false}>
            <div className="px-6 py-5 border-b border-border flex items-center gap-2">
              <Bell className="w-4 h-4 text-ink-muted" />
              <h2 className="text-lg font-semibold text-ink">Reminders</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-surface border border-border">
                  <p className="text-sm font-medium text-ink">Log vitals weekly</p>
                  <p className="text-xs text-ink-muted mt-1">Track BP and heart rate regularly</p>
                </div>
                <div className="p-4 rounded-xl bg-surface border border-border">
                  <p className="text-sm font-medium text-ink">Review health insights</p>
                  <p className="text-xs text-ink-muted mt-1">Check AI recommendations monthly</p>
                </div>
              </div>
            </div>
          </Card>

          <Card padding={false}>
            <div className="px-6 py-5 border-b border-border flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-ink">Health Insights</h2>
            </div>
            <div className="p-6">
              {stats.total === 0 ? (
                <p className="text-sm text-ink-muted">Upload data to receive personalised AI insights.</p>
              ) : (
                <p className="text-sm text-ink-muted leading-relaxed">
                  Based on your {stats.total} records, your health profile is {healthScore >= 80 ? 'looking good' : 'needs attention'}. 
                  {' '}<Link to="/health-insights" className="text-primary font-medium hover:underline">View details</Link>
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-ink mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ to, label, desc, icon: Icon, color }) => (
            <HoverLift key={to}>
              <Link to={to} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-border shadow-card hover:shadow-elevated hover:border-primary/20 transition-all group">
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink">{label}</p>
                  <p className="text-xs text-ink-muted">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-faint group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            </HoverLift>
          ))}
        </div>
      </div>
    </div>
  )
}
