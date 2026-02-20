'use client'

import { useMemo } from 'react'

type ObjectType = 
  | 'apple' 
  | 'balloon' 
  | 'star' 
  | 'flower' 
  | 'ball' 
  | 'heart' 
  | 'fish' 
  | 'bird'
  | 'butterfly'
  | 'sun'

interface VisualCounterProps {
  count: number
  objectType: ObjectType
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const AppleSVG = ({ color = '#e53e3e', delay = 0 }: { color?: string; delay?: number }) => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-full h-full"
    style={{ animationDelay: `${delay}ms` }}
  >
    <ellipse cx="50" cy="55" rx="35" ry="38" fill={color} />
    <ellipse cx="50" cy="55" rx="35" ry="38" fill="url(#appleShine)" />
    <path d="M50 20 Q55 5 65 10" stroke="#4a5568" strokeWidth="4" fill="none" strokeLinecap="round" />
    <ellipse cx="60" cy="15" rx="8" ry="5" fill="#48bb78" transform="rotate(-30 60 15)" />
    <defs>
      <radialGradient id="appleShine" cx="30%" cy="30%">
        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
)

const BalloonSVG = ({ color = '#9f7aea', delay = 0 }: { color?: string; delay?: number }) => (
  <svg 
    viewBox="0 0 100 120" 
    className="w-full h-full"
    style={{ animationDelay: `${delay}ms` }}
  >
    <ellipse cx="50" cy="45" rx="32" ry="40" fill={color} />
    <ellipse cx="50" cy="45" rx="32" ry="40" fill="url(#balloonShine)" />
    <polygon points="50,85 42,95 58,95" fill={color} />
    <path d="M50 95 Q48 105 52 115" stroke="#a0aec0" strokeWidth="2" fill="none" />
    <defs>
      <radialGradient id="balloonShine" cx="35%" cy="25%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
)

const StarSVG = ({ color = '#ecc94b', delay = 0 }: { color?: string; delay?: number }) => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-full h-full"
    style={{ animationDelay: `${delay}ms` }}
  >
    <polygon 
      points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40" 
      fill={color}
    />
    <polygon 
      points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40" 
      fill="url(#starShine)"
    />
    <defs>
      <radialGradient id="starShine" cx="40%" cy="30%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
)

const FlowerSVG = ({ color = '#ed64a6', delay = 0 }: { color?: string; delay?: number }) => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-full h-full"
    style={{ animationDelay: `${delay}ms` }}
  >
    <circle cx="50" cy="30" r="18" fill={color} />
    <circle cx="30" cy="50" r="18" fill={color} />
    <circle cx="70" cy="50" r="18" fill={color} />
    <circle cx="35" cy="70" r="18" fill={color} />
    <circle cx="65" cy="70" r="18" fill={color} />
    <circle cx="50" cy="50" r="15" fill="#ecc94b" />
    <defs>
      <radialGradient id="flowerShine" cx="40%" cy="30%">
        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
)

const BallSVG = ({ color = '#4299e1', delay = 0 }: { color?: string; delay?: number }) => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-full h-full"
    style={{ animationDelay: `${delay}ms` }}
  >
    <circle cx="50" cy="50" r="40" fill={color} />
    <circle cx="50" cy="50" r="40" fill="url(#ballShine)" />
    <path d="M25 50 Q50 30 75 50" stroke="white" strokeWidth="3" fill="none" opacity="0.5" />
    <path d="M25 50 Q50 70 75 50" stroke="white" strokeWidth="3" fill="none" opacity="0.5" />
    <defs>
      <radialGradient id="ballShine" cx="30%" cy="30%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
)

const HeartSVG = ({ color = '#fc8181', delay = 0 }: { color?: string; delay?: number }) => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-full h-full"
    style={{ animationDelay: `${delay}ms` }}
  >
    <path 
      d="M50 88 C20 60 5 40 20 25 C35 10 50 25 50 25 C50 25 65 10 80 25 C95 40 80 60 50 88Z" 
      fill={color}
    />
    <path 
      d="M50 88 C20 60 5 40 20 25 C35 10 50 25 50 25 C50 25 65 10 80 25 C95 40 80 60 50 88Z" 
      fill="url(#heartShine)"
    />
    <defs>
      <radialGradient id="heartShine" cx="35%" cy="25%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
)

const FishSVG = ({ color = '#38b2ac', delay = 0 }: { color?: string; delay?: number }) => (
  <svg 
    viewBox="0 0 100 80" 
    className="w-full h-full"
    style={{ animationDelay: `${delay}ms` }}
  >
    <ellipse cx="45" cy="40" rx="35" ry="25" fill={color} />
    <polygon points="80,40 100,20 100,60" fill={color} />
    <circle cx="25" cy="35" r="5" fill="white" />
    <circle cx="26" cy="36" r="2" fill="#1a202c" />
    <defs>
      <radialGradient id="fishShine" cx="30%" cy="30%">
        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
)

const BirdSVG = ({ color = '#f6ad55', delay = 0 }: { color?: string; delay?: number }) => (
  <svg 
    viewBox="0 0 100 80" 
    className="w-full h-full"
    style={{ animationDelay: `${delay}ms` }}
  >
    <ellipse cx="50" cy="45" rx="30" ry="22" fill={color} />
    <circle cx="75" cy="35" r="15" fill={color} />
    <polygon points="90,35 105,32 90,38" fill="#ecc94b" />
    <circle cx="80" cy="32" r="3" fill="#1a202c" />
    <ellipse cx="35" cy="50" rx="15" ry="8" fill={color} transform="rotate(-20 35 50)" />
  </svg>
)

const ButterflySVG = ({ color = '#b794f4', delay = 0 }: { color?: string; delay?: number }) => (
  <svg 
    viewBox="0 0 100 80" 
    className="w-full h-full"
    style={{ animationDelay: `${delay}ms` }}
  >
    <ellipse cx="30" cy="30" rx="22" ry="18" fill={color} />
    <ellipse cx="70" cy="30" rx="22" ry="18" fill={color} />
    <ellipse cx="35" cy="55" rx="18" ry="15" fill={color} />
    <ellipse cx="65" cy="55" rx="18" ry="15" fill={color} />
    <ellipse cx="50" cy="45" rx="5" ry="25" fill="#4a5568" />
    <circle cx="30" cy="28" r="5" fill="#1a202c" opacity="0.3" />
    <circle cx="70" cy="28" r="5" fill="#1a202c" opacity="0.3" />
  </svg>
)

const SunSVG = ({ color = '#f6e05e', delay = 0 }: { color?: string; delay?: number }) => (
  <svg 
    viewBox="0 0 100 100" 
    className="w-full h-full"
    style={{ animationDelay: `${delay}ms` }}
  >
    <circle cx="50" cy="50" r="25" fill={color} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <line
        key={i}
        x1={50 + 30 * Math.cos((angle * Math.PI) / 180)}
        y1={50 + 30 * Math.sin((angle * Math.PI) / 180)}
        x2={50 + 45 * Math.cos((angle * Math.PI) / 180)}
        y2={50 + 45 * Math.sin((angle * Math.PI) / 180)}
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />
    ))}
  </svg>
)

const objectComponents: Record<ObjectType, React.FC<{ color?: string; delay?: number }>> = {
  apple: AppleSVG,
  balloon: BalloonSVG,
  star: StarSVG,
  flower: FlowerSVG,
  ball: BallSVG,
  heart: HeartSVG,
  fish: FishSVG,
  bird: BirdSVG,
  butterfly: ButterflySVG,
  sun: SunSVG,
}

const objectColors: Record<ObjectType, string[]> = {
  apple: ['#e53e3e', '#38a169', '#ecc94b'],
  balloon: ['#9f7aea', '#4299e1', '#ed64a6', '#48bb78', '#f6ad55'],
  star: ['#ecc94b', '#f6ad55', '#fc8181'],
  flower: ['#ed64a6', '#9f7aea', '#fc8181', '#f6ad55'],
  ball: ['#4299e1', '#48bb78', '#ed64a6', '#f6ad55'],
  heart: ['#fc8181', '#ed64a6', '#e53e3e'],
  fish: ['#38b2ac', '#4299e1', '#f6ad55', '#ed64a6'],
  bird: ['#f6ad55', '#4299e1', '#48bb78', '#fc8181'],
  butterfly: ['#b794f4', '#ed64a6', '#4299e1', '#f6ad55'],
  sun: ['#f6e05e', '#f6ad55'],
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
}

export function VisualCounter({ 
  count, 
  objectType, 
  size = 'md',
  animated = true 
}: VisualCounterProps) {
  const ObjectComponent = objectComponents[objectType]
  const colors = objectColors[objectType]

  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      delay: animated ? i * 80 : 0,
    }))
  }, [count, colors, animated])

  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-xs mx-auto">
      {items.map((item) => (
        <div
          key={item.id}
          className={`${sizeClasses[size]} ${animated ? 'animate-fade-in' : ''}`}
          style={{ 
            animationDelay: `${item.delay}ms`,
            animationFillMode: 'both',
          }}
        >
          <ObjectComponent color={item.color} delay={item.delay} />
        </div>
      ))}
    </div>
  )
}

export const objectTypes: ObjectType[] = [
  'apple', 'balloon', 'star', 'flower', 'ball', 
  'heart', 'fish', 'bird', 'butterfly', 'sun'
]

export const objectNames: Record<ObjectType, string> = {
  apple: 'алма',
  balloon: 'шар',
  star: 'жұлдыз',
  flower: 'гүл',
  ball: 'доп',
  heart: 'жүрек',
  fish: 'балық',
  bird: 'құс',
  butterfly: 'көбелек',
  sun: 'күн',
}

export type { ObjectType }
