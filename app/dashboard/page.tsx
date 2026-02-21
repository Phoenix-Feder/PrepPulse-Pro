'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTopicProgress } from '@/hooks/useTopicProgress'
import { getUserMocks, calculateMockAnalytics } from '@/lib/firestore'
import { getExamById, getTopicCount, EXAM_LIST } from '@/lib/syllabus-data'
import { StatCard, ProgressBar } from '@/components/ui'
import type { MockResult } from '@/types'
import {
  Flame, Target, TrendingUp, BookOpen, AlertTriangle,
  ChevronRight, Zap, BarChart2, Trophy
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const { progress, countByStatus } = useTopicProgress(user?.uid)
  const [mocks, setMocks] = useState<MockResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getUserMocks(user.uid).then(data => {
      setMocks(data)
      setLoading(false)
    })
  }, [user])

  const exam = profile?.selectedExam ? getExamById(profile.selectedExam) : null
  const examMeta = EXAM_LIST.find(e => e.id === profile?.selectedExam)
  const analytics = calculateMockAnalytics(mocks)

  const totalTopics = exam ? getTopicCount(exam) : 0
  const completedTopics = countByStatus('completed')
  const inProgressTopics = countByStatus('in_progress')
  const progressPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-slate-400 text-sm">{greeting()},</p>
            <h1 className="text-2xl font-display font-bold text-white mt-0.5">
              {profile?.name || user?.displayName || 'Aspirant'} 👋
            </h1>
            {exam && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg">{exam.icon}</span>
                <span className="text-sm text-brand-300 font-medium">{exam.examName}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-500">{exam.category}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">{format(new Date(), 'EEEE, d MMM yyyy')}</div>
            {analytics && (
              <div className="text-sm text-slate-400 mt-1">{analytics.totalAttempts} mocks logged</div>
            )}
          </div>
        </div>
      </div>

      {/* Onboarding prompt */}
      {!profile?.selectedExam && (
        <Link href="/onboarding" className="block glass rounded-2xl p-5 mb-6 border border-brand-500/30 bg-brand-500/5 hover:bg-brand-500/10 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
              <Zap size={18} className="text-brand-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Complete your setup</div>
              <div className="text-xs text-slate-400">Choose your target exam to unlock personalised features</div>
            </div>
            <ChevronRight size={16} className="text-slate-500 ml-auto" />
          </div>
        </Link>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Topics Completed"
          value={`${completedTopics}/${totalTopics}`}
          subtitle={`${progressPct}% of syllabus`}
          icon={<BookOpen size={18} />}
          accentColor="#6366f1"
        />
        <StatCard
          title="Avg. Mock Score"
          value={analytics ? `${Math.round(analytics.avgScore)}%` : '—'}
          subtitle={analytics ? `${analytics.totalAttempts} attempts` : 'No mocks yet'}
          icon={<Target size={18} />}
          accentColor="#10b981"
          trend={analytics ? { value: 3, label: 'vs last week' } : undefined}
        />
        <StatCard
          title="In Progress"
          value={inProgressTopics}
          subtitle="topics active"
          icon={<Flame size={18} />}
          accentColor="#f59e0b"
        />
        <StatCard
          title="Study Streak"
          value="—"
          subtitle="Keep it going!"
          icon={<Trophy size={18} />}
          accentColor="#f97316"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Syllabus progress */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-white">Syllabus Progress</h2>
              <p className="text-xs text-slate-500">{exam?.examName || 'No exam selected'}</p>
            </div>
            <Link href="/syllabus" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>

          {exam ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-400">Overall completion</span>
                    <span className="text-xs font-semibold text-white">{progressPct}%</span>
                  </div>
                  <ProgressBar value={progressPct} color="brand" size="lg" />
                </div>
              </div>

              {Object.entries(exam.stages).slice(0, 1).map(([stageName, stage]) =>
                stage?.subjects.slice(0, 4).map(subject => {
                  const subjectTopics = subject.sections.flatMap(s => s.topics)
                  const subjectCompleted = subjectTopics.filter(t => progress[t.id]?.status === 'completed').length
                  const pct = subjectTopics.length > 0 ? Math.round((subjectCompleted / subjectTopics.length) * 100) : 0
                  return (
                    <div key={subject.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-300">{subject.name}</span>
                        <span className="text-xs text-slate-500">{subjectCompleted}/{subjectTopics.length}</span>
                      </div>
                      <ProgressBar value={pct} color={pct >= 70 ? 'green' : pct >= 40 ? 'brand' : 'amber'} size="sm" />
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
              Select an exam to track your syllabus progress
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Weak areas */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400" /> Weak Areas
              </h2>
              <Link href="/analytics" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                Details <ChevronRight size={12} />
              </Link>
            </div>

            {analytics?.weakSections?.length ? (
              <div className="space-y-3">
                {analytics.weakSections.slice(0, 3).map(({ section, average }) => (
                  <div key={section}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400 truncate">{section}</span>
                      <span className="text-xs font-semibold text-red-400">{Math.round(average)}%</span>
                    </div>
                    <ProgressBar value={average} color="red" size="sm" />
                  </div>
                ))}
              </div>
            ) : profile?.preferences?.weakSections?.length ? (
              <div className="space-y-2">
                {profile.preferences.weakSections.slice(0, 3).map(s => (
                  <div key={s} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <span className="text-amber-400 text-xs">⚠</span>
                    <span className="text-xs text-slate-300">{s}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-2">Log mock tests to identify weak areas automatically</p>
            )}
          </div>

          {/* Recent mocks */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp size={14} className="text-brand-400" /> Recent Mocks
              </h2>
              <Link href="/mocks" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                All <ChevronRight size={12} />
              </Link>
            </div>

            {mocks.length > 0 ? (
              <div className="space-y-2.5">
                {mocks.slice(0, 3).map(m => {
                  const pct = Math.round((m.totalScore / m.maxScore) * 100)
                  return (
                    <div key={m.id} className="flex items-center gap-3 py-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                        ${pct >= 70 ? 'bg-green-500/15 text-green-400' : pct >= 50 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'}`}>
                        {pct}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-white">{m.exam?.toUpperCase().replace('_', ' ')}</div>
                        <div className="text-xs text-slate-500">{m.date}</div>
                      </div>
                      <div className="text-xs text-slate-500">{m.totalScore}/{m.maxScore}</div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <BarChart2 size={24} className="mx-auto mb-2 text-slate-600" />
                <p className="text-xs text-slate-500">No mocks logged yet</p>
                <Link href="/mocks" className="text-xs text-brand-400 hover:underline mt-1 block">Log your first mock →</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        {[
          { href: '/study-coach', label: 'Ask AI Coach', icon: '🤖', desc: 'Get instant help' },
          { href: '/syllabus',    label: 'Browse Syllabus', icon: '📚', desc: 'Track topics' },
          { href: '/mocks',       label: 'Log Mock Test', icon: '📝', desc: 'Record scores' },
          { href: '/planner',     label: 'Study Plan', icon: '📅', desc: 'Weekly schedule' },
        ].map(({ href, label, icon, desc }) => (
          <Link key={href} href={href}
            className="glass rounded-2xl p-4 hover:bg-white/5 transition-all duration-200 group">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-xs font-semibold text-white group-hover:text-brand-300 transition-colors">{label}</div>
            <div className="text-xs text-slate-500">{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
