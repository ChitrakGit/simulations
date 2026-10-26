import React, { useState } from 'react';
import {
  Database,
  BookOpen,
  Milestone,
  CheckCircle2,
  Sparkles,
  Key,
  Compass,
  Terminal,
  Activity,
  Copy,
  Check
} from 'lucide-react';
import { FUNDAMENTALS_DATA, DATABASE_ARCHITECTURE_REFERENCE } from '../../data/databaseData';

export default function DatabaseGuideRoadmap({ activeEngine = 'sql' }) {
  // Active sub-tab within Roadmap & Fundamentals: 'all' | 'fundamentals' | 'roadmap' | 'troubleshoot' | 'resources'
  const [activeSection, setActiveSection] = useState('all');
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [copiedConfig, setCopiedConfig] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedConfig(key);
    setTimeout(() => setCopiedConfig(null), 2000);
  };

  const toggleTopic = (id) => {
    setCompletedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const roadmapStages = [
    {
      id: 'stage-1',
      stage: 'Stage 1: Foundations (Weeks 1–2)',
      duration: '2 Weeks • Core Fundamentals',
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.12)',
      borderColor: 'rgba(56, 189, 248, 0.35)',
      description: 'Master relational data modeling, ANSI SQL expressive grammar, and mathematical normalization.',
      topics: [
        { id: 's1-1', text: 'SQL Essentials: SELECT, JOIN (INNER, LEFT, RIGHT, FULL), GROUP BY, HAVING, subqueries, CTEs, window functions' },
        { id: 's1-2', text: 'Keys & Constraints: Primary Key, Foreign Key, UNIQUE, CHECK constraints, composite identifiers' },
        { id: 's1-3', text: 'ER Modeling & Normalization: 1NF → 3NF lossless decomposition, functional dependencies, avoiding insertion/update anomalies' }
      ]
    },
    {
      id: 'stage-2',
      stage: 'Stage 2: Working Software Engineer (Weeks 3–6)',
      duration: '4 Weeks • Production Engineering',
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.12)',
      borderColor: 'rgba(16, 185, 129, 0.35)',
      description: 'Optimize queries for millisecond latency, prevent concurrency bugs, and master connection lifecycle.',
      topics: [
        { id: 's2-1', text: 'Indexing: B-Tree / B+Tree structure, Leftmost Prefix Rule, Covering Indexes (INCLUDE), SARGable WHERE predicates' },
        { id: 's2-2', text: 'EXPLAIN & Plan Analysis: Reading costs, estimating rows vs actual rows, detecting accidental sequential scans' },
        { id: 's2-3', text: 'Transactions & ACID: Isolation levels (Read Committed, Repeatable Read, Serializable), concurrency anomalies (dirty/non-repeatable/phantom reads)' },
        { id: 's2-4', text: 'Connection Pooling: HikariCP / PgBouncer / MongoClient sizing, thread exhaustion prevention, pool timeouts' }
      ]
    },
    {
      id: 'stage-3',
      stage: 'Stage 3: Performance & Internals (Months 1–2)',
      duration: '8 Weeks • Systems Internals',
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.12)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
      description: 'Understand how database engines compile queries, flush dirty pages, manage MVCC snapshots, and guarantee durability.',
      topics: [
        { id: 's3-1', text: 'Query Optimizer Internals: Relational algebra pushdown, dynamic programming vs GEQO, Cost-Based Optimizer (CBO) statistics' },
        { id: 's3-2', text: 'Storage Engine Architecture: B-Tree vs LSM-Tree (WiredTiger, RocksDB, InnoDB, PostgreSQL Heap buffers)' },
        { id: 's3-3', text: 'Durability & WAL: Write-Ahead Logging, buffer pool dirty pages, checkpointing, MVCC vacuum & table bloat cleanup' },
        { id: 's3-4', text: 'Partitioning: Declarative Range & Hash partitioning, partition pruning, bulk archive operations' }
      ]
    },
    {
      id: 'stage-4',
      stage: 'Stage 4: Scale, Distributed Systems & Sharding (Ongoing)',
      duration: 'Ongoing • Architect / Staff Level',
      color: '#a855f7',
      bgGlow: 'rgba(168, 85, 247, 0.12)',
      borderColor: 'rgba(168, 85, 247, 0.35)',
      description: 'Design planet-scale architectures using replication, sharding topologies, distributed consensus, and NewSQL.',
      topics: [
        { id: 's4-1', text: 'Replication Topologies: Streaming replication, synchronous vs asynchronous, replication lag & read-your-writes guarantees' },
        { id: 's4-2', text: 'Sharding Topologies: Range vs Hash vs Consistent Hashing rings, shard key selection, scatter-gather query overhead' },
        { id: 's4-3', text: 'Distributed Transactions: Two-Phase Commit (2PC) vs Saga pattern, compensations, distributed deadlocks' },
        { id: 's4-4', text: 'CAP & PACELC Theorems, consensus algorithms (Raft / Paxos), NewSQL distributed databases (CockroachDB, Google Spanner)' }
      ]
    }
  ];

  const troubleshootingDecisionTree = [
    {
      symptom: 'Slow Query Latency (> 500ms)',
      badge: 'Latency Issue',
      color: '#ef4444',
      steps: [
        'Run EXPLAIN (ANALYZE, BUFFERS) or explain("executionStats") to inspect actual physical operators.',
        'Check for Sequential Scans (Seq Scan / COLLSCAN) on high-cardinality tables. Add a B-Tree / Compound Index on filtered and joined columns.',
        'Verify Leftmost Prefix Rule compliance: query filters must match the order of columns in composite indexes.',
        'Check "Rows Removed by Filter": if high, add selective filter columns to the index or use a Covering Index (INCLUDE).',
        'Check row estimation errors: if estimated rows << actual rows, run ANALYZE to update database catalog histogram statistics.'
      ]
    },
    {
      symptom: 'Database CPU or RAM at 100% Saturation',
      badge: 'Resource Starvation',
      color: '#f59e0b',
      steps: [
        'Check active connection count: If connections > 500, CPU spends time context switching. Deploy PgBouncer or proxy pool sized to ~2x CPU cores + spindle count.',
        'Check for missing memory limits: Ensure PostgreSQL work_mem or MySQL innodb_buffer_pool_size is appropriately sized to avoid disk-spilling temp files.',
        'Check read vs write ratio: If 90%+ reads, introduce Redis Cache-Aside or read replicas with replica load balancing.',
        'Check unbounded queries: Verify all SELECT statements enforce LIMIT/pagination to prevent multi-gigabyte memory buffering.'
      ]
    },
    {
      symptom: 'Storage Bloat & Replication Lag',
      badge: 'Maintenance & Replication',
      color: '#38bdf8',
      steps: [
        'PostgreSQL table bloat: Run VACUUM (VERBOSE, ANALYZE) or pg_repack to reclaim dead tuple disk space without exclusive locks.',
        'Replication lag growing: Check replica disk IOPS, network throughput, and whether long-running queries on replica hold snapshots blocking WAL apply.',
        'Single node storage > 5 TB: Implement declarative range partitioning (e.g. partition by month/tenant) or shard horizontally with Consistent Hashing.'
      ]
    }
  ];

  const recommendedResources = [
    {
      title: 'Designing Data-Intensive Applications (DDIA)',
      author: 'Martin Kleppmann',
      badge: 'Must Read Book',
      color: '#a855f7',
      why: 'The gold standard industry reference for replication, partitioning, transactions, consensus protocols, and stream processing.'
    },
    {
      title: 'Use The Index, Luke! (use-the-index-luke.com)',
      author: 'Markus Winand',
      badge: 'Free Web Guide',
      color: '#38bdf8',
      why: 'Free, exceptional practical guide explaining B-Tree traversal, composite indexes, and SQL optimization across Oracle, PostgreSQL, MySQL, and SQL Server.'
    },
    {
      title: 'CMU 15-445 / 645 Database Systems Internals',
      author: 'Prof. Andy Pavlo (Carnegie Mellon)',
      badge: 'Full Course on YouTube',
      color: '#10b981',
      why: 'Full university lecture series covering buffer pool managers, B-Trees, Volcano iterator model, MVCC, and crash recovery with practical C++ labs.'
    },
    {
      title: 'The Art of PostgreSQL / High Performance MySQL',
      author: 'Dimitri Fontaine / Baron Schwartz',
      badge: 'Production Guide',
      color: '#f59e0b',
      why: 'In-depth production tuning, EXPLAIN plan diagnostics, hardware sizing recipes, and zero-downtime schema migration strategies.'
    }
  ];

  const practiceIdeas = [
    {
      id: 1,
      title: 'Lossless 3NF Schema Decomposition',
      desc: 'Take an unnormalized CSV order export with duplicated buyer and warehouse fields, design a clean 3NF relational schema with foreign key constraints.'
    },
    {
      id: 2,
      title: 'EXPLAIN Physical Operator Tree Analysis',
      desc: 'Run EXPLAIN (ANALYZE, BUFFERS) on a 5-table join; draw the physical operator tree (Nested Loop vs Hash Join vs Merge Join) by hand and optimize work_mem.'
    },
    {
      id: 3,
      title: 'Covering Index vs Heap Fetch Benchmark',
      desc: 'Populate a table with 10M rows. Compare latency between Seq Scan, regular B-Tree, and a Covering Index using the INCLUDE clause to eliminate table heap fetches.'
    },
    {
      id: 4,
      title: 'PostgreSQL Streaming Replica & Replication Lag',
      desc: 'Spin up a primary and streaming replica with Docker. Artificially throttle replica network latency and demonstrate the read-your-writes inconsistency anomaly.'
    },
    {
      id: 5,
      title: 'Connection Pool Sizing Benchmark',
      desc: 'Place PgBouncer in front of PostgreSQL. Benchmark request throughput with 1,000 simulated client connections at pool sizes of 10, 50, and 500.'
    },
    {
      id: 6,
      title: 'Consistent Hashing Ring Implementation',
      desc: 'Implement a consistent hashing ring with 100 virtual nodes per server in JavaScript/Python to evenly balance 100,000 keys across 4 simulated database shards.'
    }
  ];

  // Engine contextual banner
  const engineTips = {
    sql: {
      name: 'SQL (Standard / MySQL InnoDB)',
      tip: 'Focus on Clustered Index (B+Tree primary key), InnoDB Buffer Pool sizing, and Undo Log rollback segments.',
      color: '#0284c7'
    },
    postgres: {
      name: 'PostgreSQL 16 Engine',
      tip: 'Focus on MVCC xmin/xmax tuple headers, Autovacuum tuning, BRIN indexes for big append-only data, and PgBouncer connection pooling.',
      color: '#2563eb'
    },
    mongodb: {
      name: 'MongoDB WiredTiger Engine',
      tip: 'Focus on WiredTiger cache eviction, Document embedding vs referencing, writeConcern (w:majority), and Shard Key cardinality.',
      color: '#059669'
    }
  };

  const currentEngineTip = engineTips[activeEngine] || engineTips.sql;

  // Calculate total roadmap progress
  const allTopicCount = roadmapStages.reduce((sum, s) => sum + s.topics.length, 0);
  const progressPercent = Math.round((completedTopics.size / allTopicCount) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 0. Top Hero Header */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient Glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                fontWeight: '800',
                padding: '3px 10px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.18)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                <Milestone size={12} />
                Chapters 1 & 9 Guide
              </span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '6px',
                background: `${currentEngineTip.color}25`,
                color: '#ffffff',
                border: `1px solid ${currentEngineTip.color}55`
              }}>
                Target Engine: {currentEngineTip.name}
              </span>
            </div>

            <h2 style={{
              fontSize: '1.45rem',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em'
            }}>
              Database Fundamentals & Systems Engineering Roadmap
            </h2>
            <p style={{
              fontSize: '0.85rem',
              color: '#cbd5e1',
              maxWidth: '820px',
              lineHeight: '1.55',
              margin: 0
            }}>
              Consolidated curriculum combining core DBMS models, mathematical ACID transaction guarantees, relational keys, an actionable 4-stage engineer mastery path, production troubleshooting decision matrices, and authoritative references.
            </p>
          </div>

          {/* Progress Widget */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px 18px',
            borderRadius: '12px',
            minWidth: '180px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Curriculum Track
              </span>
              <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: '800' }}>
                {progressPercent}%
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)',
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '5px' }}>
              {completedTopics.size} of {allTopicCount} topics checked
            </div>
          </div>
        </div>

        {/* Engine Pro Tip Callout */}
        <div style={{
          marginTop: '16px',
          padding: '10px 14px',
          borderRadius: '10px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderLeft: `4px solid ${currentEngineTip.color}`,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.78rem',
          color: '#e2e8f0'
        }}>
          <Sparkles size={16} color={currentEngineTip.color} style={{ flexShrink: 0 }} />
          <span>
            <strong style={{ color: '#ffffff' }}>{currentEngineTip.name} Focus Tip:</strong> {currentEngineTip.tip}
          </span>
        </div>

        {/* Navigation Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '18px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'all', label: 'Complete Overview' },
            { id: 'fundamentals', label: '1. Fundamentals & ACID' },
            { id: 'keys', label: '1.3 Relational Keys' },
            { id: 'roadmap', label: '9.3 4-Stage Roadmap' },
            { id: 'troubleshoot', label: 'Troubleshooting Tree' },
            { id: 'tuning', label: '9. Production Tuning (my.cnf & postgresql.conf)' },
            { id: 'resources', label: 'Resources & Practice' }
          ].map((tab) => {
            const isSelected = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.76rem',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: DATABASE FUNDAMENTALS, ACID & DBMS MODELS */}
      {(activeSection === 'all' || activeSection === 'fundamentals') && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Database size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              1. Database Fundamentals: DBMS Classifications & ACID Guarantees
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            {FUNDAMENTALS_DATA?.overview?.summary || 'A database is an organized collection of data managed by DBMS software.'}
          </p>

          {/* ACID Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
            marginBottom: '22px'
          }}>
            {FUNDAMENTALS_DATA?.overview?.acid?.map((a) => (
              <div
                key={a.letter}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                    color: '#ffffff',
                    fontWeight: '900',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(56, 189, 248, 0.35)'
                  }}>
                    {a.letter}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ffffff' }}>
                      {a.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      ACID Property
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.45', margin: 0 }}>
                  {a.desc}
                </p>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#94a3b8',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono, monospace)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  marginTop: 'auto'
                }}>
                  <strong style={{ color: '#38bdf8' }}>Engine:</strong> {a.tech}
                </div>
              </div>
            ))}
          </div>

          {/* DBMS Types Comparison Table */}
          <div style={{
            overflowX: 'auto',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.25)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
              <thead style={{ background: 'rgba(0, 0, 0, 0.6)', color: '#94a3b8' }}>
                <tr>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>DBMS Category</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>Notable Engines</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>Data Model</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>Core Strengths</th>
                  <th style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>Ideal Production Use Case</th>
                </tr>
              </thead>
              <tbody>
                {FUNDAMENTALS_DATA?.overview?.dbmsTypes?.map((t, i) => (
                  <tr
                    key={i}
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      background: i % 2 === 1 ? 'rgba(255, 255, 255, 0.015)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '10px 14px', fontWeight: '700', color: '#ffffff' }}>
                      {t.type}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#38bdf8', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem' }}>
                      {t.examples}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#cbd5e1' }}>
                      {t.dataModel}
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-dim)', fontSize: '0.74rem' }}>
                      {t.strengths}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#e2e8f0', fontWeight: '500' }}>
                      {t.bestFor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 1.3: RELATIONAL KEYS */}
      {(activeSection === 'all' || activeSection === 'keys' || activeSection === 'fundamentals') && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Key size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              1.3 Essential Relational Key Concepts
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Relational databases rely on mathematical candidate keys to uniquely identify tuples and guarantee referential integrity across schemas.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '12px'
          }}>
            {FUNDAMENTALS_DATA?.overview?.relationalKeys?.map((k, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#fbbf24' }}>
                  {k.term}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#e2e8f0', lineHeight: '1.45' }}>
                  {k.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: 4-STAGE LEARNING ROADMAP */}
      {(activeSection === 'all' || activeSection === 'roadmap') && (
        <div className="glass-panel" style={{
          padding: '26px',
          borderRadius: '18px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} color="#a855f7" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                9.3 Systems Engineer Database Learning Roadmap
              </h3>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              Click any milestone checkbox to track your progress
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Structured 4-stage engineering curriculum taking you from ANSI SQL queries to high-throughput distributed database internals and consensus protocols.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {roadmapStages.map((st) => (
              <div
                key={st.id}
                style={{
                  padding: '20px',
                  borderRadius: '14px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: `1px solid ${st.borderColor}`,
                  boxShadow: `0 4px 20px ${st.bgGlow}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: st.color,
                      boxShadow: `0 0 8px ${st.color}`
                    }} />
                    <span style={{ fontSize: '0.98rem', fontWeight: '800', color: st.color }}>
                      {st.stage}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: `${st.color}20`,
                    color: st.color,
                    border: `1px solid ${st.color}40`
                  }}>
                    {st.duration}
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                  {st.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {st.topics.map((top) => {
                    const isChecked = completedTopics.has(top.id);
                    return (
                      <div
                        key={top.id}
                        onClick={() => toggleTopic(top.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: isChecked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                          border: isChecked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '5px',
                          border: isChecked ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.3)',
                          background: isChecked ? '#10b981' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          {isChecked && <CheckCircle2 size={13} color="#ffffff" />}
                        </div>
                        <span style={{
                          fontSize: '0.78rem',
                          color: isChecked ? '#a7f3d0' : '#e2e8f0',
                          lineHeight: '1.45',
                          textDecoration: isChecked ? 'line-through' : 'none',
                          opacity: isChecked ? 0.85 : 1
                        }}>
                          {top.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: PRODUCTION TROUBLESHOOTING DECISION TREE */}
      {(activeSection === 'all' || activeSection === 'troubleshoot') && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Activity size={20} color="#ef4444" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              15.1 Production Database Troubleshooting Decision Tree
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Systematic diagnosis workflows for production incidents: slow queries, resource exhaustion, and storage/replication bloat.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {troubleshootingDecisionTree.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: `1px solid ${item.color}35`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ffffff' }}>
                    {item.symptom}
                  </div>
                  <span style={{
                    fontSize: '0.64rem',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: `${item.color}25`,
                    color: item.color,
                    border: `1px solid ${item.color}50`
                  }}>
                    {item.badge}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {item.steps.map((st, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        color: item.color,
                        fontFamily: 'var(--font-mono, monospace)',
                        marginTop: '1px'
                      }}>
                        {i + 1}.
                      </span>
                      <span style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.45' }}>
                        {st}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: RECOMMENDED RESOURCES & HANDS-ON PRACTICE */}
      {(activeSection === 'all' || activeSection === 'resources') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {/* Authoritative Books & Courses */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <BookOpen size={18} color="#a855f7" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                9.4 Recommended Authoritative Resources
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendedResources.map((res, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: '800', color: res.color }}>
                      {res.title}
                    </div>
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: `${res.color}20`,
                      color: res.color,
                      border: `1px solid ${res.color}40`
                    }}>
                      {res.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '5px' }}>
                    By {res.author}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                    {res.why}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hands-On Practice Ideas */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Terminal size={18} color="#10b981" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                9.5 Hands-On Engineering Practice Labs
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {practiceIdeas.map((idea) => (
                <div
                  key={idea.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#34d399', marginBottom: '4px' }}>
                    Lab {idea.id}: {idea.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                    {idea.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: PRODUCTION PARAMETER TUNING REFERENCE (From doc/database_architecture_reference.md) */}
      {(activeSection === 'all' || activeSection === 'tuning') && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0' }}>
                9. Production Parameter Tuning Reference
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Hardened production server configuration templates for NVMe SSD storage from Section 9 of the Database Reference.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
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
                  📁 my.cnf (MySQL 8.x InnoDB)
                </span>
                <button
                  onClick={() => handleCopy(DATABASE_ARCHITECTURE_REFERENCE.productionTuning.mysql.configText, 'mysql_cnf_guide')}
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
                  {copiedConfig === 'mysql_cnf_guide' ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                  <span>{copiedConfig === 'mysql_cnf_guide' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre style={{
                margin: 0,
                padding: '14px',
                fontFamily: 'Consolas, monospace',
                fontSize: '0.72rem',
                color: '#38bdf8',
                lineHeight: '1.5',
                overflowX: 'auto'
              }}>
                {DATABASE_ARCHITECTURE_REFERENCE.productionTuning.mysql.configText}
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
                  📁 postgresql.conf (PostgreSQL 16.x)
                </span>
                <button
                  onClick={() => handleCopy(DATABASE_ARCHITECTURE_REFERENCE.productionTuning.postgres.configText, 'pg_conf_guide')}
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
                  {copiedConfig === 'pg_conf_guide' ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                  <span>{copiedConfig === 'pg_conf_guide' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre style={{
                margin: 0,
                padding: '14px',
                fontFamily: 'Consolas, monospace',
                fontSize: '0.72rem',
                color: '#818cf8',
                lineHeight: '1.5',
                overflowX: 'auto'
              }}>
                {DATABASE_ARCHITECTURE_REFERENCE.productionTuning.postgres.configText}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
