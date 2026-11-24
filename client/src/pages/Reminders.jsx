import { useState, useEffect } from 'react'
import { Bell, Plus, Trash2, Loader2 } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'

const API = 'http://localhost:3001/api'
const getToken = () => localStorage.getItem('medscan_token')

export default function Reminders() {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const fetchReminders = async () => {
    try {
      const res = await fetch(`${API}/reminders`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error('Failed to fetch reminders')
      const data = await res.json()
      setReminders(data)
    } catch (err) {
      console.error('Reminders fetch error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReminders()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`${API}/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title: title.trim(), description, isActive: true }),
      })
      if (!res.ok) throw new Error('Failed to save reminder')
      const saved = await res.json()
      setReminders((prev) => [saved, ...prev])
      setTitle('')
      setDescription('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (reminder) => {
    try {
      const res = await fetch(`${API}/reminders/${reminder._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ isActive: !reminder.isActive }),
      })
      if (!res.ok) throw new Error('Failed to update reminder')
      const updated = await res.json()
      setReminders((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      )
    } catch (err) {
      console.error('Toggle error:', err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/reminders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error('Failed to delete reminder')
      setReminders((prev) => prev.filter((r) => r._id !== id))
    } catch (err) {
      console.error('Delete error:', err.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Reminders"
        description="Set medication and health reminders to stay on track."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-ink mb-4">Add Reminder</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Take Metformin 500mg"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Take with food, twice daily"
                rows={3}
                className="input-field"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="btn-primary text-sm py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Add Reminder'}
            </button>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-ink mb-4">Your Reminders</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-ink-muted" />
            </div>
          ) : reminders.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No reminders yet"
              description="Add a medication or health reminder to get started."
            />
          ) : (
            <ul className="space-y-3">
              {reminders.map((r) => (
                <li
                  key={r._id}
                  className={`flex items-start justify-between gap-4 p-4 rounded-xl border border-border ${
                    r.isActive ? 'bg-white' : 'bg-surface/50 opacity-70'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{r.title}</p>
                      {r.description && (
                        <p className="text-xs text-ink-muted mt-0.5">{r.description}</p>
                      )}
                      <p className="text-xs text-ink-faint mt-1">
                        {r.isActive ? 'Active' : 'Inactive'} •{' '}
                        {new Date(r.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(r)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                        r.isActive
                          ? 'bg-primary-50 text-primary border-primary/20'
                          : 'bg-surface text-ink-muted border-border'
                      }`}
                    >
                      {r.isActive ? 'Active' : 'Paused'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r._id)}
                      className="p-2 rounded-lg text-ink-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}