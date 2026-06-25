const statusStyles = {
  normal: 'bg-green-50 text-green-700 border border-green-100',
  healthy: 'bg-green-50 text-green-700 border border-green-100',
  abnormal: 'bg-amber-50 text-amber-700 border border-amber-100',
  warning: 'bg-amber-50 text-amber-700 border border-amber-100',
  critical: 'bg-red-50 text-red-700 border border-red-100',
  pending: 'bg-surface text-ink-muted border border-border',
  new: 'bg-primary-50 text-primary-darker border border-primary/20',
}

const statusLabels = {
  normal: 'Normal',
  healthy: 'Healthy',
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
      className={`inline-flex items-center rounded-full font-medium capitalize ${sizeClass} ${
        statusStyles[status] || statusStyles.pending
      }`}
    >
      {children || statusLabels[status] || status}
    </span>
  )
}
