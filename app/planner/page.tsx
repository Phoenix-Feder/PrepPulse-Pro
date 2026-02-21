'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTopicProgress } from '@/hooks/useTopicProgress'
import { getUserMocks, calculateMockAnalytics, updateUserProfile } from '@/lib/firestore'
import { getExamById } from '@/lib/syllabus-data'
import { PageHeader, ProgressBar } from '@/components/ui'
import type { MockResult, StudyPlanDay } from '@/types'
import { Calendar, Clock, Zap, RefreshCw, BookOpen, Edit3, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { format, addDays, startOfWeek } from 'date-fns'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Rule-based study plan generator
function generateStudyPlan(params: {
  dailyHours: number
  weakSections: string[]
  pendingTopics: string[]
  examName: string
  studyDays: string[]
}): StudyPlanDay[] {
  const { dailyHours, weakSections, pendingTopics, studyDays } = params
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })

  const allTasks: { subject: string; topic: string; priority: 'high' | 'medium' | 'low'; type: 'study' | 'revision' | 'practice' }[] = []

  // Prioritise weak sections
  weakSections.forEach(section => {
    allTasks.push({ subject: section, topic: `Intensive practice — ${section}`, priority: 'high', type: 'practice' })
    allTasks.push({ subject: section, topic: `Concept revision — ${section}`, priority: 'high', type: 'revision' })
  })

  // Add pending topics
  pendingTopics.slice(0, 20).forEach(topic => {
    const isWeak = weakSections.some(s => topic.toLowerCase().includes(s.toLowerCase().split(' ')[0]))
    allTasks.push({
      subject: 'Syllabus',
      topic,
      priority: isWeak ? 'high' : 'medium',
      type: 'study'
    })
  })

  // Fill with general tasks if not enough
  const generalTasks = [
    { subject: 'Current Affairs', topic: 'Read banking/economy news', priority: 'medium' as const, type: 'study' as const },
    { subject: 'Revision', topic: 'Quick formula revision — Quant', priority: 'medium' as const, type: 'revision' as const },
    { subject: 'Mock Analysis', topic: 'Review previous mock mistakes', priority: 'high' as const, type: 'practice' as const },
    { subject: 'Vocabulary', topic: 'Learn 20 new English words', priority: 'low' as const, type: 'study' as const },
    { subject: 'General Awareness', topic: 'Static GK — capitals & currencies', priority: 'low' as const, type: 'study' as const },
    { subject: 'Mental Maths', topic: 'Speed calculation practice', priority: 'medium' as const, type: 'practice' as const },
    { subject: 'Reasoning', topic: 'Puzzle set practice (5 puzzles)', priority: 'high' as const, type: 'practice' as const },
  ]
  while (allTasks.length < studyDays.length * 3) {
    allTasks.push(...generalTasks)
  }

  const plan: StudyPlanDay[] = []
  const minutesPerHour = 60
  let taskIdx = 0

  studyDays.forEach((day, i) => {
    const dayDate = addDays(weekStart, DAYS.indexOf(day))
    const sessions = []
    let remainingMinutes = dailyHours * minutesPerHour

    // Session durations: 90min for high priority, 60min for medium, 45min for low
    const SESSION_DURATIONS = { high: 90, medium: 60, low: 45 }

    while (remainingMinutes >= 30 && taskIdx < allTasks.length) {
      const task = allTasks[taskIdx]
      const dur = SESSION_DURATIONS[task.priority]
      const actualDur = Math.min(dur, remainingMinutes)
      if (actualDur < 30) break

      sessions.push({ ...task, duration: actualDur })
      remainingMinutes -= actualDur
      taskIdx++

      // Short break buffer
      remainingMinutes -= 10
    }

    plan.push({
      day,
      date: format(dayDate, 'dd MMM'),
      sessions,
      totalHours: sessions.reduce((s, sess) => s + sess.duration, 0) / 60,
    })
  })

  return plan
}

const PRIORITY_COLORS = {
  high: 'border-red-500/30 bg-red-500/8',
  medium: 'border-brand-500/30 bg-brand-500/8',
  low: 'border-emerald-500/30 bg-emerald-500/8',
}
const PRIORITY_LABELS = { high: 'High Priority', medium: 'Medium', low: 'Low' }
const TYPE_ICONS: Record<string, string> = { study: '📖', revision: '🔄', practice: '⚡' }

export default function PlannerPage() {
  const { user, profile } = useAuth()
  const { progress } = useTopicProgress(user?.uid)
  const [mocks, setMocks] = useState<MockResult[]>([])
  const [plan, setPlan] = useState<StudyPlanDay[]>([])
  const [dailyHours, setDailyHours] = useState(profile?.preferences?.dailyStudyHours || 4)
  const [studyDays, setStudyDays] = useState<string[]>(profile?.preferences?.studyDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
  const [generated, setGenerated] = useState(false)
  const [editingHours, setEditingHours] = useState(false)
  const [selectedDay, setSelectedDay] = useState(0)

  useEffect(() => {
    if (user) getUserMocks(user.uid).then(setMocks)
  }, [user])

  const exam = profile?.selectedExam ? getExamById(profile.selectedExam) : null
  const analytics = calculateMockAnalytics(mocks)

  const weakSections = analytics?.weakSections.map(w => w.section) || profile?.preferences?.weakSections || []

  // Get pending topics
  const pendingTopics = exam
    ? Object.values(exam.stages).flatMap(stage =>
        stage?.subjects.flatMap(s => s.sections.flatMap(sec =>
          sec.topics.filter(t => {
            const status = progress[t.id]?.status
            return status === 'not_started' || status === 'in_progress'
          }).map(t => t.name)
        )) || []
      )
    : []

  const generatePlan = async () => {
    if (!profile?.selectedExam) {
      toast.error('Please select a target exam first')
      return
    }

    const newPlan = generateStudyPlan({
      dailyHours,
      weakSections,
      pendingTopics,
      examName: exam?.examName || '',
      studyDays,
    })
    setPlan(newPlan)
    setGenerated(true)
    setSelectedDay(0)

    // Save preferences
    if (user) {
      await updateUserProfile(user.uid, {
        preferences: { dailyStudyHours: dailyHours, weakSections, studyDays }
      })
    }
    toast.success('Study plan generated!')
  }

  const toggleDay = (day: string) => {
    setStudyDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Study Planner"
        subtitle="Personalised weekly study schedule based on your progress"
        icon={<Calendar size={22} />}
        action={
          generated ? (
            <button onClick={generatePlan}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm glass text-slate-400 hover:text-white transition-all">
              <RefreshCw size={14} /> Regenerate
            </button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Settings panel */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Plan Settings</h3>

            {/* Daily hours */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock size={13} /> Daily study hours
                </label>
                {editingHours ? (
                  <button onClick={() => setEditingHours(false)} className="text-brand-400 hover:text-brand-300">
                    <Check size={14} />
                  </button>
                ) : (
                  <button onClick={() => setEditingHours(true)} className="text-slate-500 hover:text-slate-300">
                    <Edit3 size={12} />
                  </button>
                )}
              </div>
              <input type="range" min="1" max="12" value={dailyHours}
                onChange={e => setDailyHours(+e.target.value)}
                className="w-full accent-brand-500 mb-1" />
              <div className="flex justify-between text-xs text-slate-600">
                <span>1h</span>
                <span className="text-brand-300 font-semibold">{dailyHours}h/day</span>
                <span>12h</span>
              </div>
            </div>

            {/* Study days */}
            <div>
              <label className="text-xs text-slate-400 mb-2 block">Study days</label>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map((day, i) => (
                  <button key={day} onClick={() => toggleDay(day)}
                    className={clsx(
                      'py-2 rounded-lg text-xs font-medium transition-all',
                      studyDays.includes(day)
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                        : 'text-slate-600 bg-white/5 hover:bg-white/10'
                    )}>
                    {SHORT_DAYS[i]}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-2">{studyDays.length} days/week</p>
            </div>
          </div>

          {/* Weak sections */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Zap size={14} className="text-amber-400" /> Focus Areas
            </h3>
            {weakSections.length > 0 ? (
              <div className="space-y-2">
                {weakSections.map(s => (
                  <div key={s} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <span className="text-amber-400 text-xs">⚠</span>
                    <span className="text-xs text-slate-300">{s}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Log mocks to auto-detect weak areas, or set them in onboarding</p>
            )}
          </div>

          {/* Pending topics count */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BookOpen size={14} className="text-brand-400" /> Pending Topics
            </h3>
            <div className="text-2xl font-bold text-white mb-1">{pendingTopics.length}</div>
            <p className="text-xs text-slate-500 mb-3">topics to cover</p>
            <ProgressBar
              value={Object.values(progress).filter(p => p.status === 'completed').length}
              max={Object.values(progress).filter(p => p.status === 'completed').length + pendingTopics.length}
              color="brand"
            />
          </div>

          <button onClick={generatePlan}
            className="w-full btn-primary py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
            <Calendar size={16} />
            {generated ? 'Regenerate Plan' : 'Generate Weekly Plan'}
          </button>
        </div>

        {/* Plan display */}
        <div className="lg:col-span-2">
          {!generated ? (
            <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-96 text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
                <Calendar size={28} className="text-brand-400" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Generate your weekly plan</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                We'll create a personalised schedule based on your weak areas, pending topics, and available study hours.
              </p>
            </div>
          ) : (
            <div className="glass rounded-2xl overflow-hidden">
              {/* Day tabs */}
              <div className="flex overflow-x-auto border-b border-white/10">
                {plan.map((day, i) => (
                  <button key={day.day} onClick={() => setSelectedDay(i)}
                    className={clsx(
                      'flex flex-col items-center px-4 py-3 text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
                      selectedDay === i
                        ? 'text-brand-300 border-b-2 border-brand-500 bg-brand-500/10'
                        : 'text-slate-500 hover:text-slate-300'
                    )}>
                    <span>{day.day.slice(0, 3)}</span>
                    <span className="text-[10px] text-slate-600">{day.date}</span>
                    <span className={clsx('mt-1 text-[10px]', selectedDay === i ? 'text-brand-400' : 'text-slate-600')}>
                      {day.totalHours.toFixed(1)}h
                    </span>
                  </button>
                ))}
              </div>

              {/* Day content */}
              {plan[selectedDay] && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-white">{plan[selectedDay].day}</h3>
                      <p className="text-xs text-slate-500">{plan[selectedDay].date} • {plan[selectedDay].totalHours.toFixed(1)} hours planned</p>
                    </div>
                    <div className="text-xs text-slate-500">{plan[selectedDay].sessions.length} sessions</div>
                  </div>

                  <div className="space-y-3">
                    {plan[selectedDay].sessions.map((session, i) => (
                      <div key={i} className={clsx('rounded-xl border p-4 transition-all', PRIORITY_COLORS[session.priority])}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="text-xl flex-shrink-0">{TYPE_ICONS[session.type]}</span>
                            <div>
                              <div className="text-sm font-medium text-white">{session.topic}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{session.subject}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className={clsx('text-[10px] font-semibold px-2 py-0.5 rounded-md',
                              session.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              session.priority === 'medium' ? 'bg-brand-500/20 text-brand-400' :
                              'bg-emerald-500/20 text-emerald-400'
                            )}>
                              {PRIORITY_LABELS[session.priority]}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock size={10} /> {session.duration} min
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {plan[selectedDay].sessions.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">Rest day — no sessions planned</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
