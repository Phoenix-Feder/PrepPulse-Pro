import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Sora } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

// Cabinet Grotesk as display font via local or CDN fallback
const cabinet = Sora({
  subsets: ['latin'],
  variable: '--font-cabinet',
  display: 'swap',
  weight: ['700', '800'],
})

export const metadata: Metadata = {
  title: 'PrepPulse Pro — AI Exam Preparation',
  description: 'AI-powered platform to crack India\'s top competitive exams: SBI PO, UPSC, SSC CGL, and more.',
  keywords: 'competitive exam preparation, SBI PO, UPSC, SSC CGL, IBPS, banking exam, AI study',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${cabinet.variable}`}>
      <body className="bg-surface text-white antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1c1c30',
              color: '#e2e8f0',
              border: '1px solid #2a2a45',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
