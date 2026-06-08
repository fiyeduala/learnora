import { useState } from 'react'
import { BookOpen, TrendingUp, AlertCircle, ChevronRight, Plus, X, CheckCircle2, Circle } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const onboardingSteps = [
  { id: 'registered', label: 'School registered on Learnora',  page: ''                  },
  { id: 'teachers',   label: 'Add your first teacher',          page: 'invite-users'      },
  { id: 'classes',    label: 'Create your first class',         page: 'classes-management'},
  { id: 'fees',       label: 'Set up your fee structure',       page: 'admin-fee-setup'   },
  { id: 'parents',    label: 'Invite parents to the platform',  page: 'invite-users'      },
]

const stats = [
  { label: 'Total Students',    value: '1,248', change: '+12',   color: 'text-primary',    bg: 'bg-primary/10'   },
  { label: 'Total Teachers',    value: '86',    change: '+3',    color: 'text-accent-mint', bg: 'bg-accent-mint/10'},
  { label: 'Active Classes',    value: '42',    change: '0',     color: 'text-foreground',  bg: 'bg-canvas'       },
  { label: 'Attendance Rate',   value: '91%',   change: '+2%',   color: 'text-green-600',   bg: 'bg-green-50'     },
]

const recentUsers = [
  { name: 'Olive Princely',   role: 'Student', class: 'SS1A', date: 'Jun 5, 2026',  status: 'Active'  },
  { name: 'James Owusu',      role: 'Student', class: 'SS3B', date: 'Jun 4, 2026',  status: 'Active'  },
  { name: 'Mrs Elena Bright', role: 'Teacher', class: 'Math', date: 'Jun 3, 2026',  status: 'Pending' },
  { name: 'Amira Hassan',     role: 'Student', class: 'SS2A', date: 'Jun 2, 2026',  status: 'Active'  },
]

const alerts = [
  { type: 'warning', message: '5 students have attendance below 60%',         action: 'View students', page: 'admin-attendance'  },
  { type: 'info',    message: '12 pending teacher invitations not accepted',   action: 'View invites',  page: 'invite-users'      },
  { type: 'error',   message: '3 students have outstanding fees for 30+ days', action: 'View fees',    page: 'fee-collection'    },
]

export default function AdminDashboardPage({ onNavigate }: Props) {
  const [showChecklist, setShowChecklist] = useState(true)
  const [done, setDone] = useState<Set<string>>(new Set(['registered']))

  const completedCount = done.size
  const totalSteps     = onboardingSteps.length

  return (
    <DashboardLayout
      activePage="admin-dashboard"
      onNavigate={onNavigate}
      title="Admin Dashboard"
      subtitle="Greenfield Academy — School Overview"
      nav={adminNav}
      user={{ name: 'Admin Okafor', role: 'School Admin', initials: 'A' }}
    >
      <div className="max-w-[1300px] flex flex-col gap-6">

        {/* Onboarding checklist */}
        {showChecklist && completedCount < totalSteps && (
          <div className="bg-primary/5 border border-primary/20 rounded-card p-5 relative">
            <button onClick={() => setShowChecklist(false)}
              className="absolute top-4 right-4 text-muted hover:text-foreground">
              <X size={15} />
            </button>
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-base">🏫</span>
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <p className="text-sm font-bold text-foreground">Get your school set up</p>
                <p className="text-xs text-muted mt-0.5 mb-3">Complete these steps to start using Learnora for your school.</p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted font-medium">{completedCount} of {totalSteps} complete</span>
                    <span className="text-xs font-bold text-primary">{Math.round((completedCount / totalSteps) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-primary/15 rounded-full">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(completedCount / totalSteps) * 100}%` }} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {onboardingSteps.map(step => {
                    const isDone = done.has(step.id)
                    return (
                      <div key={step.id} className="flex items-center gap-3">
                        <button onClick={() => setDone(prev => {
                          const next = new Set(prev)
                          if (next.has(step.id)) next.delete(step.id)
                          else next.add(step.id)
                          return next
                        })} className="shrink-0">
                          {isDone
                            ? <CheckCircle2 size={17} className="text-primary" />
                            : <Circle       size={17} className="text-muted/40" />
                          }
                        </button>
                        <span className={`text-sm flex-1 ${isDone ? 'line-through text-muted' : 'text-foreground'}`}>{step.label}</span>
                        {!isDone && step.page && (
                          <button onClick={() => onNavigate(step.page)}
                            className="text-xs text-primary font-semibold hover:underline shrink-0">
                            Go →
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-5">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted mt-1">{s.label}</p>
              <p className="text-xs text-green-600 mt-1 font-semibold">{s.change} this month</p>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div className="flex flex-col gap-2">
          {alerts.map((a, i) => (
            <div key={i} className={`flex items-center gap-4 px-5 py-3.5 rounded-card border text-sm ${
              a.type === 'error'   ? 'border-red-200 bg-red-50'    :
              a.type === 'warning' ? 'border-amber-200 bg-amber-50' :
              'border-primary/20 bg-primary/5'
            }`}>
              <AlertCircle size={16} className={
                a.type === 'error'   ? 'text-red-500'    :
                a.type === 'warning' ? 'text-amber-600'  :
                'text-primary'
              } />
              <p className="flex-1 text-foreground">{a.message}</p>
              <button onClick={() => onNavigate(a.page)} className="text-xs font-semibold text-primary hover:underline shrink-0">{a.action}</button>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

          {/* Recent users */}
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/6">
              <h3 className="text-base font-bold text-foreground">Recent Users</h3>
              <div className="flex gap-2">
                <button onClick={() => onNavigate('invite-users')} className="flex items-center gap-1.5 h-8 px-3 bg-primary text-white text-xs font-semibold rounded-pill hover:bg-primary-deep transition-colors">
                  <Plus size={11} /> Invite
                </button>
                <button onClick={() => onNavigate('user-management')} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                  View all <ChevronRight size={12} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/6 bg-canvas/40">
                    {['Name', 'Role', 'Class', 'Joined', 'Status'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u, i) => (
                    <tr key={i} className="border-b border-black/4 last:border-0 hover:bg-canvas/40 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{u.name.charAt(0)}</div>
                          <span className="font-medium text-foreground">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-muted">{u.role}</td>
                      <td className="px-6 py-3.5 text-muted">{u.class}</td>
                      <td className="px-6 py-3.5 text-muted text-xs">{u.date}</td>
                      <td className="px-6 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-xs ${
                          u.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                        }`}>{u.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick actions + module summary */}
          <div className="flex flex-col gap-4">
            <div className="bg-surface rounded-card shadow-sm p-6">
              <h3 className="text-base font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Add Student',   page: 'invite-users',        icon: Plus  },
                  { label: 'Add Teacher',   page: 'invite-users',        icon: Plus  },
                  { label: 'Manage Classes',page: 'classes-management',  icon: BookOpen },
                  { label: 'View Finance',  page: 'finance',             icon: TrendingUp },
                ].map(a => {
                  const Icon = a.icon
                  return (
                    <button key={a.label} onClick={() => onNavigate(a.page)}
                      className="flex flex-col items-center gap-2 p-4 rounded-card bg-canvas hover:bg-primary/8 hover:text-primary transition-colors text-muted text-center">
                      <Icon size={18} />
                      <span className="text-xs font-medium leading-tight">{a.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="bg-surface rounded-card shadow-sm p-6">
              <h3 className="text-base font-bold text-foreground mb-4">Module Overview</h3>
              <div className="flex flex-col gap-3 text-sm">
                {[
                  { label: 'Classes',    value: '42 active',        page: 'classes-management' },
                  { label: 'Students',   value: '1,248 enrolled',   page: 'user-management'    },
                  { label: 'Teachers',   value: '86 on staff',      page: 'user-management'    },
                  { label: 'Fees Due',   value: '₦3.2M outstanding',page: 'finance'            },
                ].map(m => (
                  <button key={m.label} onClick={() => onNavigate(m.page)}
                    className="flex items-center justify-between p-3 rounded-card bg-canvas hover:bg-primary/8 transition-colors text-left">
                    <span className="text-muted">{m.label}</span>
                    <span className="font-semibold text-foreground text-xs">{m.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}
