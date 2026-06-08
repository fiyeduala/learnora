import { useState } from 'react'
import { ChevronLeft, Play, Lock, CheckCircle2, Clock, BookOpen, Users, Star, FileText, Download, Link, Video, File } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }
type Tab = 'content' | 'resources'

type Module = { title: string; lessons: { title: string; duration: string; done: boolean }[] }

const modules: Module[] = []

type ResourceType = 'pdf' | 'video' | 'link' | 'doc'

interface Resource {
  title: string
  type: ResourceType
  size?: string
  url?: string
  module: string
}

const resources: Resource[] = []

const typeIcon: Record<ResourceType, typeof FileText> = {
  pdf:   FileText,
  video: Video,
  link:  Link,
  doc:   File,
}

const typeBg: Record<ResourceType, string> = {
  pdf:   'bg-red-50 text-red-600',
  video: 'bg-primary/10 text-primary',
  link:  'bg-teal-50 text-teal-600',
  doc:   'bg-amber-50 text-amber-600',
}

export default function CourseDetailsPage({ onNavigate }: Props) {
  const [openModule, setOpenModule] = useState<number | null>(0)
  const [tab, setTab] = useState<Tab>('content')

  const totalLessons = modules.flatMap(m => m.lessons).length
  const doneLessons  = modules.flatMap(m => m.lessons).filter(l => l.done).length
  const progress     = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0

  return (
    <DashboardLayout
      activePage="courses"
      onNavigate={onNavigate}
      title="Course Details"
      subtitle="Physics 101 — SS1A"
    >
      <div className="max-w-[1100px] flex flex-col gap-6">

        {/* Back */}
        <button
          onClick={() => onNavigate('courses')}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors w-fit"
        >
          <ChevronLeft size={16} /> Back to Courses
        </button>

        {/* Hero card */}
        <div className="bg-primary rounded-card p-6 md:p-8 flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 text-white">
            <p className="text-sm font-semibold text-white/70 mb-2">Science Department</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Physics 101</h1>
            <p className="text-sm text-white/80 mb-6 max-w-lg leading-relaxed">
              A comprehensive introduction to classical mechanics, energy, waves, and modern physics for SS1 students.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1.5"><BookOpen size={14} />{totalLessons} lessons</span>
              <span className="flex items-center gap-1.5"><Users size={14} />Mr. Daniel Johnson</span>
              <span className="flex items-center gap-1.5"><Clock size={14} />~6 hours total</span>
              <span className="flex items-center gap-1.5"><Star size={14} className="fill-amber-400 text-amber-400" />4.8</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('m/lesson')}
            className="flex items-center gap-2 h-12 px-6 bg-white text-primary text-sm font-bold rounded-pill hover:shadow-md transition-all shrink-0"
          >
            <Play size={14} className="fill-current" />
            Continue Learning
          </button>
        </div>

        {/* Progress */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">Your Progress</p>
            <p className="text-sm font-bold text-primary">{doneLessons}/{totalLessons} lessons complete</p>
          </div>
          <div className="h-3 bg-black/8 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-muted mt-2">{progress}% complete</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-canvas rounded-card p-1 w-fit">
          {([['content', 'Course Content'], ['resources', 'Resources']] as [Tab, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-5 h-9 text-sm font-semibold rounded-md transition-colors ${tab === id ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab: Course Content */}
        {tab === 'content' && (
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            {modules.length === 0
              ? <div className="py-8 text-center text-sm text-muted">No data yet.</div>
              : modules.map((mod, mi) => (
                <div key={mi} className="border-b border-black/4 last:border-0">
                  <button
                    onClick={() => setOpenModule(openModule === mi ? null : mi)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-canvas/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{mod.title}</p>
                      <p className="text-xs text-muted mt-0.5">{mod.lessons.length} lessons</p>
                    </div>
                    <ChevronLeft
                      size={16}
                      className={`text-muted transition-transform shrink-0 ${openModule === mi ? '-rotate-90' : 'rotate-180'}`}
                    />
                  </button>
                  {openModule === mi && (
                    <div className="px-6 pb-4 flex flex-col gap-1">
                      {mod.lessons.map((lesson, li) => (
                        <button
                          key={li}
                          onClick={() => !lesson.done && onNavigate('m/lesson')}
                          className="flex items-center gap-4 p-3 rounded-card hover:bg-canvas transition-colors text-left"
                        >
                          <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                            lesson.done ? 'bg-green-50' : 'bg-primary/8'
                          }`}>
                            {lesson.done
                              ? <CheckCircle2 size={16} className="text-green-600" />
                              : <Play size={12} className="text-primary fill-current" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${lesson.done ? 'text-muted line-through' : 'text-foreground'}`}>
                              {lesson.title}
                            </p>
                          </div>
                          <span className="text-xs text-muted shrink-0">{lesson.duration}</span>
                          {lesson.done && <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
                          {!lesson.done && mi > 0 && <Lock size={12} className="text-muted/40 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        )}

        {/* Tab: Resources */}
        {tab === 'resources' && (
          <div className="flex flex-col gap-3">
            {resources.length === 0
              ? <div className="py-8 text-center text-sm text-muted">No data yet.</div>
              : resources.map((r, i) => {
                const Icon = typeIcon[r.type]
                return (
                  <div key={i} className="bg-surface rounded-card shadow-sm p-4 flex items-center gap-4">
                    <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${typeBg[r.type]}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{r.title}</p>
                      <p className="text-xs text-muted mt-0.5">{r.module}{r.size ? ` · ${r.size}` : ''}</p>
                    </div>
                    {r.type === 'link' ? (
                      <button className="flex items-center gap-1.5 h-8 px-3 border border-black/15 rounded-full text-xs font-semibold text-primary hover:bg-primary/8 transition-colors shrink-0">
                        <Link size={11} /> Open
                      </button>
                    ) : (
                      <button className="flex items-center gap-1.5 h-8 px-3 border border-black/15 rounded-full text-xs font-semibold text-muted hover:text-primary hover:border-primary transition-colors shrink-0">
                        <Download size={11} /> Download
                      </button>
                    )}
                  </div>
                )
              })
            }
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
