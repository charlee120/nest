interface ProgressBarProps {
  progress: number // 0–100
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Assessment progress, ${Math.round(progress)} percent`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'var(--honey-mute)',
        zIndex: 200,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'var(--moss)',
          borderRadius: '0 2px 2px 0',
          transition: 'width 0.5s ease-in-out',
        }}
      />
    </div>
  )
}
