import { useState } from 'react'
import { Smartphone, Key, CheckCircle2, Copy, AlertCircle } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

type Step = 'choose' | 'app' | 'sms' | 'verify' | 'done'

const RECOVERY_CODES = ['A4B2-C3D1','E5F6-G7H8','I9J0-K1L2','M3N4-O5P6','Q7R8-S9T0','U1V2-W3X4']

export default function TwoFASetupPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const sidebarUser = profileToSidebarUser(profile)

  const [step,   setStep]   = useState<Step>('choose')
  const [method, setMethod] = useState<'app' | 'sms'>('app')
  const [code,   setCode]   = useState('')
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(RECOVERY_CODES.join('\n')).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  function verify() {
    // In production: verify TOTP/SMS code via backend
    if (code.length >= 4) setStep('done')
  }

  return (
    <DashboardLayout
      activePage="settings"
      onNavigate={onNavigate}
      title="Two-Factor Authentication"
      subtitle="Add an extra layer of security to your account"
      user={sidebarUser}
    >
      <div className="max-w-[540px] flex flex-col gap-5">

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          {(['choose', 'app', 'verify', 'done'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step === s ? 'bg-primary text-white' :
                ['choose','app','sms','verify','done'].indexOf(step) > i ? 'bg-green-500 text-white' :
                'bg-canvas text-muted'
              }`}>{i + 1}</div>
              {i < 3 && <div className={`h-0.5 flex-1 rounded-full ${['choose','app','sms','verify','done'].indexOf(step) > i ? 'bg-green-400' : 'bg-canvas'}`} />}
            </div>
          ))}
        </div>

        {step === 'choose' && (
          <div className="bg-surface rounded-card shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-base font-bold text-foreground">Choose a method</h2>
            {([
              { id: 'app', label: 'Authenticator App', desc: 'Use Google Authenticator, Authy, or similar app.', Icon: Key },
              { id: 'sms', label: 'SMS Code',           desc: 'Receive a code by text message.',                 Icon: Smartphone },
            ] as const).map(({ id, label, desc, Icon }) => (
              <button key={id} onClick={() => { setMethod(id); setStep(id) }}
                className={`flex items-center gap-4 p-4 rounded-card border text-left transition-colors hover:border-primary ${method === id ? 'border-primary bg-primary/4' : 'border-black/12'}`}>
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{label}</p>
                  <p className="text-xs text-muted mt-0.5">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 'app' && (
          <div className="bg-surface rounded-card shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-base font-bold text-foreground">Scan QR code</h2>
            <p className="text-xs text-muted">Open your authenticator app and scan the QR code below.</p>
            <div className="size-40 bg-canvas rounded-card mx-auto flex items-center justify-center border-2 border-dashed border-black/15">
              <div className="text-center">
                <Key size={24} className="text-muted mx-auto mb-1" />
                <p className="text-[10px] text-muted">QR code placeholder</p>
              </div>
            </div>
            <p className="text-xs text-center text-muted">Manual key: <span className="font-mono font-bold text-foreground">JBSWY3DPEHPK3PXP</span></p>
            <button onClick={() => setStep('verify')} className="h-10 px-6 bg-primary text-white text-sm font-bold rounded-pill hover:bg-primary-deep transition-colors shadow-primary">
              I've scanned it →
            </button>
          </div>
        )}

        {step === 'sms' && (
          <div className="bg-surface rounded-card shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-base font-bold text-foreground">Enter phone number</h2>
            <p className="text-xs text-muted">We'll send a 6-digit code to this number.</p>
            <input
              type="tel" placeholder="+234 800 000 0000"
              className="h-10 px-3 border border-black/15 rounded-input text-sm outline-none focus:border-primary"
            />
            <button onClick={() => setStep('verify')} className="h-10 px-6 bg-primary text-white text-sm font-bold rounded-pill hover:bg-primary-deep transition-colors shadow-primary">
              Send code →
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="bg-surface rounded-card shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-base font-bold text-foreground">Enter verification code</h2>
            <p className="text-xs text-muted">{method === 'app' ? 'Enter the 6-digit code from your authenticator app.' : 'Enter the code sent to your phone.'}</p>
            <input
              value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000" maxLength={6}
              className="h-14 px-4 border border-black/15 rounded-input text-2xl font-mono text-center outline-none focus:border-primary tracking-[0.3em]"
            />
            <button onClick={verify} disabled={code.length < 4}
              className="h-10 px-6 bg-primary text-white text-sm font-bold rounded-pill hover:bg-primary-deep transition-colors disabled:opacity-40 shadow-primary">
              Verify
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="bg-surface rounded-card shadow-sm p-6 flex flex-col gap-5">
            <div className="text-center">
              <div className="size-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={28} className="text-green-600" />
              </div>
              <p className="text-base font-bold text-foreground">2FA enabled!</p>
              <p className="text-xs text-muted mt-1">Your account is now protected with two-factor authentication.</p>
            </div>

            {/* Recovery codes */}
            <div className="bg-canvas rounded-card p-4 border border-black/8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-foreground">Recovery codes</p>
                <button onClick={copy}
                  className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                  <Copy size={10} /> {copied ? 'Copied!' : 'Copy all'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {RECOVERY_CODES.map(c => (
                  <span key={c} className="font-mono text-xs text-center bg-white border border-black/10 rounded py-1">{c}</span>
                ))}
              </div>
              <div className="flex items-start gap-2 mt-3">
                <AlertCircle size={12} className="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-[10px] text-muted leading-relaxed">Save these codes. Each can only be used once if you lose access to your device.</p>
              </div>
            </div>

            <button onClick={() => onNavigate('security-settings')}
              className="h-10 px-6 bg-primary text-white text-sm font-bold rounded-pill hover:bg-primary-deep transition-colors shadow-primary">
              Done
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
