export default function PageHeader({ title, description, action, badge }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div>
        {badge && <div className="mb-3">{badge}</div>}
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">{title}</h1>
        {description && (
          <p className="text-base text-ink-muted mt-2 max-w-2xl">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
