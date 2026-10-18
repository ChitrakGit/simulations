import React, { useState, useEffect } from 'react';
import {
  Layers,
  Table,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Sparkles,
  Info
} from 'lucide-react';
import { NORMALIZATION_DATA } from '../../data/databaseData';

export default function NormalizationExplorer({ activeEngine = 'sql' }) {
  const [activeTab, setActiveTab] = useState(() => {
    if (activeEngine === 'mongodb') return 'mongo';
    return 'forms';
  });
  const [selectedFormIndex, setSelectedFormIndex] = useState(2); // 3NF default
  const [selectedAnomalyIndex, setSelectedAnomalyIndex] = useState(0);

  // Auto-switch to MongoDB schema design when activeEngine is mongodb
  useEffect(() => {
    if (activeEngine === 'mongodb') {
      setActiveTab('mongo');
    } else {
      setActiveTab('forms');
    }
  }, [activeEngine]);

  const activeForm = NORMALIZATION_DATA.normalForms[selectedFormIndex];
  const activeAnomaly = NORMALIZATION_DATA.anomalies[selectedAnomalyIndex];

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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={20} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
              2. Normalization & Schema Design
            </h2>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Eliminating Insertion/Update/Deletion Anomalies through 1NF → 5NF and MongoDB Embedding vs Referencing
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
            { id: 'forms', label: 'Normal Forms (1NF → 5NF)' },
            { id: 'anomalies', label: 'The 3 Anomalies' },
            { id: 'worked', label: 'Full Worked Example (0NF → 3NF)' },
            { id: 'denorm', label: 'Denormalization Trade-offs' },
            { id: 'mongo', label: 'MongoDB: Embed vs Reference' }
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
                background: activeTab === tab.id ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: NORMAL FORMS 1NF TO 5NF */}
      {activeTab === 'forms' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(360px, 1.8fr)',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* List of Normal Forms */}
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
              Select Normal Form:
            </div>
            {NORMALIZATION_DATA.normalForms.map((nf, idx) => {
              const isSelected = idx === selectedFormIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedFormIndex(idx)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? '#10b981' : 'rgba(255, 255, 255, 0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: '800', color: isSelected ? '#34d399' : '#ffffff' }}>
                      {nf.form.split(':')[0]}
                    </span>
                    <span style={{ fontSize: '0.66rem', color: isSelected ? '#10b981' : 'var(--text-dim)', fontWeight: '700' }}>
                      {isSelected ? 'INSPECTING' : 'SELECT'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {nf.rule.slice(0, 68)}...
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Form Card */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span className="badge" style={{ background: '#10b98125', color: '#34d399', border: '1px solid #10b98150', fontSize: '0.72rem' }}>
                  Normalization Rule
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: '6px 0 0 0' }}>
                  {activeForm.form}
                </h3>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Mathematical Condition & Constraint:
              </div>
              <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.6', margin: 0 }}>
                {activeForm.rule}
              </p>
            </div>

            {/* Bad vs Good Example */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '18px' }}>
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#f87171', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>❌ Violates {activeForm.form.split(':')[0]}</span>
                </div>
                <pre style={{
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#fca5a5',
                  whiteSpace: 'pre-wrap',
                  margin: 0
                }}>
                  {activeForm.badExample}
                </pre>
              </div>

              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#34d399', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✅ Satisfies {activeForm.form.split(':')[0]}</span>
                </div>
                <pre style={{
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#86efac',
                  whiteSpace: 'pre-wrap',
                  margin: 0
                }}>
                  {activeForm.goodExample}
                </pre>
              </div>
            </div>

            {/* Memory Aid */}
            {activeForm.form.includes('3NF') && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.08) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                fontSize: '0.8rem',
                color: '#fbbf24',
                fontStyle: 'italic',
                lineHeight: '1.5'
              }}>
                💡 <strong>Classic Memory Aid:</strong> "Every non-key attribute must provide a fact about <strong>the key, the whole key, and nothing but the key</strong>, so help me Codd."
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: THE THREE ANOMALIES */}
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
              The 3 Data Anomalies:
            </div>
            {NORMALIZATION_DATA.anomalies.map((ano, idx) => {
              const isSelected = idx === selectedAnomalyIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedAnomalyIndex(idx)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? '#ef4444' : 'rgba(255, 255, 255, 0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: isSelected ? '#f87171' : '#ffffff', marginBottom: '4px' }}>
                    {ano.type}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {ano.problem.slice(0, 60)}...
                  </div>
                </div>
              );
            })}
          </div>

          {/* Anomaly Simulation */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
              {activeAnomaly.type}
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#fca5a5', lineHeight: '1.5', marginBottom: '16px' }}>
              <strong>The Problem:</strong> {activeAnomaly.problem}
            </p>

            {/* Bad Table Example */}
            <div style={{
              overflowX: 'auto',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '16px'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', textAlign: 'left' }}>
                <thead style={{ background: 'rgba(0, 0, 0, 0.5)', color: '#94a3b8' }}>
                  <tr>
                    <th style={{ padding: '8px 12px' }}>student_id</th>
                    <th style={{ padding: '8px 12px' }}>student_name</th>
                    <th style={{ padding: '8px 12px' }}>course_id</th>
                    <th style={{ padding: '8px 12px' }}>course_name</th>
                    <th style={{ padding: '8px 12px' }}>instructor</th>
                    <th style={{ padding: '8px 12px' }}>instructor_phone</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#e2e8f0' }}>
                  <tr style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 12px' }}>1</td>
                    <td style={{ padding: '8px 12px' }}>Asha</td>
                    <td style={{ padding: '8px 12px' }}>C101</td>
                    <td style={{ padding: '8px 12px' }}>Databases</td>
                    <td style={{ padding: '8px 12px' }}>Dr. Rao</td>
                    <td style={{ padding: '8px 12px' }}>98xxxx01</td>
                  </tr>
                  <tr style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '8px 12px' }}>2</td>
                    <td style={{ padding: '8px 12px' }}>Ravi</td>
                    <td style={{ padding: '8px 12px' }}>C101</td>
                    <td style={{ padding: '8px 12px' }}>Databases</td>
                    <td style={{ padding: '8px 12px' }}>Dr. Rao</td>
                    <td style={{ padding: '8px 12px' }}>98xxxx01</td>
                  </tr>
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
              <strong>Architectural Fix:</strong> {activeAnomaly.solution}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: FULL WORKED EXAMPLE (CHAOS TO 3NF) */}
      {activeTab === 'worked' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            2.5 Full Worked Example: From Chaos (0NF) to Pristine 3NF
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Converting an unnormalized spreadsheet table into an ACID relational schema without redundancy.
          </p>

          {/* Raw Table */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#f87171', marginBottom: '6px' }}>
              ❌ Unnormalized Raw Table (0NF):
            </div>
            <div style={{
              overflowX: 'auto',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.05)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem', textAlign: 'left' }}>
                <thead style={{ background: 'rgba(0,0,0,0.5)', color: '#fca5a5' }}>
                  <tr>
                    {NORMALIZATION_DATA.workedExample.rawTable.headers.map((h, i) => (
                      <th key={i} style={{ padding: '8px 12px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ color: '#e2e8f0' }}>
                  <tr>
                    {NORMALIZATION_DATA.workedExample.rawTable.sampleRow.map((col, i) => (
                      <td key={i} style={{ padding: '8px 12px' }}>{col}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3NF Decomposed Schema */}
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#34d399', marginBottom: '8px' }}>
              ✅ Decomposed Schema in 3NF:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {NORMALIZATION_DATA.workedExample.normalizedTables.map((tbl, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#34d399', marginBottom: '4px' }}>
                    {tbl.name}
                  </div>
                  <pre style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#e2e8f0',
                    whiteSpace: 'pre-wrap',
                    margin: 0
                  }}>
                    {tbl.schema}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: DENORMALIZATION TRADE-OFFS */}
      {activeTab === 'denorm' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            2.6 Denormalization: When to Deliberately Break the Rules
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Normalization favors <strong>write integrity</strong>; denormalization favors <strong>read speed</strong>. Rule of thumb: Normalize first; denormalize deliberately only after measuring bottlenecks.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {NORMALIZATION_DATA.denormalizationTradeoffs.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#fbbf24', marginBottom: '4px' }}>
                  {item.strategy}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
                  {item.example}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#34d399', marginBottom: '4px' }}>
                  ✅ Benefit: {item.benefit}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#f87171' }}>
                  ❌ Trade-off: {item.drawback}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 5: MONGODB EMBED VS REFERENCE */}
      {activeTab === 'mongo' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', marginTop: 0 }}>
            MongoDB Document Schemas: Embedding vs Referencing
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            In document stores, 1NF is intentionally bypassed to avoid joins and enable single-read lookups.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#34d399', marginBottom: '6px' }}>
                Approach 1: Embedded Documents (1:Few)
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Store child entities inside an array within the parent document. Single atomic read/write.
              </div>
              <pre style={{
                padding: '10px',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.5)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: '#a7f3d0',
                margin: 0
              }}>
{`{
  _id: ObjectId("..."),
  user: "Asha",
  addresses: [
    { type: "home", city: "Kolkata" },
    { type: "office", city: "Bangalore" }
  ]
}`}
              </pre>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#38bdf8', marginBottom: '6px' }}>
                Approach 2: References / Normalized (1:Many)
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Store ObjectIDs referencing another collection to avoid hitting the 16 MB BSON document size limit.
              </div>
              <pre style={{
                padding: '10px',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.5)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: '#7dd3fc',
                margin: 0
              }}>
{`// orders collection:
{
  _id: ObjectId("..."),
  user_id: ObjectId("64a..."), // Refers to users
  total: 1250.00
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
