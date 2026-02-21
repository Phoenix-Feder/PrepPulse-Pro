'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getUserMocks, addMockResult, deleteMockResult } from '@/lib/firestore'
import { EXAM_LIST, getExamById } from '@/lib/syllabus-data'
import { PageHeader, StatCard, EmptyState } from '@/components/ui'
import type { MockResult } from '@/types'
import {
  ClipboardList, Plus, Trash2, TrendingUp, Target, Award, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { format } from 'date-fns'

// Default section configs per exam category
const SECTION_CONFIGS: Record<string, { name: string; max: number }[]> = {
  default: [
    { name: 'Quantitative Aptitude', max: 25 },
    { name: 'Reasoning Ability', max: 25 },
    { name: 'English Language', max: 25 },
    { name: 'General Awareness', max: 25 },
  ],
  sbi_po: [
    { name: 'Quantitative Aptitude', max: 35 },
    { name: 'Reasoning Ability', max: 35 },
    { name: 'English Language', max: 30 },
  ],
  ibps_po: [
    { name: 'Quantitative Aptitude', max: 35 },
    { name: 'Reasoning Ability', max: 35 },
    { name: 'English Language', max: 30 },
  ],
  rbi_grade_b: [
    { name: 'Quantitative Aptitude', max: 30 },
    { name: 'Reasoning Ability', max: 60 },
    { name: 'English Language', max: 30 },
    { name: 'General Awareness', max: 80 },
  ],
  upsc_prelims: [
    { name: 'General Studies I', max: 100 },
    { name: 'CSAT (Paper II)', max: 80 },
  ],
  cds: [
    { name: 'English', max: 100 },
    { name: 'General Knowledge', max: 100 },
    { name: 'Elementary Mathematics', max: 100 },
  ],
  ssc_cgl: [
    { name: 'Quantitative Aptitude', max: 50 },
    { name: 'Reasoning Ability', max: 50 },
    { name: 'English Language', max: 50 },
    { name: 'General Awareness', max: 50 },
  ],
}

function AddMockModal({ onClose, onSave, defaultExam }: {
  onClose: () => void
  onSave: (data: Omit<MockResult, 'id'>) => void
  defaultExam: string
}) {
  const [exam, setExam] = useState(defaultExam || EXAM_LIST[0].id)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [scores, setScores] = useState<Record<string, string>>({})
  const { user } = useAuth()

  const sections = SECTION_CONFIGS[exam] || SECTION_CONFIGS.default
  const maxScore = sections.reduce((s, x) => s + x.max, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const sectionScores: Record<string, number> = {}
    const sectionMaxScores: Record<string, number> = {}
    let total = 0

    sections.forEach(s => {
      const val = parseFloat(scores[s.name] || '0')
      sectionScores[s.name] = val
      sectionMaxScores[s.name] = s.max
      total += val
    })

    onSave({
      userId: user.uid,
      exam,
      totalScore: total,
      maxScore,
      sectionScores,
      sectionMaxScores,
      date,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white">Log Mock Test</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Exam</label>
            <select value={exam} onChange={e => setExam(e.target.value)}
              className="w-full input-glass rounded-xl px-3 py-2.5 text-sm">
              {EXAM_LIST.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full input-glass rounded-xl px-3 py-2.5 text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Section Scores</label>
            <div className="space-y-2.5">
              {sections.map(s => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-300">{s.name}</span>
                    <span className="text-xs text-slate-500">Max: {s.max}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={s.max}
                    step="0.25"
                    placeholder={`0 – ${s.max}`}
                    value={scores[s.name] || ''}
                    onChange={e => setScores(prev => ({ ...prev, [s.name]: e.target.value }))}
                    className="w-full input-glass rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-slate-400">Total</span>
            <span className="text-sm font-bold text-white">
              {sections.reduce((s, x) => s + parseFloat(scores[x.name] || '0'), 0).toFixed(2)} / {maxScore}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 glass hover:text-white transition-all">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold">
              Save Mock
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MocksPage() {
  const { user, profile } = useAuth()
  const [mocks, setMocks] = useState<MockResult[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!user) return
    getUserMocks(user.uid).then(data => {
      setMocks(data)
      setLoading(false)
    })
  }, [user])

  const handleSave = async (data: Omit<MockResult, 'id'>) => {
    await addMockResult(data)
    const updated = await getUserMocks(user!.uid)
    setMocks(updated)
    setShowModal(false)
    toast.success('Mock test logged!')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this mock result?')) return
    await deleteMockResult(id)
    setMocks(prev => prev.filter(m => m.id !== id))
    toast.success('Deleted')
  }

  const avgScore = mocks.length > 0
    ? mocks.reduce((s, m) => s + (m.totalScore / m.maxScore) * 100, 0) / mocks.length
    : 0

  const best = mocks.length > 0
    ? Math.max(...mocks.map(m => (m.totalScore / m.maxScore) * 100))
    : 0

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Mock Test Tracker"
        subtitle="Log and analyse your practice test performance"
        icon={<ClipboardList size={22} />}
        action={
          <button onClick={() => setShowModal(true)}
            className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Plus size={16} /> Log Mock
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Mocks Attempted" value={mocks.length} icon={<ClipboardList size={18} />} accentColor="#6366f1" />
        <StatCard title="Average Score" value={avgScore > 0 ? `${Math.round(avgScore)}%` : '—'} icon={<Target size={18} />} accentColor="#10b981" />
        <StatCard title="Best Score" value={best > 0 ? `${Math.round(best)}%` : '—'} icon={<Award size={18} />} accentColor="#f59e0b" />
        <StatCard title="Trend" value={mocks.length >= 2 ? (mocks[0].totalScore/mocks[0].maxScore > mocks[1].totalScore/mocks[1].maxScore ? '↑ Improving' : '↓ Declining') : '—'} icon={<TrendingUp size={18} />} accentColor="#8b5cf6" />
      </div>

      {/* Mock list */}
      {mocks.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={28} />}
          title="No mocks logged yet"
          description="Log your practice test results to track performance, identify weak areas, and see improvement trends over time."
          action={
            <button onClick={() => setShowModal(true)} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Plus size={15} /> Log Your First Mock
            </button>
          }
        />
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/8">
            <h2 className="text-sm font-semibold text-white">All Mock Results</h2>
          </div>
          <div className="divide-y divide-white/5">
            {mocks.map(mock => {
              const pct = Math.round((mock.totalScore / mock.maxScore) * 100)
              const examMeta = EXAM_LIST.find(e => e.id === mock.exam)
              return (
                <div key={mock.id} className="p-4 hover:bg-white/3 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Score circle */}
                      <div className={clsx(
                        'w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 font-bold',
                        pct >= 70 ? 'bg-emerald-500/15 text-emerald-400' :
                        pct >= 50 ? 'bg-amber-500/15 text-amber-400' :
                        'bg-red-500/15 text-red-400'
                      )}>
                        <span className="text-base leading-none">{pct}</span>
                        <span className="text-[9px] text-current opacity-70">%</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white">{examMeta?.name || mock.exam}</span>
                          <span className="text-xs text-slate-500">{mock.date}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{mock.totalScore} / {mock.maxScore} marks</div>
                        {/* Section breakdown */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(mock.sectionScores).map(([section, score]) => {
                            const max = mock.sectionMaxScores?.[section] || 25
                            const sPct = Math.round((score / max) * 100)
                            return (
                              <span key={section} className={clsx(
                                'text-[10px] px-2 py-0.5 rounded-md font-medium',
                                sPct >= 70 ? 'bg-emerald-500/10 text-emerald-400' :
                                sPct >= 50 ? 'bg-amber-500/10 text-amber-400' :
                                'bg-red-500/10 text-red-400'
                              )}>
                                {section.split(' ').map(w => w[0]).join('')}: {score}/{max}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => mock.id && handleDelete(mock.id)}
                      className="p-2 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showModal && (
        <AddMockModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          defaultExam={profile?.selectedExam || EXAM_LIST[0].id}
        />
      )}
    </div>
  )
}
