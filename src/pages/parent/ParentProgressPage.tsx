import { ChevronLeft, ChevronDown } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

function LineChart() {
  const pts = [30, 55, 70, 58, 85, 95]
  const w = 280; const h = 80
  const max = 100
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w)
  const ys = pts.map(p => h - (p / max) * h)
  const polyline = xs.map((x, i) => `${x},${ys[i]}`).join(' ')
  const area = `0,${h} ${polyline} ${w},${h}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4b75ff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4b75ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#pg)" />
      <polyline points={polyline} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ParentProgressPage({ onNavigate }: Props) {
  return (
    <MobileLayout activePage="parent/progress" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-4">

        {/* Header row */}
        <div className="flex items-center justify-between mb-1">
          <button onClick={() => onNavigate('parent/home')}><ChevronLeft size={22} /></button>
          <button className="flex items-center gap-2 border border-black/12 rounded-full px-3 py-1.5">
            <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">👦</div>
            <div className="text-left">
              <p className="text-xs font-bold text-foreground leading-none">Daniel Johnson</p>
              <p className="text-[9px] text-muted">JSS2 A</p>
            </div>
            <ChevronDown size={12} className="text-muted" />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-primary mt-3 mb-1">Progress Tracking</h1>
        <p className="text-xs text-muted mb-5">Track your child's academic growth and performance trends.</p>

        {/* Academic Growth card */}
        <div className="bg-white border border-black/8 rounded-2xl p-4 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">Academic Growth</p>
            <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              Last 4 Months <ChevronDown size={10} />
            </button>
          </div>

          <div className="flex items-end gap-2 mb-1">
            <p className="text-3xl font-bold text-foreground">4.5</p>
            <p className="text-base text-muted mb-1">/5.0 GPA</p>
          </div>
          <div className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-4">
            +10% Improvement from last term
          </div>

          {/* Y-axis labels + chart */}
          <div className="flex gap-2 items-end">
            <div className="flex flex-col justify-between h-[80px] text-[9px] text-muted text-right pr-1">
              <span>4.5</span><span>4</span><span>3.5</span><span>3</span>
            </div>
            <div className="flex-1">
              <LineChart />
              <div className="flex justify-between mt-1">
                {['Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <span key={m} className="text-[9px] text-muted">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <p className="text-base font-bold text-foreground mb-3">Quick Stats</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'GPA',        value: '4.3',       sub: '↑ +0.4 from last term', color: 'bg-green-100 text-green-700' },
            { label: 'Rank',       value: '4th',        sub: 'Top 10% in class',      color: 'bg-blue-100 text-blue-700' },
            { label: 'Attendance', value: '4.3',       sub: '96% present',           color: 'bg-amber-100 text-amber-700' },
            { label: 'Conduct',    value: 'Excellent', sub: 'Consistent behaviour',  color: 'bg-purple-100 text-purple-700' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-black/6 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-muted">{s.label}</p>
                <div className={`size-8 rounded-xl ${s.color} flex items-center justify-center`}>
                  <span className="text-xs font-bold">{s.label.charAt(0)}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mb-0.5">{s.value}</p>
              <p className="text-[10px] text-muted">{s.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </MobileLayout>
  )
}
