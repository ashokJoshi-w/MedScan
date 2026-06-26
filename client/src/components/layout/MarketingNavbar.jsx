import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../ui/Logo'

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#about', label: 'About' },
]

export default function MarketingNavbar() {
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`max-w-6xl mx-auto rounded-2xl nav-blur transition-all duration-300 ${
          scrolled ? 'shadow-nav py-0' : 'shadow-soft'
        }`}
      >
        <motion.div
          animate={{ height: scrolled ? 54 : 60 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex items-center justify-between px-5 sm:px-6"
        >
          <Logo to="/" size="sm" />

          <nav className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-ink rounded-lg hover:bg-white/60 transition-colors duration-200"
            >
              Home
            </Link>
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="px-4 py-2 text-sm font-medium text-ink-muted rounded-lg hover:text-ink hover:bg-white/60 transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-sm py-2 px-5">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm px-3">
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-ink-muted hover:bg-white/80 hover:text-ink transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden overflow-hidden border-t border-border/60"
            >
              <div className="px-4 py-4 space-y-1">
                <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-ink rounded-xl hover:bg-white/80">
                  Home
                </Link>
                {navLinks.map(({ href, label }) => (
                  <a key={href} href={href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-ink-muted rounded-xl hover:bg-white/80 hover:text-ink">
                    {label}
                  </a>
                ))}
                <div className="pt-4 flex flex-col gap-2 border-t border-border/60 mt-2">
                  {user ? (
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="btn-primary text-sm justify-center">Dashboard</Link>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm justify-center">Log in</Link>
                      <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-sm justify-center">Get Started</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  )
}
