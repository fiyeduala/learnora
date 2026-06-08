import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Clock, BookOpen, Save, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

interface Note {
  id:        number
  timestamp: string
  text:      string
}

const lessonInfo = {
  title:    "Newton's Laws of Motion",
  course:   'Physics — Module 2',
  teacher:  'Mr Adeyemi',
  duration: '30 min',
}

const initialNotes: Note[] = [
  { id: 1, timestamp: '02:14', text: "First law: An object at rest stays at rest unless acted on by an external force. Also called the law of inertia." },
  { id: 2, timestamp: '08:45', text: "Second law: F = ma. Force equals mass times acceleration. The greater the mass, the more force needed." },
  { id: 3, timestamp: '17:30', text: "Third law: Every action has an equal and opposite reaction. Rocket engines work on this principle." },
]

export default function LessonNotesPage({ onNavigate }: Props) {
  const [notes,   setNotes]   = useState<Note[]>(initialNotes)
  const [draft,   setDraft]   = useState('')
  const [stamp,   setStamp]   = useState('00:00')
  const [saved,   setSaved]   = useState(false)

  function addNote() {
    if (!draft.trim()) return
    setNotes(prev => [...prev, { id: Date.now(), timestamp: stamp, text: draft.trim() }])
    setDraft('')
  }

  function deleteNote(id: number) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <DashboardLayout
      activePage="courses"
      onNavigate={onNavigate}
      title="Lesson Notes"
      subtitle={`${lessonInfo.course} · ${lessonInfo.title}`}
    >
      <div className="max-w-[760px] flex flex-col gap-5">

        {/* Back + lesson info */}
        <button
          onClick={() => onNavigate('course-details')}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft size={14} /> Back to lesson
        </button>

        <div className="bg-surface rounded-card shadow-sm p-5 flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <BookOpen size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{lessonInfo.title}</p>
            <p className="text-xs text-muted">{lessonInfo.course} · {lessonInfo.teacher}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Clock size={12} /> {lessonInfo.duration}
          </div>
        </div>

        {/* Add note */}
        <div className="bg-surface rounded-card shadow-sm p-5 flex flex-col gap-3">
          <p className="text-xs font-bold text-muted uppercase tracking-wider">Add Note</p>
          <div className="flex gap-2 items-center">
            <label className="text-xs text-muted font-semibold shrink-0">Timestamp</label>
            <input
              value={stamp}
              onChange={e => setStamp(e.target.value)}
              placeholder="mm:ss"
              className="w-20 h-8 px-2 border border-black/20 rounded-card text-sm font-mono outline-none focus:border-primary"
            />
          </div>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote() }}
            placeholder="Type your note here… (Ctrl+Enter to add)"
            rows={3}
            className="w-full resize-none border border-black/20 rounded-card p-3 text-sm outline-none focus:border-primary"
          />
          <div className="flex justify-end">
            <button
              onClick={addNote}
              disabled={!draft.trim()}
              className="flex items-center gap-2 h-9 px-4 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep disabled:opacity-40 transition-colors"
            >
              <Plus size={14} /> Add Note
            </button>
          </div>
        </div>

        {/* Notes list */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-black/6 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">{notes.length} Notes</h2>
            <div className="flex items-center gap-2">
              {saved && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                  <CheckCircle2 size={12} /> Saved
                </span>
              )}
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 h-8 px-3 border border-black/20 rounded-full text-xs font-semibold text-foreground hover:bg-canvas transition-colors"
              >
                <Save size={12} /> Save notes
              </button>
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <BookOpen size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No notes yet. Add your first one above.</p>
            </div>
          ) : (
            <div className="divide-y divide-black/4">
              {notes.map(note => (
                <div key={note.id} className="flex items-start gap-4 px-5 py-4 group">
                  <span className="shrink-0 text-xs font-bold font-mono text-primary bg-primary/8 px-2 py-1 rounded-md mt-0.5">
                    {note.timestamp}
                  </span>
                  <p className="flex-1 text-sm text-foreground leading-relaxed">{note.text}</p>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="shrink-0 opacity-0 group-hover:opacity-100 text-muted hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
