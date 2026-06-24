import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HeartPulse, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../config'

export default function Signup({ onSwitch }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'doctor' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: form.role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Signup failed')
      login(data.user, data.token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err.message === 'Failed to fetch'
        ? 'Cannot reach server. Run `npm run dev:server` from the project root.'
        : err.message
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-darker via-primary-dark to-primary p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-teal-200 rounded-full blur-3xl" />
        </div>

        <Link to="/" className="relative flex items-center gap-2.5 text-white">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">MedScan</span>
        </Link>

        <div className="relative">
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Start understanding<br />your health today.
          </h1>
          <p className="mt-4 text-teal-100 text-lg leading-relaxed max-w-md">
            Create a free account and get instant AI analysis of your medical documents.
          </p>
        </div>

        <p className="relative text-teal-200/60 text-sm">&copy; {new Date().getFullYear()} MedScan</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">MedScan</span>
          </div>

          <Link to="/" className="text-sm text-gray-500 hover:text-primary transition-colors mb-6 inline-block">
            &larr; Back to home
          </Link>

          <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
          <p className="text-gray-500 text-sm mt-1 mb-8">Join MedScan to get started</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition cursor-pointer"
              >
                <option value="doctor">Doctor</option>
                <option value="radiologist">Radiologist</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-sm shadow-primary/20 cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Already have an account?{' '}
            <button type="button" onClick={onSwitch} className="text-primary font-semibold hover:text-primary-dark cursor-pointer">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
