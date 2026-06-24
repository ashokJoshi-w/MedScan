const statusStyles = {
  normal: 'bg-green-50 text-green-700',
  abnormal: 'bg-amber-50 text-amber-700',
  critical: 'bg-red-50 text-red-700',
  pending: 'bg-gray-100 text-gray-600',
}

export default function Badge({ status = 'pending', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        statusStyles[status] || statusStyles.pending
      }`}
    >
      {children || status}
    </span>
  )
}
