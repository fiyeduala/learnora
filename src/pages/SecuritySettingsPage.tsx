import { useState } from 'react'
import { ChevronLeft, Eye, EyeOff, Shield, Monitor, Smartphone, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

export default function SecuritySettingsPage({ onNavigate }: Props) {
  const [current,  setCurrent]  = useState('')
  const [newPw,    setNewPw]    = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [twoFA,    setTwoFA]    = useState(false)
  const [pwSaved,  setPwSaved]  = useState(false)

  function savePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPw === confirm && newPw.length >= 8) {
      setPwSaved(true)
      setTimeout(() => setPwSaved(false), 2500)
      setCurrent(''); setNewPw(''); setConfirm('')
    }
  }

  const sessions = [
    { device: 'Chrome on Windows 10',  location: 'Lagos, Nigeria', time: 'Now · Current',          current: true  },
    { device: 'Safari on iPhone 14',   location: 'Lagos, Nigeria', time: '2 days ago',              current: false },
    { device: 'Chrome on MacBook Pro', location: 'Abuja, Nigeria', time: '5 days ago',              current: false },
  ]

  return (
    <DashboardLayout
      activePage="settings"
      onNavigate={onNavigate}
      title="Security Settings"
      subtitle="Password, two-factor authentication and active sessions"
    >
      <div className="max-w-[640px] flex flex-col gap-6">

        <button onClick={() => onNavigate('settings')} className="flex items-center gap-2 text-sm text-muted hover:text-foreground w-fit">
          <ChevronLeft size={16} /> Back to Settings
        </button>

        {/* Change password */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <h2 className="text-base font-bold text-foreground mb-5">Change Password</h2>
          <form onSubmit={savePassword} className="flex flex-col gap-4">
            {[
              { label: 'Current Password', val: current, set: setCurrent },
              { label: 'New Password',     val: newPw,   set: setNewPw   },
              { label: 'Confirm Password', val: confirm,  set: setConfirm  },
            ].map(f => (
              <div key={f.label} className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">{f.label}</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={f.val} onChange={e => f.set(e.target.value)} required
                    className="w-full h-12 px-4 pr-11 border border-black/20 rounded-input text-sm text-foreground outline-none focus:border-primary"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit"
              className={`flex items-center gap-2 h-11 px-5 rounded-pill text-sm font-semibold self-start transition-colors ${
                pwSaved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary-deep shadow-primary'
              }`}>
              {pwSaved && <CheckCircle2 size={14} />}
              {pwSaved ? 'Password Updated!' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* 2FA */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-card bg-primary/10 flex items-center justify-center">
                <Shield size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted mt-0.5">{twoFA ? 'Enabled — extra protection active' : 'Disabled — add extra security'}</p>
              </div>
            </div>
            <button
              onClick={() => setTwoFA(!twoFA)}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${twoFA ? 'bg-primary' : 'bg-black/15'}`}
            >
              <span className={`absolute inset-y-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${twoFA ? 'left-[22px]' : 'left-[2px]'}`} />
            </button>
          </div>
        </div>

        {/* Sessions */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6">
            <h2 className="text-base font-bold text-foreground">Active Sessions</h2>
          </div>
          <div className="divide-y divide-black/4">
            {sessions.map((s, i) => {
              const Icon = s.device.includes('iPhone') ? Smartphone : Monitor
              return (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <Icon size={18} className={s.current ? 'text-primary' : 'text-muted'} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{s.device}</p>
                    <p className="text-xs text-muted mt-0.5">{s.location} · {s.time}</p>
                  </div>
                  {s.current
                    ? <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Current</span>
                    : <button className="text-xs text-red-500 font-semibold hover:underline">Revoke</button>
                  }
                </div>
              )
            })}
          </div>
          <div className="px-6 py-4 border-t border-black/6">
            <button className="text-sm text-red-500 font-semibold hover:underline">Sign out of all other sessions</button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
