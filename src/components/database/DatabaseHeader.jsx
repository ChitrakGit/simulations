import React from 'react';
import {
  Database,
  Layers,
  Activity,
  GitBranch,
  Cpu,
  ShieldCheck,
  Search,
  BookOpen,
  Boxes,
  Network,
  FileText
} from 'lucide-react';
import { DATABASE_ENGINES } from '../../data/databaseData';

export default function DatabaseHeader({
  activeEngine,
  setActiveEngine,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery
}) {
  const currentEngineObj = DATABASE_ENGINES.find(e => e.id === activeEngine) || DATABASE_ENGINES[0];

  const getTabBadge = (tabId) => {
    if (tabId === 'flow') {
      if (activeEngine === 'mongodb') return 'Sharded Cluster';
      if (activeEngine === 'postgres') return 'Postmaster Flow';
      return 'InnoDB Pipeline';
    }
    if (tabId === 'query') {
      if (activeEngine === 'mongodb') return 'Aggregation Pipeline';
      if (activeEngine === 'postgres') return 'EXPLAIN ANALYZE';
      return 'Relational Algebra';
    }
    if (tabId === 'normalization') {
      if (activeEngine === 'mongodb') return 'Embed vs Reference';
      return '1NF → 5NF Normalizer';
    }
    if (tabId === 'indexing') {
      if (activeEngine === 'mongodb') return 'Compound & Multikey';
      if (activeEngine === 'postgres') return 'GIN, GiST & BRIN';
      return 'B+Tree Prefix Rule';
    }
    if (tabId === 'scaling') {
      if (activeEngine === 'mongodb') return 'Mongos & Balancer';
      if (activeEngine === 'postgres') return 'Streaming Replication';
      return 'Master-Replica & Shards';
    }
    if (tabId === 'transactions') {
      if (activeEngine === 'mongodb') return 'Multi-Doc ACID & w:maj';
      if (activeEngine === 'postgres') return 'xmin/xmax & Vacuum';
      return 'ACID & Undo Logs';
    }
    if (tabId === 'connections') {
      if (activeEngine === 'mongodb') return 'MongoClient Pool';
      if (activeEngine === 'postgres') return 'PgBouncer Modes';
      return 'Thread Cache Pool';
    }
    if (tabId === 'tutorial') {
      return '15 Chapters';
    }
    if (tabId === 'architecture' || tabId === 'reference') {
      if (activeEngine === 'postgres') return 'PG Heap & MVCC';
      if (activeEngine === 'sql') return 'MySQL InnoDB';
      return 'Postgres vs MySQL';
    }
    return 'Roadmap';
  };

  const tabs = [
    { id: 'tutorial', num: '📚', label: 'Database Tutorial', icon: BookOpen, badge: 'Basic • Inter • Adv' },
    { id: 'architecture', num: '📑', label: 'Architecture Reference', icon: FileText, badge: getTabBadge('architecture') },
    { id: 'flow', num: '10.', label: 'Flow & Engine Pipeline', icon: Network, badge: getTabBadge('flow') },
    { id: 'query', num: '4.', label: 'Query Execution & Algebra', icon: Activity, badge: getTabBadge('query') },
    { id: 'normalization', num: '2.', label: 'Normalization & Schemas', icon: Layers, badge: getTabBadge('normalization') },
    { id: 'indexing', num: '7.', label: 'Indexing Masterclass', icon: GitBranch, badge: getTabBadge('indexing') },
    { id: 'scaling', num: '5 & 6.', label: 'Scaling & Sharding', icon: Boxes, badge: getTabBadge('scaling') },
    { id: 'transactions', num: '8.', label: 'Transactions & MVCC', icon: ShieldCheck, badge: getTabBadge('transactions') },
    { id: 'connections', num: '3.', label: 'Engine Connections', icon: Cpu, badge: getTabBadge('connections') },
    { id: 'guide', num: '1 & 9.', label: 'Fundamentals & Roadmap', icon: BookOpen, badge: getTabBadge('guide') }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
      {/* Top Banner: Engine Selector & Meta */}
      <div className="glass-panel" style={{
        padding: '16px 22px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: `1px solid ${currentEngineObj.color}35`,
        boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Engine Title & Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: currentEngineObj.accentGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${currentEngineObj.color}50`
            }}>
              <Database size={22} color="#ffffff" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  color: '#ffffff'
                }}>
                  DataCore: {currentEngineObj.name}
                </h1>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: `${currentEngineObj.color}25`,
                  color: currentEngineObj.badgeColor || '#ffffff',
                  border: `1px solid ${currentEngineObj.color}50`
                }}>
                  {currentEngineObj.badge}
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(251, 191, 36, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.35)'
                }}>
                  ⚡ Storage Engine: {currentEngineObj.storageEngineName || (currentEngineObj.id === 'mongodb' ? 'WiredTiger' : currentEngineObj.id === 'sql' ? 'InnoDB' : 'Heap Engine')}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  borderRadius: '5px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {currentEngineObj.specs.wireProtocolPort}
                </span>
              </div>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {currentEngineObj.tagline}
              </p>
            </div>
          </div>

          {/* Submenu Engine Switcher: [SQL, MONGODB, postgress] */}
          {/* <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.45)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-dim)',
              padding: '0 8px'
            }}>
              Engine Submenu:
            </span>

            {DATABASE_ENGINES.map((engine) => {
              const isSelected = activeEngine === engine.id;
              return (
                <button
                  key={engine.id}
                  id={`engine-btn-${engine.id}`}
                  onClick={() => setActiveEngine(engine.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? '700' : '500',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    background: isSelected ? engine.accentGradient : 'transparent',
                    border: isSelected ? `1px solid ${engine.color}` : '1px solid transparent',
                    cursor: 'pointer',
                    boxShadow: isSelected ? `0 2px 12px ${engine.color}50` : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>
                    {engine.id === 'sql' && '🐬 SQL (MySQL InnoDB)'}
                    {engine.id === 'postgres' && '🐘 PostgreSQL (Heap/MVCC)'}
                    {engine.id === 'mongodb' && '🍃 MongoDB (WiredTiger)'}
                  </span>
                </button>
              );
            })}
          </div> */}
        </div>
      </div>

      {/* Navigation Subtabs Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Subtabs Buttons */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`db-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 13px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: isTabActive ? '700' : '500',
                  color: isTabActive ? '#ffffff' : 'var(--text-muted)',
                  background: isTabActive
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.35) 100%)'
                    : 'transparent',
                  border: isTabActive ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid transparent',
                  boxShadow: isTabActive ? '0 2px 10px rgba(245, 158, 11, 0.25)' : 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} color={isTabActive ? '#fbbf24' : 'var(--text-dim)'} />
                {tab.num && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: isTabActive ? '#fbbf24' : 'var(--text-dim)', fontWeight: '800' }}>
                    {tab.num}
                  </span>
                )}
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.62rem',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: isTabActive ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  color: isTabActive ? '#fef08a' : 'var(--text-dim)'
                }}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Search Input */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} style={{
            position: 'absolute',
            left: '10px',
            color: 'var(--text-dim)',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Search SQL, EXPLAIN, indexes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              padding: '7px 12px 7px 30px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontFamily: 'inherit',
              width: '210px',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#fbbf24';
              e.target.style.width = '240px';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-subtle)';
              e.target.style.width = '210px';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                color: 'var(--text-dim)',
                fontSize: '0.75rem',
                padding: '2px',
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
    </div>
  );
}
