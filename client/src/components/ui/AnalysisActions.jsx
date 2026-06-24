import { Sparkles, Loader2 } from 'lucide-react'

export default function AnalysisActions({ onAnalyze, onClear, loading, canAnalyze, analyzeLabel = 'Analyse' }) {
  return (
    <div className="flex flex-wrap gap-3 pt-4 mt-4 border-t border-gray-100">
      <button
        type="button"
        onClick={onAnalyze}
        disabled={loading || !canAnalyze}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all cursor-pointer"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {loading ? 'Analysing...' : analyzeLabel}
      </button>
      <button
        type="button"
        onClick={onClear}
        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
      >
        Clear
      </button>
    </div>
  )
}
