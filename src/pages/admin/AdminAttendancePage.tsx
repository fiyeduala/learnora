import { useState } from 'react'
import { Users, ChevronDown, Search, Download, TrendingDown, CheckCircle2, XCircle, Clock } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const classData = [
  { id: 'SS1A', level: 'SS1', arm: 'A', teacher: 'Mrs Nnduka Kisha',  total: 32, present: 30, absent: 2,  late: 0, rate: 94 },
  { id: 'SS1B', level: 'SS1', arm: 'B', teacher: 'Mr Daniel Johnson', total: 30, present: 27, absent: 2,  late: 1, rate: 90 },
  { id: 'SS2A', level: 'SS2', arm: 'A', teacher: 'Mrs Gloria Ewa',    total: 29, present: 25, absent: 3,  late: 1, rate: 86 },
  { id: 'SS2B', level: 'SS2', arm: 'B', teacher: 'Mr Boris Johnson',  total: 28, present: 24, absent: 4,  late: 0, rate: 86 },
  { id: 'SS3A', level: 'SS3', arm: 'A', teacher: 'Mrs Elena Bright',  total: 31, present: 28, absent: 2,  late: 1, rate: 90 },
  { id: 'SS3B', level: 'SS3', arm: 'B', teacher: 'Unassigned',        total: 27, present: 20, absent: 7,  late: 0, rate: 74 },
  { id: 'JSS1', level: 'JSS1',arm: 'A', teacher: 'Mr Emeka Eze',      total: 35, present: 33, absent: 2,  late: 0, rate: 94 },
]

const studentRecords = [
  { name: 'Olive Princely',    class: 'SS1A', present: 48, absent: 2,  late: 1, rate: 94, status: 'Good'     },
  { name: 'Yetunde Adesanya',  class: 'SS1A', present: 50, absent: 0,  late: 0, rate: 100,'status': 'Excellent'},
  { name: 'Kofi Asante',       class: 'SS1A', present: 36, absent: 14, late: 0, rate: 72, status: 'At Risk'  },
  { name: 'Moses Yakubu',      class: 'SS2A', present: 30, absent: 20, late: 0, rate: 60, status: 'Critical' },
  { name: 'Sandra Ogbu',       class: 'SS2B', present: 45, absent: 5,  late: 0, rate: 90, status: 'Good'     },
  { name: 'Kemi Williams',     class: 'SS3A', present: 38, absent: 12, late: 2, rate: 76, status: 'Warning'  },
]

const statusStyle: Record<string, string> = {
  Excellent: 'bg-green-50 text-green-700',
  Good:      'bg-primary/10 text-primary',
  Warning:   'bg-amber-50 text-amber-700',
  'At Risk': 'bg-orange-50 text-orange-600',
  Critical:  'bg-red-50 text-red-600',
}

const terms = ['Term 1, 2025/2026', 'Term 2, 2025/2026', 'Term 3, 2024/2025']

export default function AdminAttendancePage({ onNavigate }: Props) {
  const [tab,    setTab]    = useState<'overview' | 'students'>('overview')
  const [term,   setTerm]   = useState(terms[0])
  const [search, setSearch] = useState('')

  const totalPresent = classData.reduce((s, c) => s + c.present, 0)
  const totalStudents = classData.reduce((s, c) => s + c.total, 0)
  const schoolRate = Math.round((totalPresent / totalStudents) * 100)
  const atRisk = studentRecords.filter(s => s.rate < 75).length

  const filteredStudents = studentRecords.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout
      activePage="attendance"
      onNavigate={onNavigate}
      title="Attendance Records"
      subtitle="School-wide attendance by class and student"
      nav={adminNav}
      user={{ name: 'Admin Okafor', role: 'School Admin', initials: 'A' }}
    >
      <div className="max-w-[1200px] flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'School Average',   value: `${schoolRate}%`, icon: CheckCircle2,  color: 'text-green-600 bg-green-50'   },
            { label: 'Total Students',   value: totalStudents,    icon: Users,         color: 'text-primary bg-primary/10'   },
            { label: 'Present Today',    value: totalPresent,     icon: CheckCircle2,  color: 'text-green-600 bg-green-50'   },
            { label: 'At Risk (<75%)',   value: atRisk,           icon: TrendingDown,  color: 'text-red-600 bg-red-50'       },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-surface rounded-card shadow-sm p-5">
                <div className={`size-9 rounded-full flex items-center justify-center mb-2 ${s.color}`}>
                  <Icon size={16} />
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted mt-0.5">{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tab toggle */}
          <div className="flex gap-1 bg-canvas rounded-card p-1">
            {(['overview', 'students'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 h-9 text-sm font-semibold rounded-md transition-colors capitalize ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}
              >
                {t === 'overview' ? 'By Class' : 'By Student'}
              </button>
            ))}
          </div>

          {/* Term filter */}
          <div className="relative">
            <select value={term} onChange={e => setTerm(e.target.value)}
              className="h-10 pl-4 pr-8 border border-black/15 rounded-input text-sm text-foreground bg-white outline-none focus:border-primary appearance-none">
              {terms.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>

          {tab === 'students' && (
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search student or class..."
                className="w-full h-10 pl-9 pr-4 border border-black/15 rounded-input text-sm outline-none focus:border-primary" />
            </div>
          )}

          <button className="flex items-center gap-1.5 h-10 px-4 border border-black/15 rounded-pill text-sm text-muted hover:text-foreground hover:border-primary transition-colors ml-auto">
            <Download size={13} /> Export
          </button>
        </div>

        {/* ── By Class ── */}
        {tab === 'overview' && (
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-black/6 bg-canvas/40">
                    {['Class', 'Form Teacher', 'Total', 'Present', 'Absent', 'Late', 'Rate', 'Action'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/4">
                  {classData.map(c => (
                    <tr key={c.id} className="hover:bg-canvas/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-foreground">{c.id}</span>
                        <span className="text-xs text-muted ml-2">{c.level}</span>
                      </td>
                      <td className="px-5 py-3.5 text-muted text-xs">{c.teacher}</td>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{c.total}</td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1 text-green-600 font-semibold">
                          <CheckCircle2 size={12} /> {c.present}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1 text-red-500 font-semibold">
                          <XCircle size={12} /> {c.absent}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1 text-amber-600 font-semibold">
                          <Clock size={12} /> {c.late}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-canvas rounded-full min-w-[60px]">
                            <div className={`h-full rounded-full ${c.rate >= 90 ? 'bg-green-500' : c.rate >= 80 ? 'bg-primary' : c.rate >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${c.rate}%` }} />
                          </div>
                          <span className={`text-xs font-bold ${c.rate >= 90 ? 'text-green-600' : c.rate >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{c.rate}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => onNavigate('admin-attendance')}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── By Student ── */}
        {tab === 'students' && (
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-black/6 bg-canvas/40">
                    {['Student', 'Class', 'Present', 'Absent', 'Late', 'Rate', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/4">
                  {filteredStudents.map((s, i) => (
                    <tr key={i} className="hover:bg-canvas/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {s.name.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted text-xs font-semibold">{s.class}</td>
                      <td className="px-5 py-3.5 text-green-600 font-semibold">{s.present}</td>
                      <td className="px-5 py-3.5 text-red-500 font-semibold">{s.absent}</td>
                      <td className="px-5 py-3.5 text-amber-600 font-semibold">{s.late}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-bold ${s.rate >= 90 ? 'text-green-600' : s.rate >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{s.rate}%</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[s.status]}`}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted">No students match your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
