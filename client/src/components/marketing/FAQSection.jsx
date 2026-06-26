import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { FadeIn } from '../ui/motion'

const faqs = [
  {
    q: 'Is MedScan free to use?',
    a: 'Yes. Core features including report uploads, AI analysis, and vitals tracking are free. No credit card is required to create an account.',
  },
  {
    q: 'Is my health data secure?',
    a: 'Your data is encrypted in transit and at rest. We never sell your information to third parties, and you can delete your account and data at any time.',
  },
  {
    q: 'What types of documents can I upload?',
    a: 'MedScan supports lab reports, prescriptions, and vitals data. Upload a photo or PDF and our AI will extract and explain the key information.',
  },
  {
    q: 'Does MedScan replace my doctor?',
    a: 'No. MedScan helps you understand your medical documents — it does not provide diagnoses or replace professional medical advice.',
  },
  {
    q: 'Is Hindi supported?',
    a: 'Yes. MedScan supports both English and Hindi, so you can read AI explanations in the language you prefer.',
  },
]

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-ink group-hover:text-primary-dark transition-colors">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="shrink-0 p-1 rounded-lg bg-section text-ink-muted"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-ink-muted leading-relaxed pr-8">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="max-w-3xl mx-auto">
      <FadeIn className="text-center mb-12">
        <span className="section-label mb-4">FAQ</span>
        <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight text-balance">
          Common questions
        </h2>
        <p className="mt-4 text-ink-muted max-w-lg mx-auto text-pretty">
          Everything you need to know about MedScan before getting started.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="card px-6 md:px-8">
          {faqs.map(({ q, a }, i) => (
            <FAQItem
              key={q}
              question={q}
              answer={a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </FadeIn>
    </div>
  )
}
