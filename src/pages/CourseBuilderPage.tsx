import { useState } from 'react'
import { Plus, GripVertical, Trash2, ChevronDown, Eye } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type Module = { id: number; title: string; lessons: string[] }

let nextId = 3

export default function CourseBuilderPage({ onNavigate }: Props) {
  const [courseTitle, setCourseTitle] = useState('Physics 101')
  const [description, setDescription] = useState('')
  const [modules, setModules] = useState<Module[]>([
    { id: 1, title: 'Module 1: Introduction', lessons: ['What is Physics?', 'Scientific Notation'] },
    { id: 2, title: 'Module 2: Mechanics',    lessons: ["Newton's Laws",     'Forces & Friction']  },
  ])

  function addModule() {
    setModules(ms => [...ms, { id: nextId++, title: `Module ${nextId - 1}: New Module`, lessons: [] }])
  }

  function addLesson(moduleId: number) {
    setModules(ms => ms.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, 'New Lesson'] } : m))
  }

  function removeModule(id: number) {
    setModules(ms => ms.filter(m => m.id !== id))
  }

  function updateModuleTitle(id: number, title: string) {
    setModules(ms => ms.map(m => m.id === id ? { ...m, title } : m))
  }

  return (
    <DashboardLayout
      activePage="classes"
      onNavigate={onNavigate}
      title="Course Builder"
      subtitle="Build and organise your course content"
      nav={teacherNav}
      user={{ name: 'Daniel Johnson', role: 'Teacher', initials: 'D' }}
    >
      <div className="max-w-[900px] flex flex-col gap-6">

        {/* Course info */}
        <div className="bg-surface rounded-card shadow-sm p-6 flex flex-col gap-5">
          <h2 className="text-base font-bold text-foreground">Course Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">Course Title</label>
              <input value={courseTitle} onChange={e => setCourseTitle(e.target.value)}
                className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">Target Class</label>
              <div className="relative">
                <select className="w-full h-12 pl-4 pr-10 border border-black/20 rounded-input text-sm text-foreground bg-white outline-none focus:border-primary appearance-none">
                  {['SS1A', 'SS1B', 'SS2A', 'SS2B', 'SS3A'].map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">Course Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              rows={3} placeholder="Describe what students will learn in this course..."
              className="px-4 py-3 border border-black/20 rounded-card text-sm text-foreground placeholder:text-muted outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Modules */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Course Modules</h2>
            <button onClick={addModule} className="flex items-center gap-1.5 h-9 px-4 bg-primary text-white text-xs font-semibold rounded-pill hover:bg-primary-deep transition-colors">
              <Plus size={13} /> Add Module
            </button>
          </div>

          {modules.map((mod) => (
            <div key={mod.id} className="bg-surface rounded-card shadow-sm overflow-hidden">
              {/* Module header */}
              <div className="flex items-center gap-3 px-5 py-4 bg-canvas/60 border-b border-black/6">
                <GripVertical size={16} className="text-muted/40 shrink-0 cursor-grab" />
                <input
                  value={mod.title} onChange={e => updateModuleTitle(mod.id, e.target.value)}
                  className="flex-1 text-sm font-semibold text-foreground bg-transparent outline-none border-b border-transparent focus:border-primary"
                />
                <button onClick={() => removeModule(mod.id)} className="text-muted hover:text-red-500 transition-colors shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Lessons */}
              <div className="px-5 py-3 flex flex-col gap-2">
                {mod.lessons.map((lesson, li) => (
                  <div key={li} className="flex items-center gap-3 p-2.5 rounded-card bg-canvas/40 group">
                    <GripVertical size={14} className="text-muted/30 shrink-0 cursor-grab" />
                    <span className="text-sm text-foreground flex-1">{lesson}</span>
                    <button className="text-muted/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addLesson(mod.id)}
                  className="flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors mt-1 px-2.5"
                >
                  <Plus size={12} /> Add lesson
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => onNavigate('lesson-upload')} className="flex items-center gap-2 h-12 px-6 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary">
            <Plus size={14} /> Upload Lesson Content
          </button>
          <button className="flex items-center gap-2 h-12 px-6 border border-black/20 text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
            <Eye size={14} /> Preview Course
          </button>
        </div>

      </div>
    </DashboardLayout>
  )
}
