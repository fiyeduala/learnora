import { useState } from 'react'
import { Users, BookOpen, BarChart2, Plus, ChevronLeft } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

type Tab = 'roster' | 'content' | 'analytics'

type RosterEntry  = { name: string; id: string; avg: number; attendance: string; status: string }
type ContentEntry = { title: string; lessons: number; done: boolean }

const roster: RosterEntry[] = []

const content: ContentEntry[] = []

export default function ClassDetailsPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [tab, setTab] = useState<Tab>('roster')

  return (
    <DashboardLayout
      activePage="classes"
      onNavigate={onNavigate}
      title="Class Details"
      subtitle="Physics 101 — SS1A · 32 students"
      nav={teacherNav}
      user={profileToSidebarUser(profile)}
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
                  {roster.length === 0
                    ? <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-muted">No data yet.</td></tr>
                    : roster.map((s, i) => (
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
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'content' && (
          <div className="flex flex-col gap-3">
            {content.length === 0
              ? <div className="py-8 text-center text-sm text-muted">No data yet.</div>
              : content.map((mod, i) => (
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
              ))
            }
            <button onClick={() => onNavigate('course-builder')} className="flex items-center gap-2 h-11 px-5 border-2 border-dashed border-black/20 rounded-card text-sm font-semibold text-muted hover:border-primary hover:text-primary transition-colors w-fit">
              <Plus size={14} /> Add Module
            </button>
          </div>
        )}

        {tab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              { label: 'Class Average',   value: '—', sub: 'No data yet.', color: 'text-primary'   },
              { label: 'Highest Score',   value: '—', sub: 'No data yet.', color: 'text-green-600' },
              { label: 'Lowest Score',    value: '—', sub: 'No data yet.', color: 'text-red-500'   },
              { label: 'Attendance Rate', value: '—', sub: 'No data yet.', color: 'text-amber-600' },
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
