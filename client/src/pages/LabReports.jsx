import { useState } from 'react'
import { FlaskConical } from 'lucide-react'
import UploadZone from '../components/ui/UploadZone'
import AnalysisActions from '../components/ui/AnalysisActions'
import LangToggle from '../components/ui/LangToggle'
import Badge from '../components/ui/Badge'
import useAnalyze from '../hooks/useAnalyze'
import useHistory from '../hooks/useHistory'

const statusMap = { normal: 'normal', high: 'abnormal', low: 'abnormal' }

export default function LabReports() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [lang, setLang] = useState('en')
  const { analyze, loading, error, result, reset } = useAnalyze()
  const { addToHistory } = useHistory()

  const canAnalyze = Boolean(file || text.trim())

  const handleAnalyze = async () => {
    if (!canAnalyze) return
    const data = await analyze({ file, textInput: text, mode: 'lab' })
    if (data) {
      const abnormal = data.values?.filter((v) => v.status !== 'normal').length ?? 0
      addToHistory({
        type: 'lab',
        title: file?.name || text.slice(0, 60) || 'Lab report',
        summary: data.summary_en?.slice(0, 80) || `${abnormal} abnormal value${abnormal !== 1 ? 's' : ''}`,
        status: abnormal > 0 ? 'abnormal' : 'normal',
      })
    }
  }

  const handleClear = () => {
    setFile(null)
    setText('')
    reset()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lab Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Upload or paste lab values for AI-powered analysis.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="card-interactive p-6">
          <UploadZone
            file={file}
            onFileSelect={setFile}
            accept="image/*,.pdf"
            label="Upload lab report image or PDF"
          />

          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Or paste lab values
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Hemoglobin: 10.2 g/dL, WBC: 11,000, Blood Sugar (fasting): 126 mg/dL..."
              rows={4}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50/80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition"
            />
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <AnalysisActions
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            loading={loading}
            canAnalyze={canAnalyze}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 min-h-[320px]">
          {result ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Report Summary</h2>
                <LangToggle lang={lang} setLang={setLang} />
              </div>

              <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed">
                {lang === 'en' ? result.summary_en : result.summary_hi}
              </div>

              {result.values?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Test Results</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.values.map((item, i) => (
                      <div key={i} className="rounded-xl border border-gray-100 p-4 hover:border-primary/20 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                          <Badge status={statusMap[item.status] || 'pending'} />
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                          {item.value} <span className="text-sm font-normal text-gray-500">{item.unit}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {lang === 'en' ? item.meaning_en : item.meaning_hi}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(result.advice_en || result.advice_hi) && (
                <div className="bg-gradient-to-br from-primary-light to-teal-50 rounded-xl p-4 border border-primary/10">
                  <p className="text-xs font-semibold text-primary-darker uppercase tracking-wide mb-1">Next Steps</p>
                  <p className="text-sm text-gray-700">
                    {lang === 'en' ? result.advice_en : result.advice_hi}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[280px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-4">
                <FlaskConical className="w-8 h-8 text-blue-300" />
              </div>
              <p className="text-sm font-semibold text-gray-600">No results yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">Upload a lab report or paste values, then click Analyse</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
