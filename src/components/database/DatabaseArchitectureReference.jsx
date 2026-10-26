import React, { useState, useMemo } from 'react';
import {
  Database,
  Server,
  Layers,
  Cpu,
  ShieldCheck,
  GitBranch,
  Activity,
  Boxes,
  Sliders,
  CheckCircle2,
  Copy,
  Check,
  Search,
  ExternalLink,
  ChevronRight,
  Terminal,
  AlertTriangle,
  Zap,
  HardDrive,
  FileCode,
  Network
} from 'lucide-react';
import { DATABASE_ARCHITECTURE_REFERENCE, DATABASE_ENGINES } from '../../data/databaseData';

export default function DatabaseArchitectureReference({ activeEngine = 'sql', setActiveEngine }) {
  const [activeChapter, setActiveChapter] = useState('all'); // 'all' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  // Pool sizing calculator state (Section 2)
  const [calcCores, setCalcCores] = useState(16);
  const [calcSpindles, setCalcSpindles] = useState(1); // 1 for NVMe SSD

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const calculatedPool = useMemo(() => {
    return Math.max(2, (calcCores * 2) + calcSpindles);
  }, [calcCores, calcSpindles]);

  const ref = DATABASE_ARCHITECTURE_REFERENCE;

  const chapters = [
    { id: 'all', num: '📑', label: 'All 9 Chapters' },
    { id: '1', num: '1.', label: 'Specs & Comparison' },
    { id: '2', num: '2.', label: 'Connection Lifecycle' },
    { id: '3', num: '3.', label: 'Storage & On-Disk' },
    { id: '4', num: '4.', label: 'MVCC & Isolation' },
    { id: '5', num: '5.', label: 'Indexing & Sargability' },
    { id: '6', num: '6.', label: 'Execution & Algebra' },
    { id: '7', num: '7.', label: 'Physical Joins' },
    { id: '8', num: '8.', label: 'Replication & HA' },
    { id: '9', num: '9.', label: 'Production Tuning' }
  ];

  const matchesSearch = (text) => {
    if (!searchFilter.trim()) return true;
    return text.toLowerCase().includes(searchFilter.toLowerCase().trim());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* HERO BANNER */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        borderRadius: '18px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '800',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                Architectural Master Reference
              </span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                PostgreSQL 16.x (Heap/MVCC)
              </span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(2, 132, 199, 0.2)',
                color: '#7dd3fc',
                border: '1px solid rgba(2, 132, 199, 0.4)'
              }}>
                MySQL 8.x (InnoDB B+Tree)
              </span>
            </div>

            <h1 style={{
              fontSize: '1.45rem',
              fontWeight: '900',
              margin: '0 0 6px 0',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>PostgreSQL & MySQL Architectural Data Reference</span>
            </h1>

            <p style={{
              margin: 0,
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              maxWidth: '850px',
              lineHeight: '1.5'
            }}>
              Extracted directly from systems benchmarks and database simulation engines. Covers storage models, memory architectures, connection lifecycles, query pipelines, indexing strategies, and MVCC transaction concurrency.
            </p>
          </div>

          {/* Quick Stats or Engine Switches */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveEngine && setActiveEngine('postgres')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: activeEngine === 'postgres' ? 'rgba(51, 103, 145, 0.35)' : 'rgba(0, 0, 0, 0.4)',
                border: activeEngine === 'postgres' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Server size={14} color="#38bdf8" />
              <span>🐘 Focus PostgreSQL</span>
            </button>
            <button
              onClick={() => setActiveEngine && setActiveEngine('sql')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: activeEngine === 'sql' ? 'rgba(2, 132, 199, 0.35)' : 'rgba(0, 0, 0, 0.4)',
                border: activeEngine === 'sql' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Database size={14} color="#0284c7" />
              <span>🐬 Focus MySQL InnoDB</span>
            </button>
          </div>
        </div>
      </div>

      {/* CHAPTER NAVIGATION PILLS & SEARCH */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <nav style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.45)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {chapters.map((ch) => {
            const isActive = activeChapter === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChapter(ch.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.45) 100%)'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.6)' : '1px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ color: isActive ? '#fbbf24' : 'var(--text-dim)', fontWeight: '800' }}>{ch.num}</span>
                <span>{ch.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Live Search Filter */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-dim)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search ctid, HOT, MVCC, tuning..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              padding: '7px 12px 7px 30px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              outline: 'none',
              width: '230px'
            }}
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              style={{
                position: 'absolute',
                right: '8px',
                color: 'var(--text-dim)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: ENGINE ARCHITECTURE & CORE SPECIFICATIONS (13 DIMENSIONS)
          ========================================================================= */}
      {(activeChapter === 'all' || activeChapter === '1') && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0' }}>
                1. Engine Architecture & Core Specifications
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                13-Dimension technical comparison of the two relational powerhouses simulated in the platform
              </p>
            </div>
            <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-dim)' }}>
              Section 1 Reference
            </span>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
                  <th style={{ padding: '12px 14px', color: '#fbbf24', width: '22%' }}>Dimension</th>
                  <th style={{ padding: '12px 14px', color: '#38bdf8', width: '38%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Database size={14} />
                      <span>MySQL 8.x (InnoDB Storage Engine)</span>
                    </div>
                  </th>
                  <th style={{ padding: '12px 14px', color: '#818cf8', width: '40%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Server size={14} />
                      <span>PostgreSQL 16.x (Heap Engine & MVCC)</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ref.engineComparisonMatrix.filter(r => matchesSearch(r.dimension + ' ' + r.mysql + ' ' + r.postgres)).map((row, idx) => (
                  <tr key={idx} style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent'
                  }}>
                    <td style={{ padding: '10px 14px', fontWeight: '700', color: '#f8fafc', verticalAlign: 'top' }}>
                      {row.dimension}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#e2e8f0', lineHeight: '1.5', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '600' }}>{row.mysql}</div>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#e2e8f0', lineHeight: '1.5', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '600' }}>{row.postgres}</div>
                      {row.impact && (
                        <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                          💡 {row.impact}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: CONNECTION LIFECYCLE & CONCURRENCY MODELS
          ========================================================================= */}
      {(activeChapter === 'all' || activeChapter === '2') && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0' }}>
            2. Connection Lifecycle & Concurrency Models
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
            The 7-Stage connection handshake, Process-per-connection vs Thread-per-connection architectures, and HikariCP pool sizing mathematics.
          </p>

          {/* 2.1 The 7-Stage Handshake */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#38bdf8', marginBottom: '12px' }}>
              2.1 The 7-Stage Connection Handshake Sequence
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '10px'
            }}>
              {ref.connectionLifecycle.handshakeStages.map((st) => (
                <div key={st.step} style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(56, 189, 248, 0.2)',
                      color: '#38bdf8'
                    }}>
                      Step {st.step}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      {st.port}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff' }}>
                    {st.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: '1.4' }}>
                    {st.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2.2 Concurrency Architecture Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: '18px',
              borderRadius: '12px',
              background: 'rgba(51, 103, 145, 0.12)',
              border: '1px solid rgba(51, 103, 145, 0.35)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Server size={16} color="#38bdf8" />
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#38bdf8', fontWeight: '800' }}>
                  PostgreSQL: Process-per-Connection
                </h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <li><strong>Daemon:</strong> Postmaster daemon calls <code>fork()</code> on incoming TCP connection.</li>
                <li><strong>Memory:</strong> 5 MB – 10 MB+ private memory per backend process (work_mem, temp_buffers).</li>
                <li><strong>Limitation:</strong> Running &gt;200–500 active connections causes severe OS context-switching overhead and CPU cache line invalidation.</li>
                <li><strong>Mandatory Solution:</strong> A dedicated connection pooler like <strong>PgBouncer</strong> is required in production.</li>
              </ul>
            </div>

            <div style={{
              padding: '18px',
              borderRadius: '12px',
              background: 'rgba(2, 132, 199, 0.12)',
              border: '1px solid rgba(2, 132, 199, 0.35)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Database size={16} color="#0284c7" />
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0284c7', fontWeight: '800' }}>
                  MySQL (InnoDB): Thread-per-Connection
                </h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <li><strong>Server:</strong> The <code>mysqld</code> daemon runs as a single multi-threaded process.</li>
                <li><strong>Memory:</strong> ~1 MB – 3 MB stack and session buffers (sort_buffer_size, join_buffer_size).</li>
                <li><strong>Limitation:</strong> Beyond 1,000 active threads, OS scheduler thrashing can degrade throughput.</li>
                <li><strong>Solution:</strong> Bounded worker pools via Thread Pool plugins (MySQL Enterprise or Percona).</li>
              </ul>
            </div>
          </div>

          {/* 2.3 Pool Sizing Formula Calculator */}
          <div style={{
            padding: '18px 20px',
            borderRadius: '12px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.92rem', color: '#fbbf24', fontWeight: '800' }}>
                  2.3 HikariCP & PostgreSQL Hardware Pool Sizing Calculator
                </h4>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: '#f8fafc' }}>
                  connections ≈ (CPU Cores × 2) + Effective Spindle Count
                </div>
              </div>
              <div style={{
                fontSize: '1.4rem',
                fontWeight: '900',
                color: '#34d399',
                padding: '6px 16px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)'
              }}>
                Target: {calculatedPool} Connections
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  CPU Cores: <strong>{calcCores} cores</strong>
                </label>
                <input
                  type="range"
                  min="2"
                  max="64"
                  step="2"
                  value={calcCores}
                  onChange={(e) => setCalcCores(parseInt(e.target.value, 10))}
                  style={{ width: '160px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Disk Spindles: <strong>{calcSpindles} (NVMe = 1)</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={calcSpindles}
                  onChange={(e) => setCalcSpindles(parseInt(e.target.value, 10))}
                  style={{ width: '160px' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '240px', fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.5' }}>
                ⚠️ <strong>Key Insight:</strong> A 16-core server reaches peak throughput at only ~33 connections. Opening 1,000 connections does not increase query speed; it saturates disk queues and triggers CPU thrashing.
              </div>
            </div>
          </div>

          {/* 2.4 PgBouncer Pooling Modes */}
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#38bdf8', marginBottom: '12px' }}>
              2.4 PgBouncer Pooling Modes Comparison
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {ref.connectionLifecycle.pgBouncerModes.map((m, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#ffffff' }}>{m.mode}</span>
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                      {m.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.4', margin: '0 0 8px 0' }}>{m.desc}</p>
                  <div style={{ fontSize: '0.72rem', color: '#34d399', marginBottom: '4px' }}>
                    <strong>Benefit:</strong> {m.benefits}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#f87171' }}>
                    <strong>Limitation:</strong> {m.limitations}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: STORAGE ENGINE & ON-DISK LAYOUT
          ========================================================================= */}
      {(activeChapter === 'all' || activeChapter === '3') && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0' }}>
            3. Storage Engine & On-Disk Layout
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
            MySQL InnoDB Clustered Index B+Tree storage vs PostgreSQL Heap table with ctid addressing, HOT optimization, and off-page TOAST.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* MySQL InnoDB Layout */}
            <div style={{
              padding: '18px',
              borderRadius: '12px',
              background: 'rgba(2, 132, 199, 0.08)',
              border: '1px solid rgba(2, 132, 199, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '0.96rem', color: '#38bdf8', fontWeight: '800' }}>
                  MySQL InnoDB: Clustered Index Storage
                </h3>
                <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(2, 132, 199, 0.25)', color: '#7dd3fc' }}>
                  16 KB Pages
                </span>
              </div>

              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: '#090d16',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: '#38bdf8',
                lineHeight: '1.5',
                marginBottom: '12px',
                overflowX: 'auto'
              }}>
                [Clustered B+Tree on Primary Key]<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Root Node Page]<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\<br />
                &nbsp;&nbsp;&nbsp;&nbsp;[Branch Page]&nbsp;&nbsp;&nbsp;&nbsp;[Branch Page]<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\<br />
                &nbsp;&nbsp;[Leaf Page] [Leaf Page] [Leaf Page] ◄── Doubly Linked List<br />
                &nbsp;&nbsp;┌──────────────────────────────────────────────┐<br />
                &nbsp;&nbsp;│ Row 1 (PK=10, Name="Alice", Balance=$500)&nbsp;&nbsp;&nbsp;&nbsp;│ ◄── Actual user rows stored<br />
                &nbsp;&nbsp;│ Row 2 (PK=20, Name="Bob",&nbsp;&nbsp;&nbsp;Balance=$250)&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inside leaf pages!<br />
                &nbsp;&nbsp;└──────────────────────────────────────────────┘
              </div>

              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <li><strong>Primary Key Dictates Order:</strong> All table records are physically ordered inside primary key leaf pages.</li>
                <li><strong>Double Lookup:</strong> Secondary indexes store <code>(indexed_col, PK)</code>. Querying non-indexed columns probes secondary B+Tree first, then probes clustered B+Tree.</li>
                <li><strong>Buffer Pool:</strong> Managed via LRU with <strong>Young (5/8)</strong> and <strong>Old (3/8)</strong> sublists to prevent table scans from wiping hot cache.</li>
                <li><strong>Doublewrite Buffer:</strong> Writes to contiguous disk buffer first to prevent torn pages on OS crashes.</li>
              </ul>
            </div>

            {/* PostgreSQL Heap Layout */}
            <div style={{
              padding: '18px',
              borderRadius: '12px',
              background: 'rgba(51, 103, 145, 0.08)',
              border: '1px solid rgba(51, 103, 145, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '0.96rem', color: '#818cf8', fontWeight: '800' }}>
                  PostgreSQL: Heap Storage & ctid Addressing
                </h3>
                <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(51, 103, 145, 0.25)', color: '#c7d2fe' }}>
                  8 KB Blocks
                </span>
              </div>

              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: '#090d16',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: '#818cf8',
                lineHeight: '1.5',
                marginBottom: '12px',
                overflowX: 'auto'
              }}>
                [PostgreSQL Heap Table File]<br />
                &nbsp;&nbsp;Page 0 (8KB) ─────── Page 1 (8KB) ─────── Page 2 (8KB)<br />
                &nbsp;&nbsp;┌───────────────────┬───────────────────┬───────────────────┐<br />
                &nbsp;&nbsp;│ ItemId [1, 2, 3]&nbsp;&nbsp;│ ItemId [1, 2]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ ItemId [1, 2, 3]&nbsp;&nbsp;│<br />
                &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
                &nbsp;&nbsp;│ Tuple 3 (free)&nbsp;&nbsp;&nbsp;&nbsp;│ Tuple 2 (Alice)&nbsp;&nbsp;&nbsp;│ Tuple 3 (Charlie) │<br />
                &nbsp;&nbsp;│ Tuple 2 (Bob v2)&nbsp;&nbsp;│ Tuple 1 (Alice v1)│ Tuple 2 (David)&nbsp;&nbsp;&nbsp;│<br />
                &nbsp;&nbsp;│ Tuple 1 (Bob v1)&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ Tuple 1 (Eve)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
                &nbsp;&nbsp;└───────────────────┴───────────────────┴───────────────────┘
              </div>

              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <li><strong>Physical <code>ctid</code>:</strong> Every row coordinate is <code>(block_number, tuple_offset)</code> (e.g. <code>(42, 3)</code>).</li>
                <li><strong>Direct Secondary Indexes:</strong> All indexes point directly to <code>ctid</code>; no second clustered lookup needed.</li>
                <li><strong>HOT (Heap-Only Tuples):</strong> Updates without index column changes link in-page (<code>old ctid → new ctid</code>) without updating secondary indexes, eliminating index bloat!</li>
                <li><strong>FSM & VM:</strong> Free Space Map (FSM) tracks capacity; Visibility Map (VM) enables fast <strong>Index-Only Scans</strong>.</li>
              </ul>
            </div>
          </div>

          {/* Off-page storage card */}
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255, 255, 255, 0.07)'
          }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.86rem', color: '#fbbf24', fontWeight: '800' }}>
              Off-Page Storage: PostgreSQL TOAST vs MySQL Overflow Pages
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                <strong>PostgreSQL TOAST:</strong> Columns exceeding ~2KB are compressed and chunked into a hidden TOAST table. The heap stores only an 18-byte OID pointer, keeping 8KB pages lean.
              </div>
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                <strong>MySQL Off-Page:</strong> Stores the first 768 bytes of large VARCHAR/BLOB columns inline within the clustered leaf page, moving the remainder to external overflow pages.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: MVCC & TRANSACTION ISOLATION DEEP DIVE
          ========================================================================= */}
      {(activeChapter === 'all' || activeChapter === '4') && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0' }}>
            4. MVCC & Transaction Isolation Deep Dive
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
            Multi-Version Concurrency Control internals: Undo Logs (MySQL) vs Heap Tuples (PG), 5 Concurrency Anomalies, InnoDB Locking Modes, and PostgreSQL XID wraparound.
          </p>

          {/* Golden Rule Banner */}
          <div style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.25) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            fontSize: '0.82rem',
            color: '#34d399',
            fontWeight: '700',
            marginBottom: '20px'
          }}>
            🌟 <strong>Core MVCC Axiom:</strong> Readers never block Writers. Writers never block Readers. Writers only block other Writers competing for the exact same row.
          </div>

          {/* Undo Logs vs Heap Tuples Code View */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ padding: '16px', borderRadius: '10px', background: '#090d16', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#38bdf8', marginBottom: '8px' }}>
                MySQL InnoDB (Rollback Segments)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#93c5fd', lineHeight: '1.5' }}>
                [Clustered Table] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Undo Log Tablespace]<br />
                ┌────────────────────────┐ &nbsp;&nbsp;&nbsp;┌────────────────────────┐<br />
                │ User Row (bal: $80) &nbsp;&nbsp;&nbsp;│───►│ Undo Rec: (bal: $100) &nbsp;│<br />
                │ DB_TRX_ID: 15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ &nbsp;&nbsp;&nbsp;└────────────────────────┘<br />
                │ DB_ROLL_PTR ───────────┘<br />
                * Overwrites data in place. Older versions reconstructed on the fly by following DB_ROLL_PTR chain backward.<br />
                * Purge threads delete Undo logs once older transactions finish.
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', background: '#090d16', border: '1px solid rgba(51, 103, 145, 0.3)' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#818cf8', marginBottom: '8px' }}>
                PostgreSQL (Heap Tuple Versions)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#c7d2fe', lineHeight: '1.5' }}>
                [8KB Heap Block]<br />
                ┌──────────────────────────────────────────────────┐<br />
                │ Tuple 1: (id: 1, bal: $100) | xmin: 10 | xmax: 15│ ◄ Dead (old)<br />
                │ Tuple 2: (id: 1, bal: $80)  | xmin: 15 | xmax: 0 │ ◄ Live (active)<br />
                └──────────────────────────────────────────────────┘<br />
                * Append-only. Updates create a brand-new tuple in the heap.<br />
                * xmin: Tx ID that inserted this version; xmax: Tx ID that updated/deleted.<br />
                * VACUUM daemon cleans dead tuples where xmax &lt; oldest active Tx.
              </div>
            </div>
          </div>

          {/* InnoDB Locking Modes & XID Wraparound */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: '#fbbf24', fontWeight: '800' }}>
                InnoDB 4-Level Locking Modes
              </h4>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <li><strong>Record Lock:</strong> Locks the B+Tree index record itself.</li>
                <li><strong>Gap Lock:</strong> Locks the open space between index records to prevent concurrent insertions into the gap.</li>
                <li><strong>Next-Key Lock:</strong> Record Lock + Gap Lock immediately preceding the record. <em>Default in Repeatable Read to eliminate phantom rows!</em></li>
                <li><strong>Intention Locks (IS / IX):</strong> Table-level flags indicating intent to lock individual rows downstream.</li>
              </ul>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', color: '#f87171', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={15} />
                PostgreSQL XID Wraparound Danger & Freezing
              </h4>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#fca5a5', lineHeight: '1.5' }}>
                Because PostgreSQL relies on 32-bit transaction IDs (capacity: ~4.2 billion), numbers eventually wrap back around. Old rows would appear to be created in the "future" and vanish!
              </p>
              <div style={{ marginTop: '8px', fontSize: '0.74rem', color: '#ffffff', background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '6px' }}>
                ✅ <strong>Solution:</strong> <code>autovacuum</code> scans old pages and marks tuples as <strong>Frozen</strong>. Frozen tuples are visible to all future transactions. Tuning <code>autovacuum_freeze_max_age</code> prevents sudden database lockups.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 5: INDEXING SYSTEMS & SARGABILITY RULES
          ========================================================================= */}
      {(activeChapter === 'all' || activeChapter === '5') && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0' }}>
            5. Indexing Systems & Sargability Rules
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 18px 0' }}>
            6 Specialized Index Types, Compound Leftmost Prefix Rule, Covering & Partial Indexes, and SARGable SQL patterns.
          </p>

          {/* 5.1 Specialized Index Types Comparison */}
          <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
                  <th style={{ padding: '10px 14px', color: '#fbbf24' }}>Index Type</th>
                  <th style={{ padding: '10px 14px', color: '#38bdf8' }}>MySQL Support</th>
                  <th style={{ padding: '10px 14px', color: '#818cf8' }}>PostgreSQL Support</th>
                  <th style={{ padding: '10px 14px', color: '#34d399' }}>Complexity</th>
                  <th style={{ padding: '10px 14px', color: '#f8fafc' }}>Optimal Use Case</th>
                </tr>
              </thead>
              <tbody>
                {ref.indexingMasterclass.typesTable.map((t, idx) => (
                  <tr key={idx} style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                  }}>
                    <td style={{ padding: '10px 14px', fontWeight: '800', color: '#ffffff' }}>{t.type}</td>
                    <td style={{ padding: '10px 14px', color: '#cbd5e1' }}>{t.mysql}</td>
                    <td style={{ padding: '10px 14px', color: '#cbd5e1' }}>{t.postgres}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#fbbf24', fontWeight: '700' }}>{t.complexity}</td>
                    <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{t.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 5.2 Sargability Bad vs Good Patterns */}
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fbbf24', marginBottom: '10px' }}>
              5.4 SARGability (Search Argument Ability) Rules
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {ref.indexingMasterclass.sargabilityCode.map((s, idx) => (
                <div key={idx} style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', padding: '6px 8px', borderRadius: '4px' }}>
                    ❌ BAD: {s.bad}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 8px', borderRadius: '4px' }}>
                    ✅ GOOD: {s.good}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: '1.4', marginTop: '2px' }}>
                    💡 {s.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 6: QUERY EXECUTION PIPELINE & RELATIONAL ALGEBRA
          ========================================================================= */}
      {(activeChapter === 'all' || activeChapter === '6') && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0' }}>
            6. Query Execution Pipeline & Relational Algebra
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 18px 0' }}>
            The 5 Pipeline Stages, Relational Algebra symbols, Logical SQL execution sequence, and JIT LLVM compilation.
          </p>

          {/* 5 Stages Stepper */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {ref.queryPipeline.stages.map((st) => (
              <div key={st.num} style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.07)'
              }}>
                <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#38bdf8', marginBottom: '4px' }}>
                  STAGE {st.num}
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#ffffff', marginBottom: '6px' }}>
                  {st.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: '1.4' }}>
                  {st.action}
                </div>
              </div>
            ))}
          </div>

          {/* Logical SQL Order Stepper */}
          <div style={{
            padding: '14px 18px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#fbbf24', marginBottom: '6px' }}>
              6.3 Logical SQL Clause Execution Sequence
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              padding: '6px 0',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: '#ffffff'
            }}>
              {ref.queryPipeline.logicalOrder.map((cl, idx) => (
                <React.Fragment key={idx}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    whiteSpace: 'nowrap'
                  }}>
                    {cl}
                  </span>
                  {idx < ref.queryPipeline.logicalOrder.length - 1 && (
                    <span style={{ color: '#fbbf24' }}>⟶</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#e2e8f0', marginTop: '6px' }}>
              💡 <strong>Key Rule:</strong> {ref.queryPipeline.logicalOrderRule}
            </div>
          </div>

          {/* Relational Algebra Table */}
          <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
                  <th style={{ padding: '8px 12px', color: '#fbbf24' }}>Symbol</th>
                  <th style={{ padding: '8px 12px', color: '#38bdf8' }}>Operator</th>
                  <th style={{ padding: '8px 12px', color: '#34d399' }}>SQL Equivalent</th>
                  <th style={{ padding: '8px 12px', color: '#f8fafc' }}>Algebraic Purpose</th>
                </tr>
              </thead>
              <tbody>
                {ref.queryPipeline.relationalAlgebraSymbols.map((s, idx) => (
                  <tr key={idx} style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                  }}>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: '#fbbf24', fontWeight: '800' }}>
                      {s.symbol}
                    </td>
                    <td style={{ padding: '8px 12px', fontWeight: '700', color: '#ffffff' }}>{s.name}</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{s.sql}</td>
                    <td style={{ padding: '8px 12px', color: '#94a3b8' }}>{s.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 7: PHYSICAL JOIN ALGORITHMS
          ========================================================================= */}
      {(activeChapter === 'all' || activeChapter === '7') && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0' }}>
            7. Physical Join Algorithms
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 18px 0' }}>
            How database engines execute logical joins via Nested Loop, Hash Join, or Sort-Merge Join.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {ref.physicalJoins.map((j, idx) => (
              <div key={idx} style={{
                padding: '18px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: '0.94rem', color: '#ffffff', fontWeight: '800' }}>
                    {j.name}
                  </h3>
                  <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontWeight: '700' }}>
                    {j.complexity}
                  </span>
                </div>

                <div style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: '#090d16',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: '#38bdf8',
                  lineHeight: '1.4',
                  whiteSpace: 'pre'
                }}>
                  {j.codeSnippet}
                </div>

                <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  <strong>Optimal Scenario:</strong> {j.optimalWhen}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 8: REPLICATION, PARTITIONING & SCALING TOPOLOGIES
          ========================================================================= */}
      {(activeChapter === 'all' || activeChapter === '8') && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0' }}>
            8. Replication, Partitioning & Scaling Topologies
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 18px 0' }}>
            Scale Up vs Scale Out, Declarative table partitioning, and high-availability topologies (Patroni vs Orchestrator).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#38bdf8', fontWeight: '800' }}>
                MySQL Replication & HA Topologies
              </h3>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <li><strong>Binary Log (binlog):</strong> Row-based (RBR) or Statement-based (SBR) replication.</li>
                <li><strong>Semisynchronous:</strong> Primary waits for at least one replica relay log ACK before commit return.</li>
                <li><strong>Group Replication / Galera:</strong> Paxos-based multi-primary consensus clustering.</li>
                <li><strong>Orchestrator:</strong> Standard tool for automated MySQL topology management and failover.</li>
              </ul>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(51, 103, 145, 0.08)', border: '1px solid rgba(51, 103, 145, 0.3)' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#818cf8', fontWeight: '800' }}>
                PostgreSQL Replication & HA Topologies
              </h3>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <li><strong>Streaming Replication:</strong> Physical byte-level WAL record streaming to standbys.</li>
                <li><strong>Synchronous Commit:</strong> Configured via <code>synchronous_commit = on</code> and standby priority.</li>
                <li><strong>Logical Replication:</strong> Publish/Subscribe model for cross-version upgrades & Kafka pipelines.</li>
                <li><strong>Patroni:</strong> Industry standard HA template using etcd/Consul for split-brain-proof failover.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 9: PRODUCTION PARAMETER TUNING REFERENCE
          ========================================================================= */}
      {(activeChapter === 'all' || activeChapter === '9') && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0' }}>
            9. Production Parameter Tuning Reference
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 18px 0' }}>
            Hardened configuration templates for production MySQL (<code>my.cnf</code>) and PostgreSQL (<code>postgresql.conf</code>) on NVMe SSD storage.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {/* MySQL my.cnf */}
            <div style={{
              borderRadius: '12px',
              background: '#090d16',
              border: '1px solid rgba(2, 132, 199, 0.35)',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(2, 132, 199, 0.15)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  📁 {ref.productionTuning.mysql.filename} (MySQL 8.x InnoDB)
                </span>
                <button
                  onClick={() => handleCopy(ref.productionTuning.mysql.configText, 'mysql_cnf')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '5px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {copiedKey === 'mysql_cnf' ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                  <span>{copiedKey === 'mysql_cnf' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre style={{
                margin: 0,
                padding: '14px',
                fontFamily: 'Consolas, monospace',
                fontSize: '0.74rem',
                color: '#38bdf8',
                lineHeight: '1.5',
                overflowX: 'auto'
              }}>
                {ref.productionTuning.mysql.configText}
              </pre>
            </div>

            {/* PostgreSQL postgresql.conf */}
            <div style={{
              borderRadius: '12px',
              background: '#090d16',
              border: '1px solid rgba(51, 103, 145, 0.35)',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(51, 103, 145, 0.15)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
                  📁 {ref.productionTuning.postgres.filename} (PostgreSQL 16.x)
                </span>
                <button
                  onClick={() => handleCopy(ref.productionTuning.postgres.configText, 'pg_conf')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '5px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {copiedKey === 'pg_conf' ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                  <span>{copiedKey === 'pg_conf' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre style={{
                margin: 0,
                padding: '14px',
                fontFamily: 'Consolas, monospace',
                fontSize: '0.74rem',
                color: '#818cf8',
                lineHeight: '1.5',
                overflowX: 'auto'
              }}>
                {ref.productionTuning.postgres.configText}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
