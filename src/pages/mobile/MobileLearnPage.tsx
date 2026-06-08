import { Search, ChevronRight } from 'lucide-react'
import MobileLayout, { studentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

const subjects = [
  { name: 'Mathematics', lessons: 12, color: 'bg-blue-500' },
  { name: 'Chemistry',   lessons: 12, color: 'bg-orange-400' },
  { name: 'English',     lessons: 12, color: 'bg-green-500' },
  { name: 'Physics',     lessons: 12, color: 'bg-purple-500' },
]

const resources = [
  { label: 'Notes',         count: '24 Files',   color: 'bg-blue-100 text-blue-600' },
  { label: 'Video Lessons', count: '18 Videos',  color: 'bg-purple-100 text-purple-600' },
  { label: 'E-books',       count: '12 Lessons', color: 'bg-green-100 text-green-600' },
  { label: 'Audio Lessons', count: '12 Lessons', color: 'bg-amber-100 text-amber-600' },
]

export default function MobileLearnPage({ onNavigate }: Props) {
  return (
    <MobileLayout activePage="m/learn" onNavigate={onNavigate} nav={studentMobileNav}>
      <div className="px-5 pt-6 pb-4">

        <h1 className="text-2xl font-bold text-foreground mb-0.5">Learn</h1>
        <p className="text-xs text-muted mb-4">Continue your academic journey.</p>

        {/* Search */}
        <div className="flex items-center gap-2 h-11 px-4 bg-canvas border border-black/8 rounded-full mb-6">
          <Search size={14} className="text-muted shrink-0" />
          <input type="search" placeholder="Search, Memory, topics..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none" />
        </div>

        {/* Continue Learning */}
        <p className="text-base font-bold text-foreground mb-3">Continue Learning</p>
        <div className="flex gap-3 overflow-x-auto pb-1 mb-6 scrollbar-none">
          {[
            { title: 'Physis', sub: 'Algebra Basics', color: 'bg-slate-700' },
            { title: 'Math',   sub: 'Quadratics',     color: 'bg-primary' },
          ].map((c, i) => (
            <button key={i} onClick={() => onNavigate('m/lesson')} className={`shrink-0 ${c.color} rounded-2xl px-5 py-4 flex items-center gap-3`}>
              <p className="text-white font-bold text-base">{c.title}</p>
              <div className="bg-primary rounded-full w-7 h-7 flex items-center justify-center shrink-0">
                <ChevronRight size={12} className="text-white" />
              </div>
            </button>
          ))}
        </div>

        {/* Recommended */}
        <p className="text-base font-bold text-foreground mb-1">Recommended</p>
        <p className="text-xs text-muted mb-3">Based on your recent learning activity.</p>
        <div className="flex gap-3 overflow-x-auto pb-1 mb-6 scrollbar-none">
          {[
            { title: 'Mathematics', sub: 'Understanding Quadratic Equations', teacher: 'Mr John Bosco', color: 'bg-blue-600' },
            { title: 'Mather',      sub: 'Understanding...',                   teacher: 'Mr ...',       color: 'bg-slate-600' },
          ].map((c, i) => (
            <div key={i} className="shrink-0 w-44 rounded-2xl overflow-hidden border border-black/6">
              <div className={`h-20 ${c.color} flex items-end p-2`}>
                <span className="text-white text-xs font-semibold">{c.title}</span>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-foreground leading-tight mb-1">{c.sub}</p>
                <p className="text-[10px] text-muted">{c.teacher}</p>
                <div className="flex items-center gap-1 bg-primary rounded-full px-3 py-1 w-fit mt-2">
                  <span className="text-[10px] text-white font-medium">Resume</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* My Subjects */}
        <p className="text-base font-bold text-foreground mb-1">My Subjects</p>
        <p className="text-xs text-muted mb-3">Subjects enrolled this term.</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {subjects.map(s => (
            <div key={s.name} className="bg-canvas rounded-2xl p-3 flex items-center gap-3">
              <div className={`size-9 rounded-xl ${s.color} flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">{s.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{s.name}</p>
                <p className="text-[10px] text-muted">{s.lessons} lessons</p>
              </div>
            </div>
          ))}
        </div>

        {/* Practice Quizzes */}
        <p className="text-base font-bold text-foreground mb-3">Practice Quizzes</p>
        <div className="flex flex-col gap-3 mb-6">
          {['Mathematics Quiz', 'English Quiz'].map(q => (
            <div key={q} className="flex items-center justify-between bg-canvas rounded-2xl px-4 py-3">
              <p className="text-sm font-semibold text-foreground">{q}</p>
              <button onClick={() => onNavigate('m/quiz')} className="h-8 px-4 bg-primary text-white text-xs font-bold rounded-full">
                Start Quiz
              </button>
            </div>
          ))}
        </div>

        {/* Resources */}
        <p className="text-base font-bold text-foreground mb-3">Resources</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {resources.map(r => (
            <div key={r.label} className="bg-canvas rounded-2xl p-3">
              <div className={`size-9 rounded-xl ${r.color} flex items-center justify-center mb-2`}>
                <span className="text-sm font-bold">{r.label.charAt(0)}</span>
              </div>
              <p className="text-xs font-semibold text-foreground">{r.label}</p>
              <p className="text-[10px] text-muted">{r.count}</p>
            </div>
          ))}
        </div>

        {/* Exam prep */}
        <p className="text-base font-bold text-foreground mb-3">Revision Zone</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { label: 'WAEC Practice', sub: '500+ Exam Questions\nWAEC Syllabus Aligned', color: 'bg-red-500' },
            { label: 'JAMB Practice', sub: '500+ Exam Questions\nJAMB Syllabus Aligned', color: 'bg-blue-500' },
          ].map(e => (
            <div key={e.label} className="bg-canvas rounded-2xl p-3">
              <p className="text-xs font-bold text-foreground mb-1">{e.label}</p>
              <p className="text-[10px] text-muted mb-3 whitespace-pre-line">{e.sub}</p>
              <button className={`h-7 px-3 ${e.color} text-white text-[10px] font-bold rounded-full w-full`}>Start Practice</button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Mock Exams',    sub: '500+ Exam Questions', action: 'Explore' },
            { label: 'Past Questions', sub: 'WAEC Syllabus Aligned', action: 'Explore' },
          ].map(e => (
            <div key={e.label} className="bg-canvas rounded-2xl p-3">
              <p className="text-xs font-bold text-foreground mb-1">{e.label}</p>
              <p className="text-[10px] text-muted mb-3">{e.sub}</p>
              <button className="h-7 px-3 bg-foreground text-white text-[10px] font-bold rounded-full w-full">{e.action}</button>
            </div>
          ))}
        </div>

      </div>
    </MobileLayout>
  )
}
