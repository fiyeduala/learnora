import { useState } from 'react'
import { Search, Bell, MessageSquare, Calendar, Menu, ChevronDown, User, Settings, LogOut } from 'lucide-react'

type SidebarUser = { name: string; role: string; initials: string }

type Props = {
  title:        string
  subtitle?:    string
  onMenuClick:  () => void
  onNavigate?:  (page: string) => void
  user?:        SidebarUser
}

function roleNav(role: string | undefined) {
  const isTeacher = role === 'Teacher'
  const isAdmin   = role === 'School Admin'
  return {
    notifications: role === 'Super Admin' ? 'super-notifications' : 'notifications',
    messages:  isTeacher ? 'teacher-messages' : isAdmin ? 'teacher-messages' : 'messages',
    calendar:  isTeacher ? 'teacher-calendar' : isAdmin ? 'timetable'        : 'calendar',
    settings:  isTeacher ? 'teacher-settings' : isAdmin ? 'settings'         : 'settings',
  }
}

export default function TopBar({ title, subtitle, onMenuClick, onNavigate, user }: Props) {
  const [avatarOpen, setAvatarOpen] = useState(false)
  const nav     = onNavigate ?? (() => {})
  const routes  = roleNav(user?.role)

  return (
    <header className="flex items-center gap-3 md:gap-4 px-4 md:px-8 py-4 md:py-5 bg-surface border-b border-black/6 relative z-20">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-1 text-muted hover:text-foreground transition-colors shrink-0"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg md:text-2xl font-semibold text-foreground leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs md:text-sm text-muted mt-0.5 truncate">{subtitle}</p>}
      </div>

      {/* Search bar */}
      <div className="hidden md:flex items-center gap-2.5 h-11 px-4 bg-canvas border border-black/8 rounded-input w-72">
        <Search size={16} className="text-muted shrink-0" />
        <input
          type="search"
          placeholder="Search courses, lessons, or assignments"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
          onKeyDown={e => { if (e.key === 'Enter') nav('search') }}
        />
      </div>

      {/* Action icons */}
      <div className="flex items-center gap-1 md:gap-2">
        <button
          onClick={() => nav(routes.notifications)}
          className="relative p-2 text-muted hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
        </button>
        <button
          onClick={() => nav(routes.messages)}
          className="hidden sm:block p-2 text-muted hover:text-foreground transition-colors"
          aria-label="Messages"
        >
          <MessageSquare size={20} />
        </button>
        <button
          onClick={() => nav(routes.calendar)}
          className="hidden sm:block p-2 text-muted hover:text-foreground transition-colors"
          aria-label="Calendar"
        >
          <Calendar size={20} />
        </button>

        {/* Avatar + dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => setAvatarOpen(p => !p)}
            className="flex items-center gap-1.5"
            aria-label="Account menu"
          >
            <div className="size-9 md:size-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.initials ?? 'U'}
            </div>
            <ChevronDown
              size={14}
              className={`hidden md:block text-muted transition-transform duration-200 ${avatarOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {avatarOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setAvatarOpen(false)} />
              <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-card shadow-xl border border-black/8 py-1.5 z-50">
                {user && (
                  <div className="px-4 py-3 border-b border-black/6">
                    <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.role}</p>
                  </div>
                )}
                {([
                  { label: 'View Profile', icon: User,     page: 'profile-settings', danger: false },
                  { label: 'Settings',     icon: Settings, page: routes.settings,    danger: false },
                  { label: 'Log out',      icon: LogOut,   page: 'logout',           danger: true  },
                ] satisfies { label: string; icon: typeof User; page: string; danger: boolean }[]).map(item => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.label}
                      onClick={() => { setAvatarOpen(false); nav(item.page) }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-canvas transition-colors text-left ${item.danger ? 'text-red-500' : 'text-foreground'}`}
                    >
                      <Icon size={14} className="shrink-0" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
