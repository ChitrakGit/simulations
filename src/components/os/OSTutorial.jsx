import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  HardDrive,
  Shield,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  ArrowRight,
  Zap,
  Terminal,
  Radio,
  Sliders,
  Boxes
} from 'lucide-react';

import { OS_TUTORIAL_CHAPTERS, OS_FLAVORS } from '../../data/osData';

export default function OSTutorial({ onNavigateToSimulator }) {
  const [selectedChapId, setSelectedChapId] = useState(OS_TUTORIAL_CHAPTERS[0].id);
  const [copiedKey, setCopiedKey] = useState(null);

  const chapter = OS_TUTORIAL_CHAPTERS.find(c => c.id === selectedChapId) || OS_TUTORIAL_CHAPTERS[0];

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tutorial Header */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                Operating Systems Master Curriculum
              </span>
              <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                7 Deep-Dive Chapters
              </span>
            </div>
            <h1 style={{
              fontSize: '1.65rem',
              fontWeight: '800',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #ffffff, #c084fc, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Operating Systems Engineering & Kernel Internals
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, maxWidth: '880px', lineHeight: '1.5' }}>
              Master fundamental OS concepts: Processes, Threads, CPU Scheduling (CFS), Virtual Memory Paging, Deadlocks (Banker's Algorithm), Semaphores, Monitors, and Linux vs Windows vs macOS architectures.
            </p>
          </div>

          {onNavigateToSimulator && (
            <button
              onClick={() => onNavigateToSimulator('simulator')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.86rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 14px rgba(168, 85, 247, 0.4)'
              }}
            >
              <Zap size={16} />
              <span>Open Hardware Simulator</span>
            </button>
          )}
        </div>
      </div>

      {/* Chapters Layout: Left Index, Right Reading Pane */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 1fr) minmax(500px, 2.5fr)',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Chapters Navigation Index */}
        <div className="glass-panel" style={{
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
            Course Curriculum Index
          </div>

          {OS_TUTORIAL_CHAPTERS.map((chap, idx) => {
            const isSel = chap.id === selectedChapId;
            return (
              <button
                key={chap.id}
                onClick={() => setSelectedChapId(chap.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: isSel ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSel ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.04)',
                  color: isSel ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: isSel ? '700' : '500', color: isSel ? '#ffffff' : '#cbd5e1' }}>
                    {chap.title}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: isSel ? '#c084fc' : '#64748b', marginTop: '2px' }}>
                    {chap.badge}
                  </div>
                </div>
                <ChevronRight size={14} color={isSel ? '#c084fc' : 'var(--text-dim)'} />
              </button>
            );
          })}
        </div>

        {/* Right Reading Content Pane */}
        <div className="glass-panel" style={{
          padding: '28px',
          borderRadius: '16px',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          background: 'rgba(15, 23, 42, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Chapter Heading Banner */}
          <div>
            <span className="badge" style={{ background: `${chapter.color}25`, color: chapter.color, border: `1px solid ${chapter.color}50` }}>
              {chapter.badge}
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#ffffff', margin: '8px 0 6px 0' }}>
              {chapter.title}
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#94a3b8', margin: '0 0 14px 0', lineHeight: '1.5' }}>
              {chapter.subtitle}
            </p>
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderLeft: `4px solid ${chapter.color}`,
              fontSize: '0.88rem',
              color: '#e2e8f0',
              lineHeight: '1.6'
            }}>
              {chapter.summary}
            </div>
          </div>

          {/* Chapter Detailed Sections */}
          {chapter.sections.map((sec, sIdx) => (
            <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                {sec.heading}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.65', margin: 0 }}>
                {sec.content}
              </p>

              {/* Key Bullet Points */}
              {sec.keyPoints && (
                <ul style={{
                  margin: '4px 0 0 0',
                  paddingLeft: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  color: '#94a3b8',
                  fontSize: '0.84rem',
                  lineHeight: '1.55'
                }}>
                  {sec.keyPoints.map((pt, pIdx) => (
                    <li key={pIdx}>
                      <span style={{ color: '#e2e8f0' }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Data Table (if present) */}
              {sec.table && (
                <div style={{
                  overflowX: 'auto',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginTop: '8px'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0, 0, 0, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        {sec.table.headers.map((h, hIdx) => (
                          <th key={hIdx} style={{ padding: '10px 14px', color: '#38bdf8', fontWeight: '700' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sec.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', background: rIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} style={{ padding: '10px 14px', color: cIdx === 0 ? '#ffffff' : '#cbd5e1', fontWeight: cIdx === 0 ? '600' : '400' }}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
