import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold rounded-xl px-6 py-3 border border-red-100 hover:bg-red-100 transition-all duration-200',
}

const sizes = {
  sm: 'text-sm py-2 px-4',
  md: '',
  lg: 'text-base py-3.5 px-8',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const base = variants[variant] || variants.primary
  const sizeClass = size !== 'md' ? sizes[size] : ''

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`${base} ${sizeClass} disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  )
}
