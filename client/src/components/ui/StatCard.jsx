import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedNumber } from './motion'

const colorMap = {
  teal: {
    bg: 'bg-primary-50',
    icon: 'text-primary',
    ring: 'ring-primary/10',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-accent-blue',
    ring: 'ring-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-success',
    ring: 'ring-green-100',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-warning',
    ring: 'ring-amber-100',
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
  suffix,
}) {
  const colors = colorMap[color] || colorMap.teal
  const isPositive = trend >= 0
  const numericValue = typeof value === 'number' ? value : parseInt(String(value), 10)

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 16 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-white rounded-2xl p-6 border border-border shadow-card hover:shadow-elevated transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${colors.bg} ring-1 ${colors.ring}`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-success" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-danger" />
            )}
            <span className={`text-xs font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-ink tracking-tight">
        {typeof value === 'number' || !Number.isNaN(numericValue) ? (
          <>
            <AnimatedNumber value={numericValue} />
            {suffix}
          </>
        ) : (
          <>
            {value}
            {suffix}
          </>
        )}
      </p>
      <p className="text-sm text-ink-muted mt-1">{title}</p>
      {trendLabel && trend !== undefined && (
        <p className="text-xs text-ink-faint mt-2">{trendLabel}</p>
      )}
    </motion.div>
  )
}

export function HealthScoreCard({ score, index = 0 }) {
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-danger'
  const strokeColor = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-6 border border-border shadow-card hover:shadow-elevated transition-shadow flex flex-col items-center justify-center"
    >
      <p className="text-sm text-ink-muted mb-4 self-start">Health Score</p>
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#E5E7EB" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${color}`}>{score}</span>
          <span className="text-xs text-ink-faint">/ 100</span>
        </div>
      </div>
      <p className="text-xs text-ink-muted mt-4 text-center">
        {score >= 80 ? 'Looking good overall' : score >= 60 ? 'Room for improvement' : 'Needs attention'}
      </p>
    </motion.div>
  )
}
