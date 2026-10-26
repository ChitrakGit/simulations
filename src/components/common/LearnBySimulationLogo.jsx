import React from 'react';

/**
 * Custom Logo for "Learn by Simulation"
 * Features a dynamic hexagonal/orbital node loop with a pulse wave,
 * symbolizing interactive systems, live simulations, and step-by-step learning.
 */
export default function LearnBySimulationLogo({ 
  size = 36, 
  showText = false, 
  textSize = '1.15rem',
  subText = 'Interactive Engineering Platform'
}) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.45))',
          flexShrink: 0
        }}
      >
        <defs>
          {/* Main Vibrant Mesh Gradients */}
          <linearGradient id="lbs-primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          <linearGradient id="lbs-circuit-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          <linearGradient id="lbs-pulse-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>

          <radialGradient id="lbs-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>

          <filter id="lbs-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Tech Hexagon Shield with Smooth Curved Corners */}
        <path
          d="M24 3.5 L41.5 13.6 C43 14.5 44 16.2 44 18 L44 30 C44 31.8 43 33.5 41.5 34.4 L24 44.5 C22.8 45.2 21.2 45.2 20 44.5 L2.5 34.4 C1 33.5 0 31.8 0 30 L0 18 C0 16.2 1 14.5 2.5 13.6 L20 3.5 C21.2 2.8 22.8 2.8 24 3.5 Z"
          fill="#090d16"
          stroke="url(#lbs-primary-grad)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Ambient Center Glow */}
        <circle cx="22" cy="24" r="16" fill="url(#lbs-center-glow)" />

        {/* Continuous Simulation Loop (Intertwined Orbit / Infinity Helix) */}
        <path
          d="M13 24 C13 18.5, 18 16, 22 24 C26 32, 31 29.5, 31 24 C31 18.5, 26 16, 22 24 C18 32, 13 29.5, 13 24 Z"
          fill="none"
          stroke="url(#lbs-circuit-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lbs-glow)"
        />

        {/* Interactive Pulse Waveform Line Crossing Center */}
        <path
          d="M8 24 H14 L18 17 L22 31 L26 21 L29 26 H36"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Orbital Node Beads (Interactive Simulation Points) */}
        {/* Node 1: Top-Left (Input) */}
        <circle cx="18" cy="17" r="2.8" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
        
        {/* Node 2: Center Core (Processing / Simulator) */}
        <circle cx="22" cy="24" r="3.2" fill="#c084fc" stroke="#ffffff" strokeWidth="1.2" />
        
        {/* Node 3: Bottom (State Feedback) */}
        <circle cx="22" cy="31" r="2.5" fill="#818cf8" stroke="#ffffff" strokeWidth="0.8" />

        {/* Node 4: Output / Target */}
        <circle cx="26" cy="21" r="2.6" fill="#06b6d4" stroke="#ffffff" strokeWidth="0.8" />

        {/* Dynamic Forward Chevron Arrow at the Exit Node */}
        <path
          d="M34 21 L38 24 L34 27"
          fill="none"
          stroke="url(#lbs-pulse-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
