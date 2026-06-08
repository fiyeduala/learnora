import { useState } from 'react'
import {
  Menu, X, CheckCircle2, Star, ArrowRight, Play,
  BookOpen, BarChart2, Users, Brain, MessageSquare,
  CreditCard, Calendar, Zap,
} from 'lucide-react'

type Props = { onNavigate: (page: string) => void }

const whyFeatures = [
  {
    icon: Brain,
    title: 'Personalized Learning',
    desc: 'AI-driven content adapts to each student\'s pace and learning style automatically.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: BookOpen,
    title: 'Smart Assignments',
    desc: 'Create, assign, and auto-grade assignments with ease from any device.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: BarChart2,
    title: 'Real-time Analytics',
    desc: 'Live performance insights for teachers, admins, and parents — all in one dashboard.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Users,
    title: 'Parent Engagement',
    desc: 'Keep parents connected with attendance, fees, progress, and direct messaging.',
    color: 'bg-amber-50 text-amber-600',
  },
]

const steps = [
  { num: '01', title: 'Create Your School Account', desc: 'Register your school and configure classes, subjects, and term structure in minutes.' },
  { num: '02', title: 'Add Teachers & Students', desc: 'Invite staff and enroll students via shareable link, CSV upload, or manual entry.' },
  { num: '03', title: 'Start Teaching', desc: 'Launch live classes, create assignments, and share resources from one platform.' },
  { num: '04', title: 'Track Progress', desc: 'Monitor attendance, grades, and fees — then generate reports with a single click.' },
]

const studentFeatures = [
  'Assignment submission with real-time feedback',
  'Live class access and session recordings',
  'AI Tutor available 24/7 for any subject',
  'Exam prep, quizzes, and practice tests',
  'Progress analytics and class leaderboard',
  'Peer discussion forums and group chats',
]

const connectedFeatures = [
  'Real-time attendance tracking for every class',
  'Instant fee reminders and online payment via Paystack',
  'Direct messaging between parents and teachers',
  'Term report cards published digitally to parents',
  'School-wide announcements sent in seconds',
]

const schoolFeatures = [
  { icon: Calendar,      title: 'Timetable Management',    desc: 'Build and publish class schedules for every teacher and student automatically.' },
  { icon: CreditCard,    title: 'Fee Collection',          desc: 'Invoice, collect, and track school fees with full Paystack integration.' },
  { icon: Users,         title: 'Staff Management',        desc: 'Manage teacher profiles, roles, and class assignments all in one place.' },
  { icon: BarChart2,     title: 'Report Card Generation',  desc: 'Auto-generate term report cards and publish them to parents instantly.' },
  { icon: MessageSquare, title: 'Communication Hub',       desc: 'Broadcast announcements to all users or specific classes and roles.' },
  { icon: Zap,           title: 'Analytics & Insights',    desc: 'School-wide performance dashboards for fast, data-driven decisions.' },
]

const aiFeatures = [
  'Instant answers for any subject or topic',
  'Auto-generate quizzes from lesson content',
  'WAEC & NECO exam preparation mode',
  'Image-based problem solving (snap and ask)',
]

const testimonials = [
  {
    name: 'Mrs. Adaeze Okoye',
    role: 'School Principal, Greenfield Academy',
    text: 'Learnora transformed how we run our school. Fee collection, attendance, and reports are all in one place. Our teachers and parents love it.',
    initials: 'AO',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Mr. David Fashola',
    role: 'Physics Teacher, Faith Academy',
    text: 'I can create assignments, grade submissions, and track who turned in what — all from my phone. Learnora saves me hours every single week.',
    initials: 'DF',
    color: 'bg-green-100 text-green-700',
  },
  {
    name: 'Blessing Adeyemi',
    role: 'Parent, Learnora User',
    text: 'I can see my child\'s grades, pay fees, and message teachers without visiting the school. It\'s incredibly convenient and gives me peace of mind.',
    initials: 'BA',
    color: 'bg-purple-100 text-purple-700',
  },
]

const navLinks = [
  { label: 'Features',     href: '#features'   },
  { label: 'How It Works', href: '#how-it-works'},
  { label: 'Pricing',      href: '#pricing'     },
  { label: 'Contact',      href: '#contact'     },
]

export default function LandingPage({ onNavigate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ─── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-base leading-none">L</span>
            </div>
            <span className="text-lg font-bold text-[#0d2060]">Learnora</span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(l => (
              <a key={l.label} href={l.href}
                className="text-sm text-muted hover:text-foreground transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigate('login')}
              className="h-9 px-5 text-sm font-semibold text-[#0d2060] border border-[#0d2060]/25 rounded-pill hover:border-[#0d2060]/50 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('school-signup')}
              className="h-9 px-5 text-sm font-semibold text-white bg-primary rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-md text-muted hover:text-foreground"
            onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-black/6 px-4 py-5 flex flex-col gap-4">
            {navLinks.map(l => (
              <a key={l.label} href={l.href}
                className="text-sm font-medium text-foreground"
                onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-black/6">
              <button
                onClick={() => { onNavigate('login'); setMenuOpen(false) }}
                className="h-10 text-sm font-semibold text-foreground border border-black/15 rounded-pill">
                Sign In
              </button>
              <button
                onClick={() => { onNavigate('school-signup'); setMenuOpen(false) }}
                className="h-10 text-sm font-semibold text-white bg-primary rounded-pill">
                Get Started Free
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-16 bg-gradient-to-br from-[#071540] via-[#0d2060] to-[#1a4bbf]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
              <span className="size-1.5 bg-green-400 rounded-full animate-pulse" />
              Trusted by 500+ Schools Across Nigeria
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold leading-tight mb-5">
              Empowering Smarter Learning for Every Student
            </h1>
            <p className="text-base text-white/70 leading-relaxed mb-8 max-w-lg">
              Learnora is the all-in-one school management and e-learning platform built to help schools deliver better education, track student progress, and keep parents connected — all in one place.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={() => onNavigate('school-signup')}
                className="flex items-center gap-2 h-12 px-7 bg-white text-[#0d2060] font-bold text-sm rounded-pill hover:bg-white/90 transition-colors shadow-lg"
              >
                Get Started Free <ArrowRight size={16} />
              </button>
              <button className="flex items-center gap-2 h-12 px-6 border border-white/30 text-white font-semibold text-sm rounded-pill hover:bg-white/10 transition-colors">
                <Play size={13} fill="currentColor" /> Book a Demo
              </button>
            </div>

            <div className="flex flex-wrap gap-8">
              {[['500+', 'Schools Onboarded'], ['50K+', 'Active Students'], ['98%', 'Uptime SLA']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold">{val}</p>
                  <p className="text-xs text-white/55 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — dashboard preview */}
          <div className="hidden lg:flex justify-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 w-full max-w-[560px]">
              <img src="/images/dashboard-preview.png" alt="Learnora admin dashboard" className="w-full" />
            </div>
          </div>
        </div>

        {/* Curve into white */}
        <div className="h-12 bg-white rounded-t-[50%]" />
      </section>

      {/* ─── Why Learnora ───────────────────────────────────────────────────── */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-[2rem] font-bold text-foreground mb-4">Why Learnora?</h2>
            <p className="text-base text-muted max-w-xl mx-auto leading-relaxed">
              Built for African schools, designed for every role — students, teachers, parents, and administrators.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyFeatures.map(f => (
              <div key={f.title} className="bg-canvas rounded-card p-6">
                <div className={`size-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 md:py-24 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-2xl md:text-[2rem] font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-base text-muted mb-10 leading-relaxed">
              Get your school live on Learnora in four simple steps.
            </p>
            <div className="flex flex-col gap-8">
              {steps.map(s => (
                <div key={s.num} className="flex gap-5 items-start">
                  <div className="size-12 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-primary">
                    {s.num}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-base font-bold text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/phone-student.png"
              alt="Student using Learnora app"
              className="w-56 sm:w-72 lg:w-80 drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ─── Everything Students Need ───────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#071540] via-[#0d2060] to-[#1a4bbf] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-[2rem] font-bold mb-4">Everything Students Need to Succeed</h2>
            <p className="text-base text-white/65 mb-8 leading-relaxed">
              One app. Every tool a student needs to learn, practice, and excel — from lesson notes to live classes.
            </p>
            <ul className="flex flex-col gap-4">
              {studentFeatures.map(f => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80 leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate('school-signup')}
              className="mt-8 flex items-center gap-2 h-11 px-6 bg-white text-[#0d2060] font-bold text-sm rounded-pill hover:bg-white/90 transition-colors shadow-lg"
            >
              Try for Free <ArrowRight size={15} />
            </button>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/phone-student.png"
              alt="Student learning on Learnora"
              className="w-56 sm:w-72 lg:w-80 drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ─── Stay Connected ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center order-2 lg:order-1">
            <img
              src="/images/phone-parent.png"
              alt="Parent connected to school via Learnora"
              className="w-56 sm:w-72 lg:w-80 drop-shadow-2xl"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl md:text-[2rem] font-bold text-foreground mb-4">
              Stay Connected to Your School
            </h2>
            <p className="text-base text-muted mb-8 leading-relaxed">
              Parents, teachers, and administrators stay in sync — no more missed updates, unpaid fees, or unanswered questions.
            </p>
            <ul className="flex flex-col gap-4">
              {connectedFeatures.map(f => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-muted leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Helping Schools Operate Better ────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-[2rem] font-bold text-foreground mb-4">Helping Schools Operate Better</h2>
            <p className="text-base text-muted max-w-xl mx-auto leading-relaxed">
              Powerful admin tools that reduce paperwork, automate repetitive tasks, and give you full visibility.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {schoolFeatures.map(f => (
              <div key={f.title} className="bg-surface rounded-card p-6 shadow-sm">
                <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <f.icon size={20} />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Meet Learnora AI ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#071540] via-[#0d2060] to-[#1a3da0] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-white/10 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              AI-Powered
            </div>
            <h2 className="text-2xl md:text-[2rem] font-bold mb-4">Meet Learnora AI</h2>
            <p className="text-base text-white/70 leading-relaxed mb-7">
              Your school's 24/7 AI tutor. Learnora AI helps students understand any topic, generate practice quizzes, summarize lesson notes, and stay exam-ready — all through a simple chat interface.
            </p>
            <ul className="flex flex-col gap-4 mb-8">
              {aiFeatures.map(f => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-green-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80 leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate('school-signup')}
              className="flex items-center gap-2 h-11 px-6 bg-white text-[#0d2060] font-bold text-sm rounded-pill hover:bg-white/90 transition-colors shadow-lg"
            >
              Try Learnora AI Free <ArrowRight size={15} />
            </button>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/ai-robot.png"
              alt="Learnora AI assistant"
              className="w-56 sm:w-72 lg:w-[320px] drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ─── Testimonials ───────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-[2rem] font-bold text-foreground mb-4">What Our Users Say</h2>
            <p className="text-base text-muted">Schools and families across Nigeria love using Learnora.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map(t => (
              <div key={t.name} className="bg-canvas rounded-card p-6 flex flex-col gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" className="text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className={`size-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-16 md:py-24 bg-gradient-to-br from-[#071540] via-[#0d2060] to-[#1a4bbf] text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-[2rem] font-bold mb-4">Ready to Transform Learning?</h2>
          <p className="text-base text-white/65 mb-8 leading-relaxed">
            Join hundreds of schools across Nigeria already using Learnora. Set up your school in minutes — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => onNavigate('school-signup')}
              className="flex items-center justify-center gap-2 h-12 px-8 bg-white text-[#0d2060] font-bold text-sm rounded-pill hover:bg-white/90 transition-colors shadow-lg"
            >
              Get Started Free <ArrowRight size={16} />
            </button>
            <button className="flex items-center justify-center gap-2 h-12 px-8 border border-white/30 text-white font-semibold text-sm rounded-pill hover:bg-white/10 transition-colors">
              <Play size={13} fill="currentColor" /> Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────────── */}
      <footer id="contact" className="bg-[#06102a] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-base leading-none">L</span>
                </div>
                <span className="text-lg font-bold">Learnora</span>
              </div>
              <p className="text-sm text-white/45 leading-relaxed max-w-xs">
                The all-in-one school management and e-learning platform built for African schools.
              </p>
            </div>

            {[
              { heading: 'Product',  links: ['Features', 'How It Works', 'Pricing', 'Changelog'] },
              { heading: 'Company',  links: ['About Us', 'Blog', 'Careers', 'Contact'] },
              { heading: 'Support',  links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Status'] },
            ].map(col => (
              <div key={col.heading}>
                <h4 className="text-sm font-bold mb-4">{col.heading}</h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm text-white/45 hover:text-white/70 transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/35">© 2026 Learnora. All rights reserved.</p>
            <p className="text-xs text-white/35">Empowering African schools, one student at a time.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
