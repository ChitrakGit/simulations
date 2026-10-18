import React from 'react';
import { Loader2, Layers } from 'lucide-react';

export default function SuspenseLoader({ label = 'Loading Simulation Module...', sub = 'Dynamically streaming component assets & execution engines' }) {
  return (
    <div style={{
      minHeight: '380px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      margin: '20px auto',
      maxWidth: '680px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.7) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.8; filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.6)); }
          50% { transform: scale(1.08); opacity: 1; filter: drop-shadow(0 0 24px rgba(168, 85, 247, 0.9)); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Futuristic Animated Core Icon */}
      <div style={{
        position: 'relative',
        width: '74px',
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '22px'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px dashed rgba(99, 102, 241, 0.4)',
          animation: 'spin-slow 8s linear infinite'
        }} />
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse-glow 2.4s ease-in-out infinite'
        }}>
          <Layers size={28} color="#ffffff" />
        </div>
      </div>

      <div style={{
        fontSize: '1.15rem',
        fontWeight: '800',
        letterSpacing: '-0.02em',
        background: 'linear-gradient(to right, #ffffff, #c084fc, #38bdf8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '8px'
      }}>
        {label}
      </div>

      <div style={{
        fontSize: '0.82rem',
        color: '#94a3b8',
        maxWidth: '440px',
        lineHeight: '1.5',
        marginBottom: '20px'
      }}>
        {sub}
      </div>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '20px',
        background: 'rgba(99, 102, 241, 0.15)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        fontSize: '0.74rem',
        color: '#a5b4fc',
        fontWeight: '600'
      }}>
        <Loader2 size={13} className="spin-icon" style={{ animation: 'spin-slow 1.5s linear infinite' }} />
        <span>Dynamic Chunk Streaming & Lazy Mount</span>
      </div>
    </div>
  );
}
