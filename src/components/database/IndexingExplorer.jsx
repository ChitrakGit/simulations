import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Layers,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Database,
  Cpu,
  Zap,
  Sliders,
  Info
} from 'lucide-react';
import { INDEXING_DATA } from '../../data/databaseData';

export default function IndexingExplorer({ activeEngine = 'sql' }) {
  const [activeSubtab, setActiveSubtab] = useState(() => {
    if (activeEngine === 'mongodb' || activeEngine === 'postgres') return 'matrix';
    return 'prefix';
  });

  // Auto-adapt indexing subtopic based on engine
  useEffect(() => {
    if (activeEngine === 'mongodb') {
      setActiveSubtab('matrix');
    } else if (activeEngine === 'postgres') {
      setActiveSubtab('matrix');
    } else {
      setActiveSubtab('prefix');
    }
  }, [activeEngine]);
  
  // Composite Prefix Tester State
  const [hasCustomerId, setHasCustomerId] = useState(true);
  const [hasOrderDate, setHasOrderDate] = useState(false);
  const [hasStatus, setHasStatus] = useState(false);

  // Compute Leftmost Prefix Index Usage
  const indexEvaluation = (() => {
    if (!hasCustomerId) {
      if (hasOrderDate || hasStatus) {
        return {
          status: 'INDEX SKIPPED (Full Table Scan)',
          color: '#ef4444',
          desc: 'Leftmost Prefix Rule Violated: Predicate skips customer_id (the leading column). The engine must sequentially scan every table block unless a skip scan is available.'
        };
      }
      return {
        status: 'NO FILTER PROVIDED',
        color: 'var(--text-dim)',
        desc: 'Select at least one predicate condition to test index usage.'
      };
    }
    if (hasCustomerId && hasOrderDate && hasStatus) {
      return {
        status: 'OPTIMAL COMPOSITE INDEX HIT (3 Columns)',
        color: '#10b981',
        desc: 'All 3 columns match the index order (customer_id -> order_date -> status). Narrowest possible index slice scanned!'
      };
    }
    if (hasCustomerId && hasOrderDate && !hasStatus) {
      return {
        status: 'HIGH EFFICIENCY HIT (2 Columns)',
        color: '#34d399',
        desc: 'Leading two columns used for range index scan. status will be evaluated in memory.'
      };
    }
    if (hasCustomerId && !hasOrderDate && hasStatus) {
      return {
        status: 'PARTIAL INDEX HIT (Leading Column Only)',
        color: '#f59e0b',
        desc: 'Index used on customer_id only. Because order_date was skipped, status cannot participate in the index scan.'
      };
    }
    return {
      status: 'INDEX HIT (Leading Column)',
      color: '#38bdf8',
      desc: 'Index used for customer_id lookup in O(log N) time.'
    };
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Subtab Navigation Banner */}
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
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GitBranch size={20} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
              7. Indexing: Beginner → Advanced Masterclass
            </h2>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              B+Tree vs LSM-Tree, Leftmost Prefix Tester, SARGability Checklist, and Advanced GIN/GiST/BRIN
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
            { id: 'prefix', label: 'Leftmost Prefix Tester' },
            { id: 'btree_lsm', label: 'B+Tree vs LSM-Tree' },
            { id: 'sargable', label: 'SARGability Checklist' },
            { id: 'covering', label: 'Covering & INCLUDE' },
            { id: 'matrix', label: '10 Index Types Matrix' }
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
                background: activeSubtab === tab.id ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: COMPOSITE INDEX & LEFTMOST PREFIX TESTER */}
      {activeSubtab === 'prefix' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(360px, 1.8fr)',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Left: Interactive Predicate Checkboxes */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
              Composite Index: orders (customer_id, order_date, status)
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Select which WHERE predicate clauses are included in your SQL query to observe whether the composite index is utilized or ignored:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: hasCustomerId ? 'rgba(56, 189, 248, 0.12)' : 'rgba(0, 0, 0, 0.3)',
                border: `1px solid ${hasCustomerId ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)'}`,
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={hasCustomerId}
                  onChange={(e) => setHasCustomerId(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff' }}>
                    Column 1: customer_id = 42
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Leading Leftmost Key (Equality)
                  </div>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: hasOrderDate ? 'rgba(56, 189, 248, 0.12)' : 'rgba(0, 0, 0, 0.3)',
                border: `1px solid ${hasOrderDate ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)'}`,
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={hasOrderDate}
                  onChange={(e) => setHasOrderDate(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff' }}>
                    Column 2: order_date &gt; '2026-01-01'
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Second Key in composite order (Range)
                  </div>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: hasStatus ? 'rgba(56, 189, 248, 0.12)' : 'rgba(0, 0, 0, 0.3)',
                border: `1px solid ${hasStatus ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)'}`,
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={hasStatus}
                  onChange={(e) => setHasStatus(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff' }}>
                    Column 3: status = 'COMPLETED'
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Third Key in composite order
                  </div>
                </div>
              </label>
            </div>

            {/* Simulated SQL Query */}
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.6)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: '#fbbf24'
            }}>
              SELECT * FROM orders<br />
              WHERE {hasCustomerId && 'customer_id = 42 '}
              {hasCustomerId && hasOrderDate && 'AND '}
              {hasOrderDate && "order_date > '2026-01-01' "}
              {(hasCustomerId || hasOrderDate) && hasStatus && 'AND '}
              {hasStatus && "status = 'COMPLETED' "}
              {!hasCustomerId && !hasOrderDate && !hasStatus && '1=1 /* No index filters */'};
            </div>
          </div>

          {/* Right: Engine Planner Evaluation */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: `1px solid ${indexEvaluation.color}50`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Query Optimizer Evaluation
              </h3>
              <span className="badge" style={{
                background: `${indexEvaluation.color}20`,
                color: indexEvaluation.color,
                border: `1px solid ${indexEvaluation.color}`
              }}>
                {indexEvaluation.status}
              </span>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '20px' }}>
              {indexEvaluation.desc}
            </p>

            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#38bdf8', marginBottom: '8px' }}>
                Column Ordering Rules for Composite Indexes:
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                <li><strong>1. Equality columns first:</strong> Columns filtered with <code style={{ color: '#38bdf8' }}>=</code> must precede range columns.</li>
                <li><strong>2. Range column next:</strong> Only ONE range column (<code style={{ color: '#38bdf8' }}>&gt;, &lt;, BETWEEN</code>) can participate in index seek. Subsequent columns in the index cannot be traversed logarithmically.</li>
                <li><strong>3. ORDER BY columns last:</strong> Index matches query ordering to avoid in-memory quicksort or external merge disk spills.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: B+TREE VS LSM-TREE */}
      {activeSubtab === 'btree_lsm' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            7.15 In-Depth: B+Tree vs Log-Structured Merge-Tree (LSM-Tree)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            The fundamental architectural divide in database storage engines: In-Place Updates vs Append-Only Compaction.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* B+Tree Card */}
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#38bdf8', margin: 0 }}>
                  {INDEXING_DATA.btreeVsLsm.btree.name}
                </h4>
                <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
                  {INDEXING_DATA.btreeVsLsm.btree.complexity}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#e2e8f0', lineHeight: '1.5', marginBottom: '12px' }}>
                {INDEXING_DATA.btreeVsLsm.btree.mechanism}
              </p>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <strong>Write Amplification:</strong> {INDEXING_DATA.btreeVsLsm.btree.writeCost}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#34d399', marginBottom: '10px' }}>
                <strong>Read Latency:</strong> {INDEXING_DATA.btreeVsLsm.btree.readCost}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                Engines: {INDEXING_DATA.btreeVsLsm.btree.engines}
              </div>
            </div>

            {/* LSM-Tree Card */}
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#34d399', margin: 0 }}>
                  {INDEXING_DATA.btreeVsLsm.lsm.name}
                </h4>
                <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
                  {INDEXING_DATA.btreeVsLsm.lsm.complexity}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#e2e8f0', lineHeight: '1.5', marginBottom: '12px' }}>
                {INDEXING_DATA.btreeVsLsm.lsm.mechanism}
              </p>
              <div style={{ fontSize: '0.74rem', color: '#34d399', marginBottom: '6px' }}>
                <strong>Write Throughput:</strong> {INDEXING_DATA.btreeVsLsm.lsm.writeCost}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                <strong>Read Path:</strong> {INDEXING_DATA.btreeVsLsm.lsm.readCost}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                Engines: {INDEXING_DATA.btreeVsLsm.lsm.engines}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SARGABILITY CHECKLIST */}
      {activeSubtab === 'sargable' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            7.13 SARGability: Writing Index-Friendly Queries
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            <strong>SARGable</strong> = "Search ARGument able": predicates that allow the engine to perform index seeks rather than scanning every single table block.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
            {INDEXING_DATA.sargabilityExamples.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ fontSize: '0.74rem', color: '#f87171', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                  ❌ Non-SARGable: {item.bad}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#34d399', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                  ✅ SARGable Rewrite: {item.good}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  💡 <strong>Rule:</strong> {item.why}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: COVERING INDEXES & INCLUDE */}
      {activeSubtab === 'covering' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            7.9 Covering Indexes & Index-Only Scans (INCLUDE Clause)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            When an index contains every single column requested by the query, the engine performs an <strong>Index-Only Scan</strong>, bypassing the table heap entirely!
          </p>

          <div style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: '#a7f3d0',
            lineHeight: '1.6',
            marginBottom: '16px'
          }}>
            -- High-traffic API query:<br />
            <span style={{ color: '#fbbf24' }}>SELECT customer_id, order_date, total FROM orders WHERE customer_id = 42;</span><br /><br />
            -- Optimal Covering Index with INCLUDE (PostgreSQL / SQL Server):<br />
            <span style={{ color: '#38bdf8' }}>CREATE INDEX idx_orders_cover ON orders (customer_id, order_date) INCLUDE (total);</span>
          </div>

          <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            <strong>Why INCLUDE is superior to a 3-column composite key:</strong> <code style={{ color: '#38bdf8' }}>INCLUDE</code> columns are stored solely in leaf pages. They do not participate in B-Tree internal node keys, keeping upper branches compact and memory-cache friendly!
          </div>
        </div>
      )}

      {/* VIEW 5: 10 INDEX TYPES MATRIX */}
      {activeSubtab === 'matrix' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            7.14 Index Types Beyond B-Tree: The Complete Decision Matrix
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            PostgreSQL, MySQL, and specialized engines support diverse data structures for multi-dimensional and high-cardinality data.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {INDEXING_DATA.indexTypes.map((idx, i) => (
              <div
                key={i}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#fbbf24' }}>
                    {idx.type}
                  </span>
                  <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                    {idx.engines}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {idx.bestFor}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
