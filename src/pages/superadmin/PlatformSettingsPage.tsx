import { useState } from 'react'
import { Globe, Mail, Bell, Shield, Wrench, AlertTriangle, Save } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { superAdminNav } from '../../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

function ToggleRow({ label, description, value, onChange }: {
  label: string; description: string; value: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-black/6 last:border-0">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${value ? 'bg-primary' : 'bg-black/15'}`}
      >
        <span className={`absolute inset-y-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${value ? 'left-[22px]' : 'left-[2px]'}`} />
      </button>
    </div>
  )
}

export default function PlatformSettingsPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const sidebarUser  = profileToSidebarUser(profile)
  const [platformName, setPlatformName] = useState('Learnora')
  const [supportEmail, setSupportEmail] = useState('support@learnora.io')
  const [fromName, setFromName] = useState('Learnora Platform')

  const [emailNotifs, setEmailNotifs]     = useState(true)
  const [alertNotifs, setAlertNotifs]     = useState(true)
  const [billingNotifs, setBillingNotifs] = useState(true)

  const [twoFA, setTwoFA]             = useState(false)
  const [auditLog, setAuditLog]       = useState(true)
  const [schoolSignup, setSchoolSignup] = useState(false)

  const [maintenance, setMaintenance] = useState(false)
  const [saved, setSaved]             = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <DashboardLayout
      activePage="platform-settings"
      onNavigate={onNavigate}
      title="Platform Settings"
      subtitle="Configure global platform behaviour and preferences"
      nav={superAdminNav}
      user={sidebarUser}
    >
      <div className="max-w-[760px] flex flex-col gap-6">

        {/* Branding */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe size={16} className="text-primary" /> Branding & Identity
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Platform Name</label>
              <input
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                className="w-full h-11 px-4 border border-black/20 rounded-card text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Platform URL</label>
              <input
                defaultValue="https://app.learnora.io"
                className="w-full h-11 px-4 border border-black/20 rounded-card text-sm text-foreground outline-none focus:border-primary bg-canvas"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Email settings */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Mail size={16} className="text-primary" /> Email Configuration
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Support Email</label>
              <input
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="w-full h-11 px-4 border border-black/20 rounded-card text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">From Name (for system emails)</label>
              <input
                value={fromName}
                onChange={e => setFromName(e.target.value)}
                className="w-full h-11 px-4 border border-black/20 rounded-card text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <h2 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
            <Bell size={16} className="text-primary" /> Platform Notifications
          </h2>
          <ToggleRow label="Email Notifications" description="Send system event emails to super admins" value={emailNotifs} onChange={setEmailNotifs} />
          <ToggleRow label="Critical Alerts" description="Notify when failed payments or system errors occur" value={alertNotifs} onChange={setAlertNotifs} />
          <ToggleRow label="Billing Reminders" description="Send billing digest emails monthly" value={billingNotifs} onChange={setBillingNotifs} />
        </div>

        {/* Security */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <h2 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
            <Shield size={16} className="text-primary" /> Security
          </h2>
          <ToggleRow label="Require 2FA for Super Admins" description="All super admin accounts must enable two-factor authentication" value={twoFA} onChange={setTwoFA} />
          <ToggleRow label="Audit Logging" description="Log all super admin actions for compliance" value={auditLog} onChange={setAuditLog} />
          <ToggleRow label="Allow Self-Service School Signup" description="Schools can sign up without manual approval" value={schoolSignup} onChange={setSchoolSignup} />
        </div>

        {/* Danger zone */}
        <div className="bg-surface rounded-card border-2 border-red-200 p-6">
          <h2 className="text-base font-bold text-red-600 mb-1 flex items-center gap-2">
            <AlertTriangle size={16} /> Danger Zone
          </h2>
          <p className="text-xs text-muted mb-4">These actions affect the entire platform. Use with extreme caution.</p>
          <div className="flex items-center justify-between gap-4 py-4 border-b border-black/6">
            <div>
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Wrench size={14} className="text-amber-600" /> Maintenance Mode
              </p>
              <p className="text-xs text-muted mt-0.5">All school users see a maintenance page. Super admins can still log in.</p>
            </div>
            <button
              onClick={() => setMaintenance(!maintenance)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${maintenance ? 'bg-red-500' : 'bg-black/15'}`}
            >
              <span className={`absolute inset-y-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${maintenance ? 'left-[22px]' : 'left-[2px]'}`} />
            </button>
          </div>
          {maintenance && (
            <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 rounded-card">
              <AlertTriangle size={14} className="text-red-500 shrink-0" />
              <p className="text-xs text-red-600 font-medium">Maintenance mode is ON. All school users are currently blocked.</p>
            </div>
          )}
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 h-11 px-6 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
          >
            <Save size={15} /> Save Changes
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">Settings saved successfully.</span>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
