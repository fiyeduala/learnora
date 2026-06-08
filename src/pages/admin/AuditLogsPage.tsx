import { useState } from 'react'
import { Search, Shield, Download, User, Settings, FileText, Trash2, LogIn } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const logs = [
  { id: 1, user: 'Admin Okafor',     action: 'Invited 12 students via CSV',             module: 'Users',     time: 'Jun 6, 2026 · 14:32', type: 'create' },
  { id: 2, user: 'Admin Okafor',     action: 'Updated subscription plan to Growth',      module: 'Billing',   time: 'Jun 6, 2026 · 11:05', type: 'update' },
  { id: 3, user: 'Daniel Johnson',   action: 'Published Physics Course Builder',         module: 'Courses',   time: 'Jun 5, 2026 · 16:45', type: 'create' },
  { id: 4, user: 'Admin Okafor',     action: 'Deleted student account: Bello Adeyemi',  module: 'Users',     time: 'Jun 5, 2026 · 09:12', type: 'delete' },
  { id: 5, user: 'System',           action: 'Automated invoice generated for June',    module: 'Finance',   time: 'Jun 1, 2026 · 00:00', type: 'system' },
  { id: 6, user: 'Admin Okafor',     action: 'Logged in from 197.210.x.x',             module: 'Auth',      time: 'Jun 6, 2026 · 08:30', type: 'login'  },
  { id: 7, user: 'Mrs Oluwaseun',    action: 'Updated class roster for SS2A',           module: 'Classes',   time: 'Jun 4, 2026 · 13:22', type: 'update' },
  { id: 8, user: 'Admin Okafor',     action: 'Changed notification settings',           module: 'Settings',  time: 'Jun 3, 2026 · 15:10', type: 'update' },
]

const typeStyle: Record<string, { color: string; Icon: typeof Shield }> = {
  create: { color: 'bg-green-50 text-green-600', Icon: FileText },
  update: { color: 'bg-primary/10 text-primary',  Icon: Settings },
  delete: { color: 'bg-red-50 text-red-500',      Icon: Trash2   },
  system: { color: 'bg-canvas text-muted',        Icon: Shield   },
  login:  { color: 'bg-amber-50 text-amber-600',  Icon: LogIn    },
}

export default function AuditLogsPage({ onNavigate }: Props) {
  const [query, setQuery] = useState('')

  const filtered = query
    ? logs.filter(l => l.action.toLowerCase().includes(query.toLowerCase()) || l.user.toLowerCase().includes(query.toLowerCase()))
    : logs

  return (
    <DashboardLayout
      activePage="settings"
      onNavigate={onNavigate}
      title="Audit Logs"
      subtitle="Full history of admin and system actions"
      nav={adminNav}
      user={{ name: 'Admin Okafor', role: 'School Admin', initials: 'A' }}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search actions or users..."
              className="w-full h-10 pl-10 pr-4 border border-black/20 rounded-pill text-sm outline-none focus:border-primary"
            />
          </div>
          <button className="flex items-center gap-2 h-10 px-4 border border-black/20 rounded-pill text-sm font-semibold text-foreground hover:bg-canvas transition-colors">
            <Download size={13} /> Export CSV
          </button>
        </div>

        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="divide-y divide-black/4">
            {filtered.map(log => {
              const { color, Icon } = typeStyle[log.type] ?? typeStyle.system
              return (
                <div key={log.id} className="flex items-start gap-4 px-6 py-4">
                  <div className={`size-9 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{log.action}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted flex-wrap">
                      <span className="flex items-center gap-1"><User size={10} /> {log.user}</span>
                      <span className="bg-canvas px-2 py-0.5 rounded-full">{log.module}</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted">
              <Shield size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No logs match your search</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
