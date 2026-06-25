import { Link } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'

export default function Logo({ to = '/', size = 'md', className = '' }) {
  const sizes = {
    sm: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-base' },
    md: { box: 'w-9 h-9', icon: 'w-5 h-5', text: 'text-lg' },
    lg: { box: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-xl' },
  }
  const s = sizes[size] || sizes.md

  return (
    <Link to={to} className={`flex items-center gap-2.5 group ${className}`}>
      <div className={`${s.box} rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-card-hover transition-shadow`}>
        <HeartPulse className={`${s.icon} text-white`} />
      </div>
      <span className={`${s.text} font-bold text-ink`}>MedScan</span>
    </Link>
  )
}
