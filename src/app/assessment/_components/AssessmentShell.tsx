'use client'

import { useEffect, useRef, useCallback, useReducer } from 'react'
import { useRouter } from 'next/navigation'
import type { AssessmentState, AnswerRecord, ResultData } from '@/lib/assessment/types'
import { QUESTIONS } from '@/config/questions'
import ProgressBar from './ProgressBar'
import QuestionScreen from './QuestionScreen'
import PauseScreen from './PauseScreen'
import ResultScreen from './ResultScreen'

const TOTAL = QUESTIONS.length
const SESSION_ID_KEY = 'nest_session_id'
const PROGRESS_KEY = 'nest_assessment_progress'
const RESULT_KEY = 'nest_assessment_result'
const PENDING_KEY = 'nest_assessment_pending'

type StoredProgress = { answers: AnswerRecord[]; currentIndex: number }

// ── Reducer ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'RESTORE'; payload: StoredProgress }
  | { type: 'SELECT'; payload: { label: string; microcopy: string } }
  | { type: 'ADVANCE_TO_PAUSE' }
  | { type: 'ADVANCE_TO_QUESTION'; payload: AnswerRecord }
  | { type: 'ADVANCE_TO_LOADING'; payload: AnswerRecord }
  | { type: 'SET_RESULT'; payload: ResultData }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RETRY' }
  | { type: 'BACK' }

const initialState: AssessmentState = {
  phase: 'question',
  currentIndex: 0,
  answers: [],
  currentAnswer: null,
  result: null,
  error: null,
}

function reducer(state: AssessmentState, action: Action): AssessmentState {
  switch (action.type) {
    case 'RESTORE':
      return {
        ...state,
        currentIndex: action.payload.currentIndex,
        answers: action.payload.answers,
      }
    case 'SELECT':
      return { ...state, currentAnswer: action.payload }
    case 'ADVANCE_TO_PAUSE':
      return { ...state, phase: 'pause' }
    case 'ADVANCE_TO_QUESTION': {
      const nextIndex = state.currentIndex + 1
      return {
        ...state,
        phase: 'question',
        currentIndex: nextIndex,
        answers: [...state.answers, action.payload],
        currentAnswer: null,
      }
    }
    case 'ADVANCE_TO_LOADING':
      return {
        ...state,
        phase: 'loading',
        answers: [...state.answers, action.payload],
        currentAnswer: null,
        error: null,
      }
    case 'SET_RESULT':
      return { ...state, phase: 'result', result: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'RETRY':
      return { ...state, error: null, phase: 'loading' }
    case 'BACK': {
      if (state.currentIndex === 0) return state
      const prevAnswers = state.answers.slice(0, -1)
      return {
        ...state,
        phase: 'question',
        currentIndex: state.currentIndex - 1,
        answers: prevAnswers,
        currentAnswer: null,
        error: null,
      }
    }
    default:
      return state
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function AssessmentShell() {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)
  const sessionIdRef = useRef<string>('')
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const selectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resultFetchRef = useRef<Promise<void> | null>(null)
  const isLastQuestion = state.currentIndex === TOTAL - 1

  // ── Mount: session ID + progress restore ──────────────────────────────────
  useEffect(() => {
    let id = sessionStorage.getItem(SESSION_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(SESSION_ID_KEY, id)
    }
    sessionIdRef.current = id

    const raw = sessionStorage.getItem(PROGRESS_KEY)
    if (raw) {
      try {
        const stored: StoredProgress = JSON.parse(raw)
        if (stored.currentIndex > 0 && stored.answers.length > 0) {
          dispatch({ type: 'RESTORE', payload: stored })
        }
      } catch {
        // corrupt data — start fresh
      }
    }
  }, [])

  // ── Persist progress on every answer ─────────────────────────────────────
  const persistProgress = useCallback((answers: AnswerRecord[], currentIndex: number) => {
    const stored: StoredProgress = { answers, currentIndex }
    sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(stored))
  }, [])

  // ── Fetch result from API ─────────────────────────────────────────────────
  const fetchResult = useCallback(async (allAnswers: AnswerRecord[]) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)

    try {
      const res = await fetch('/api/assessment/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: allAnswers.map(a => ({
            questionId: a.questionId,
            questionText: a.questionText,
            answer: a.answer,
          })),
        }),
        signal: controller.signal,
      })

      const data: ResultData = await res.json()

      if (!res.ok) throw new Error('Result generation failed')

      sessionStorage.setItem(RESULT_KEY, JSON.stringify(data))
      dispatch({ type: 'SET_RESULT', payload: data })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      dispatch({ type: 'SET_ERROR', payload: message })
    } finally {
      clearTimeout(timeout)
    }
  }, [])

  // ── Chip selected ─────────────────────────────────────────────────────────
  const handleSelect = useCallback((label: string) => {
    if (state.phase !== 'question') return

    const question = QUESTIONS[state.currentIndex]
    const option = question.options.find(o => o.label === label)
    if (!option) return

    dispatch({ type: 'SELECT', payload: { label: option.label, microcopy: option.microcopy } })

    // Write progress immediately
    const newAnswer: AnswerRecord = {
      questionId: question.id,
      questionText: question.text,
      answer: option.label,
      microcopy: option.microcopy,
    }
    persistProgress([...state.answers, newAnswer], state.currentIndex)

    // Transition to pause after 1400ms
    if (selectTimerRef.current) clearTimeout(selectTimerRef.current)
    selectTimerRef.current = setTimeout(() => {
      dispatch({ type: 'ADVANCE_TO_PAUSE' })
    }, 1400)
  }, [state.phase, state.currentIndex, state.answers, persistProgress])

  // ── Pause screen auto-advance ─────────────────────────────────────────────
  useEffect(() => {
    if (state.phase !== 'pause' || !state.currentAnswer) return

    const question = QUESTIONS[state.currentIndex]
    const record: AnswerRecord = {
      questionId: question.id,
      questionText: question.text,
      answer: state.currentAnswer.label,
      microcopy: state.currentAnswer.microcopy,
    }

    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)

    pauseTimerRef.current = setTimeout(() => {
      if (isLastQuestion) {
        // Last question — go to loading and fire API concurrently
        const allAnswers = [...state.answers, record]
        dispatch({ type: 'ADVANCE_TO_LOADING', payload: record })
        resultFetchRef.current = fetchResult(allAnswers)
      } else {
        dispatch({ type: 'ADVANCE_TO_QUESTION', payload: record })
      }
    }, 1400)

    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    }
  }, [state.phase]) // intentionally minimal deps — fires once per pause entry

  // ── Retry after error ─────────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    dispatch({ type: 'RETRY' })
    resultFetchRef.current = fetchResult(state.answers)
  }, [state.answers, fetchResult])

  // ── Save: store pending data, navigate to login or save directly ──────────
  const handleSave = useCallback(() => {
    if (!state.result) return
    const pending = {
      answers: state.answers,
      result: state.result,
      sessionId: sessionIdRef.current,
    }
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending))
    router.push('/login?redirectTo=/assessment/save')
  }, [state.result, state.answers, router])

  // ── Back ─────────────────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    if (selectTimerRef.current) clearTimeout(selectTimerRef.current)
    dispatch({ type: 'BACK' })
  }, [])

  // ── Cleanup timers ────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (selectTimerRef.current) clearTimeout(selectTimerRef.current)
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    }
  }, [])

  // ── Progress calculation ──────────────────────────────────────────────────
  const progress = ((state.currentIndex + (state.phase === 'result' ? 1 : 0)) / TOTAL) * 100

  // ── Hint text ─────────────────────────────────────────────────────────────
  const showHint = state.currentIndex >= 5 || state.phase === 'loading' || state.phase === 'result'

  // ── Active answer label (for pause/loading screens) ───────────────────────
  const pauseAnswer = state.currentAnswer?.label ?? ''
  const pauseMicrocopy = state.currentAnswer?.microcopy ?? ''

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--cream)',
      }}
    >
      {/* Progress bar */}
      {state.phase !== 'result' && <ProgressBar progress={progress} />}

      {/* Nav */}
      {state.phase !== 'result' && (
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'clamp(16px, 3vw, 28px) clamp(20px, 5vw, 48px) 0',
          }}
          aria-label="Assessment navigation"
        >
          <button
            onClick={handleBack}
            aria-label="Go back to previous question"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--moss)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: state.phase === 'question' && state.currentIndex > 0 ? 0.65 : 0,
              pointerEvents: state.phase === 'question' && state.currentIndex > 0 ? 'auto' : 'none',
              fontFamily: 'inherit',
              minHeight: '44px',
              padding: '0 8px',
              transition: 'opacity 200ms ease-in-out',
            }}
          >
            ‹ Back
          </button>

          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              color: 'var(--deep-pine)',
              textTransform: 'lowercase',
            }}
          >
            nest
          </span>

          <span
            style={{
              fontSize: '11px',
              color: 'var(--moss)',
              opacity: showHint ? 0.55 : 0,
              letterSpacing: '0.02em',
              transition: 'opacity 400ms ease-in-out',
              minWidth: '80px',
              textAlign: 'right',
            }}
          >
            Almost there
          </span>
        </nav>
      )}

      {/* Screens */}
      {(state.phase === 'question') && (
        <QuestionScreen
          question={QUESTIONS[state.currentIndex]}
          questionNumber={state.currentIndex + 1}
          totalQuestions={TOTAL}
          selectedLabel={state.currentAnswer?.label ?? null}
          onSelect={handleSelect}
          disabled={state.currentAnswer !== null}
        />
      )}

      {(state.phase === 'pause' || state.phase === 'loading') && (
        <PauseScreen answer={pauseAnswer} microcopy={pauseMicrocopy} />
      )}

      {state.phase === 'result' && (
        <ResultScreen result={state.result} onSave={handleSave} />
      )}

      {/* Error overlay */}
      {state.error && state.phase === 'loading' && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--cream)',
            border: '1px solid rgba(155,102,81,0.3)',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 4px 24px rgba(47,76,58,0.1)',
            zIndex: 300,
            maxWidth: 'calc(100vw - 48px)',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: 'var(--terracotta)', margin: 0 }}>
            Something went wrong. Your answers are saved.
          </p>
          <button
            onClick={handleRetry}
            style={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--deep-pine)',
              background: 'transparent',
              border: '1.5px solid var(--deep-pine)',
              borderRadius: '999px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              minHeight: '44px',
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
