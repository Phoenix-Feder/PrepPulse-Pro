import { db } from './firebase'
import {
  doc, setDoc, getDoc, updateDoc,
  collection, addDoc, query, where,
  getDocs, orderBy, Timestamp, deleteDoc,
} from 'firebase/firestore'
import type { UserProfile, MockResult, TopicProgress } from '@/types'

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function createUserProfile(
  uid: string,
  data: { name: string; email: string; selectedExam?: string }
) {
  await setDoc(doc(db, 'users', uid), {
    uid,
    ...data,
    selectedExam: data.selectedExam || '',
    createdAt: Timestamp.now(),
    preferences: { dailyStudyHours: 4, weakSections: [], studyDays: ['Mon','Tue','Wed','Thu','Fri','Sat'] },
  })
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', uid), data as Record<string, unknown>)
}

export async function updateUserExam(uid: string, exam: string) {
  await updateDoc(doc(db, 'users', uid), { selectedExam: exam })
}

// ─── Mock Tests ───────────────────────────────────────────────────────────────

export async function addMockResult(data: Omit<MockResult, 'id'>) {
  return addDoc(collection(db, 'mocks'), {
    ...data,
    createdAt: Timestamp.now(),
  })
}

export async function getUserMocks(userId: string): Promise<MockResult[]> {
  const q = query(
    collection(db, 'mocks'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as MockResult))
}

export async function deleteMockResult(mockId: string) {
  await deleteDoc(doc(db, 'mocks', mockId))
}

// ─── Topic Progress ───────────────────────────────────────────────────────────

export async function updateTopicProgress(
  userId: string,
  topicId: string,
  status: TopicProgress['status'],
  masteryLevel: number
) {
  const docId = `${userId}_${topicId}`
  await setDoc(
    doc(db, 'topicProgress', docId),
    { userId, topicId, status, masteryLevel, updatedAt: Timestamp.now() },
    { merge: true }
  )
}

export async function getUserTopicProgress(userId: string): Promise<TopicProgress[]> {
  const q = query(
    collection(db, 'topicProgress'),
    where('userId', '==', userId)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data() as TopicProgress)
}

// ─── Analytics Helpers ────────────────────────────────────────────────────────

export function calculateMockAnalytics(mocks: MockResult[]) {
  if (mocks.length === 0) return null

  const latest = mocks.slice(0, 5)
  const avgScore = mocks.reduce((sum, m) => sum + (m.totalScore / m.maxScore) * 100, 0) / mocks.length

  const sectionTotals: Record<string, number[]> = {}
  mocks.forEach(mock => {
    Object.entries(mock.sectionScores).forEach(([section, score]) => {
      if (!sectionTotals[section]) sectionTotals[section] = []
      const max = mock.sectionMaxScores?.[section] || 25
      sectionTotals[section].push((score / max) * 100)
    })
  })

  const sectionAverages = Object.entries(sectionTotals).map(([section, scores]) => ({
    section,
    average: scores.reduce((a, b) => a + b, 0) / scores.length,
  }))

  const weakSections = sectionAverages
    .filter(s => s.average < 60)
    .sort((a, b) => a.average - b.average)

  const trend = latest.reverse().map((m, i) => ({
    attempt: `Mock ${mocks.length - i}`,
    score: Math.round((m.totalScore / m.maxScore) * 100),
    date: m.date,
  }))

  return { avgScore, sectionAverages, weakSections, trend, totalAttempts: mocks.length }
}
