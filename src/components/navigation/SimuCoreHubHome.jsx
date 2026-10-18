import React from 'react';
import {
  Code2,
  Database,
  Wrench,
  Globe,
  Cpu,
  Box,
  Sparkles,
  ArrowRight,
  Compass
} from 'lucide-react';

export default function SimuCoreHubHome({ onSelectTopic }) {
  const topics = [
    {
      id: 'programming',
      num: '1',
      title: 'Programming Languages',
      sub: 'Interactive compilers, syntax trees, AST execution & memory models',
      specs: ['JavaScript V8', 'Python GIL', 'Go Goroutines', 'Rust Lifetimes'],
      icon: Code2,
      badge: 'Coming Soon',
      color: '#ec4899',
      isComingSoon: true
    },
    {
      id: 'databases',
      num: '2',
      title: 'DATABASES: SQL, Postgres & MongoDB',
      sub: 'Relational algebra query execution, B+Tree vs LSM indexing, 1NF-5NF normalization, sharded clusters & ACID transactions',
      specs: ['xyflow Calling Graph', 'SQL & Postgres MVCC', 'MongoDB Sharding', '1NF → 5NF Normalizer'],
      icon: Database,
      badge: 'Ready • Click to Load',
      color: '#f59e0b',
      accentGradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      glow: 'rgba(245, 158, 11, 0.4)',
      isAvailable: true
    },
    {
      id: 'docker',
      num: '3',
      title: 'Tools: Docker & Containers',
      sub: 'Linux kernel cgroups v2, namespaces, OverlayFS layers, Netfilter iptables & xyflow node canvas',
      specs: ['89 Interactive Commands', 'xyflow Topology Canvas', 'Multi-Layer Kernel Trace', 'Hardware Simulator'],
      icon: Wrench,
      badge: 'Ready • Click to Load',
      color: '#0ea5e9',
      accentGradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
      glow: 'rgba(14, 165, 233, 0.4)',
      isAvailable: true
    },
    {
      id: 'networking',
      num: '4',
      title: 'NETWORKING: Distributed Systems',
      sub: 'OSI 7-layer stack, TCP/IP handshakes, DNS recursors, BGP routing & dual-mode xyflow simulator',
      specs: ['xyflow Dual-Flow Canvas', 'Packet Tracer & Scenarios', 'Reverse Proxy & LB', 'CLI Sandbox'],
      icon: Globe,
      badge: 'Ready • Click to Load',
      color: '#10b981',
      accentGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      glow: 'rgba(16, 185, 129, 0.4)',
      isAvailable: true
    },
    {
      id: 'os',
      num: '5',
      title: 'Operating System: Linux, Windows, macOS',
      sub: 'Motherboard hardware buses, Internet Card (NIC), CPU scheduling, virtual memory paging, syscalls & deadlocks',
      specs: ['Motherboard & NIC Flow', 'Linux vs Win vs macOS Tree', 'xyflow Dual Simulator', '7 Master Chapters'],
      icon: Cpu,
      badge: 'Ready • Click to Load',
      color: '#a855f7',
      accentGradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      glow: 'rgba(168, 85, 247, 0.4)',
      isAvailable: true
    }
  ];

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '20px 24px 60px 24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* HERO BANNER */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        padding: '48px 36px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 50%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        marginBottom: '36px'
      }}>
        {/* Ambient background glows */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '10%',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '20px',
            background: 'rgba(99, 102, 241, 0.18)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            fontSize: '0.76rem',
            fontWeight: '700',
            color: '#c7d2fe',
            marginBottom: '18px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            <Sparkles size={14} color="#a5b4fc" />
            <span>SimuCore Hub • Dynamic Architectural Platform</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
            fontWeight: '900',
            lineHeight: '1.15',
            letterSpacing: '-0.03em',
            margin: '0 0 16px 0',
            background: 'linear-gradient(to right, #ffffff, #c084fc, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Explore Systems Engineering with Interactive Simulation
          </h1>

          <p style={{
            fontSize: '1rem',
            color: '#94a3b8',
            lineHeight: '1.65',
            margin: '0 0 28px 0',
            maxWidth: '720px'
          }}>
            Components load dynamically on demand to optimize performance. Select an active topic from the top menu or the launch cards below to mount the full-fidelity interactive visualizers, xyflow packet tracers, and OS-level execution engines.
          </p>

          {/* Quick Action Buttons for Active Modules */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onSelectTopic('docker')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 22px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.92rem',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(14, 165, 233, 0.45)',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 26px rgba(14, 165, 233, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.45)';
              }}
            >
              <Box size={18} />
              <span>Launch Tools: Docker Suite</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onSelectTopic('databases')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 22px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.92rem',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.45)',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 26px rgba(245, 158, 11, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(245, 158, 11, 0.45)';
              }}
            >
              <Database size={18} />
              <span>Launch DATABASES Suite</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onSelectTopic('networking')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 22px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.92rem',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.45)',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 26px rgba(16, 185, 129, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.45)';
              }}
            >
              <Globe size={18} />
              <span>Launch NETWORKING Suite</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onSelectTopic('os')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 22px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.92rem',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(168, 85, 247, 0.45)',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 26px rgba(168, 85, 247, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(168, 85, 247, 0.45)';
              }}
            >
              <Cpu size={18} />
              <span>Launch Operating System Suite</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION HEADER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Compass size={22} color="#38bdf8" />
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '800',
            color: '#f8fafc',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Select a Topic Module to Load
          </h2>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          5 Architectural Domains • Modular Dynamic Code Splitting
        </div>
      </div>

      {/* TOPIC SELECTION CARDS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {topics.map((topic) => {
          const Icon = topic.icon;
          const isAvail = topic.isAvailable;

          return (
            <div
              key={topic.id}
              onClick={() => {
                if (isAvail) {
                  onSelectTopic(topic.id);
                }
              }}
              style={{
                position: 'relative',
                borderRadius: '18px',
                padding: '24px 22px',
                background: isAvail
                  ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)'
                  : 'rgba(15, 23, 42, 0.5)',
                border: isAvail
                  ? `1px solid ${topic.color}40`
                  : '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: isAvail
                  ? `0 8px 24px rgba(0, 0, 0, 0.35)`
                  : 'none',
                opacity: isAvail ? 1 : 0.65,
                cursor: isAvail ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                if (isAvail) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 14px 34px ${topic.glow}`;
                  e.currentTarget.style.borderColor = topic.color;
                }
              }}
              onMouseLeave={(e) => {
                if (isAvail) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 8px 24px rgba(0, 0, 0, 0.35)`;
                  e.currentTarget.style.borderColor = `${topic.color}40`;
                }
              }}
            >
              {/* Card Top: Number, Icon, Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: isAvail ? `${topic.color}25` : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isAvail ? topic.color + '50' : 'rgba(255, 255, 255, 0.1)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={18} color={isAvail ? topic.color : '#94a3b8'} />
                  </div>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    color: isAvail ? topic.color : '#64748b'
                  }}>
                    Module {topic.num}
                  </span>
                </div>

                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: isAvail ? `${topic.color}20` : 'rgba(255, 255, 255, 0.05)',
                  color: isAvail ? topic.color : '#64748b',
                  border: `1px solid ${isAvail ? topic.color + '40' : 'rgba(255, 255, 255, 0.08)'}`
                }}>
                  {topic.badge}
                </span>
              </div>

              {/* Title & Description */}
              <h3 style={{
                fontSize: '1.12rem',
                fontWeight: '800',
                color: '#f8fafc',
                margin: '0 0 8px 0',
                letterSpacing: '-0.01em'
              }}>
                {topic.title}
              </h3>

              <p style={{
                fontSize: '0.82rem',
                color: '#94a3b8',
                lineHeight: '1.5',
                margin: '0 0 16px 0',
                flex: 1
              }}>
                {topic.sub}
              </p>

              {/* Feature Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {topic.specs.map((spec, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(0, 0, 0, 0.35)',
                      color: isAvail ? '#e2e8f0' : '#64748b',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Card Footer Action */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.82rem',
                fontWeight: '700',
                color: isAvail ? topic.color : '#64748b'
              }}>
                <span>{isAvail ? 'Load & Launch Simulator' : 'In Development'}</span>
                {isAvail && <ArrowRight size={16} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
