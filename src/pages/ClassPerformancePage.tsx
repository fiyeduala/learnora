import { useState } from 'react'
import { Users, TrendingUp, Award, AlertCircle, BarChart2, ChevronDown } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const classes = ['SS2A', 'SS2B', 'SS1A']
const subjects = ['Mathematics', 'Physics', 'English Language']

const students = [
  { name: 'Emeka Okafor',   score: 92, attendance: '96%', trend: 'up',   flag: null          },
  { name: 'Aisha Bello',    score: 88, attendance: '94%', trend: 'up',   flag: null          },
  { name: 'Chidi Nwosu',    score: 81, attendance: '90%', trend: 'flat', flag: null          },
  { name: 'Fatima Garba',   score: 79, attendance: '88%', trend: 'up',   flag: null          },
  { name: 'Tobi Adeyemi',   score: 73, attendance: '85%', trend: 'flat', flag: null          },
  { name: 'Kemi Williams',  score: 68, attendance: '80%', trend: 'down', flag: 'Declining'   },
  { name: 'Daniel Aliyu',   score: 61, attendance: '75%', trend: 'down', flag: 'At Risk'     },
  { name: 'Blessing Eze',   score: 55, attendance: '70%', trend: 'down', flag: 'At Risk'     },
  { name: 'Moses Yakubu',   score: 48, attendance: '60%', trend: 'down', flag: 'At Risk'     },
  { name: 'Sandra Ogbu',    score: 42, attendance: '55%', trend: 'down', flag: 'Critical'    },
]

const scoreDistribution = [
  { range: '90–100', count: 1, color: 'bg-green-500' },
  { range: '80–89',  count: 3, color: 'bg-primary'   },
  { range: '70–79',  count: 2, color: 'bg-amber-500' },
  { range: '60–69',  count: 1, color: 'bg-orange-500' },
  { range: 'Below 60', count: 3, color: 'bg-red-500' },
]

const classAvg = Math.round(students.reduce((s, st) => s + st.score, 0) / students.length)
const passing  = students.filter(s => s.score >= 60).length
const atRisk   = students.filter(s => s.flag && s.flag !== 'Declining').length

const flagStyle: Record<string, string> = {
  'Declining': 'bg-amber-50 text-amber-600',
  'At Risk':   'bg-orange-50 text-orange-600',
  'Critical':  'bg-red-50 text-red-600',
}

function trendIcon(trend: string) {
  if (trend === 'up')   return <span className="text-green-500 text-base">↑</span>
  if (trend === 'down') return <span className="text-red-500 text-base">↓</span>
  return <span className="text-muted text-base">—</span>
}

export default function ClassPerformancePage({ onNavigate }: Props) {
  const [activeClass,   setActiveClass]   = useState('SS2A')
  const [activeSubject, setActiveSubject] = useState('Mathematics')

  return (
    <DashboardLayout
      activePage="class-performance"
      onNavigate={onNavigate}
      title="Class Performance"
      subtitle="Subject-level analytics for your classes"
      nav={teacherNav}
      user={{ name: 'Mr Johnson', role: 'Teacher', initials: 'MJ' }}
    >
      <div className="flex flex-col gap-5">

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <select
              value={activeClass}
              onChange={e => setActiveClass(e.target.value)}
              className="h-10 pl-4 pr-8 border border-black/20 rounded-pill text-sm font-semibold outline-none focus:border-primary appearance-none bg-surface cursor-pointer"
            >
              {classes.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
          <div className="flex gap-2">
            {subjects.map(s => (
              <button
                key={s}
                onClick={() => setActiveSubject(s)}
                className={`h-10 px-4 rounded-pill text-sm font-semibold transition-colors ${activeSubject === s ? 'bg-primary text-white shadow-primary' : 'bg-surface text-muted hover:text-foreground shadow-sm'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Class Average',    value: `${classAvg}%`, icon: BarChart2,    color: 'bg-primary/10 text-primary'     },
            { label: 'Students',         value: students.length, icon: Users,       color: 'bg-green-50 text-green-600'     },
            { label: 'Passing (≥60)',    value: passing,         icon: Award,       color: 'bg-accent-mint/10 text-accent-mint' },
            { label: 'At Risk',          value: atRisk,          icon: AlertCircle, color: 'bg-red-50 text-red-500'         },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-surface rounded-card shadow-sm p-5">
              <div className={`size-9 rounded-full flex items-center justify-center mb-2 ${color}`}>
                <Icon size={16} />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Score distribution */}
          <div className="bg-surface rounded-card shadow-sm p-5 xl:col-span-1">
            <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <BarChart2 size={14} className="text-primary" /> Score Distribution
            </h2>
            <div className="flex flex-col gap-3">
              {scoreDistribution.map(({ range, count, color }) => (
                <div key={range} className="flex items-center gap-3">
                  <p className="text-xs text-muted w-20 shrink-0">{range}</p>
                  <div className="flex-1 h-2 bg-canvas rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${(count / students.length) * 100}%` }} />
                  </div>
                  <p className="text-xs font-bold text-foreground w-4">{count}</p>
                </div>
              ))}
            </div>

            {/* Class trend */}
            <div className="mt-5 pt-4 border-t border-black/6">
              <p className="text-xs font-bold text-foreground mb-3">Avg Score — Last 5 Weeks</p>
              <div className="flex items-end gap-2 h-16">
                {[68, 71, 70, 74, classAvg].map((v, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-[9px] text-muted">{v}</span>
                    <div className="w-full bg-primary/80 rounded-t" style={{ height: `${(v / 100) * 100}%` }} />
                    <span className="text-[9px] text-muted">W{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student table */}
          <div className="bg-surface rounded-card shadow-sm overflow-hidden xl:col-span-2">
            <div className="px-5 py-4 border-b border-black/6 flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users size={14} className="text-primary" /> Students — {activeClass} · {activeSubject}
              </h2>
              <button
                onClick={() => onNavigate('behavior-analytics')}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <AlertCircle size={11} /> View At-Risk
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-canvas border-b border-black/6 text-xs text-muted">
                    <th className="text-left px-5 py-3 font-semibold">Student</th>
                    <th className="text-right px-4 py-3 font-semibold">Score</th>
                    <th className="text-right px-4 py-3 font-semibold">Attendance</th>
                    <th className="text-center px-4 py-3 font-semibold">Trend</th>
                    <th className="text-center px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/4">
                  {students.map((st, i) => (
                    <tr key={i} className="hover:bg-canvas/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {st.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-semibold text-foreground">{st.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-bold ${st.score >= 80 ? 'text-green-600' : st.score >= 60 ? 'text-foreground' : 'text-red-500'}`}>
                          {st.score}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-muted">{st.attendance}</td>
                      <td className="px-4 py-3 text-center">{trendIcon(st.trend)}</td>
                      <td className="px-4 py-3 text-center">
                        {st.flag ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${flagStyle[st.flag]}`}>
                            {st.flag}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Good</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t border-black/6 flex items-center justify-between">
              <p className="text-xs text-muted">{students.length} students</p>
              <div className="flex items-center gap-2">
                <TrendingUp size={12} className="text-green-500" />
                <p className="text-xs text-muted">Class average trending up from last week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
