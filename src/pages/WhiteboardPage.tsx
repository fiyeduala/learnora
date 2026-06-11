import { useState, useRef, useEffect } from 'react'
import { Pen, Eraser, Square, Circle, Type, Trash2, Download, Undo2, Palette } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }
type Tool  = 'pen' | 'eraser' | 'rect' | 'circle' | 'text'

const COLORS = ['#1e293b', '#4b75ff', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ffffff']
const SIZES  = [2, 4, 8, 14]

const TOOL_OPTS: { id: Tool; Icon: typeof Pen; label: string; cursor: string }[] = [
  { id: 'pen',    Icon: Pen,    label: 'Draw',      cursor: 'crosshair' },
  { id: 'eraser', Icon: Eraser, label: 'Erase',     cursor: 'cell'      },
  { id: 'rect',   Icon: Square, label: 'Rectangle', cursor: 'crosshair' },
  { id: 'circle', Icon: Circle, label: 'Circle',    cursor: 'crosshair' },
  { id: 'text',   Icon: Type,   label: 'Text',      cursor: 'text'      },
]

export default function WhiteboardPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const sidebarUser = profileToSidebarUser(profile)

  const [tool,    setTool]    = useState<Tool>('pen')
  const [color,   setColor]   = useState('#1e293b')
  const [size,    setSize]    = useState(4)
  const [showPal, setShowPal] = useState(false)

  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const drawing      = useRef(false)
  const startXY      = useRef({ x: 0, y: 0 })
  const snapRef      = useRef<ImageData | null>(null)
  const history      = useRef<ImageData[]>([])

  // Keep live refs so event handlers always see latest state
  const toolRef  = useRef(tool)
  const colorRef = useRef(color)
  const sizeRef  = useRef(size)
  useEffect(() => { toolRef.current  = tool  }, [tool])
  useEffect(() => { colorRef.current = color }, [color])
  useEffect(() => { sizeRef.current  = size  }, [size])

  // Initialise canvas once after mount
  useEffect(() => {
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    canvas.width  = container.clientWidth
    canvas.height = container.clientHeight
    const c = canvas.getContext('2d')
    if (!c) return
    c.lineCap   = 'round'
    c.lineJoin  = 'round'
    c.fillStyle = '#ffffff'
    c.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  function getCtx() { return canvasRef.current?.getContext('2d') ?? null }

  function getXY(e: React.MouseEvent | React.TouchEvent) {
    const rect = canvasRef.current!.getBoundingClientRect()
    if ('touches' in e) {
      // changedTouches is reliable for touchend (touches list is empty on end)
      const t = e.touches[0] ?? e.changedTouches[0]
      if (!t) return { x: 0, y: 0 }
      return { x: t.clientX - rect.left, y: t.clientY - rect.top }
    }
    const me = e as React.MouseEvent
    return { x: me.clientX - rect.left, y: me.clientY - rect.top }
  }

  function pushHistory() {
    const canvas = canvasRef.current
    const ctx    = getCtx()
    if (!canvas || !ctx) return
    history.current = [...history.current.slice(-24), ctx.getImageData(0, 0, canvas.width, canvas.height)]
  }

  function onDown(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    drawing.current = true
    const pos = getXY(e)
    startXY.current = pos
    pushHistory()
    const ctx = getCtx()
    if (!ctx) return
    ctx.strokeStyle = toolRef.current === 'eraser' ? '#ffffff' : colorRef.current
    ctx.lineWidth   = sizeRef.current
    if (toolRef.current === 'pen' || toolRef.current === 'eraser') {
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
    } else if (toolRef.current === 'rect' || toolRef.current === 'circle') {
      const canvas = canvasRef.current!
      snapRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
    }
  }

  function onMove(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    if (!drawing.current) return
    const ctx = getCtx()
    if (!ctx) return
    const pos = getXY(e)
    const t   = toolRef.current

    if (t === 'pen' || t === 'eraser') {
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else if ((t === 'rect' || t === 'circle') && snapRef.current) {
      const canvas = canvasRef.current!
      ctx.putImageData(snapRef.current, 0, 0)
      ctx.strokeStyle = colorRef.current
      ctx.lineWidth   = sizeRef.current
      ctx.beginPath()
      const { x: sx, y: sy } = startXY.current
      const w = pos.x - sx, h = pos.y - sy
      if (t === 'rect') {
        ctx.strokeRect(sx, sy, w, h)
      } else {
        ctx.ellipse(sx + w / 2, sy + h / 2, Math.abs(w) / 2, Math.abs(h) / 2, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
  }

  function onUp(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing.current) return
    drawing.current = false
    if (toolRef.current === 'text') {
      const pos  = getXY(e)
      const text = window.prompt('Enter text:')
      if (text) {
        const ctx = getCtx()
        if (ctx) {
          ctx.font      = `${sizeRef.current * 4 + 10}px sans-serif`
          ctx.fillStyle = colorRef.current
          ctx.fillText(text, pos.x, pos.y)
        }
      }
    }
    snapRef.current = null
    getCtx()?.beginPath()
  }

  function undo() {
    const ctx    = getCtx()
    const canvas = canvasRef.current
    if (!ctx || !canvas || history.current.length === 0) return
    const prev = history.current[history.current.length - 1]
    history.current = history.current.slice(0, -1)
    ctx.putImageData(prev, 0, 0)
  }

  function clear() {
    const ctx    = getCtx()
    const canvas = canvasRef.current
    if (!ctx || !canvas) return
    pushHistory()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  function download() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link    = document.createElement('a')
    link.download = 'whiteboard.png'
    link.href     = canvas.toDataURL('image/png')
    link.click()
  }

  const activeTool = TOOL_OPTS.find(t => t.id === tool)!

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
                className={`size-9 rounded-card flex items-center justify-center transition-colors
                  ${tool === t.id ? 'bg-primary text-white' : 'text-muted hover:bg-canvas hover:text-foreground'}`}>
                <t.Icon size={16} />
              </button>
            ))}
          </div>

          <div className="w-px h-8 bg-black/10" />

          {/* Stroke sizes */}
          <div className="flex items-center gap-1.5">
            {SIZES.map(s => (
              <button key={s} onClick={() => setSize(s)}
                className={`flex items-center justify-center rounded-full transition-colors
                  ${size === s ? 'bg-primary/20 border-2 border-primary' : 'hover:bg-canvas'}`}
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
              <span className="size-5 rounded-full border border-black/15" style={{ background: color }} />
              <Palette size={11} className="text-muted" />
            </button>
            {showPal && (
              <div className="absolute top-11 left-0 bg-surface rounded-card shadow-lg p-2 flex gap-1.5 z-20 border border-black/8">
                {COLORS.map(c => (
                  <button key={c} onClick={() => { setColor(c); setShowPal(false) }}
                    className={`size-7 rounded-full border-2 transition-all ${color === c ? 'border-primary scale-110' : 'border-black/20'}`}
                    style={{ background: c }} />
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-black/10" />

          {/* Actions */}
          <div className="flex gap-1 ml-auto">
            <button onClick={undo} title="Undo"
              className="size-9 rounded-card text-muted hover:bg-canvas hover:text-foreground transition-colors flex items-center justify-center">
              <Undo2 size={16} />
            </button>
            <button onClick={clear} title="Clear"
              className="size-9 rounded-card text-muted hover:bg-canvas hover:text-red-500 transition-colors flex items-center justify-center">
              <Trash2 size={16} />
            </button>
            <button onClick={download} title="Download as PNG"
              className="size-9 rounded-card text-muted hover:bg-canvas hover:text-primary transition-colors flex items-center justify-center">
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Canvas container */}
        <div
          ref={containerRef}
          className="bg-white rounded-card border-2 border-black/8 shadow-sm relative overflow-hidden select-none"
          style={{ height: 'calc(100vh - 280px)', minHeight: 400 }}
        >
          {/* Grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wb-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#000" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wb-grid)" />
          </svg>

          {/* Actual drawing canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ cursor: activeTool.cursor, touchAction: 'none' }}
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
            onTouchStart={onDown}
            onTouchMove={onMove}
            onTouchEnd={onUp}
          />

          {/* HUD */}
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full pointer-events-none">
            <span className="size-2 rounded-full border border-white/30" style={{ background: color }} />
            {activeTool.label} · {size}px
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
