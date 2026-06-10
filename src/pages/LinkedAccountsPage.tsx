import { useState } from 'react'
import { CheckCircle2, Link, Unlink, Info } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

interface LinkedAccount {
  id:        string
  name:      string
  icon:      string
  connected: boolean
  email?:    string
}

const PROVIDERS: LinkedAccount[] = [
  { id: 'google',    name: 'Google',    icon: '🔵', connected: false },
  { id: 'microsoft', name: 'Microsoft', icon: '🟦', connected: false },
  { id: 'apple',     name: 'Apple',     icon: '⚫', connected: false },
]

export default function LinkedAccountsPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const sidebarUser = profileToSidebarUser(profile)
  const [accounts, setAccounts] = useState<LinkedAccount[]>(PROVIDERS)

  function toggle(id: string) {
    setAccounts(prev => prev.map(a =>
      a.id === id
        ? { ...a, connected: !a.connected, email: !a.connected ? profile?.email ?? undefined : undefined }
        : a
    ))
  }

  return (
    <DashboardLayout
      activePage="settings"
      onNavigate={onNavigate}
      title="Linked Accounts"
      subtitle="Connect third-party accounts to sign in easily"
      user={sidebarUser}
    >
      <div className="max-w-[640px] flex flex-col gap-5">

        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-black/6">
            <p className="text-xs font-bold text-muted uppercase tracking-wider">Social sign-in providers</p>
          </div>
          <div className="divide-y divide-black/4">
            {accounts.map(a => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-4">
                <div className="size-11 rounded-full bg-canvas flex items-center justify-center text-xl shrink-0">
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{a.name}</p>
                  {a.connected && a.email
                    ? <p className="text-xs text-muted mt-0.5">{a.email}</p>
                    : <p className="text-xs text-muted mt-0.5">Not connected</p>
                  }
                </div>
                <button onClick={() => toggle(a.id)}
                  className={`flex items-center gap-1.5 h-8 px-4 rounded-pill text-xs font-semibold border transition-colors ${
                    a.connected
                      ? 'border-red-200 text-red-500 hover:bg-red-50'
                      : 'border-primary/30 text-primary hover:bg-primary/5'
                  }`}
                >
                  {a.connected ? <><Unlink size={11} /> Unlink</> : <><Link size={11} /> Connect</>}
                </button>
                {a.connected && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="bg-surface rounded-card shadow-sm p-5">
          <div className="flex items-start gap-3">
            <Info size={16} className="text-muted mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">SSO / Social login</p>
              <p className="text-xs text-muted leading-relaxed">
                Linking an account lets you sign in to Learnora using that provider. Your Learnora data stays separate — linking does not merge accounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
