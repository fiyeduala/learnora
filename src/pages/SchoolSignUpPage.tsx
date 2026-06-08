import { useState } from 'react'
import { ChevronRight, Eye, EyeOff, CheckCircle2, Copy, Building2 } from 'lucide-react'
import AuthHeroPanel from '../components/auth/AuthHeroPanel'

type Props = { onNavigate: (page: string) => void }
type Step = 'school' | 'admin' | 'done'

const steps: { key: Step; label: string }[] = [
  { key: 'school', label: 'School Info' },
  { key: 'admin',  label: 'Admin Setup' },
  { key: 'done',   label: 'All Set'     },
]

const nigerianStates = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT (Abuja)','Gombe',
  'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
  'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto',
  'Taraba','Yobe','Zamfara',
]

export default function SchoolSignUpPage({ onNavigate }: Props) {
  const [step, setStep]           = useState<Step>('school')
  const [showPw, setShowPw]       = useState(false)
  const [showCPw, setShowCPw]     = useState(false)
  const [copied, setCopied]       = useState(false)

  // School fields
  const [schoolName,    setSchoolName]    = useState('')
  const [schoolEmail,   setSchoolEmail]   = useState('')
  const [schoolPhone,   setSchoolPhone]   = useState('')
  const [schoolAddress, setSchoolAddress] = useState('')
  const [schoolState,   setSchoolState]   = useState('')

  // Admin fields
  const [adminName,  setAdminName]  = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPhone, setAdminPhone] = useState('')
  const [password,   setPassword]   = useState('')
  const [confirmPw,  setConfirmPw]  = useState('')

  // Generated school code (in production, backend returns this)
  const schoolCode = schoolName
    ? schoolName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3) + '-' + Math.floor(1000 + Math.random() * 9000)
    : 'GFA-4821'

  const stepIndex = steps.findIndex(s => s.key === step)

  function copyCode() {
    navigator.clipboard.writeText(schoolCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Hero panel */}
      <div className="lg:w-[52%] lg:flex-shrink-0 p-3 lg:p-6">
        <AuthHeroPanel />
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-8 lg:px-12">
        <div className="w-full max-w-[500px]">

          {/* Stepper */}
          {step !== 'done' && (
            <div className="flex items-center gap-2 mb-8">
              {steps.filter(s => s.key !== 'done').map((s, i) => {
                const idx = steps.findIndex(x => x.key === s.key)
                const past    = stepIndex > idx
                const current = stepIndex === idx
                return (
                  <div key={s.key} className="flex items-center gap-2 flex-1 last:flex-none">
                    <div className={`flex items-center gap-2 ${current || past ? 'text-primary' : 'text-muted'}`}>
                      <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        past    ? 'bg-primary text-white' :
                        current ? 'bg-primary text-white' :
                        'bg-canvas text-muted border border-black/15'
                      }`}>
                        {past ? '✓' : i + 1}
                      </div>
                      <span className="text-xs font-semibold hidden sm:block">{s.label}</span>
                    </div>
                    {i < 1 && <div className={`flex-1 h-0.5 rounded-full ${past ? 'bg-primary' : 'bg-black/10'}`} />}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Step 1: School Info ── */}
          {step === 'school' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="size-11 rounded-card bg-primary/10 flex items-center justify-center">
                  <Building2 size={20} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-foreground leading-tight">Register Your School</h1>
                  <p className="text-sm text-muted">Step 1 of 2 — School information</p>
                </div>
              </div>

              <form
                className="flex flex-col gap-4"
                onSubmit={e => { e.preventDefault(); setStep('admin') }}
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">School Name <span className="text-red-500">*</span></label>
                  <input
                    required value={schoolName} onChange={e => setSchoolName(e.target.value)}
                    placeholder="e.g. Greenfield Academy"
                    className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors bg-surface"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">School Email <span className="text-red-500">*</span></label>
                  <input
                    required type="email" value={schoolEmail} onChange={e => setSchoolEmail(e.target.value)}
                    placeholder="info@yourschool.edu.ng"
                    className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors bg-surface"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    required type="tel" value={schoolPhone} onChange={e => setSchoolPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors bg-surface"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">School Address <span className="text-red-500">*</span></label>
                  <input
                    required value={schoolAddress} onChange={e => setSchoolAddress(e.target.value)}
                    placeholder="Street, City"
                    className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors bg-surface"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">State <span className="text-red-500">*</span></label>
                  <select
                    required value={schoolState} onChange={e => setSchoolState(e.target.value)}
                    className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground bg-surface outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option value="">Select state</option>
                    {nigerianStates.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-primary text-white text-sm font-bold rounded-pill hover:bg-primary-deep transition-colors shadow-primary flex items-center justify-center gap-2 mt-2"
                >
                  Continue <ChevronRight size={15} />
                </button>
              </form>

              <p className="text-sm text-center text-foreground mt-5">
                Already have a school account?{' '}
                <button onClick={() => onNavigate('login')} className="font-semibold text-primary hover:underline">
                  Sign in
                </button>
              </p>
            </>
          )}

          {/* ── Step 2: Admin Setup ── */}
          {step === 'admin' && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground leading-tight mb-1">Admin Account</h1>
                <p className="text-sm text-muted">Step 2 of 2 — This will be the primary administrator account for {schoolName || 'your school'}.</p>
              </div>

              <form
                className="flex flex-col gap-4"
                onSubmit={e => { e.preventDefault(); setStep('done') }}
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">Full Name <span className="text-red-500">*</span></label>
                  <input
                    required value={adminName} onChange={e => setAdminName(e.target.value)}
                    placeholder="e.g. Mr Emmanuel Okafor"
                    className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors bg-surface"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">Admin Email <span className="text-red-500">*</span></label>
                  <input
                    required type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                    placeholder="admin@yourschool.edu.ng"
                    className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors bg-surface"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">Admin Phone</label>
                  <input
                    type="tel" value={adminPhone} onChange={e => setAdminPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors bg-surface"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      required type={showPw ? 'text' : 'password'}
                      value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full h-12 px-4 pr-11 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors bg-surface"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">Confirm Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      required type={showCPw ? 'text' : 'password'}
                      value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full h-12 px-4 pr-11 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors bg-surface"
                    />
                    <button type="button" onClick={() => setShowCPw(!showCPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                      {showCPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setStep('school')}
                    className="h-12 px-5 border border-black/20 text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-12 bg-primary text-white text-sm font-bold rounded-pill hover:bg-primary-deep transition-colors shadow-primary flex items-center justify-center gap-2"
                  >
                    Register School <ChevronRight size={15} />
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── Step 3: Done ── */}
          {step === 'done' && (
            <div className="text-center">
              <div className="size-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={28} className="text-green-600" />
              </div>

              <h1 className="text-3xl font-semibold text-foreground mb-2">You're registered!</h1>
              <p className="text-sm text-muted mb-8 max-w-[380px] mx-auto">
                Your school <strong>{schoolName || 'Greenfield Academy'}</strong> has been submitted for review.
                You'll receive a confirmation email at <strong>{adminEmail || 'admin@school.edu'}</strong> within 24 hours.
              </p>

              {/* School code box */}
              <div className="bg-canvas rounded-card border border-black/10 p-5 mb-6 text-left">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Your School Login Code</p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 text-2xl font-bold text-primary tracking-widest">{schoolCode}</code>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1.5 h-9 px-4 border border-black/15 rounded-full text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Copy size={12} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-muted mt-3 leading-relaxed">
                  Share this code with your students, teachers, and parents so they can find your school at the login screen. Your dedicated login link is also available once your account is approved.
                </p>
              </div>

              {/* What happens next */}
              <div className="bg-surface rounded-card border border-black/8 p-5 mb-8 text-left">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">What happens next</p>
                <div className="flex flex-col gap-3">
                  {[
                    { n: '1', text: 'We review your registration — usually within 24 hours.' },
                    { n: '2', text: 'You receive an email with your admin login link and full access.' },
                    { n: '3', text: 'Add your students, teachers, and parents — they get login credentials by email or SMS automatically.' },
                  ].map(item => (
                    <div key={item.n} className="flex items-start gap-3">
                      <div className="size-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {item.n}
                      </div>
                      <p className="text-sm text-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('login')}
                className="w-full h-12 bg-primary text-white text-sm font-bold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
              >
                Go to Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
