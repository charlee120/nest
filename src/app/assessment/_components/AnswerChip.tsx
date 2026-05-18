'use client'

interface AnswerChipProps {
  label: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
}

export default function AnswerChip({ label, selected, onClick, disabled }: AnswerChipProps) {
  return (
    <button
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '15px 20px',
        minHeight: '44px',
        fontSize: '0.875rem',
        fontWeight: selected ? 500 : 400,
        fontFamily: 'inherit',
        color: selected ? 'var(--deep-pine)' : 'var(--moss)',
        background: selected ? 'var(--pine-tint)' : 'var(--cream)',
        border: selected
          ? '2px solid var(--deep-pine)'
          : '1.5px solid rgba(224, 213, 197, 0.9)',
        borderRadius: '999px',
        textAlign: 'left',
        lineHeight: 1.4,
        cursor: disabled ? 'default' : 'pointer',
        width: '100%',
        transition: 'background 200ms ease-in-out, border-color 200ms ease-in-out, color 200ms ease-in-out, transform 150ms ease-in-out',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseEnter={e => {
        if (!selected && !disabled) {
          const el = e.currentTarget
          el.style.borderColor = 'var(--moss)'
          el.style.color = 'var(--deep-pine)'
          el.style.background = 'rgba(92, 122, 102, 0.09)'
        }
      }}
      onMouseLeave={e => {
        if (!selected && !disabled) {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(224, 213, 197, 0.9)'
          el.style.color = 'var(--moss)'
          el.style.background = 'var(--cream)'
        }
      }}
    >
      {label}
    </button>
  )
}
