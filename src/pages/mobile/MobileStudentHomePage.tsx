import { Bell, Sparkles, ChevronRight } from 'lucide-react'
import MobileLayout, { studentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

type ClassItem = { name: string; subject: string; time: string; color: string }
type CourseItem = { title: string; sub: string; teacher: string; color: string }

const todaysClasses: ClassItem[] = []

const continueLearning: CourseItem[] = []

export default function MobileStudentHomePage({ onNavigate }: Props) {
  return (
    <MobileLayout activePage="m/home" onNavigate={onNavigate} nav={studentMobileNav}>
      <div className="px-5 pt-6 pb-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">D</div>
            <div>
              <p className="text-sm text-muted">Good Morning, <span className="font-bold text-foreground">David</span></p>
              <p className="text-xs text-muted/70">SS2 Science</p>
            </div>
          </div>
          <button className="size-9 rounded-full border border-black/10 flex items-center justify-center">
            <Bell size={16} className="text-foreground" />
          </button>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mb-5">
          {[
            { label: 'GPA',        value: '—', trend: '' },
            { label: 'Class Rank', value: '—', trend: '' },
            { label: 'Class',      value: '—', trend: '' },
          ].map(stat => (
            <div key={stat.label} className="flex-1 bg-canvas rounded-2xl px-3 py-2.5">
              <p className="text-[10px] text-muted mb-0.5">{stat.label}</p>
              <p className="text-base font-bold text-foreground">{stat.value}</p>
              {stat.trend && <span className="text-[10px] text-green-600">{stat.trend}</span>}
            </div>
          ))}
        </div>

        {/* Learnora AI Banner */}
        <button
          onClick={() => onNavigate('ai-tutor')}
          className="w-full bg-primary rounded-2xl p-4 flex items-center justify-between mb-6"
        >
          <div className="text-left">
            <p className="text-sm font-bold text-white">Learnora AI</p>
            <p className="text-xs text-white/70">Your smart academic assistant</p>
          </div>
          <div className="size-9 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
        </button>

        {/* Today's Classes */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-bold text-foreground">Today's classes</p>
          <button className="text-xs text-primary font-medium">View all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 mb-6 scrollbar-none">
          {todaysClasses.length === 0
            ? <div className="py-4 text-sm text-muted">No data yet.</div>
            : todaysClasses.map((cls, i) => (
              <div key={i} className="shrink-0 w-36 rounded-2xl overflow-hidden border border-black/6">
                <div className={`h-20 ${cls.color} flex items-center justify-center`}>
                  <div className="size-10 rounded-full bg-white/50 flex items-center justify-center text-xs font-bold text-foreground">
                    {cls.name.charAt(0)}{cls.name.split(' ')[1]?.charAt(0)}
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-foreground truncate">{cls.name}</p>
                  <p className="text-[10px] text-muted">{cls.subject}</p>
                  <p className="text-[10px] text-muted">{cls.time}</p>
                </div>
              </div>
            ))
          }
        </div>

        {/* Continue Learning */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-bold text-foreground">Continue Learning</p>
          <button className="text-xs text-primary font-medium">View all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {continueLearning.length === 0
            ? <div className="py-4 text-sm text-muted">No data yet.</div>
            : continueLearning.map((course, i) => (
              <button
                key={i}
                onClick={() => onNavigate('m/lesson')}
                className="shrink-0 w-40 rounded-2xl overflow-hidden border border-black/6 text-left"
              >
                <div className={`h-24 ${course.color} flex items-center justify-center`}>
                  <p className="text-white font-bold text-lg">{course.title}</p>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-foreground">{course.sub}</p>
                  <p className="text-[10px] text-muted mt-0.5 truncate">{course.teacher}</p>
                </div>
                <div className="px-2.5 pb-2.5">
                  <div className="flex items-center gap-1 bg-primary rounded-full px-3 py-1 w-fit">
                    <span className="text-[10px] text-white font-medium">Resume</span>
                    <ChevronRight size={10} className="text-white" />
                  </div>
                </div>
              </button>
            ))
          }
        </div>

      </div>
    </MobileLayout>
  )
}
