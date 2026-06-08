import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

type Toggle = { label: string; sub: string; on: boolean }

const defaults: Toggle[] = [
  { label: 'Assignment Reminders',   sub: 'Notify when an assignment is due',         on: true  },
  { label: 'Grade Published',        sub: 'Notify when a new grade is posted',        on: true  },
  { label: 'Announcements',          sub: 'School-wide news and updates',             on: true  },
  { label: 'Class Reminders',        sub: 'Reminder before a class or exam starts',   on: true  },
  { label: 'Messages',               sub: 'New messages from teachers or classmates', on: true  },
  { label: 'Attendance Alerts',      sub: 'Notify when marked absent or late',        on: false },
  { label: 'Achievement Unlocked',   sub: 'Badges, streaks and milestones',           on: true  },
  { label: 'Weekly Summary',         sub: 'Weekly performance digest every Sunday',   on: false },
]

const channels: Toggle[] = [
  { label: 'In-app Notifications', sub: 'Shown inside the Learnora app',          on: true  },
  { label: 'Email Notifications',  sub: 'Sent to olive.johnson@greenfield.edu',   on: true  },
  { label: 'SMS Notifications',    sub: 'Sent to your registered phone number',   on: false },
  { label: 'Push Notifications',   sub: 'Browser/device push (if installed)',     on: true  },
]

function ToggleRow({ item, onChange }: { item: Toggle; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-black/4 last:border-0">
      <div>
        <p className="text-sm font-semibold text-foreground">{item.label}</p>
        <p className="text-xs text-muted mt-0.5">{item.sub}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${item.on ? 'bg-primary' : 'bg-black/15'}`}
      >
        <span className={`absolute inset-y-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${item.on ? 'left-[22px]' : 'left-[2px]'}`} />
      </button>
    </div>
  )
}

export default function NotificationSettingsPage({ onNavigate }: Props) {
  const [notifs, setNotifs]   = useState(defaults)
  const [chans,  setChans]    = useState(channels)

  function toggleNotif(i: number) {
    setNotifs(ns => ns.map((n, idx) => idx === i ? { ...n, on: !n.on } : n))
  }

  function toggleChan(i: number) {
    setChans(cs => cs.map((c, idx) => idx === i ? { ...c, on: !c.on } : c))
  }

  return (
    <DashboardLayout
      activePage="settings"
      onNavigate={onNavigate}
      title="Notification Settings"
      subtitle="Control how and when you receive alerts"
    >
      <div className="max-w-[640px] flex flex-col gap-6">

        <button onClick={() => onNavigate('settings')} className="flex items-center gap-2 text-sm text-muted hover:text-foreground w-fit">
          <ChevronLeft size={16} /> Back to Settings
        </button>

        <div className="bg-surface rounded-card shadow-sm p-6">
          <h2 className="text-base font-bold text-foreground mb-1">Notification Types</h2>
          <p className="text-xs text-muted mb-4">Choose which events trigger a notification.</p>
          {notifs.map((n, i) => <ToggleRow key={n.label} item={n} onChange={() => toggleNotif(i)} />)}
        </div>

        <div className="bg-surface rounded-card shadow-sm p-6">
          <h2 className="text-base font-bold text-foreground mb-1">Delivery Channels</h2>
          <p className="text-xs text-muted mb-4">Choose how notifications are delivered to you.</p>
          {chans.map((c, i) => <ToggleRow key={c.label} item={c} onChange={() => toggleChan(i)} />)}
        </div>

      </div>
    </DashboardLayout>
  )
}
