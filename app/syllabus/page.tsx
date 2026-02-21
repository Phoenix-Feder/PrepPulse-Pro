'use client'
import { useState, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTopicProgress } from '@/hooks/useTopicProgress'
import { syllabusData, EXAM_LIST, getExamById } from '@/lib/syllabus-data'
import { PageHeader, Badge, StatusBadge, ProgressBar } from '@/components/ui'
import type { Topic, TopicStatus } from '@/types'
import {
  BookOpen, ChevronDown, ChevronRight, Search,
  Clock, Filter, CheckCircle2, Circle, Timer
} from 'lucide-react'
import clsx from 'clsx'
import Link from 'next/link'

const STATUS_CYCLE: TopicStatus[] = ['not_started', 'in_progress', 'completed']

function TopicRow({ topic, status, onStatusChange }: {
  topic: Topic
  status: TopicStatus
  onStatusChange: (id: string, status: TopicStatus) => void
}) {
  const [expanded, setExpanded] = useState(false)

  const nextStatus = () => {
    const idx = STATUS_CYCLE.indexOf(status)
    return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
  }

  return (
    <div className={clsx(
      'rounded-xl border transition-all duration-200',
      status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/5' :
      status === 'in_progress' ? 'border-amber-500/20 bg-amber-500/5' :
      'border-white/6 bg-white/2 hover:bg-white/4'
    )}>
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Status toggle */}
        <button
          onClick={() => onStatusChange(topic.id, nextStatus())}
          className="flex-shrink-0 transition-transform hover:scale-110"
          title={`Mark as ${nextStatus()}`}
        >
          {status === 'completed' ? (
            <CheckCircle2 size={18} className="text-emerald-400" />
          ) : status === 'in_progress' ? (
            <div className="w-[18px] h-[18px] rounded-full border-2 border-amber-400 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
          ) : (
            <Circle size={18} className="text-slate-600" />
          )}
        </button>

        {/* Topic info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={clsx('text-sm font-medium', status === 'completed' ? 'text-emerald-300 line-through opacity-70' : 'text-white')}>
              {topic.name}
            </span>
            <Badge label={topic.weightage} variant={topic.weightage.toLowerCase() as 'high' | 'medium' | 'low'} />
            <Badge label={topic.difficulty} variant={topic.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'} />
          </div>
          {!expanded && (
            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <Clock size={10} /> {topic.prepTime}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={`/study-coach?topic=${encodeURIComponent(topic.name)}`}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 transition-all"
          >
            Ask AI
          </Link>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg text-slate-500 hover:text-white transition-colors"
          >
            <ChevronDown size={14} className={clsx('transition-transform', expanded && 'rotate-180')} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-white/5 mt-1">
          <p className="text-xs text-slate-400 leading-relaxed">{topic.description}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <Timer size={11} className="text-slate-500" />
            <span className="text-xs text-slate-500">Suggested prep time: <span className="text-white">{topic.prepTime}</span></span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SyllabusPage() {
  const { user, profile } = useAuth()
  const { progress, updateTopic, getTopicStatus } = useTopicProgress(user?.uid)
  const [selectedExamId, setSelectedExamId] = useState(profile?.selectedExam || syllabusData[0].examId)
  const [selectedStage, setSelectedStage] = useState<string>('')
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set())
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<TopicStatus | 'all'>('all')

  const exam = getExamById(selectedExamId || syllabusData[0].examId)
  const stageNames = exam ? Object.keys(exam.stages) : []

  const currentStage = selectedStage || stageNames[0] || ''
  const stage = exam?.stages[currentStage as keyof typeof exam.stages]

  const toggleSubject = (id: string) => {
    setExpandedSubjects(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleStatusChange = (topicId: string, status: TopicStatus) => {
    const masteryMap: Record<TopicStatus, number> = { not_started: 0, in_progress: 40, completed: 100 }
    updateTopic(topicId, status, masteryMap[status])
  }

  const getSubjectStats = (subjectId: string, topics: Topic[]) => {
    const completed = topics.filter(t => getTopicStatus(t.id) === 'completed').length
    const inProgress = topics.filter(t => getTopicStatus(t.id) === 'in_progress').length
    return { completed, inProgress, total: topics.length }
  }

  const totalTopics = stage?.subjects.reduce((sum, s) => sum + s.sections.reduce((ss, sec) => ss + sec.topics.length, 0), 0) || 0
  const completedTopics = stage?.subjects.reduce((sum, s) => sum + s.sections.reduce((ss, sec) => ss + sec.topics.filter(t => getTopicStatus(t.id) === 'completed').length, 0), 0) || 0

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Syllabus"
        subtitle="Track your topic-level preparation"
        icon={<BookOpen size={22} />}
      />

      {/* Exam selector */}
      <div className="glass rounded-2xl p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="text-xs text-slate-500 block mb-1.5">Target Exam</label>
            <div className="flex flex-wrap gap-2">
              {EXAM_LIST.map(e => (
                <button key={e.id} onClick={() => { setSelectedExamId(e.id); setSelectedStage('') }}
                  className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    selectedExamId === e.id ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-slate-400 bg-white/5 hover:bg-white/10')}>
                  {e.name}
                </button>
              ))}
            </div>
          </div>

          {/* Overall progress */}
          <div className="w-full sm:w-48">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-slate-400">Stage progress</span>
              <span className="text-xs font-semibold text-white">{completedTopics}/{totalTopics}</span>
            </div>
            <ProgressBar value={completedTopics} max={totalTopics} color="brand" size="md" />
          </div>
        </div>
      </div>

      {/* Stage tabs */}
      {stageNames.length > 1 && (
        <div className="flex gap-2 mb-5">
          {stageNames.map(s => (
            <button key={s} onClick={() => setSelectedStage(s)}
              className={clsx('px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize',
                currentStage === s ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-slate-400 glass hover:text-white')}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Search & filter */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full input-glass rounded-xl py-2.5 pl-9 pr-4 text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as TopicStatus | 'all')}
          className="input-glass rounded-xl px-3 py-2.5 text-sm pr-8"
        >
          <option value="all">All Topics</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Subjects */}
      {stage?.subjects.map(subject => {
        const allTopics = subject.sections.flatMap(s => s.topics)
        const stats = getSubjectStats(subject.id, allTopics)
        const subjectExpanded = expandedSubjects.has(subject.id)

        const filteredTopics = allTopics.filter(t => {
          const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase())
          const matchStatus = filterStatus === 'all' || getTopicStatus(t.id) === filterStatus
          return matchSearch && matchStatus
        })

        if (searchQuery && filteredTopics.length === 0) return null

        return (
          <div key={subject.id} className="glass rounded-2xl mb-4 overflow-hidden">
            {/* Subject header */}
            <button
              onClick={() => toggleSubject(subject.id)}
              className="w-full flex items-center gap-4 p-5 hover:bg-white/3 transition-colors text-left"
            >
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: subject.color }} />
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-semibold text-white">{subject.name}</span>
                  <span className="text-xs text-slate-500">{stats.total} topics</span>
                  {stats.completed > 0 && (
                    <span className="text-xs text-emerald-400">{stats.completed} done</span>
                  )}
                </div>
                <div className="mt-2 w-full max-w-xs">
                  <ProgressBar value={stats.completed} max={stats.total} color="green" size="sm" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-slate-500">{Math.round((stats.completed / stats.total) * 100)}%</div>
                <ChevronDown size={16} className={clsx('text-slate-500 transition-transform', subjectExpanded && 'rotate-180')} />
              </div>
            </button>

            {(subjectExpanded || searchQuery) && (
              <div className="px-5 pb-5 space-y-4">
                {subject.sections.map(section => {
                  const sectionTopics = section.topics.filter(t => {
                    const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase())
                    const matchStatus = filterStatus === 'all' || getTopicStatus(t.id) === filterStatus
                    return matchSearch && matchStatus
                  })
                  if (sectionTopics.length === 0) return null

                  const sectionExpanded = expandedSections.has(section.id)

                  return (
                    <div key={section.id}>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center gap-2 mb-3 text-left group"
                      >
                        <ChevronRight size={13} className={clsx('text-slate-500 transition-transform', sectionExpanded && 'rotate-90')} />
                        <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors uppercase tracking-wide">
                          {section.name}
                        </span>
                        <span className="text-xs text-slate-600">({sectionTopics.length})</span>
                      </button>

                      {(sectionExpanded || searchQuery) && (
                        <div className="space-y-2 ml-5">
                          {sectionTopics.map(topic => (
                            <TopicRow
                              key={topic.id}
                              topic={topic}
                              status={getTopicStatus(topic.id)}
                              onStatusChange={handleStatusChange}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
