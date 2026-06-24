import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  FileText,
  FlaskConical,
  HeartPulse,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { FadeIn, Stagger, StaggerItem, HoverLift } from '../components/ui/motion'

const features = [
  {
    icon: FileText,
    title: 'Prescription Analysis',
    description: 'Upload a photo or paste text — get every medicine explained with dosage, frequency, and AI summary.',
    gradient: 'from-teal-400 to-emerald-600',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
  {
    icon: FlaskConical,
    title: 'Lab Report Reading',
    description: 'Decode blood tests and panels. Abnormal values flagged instantly with plain-language meanings.',
    gradient: 'from-blue-400 to-indigo-600',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: HeartPulse,
    title: 'Vitals Tracking',
    description: 'Log BP, heart rate, and weight. Visualize trends and get AI health summaries over time.',
    gradient: 'from-rose-400 to-pink-600',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
]

const steps = [
  { num: '01', title: 'Upload or enter data', desc: 'Prescription image, lab values, or vitals' },
  { num: '02', title: 'AI analyses instantly', desc: 'Powered by medical-grade language models' },
  { num: '03', title: 'Get clear insights', desc: 'Bilingual summaries you can actually understand' },
]

const trustItems = [
  { icon: Shield, label: 'Secure & private' },
  { icon: Zap, label: 'Results in seconds' },
  { icon: Globe, label: 'English & Hindi' },
  { icon: Clock, label: 'Full history tracking' },
]

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto max-w-lg perspective-1000"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-violet-500/10 to-blue-500/20 rounded-3xl blur-2xl animate-pulse-glow" />
      <div className="relative glass-dark rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        <div className="flex items-center gap-2 px-4 py-3 bg-black/20 border-b border-white/10">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-amber-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
          <span className="ml-2 text-xs text-white/40">MedScan Dashboard</span>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Analyses', val: '12', color: 'bg-teal-500/20 text-teal-300' },
              { label: 'Prescriptions', val: '5', color: 'bg-blue-500/20 text-blue-300' },
              { label: 'Vitals', val: '8', color: 'bg-rose-500/20 text-rose-300' },
            ].map(({ label, val, color }) => (
              <div key={label} className={`rounded-xl p-3 ${color}`}>
                <p className="text-lg font-bold">{val}</p>
                <p className="text-[10px] opacity-70">{label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-white/5 p-3 space-y-2">
            {['Amoxicillin Rx analysed', 'CBC Lab Report', 'BP 120/80 logged'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="flex items-center gap-2 text-xs text-white/70"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {item}
              </motion.div>
            ))}
          </div>
          <div className="h-16 rounded-xl bg-gradient-to-r from-primary/30 to-emerald-500/20 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-primary/60" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 400], [0, 80])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3])

  return (
    <div className="min-h-screen bg-ink overflow-x-hidden">
      {/* Nav */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-glow"
            >
              <HeartPulse className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-lg font-bold text-white">MedScan</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-sm py-2.5 px-5">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all">
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2.5 px-5">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-hero-dark" />
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute top-32 left-[10%] w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float pointer-events-none" />
        <motion.div style={{ y: heroY }} className="absolute bottom-20 right-[5%] w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] animate-float-delayed pointer-events-none" />
        <motion.div style={{ y: heroY }} className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="section-label bg-white/10 text-teal-200 border-white/10 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI-powered health platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] text-balance"
            >
              Understand your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-300">
                health data
              </span>{' '}
              like never before
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-white/60 leading-relaxed max-w-lg"
            >
              MedScan transforms prescriptions, lab reports, and vitals into clear,
              actionable insights — in seconds, in your language.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link to={user ? '/dashboard' : '/signup'} className="btn-primary text-base">
                {user ? 'Open Dashboard' : 'Start Free'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="inline-flex items-center justify-center gap-2 text-white/80 font-semibold px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all">
                See how it works
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap gap-5"
            >
              {trustItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-white/50">
                  <Icon className="w-4 h-4 text-teal-400" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          <div className="hidden lg:block">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Features — bento grid */}
      <section id="features" className="relative py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <span className="section-label mb-4">Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
              Three tools. One dashboard.
            </h2>
            <p className="mt-4 text-ink-muted max-w-xl mx-auto">
              Everything you need to decode medical information and track your health over time.
            </p>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, gradient, bg, border }) => (
              <StaggerItem key={title}>
                <HoverLift>
                  <div className={`relative h-full p-7 rounded-3xl border ${border} ${bg} backdrop-blur-sm overflow-hidden group`}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-ink">{title}</h3>
                    <p className="mt-3 text-sm text-ink-muted leading-relaxed">{description}</p>
                    <ul className="mt-5 space-y-2">
                      {['AI-powered', 'Bilingual output', 'Saved to history'].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-ink-muted">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <span className="section-label mb-4">How it works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink">Simple as 1-2-3</h2>
          </FadeIn>
          <Stagger className="grid md:grid-cols-3 gap-8">
            {steps.map(({ num, title, desc }) => (
              <StaggerItem key={num}>
                <div className="relative text-center p-8">
                  <span className="text-5xl font-black text-primary/10">{num}</span>
                  <h3 className="text-lg font-bold text-ink mt-2">{title}</h3>
                  <p className="text-sm text-ink-muted mt-2">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-surface">
        <FadeIn className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-hero-dark" />
            <div className="absolute inset-0 bg-mesh opacity-50" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-pulse-glow" />
            <div className="relative p-10 md:p-16 text-center">
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                Ready to decode your health data?
              </h2>
              <p className="mt-4 text-white/60 max-w-md mx-auto">
                Join MedScan free — no credit card required. Start analysing in under a minute.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block mt-8">
                <Link
                  to={user ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-2 bg-white text-primary-darker px-8 py-4 rounded-2xl font-bold hover:bg-teal-50 transition-colors shadow-xl"
                >
                  {user ? 'Go to Dashboard' : 'Create Free Account'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </FadeIn>
      </section>

      <footer className="bg-ink py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-primary" />
            <span className="font-bold text-white">MedScan</span>
          </div>
          <p className="text-sm text-white/40">&copy; {new Date().getFullYear()} MedScan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
