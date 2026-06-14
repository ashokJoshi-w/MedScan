import { useState } from 'react'
import VitalBadge from '../ui/VitalBadge'
import LangToggle from '../ui/LangToggle'
import Spinner from '../ui/Spinner'
import useAnalyze from '../../hooks/useAnalyze'
import useHistory from '../../hooks/useHistory'

const fields = [
  { id: 'bp', label: 'Blood Pressure (mmHg)', placeholder: '120/80', type: 'text' },
  { id: 'hr', label: 'Heart Rate (bpm)', placeholder: '72', type: 'number' },
  { id: 'bs', label: 'Blood Sugar (mg/dL)', placeholder: '98', type: 'number' },
  { id: 'temp', label: 'Temperature (°F)', placeholder: '98.6', type: 'number' },
  { id: 'spo2', label: 'SpO₂ (%)', placeholder: '98', type: 'number' },
  { id: 'weight', label: 'Weight (kg)', placeholder: '70', type: 'number' },
]

const VitalsTab = () => {
  const [values, setValues] = useState({})
  const [lang, setLang] = useState('en')
  const { analyze, loading, error, result, reset } = useAnalyze()
  const { addToHistory } = useHistory()

  const handleChange = (id, val) => setValues(prev => ({ ...prev, [id]: val }))

  const handleAnalyze = async () => {
    const filled = Object.entries(values).filter(([, v]) => v)
    if (!filled.length) return
    const text = filled.map(([k, v]) => `${k}: ${v}`).join(', ')
    const data = await analyze({ textInput: text, mode: 'vitals' })
    if (data) addToHistory({ type: 'vitals', title: 'Vitals check' })
  }

  const handleClear = () => {
    setValues({})
    reset()
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-border rounded-xl p-5 shadow-card">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Enter Vital Signs</h2>
        <p className="text-xs text-muted mb-4">Fill in one or more vitals to get an AI-powered health summary.</p>

        <div className="grid grid-cols-2 gap-3">
          {fields.map((f) => (
            <div key={f.id}>
              <label className="block text-xs font-medium text-muted mb-1.5">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={values[f.id] || ''}
                onChange={(e) => handleChange(f.id, e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={handleAnalyze}
            disabled={loading || !Object.values(values).some(v => v)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium rounded-xl transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? <Spinner /> : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            {loading ? 'Analysing...' : 'Analyse'}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2.5 text-sm font-medium text-muted hover:text-slate-700 border border-border rounded-xl hover:bg-slate-50 transition cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white border border-border rounded-xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Vitals Summary</h3>
            <LangToggle lang={lang} setLang={setLang} />
          </div>

          <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed">
            {lang === 'en' ? result.summary_en : result.summary_hi}
          </div>

          <div>
            {result.readings?.map((r, i) => (
              <div key={i} className="flex items-start justify-between py-3.5 border-b border-border last:border-0 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">{r.name} <span className="text-xs text-muted font-normal">{r.value}</span></p>
                  <p className="text-xs text-slate-500 mt-0.5">{lang === 'en' ? r.meaning_en : r.meaning_hi}</p>
                </div>
                <VitalBadge status={r.status} />
              </div>
            ))}
          </div>

          <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
            <p className="text-xs font-medium text-primary-700 uppercase tracking-wide mb-1">Advice</p>
            <p className="text-sm text-primary-800">
              {lang === 'en' ? result.advice_en : result.advice_hi}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default VitalsTab