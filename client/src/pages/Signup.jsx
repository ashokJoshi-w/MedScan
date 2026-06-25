import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../config'
import AuthLayout from '../components/layout/AuthLayout'
import Button from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'

const passwordRules = [
  { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'number', label: 'One number', test: (p) => /\d/.test(p) },
]

export default function Signup({ onSwitch }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'doctor' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const ruleStatus = useMemo(
    () => passwordRules.map((r) => ({ ...r, met: r.test(form.password) })),
    [form.password]
  )

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
    <AuthLayout
      title="Create your MedScan account"
      subtitle="Join thousands who use AI to understand their health data with clarity and confidence."
    >
      <Link to="/" className="text-sm text-ink-muted hover:text-primary transition-colors mb-8 inline-block">
        &larr; Back to home
      </Link>

      <h2 className="text-2xl font-bold text-ink">Create account</h2>
      <p className="text-sm text-ink-muted mt-1 mb-8">Fill in your details to get started</p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl mb-6" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          icon={User}
        />

        <Input
          label="Email address"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          icon={Mail}
        />

        <Select label="Role" name="role" value={form.role} onChange={handleChange}>
          <option value="doctor">Doctor</option>
          <option value="radiologist">Radiologist</option>
          <option value="admin">Admin</option>
        </Select>

        <Input
          label="Password"
          name="password"
          type="password"
          required
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          icon={Lock}
        />

        {form.password && (
          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Password must contain</p>
            {ruleStatus.map(({ id, label, met }) => (
              <div key={id} className="flex items-center gap-2 text-sm">
                {met ? (
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-ink-faint shrink-0" />
                )}
                <span className={met ? 'text-ink' : 'text-ink-muted'}>{label}</span>
              </div>
            ))}
          </div>
        )}

        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          required
          placeholder="Re-enter password"
          value={form.confirmPassword}
          onChange={handleChange}
          icon={Lock}
        />

        <Button type="submit" loading={loading} className="w-full mt-2">
          {!loading && (
            <>
              Create account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-ink-muted text-sm mt-8">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-primary font-semibold hover:text-primary-dark cursor-pointer">
          Sign in
        </button>
      </p>
    </AuthLayout>
  )
}
