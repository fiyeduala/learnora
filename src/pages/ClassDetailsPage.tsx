import { useState } from 'react'
import { Users, BookOpen, BarChart2, Plus, ChevronLeft } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type Tab = 'roster' | 'content' | 'analytics'

const roster = [
  { name: 'Olive Princely',    id: 'GFA-001', avg: 88, attendance: '95%', status: 'Active'   },
  { name: 'Yetunde Adesanya',  id: 'GFA-002', avg: 79, attendance: '88%', status: 'Active'   },
  { name: 'Fatima Al-Rashid',  id: 'GFA-003', avg: 94, attendance: '98%', status: 'Active'   },
  { name: 'Kofi Asante',       id: 'GFA-004', avg: 65, attendance: '72%', status: 'At Risk'  },
  { name: 'James Owusu',       id: 'GFA-005', avg: 71, attendance: '80%', status: 'Active'   },
]

const content = [
  { title: 'Module 1: Introduction',      lessons: 4, done: true  },
  { title: 'Module 2: Mechanics',         lessons: 5, done: false },
  { title: 'Module 3: Energy & Work',     lessons: 4, done: false },
  { title: 'Module 4: Waves & Sound',     lessons: 6, done: false },
]

export default function ClassDetailsPage({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('roster')

  return (
    <DashboardLayout
      activePage="classes"
      onNavigate={onNavigate}
      title="Class Details"
      subtitle="Physics 101 — SS1A · 32 students"
      nav={teacherNav}
      user={{ name: 'Daniel Johnson', role: 'Teacher', initials: 'D' }}
    >
      <div className="max-w-[1100px] flex flex-col gap-6">

        <button onClick={() => onNavigate('classes')} className="flex items-center gap-2 text-sm text-muted hover:text-foreground w-fit">
          <ChevronLeft size={16} /> Back to Classes
        </button>

        {/* Class hero */}
        <div className="bg-surface rounded-card shadow-sm p-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-card bg-primary/10 text-primary text-2xl font-bold flex items-center justify-center">P</div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Physics 101</h1>
              <p className="text-sm text-muted">SS1A · 32 students · 68% average progress</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => onNavigate('create-assessment')} className="flex items-center gap-2 h-10 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors">
              <Plus size={13} /> Add Content
            </button>
            <button onClick={() => onNavigate('attendance')} className="h-10 px-4 border border-black/20 text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
              Take Attendance
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-canvas rounded-card p-1 w-fit">
          {([
            { key: 'roster',    icon: Users,    label: 'Class Roster'  },
            { key: 'content',   icon: BookOpen, label: 'Course Content' },
            { key: 'analytics', icon: BarChart2,label: 'Analytics'      },
          ] as { key: Tab; icon: typeof Users; label: string }[]).map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 h-9 text-sm font-semibold rounded-md transition-colors ${
                  tab === t.key ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'
                }`}
              >
                <Icon size={14} />{t.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {tab === 'roster' && (
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/6 bg-canvas/40">
                    {['Student', 'ID', 'Avg Score', 'Attendance', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roster.map((s, i) => (
                    <tr key={i} className="border-b border-black/4 last:border-0 hover:bg-canvas/40 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{s.name.charAt(0)}</div>
                          <span className="font-medium text-foreground">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-muted">{s.id}</td>
                      <td className="px-6 py-3.5">
                        <span className={`font-semibold ${s.avg >= 80 ? 'text-green-600' : s.avg >= 65 ? 'text-amber-600' : 'text-red-500'}`}>{s.avg}%</span>
                      </td>
                      <td className="px-6 py-3.5 text-muted">{s.attendance}</td>
                      <td className="px-6 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-xs ${
                          s.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                        }`}>{s.status}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <button onClick={() => onNavigate('student-profile')} className="text-xs text-primary font-semibold hover:underline">View Profile</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'content' && (
          <div className="flex flex-col gap-3">
            {content.map((mod, i) => (
              <div key={i} className="bg-surface rounded-card shadow-sm p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`size-9 rounded-card flex items-center justify-center ${mod.done ? 'bg-green-50' : 'bg-primary/10'}`}>
                    <BookOpen size={16} className={mod.done ? 'text-green-600' : 'text-primary'} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{mod.title}</p>
                    <p className="text-xs text-muted">{mod.lessons} lessons</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-xs ${mod.done ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {mod.done ? 'Published' : 'Draft'}
                  </span>
                  <button className="text-xs text-primary font-semibold hover:underline">Edit</button>
                </div>
              </div>
            ))}
            <button onClick={() => onNavigate('course-builder')} className="flex items-center gap-2 h-11 px-5 border-2 border-dashed border-black/20 rounded-card text-sm font-semibold text-muted hover:border-primary hover:text-primary transition-colors w-fit">
              <Plus size={14} /> Add Module
            </button>
          </div>
        )}

        {tab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              { label: 'Class Average',   value: '74%', sub: '+3% from last term',    color: 'text-primary'   },
              { label: 'Highest Score',   value: '97%', sub: 'Fatima Al-Rashid',      color: 'text-green-600' },
              { label: 'Lowest Score',    value: '48%', sub: 'Kofi Asante',           color: 'text-red-500'   },
              { label: 'Attendance Rate', value: '87%', sub: '3 students at risk',    color: 'text-amber-600' },
            ].map(s => (
              <div key={s.label} className="bg-surface rounded-card shadow-sm p-6">
                <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-sm font-semibold text-foreground mt-1">{s.label}</p>
                <p className="text-xs text-muted mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
