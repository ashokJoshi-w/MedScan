import { useState } from 'react'
import { FileSearch } from 'lucide-react'
import UploadZone from '../components/ui/UploadZone'
import AnalysisActions from '../components/ui/AnalysisActions'
import useAnalyze from '../hooks/useAnalyze'
import useHistory from '../hooks/useHistory'

export default function Prescription() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const { analyze, loading, error, result, reset } = useAnalyze()
  const { addToHistory } = useHistory()

  const canAnalyze = Boolean(file || text.trim())

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

  const medicines = Array.isArray(result) ? result : []

  const buildSummary = () => {
    if (!medicines.length) return ''
    const names = medicines.map((m) => m.name).filter(Boolean).join(', ')
    return `Analysis identified ${medicines.length} medication${medicines.length !== 1 ? 's' : ''}: ${names}. Review the dosage and instructions below and consult your doctor if you have questions.`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Prescription Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">Upload or paste a prescription to extract medicine details.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="card-interactive p-6">
          <UploadZone
            file={file}
            onFileSelect={setFile}
            accept="image/*,.pdf"
            label="Upload prescription image or PDF"
          />

          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Or paste prescription text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Tab Amoxicillin 500mg TDS x 5 days, Cap Omeprazole 20mg OD..."
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
          {medicines.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Results — {medicines.length} medicine{medicines.length !== 1 ? 's' : ''} found
              </h2>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Dosage</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Frequency</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {medicines.map((med, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">{med.name}</td>
                        <td className="px-4 py-3 text-gray-600">{med.dosage || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{med.instructions_en || 'As directed'}</td>
                        <td className="px-4 py-3 text-gray-600">{med.duration || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-br from-primary-light to-teal-50 rounded-xl p-5 border border-primary/10">
                <h3 className="text-xs font-semibold text-primary-darker uppercase tracking-wide mb-2">AI Summary</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{buildSummary()}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[280px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-4">
                <FileSearch className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-600">No results yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">Upload a prescription or paste text, then click Analyse</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
