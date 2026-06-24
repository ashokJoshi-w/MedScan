import { TrendingUp, TrendingDown } from 'lucide-react'

const colorMap = {
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'text-teal-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', icon: 'text-rose-600' },
}

export default function StatCard({ title, value, icon: Icon, color = 'teal', trend, trendLabel }) {
  const colors = colorMap[color] || colorMap.teal
  const isPositive = trend >= 0

  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors.bg} mb-4`}>
        <Icon className={`w-5 h-5 ${colors.icon}`} />
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
      {trend !== undefined && (
        <div className="absolute bottom-6 right-6 flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}%
          </span>
          {trendLabel && (
            <span className="text-xs text-gray-400 ml-1">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}
