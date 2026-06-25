import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  ArrowRight,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import useHistory from '../hooks/useHistory'
import useDashboardStats from '../hooks/useDashboardStats'
import { HoverLift } from '../components/ui/motion'

export default function HealthInsights() {
  const { history } = useHistory()
  const stats = useDashboardStats()

  const insights = useMemo(() => {
    if (history.length === 0) return null

    const abnormal = history.filter((h) => h.status === 'abnormal' || h.status === 'critical')
    const normal = history.filter((h) => h.status === 'normal')
    const prescriptions = history.filter((h) => h.type === 'prescription')
    const labs = history.filter((h) => h.type === 'lab')
    const vitals = history.filter((h) => h.type === 'vitals')

    const healthScore = Math.max(40, Math.min(98, Math.round(92 - (abnormal.length / Math.max(history.length, 1)) * 30)))

    return {
      healthScore,
      summary: history.length >= 3
        ? `You have ${history.length} health records on file. ${normal.length} show normal results${abnormal.length > 0 ? `, while ${abnormal.length} need review` : ''}. Keep logging vitals regularly for better trend analysis.`
        : `You're building your health profile with ${history.length} record${history.length !== 1 ? 's' : ''}. Upload more reports and log vitals to unlock deeper AI insights.`,
      recommendations: [
        abnormal.length > 0 && {
          title: 'Review flagged results',
          desc: `${abnormal.length} record${abnormal.length !== 1 ? 's' : ''} have values outside normal range. Consider discussing these with your doctor.`,
          priority: 'high',
        },
        vitals.length < 3 && {
          title: 'Log vitals more frequently',
          desc: 'Regular vitals tracking helps identify trends early. Aim to log at least once a week.',
          priority: 'medium',
        },
        prescriptions.length > 0 && {
          title: 'Review medication schedule',
          desc: `You have ${prescriptions.length} prescription${prescriptions.length !== 1 ? 's' : ''} on file. Set reminders to stay on schedule.`,
          priority: 'medium',
        },
        labs.length === 0 && {
          title: 'Upload a lab report',
          desc: 'Lab reports provide valuable baseline data for tracking your health over time.',
          priority: 'low',
        },
      ].filter(Boolean),
      riskFactors: abnormal.length > 0
        ? abnormal.slice(0, 3).map((item) => ({
            title: item.title || 'Flagged result',
            desc: item.summary || 'This record has values that may need medical attention.',
          }))
        : [],
      positiveTrends: [
        normal.length > 0 && {
          title: `${normal.length} normal results`,
          desc: 'Most of your recent health data is within healthy ranges.',
        },
        stats.vitalsLogged > 0 && {
          title: 'Active vitals tracking',
          desc: `You've logged vitals ${stats.vitalsLogged} time${stats.vitalsLogged !== 1 ? 's' : ''}. Consistency is key to spotting changes early.`,
        },
        stats.trends.total > 0 && {
          title: 'Growing health profile',
          desc: 'Your health records increased this week — great progress on building your medical history.',
        },
      ].filter(Boolean),
    }
  }, [history, stats])

  if (!insights) {
    return (
      <div>
        <PageHeader
          title="Health Insights"
          description="AI-generated summaries and recommendations based on your health data."
        />
        <Card>
          <EmptyState
            icon={Sparkles}
            title="No insights yet"
            description="Upload reports, prescriptions, or log vitals to receive personalised AI health insights."
            actionLabel="Upload Report"
            actionTo="/upload-report"
          />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Health Insights"
        description="Personalised AI summaries based on your health records."
        badge={
          <span className="section-label">
            <Sparkles className="w-3.5 h-3.5" />
            AI Generated
          </span>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <HeartPulse className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">Health Summary</h2>
              <p className="text-sm text-ink-muted mt-3 leading-relaxed">{insights.summary}</p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border">
                <span className="text-xs text-ink-muted">Overall score</span>
                <span className={`text-sm font-bold ${insights.healthScore >= 80 ? 'text-success' : insights.healthScore >= 60 ? 'text-warning' : 'text-danger'}`}>
                  {insights.healthScore}/100
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-ink mb-4">Quick Stats</h2>
          <div className="space-y-3">
            {[
              { label: 'Total Records', value: history.length },
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
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Recommendations
          </h2>
          <div className="space-y-3">
            {insights.recommendations.map((rec, i) => (
              <HoverLift key={i}>
                <Card className="!p-5">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      rec.priority === 'high' ? 'bg-danger' : rec.priority === 'medium' ? 'bg-warning' : 'bg-accent-blue'
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-ink">{rec.title}</p>
                      <p className="text-sm text-ink-muted mt-1 leading-relaxed">{rec.desc}</p>
                    </div>
                  </div>
                </Card>
              </HoverLift>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            Positive Trends
          </h2>
          <div className="space-y-3">
            {insights.positiveTrends.map((trend, i) => (
              <Card key={i} className="!p-5">
                <p className="text-sm font-semibold text-ink">{trend.title}</p>
                <p className="text-sm text-ink-muted mt-1 leading-relaxed">{trend.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {insights.riskFactors.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Areas to Review
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.riskFactors.map((risk, i) => (
              <Card key={i} className="!p-5 border-amber-100 bg-amber-50/30">
                <p className="text-sm font-semibold text-ink">{risk.title}</p>
                <p className="text-sm text-ink-muted mt-2 leading-relaxed">{risk.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="bg-primary-50 border-primary/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-ink">Want more detailed insights?</p>
            <p className="text-sm text-ink-muted mt-1">Upload more health data to improve AI recommendations.</p>
          </div>
          <Link to="/upload-report" className="btn-primary text-sm py-2.5 px-5 shrink-0">
            Upload Report
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>
    </div>
  )
}
