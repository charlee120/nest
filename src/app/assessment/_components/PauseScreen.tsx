import styles from './PauseScreen.module.css'

interface PauseScreenProps {
  answer: string
  microcopy: string
}

export default function PauseScreen({ answer, microcopy }: PauseScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px 80px', position: 'relative', zIndex: 2 }}>

      {/* Large branch background motif — ~4% opacity */}
      <div aria-hidden="true" className={styles.pauseBg}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 900 700"
          preserveAspectRatio="xMaxYMid slice"
          fill="none"
          style={{ opacity: 0.045 }}
        >
          <path d="M900 60 Q780 100 700 200 Q620 300 600 440 Q590 520 620 640" stroke="#2F4C3A" strokeWidth="4" strokeLinecap="round" />
          <path d="M730 160 Q690 130 650 160 Q640 180 670 196" stroke="#2F4C3A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M680 240 Q640 210 610 238 Q600 260 628 272" stroke="#2F4C3A" strokeWidth="2" strokeLinecap="round" />
          <path d="M656 148 Q636 132 630 154 Q640 170 660 160 Z" fill="#2F4C3A" />
          <path d="M670 164 Q650 148 644 170 Q654 186 674 176 Z" fill="#2F4C3A" opacity="0.7" />
          <path d="M614 224 Q594 208 588 230 Q598 246 618 236 Z" fill="#2F4C3A" />
          <path d="M628 240 Q608 224 602 246 Q612 262 632 252 Z" fill="#2F4C3A" opacity="0.7" />
          <path d="M610 330 Q590 314 584 336 Q594 352 614 342 Z" fill="#2F4C3A" />
          <path d="M598 410 Q578 394 572 416 Q582 432 602 422 Z" fill="#2F4C3A" opacity="0.8" />
          <path d="M612 500 Q592 484 586 506 Q596 522 616 512 Z" fill="#2F4C3A" opacity="0.6" />
        </svg>
      </div>

      <div style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Confirmed answer badge */}
        <div
          role="status"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            background: 'rgba(92, 122, 102, 0.09)',
            border: '1px solid var(--moss)',
            borderRadius: '999px',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--deep-pine)',
            alignSelf: 'flex-start',
          }}
        >
          <span aria-hidden="true" style={{ color: 'var(--moss)', fontSize: '11px', opacity: 0.9 }}>✓</span>
          <span>{answer}</span>
        </div>

        {/* Warm microcopy block */}
        <div
          style={{
            background: 'rgba(92, 122, 102, 0.09)',
            borderLeft: '3px solid var(--moss)',
            borderRadius: '0 10px 10px 0',
            padding: '24px 28px',
          }}
        >
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--deep-pine)',
              lineHeight: 1.7,
              marginBottom: '10px',
              fontStyle: 'italic',
            }}
          >
            &ldquo;{microcopy}&rdquo;
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--moss)', opacity: 0.8 }}>
            You&rsquo;re not alone in this.
          </p>
        </div>

        {/* Animated dots */}
        <div aria-live="polite" aria-label="Loading next question">
          <div aria-hidden="true" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <span className={`${styles.dot} ${styles.dotH1}`} />
            <span className={`${styles.dot} ${styles.dotH2}`} />
            <span className={`${styles.dot} ${styles.dotM}`} />
          </div>
          <p style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--moss)', opacity: 0.5 }}>
            Next question loading
          </p>
        </div>

      </div>
    </div>
  )
}
