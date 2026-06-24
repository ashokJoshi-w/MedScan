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
import { HeartPulse, Activity, Scale, Sparkles, Loader2 } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
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
  borderRadius: '10px',
  border: '1px solid #E5E7EB',
  fontSize: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
}

export default function Vitals() {
  const [values, setValues] = useState({})
  const [logs, setLogs] = useState(loadLogs)
  const [lang, setLang] = useState('en')
  const { analyze, loading, error, result, reset } = useAnalyze()
  const { addToHistory } = useHistory()

  useEffect(() => {
    localStorage.setItem(VITALS_KEY, JSON.stringify(logs))
  }, [logs])

  const hasInput = Object.values(values).some((v) => v)

  const handleChange = (id, val) => setValues((prev) => ({ ...prev, [id]: val }))

  const handleSaveLog = () => {
    const filled = Object.entries(values).filter(([, v]) => v)
    if (!filled.length) return

    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...values,
    }

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

  const bpChartData = useMemo(() => {
    return logs
      .filter((l) => l.bp && l.bp.includes('/'))
      .slice(0, 7)
      .reverse()
      .map((l) => {
        const [sys, dia] = l.bp.split('/').map(Number)
        return {
          day: format(parseISO(l.date), 'EEE'),
          systolic: sys,
          diastolic: dia,
        }
      })
  }, [logs])

  const hrChartData = useMemo(() => {
    return logs
      .filter((l) => l.hr)
      .slice(0, 7)
      .reverse()
      .map((l) => ({
        day: format(parseISO(l.date), 'EEE'),
        bpm: Number(l.hr),
      }))
  }, [logs])

  const weightChartData = useMemo(() => {
    return logs
      .filter((l) => l.weight)
      .slice(0, 30)
      .reverse()
      .map((l) => ({
        day: format(parseISO(l.date), 'MMM d'),
        kg: Number(l.weight),
      }))
  }, [logs])

  const currentBP = latest?.bp || '—'
  const currentHR = latest?.hr ? `${latest.hr} bpm` : '—'
  const currentWeight = latest?.weight ? `${latest.weight} kg` : '—'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vitals</h1>
        <p className="text-sm text-gray-500 mt-1">Log your vitals and track trends over time.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard title="Blood Pressure" value={currentBP} icon={HeartPulse} color="teal" />
        <StatCard title="Heart Rate" value={currentHR} icon={Activity} color="rose" />
        <StatCard title="Weight" value={currentWeight} icon={Scale} color="purple" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Log Vitals</h2>
        <p className="text-sm text-gray-500 mb-5">Enter one or more readings, then save or run AI analysis.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((f) => (
            <div key={f.id}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={values[f.id] || ''}
                onChange={(e) => handleChange(f.id, e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-5 mt-5 border-t border-gray-100">
          <button
            type="button"
            onClick={handleSaveLog}
            disabled={!hasInput}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            Save Log
          </button>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !hasInput}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Analysing...' : 'Analyse with AI'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">AI Vitals Summary</h2>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
              {['en', 'hi'].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                    lang === l ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {l === 'en' ? 'EN' : 'HI'}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-light to-teal-50 rounded-xl p-4 border border-primary/10">
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === 'en' ? result.summary_en : result.summary_hi}
            </p>
          </div>
          {result.readings?.map((r, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{r.name} <span className="text-gray-500">{r.value}</span></p>
                <p className="text-xs text-gray-500 mt-0.5">{lang === 'en' ? r.meaning_en : r.meaning_hi}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                r.status === 'normal' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {bpChartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Blood Pressure Trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={bpChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="systolic" stroke="#1D9E75" strokeWidth={2} dot={{ r: 4 }} name="Systolic" />
              <Line type="monotone" dataKey="diastolic" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} name="Diastolic" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {hrChartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Heart Rate Trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={hrChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="bpm" stroke="#1D9E75" fill="#E1F5EE" strokeWidth={2} name="BPM" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {weightChartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Weight Trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weightChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="kg" stroke="#9333EA" fill="#F3E8FF" strokeWidth={2} name="Weight (kg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {logs.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <p className="text-sm text-gray-500">No vitals logged yet. Enter readings above to start tracking.</p>
        </div>
      )}
    </div>
  )
}
