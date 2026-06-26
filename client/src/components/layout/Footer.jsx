import { Link } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'
import Logo from '../ui/Logo'

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'FAQ', href: '/#faq' },
  ],
  Company: [
    { label: 'About', href: '/#about' },
    { label: 'Privacy', href: '/#security' },
    { label: 'Contact', href: '#' },
  ],
  Resources: [
    { label: 'Help Center', href: '#' },
    { label: 'Documentation', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-section border-t border-border section-tint-blue">
      <div className="page-container py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Logo to="/" size="sm" className="mb-4" />
            <p className="text-sm text-ink-muted leading-relaxed max-w-xs text-pretty">
              AI-powered healthcare insights that help you understand your medical data with clarity and confidence.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-ink mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="text-sm text-ink-muted hover:text-primary transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-faint">
            &copy; {new Date().getFullYear()} MedScan. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-ink-muted">
            <Link to="#" className="hover:text-ink transition-colors duration-200">Privacy Policy</Link>
            <Link to="#" className="hover:text-ink transition-colors duration-200">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
