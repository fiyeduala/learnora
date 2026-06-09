import { useState } from 'react'
import { Plus, Trash2, Save, CheckCircle2, GripVertical, ChevronDown } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }
type QType = 'mcq' | 'truefalse' | 'short'

interface Question {
  id:       number
  type:     QType
  prompt:   string
  options:  string[]
  answer:   number | boolean | string
  points:   number
}

const initQuestions: Question[] = [
  { id: 1, type: 'mcq',       prompt: "Which of Newton's laws states F = ma?",       options: ['First Law', 'Second Law', 'Third Law', 'Law of Gravity'], answer: 1,    points: 2 },
  { id: 2, type: 'truefalse', prompt: 'Velocity is a scalar quantity.',               options: [],                                                         answer: false, points: 1 },
  { id: 3, type: 'mcq',       prompt: 'What is the SI unit of force?',               options: ['Joule', 'Watt', 'Newton', 'Pascal'],                      answer: 2,    points: 2 },
  { id: 4, type: 'short',     prompt: 'State the law of conservation of momentum.', options: [],                                                          answer: '',    points: 5 },
]

const typeLabels: Record<QType, string> = {
  mcq:       'Multiple Choice',
  truefalse: 'True / False',
  short:     'Short Answer',
}

export default function QuizBuilderPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [title,     setTitle]     = useState('Physics — End of Topic Quiz')
  const [subject,   setSubject]   = useState('Physics')
  const [timeLimit, setTimeLimit] = useState(30)
  const [questions, setQuestions] = useState<Question[]>(initQuestions)
  const [expanded,  setExpanded]  = useState<number | null>(1)
  const [saved,     setSaved]     = useState(false)

  const totalPoints = questions.reduce((s, q) => s + q.points, 0)

  function addQuestion(type: QType) {
    const q: Question = {
      id:      Date.now(),
      type,
      prompt:  '',
      options: type === 'mcq' ? ['Option A', 'Option B', 'Option C', 'Option D'] : [],
      answer:  type === 'mcq' ? 0 : type === 'truefalse' ? true : '',
      points:  type === 'short' ? 5 : 2,
    }
    setQuestions(prev => [...prev, q])
    setExpanded(q.id)
  }

  function deleteQuestion(id: number) {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  function updateQuestion(id: number, patch: Partial<Question>) {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q))
  }

  function updateOption(qId: number, i: number, val: string) {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q
      const opts = [...q.options]
      opts[i] = val
      return { ...q, options: opts }
    }))
  }

  return (
    <DashboardLayout
      activePage="teacher-assignments"
      onNavigate={onNavigate}
      title="Quiz Builder"
      subtitle="Create and configure quizzes for your students"
      nav={teacherNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="flex flex-col gap-5 max-w-[820px]">

        {/* Quiz settings */}
        <div className="bg-surface rounded-card shadow-sm p-5 flex flex-col gap-4">
          <p className="text-sm font-bold text-foreground">Quiz Settings</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="text-xs font-semibold text-muted mb-1 block">Quiz Title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full h-9 px-3 border border-black/20 rounded-card text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted mb-1 block">Subject</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full h-9 px-3 border border-black/20 rounded-card text-sm outline-none focus:border-primary"
              >
                {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language', 'Economics'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted mb-1 block">Time Limit (min)</label>
              <input
                type="number"
                value={timeLimit}
                onChange={e => setTimeLimit(Number(e.target.value))}
                min={5}
                max={180}
                className="w-full h-9 px-3 border border-black/20 rounded-card text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted pt-1 border-t border-black/6">
            <span>{questions.length} questions</span>
            <span>·</span>
            <span>{totalPoints} total points</span>
            <span>·</span>
            <span>{timeLimit} min time limit</span>
          </div>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-3">
          {questions.map((q, qi) => {
            const open = expanded === q.id
            return (
              <div key={q.id} className="bg-surface rounded-card shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpanded(open ? null : q.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-canvas/50 transition-colors"
                >
                  <GripVertical size={14} className="text-muted shrink-0" />
                  <span className="text-xs font-bold text-muted w-6 shrink-0">Q{qi + 1}</span>
                  <p className="flex-1 text-sm font-semibold text-foreground truncate">{q.prompt || 'Untitled question'}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold bg-canvas text-muted px-2 py-0.5 rounded-full">{typeLabels[q.type]}</span>
                    <span className="text-xs text-muted">{q.points}pt</span>
                    <ChevronDown size={14} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {open && (
                  <div className="px-5 pb-5 border-t border-black/6 flex flex-col gap-4 pt-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-muted mb-1 block">Question</label>
                        <textarea
                          value={q.prompt}
                          onChange={e => updateQuestion(q.id, { prompt: e.target.value })}
                          rows={2}
                          className="w-full resize-none border border-black/20 rounded-card p-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="w-20">
                        <label className="text-xs font-semibold text-muted mb-1 block">Points</label>
                        <input
                          type="number"
                          value={q.points}
                          min={1}
                          onChange={e => updateQuestion(q.id, { points: Number(e.target.value) })}
                          className="w-full h-9 px-2 border border-black/20 rounded-card text-sm outline-none focus:border-primary text-center"
                        />
                      </div>
                    </div>

                    {q.type === 'mcq' && (
                      <div>
                        <label className="text-xs font-semibold text-muted mb-2 block">Options (click radio to mark correct answer)</label>
                        <div className="flex flex-col gap-2">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`q${q.id}`}
                                checked={q.answer === oi}
                                onChange={() => updateQuestion(q.id, { answer: oi })}
                                className="accent-primary shrink-0"
                              />
                              <input
                                value={opt}
                                onChange={e => updateOption(q.id, oi, e.target.value)}
                                className="flex-1 h-8 px-3 border border-black/20 rounded-card text-sm outline-none focus:border-primary"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {q.type === 'truefalse' && (
                      <div className="flex gap-3">
                        {([true, false] as boolean[]).map(v => (
                          <button
                            key={String(v)}
                            onClick={() => updateQuestion(q.id, { answer: v })}
                            className={`flex-1 h-9 rounded-card border-2 text-sm font-semibold transition-all ${q.answer === v ? 'border-primary bg-primary/8 text-primary' : 'border-black/15 text-muted'}`}
                          >
                            {v ? 'True' : 'False'}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === 'short' && (
                      <div>
                        <label className="text-xs font-semibold text-muted mb-1 block">Model Answer (shown after submission)</label>
                        <textarea
                          value={q.answer as string}
                          onChange={e => updateQuestion(q.id, { answer: e.target.value })}
                          rows={2}
                          placeholder="Enter expected answer…"
                          className="w-full resize-none border border-black/20 rounded-card p-2.5 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-semibold"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Add question */}
        <div className="flex gap-2 flex-wrap">
          {(['mcq', 'truefalse', 'short'] as QType[]).map(t => (
            <button
              key={t}
              onClick={() => addQuestion(t)}
              className="flex items-center gap-1.5 h-9 px-4 border border-dashed border-black/25 rounded-full text-xs font-semibold text-muted hover:border-primary hover:text-primary transition-colors"
            >
              <Plus size={12} /> {typeLabels[t]}
            </button>
          ))}
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}
            className="flex items-center gap-2 h-11 px-6 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
          >
            <Save size={15} /> Save Quiz
          </button>
          <button className="h-11 px-6 border border-black/20 rounded-pill text-sm font-semibold text-foreground hover:bg-canvas transition-colors">
            Preview
          </button>
          {saved && <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold"><CheckCircle2 size={15} /> Saved!</span>}
        </div>
      </div>
    </DashboardLayout>
  )
}
