export function Card({ children, className = '', hover = false, padding = true, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-border shadow-card ${
        padding ? 'p-6' : ''
      } ${hover ? 'hover:shadow-elevated hover:border-primary/20 hover:-translate-y-1 transition-all duration-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, description, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-6 ${className}`}>
      <div>
        {title && <h3 className="text-lg font-semibold text-ink">{title}</h3>}
        {description && <p className="text-sm text-ink-muted mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}
