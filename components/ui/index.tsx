import clsx from 'clsx'

// ─── StatCard ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  accentColor?: string
  trend?: { value: number; label: string }
  className?: string
}

export function StatCard({ title, value, subtitle, icon, accentColor = '#6366f1', trend, className }: StatCardProps) {
  return (
    <div className={clsx('glass rounded-2xl p-5 stat-card', className)}>
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}30` }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
        {trend && (
          <div className={clsx(
            'text-xs font-medium px-2 py-1 rounded-lg',
            trend.value >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
          )}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-display font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs text-slate-400 font-medium">{title}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
    </div>
  )
}

// ─── ProgressBar ────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  color?: 'brand' | 'green' | 'amber' | 'red'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

export function ProgressBar({ value, max = 100, color = 'brand', size = 'md', showLabel = false, animated = true }: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)

  const barClass = {
    brand: 'progress-bar',
    green: 'progress-bar-green',
    amber: 'progress-bar-amber',
    red: 'bg-gradient-to-r from-red-500 to-rose-500 rounded-full',
  }[color]

  const heightClass = { sm: 'h-1', md: 'h-2', lg: 'h-3' }[size]

  return (
    <div className="flex items-center gap-3">
      <div className={clsx('flex-1 bg-white/5 rounded-full overflow-hidden', heightClass)}>
        <div
          className={barClass}
          style={{ width: `${pct}%`, height: '100%', transition: animated ? 'width 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none' }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-400 w-8 text-right">{Math.round(pct)}%</span>
      )}
    </div>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────

interface BadgeProps {
  label: string
  variant: 'high' | 'medium' | 'low' | 'easy' | 'hard' | 'info'
}

export function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase',
      variant === 'high' && 'badge-high',
      variant === 'medium' && 'badge-medium',
      variant === 'low' && 'badge-low',
      variant === 'easy' && 'badge-easy',
      variant === 'hard' && 'badge-hard',
      variant === 'info' && 'bg-brand-500/15 text-brand-300 border border-brand-500/25',
    )}>
      {label}
    </span>
  )
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

type TopicStatus = 'not_started' | 'in_progress' | 'completed'

export function StatusBadge({ status }: { status: TopicStatus }) {
  const config = {
    not_started: { label: 'Not Started', cls: 'status-not-started' },
    in_progress:  { label: 'In Progress', cls: 'status-in-progress' },
    completed:    { label: 'Completed',   cls: 'status-completed' },
  }[status]

  return (
    <span className={clsx('inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium', config.cls)}>
      {status === 'completed' && <span className="mr-1">✓</span>}
      {status === 'in_progress' && <span className="mr-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />}
      {config.label}
    </span>
  )
}

// ─── PageHeader ──────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function PageHeader({ title, subtitle, icon, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-center gap-4">
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/20 flex items-center justify-center text-brand-400">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-display font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ─── LoadingSpinner ───────────────────────────────────────────────────────────

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return (
    <div className={clsx('animate-spin rounded-full border-2 border-white/10 border-t-brand-500', s)} />
  )
}

// ─── EmptyState ──────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode; title: string; description: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  )
}
