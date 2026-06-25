import { Link } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/#pricing' },
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
    <footer className="bg-white border-t border-border">
      <div className="page-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-ink">MedScan</span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed max-w-xs">
              AI-powered healthcare insights that help you understand your medical data with clarity and confidence.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-ink mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="text-sm text-ink-muted hover:text-primary transition-colors">
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
            <Link to="#" className="hover:text-ink transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-ink transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
