import { Link } from 'react-router-dom'
import {
  FileText,
  HeartPulse,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
  Sparkles,
  Clock,
  Play,
  Lock,
  Upload,
  Brain,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import MarketingNavbar from '../components/layout/MarketingNavbar'
import Footer from '../components/layout/Footer'
import DashboardPreview from '../components/marketing/DashboardPreview'
import TestimonialCarousel from '../components/marketing/TestimonialCarousel'
import FAQSection from '../components/marketing/FAQSection'
import { TiltCard, FloatingElement } from '../components/marketing/FeatureCard'
import { FadeIn, Stagger, StaggerItem } from '../components/ui/motion'

const features = [
  {
    icon: Brain,
    title: 'AI Report Analysis',
    description: 'Upload lab reports and get instant, plain-language explanations of every test result.',
    color: 'icon-badge-blue',
  },
  {
    icon: FileText,
    title: 'Prescription Understanding',
    description: 'Decode prescriptions with clear medicine names, dosages, schedules, and side effects.',
    color: 'icon-badge-green',
  },
  {
    icon: HeartPulse,
    title: 'Vitals Tracking',
    description: 'Log blood pressure, heart rate, and weight. Visualize trends over time.',
    color: 'icon-badge-green',
  },
  {
    icon: Clock,
    title: 'Medical History',
    description: 'Keep a complete timeline of uploads, analyses, prescriptions, and vitals.',
    color: 'icon-badge-orange',
  },
]

const steps = [
  {
    num: '1',
    title: 'Upload',
    desc: 'Add your prescription, lab report, or vitals data',
    icon: Upload,
    color: 'icon-badge-green',
  },
  {
    num: '2',
    title: 'AI Analysis',
    desc: 'Our medical AI processes and interprets your data',
    icon: Sparkles,
    color: 'icon-badge-blue',
  },
  {
    num: '3',
    title: 'Health Insights',
    desc: 'Receive clear, actionable health recommendations',
    icon: TrendingUp,
    color: 'icon-badge-purple',
  },
]

const benefits = [
  { icon: Shield, title: 'Secure & Private', desc: 'Your health data is encrypted and never shared without consent.' },
  { icon: Zap, title: 'Instant Results', desc: 'Get AI-powered analysis in seconds, not days.' },
  { icon: Globe, title: 'Bilingual Support', desc: 'Understand your health in English or Hindi.' },
  { icon: Lock, title: 'HIPAA-Inspired', desc: 'Built with healthcare privacy standards in mind.' },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything you need to get started with AI health insights.',
    features: ['Unlimited report uploads', 'AI analysis', 'Vitals tracking', 'Medical history'],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'Advanced insights and priority processing for power users.',
    features: ['Everything in Free', 'Priority AI processing', 'Advanced trend analytics', 'Export reports'],
    highlighted: true,
  },
]

function HealthIllustration() {
  return (
    <FloatingElement delay={0.5}>
      <div className="relative">
        <div className="absolute -inset-6 bg-primary/5 rounded-3xl blur-2xl pointer-events-none" />
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative card p-6 shadow-soft"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-medium text-ink-muted">Health Summary</p>
              <p className="text-lg font-bold text-ink mt-0.5 tracking-tight">Your wellness at a glance</p>
            </div>
            <div className="icon-badge-green">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Prescription decoded', status: 'Complete', statusClass: 'status-success' },
              { label: 'Lab report analysed', status: '2 flagged', statusClass: 'status-warning' },
              { label: 'Vitals logged today', status: 'Normal', statusClass: 'status-info' },
            ].map(({ label, status, statusClass }) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-section border border-border/60">
                <span className="text-sm text-ink">{label}</span>
                <span className={statusClass}>{status}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-xl bg-primary-50 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary-darker">AI Insight</span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed text-pretty">
              Your recent vitals are within healthy range. Continue monitoring blood pressure weekly.
            </p>
          </div>
        </motion.div>
      </div>
    </FloatingElement>
  )
}

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <MarketingNavbar />

      {/* Hero */}
      <section className="hero-gradient pt-32 lg:pt-36 pb-20 lg:pb-28">
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
                <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold text-ink tracking-tight leading-[1.06] text-balance">
                  Your health.{' '}
                  <span className="text-primary">Understood better.</span>{' '}
                  Every day.
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="mt-6 text-lg text-ink-muted leading-relaxed max-w-lg text-pretty">
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
                    <Play className="w-4 h-4 fill-ink/20" />
                    See how it works
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

            <FadeIn delay={0.2} className="hidden md:block">
              <HealthIllustration />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-10 bg-white border-y border-border">
        <div className="page-container">
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Upload, label: 'Upload Report', to: user ? '/upload-report' : '/signup' },
              { icon: HeartPulse, label: 'Add Vitals', to: user ? '/vitals' : '/signup' },
              { icon: Clock, label: 'View History', to: user ? '/history' : '/signup' },
              { icon: Sparkles, label: 'Health Insights', to: user ? '/health-insights' : '/signup' },
            ].map(({ icon: Icon, label, to }) => (
              <StaggerItem key={label}>
                <Link to={to} className="card-interactive flex items-center gap-3 p-4 group">
                  <div className="icon-badge-green group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-ink">{label}</span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* How it works — matches mockup order */}
      <section id="how-it-works" className="py-24 lg:py-28 bg-white border-y border-border">
        <div className="page-container">
          <FadeIn className="text-center mb-16">
            <span className="section-label mb-4">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">Three simple steps</h2>
            <p className="mt-4 text-ink-muted max-w-lg mx-auto text-pretty">
              From upload to insight in minutes — no medical jargon required.
            </p>
          </FadeIn>

          <Stagger className="relative grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div
              aria-hidden
              className="hidden md:block absolute top-[4.5rem] left-[18%] right-[18%] h-px border-t-2 border-dashed border-border"
            />
            {steps.map(({ num, title, desc, icon: Icon, color }) => (
              <StaggerItem key={num}>
                <div className="card-interactive p-8 text-center relative h-full">
                  <div className="relative inline-flex mb-6">
                    <div className={`${color} !p-4`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-glow">
                      {num}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-ink">{title}</h3>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed text-pretty">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 lg:py-28 bg-section section-tint-blue">
        <div className="page-container">
          <FadeIn className="text-center mb-16">
            <span className="section-label mb-4">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight text-balance">
              Everything you need in one place
            </h2>
            <p className="mt-4 text-ink-muted max-w-xl mx-auto text-pretty">
              Understand and manage your health data in one elegant, trustworthy platform.
            </p>
          </FadeIn>

          <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description, color }) => (
              <StaggerItem key={title}>
                <TiltCard>
                  <div className="h-full card-interactive p-6 group">
                    <div className={`${color} mb-5 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-ink">{title}</h3>
                    <p className="mt-2 text-sm text-ink-muted leading-relaxed text-pretty">{description}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 lg:py-28 bg-surface section-tint-green">
        <div className="page-container">
          <DashboardPreview />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 lg:py-28 bg-section">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeIn>
              <span className="section-label mb-4">Benefits</span>
              <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight text-balance">
                Healthcare advantages built for you
              </h2>
              <p className="mt-4 text-ink-muted leading-relaxed text-pretty max-w-lg">
                MedScan bridges the gap between complex medical information and everyday understanding.
              </p>
            </FadeIn>

            <Stagger className="grid sm:grid-cols-2 gap-4">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <StaggerItem key={title}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="card-interactive p-5"
                  >
                    <div className="icon-badge-green !p-2 mb-3 w-fit">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-ink">{title}</h3>
                    <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">{desc}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-28 bg-white border-y border-border">
        <div className="page-container">
          <TestimonialCarousel />
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-24 lg:py-28 bg-surface">
        <div className="page-container">
          <FadeIn>
            <div className="rounded-3xl card shadow-soft p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                  <span className="section-label mb-4">
                    <Lock className="w-3.5 h-3.5" />
                    Security & Privacy
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">Your data stays yours</h2>
                  <p className="mt-4 text-ink-muted leading-relaxed text-pretty">
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
                  <FloatingElement>
                    <div className="w-32 h-32 rounded-3xl bg-primary-50 border border-primary/10 flex items-center justify-center shadow-card">
                      <Shield className="w-16 h-16 text-primary" />
                    </div>
                  </FloatingElement>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 lg:py-28 bg-section">
        <div className="page-container">
          <FadeIn className="text-center mb-16">
            <span className="section-label mb-4">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight text-balance">
              Start free, upgrade when ready
            </h2>
            <p className="mt-4 text-ink-muted max-w-md mx-auto text-pretty">
              Core features are free forever. No credit card required to get started.
            </p>
          </FadeIn>

          <Stagger className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pricingPlans.map(({ name, price, period, description, features: planFeatures, highlighted }) => (
              <StaggerItem key={name}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`h-full rounded-2xl p-8 border ${
                    highlighted
                      ? 'bg-white border-primary/30 shadow-glow ring-1 ring-primary/10'
                      : 'bg-white border-border shadow-card'
                  }`}
                >
                  {highlighted && (
                    <span className="inline-block text-xs font-semibold text-primary bg-primary-50 px-2.5 py-0.5 rounded-full mb-4">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-ink">{name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-ink tracking-tight">{price}</span>
                    <span className="text-sm text-ink-muted">{period}</span>
                  </div>
                  <p className="mt-3 text-sm text-ink-muted">{description}</p>
                  <ul className="mt-6 space-y-3">
                    {planFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-ink-muted">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={user ? '/dashboard' : '/signup'}
                    className={`mt-8 w-full justify-center ${highlighted ? 'btn-primary' : 'btn-secondary'} text-sm`}
                  >
                    {user ? 'Go to Dashboard' : name === 'Free' ? 'Get Started Free' : 'Start Pro Trial'}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 lg:py-28 bg-white border-y border-border">
        <div className="page-container">
          <FAQSection />
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 lg:py-28 bg-surface">
        <div className="page-container text-center max-w-2xl mx-auto">
          <FadeIn>
            <span className="section-label mb-4">About Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight text-balance">
              Making healthcare accessible
            </h2>
            <p className="mt-4 text-ink-muted leading-relaxed text-pretty">
              MedScan was built to help patients and healthcare professionals bridge the gap
              between medical complexity and everyday understanding. We believe everyone deserves
              clear, actionable health information.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-28 bg-section">
        <div className="page-container">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center">
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #047857 100%)',
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
              <div className="relative text-white">
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-balance">
                  Ready to understand your health better?
                </h2>
                <p className="mt-4 text-primary-100 max-w-md mx-auto text-pretty">
                  Join thousands who trust MedScan for clear, AI-powered health insights.
                </p>
                <Link
                  to={user ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-2 bg-white text-primary-darker px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 hover:-translate-y-0.5 transition-all duration-300 mt-8 shadow-soft"
                >
                  {user ? 'Go to Dashboard' : 'Get Started Free'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  )
}
