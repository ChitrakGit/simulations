import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Code2,
  Database,
  Server,
  Layers,
  Search,
  Copy,
  Check,
  Terminal,
  FileCode,
  Zap,
  Filter,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Sliders,
  Sparkles,
  X
} from 'lucide-react';
import {
  DATABASE_KEYWORDS_DATA,
  DATABASE_KEYWORDS_CATEGORIES
} from '../../data/databaseKeywordsData';

export default function DatabaseKeywordsReference({
  activeEngine = 'sql',
  setActiveEngine
}) {
  const [selectedEngine, setSelectedEngine] = useState('all'); // 'all' | 'sql' | 'postgres' | 'mongodb'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedModalKeyword, setSelectedModalKeyword] = useState(null);
  const cardRefs = useRef({});

  // Sync with prop if user switched engine in parent header
  // but allow user to filter to 'all' or specific engine within this view
  const handleEngineFilter = (engId) => {
    setSelectedEngine(engId);
    setSelectedCategory('all');
    if (engId !== 'all' && setActiveEngine) {
      setActiveEngine(engId);
    }
  };

  const visibleCategories = useMemo(() => {
    if (selectedEngine === 'all') return DATABASE_KEYWORDS_CATEGORIES;
    return DATABASE_KEYWORDS_CATEGORIES.filter(
      (cat) => !cat.engine || cat.engine === selectedEngine || cat.engine === 'all'
    );
  }, [selectedEngine]);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scrollToKeyword = (id) => {
    if (cardRefs.current[id]) {
      cardRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' });
      cardRefs.current[id].style.outline = '2px solid #38bdf8';
      setTimeout(() => {
        if (cardRefs.current[id]) {
          cardRefs.current[id].style.outline = 'none';
        }
      }, 1800);
    }
  };

  // Filter keywords based on engine, category, and search query
  const filteredKeywords = useMemo(() => {
    return DATABASE_KEYWORDS_DATA.filter((item) => {
      // Engine filter
      if (selectedEngine !== 'all') {
        if (item.engine !== selectedEngine && item.engine !== 'all') {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (item.category !== selectedCategory) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesKeyword = item.keyword.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesSyntax = item.syntax.toLowerCase().includes(query);
        const matchesExample = item.example.toLowerCase().includes(query);
        const matchesCategory = item.categoryLabel.toLowerCase().includes(query);
        if (!matchesKeyword && !matchesDesc && !matchesSyntax && !matchesExample && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [selectedEngine, selectedCategory, searchQuery]);

  // Current modal item index and prev/next navigation
  const currentModalIdx = filteredKeywords.findIndex((k) => k.id === selectedModalKeyword?.id);
  const modalHasPrev = currentModalIdx > 0;
  const modalHasNext = currentModalIdx >= 0 && currentModalIdx < filteredKeywords.length - 1;

  const handleModalPrev = () => {
    if (modalHasPrev) setSelectedModalKeyword(filteredKeywords[currentModalIdx - 1]);
  };

  const handleModalNext = () => {
    if (modalHasNext) setSelectedModalKeyword(filteredKeywords[currentModalIdx + 1]);
  };

  // Keyboard navigation & body scroll locking for modal
  useEffect(() => {
    if (!selectedModalKeyword) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedModalKeyword(null);
      } else if (e.key === 'ArrowLeft' && modalHasPrev) {
        setSelectedModalKeyword(filteredKeywords[currentModalIdx - 1]);
      } else if (e.key === 'ArrowRight' && modalHasNext) {
        setSelectedModalKeyword(filteredKeywords[currentModalIdx + 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedModalKeyword, currentModalIdx, modalHasPrev, modalHasNext, filteredKeywords]);

  // Engines list
  const engines = [
    { id: 'all', label: 'All Engines (3)', icon: Sparkles, color: '#a855f7' },
    { id: 'sql', label: 'MySQL (InnoDB)', icon: Database, color: '#0284c7' },
    { id: 'postgres', label: 'PostgreSQL (Heap/MVCC)', icon: Server, color: '#336791' },
    { id: 'mongodb', label: 'MongoDB (NoSQL/MQL)', icon: Layers, color: '#059669' }
  ];

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* ─── HERO HEADER ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        borderRadius: '20px',
        padding: '30px 32px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '18px',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)'
              }}>
                <Code2 size={20} color="#ffffff" />
              </div>
              <h1 style={{
                fontSize: '1.65rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                margin: 0,
                color: '#ffffff'
              }}>
                Database Keywords & Syntax Reference
              </h1>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.4)'
              }}>
                MySQL • PostgreSQL • MongoDB
              </span>
            </div>
            <p style={{
              margin: 0,
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              maxWidth: '850px',
              lineHeight: 1.55
            }}>
              Comprehensive categorized reference of essential DML, DDL, TCL, query clauses, PostgreSQL advanced primitives (<code>RETURNING</code>, <code>WITH RECURSIVE</code>, <code>LATERAL</code>, <code>VACUUM</code>), and MongoDB query/update operators and aggregation pipeline stages with real-world code examples.
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8' }}>
                {DATABASE_KEYWORDS_DATA.length}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Keyword Topics
              </div>
            </div>
            <div style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>
                3
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Database Engines
              </div>
            </div>
            <div style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f59e0b' }}>
                100%
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                With Examples
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTROLS: ENGINES, SEARCH & CATEGORIES ──────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: 'rgba(15, 23, 42, 0.65)',
        padding: '18px 20px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Top Controls Row: Engine Selector + Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          {/* Engine Selector Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', marginRight: '4px' }}>
              Filter Engine:
            </span>
            {engines.map((eng) => {
              const Icon = eng.icon;
              const isSelected = selectedEngine === eng.id;
              return (
                <button
                  key={eng.id}
                  onClick={() => handleEngineFilter(eng.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? '700' : '500',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    background: isSelected ? eng.color : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? `1px solid ${eng.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isSelected ? `0 2px 10px ${eng.color}55` : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={14} />
                  <span>{eng.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{
            position: 'relative',
            minWidth: '280px',
            flex: '1 1 300px',
            maxWidth: '480px'
          }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)'
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyword (e.g. RETURNING, $lookup, VACUUM, JOIN, $elemMatch)..."
              style={{
                width: '100%',
                padding: '8px 14px 8px 36px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.82rem',
                outline: 'none',
                transition: 'border-color 0.15s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#38bdf8'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', marginRight: '4px', flexShrink: 0 }}>
            Category:
          </span>
          {visibleCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  flexShrink: 0,
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#ffffff' : 'var(--text-dim)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Quick Keyword Jump Chips */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', marginRight: '2px' }}>
            Quick Jump (Click for Modal):
          </span>
          {filteredKeywords.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedModalKeyword(item)}
              title={`Click to open detail modal & example for ${item.keyword}`}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                fontWeight: '600',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                color: item.engineBadgeColor,
                border: `1px solid ${item.engineBadgeColor}44`,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${item.engineBadgeColor}22`;
                e.currentTarget.style.borderColor = item.engineBadgeColor;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = `${item.engineBadgeColor}44`;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>{item.keyword.split(',')[0].split('(')[0].trim()}</span>
              <ExternalLink size={9} style={{ opacity: 0.6 }} />
            </button>
          ))}
        </div>
      </div>

      {/* ─── KEYWORDS LIST VIEW ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4px'
      }}>
        <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Showing <span style={{ fontWeight: '700', color: '#ffffff' }}>{filteredKeywords.length}</span> keywords with working code examples
        </div>
        {(selectedEngine !== 'all' || selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedEngine('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#38bdf8',
              fontSize: '0.78rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {filteredKeywords.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <FileCode size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
          <h3 style={{ margin: '0 0 6px 0', color: '#ffffff' }}>No matching keywords found</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Try searching for another term like <code>RETURNING</code>, <code>$lookup</code>, <code>VACUUM</code>, or reset your filters.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(620px, 1fr))',
          gap: '20px'
        }}>
          {filteredKeywords.map((item) => {
            const isCopied = copiedId === item.id;
            const engineColor = item.engineBadgeColor;

            return (
              <div
                key={item.id}
                ref={(el) => (cardRefs.current[item.id] = el)}
                style={{
                  borderRadius: '16px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Card Header */}
                <div style={{
                  padding: '16px 20px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '1.05rem',
                      fontWeight: '800',
                      color: '#ffffff',
                      background: 'rgba(255, 255, 255, 0.06)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      {item.keyword}
                    </span>
                    <span style={{
                      fontSize: '0.66rem',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '5px',
                      background: `${engineColor}22`,
                      color: engineColor,
                      border: `1px solid ${engineColor}55`,
                      textTransform: 'uppercase'
                    }}>
                      {item.engineLabel}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      color: 'var(--text-dim)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '3px 8px',
                      borderRadius: '5px',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                      {item.categoryLabel}
                    </span>

                    <button
                      onClick={() => setSelectedModalKeyword(item)}
                      title={`Open full interactive modal for ${item.keyword}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        background: 'rgba(56, 189, 248, 0.12)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)';
                        e.currentTarget.style.borderColor = '#38bdf8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                      }}
                    >
                      <span>Modal</span>
                      <ExternalLink size={10} />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  flex: 1
                }}>
                  {/* Description */}
                  <p style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.55
                  }}>
                    {item.description}
                  </p>

                  {/* Syntax Block */}
                  {item.syntax && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        color: 'var(--text-dim)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}>
                        Syntax
                      </div>
                      <div style={{
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(0, 0, 0, 0.45)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        color: '#93c5fd',
                        whiteSpace: 'pre-wrap',
                        overflowX: 'auto'
                      }}>
                        {item.syntax}
                      </div>
                    </div>
                  )}

                  {/* Practical Working Example */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    marginTop: '2px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        color: '#10b981',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}>
                        <Terminal size={12} />
                        <span>Working Code Example</span>
                      </div>

                      <button
                        onClick={() => handleCopy(item.example, item.id)}
                        title="Copy code example to clipboard"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '5px',
                          background: isCopied ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                          color: isCopied ? '#6ee7b7' : 'var(--text-dim)',
                          border: isCopied ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>

                    <pre style={{
                      margin: 0,
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      fontFamily: 'monospace',
                      fontSize: '0.77rem',
                      lineHeight: 1.5,
                      color: '#f1f5f9',
                      overflowX: 'auto',
                      whiteSpace: 'pre'
                    }}>
                      <code>{item.example}</code>
                    </pre>
                  </div>

                  {/* Engine Behavior / Optimization Note */}
                  {item.outputNote && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}>
                      <Zap size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ color: '#f59e0b' }}>Engine Note: </strong>
                        {item.outputNote}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── KEYWORD DETAILS INTERACTIVE MODAL ────────────────────────────── */}
      {selectedModalKeyword && (
        <div
          id="keyword-details-modal-backdrop"
          onClick={() => setSelectedModalKeyword(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.82)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            id="keyword-details-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '860px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(145deg, #090d16 0%, #151d30 100%)',
              borderRadius: '20px',
              border: `1px solid ${selectedModalKeyword.engineBadgeColor || '#38bdf8'}88`,
              boxShadow: `0 25px 70px rgba(0, 0, 0, 0.85), 0 0 35px ${selectedModalKeyword.engineBadgeColor || '#38bdf8'}30`,
              overflow: 'hidden'
            }}
          >
            {/* Modal Top Bar */}
            <div style={{
              padding: '16px 24px',
              background: 'rgba(0, 0, 0, 0.35)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '1.2rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  {selectedModalKeyword.keyword}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: `${selectedModalKeyword.engineBadgeColor}25`,
                  color: selectedModalKeyword.engineBadgeColor,
                  border: `1px solid ${selectedModalKeyword.engineBadgeColor}66`,
                  textTransform: 'uppercase'
                }}>
                  {selectedModalKeyword.engineLabel}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-dim)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  {selectedModalKeyword.categoryLabel}
                </span>
              </div>

              {/* Close Button */}
              <button
                id="close-keyword-modal-btn"
                onClick={() => setSelectedModalKeyword(null)}
                title="Close modal (Esc)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Subheader Navigation Bar (Prev / Next & Counter) */}
            <div style={{
              padding: '8px 24px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.74rem'
            }}>
              <button
                id="prev-keyword-modal-btn"
                onClick={handleModalPrev}
                disabled={!modalHasPrev}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: modalHasPrev ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                  border: modalHasPrev ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                  color: modalHasPrev ? '#ffffff' : 'var(--text-dim)',
                  cursor: modalHasPrev ? 'pointer' : 'default',
                  opacity: modalHasPrev ? 1 : 0.4
                }}
              >
                <ChevronLeft size={14} />
                <span>Previous (←)</span>
              </button>

              <span style={{ color: 'var(--text-dim)' }}>
                Keyword <strong style={{ color: '#ffffff' }}>{currentModalIdx + 1}</strong> of <strong style={{ color: '#ffffff' }}>{filteredKeywords.length}</strong>
              </span>

              <button
                id="next-keyword-modal-btn"
                onClick={handleModalNext}
                disabled={!modalHasNext}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: modalHasNext ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                  border: modalHasNext ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                  color: modalHasNext ? '#ffffff' : 'var(--text-dim)',
                  cursor: modalHasNext ? 'pointer' : 'default',
                  opacity: modalHasNext ? 1 : 0.4
                }}
              >
                <span>Next (→)</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div style={{
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              {/* Description */}
              <div>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '6px'
                }}>
                  Purpose & Overview
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '0.94rem',
                  color: '#e2e8f0',
                  lineHeight: 1.6
                }}>
                  {selectedModalKeyword.description}
                </p>
              </div>

              {/* Syntax */}
              {selectedModalKeyword.syntax && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                  }}>
                    <div style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      color: 'var(--text-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      Formal Syntax & Signatures
                    </div>

                    <button
                      onClick={() => handleCopy(selectedModalKeyword.syntax, 'syntax-' + selectedModalKeyword.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: copiedId === 'syntax-' + selectedModalKeyword.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        color: copiedId === 'syntax-' + selectedModalKeyword.id ? '#6ee7b7' : 'var(--text-dim)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '0.68rem',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedId === 'syntax-' + selectedModalKeyword.id ? <Check size={11} /> : <Copy size={11} />}
                      <span>{copiedId === 'syntax-' + selectedModalKeyword.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <pre style={{
                    margin: 0,
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: '#040711',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontFamily: 'monospace',
                    fontSize: '0.84rem',
                    color: '#93c5fd',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto'
                  }}>
                    {selectedModalKeyword.syntax}
                  </pre>
                </div>
              )}

              {/* Working Code Example */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    color: '#10b981',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    <Terminal size={14} />
                    <span>Real-World Working Example</span>
                  </div>

                  <button
                    id="copy-modal-example-btn"
                    onClick={() => handleCopy(selectedModalKeyword.example, 'modal-' + selectedModalKeyword.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      background: copiedId === 'modal-' + selectedModalKeyword.id ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                      color: copiedId === 'modal-' + selectedModalKeyword.id ? '#6ee7b7' : '#ffffff',
                      border: copiedId === 'modal-' + selectedModalKeyword.id ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.74rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedId === 'modal-' + selectedModalKeyword.id ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedId === 'modal-' + selectedModalKeyword.id ? 'Copied Example!' : 'Copy Code'}</span>
                  </button>
                </div>

                <pre style={{
                  margin: 0,
                  padding: '16px',
                  borderRadius: '10px',
                  background: '#040711',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  lineHeight: 1.55,
                  color: '#f8fafc',
                  overflowX: 'auto',
                  whiteSpace: 'pre'
                }}>
                  <code>{selectedModalKeyword.example}</code>
                </pre>
              </div>

              {/* Engine Behavior / Optimization Note */}
              {selectedModalKeyword.outputNote && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  fontSize: '0.82rem',
                  color: '#fef08a'
                }}>
                  <Zap size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#fbbf24' }}>Engine Storage & Architecture Mechanics: </strong>
                    <span style={{ color: '#fef3c7' }}>{selectedModalKeyword.outputNote}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '12px 24px',
              background: 'rgba(0, 0, 0, 0.35)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Tip: Press <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.1)' }}>Esc</kbd> to close, or <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.1)' }}>←</kbd> <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.1)' }}>→</kbd> to navigate keywords.
              </span>

              <button
                onClick={() => setSelectedModalKeyword(null)}
                style={{
                  padding: '6px 18px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
