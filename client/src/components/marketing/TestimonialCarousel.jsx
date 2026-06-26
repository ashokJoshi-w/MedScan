import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { FadeIn } from '../ui/motion'

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'General Physician',
    text: 'MedScan helps my patients understand their lab results before they even walk into my clinic.',
    avatar: 'PS',
    color: 'bg-primary-50 text-primary-darker',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Patient',
    text: 'Finally I can understand what my prescriptions mean. The AI explanations are incredibly clear.',
    avatar: 'RK',
    color: 'bg-accent-blue-soft text-accent-blue',
  },
  {
    name: 'Anita Desai',
    role: 'Caregiver',
    text: "Tracking my mother's vitals and reports in one place has been a game changer for our family.",
    avatar: 'AD',
    color: 'bg-violet-50 text-accent-purple',
  },
]

function TestimonialCard({ item, highlighted = false }) {
  return (
    <motion.div
      animate={{ y: highlighted ? -4 : 0, scale: highlighted ? 1.02 : 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`card p-6 md:p-7 h-full flex flex-col ${
        highlighted ? 'border-primary/25 shadow-glow ring-1 ring-primary/10' : ''
      }`}
    >
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
        ))}
      </div>
      <p className="text-sm md:text-base text-ink-muted leading-relaxed italic text-pretty flex-1">
        &ldquo;{item.text}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3 pt-5 border-t border-border">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${item.color}`}>
          {item.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{item.name}</p>
          <p className="text-xs text-ink-faint">{item.role}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function TestimonialCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setActive((i) => (i + 1) % testimonials.length)
  }, [])

  useEffect(() => {
    if (paused) return undefined
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [paused, next])

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <FadeIn className="text-center mb-14">
        <span className="section-label mb-4">Testimonials</span>
        <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight text-balance">
          Trusted by thousands
        </h2>
      </FadeIn>

      {/* Desktop: 3 cards visible */}
      <div className="hidden md:grid md:grid-cols-3 gap-5 lg:gap-6">
        {testimonials.map((item, i) => (
          <TestimonialCard key={item.name} item={item} highlighted={i === active} />
        ))}
      </div>

      {/* Mobile: single highlighted card */}
      <div className="md:hidden">
        <TestimonialCard item={testimonials[active]} highlighted />
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-ink-faint'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
