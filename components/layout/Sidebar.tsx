'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, BookOpen, Bot, ClipboardList,
  BarChart2, Calendar, LogOut, Zap, Menu, X, ChevronDown, User
} from 'lucide-react'
import toast from 'react-hot-toast'
import { EXAM_LIST } from '@/lib/syllabus-data'
import clsx from 'clsx'

const navItems = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/syllabus',     label: 'Syllabus',     icon: BookOpen },
  { href: '/study-coach',  label: 'AI Coach',     icon: Bot },
  { href: '/mocks',        label: 'Mock Tests',   icon: ClipboardList },
  { href: '/analytics',    label: 'Analytics',    icon: BarChart2 },
  { href: '/planner',      label: 'Study Planner',icon: Calendar },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const examInfo = EXAM_LIST.find(e => e.id === profile?.selectedExam)

  const handleSignOut = async () => {
    await signOut(auth)
    toast.success('Signed out successfully')
    router.push('/login')
  }

  const SidebarContent = () => (
    <aside className="flex flex-col h-full w-64 glass-strong border-r border-surface-border">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-surface-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center glow-brand">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <div className="font-display font-bold text-white text-sm leading-tight">PrepPulse</div>
          <div className="text-[10px] text-brand-400 font-medium tracking-wide uppercase">Pro</div>
        </div>
      </div>

      {/* User card */}
      {user && (
        <div className="mx-3 mt-4 p-3 rounded-xl glass">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-xs font-bold">
              {profile?.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{profile?.name || 'Student'}</div>
              {examInfo && (
                <div className="text-[10px] text-brand-400 truncate">{examInfo.name}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'nav-active'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={17} className={active ? 'text-brand-400' : 'text-slate-500'} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 space-y-1">
        <Link
          href="/onboarding"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <User size={17} className="text-slate-500" />
          Change Exam
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen fixed top-0 left-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile hamburger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="glass p-2.5 rounded-xl text-slate-300 hover:text-white transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 h-full">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
