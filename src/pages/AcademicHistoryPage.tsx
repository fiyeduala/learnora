import { BookOpen, TrendingUp, Award, Calendar } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

const terms = [
  {
    label:    '2025–2026 First Term',
    date:     'Sep – Dec 2025',
    gpa:      4.1,
    grade:    'A',
    rank:     3,
    attendance: '94%',
    subjects: [
      { name: 'Mathematics',         score: 88, grade: 'A'  },
      { name: 'English Language',    score: 91, grade: 'A+' },
      { name: 'Physics',             score: 82, grade: 'A'  },
      { name: 'Chemistry',           score: 79, grade: 'B+' },
      { name: 'Biology',             score: 86, grade: 'A'  },
      { name: 'Economics',           score: 74, grade: 'B'  },
    ],
  },
  {
    label:    '2024–2025 Third Term',
    date:     'Apr – Jul 2025',
    gpa:      3.9,
    grade:    'A',
    rank:     4,
    attendance: '90%',
    subjects: [
      { name: 'Mathematics',         score: 85, grade: 'A'  },
      { name: 'English Language',    score: 89, grade: 'A+' },
      { name: 'Physics',             score: 78, grade: 'B+' },
      { name: 'Chemistry',           score: 80, grade: 'A'  },
      { name: 'Biology',             score: 83, grade: 'A'  },
      { name: 'Economics',           score: 71, grade: 'B'  },
    ],
  },
  {
    label:    '2024–2025 Second Term',
    date:     'Jan – Mar 2025',
    gpa:      3.7,
    grade:    'B+',
    rank:     6,
    attendance: '88%',
    subjects: [
      { name: 'Mathematics',         score: 80, grade: 'A'  },
      { name: 'English Language',    score: 86, grade: 'A'  },
      { name: 'Physics',             score: 74, grade: 'B'  },
      { name: 'Chemistry',           score: 77, grade: 'B+' },
      { name: 'Biology',             score: 79, grade: 'B+' },
      { name: 'Economics',           score: 68, grade: 'B'  },
    ],
  },
  {
    label:    '2024–2025 First Term',
    date:     'Sep – Dec 2024',
    gpa:      3.5,
    grade:    'B+',
    rank:     8,
    attendance: '85%',
    subjects: [
      { name: 'Mathematics',         score: 75, grade: 'B+' },
      { name: 'English Language',    score: 82, grade: 'A'  },
      { name: 'Physics',             score: 69, grade: 'B'  },
      { name: 'Chemistry',           score: 72, grade: 'B'  },
      { name: 'Biology',             score: 76, grade: 'B+' },
      { name: 'Economics',           score: 64, grade: 'C+' },
    ],
  },
]

const gpaHistory = terms.map(t => t.gpa).reverse()
const maxGpa = 4.5
const gpaMonths = terms.map(t => t.label.replace(/.*\s/, '')).reverse()

function gradeColor(grade: string) {
  if (grade.startsWith('A')) return 'text-green-700 bg-green-50'
  if (grade.startsWith('B')) return 'text-primary bg-primary/10'
  return 'text-amber-600 bg-amber-50'
}

export default function AcademicHistoryPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="profile"
      onNavigate={onNavigate}
      title="Academic History"
      subtitle="Your term-by-term academic record"
    >
      {/* GPA Trend */}
      <div className="bg-surface rounded-card shadow-sm p-6 mb-5">
        <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp size={14} className="text-primary" /> GPA Trend
        </h2>
        <div className="flex items-end gap-4 h-28">
          {gpaHistory.map((g, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
              <span className="text-[10px] font-bold text-primary">{g}</span>
              <div
                className="w-full bg-primary rounded-t"
                style={{ height: `${(g / maxGpa) * 100}%` }}
              />
              <span className="text-[9px] text-muted text-center leading-tight">{gpaMonths[i]}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3 text-center">GPA scale 0–4.5 · Upward trend over 4 terms</p>
      </div>

      {/* Terms */}
      <div className="flex flex-col gap-5">
        {terms.map((term, ti) => (
          <div key={ti} className="bg-surface rounded-card shadow-sm overflow-hidden">
            {/* Term header */}
            <div className="px-6 py-4 bg-canvas border-b border-black/6 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Calendar size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{term.label}</p>
                  <p className="text-xs text-muted">{term.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="font-bold text-foreground">{term.gpa}</p>
                  <p className="text-xs text-muted">GPA</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-foreground">#{term.rank}</p>
                  <p className="text-xs text-muted">Class Rank</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-foreground">{term.attendance}</p>
                  <p className="text-xs text-muted">Attendance</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${gradeColor(term.grade)}`}>
                  Grade {term.grade}
                </span>
              </div>
            </div>

            {/* Subjects */}
            <div className="divide-y divide-black/4">
              {term.subjects.map((s, si) => (
                <div key={si} className="flex items-center gap-4 px-6 py-3">
                  <div className="size-7 rounded-full bg-canvas flex items-center justify-center shrink-0">
                    <BookOpen size={11} className="text-muted" />
                  </div>
                  <p className="flex-1 text-sm text-foreground">{s.name}</p>
                  <div className="flex items-center gap-3">
                    {/* Score bar */}
                    <div className="w-24 h-1.5 bg-canvas rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${s.score}%` }} />
                    </div>
                    <span className="text-xs font-bold text-foreground w-7 text-right">{s.score}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-10 text-center ${gradeColor(s.grade)}`}>
                      {s.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Term footer */}
            <div className="px-6 py-3 bg-canvas border-t border-black/6 flex items-center justify-between text-xs text-muted">
              <span className="flex items-center gap-1.5"><Award size={11} /> Overall Position: #{term.rank} in class</span>
              <button className="text-primary font-semibold hover:underline">Download Report Card</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
