import React, { useState, useEffect } from 'react';
import {
  Activity
} from 'lucide-react';
import { QUERY_EXECUTION_DATA } from '../../data/databaseData';

export default function QueryExecutionExplorer({ activeEngine = 'sql' }) {
  const [selectedSubtopic, setSelectedSubtopic] = useState(() => {
    if (activeEngine === 'mongodb') return 'mongo_pipeline';
    return 'algebra';
  });
  const [selectedOperatorIndex, setSelectedOperatorIndex] = useState(0);
  const [treeOptimizationStage, setTreeOptimizationStage] = useState('optimized'); // 'unoptimized' | 'pushed_selection' | 'optimized'
  const [selectedJoinIndex, setSelectedJoinIndex] = useState(1); // Hash join default
  const [explainEngine, setExplainEngine] = useState(() => {
    if (activeEngine === 'mongodb') return 'mongo';
    if (activeEngine === 'postgres') return 'postgres';
    return 'mysql';
  });
  const [selectedMongoStage, setSelectedMongoStage] = useState(0);

  // Auto-switch subtopic and explain view based on active database engine
  useEffect(() => {
    if (activeEngine === 'mongodb') {
      setSelectedSubtopic('mongo_pipeline');
      setExplainEngine('mongo');
    } else if (activeEngine === 'postgres') {
      setSelectedSubtopic('algebra');
      setExplainEngine('postgres');
    } else if (activeEngine === 'sql') {
      setSelectedSubtopic('algebra');
      setExplainEngine('mysql');
    }
  }, [activeEngine]);

  const activeOp = QUERY_EXECUTION_DATA.relationalAlgebra[selectedOperatorIndex];
  const activeJoin = QUERY_EXECUTION_DATA.joinAlgorithms[selectedJoinIndex];

  const mongoStages = [
    {
      stage: '$match',
      label: '1. Filter ($match)',
      desc: 'Filters documents to pass only those matching the predicate. Equivalent to SQL WHERE.',
      syntax: '{\n  $match: {\n    status: "DELIVERED",\n    totalAmount: { $gte: 100 }\n  }\n}',
      inputCount: '100,000 order documents',
      outputCount: '8,420 documents passed',
      indexImpact: '🔥 Optimal: Place at start of pipeline to leverage index { status: 1, totalAmount: 1 } and avoid full collection scan (COLLSCAN).'
    },
    {
      stage: '$unwind',
      label: '2. Deconstruct Array ($unwind)',
      desc: 'Deconstructs an array field from the input documents to output a document for each element.',
      syntax: '{\n  $unwind: "$items"\n}',
      inputCount: '8,420 order documents',
      outputCount: '25,260 item line documents',
      indexImpact: 'Splits arrays into discrete stream tuples for subsequent aggregation.'
    },
    {
      stage: '$group',
      label: '3. Aggregate ($group)',
      desc: 'Groups documents by a specified identifier and applies accumulator expressions. Equivalent to SQL GROUP BY.',
      syntax: '{\n  $group: {\n    _id: "$items.productId",\n    totalQuantity: { $sum: "$items.qty" },\n    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },\n    orderCount: { $sum: 1 }\n  }\n}',
      inputCount: '25,260 item line documents',
      outputCount: '340 grouped product rows',
      indexImpact: 'Memory capped at 100MB per stage in MongoDB unless { allowDiskUse: true } is explicitly specified.'
    },
    {
      stage: '$sort',
      label: '4. Order ($sort)',
      desc: 'Reorders documents by the specified key in descending order. Equivalent to SQL ORDER BY.',
      syntax: '{\n  $sort: {\n    totalRevenue: -1\n  }\n}',
      inputCount: '340 grouped product rows',
      outputCount: '340 sorted product rows',
      indexImpact: 'Re-orders stream by total revenue so highest grossing products rank first.'
    },
    {
      stage: '$limit',
      label: '5. Restrict ($limit)',
      desc: 'Passes the first N documents to output. Equivalent to SQL LIMIT.',
      syntax: '{\n  $limit: 10\n}',
      inputCount: '340 sorted rows',
      outputCount: 'Top 10 bestseller products',
      indexImpact: 'Memory optimization: engine stops sorting after retaining top 10 items in RAM.'
    },
    {
      stage: '$lookup',
      label: '6. Left Outer Join ($lookup)',
      desc: 'Performs a left outer join to an unsharded collection in the same database. Equivalent to SQL LEFT JOIN.',
      syntax: '{\n  $lookup: {\n    from: "products",\n    localField: "_id",\n    foreignField: "_id",\n    as: "productDetails"\n  }\n}',
      inputCount: '10 bestselling product IDs',
      outputCount: '10 joined rich documents',
      indexImpact: 'Ensure target foreign collection has an index on foreignField ("_id") to prevent O(N * M) nested scan.'
    }
  ];

  const subtopicTabs = [
    ...(activeEngine === 'mongodb' ? [{ id: 'mongo_pipeline', label: '🍃 Aggregation Pipeline ($match, $group)' }] : []),
    { id: 'algebra', label: 'Relational Algebra (σ, π, ⨝)' },
    { id: 'trees', label: 'Query Trees & Pushdown' },
    { id: 'joins', label: 'Join Algorithms (Hash/Merge)' },
    { id: 'explain', label: 'Reading EXPLAIN ANALYZE' },
    { id: 'order', label: 'SQL Evaluation Order' },
    ...(activeEngine !== 'mongodb' ? [{ id: 'mongo_pipeline', label: '🍃 MongoDB Aggregation Pipeline' }] : [])
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Subtopic Switcher Banner */}
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
            background: activeEngine === 'mongodb'
              ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
              : 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={20} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
              4. Query Execution: {activeEngine === 'mongodb' ? 'MongoDB Aggregation Pipeline & explain()' : 'Relational Algebra & AST Execution'}
            </h2>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {activeEngine === 'mongodb'
                ? 'From document filters to multi-stage pipelines ($match, $group, $sort) and executionStats analysis'
                : 'From SQL text to Relational Algebra, AST Query Trees, Cost Optimization, and Join Algorithms'}
            </p>
          </div>
        </div>

        {/* Subtopics navigation */}
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '4px',
          borderRadius: '10px',
          flexWrap: 'wrap'
        }}>
          {subtopicTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedSubtopic(tab.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: selectedSubtopic === tab.id ? '700' : '500',
                color: selectedSubtopic === tab.id ? '#ffffff' : 'var(--text-muted)',
                background: selectedSubtopic === tab.id
                  ? (tab.id === 'mongo_pipeline' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)')
                  : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUBTOPIC: MONGODB AGGREGATION PIPELINE */}
      {selectedSubtopic === 'mongo_pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Stage Stepper */}
          <div className="glass-panel" style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="badge" style={{ background: '#10b98125', color: '#34d399', border: '1px solid #10b98150', fontSize: '0.72rem' }}>
                  MongoDB Framework
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: '4px 0 0 0' }}>
                  db.orders.aggregate([ ... stages ... ])
                </h3>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Click a stage to inspect document flow & query optimizer indexing
              </div>
            </div>

            {/* Stages Grid Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
              {mongoStages.map((stg, idx) => {
                const isSelected = selectedMongoStage === idx;
                return (
                  <button
                    key={stg.stage}
                    onClick={() => setSelectedMongoStage(idx)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: isSelected ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
                      {stg.stage}
                    </div>
                    <div style={{ fontSize: '0.66rem', opacity: 0.8, marginTop: '2px' }}>
                      {stg.label.split(' ')[1]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stage Details */}
          {(() => {
            const stg = mongoStages[selectedMongoStage];
            return (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(360px, 1.8fr)',
                gap: '20px',
                alignItems: 'start'
              }}>
                {/* Left Card: Syntax & Details */}
                <div className="glass-panel" style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                      Stage {selectedMongoStage + 1} of 6: {stg.stage}
                    </span>
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#a7f3d0' }}>
                      BSON Pipeline
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.5' }}>
                    {stg.desc}
                  </p>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                    BSON Stage Definition:
                  </div>
                  <pre style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.8rem',
                    color: '#a7f3d0',
                    fontFamily: 'var(--font-mono)',
                    margin: '0 0 16px 0',
                    lineHeight: '1.5'
                  }}>
                    {stg.syntax}
                  </pre>

                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    fontSize: '0.74rem',
                    color: '#fbbf24',
                    lineHeight: '1.4'
                  }}>
                    <strong>Optimization Note:</strong> {stg.indexImpact}
                  </div>
                </div>

                {/* Right Card: Transformation Stream & SQL Equivalent */}
                <div className="glass-panel" style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: '800', color: '#ffffff', margin: '0 0 12px 0' }}>
                    Pipeline Document Stream Transformation
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Input Stream Volume
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38bdf8', marginTop: '4px' }}>
                        {stg.inputCount}
                      </div>
                    </div>

                    <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Output Stream Result
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#34d399', marginTop: '4px' }}>
                        {stg.outputCount}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
                      SQL Relational Algebra Mapping:
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      • <strong>SELECT</strong> → <code style={{ color: '#34d399' }}>$project</code> / <code style={{ color: '#34d399' }}>$addFields</code><br />
                      • <strong>WHERE</strong> → <code style={{ color: '#34d399' }}>$match</code><br />
                      • <strong>GROUP BY</strong> → <code style={{ color: '#34d399' }}>$group</code> with accumulators ($sum, $avg)<br />
                      • <strong>HAVING</strong> → second <code style={{ color: '#34d399' }}>$match</code> following $group<br />
                      • <strong>LEFT JOIN</strong> → <code style={{ color: '#34d399' }}>$lookup</code> + <code style={{ color: '#34d399' }}>$unwind</code><br />
                      • <strong>ORDER BY</strong> → <code style={{ color: '#34d399' }}>$sort</code>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* SUBTOPIC 1: RELATIONAL ALGEBRA */}
      {selectedSubtopic === 'algebra' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1fr) minmax(360px, 1.6fr)',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Left Column: Operator List */}
          <div className="glass-panel" style={{
            padding: '18px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
              Relational Algebra Operators:
            </div>
            {QUERY_EXECUTION_DATA.relationalAlgebra.map((op, idx) => {
              const isSelected = idx === selectedOperatorIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedOperatorIndex(idx)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.05)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontFamily: 'serif',
                      fontSize: '1rem',
                      fontWeight: '800',
                      color: isSelected ? '#38bdf8' : '#fbbf24',
                      minWidth: '32px'
                    }}>
                      {op.symbol.split(' ')[0]}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: isSelected ? '700' : '500', color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                      {op.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    {op.sql}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Column: In-Depth Operator Showcase */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span className="badge" style={{ background: '#38bdf825', color: '#38bdf8', border: '1px solid #38bdf850', fontSize: '0.72rem' }}>
                  Mathematical Foundation
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: '6px 0 0 0' }}>
                  {activeOp.symbol}: {activeOp.name}
                </h3>
              </div>
              <div style={{
                fontSize: '1.4rem',
                fontFamily: 'serif',
                fontWeight: '900',
                color: '#38bdf8',
                background: 'rgba(0,0,0,0.4)',
                padding: '6px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                {activeOp.symbol}
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Mathematical Definition & SQL Equivalent:
              </div>
              <div style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.84rem',
                color: '#fbbf24',
                marginBottom: '8px'
              }}>
                {activeOp.sql}
              </div>
              <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: '1.6', margin: 0 }}>
                {activeOp.desc}
              </p>
            </div>

            {/* Practical Worked Examples */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#38bdf8', marginBottom: '8px' }}>
                Worked Example:
              </div>

              {activeOp.name === 'Selection' && (
                <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#a7f3d0' }}>
                  <div>-- SQL:</div>
                  <div style={{ color: '#fbbf24' }}>SELECT * FROM employees WHERE salary &gt; 50000;</div>
                  <div style={{ marginTop: '8px', color: '#94a3b8' }}>-- Relational Algebra:</div>
                  <div style={{ color: '#38bdf8' }}>σ salary &gt; 50000 ( employees )</div>
                </div>
              )}

              {activeOp.name === 'Projection' && (
                <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#a7f3d0' }}>
                  <div>-- SQL:</div>
                  <div style={{ color: '#fbbf24' }}>SELECT name, salary FROM employees;</div>
                  <div style={{ marginTop: '8px', color: '#94a3b8' }}>-- Relational Algebra:</div>
                  <div style={{ color: '#38bdf8' }}>π name, salary ( employees )</div>
                </div>
              )}

              {activeOp.name !== 'Selection' && activeOp.name !== 'Projection' && (
                <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#a7f3d0' }}>
                  <div>-- SQL Expression:</div>
                  <div style={{ color: '#fbbf24' }}>SELECT e.name, d.dept_name FROM employees e JOIN departments d ON e.dept_id = d.dept_id;</div>
                  <div style={{ marginTop: '8px', color: '#94a3b8' }}>-- Relational Algebra:</div>
                  <div style={{ color: '#38bdf8' }}>π e.name, d.dept_name ( employees ⨝ e.dept_id = d.dept_id departments )</div>
                </div>
              )}
            </div>

            {/* Equivalence Rules Highlight */}
            <div style={{
              marginTop: '16px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              fontSize: '0.76rem',
              color: '#cbd5e1',
              lineHeight: '1.5'
            }}>
              <strong>Optimizer Transformation Rule:</strong> Selection Pushdown: <code style={{ color: '#38bdf8' }}>σc(R ⨝ S) ≡ σc(R) ⨝ S</code>. By filtering rows before the join, intermediate row volume drops by 90%+, speeding up execution exponentially!
            </div>

            {/* Advanced Execution: Parallel Query & JIT LLVM (from doc/database_architecture_reference.md) */}
            <div style={{
              marginTop: '12px',
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.08)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              fontSize: '0.76rem',
              color: '#e2e8f0',
              lineHeight: '1.5'
            }}>
              <span style={{ fontWeight: '800', color: '#c084fc' }}>⚡ Advanced Modern Engine Execution (Section 6.4):</span><br />
              • <strong>Parallel Query Execution:</strong> Large sequential scans, hash joins, and aggregations are partitioned among worker threads/processes (e.g. <code style={{ color: '#38bdf8' }}>max_parallel_workers_per_gather</code> in PostgreSQL).<br />
              • <strong>JIT Compilation (LLVM):</strong> PostgreSQL 11+ Just-In-Time compiles complex SQL expressions and filter trees directly into native machine code at runtime, slashing CPU interpretive loop overhead.
            </div>
          </div>
        </div>
      )}

      {/* SUBTOPIC 2: QUERY TREES & PUSHDOWN OPTIMIZATION */}
      {selectedSubtopic === 'trees' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Query Tree Transformation (Logical Plan Optimization)
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Query: SELECT e.name, d.dept_name FROM employees e JOIN departments d ON e.dept_id = d.dept_id WHERE e.salary &gt; 50000 AND d.location = 'Kolkata';
              </p>
            </div>

            {/* Tree Stage Buttons */}
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '8px' }}>
              <button
                onClick={() => setTreeOptimizationStage('unoptimized')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: treeOptimizationStage === 'unoptimized' ? '700' : '500',
                  color: treeOptimizationStage === 'unoptimized' ? '#ffffff' : 'var(--text-muted)',
                  background: treeOptimizationStage === 'unoptimized' ? '#ef4444' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                1. Unoptimized Naive Tree
              </button>
              <button
                onClick={() => setTreeOptimizationStage('pushed_selection')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: treeOptimizationStage === 'pushed_selection' ? '700' : '500',
                  color: treeOptimizationStage === 'pushed_selection' ? '#ffffff' : 'var(--text-muted)',
                  background: treeOptimizationStage === 'pushed_selection' ? '#f59e0b' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                2. Selection Pushdown (σ)
              </button>
              <button
                onClick={() => setTreeOptimizationStage('optimized')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: treeOptimizationStage === 'optimized' ? '700' : '500',
                  color: treeOptimizationStage === 'optimized' ? '#ffffff' : 'var(--text-muted)',
                  background: treeOptimizationStage === 'optimized' ? '#10b981' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                3. Fully Optimized (σ + π Pushdown)
              </button>
            </div>
          </div>

          {/* Tree Visualization Canvas */}
          <div style={{
            padding: '24px',
            borderRadius: '12px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            fontFamily: 'var(--font-mono)'
          }}>
            {/* ROOT NODE: PROJECTION */}
            <div style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#0ea5e925',
              border: '2px solid #0ea5e9',
              color: '#38bdf8',
              fontWeight: '800',
              fontSize: '0.86rem',
              textAlign: 'center'
            }}>
              Root: π e.name, d.dept_name
            </div>

            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>│</div>

            {/* STAGE 1: UNOPTIMIZED */}
            {treeOptimizationStage === 'unoptimized' && (
              <>
                <div style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: '#ef444425',
                  border: '2px solid #ef4444',
                  color: '#f87171',
                  fontSize: '0.8rem',
                  textAlign: 'center'
                }}>
                  σ e.salary &gt; 50000 ∧ d.location = 'Kolkata' (Evaluated AFTER Join!)
                </div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>│</div>
                <div style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  background: '#8b5cf625',
                  border: '2px solid #8b5cf6',
                  color: '#c084fc',
                  fontSize: '0.84rem'
                }}>
                  ⨝ e.dept_id = d.dept_id (Processes ALL 100,000 Cartesian Rows!)
                </div>
                <div style={{ display: 'flex', gap: '80px', marginTop: '6px' }}>
                  <div style={{ padding: '8px 16px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#ffffff' }}>
                    Leaf: employees (e)
                  </div>
                  <div style={{ padding: '8px 16px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#ffffff' }}>
                    Leaf: departments (d)
                  </div>
                </div>
              </>
            )}

            {/* STAGE 2: PUSHED SELECTION */}
            {treeOptimizationStage === 'pushed_selection' && (
              <>
                <div style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  background: '#8b5cf625',
                  border: '2px solid #8b5cf6',
                  color: '#c084fc',
                  fontSize: '0.84rem'
                }}>
                  ⨝ e.dept_id = d.dept_id (Joins ONLY pre-filtered rows!)
                </div>
                <div style={{ display: 'flex', gap: '60px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ padding: '8px 14px', borderRadius: '6px', background: '#f59e0b25', border: '1px solid #f59e0b', color: '#fbbf24', fontSize: '0.76rem' }}>
                      σ e.salary &gt; 50000
                    </div>
                    <div style={{ color: 'var(--text-dim)' }}>│</div>
                    <div style={{ padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#ffffff', fontSize: '0.78rem' }}>
                      employees (e)
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ padding: '8px 14px', borderRadius: '6px', background: '#f59e0b25', border: '1px solid #f59e0b', color: '#fbbf24', fontSize: '0.76rem' }}>
                      σ d.location = 'Kolkata'
                    </div>
                    <div style={{ color: 'var(--text-dim)' }}>│</div>
                    <div style={{ padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#ffffff', fontSize: '0.78rem' }}>
                      departments (d)
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* STAGE 3: FULLY OPTIMIZED (PROJECTION + SELECTION PUSHDOWN) */}
            {treeOptimizationStage === 'optimized' && (
              <>
                <div style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  background: '#10b98125',
                  border: '2px solid #10b981',
                  color: '#34d399',
                  fontSize: '0.84rem'
                }}>
                  Hash Join (e.dept_id = d.dept_id)
                </div>
                <div style={{ display: 'flex', gap: '40px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{ padding: '6px 12px', borderRadius: '6px', background: '#0ea5e920', border: '1px solid #0ea5e9', color: '#38bdf8', fontSize: '0.72rem' }}>
                      π e.name, e.dept_id
                    </div>
                    <div style={{ color: 'var(--text-dim)' }}>│</div>
                    <div style={{ padding: '6px 12px', borderRadius: '6px', background: '#f59e0b20', border: '1px solid #f59e0b', color: '#fbbf24', fontSize: '0.72rem' }}>
                      Index Scan (salary &gt; 50000)
                    </div>
                    <div style={{ color: 'var(--text-dim)' }}>│</div>
                    <div style={{ padding: '6px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#ffffff', fontSize: '0.76rem' }}>
                      employees (e)
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{ padding: '6px 12px', borderRadius: '6px', background: '#0ea5e920', border: '1px solid #0ea5e9', color: '#38bdf8', fontSize: '0.72rem' }}>
                      π d.dept_id, d.dept_name
                    </div>
                    <div style={{ color: 'var(--text-dim)' }}>│</div>
                    <div style={{ padding: '6px 12px', borderRadius: '6px', background: '#f59e0b20', border: '1px solid #f59e0b', color: '#fbbf24', fontSize: '0.72rem' }}>
                      Seq Scan (location = 'Kolkata')
                    </div>
                    <div style={{ color: 'var(--text-dim)' }}>│</div>
                    <div style={{ padding: '6px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#ffffff', fontSize: '0.76rem' }}>
                      departments (d)
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* SUBTOPIC 3: JOIN ALGORITHMS */}
      {selectedSubtopic === 'joins' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(360px, 1.8fr)',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Join Selector List */}
          <div className="glass-panel" style={{
            padding: '18px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
              Physical Join Implementations:
            </div>
            {QUERY_EXECUTION_DATA.joinAlgorithms.map((join, idx) => {
              const isSelected = idx === selectedJoinIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedJoinIndex(idx)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: '800', color: isSelected ? '#38bdf8' : '#ffffff' }}>
                      {join.name}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
                      {join.complexity}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Best for: {join.bestWhen.slice(0, 50)}...
                  </div>
                </div>
              );
            })}
          </div>

          {/* Join Details & Flow Animation */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span className="badge" style={{ background: '#38bdf825', color: '#38bdf8', border: '1px solid #38bdf850', fontSize: '0.72rem' }}>
                  Join Strategy
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: '6px 0 0 0' }}>
                  {activeJoin.name}
                </h3>
              </div>
              <div style={{
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                color: '#34d399',
                background: 'rgba(0,0,0,0.4)',
                padding: '6px 12px',
                borderRadius: '8px'
              }}>
                {activeJoin.complexity}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Algorithmic Execution Mechanics:
              </div>
              <pre style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.78rem',
                color: '#e2e8f0',
                whiteSpace: 'pre-wrap',
                margin: 0
              }}>
                {activeJoin.howItWorks}
              </pre>
            </div>

            <div style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.76rem',
              color: '#34d399',
              lineHeight: '1.5'
            }}>
              <strong>Optimal Planner Scenario:</strong> {activeJoin.bestWhen}
            </div>
          </div>
        </div>
      )}

      {/* SUBTOPIC 4: READING EXPLAIN ANALYZE */}
      {selectedSubtopic === 'explain' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                4.6 How to Read EXPLAIN ANALYZE Plans
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Comparing estimated cost units vs actual execution reality with red flag alarms
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '8px' }}>
              <button
                onClick={() => setExplainEngine('postgres')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: explainEngine === 'postgres' ? '700' : '500',
                  color: explainEngine === 'postgres' ? '#ffffff' : 'var(--text-muted)',
                  background: explainEngine === 'postgres' ? '#336791' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                PostgreSQL (EXPLAIN ANALYZE)
              </button>
              <button
                onClick={() => setExplainEngine('mysql')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: explainEngine === 'mysql' ? '700' : '500',
                  color: explainEngine === 'mysql' ? '#ffffff' : 'var(--text-muted)',
                  background: explainEngine === 'mysql' ? '#0284c7' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                MySQL (EXPLAIN TREE)
              </button>
              <button
                onClick={() => setExplainEngine('mongo')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: explainEngine === 'mongo' ? '700' : '500',
                  color: explainEngine === 'mongo' ? '#ffffff' : 'var(--text-muted)',
                  background: explainEngine === 'mongo' ? '#059669' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                🍃 MongoDB (executionStats)
              </button>
            </div>
          </div>

          {/* Code Viewer with Interactive Highlight Annotations */}
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            color: '#a7f3d0',
            lineHeight: '1.6',
            marginBottom: '16px'
          }}>
            {explainEngine === 'postgres' && (
              <>
                Hash Join  (cost=12.40..145.20 rows=80 width=64) (actual time=0.3..2.1 rows=75 loops=1)<br />
                &nbsp;&nbsp;Hash Cond: (e.dept_id = d.dept_id)<br />
                &nbsp;&nbsp;-&gt;  Seq Scan on employees e  (cost=0.00..120.00 rows=2000 ...)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#f87171' }}>Filter: (salary &gt; 50000)</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#ef4444' }}>Rows Removed by Filter: 8000</span>  <span style={{ color: '#f59e0b' }}>&lt;-- 🚩 RED FLAG: 80% rows dropped; missing index!</span><br />
                &nbsp;&nbsp;-&gt;  Hash  (cost=11.00..11.00 rows=3 ...)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt;  Seq Scan on departments d  (cost=0.00..11.00 rows=3 ...)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Filter: ((location)::text = 'Kolkata'::text)<br />
                Planning Time: 0.2 ms<br />
                Execution Time: 2.3 ms
              </>
            )}
            {explainEngine === 'mysql' && (
              <>
                -&gt; Hash inner join (e.dept_id = d.dept_id)  (cost=145.20 rows=75) (actual time=0.3..2.1 rows=75 loops=1)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;-&gt; Filter: (e.salary &gt; 50000)  (cost=120.00 rows=2000) (actual time=0.1..1.4 rows=2000 loops=1)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; Table scan on e  (cost=120.00 rows=10000)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;-&gt; Hash<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; Filter: (d.location = 'Kolkata')  (cost=11.00 rows=3) (actual time=0.02..0.04 rows=3 loops=1)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; Table scan on d  (cost=11.00 rows=10)
              </>
            )}
            {explainEngine === 'mongo' && (
              <>
                <span style={{ color: '#38bdf8' }}>// db.orders.explain("executionStats").aggregate([...])</span><br />
                &quot;winningPlan&quot;: &#123;<br />
                &nbsp;&nbsp;&quot;stage&quot;: &quot;<span style={{ color: '#34d399' }}>FETCH</span>&quot;,<br />
                &nbsp;&nbsp;&quot;inputStage&quot;: &#123;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&quot;stage&quot;: &quot;<span style={{ color: '#34d399' }}>IXSCAN</span>&quot;,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&quot;indexName&quot;: &quot;<span style={{ color: '#fbbf24' }}>status_1_totalAmount_1</span>&quot;,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&quot;direction&quot;: &quot;forward&quot;<br />
                &nbsp;&nbsp;&#125;<br />
                &#125;,<br />
                &quot;executionStats&quot;: &#123;<br />
                &nbsp;&nbsp;&quot;executionSuccess&quot;: true,<br />
                &nbsp;&nbsp;&quot;nReturned&quot;: 8420,<br />
                &nbsp;&nbsp;&quot;executionTimeMillis&quot;: 4,<br />
                &nbsp;&nbsp;&quot;totalKeysExamined&quot;: 8420,<br />
                &nbsp;&nbsp;&quot;totalDocsExamined&quot;: 8420 &nbsp;&nbsp;<span style={{ color: '#34d399' }}>&lt;-- Index Selectivity Ratio = 1.0 (Optimal!)</span><br />
                &#125;
              </>
            )}
          </div>

          {/* Red Flag Checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#f87171', marginBottom: '4px' }}>
                🚩 Rows Removed by Filter is Huge
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                The engine read thousands of rows from disk only to discard them in memory. An index on the filtered column avoids reading these dead blocks entirely.
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#fbbf24', marginBottom: '4px' }}>
                🚩 Big Gap: Estimated Rows vs Actual Rows
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                If estimated rows = 1 but actual rows = 500,000, your catalog statistics are stale! Run <code style={{ color: '#38bdf8' }}>ANALYZE</code> to refresh histograms.
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#c084fc', marginBottom: '4px' }}>
                🚩 Sort Method: External Merge Disk
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                The sort exceeded in-memory <code style={{ color: '#38bdf8' }}>work_mem</code> and spilled to disk temp files. Raise work_mem or create an index matching the ORDER BY columns.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTOPIC 5: SQL LOGICAL PROCESSING ORDER */}
      {selectedSubtopic === 'order' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '14px', marginTop: 0 }}>
            SQL Written Order vs Logical Evaluation Order
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            SQL is <em>written</em> in one order (SELECT ... FROM ... WHERE), but <em>logically evaluated</em> in another. This explains why you cannot use a SELECT alias inside the WHERE clause!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {QUERY_EXECUTION_DATA.logicalProcessingOrder.map((step) => (
              <div
                key={step.step}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                    Step {step.step}
                  </span>
                  <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                    {step.clause}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
