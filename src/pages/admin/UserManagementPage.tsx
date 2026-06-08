import { useState } from 'react'
import { Search, Plus, Download, MoreHorizontal, Mail, UserX, Trash2, X, CheckCircle2, MessageSquare, ChevronDown } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }
type Role = 'All' | 'Student' | 'Teacher' | 'Parent'

interface User {
  name:   string
  role:   'Student' | 'Teacher' | 'Parent'
  class:  string
  email:  string
  status: 'Active' | 'Inactive'
  joined: string
}

const users: User[] = [
  { name: 'Olive Princely',    role: 'Student', class: 'SS1A', email: 'olive@greenfield.edu',   status: 'Active',   joined: 'Jan 2026' },
  { name: 'Yetunde Adesanya',  role: 'Student', class: 'SS1A', email: 'yetunde@greenfield.edu', status: 'Active',   joined: 'Jan 2026' },
  { name: 'Kofi Asante',       role: 'Student', class: 'SS1A', email: 'kofi@greenfield.edu',    status: 'Inactive', joined: 'Jan 2026' },
  { name: 'Mrs Nnduka Kisha',  role: 'Teacher', class: 'Math', email: 'nnduka@greenfield.edu',  status: 'Active',   joined: 'Sep 2025' },
  { name: 'Mr Daniel Johnson', role: 'Teacher', class: 'Phys', email: 'daniel@greenfield.edu',  status: 'Active',   joined: 'Sep 2025' },
  { name: 'Mrs Gloria Ewa',    role: 'Teacher', class: 'Math', email: 'gloria@greenfield.edu',  status: 'Active',   joined: 'Sep 2025' },
  { name: 'Mr Olive Senior',   role: 'Parent',  class: '—',    email: 'parent@email.com',        status: 'Active',   joined: 'Feb 2026' },
]

type DeliveryMethod = 'email' | 'sms' | 'both'

interface NewUser {
  name: string; username: string; email: string; phone: string
  role: 'Student' | 'Teacher' | 'Parent'
  class: string; delivery: DeliveryMethod
}

const classes = ['SS1A','SS1B','SS2A','SS2B','SS3A','SS3B','JSS1','JSS2','JSS3']

export default function UserManagementPage({ onNavigate }: Props) {
  const [role,     setRole]     = useState<Role>('All')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const [showAddModal, setShowAddModal] = useState(false)
  const [addDone,      setAddDone]      = useState(false)
  const [newUser, setNewUser] = useState<NewUser>({
    name: '', username: '', email: '', phone: '', role: 'Student', class: 'SS1A', delivery: 'email',
  })

  function setField<K extends keyof NewUser>(k: K, v: NewUser[K]) {
    setNewUser(u => ({ ...u, [k]: v }))
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setAddDone(true)
  }

  function closeModal() {
    setShowAddModal(false)
    setAddDone(false)
    setNewUser({ name: '', username: '', email: '', phone: '', role: 'Student', class: 'SS1A', delivery: 'email' })
  }

  const filtered = users.filter(u =>
    (role === 'All' || u.role === role) &&
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  function toggle(i: number) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((_, i) => i)))
    }
  }

  function clearSelection() { setSelected(new Set()) }

  const allChecked = filtered.length > 0 && selected.size === filtered.length

  return (
    <DashboardLayout
      activePage="user-management"
      onNavigate={onNavigate}
      title="User Management"
      subtitle="Manage students, teachers, and parents"
      nav={adminNav}
      user={{ name: 'Admin Okafor', role: 'School Admin', initials: 'A' }}
    >
      <div className="max-w-[1200px] flex flex-col gap-5">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {[
            { label: 'Students', value: '1,248', color: 'text-primary' },
            { label: 'Teachers', value: '86',    color: 'text-teal-600' },
            { label: 'Parents',  value: '934',   color: 'text-foreground' },
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
              <button className="flex items-center gap-1.5 h-8 px-3 bg-white border border-black/15 rounded-full text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors">
                <Mail size={12} /> Email Selected
              </button>
              <button className="flex items-center gap-1.5 h-8 px-3 bg-white border border-black/15 rounded-full text-xs font-semibold text-foreground hover:border-amber-400 hover:text-amber-600 transition-colors">
                <UserX size={12} /> Deactivate
              </button>
              <button className="flex items-center gap-1.5 h-8 px-3 bg-white border border-red-200 rounded-full text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 size={12} /> Remove
              </button>
              <button onClick={clearSelection} className="h-8 w-8 flex items-center justify-center text-muted hover:text-foreground rounded-full hover:bg-white transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full h-10 pl-9 pr-4 border border-black/15 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-1 bg-canvas rounded-card p-1">
            {(['All', 'Student', 'Teacher', 'Parent'] as Role[]).map(r => (
              <button
                key={r}
                onClick={() => { setRole(r); setSelected(new Set()) }}
                className={`px-3 h-8 text-xs font-semibold rounded-md transition-colors ${role === r ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 h-10 px-3 border border-black/15 rounded-pill text-sm text-muted hover:text-foreground transition-colors">
            <Download size={13} /> <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => onNavigate('invite-users')}
            className="flex items-center gap-1.5 h-10 px-4 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors"
          >
            <Mail size={13} /> <span className="hidden sm:inline">Invite</span>
          </button>
          <button
            onClick={() => { setShowAddModal(true); setAddDone(false) }}
            className="flex items-center gap-1.5 h-10 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
          >
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
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                      className="accent-primary"
                    />
                  </th>
                  {['Name', 'Role', 'Class / Dept', 'Email', 'Status', 'Joined', ''].map(h => (
                    <th key={h} className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={i}
                    className={`border-b border-black/4 last:border-0 hover:bg-canvas/40 transition-colors ${selected.has(i) ? 'bg-primary/[0.03]' : ''}`}
                  >
                    <td className="px-4 md:px-6 py-3.5">
                      <input
                        type="checkbox"
                        checked={selected.has(i)}
                        onChange={() => toggle(i)}
                        className="accent-primary"
                      />
                    </td>
                    <td className="px-4 md:px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        u.role === 'Student' ? 'bg-primary/10 text-primary' :
                        u.role === 'Teacher' ? 'bg-teal-50 text-teal-700' :
                        'bg-canvas text-muted border border-black/10'
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-4 md:px-6 py-3.5 text-muted">{u.class}</td>
                    <td className="px-4 md:px-6 py-3.5 text-muted text-xs hidden md:table-cell">{u.email}</td>
                    <td className="px-4 md:px-6 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-xs ${u.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3.5 text-muted text-xs hidden sm:table-cell">{u.joined}</td>
                    <td className="px-4 md:px-6 py-3.5">
                      <button className="text-muted hover:text-foreground transition-colors">
                        <MoreHorizontal size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Add User Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative z-10 bg-white rounded-card shadow-xl w-full max-w-[480px] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/8">
              <h2 className="text-base font-bold text-foreground">
                {addDone ? 'User Created' : 'Add New User'}
              </h2>
              <button onClick={closeModal} className="text-muted hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>

            {addDone ? (
              /* ── Success state ── */
              <div className="p-6 text-center">
                <div className="size-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{newUser.name || 'User'} added!</h3>
                <p className="text-sm text-muted mb-4 leading-relaxed">
                  Login credentials have been{' '}
                  {newUser.delivery === 'email' && <>sent to <strong>{newUser.email || 'their email'}</strong></>}
                  {newUser.delivery === 'sms'   && <>sent via SMS to <strong>{newUser.phone || 'their phone'}</strong></>}
                  {newUser.delivery === 'both'  && <>sent to <strong>{newUser.email || 'their email'}</strong> and <strong>{newUser.phone || 'their phone'}</strong></>}
                  . They can log in with their temporary password and will be prompted to change it on first sign-in.
                </p>
                <div className="bg-canvas rounded-card p-4 text-left mb-6 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-black/6">
                    <span className="text-muted">Name</span><span className="font-semibold text-foreground">{newUser.name}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-black/6">
                    <span className="text-muted">Role</span><span className="font-semibold text-foreground">{newUser.role}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-black/6">
                    <span className="text-muted">Class</span><span className="font-semibold text-foreground">{newUser.class}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted">Credentials sent via</span>
                    <span className="font-semibold text-foreground capitalize">{newUser.delivery === 'both' ? 'Email & SMS' : newUser.delivery}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setAddDone(false); setNewUser({ name: '', username: '', email: '', phone: '', role: 'Student', class: 'SS1A', delivery: 'email' }) }}
                    className="flex-1 h-10 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors"
                  >
                    Add Another
                  </button>
                  <button onClick={closeModal} className="flex-1 h-10 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors">
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleCreate} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Full Name <span className="text-red-500">*</span></label>
                  <input
                    required value={newUser.name} onChange={e => setField('name', e.target.value)}
                    placeholder="e.g. Amara Okafor"
                    className="h-10 px-3 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Username <span className="text-red-500">*</span></label>
                  <input
                    required value={newUser.username} onChange={e => setField('username', e.target.value.toLowerCase().replace(/\s/g,''))}
                    placeholder="e.g. amara.okafor"
                    className="h-10 px-3 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
                  />
                  <p className="text-xs text-muted">Used for login. Students can log in with username if they have no email.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Role <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={newUser.role}
                        onChange={e => setField('role', e.target.value as NewUser['role'])}
                        className="w-full h-10 pl-3 pr-8 border border-black/20 rounded-input text-sm text-foreground bg-white outline-none focus:border-primary appearance-none"
                      >
                        {(['Student','Teacher','Parent'] as const).map(r => <option key={r}>{r}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Class / Dept</label>
                    <div className="relative">
                      <select
                        value={newUser.class}
                        onChange={e => setField('class', e.target.value)}
                        className="w-full h-10 pl-3 pr-8 border border-black/20 rounded-input text-sm text-foreground bg-white outline-none focus:border-primary appearance-none"
                      >
                        {classes.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Email Address <span className="text-muted text-xs font-normal">(optional)</span></label>
                  <input
                    type="email" value={newUser.email} onChange={e => setField('email', e.target.value)}
                    placeholder="user@greenfield.edu"
                    className="h-10 px-3 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Phone Number</label>
                  <input
                    type="tel" value={newUser.phone} onChange={e => setField('phone', e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="h-10 px-3 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
                  />
                </div>

                {/* Credential delivery */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">Send login credentials via</label>
                  <div className="flex gap-2">
                    {([
                      { id: 'email', label: 'Email',    icon: Mail           },
                      { id: 'sms',   label: 'SMS',      icon: MessageSquare  },
                      { id: 'both',  label: 'Both',     icon: CheckCircle2   },
                    ] as const).map(opt => {
                      const Icon = opt.icon
                      const active = newUser.delivery === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setField('delivery', opt.id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-input border text-xs font-semibold transition-colors ${
                            active ? 'border-primary bg-primary/8 text-primary' : 'border-black/15 text-muted hover:border-primary/40 hover:text-foreground'
                          }`}
                        >
                          <Icon size={12} /> {opt.label}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-muted">A temporary password will be auto-generated and sent to the user. They'll be prompted to change it on first login.</p>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={closeModal}
                    className="h-10 px-5 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 h-10 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary">
                    Create &amp; Send Credentials
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
