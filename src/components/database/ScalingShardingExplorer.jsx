import React, { useState } from 'react';
import {
  Boxes,
  Database
} from 'lucide-react';
import { SCALING_SHARDING_DATA } from '../../data/databaseData';

export default function ScalingShardingExplorer({ activeEngine = 'sql' }) {
  const [activeSubtab, setActiveSubtab] = useState('strategies'); // 'strategies' | 'roadmap' | 'ring' | 'key_eval' | 'cap'
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState(2); // Consistent hashing default
  const [selectedShardKeyCandidate, setSelectedShardKeyCandidate] = useState('user_id');

  // Ring simulation state
  const [nodeCount, setNodeCount] = useState(3);

  const activeStrat = SCALING_SHARDING_DATA.shardingStrategies[selectedStrategyIndex];

  // Shard Key Candidates evaluation
  const shardKeyEvals = {
    user_id: {
      name: 'user_id (e.g. B2C / Social App)',
      cardinality: 'High (Millions)',
      distribution: 'Uniform (Hash)',
      queryLocality: 'High (95% queries specify user_id)',
      verdict: 'EXCELLENT SHARD KEY',
      color: '#10b981',
      details: 'Co-locates all user activities on a single shard. Minimal scatter-gather.'
    },
    tenant_id: {
      name: 'tenant_id (B2B SaaS Multi-Tenant)',
      cardinality: 'Moderate to High',
      distribution: 'Risk of "Whale" Tenants',
      queryLocality: '100% queries scoped to tenant',
      verdict: 'STRONG SHARD KEY (Watch Skew)',
      color: '#38bdf8',
      details: 'Ensures full customer isolation. Large corporate tenants may require dedicated shards.'
    },
    created_at: {
      name: 'created_at (Timestamp alone)',
      cardinality: 'Very High',
      distribution: 'Severe Monotonic Skew!',
      queryLocality: 'Good for date ranges only',
      verdict: 'POOR SHARD KEY (Hotspot Alert)',
      color: '#ef4444',
      details: '100% of current INSERT writes hit the latest active shard! Use range partitioning on single server instead, or combine as (tenant_id, created_at).'
    },
    country: {
      name: 'country / region',
      cardinality: 'Low (~200 countries)',
      distribution: 'Massive Skew (US/India heavy)',
      queryLocality: 'Moderate',
      verdict: 'UNSUITABLE AS SOLE KEY',
      color: '#f59e0b',
      details: 'Low cardinality causes shards to grow unevenly. Suitable only for geo-partitioned data sovereignty.'
    }
  };

  const activeKeyEval = shardKeyEvals[selectedShardKeyCandidate];

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
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Boxes size={20} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
              5 & 6. Scaling & Sharding Architecture
            </h2>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Vertical vs Horizontal Scaling, 6 Sharding Strategies, Consistent Hash Rings & Shard Key Evaluation
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
            { id: 'strategies', label: '6 Sharding Strategies' },
            { id: 'ring', label: 'Consistent Hash Ring Simulator' },
            { id: 'key_eval', label: 'Shard Key Evaluator' },
            { id: 'roadmap', label: '8-Step Scaling Roadmap' },
            { id: 'cap', label: 'CAP & PACELC' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubtab(tab.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: activeSubtab === tab.id ? '700' : '500',
                color: activeSubtab === tab.id ? '#ffffff' : 'var(--text-muted)',
                background: activeSubtab === tab.id ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: 6 SHARDING STRATEGIES */}
      {activeSubtab === 'strategies' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(360px, 1.8fr)',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Strategy List */}
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
              Select Sharding Strategy:
            </div>
            {SCALING_SHARDING_DATA.shardingStrategies.map((strat, idx) => {
              const isSelected = idx === selectedStrategyIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedStrategyIndex(idx)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? '#6366f1' : 'rgba(255, 255, 255, 0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: isSelected ? '#a5b4fc' : '#ffffff', marginBottom: '4px' }}>
                    {strat.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {strat.how.slice(0, 50)}...
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strategy Detailed Showcase */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span className="badge" style={{ background: '#6366f125', color: '#a5b4fc', border: '1px solid #6366f150', fontSize: '0.72rem' }}>
                  Horizontal Partitioning
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: '6px 0 0 0' }}>
                  {activeStrat.name}
                </h3>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Partitioning Algorithm & Routing Rule:
              </div>
              <div style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#fbbf24'
              }}>
                {activeStrat.how}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '18px' }}>
              <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#34d399', marginBottom: '4px' }}>
                  ✅ Key Strengths
                </div>
                <div style={{ fontSize: '0.74rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                  {activeStrat.pros}
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#f87171', marginBottom: '4px' }}>
                  ❌ Known Bottlenecks
                </div>
                <div style={{ fontSize: '0.74rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                  {activeStrat.cons}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CONSISTENT HASH RING SIMULATOR */}
      {activeSubtab === 'ring' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Consistent Hashing: 360° Ring Simulator
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Keys and node positions are hashed to a circle. A key routes to the first node encountered clockwise.
              </p>
            </div>

            {/* Node Count Controller */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Physical Shards:</span>
              <button
                onClick={() => setNodeCount(Math.max(2, nodeCount - 1))}
                style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: 'none', cursor: 'pointer' }}
              >
                -
              </button>
              <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                {nodeCount} Nodes
              </span>
              <button
                onClick={() => setNodeCount(Math.min(6, nodeCount + 1))}
                style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: 'none', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          </div>

          {/* Visual Ring Representation */}
          <div style={{
            padding: '30px',
            borderRadius: '12px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              border: '3px dashed #6366f1',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)'
            }}>
              <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                <strong>Hash Ring</strong><br />
                0 to 2³²-1
              </div>

              {/* Dynamic Nodes on Ring */}
              {Array.from({ length: nodeCount }).map((_, i) => {
                const angle = (i * (360 / nodeCount)) * (Math.PI / 180);
                const x = Math.cos(angle) * 118;
                const y = Math.sin(angle) * 118;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      transform: `translate(${x}px, ${y}px)`,
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#10b981',
                      border: '2px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      color: '#070a12',
                      boxShadow: '0 0 12px #10b981'
                    }}
                    title={`Shard Node ${i + 1}`}
                  >
                    N{i + 1}
                  </div>
                );
              })}
            </div>

            <div style={{
              fontSize: '0.78rem',
              color: '#a5b4fc',
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              maxWidth: '600px',
              textAlign: 'center'
            }}>
              💡 <strong>Why Consistent Hashing Wins:</strong> In standard <code style={{ color: '#fbbf24' }}>hash(key) % N</code>, adding one node remaps ~75-90% of keys. With Consistent Hashing, adding a node only moves <code style={{ color: '#34d399' }}>1/N</code> of keys, avoiding mass data migration storms!
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SHARD KEY EVALUATOR */}
      {activeSubtab === 'key_eval' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(360px, 1.8fr)',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Key Candidate Selector */}
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
              Candidate Shard Keys:
            </div>
            {Object.keys(shardKeyEvals).map((k) => {
              const item = shardKeyEvals[k];
              const isSelected = k === selectedShardKeyCandidate;
              return (
                <div
                  key={k}
                  onClick={() => setSelectedShardKeyCandidate(k)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? '#6366f1' : 'rgba(255, 255, 255, 0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: isSelected ? '#a5b4fc' : '#ffffff', marginBottom: '2px' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: item.color, fontWeight: '700' }}>
                    {item.verdict}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Evaluation Card */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: `1px solid ${activeKeyEval.color}50`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span className="badge" style={{ background: `${activeKeyEval.color}20`, color: activeKeyEval.color, border: `1px solid ${activeKeyEval.color}` }}>
                  {activeKeyEval.verdict}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: '6px 0 0 0' }}>
                  {activeKeyEval.name}
                </h3>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '18px' }}>
              <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Key Cardinality:</div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff' }}>{activeKeyEval.cardinality}</div>
              </div>
              <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Write Distribution:</div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff' }}>{activeKeyEval.distribution}</div>
              </div>
              <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Query Co-Location:</div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff' }}>{activeKeyEval.queryLocality}</div>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: '1.6', margin: 0 }}>
              {activeKeyEval.details}
            </p>
          </div>
        </div>
      )}

      {/* VIEW 4: 8-STEP SCALING ROADMAP */}
      {activeSubtab === 'roadmap' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            5.5 The Pragmatic Engineering Path to Database Scale
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Do NOT jump directly to sharding. Sharding introduces massive operational complexity and cross-shard latency. Follow this incremental order:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SCALING_SHARDING_DATA.scalingRoadmap.map((step, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.25)',
                  color: '#a5b4fc',
                  fontWeight: '800',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {idx + 1}
                </span>
                <span style={{ fontSize: '0.84rem', color: '#e2e8f0', fontWeight: '500' }}>
                  {step.slice(3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 5: CAP & PACELC */}
      {activeSubtab === 'cap' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            5.4 CAP Theorem & PACELC Trade-Offs
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            In any distributed partition (P), you must choose between Consistency (C) and Availability (A). PACELC extends this to normal operations: Else, choose between Latency (L) and Consistency (C).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#38bdf8', marginBottom: '4px' }}>
                CP Systems (Consistency &gt; Availability)
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Refuses requests or waits for majority quorum rather than returning stale data.
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Examples: MongoDB (default majority), CockroachDB, Spanner, etcd.
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#34d399', marginBottom: '4px' }}>
                AP Systems (Availability &gt; Consistency)
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Always accepts reads and writes, providing eventual consistency later.
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Examples: Apache Cassandra, AWS DynamoDB (eventual), CouchDB.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
