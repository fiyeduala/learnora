import { Award, Download, Eye, Lock, Star } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

interface Certificate {
  id:        string
  title:     string
  issuer:    string
  date:      string
  score:     number
  grade:     string
  color:     string
  earned:    boolean
  hours:     number
}

const certificates: Certificate[] = [
  { id: '1', title: 'Mathematics — Senior Secondary',     issuer: 'Greenfield Academy',    date: 'Jun 30, 2025', score: 87, grade: 'A',  color: '#4b75ff', earned: true,  hours: 120 },
  { id: '2', title: 'English Language — SS2',             issuer: 'Greenfield Academy',    date: 'Jun 30, 2025', score: 91, grade: 'A+', color: '#10b981', earned: true,  hours: 80  },
  { id: '3', title: 'Physics Fundamentals',               issuer: 'Greenfield Academy',    date: 'Mar 15, 2025', score: 79, grade: 'B+', color: '#f59e0b', earned: true,  hours: 60  },
  { id: '4', title: 'Introduction to Computer Science',   issuer: 'Greenfield Academy',    date: 'Nov 20, 2024', score: 95, grade: 'A+', color: '#8b5cf6', earned: true,  hours: 45  },
  { id: '5', title: 'Chemistry — Term 1',                 issuer: 'Greenfield Academy',    date: 'Dec 10, 2024', score: 83, grade: 'A',  color: '#ef4444', earned: true,  hours: 70  },
  { id: '6', title: 'WAEC Preparatory Certificate',       issuer: 'Learnora AI',           date: 'Pending',      score: 0,  grade: '—',  color: '#6b7280', earned: false, hours: 0   },
  { id: '7', title: 'Biology — Full Course Completion',   issuer: 'Greenfield Academy',    date: 'Pending',      score: 0,  grade: '—',  color: '#6b7280', earned: false, hours: 0   },
]

const earned  = certificates.filter(c => c.earned)
const pending = certificates.filter(c => !c.earned)

function GradeColor(grade: string) {
  if (grade.startsWith('A')) return 'text-green-600 bg-green-50'
  if (grade.startsWith('B')) return 'text-primary bg-primary/10'
  return 'text-muted bg-canvas'
}

export default function CertificatesPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="profile"
      onNavigate={onNavigate}
      title="Certificates"
      subtitle="Your earned course and academic certificates"
    >
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Certificates Earned', value: earned.length, icon: Award, color: 'text-primary bg-primary/10' },
          { label: 'Total Hours',          value: earned.reduce((s, c) => s + c.hours, 0), icon: Star, color: 'text-amber-600 bg-amber-50' },
          { label: 'Average Grade',        value: 'A / 87%', icon: Award, color: 'text-green-600 bg-green-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-surface rounded-card shadow-sm p-5">
            <div className={`size-9 rounded-full flex items-center justify-center mb-2 ${color}`}>
              <Icon size={15} />
            </div>
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Earned certificates */}
      <h2 className="text-sm font-bold text-foreground mb-3">Earned Certificates</h2>
      <div className="flex flex-col gap-3 mb-6">
        {earned.map(c => (
          <div key={c.id} className="bg-surface rounded-card shadow-sm overflow-hidden flex">
            {/* Color strip */}
            <div className="w-1.5 shrink-0" style={{ background: c.color }} />
            <div className="flex-1 flex items-center gap-4 px-5 py-4">
              <div className="size-12 rounded-full shrink-0 flex items-center justify-center" style={{ background: c.color + '18' }}>
                <Award size={20} style={{ color: c.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{c.title}</p>
                <p className="text-xs text-muted mt-0.5">{c.issuer} · Issued {c.date}</p>
                <p className="text-xs text-muted mt-0.5">{c.hours} learning hours</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${GradeColor(c.grade)}`}>
                  Grade {c.grade} · {c.score}%
                </span>
                <button className="flex items-center gap-1.5 h-8 px-3 border border-black/15 rounded-full text-xs text-muted hover:text-primary hover:border-primary transition-colors">
                  <Eye size={11} /> View
                </button>
                <button className="flex items-center gap-1.5 h-8 px-3 bg-primary/10 text-primary rounded-full text-xs font-semibold hover:bg-primary hover:text-white transition-colors">
                  <Download size={11} /> PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming / locked */}
      {pending.length > 0 && (
        <>
          <h2 className="text-sm font-bold text-foreground mb-3">In Progress</h2>
          <div className="flex flex-col gap-3">
            {pending.map(c => (
              <div key={c.id} className="bg-surface rounded-card shadow-sm flex opacity-60">
                <div className="w-1.5 shrink-0 bg-canvas" />
                <div className="flex-1 flex items-center gap-4 px-5 py-4">
                  <div className="size-12 rounded-full bg-canvas flex items-center justify-center shrink-0">
                    <Lock size={18} className="text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{c.title}</p>
                    <p className="text-xs text-muted mt-0.5">{c.issuer} · Not yet earned</p>
                  </div>
                  <span className="text-xs font-semibold bg-canvas text-muted px-3 py-1 rounded-full">Pending</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
