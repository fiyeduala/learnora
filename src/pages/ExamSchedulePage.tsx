import { useState } from 'react'
import { Calendar, Clock, MapPin, BookOpen, AlertCircle } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

interface Exam {
  subject:    string
  type:       string
  date:       string
  day:        string
  time:       string
  duration:   string
  venue:      string
  invigilator:string
  color:      string
  past:       boolean
}

const exams: Exam[] = []

const daysToFirstExam = '—'

export default function ExamSchedulePage({ onNavigate }: Props) {
  const [showPast, setShowPast] = useState(false)

  const upcoming = exams.filter(e => !e.past)
  const past     = exams.filter(e => e.past)
  const visible  = showPast ? past : upcoming

  return (
    <DashboardLayout
      activePage="calendar"
      onNavigate={onNavigate}
      title="Exam Schedule"
      subtitle="Your upcoming and past examinations"
    >
      <div className="flex flex-col gap-5 max-w-[820px]">

        {/* Countdown banner */}
        <div className="bg-gradient-to-r from-[#4b75ff] to-[#005cf7] rounded-card p-6 text-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold opacity-80 mb-1">End of Term Exams</p>
            <p className="text-3xl font-bold">{daysToFirstExam} days to go</p>
            <p className="text-sm opacity-70 mt-1">No exams scheduled yet.</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">{upcoming.length}</p>
            <p className="text-sm opacity-70">Upcoming exams</p>
          </div>
        </div>

        {/* Alert */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-card text-sm text-amber-800">
          <AlertCircle size={15} className="shrink-0 mt-0.5 text-amber-600" />
          <p>Arrive at least <strong>15 minutes early</strong>. No phones or smart watches allowed in the exam hall. Bring your student ID and stationery.</p>
        </div>

        {/* Tab toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowPast(false)}
            className={`h-9 px-5 rounded-full text-sm font-semibold transition-colors ${!showPast ? 'bg-primary text-white shadow-primary' : 'bg-surface text-muted shadow-sm'}`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setShowPast(true)}
            className={`h-9 px-5 rounded-full text-sm font-semibold transition-colors ${showPast ? 'bg-primary text-white shadow-primary' : 'bg-surface text-muted shadow-sm'}`}
          >
            Past ({past.length})
          </button>
        </div>

        {/* Exam list */}
        <div className="flex flex-col gap-3">
          {visible.length === 0
            ? <div className="py-8 text-center text-sm text-muted">No data yet.</div>
            : visible.map((exam, i) => (
              <div key={i} className={`bg-surface rounded-card shadow-sm overflow-hidden flex ${exam.past ? 'opacity-70' : ''}`}>
                {/* Date column */}
                <div className="w-20 shrink-0 flex flex-col items-center justify-center py-4 bg-canvas border-r border-black/6">
                  <p className="text-xs font-semibold text-muted">{exam.day}</p>
                  <p className="text-lg font-bold text-foreground">{exam.date.split(' ')[1].replace(',', '')}</p>
                  <p className="text-xs text-muted">{exam.date.split(' ')[0]}</p>
                </div>
                {/* Content */}
                <div className="flex-1 flex items-center gap-4 px-5 py-4">
                  <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${exam.color}`}>
                    <BookOpen size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{exam.subject}</p>
                    <p className="text-xs text-muted">{exam.type}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-muted">
                      <span className="flex items-center gap-1"><Clock size={10} /> {exam.time} · {exam.duration}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} /> {exam.venue}</span>
                      <span className="flex items-center gap-1"><Calendar size={10} /> {exam.invigilator}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('ai-exam-prep')}
                    className="shrink-0 h-8 px-3 bg-primary/10 text-primary text-xs font-bold rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    Prepare →
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </DashboardLayout>
  )
}
