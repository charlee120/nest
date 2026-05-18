'use client'

import { useState } from 'react'

const MOODS = [
  { glyph: '😔', label: 'Low' },
  { glyph: '😕', label: 'Off' },
  { glyph: '😶', label: 'Numb' },
  { glyph: '🙂', label: 'Okay' },
  { glyph: '😌', label: 'Settled' },
]

export default function MoodSelector() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section className="ns-mood">
      <div className="ns-mood__head">
        <div className="ns-mood__label">Today&rsquo;s mood</div>
        <div className="ns-mood__note">Optional · Not shared</div>
      </div>
      <div className="ns-mood__row">
        {MOODS.map((m, i) => (
          <button
            key={m.label}
            className={`ns-mood__chip${selected === i ? ' is-selected' : ''}`}
            onClick={() => setSelected(i === selected ? null : i)}
            aria-label={m.label}
            aria-pressed={selected === i}
          >
            <span className="ns-mood__glyph">{m.glyph}</span>
            <span className="ns-mood__name">{m.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
