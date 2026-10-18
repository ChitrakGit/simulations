import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Zap,
  Activity,
  Layers,
  ArrowRight,
  Database,
  Lock,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { TRANSACTIONS_DATA } from '../../data/databaseData';

export default function TransactionsExplorer({ activeEngine = 'sql' }) {
  const [activeTab, setActiveTab] = useState(() => {
    if (activeEngine === 'postgres') return 'mvcc';
    return 'anomalies';
  });
  const [selectedAnomalyId, setSelectedAnomalyId] = useState('dirty_read');

  // Auto-switch to MVCC when PostgreSQL is active
  useEffect(() => {
    if (activeEngine === 'postgres') {
      setActiveTab('mvcc');
    } else {
      setActiveTab('anomalies');
    }
  }, [activeEngine]);

  // Timeline events for the 5 concurrency anomalies
  const anomalyTimelines = {
    dirty_read: {
      title: 'Dirty Read Simulation',
      desc: 'Tx1 reads uncommitted changes from Tx2. Tx2 then issues ROLLBACK, leaving Tx1 with corrupt ghost data.',
      steps: [
        { time: 'T1', tx1: 'BEGIN;', tx2: 'BEGIN;' },
        { time: 'T2', tx1: '...', tx2: 'UPDATE accounts SET balance = balance - 500 WHERE id = 1;' },
        { time: 'T3', tx1: 'SELECT balance FROM accounts WHERE id = 1; (Reads $500!)', tx2: '...' },
        { time: 'T4', tx1: '...', tx2: 'ROLLBACK; (Discards balance deduction!)' },
        { time: 'T5', tx1: 'COMMIT; (Tx1 acted on dirty data that never officially existed!)', tx2: 'IDLE' }
      ],
      prevention: 'Read Committed isolation level (PostgreSQL default) or higher prevents dirty reads by checking transaction commit status before returning tuples.'
    },
    non_repeatable_read: {
      title: 'Non-Repeatable Read Simulation',
      desc: 'Tx1 reads row X. Tx2 updates row X and COMMITS. Tx1 re-reads row X and observes a completely different value during the same transaction.',
      steps: [
        { time: 'T1', tx1: 'BEGIN;', tx2: 'BEGIN;' },
        { time: 'T2', tx1: 'SELECT balance FROM accounts WHERE id = 1; (Returns $1000)', tx2: '...' },
        { time: 'T3', tx1: '...', tx2: 'UPDATE accounts SET balance = $200 WHERE id = 1; COMMIT;' },
        { time: 'T4', tx1: 'SELECT balance FROM accounts WHERE id = 1; (Returns $200!)', tx2: 'IDLE' },
        { time: 'T5', tx1: 'COMMIT; (Inconsistent read inside the same transaction)', tx2: 'IDLE' }
      ],
      prevention: 'Repeatable Read isolation level pins a single snapshot for the duration of the entire transaction.'
    },
    phantom_read: {
      title: 'Phantom Read Simulation',
      desc: 'Tx1 executes a range query. Tx2 inserts a new row satisfying the predicate and COMMITS. Tx1 re-runs the range query and sees a new "phantom" row.',
      steps: [
        { time: 'T1', tx1: 'BEGIN;', tx2: 'BEGIN;' },
        { time: 'T2', tx1: 'SELECT COUNT(*) FROM users WHERE age > 30; (Returns 10)', tx2: '...' },
        { time: 'T3', tx1: '...', tx2: 'INSERT INTO users (name, age) VALUES ("Bob", 35); COMMIT;' },
        { time: 'T4', tx1: 'SELECT COUNT(*) FROM users WHERE age > 30; (Returns 11!)', tx2: 'IDLE' },
        { time: 'T5', tx1: 'COMMIT; (A phantom row appeared out of nowhere!)', tx2: 'IDLE' }
      ],
      prevention: 'Serializable isolation or Next-Key Gap Locks (MySQL InnoDB default Repeatable Read).'
    },
    lost_update: {
      title: 'Lost Update Simulation',
      desc: 'Two concurrent transactions read balance = $100. Both deduct $20 and write back $80, completely overwriting one deduction.',
      steps: [
        { time: 'T1', tx1: 'BEGIN; (Reads balance = $100)', tx2: 'BEGIN; (Reads balance = $100)' },
        { time: 'T2', tx1: 'Compute 100 - 20 = $80', tx2: 'Compute 100 - 20 = $80' },
        { time: 'T3', tx1: 'UPDATE accounts SET balance = 80 WHERE id = 1;', tx2: '...' },
        { time: 'T4', tx1: 'COMMIT;', tx2: 'UPDATE accounts SET balance = 80 WHERE id = 1; COMMIT;' },
        { time: 'T5', tx1: 'Final balance = $80! ($20 deduction was completely LOST!)', tx2: 'IDLE' }
      ],
      prevention: 'Pessimistic Locking (SELECT ... FOR UPDATE) or Optimistic Locking (WHERE version = 1).'
    },
    write_skew: {
      title: 'Write Skew Simulation',
      desc: 'Two doctors are on call. Hospital invariant requires at least 1 doctor on call. Both simultaneously request leave.',
      steps: [
        { time: 'T1', tx1: 'BEGIN (Dr. A)', tx2: 'BEGIN (Dr. B)' },
        { time: 'T2', tx1: 'SELECT COUNT(*) WHERE on_call = true; (Count = 2)', tx2: 'SELECT COUNT(*) WHERE on_call = true; (Count = 2)' },
        { time: 'T3', tx1: 'UPDATE doctors SET on_call = false WHERE id = "A";', tx2: 'UPDATE doctors SET on_call = false WHERE id = "B";' },
        { time: 'T4', tx1: 'COMMIT;', tx2: 'COMMIT;' },
        { time: 'T5', tx1: 'Both leave requests approved! Hospital has 0 doctors on call (VIOLATION)!', tx2: 'IDLE' }
      ],
      prevention: 'Serializable isolation level (PostgreSQL SSI detects read/write anti-dependencies and aborts one transaction).'
    }
  };

  const currentAnomaly = anomalyTimelines[selectedAnomalyId] || anomalyTimelines.dirty_read;

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
            background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={20} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
              8. Transactions, ACID, Isolation & WAL Durability
            </h2>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Interactive Concurrency Anomaly Simulators, 4 Isolation Levels, MVCC, and WAL Crash Recovery
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
            { id: 'anomalies', label: '5 Concurrency Anomalies' },
            { id: 'matrix', label: 'Isolation Levels Matrix' },
            { id: 'mvcc', label: 'MVCC vs 2PL Locking' },
            { id: 'wal', label: 'WAL & Crash Recovery' }
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
                background: activeTab === tab.id ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: 5 CONCURRENCY ANOMALIES SIMULATOR */}
      {activeTab === 'anomalies' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(360px, 1.8fr)',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Anomaly Selector List */}
          <div className="glass-panel" style={{
            padding: '18px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffffff', marginBottom: '6px' }}>
              Select Concurrency Anomaly:
            </div>
            {TRANSACTIONS_DATA.anomalies.map((ano) => {
              const isSelected = ano.id === selectedAnomalyId;
              return (
                <div
                  key={ano.id}
                  onClick={() => setSelectedAnomalyId(ano.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? '#f43f5e' : 'rgba(255, 255, 255, 0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: isSelected ? '#fda4af' : '#ffffff', marginBottom: '4px' }}>
                    {ano.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {ano.desc.slice(0, 55)}...
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline Animation Card */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(244, 63, 94, 0.3)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '6px', marginTop: 0 }}>
              {currentAnomaly.title}
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#fca5a5', lineHeight: '1.5', marginBottom: '18px' }}>
              {currentAnomaly.desc}
            </p>

            {/* Timeline Stepper Table */}
            <div style={{
              overflowX: 'auto',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '16px'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', textAlign: 'left' }}>
                <thead style={{ background: 'rgba(0, 0, 0, 0.5)', color: '#94a3b8' }}>
                  <tr>
                    <th style={{ padding: '8px 12px', width: '60px' }}>Time</th>
                    <th style={{ padding: '8px 12px' }}>Transaction 1</th>
                    <th style={{ padding: '8px 12px' }}>Transaction 2</th>
                  </tr>
                </thead>
                <tbody style={{ fontFamily: 'var(--font-mono)' }}>
                  {currentAnomaly.steps.map((st, i) => (
                    <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '8px 12px', color: '#fbbf24', fontWeight: '800' }}>{st.time}</td>
                      <td style={{ padding: '8px 12px', color: '#38bdf8' }}>{st.tx1}</td>
                      <td style={{ padding: '8px 12px', color: '#ec4899' }}>{st.tx2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: '0.78rem',
              color: '#34d399',
              lineHeight: '1.5'
            }}>
              <strong>How to Prevent:</strong> {currentAnomaly.prevention}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ISOLATION LEVELS MATRIX */}
      {activeTab === 'matrix' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            8.2 SQL Standard Isolation Levels Matrix
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Higher isolation guarantees absolute consistency at the expense of concurrent write throughput and lock contention.
          </p>

          <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
              <thead style={{ background: 'rgba(0, 0, 0, 0.5)', color: '#94a3b8' }}>
                <tr>
                  <th style={{ padding: '10px 14px' }}>Isolation Level</th>
                  <th style={{ padding: '10px 14px' }}>Dirty Read</th>
                  <th style={{ padding: '10px 14px' }}>Non-Repeatable Read</th>
                  <th style={{ padding: '10px 14px' }}>Phantom Read</th>
                  <th style={{ padding: '10px 14px' }}>Engine Default Notes</th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS_DATA.isolationMatrix.map((lvl, idx) => (
                  <tr key={idx} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: '800', color: '#ffffff' }}>{lvl.level}</td>
                    <td style={{ padding: '10px 14px', color: lvl.dirtyRead.includes('YES') ? '#ef4444' : '#10b981' }}>{lvl.dirtyRead}</td>
                    <td style={{ padding: '10px 14px', color: lvl.nonRepeatable.includes('YES') ? '#ef4444' : '#10b981' }}>{lvl.nonRepeatable}</td>
                    <td style={{ padding: '10px 14px', color: lvl.phantom.includes('YES') ? '#ef4444' : '#10b981' }}>{lvl.phantom}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{lvl.engines}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: MVCC VS 2PL */}
      {activeTab === 'mvcc' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            8.3 Multi-Version Concurrency Control (MVCC) vs Two-Phase Locking (2PL)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            In traditional locking databases, readers block writers and writers block readers. Modern MVCC systems decouple readers and writers entirely.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#34d399', marginBottom: '6px' }}>
                MVCC (PostgreSQL & MySQL InnoDB)
              </div>
              <p style={{ fontSize: '0.76rem', color: '#e2e8f0', lineHeight: '1.5', margin: 0 }}>
                {TRANSACTIONS_DATA.mvccVsLocking.mvcc}
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#fbbf24', marginBottom: '6px' }}>
                Strict Two-Phase Locking (2PL)
              </div>
              <p style={{ fontSize: '0.76rem', color: '#e2e8f0', lineHeight: '1.5', margin: 0 }}>
                {TRANSACTIONS_DATA.mvccVsLocking.locking}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: WAL & CRASH RECOVERY */}
      {activeTab === 'wal' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            8.4 Write-Ahead Logging (WAL) & Crash Recovery
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Durability is achieved by writing small, sequential redo log records to disk with <code style={{ color: '#38bdf8' }}>fsync()</code> before modifying random data pages in memory.
          </p>

          <div style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            color: '#fbbf24',
            lineHeight: '1.6'
          }}>
            1. Transaction modifies row -&gt; generates WAL record<br />
            2. WAL buffer flushed to NVMe disk via fsync() -&gt; Transaction returns COMMIT ACK to client<br />
            3. Modified dirty pages remain in RAM Buffer Pool<br />
            4. Checkpointer asynchronously writes dirty pages to disk tablespace<br />
            5. System Crash? -&gt; On restart, engine scans WAL from last checkpoint and REPLAYS all committed writes!
          </div>
        </div>
      )}
    </div>
  );
}
