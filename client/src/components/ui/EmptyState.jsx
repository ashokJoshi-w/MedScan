import { Link } from 'react-router-dom'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-5">
          <Icon className="w-8 h-8 text-ink-faint" />
        </div>
      )}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && (
        <p className="text-sm text-ink-muted mt-2 max-w-sm">{description}</p>
      )}
      {(actionLabel && actionTo) && (
        <Link to={actionTo} className="btn-primary text-sm mt-6 py-2.5 px-5">
          {actionLabel}
        </Link>
      )}
      {(actionLabel && onAction) && (
        <button type="button" onClick={onAction} className="btn-primary text-sm mt-6 py-2.5 px-5">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
