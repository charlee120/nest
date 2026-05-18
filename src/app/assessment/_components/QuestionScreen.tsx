import type { Question } from '@/lib/assessment/types'
import AnswerChip from './AnswerChip'

interface QuestionScreenProps {
  question: Question
  questionNumber: number // 1-based display number
  totalQuestions: number
  selectedLabel: string | null
  onSelect: (label: string) => void
  disabled?: boolean
}

export default function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  selectedLabel,
  onSelect,
  disabled,
}: QuestionScreenProps) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px 80px',
        position: 'relative',
      }}
    >
      <div style={{ width: '100%', maxWidth: '560px' }}>
        {/* Question label */}
        <p
          style={{
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--moss)',
            opacity: 0.7,
            marginBottom: '22px',
          }}
        >
          Question {questionNumber} of {totalQuestions}
        </p>

        {/* Question headline */}
        <h1
          style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.6875rem)',
            lineHeight: 1.3,
            fontWeight: 400,
            color: 'var(--deep-pine)',
            marginBottom: '10px',
            letterSpacing: '-0.01em',
          }}
        >
          {question.text}
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--moss)',
            lineHeight: 1.65,
            marginBottom: '36px',
            opacity: 0.85,
          }}
        >
          {question.subtext}
        </p>

        {/* Chip grid — 1 col mobile, 2 col tablet+ */}
        <div
          role="group"
          aria-label="Answer options"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
            gap: '10px',
          }}
        >
          {question.options.map((option) => (
            <AnswerChip
              key={option.label}
              label={option.label}
              selected={selectedLabel === option.label}
              onClick={() => onSelect(option.label)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      {/* ILL-02 · Leaf — ambient corner motif, hidden on mobile */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '52px',
          right: '52px',
          pointerEvents: 'none',
          opacity: 0.65,
          display: 'var(--leaf-display, none)',
        }}
      >
        <style>{`@media (min-width: 768px) { :root { --leaf-display: block; } }`}</style>
        <svg width="62" height="80" viewBox="0 0 80 100" fill="none">
          {/* stem */}
          <path
            d="M40 92 Q40 50 40 12"
            stroke="#2F4C3A"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.45"
          />
          {/* leaf body */}
          <path
            d="M40 12 Q14 22 18 56 Q22 82 40 88 Q58 82 62 56 Q66 22 40 12 Z"
            fill="#5C7A66"
            opacity="0.38"
            stroke="#2F4C3A"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* central veins */}
          <path d="M40 20 Q30 38 28 56" stroke="#E8C8A0" strokeWidth="1" fill="none" opacity="0.55" />
          <path d="M40 24 Q50 40 52 58" stroke="#E8C8A0" strokeWidth="1" fill="none" opacity="0.55" />
          {/* side veins */}
          <path
            d="M40 36 L34 43 M40 50 L34 57 M40 36 L46 43 M40 50 L46 57"
            stroke="#E8C8A0"
            strokeWidth="0.8"
            opacity="0.45"
          />
        </svg>
      </div>
    </div>
  )
}
