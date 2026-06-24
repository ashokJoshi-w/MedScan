import { Link } from 'react-router-dom'
import {
  FileText,
  FlaskConical,
  HeartPulse,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const features = [
  {
    icon: FileText,
    title: 'Prescription Analysis',
    description: 'Upload or paste prescriptions and get clear explanations of every medicine, dosage, and instruction.',
    bg: 'bg-teal-50',
  },
  {
    icon: FlaskConical,
    title: 'Lab Report Reading',
    description: 'Understand your lab results with plain-language summaries and flagged abnormal values.',
    bg: 'bg-blue-50',
  },
  {
    icon: HeartPulse,
    title: 'Vitals Tracking',
    description: 'Log blood pressure, heart rate, and weight — visualize trends over time.',
    bg: 'bg-rose-50',
  },
]

const stats = [
  { icon: Shield, label: 'HIPAA-aware design' },
  { icon: Zap, label: 'Results in seconds' },
  { icon: Globe, label: 'English & Hindi support' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm shadow-primary/30 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">MedScan</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-gray-500">
                  Hi, {user.name || user.email?.split('@')[0]}
                </span>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 text-sm font-semibold bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-all shadow-sm shadow-primary/20"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-all shadow-sm shadow-primary/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-light/60 via-white to-white pointer-events-none" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light text-primary-darker text-xs font-semibold mb-6 border border-primary/10">
                <Zap className="w-3.5 h-3.5" />
                AI-powered health insights
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                Understand Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                  Health Better
                </span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                MedScan decodes prescriptions, lab reports, and vitals with AI — giving you
                clear, actionable insights in plain language.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={user ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  {user ? 'Open Dashboard' : 'Get Started Free'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 text-gray-600 px-8 py-3.5 rounded-2xl font-semibold border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Learn More
                </a>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
                {stats.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-gray-500">
                    <Icon className="w-4 h-4 text-primary" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto px-6 pb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need</h2>
            <p className="mt-3 text-gray-500">Three powerful tools in one health dashboard</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, bg }) => (
              <div
                key={title}
                className="group relative bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${bg} mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{description}</p>
                <ul className="mt-4 space-y-2">
                  {['Instant AI analysis', 'Bilingual summaries', 'History tracking'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-darker via-primary-dark to-primary p-10 md:p-16 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to take control of your health data?</h2>
              <p className="mt-3 text-teal-100 max-w-lg mx-auto">
                Join MedScan today and never wonder what your medical reports mean again.
              </p>
              <Link
                to={user ? '/dashboard' : '/signup'}
                className="inline-flex items-center gap-2 mt-8 bg-white text-primary-darker px-8 py-3.5 rounded-2xl font-semibold hover:bg-teal-50 transition-all shadow-lg"
              >
                {user ? 'Open Dashboard' : 'Create Free Account'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-primary" />
            <span className="font-semibold text-gray-900">MedScan</span>
          </div>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} MedScan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
