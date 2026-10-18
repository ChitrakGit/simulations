import React, { useState } from 'react';
import {
  Code2,
  Database,
  Wrench,
  Globe,
  Cpu,
  Box,
  Server,
  Layers,
  Boxes,
  Network,
  X,
  Activity,
  GitBranch,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export default function MainNavigation({
  activeDomain,
  setActiveDomain,
  activeDatabaseEngine = 'sql',
  setActiveDatabaseEngine,
  activeDatabaseTab = 'flow',
  setActiveDatabaseTab
}) {
  // If activeDomain is 'docker' or 'k8s', Tools is the active parent menu
  const isToolsActive = activeDomain === 'docker' || activeDomain === 'k8s' || activeDomain === 'tools';
  const isDatabasesActive = activeDomain === 'databases' || activeDomain === 'database';
  const isNetworkingActive = activeDomain === 'networking';
  const isOSActive = activeDomain === 'os' || activeDomain === 'operating-system';

  // Database submenu items [SQL, MONGODB, postgress]
  const databaseSubmenu = [
    {
      id: 'sql',
      label: 'SQL (MySQL InnoDB)',
      subtitle: 'InnoDB Engine, Relational & B+Tree',
      icon: Database,
      badge: 'InnoDB Engine',
      color: '#0284c7',
      activeGradient: 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)',
      glow: 'rgba(14, 165, 233, 0.4)'
    },
    {
      id: 'postgres',
      label: 'PostgreSQL',
      subtitle: 'Heap Engine, Process-per-conn & MVCC',
      icon: Server,
      badge: 'Heap & MVCC Engine',
      color: '#336791',
      activeGradient: 'linear-gradient(135deg, #2b567d 0%, #4a84b8 100%)',
      glow: 'rgba(51, 103, 145, 0.4)'
    },
    {
      id: 'mongodb',
      label: 'MongoDB (WiredTiger)',
      subtitle: 'WiredTiger Storage Engine & Sharding',
      icon: Layers,
      badge: 'WiredTiger Engine',
      color: '#059669',
      activeGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      glow: 'rgba(16, 185, 129, 0.4)'
    }
  ];

  // Database Topic items (Chapters 1-10 & Tutorial)
  const databaseTopics = [
    { id: 'tutorial', num: '📚', label: 'Tutorial', icon: BookOpen },
    { id: 'flow', num: '10.', label: 'Flow & Pipeline', icon: Network },
    { id: 'query', num: '4.', label: 'Query Execution', icon: Activity },
    { id: 'normalization', num: '2.', label: 'Normalization', icon: Layers },
    { id: 'indexing', num: '7.', label: 'Indexing', icon: GitBranch },
    { id: 'scaling', num: '5 & 6.', label: 'Sharding', icon: Boxes },
    { id: 'transactions', num: '8.', label: 'Transactions', icon: ShieldCheck },
    { id: 'connections', num: '3.', label: 'Connections', icon: Cpu },
    { id: 'guide', num: '1 & 9.', label: 'Roadmap', icon: BookOpen }
  ];

  // Tools submenu items
  const toolsSubmenu = [
    {
      id: 'docker',
      label: 'Docker & Containers',
      subtitle: 'Engine, xyflow & Cheat Sheet',
      icon: Box,
      badge: '89 Commands & xyflow',
      color: '#0ea5e9',
      activeGradient: 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)',
      glow: 'rgba(14, 165, 233, 0.4)',
      isActive: activeDomain === 'docker'
    },
    {
      id: 'k8s',
      label: 'Kubernetes',
      subtitle: 'Pods, Services & Clusters',
      icon: Server,
      badge: 'Coming Soon',
      color: '#6366f1',
      isComingSoon: true
    }
  ];

  // The 5 Main Menu Items:
  // 1. Programming languages (Coming Soon)
  // 2. DATABASES (Active with SQL, MongoDB, Postgres submenus)
  // 3. Tools (Active with Docker & Kubernetes submenu)
  // 4. NETWORKING (Active)
  // 5. Operating System (Active)
  const mainMenuItems = [
    {
      id: 'programming',
      num: '1',
      label: 'Programming Languages',
      sub: 'JS, Python, Go, Rust',
      icon: Code2,
      badge: 'Coming Soon',
      color: '#ec4899',
      isComingSoon: true
    },
    {
      id: 'databases',
      num: '2',
      label: 'DATABASES',
      sub: 'SQL, MongoDB, Postgres',
      icon: Database,
      badge: 'Active (Live)',
      color: '#f59e0b',
      activeGradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      glow: 'rgba(245, 158, 11, 0.4)',
      isActive: isDatabasesActive,
      onClick: () => setActiveDomain('databases')
    },
    {
      id: 'tools',
      num: '3',
      label: 'Tools',
      sub: 'Docker & Kubernetes',
      icon: Wrench,
      badge: 'Active (Docker)',
      color: '#0ea5e9',
      activeGradient: 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)',
      glow: 'rgba(14, 165, 233, 0.4)',
      isActive: isToolsActive,
      onClick: () => setActiveDomain('docker')
    },
    {
      id: 'networking',
      num: '4',
      label: 'NETWORKING',
      sub: 'Packet Tracer & Flow',
      icon: Globe,
      badge: 'Active (Live)',
      color: '#10b981',
      activeGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      glow: 'rgba(16, 185, 129, 0.4)',
      isActive: isNetworkingActive,
      onClick: () => setActiveDomain('networking')
    },
    {
      id: 'os',
      num: '5',
      label: 'Operating System',
      sub: 'Linux, Windows, macOS',
      icon: Cpu,
      badge: 'Active (Live)',
      color: '#a855f7',
      activeGradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      glow: 'rgba(168, 85, 247, 0.4)',
      isActive: isOSActive,
      onClick: () => setActiveDomain('os')
    }
  ];

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto 14px auto',
      padding: '0 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {/* PRIMARY TOP-LEVEL 5-PART MAIN MENU */}
      <div className="glass-panel" style={{
        padding: '10px 18px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.85)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Brand / Logo Hub */}
        <div 
          onClick={() => setActiveDomain(null)}
          title="Return to SimuCore Hub (Default View)"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'opacity 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Layers size={20} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '1.15rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to right, #ffffff, #c084fc, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                SimuCore Hub
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                textTransform: 'uppercase'
              }}>
                5 Core Modules
              </span>
              {activeDomain && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDomain(null);
                  }}
                  title="Close loaded topic and return to default Hub view"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.62rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#fca5a5',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                >
                  <X size={10} />
                  <span>Close Topic</span>
                </button>
              )}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Interactive Engineering Simulators & Visual Architectural Compilers
            </div>
          </div>
        </div>

        {/* The 5-Part Main Navigation Menu */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.45)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          flexWrap: 'wrap'
        }}>
          {mainMenuItems.map((item) => {
            const Icon = item.icon;

            // Disabled "Coming Soon" Items: 1. Programming languages, 2. DATABASES, 5. Operating System
            if (item.isComingSoon) {
              return (
                <div
                  key={item.id}
                  title={`${item.label} module is planned and coming soon`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--text-dim)',
                    opacity: 0.5,
                    cursor: 'not-allowed',
                    border: '1px solid transparent',
                    userSelect: 'none'
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {item.num}.
                  </span>
                  <Icon size={14} color="var(--text-dim)" />
                  <span>{item.label}</span>
                  <span style={{
                    fontSize: '0.62rem',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-dim)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    {item.badge}
                  </span>
                </div>
              );
            }

            // Active Interactive Items: 2. DATABASES, 3. Tools, 4. NETWORKING, 5. OS
            const isActive = item.isActive;

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '9px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? item.activeGradient : 'transparent',
                  boxShadow: isActive ? `0 2px 14px ${item.glow}` : 'none',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '0.72rem', color: isActive ? '#ffffff' : item.color }}>
                  {item.num}.
                </span>
                <Icon size={15} color={isActive ? '#ffffff' : item.color} />
                <span>{item.label}</span>
                <span style={{
                  fontSize: '0.64rem',
                  padding: '2px 6px',
                  borderRadius: '5px',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? '#ffffff' : item.color,
                  fontWeight: '700'
                }}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* TOOLS SUBMENU BAR (ONLY DISPLAYED WHEN TOOLS DOMAIN IS ACTIVE) */}
      {isToolsActive && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
          padding: '8px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(14, 165, 233, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Wrench size={13} />
              Tools Submenu:
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {toolsSubmenu.map((tool) => {
              const ToolIcon = tool.icon;

              if (tool.isComingSoon) {
                return (
                  <div
                    key={tool.id}
                    title="Kubernetes simulator planned for future update"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      color: 'var(--text-dim)',
                      opacity: 0.5,
                      cursor: 'not-allowed',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      background: 'rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <ToolIcon size={13} />
                    <span>{tool.label}</span>
                    <span style={{ fontSize: '0.6rem', padding: '1px 4px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)' }}>
                      {tool.badge}
                    </span>
                  </div>
                );
              }

              const isToolSelected = activeDomain === tool.id;

              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveDomain(tool.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: isToolSelected ? '700' : '500',
                    color: isToolSelected ? '#ffffff' : 'var(--text-muted)',
                    background: isToolSelected ? 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)' : 'rgba(255, 255, 255, 0.05)',
                    boxShadow: isToolSelected ? '0 2px 10px rgba(14, 165, 233, 0.35)' : 'none',
                    border: isToolSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <ToolIcon size={14} color={isToolSelected ? '#ffffff' : '#38bdf8'} />
                  <span>{tool.label}</span>
                  <span style={{
                    fontSize: '0.62rem',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: isToolSelected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(14, 165, 233, 0.15)',
                    color: isToolSelected ? '#ffffff' : '#38bdf8',
                    fontWeight: '700'
                  }}>
                    {tool.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* DATABASES SUBMENU BAR (DISPLAYED WHEN DATABASES DOMAIN IS ACTIVE) */}
      {isDatabasesActive && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.75) 100%)',
          padding: '8px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(245, 158, 11, 0.25)'
        }}>
          {/* Left: Engine Submenu Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Database size={13} />
              Engines:
            </span>

            {databaseSubmenu.map((dbItem) => {
              const DbIcon = dbItem.icon;
              const isSelected = activeDatabaseEngine === dbItem.id;
              return (
                <button
                  key={dbItem.id}
                  id={`subbar-engine-${dbItem.id}`}
                  onClick={() => {
                    setActiveDomain('databases');
                    if (setActiveDatabaseEngine) {
                      setActiveDatabaseEngine(dbItem.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? '700' : '500',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    background: isSelected ? dbItem.activeGradient : 'rgba(255, 255, 255, 0.05)',
                    boxShadow: isSelected ? `0 2px 10px ${dbItem.glow}` : 'none',
                    border: isSelected ? `1px solid ${dbItem.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <DbIcon size={14} color={isSelected ? '#ffffff' : dbItem.color} />
                  <span>{dbItem.label}</span>
                  <span style={{
                    fontSize: '0.62rem',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: isSelected ? 'rgba(255, 255, 255, 0.25)' : `${dbItem.color}20`,
                    color: isSelected ? '#ffffff' : dbItem.color,
                    fontWeight: '700'
                  }}>
                    {dbItem.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Topics Submenu Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-dim)',
              paddingRight: '4px'
            }}>
              Topics:
            </span>

            {databaseTopics.map((topic) => {
              const isTopicActive = activeDatabaseTab === topic.id;
              const TopicIcon = topic.icon;
              return (
                <button
                  key={topic.id}
                  id={`subbar-topic-${topic.id}`}
                  onClick={() => {
                    setActiveDomain('databases');
                    if (setActiveDatabaseTab) {
                      setActiveDatabaseTab(topic.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: '7px',
                    fontSize: '0.74rem',
                    fontWeight: isTopicActive ? '700' : '500',
                    color: isTopicActive ? '#ffffff' : 'var(--text-muted)',
                    background: isTopicActive
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.45) 100%)'
                      : 'rgba(255, 255, 255, 0.04)',
                    border: isTopicActive ? '1px solid rgba(245, 158, 11, 0.55)' : '1px solid rgba(255, 255, 255, 0.06)',
                    boxShadow: isTopicActive ? '0 2px 10px rgba(245, 158, 11, 0.25)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <TopicIcon size={12} color={isTopicActive ? '#fbbf24' : 'var(--text-dim)'} />
                  <span>{topic.num} {topic.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
