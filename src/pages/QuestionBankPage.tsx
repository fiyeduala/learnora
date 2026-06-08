import { useState } from 'react'
import { Plus, Search, Filter, Trash2, Copy, ChevronDown } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type Question = {
  id: number
  subject: string
  type: 'MCQ' | 'Short Answer' | 'Essay'
  text: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  usedIn: string[]
}

const questions: Question[] = [
  { id: 1, subject: 'Physics',     type: 'MCQ',          text: "What is Newton's First Law of Motion?",                difficulty: 'Easy',   usedIn: ['Newton\'s Laws Quiz'] },
  { id: 2, subject: 'Physics',     type: 'Short Answer',  text: 'Calculate the velocity of an object given its momentum and mass.',  difficulty: 'Medium', usedIn: [] },
  { id: 3, subject: 'Physics',     type: 'MCQ',          text: 'Which of the following best describes kinetic energy?',              difficulty: 'Easy',   usedIn: ['Energy Quiz'] },
  { id: 4, subject: 'Mathematics', type: 'Short Answer',  text: 'Solve: 3x + 5 = 203x + 5 = 20. Find x.',                           difficulty: 'Easy',   usedIn: ['Algebra Quiz'] },
  { id: 5, subject: 'Mathematics', type: 'MCQ',          text: 'What is the derivative of sin(x)?',                                 difficulty: 'Hard',   usedIn: [] },
  { id: 6, subject: 'Mathematics', type: 'Essay',        text: 'Explain the concept of limits in calculus with real-world examples.',difficulty: 'Hard',   usedIn: [] },
]

const diffColor: Record<string, string> = {
  Easy:   'bg-green-50 text-green-700',
  Medium: 'bg-amber-50 text-amber-700',
  Hard:   'bg-red-50 text-red-600',
}

export default function QuestionBankPage({ onNavigate }: Props) {
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('All')

  const filtered = questions.filter(q =>
    (subject === 'All' || q.subject === subject) &&
    q.text.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout
      activePage="question-bank"
      onNavigate={onNavigate}
      title="Question Bank"
      subtitle="Manage and reuse questions across assessments"
      nav={teacherNav}
      user={{ name: 'Daniel Johnson', role: 'Teacher', initials: 'D' }}
    >
      <div className="max-w-[1000px] flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Questions', value: String(questions.length) },
            { label: 'Subjects',        value: '2'                      },
            { label: 'Used in Assessments', value: '3'                  },
          ].map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-5">
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full h-10 pl-9 pr-4 border border-black/15 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
            />
          </div>
          <div className="relative">
            <select value={subject} onChange={e => setSubject(e.target.value)}
              className="h-10 pl-4 pr-10 border border-black/15 rounded-input text-sm text-foreground bg-white outline-none focus:border-primary appearance-none">
              {['All', 'Physics', 'Mathematics', 'English', 'Government'].map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
          <button
            onClick={() => onNavigate('assignment-builder')}
            className="flex items-center gap-1.5 h-10 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
          >
            <Plus size={13} /> Add Question
          </button>
        </div>

        {/* Questions list */}
        <div className="flex flex-col gap-3">
          {filtered.map(q => (
            <div key={q.id} className="bg-surface rounded-card shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-muted">{q.subject}</span>
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{q.type}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
                    {q.usedIn.length > 0 && (
                      <span className="text-xs text-muted">Used in: {q.usedIn.join(', ')}</span>
                    )}
                  </div>
                  <p className="text-sm text-foreground leading-snug">{q.text}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button className="size-8 rounded-full border border-black/10 flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors">
                    <Copy size={13} />
                  </button>
                  <button className="size-8 rounded-full border border-black/10 flex items-center justify-center text-muted hover:text-red-500 hover:border-red-300 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted">
              <Filter size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No questions match your filters.</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}
