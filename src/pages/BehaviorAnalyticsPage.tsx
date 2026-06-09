import { AlertTriangle, CheckCircle2, TrendingDown, Users, ChevronRight, Flag } from 'lucide-react'
import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props   = { onNavigate: (page: string) => void }
type Risk    = 'high' | 'medium' | 'low'

interface Student {
  name: string; class: string; risk: Risk
  attendance: number; avgGrade: number; submissions: string; flags: string[]
}

const students: Student[] = [
  { name: 'Tobenna Obi',      class: 'SS1A', risk: 'high',   attendance: 61, avgGrade: 42, submissions: '4/10', flags: ['Attendance below 65%', 'Failing 3 subjects', 'No submissions last 2 weeks'] },
  { name: 'Chisom Okeke',     class: 'SS1B', risk: 'high',   attendance: 68, avgGrade: 48, submissions: '6/10', flags: ['Attendance below 70%', 'Failing 2 subjects']                                },
  { name: 'Sade Fashola',     class: 'SS2A', risk: 'medium', attendance: 74, avgGrade: 55, submissions: '7/10', flags: ['GPA declining 3 terms', 'Late submissions frequent']                        },
  { name: 'Nkem Ikechukwu',   class: 'SS1A', risk: 'medium', attendance: 78, avgGrade: 60, submissions: '8/10', flags: ['Attendance drop last month']                                                 },
  { name: 'Bello Abdullahi',  class: 'SS2B', risk: 'low',    attendance: 82, avgGrade: 65, submissions: '9/10', flags: ['Missed 2 assignments']                                                       },
]

const riskStyle: Record<Risk, { badge: string; row: string }> = {
  high:   { badge: 'bg-red-50 text-red-600',    row: 'border-l-2 border-red-400'    },
  medium: { badge: 'bg-amber-50 text-amber-600', row: 'border-l-2 border-amber-400' },
  low:    { badge: 'bg-canvas text-muted',       row: ''                             },
}

const riskIcon: Record<Risk, typeof AlertTriangle> = {
  high:   AlertTriangle,
  medium: TrendingDown,
  low:    CheckCircle2,
}

export default function BehaviorAnalyticsPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [filter, setFilter] = useState<Risk | 'all'>('all')

  const filtered = filter === 'all' ? students : students.filter(s => s.risk === filter)

  const highCount   = students.filter(s => s.risk === 'high').length
  const mediumCount = students.filter(s => s.risk === 'medium').length
  const lowCount    = students.filter(s => s.risk === 'low').length

  return (
    <DashboardLayout
      activePage="analytics"
      onNavigate={onNavigate}
      title="At-Risk Students"
      subtitle="Behavior analytics and early-warning flags"
      nav={teacherNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="flex flex-col gap-5">

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'High Risk',   count: highCount,   color: 'bg-red-50 text-red-600',    Icon: AlertTriangle },
            { label: 'Medium Risk', count: mediumCount, color: 'bg-amber-50 text-amber-600', Icon: TrendingDown  },
            { label: 'Low Risk',    count: lowCount,    color: 'bg-green-50 text-green-600', Icon: CheckCircle2  },
          ].map(({ label, count, color, Icon }) => (
            <div key={label} className="bg-surface rounded-card shadow-sm p-5 flex items-center gap-4">
              <div className={`size-10 rounded-card ${color} flex items-center justify-center shrink-0`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Alert banner */}
        {highCount > 0 && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-card p-4">
            <Flag size={16} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">
              <span className="font-bold">{highCount} student{highCount > 1 ? 's are' : ' is'} at high risk</span> of academic failure.
              Intervention recommended this week.
            </p>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 bg-canvas rounded-pill p-1 w-fit">
          {(['all','high','medium','low'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-8 px-4 rounded-full text-sm font-semibold capitalize transition-colors ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}
            >
              {f === 'all' ? `All (${students.length})` : f}
            </button>
          ))}
        </div>

        {/* Students list */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="divide-y divide-black/4">
            {filtered.map((s, i) => {
              const { badge, row } = riskStyle[s.risk]
              const RiskIcon = riskIcon[s.risk]
              return (
                <div key={i} className={`px-6 py-4 hover:bg-canvas/50 transition-colors ${row}`}>
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-0.5">
                      {s.name.split(' ').map(p => p[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <p className="text-sm font-semibold text-foreground">{s.name}</p>
                        <span className="text-xs text-muted">{s.class}</span>
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${badge} capitalize`}>
                          <RiskIcon size={10} /> {s.risk} risk
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
                        <div>
                          <p className="text-muted">Attendance</p>
                          <p className={`font-bold ${s.attendance < 70 ? 'text-red-500' : 'text-foreground'}`}>{s.attendance}%</p>
                        </div>
                        <div>
                          <p className="text-muted">Avg Grade</p>
                          <p className={`font-bold ${s.avgGrade < 50 ? 'text-red-500' : 'text-foreground'}`}>{s.avgGrade}%</p>
                        </div>
                        <div>
                          <p className="text-muted">Submissions</p>
                          <p className="font-bold text-foreground">{s.submissions}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {s.flags.map((flag, fi) => (
                          <span key={fi} className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                            <AlertTriangle size={9} /> {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => onNavigate('teacher-messages')}
                        className="h-8 px-3 border border-primary text-primary text-xs font-semibold rounded-full hover:bg-primary/8 transition-colors"
                      >
                        Message
                      </button>
                      <button
                        onClick={() => onNavigate('student-profile')}
                        className="h-8 px-3 bg-canvas text-muted text-xs font-semibold rounded-full hover:bg-black/8 transition-colors flex items-center gap-1"
                      >
                        Profile <ChevronRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* No students */}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted">
            <Users size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No students in this category</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
