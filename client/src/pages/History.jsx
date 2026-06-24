import { useState, useMemo } from 'react'
import { Search, Trash2, FileText, FlaskConical, HeartPulse, History as HistoryIcon } from 'lucide-react'
import useHistory from '../hooks/useHistory'
import Badge from '../components/ui/Badge'

const typeConfig = {
  prescription: { label: 'Prescription', color: 'bg-teal-50 text-teal-700', icon: FileText },
  lab: { label: 'Lab Report', color: 'bg-blue-50 text-blue-700', icon: FlaskConical },
  vitals: { label: 'Vitals', color: 'bg-rose-50 text-rose-700', icon: HeartPulse },
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
        summary: item.summary || item.title || 'Analysis record',
        status: item.status || 'normal',
      }))
      .filter((entry) => {
        const matchesFilter = filter === 'all' || entry.type === filter
        const matchesSearch =
          !search.trim() ||
          entry.summary.toLowerCase().includes(search.toLowerCase()) ||
          entry.type.toLowerCase().includes(search.toLowerCase())
        return matchesFilter && matchesSearch
      })
  }, [history, search, filter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">History</h1>
          <p className="text-sm text-gray-500 mt-1">Browse and manage your past analyses.</p>
        </div>
        {history.length > 0 && (
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
            className={`text-sm font-medium px-4 py-2 rounded-xl border transition cursor-pointer ${
              confirmClear
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                : 'text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {confirmClear ? 'Confirm clear all' : 'Clear all'}
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="prescription">Prescription</option>
          <option value="lab">Lab Report</option>
          <option value="vitals">Vitals</option>
        </select>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <HistoryIcon className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-600">
            {history.length === 0 ? 'No history yet' : 'No results match your search'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {history.length === 0
              ? 'Analyse a prescription, lab report, or vitals to see entries here'
              : 'Try adjusting your filters or search term'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Summary</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {entries.map((entry) => {
                const config = typeConfig[entry.type] || typeConfig.prescription
                const TypeIcon = config.icon
                return (
                  <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{entry.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <TypeIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 max-w-xs truncate">{entry.summary}</td>
                    <td className="px-6 py-4">
                      <Badge status={entry.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => removeFromHistory(entry.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        aria-label="Delete entry"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
