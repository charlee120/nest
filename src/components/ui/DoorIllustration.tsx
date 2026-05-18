export default function DoorIllustration() {
  return (
    <svg viewBox="0 0 360 480" fill="none" aria-hidden="true" className="ns-door">
      {/* soft halo */}
      <ellipse cx="180" cy="240" rx="200" ry="220" fill="#E8C8A0" opacity="0.16" />
      {/* path tiles leading up */}
      <path d="M120 460 L 240 460 L 220 430 L 140 430 Z" fill="#9B6651" opacity="0.18" />
      <path d="M134 425 L 226 425 L 210 395 L 150 395 Z" fill="#9B6651" opacity="0.22" />
      <path d="M148 390 L 212 390 L 200 360 L 160 360 Z" fill="#9B6651" opacity="0.28" />
      <path d="M162 355 L 198 355 L 192 325 L 168 325 Z" fill="#9B6651" opacity="0.34" />
      {/* door frame */}
      <rect x="118" y="100" width="124" height="230" rx="2" fill="#2F4C3A" />
      <rect x="118" y="100" width="124" height="230" rx="2" fill="none" stroke="#1f3528" strokeWidth="1.5" />
      {/* interior glow */}
      <rect x="124" y="106" width="112" height="218" fill="#F8F0E5" opacity="0.9" />
      <rect x="124" y="106" width="112" height="218" fill="#E8C8A0" opacity="0.5" />
      {/* warm light pool */}
      <path d="M124 324 L 236 324 L 270 360 L 90 360 Z" fill="#E8C8A0" opacity="0.5" />
      <path d="M124 324 L 236 324 L 295 380 L 65 380 Z" fill="#E8C8A0" opacity="0.25" />
      {/* door slab — opened inward */}
      <path d="M124 106 L 200 116 L 200 324 L 124 324 Z" fill="#2F4C3A" />
      <path d="M124 106 L 200 116 L 200 324 L 124 324 Z" fill="#1f3528" opacity="0.4" />
      {/* door handle */}
      <circle cx="138" cy="218" r="2.4" fill="#E8C8A0" />
      {/* door panels */}
      <rect x="138" y="130" width="50" height="80" rx="1" fill="none" stroke="#3d5f4b" strokeWidth="0.8" opacity="0.7" />
      <rect x="138" y="220" width="50" height="92" rx="1" fill="none" stroke="#3d5f4b" strokeWidth="0.8" opacity="0.7" />
      {/* floating light dots */}
      <circle cx="100" cy="160" r="1.6" fill="#E8C8A0" opacity="0.7" />
      <circle cx="280" cy="140" r="1.6" fill="#E8C8A0" opacity="0.6" />
      <circle cx="60"  cy="240" r="1.4" fill="#E8C8A0" opacity="0.5" />
      <circle cx="310" cy="220" r="1.4" fill="#E8C8A0" opacity="0.5" />
      <circle cx="80"  cy="320" r="1.2" fill="#E8C8A0" opacity="0.4" />
      <circle cx="290" cy="300" r="1.2" fill="#E8C8A0" opacity="0.4" />
      {/* leaves near door */}
      <path d="M70 380 Q78 374 84 380 Q78 384 70 380 Z" fill="#5C7A66" opacity="0.8" />
      <path d="M286 388 Q294 382 300 388 Q294 392 286 388 Z" fill="#5C7A66" opacity="0.7" />
      <path d="M68 378 Q66 384 70 388" stroke="#2F4C3A" strokeWidth="0.6" fill="none" opacity="0.6" />
    </svg>
  )
}
