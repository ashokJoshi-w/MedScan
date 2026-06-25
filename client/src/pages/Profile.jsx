import { Link } from 'react-router-dom'
import { User, Mail, Shield, HeartPulse, Settings, LogOut, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import useDashboardStats from '../hooks/useDashboardStats'
import { HealthScoreCard } from '../components/ui/StatCard'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const stats = useDashboardStats()

  const displayName = user?.name || 'User'
  const initial = displayName.charAt(0).toUpperCase()
  const healthScore = stats.total === 0 ? 85 : Math.max(40, Math.min(98, Math.round(92 - (stats.recentActivity.filter((a) => a.status !== 'normal').length / Math.max(stats.recentActivity.length, 1)) * 30)))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Manage your personal information and health summary."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-primary-50 text-primary-darker flex items-center justify-center text-2xl font-bold">
                {initial}
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink">{displayName}</h2>
                <p className="text-sm text-ink-muted mt-1">{user?.email}</p>
                {user?.role && (
                  <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full bg-surface border border-border text-ink-muted capitalize">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-ink mb-6">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border">
                <User className="w-5 h-5 text-ink-faint" />
                <div>
                  <p className="text-xs text-ink-muted">Full Name</p>
                  <p className="text-sm font-medium text-ink">{displayName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border">
                <Mail className="w-5 h-5 text-ink-faint" />
                <div>
                  <p className="text-xs text-ink-muted">Email Address</p>
                  <p className="text-sm font-medium text-ink">{user?.email || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border">
                <Shield className="w-5 h-5 text-ink-faint" />
                <div>
                  <p className="text-xs text-ink-muted">Account Role</p>
                  <p className="text-sm font-medium text-ink capitalize">{user?.role || 'Patient'}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-ink mb-4">Account Settings</h3>
            <div className="space-y-2">
              <Link
                to="/settings"
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/20 hover:bg-surface transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-ink-muted" />
                  <span className="text-sm font-medium text-ink">Settings & Preferences</span>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-faint group-hover:text-primary transition-colors" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-4 rounded-xl border border-border hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-red-600">Sign out</span>
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <HealthScoreCard score={healthScore} />

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <HeartPulse className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-ink">Health Summary</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Total Records', value: stats.total },
                { label: 'Lab Reports', value: stats.labReports },
                { label: 'Prescriptions', value: stats.prescriptions },
                { label: 'Vitals Logged', value: stats.vitalsLogged },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-ink-muted">{label}</span>
                  <span className="text-sm font-semibold text-ink">{value}</span>
                </div>
              ))}
            </div>
            <Link to="/health-insights" className="btn-secondary text-sm w-full justify-center mt-6 py-2.5">
              View Insights
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
