import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  Bell,
  Shield,
  Lock,
  Globe,
  ChevronRight,
  Trash2,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'

const sections = [
  {
    title: 'Profile',
    items: [
      { icon: User, label: 'Personal Information', desc: 'Name, email, and account details', to: '/profile' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { icon: Bell, label: 'Notification Preferences', desc: 'Email alerts and reminders', toggle: true, defaultOn: true },
      { icon: Bell, label: 'Medication Reminders', desc: 'Daily dose notifications', toggle: true, defaultOn: false },
    ],
  },
  {
    title: 'Security',
    items: [
      { icon: Lock, label: 'Change Password', desc: 'Update your account password', action: 'change-password' },
      { icon: Shield, label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', toggle: true, defaultOn: false },
    ],
  },
  {
    title: 'Privacy',
    items: [
      { icon: Shield, label: 'Data & Privacy', desc: 'Control how your data is used', action: 'privacy' },
      { icon: Trash2, label: 'Delete Account', desc: 'Permanently remove your account', danger: true, action: 'delete' },
    ],
  },
  {
    title: 'Language',
    items: [
      { icon: Globe, label: 'Display Language', desc: 'English (default)', action: 'language' },
    ],
  },
]

function ToggleSwitch({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
        on ? 'bg-primary' : 'bg-border'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
          on ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account preferences, security, and privacy settings."
      />

      <div className="space-y-8 max-w-2xl">
        {sections.map(({ title, items }) => (
          <div key={title}>
            <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">{title}</h2>
            <Card padding={false} className="overflow-hidden">
              {items.map((item, i) => {
                const Icon = item.icon
                const isLast = i === items.length - 1

                const content = (
                  <div className={`flex items-center gap-4 px-6 py-4 ${!isLast ? 'border-b border-border' : ''} ${
                    item.to ? 'hover:bg-surface transition-colors cursor-pointer' : ''
                  } ${item.danger ? 'hover:bg-red-50' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.danger ? 'bg-red-50' : 'bg-surface border border-border'
                    }`}>
                      <Icon className={`w-5 h-5 ${item.danger ? 'text-red-500' : 'text-ink-muted'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${item.danger ? 'text-red-600' : 'text-ink'}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-ink-muted mt-0.5">{item.desc}</p>
                    </div>
                    {item.toggle ? (
                      <ToggleSwitch defaultOn={item.defaultOn} />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-ink-faint shrink-0" />
                    )}
                  </div>
                )

                return item.to ? (
                  <Link key={item.label} to={item.to}>
                    {content}
                  </Link>
                ) : (
                  <button key={item.label} type="button" className="w-full text-left cursor-pointer">
                    {content}
                  </button>
                )
              })}
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
