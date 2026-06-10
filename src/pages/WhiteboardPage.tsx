import { useState } from 'react'
import { Pen, Eraser, Square, Circle, Type, Trash2, Download, Undo2, Palette } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

type Tool = 'pen' | 'eraser' | 'rect' | 'circle' | 'text'

const COLORS = ['#1e293b', '#4b75ff', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ffffff']
const SIZES  = [2, 4, 8, 14]

export default function WhiteboardPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const sidebarUser = profileToSidebarUser(profile)

  const [tool,      setTool]      = useState<Tool>('pen')
  const [color,     setColor]     = useState('#1e293b')
  const [size,      setSize]      = useState(4)
  const [showPal,   setShowPal]   = useState(false)

  const TOOL_OPTS: { id: Tool; Icon: typeof Pen; label: string }[] = [
    { id: 'pen',    Icon: Pen,    label: 'Draw'     },
    { id: 'eraser', Icon: Eraser, label: 'Erase'    },
    { id: 'rect',   Icon: Square, label: 'Rectangle'},
    { id: 'circle', Icon: Circle, label: 'Circle'   },
    { id: 'text',   Icon: Type,   label: 'Text'     },
  ]

  return (
    <DashboardLayout
      activePage="live-classes"
      onNavigate={onNavigate}
      title="Whiteboard"
      subtitle="Interactive class whiteboard"
      user={sidebarUser}
    >
      <div className="flex flex-col gap-4">

        {/* Toolbar */}
        <div className="bg-surface rounded-card shadow-sm p-3 flex items-center gap-3 flex-wrap">

          {/* Tools */}
          <div className="flex gap-1">
            {TOOL_OPTS.map(t => (
              <button key={t.id} onClick={() => setTool(t.id)} title={t.label}
                className={`size-9 rounded-card flex items-center justify-center transition-colors ${tool === t.id ? 'bg-primary text-white' : 'text-muted hover:bg-canvas hover:text-foreground'}`}>
                <t.Icon size={16} />
              </button>
            ))}
          </div>

          <div className="w-px h-8 bg-black/10" />

          {/* Stroke size */}
          <div className="flex items-center gap-1.5">
            {SIZES.map(s => (
              <button key={s} onClick={() => setSize(s)}
                className={`flex items-center justify-center rounded-full transition-colors ${size === s ? 'bg-primary/20 border-2 border-primary' : 'hover:bg-canvas'}`}
                style={{ width: Math.max(18, s * 2 + 10), height: Math.max(18, s * 2 + 10) }}>
                <span className="rounded-full bg-foreground" style={{ width: s, height: s }} />
              </button>
            ))}
          </div>

          <div className="w-px h-8 bg-black/10" />

          {/* Color picker */}
          <div className="relative">
            <button onClick={() => setShowPal(!showPal)}
              className="size-9 rounded-card border-2 border-black/15 hover:border-primary transition-colors flex items-center justify-center gap-1">
              <span className="size-5 rounded-full" style={{ background: color }} />
              <Palette size={11} className="text-muted" />
            </button>
            {showPal && (
              <div className="absolute top-11 left-0 bg-surface rounded-card shadow-lg p-2 flex gap-1.5 z-20 border border-black/8">
                {COLORS.map(c => (
                  <button key={c} onClick={() => { setColor(c); setShowPal(false) }}
                    className={`size-7 rounded-full border-2 transition-all ${color === c ? 'border-primary scale-110' : 'border-black/15'}`}
                    style={{ background: c }} />
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-black/10" />

          {/* Actions */}
          <div className="flex gap-1 ml-auto">
            <button title="Undo" className="size-9 rounded-card text-muted hover:bg-canvas hover:text-foreground transition-colors flex items-center justify-center">
              <Undo2 size={16} />
            </button>
            <button title="Clear" className="size-9 rounded-card text-muted hover:bg-canvas hover:text-red-500 transition-colors flex items-center justify-center">
              <Trash2 size={16} />
            </button>
            <button title="Download" className="size-9 rounded-card text-muted hover:bg-canvas hover:text-primary transition-colors flex items-center justify-center">
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Canvas area */}
        <div
          className="bg-white rounded-card border-2 border-black/8 shadow-sm relative overflow-hidden"
          style={{ height: 'calc(100vh - 280px)', minHeight: 400 }}
        >
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#000" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Active tool indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            <span className="size-2 rounded-full" style={{ background: color }} />
            {TOOL_OPTS.find(t => t.id === tool)?.label} · Size {size}
          </div>

          <div className="absolute inset-0 flex items-center justify-center text-muted pointer-events-none">
            <p className="text-sm opacity-40">Canvas — drawing requires a touch/mouse input handler (PWA feature)</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
