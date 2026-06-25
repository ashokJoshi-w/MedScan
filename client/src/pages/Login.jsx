import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../config'
import AuthLayout from '../components/layout/AuthLayout'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export default function Login({ onSwitch }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
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
      title="Welcome back to MedScan"
      subtitle="Sign in to access your health dashboard, reports, and AI-powered insights."
    >
      <Link to="/" className="text-sm text-ink-muted hover:text-primary transition-colors mb-8 inline-block">
        &larr; Back to home
      </Link>

      <h2 className="text-2xl font-bold text-ink">Sign in</h2>
      <p className="text-sm text-ink-muted mt-1 mb-8">Enter your credentials to continue</p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl mb-6" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div>
          <Input
            label="Password"
            name="password"
            type="password"
            required
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            icon={Lock}
          />
          <div className="mt-2 text-right">
            <Link to="#" className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          {!loading && (
            <>
              Sign in
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-ink-muted text-sm mt-8">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-primary font-semibold hover:text-primary-dark cursor-pointer">
          Create account
        </button>
      </p>
    </AuthLayout>
  )
}
