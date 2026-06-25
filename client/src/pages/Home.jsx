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
  Sparkles,
  Clock,
  ChevronRight,
  Lock,
  Star,
  Upload,
  Brain,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import MarketingNavbar from '../components/layout/MarketingNavbar'
import Footer from '../components/layout/Footer'
import { FadeIn, Stagger, StaggerItem, HoverLift } from '../components/ui/motion'

const features = [
  {
    icon: Brain,
    title: 'AI Report Analysis',
    description: 'Upload lab reports and get instant, plain-language explanations of every test result.',
    color: 'bg-blue-50 text-accent-blue',
  },
  {
    icon: FileText,
    title: 'Prescription Understanding',
    description: 'Decode prescriptions with clear medicine names, dosages, schedules, and side effects.',
    color: 'bg-primary-50 text-primary',
  },
  {
    icon: HeartPulse,
    title: 'Vitals Tracking',
    description: 'Log blood pressure, heart rate, and weight. Visualize trends over time.',
    color: 'bg-green-50 text-success',
  },
  {
    icon: Clock,
    title: 'Medical History',
    description: 'Keep a complete timeline of uploads, analyses, prescriptions, and vitals.',
    color: 'bg-amber-50 text-warning',
  },
]

const steps = [
  { num: '1', title: 'Upload', desc: 'Add your prescription, lab report, or vitals data', icon: Upload },
  { num: '2', title: 'AI Analysis', desc: 'Our medical AI processes and interprets your data', icon: Sparkles },
  { num: '3', title: 'Health Insights', desc: 'Receive clear, actionable health recommendations', icon: TrendingUp },
]

const benefits = [
  { icon: Shield, title: 'Secure & Private', desc: 'Your health data is encrypted and never shared without consent.' },
  { icon: Zap, title: 'Instant Results', desc: 'Get AI-powered analysis in seconds, not days.' },
  { icon: Globe, title: 'Bilingual Support', desc: 'Understand your health in English or Hindi.' },
  { icon: Lock, title: 'HIPAA-Inspired', desc: 'Built with healthcare privacy standards in mind.' },
]

const testimonials = [
  { name: 'Dr. Priya Sharma', role: 'General Physician', text: 'MedScan helps my patients understand their lab results before they even walk into my clinic.', rating: 5 },
  { name: 'Rajesh Kumar', role: 'Patient', text: 'Finally I can understand what my prescriptions mean. The AI explanations are incredibly clear.', rating: 5 },
  { name: 'Anita Desai', role: 'Caregiver', text: 'Tracking my mother\'s vitals and reports in one place has been a game changer for our family.', rating: 5 },
]

function HealthIllustration() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
      <div className="relative bg-white rounded-2xl border border-border shadow-soft p-6 animate-float">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-medium text-ink-muted">Health Summary</p>
            <p className="text-lg font-bold text-ink mt-0.5">Your wellness at a glance</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Prescription decoded', status: 'Complete', color: 'text-success' },
            { label: 'Lab report analysed', status: '2 flagged', color: 'text-warning' },
            { label: 'Vitals logged today', status: 'Normal', color: 'text-success' },
          ].map(({ label, status, color }) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
              <span className="text-sm text-ink">{label}</span>
              <span className={`text-xs font-semibold ${color}`}>{status}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 p-4 rounded-xl bg-primary-50 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary-darker">AI Insight</span>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed">
            Your recent vitals are within healthy range. Continue monitoring blood pressure weekly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-surface">
      <MarketingNavbar />

      {/* Hero */}
      <section className="pt-28 lg:pt-32 pb-20 lg:pb-28">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <FadeIn>
                <span className="section-label mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-powered healthcare platform
                </span>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-ink tracking-tight leading-[1.1] text-balance">
                  Your health.{' '}
                  <span className="text-primary">Understood better.</span>{' '}
                  Every day.
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="mt-6 text-lg text-ink-muted leading-relaxed max-w-lg">
                  MedScan transforms complex medical documents into clear, actionable insights —
                  so you can take control of your health with confidence.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Link to={user ? '/dashboard' : '/signup'} className="btn-primary text-base">
                    {user ? 'Open Dashboard' : 'Get Started Free'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href="#how-it-works" className="btn-secondary text-base">
                    See how it works
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="mt-12 flex flex-wrap gap-6">
                  {[
                    { icon: Shield, label: 'Secure & private' },
                    { icon: Zap, label: 'Results in seconds' },
                    { icon: Globe, label: 'English & Hindi' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-sm text-ink-muted">
                      <Icon className="w-4 h-4 text-primary" />
                      {label}
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.2} className="hidden lg:block">
              <HealthIllustration />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 border-y border-border bg-white">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Upload, label: 'Upload Report', to: user ? '/upload-report' : '/signup' },
              { icon: HeartPulse, label: 'Add Vitals', to: user ? '/vitals' : '/signup' },
              { icon: Clock, label: 'View History', to: user ? '/history' : '/signup' },
              { icon: Sparkles, label: 'Health Insights', to: user ? '/health-insights' : '/signup' },
            ].map(({ icon: Icon, label, to }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-surface hover:bg-white hover:border-primary/20 hover:shadow-card transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5 text-primary group-hover:text-white" />
                </div>
                <span className="text-sm font-semibold text-ink">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="page-container">
          <FadeIn className="text-center mb-16">
            <span className="section-label mb-4">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">
              Why choose MedScan?
            </h2>
            <p className="mt-4 text-ink-muted max-w-xl mx-auto">
              Everything you need to understand and manage your health data in one elegant platform.
            </p>
          </FadeIn>

          <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description, color }) => (
              <StaggerItem key={title}>
                <HoverLift>
                  <div className="h-full p-6 rounded-2xl bg-white border border-border shadow-card hover:shadow-elevated transition-shadow">
                    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-5`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-ink">{title}</h3>
                    <p className="mt-2 text-sm text-ink-muted leading-relaxed">{description}</p>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white border-y border-border">
        <div className="page-container">
          <FadeIn className="text-center mb-16">
            <span className="section-label mb-4">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold text-ink">Three simple steps</h2>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map(({ num, title, desc, icon: Icon }) => (
              <StaggerItem key={num}>
                <div className="text-center">
                  <div className="relative inline-flex mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {num}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-ink">{title}</h3>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <span className="section-label mb-4">Benefits</span>
              <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">
                Healthcare advantages built for you
              </h2>
              <p className="mt-4 text-ink-muted leading-relaxed">
                MedScan bridges the gap between complex medical information and everyday understanding.
              </p>
            </FadeIn>

            <Stagger className="grid sm:grid-cols-2 gap-4">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <StaggerItem key={title}>
                  <div className="p-5 rounded-2xl bg-white border border-border">
                    <Icon className="w-5 h-5 text-primary mb-3" />
                    <h3 className="text-sm font-semibold text-ink">{title}</h3>
                    <p className="text-xs text-ink-muted mt-1 leading-relaxed">{desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white border-y border-border">
        <div className="page-container">
          <FadeIn className="text-center mb-16">
            <span className="section-label mb-4">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-ink">Trusted by thousands</h2>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, rating }) => (
              <StaggerItem key={name}>
                <div className="h-full p-6 rounded-2xl bg-surface border border-border">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed">&ldquo;{text}&rdquo;</p>
                  <div className="mt-5 pt-5 border-t border-border">
                    <p className="text-sm font-semibold text-ink">{name}</p>
                    <p className="text-xs text-ink-faint">{role}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-24">
        <div className="page-container">
          <FadeIn>
            <div className="rounded-3xl bg-white border border-border shadow-card p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="section-label mb-4">
                    <Lock className="w-3.5 h-3.5" />
                    Security & Privacy
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-ink">Your data stays yours</h2>
                  <p className="mt-4 text-ink-muted leading-relaxed">
                    We use industry-standard encryption to protect your health information.
                    Your data is never sold to third parties and you can delete it at any time.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {['End-to-end encryption', 'No data selling', 'Full account deletion', 'Secure cloud storage'].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-ink-muted">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 rounded-3xl bg-primary-50 border border-primary/10 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pricing placeholder */}
      <section id="pricing" className="py-24 bg-white border-y border-border">
        <div className="page-container text-center">
          <FadeIn>
            <span className="section-label mb-4">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-ink">Start free, upgrade when ready</h2>
            <p className="mt-4 text-ink-muted max-w-md mx-auto">
              Core features are free forever. No credit card required to get started.
            </p>
            <Link to={user ? '/dashboard' : '/signup'} className="btn-primary mt-8">
              {user ? 'Go to Dashboard' : 'Create Free Account'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24">
        <div className="page-container text-center max-w-2xl mx-auto">
          <FadeIn>
            <span className="section-label mb-4">About Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-ink">Making healthcare accessible</h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              MedScan was built to help patients and healthcare professionals bridge the gap
              between medical complexity and everyday understanding. We believe everyone deserves
              clear, actionable health information.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="page-container">
          <FadeIn>
            <div className="rounded-3xl bg-primary p-10 md:p-16 text-center text-white">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                Ready to understand your health better?
              </h2>
              <p className="mt-4 text-primary-100 max-w-md mx-auto">
                Join thousands who trust MedScan for clear, AI-powered health insights.
              </p>
              <Link
                to={user ? '/dashboard' : '/signup'}
                className="inline-flex items-center gap-2 bg-white text-primary-darker px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors mt-8 shadow-sm"
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  )
}
