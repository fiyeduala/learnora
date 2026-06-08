import { useState } from 'react'
import { Bell, Settings, ChevronRight, AlertCircle, ChevronDown } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

const children = [
  {
    id:        1,
    name:      'Olive Princely Ashuma',
    class:     'SS1A',
    emoji:     '👦',
    gpa:       '4.2',
    attend:    '96%',
    rank:      '7th',
    conduct:   'Excellent',
    feeOwed:   true,
    feeAmt:    '₦17,500',
    feeDue:    'Jun 30, 2026',
    performance: [
      { subject: 'Overall CGPA', grade: '4.2', stars: 4, label: 'Excellent', color: 'bg-blue-50',   pct: 0  },
      { subject: 'Mathematics',  grade: 'A',   stars: 0, label: '98%',       color: 'bg-green-50',  pct: 98 },
      { subject: 'English',      grade: 'B',   stars: 0, label: '75%',       color: 'bg-amber-50',  pct: 75 },
      { subject: 'Government',   grade: 'C',   stars: 0, label: '65%',       color: 'bg-purple-50', pct: 65 },
    ],
  },
  {
    id:        2,
    name:      'Tobi Princely Ashuma',
    class:     'JSS2B',
    emoji:     '👧',
    gpa:       '3.8',
    attend:    '91%',
    rank:      '12th',
    conduct:   'Good',
    feeOwed:   false,
    feeAmt:    '',
    feeDue:    '',
    performance: [
      { subject: 'Overall CGPA', grade: '3.8', stars: 4, label: 'Good',    color: 'bg-blue-50',   pct: 0  },
      { subject: 'Mathematics',  grade: 'B+',  stars: 0, label: '82%',     color: 'bg-green-50',  pct: 82 },
      { subject: 'English',      grade: 'A',   stars: 0, label: '91%',     color: 'bg-amber-50',  pct: 91 },
      { subject: 'Government',   grade: 'B',   stars: 0, label: '78%',     color: 'bg-purple-50', pct: 78 },
    ],
  },
]

const quickActions = [
  { label: 'Academic\nProgress', color: 'bg-red-100 text-red-600',    page: 'parent/progress',     emoji: '📊' },
  { label: 'Report\nCard',       color: 'bg-blue-100 text-blue-600',  page: 'parent/report-cards', emoji: '📄' },
  { label: 'Attendance',         color: 'bg-pink-100 text-pink-600',  page: 'parent/attendance',   emoji: '✅' },
  { label: 'Messages',           color: 'bg-green-100 text-green-600',page: 'parent/chat',         emoji: '💬' },
]

export default function ParentHomePage({ onNavigate }: Props) {
  const [selectedChild, setSelectedChild] = useState(0)
  const [pickerOpen,    setPickerOpen]    = useState(false)
  const child = children[selectedChild]

  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-6 pb-4">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted">Good Morning, <span className="font-bold text-foreground">Mr Olive</span></p>
            <p className="text-xs text-muted/70">Track your children's progress.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onNavigate('parent/notifications')}
              className="size-9 rounded-full border border-black/10 flex items-center justify-center">
              <Bell size={16} />
            </button>
            <button onClick={() => onNavigate('parent/profile')}
              className="size-9 rounded-full border border-black/10 flex items-center justify-center">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Child switcher */}
        <div className="relative mb-4">
          <button
            onClick={() => setPickerOpen(p => !p)}
            className="w-full flex items-center justify-between gap-2 h-10 px-4 bg-canvas border border-black/10 rounded-pill text-sm font-semibold text-foreground"
          >
            <span className="flex items-center gap-2">
              <span>{child.emoji}</span>
              <span>{child.name.split(' ')[0]}</span>
              <span className="text-xs text-muted font-normal">· {child.class}</span>
            </span>
            <ChevronDown size={14} className={`text-muted transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
          </button>
          {pickerOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setPickerOpen(false)} />
              <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white rounded-card shadow-xl border border-black/8 py-1.5 z-20">
                {children.map((c, i) => (
                  <button key={c.id} onClick={() => { setSelectedChild(i); setPickerOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${selectedChild === i ? 'bg-primary/5 text-primary' : 'hover:bg-canvas text-foreground'}`}>
                    <span className="text-lg">{c.emoji}</span>
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-xs text-muted">{c.class}</p>
                    </div>
                    {selectedChild === i && <span className="ml-auto text-xs font-bold text-primary">Active</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Child card */}
        <div className="bg-primary rounded-3xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-full bg-white/30 flex items-center justify-center text-xl">{child.emoji}</div>
            <div>
              <p className="text-sm font-bold text-white">{child.name}</p>
              <p className="text-xs text-white/70">{child.class} · Greenfield Academy</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'GPA',       value: child.gpa     },
              { label: 'Attendance',value: child.attend   },
              { label: 'Rank',      value: child.rank     },
              { label: 'Conduct',   value: child.conduct  },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-xs font-bold text-white truncate">{s.value}</p>
                <p className="text-[9px] text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-bold text-foreground">Quick Actions</p>
          <button className="text-xs text-primary font-medium">View All</button>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickActions.map(a => (
            <button key={a.label} onClick={() => onNavigate(a.page)} className="flex flex-col items-center gap-2">
              <div className={`size-14 rounded-2xl ${a.color} flex items-center justify-center`}>
                <span className="text-xl">{a.emoji}</span>
              </div>
              <p className="text-[10px] font-medium text-foreground text-center leading-tight whitespace-pre-line">{a.label}</p>
            </button>
          ))}
        </div>

        {/* Performance Overview */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-bold text-foreground">Performance Overview</p>
          <button className="text-xs text-primary font-medium" onClick={() => onNavigate('parent/progress')}>View All</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {child.performance.map((p, i) => (
            <button key={i} onClick={() => onNavigate('parent/progress')}
              className={`${p.color} rounded-2xl p-4 text-left`}>
              <p className="text-xs text-muted mb-1">{p.subject}</p>
              <p className="text-2xl font-bold text-foreground">{p.grade}</p>
              {p.stars > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <span key={si} className={`text-xs ${si < p.stars ? 'text-amber-400' : 'text-black/15'}`}>★</span>
                  ))}
                </div>
              )}
              {p.pct > 0 && (
                <div className="mt-2">
                  <div className="h-1.5 bg-black/8 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              )}
              <p className="text-xs text-muted mt-1">{p.label}</p>
            </button>
          ))}
        </div>

        {/* Fee alert — only show if child has outstanding fees */}
        {child.feeOwed && (
          <button onClick={() => onNavigate('parent/fees')}
            className="w-full mt-5 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5 text-left">
            <div className="size-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle size={17} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-800">Fee Payment Incomplete</p>
              <p className="text-xs text-amber-700">{child.feeAmt} outstanding · Due {child.feeDue}</p>
            </div>
            <ChevronRight size={15} className="text-amber-600 shrink-0" />
          </button>
        )}
        {!child.feeOwed && (
          <div className="w-full mt-5 flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3.5">
            <div className="size-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <span className="text-sm">✅</span>
            </div>
            <p className="text-sm font-semibold text-green-700">School fees fully paid for this term</p>
          </div>
        )}

      </div>
    </MobileLayout>
  )
}
