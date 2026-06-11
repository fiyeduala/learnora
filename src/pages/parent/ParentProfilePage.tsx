import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Pencil, Plus, Bell, FileText, MessageSquare, Calendar, User, Lock, Settings, Globe, HelpCircle, MessageCircle } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

type Props = { onNavigate: (page: string) => void }

interface Child { id: string; name: string; className: string; attendance: string }

const settingsList = [
  { label: 'Account Settings',      sub: 'Manage your personal information', page: 'parent/account-settings', icon: User     },
  { label: 'Notification Settings', sub: 'Control what alerts you receive',   page: 'notif-settings',          icon: Bell     },
  { label: 'Appearance',            sub: 'Theme and display preferences',     page: 'appearance-settings',     icon: Settings },
  { label: 'Language',              sub: 'Choose your preferred language',    page: 'parent/language',         icon: Globe    },
]
const securityList = [
  { label: 'Change Password',           page: 'security-settings', icon: Lock },
  { label: 'Two-Factor Authentication', page: 'security-settings', icon: Lock },
  { label: 'Manage Devices',            page: 'security-settings', icon: Lock },
]
const supportList = [
  { label: 'Help Centre',   page: 'support', icon: HelpCircle    },
  { label: 'Live Chat',     page: 'support', icon: MessageCircle },
  { label: 'Send Feedback', page: 'support', icon: MessageSquare },
]
const quickActions = [
  { label: 'Updates',  icon: Bell,          page: 'parent/announcements',   color: 'border-red-200 text-red-500'    },
  { label: 'Reports',  icon: FileText,      page: 'parent/report-cards',    color: 'border-blue-200 text-blue-500'  },
  { label: 'Messages', icon: MessageSquare, page: 'parent/message-teacher', color: 'border-pink-200 text-pink-500'  },
  { label: 'Calendar', icon: Calendar,      page: 'parent/calendar',        color: 'border-green-200 text-green-500' },
]

export default function ParentProfilePage({ onNavigate }: Props) {
  const { profile, signOut } = useAuth()
  const [children, setChildren] = useState<Child[]>([])

  useEffect(() => { if (profile?.id) loadChildren() }, [profile?.id])

  async function loadChildren() {
    const schoolId = profile!.school_id!
    const { data: links } = await supabase
      .from('parent_student_links')
      .select('student_id')
      .eq('parent_id', profile!.id)
      .eq('school_id', schoolId)

    const rows = (links ?? []) as { student_id: string }[]
    const items: Child[] = await Promise.all(rows.map(async row => {
      const sid = row.student_id
      const [profRes, ceRes, arRes] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', sid).maybeSingle(),
        supabase.from('class_enrollments').select('class_id, classes!class_id(name)').eq('student_id', sid).limit(1).maybeSingle(),
        supabase.from('attendance_records').select('status').eq('student_id', sid).eq('school_id', schoolId).limit(60),
      ])
      const prof = profRes.data as { full_name: string | null } | null
      const ce   = ceRes.data  as unknown as { classes: { name: string } | null } | null
      const ar   = (arRes.data ?? []) as { status: string }[]
      const present = ar.filter(r => r.status === 'present').length
      const pct = ar.length > 0 ? Math.round((present / ar.length) * 100) : 0
      return { id: sid, name: prof?.full_name ?? 'Student', className: ce?.classes?.name ?? 'N/A', attendance: `${pct}%` }
    }))
    setChildren(items)
  }

  async function handleSignOut() {
    await signOut()
    onNavigate('login')
  }

  const displayName = profile?.full_name ?? 'Parent'
  const initials = displayName.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <MobileLayout activePage="parent/profile" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-6">

        <button onClick={() => onNavigate('parent/home')} className="mb-4"><ChevronLeft size={22} /></button>

        <h1 className="text-2xl font-bold text-primary mb-1">Profile</h1>
        <p className="text-xs text-muted mb-5">Manage your account, family, and settings.</p>

        {/* User card */}
        <div className="bg-white border border-black/8 rounded-2xl p-4 mb-5 shadow-sm flex items-center gap-4">
          <div className="size-16 rounded-full bg-primary/15 flex items-center justify-center text-xl font-bold text-primary shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground">{displayName}</p>
            <button className="flex items-center gap-1.5 border border-black/12 rounded-full px-3 py-1 mt-1.5 text-xs font-medium text-foreground">
              Edit Profile <Pencil size={10} />
            </button>
          </div>
          <span className="shrink-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full">Parent</span>
        </div>

        {/* My Children */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-bold text-foreground">My Children</p>
          <button className="flex items-center gap-1 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full">
            Add <Plus size={12} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {children.length === 0 ? (
            <div className="col-span-2 text-center py-6 text-sm text-muted">No children linked yet.</div>
          ) : children.map(c => (
            <button
              key={c.id}
              onClick={() => { sessionStorage.setItem('learnora_selected_child', c.id); onNavigate('parent/progress') }}
              className="bg-white border border-black/8 rounded-2xl p-3 text-left shadow-sm"
            >
              <div className="size-8 rounded-full bg-primary/15 flex items-center justify-center text-lg mb-2">👦</div>
              <p className="text-xs font-bold text-foreground">{c.name}</p>
              <p className="text-[10px] text-muted font-semibold">{c.className}</p>
              <div className="mt-1">
                <p className="text-[9px] text-muted">Attendance</p>
                <p className="text-xs font-bold text-green-600">{c.attendance}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <p className="text-base font-bold text-foreground mb-3">Quick Actions</p>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickActions.map(a => {
            const Icon = a.icon
            return (
              <button key={a.label} onClick={() => onNavigate(a.page)} className="flex flex-col items-center gap-1.5">
                <div className={`size-14 rounded-2xl border-2 ${a.color} flex items-center justify-center`}>
                  <Icon size={22} />
                </div>
                <p className="text-[10px] font-medium text-foreground text-center">{a.label}</p>
              </button>
            )
          })}
        </div>

        {/* Settings */}
        <p className="text-base font-bold text-foreground mb-3">Settings</p>
        <div className="bg-white border border-black/8 rounded-2xl shadow-sm divide-y divide-black/4 mb-5">
          {settingsList.map(s => {
            const Icon = s.icon
            return (
              <button key={s.label} onClick={() => onNavigate(s.page)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                <div className="size-8 rounded-full bg-canvas flex items-center justify-center shrink-0"><Icon size={15} className="text-muted" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{s.label}</p>
                  <p className="text-[10px] text-muted">{s.sub}</p>
                </div>
                <ChevronRight size={14} className="text-muted shrink-0" />
              </button>
            )
          })}
        </div>

        {/* Security */}
        <p className="text-base font-bold text-foreground mb-3">Security</p>
        <div className="bg-white border border-black/8 rounded-2xl shadow-sm divide-y divide-black/4 mb-5">
          {securityList.map(s => {
            const Icon = s.icon
            return (
              <button key={s.label} onClick={() => onNavigate(s.page)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                <div className="size-8 rounded-full bg-canvas flex items-center justify-center shrink-0"><Icon size={15} className="text-muted" /></div>
                <p className="flex-1 text-sm font-semibold text-foreground">{s.label}</p>
                <ChevronRight size={14} className="text-muted shrink-0" />
              </button>
            )
          })}
        </div>

        {/* Help & Support */}
        <p className="text-base font-bold text-foreground mb-3">Help &amp; Support</p>
        <div className="bg-white border border-black/8 rounded-2xl shadow-sm divide-y divide-black/4 mb-6">
          {supportList.map(s => {
            const Icon = s.icon
            return (
              <button key={s.label} onClick={() => onNavigate(s.page)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                <div className="size-8 rounded-full bg-canvas flex items-center justify-center shrink-0"><Icon size={15} className="text-muted" /></div>
                <p className="flex-1 text-sm font-semibold text-foreground">{s.label}</p>
                <ChevronRight size={14} className="text-muted shrink-0" />
              </button>
            )
          })}
        </div>

        {/* Log Out */}
        <button onClick={handleSignOut} className="w-full h-12 bg-primary text-white text-sm font-bold rounded-full">
          Log Out
        </button>

      </div>
    </MobileLayout>
  )
}
