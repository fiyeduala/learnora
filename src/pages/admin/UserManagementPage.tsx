import { useState, useEffect } from 'react'
import { Search, Plus, Download, MoreHorizontal, Mail, UserX, Trash2, X, CheckCircle2, ChevronDown, Copy, Link } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../components/shared/Toast'

type Props = { onNavigate: (page: string) => void }
type RoleFilter = 'All' | 'Student' | 'Teacher' | 'Parent'

interface ProfileRow {
  id: string
  full_name: string | null
  email: string | null
  role: 'student' | 'teacher' | 'parent' | 'admin' | 'super_admin'
  is_active: boolean
  created_at: string
  class_enrollments?: { classes: { name: string } | null }[]
}

interface NewUser {
  full_name: string
  email: string
  phone: string
  role: 'Student' | 'Teacher' | 'Parent'
}

export default function UserManagementPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const { toast }   = useToast()
  const schoolId    = profile?.school_id

  const [users,     setUsers]     = useState<ProfileRow[]>([])
  const [classes,   setClasses]   = useState<{ id: string; name: string }[]>([])
  const [loading,   setLoading]   = useState(true)
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All')
  const [search,    setSearch]    = useState('')
  const [selected,  setSelected]  = useState<Set<string>>(new Set())

  const [showModal, setShowModal] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [inviteLink, setInviteLink] = useState('')
  const [savedUser, setSavedUser] = useState<NewUser | null>(null)
  const [classId,   setClassId]   = useState('')
  const [newUser,   setNewUser]   = useState<NewUser>({ full_name: '', email: '', phone: '', role: 'Student' })

  useEffect(() => { if (schoolId) loadAll() }, [schoolId])

  async function loadAll() {
    setLoading(true)
    await Promise.all([loadUsers(), loadClasses()])
    setLoading(false)
  }

  async function loadUsers() {
    const { data } = await supabase
      .from('profiles')
      .select(`id, full_name, email, role, is_active, created_at,
               class_enrollments(classes(name))`)
      .eq('school_id', schoolId!)
      .in('role', ['student', 'teacher', 'parent'])
      .order('created_at', { ascending: false })
    setUsers((data as unknown as ProfileRow[]) ?? [])
  }

  async function loadClasses() {
    const { data } = await supabase.from('classes').select('id, name').eq('school_id', schoolId!).order('name')
    setClasses(data ?? [])
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!schoolId) return
    setSaving(true)
    try {
      const { data: inv, error } = await supabase
        .from('invitations')
        .insert({
          school_id: schoolId,
          email: newUser.email || null,
          full_name: newUser.full_name,
          role: newUser.role.toLowerCase(),
          class_id: classId || null,
        })
        .select('token')
        .single()
      if (error) throw error

      const link = `${window.location.origin}/invite?token=${inv.token}`
      setInviteLink(link)
      setSavedUser(newUser)
    } catch (err: unknown) {
      toast((err as Error).message ?? 'Failed to create invitation', 'error')
    } finally {
      setSaving(false)
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(inviteLink)
    toast('Invite link copied!', 'success')
  }

  function resetModal() {
    setShowModal(false)
    setInviteLink('')
    setSavedUser(null)
    setClassId('')
    setNewUser({ full_name: '', email: '', phone: '', role: 'Student' })
  }

  const dbRoleMap: Record<RoleFilter, string | null> = {
    All: null, Student: 'student', Teacher: 'teacher', Parent: 'parent',
  }

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'All' || u.role === dbRoleMap[roleFilter]
    const matchSearch = (u.full_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
                        (u.email ?? '').toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  function toggle(id: string) {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }
  function toggleAll() {
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(u => u.id)))
  }
  const allChecked = filtered.length > 0 && selected.size === filtered.length

  const counts = {
    students: users.filter(u => u.role === 'student').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    parents:  users.filter(u => u.role === 'parent').length,
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })

  function getClassLabel(u: ProfileRow) {
    if (u.role === 'teacher') return 'Teacher'
    if (u.role === 'parent')  return 'Parent'
    const enrollment = u.class_enrollments?.[0]
    return enrollment?.classes?.name ?? '—'
  }

  const sidebarUser = profileToSidebarUser(profile)

  return (
    <DashboardLayout
      activePage="user-management"
      onNavigate={onNavigate}
      title="User Management"
      subtitle="Manage students, teachers, and parents"
      nav={adminNav}
      user={sidebarUser}
    >
      <div className="max-w-[1200px] flex flex-col gap-5">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {[
            { label: 'Students', value: loading ? '—' : String(counts.students), color: 'text-primary' },
            { label: 'Teachers', value: loading ? '—' : String(counts.teachers), color: 'text-teal-600' },
            { label: 'Parents',  value: loading ? '—' : String(counts.parents),  color: 'text-foreground' },
          ].map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-4 md:p-5">
              <p className={`text-2xl md:text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 bg-primary/8 border border-primary/20 rounded-card px-4 py-3 flex-wrap">
            <span className="text-sm font-semibold text-primary">{selected.size} selected</span>
            <div className="flex gap-2 ml-auto flex-wrap">
              <button className="flex items-center gap-1.5 h-8 px-3 bg-white border border-black/15 rounded-full text-xs font-semibold text-foreground hover:border-amber-400 hover:text-amber-600 transition-colors">
                <UserX size={12} /> Deactivate
              </button>
              <button className="flex items-center gap-1.5 h-8 px-3 bg-white border border-red-200 rounded-full text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 size={12} /> Remove
              </button>
              <button onClick={() => setSelected(new Set())} className="h-8 w-8 flex items-center justify-center text-muted hover:text-foreground rounded-full hover:bg-white transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full h-10 pl-9 pr-4 border border-black/15 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary" />
          </div>
          <div className="flex gap-1 bg-canvas rounded-card p-1">
            {(['All', 'Student', 'Teacher', 'Parent'] as RoleFilter[]).map(r => (
              <button key={r} onClick={() => { setRoleFilter(r); setSelected(new Set()) }}
                className={`px-3 h-8 text-xs font-semibold rounded-md transition-colors ${roleFilter === r ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}>
                {r}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 h-10 px-3 border border-black/15 rounded-pill text-sm text-muted hover:text-foreground transition-colors">
            <Download size={13} /> <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => onNavigate('invite-users')}
            className="flex items-center gap-1.5 h-10 px-4 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors">
            <Mail size={13} /> <span className="hidden sm:inline">Bulk Invite</span>
          </button>
          <button onClick={() => { setShowModal(true); setInviteLink('') }}
            className="flex items-center gap-1.5 h-10 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary">
            <Plus size={13} /> Add User
          </button>
        </div>

        {/* Table */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-black/6 bg-canvas/40">
                  <th className="px-4 md:px-6 py-3 w-10">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="accent-primary" />
                  </th>
                  {['Name', 'Role', 'Class / Dept', 'Email', 'Status', 'Joined', ''].map(h => (
                    <th key={h} className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-muted">Loading users...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-muted">
                    {search || roleFilter !== 'All' ? 'No users match your search.' : 'No users yet. Add your first user to get started.'}
                  </td></tr>
                ) : filtered.map(u => (
                  <tr key={u.id} className={`border-b border-black/4 last:border-0 hover:bg-canvas/40 transition-colors ${selected.has(u.id) ? 'bg-primary/[0.03]' : ''}`}>
                    <td className="px-4 md:px-6 py-3.5">
                      <input type="checkbox" checked={selected.has(u.id)} onChange={() => toggle(u.id)} className="accent-primary" />
                    </td>
                    <td className="px-4 md:px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {(u.full_name ?? u.email ?? '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground">{u.full_name || u.email || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        u.role === 'student' ? 'bg-primary/10 text-primary' :
                        u.role === 'teacher' ? 'bg-teal-50 text-teal-700' :
                        'bg-canvas text-muted border border-black/10'
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-4 md:px-6 py-3.5 text-muted text-sm">{getClassLabel(u)}</td>
                    <td className="px-4 md:px-6 py-3.5 text-muted text-xs hidden md:table-cell">{u.email ?? '—'}</td>
                    <td className="px-4 md:px-6 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-xs ${u.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3.5 text-muted text-xs hidden sm:table-cell">{formatDate(u.created_at)}</td>
                    <td className="px-4 md:px-6 py-3.5">
                      <button className="text-muted hover:text-foreground transition-colors"><MoreHorizontal size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={resetModal} />
          <div className="relative z-10 bg-white rounded-card shadow-xl w-full max-w-[480px] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/8">
              <h2 className="text-base font-bold text-foreground">{inviteLink ? 'Invite Created' : 'Add New User'}</h2>
              <button onClick={resetModal} className="text-muted hover:text-foreground transition-colors"><X size={18} /></button>
            </div>

            {inviteLink ? (
              <div className="p-6">
                <div className="size-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground text-center mb-1">{savedUser?.full_name} invited!</h3>
                <p className="text-sm text-muted text-center mb-5">Share this link with them to set up their account.</p>

                <div className="bg-canvas rounded-card p-3 flex items-center gap-2 mb-4">
                  <Link size={13} className="text-muted shrink-0" />
                  <span className="text-xs text-foreground flex-1 truncate">{inviteLink}</span>
                  <button onClick={copyLink} className="shrink-0 text-primary hover:text-primary-deep transition-colors">
                    <Copy size={14} />
                  </button>
                </div>

                <button onClick={copyLink}
                  className="w-full h-10 bg-primary/8 text-primary text-sm font-semibold rounded-pill hover:bg-primary/15 transition-colors mb-3">
                  Copy Invite Link
                </button>

                <div className="flex gap-3">
                  <button onClick={() => { setInviteLink(''); setSavedUser(null); setNewUser({ full_name: '', email: '', phone: '', role: 'Student' }); setClassId('') }}
                    className="flex-1 h-10 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors">
                    Add Another
                  </button>
                  <button onClick={() => { resetModal(); loadUsers() }} className="flex-1 h-10 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors">
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Full Name <span className="text-red-500">*</span></label>
                  <input required value={newUser.full_name} onChange={e => setNewUser(u => ({ ...u, full_name: e.target.value }))}
                    placeholder="e.g. Amara Okafor"
                    className="h-10 px-3 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Role <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select value={newUser.role} onChange={e => setNewUser(u => ({ ...u, role: e.target.value as NewUser['role'] }))}
                        className="w-full h-10 pl-3 pr-8 border border-black/20 rounded-input text-sm text-foreground bg-white outline-none focus:border-primary appearance-none">
                        {(['Student','Teacher','Parent'] as const).map(r => <option key={r}>{r}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                    </div>
                  </div>

                  {newUser.role === 'Student' && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-foreground">Class</label>
                      <div className="relative">
                        <select value={classId} onChange={e => setClassId(e.target.value)}
                          className="w-full h-10 pl-3 pr-8 border border-black/20 rounded-input text-sm text-foreground bg-white outline-none focus:border-primary appearance-none">
                          <option value="">— Select —</option>
                          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Email Address <span className="text-muted text-xs font-normal">(optional)</span></label>
                  <input type="email" value={newUser.email} onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))}
                    placeholder="user@school.edu"
                    className="h-10 px-3 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary" />
                  <p className="text-xs text-muted">An invite link will be generated. Share it with the user so they can set up their account.</p>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={resetModal}
                    className="h-10 px-5 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 h-10 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary disabled:opacity-50">
                    {saving ? 'Creating...' : 'Create Invite Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
