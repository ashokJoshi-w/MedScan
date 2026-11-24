import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, FlaskConical, FileText, MoreHorizontal, Eye, Download, Share2, X, Trash2 } from 'lucide-react'
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

// ─── Structured, styled analysis view (for the modal) ───────────────────────

function AnalysisDetails({ report }) {
  const { analysisResult, type } = report
  if (!analysisResult) return null

  // Prescription: array of medication objects
  if (Array.isArray(analysisResult)) {
    return (
      <div className="space-y-4">
        {analysisResult.map((med, i) => (
          <div key={i} className="border border-border rounded-xl p-4">
            <p className="font-semibold text-ink text-[15px]">
              {med.name || 'Unknown medicine'}
              {med.genericName && (
                <span className="font-normal text-ink-faint text-sm"> ({med.genericName})</span>
              )}
            </p>

            <div className="mt-2.5 grid grid-cols-3 gap-3 text-sm">
              {med.dosage && (
                <div>
                  <p className="text-xs text-ink-faint uppercase tracking-wide">Dosage</p>
                  <p className="text-ink font-medium mt-0.5">{med.dosage}</p>
                </div>
              )}
              {med.frequency && (
                <div>
                  <p className="text-xs text-ink-faint uppercase tracking-wide">Frequency</p>
                  <p className="text-ink font-medium mt-0.5">{med.frequency}</p>
                </div>
              )}
              {med.duration && (
                <div>
                  <p className="text-xs text-ink-faint uppercase tracking-wide">Duration</p>
                  <p className="text-ink font-medium mt-0.5">{med.duration}</p>
                </div>
              )}
            </div>

            {med.purpose_en && (
              <p className="text-sm text-ink-muted mt-3">
                <span className="font-medium text-ink">Purpose: </span>{med.purpose_en}
              </p>
            )}
            {med.instructions_en && (
              <p className="text-sm text-ink-muted mt-1.5">
                <span className="font-medium text-ink">Instructions: </span>{med.instructions_en}
              </p>
            )}
            {med.side_effects_en?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {med.side_effects_en.map((s, idx) => (
                  <span key={idx} className="text-xs bg-surface text-ink-muted px-2 py-1 rounded-full border border-border">
                    {s}
                  </span>
                ))}
              </div>
            )}
            {med.warnings_en?.length > 0 && (
              <div className="mt-3 bg-danger/5 border border-danger/20 rounded-lg px-3 py-2">
                <p className="text-xs font-semibold text-danger uppercase tracking-wide mb-1">Warnings</p>
                <ul className="text-sm text-ink-muted space-y-0.5 list-disc list-inside">
                  {med.warnings_en.map((w, idx) => <li key={idx}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Lab report
  if (type === 'lab') {
    return (
      <div className="space-y-4">
        {analysisResult.summary_en && (
          <p className="text-sm text-ink-muted">{analysisResult.summary_en}</p>
        )}
        {analysisResult.values?.length > 0 && (
          <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
            {analysisResult.values.map((v, i) => (
              <div key={i} className="px-4 py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink text-sm">{v.name}</p>
                  {v.meaning_en && <p className="text-xs text-ink-faint mt-0.5">{v.meaning_en}</p>}
                  {v.referenceRange && (
                    <p className="text-xs text-ink-faint mt-0.5">Normal range: {v.referenceRange}{v.unit ? ` ${v.unit}` : ''}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-ink text-sm">{v.value}{v.unit ? ` ${v.unit}` : ''}</p>
                  {v.status && (
                    <span className={`text-xs font-medium ${v.status === 'normal' ? 'text-success' : 'text-warning'}`}>
                      {v.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {analysisResult.advice_en && (
          <p className="text-sm text-ink-muted"><span className="font-medium text-ink">Advice: </span>{analysisResult.advice_en}</p>
        )}
        {analysisResult.followUp_en && (
          <p className="text-sm text-ink-muted"><span className="font-medium text-ink">Follow-up: </span>{analysisResult.followUp_en}</p>
        )}
      </div>
    )
  }

  // Vitals
  if (type === 'vitals') {
    return (
      <div className="space-y-4">
        {analysisResult.summary_en && (
          <p className="text-sm text-ink-muted">{analysisResult.summary_en}</p>
        )}
        {analysisResult.readings?.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {analysisResult.readings.map((r, i) => (
              <div key={i} className="border border-border rounded-xl p-3">
                <p className="text-xs text-ink-faint uppercase tracking-wide">{r.name}</p>
                <p className="font-semibold text-ink text-lg mt-0.5">{r.value}{r.unit ? ` ${r.unit}` : ''}</p>
                {r.status && (
                  <span className={`text-xs font-medium ${r.status === 'normal' ? 'text-success' : 'text-warning'}`}>
                    {r.status}
                  </span>
                )}
                {r.meaning_en && <p className="text-xs text-ink-faint mt-1.5">{r.meaning_en}</p>}
              </div>
            ))}
          </div>
        )}
        {analysisResult.advice_en && (
          <p className="text-sm text-ink-muted"><span className="font-medium text-ink">Advice: </span>{analysisResult.advice_en}</p>
        )}
      </div>
    )
  }

  // General fallback
  return (
    <div className="space-y-3">
      {analysisResult.summary_en && <p className="text-sm text-ink-muted">{analysisResult.summary_en}</p>}
      {analysisResult.keyPoints_en?.length > 0 && (
        <ul className="text-sm text-ink-muted space-y-1 list-disc list-inside">
          {analysisResult.keyPoints_en.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      )}
      {analysisResult.advice_en && (
        <p className="text-sm text-ink-muted"><span className="font-medium text-ink">Advice: </span>{analysisResult.advice_en}</p>
      )}
    </div>
  )
}

// ─── Format analysis result as plain readable text (for download/share) ─────

function formatAnalysisText(report) {
  const { analysisResult, type } = report
  if (!analysisResult) return ''

  const lines = []

  // Prescription: array of medication objects
  if (Array.isArray(analysisResult)) {
    analysisResult.forEach((med, i) => {
      lines.push(`${i + 1}. ${med.name || 'Unknown medicine'}${med.genericName ? ` (${med.genericName})` : ''}`)
      if (med.dosage) lines.push(`   Dosage: ${med.dosage}`)
      if (med.frequency) lines.push(`   Frequency: ${med.frequency}`)
      if (med.duration) lines.push(`   Duration: ${med.duration}`)
      if (med.purpose_en) lines.push(`   Purpose: ${med.purpose_en}`)
      if (med.instructions_en) lines.push(`   Instructions: ${med.instructions_en}`)
      if (med.side_effects_en?.length) lines.push(`   Side effects: ${med.side_effects_en.join(', ')}`)
      if (med.warnings_en?.length) lines.push(`   Warnings: ${med.warnings_en.join(', ')}`)
      lines.push('')
    })
    return lines.join('\n').trim()
  }

  // Lab report
  if (type === 'lab') {
    if (analysisResult.summary_en) lines.push(analysisResult.summary_en, '')
    if (analysisResult.values?.length) {
      lines.push('Test Values:')
      analysisResult.values.forEach((v) => {
        lines.push(`- ${v.name}: ${v.value}${v.unit ? ` ${v.unit}` : ''} (Normal range: ${v.referenceRange || 'N/A'}) — ${v.status || ''}`)
        if (v.meaning_en) lines.push(`  ${v.meaning_en}`)
      })
      lines.push('')
    }
    if (analysisResult.advice_en) lines.push(`Advice: ${analysisResult.advice_en}`)
    if (analysisResult.followUp_en) lines.push(`Follow-up: ${analysisResult.followUp_en}`)
    return lines.join('\n').trim()
  }

  // Vitals
  if (type === 'vitals') {
    if (analysisResult.summary_en) lines.push(analysisResult.summary_en, '')
    if (analysisResult.readings?.length) {
      lines.push('Readings:')
      analysisResult.readings.forEach((r) => {
        lines.push(`- ${r.name}: ${r.value}${r.unit ? ` ${r.unit}` : ''} — ${r.status || ''}`)
        if (r.meaning_en) lines.push(`  ${r.meaning_en}`)
      })
      lines.push('')
    }
    if (analysisResult.advice_en) lines.push(`Advice: ${analysisResult.advice_en}`)
    return lines.join('\n').trim()
  }

  // General fallback
  if (analysisResult.summary_en) lines.push(analysisResult.summary_en, '')
  if (analysisResult.keyPoints_en?.length) {
    lines.push('Key Points:')
    analysisResult.keyPoints_en.forEach((p) => lines.push(`- ${p}`))
    lines.push('')
  }
  if (analysisResult.advice_en) lines.push(`Advice: ${analysisResult.advice_en}`)
  return lines.join('\n').trim()
}

function getHealthScore(report) {
  const { analysisResult, type, status } = report
  const s = (status || 'normal').toLowerCase()

  // Start from a perfect score and deduct based on actual findings
  let score = 100
  let criticalCount = 0
  let abnormalCount = 0

  // Lab report: inspect each test value
  if (type === 'lab' && Array.isArray(analysisResult?.values)) {
    analysisResult.values.forEach((v) => {
      const st = (v.status || '').toLowerCase()
      if (st === 'critical_high' || st === 'critical_low') {
        criticalCount++
        score -= 25
      } else if (st === 'high' || st === 'low') {
        abnormalCount++
        score -= 10
      } else if (st === 'normal') {
        // no deduction
      } else {
        // unknown status — small deduction
        score -= 5
      }
    })
    // also factor in abnormalCount from the AI
    const aiAbnormal = analysisResult?.abnormalCount || 0
    if (aiAbnormal > abnormalCount + criticalCount) {
      abnormalCount = aiAbnormal - (abnormalCount + criticalCount)
      score -= abnormalCount * 5
    }
  }

  // Vitals: inspect each reading
  if (type === 'vitals' && Array.isArray(analysisResult?.readings)) {
    analysisResult.readings.forEach((r) => {
      const st = (r.status || '').toLowerCase()
      if (st === 'critical') {
        criticalCount++
        score -= 25
      } else if (st === 'high' || st === 'low' || st === 'concerning') {
        abnormalCount++
        score -= 10
      }
    })
  }

  // Prescription: factor in warnings count
  if (type === 'prescription' && Array.isArray(analysisResult)) {
    analysisResult.forEach((med) => {
      if (med.warnings_en?.length) {
        abnormalCount += med.warnings_en.length
        score -= med.warnings_en.length * 5
      }
    })
  }

  // Overall requires-attention flag from the AI
  if (analysisResult?.requiresAttention === true && criticalCount === 0 && abnormalCount === 0) {
    score -= 15
  }

  // Clamp to 0-100
  score = Math.max(0, Math.min(100, score))

  let label
  let color
  if (score >= 85) {
    label = 'Good'
    color = 'healthy'
  } else if (score >= 60) {
    label = 'Review'
    color = criticalCount > 0 ? 'warning' : 'abnormal'
  } else {
    label = 'Alert'
    color = 'critical'
  }

  return { score, label, color, criticalCount, abnormalCount }
}

// ─── Report Detail Modal ────────────────────────────────────────────────────

function ReportModal({ report, onClose }) {
  if (!report) return null

  const config = typeConfig[report.type] || typeConfig.lab
  const TypeIcon = config.icon

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
              <TypeIcon className={`w-4 h-4 ${config.color}`} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-ink truncate">{report.name}</p>
              <p className="text-xs text-ink-faint">{config.label} • {report.date}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-2">
            <Badge status={report.status?.toLowerCase() === 'normal' ? 'healthy' : report.status} />
            <span className="text-xs text-ink-faint">Status</span>
          </div>

          {report.summary ? (
            <div>
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">Summary</p>
              <p className="text-sm text-ink whitespace-pre-wrap">{report.summary}</p>
            </div>
          ) : null}

          {report.analysisResult ? (
            <div>
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2.5">Full Analysis</p>
              <AnalysisDetails report={report} />
            </div>
          ) : !report.summary ? (
            <p className="text-sm text-ink-faint">No detailed analysis data available for this record.</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// ─── Dropdown Menu ───────────────────────────────────────────────────────────

function ActionsMenu({ report, isOpen, onClose, onView, onDownload, onShare }) {
  const menuRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 w-44 bg-white border border-border rounded-xl shadow-lg py-1 z-10"
    >
      <button
        type="button"
        onClick={() => { onView(report); onClose() }}
        className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-ink hover:bg-surface transition-colors"
      >
        <Eye className="w-3.5 h-3.5" /> View
      </button>
      <button
        type="button"
        onClick={() => { onDownload(report); onClose() }}
        className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-ink hover:bg-surface transition-colors"
      >
        <Download className="w-3.5 h-3.5" /> Download
      </button>
      <button
        type="button"
        onClick={() => { onShare(report); onClose() }}
        className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-ink hover:bg-surface transition-colors"
      >
        <Share2 className="w-3.5 h-3.5" /> Share
      </button>
    </div>
  )
}

export default function Reports() {
  const { history } = useHistory()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [openMenu, setOpenMenu] = useState(null)
  const [viewingReport, setViewingReport] = useState(null)
  const [toast, setToast] = useState('')

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
        analysisResult: item.analysisResult,
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

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const handleView = (report) => setViewingReport(report)

  const handleDownload = (report) => {
    const parts = [
      report.name,
      `${typeConfig[report.type]?.label || 'Report'} — ${report.date}`,
      `Status: ${report.status}`,
      '',
    ]
    if (report.summary) parts.push('Summary:', report.summary, '')
    const analysisText = formatAnalysisText(report)
    if (analysisText) parts.push('Full Analysis:', analysisText)

    const blob = new Blob([parts.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${report.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async (report) => {
    const analysisText = formatAnalysisText(report)
    const shareText = `${report.name} — ${report.status} (${report.date})${report.summary ? `\n\n${report.summary}` : ''}${analysisText ? `\n\n${analysisText}` : ''}`

    if (navigator.share) {
      try {
        await navigator.share({ title: report.name, text: shareText })
        return
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText)
      setToast('Report details copied to clipboard')
    } catch {
      setToast('Could not share — copy failed')
    }
  }

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
                  const { score, label, color } = getHealthScore(report)

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
                        <Badge status={report.status?.toLowerCase() === 'normal' ? 'healthy' : report.status} />
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
                          <button
                            type="button"
                            onClick={() => handleView(report)}
                            className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors"
                            aria-label="View report"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(report)}
                            className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors"
                            aria-label="Download report"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShare(report)}
                            className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors"
                            aria-label="Share report"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setOpenMenu(openMenu === report.id ? null : report.id)}
                              className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors"
                              aria-label="More actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            <ActionsMenu
                              report={report}
                              isOpen={openMenu === report.id}
                              onClose={() => setOpenMenu(null)}
                              onView={handleView}
                              onDownload={handleDownload}
                              onShare={handleShare}
                            />
                          </div>
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

      <ReportModal report={viewingReport} onClose={() => setViewingReport(null)} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white text-sm px-4 py-2.5 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}