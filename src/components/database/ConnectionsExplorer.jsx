import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Server
} from 'lucide-react';
import { CONNECTIONS_DATA } from '../../data/databaseData';

export default function ConnectionsExplorer({ activeEngine = 'sql' }) {
  const [activeTab, setActiveTab] = useState(() => {
    if (activeEngine === 'postgres') return 'poolers';
    return 'lifecycle';
  });
  const [cpuCores, setCpuCores] = useState(8);
  const [spindles, setSpindles] = useState(1); // 1 for NVMe SSD
  const [selectedLanguage, setSelectedLanguage] = useState('python'); // 'python' | 'node' | 'java'

  // Auto-switch to poolers (PgBouncer) when PostgreSQL is active
  useEffect(() => {
    if (activeEngine === 'postgres') {
      setActiveTab('poolers');
    } else {
      setActiveTab('lifecycle');
    }
  }, [activeEngine]);

  // HikariCP / PostgreSQL pool sizing formula
  const calculatedPoolSize = Math.max(2, (cpuCores * 2) + spindles);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={20} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
              3. Database Engine Connections & Pooling
            </h2>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Wire Protocol Lifecycle, Concurrency Models, Pool Sizing Calculator, and PgBouncer Architecture
            </p>
          </div>
        </div>

        {/* Subtabs switcher */}
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '4px',
          borderRadius: '10px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'lifecycle', label: 'Connection Lifecycle' },
            { id: 'calculator', label: 'Pool Sizing Calculator' },
            { id: 'code', label: 'Driver Code Samples' },
            { id: 'poolers', label: 'PgBouncer & Proxies' },
            { id: 'troubleshoot', label: 'Troubleshooting & Errors' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: activeTab === tab.id ? '700' : '500',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: CONNECTION LIFECYCLE */}
      {activeTab === 'lifecycle' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(340px, 1.8fr)',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Lifecycle Steps */}
          <div className="glass-panel" style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
              7-Stage Connection Lifecycle:
            </div>
            {CONNECTIONS_DATA.lifecycle.map((st) => (
              <div
                key={st.step}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#38bdf8' }}>
                    {st.step}. {st.title}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {st.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Concurrency Models Comparison */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
              Server Concurrency Architecture Models
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              How database servers manage thousands of concurrent client requests:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {CONNECTIONS_DATA.concurrencyModels.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#fbbf24' }}>
                      {item.engine}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                      {item.memoryPerConn} / conn
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#e2e8f0', marginBottom: '4px' }}>
                    <strong>Model:</strong> {item.model}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    💡 {item.takeaway}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: POOL SIZING CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            3.4 Connection Pool Sizing Interactive Calculator
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Formula established by HikariCP & PostgreSQL performance benchmarks: <code style={{ color: '#38bdf8' }}>pool_size ≈ (core_count × 2) + effective_spindle_count</code>
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1fr) minmax(300px, 1fr)',
            gap: '24px',
            alignItems: 'center'
          }}>
            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  Database Host CPU Cores: <strong>{cpuCores} Cores</strong>
                </label>
                <input
                  type="range"
                  min="2"
                  max="64"
                  step="2"
                  value={cpuCores}
                  onChange={(e) => setCpuCores(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  Effective Storage Spindles / Disks: <strong>{spindles} (NVMe / SSD)</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="16"
                  step="1"
                  value={spindles}
                  onChange={(e) => setSpindles(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                ⚠️ <strong>Total Connections Alert:</strong> Total database load equals <code style={{ color: '#fbbf24' }}>pool_size × app_instances</code>. If you run 20 microservice pods with a pool of 50 each, you are opening 1,000 connections, crashing the server!
              </div>
            </div>

            {/* Calculated Output Card */}
            <div style={{
              padding: '24px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                Recommended Max Pool Size
              </div>
              <div style={{
                fontSize: '3.2rem',
                fontWeight: '900',
                color: '#38bdf8',
                lineHeight: '1',
                marginBottom: '10px'
              }}>
                {calculatedPoolSize}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: '600' }}>
                Optimal Steady Connections per App Instance
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                Maximizes CPU throughput without context-switch trashing.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: DRIVER CODE SAMPLES */}
      {activeTab === 'code' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                3.3 Production Connection Pooling Code
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Production-tested connection snippets with timeouts and parameterization
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '8px' }}>
              {['python', 'node', 'java'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    fontWeight: selectedLanguage === lang ? '700' : '500',
                    color: selectedLanguage === lang ? '#ffffff' : 'var(--text-muted)',
                    background: selectedLanguage === lang ? '#0284c7' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  {lang === 'python' ? 'Python (psycopg 3)' : lang === 'node' ? 'Node.js (pg)' : 'Java (HikariCP)'}
                </button>
              ))}
            </div>
          </div>

          <pre style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: '#a7f3d0',
            lineHeight: '1.6',
            overflowX: 'auto',
            margin: 0
          }}>
            {CONNECTIONS_DATA.codeSamples[selectedLanguage]}
          </pre>
        </div>
      )}

      {/* VIEW 4: PGBOUNCER & PROXIES */}
      {activeTab === 'poolers' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            External Connection Poolers & Proxies (PgBouncer, ProxySQL, RDS Proxy)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            External poolers act as a lightweight facade in front of the database, multiplexing thousands of client connections into a tiny, controlled set of backend workers.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {CONNECTIONS_DATA.pgBouncerModes.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}
              >
                <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#38bdf8', marginBottom: '6px' }}>
                  {m.mode}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#e2e8f0', marginBottom: '8px' }}>
                  {m.behavior}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  ⚠️ {m.tradeoff}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 5: TROUBLESHOOTING & COMMON ERRORS */}
      {activeTab === 'troubleshoot' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            3.7 Common Database Connection Errors & Production Fixes
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Diagnostics and immediate remediation strategies for frequent production incidents:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              {
                err: 'FATAL: sorry, too many clients already',
                cause: 'Number of open app connections exceeded server max_connections.',
                fix: 'Deploy PgBouncer / RDS Proxy in transaction mode, or reduce min/max pool sizes across app instances.'
              },
              {
                err: 'Connection refused / broken pipe',
                cause: 'Cloud load balancer or stateful firewall terminated idle TCP connection after 300 seconds.',
                fix: 'Enable TCP keepalives (tcp_keepalives_idle = 60) and configure pool_recycle = 1800 in your driver.'
              },
              {
                err: 'Connection pool timeout / exhaustion',
                cause: 'Application connection leak: a query was executed but connection was not closed in a finally block.',
                fix: 'Audit ORM usage; ensure try-with-resources or Python context managers wrap every single checkout.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(239, 68, 68, 0.25)'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#f87171', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                  {item.err}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <strong>Likely Cause:</strong> {item.cause}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#34d399' }}>
                  <strong>Remediation:</strong> {item.fix}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
