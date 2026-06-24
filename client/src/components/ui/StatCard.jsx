import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedNumber } from './motion'

const colorMap = {
  teal: {
    bg: 'bg-gradient-to-br from-teal-50 to-emerald-50',
    icon: 'text-teal-600',
    ring: 'ring-teal-100',
    glow: 'group-hover:shadow-teal-100',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    icon: 'text-blue-600',
    ring: 'ring-blue-100',
    glow: 'group-hover:shadow-blue-100',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
    icon: 'text-purple-600',
    ring: 'ring-purple-100',
    glow: 'group-hover:shadow-purple-100',
  },
  rose: {
    bg: 'bg-gradient-to-br from-rose-50 to-pink-50',
    icon: 'text-rose-600',
    ring: 'ring-rose-100',
    glow: 'group-hover:shadow-rose-100',
  },
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = 'teal',
  trend,
  trendLabel,
  index = 0,
  animate = true,
}) {
  const colors = colorMap[color] || colorMap.teal
  const isPositive = trend >= 0
  const numericValue = typeof value === 'number' ? value : parseInt(String(value), 10)

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative bg-white rounded-2xl p-6 shadow-card border border-gray-100/80 hover:shadow-elevated transition-shadow ${colors.glow}`}
    >
      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${colors.bg} ring-1 ${colors.ring} mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-5 h-5 ${colors.icon}`} />
      </div>
      <p className="text-3xl font-bold text-ink tracking-tight">
        {typeof value === 'number' || !Number.isNaN(numericValue) ? (
          <AnimatedNumber value={numericValue} />
        ) : (
          value
        )}
      </p>
      <p className="text-sm text-ink-muted mt-1">{title}</p>
      {trend !== undefined && (
        <div className="absolute bottom-6 right-6 flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}%
          </span>
          {trendLabel && (
            <span className="text-xs text-ink-faint ml-0.5 hidden sm:inline">{trendLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}
