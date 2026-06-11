import { useState } from 'react'
import { Download, Video, FileText, Wifi, WifiOff, Trash2, PlayCircle, HardDrive, RefreshCw, Settings2 } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }
type Tab   = 'videos' | 'pdfs'

const videos = [
  { title: 'Forces and Motion',           subject: 'Physics',     size: '142 MB', duration: '58 min', synced: true  },
  { title: 'Trigonometry Review',         subject: 'Mathematics', size: '118 MB', duration: '47 min', synced: true  },
  { title: 'Cell Division — Meiosis',     subject: 'Biology',     size: '160 MB', duration: '62 min', synced: false },
  { title: 'Essay Writing Workshop',      subject: 'English',     size: '98 MB',  duration: '44 min', synced: true  },
]

const pdfs = [
  { title: 'Physics Notes — Term 2',      subject: 'Physics',     size: '1.2 MB', pages: 24, synced: true  },
  { title: 'Maths Formula Sheet',         subject: 'Mathematics', size: '340 KB', pages: 6,  synced: true  },
  { title: 'Organic Chemistry Summary',  subject: 'Chemistry',   size: '890 KB', pages: 18, synced: false },
  { title: 'English Essay Guidelines',   subject: 'English',     size: '210 KB', pages: 4,  synced: true  },
]

const usedGB = 0.64
const totalGB = 5

export default function DownloadsPage({ onNavigate }: Props) {
  const [tab,    setTab]    = useState<Tab>('videos')
  const [online, setOnline] = useState(true)

  const pct = Math.round((usedGB / totalGB) * 100)

  return (
    <DashboardLayout activePage="downloads" onNavigate={onNavigate} title="Downloads & Offline" subtitle="Access your content without internet">
      <div className="max-w-[800px] flex flex-col gap-5">

        {/* Offline mode toggle */}
        <div className={`flex items-center justify-between gap-4 p-4 rounded-card border ${online ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center gap-3">
            {online ? <Wifi size={16} className="text-green-600 shrink-0" /> : <WifiOff size={16} className="text-amber-600 shrink-0" />}
            <div>
              <p className="text-sm font-semibold text-foreground">{online ? 'Online — synced' : 'Offline mode active'}</p>
              <p className="text-xs text-muted">{online ? 'All downloads are up to date.' : 'Showing only downloaded content.'}</p>
            </div>
          </div>
          <button
            onClick={() => setOnline(!online)}
            className={`w-10 h-5.5 rounded-full relative transition-colors ${online ? 'bg-green-500' : 'bg-amber-500'}`}
          >
            <span className={`absolute inset-y-[2px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${online ? 'left-[20px]' : 'left-[2px]'}`} />
          </button>
        </div>

        {/* Storage bar */}
        <div className="bg-surface rounded-card shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <HardDrive size={15} className="text-muted" /> Storage Used
            </p>
            <p className="text-sm font-bold text-foreground">{usedGB} GB / {totalGB} GB</p>
          </div>
          <div className="h-3 bg-black/8 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-muted">{pct}% used · {(totalGB - usedGB).toFixed(2)} GB free</p>
          <div className="flex gap-2 mt-4">
            <button onClick={() => onNavigate('storage-management')}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold text-muted border border-black/15 rounded-pill hover:border-primary hover:text-primary transition-colors">
              <Settings2 size={12} /> Manage storage
            </button>
            <button onClick={() => onNavigate('offline-sync')}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-pill hover:bg-amber-100 transition-colors">
              <RefreshCw size={12} /> Sync status
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-canvas rounded-pill p-1 w-fit">
          {(['videos', 'pdfs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`h-9 px-5 rounded-full text-sm font-semibold capitalize transition-colors ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}
            >
              {t === 'videos' ? `Videos (${videos.length})` : `PDFs & Notes (${pdfs.length})`}
            </button>
          ))}
        </div>

        {/* Content list */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="divide-y divide-black/4">
            {(tab === 'videos' ? videos : pdfs).map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className={`size-10 rounded-card flex items-center justify-center shrink-0 ${tab === 'videos' ? 'bg-primary/10' : 'bg-amber-50'}`}>
                  {tab === 'videos' ? <Video size={16} className="text-primary" /> : <FileText size={16} className="text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted">
                    {item.subject} · {item.size} ·{' '}
                    {'duration' in item ? item.duration : `${item.pages} pages`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!item.synced && (
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <WifiOff size={9} /> Pending sync
                    </span>
                  )}
                  {tab === 'videos' && (
                    <button onClick={() => onNavigate('m/lesson')} className="size-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <PlayCircle size={14} className="text-primary" />
                    </button>
                  )}
                  <button className="size-8 rounded-full bg-canvas flex items-center justify-center hover:bg-red-50 transition-colors">
                    <Trash2 size={13} className="text-muted hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download more */}
        <button
          onClick={() => onNavigate('courses')}
          className="flex items-center justify-center gap-2 h-12 border-2 border-dashed border-black/15 rounded-card text-sm font-semibold text-muted hover:border-primary hover:text-primary transition-colors"
        >
          <Download size={16} /> Download more content
        </button>
      </div>
    </DashboardLayout>
  )
}
