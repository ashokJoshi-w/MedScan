import { useState, useMemo } from 'react'
import { Search, Trash2, FlaskConical, HeartPulse, Clock, Pill } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { Card } from '../components/ui/Card'
import useHistory from '../hooks/useHistory'

const typeConfig = {
  prescription: { label: 'Prescription', color: 'bg-primary-50 text-primary border-primary/20', icon: Pill, dot: 'bg-primary' },
  lab: { label: 'Lab Report', color: 'bg-blue-50 text-accent-blue border-blue-100', icon: FlaskConical, dot: 'bg-accent-blue' },
  vitals: { label: 'Vitals', color: 'bg-green-50 text-success border-green-100', icon: HeartPulse, dot: 'bg-success' },
}

export default function History() {
  const { history, removeFromHistory, clearHistory } = useHistory()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [confirmClear, setConfirmClear] = useState(false)

  const entries = useMemo(() => {
    return history
      .map((item, index) => ({
        id: item.id ?? index,
        date: item.date,
        type: item.type || 'prescription',
        title: item.title || item.summary || 'Analysis record',
        summary: item.summary || item.title || 'Analysis record',
        status: item.status || 'normal',
      }))
      .filter((entry) => {
        const matchesFilter = filter === 'all' || entry.type === filter
        const matchesSearch =
          !search.trim() ||
          entry.summary.toLowerCase().includes(search.toLowerCase()) ||
          entry.title.toLowerCase().includes(search.toLowerCase()) ||
          entry.type.toLowerCase().includes(search.toLowerCase())
        return matchesFilter && matchesSearch
      })
  }, [history, search, filter])

  return (
    <div>
      <PageHeader
        title="History"
        description="A complete timeline of your uploads, analyses, prescriptions, and vitals."
        action={
          history.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                if (confirmClear) {
                  clearHistory()
                  setConfirmClear(false)
                } else {
                  setConfirmClear(true)
                  setTimeout(() => setConfirmClear(false), 3000)
                }
              }}
              className={`text-sm font-medium px-4 py-2.5 rounded-xl border transition cursor-pointer ${
                confirmClear
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                  : 'text-ink-muted border-border hover:bg-white'
              }`}
            >
              {confirmClear ? 'Confirm clear all' : 'Clear all'}
            </button>
          ) : null
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history..."
            className="input-field pl-10"
            aria-label="Search history"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-full sm:w-44 cursor-pointer"
          aria-label="Filter by type"
        >
          <option value="all">All Types</option>
          <option value="prescription">Prescriptions</option>
          <option value="lab">Lab Reports</option>
          <option value="vitals">Vitals</option>
        </select>
      </div>

      {entries.length === 0 ? (
        <Card padding={false}>
          <EmptyState
            icon={Clock}
            title={history.length === 0 ? 'No history yet' : 'No matching entries'}
            description={
              history.length === 0
                ? 'Your analyses and uploads will appear here automatically.'
                : 'Try adjusting your filters or search term.'
            }
            actionLabel={history.length === 0 ? 'Upload Report' : undefined}
            actionTo={history.length === 0 ? '/upload-report' : undefined}
          />
        </Card>
      ) : (
        <div className="relative">
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border hidden sm:block" aria-hidden="true" />

          <div className="space-y-4">
            {entries.map((entry) => {
              const config = typeConfig[entry.type] || typeConfig.prescription
              const TypeIcon = config.icon

              return (
                <div key={entry.id} className="relative flex gap-4 sm:gap-6">
                  <div className={`hidden sm:flex w-14 h-14 rounded-2xl border items-center justify-center shrink-0 z-10 bg-white ${config.color}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>

                  <Card className="flex-1 !p-5 hover:shadow-elevated transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`sm:hidden inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${config.color}`}>
                            {config.label}
                          </span>
                          <Badge status={entry.status === 'normal' ? 'healthy' : entry.status} />
                        </div>
                        <p className="text-base font-semibold text-ink">{entry.title}</p>
                        <p className="text-sm text-ink-muted mt-1">{entry.summary}</p>
                        <p className="text-xs text-ink-faint mt-2">{entry.date}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline text-xs font-medium text-ink-muted px-2.5 py-1 rounded-lg bg-surface border border-border">
                          {config.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromHistory(entry.id)}
                          className="p-2 rounded-lg text-ink-faint hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          aria-label="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
