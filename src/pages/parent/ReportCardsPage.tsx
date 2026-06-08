import { Download, ChevronLeft, Star, TrendingUp } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

const subjects = [
  { name: 'Mathematics',    score: 88, grade: 'A',  remark: 'Excellent'   },
  { name: 'English',        score: 76, grade: 'B',  remark: 'Good'        },
  { name: 'Basic Science',  score: 92, grade: 'A+', remark: 'Outstanding' },
  { name: 'Social Studies', score: 70, grade: 'B-', remark: 'Good'        },
  { name: 'CRK',            score: 85, grade: 'A',  remark: 'Excellent'   },
  { name: 'Agric Science',  score: 78, grade: 'B',  remark: 'Good'        },
]

const gradeColor: Record<string, string> = {
  'A+': 'text-green-600', A: 'text-green-600', 'B': 'text-primary', 'B-': 'text-primary',
}

export default function ReportCardsPage({ onNavigate }: Props) {
  const avg = Math.round(subjects.reduce((s, r) => s + r.score, 0) / subjects.length)

  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-4">

        <button onClick={() => onNavigate('parent/home')} className="mb-4">
          <ChevronLeft size={22} />
        </button>

        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-primary">Report Card</h1>
          <button className="flex items-center gap-1.5 h-9 px-3 border border-primary text-primary text-xs font-semibold rounded-full">
            <Download size={13} /> PDF
          </button>
        </div>
        <p className="text-xs text-muted mb-5">Olive Princely · Primary 5A · Second Term 2026</p>

        {/* Summary */}
        <div className="bg-primary rounded-3xl p-5 mb-6">
          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div>
              <p className="text-2xl font-bold text-white">{avg}%</p>
              <p className="text-[10px] text-white/70">Average</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">4th</p>
              <p className="text-[10px] text-white/70">Class Rank</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">A</p>
              <p className="text-[10px] text-white/70">Overall Grade</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/15 rounded-2xl px-3 py-2">
            <TrendingUp size={13} className="text-white" />
            <p className="text-xs text-white">+5% improvement from last term</p>
          </div>
        </div>

        {/* Teacher's remark */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
          <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1"><Star size={11} /> Class Teacher's Remark</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Olive is a diligent and enthusiastic student. Excellent performance in Science subjects. Encourage more reading in Social Studies.
          </p>
          <p className="text-xs text-amber-600 mt-1 font-semibold">— Mrs Nnduka Kisha</p>
        </div>

        {/* Subject results */}
        <p className="text-base font-bold text-foreground mb-3">Subject Results</p>
        <div className="flex flex-col gap-2">
          {subjects.map((s, i) => (
            <div key={i} className="bg-white border border-black/6 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-base font-bold ${gradeColor[s.grade] ?? 'text-foreground'}`}>{s.grade}</span>
                  <span className="text-sm font-semibold text-muted">{s.score}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-black/8 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${s.score}%` }} />
              </div>
              <p className="text-xs text-muted mt-1">{s.remark}</p>
            </div>
          ))}
        </div>

        {/* Download button */}
        <button className="w-full h-14 bg-primary text-white text-base font-bold rounded-2xl mt-6 flex items-center justify-center gap-2">
          <Download size={16} /> Download Full Report
        </button>

      </div>
    </MobileLayout>
  )
}
