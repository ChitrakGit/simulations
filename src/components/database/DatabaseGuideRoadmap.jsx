import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Layers,
  ArrowRight,
  Database,
  ExternalLink,
  Zap,
  Terminal,
  Cpu,
  ShieldCheck,
  Search
} from 'lucide-react';
import { FUNDAMENTALS_DATA } from '../../data/databaseData';

export default function DatabaseGuideRoadmap({ activeEngine = 'sql' }) {
  const [guideFilter, setGuideFilter] = useState('');

  const roadmapStages = [
    {
      stage: 'Stage 1: Foundations (Weeks 1–2)',
      color: '#38bdf8',
      topics: [
        'SQL Essentials: SELECT, JOIN (INNER, LEFT, RIGHT, FULL), GROUP BY, HAVING, subqueries, CTEs, window functions',
        'Keys & Constraints: Primary Key, Foreign Key, UNIQUE, CHECK constraints',
        'ER Modeling & Normalization: 1NF → 3NF lossless decomposition, functional dependencies'
      ]
    },
    {
      stage: 'Stage 2: Working Software Engineer (Weeks 3–6)',
      color: '#10b981',
      topics: [
        'Indexing: B-Tree / B+Tree structure, Leftmost Prefix Rule, Covering Indexes (INCLUDE), SARGable queries',
        'EXPLAIN & Plan Analysis: Reading costs, estimating rows vs actual rows, detecting accidental Seq Scans',
        'Transactions & ACID: Isolation levels (Read Committed, Repeatable Read, Serializable), concurrency anomalies',
        'Connection Pooling: HikariCP / psycopg_pool sizing, avoiding connection leaks, pool timeouts'
      ]
    },
    {
      stage: 'Stage 3: Performance & Internals (Months 1–2)',
      color: '#f59e0b',
      topics: [
        'Query Optimizer Internals: Relational algebra pushdown, dynamic programming vs GEQO, Cost-Based Optimizer (CBO)',
        'Storage Engine Architecture: B-Tree vs LSM-Tree (WiredTiger, RocksDB, InnoDB, Postgres Heap)',
        'Durability: Write-Ahead Logging (WAL), buffer pool dirty pages, checkpointing, MVCC vacuum & bloat',
        'Partitioning: Declarative Range & Hash partitioning, partition pruning, bulk archive operations'
      ]
    },
    {
      stage: 'Stage 4: Scale, Distributed Systems & Sharding (Ongoing)',
      color: '#a855f7',
      topics: [
        'Replication Topologies: Streaming replication, synchronous vs asynchronous, replication lag & read-your-writes',
        'Sharding: Range vs Hash vs Consistent Hashing rings, shard key selection, scatter-gather query overhead',
        'Distributed Transactions: Two-Phase Commit (2PC) vs Saga pattern',
        'CAP & PACELC Theorems, consensus algorithms (Raft / Paxos), NewSQL distributed databases (CockroachDB, Spanner)'
      ]
    }
  ];

  const recommendedResources = [
    {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      why: 'The gold standard industry reference for replication, partitioning, transactions, and distributed consensus.'
    },
    {
      title: 'Use The Index, Luke! (use-the-index-luke.com)',
      author: 'Markus Winand',
      why: 'Free, exceptional practical guide explaining B-Tree traversal, composite indexes, and SQL optimization.'
    },
    {
      title: 'CMU 15-445 / 645 Database Systems',
      author: 'Prof. Andy Pavlo (Carnegie Mellon)',
      why: 'Full university course on YouTube covering buffer pool managers, B-Trees, Volcano iterator model, and crash recovery.'
    },
    {
      title: 'The Art of PostgreSQL / High Performance MySQL',
      author: 'Dimitri Fontaine / Baron Schwartz',
      why: 'In-depth production tuning, EXPLAIN plan diagnostics, and hardware configuration recipes.'
    }
  ];

  const practiceIdeas = [
    '1. Take an unnormalized CSV order export and design a clean 3NF relational schema with constraints.',
    '2. Run EXPLAIN (ANALYZE, BUFFERS) on a 5-table join; draw the physical operator tree by hand.',
    '3. Compare performance of 10M rows between Seq Scan, B-Tree, BRIN, and Covering indexes.',
    '4. Set up PostgreSQL primary + streaming replica; simulate network lag and observe read-your-writes.',
    '5. Place PgBouncer in front of PostgreSQL and benchmark throughput under 1,000 simulated connections.',
    '6. Implement consistent hashing with virtual nodes in Python/JavaScript to distribute keys across 4 shards.'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Database Fundamentals Summary Table */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
          1. Database Fundamentals: DBMS Models & ACID
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
          Overview of primary database classifications and mathematical ACID transaction properties.
        </p>

        {/* ACID Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {FUNDAMENTALS_DATA.overview.acid.map((a) => (
            <div
              key={a.letter}
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {a.letter}
                </span>
                <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#ffffff' }}>
                  {a.name}
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 6px 0' }}>
                {a.desc}
              </p>
              <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                {a.tech}
              </div>
            </div>
          ))}
        </div>

        {/* DBMS Types Table */}
        <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0, 0, 0, 0.5)', color: '#94a3b8' }}>
              <tr>
                <th style={{ padding: '8px 12px' }}>Database Type</th>
                <th style={{ padding: '8px 12px' }}>Examples</th>
                <th style={{ padding: '8px 12px' }}>Data Model</th>
                <th style={{ padding: '8px 12px' }}>Ideal Production Use Case</th>
              </tr>
            </thead>
            <tbody>
              {FUNDAMENTALS_DATA.overview.dbmsTypes.map((t, i) => (
                <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '8px 12px', fontWeight: '700', color: '#ffffff' }}>{t.type}</td>
                  <td style={{ padding: '8px 12px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{t.examples}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-dim)' }}>{t.dataModel}</td>
                  <td style={{ padding: '8px 12px', color: '#e2e8f0' }}>{t.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. 4-Stage Learning Roadmap */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
          9.3 Systems Engineer Database Learning Roadmap
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
          Step-by-step curriculum taking an engineer from syntax proficiency to high-throughput distributed database internals.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {roadmapStages.map((st, i) => (
            <div
              key={i}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: `1px solid ${st.color}35`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: '800', color: st.color }}>
                  {st.stage}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#e2e8f0', lineHeight: '1.6' }}>
                {st.topics.map((top, idx) => (
                  <li key={idx}>{top}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recommended Resources & Practice Ideas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Recommended Books & Courses */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', marginBottom: '12px', marginTop: 0 }}>
            9.4 Recommended Authoritative Resources
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recommendedResources.map((res, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#38bdf8' }}>
                  {res.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '3px' }}>
                  By {res.author}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {res.why}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7 Practice Ideas */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', marginBottom: '12px', marginTop: 0 }}>
            9.5 Hands-On Engineering Practice Ideas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {practiceIdeas.map((idea, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  fontSize: '0.76rem',
                  color: '#e2e8f0',
                  lineHeight: '1.4'
                }}
              >
                {idea}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
