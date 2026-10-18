import React, { useState } from 'react';
import { 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  Info, 
  Filter, 
  ArrowRight,
  Zap,
  Tag
} from 'lucide-react';
import { CATEGORIES } from '../data/dockerCommands';

export default function CommandList({ 
  commands, 
  selectedCommand, 
  onSelectCommand, 
  onLaunchSimulation,
  activeCategory, 
  setActiveCategory,
  activeTag,
  setActiveTag
}) {
  const [copiedId, setCopiedId] = useState(null);

  // Extract all unique tags
  const allTags = ['all', ...Array.from(new Set(commands.flatMap(cmd => cmd.tags)))];

  const handleCopy = (e, cmd) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd.command);
    setCopiedId(cmd.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Category Selection Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '10px'
      }}>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="glass-panel"
              style={{
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: '10px',
                border: isActive ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)',
                background: isActive ? 'rgba(14, 165, 233, 0.12)' : 'var(--bg-glass)',
                boxShadow: isActive ? '0 0 16px rgba(14, 165, 233, 0.25)' : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '3px',
                  background: 'var(--docker-blue)'
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '0.86rem',
                  fontWeight: '600',
                  color: isActive ? '#38bdf8' : 'var(--text-main)'
                }}>
                  {cat.label}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 6px',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#38bdf8' : 'var(--text-muted)',
                  fontWeight: '600'
                }}>
                  {cat.count}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
                {cat.desc || 'Complete command repository'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub-tag filters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)', fontSize: '0.75rem', marginRight: '4px' }}>
          <Filter size={12} />
          <span>Tags:</span>
        </div>
        {allTags.slice(0, 10).map(tag => {
          const isSelected = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                fontSize: '0.72rem',
                padding: '4px 10px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#38bdf8' : 'var(--text-muted)',
                border: isSelected ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid var(--border-subtle)',
                fontWeight: isSelected ? '600' : '400'
              }}
            >
              {tag === 'all' ? 'All Tags' : `#${tag}`}
            </button>
          );
        })}
      </div>

      {/* Commands Scrollable List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxHeight: 'calc(100vh - 310px)',
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {commands.length === 0 ? (
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No commands matched your filter criteria. Try searching for a different keyword like "run", "cgroups", or "network".
          </div>
        ) : (
          commands.map((cmd) => {
            const isSelected = selectedCommand?.id === cmd.id;
            return (
              <div
                key={cmd.id}
                onClick={() => onSelectCommand(cmd)}
                className={`glass-panel ${isSelected ? 'glass-panel-active' : ''}`}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(14, 165, 233, 0.09)' : 'var(--bg-glass)',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Header: Title & Badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      color: isSelected ? '#38bdf8' : 'var(--text-main)'
                    }}>
                      {cmd.name}
                    </span>
                    <span className={`badge badge-${cmd.category}`}>
                      {cmd.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* Copy Button */}
                    <button
                      onClick={(e) => handleCopy(e, cmd)}
                      className="btn-ghost"
                      style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                      title="Copy command to clipboard"
                    >
                      {copiedId === cmd.id ? (
                        <>
                          <Check size={13} color="#10b981" />
                          <span style={{ color: '#10b981' }}>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Simulate Trigger Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCommand(cmd);
                        onLaunchSimulation(cmd);
                      }}
                      className="btn-primary"
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        gap: '4px'
                      }}
                      title="Run Motherboard-to-App simulation"
                    >
                      <Zap size={13} />
                      <span>Simulate</span>
                    </button>
                  </div>
                </div>

                {/* Command CLI Codebox */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.55)',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: '#7dd3fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  overflowX: 'auto'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#0db7ed', userSelect: 'none' }}>$</span>
                    <span style={{ whiteSpace: 'nowrap' }}>{cmd.command}</span>
                  </div>
                </div>

                {/* Summary */}
                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.4,
                  marginBottom: '8px'
                }}>
                  {cmd.summary}
                </div>

                {/* Tags & Simulation Steps Count */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                    {cmd.tags.map(t => (
                      <span key={t} className="tag-pill">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--purple-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Info size={11} />
                    {cmd.simulation?.steps?.length || 4} Hardware & Kernel Stages
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
