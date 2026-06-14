import { useState } from 'react'
import UploadZone from '../ui/UploadZone'
import LabResultCard from '../ui/LabResultCard'
import LangToggle from '../ui/LangToggle'
import Spinner from '../ui/Spinner'
import useAnalyze from '../../hooks/useAnalyze'
import useHistory from '../../hooks/useHistory'

const LabTab = () => {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [lang, setLang] = useState('en')
  const { analyze, loading, error, result, reset } = useAnalyze()
  const { addToHistory } = useHistory()

  const handleAnalyze = async () => {
    if (!file && !text.trim()) return
    const data = await analyze({ file, textInput: text, mode: 'lab' })
    if (data) addToHistory({ type: 'lab', title: file?.name || 'Lab values' })
  }

  const handleClear = () => {
    setFile(null)
    setText('')
    reset()
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-border rounded-xl p-5 shadow-card">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Upload Lab Report</h2>
        <p className="text-xs text-muted mb-4">Upload your blood test, urine report, or any lab report as PDF or image.</p>

        <UploadZone onFile={setFile} accept="image/*,.pdf" />

        <div className="mt-4">
          <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
            Or paste lab values
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Hemoglobin: 10.2 g/dL, WBC: 11,000, Blood Sugar (fasting): 126 mg/dL..."
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || (!file && !text.trim())}
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
            <h3 className="text-sm font-semibold text-slate-800">Report Summary</h3>
            <LangToggle lang={lang} setLang={setLang} />
          </div>

          <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed">
            {lang === 'en' ? result.summary_en : result.summary_hi}
          </div>

          <div>
            {result.values?.map((item, i) => (
              <LabResultCard key={i} item={item} lang={lang} />
            ))}
          </div>

          <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
            <p className="text-xs font-medium text-primary-700 uppercase tracking-wide mb-1">Next Steps</p>
            <p className="text-sm text-primary-800">
              {lang === 'en' ? result.advice_en : result.advice_hi}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LabTab