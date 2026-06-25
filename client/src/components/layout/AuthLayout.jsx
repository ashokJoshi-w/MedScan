import { Link } from 'react-router-dom'
import { Shield, Zap, Globe, CheckCircle2 } from 'lucide-react'
import Logo from '../ui/Logo'

const benefits = [
  { icon: Shield, text: 'Bank-level encryption for your health data' },
  { icon: Zap, text: 'AI analysis in under 5 seconds' },
  { icon: Globe, text: 'English & Hindi support' },
  { icon: CheckCircle2, text: 'Complete medical history tracking' },
]

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-primary-50 border-r border-border flex-col justify-between p-12 xl:p-16">
        <Logo to="/" />

        <div className="max-w-md">
          <h1 className="text-3xl xl:text-4xl font-bold text-ink leading-tight tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-base text-ink-muted leading-relaxed">
            {subtitle}
          </p>

          <ul className="mt-10 space-y-4">
            {benefits.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-ink-muted">{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 p-6 rounded-2xl bg-white border border-border shadow-card">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['A', 'R', 'S', 'M'].map((letter, i) => (
                  <div
                    key={letter}
                    className="w-9 h-9 rounded-full bg-primary-50 border-2 border-white flex items-center justify-center text-xs font-semibold text-primary-darker"
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

        <p className="text-sm text-ink-faint">&copy; {new Date().getFullYear()} MedScan</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo to="/" />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
