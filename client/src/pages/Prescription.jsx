import { useState } from 'react'
import { ChevronDown, ChevronUp, Pill, Clock, User, Bell } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import UploadZone from '../components/ui/UploadZone'
import AnalysisActions from '../components/ui/AnalysisActions'
import { Card } from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import { AnalysisLoading } from '../components/ui/LoadingState'
import { Textarea } from '../components/ui/Input'
import useAnalyze from '../hooks/useAnalyze'
import useHistory from '../hooks/useHistory'

function PrescriptionCard({ medicine, index, defaultOpen = false }) {
  const [expanded, setExpanded] = useState(defaultOpen)

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden hover:shadow-card transition-shadow">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-surface/50 transition-colors"
      >
        <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
          <Pill className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-ink">{medicine.name || `Medicine ${index + 1}`}</p>
          <p className="text-sm text-ink-muted mt-0.5">{medicine.dosage || 'Dosage not specified'}</p>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm text-ink-muted shrink-0">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {medicine.instructions_en || 'As directed'}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-ink-faint shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-ink-faint shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-0 border-t border-border">
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1">Purpose</p>
              <p className="text-sm text-ink">{medicine.purpose_en || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1">Duration</p>
              <p className="text-sm text-ink">{medicine.duration || '—'}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1">Instructions</p>
              <p className="text-sm text-ink-muted leading-relaxed">{medicine.instructions_en || 'Follow doctor\'s advice'}</p>
            </div>
            {medicine.side_effects_en?.length > 0 && (
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1">Side Effects</p>
                <ul className="text-sm text-ink-muted space-y-1">
                  {medicine.side_effects_en.map((effect, i) => (
                    <li key={i}>• {effect}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
            <Bell className="w-4 h-4 text-warning shrink-0" />
            <p className="text-xs text-ink-muted">
              Reminder: Take {medicine.instructions_en || 'as prescribed'} — set a daily alarm to stay on schedule.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Prescription() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const { analyze, loading, error, result, reset } = useAnalyze()
  const { history, addToHistory } = useHistory()

  const canAnalyze = Boolean(file || text.trim())
  const medicines = Array.isArray(result) ? result : []
  const savedPrescriptions = history.filter((h) => h.type === 'prescription').slice(0, 3)

  const handleAnalyze = async () => {
    if (!canAnalyze) return
    const data = await analyze({ file, textInput: text, mode: 'prescription' })
    if (data) {
      addToHistory({
        type: 'prescription',
        title: file?.name || text.slice(0, 60) || 'Prescription text',
        summary: Array.isArray(data)
          ? `${data.length} medicine${data.length !== 1 ? 's' : ''} analysed`
          : 'Prescription analysed',
      })
    }
  }

  const handleClear = () => {
    setFile(null)
    setText('')
    reset()
  }

  const buildSummary = () => {
    if (!medicines.length) return ''
    const names = medicines.map((m) => m.name).filter(Boolean).join(', ')
    return `Analysis identified ${medicines.length} medication${medicines.length !== 1 ? 's' : ''}: ${names}. Review dosage and instructions below.`
  }

  return (
    <div>
      <PageHeader
        title="Prescriptions"
        description="Upload or paste a prescription to decode medicines, dosages, and schedules."
      />

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <UploadZone
            file={file}
            onFileSelect={setFile}
            accept="image/*,.pdf"
            label="Upload prescription image or PDF"
          />

          <div className="mt-4">
            <Textarea
              label="Or paste prescription text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Tab Amoxicillin 500mg TDS x 5 days, Cap Omeprazole 20mg OD..."
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

        <Card className="min-h-[320px]">
          {loading ? (
            <AnalysisLoading message="Analysing prescription..." />
          ) : medicines.length > 0 ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-primary-50 border border-primary/10">
                <p className="text-xs font-semibold text-primary-darker mb-1">AI Summary</p>
                <p className="text-sm text-ink-muted leading-relaxed">{buildSummary()}</p>
              </div>
              <p className="text-sm font-semibold text-ink">{medicines.length} medicine{medicines.length !== 1 ? 's' : ''} found</p>
            </div>
          ) : (
            <EmptyState
              icon={Pill}
              title="No prescription analysed"
              description="Upload or paste a prescription, then click Analyse to see medicine details."
            />
          )}
        </Card>
      </div>

      {medicines.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-ink">Medication Details</h2>
          {medicines.map((med, i) => (
            <PrescriptionCard key={i} medicine={med} index={i} defaultOpen={i === 0} />
          ))}
        </div>
      )}

      {savedPrescriptions.length > 0 && medicines.length === 0 && (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-4">Recent Prescriptions</h2>
          <div className="space-y-3">
            {savedPrescriptions.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-border">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{item.title}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{item.summary} · {item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
