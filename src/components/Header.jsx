import React from 'react';
import {
  Terminal,
  Cpu,
  Layers,
  Server,
  Search,
  Activity,
  Shield,
  Box,
  Code2,
  Network,
  BookOpen
} from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  totalCommandsCount,
  selectedCategory,
  setSelectedCategory
}) {
  return (
    <header className="glass-panel" style={{
      top: 12,
      zIndex: 50,
      margin: '12px auto 24px auto',
      maxWidth: '1440px',
      padding: '12px 24px',
      borderRadius: '16px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            position: 'relative',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(13, 183, 237, 0.4)'
          }} className="float-whale">
            {/* Custom Whale / Container SVG icon */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 13V9a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4a7 7 0 0 0 7 7h6a7 7 0 0 0 7-7Z" />
              <path d="M2 13h20" />
              <path d="M6 7V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3" />
              <path d="M10 7V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3" />
              <path d="M14 7V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3" />
            </svg>
            <div style={{
              position: 'absolute',
              bottom: '-3px',
              right: '-3px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid #070a12'
            }} title="Docker Daemon Online" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to right, #ffffff, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                DockerCore
              </span>
              <span className="badge badge-intermediate" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                Kernel & HW Simulator
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              From Motherboard & Linux Syscalls to Application Container
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('commands')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '7px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'commands' ? '600' : '400',
              color: activeTab === 'commands' ? '#ffffff' : 'var(--text-muted)',
              background: activeTab === 'commands' ? 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)' : 'transparent',
              boxShadow: activeTab === 'commands' ? '0 2px 10px rgba(13, 183, 237, 0.35)' : 'none'
            }}
          >
            <Box size={15} />
            <span>Docker Commands</span>
            <span style={{
              fontSize: '0.7rem',
              padding: '1px 5px',
              borderRadius: '4px',
              background: activeTab === 'commands' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)'
            }}>
              {totalCommandsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('components')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '7px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'components' ? '600' : '400',
              color: activeTab === 'components' ? '#ffffff' : 'var(--text-muted)',
              background: activeTab === 'components' ? 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)' : 'transparent',
              boxShadow: activeTab === 'components' ? '0 2px 10px rgba(14, 165, 233, 0.35)' : 'none'
            }}
          >
            <Network size={15} />
            <span>xyflow Simulation</span>
            <span style={{
              fontSize: '0.65rem',
              padding: '1px 5px',
              borderRadius: '4px',
              background: activeTab === 'components' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(14, 165, 233, 0.2)',
              color: activeTab === 'components' ? '#ffffff' : '#38bdf8'
            }}>
              Node Canvas
            </span>
          </button>


          <button
            onClick={() => setActiveTab('simulator')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '7px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'simulator' ? '600' : '400',
              color: activeTab === 'simulator' ? '#ffffff' : 'var(--text-muted)',
              background: activeTab === 'simulator' ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' : 'transparent',
              boxShadow: activeTab === 'simulator' ? '0 2px 10px rgba(168, 85, 247, 0.35)' : 'none'
            }}
          >
            <Cpu size={15} />
            <span>Execution Visualizer</span>
            <span style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#34d399'
            }} />
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '7px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'architecture' ? '600' : '400',
              color: activeTab === 'architecture' ? '#ffffff' : 'var(--text-muted)',
              background: activeTab === 'architecture' ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
            }}
          >
            <Layers size={15} />
            <span>OS & HW Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '7px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'terminal' ? '600' : '400',
              color: activeTab === 'terminal' ? '#ffffff' : 'var(--text-muted)',
              background: activeTab === 'terminal' ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
            }}
          >
            <Terminal size={15} />
            <span>Sandbox Terminal</span>
          </button>
        </nav>

        {/* Global Search & Live Host Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={15} style={{
              position: 'absolute',
              left: '10px',
              color: 'var(--text-dim)',
              pointerEvents: 'none'
            }} />
            <input
              type="text"
              placeholder="Filter command, flag, syscall..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                padding: '7px 12px 7px 32px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontFamily: 'inherit',
                width: '210px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--border-focus)';
                e.target.style.width = '240px';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-subtle)';
                e.target.style.width = '210px';
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  color: 'var(--text-dim)',
                  fontSize: '0.75rem',
                  padding: '2px'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Tutorial & Guide Button beside filter input box */}
          <button
            onClick={() => setActiveTab('tutorial')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'tutorial' ? '700' : '600',
              color: '#ffffff',
              background: activeTab === 'tutorial'
                ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
                : 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%)',
              border: activeTab === 'tutorial'
                ? '1px solid #f59e0b'
                : '1px solid rgba(245, 158, 11, 0.45)',
              boxShadow: activeTab === 'tutorial'
                ? '0 0 16px rgba(245, 158, 11, 0.45)'
                : 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
            title="Read Docker Tutorial & Installation Guide"
          >
            <BookOpen size={15} color={activeTab === 'tutorial' ? '#ffffff' : '#fbbf24'} />
            <span>Tutorial</span>
            <span style={{
              fontSize: '0.65rem',
              padding: '1px 5px',
              borderRadius: '4px',
              background: activeTab === 'tutorial' ? 'rgba(0, 0, 0, 0.35)' : 'rgba(245, 158, 11, 0.25)',
              color: activeTab === 'tutorial' ? '#ffffff' : '#fef08a'
            }}>
              Guide
            </span>
          </button>
        </div>
      </div>

      {/* System Status Ticker */}
      <div style={{
        marginTop: '12px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '0.72rem',
        color: 'var(--text-dim)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#34d399' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
            dockerd: active (v27.0.3)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Cpu size={12} color="#a855f7" /> Host Kernel: Linux 6.8.0-generic (Ring 0 / Ring 3)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Server size={12} color="#0db7ed" /> Storage Driver: OverlayFS (v2)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Shield size={12} color="#f59e0b" /> cgroups: v2 (unified hierarchy)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Execution Engine:</span>
          <span style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>containerd + runc (OCI)</span>
        </div>
      </div>
    </header>
  );
}
