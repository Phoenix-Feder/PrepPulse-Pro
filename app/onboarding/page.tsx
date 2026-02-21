'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateUserProfile } from '@/lib/firestore'
import { useAuth } from '@/hooks/useAuth'
import { EXAM_LIST } from '@/lib/syllabus-data'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import { Zap, Check, ChevronRight, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const categories = ['All', 'Banking', 'Insurance', 'Government', 'Defence']

const STRENGTHS = [
  'Quantitative Aptitude', 'Reasoning Ability', 'English Language',
  'General Awareness', 'Computer Knowledge', 'Banking Awareness',
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')
  const [weakSections, setWeakSections] = useState<string[]>([])
  const [dailyHours, setDailyHours] = useState(4)
  const [saving, setSaving] = useState(false)

  const filtered = EXAM_LIST.filter(e => selectedCat === 'All' || e.category === selectedCat)

  const toggleWeak = (s: string) => {
    setWeakSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const handleSave = async () => {
    if (!user || !selectedExam) return
    setSaving(true)
    await updateUserProfile(user.uid, {
      selectedExam,
      preferences: { dailyStudyHours: dailyHours, weakSections },
    })
    toast.success('Profile set up! Welcome to PrepPulse Pro.')
    router.push('/dashboard')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto mb-4 glow-brand">
              <Zap size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Set up your preparation</h1>
            <p className="text-slate-400 text-sm mt-1">Step {step} of 2 — {step === 1 ? 'Choose your target exam' : 'Personalise your plan'}</p>
            {/* Step dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, 2].map(s => (
                <div key={s} className={clsx('h-1.5 rounded-full transition-all duration-300', s === step ? 'w-8 bg-brand-500' : s < step ? 'w-4 bg-brand-700' : 'w-4 bg-white/15')} />
              ))}
            </div>
          </div>

          {step === 1 ? (
            <div className="glass-strong rounded-2xl p-6">
              {/* Category filter */}
              <div className="flex gap-2 flex-wrap mb-5">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCat(cat)}
                    className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      selectedCat === cat ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'text-slate-400 bg-white/5 hover:bg-white/10')}>
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {filtered.map(exam => (
                  <button key={exam.id} onClick={() => setSelectedExam(exam.id)}
                    className={clsx(
                      'relative flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 border',
                      selectedExam === exam.id
                        ? 'border-brand-500/50 bg-brand-500/10'
                        : 'border-white/8 bg-white/3 hover:bg-white/6'
                    )}>
                    <div className="text-2xl">{exam.id.includes('sbi') || exam.id.includes('ibps') || exam.id.includes('rbi') ? '🏦' : exam.id.includes('lic') || exam.id.includes('niacl') ? '🛡️' : exam.id.includes('upsc') ? '⚖️' : exam.id.includes('cds') ? '🎖️' : '📋'}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{exam.name}</div>
                      <div className="text-xs text-slate-500">{exam.category}</div>
                    </div>
                    {selectedExam === exam.id && (
                      <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                        <Check size={11} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button onClick={() => selectedExam && setStep(2)}
                disabled={!selectedExam}
                className="w-full btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
                Continue <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div className="glass-strong rounded-2xl p-6 space-y-6">
              {/* Daily hours */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-brand-400" /> Daily study hours
                </label>
                <div className="flex items-center gap-4">
                  <input type="range" min="1" max="12" value={dailyHours}
                    onChange={e => setDailyHours(+e.target.value)}
                    className="flex-1 accent-brand-500" />
                  <div className="w-16 text-center glass rounded-xl py-2 text-sm font-bold text-brand-300">
                    {dailyHours}h/day
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {dailyHours <= 2 ? 'Casual pace — good for working professionals' :
                   dailyHours <= 4 ? 'Balanced preparation — recommended for most' :
                   dailyHours <= 6 ? 'Intensive preparation — for dedicated aspirants' :
                   'Full-time preparation — maximum effort'}
                </div>
              </div>

              {/* Weak sections */}
              <div>
                <label className="block text-sm font-semibold text-white mb-1">Subjects you find challenging</label>
                <p className="text-xs text-slate-500 mb-3">We'll prioritise these in your study plan (optional)</p>
                <div className="grid grid-cols-2 gap-2">
                  {STRENGTHS.map(s => (
                    <button key={s} onClick={() => toggleWeak(s)}
                      className={clsx(
                        'px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all border',
                        weakSections.includes(s)
                          ? 'border-red-500/40 bg-red-500/10 text-red-300'
                          : 'border-white/8 bg-white/3 text-slate-400 hover:bg-white/6'
                      )}>
                      {weakSections.includes(s) && <span className="mr-1.5">⚠</span>}
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl text-sm font-medium text-slate-400 glass hover:text-white transition-all">
                  Back
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? 'Setting up...' : 'Start Preparing 🚀'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
