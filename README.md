<<<<<<< HEAD
# 🚀 PrepPulse Pro – AI-Powered Competitive Exam Preparation Platform

> A full-stack Next.js 14 platform for Indian competitive exam preparation with AI study coaching, syllabus tracking, mock analytics, and personalized study planning.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Prerequisites](#prerequisites)
5. [Firebase Setup](#firebase-setup)
6. [Environment Variables](#environment-variables)
7. [Local Development Setup](#local-development-setup)
8. [Feature Implementation Guide](#feature-implementation-guide)
9. [Database Schema (Firestore)](#database-schema-firestore)
10. [AI Integration (Gemini + Groq)](#ai-integration-gemini--groq)
11. [Syllabus Data Structure](#syllabus-data-structure)
12. [Deployment (Vercel + Firebase)](#deployment-vercel--firebase)
13. [Viva / Evaluation Guide](#viva--evaluation-guide)
14. [Troubleshooting](#troubleshooting)

---

## Project Overview

PrepPulse Pro helps students prepare for major Indian competitive exams (SBI PO, IBPS PO, UPSC, SSC CGL, etc.) with:

- 📚 Deep syllabus coverage with topic-level tracking
- 🤖 AI Study Coach (Gemini primary, Groq fallback)
- 📊 Mock test logging + performance analytics
- 🗓️ Personalized weekly study planner
- 🔐 Firebase Auth (Email + Google)

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Next.js 14 (App Router), TypeScript |
| Styling     | Tailwind CSS + custom glassmorphism |
| Auth        | Firebase Authentication             |
| Database    | Firestore (NoSQL)                   |
| AI (Primary)| Google Gemini API                   |
| AI (Fallback)| Groq API (llama3-70b-8192)         |
| Charts      | Recharts                            |
| Deployment  | Vercel + Firebase                   |

---

## Folder Structure

```
preppulse-pro/
├── app/
│   ├── layout.tsx                  # Root layout with sidebar
│   ├── page.tsx                    # Landing page / redirect
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── onboarding/page.tsx         # Exam selection + self-assessment
│   ├── dashboard/page.tsx
│   ├── syllabus/page.tsx
│   ├── study-coach/page.tsx
│   ├── mocks/page.tsx
│   ├── analytics/page.tsx
│   └── planner/page.tsx
│
├── api/
│   └── ai/
│       └── chat/route.ts           # Single AI endpoint (Gemini + Groq fallback)
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── ProtectedRoute.tsx
│   └── ui/
│       ├── StatCard.tsx
│       ├── ProgressBar.tsx
│       ├── TopicCard.tsx
│       ├── ChatBubble.tsx
│       └── MockEntryForm.tsx
│
├── lib/
│   ├── firebase.ts                 # Firebase init
│   ├── firestore.ts                # Firestore helper functions
│   ├── syllabus-data.ts            # All exam syllabus data
│   └── ai.ts                       # AI client functions
│
├── hooks/
│   ├── useAuth.ts
│   └── useTopicProgress.ts
│
├── types/
│   └── index.ts                    # TypeScript types
│
├── public/
│   └── logo.svg
│
├── .env.local                      # Environment variables (never commit)
├── .env.example                    # Template (commit this)
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** v18+ → [nodejs.org](https://nodejs.org)
- **npm** v9+ or **yarn**
- **Git**
- A **Google account** (for Firebase + Gemini API)
- A **Groq account** (free) → [console.groq.com](https://console.groq.com)
- A **Vercel account** (free) → [vercel.com](https://vercel.com)

---

## Firebase Setup

### Step 1 — Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → name it `preppulse-pro`
3. Disable Google Analytics (not needed) → **Create project**

### Step 2 — Enable Authentication

1. In Firebase Console → **Authentication** → **Get started**
2. Under **Sign-in method**, enable:
   - **Email/Password** → toggle ON → Save
   - **Google** → toggle ON → add your support email → Save

### Step 3 — Create Firestore Database

1. Firebase Console → **Firestore Database** → **Create database**
2. Select **"Start in production mode"**
3. Choose a region closest to your users (e.g., `asia-south1` for India)
4. Click **Done**

### Step 4 — Set Firestore Security Rules

Go to **Firestore → Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can only access their own mock data
    match /mocks/{mockId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }

    // Users can only access their own topic progress
    match /topicProgress/{docId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

Click **Publish**.

### Step 5 — Get Firebase Config

1. Firebase Console → **Project Settings** (gear icon) → **General**
2. Scroll to **"Your apps"** → Click **"</>"** (Web)
3. Register app with nickname `preppulse-web`
4. Copy the `firebaseConfig` object — you'll need these values

---

## Environment Variables

### Create `.env.local` in your project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI APIs (server-side only — NO NEXT_PUBLIC_ prefix)
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

### Getting API Keys:

**Gemini API Key:**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **"Get API key"** → **"Create API key"**
3. Copy the key

**Groq API Key:**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (free) → **API Keys** → **Create API Key**
3. Copy the key

### Create `.env.example` (commit this to git):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=
GROQ_API_KEY=
```

> ⚠️ **IMPORTANT:** Add `.env.local` to your `.gitignore`. Never commit real API keys.

---

## Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/preppulse-pro.git
cd preppulse-pro

# 2. Install dependencies
npm install

# 3. Install required packages
npm install firebase
npm install @google/generative-ai
npm install groq-sdk
npm install recharts
npm install @types/recharts
npm install lucide-react
npm install react-hot-toast

# 4. Set up environment variables
cp .env.example .env.local
# Then fill in your actual values in .env.local

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Feature Implementation Guide

### 1. Firebase Initialization (`lib/firebase.ts`)

```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
```

---

### 2. Auth Hook (`hooks/useAuth.ts`)

```typescript
'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}
```

---

### 3. Protected Route (`components/layout/ProtectedRoute.tsx`)

```typescript
'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div className="flex h-screen items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
  </div>;

  return user ? <>{children}</> : null;
}
```

---

### 4. AI Chat API Route (`app/api/ai/chat/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

export async function POST(req: NextRequest) {
  const { message, exam, topic, performanceSummary } = await req.json();

  const systemPrompt = `You are PrepPulse Pro AI Coach, an expert tutor for Indian competitive exams.
Current context:
- Exam: ${exam || 'General'}
- Topic: ${topic || 'General'}
- Student Performance: ${performanceSummary || 'No data yet'}

You can:
1. Explain concepts clearly with examples
2. Generate practice questions with solutions
3. Suggest revision strategies
4. Analyze weak areas and provide tips
Keep responses concise, structured, and exam-focused.`;

  // Try Gemini first
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: message }
    ]);

    return NextResponse.json({
      reply: result.response.text(),
      provider: 'gemini'
    });

  } catch (geminiError) {
    console.warn('Gemini failed, falling back to Groq:', geminiError);

    // Fallback to Groq
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

      const completion = await groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1024,
      });

      return NextResponse.json({
        reply: completion.choices[0].message.content,
        provider: 'groq'
      });

    } catch (groqError) {
      console.error('Both AI providers failed:', groqError);
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again.' },
        { status: 503 }
      );
    }
  }
}
```

---

### 5. Firestore Helper Functions (`lib/firestore.ts`)

```typescript
import { db } from './firebase';
import {
  doc, setDoc, getDoc, updateDoc,
  collection, addDoc, query, where,
  getDocs, orderBy, Timestamp
} from 'firebase/firestore';

// --- User Profile ---
export async function createUserProfile(uid: string, data: {
  name: string; email: string; selectedExam?: string;
}) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: Timestamp.now(),
    preferences: { dailyStudyHours: 4 }
  });
}

export async function getUserProfile(uid: string) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserExam(uid: string, exam: string) {
  await updateDoc(doc(db, 'users', uid), { selectedExam: exam });
}

// --- Mock Tests ---
export async function addMockResult(data: {
  userId: string; exam: string; totalScore: number;
  sectionScores: Record<string, number>; date: string;
}) {
  return addDoc(collection(db, 'mocks'), {
    ...data,
    createdAt: Timestamp.now()
  });
}

export async function getUserMocks(userId: string) {
  const q = query(
    collection(db, 'mocks'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// --- Topic Progress ---
export async function updateTopicProgress(
  userId: string, topicId: string,
  status: 'not_started' | 'in_progress' | 'completed',
  masteryLevel: number
) {
  const docId = `${userId}_${topicId}`;
  await setDoc(doc(db, 'topicProgress', docId), {
    userId, topicId, status, masteryLevel,
    updatedAt: Timestamp.now()
  }, { merge: true });
}

export async function getUserTopicProgress(userId: string) {
  const q = query(
    collection(db, 'topicProgress'),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}
```

---

### 6. TypeScript Types (`types/index.ts`)

```typescript
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  selectedExam: string;
  preferences: {
    dailyStudyHours: number;
    weakSections?: string[];
  };
  createdAt: any;
}

export interface MockResult {
  id?: string;
  userId: string;
  exam: string;
  totalScore: number;
  sectionScores: Record<string, number>;
  date: string;
  createdAt?: any;
}

export interface TopicProgress {
  userId: string;
  topicId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  masteryLevel: number; // 0-100
  updatedAt?: any;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  weightage: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string; // e.g., "3-4 days"
}

export interface Section {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  sections: Section[];
}

export interface ExamSyllabus {
  examId: string;
  examName: string;
  category: string;
  stages: {
    prelims?: { subjects: Subject[] };
    mains?: { subjects: Subject[] };
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  provider?: 'gemini' | 'groq';
  timestamp: Date;
}

export type ExamId =
  | 'sbi_po' | 'ibps_po' | 'ibps_clerk' | 'rbi_grade_b'
  | 'lic_aao' | 'niacl_ao'
  | 'upsc_prelims' | 'cds' | 'ssc_cgl';
```

---

## Database Schema (Firestore)

### Collection: `users`
```
Document ID: {uid}
{
  uid: string,
  name: string,
  email: string,
  selectedExam: string,          // e.g., "sbi_po"
  createdAt: Timestamp,
  preferences: {
    dailyStudyHours: number,     // 1-12
    weakSections: string[],      // e.g., ["quant", "reasoning"]
    studyDays: string[]          // e.g., ["Mon", "Tue", ...]
  }
}
```

### Collection: `mocks`
```
Document ID: auto-generated
{
  userId: string,                // Reference to users/{uid}
  exam: string,                  // e.g., "sbi_po"
  totalScore: number,            // e.g., 78.5
  maxScore: number,              // e.g., 100
  sectionScores: {               // Key = section name, Value = score
    "Quantitative Aptitude": 15,
    "Reasoning Ability": 18,
    "English Language": 20,
    "General Awareness": 12
  },
  date: string,                  // ISO date "2024-01-15"
  createdAt: Timestamp
}
```

### Collection: `topicProgress`
```
Document ID: "{userId}_{topicId}"
{
  userId: string,
  topicId: string,               // e.g., "sbi_po_quant_percentage"
  status: "not_started" | "in_progress" | "completed",
  masteryLevel: number,          // 0-100
  updatedAt: Timestamp
}
```

### Firestore Indexes Required

In Firebase Console → Firestore → Indexes → Add these composite indexes:

| Collection    | Fields                        | Order |
|---------------|-------------------------------|-------|
| mocks         | userId ASC, createdAt DESC    | Composite |
| topicProgress | userId ASC, updatedAt DESC    | Composite |

---

## AI Integration (Gemini + Groq)

### Model Selection

| Provider | Model              | Speed  | Quality |
|----------|--------------------|--------|---------|
| Gemini   | gemini-1.5-flash   | Fast   | High    |
| Groq     | llama3-70b-8192    | Very Fast | Good |

### Usage in Frontend

```typescript
// In your study-coach page
const sendMessage = async (userMessage: string) => {
  setLoading(true);

  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMessage,
      exam: user?.selectedExam,
      topic: currentTopic,
      performanceSummary: buildPerformanceSummary(mockResults)
    })
  });

  const data = await response.json();

  if (data.error) {
    toast.error(data.error);
  } else {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: data.reply,
      provider: data.provider,
      timestamp: new Date()
    }]);
  }

  setLoading(false);
};
```

---

## Syllabus Data Structure

### Sample data in `lib/syllabus-data.ts`:

```typescript
export const syllabusData: ExamSyllabus[] = [
  {
    examId: 'sbi_po',
    examName: 'SBI PO',
    category: 'Banking',
    stages: {
      prelims: {
        subjects: [
          {
            id: 'quant',
            name: 'Quantitative Aptitude',
            sections: [
              {
                id: 'arithmetic',
                name: 'Arithmetic',
                topics: [
                  {
                    id: 'percentage',
                    name: 'Percentage',
                    description: 'Fraction to percent conversion, percentage change, successive percent, percentage error, profit/loss using percentage.',
                    weightage: 'High',
                    difficulty: 'Medium',
                    prepTime: '2-3 days'
                  },
                  {
                    id: 'ratio_proportion',
                    name: 'Ratio & Proportion',
                    description: 'Compound ratios, proportionality theorems, variation, partnership problems.',
                    weightage: 'High',
                    difficulty: 'Medium',
                    prepTime: '2-3 days'
                  },
                  {
                    id: 'profit_loss',
                    name: 'Profit & Loss',
                    description: 'Cost price, selling price, marked price, discount, successive transactions, dishonest dealings.',
                    weightage: 'High',
                    difficulty: 'Medium',
                    prepTime: '3-4 days'
                  },
                  {
                    id: 'simple_compound_interest',
                    name: 'Simple & Compound Interest',
                    description: 'SI/CI formula, half-yearly, quarterly compounding, difference between SI and CI.',
                    weightage: 'High',
                    difficulty: 'Medium',
                    prepTime: '2-3 days'
                  },
                  {
                    id: 'time_work',
                    name: 'Time & Work',
                    description: 'Work efficiency, pipes and cisterns, men-days problems, work and wages.',
                    weightage: 'Medium',
                    difficulty: 'Medium',
                    prepTime: '3-4 days'
                  },
                  {
                    id: 'speed_distance',
                    name: 'Speed, Distance & Time',
                    description: 'Relative speed, trains, boats and streams, average speed, circular motion.',
                    weightage: 'High',
                    difficulty: 'Hard',
                    prepTime: '4-5 days'
                  }
                ]
              },
              {
                id: 'data_interpretation',
                name: 'Data Interpretation',
                topics: [
                  {
                    id: 'bar_chart',
                    name: 'Bar Chart DI',
                    description: 'Simple, stacked, grouped bar charts with 5-question sets.',
                    weightage: 'High',
                    difficulty: 'Medium',
                    prepTime: '3-4 days'
                  },
                  {
                    id: 'line_graph',
                    name: 'Line Graph DI',
                    description: 'Single and multiple line graphs, trend analysis.',
                    weightage: 'High',
                    difficulty: 'Medium',
                    prepTime: '3-4 days'
                  },
                  {
                    id: 'pie_chart',
                    name: 'Pie Chart DI',
                    description: 'Degree/percentage based pie charts, combination with tables.',
                    weightage: 'High',
                    difficulty: 'Medium',
                    prepTime: '3-4 days'
                  },
                  {
                    id: 'caselet_di',
                    name: 'Caselet DI',
                    description: 'Paragraph-based data sets requiring extraction and calculation.',
                    weightage: 'Medium',
                    difficulty: 'Hard',
                    prepTime: '5-6 days'
                  }
                ]
              }
            ]
          },
          {
            id: 'reasoning',
            name: 'Reasoning Ability',
            sections: [
              {
                id: 'verbal_reasoning',
                name: 'Verbal Reasoning',
                topics: [
                  {
                    id: 'seating_arrangement',
                    name: 'Seating Arrangement',
                    description: 'Linear (single/double row), circular, rectangular arrangements.',
                    weightage: 'High',
                    difficulty: 'Hard',
                    prepTime: '5-6 days'
                  },
                  {
                    id: 'puzzles',
                    name: 'Puzzles',
                    description: 'Floor puzzles, box puzzles, month-day puzzles, scheduling.',
                    weightage: 'High',
                    difficulty: 'Hard',
                    prepTime: '5-7 days'
                  },
                  {
                    id: 'syllogism',
                    name: 'Syllogism',
                    description: 'Venn diagram method, possibility cases, reverse syllogism.',
                    weightage: 'Medium',
                    difficulty: 'Medium',
                    prepTime: '3-4 days'
                  },
                  {
                    id: 'inequality',
                    name: 'Inequality',
                    description: 'Mathematical inequality, coded inequality, variable-based.',
                    weightage: 'Medium',
                    difficulty: 'Easy',
                    prepTime: '2-3 days'
                  },
                  {
                    id: 'blood_relations',
                    name: 'Blood Relations',
                    description: 'Family tree building, coded blood relations, mixed relations.',
                    weightage: 'Low',
                    difficulty: 'Medium',
                    prepTime: '2-3 days'
                  }
                ]
              }
            ]
          },
          {
            id: 'english',
            name: 'English Language',
            sections: [
              {
                id: 'comprehension',
                name: 'Reading Comprehension',
                topics: [
                  {
                    id: 'rc_passage',
                    name: 'RC Passage',
                    description: 'Business/economy/social passages with inference, tone, vocabulary questions.',
                    weightage: 'High',
                    difficulty: 'Medium',
                    prepTime: '7-10 days'
                  }
                ]
              },
              {
                id: 'grammar',
                name: 'Grammar & Vocabulary',
                topics: [
                  {
                    id: 'error_spotting',
                    name: 'Error Spotting',
                    description: 'Subject-verb agreement, tense, preposition, article errors.',
                    weightage: 'High',
                    difficulty: 'Medium',
                    prepTime: '5-6 days'
                  },
                  {
                    id: 'fill_blanks',
                    name: 'Fill in the Blanks',
                    description: 'Single/double filler, word pair, contextual vocabulary.',
                    weightage: 'Medium',
                    difficulty: 'Medium',
                    prepTime: '4-5 days'
                  },
                  {
                    id: 'para_jumbles',
                    name: 'Para Jumbles',
                    description: 'Sentence rearrangement, coherence, logical sequencing.',
                    weightage: 'Medium',
                    difficulty: 'Hard',
                    prepTime: '5-6 days'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
];
```

---

## Deployment (Vercel + Firebase)

### Step 1 — Prepare for Deployment

```bash
# Make sure build passes locally
npm run build

# Fix any TypeScript errors before deploying
npm run lint
```

### Step 2 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - PrepPulse Pro"
git remote add origin https://github.com/yourusername/preppulse-pro.git
git push -u origin main
```

### Step 3 — Deploy to Vercel

**Option A — Via Vercel CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: preppulse-pro
# - Root directory: ./
# - Override settings? No
```

**Option B — Via Vercel Dashboard (Recommended):**
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Click **Deploy** (initial deploy without env vars to verify setup)

### Step 4 — Add Environment Variables to Vercel

1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add ALL variables from your `.env.local`:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| NEXT_PUBLIC_FIREBASE_API_KEY | your_value | Production, Preview, Development |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | your_value | All |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | your_value | All |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | your_value | All |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | your_value | All |
| NEXT_PUBLIC_FIREBASE_APP_ID | your_value | All |
| GEMINI_API_KEY | your_value | All |
| GROQ_API_KEY | your_value | All |

3. Click **Redeploy** after adding variables

### Step 5 — Configure Firebase Authorized Domains

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your Vercel domain: `your-project.vercel.app`
3. Also add any custom domain if applicable

### Step 6 — Verify Production Deployment

```bash
# Check your live URL
# Test: Registration, Login, Google Sign-in
# Test: AI Chat endpoint
# Test: Firestore read/write
```

### Custom Domain (Optional)

1. Vercel Dashboard → Project → **Settings** → **Domains**
2. Add your domain (e.g., `preppulsepro.com`)
3. Update DNS records as instructed by Vercel
4. Add the custom domain to Firebase Authorized Domains

---

## Viva / Evaluation Guide

### Architecture Explanation

**Q: Why Next.js App Router?**
> Next.js 14 with App Router provides server-side rendering, built-in API routes, and file-based routing — reducing boilerplate while enabling a production-grade setup. It's the modern standard for full-stack React apps.

**Q: Why Firebase + Firestore?**
> Firebase provides a complete backend with minimal setup — real-time Auth, scalable NoSQL database, and zero server management. For a college project that needs a production deployment, it's the ideal choice.

**Q: How does the AI fallback work?**
> The `/api/ai/chat` route tries Gemini first (faster, better quality). If it fails — network error, quota exceeded, timeout — it catches the error and automatically retries with Groq. This ensures ~99% uptime for the AI feature. No complex routing, just a simple try/catch.

**Q: Why no microservices?**
> This is a student project built for 1-3 developers in 3-4 weeks. Microservices add deployment complexity, inter-service communication overhead, and infrastructure cost. Next.js API routes handle our backend needs cleanly.

**Q: How is the study planner generated?**
> It uses rule-based logic, not AI: (1) fetch user's weak sections from mock data, (2) fetch incomplete topics from progress data, (3) distribute across the week proportionally to daily study hours. Simple and deterministic.

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Firestore over SQL | Real-time, no schema migrations, Firebase Auth integration |
| Recharts over D3 | Simpler API, React-native, sufficient for analytics features |
| Gemini Flash over Pro | Lower cost, faster responses, sufficient quality |
| Rule-based planner | Predictable, debuggable, no AI cost for planning |
| Single AI endpoint | Simplicity — no separate routes for different AI tasks |

### Feature Demo Flow (Suggested Order for Viva)

1. **Registration** → Create account with email
2. **Onboarding** → Select SBI PO, mark weak areas
3. **Dashboard** → Show study streak, stats, weak areas
4. **Syllabus** → Navigate to Quantitative Aptitude → mark Percentage as Completed
5. **AI Coach** → Ask: *"Explain compound interest for SBI PO with a practice question"*
6. **Mock Tracker** → Log a mock test with section-wise scores
7. **Analytics** → Show performance trend chart
8. **Study Planner** → Generate weekly plan based on weak sections

---

## Troubleshooting

### Common Issues

**Build fails with TypeScript errors:**
```bash
# Check specific errors
npx tsc --noEmit

# Common fix: add types
npm install --save-dev @types/node @types/react @types/react-dom
```

**Firebase Auth error: "auth/unauthorized-domain"**
> Add your domain (localhost:3000 for dev, your-app.vercel.app for prod) to Firebase Console → Authentication → Authorized Domains

**Firestore permission denied:**
> Check your Firestore Security Rules. For development, you can temporarily set rules to allow all reads/writes (revert before submission):
```javascript
allow read, write: if true; // DEVELOPMENT ONLY
```

**Gemini API returns 429 (quota exceeded):**
> The Groq fallback will handle this automatically. If both fail, check API quotas in your Google AI Studio dashboard.

**Environment variables not working on Vercel:**
> Ensure variables prefixed with `NEXT_PUBLIC_` are accessible client-side. Server-only keys (GEMINI_API_KEY, GROQ_API_KEY) must NOT have the NEXT_PUBLIC_ prefix.

**Recharts not rendering:**
```bash
npm install recharts
# If SSR issues, wrap charts in dynamic import:
const Chart = dynamic(() => import('./MyChart'), { ssr: false });
```

### Useful Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server locally
npm run lint         # Run ESLint
npx tsc --noEmit     # TypeScript check without building
vercel --prod        # Deploy to production via CLI
vercel env pull      # Pull env vars from Vercel to local
```

---

## Contributing

This is a college major project. If you're extending it:

1. Keep the architecture simple — no unnecessary abstractions
2. Test on mobile (responsive design matters for evaluation)
3. Keep AI prompts focused and exam-specific
4. Document any new Firestore collections with security rules

---

## License

MIT — Free to use for educational purposes.

---

*Built with ❤️ as a Final Year Major Project | PrepPulse Pro © 2024*
=======
# PrepPulse-Pro
AI-powered exam preparation tracker with Firebase authentication, dual AI (Gemini + Groq), and automated email reminders. Built with Vite and deployed on Vercel.
>>>>>>> b02635cd7ebacbb069574ccecd68d0e160d3e2d9
