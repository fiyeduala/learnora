import { useState } from 'react'
import { Plus, Trash2, Upload, Send, ChevronDown } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type Invite = { id: number; email: string; role: string; class: string }

let nextId = 3

export default function InviteUsersPage({ onNavigate }: Props) {
  const [invites, setInvites] = useState<Invite[]>([
    { id: 1, email: '', role: 'Student', class: 'SS1A' },
    { id: 2, email: '', role: 'Student', class: 'SS1A' },
  ])
  const [sent, setSent] = useState(false)

  function addRow() {
    setInvites(inv => [...inv, { id: nextId++, email: '', role: 'Student', class: 'SS1A' }])
  }

  function removeRow(id: number) {
    setInvites(inv => inv.filter(i => i.id !== id))
  }

  function update(id: number, field: keyof Invite, value: string) {
    setInvites(inv => inv.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const roles   = ['Student', 'Teacher', 'Parent']
  const classes  = ['SS1A', 'SS1B', 'SS2A', 'SS2B', 'SS3A', 'SS3B', 'JSS1', 'JSS2', 'JSS3']

  return (
    <DashboardLayout
      activePage="user-management"
      onNavigate={onNavigate}
      title="Invite Users"
      subtitle="Send email invitations to join the school platform"
      nav={adminNav}
      user={{ name: 'Admin Okafor', role: 'School Admin', initials: 'A' }}
    >
      <div className="max-w-[860px] flex flex-col gap-6">

        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-card p-8 text-center">
            <Send size={32} className="text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Invitations Sent!</h2>
            <p className="text-sm text-muted mb-6">{invites.length} invitation{invites.length > 1 ? 's' : ''} sent successfully. Recipients will receive an email to set up their accounts.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setSent(false)} className="h-11 px-5 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors">
                Send More
              </button>
              <button onClick={() => onNavigate('user-management')} className="h-11 px-5 border border-black/20 text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
                View Users
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* CSV option */}
            <div className="bg-canvas border-2 border-dashed border-black/20 rounded-card p-6 flex flex-col items-center gap-3">
              <Upload size={22} className="text-muted" />
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Bulk invite via CSV</p>
                <p className="text-xs text-muted mt-1">Upload a CSV file with columns: email, role, class</p>
              </div>
              <button className="h-9 px-4 border border-black/20 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors">
                Choose CSV File
              </button>
            </div>

            <div className="flex items-center gap-4">
              <hr className="flex-1 border-black/10" />
              <span className="text-xs text-muted font-semibold">OR ADD MANUALLY</span>
              <hr className="flex-1 border-black/10" />
            </div>

            {/* Manual rows */}
            <div className="bg-surface rounded-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-black/6">
                <h2 className="text-sm font-bold text-foreground">Invite List</h2>
                <button onClick={addRow} className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
                  <Plus size={13} /> Add row
                </button>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-[1fr_140px_140px_40px] gap-3 px-5 py-2.5 bg-canvas/40 border-b border-black/6 text-xs font-semibold text-muted uppercase tracking-wider">
                <span>Email Address</span><span>Role</span><span>Class</span><span />
              </div>

              <div className="divide-y divide-black/4">
                {invites.map(inv => (
                  <div key={inv.id} className="grid grid-cols-[1fr_140px_140px_40px] gap-3 items-center px-5 py-2.5">
                    <input
                      type="email" value={inv.email} onChange={e => update(inv.id, 'email', e.target.value)}
                      placeholder="email@example.com"
                      className="h-9 px-3 border border-black/15 rounded-md text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
                    />
                    <div className="relative">
                      <select value={inv.role} onChange={e => update(inv.id, 'role', e.target.value)}
                        className="w-full h-9 pl-3 pr-8 border border-black/15 rounded-md text-sm text-foreground bg-white outline-none focus:border-primary appearance-none">
                        {roles.map(r => <option key={r}>{r}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select value={inv.class} onChange={e => update(inv.id, 'class', e.target.value)}
                        className="w-full h-9 pl-3 pr-8 border border-black/15 rounded-md text-sm text-foreground bg-white outline-none focus:border-primary appearance-none">
                        {classes.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                    </div>
                    {invites.length > 1 && (
                      <button onClick={() => removeRow(inv.id)} className="text-muted hover:text-red-500 transition-colors flex items-center justify-center">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSent(true)}
                className="flex items-center gap-2 h-12 px-6 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
              >
                <Send size={14} /> Send Invitations
              </button>
              <button onClick={() => onNavigate('user-management')} className="h-12 px-6 border border-black/20 text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
                Cancel
              </button>
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  )
}
