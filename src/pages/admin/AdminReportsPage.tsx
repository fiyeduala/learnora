import { useState } from 'react'
import { FileBarChart, Users, TrendingUp, BookOpen, Download, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

type ReportType = 'attendance' | 'academic' | 'finance' | 'enrollment'

const reportTypes: { id: ReportType; label: string; description: string; Icon: typeof FileBarChart; color: string }[] = [
  {
    id: 'attendance',
    label: 'Attendance Report',
    description: 'Daily, weekly, and term-level attendance by class and student.',
    Icon: Users,
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'academic',
    label: 'Academic Performance',
    description: 'GPA trends, subject scores, and pass/fail breakdown across all classes.',
    Icon: BookOpen,
    color: 'bg-accent-mint/10 text-accent-mint',
  },
  {
    id: 'finance',
    label: 'Finance Report',
    description: 'Fee collection, outstanding invoices, and payment history.',
    Icon: TrendingUp,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    id: 'enrollment',
    label: 'Enrollment Report',
    description: 'Student enrollment by class, gender, and entry term.',
    Icon: FileBarChart,
    color: 'bg-red-50 text-red-500',
  },
]

const terms = ['2nd Term 2025/2026', '1st Term 2025/2026', '3rd Term 2024/2025', '2nd Term 2024/2025']
const classes = ['All Classes', 'SS1A', 'SS1B', 'SS2A', 'SS2B', 'SS3A', 'SS3B']

const recentReports = [
  { name: 'Attendance_Report_T2_2026.pdf',   type: 'Attendance', date: 'Jun 4, 2026', size: '1.2 MB' },
  { name: 'Academic_Performance_T1_2026.pdf', type: 'Academic',   date: 'Mar 20, 2026', size: '980 KB' },
  { name: 'Finance_Report_T1_2026.xlsx',      type: 'Finance',    date: 'Mar 18, 2026', size: '640 KB' },
  { name: 'Enrollment_Report_2025.pdf',       type: 'Enrollment', date: 'Sep 3, 2025',  size: '450 KB' },
]

export default function AdminReportsPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [selected, setSelected] = useState<ReportType>('attendance')
  const [term, setTerm] = useState(terms[0])
  const [cls, setCls] = useState(classes[0])
  const [generated, setGenerated] = useState(false)

  return (
    <DashboardLayout
      activePage="admin-reports"
      onNavigate={onNavigate}
      title="Reports"
      subtitle="Generate and download school reports"
      nav={adminNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="flex flex-col gap-6 max-w-[900px]">

        {/* Report type selector */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <h2 className="text-sm font-bold text-foreground mb-4">Select Report Type</h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {reportTypes.map(({ id, label, description, Icon, color }) => (
              <button
                key={id}
                onClick={() => { setSelected(id); setGenerated(false) }}
                className={`flex flex-col gap-3 p-4 rounded-card border-2 text-left transition-all ${
                  selected === id ? 'border-primary bg-primary/4' : 'border-black/8 hover:border-black/20'
                }`}
              >
                <div className={`size-10 rounded-card ${color} flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{description}</p>
                </div>
                {selected === id && (
                  <CheckCircle2 size={16} className="text-primary self-end" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <h2 className="text-sm font-bold text-foreground mb-4">Configure Report</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Academic Term</label>
              <div className="relative">
                <select
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 border border-black/20 rounded-card text-sm text-foreground bg-white outline-none focus:border-primary appearance-none"
                >
                  {terms.map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Class</label>
              <div className="relative">
                <select
                  value={cls}
                  onChange={e => setCls(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 border border-black/20 rounded-card text-sm text-foreground bg-white outline-none focus:border-primary appearance-none"
                >
                  {classes.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Date From</label>
              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-02-01"
                  className="w-full h-11 pl-4 pr-4 border border-black/20 rounded-card text-sm text-foreground bg-white outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Date To</label>
              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-06-06"
                  className="w-full h-11 pl-4 pr-4 border border-black/20 rounded-card text-sm text-foreground bg-white outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-black/6">
            <button
              onClick={() => setGenerated(true)}
              className="flex items-center gap-2 h-11 px-6 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
            >
              <Calendar size={15} /> Generate Report
            </button>
            {generated && (
              <button className="flex items-center gap-2 h-11 px-6 border border-primary text-primary text-sm font-semibold rounded-pill hover:bg-primary/8 transition-colors">
                <Download size={15} /> Download PDF
              </button>
            )}
          </div>

          {generated && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-card flex items-center gap-3">
              <CheckCircle2 size={16} className="text-green-600 shrink-0" />
              <p className="text-sm text-green-700 font-medium">
                Report generated successfully. Click "Download PDF" to save.
              </p>
            </div>
          )}
        </div>

        {/* Recent reports */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6">
            <h2 className="text-base font-bold text-foreground">Recent Reports</h2>
          </div>
          <div className="divide-y divide-black/4">
            {recentReports.map((r, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="size-10 rounded-card bg-canvas flex items-center justify-center shrink-0">
                  <FileBarChart size={16} className="text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                  <p className="text-xs text-muted">{r.type} · {r.date} · {r.size}</p>
                </div>
                <button className="flex items-center gap-1.5 h-8 px-3 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors shrink-0">
                  <Download size={11} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
