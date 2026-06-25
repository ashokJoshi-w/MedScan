export function Input({ label, error, icon: Icon, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-ink mb-2">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
        )}
        <input
          className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, className = '', rows = 4, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-ink mb-2">{label}</label>
      )}
      <textarea
        rows={rows}
        className={`input-field resize-none ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : ''}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-ink mb-2">{label}</label>
      )}
      <select className="input-field cursor-pointer" {...props}>
        {children}
      </select>
    </div>
  )
}
