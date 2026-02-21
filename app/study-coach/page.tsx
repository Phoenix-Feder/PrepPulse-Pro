'use client'
import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getUserMocks } from '@/lib/firestore'
import { sendAIMessage, buildPerformanceSummary } from '@/lib/ai'
import { EXAM_LIST, getExamById } from '@/lib/syllabus-data'
import { PageHeader, LoadingSpinner } from '@/components/ui'
import type { ChatMessage, MockResult } from '@/types'
import { Bot, Send, Sparkles, RefreshCw, MessageSquare, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const QUICK_PROMPTS = [
  { label: 'Explain a concept', prompt: 'Explain the concept of compound interest with a step-by-step example for banking exams.' },
  { label: 'Practice questions', prompt: 'Give me 5 practice questions on seating arrangement for SBI PO level, with solutions.' },
  { label: 'Revision strategy', prompt: 'What is the best 30-day revision strategy for the quantitative aptitude section?' },
  { label: 'Analyse weakness', prompt: 'I\'m struggling with data interpretation. What are the key strategies to improve my accuracy and speed?' },
  { label: 'Current affairs tips', prompt: 'What are the most important banking awareness topics for the next 3 months?' },
  { label: 'Exam pattern', prompt: 'What is the complete exam pattern and marking scheme for this exam?' },
]

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h3>$1</h3>')
    .replace(/^# (.*$)/gm, '<h3>$1</h3>')
    .replace(/^\d+\. (.*)/gm, '<li>$1</li>')
    .replace(/^- (.*)/gm, '<li>$1</li>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
}

export default function StudyCoachPage() {
  const searchParams = useSearchParams()
  const topicFromUrl = searchParams.get('topic') || ''
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentTopic, setCurrentTopic] = useState(topicFromUrl)
  const [mocks, setMocks] = useState<MockResult[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (user) {
      getUserMocks(user.uid).then(setMocks)
    }
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (topicFromUrl && messages.length === 0) {
      handleSend(`Please explain "${topicFromUrl}" with key concepts and practice questions for my exam.`)
    }
  }, [topicFromUrl])

  const examMeta = EXAM_LIST.find(e => e.id === profile?.selectedExam)
  const exam = profile?.selectedExam ? getExamById(profile.selectedExam) : null

  const handleSend = async (messageOverride?: string) => {
    const text = (messageOverride || input).trim()
    if (!text || loading) return

    const userMessage: ChatMessage = { role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const performanceSummary = buildPerformanceSummary(mocks)
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }))

      const data = await sendAIMessage({
        message: text,
        exam: profile?.selectedExam,
        examName: examMeta?.name,
        topic: currentTopic,
        performanceSummary,
        conversationHistory: history,
      })

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        provider: data.provider,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to get response')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([])
    setCurrentTopic('')
    toast.success('Chat cleared')
  }

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-64px)]">
      <PageHeader
        title="AI Study Coach"
        subtitle={examMeta ? `Specialised for ${examMeta.name}` : 'Your personal exam preparation assistant'}
        icon={<Bot size={22} />}
        action={
          messages.length > 0 ? (
            <button onClick={clearChat} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs glass text-slate-400 hover:text-white transition-all">
              <RefreshCw size={13} /> New chat
            </button>
          ) : undefined
        }
      />

      <div className="flex flex-1 gap-5 overflow-hidden min-h-0">
        {/* Chat area */}
        <div className="flex-1 flex flex-col glass rounded-2xl overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/20 flex items-center justify-center mb-4">
                  <Sparkles size={28} className="text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">PrepPulse AI Coach</h3>
                <p className="text-sm text-slate-400 max-w-sm mb-6">
                  Ask anything about your exam — concepts, practice questions, strategies, or weak area analysis.
                </p>
                {examMeta && (
                  <div className="px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 mb-6">
                    🎯 Optimised for <strong>{examMeta.name}</strong>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {QUICK_PROMPTS.map(({ label, prompt }) => (
                    <button
                      key={label}
                      onClick={() => handleSend(prompt)}
                      className="px-3 py-2.5 rounded-xl text-xs text-slate-400 bg-white/3 border border-white/8 hover:bg-white/8 hover:text-white transition-all text-left"
                    >
                      <span className="font-medium text-slate-300">{label}</span>
                      <p className="text-slate-600 mt-0.5 line-clamp-1 text-[10px]">{prompt.slice(0, 60)}...</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={clsx('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500/30 to-purple-500/30 border border-brand-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={14} className="text-brand-400" />
                    </div>
                  )}
                  <div className={clsx('max-w-[80%]', msg.role === 'user' ? 'chat-user px-4 py-3' : 'chat-assistant px-4 py-3')}>
                    {msg.role === 'assistant' ? (
                      <div
                        className="prose-chat text-sm text-slate-200"
                        dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(msg.content)}</p>` }}
                      />
                    ) : (
                      <p className="text-sm text-white">{msg.content}</p>
                    )}
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5">
                      <span className="text-[10px] text-slate-600">
                        {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.provider && (
                        <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded',
                          msg.provider === 'gemini' ? 'text-blue-400 bg-blue-400/10' : 'text-orange-400 bg-orange-400/10')}>
                          {msg.provider === 'gemini' ? '✦ Gemini' : '⚡ Groq'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500/30 to-purple-500/30 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-brand-400" />
                </div>
                <div className="chat-assistant px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 dot-1" />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 dot-2" />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 dot-3" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/6">
            {currentTopic && (
              <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-brand-500/10 rounded-xl border border-brand-500/20">
                <span className="text-[11px] text-brand-400">Topic: <strong>{currentTopic}</strong></span>
                <button onClick={() => setCurrentTopic('')} className="ml-auto text-slate-500 hover:text-white text-xs">✕</button>
              </div>
            )}
            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about concepts, request practice questions, or get study strategies..."
                rows={1}
                className="flex-1 input-glass rounded-xl px-4 py-3 text-sm resize-none max-h-32 overflow-y-auto"
                style={{ minHeight: '48px' }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-12 h-12 btn-primary rounded-xl flex items-center justify-center disabled:opacity-40 flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-slate-600 mt-2 text-center">
              Press Enter to send · Shift+Enter for new line · Powered by Gemini AI with Groq fallback
            </p>
          </div>
        </div>

        {/* Context panel */}
        <div className="hidden xl:flex flex-col w-64 gap-4">
          {/* Exam context */}
          <div className="glass rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Context</h3>
            {examMeta ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                  <span className="text-lg">{exam?.icon || '📚'}</span>
                  <div>
                    <div className="text-xs font-semibold text-white">{examMeta.name}</div>
                    <div className="text-[10px] text-slate-500">{examMeta.category}</div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Current topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Seating Arrangement"
                    value={currentTopic}
                    onChange={e => setCurrentTopic(e.target.value)}
                    className="w-full input-glass rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select an exam in onboarding for personalised coaching</p>
            )}
          </div>

          {/* Quick actions */}
          <div className="glass rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Quick Actions</h3>
            <div className="space-y-1.5">
              {QUICK_PROMPTS.slice(0, 4).map(({ label, prompt }) => (
                <button
                  key={label}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/8 transition-all"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* AI info */}
          <div className="glass rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">AI Provider</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Zap size={12} className="text-blue-400" />
                <span className="text-xs text-blue-300">Gemini 1.5 Flash</span>
                <span className="text-[10px] text-slate-500 ml-auto">Primary</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Zap size={12} className="text-orange-400" />
                <span className="text-xs text-orange-300">Groq Llama3</span>
                <span className="text-[10px] text-slate-500 ml-auto">Fallback</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
