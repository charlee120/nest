'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { AnswerRecord, ResultData } from '@/lib/assessment/types'

const PENDING_KEY = 'nest_assessment_pending'
const WELCOME_PATHWAY_KEY = 'nest_welcome_pathway'

interface PendingAssessment {
  answers: AnswerRecord[]
  result: ResultData
  sessionId: string
}

type SaveStatus = 'loading' | 'error'

export default function AssessmentSavePage() {
  const router = useRouter()
  const [status, setStatus] = useState<SaveStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [pendingData, setPendingData] = useState<PendingAssessment | null>(null)

  const save = useCallback(async (data: PendingAssessment) => {
    setStatus('loading')

    try {
      const res = await fetch('/api/assessment/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: data.sessionId,
          answers: data.answers,
          result: data.result,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setErrorMessage(json?.error?.message ?? 'Could not save your results. Please try again.')
        setStatus('error')
        return
      }

      // Success — clean up and navigate
      sessionStorage.removeItem(PENDING_KEY)
      sessionStorage.setItem(WELCOME_PATHWAY_KEY, data.result.primaryPathway)
      router.push('/home')
    } catch {
      setErrorMessage('A network error occurred. Your answers are still saved locally.')
      setStatus('error')
    }
  }, [router])

  useEffect(() => {
    const raw = sessionStorage.getItem(PENDING_KEY)

    if (!raw) {
      // Nothing to save — user navigated here directly
      router.push('/home')
      return
    }

    let data: PendingAssessment
    try {
      data = JSON.parse(raw) as PendingAssessment
    } catch {
      // Corrupt data — go home
      sessionStorage.removeItem(PENDING_KEY)
      router.push('/home')
      return
    }

    setPendingData(data)
    save(data)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps — intentionally run once

  const handleRetry = () => {
    if (pendingData) save(pendingData)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>

        {status === 'loading' && (
          <>
            {/* Animated dots — reuse the assessment palette */}
            <div
              aria-live="polite"
              aria-label="Saving your results"
              style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center', gap: '8px' }}
            >
              {[0, 0.22, 0.44].map((delay, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: i === 2 ? 'var(--moss)' : 'var(--honey)',
                    display: 'inline-block',
                    animation: `saveDotPulse 1.3s ease-in-out ${delay}s infinite`,
                  }}
                />
              ))}
            </div>

            <p
              style={{
                fontSize: '1.0625rem',
                fontWeight: 400,
                color: 'var(--deep-pine)',
                marginBottom: '8px',
              }}
            >
              Saving your results…
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--moss)', opacity: 0.7 }}>
              Just a moment.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <p
              style={{
                fontSize: '1.0625rem',
                fontWeight: 400,
                color: 'var(--deep-pine)',
                marginBottom: '12px',
              }}
            >
              Something went wrong.
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--moss)',
                marginBottom: '24px',
                lineHeight: 1.65,
              }}
            >
              {errorMessage}
            </p>
            <button
              onClick={handleRetry}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--cream)',
                background: 'var(--terracotta)',
                border: 'none',
                borderRadius: '999px',
                padding: '13px 32px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                minHeight: '44px',
                marginRight: '12px',
              }}
            >
              Try again
            </button>
            <button
              onClick={() => router.push('/home')}
              style={{
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'var(--moss)',
                background: 'transparent',
                border: '1px solid rgba(224,213,197,0.9)',
                borderRadius: '999px',
                padding: '13px 32px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                minHeight: '44px',
              }}
            >
              Go to home
            </button>
          </>
        )}

      </div>

      <style>{`
        @keyframes saveDotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1);   }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
