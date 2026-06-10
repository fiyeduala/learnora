import { useState } from 'react'
import { WifiOff, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

type SyncStatus = 'pending' | 'synced' | 'failed'

interface SyncItem {
  id:      string
  label:   string
  type:    string
  status:  SyncStatus
  size:    string
}

const MOCK_ITEMS: SyncItem[] = [
  { id: '1', label: 'Lesson notes — Physics Term 2',     type: 'Notes',       status: 'pending', size: '12 KB'  },
  { id: '2', label: 'Assignment submission — Chemistry', type: 'Submission',  status: 'pending', size: '340 KB' },
  { id: '3', label: 'Forum post — Maths discussion',    type: 'Forum',       status: 'failed',  size: '2 KB'   },
  { id: '4', label: 'Goal update — Term 2 goals',       type: 'Goals',       status: 'synced',  size: '1 KB'   },
  { id: '5', label: 'Quiz result — Biology Chapter 4',  type: 'Assessment',  status: 'synced',  size: '4 KB'   },
]

const STATUS_META: Record<SyncStatus, { label: string; color: string; Icon: typeof CheckCircle2 }> = {
  pending: { label: 'Pending',  color: 'text-amber-600 bg-amber-50',  Icon: Clock          },
  synced:  { label: 'Synced',   color: 'text-green-600 bg-green-50',  Icon: CheckCircle2   },
  failed:  { label: 'Failed',   color: 'text-red-500 bg-red-50',      Icon: AlertCircle    },
}

export default function OfflineSyncPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const sidebarUser = profileToSidebarUser(profile)

  const [items, setItems]     = useState<SyncItem[]>(MOCK_ITEMS)
  const [syncing, setSyncing] = useState(false)

  const pending = items.filter(i => i.status === 'pending').length
  const failed  = items.filter(i => i.status === 'failed').length

  function syncAll() {
    setSyncing(true)
    setTimeout(() => {
      setItems(prev => prev.map(i => ({ ...i, status: 'synced' as SyncStatus })))
      setSyncing(false)
    }, 2000)
  }

  function retryFailed() {
    setItems(prev => prev.map(i => i.status === 'failed' ? { ...i, status: 'synced' as SyncStatus } : i))
  }

  return (
    <DashboardLayout
      activePage="downloads"
      onNavigate={onNavigate}
      title="Offline Sync"
      subtitle="Items waiting to sync when you're back online"
      user={sidebarUser}
    >
      <div className="max-w-[680px] flex flex-col gap-5">

        {/* Status banner */}
        <div className="flex items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-200 rounded-card">
          <div className="flex items-center gap-3">
            <WifiOff size={18} className="text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-800">Offline mode</p>
              <p className="text-xs text-amber-700 mt-0.5">
                {pending} pending · {failed} failed · Connect to sync
              </p>
            </div>
          </div>
          <button onClick={syncAll} disabled={syncing || (pending === 0 && failed === 0)}
            className="flex items-center gap-1.5 h-9 px-4 bg-amber-600 text-white text-xs font-bold rounded-pill hover:bg-amber-700 transition-colors disabled:opacity-40 shrink-0">
            <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing…' : 'Sync now'}
          </button>
        </div>

        {/* Retry failed */}
        {failed > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-card p-3 flex items-center justify-between">
            <p className="text-xs text-red-700 font-semibold">{failed} item{failed > 1 ? 's' : ''} failed to sync</p>
            <button onClick={retryFailed} className="text-xs text-red-600 font-bold hover:underline">
              Retry all
            </button>
          </div>
        )}

        {/* Sync queue */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-black/6">
            <p className="text-xs font-bold text-muted uppercase tracking-wider">Sync queue — {items.length} items</p>
          </div>
          <div className="divide-y divide-black/4">
            {items.map(item => {
              const { label, color, Icon } = STATUS_META[item.status]
              return (
                <div key={item.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.label}</p>
                    <p className="text-xs text-muted mt-0.5">{item.type} · {item.size}</p>
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${color}`}>
                    <Icon size={10} /> {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
