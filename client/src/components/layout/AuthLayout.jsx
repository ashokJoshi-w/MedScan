import { Link } from 'react-router-dom'
import { Shield, Zap, Globe, CheckCircle2, Sparkles } from 'lucide-react'
import Logo from '../ui/Logo'

const benefits = [
  { icon: Shield, text: 'Bank-level encryption for your health data', color: 'icon-badge-green' },
  { icon: Zap, text: 'AI analysis in under 5 seconds', color: 'icon-badge-blue' },
  { icon: Globe, text: 'English & Hindi support', color: 'icon-badge-green' },
  { icon: CheckCircle2, text: 'Complete medical history tracking', color: 'icon-badge-blue' },
]

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative flex-col justify-between p-12 xl:p-16 overflow-hidden border-r border-border">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 20% 30%, rgba(16,185,129,0.12) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(59,130,246,0.10) 0%, transparent 55%), #F8FAFC',
          }}
        />
        <div className="relative">
          <Logo to="/" />
        </div>

        <div className="relative max-w-md">
          <span className="section-label mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI-powered healthcare
          </span>
          <h1 className="text-3xl xl:text-4xl font-bold text-ink leading-tight tracking-tight text-balance">
            {title}
          </h1>
          <p className="mt-4 text-base text-ink-muted leading-relaxed text-pretty">
            {subtitle}
          </p>

          <ul className="mt-10 space-y-4">
            {benefits.map(({ icon: Icon, text, color }) => (
              <li key={text} className="flex items-center gap-3">
                <div className={`${color} shrink-0 !p-2.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm text-ink-muted">{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 card p-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['PS', 'RK', 'AD', 'MK'].map((letter, i) => (
                  <div
                    key={letter}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-50 to-accent-blue-soft border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary-darker"
                    style={{ zIndex: 4 - i }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Trusted by thousands</p>
                <p className="text-xs text-ink-muted">Healthcare professionals & patients</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-sm text-ink-faint">&copy; {new Date().getFullYear()} MedScan</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 app-bg overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo to="/" />
          </div>
          <div className="card p-8 shadow-soft">{children}</div>
        </div>
      </div>
    </div>
  )
}
