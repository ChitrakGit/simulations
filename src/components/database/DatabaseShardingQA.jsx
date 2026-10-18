import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Zap,
  Lightbulb,
  Search,
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { DATABASE_SHARDING_TUTORIAL_QA } from '../../data/databaseTutorialData';

export default function DatabaseShardingQA({
  onSelectChapter,
  onNavigateToTab
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQAs, setExpandedQAs] = useState({ 'qa-1': true, 'qa-7': true, 'qa-10': true });
  const [masteredQAs, setMasteredQAs] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleExpand = (id) => {
    setExpandedQAs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleMastered = (id, e) => {
    if (e) e.stopPropagation();
    setMasteredQAs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const all = {};
    DATABASE_SHARDING_TUTORIAL_QA.forEach(q => { all[q.id] = true; });
    setExpandedQAs(all);
  };

  const collapseAll = () => {
    setExpandedQAs({});
  };

  const resetProgress = () => {
    setMasteredQAs({});
  };

  // Distinct categories with counts
  const categories = useMemo(() => {
    const cats = [{ id: 'all', label: 'All Questions', count: DATABASE_SHARDING_TUTORIAL_QA.length }];
    const map = {};
    DATABASE_SHARDING_TUTORIAL_QA.forEach(q => {
      map[q.category] = (map[q.category] || 0) + 1;
    });
    Object.keys(map).forEach(cat => {
      cats.push({ id: cat.toLowerCase(), label: cat, count: map[cat] });
    });
    return cats;
  }, []);

  // Filtered Q&As
  const filteredQAs = useMemo(() => {
    return DATABASE_SHARDING_TUTORIAL_QA.filter(q => {
      if (selectedCategory !== 'all' && q.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchQ = q.question.toLowerCase().includes(query);
        const matchShort = q.shortAnswer.toLowerCase().includes(query);
        const matchFull = q.fullAnswer.toLowerCase().includes(query);
        const matchTakeaway = q.takeaway.toLowerCase().includes(query);
        return matchQ || matchShort || matchFull || matchTakeaway;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const masteredCount = Object.values(masteredQAs).filter(Boolean).length;
  const masteredPct = Math.round((masteredCount / DATABASE_SHARDING_TUTORIAL_QA.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header Overview & Progress Card */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(15, 23, 42, 0.96) 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.25)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.4)'
              }}>
                Chirp App Case Study
              </span>
              <span style={{
                fontSize: '0.68rem',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                10 Transcript-Aligned Interview Q&As
              </span>
              <span style={{
                fontSize: '0.68rem',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                Zero-Scatter-Gather Routing
              </span>
            </div>

            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: '800',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #ffffff, #fbbf24, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              💡 Database Sharding Q&A Masterclass
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0, maxWidth: '850px', lineHeight: '1.5' }}>
              Every concept from the video transcript converted into high-yield interview and systems design questions. Covers replica write bottlenecks (the 99→100 like race condition), the 5 Golden Rules of shard keys, Python process seed bugs, the 3-tier celebrity fix (dedicated shard, cache, key salting 500-1..10), naive modulo resharding disasters (80% moved), and consistent hash rings with virtual nodes.
            </p>
          </div>

          {/* Progress Tracker Card */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '14px 18px',
            borderRadius: '12px',
            minWidth: '240px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-dim)' }}>
                SHARDING MASTERY
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                {masteredCount} / {DATABASE_SHARDING_TUTORIAL_QA.length} ({masteredPct}%)
              </span>
            </div>
            <div style={{ width: '100%', height: '7px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${masteredPct}%`,
                height: '100%',
                background: masteredPct === 100
                  ? '#10b981'
                  : 'linear-gradient(to right, #f59e0b, #10b981)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.68rem', color: 'var(--text-dim)' }}>
              <span>{masteredCount === DATABASE_SHARDING_TUTORIAL_QA.length ? '🎉 All Mastered!' : `${DATABASE_SHARDING_TUTORIAL_QA.length - masteredCount} remaining`}</span>
              {masteredCount > 0 && (
                <button
                  onClick={resetProgress}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.66rem', textDecoration: 'underline' }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.74rem',
                    fontWeight: isSelected ? '700' : '500',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(217, 119, 6, 0.5) 100%)'
                      : 'rgba(0, 0, 0, 0.3)',
                    border: isSelected ? '1px solid rgba(245, 158, 11, 0.55)' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{cat.label}</span>
                  <span style={{
                    fontSize: '0.62rem',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: isSelected ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.06)',
                    color: isSelected ? '#fbbf24' : 'var(--text-dim)'
                  }}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar & Expand/Collapse Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '6px 12px',
              borderRadius: '8px',
              width: '240px'
            }}>
              <Search size={14} color="var(--text-dim)" />
              <input
                type="text"
                placeholder="Search Q&As (e.g. salting, 99->100)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.76rem',
                  width: '100%'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.7rem' }}
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={expandAll}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Expand All
            </button>

            <button
              onClick={collapseAll}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* 2. Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredQAs.length === 0 ? (
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', borderRadius: '12px', color: 'var(--text-muted)' }}>
            No questions match "{searchQuery}". Try searching for "salting", "replica", "modulo", or "collocation".
          </div>
        ) : (
          filteredQAs.map((item, idx) => {
            const isExpanded = !!expandedQAs[item.id];
            const isMastered = !!masteredQAs[item.id];

            let diffColor = '#10b981';
            let diffBg = 'rgba(16, 185, 129, 0.15)';
            if (item.difficulty.includes('Intermediate')) {
              diffColor = '#fbbf24';
              diffBg = 'rgba(245, 158, 11, 0.15)';
            } else if (item.difficulty.includes('Advanced')) {
              diffColor = '#f87171';
              diffBg = 'rgba(239, 68, 68, 0.15)';
            }

            return (
              <div
                key={item.id}
                id={`qa-card-${item.id}`}
                className="glass-panel"
                style={{
                  borderRadius: '14px',
                  border: isMastered
                    ? '1px solid rgba(16, 185, 129, 0.45)'
                    : isExpanded
                      ? '1px solid rgba(245, 158, 11, 0.45)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isMastered
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.07) 0%, rgba(15, 23, 42, 0.95) 100%)'
                    : isExpanded
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(15, 23, 42, 0.95) 100%)'
                      : 'rgba(15, 23, 42, 0.75)',
                  boxShadow: isExpanded ? '0 6px 24px rgba(0, 0, 0, 0.35)' : 'none',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden'
                }}
              >
                {/* Question Header Card */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    {/* Mastered Checkbox Button */}
                    <button
                      onClick={(e) => toggleMastered(item.id, e)}
                      title={isMastered ? 'Mark as Not Mastered' : 'Mark as Mastered'}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: isMastered ? '#10b981' : 'var(--text-dim)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {isMastered ? <CheckSquare size={20} color="#10b981" /> : <Square size={20} />}
                    </button>

                    {/* Question Number & Badges */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.64rem',
                          fontWeight: '800',
                          padding: '2px 7px',
                          borderRadius: '5px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#ffffff',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          Q{idx + 1}
                        </span>
                        <span style={{
                          fontSize: '0.64rem',
                          fontWeight: '700',
                          padding: '2px 7px',
                          borderRadius: '5px',
                          background: 'rgba(56, 189, 248, 0.15)',
                          color: '#38bdf8'
                        }}>
                          {item.category}
                        </span>
                        <span style={{
                          fontSize: '0.64rem',
                          fontWeight: '700',
                          padding: '2px 7px',
                          borderRadius: '5px',
                          background: diffBg,
                          color: diffColor
                        }}>
                          {item.difficulty}
                        </span>
                        {isMastered && (
                          <span style={{
                            fontSize: '0.64rem',
                            fontWeight: '800',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#34d399'
                          }}>
                            ✓ MASTERED
                          </span>
                        )}
                      </div>

                      {/* Question Text */}
                      <div style={{
                        fontSize: '0.94rem',
                        fontWeight: '700',
                        color: isMastered ? '#34d399' : '#ffffff',
                        lineHeight: '1.4'
                      }}>
                        {item.question}
                      </div>
                    </div>
                  </div>

                  {/* Expand / Collapse Chevron */}
                  <div style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded Content Area */}
                {isExpanded && (
                  <div style={{
                    padding: '0 20px 20px 20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    {/* Short Answer Callout (Elevator Pitch / Quick Answer) */}
                    <div style={{
                      marginTop: '16px',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(0, 0, 0, 0.4) 100%)',
                      borderLeft: '4px solid #f59e0b',
                      padding: '12px 16px',
                      borderRadius: '0 10px 10px 0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '4px' }}>
                        <Zap size={14} />
                        <span>Quick Interview TL;DR</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: '1.5', fontWeight: '500' }}>
                        {item.shortAnswer}
                      </div>
                    </div>

                    {/* Detailed Answer Section */}
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>
                        In-Depth Explanation & Architecture Analysis:
                      </div>
                      <div style={{
                        fontSize: '0.84rem',
                        color: 'var(--text-muted)',
                        lineHeight: '1.65',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit'
                      }}>
                        {item.fullAnswer}
                      </div>
                    </div>

                    {/* Code / Architecture Snippet */}
                    {item.codeExample && (
                      <div style={{
                        borderRadius: '10px',
                        background: '#090d16',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 12px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                        }}>
                          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                            Implementation Pattern
                          </span>
                          <button
                            onClick={() => handleCopy(item.codeExample, `code-${item.id}`)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'transparent',
                              border: 'none',
                              color: copiedKey === `code-${item.id}` ? '#10b981' : 'var(--text-dim)',
                              fontSize: '0.68rem',
                              cursor: 'pointer'
                            }}
                          >
                            {copiedKey === `code-${item.id}` ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copiedKey === `code-${item.id}` ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre style={{
                          margin: 0,
                          padding: '12px 16px',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#38bdf8',
                          overflowX: 'auto',
                          lineHeight: '1.5'
                        }}>
                          <code>{item.codeExample}</code>
                        </pre>
                      </div>
                    )}

                    {/* Key Takeaway Callout */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      padding: '10px 14px',
                      borderRadius: '10px'
                    }}>
                      <Lightbulb size={20} color="#fbbf24" style={{ flexShrink: 0 }} />
                      <div style={{ fontSize: '0.8rem', color: '#fef3c7', fontWeight: '600', lineHeight: '1.4' }}>
                        <span style={{ color: '#fbbf24', fontWeight: '800' }}>Key Takeaway: </span>
                        {item.takeaway}
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      paddingTop: '10px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <button
                        onClick={(e) => toggleMastered(item.id, e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.74rem',
                          fontWeight: '700',
                          background: isMastered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                          color: isMastered ? '#34d399' : 'var(--text-muted)',
                          border: isMastered ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                          cursor: 'pointer'
                        }}
                      >
                        {isMastered ? <CheckCircle2 size={14} color="#34d399" /> : <Square size={14} />}
                        <span>{isMastered ? 'Mastered (Click to Uncheck)' : 'Mark as Mastered'}</span>
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {onSelectChapter && (
                          <button
                            onClick={() => onSelectChapter('ch-12')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.74rem',
                              fontWeight: '600',
                              background: 'rgba(245, 158, 11, 0.15)',
                              color: '#fbbf24',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              cursor: 'pointer'
                            }}
                          >
                            <BookOpen size={13} />
                            <span>Test in Ch 12 Sharding Lab</span>
                          </button>
                        )}

                        {onNavigateToTab && (
                          <button
                            onClick={() => onNavigateToTab('flow')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.74rem',
                              fontWeight: '700',
                              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(14, 165, 233, 0.35) 100%)',
                              color: '#ffffff',
                              border: '1px solid rgba(56, 189, 248, 0.5)',
                              cursor: 'pointer'
                            }}
                          >
                            <Layers size={13} />
                            <span>Launch XYFlow Sharding Cluster</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 3. Bottom Callout: Hands-on Verification */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        borderRadius: '14px',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: '#38bdf8', marginBottom: '4px' }}>
            Interactive Hands-On Practice
          </div>
          <div style={{ fontSize: '0.96rem', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
            Ready to simulate the Chirp Sharding Flow & Consistent Hash Ring?
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Switch to the XYFlow Architectural Simulator to step through live packet routing across the 4 shards, trigger Lena's salted writes, or watch the 360° Consistent Hash Ring dynamically balance keys with virtual nodes.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onSelectChapter && (
            <button
              onClick={() => onSelectChapter('ch-12')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.45)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <BookOpen size={16} />
              <span>Chapter 12 Sharding Lab</span>
            </button>
          )}

          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('flow')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)'
              }}
            >
              <Layers size={16} />
              <span>Launch Chirp XYFlow Simulator</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
