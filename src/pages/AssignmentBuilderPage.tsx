import { useState } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type QType = 'multiple-choice' | 'short-answer' | 'essay'

type Question = {
  id: number
  type: QType
  text: string
  options: string[]
  answer: number
}

let nextId = 2

export default function AssignmentBuilderPage({ onNavigate }: Props) {
  const [title, setTitle]           = useState('')
  const [subject, setSubject]       = useState('Physics 101')
  const [classGroup, setClassGroup] = useState('SS1A')
  const [deadline, setDeadline]     = useState('')
  const [instructions, setInstructions] = useState('')
  const [questions, setQuestions]   = useState<Question[]>([
    { id: 1, type: 'multiple-choice', text: '', options: ['', '', '', ''], answer: 0 },
  ])

  function addQuestion(type: QType) {
    setQuestions(qs => [...qs, { id: nextId++, type, text: '', options: ['', '', '', ''], answer: 0 }])
  }

  function removeQuestion(id: number) {
    setQuestions(qs => qs.filter(q => q.id !== id))
  }

  function updateText(id: number, text: string) {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, text } : q))
  }

  function updateOption(id: number, idx: number, val: string) {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, options: q.options.map((o, i) => i === idx ? val : o) } : q))
  }

  const subjects = ['Physics 101', 'Mathematics', 'English', 'Government', 'Chemistry']
  const classes  = ['SS1A', 'SS1B', 'SS2A', 'SS2B', 'SS3A', 'SS3B']

  return (
    <DashboardLayout
      activePage="teacher-assignments"
      onNavigate={onNavigate}
      title="Assignment Builder"
      subtitle="Create a new assignment for your students"
      nav={teacherNav}
      user={{ name: 'Daniel Johnson', role: 'Teacher', initials: 'D' }}
    >
      <div className="max-w-[860px] flex flex-col gap-6">

        {/* Assignment info */}
        <div className="bg-surface rounded-card shadow-sm p-6 flex flex-col gap-5">
          <h2 className="text-base font-bold text-foreground">Assignment Details</h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">Title</label>
            <input
              value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Newton's Laws Quiz"
              className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">Subject</label>
              <div className="relative">
                <select value={subject} onChange={e => setSubject(e.target.value)}
                  className="w-full h-12 pl-4 pr-10 border border-black/20 rounded-input text-sm text-foreground bg-white outline-none focus:border-primary appearance-none">
                  {subjects.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">Class</label>
              <div className="relative">
                <select value={classGroup} onChange={e => setClassGroup(e.target.value)}
                  className="w-full h-12 pl-4 pr-10 border border-black/20 rounded-input text-sm text-foreground bg-white outline-none focus:border-primary appearance-none">
                  {classes.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">Due Date</label>
            <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)}
              className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground outline-none focus:border-primary" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">Instructions (optional)</label>
            <textarea value={instructions} onChange={e => setInstructions(e.target.value)}
              rows={3} placeholder="Add any instructions or notes for students..."
              className="px-4 py-3 border border-black/20 rounded-card text-sm text-foreground placeholder:text-muted outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-foreground">Questions</h2>

          {questions.map((q, qi) => (
            <div key={q.id} className="bg-surface rounded-card shadow-sm p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted">Question {qi + 1}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full capitalize">
                    {q.type.replace('-', ' ')}
                  </span>
                  {questions.length > 1 && (
                    <button onClick={() => removeQuestion(q.id)} className="text-muted hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={q.text} onChange={e => updateText(q.id, e.target.value)}
                rows={2} placeholder="Enter your question..."
                className="px-4 py-3 border border-black/20 rounded-card text-sm text-foreground placeholder:text-muted outline-none focus:border-primary resize-none"
              />

              {q.type === 'multiple-choice' && (
                <div className="grid grid-cols-2 gap-3">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <button
                        onClick={() => setQuestions(qs => qs.map(qu => qu.id === q.id ? { ...qu, answer: oi } : qu))}
                        className={`size-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                          q.answer === oi ? 'border-primary bg-primary' : 'border-black/20'
                        }`}
                      >
                        {q.answer === oi && <span className="size-1.5 rounded-full bg-white" />}
                      </button>
                      <input
                        value={opt} onChange={e => updateOption(q.id, oi, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                        className="flex-1 h-9 px-3 border border-black/15 rounded-md text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Add question buttons */}
          <div className="flex flex-wrap gap-2">
            {(['multiple-choice', 'short-answer', 'essay'] as QType[]).map(t => (
              <button key={t} onClick={() => addQuestion(t)}
                className="flex items-center gap-1.5 h-9 px-4 border border-dashed border-black/25 rounded-pill text-xs font-semibold text-muted hover:border-primary hover:text-primary transition-colors capitalize">
                <Plus size={13} /> {t.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('teacher-assignments')}
            className="h-12 px-6 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
          >
            Publish Assignment
          </button>
          <button className="h-12 px-6 border border-black/20 text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
            Save as Draft
          </button>
        </div>

      </div>
    </DashboardLayout>
  )
}
