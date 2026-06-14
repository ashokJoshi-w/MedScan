import useHistory from '../../hooks/useHistory'

const icons = {
  prescription: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  lab: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  vitals: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
}

const labels = {
  prescription: 'Prescription',
  lab: 'Lab Report',
  vitals: 'Vitals',
}

const HistoryTab = () => {
  const { history, clearHistory } = useHistory()

  if (history.length === 0) {
    return (
      <div className="bg-white border border-border rounded-xl p-12 text-center shadow-card">
        <svg className="h-10 w-10 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium text-slate-500">No scans yet</p>
        <p className="text-xs text-muted mt-1">Your scan history will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-medium text-muted uppercase tracking-wide">{history.length} scan{history.length !== 1 ? 's' : ''}</p>
        <button
          onClick={clearHistory}
          className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer transition"
        >
          Clear all
        </button>
      </div>

      {history.map((item, i) => (
        <div key={i} className="bg-white border border-border rounded-xl px-4 py-3.5 shadow-card flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
              {icons[item.type]}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 truncate max-w-[180px]">{item.title}</p>
              <p className="text-xs text-muted mt-0.5">{item.date}</p>
            </div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full flex-shrink-0">
            {labels[item.type]}
          </span>
        </div>
      ))}
    </div>
  )
}

export default HistoryTab