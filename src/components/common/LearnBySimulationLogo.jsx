import React from 'react';

/**
 * Vertical Infinite Symbol Logo
 * - Vertical Figure-8 Lemniscate representing infinite iterative cycles & continuous simulation
 * - Cybernetic Neon Gradient (Cyan -> Indigo -> Violet -> Fuchsia) with core glow & intersection node
 */
export default function LearnBySimulationLogo({ 
  size = 36, 
  showText = false, 
  textSize = '1.15rem',
  subText = 'Interactive Engineering Platform',
  hasBackground = true,
  className = ''
}) {
  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 0 14px rgba(99, 102, 241, 0.45))',
          flexShrink: 0
        }}
      >
        <defs>
          {/* Vibrant High-Contrast Cyber Gradient */}
          <linearGradient id="v-inf-grad-comp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#6366f1" />
            <stop offset="70%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          {/* Ambient Core Glow */}
          <radialGradient id="v-inf-glow-comp" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#6366f1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#070a13" stopOpacity="0" />
          </radialGradient>

          <filter id="v-blur-comp" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Optional App Icon Background Container */}
        {hasBackground && (
          <>
            <rect 
              width="64" 
              height="64" 
              rx="14" 
              fill="#070a13" 
              stroke="rgba(255, 255, 255, 0.12)" 
              strokeWidth="1.2" 
            />
            <circle cx="32" cy="32" r="26" fill="url(#v-inf-glow-comp)" />
          </>
        )}

        {/* Outer Ambient Glow Track */}
        <path
          d="M 32 32 C 43 23, 49 14, 44 8.5 C 39 3.5, 25 3.5, 20 8.5 C 15 14, 21 23, 32 32 C 43 41, 49 50, 44 55.5 C 39 60.5, 25 60.5, 20 55.5 C 15 50, 21 41, 32 32 Z"
          fill="none"
          stroke="url(#v-inf-grad-comp)"
          strokeWidth="7"
          opacity="0.32"
          filter="url(#v-blur-comp)"
        />

        {/* Main Vertical Infinity Ribbon */}
        <path
          d="M 32 32 C 43 23, 49 14, 44 8.5 C 39 3.5, 25 3.5, 20 8.5 C 15 14, 21 23, 32 32 C 43 41, 49 50, 44 55.5 C 39 60.5, 25 60.5, 20 55.5 C 15 50, 21 41, 32 32 Z"
          fill="none"
          stroke="url(#v-inf-grad-comp)"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* High-Tech Core Dashed Pulse Track */}
        <path
          d="M 32 32 C 43 23, 49 14, 44 8.5 C 39 3.5, 25 3.5, 20 8.5 C 15 14, 21 23, 32 32 C 43 41, 49 50, 44 55.5 C 39 60.5, 25 60.5, 20 55.5 C 15 50, 21 41, 32 32 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeDasharray="3 5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Center Intersection Node */}
        <circle cx="32" cy="32" r="3.2" fill="#070a13" stroke="#38bdf8" strokeWidth="1.6" />
        <circle cx="32" cy="32" r="1.4" fill="#ffffff" />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: textSize,
              fontWeight: '800',
              letterSpacing: '-0.025em',
              background: 'linear-gradient(to right, #ffffff, #c084fc, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.15
            }}>
              Learn by Simulation
            </span>
          </div>
          {subText && (
            <span style={{
              fontSize: '0.66rem',
              fontWeight: '600',
              color: '#94a3b8',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}>
              {subText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
