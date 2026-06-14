import VitalBadge from './VitalBadge'

const LabResultCard = ({ item, lang }) => {
  return (
    <div className="flex items-start justify-between py-3.5 border-b border-border last:border-0 gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-slate-800">{item.name}</p>
          <span className="text-xs text-muted">{item.value} {item.unit}</span>
        </div>
        <p className="text-xs text-slate-500">
          {lang === 'en' ? item.meaning_en : item.meaning_hi}
        </p>
      </div>
      <VitalBadge status={item.status} />
    </div>
  )
}

export default LabResultCard