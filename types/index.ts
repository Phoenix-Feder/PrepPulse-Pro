export interface UserProfile {
  uid: string
  name: string
  email: string
  selectedExam: string
  preferences: {
    dailyStudyHours: number
    weakSections?: string[]
    studyDays?: string[]
  }
  createdAt?: unknown
}

export interface MockResult {
  id?: string
  userId: string
  exam: string
  totalScore: number
  maxScore: number
  sectionScores: Record<string, number>
  sectionMaxScores: Record<string, number>
  date: string
  createdAt?: unknown
}

export interface TopicProgress {
  userId: string
  topicId: string
  status: 'not_started' | 'in_progress' | 'completed'
  masteryLevel: number
  updatedAt?: unknown
}

export interface Topic {
  id: string
  name: string
  description: string
  weightage: 'High' | 'Medium' | 'Low'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  prepTime: string
}

export interface Section {
  id: string
  name: string
  topics: Topic[]
}

export interface Subject {
  id: string
  name: string
  color: string
  sections: Section[]
}

export interface ExamStage {
  subjects: Subject[]
}

export interface ExamSyllabus {
  examId: string
  examName: string
  shortName: string
  category: 'Banking' | 'Insurance' | 'Government' | 'Defence'
  color: string
  icon: string
  stages: {
    prelims?: ExamStage
    mains?: ExamStage
    tier1?: ExamStage
    tier2?: ExamStage
    paper1?: ExamStage
    paper2?: ExamStage
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  provider?: 'gemini' | 'groq'
  timestamp: Date
}

export interface StudyPlanDay {
  day: string
  date: string
  sessions: StudySession[]
  totalHours: number
}

export interface StudySession {
  subject: string
  topic: string
  duration: number
  priority: 'high' | 'medium' | 'low'
  type: 'study' | 'revision' | 'practice'
}

export type ExamId =
  | 'sbi_po'
  | 'ibps_po'
  | 'ibps_clerk'
  | 'rbi_grade_b'
  | 'lic_aao'
  | 'niacl_ao'
  | 'upsc_prelims'
  | 'cds'
  | 'ssc_cgl'

export type TopicStatus = 'not_started' | 'in_progress' | 'completed'
