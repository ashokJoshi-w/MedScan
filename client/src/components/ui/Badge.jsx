const statusStyles = {
  normal: 'bg-primary-50 text-primary-dark border border-primary/15',
  healthy: 'bg-primary-50 text-primary-dark border border-primary/15',
  done: 'bg-primary-50 text-primary-dark border border-primary/15',
  abnormal: 'bg-amber-50 text-warning border border-amber-100',
  warning: 'bg-amber-50 text-warning border border-amber-100',
  critical: 'bg-red-50 text-danger border border-red-100',
  pending: 'bg-section text-ink-muted border border-border',
  new: 'bg-accent-blue-soft text-accent-blue border border-accent-blue/15',
}

const statusLabels = {
  normal: 'Normal',
  healthy: 'Healthy',
  done: 'Done',
  abnormal: 'Abnormal',
  warning: 'Warning',
  critical: 'Critical',
  pending: 'Pending',
  new: 'New',
}

export default function Badge({ status = 'pending', children, size = 'sm' }) {
  const sizeClass = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold capitalize ${sizeClass} ${
        statusStyles[status] || statusStyles.pending
      }`}
    >
      {children || statusLabels[status] || status}
    </span>
  )
}
