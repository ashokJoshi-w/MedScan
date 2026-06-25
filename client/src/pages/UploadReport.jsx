import { useState } from 'react'
import { FlaskConical, Clock, FileText } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import UploadZone from '../components/ui/UploadZone'
import AnalysisActions from '../components/ui/AnalysisActions'
import LangToggle from '../components/ui/LangToggle'
import Badge from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import { AnalysisLoading } from '../components/ui/LoadingState'
import { Textarea } from '../components/ui/Input'
import useAnalyze from '../hooks/useAnalyze'
import useHistory from '../hooks/useHistory'

const statusMap = { normal: 'healthy', high: 'abnormal', low: 'abnormal' }

export default function UploadReport() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [lang, setLang] = useState('en')
  const { analyze, loading, error, result, reset } = useAnalyze()
  const { history, addToHistory } = useHistory()

  const recentUploads = history.filter((h) => h.type === 'lab').slice(0, 5)
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
    <div>
      <PageHeader
        title="Upload Report"
        description="Upload a lab report image or PDF for instant AI-powered analysis."
      />

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <UploadZone
              file={file}
              onFileSelect={setFile}
              accept="image/*,.pdf"
              label="Drag and drop your lab report here"
              sublabel="Supports PDF, JPG, and PNG up to 10MB"
              large
            />

            <div className="mt-6">
              <Textarea
                label="Or paste lab values"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Hemoglobin: 10.2 g/dL, WBC: 11,000, Blood Sugar (fasting): 126 mg/dL..."
                rows={4}
              />
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}

            <AnalysisActions
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              loading={loading}
              canAnalyze={canAnalyze}
            />
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-ink mb-4">Supported Formats</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: 'PDF Documents', desc: 'Scanned lab reports' },
                { label: 'JPG / PNG Images', desc: 'Photos of reports' },
                { label: 'Plain Text', desc: 'Pasted lab values' },
              ].map(({ label, desc }) => (
                <div key={label} className="p-4 rounded-xl bg-surface border border-border">
                  <p className="text-sm font-medium text-ink">{label}</p>
                  <p className="text-xs text-ink-muted mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="min-h-[320px]">
            {loading ? (
              <AnalysisLoading message="Analysing lab report..." />
            ) : result ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-ink">Analysis Results</h2>
                  <LangToggle lang={lang} setLang={setLang} />
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border text-sm text-ink-muted leading-relaxed">
                  {lang === 'en' ? result.summary_en : result.summary_hi}
                </div>

                {result.values?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-ink">Test Results</h3>
                    {result.values.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border">
                        <div>
                          <p className="text-sm font-medium text-ink">{item.name}</p>
                          <p className="text-xs text-ink-muted">{item.value} {item.unit}</p>
                        </div>
                        <Badge status={statusMap[item.status] || 'pending'} />
                      </div>
                    ))}
                    {result.values.length > 4 && (
                      <p className="text-xs text-ink-faint text-center">+{result.values.length - 4} more values</p>
                    )}
                  </div>
                )}

                {(result.advice_en || result.advice_hi) && (
                  <div className="p-4 rounded-xl bg-primary-50 border border-primary/10">
                    <p className="text-xs font-semibold text-primary-darker mb-1">Recommendations</p>
                    <p className="text-sm text-ink-muted">
                      {lang === 'en' ? result.advice_en : result.advice_hi}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                icon={FlaskConical}
                title="No analysis yet"
                description="Upload a lab report or paste values, then click Analyse."
              />
            )}
          </Card>

          <Card padding={false}>
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <Clock className="w-4 h-4 text-ink-muted" />
              <h3 className="text-sm font-semibold text-ink">Recent Uploads</h3>
            </div>
            {recentUploads.length === 0 ? (
              <p className="px-6 py-8 text-sm text-ink-muted text-center">No recent uploads</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentUploads.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-6 py-3">
                    <FileText className="w-4 h-4 text-accent-blue shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">{item.title}</p>
                      <p className="text-xs text-ink-faint">{item.date}</p>
                    </div>
                    <Badge status={item.status === 'normal' ? 'healthy' : item.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
