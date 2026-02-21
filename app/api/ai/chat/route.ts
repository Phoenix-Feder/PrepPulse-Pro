import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'
export const maxDuration = 20 // reduce timeout

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      message,
      exam,
      examName,
      topic,
      performanceSummary,
      conversationHistory,
    } = body

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required.' },
        { status: 400 }
      )
    }

    const geminiKey = process.env.GEMINI_API_KEY
    const groqKey = process.env.GROQ_API_KEY

    const systemPrompt = `You are an efficient AI tutor for Indian competitive exams.
Be concise, structured, and practical.
Always give short explanations with one example if needed.`

    // 🔥 Limit conversation history to last 4 messages only
    const safeHistory = Array.isArray(conversationHistory)
      ? conversationHistory
          .filter((m: any) => m?.role && m?.content)
          .slice(-4)
      : []

    // ===============================
    // 1️⃣ Gemini (Fast Mode)
    // ===============================
    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey)

        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
        })

        const historyText = safeHistory
          .map((m: any) => `${m.role}: ${m.content}`)
          .join('\n')

        const fullPrompt = `
${systemPrompt}

Exam: ${examName || exam || 'General'}
Topic: ${topic || 'General'}

${historyText}

User: ${message}
        `

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
          generationConfig: {
            maxOutputTokens: 1000, // 🔥 reduced from 1500
            temperature: 0.4,     // 🔥 more deterministic = faster
          },
        })

        const reply = result.response.text()

        return NextResponse.json({
          reply,
          provider: 'gemini',
        })
      } catch (error) {
        console.error("Gemini Error:", error)
      }
    }

    // ===============================
    // 2️⃣ Groq (Very Fast Fallback)
    // ===============================
    if (groqKey) {
      try {
        const groq = new Groq({ apiKey: groqKey })

        const groqMessages = [
          { role: 'system', content: systemPrompt },
          ...safeHistory,
          { role: 'user', content: message },
        ]

        const completion = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: groqMessages as any,
          max_tokens: 1000,      // 🔥 reduced
          temperature: 0.4,
        })

        const reply =
          completion.choices[0]?.message?.content ||
          'Sorry, I could not generate a response.'

        return NextResponse.json({
          reply,
          provider: 'groq',
        })
      } catch (error) {
        console.error("Groq Error:", error)
      }
    }

    return NextResponse.json(
      { error: 'AI service temporarily unavailable.' },
      { status: 503 }
    )
  } catch (error) {
    console.error("Request Error:", error)
    return NextResponse.json(
      { error: 'Invalid request format.' },
      { status: 400 }
    )
  }
}