import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const submission = {
  student: 'Amira Hassan',
  assignment: "Newton's Laws Quiz",
  submitted: 'Jun 5, 2026 · 10:30 AM',
  questions: [
    {
      q: "What is Newton's First Law of Motion?",
      studentAnswer: 'An object at rest remains at rest, and an object in motion remains in motion unless acted on by an external force.',
      correct: true,
      points: 10,
    },
    {
      q: 'Calculate the force required to accelerate a 5kg object at 3 m/s².',
      studentAnswer: '15 Newtons (F = ma = 5 × 3)',
      correct: true,
      points: 15,
    },
    {
      q: "State Newton's Third Law and give an example.",
      studentAnswer: 'Every action has an equal and opposite reaction. Example: when you push a wall, the wall pushes back.',
      correct: null,
      points: 10,
    },
  ],
}

export default function GradingScreenPage({ onNavigate }: Props) {
  const [feedback, setFeedback] = useState('')
  const [marks, setMarks] = useState<(boolean | null)[]>(submission.questions.map(q => q.correct))
  const [done, setDone] = useState(false)

  const earnedPoints = marks.reduce<number>((acc, m, i) => acc + (m ? submission.questions[i].points : 0), 0)
  const totalPoints  = submission.questions.reduce((acc, q) => acc + q.points, 0)

  return (
    <DashboardLayout
      activePage="gradebook"
      onNavigate={onNavigate}
      title="Grading"
      subtitle={`${submission.student} — ${submission.assignment}`}
      nav={teacherNav}
      user={{ name: 'Daniel Johnson', role: 'Teacher', initials: 'D' }}
    >
      <div className="max-w-[1100px] flex flex-col gap-6">

        {/* Navigation header */}
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('submissions-inbox')} className="flex items-center gap-2 text-sm text-muted hover:text-foreground">
            <ChevronLeft size={16} /> Back to Submissions
          </button>
          <div className="flex gap-2">
            <button className="h-9 w-9 border border-black/15 rounded-full flex items-center justify-center text-muted hover:text-foreground transition-colors">
              <ChevronLeft size={15} />
            </button>
            <button className="h-9 w-9 border border-black/15 rounded-full flex items-center justify-center text-muted hover:text-foreground transition-colors">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* Left: questions */}
          <div className="flex flex-col gap-4">
            {submission.questions.map((q, i) => (
              <div key={i} className="bg-surface rounded-card shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    <span className="text-primary mr-2">Q{i + 1}.</span>{q.q}
                  </p>
                  <span className="text-xs text-muted shrink-0">{q.points} pts</span>
                </div>

                <div className="bg-canvas rounded-card p-4 mb-4">
                  <p className="text-xs text-muted mb-1">Student's Answer</p>
                  <p className="text-sm text-foreground leading-relaxed">{q.studentAnswer}</p>
                </div>

                {/* Mark correct/incorrect */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setMarks(ms => ms.map((m, mi) => mi === i ? true : m))}
                    className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-colors ${
                      marks[i] === true ? 'bg-green-500 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    <CheckCircle2 size={12} /> Correct
                  </button>
                  <button
                    onClick={() => setMarks(ms => ms.map((m, mi) => mi === i ? false : m))}
                    className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-colors ${
                      marks[i] === false ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <XCircle size={12} /> Incorrect
                  </button>
                  <span className="ml-auto text-xs font-semibold text-foreground">
                    {marks[i] === true ? q.points : marks[i] === false ? 0 : '—'}/{q.points}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: score + feedback */}
          <div className="flex flex-col gap-4">
            {/* Score card */}
            <div className="bg-surface rounded-card shadow-sm p-6">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Score Summary</p>

              <div className="text-center mb-6">
                <p className="text-5xl font-bold text-primary">{earnedPoints}</p>
                <p className="text-sm text-muted mt-1">out of {totalPoints} points</p>
                <p className="text-lg font-bold text-foreground mt-2">{Math.round((earnedPoints / totalPoints) * 100)}%</p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Student</span>
                  <span className="font-semibold text-foreground">{submission.student}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Submitted</span>
                  <span className="font-semibold text-foreground text-xs">{submission.submitted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Questions</span>
                  <span className="font-semibold text-foreground">{submission.questions.length}</span>
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-surface rounded-card shadow-sm p-6">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Teacher Feedback</p>
              <textarea
                value={feedback} onChange={e => setFeedback(e.target.value)}
                rows={5} placeholder="Leave feedback for the student..."
                className="w-full px-4 py-3 border border-black/15 rounded-card text-sm text-foreground placeholder:text-muted outline-none focus:border-primary resize-none"
              />
            </div>

            <button
              onClick={() => { setDone(true); onNavigate('submissions-inbox') }}
              className="h-12 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
            >
              Submit Grade
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}
