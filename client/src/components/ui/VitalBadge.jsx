const VitalBadge = ({ status }) => {
  const styles = {
    normal:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
    high:     'bg-red-50 text-red-700 border border-red-200',
    low:      'bg-amber-50 text-amber-700 border border-amber-200',
    critical: 'bg-red-100 text-red-800 border border-red-300',
  }

  const labels = {
    normal: 'Normal',
    high: 'High',
    low: 'Low',
    critical: 'Critical',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.normal}`}>
      {labels[status] || status}
    </span>
  )
}

export default VitalBadge