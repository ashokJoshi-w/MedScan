import { useState } from 'react'
import UploadZone from '../ui/UploadZone'
import MedicineCard from '../ui/MedicineCard'
import Spinner from '../ui/Spinner'
import useAnalyze from '../../hooks/useAnalyze'
import useHistory from '../../hooks/useHistory'

const PrescriptionTab = () => {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const { analyze, loading, error, result, reset } = useAnalyze()
  const { addToHistory } = useHistory()

  const handleAnalyze = async () => {
    if (!file && !text.trim()) return
    const data = await analyze({ file, textInput: text, mode: 'prescription' })
    if (data) addToHistory({ type: 'prescription', title: file?.name || 'Prescription text' })
  }

  const handleClear = () => {
    setFile(null)
    setText('')
    reset()
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-border rounded-xl p-5 shadow-card">
        <h2 className="text-sm font-semibold text-slate-800 mb-1">Upload Prescription</h2>
        <p className="text-xs text-muted mb-4">Upload a photo or image of any handwritten or printed prescription.</p>

        <UploadZone onFile={setFile} accept="image/*,.pdf" />

        <div className="mt-4">
          <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
            Or paste prescription text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Tab Amoxicillin 500mg TDS x 5 days, Cap Omeprazole 20mg OD..."
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

      {result && !Array.isArray(result) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          Analysis completed but returned an unexpected format. Try again with clearer text or a sharper image.
        </div>
      )}

      {result && Array.isArray(result) && result.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          No medicines were detected. Try uploading a clearer image or pasting the prescription text.
        </div>
      )}

      {result && Array.isArray(result) && result.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted uppercase tracking-wide px-1">
            {result.length} medicine{result.length !== 1 ? 's' : ''} found
          </p>
          {result.map((med, i) => (
            <MedicineCard key={i} medicine={med} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PrescriptionTab