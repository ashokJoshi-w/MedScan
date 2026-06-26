import { Loader2 } from 'lucide-react'

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-blue-soft flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
      <p className="text-sm text-ink-muted">{message}</p>
    </div>
  )
}

export function AnalysisLoading({ message = 'Analysing with AI...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-blue-soft flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
        </div>
        <div className="absolute -inset-2 rounded-3xl border-2 border-primary/20 animate-pulse" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-ink">{message}</p>
        <p className="text-xs text-ink-muted mt-1">This usually takes a few seconds</p>
      </div>
      <div className="w-48 h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full animate-pulse"
          style={{ width: '50%', background: 'linear-gradient(90deg, #10B981, #3B82F6)' }}
        />
      </div>
    </div>
  )
}
