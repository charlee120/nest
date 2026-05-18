interface NestLogoProps {
  size?: number
  color?: string
}

export default function NestLogo({ size = 20, color = '#F8F0E5' }: NestLogoProps) {
  return (
    <svg
      width={size * 3.2}
      height={size * 1.4}
      viewBox="0 0 100 44"
      fill="none"
      aria-label="Nest"
    >
      <path d="M14 8 Q10 14 12 20 Q18 18 18 12 Q18 8 14 8 Z" fill={color} opacity="0.8" />
      <path d="M14 12 L14 18" stroke={color} strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
      <text
        x="0"
        y="38"
        fontFamily="DM Sans, sans-serif"
        fontSize="22"
        fontWeight="400"
        letterSpacing="0.01em"
        fill={color}
      >
        nest
      </text>
    </svg>
  )
}
