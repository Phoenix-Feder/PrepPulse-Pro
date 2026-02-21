// Client-side helper for calling the AI chat API route

export interface AIRequestPayload {
  message: string
  exam?: string
  examName?: string
  topic?: string
  performanceSummary?: string
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
}

export interface AIResponse {
  reply: string
  provider: 'gemini' | 'groq'
  error?: string
}

export async function sendAIMessage(payload: AIRequestPayload): Promise<AIResponse> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP ${response.status}`)
  }

  return response.json()
}

export function buildPerformanceSummary(
  mocks: { totalScore: number; maxScore: number; sectionScores: Record<string, number>; sectionMaxScores?: Record<string, number> }[]
): string {
  if (mocks.length === 0) return 'No mock tests attempted yet.'

  const avgPercent = Math.round(
    mocks.reduce((sum, m) => sum + (m.totalScore / m.maxScore) * 100, 0) / mocks.length
  )

  const sectionTotals: Record<string, number[]> = {}
  mocks.forEach(mock => {
    Object.entries(mock.sectionScores).forEach(([section, score]) => {
      const max = mock.sectionMaxScores?.[section] || 25
      if (!sectionTotals[section]) sectionTotals[section] = []
      sectionTotals[section].push((score / max) * 100)
    })
  })

  const weakSections = Object.entries(sectionTotals)
    .map(([s, scores]) => ({ s, avg: scores.reduce((a, b) => a + b, 0) / scores.length }))
    .filter(x => x.avg < 60)
    .map(x => `${x.s} (${Math.round(x.avg)}%)`)
    .join(', ')

  return `Attempted ${mocks.length} mocks. Average score: ${avgPercent}%. ${weakSections ? `Weak areas: ${weakSections}.` : 'No major weak areas detected.'}`
}
