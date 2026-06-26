import { Sparkles, Loader2 } from 'lucide-react'

export default function AnalysisActions({ onAnalyze, onClear, loading, canAnalyze, analyzeLabel = 'Analyse' }) {
  return (
    <div className="flex flex-wrap gap-3 pt-5 mt-5 border-t border-border">
      <button
        type="button"
        onClick={onAnalyze}
        disabled={loading || !canAnalyze}
        className="btn-primary text-sm py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer"
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
        className="btn-secondary text-sm py-2.5 px-5 cursor-pointer"
      >
        Clear
      </button>
    </div>
  )
}
