const Header = () => {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 leading-none">MedScan</p>
          <p className="text-xs text-muted mt-0.5">AI medical assistant</p>
        </div>
      </div>
    </header>
  )
}

export default Header