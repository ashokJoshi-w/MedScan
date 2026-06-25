import { Sparkles, Loader2 } from 'lucide-react'

export default function AnalysisActions({ onAnalyze, onClear, loading, canAnalyze, analyzeLabel = 'Analyse' }) {
  return (
    <div className="flex flex-wrap gap-3 pt-5 mt-5 border-t border-border">
      <button
        type="button"
        onClick={onAnalyze}
        disabled={loading || !canAnalyze}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
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
        className="px-5 py-2.5 text-sm font-medium text-ink-muted hover:text-ink border border-border rounded-xl hover:bg-surface transition-colors cursor-pointer"
      >
        Clear
      </button>
    </div>
  )
}
