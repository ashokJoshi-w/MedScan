import { motion } from 'framer-motion'

const shimmerVariants = {
  initial: { backgroundPosition: '-200% 0' },
  animate: {
    backgroundPosition: '200% 0',
    transition: { repeat: Infinity, duration: 1.5, ease: 'linear' },
  },
}

export function Skeleton({ className = '', variant = 'text' }) {
  const base = 'rounded-lg'
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    circle: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full rounded-xl',
    button: 'h-10 w-24 rounded-xl',
    input: 'h-10 w-full rounded-xl',
  }
  return (
    <motion.div
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      className={`${base} ${variants[variant]} ${className}`}
      style={{
        background:
          'linear-gradient(90deg, #E2E8F0 0%, #F1F5F9 50%, #E2E8F0 100%)',
        backgroundSize: '200% 100%',
      }}
    />
  )
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-white shadow-card space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="title" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} variant="text" className={i === lines - 1 ? 'w-2/3' : 'w-full'} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      <div className="divide-y divide-border">
        <div className="bg-surface/50 px-6 py-3 flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} variant="text" className="w-20" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="px-6 py-4 flex gap-4 border-b border-border last:border-0">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} variant="text" className="w-24" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
