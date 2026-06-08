import { useState } from 'react'
import type { ReactNode } from 'react'
import Sidebar, { type NavItem } from './Sidebar'
import TopBar from './TopBar'

type SidebarUser = { name: string; role: string; initials: string }

type Props = {
  activePage:   string
  onNavigate:   (page: string) => void
  title:        string
  subtitle?:    string
  children:     ReactNode
  nav?:         NavItem[]
  user?:        SidebarUser
  mainClassName?: string
}

export default function DashboardLayout({
  activePage,
  onNavigate,
  title,
  subtitle,
  children,
  nav,
  user,
  mainClassName,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleNavigate(page: string) {
    onNavigate(page)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed overlay on mobile, static on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:relative lg:z-auto lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          nav={nav}
          user={user}
          onClose={() => setSidebarOpen(false)}
          showClose
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(prev => !prev)}
          onNavigate={handleNavigate}
          user={user}
        />
        <main className={mainClassName ?? 'flex-1 overflow-y-auto p-4 md:p-8'}>
          {children}
        </main>
      </div>
    </div>
  )
}
