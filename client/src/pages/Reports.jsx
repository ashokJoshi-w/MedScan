import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, FlaskConical, FileText, MoreHorizontal, Eye, Download, Share2 } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { Card } from '../components/ui/Card'
import useHistory from '../hooks/useHistory'

const typeConfig = {
  prescription: { label: 'Prescription', icon: FileText, color: 'text-primary' },
  lab: { label: 'Lab Report', icon: FlaskConical, color: 'text-accent-blue' },
  vitals: { label: 'Vitals', icon: FlaskConical, color: 'text-success' },
}

function getHealthScore(status) {
  if (status === 'normal') return { score: 92, label: 'Good' }
  if (status === 'abnormal') return { score: 68, label: 'Review' }
  if (status === 'critical') return { score: 42, label: 'Alert' }
  return { score: 75, label: 'Pending' }
}

export default function Reports() {
  const { history } = useHistory()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [openMenu, setOpenMenu] = useState(null)

  const reports = useMemo(() => {
    let items = history
      .filter((h) => h.type === 'lab' || h.type === 'prescription')
      .map((item, index) => ({
        id: item.id ?? index,
        name: item.title || 'Untitled Report',
        type: item.type,
        date: item.date,
        status: item.status || 'normal',
        summary: item.summary,
      }))

    if (typeFilter !== 'all') {
      items = items.filter((r) => r.type === typeFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(
        (r) => r.name.toLowerCase().includes(q) || r.summary?.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'oldest') {
      items = [...items].reverse()
    }

    return items
  }, [history, search, typeFilter, sortBy])

  return (
    <div>
      <PageHeader
        title="Reports"
        description="View and manage all your lab reports and medical documents."
        action={
          <Link to="/upload-report" className="btn-primary text-sm py-2.5 px-5">
            Upload Report
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="input-field pl-10"
            aria-label="Search reports"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input-field w-full sm:w-40 cursor-pointer"
          aria-label="Filter by type"
        >
          <option value="all">All Types</option>
          <option value="lab">Lab Report</option>
          <option value="prescription">Prescription</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field w-full sm:w-40 cursor-pointer"
          aria-label="Sort reports"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {reports.length === 0 ? (
        <Card padding={false}>
          <EmptyState
            icon={FlaskConical}
            title={history.length === 0 ? 'No reports yet' : 'No matching reports'}
            description="Upload a lab report or prescription to get started with AI analysis."
            actionLabel="Upload Report"
            actionTo="/upload-report"
          />
        </Card>
      ) : (
        <Card padding={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wide">Report Name</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wide">Type</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wide">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wide">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wide">Health Score</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-ink-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports.map((report) => {
                  const config = typeConfig[report.type] || typeConfig.lab
                  const TypeIcon = config.icon
                  const { score, label } = getHealthScore(report.status)

                  return (
                    <tr key={report.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                            <TypeIcon className={`w-4 h-4 ${config.color}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-ink truncate max-w-[200px]">{report.name}</p>
                            {report.summary && (
                              <p className="text-xs text-ink-faint truncate max-w-[200px] mt-0.5">{report.summary}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-ink-muted">{config.label}</td>
                      <td className="px-6 py-4 text-ink-muted whitespace-nowrap">{report.date}</td>
                      <td className="px-6 py-4">
                        <Badge status={report.status === 'normal' ? 'healthy' : report.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-danger'}`}>
                            {score}%
                          </span>
                          <span className="text-xs text-ink-faint">{label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 relative">
                          <button type="button" className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors" aria-label="View report">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button type="button" className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors" aria-label="Download report">
                            <Download className="w-4 h-4" />
                          </button>
                          <button type="button" className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors" aria-label="Share report">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setOpenMenu(openMenu === report.id ? null : report.id)}
                            className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors"
                            aria-label="More actions"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
