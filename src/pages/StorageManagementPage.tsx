import { useState } from 'react'
import { HardDrive, Trash2, Video, FileText, BookOpen, AlertCircle } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

interface StorageCategory {
  id:    string
  label: string
  mb:    number
  Icon:  typeof Video
  color: string
}

const MAX_MB = 5120 // 5 GB

export default function StorageManagementPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const sidebarUser = profileToSidebarUser(profile)

  const [categories, setCategories] = useState<StorageCategory[]>([
    { id: 'videos', label: 'Downloaded Videos', mb: 420, Icon: Video,    color: '#8b5cf6' },
    { id: 'pdfs',   label: 'PDF & Documents',   mb: 85,  Icon: FileText, color: '#ef4444' },
    { id: 'notes',  label: 'Notes & Flashcards', mb: 12,  Icon: BookOpen, color: '#f59e0b' },
  ])

  function clearCategory(id: string) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, mb: 0 } : c))
  }

  const usedMB  = categories.reduce((s, c) => s + c.mb, 0)
  const freeMB  = MAX_MB - usedMB
  const usedPct = Math.min(Math.round((usedMB / MAX_MB) * 100), 100)

  function fmt(mb: number) {
    return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`
  }

  return (
    <DashboardLayout
      activePage="downloads"
      onNavigate={onNavigate}
      title="Storage Management"
      subtitle="Manage your offline storage"
      user={sidebarUser}
    >
      <div className="max-w-[640px] flex flex-col gap-5">

        {/* Usage overview */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <HardDrive size={20} className="text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground">Device Storage</p>
              <p className="text-xs text-muted">{fmt(usedMB)} used of {fmt(MAX_MB)}</p>
            </div>
            <p className="ml-auto text-lg font-bold text-foreground">{usedPct}%</p>
          </div>
          <div className="h-3 bg-canvas rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${usedPct}%` }} />
          </div>
          <div className="flex justify-between mt-1.5 text-[11px] text-muted">
            <span>{fmt(usedMB)} used</span>
            <span>{fmt(freeMB)} free</span>
          </div>

          {usedPct > 80 && (
            <div className="flex items-center gap-2 mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-card p-3">
              <AlertCircle size={12} className="shrink-0" /> Storage is nearly full. Clear some downloads.
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-black/6">
            <p className="text-xs font-bold text-muted uppercase tracking-wider">By category</p>
          </div>
          <div className="divide-y divide-black/4">
            {categories.map(c => {
              const pct = MAX_MB > 0 ? Math.round((c.mb / MAX_MB) * 100) : 0
              const Icon = c.Icon
              return (
                <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="size-10 rounded-card flex items-center justify-center shrink-0" style={{ background: c.color + '15' }}>
                    <Icon size={16} style={{ color: c.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1.5">
                      <p className="text-sm font-semibold text-foreground">{c.label}</p>
                      <p className="text-xs text-muted">{fmt(c.mb)}</p>
                    </div>
                    <div className="h-1.5 bg-canvas rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                    </div>
                  </div>
                  <button onClick={() => clearCategory(c.id)}
                    disabled={c.mb === 0}
                    className="size-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors group disabled:opacity-30 shrink-0">
                    <Trash2 size={14} className="text-muted group-hover:text-red-500" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Clear all */}
        <div className="flex justify-end">
          <button onClick={() => setCategories(prev => prev.map(c => ({ ...c, mb: 0 })))}
            disabled={usedMB === 0}
            className="flex items-center gap-2 h-10 px-5 border border-red-200 text-red-500 text-sm font-semibold rounded-pill hover:bg-red-50 transition-colors disabled:opacity-30">
            <Trash2 size={13} /> Clear all downloads
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
