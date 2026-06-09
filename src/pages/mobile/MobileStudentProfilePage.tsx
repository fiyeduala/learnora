import { Settings, Award, BookOpen, Flame, TrendingUp, ChevronRight, Camera } from 'lucide-react'
import MobileLayout, { studentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

const achievements = [
  { label: 'Perfect Week',   color: 'bg-amber-50 text-amber-600'  },
  { label: 'Top Scorer',     color: 'bg-primary/10 text-primary'  },
  { label: 'Early Bird',     color: 'bg-green-50 text-green-600'  },
  { label: '10-Day Streak',  color: 'bg-red-50 text-red-500'      },
]

const courses = [
  { name: 'Physics 101',   progress: 68, color: 'bg-primary'     },
  { name: 'Mathematics',   progress: 45, color: 'bg-accent-mint' },
  { name: 'English Lang.', progress: 82, color: 'bg-amber-400'   },
]

export default function MobileStudentProfilePage({ onNavigate }: Props) {
  return (
    <MobileLayout activePage="m/profile" onNavigate={onNavigate} nav={studentMobileNav}>
      <div className="px-5 pt-5 pb-8 flex flex-col gap-5">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">My Profile</h1>
          <button
            onClick={() => onNavigate('m/settings')}
            className="size-9 rounded-full bg-canvas flex items-center justify-center"
          >
            <Settings size={18} className="text-muted" />
          </button>
        </div>

        {/* Avatar + info */}
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="relative">
            <div className="size-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-primary">
              O
            </div>
            <button className="absolute bottom-0 right-0 size-7 rounded-full bg-white shadow flex items-center justify-center border border-black/8">
              <Camera size={13} className="text-muted" />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-foreground">Olive Princely</h2>
            <p className="text-sm text-muted">SS1A · Greenfield Academy</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'GPA',        value: '4.3',  Icon: TrendingUp, color: 'text-primary'    },
            { label: 'Attendance', value: '91%',  Icon: Award,      color: 'text-green-500'  },
            { label: 'Streak',     value: '12d',  Icon: Flame,      color: 'text-red-500'    },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-surface rounded-2xl p-4 text-center shadow-sm">
              <Icon size={18} className={`${color} mx-auto mb-1`} />
              <p className="text-lg font-bold text-foreground">{value}</p>
              <p className="text-[10px] text-muted">{label}</p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="bg-surface rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground flex items-center gap-2">
              <Award size={14} className="text-amber-500" /> Achievements
            </p>
            <span className="text-xs text-primary font-semibold">4 earned</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {achievements.map((a, i) => (
              <span key={i} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${a.color}`}>
                {a.label}
              </span>
            ))}
          </div>
        </div>

        {/* Courses progress */}
        <div className="bg-surface rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground flex items-center gap-2">
              <BookOpen size={14} className="text-primary" /> My Courses
            </p>
            <button
              onClick={() => onNavigate('courses')}
              className="text-xs text-primary font-semibold flex items-center gap-0.5"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {courses.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted">{c.progress}%</p>
                </div>
                <div className="h-1.5 bg-black/8 rounded-full overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">
          {[
            { label: 'Profile Settings',     page: 'profile-settings'    },
            { label: 'Notification Settings', page: 'notif-settings'      },
            { label: 'Security',              page: 'security-settings'   },
            { label: 'Help & Support',        page: 'support'             },
          ].map(({ label, page }, i, arr) => (
            <button
              key={i}
              onClick={() => onNavigate(page)}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-foreground hover:bg-canvas transition-colors ${i < arr.length - 1 ? 'border-b border-black/6' : ''}`}
            >
              {label}
              <ChevronRight size={14} className="text-muted" />
            </button>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={() => onNavigate('login')}
          className="w-full h-12 border border-red-200 text-red-500 text-sm font-bold rounded-2xl hover:bg-red-50 transition-colors"
        >
          Sign Out
        </button>

      </div>
    </MobileLayout>
  )
}
