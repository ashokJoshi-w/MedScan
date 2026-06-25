import { useState, useMemo, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { HeartPulse, Activity, Scale, Droplets, Sparkles, Loader2 } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import { AnalysisLoading } from '../components/ui/LoadingState'
import useAnalyze from '../hooks/useAnalyze'
import useHistory from '../hooks/useHistory'

const VITALS_KEY = 'medscan_vitals_log'

const fields = [
  { id: 'bp', label: 'Blood Pressure (mmHg)', placeholder: '120/80', type: 'text' },
  { id: 'hr', label: 'Heart Rate (bpm)', placeholder: '72', type: 'number' },
  { id: 'weight', label: 'Weight (kg)', placeholder: '70', type: 'number' },
  { id: 'bs', label: 'Blood Sugar (mg/dL)', placeholder: '98', type: 'number' },
  { id: 'temp', label: 'Temperature (°F)', placeholder: '98.6', type: 'number' },
  { id: 'spo2', label: 'SpO₂ (%)', placeholder: '98', type: 'number' },
]

const loadLogs = () => {
  try {
    const saved = localStorage.getItem(VITALS_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const tooltipStyle = {
  borderRadius: '12px',
  border: '1px solid #E6EEF0',
  fontSize: '12px',
  boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
}

function computeBMI(weight, heightCm = 170) {
  if (!weight) return null
  const h = heightCm / 100
  return (Number(weight) / (h * h)).toFixed(1)
}

export default function Vitals() {
  const [values, setValues] = useState({})
  const [logs, setLogs] = useState(loadLogs)
  const [lang, setLang] = useState('en')
  const { analyze, loading, error, result, reset } = useAnalyze()
  const { addToHistory } = useHistory()

  useEffect(() => {
    localStorage.setItem(VITALS_KEY, JSON.stringify(logs))
    window.dispatchEvent(new Event('medscan-vitals-update'))
  }, [logs])

  const hasInput = Object.values(values).some((v) => v)
  const handleChange = (id, val) => setValues((prev) => ({ ...prev, [id]: val }))

  const handleSaveLog = () => {
    const filled = Object.entries(values).filter(([, v]) => v)
    if (!filled.length) return

    const entry = { id: Date.now(), date: new Date().toISOString(), ...values }
    setLogs((prev) => [entry, ...prev].slice(0, 90))
    addToHistory({
      type: 'vitals',
      title: 'Vitals logged',
      summary: [
        values.bp && `BP ${values.bp}`,
        values.hr && `HR ${values.hr} bpm`,
        values.weight && `Weight ${values.weight} kg`,
      ].filter(Boolean).join(', ') || 'Vitals entry saved',
      status: 'normal',
    })
    setValues({})
  }

  const handleAnalyze = async () => {
    const filled = Object.entries(values).filter(([, v]) => v)
    if (!filled.length) return
    const text = filled.map(([k, v]) => `${k}: ${v}`).join(', ')
    const data = await analyze({ textInput: text, mode: 'vitals' })
    if (data) {
      const entry = { id: Date.now(), date: new Date().toISOString(), ...values }
      setLogs((prev) => [entry, ...prev].slice(0, 90))
      addToHistory({
        type: 'vitals',
        title: 'Vitals AI analysis',
        summary: data.summary_en?.slice(0, 80) || 'Vitals analysed',
        status: data.readings?.some((r) => r.status !== 'normal') ? 'abnormal' : 'normal',
      })
      setValues({})
    }
  }

  const handleClear = () => {
    setValues({})
    reset()
  }

  const latest = logs[0]
  const bmi = computeBMI(latest?.weight)

  const bpChartData = useMemo(() => {
    return logs
      .filter((l) => l.bp && l.bp.includes('/'))
      .slice(0, 7)
      .reverse()
      .map((l) => {
        const [sys, dia] = l.bp.split('/').map(Number)
        return { day: format(parseISO(l.date), 'EEE'), systolic: sys, diastolic: dia }
      })
  }, [logs])

  const hrChartData = useMemo(() => {
    return logs
      .filter((l) => l.hr)
      .slice(0, 7)
      .reverse()
      .map((l) => ({ day: format(parseISO(l.date), 'EEE'), bpm: Number(l.hr) }))
  }, [logs])

  const weightChartData = useMemo(() => {
    return logs
      .filter((l) => l.weight)
      .slice(0, 30)
      .reverse()
      .map((l) => ({ day: format(parseISO(l.date), 'MMM d'), kg: Number(l.weight) }))
  }, [logs])

  return (
    <div>
      <PageHeader
        title="Vitals"
        description="Track blood pressure, heart rate, weight, and more over time."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Blood Pressure" value={latest?.bp || '—'} icon={HeartPulse} color="teal" index={0} />
        <StatCard title="Heart Rate" value={latest?.hr ? `${latest.hr}` : '—'} icon={Activity} color="green" suffix={latest?.hr ? ' bpm' : ''} index={1} />
        <StatCard title="Blood Sugar" value={latest?.bs || '—'} icon={Droplets} color="amber" suffix={latest?.bs ? ' mg/dL' : ''} index={2} />
        <StatCard title="Weight" value={latest?.weight || '—'} icon={Scale} color="blue" suffix={latest?.weight ? ' kg' : ''} index={3} />
        <StatCard title="BMI" value={bmi || '—'} icon={Activity} color="teal" index={4} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-ink mb-1">Log Vitals</h2>
          <p className="text-sm text-ink-muted mb-6">Enter one or more readings, then save or run AI analysis.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((f) => (
              <div key={f.id}>
                <label className="block text-sm font-medium text-ink mb-2">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={values[f.id] || ''}
                  onChange={(e) => handleChange(f.id, e.target.value)}
                  className="input-field"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-5 mt-5 border-t border-border">
            <button
              type="button"
              onClick={handleSaveLog}
              disabled={!hasInput}
              className="btn-secondary text-sm py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Log
            </button>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !hasInput}
              className="btn-primary text-sm py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Analysing...' : 'Analyse with AI'}
            </button>
            <button type="button" onClick={handleClear} className="btn-ghost text-sm">
              Clear
            </button>
          </div>
        </Card>

        <Card className="min-h-[280px]">
          {loading ? (
            <AnalysisLoading message="Analysing vitals..." />
          ) : result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-ink">AI Summary</h2>
                <div className="flex gap-1 bg-surface border border-border rounded-lg p-0.5">
                  {['en', 'hi'].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLang(l)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                        lang === l ? 'bg-white text-ink shadow-sm' : 'text-ink-muted'
                      }`}
                    >
                      {l === 'en' ? 'EN' : 'HI'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-primary-50 border border-primary/10">
                <p className="text-sm text-ink-muted leading-relaxed">
                  {lang === 'en' ? result.summary_en : result.summary_hi}
                </p>
              </div>
              {result.readings?.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-ink">{r.name} <span className="text-ink-muted">{r.value}</span></p>
                    <p className="text-xs text-ink-faint mt-0.5">{lang === 'en' ? r.meaning_en : r.meaning_hi}</p>
                  </div>
                  <Badge status={r.status === 'normal' ? 'healthy' : r.status} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={HeartPulse}
              title="No analysis yet"
              description="Enter vitals and click Analyse with AI for insights."
            />
          )}
        </Card>
      </div>

      {bpChartData.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-ink mb-6">Blood Pressure Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={bpChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6EEF0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="systolic" stroke="#14B8A6" strokeWidth={2} dot={{ r: 4 }} name="Systolic" />
              <Line type="monotone" dataKey="diastolic" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} name="Diastolic" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {hrChartData.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-ink mb-6">Heart Rate Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={hrChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6EEF0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="bpm" stroke="#14B8A6" fill="#CCFBF1" strokeWidth={2} name="BPM" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {weightChartData.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-ink mb-6">Weight Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weightChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6EEF0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="#94A3B8" />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="kg" stroke="#3B82F6" fill="#EFF6FF" strokeWidth={2} name="Weight (kg)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {logs.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-ink">Recent Vitals</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-ink-muted uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-ink-muted uppercase">BP</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-ink-muted uppercase">HR</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-ink-muted uppercase">Weight</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-ink-muted uppercase">Sugar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-3 text-ink-muted">{format(parseISO(log.date), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-3 text-ink">{log.bp || '—'}</td>
                    <td className="px-6 py-3 text-ink">{log.hr ? `${log.hr} bpm` : '—'}</td>
                    <td className="px-6 py-3 text-ink">{log.weight ? `${log.weight} kg` : '—'}</td>
                    <td className="px-6 py-3 text-ink">{log.bs ? `${log.bs} mg/dL` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {logs.length === 0 && !result && (
        <Card>
          <EmptyState
            icon={HeartPulse}
            title="No vitals logged yet"
            description="Enter your readings above to start tracking your health metrics."
          />
        </Card>
      )}
    </div>
  )
}
