'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTopicProgress } from '@/hooks/useTopicProgress'
import { getUserMocks, calculateMockAnalytics } from '@/lib/firestore'
import { getExamById } from '@/lib/syllabus-data'
import { PageHeader, StatCard, EmptyState, ProgressBar } from '@/components/ui'
import type { MockResult } from '@/types'
import {
  BarChart2, TrendingUp, Target, BookOpen, AlertTriangle
} from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, Legend
} from 'recharts'

const chartTheme = {
  tooltip: {
    contentStyle: { background: '#1c1c30', border: '1px solid #2a2a45', borderRadius: '12px', fontSize: '12px' },
    labelStyle: { color: '#94a3b8' },
    itemStyle: { color: '#a5b8fb' },
  },
  grid: { stroke: '#2a2a45', strokeDasharray: '3 3' },
  axis: { tick: { fill: '#64748b', fontSize: 11 }, axisLine: false, tickLine: false },
}

export default function AnalyticsPage() {
  const { user, profile } = useAuth()
  const { progress } = useTopicProgress(user?.uid)
  const [mocks, setMocks] = useState<MockResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getUserMocks(user.uid).then(data => {
      setMocks(data)
      setLoading(false)
    })
  }, [user])

  const analytics = calculateMockAnalytics(mocks)
  const exam = profile?.selectedExam ? getExamById(profile.selectedExam) : null

  // Topic progress by subject
  const subjectProgress = exam ? Object.entries(exam.stages).slice(0, 1).flatMap(([, stage]) =>
    stage?.subjects.map(subject => {
      const topics = subject.sections.flatMap(s => s.topics)
      const completed = topics.filter(t => progress[t.id]?.status === 'completed').length
      return { subject: subject.name.split(' ').slice(0, 2).join(' '), completed, total: topics.length, pct: Math.round((completed / topics.length) * 100) }
    }) || []
  ) : []

  // Section comparison radar data
  const radarData = analytics?.sectionAverages.map(({ section, average }) => ({
    subject: section.split(' ').map((w: string) => w[0]).join(''),
    fullName: section,
    score: Math.round(average),
  })) || []

  if (mocks.length === 0 && Object.keys(progress).length === 0) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Analytics" subtitle="Performance insights and progress tracking" icon={<BarChart2 size={22} />} />
        <EmptyState
          icon={<BarChart2 size={28} />}
          title="No data to analyse yet"
          description="Log mock tests and mark topics in the syllabus module to see detailed performance analytics."
          action={
            <div className="flex gap-3">
              <a href="/mocks" className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold">Log a Mock Test</a>
              <a href="/syllabus" className="glass px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white">Track Syllabus</a>
            </div>
          }
        />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Analytics" subtitle="Performance insights and progress tracking" icon={<BarChart2 size={22} />} />

      {/* Stats */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Mocks" value={analytics.totalAttempts} icon={<Target size={18} />} accentColor="#6366f1" />
          <StatCard title="Average Score" value={`${Math.round(analytics.avgScore)}%`} icon={<TrendingUp size={18} />} accentColor="#10b981" />
          <StatCard title="Best Score" value={analytics.trend.length > 0 ? `${Math.max(...analytics.trend.map(t => t.score))}%` : '—'} icon={<BarChart2 size={18} />} accentColor="#f59e0b" />
          <StatCard title="Weak Sections" value={analytics.weakSections.length} icon={<AlertTriangle size={18} />} accentColor="#ef4444" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Score trend */}
        {analytics && analytics.trend.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-5">Score Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={analytics.trend}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey="attempt" {...chartTheme.axis} />
                <YAxis domain={[0, 100]} {...chartTheme.axis} />
                <Tooltip {...chartTheme.tooltip} formatter={(v: number) => [`${v}%`, 'Score']} />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5}
                  dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#818ef7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Section comparison bar */}
        {analytics && analytics.sectionAverages.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-5">Section Averages</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.sectionAverages.map(({ section, average }) => ({
                section: section.split(' ').map(w => w[0]).join(''),
                average: Math.round(average),
                fullName: section,
              }))}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey="section" {...chartTheme.axis} />
                <YAxis domain={[0, 100]} {...chartTheme.axis} />
                <Tooltip {...chartTheme.tooltip} formatter={(v: number) => [`${v}%`, 'Score']}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''} />
                <Bar dataKey="average" fill="#6366f1" radius={[6, 6, 0, 0]}
                  label={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Weak sections detail */}
        {analytics && analytics.weakSections.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-400" /> Weak Areas
            </h3>
            <p className="text-xs text-slate-500 mb-4">Sections scoring below 60%</p>
            <div className="space-y-4">
              {analytics.weakSections.map(({ section, average }) => (
                <div key={section}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-300">{section}</span>
                    <span className="text-xs font-semibold text-red-400">{Math.round(average)}%</span>
                  </div>
                  <ProgressBar value={average} color="red" size="md" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topic progress */}
        {subjectProgress.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <BookOpen size={14} className="text-brand-400" /> Topic Mastery
            </h3>
            <p className="text-xs text-slate-500 mb-4">Completed topics per subject</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={subjectProgress} layout="vertical">
                <CartesianGrid {...chartTheme.grid} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} {...chartTheme.axis} />
                <YAxis type="category" dataKey="subject" {...chartTheme.axis} width={80} />
                <Tooltip {...chartTheme.tooltip} formatter={(v: number) => [`${v}%`, 'Completed']} />
                <Bar dataKey="pct" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Detailed section table */}
        {analytics && analytics.sectionAverages.length > 0 && (
          <div className="glass rounded-2xl p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">Detailed Section Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs text-slate-500 pb-3 font-medium">Section</th>
                    <th className="text-right text-xs text-slate-500 pb-3 font-medium">Avg Score</th>
                    <th className="text-right text-xs text-slate-500 pb-3 font-medium">Status</th>
                    <th className="pl-4 text-xs text-slate-500 pb-3 font-medium">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {analytics.sectionAverages.map(({ section, average }) => {
                    const status = average >= 70 ? 'Strong' : average >= 50 ? 'Average' : 'Weak'
                    const color = average >= 70 ? 'text-emerald-400' : average >= 50 ? 'text-amber-400' : 'text-red-400'
                    return (
                      <tr key={section} className="hover:bg-white/3 transition-colors">
                        <td className="py-3 text-slate-300">{section}</td>
                        <td className={`py-3 text-right font-semibold ${color}`}>{Math.round(average)}%</td>
                        <td className={`py-3 text-right text-xs ${color}`}>{status}</td>
                        <td className="py-3 pl-4 w-40">
                          <ProgressBar value={average} color={average >= 70 ? 'green' : average >= 50 ? 'brand' : 'red'} size="sm" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
