import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  Search,
  ArrowRight,
  ArrowLeft,
  Zap,
  Sliders,
  Database,
  Layers,
  Activity,
  GitBranch,
  Boxes,
  ShieldCheck,
  Cpu,
  Clock,
  Sparkles,
  ExternalLink,
  Code2,
  AlertTriangle,
  Lightbulb,
  CheckSquare,
  Square,
  Server,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import {
  DATABASE_TUTORIAL_LEVELS,
  DATABASE_TUTORIAL_CHAPTERS,
  DATABASE_SHARDING_TUTORIAL_QA
} from '../../data/databaseTutorialData';
import { DATABASE_ENGINES } from '../../data/databaseData';
import DatabaseShardingQA from './DatabaseShardingQA';

function MarkdownContentRenderer({ text }) {
  if (!text) return null;

  const blocks = [];
  const lines = text.split('\n');
  let currentBlock = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block detection
    if (line.trim().startsWith('```')) {
      if (currentBlock && currentBlock.type === 'code') {
        blocks.push(currentBlock);
        currentBlock = null;
      } else {
        if (currentBlock) blocks.push(currentBlock);
        const lang = line.trim().slice(3).trim();
        currentBlock = { type: 'code', lang, lines: [] };
      }
      continue;
    }

    if (currentBlock && currentBlock.type === 'code') {
      currentBlock.lines.push(line);
      continue;
    }

    // Markdown table detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (currentBlock && currentBlock.type === 'table') {
        currentBlock.lines.push(line);
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'table', lines: [line] };
      }
      continue;
    }

    if (currentBlock && currentBlock.type === 'table') {
      blocks.push(currentBlock);
      currentBlock = null;
    }

    // Bullet list detection
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      if (currentBlock && currentBlock.type === 'list') {
        currentBlock.items.push(line.trim().slice(2));
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'list', items: [line.trim().slice(2)] };
      }
      continue;
    }

    // Numbered list detection
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      if (currentBlock && currentBlock.type === 'numlist') {
        currentBlock.items.push(numMatch[2]);
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'numlist', items: [numMatch[2]] };
      }
      continue;
    }

    // Paragraph separation on blank lines
    if (line.trim() === '') {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    // Paragraph text accumulation
    if (currentBlock && currentBlock.type === 'paragraph') {
      currentBlock.text += ' ' + line.trim();
    } else {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = { type: 'paragraph', text: line.trim() };
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  // Format bold (**text**) and inline code (`code`)
  const renderFormattedInline = (str) => {
    if (typeof str !== 'string') return str;
    const parts = [];
    const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} style={{ color: '#f8fafc', fontWeight: '700' }}>
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code key={match.index} style={{
            background: 'rgba(56, 189, 248, 0.12)',
            color: '#38bdf8',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.84em',
            fontFamily: 'Consolas, monospace',
            border: '1px solid rgba(56, 189, 248, 0.25)'
          }}>
            {token.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.length > 0 ? parts : str;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'code') {
          return (
            <div key={bIdx} style={{
              background: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '12px 14px',
              fontFamily: 'Consolas, "Fira Code", monospace',
              fontSize: '0.8rem',
              color: '#38bdf8',
              overflowX: 'auto',
              lineHeight: '1.5',
              whiteSpace: 'pre',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)'
            }}>
              {block.lines.join('\n')}
            </div>
          );
        }

        if (block.type === 'table') {
          const rows = block.lines
            .map(l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()))
            .filter(r => !r.every(c => /^[-:]+$/.test(c)));

          if (rows.length === 0) return null;
          const [header, ...bodyRows] = rows;

          return (
            <div key={bIdx} style={{ overflowX: 'auto', margin: '6px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
                    {header.map((col, cIdx) => (
                      <th key={cIdx} style={{
                        padding: '8px 12px',
                        textAlign: 'left',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#fbbf24',
                        fontWeight: '700'
                      }}>
                        {renderFormattedInline(col)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent' }}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} style={{
                          padding: '7px 12px',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          color: cIdx === 0 ? '#38bdf8' : 'var(--text-muted)'
                        }}>
                          {renderFormattedInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={bIdx} style={{ margin: '0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {block.items.map((it, iIdx) => (
                <li key={iIdx} style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {renderFormattedInline(it)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'numlist') {
          return (
            <ol key={bIdx} style={{ margin: '0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {block.items.map((it, iIdx) => (
                <li key={iIdx} style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {renderFormattedInline(it)}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={bIdx} style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            {renderFormattedInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

function getEngineChapterNote(chapterId, activeEngine) {
  if (activeEngine === 'mongodb') {
    switch (chapterId) {
      case 'ch-1':
        return {
          title: '🍃 MongoDB & WiredTiger Architecture Perspective',
          note: 'MongoDB stores documents as binary JSON (BSON). The WiredTiger engine manages memory in an internal cache (defaulting to 50% RAM - 1GB) and flushes compressed B-Trees with Snappy/Zlib block compression every 60 seconds.'
        };
      case 'ch-2':
      case 'ch-5':
        return {
          title: '🍃 WiredTiger Schema Design: Embedding vs Referencing',
          note: 'Unlike SQL normalization, MongoDB favors Pragmatic Denormalization. Embed 1-to-few subdocuments to read full entities in a single atomic I/O operation. Use referencing ($lookup) for 1-to-many unbounded relationships to avoid WiredTiger document growth reallocations.'
        };
      case 'ch-3':
      case 'ch-6':
        return {
          title: '🍃 WiredTiger Driver Connection Pooling (MongoClient)',
          note: 'MongoDB drivers manage an internal socket pool (maxPoolSize=100 default). Because WiredTiger handles requests with lightweight worker threads and an internal ticket queue (128 read / 128 write tickets), thousands of clients can connect without requiring an external proxy like PgBouncer.'
        };
      case 'ch-4':
      case 'ch-9':
        return {
          title: '🍃 WiredTiger Compound Indexing: The ESR Rule',
          note: 'WiredTiger compound indexes follow the ESR rule: 1. Equality fields first, 2. Sort fields next, 3. Range fields last. In addition, Multikey indexes automatically index every array element without separate join tables.'
        };
      case 'ch-7':
      case 'ch-8':
        return {
          title: '🍃 MongoDB Aggregation Pipeline & explain("executionStats")',
          note: 'MongoDB transforms relational algebra into the Aggregation Pipeline ($match, $sort, $group, $lookup). WiredTiger explain stats display IXSCAN (index scan), FETCH (retrieving documents from WiredTiger cache), and COLLSCAN (full collection scan).'
        };
      case 'ch-10':
        return {
          title: '🍃 SARGability & Keyset Pagination in MongoDB',
          note: 'Avoid cursor.skip() for large offsets because WiredTiger must read and discard all prior documents. Use keyset cursor pagination with { _id: { $gt: lastId } } to achieve constant O(1) B-Tree seek time.'
        };
      case 'ch-11':
      case 'ch-12':
        return {
          title: '🍃 MongoDB Native Sharded Cluster Architecture',
          note: 'MongoDB provides built-in horizontal sharding: mongos query routers direct queries to shards based on the shard key (hashed or ranged). Config Server replica sets maintain chunk boundary routing tables, and the balancer migrates WiredTiger chunks dynamically.'
        };
      case 'ch-14':
        return {
          title: '🍃 Multi-Document ACID & WiredTiger Snapshot Isolation',
          note: 'MongoDB supports multi-document ACID transactions across replica sets and sharded clusters. WiredTiger maintains snapshot isolation via in-memory transaction logs. Writes acknowledge based on writeConcern: { w: "majority" }.'
        };
      default:
        return {
          title: '🍃 MongoDB (WiredTiger Storage Engine) Perspective',
          note: 'WiredTiger storage engine powers MongoDB with document-level concurrency, page compression, and memory-mapped cache buffering.'
        };
    }
  }

  if (activeEngine === 'postgres') {
    switch (chapterId) {
      case 'ch-1':
        return {
          title: '🐘 PostgreSQL Architecture Perspective',
          note: 'PostgreSQL uses an object-relational model storing table data in unordered 8KB Heap page frames, addressed by ItemPointerData (ctid block/offset). Relies on shared_buffers (typically 25% RAM) and the OS page cache.'
        };
      case 'ch-2':
      case 'ch-5':
        return {
          title: '🐘 PostgreSQL Hybrid Normalization & JSONB',
          note: 'Postgres balances rigorous 3NF/BCNF relational modeling with semi-structured JSONB columns. JSONB fields are parsed into binary format and can be indexed with GIN (Generalized Inverted Index) for fast key/value queries.'
        };
      case 'ch-3':
      case 'ch-6':
        return {
          title: '🐘 PostgreSQL Process-Per-Connection & PgBouncer',
          note: 'Postmaster forks a heavy OS process (~5-10MB RAM) for every client connection. At high concurrency (300+ connections), OS context-switching destroys CPU throughput. External connection poolers like PgBouncer in transaction mode are mandatory.'
        };
      case 'ch-4':
      case 'ch-9':
      case 'ch-13':
        return {
          title: '🐘 PostgreSQL Specialized Indexes (B-Tree, GIN, BRIN, pgvector)',
          note: 'Postgres provides diverse indexing engines: standard B-Trees for scalar lookups; GIN for JSONB and array containment; BRIN for huge append-only timeseries tables (100x smaller index); and pgvector (HNSW/IVFFlat) for AI embeddings.'
        };
      case 'ch-14':
        return {
          title: '🐘 PostgreSQL MVCC Internals (xmin, xmax & VACUUM)',
          note: 'Every table tuple header stores xmin (inserting transaction XID) and xmax (deleting/updating XID). Updates append a new version to the heap (or HOT chain). Autovacuum sweeps dead tuples to reclaim 8KB page space.'
        };
      default:
        return {
          title: '🐘 PostgreSQL (Heap Engine & MVCC) Perspective',
          note: 'PostgreSQL provides enterprise-grade ACID compliance, extensible data types, and declarative range/hash table partitioning.'
        };
    }
  }

  // Default: MySQL / SQL InnoDB
  return {
    title: '🐬 MySQL / SQL (InnoDB Engine) Perspective',
    note: 'MySQL InnoDB organizes table storage as a Clustered B+Tree index ordered by Primary Key. Secondary indexes point to the Primary Key value. ACID durability is guaranteed through Redo Log (WAL) and Undo Logs.'
  };
}

export default function DatabaseTutorial({ onNavigateToTab, activeEngine = 'sql', setActiveEngine }) {
  const [selectedLevel, setSelectedLevel] = useState('all'); // 'all' | 'basic' | 'intermediate' | 'advanced'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapId, setSelectedChapId] = useState(DATABASE_TUTORIAL_CHAPTERS[0].id);
  const [copiedKey, setCopiedKey] = useState(null);
  const [completedChapters, setCompletedChapters] = useState({ 'ch-1': true });

  // Interactive Widget 1: HikariCP Connection Pool Calculator
  const [calcCores, setCalcCores] = useState(8);
  const [calcSpindles, setCalcSpindles] = useState(1); // 1 for SSD, 2+ for HDD arrays

  // Interactive Widget 2: Leftmost Prefix Rule Tester (SQL / InnoDB)
  const [filterCustomer, setFilterCustomer] = useState(true);
  const [filterDate, setFilterDate] = useState(true);
  const [filterStatus, setFilterStatus] = useState(false);

  // Interactive Widget 3: MongoDB WiredTiger ESR Rule (Equality, Sort, Range) Tester
  const [esrOrder, setEsrOrder] = useState('ESR'); // 'ESR' | 'ERS' | 'SER' | 'RES'

  // Interactive Widget 4: Chirp App Sharding & Celebrity Salting Simulator (Chapter 12)
  const [shardingCandidateKey, setShardingCandidateKey] = useState('user_id'); // 'user_id' | 'country' | 'signup_year' | 'username'
  const [chirpTestUser, setChirpTestUser] = useState('41'); // Chris: 41, Leo: 18, Martin: 99, Lena: 500
  const [shardingClusterNodes, setShardingClusterNodes] = useState(4); // 4 or 5 shards
  const [celebrityStrategy, setCelebrityStrategy] = useState('salted_three_tier'); // 'unprotected' | 'salted_three_tier'
  const [reshardMethod, setReshardMethod] = useState('consistent_ring'); // 'naive_modulo' | 'consistent_ring'

  // Interactive Q&A Mode State
  const [tutorialTabMode, setTutorialTabMode] = useState('curriculum'); // 'curriculum' | 'sharding_qa'
  const [expandedQAs, setExpandedQAs] = useState({ 'qa-1': true, 'qa-7': true }); // default expand Q1 & Q7
  const [masteredQAs, setMasteredQAs] = useState({});
  const [selectedQACategory, setSelectedQACategory] = useState('all');

  const toggleQAExpand = (id) => {
    setExpandedQAs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleQAMastered = (id, e) => {
    e.stopPropagation();
    setMasteredQAs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAllQAs = () => {
    const all = {};
    DATABASE_SHARDING_TUTORIAL_QA.forEach(q => { all[q.id] = true; });
    setExpandedQAs(all);
  };

  const collapseAllQAs = () => {
    setExpandedQAs({});
  };

  const filteredQAs = useMemo(() => {
    if (selectedQACategory === 'all') return DATABASE_SHARDING_TUTORIAL_QA;
    return DATABASE_SHARDING_TUTORIAL_QA.filter(q => q.category.toLowerCase() === selectedQACategory.toLowerCase());
  }, [selectedQACategory]);

  const masteredCount = Object.values(masteredQAs).filter(Boolean).length;
  const masteredPct = Math.round((masteredCount / DATABASE_SHARDING_TUTORIAL_QA.length) * 100);

  // Filter chapters based on Level and Search
  const filteredChapters = useMemo(() => {
    return DATABASE_TUTORIAL_CHAPTERS.filter((chap) => {
      // Level filter
      if (selectedLevel !== 'all' && chap.level !== selectedLevel) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = chap.title.toLowerCase().includes(q);
        const matchesSubtitle = chap.subtitle.toLowerCase().includes(q);
        const matchesSummary = chap.summary.toLowerCase().includes(q);
        const matchesTags = chap.tags.some(t => t.toLowerCase().includes(q));
        return matchesTitle || matchesSubtitle || matchesSummary || matchesTags;
      }
      return true;
    });
  }, [selectedLevel, searchQuery]);

  // Active Chapter
  const currentChapter = useMemo(() => {
    return DATABASE_TUTORIAL_CHAPTERS.find(c => c.id === selectedChapId) || filteredChapters[0] || DATABASE_TUTORIAL_CHAPTERS[0];
  }, [selectedChapId, filteredChapters]);

  const currentIdx = DATABASE_TUTORIAL_CHAPTERS.findIndex(c => c.id === currentChapter.id);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleChapterComplete = (id, e) => {
    e.stopPropagation();
    setCompletedChapters(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const completedCount = Object.values(completedChapters).filter(Boolean).length;
  const progressPct = Math.round((completedCount / DATABASE_TUTORIAL_CHAPTERS.length) * 100);

  // Calculate Leftmost prefix status
  const prefixStatus = useMemo(() => {
    if (!filterCustomer && (filterDate || filterStatus)) {
      return {
        result: '❌ Full Table Scan (Index Ignored)',
        desc: 'Leftmost column (customer_id) is missing! The engine cannot use the B+Tree root navigation.',
        color: '#ef4444'
      };
    }
    if (filterCustomer && filterDate && filterStatus) {
      return {
        result: '✅ Full Composite Index Scan',
        desc: 'Matches all 3 indexed columns in exact hierarchical order. Optimal execution!',
        color: '#10b981'
      };
    }
    if (filterCustomer && filterDate && !filterStatus) {
      return {
        result: '✅ 2-Column Composite Scan',
        desc: 'Uses customer_id and order_date directly for index page filtering.',
        color: '#38bdf8'
      };
    }
    if (filterCustomer && !filterDate && filterStatus) {
      return {
        result: '⚠️ Partial Index Scan (customer_id only)',
        desc: 'Tree navigates customer_id. Because order_date was skipped, status cannot be used for B-Tree lookup and must be filtered row-by-row.',
        color: '#f59e0b'
      };
    }
    if (filterCustomer) {
      return {
        result: '✅ Single Column Index Scan',
        desc: 'Navigates the B+Tree on customer_id prefix.',
        color: '#10b981'
      };
    }
    return {
      result: 'ℹ️ No Filter Predicates',
      desc: 'Select columns to test how the B+Tree Leftmost Prefix rule behaves.',
      color: 'var(--text-dim)'
    };
  }, [filterCustomer, filterDate, filterStatus]);

  // Calculate MongoDB WiredTiger ESR rule status
  const esrStatus = useMemo(() => {
    if (esrOrder === 'ESR') {
      return {
        badge: '✅ Optimal ESR Order (Zero In-Memory Sort)',
        desc: 'Equality filters { status: "ACTIVE" } narrow candidate rows. WiredTiger traverses the B-Tree index directly in { created_at: -1 } order, then evaluates range bounds on { price: { $gte: 50 } }. No in-memory sort stage required!',
        color: '#10b981',
        pipeline: 'COLLSCAN: 0 • IXSCAN: 42 • SORT stage: NONE (Index provides sort)'
      };
    }
    if (esrOrder === 'ERS') {
      return {
        badge: '⚠️ Sub-optimal: In-Memory Sort Triggered',
        desc: 'Range on { price } precedes Sort on { created_at }. In WiredTiger B-Trees, a range boundary disrupts key sorting, forcing MongoDB to load all matching documents into an in-memory SORT stage (consuming up to 100MB RAM or spilling to disk)!',
        color: '#f59e0b',
        pipeline: 'COLLSCAN: 0 • IXSCAN: 420 • SORT stage: IN-MEMORY (RAM: 14.2 MB)'
      };
    }
    if (esrOrder === 'SER') {
      return {
        badge: '⚠️ High Index Volume: Equality Filtered Late',
        desc: 'Sort key placed first before Equality filter. WiredTiger must scan every index node in the sort order and check each document for { status: "ACTIVE" }, resulting in high index scan volume.',
        color: '#f59e0b',
        pipeline: 'COLLSCAN: 0 • IXSCAN: 50,000 • SORT stage: NONE'
      };
    }
    return {
      badge: '❌ High Disk I/O: Range Placed Leading',
      desc: 'Range filter on leading key prevents equality and sort keys from utilizing B-Tree index properties efficiently.',
      color: '#ef4444',
      pipeline: 'COLLSCAN: 0 • IXSCAN: 12,000 • SORT stage: IN-MEMORY'
    };
  }, [esrOrder]);

  // Chapter 12 Shard Key Candidate Evaluation (5 Golden Rules)
  const shardCandidateData = useMemo(() => {
    switch (shardingCandidateKey) {
      case 'user_id':
        return {
          title: 'user_id (Primary Key)',
          status: '✅ EXCELLENT PRODUCTION SHARD KEY',
          color: '#10b981',
          score: '5 / 5 Golden Rules Passed',
          cardinality: 'High: Millions of distinct integer values',
          distribution: 'Uniform sequential distribution (0, 1, 2, 3, 0...)',
          queryPattern: 'Matches 95% of queries (GET /profile, GET /posts)',
          immutability: 'Permanent: user_id is never modified',
          collocation: 'Collocates users, chirps, and likes on the same shard'
        };
      case 'country':
        return {
          title: 'country (Geographic Location)',
          status: '❌ UNSUITABLE: Severe Population Skew',
          color: '#ef4444',
          score: '1 / 5 Golden Rules Passed',
          cardinality: 'Very Low (~200 countries worldwide)',
          distribution: 'Catastrophic skew: India/US shards melt; Greenland sits empty',
          queryPattern: 'Does not match user feed lookup queries',
          immutability: 'Semi-mutable: users move across borders',
          collocation: 'Scatters user chirps across international borders'
        };
      case 'signup_year':
        return {
          title: 'signup_year (Temporal Creation)',
          status: '❌ UNSUITABLE: Massive Write Hotspot',
          color: '#ef4444',
          score: '1 / 5 Golden Rules Passed',
          cardinality: 'Extremely Low (1 value per calendar year)',
          distribution: '95% of new signups flood into the active year shard!',
          queryPattern: 'Older historical shards sit 100% idle with zero writes',
          immutability: 'Immutable once stamped',
          collocation: 'Splits active users by signup cohort'
        };
      case 'username':
        return {
          title: 'username (User Handle)',
          status: '⚠️ HIGH RISK: Mutable Key Hazard',
          color: '#f59e0b',
          score: '3 / 5 Golden Rules Passed',
          cardinality: 'High (Unique string handle)',
          distribution: 'Uniform with deterministic hash function',
          queryPattern: 'Matches username profile lookup',
          immutability: '❌ VIOLATION: If Chris renames handle, all rows must migrate across shards',
          collocation: 'Partial write failure leaves account split between shards'
        };
      default:
        return {};
    }
  }, [shardingCandidateKey]);

  // Chirp Routing Simulation
  const chirpRoutingSimulation = useMemo(() => {
    const uid = parseInt(chirpTestUser, 10) || 41;
    const isLenaCelebrity = uid === 500;

    if (isLenaCelebrity) {
      if (celebrityStrategy === 'unprotected') {
        return {
          target: 'Shard 2 (COLLAPSING UNDER LOAD)',
          color: '#ef4444',
          reads: '100,000+ reads/sec (HOTSPOT!)',
          writes: '50,000 likes/sec (Lock Contention)',
          verdict: '💥 HOTSPOT DISASTER: Shard 2 CPU at 100%. Regular users on Shard 2 are completely timed out!',
          recommendation: 'Enable 3-Tier Celebrity Fix: Dedicated Shard + Redis Cache + Key Salting.'
        };
      } else {
        return {
          target: 'Dedicated Shard 4 + Redis Cache + 10 Salted Keys (500-1 .. 500-10)',
          color: '#10b981',
          reads: '99.4% answered by Redis Cache RAM (0.3 ms)',
          writes: 'Likes salted (500-1 to 500-10) spread across Shards 0, 1, 2, 3 (5k likes/s each)',
          verdict: '✅ PROTECTED: Lena isolated on Shard 4; writes load-balanced; Shards 0-3 stay healthy at 20k reads/s.',
          recommendation: 'Optimal high-traffic celebrity architecture deployed.'
        };
      }
    }

    // Normal User
    return {
      target: `Shard ${uid % shardingClusterNodes}`,
      color: '#38bdf8',
      reads: '20,000 reads/sec (Balanced)',
      writes: 'Distributed uniformly',
      verdict: `✅ TARGETED SINGLE-SHARD ROUTE: user_id ${uid} maps directly to Shard ${uid % shardingClusterNodes}. Collocated users, chirps, and likes execute with ZERO scatter-gather!`,
      recommendation: `hash(${uid}) % ${shardingClusterNodes} = Shard ${uid % shardingClusterNodes}`
    };
  }, [chirpTestUser, celebrityStrategy, shardingClusterNodes]);

  // 20 Users Resharding Comparison (Modulo vs Consistent Hashing)
  const reshardingComparison = useMemo(() => {
    const users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const results = users.map(id => {
      const oldShard = id % 4;
      const newModuloShard = id % 5;
      const moduloMoved = oldShard !== newModuloShard;
      // On consistent ring with 4 nodes, adding 5th between 1 and 2 only moves users in that specific quadrant (approx 20%)
      const ringMoved = id % 5 === 0; // ~20% of users
      return {
        id,
        oldShard,
        newModuloShard,
        moduloMoved,
        ringMoved
      };
    });
    const moduloMovedCount = results.filter(r => r.moduloMoved).length;
    const ringMovedCount = results.filter(r => r.ringMoved).length;
    return {
      results,
      moduloMovedPct: Math.round((moduloMovedCount / users.length) * 100),
      ringMovedPct: Math.round((ringMovedCount / users.length) * 100)
    };
  }, []);

  const activeEngineObj = DATABASE_ENGINES.find(e => e.id === activeEngine) || DATABASE_ENGINES[0];
  const enginePerspective = getEngineChapterNote(currentChapter.id, activeEngine);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ================================================================= */}
      {/* 1. TOP HERO BANNER: Database Learning Path */}
      {/* ================================================================= */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
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
                Database Master Curriculum
              </span>
              <span style={{
                fontSize: '0.68rem',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                15 In-Depth Chapters
              </span>
              <span style={{
                fontSize: '0.68rem',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                Basic • Intermediate • Advanced
              </span>
            </div>

            <h1 style={{
              fontSize: '1.65rem',
              fontWeight: '800',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #ffffff, #fbbf24, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🗄️ Database Learnings: Beginner → Advanced
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0, maxWidth: '850px', lineHeight: '1.5' }}>
              Practical, example-driven curriculum based on <code style={{ color: '#fbbf24' }}>doc/database.md</code>. Master Normalization (1NF–5NF), Connection Pools (HikariCP, PgBouncer), Query Execution (Relational Algebra & AST Trees), Scaling, Consistent Hashing Sharding, B+Trees, and MVCC Transactions.
            </p>
          </div>

          {/* Progress Tracker Card */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '14px 18px',
            borderRadius: '12px',
            minWidth: '220px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-dim)' }}>
                CURRICULUM PROGRESS
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                {completedCount} / {DATABASE_TUTORIAL_CHAPTERS.length} ({progressPct}%)
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${progressPct}%`,
                height: '100%',
                background: 'linear-gradient(to right, #f59e0b, #10b981)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>

        {/* View Mode Switcher: Curriculum Chapters vs Sharding Q&A Masterclass */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
          padding: '4px',
          borderRadius: '10px',
          background: 'rgba(0, 0, 0, 0.45)',
          width: 'fit-content',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            id="btn-mode-curriculum"
            onClick={() => setTutorialTabMode('curriculum')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.78rem',
              fontWeight: tutorialTabMode === 'curriculum' ? '700' : '500',
              color: tutorialTabMode === 'curriculum' ? '#ffffff' : 'var(--text-muted)',
              background: tutorialTabMode === 'curriculum' ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' : 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <BookOpen size={14} />
            <span>Curriculum Chapters (15 Chapters)</span>
          </button>

          <button
            id="btn-mode-sharding-qa"
            onClick={() => setTutorialTabMode('sharding_qa')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.78rem',
              fontWeight: tutorialTabMode === 'sharding_qa' ? '700' : '500',
              color: tutorialTabMode === 'sharding_qa' ? '#ffffff' : 'var(--text-muted)',
              background: tutorialTabMode === 'sharding_qa' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <HelpCircle size={14} />
            <span>Interactive Sharding Q&A (10 Questions from Transcript)</span>
            <span style={{ fontSize: '0.64rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', color: '#fbbf24', fontWeight: '800' }}>
              Chirp Case Study
            </span>
          </button>
        </div>

        {/* Level Filters & Search Bar */}
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
          {/* Level Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {DATABASE_TUTORIAL_LEVELS.map((lvl) => {
              const isSelected = selectedLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? '700' : '500',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.45) 100%)'
                      : 'rgba(0, 0, 0, 0.3)',
                    border: isSelected ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{lvl.label}</span>
                  <span style={{
                    fontSize: '0.64rem',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: isSelected ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#fbbf24' : 'var(--text-dim)'
                  }}>
                    {lvl.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '6px 12px',
            borderRadius: '8px',
            width: '260px'
          }}>
            <Search size={14} color="var(--text-dim)" />
            <input
              type="text"
              placeholder="Search concepts (e.g. BCNF, B+Tree)..."
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
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. ENGINE ARCHITECTURE & STORAGE ENGINE SPOTLIGHT (DYNAMIC)      */}
      {/* ================================================================= */}
      <div className="glass-panel" style={{
        padding: '18px 22px',
        borderRadius: '16px',
        background: activeEngine === 'mongodb'
          ? 'linear-gradient(135deg, rgba(5, 150, 105, 0.18) 0%, rgba(15, 23, 42, 0.95) 100%)'
          : activeEngine === 'postgres'
            ? 'linear-gradient(135deg, rgba(51, 103, 145, 0.22) 0%, rgba(15, 23, 42, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: activeEngine === 'mongodb'
          ? '1px solid rgba(16, 185, 129, 0.45)'
          : activeEngine === 'postgres'
            ? '1px solid rgba(59, 130, 246, 0.45)'
            : '1px solid rgba(14, 165, 233, 0.45)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Header Row: Label & Engine Switchers */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: activeEngine === 'mongodb' ? '#34d399' : activeEngine === 'postgres' ? '#60a5fa' : '#38bdf8'
            }}>
              🎯 Active Engine Internals:
            </span>
            <span style={{
              fontSize: '0.86rem',
              fontWeight: '800',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {activeEngine === 'mongodb' && '🍃 MongoDB 7.x — Powered by WiredTiger Storage Engine'}
              {activeEngine === 'postgres' && '🐘 PostgreSQL 16.x — Powered by Heap Storage Engine & MVCC'}
              {activeEngine === 'sql' && '🐬 MySQL 8.x — Powered by InnoDB Storage Engine'}
            </span>
          </div>

          {/* Engine Quick Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.45)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span style={{ fontSize: '0.64rem', color: 'var(--text-dim)', padding: '0 6px', fontWeight: '700' }}>
              Switch DB:
            </span>
            {[
              { id: 'sql', label: '🐬 MySQL (InnoDB)', color: '#0284c7' },
              { id: 'postgres', label: '🐘 PostgreSQL (Heap)', color: '#336791' },
              { id: 'mongodb', label: '🍃 MongoDB (WiredTiger)', color: '#059669' }
            ].map(eng => (
              <button
                key={eng.id}
                id={`tutorial-switch-${eng.id}`}
                onClick={() => setActiveEngine && setActiveEngine(eng.id)}
                style={{
                  padding: '5px 11px',
                  borderRadius: '7px',
                  fontSize: '0.74rem',
                  fontWeight: activeEngine === eng.id ? '700' : '500',
                  color: activeEngine === eng.id ? '#ffffff' : 'var(--text-muted)',
                  background: activeEngine === eng.id ? eng.color : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: activeEngine === eng.id ? `0 2px 10px ${eng.color}80` : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {eng.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Architecture Pillars for Selected Engine */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px'
        }}>
          {/* Card 1: Storage Engine */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px 14px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '0.66rem', fontWeight: '800', textTransform: 'uppercase', color: '#fbbf24', marginBottom: '4px' }}>
              Storage Engine Model
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
              {activeEngine === 'mongodb' && 'WiredTiger Engine (Default)'}
              {activeEngine === 'postgres' && 'Heap Tables + shared_buffers'}
              {activeEngine === 'sql' && 'InnoDB Clustered B+Tree'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {activeEngine === 'mongodb' && 'Document store with compressed B-Trees (Snappy/Zlib), lock-free memory cache (50% RAM - 1GB), and 60-second background checkpoints.'}
              {activeEngine === 'postgres' && 'Unordered 8KB Heap page frames, physical ItemPointerData (ctid) routing, and independent secondary B-Trees/GIN/BRIN.'}
              {activeEngine === 'sql' && 'Table data IS a clustered index organized strictly by Primary Key. Secondary indexes store PK pointers. Redo log handles durability.'}
            </div>
          </div>

          {/* Card 2: Concurrency & Locking */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px 14px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '0.66rem', fontWeight: '800', textTransform: 'uppercase', color: '#38bdf8', marginBottom: '4px' }}>
              Concurrency & Threads
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
              {activeEngine === 'mongodb' && 'Document-Level Lock-Free'}
              {activeEngine === 'postgres' && 'Process-Per-Connection (Fork)'}
              {activeEngine === 'sql' && 'Thread-Per-Connection (Pool)'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {activeEngine === 'mongodb' && 'WiredTiger utilizes optimistic concurrency with read/write execution tickets (128 tickets default) and hazard pointers without collection lock contention.'}
              {activeEngine === 'postgres' && 'Postmaster forks an isolated OS process (~5-10MB RAM per client). PgBouncer in transaction mode recommended to avoid OS context switches.'}
              {activeEngine === 'sql' && 'Thread cache pool with row-level locks and Next-Key gap locking in Repeatable Read isolation to prevent phantom row inserts.'}
            </div>
          </div>

          {/* Card 3: Indexing Paradigm */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px 14px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '0.66rem', fontWeight: '800', textTransform: 'uppercase', color: '#34d399', marginBottom: '4px' }}>
              Indexing Rule & Anatomy
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
              {activeEngine === 'mongodb' && 'ESR Rule & Multikey Arrays'}
              {activeEngine === 'postgres' && 'B-Tree, GIN, GiST & pgvector'}
              {activeEngine === 'sql' && 'Leftmost Prefix & Covering'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {activeEngine === 'mongodb' && 'Compound indexes must follow Equality → Sort → Range (ESR). Multikey indexes index every element of nested arrays automatically.'}
              {activeEngine === 'postgres' && 'Specialized index engines: GIN for JSONB and text, BRIN for append-only logs, and HNSW/IVFFlat via pgvector for AI semantic search.'}
              {activeEngine === 'sql' && 'Composite indexes enforce strict leftmost prefix order. Covering indexes with USING INDEX completely bypass clustered table lookups.'}
            </div>
          </div>

          {/* Card 4: ACID Transactions */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px 14px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '0.66rem', fontWeight: '800', textTransform: 'uppercase', color: '#f87171', marginBottom: '4px' }}>
              Transactions & ACID
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
              {activeEngine === 'mongodb' && 'Multi-Doc ACID & w: "majority"'}
              {activeEngine === 'postgres' && 'xmin / xmax MVCC & SSI'}
              {activeEngine === 'sql' && 'Undo Rollback & Redo Log'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {activeEngine === 'mongodb' && 'WiredTiger snapshot isolation provides full multi-document ACID across replica sets and sharded clusters with writeConcern: { w: "majority" }.'}
              {activeEngine === 'postgres' && 'Every row tuple stores xmin and xmax transaction IDs. Snapshot isolation without read locks; autovacuum sweeps old dead tuples.'}
              {activeEngine === 'sql' && 'Undo logs record rollback history for snapshot isolation; Redo logs record physical page changes for ARIES crash recovery durability.'}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. CONDITIONAL VIEW: Sharding Q&A View OR Curriculum Layout      */}
      {/* ================================================================= */}
      {tutorialTabMode === 'sharding_qa' ? (
        <DatabaseShardingQA
          onSelectChapter={(chapId) => {
            setTutorialTabMode('curriculum');
            setSelectedChapId(chapId);
          }}
          onNavigateToTab={onNavigateToTab}
          activeEngine={activeEngine}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1fr) minmax(500px, 2.5fr)',
          gap: '20px',
          alignItems: 'start'
        }}>
        {/* Left: Chapter Selector List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            fontSize: '0.74rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            color: 'var(--text-dim)',
            padding: '4px 6px',
            letterSpacing: '0.04em'
          }}>
            Curriculum Chapters ({filteredChapters.length}):
          </div>

          {filteredChapters.map((chap) => {
            const isSelected = chap.id === currentChapter.id;
            const isDone = completedChapters[chap.id];

            let badgeColor = '#10b981';
            let badgeBg = 'rgba(16, 185, 129, 0.15)';
            if (chap.level === 'intermediate') {
              badgeColor = '#fbbf24';
              badgeBg = 'rgba(245, 158, 11, 0.15)';
            } else if (chap.level === 'advanced') {
              badgeColor = '#f87171';
              badgeBg = 'rgba(239, 68, 68, 0.15)';
            }

            return (
              <div
                key={chap.id}
                onClick={() => setSelectedChapId(chap.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)'
                    : 'rgba(15, 23, 42, 0.6)',
                  border: isSelected ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 16px rgba(245, 158, 11, 0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: badgeBg,
                      color: badgeColor
                    }}>
                      {chap.levelLabel}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                      Chapter {chap.chapterNumber}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleChapterComplete(chap.id, e)}
                    title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isDone ? '#10b981' : 'rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {isDone ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                </div>

                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? '700' : '600',
                  color: isSelected ? '#ffffff' : '#e2e8f0',
                  lineHeight: '1.3',
                  marginBottom: '4px'
                }}>
                  {chap.title}
                </div>

                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {chap.subtitle}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Chapter Detail Pane */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{
            padding: '28px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.92)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {/* Header: Title, Level, Read Time & Navigation Action */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: currentChapter.level === 'basic' ? 'rgba(16, 185, 129, 0.2)' : currentChapter.level === 'intermediate' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: currentChapter.level === 'basic' ? '#34d399' : currentChapter.level === 'intermediate' ? '#fbbf24' : '#f87171'
                  }}>
                    {currentChapter.levelLabel} • Chapter {currentChapter.chapterNumber}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {currentChapter.readTime}
                  </span>
                </div>

                <h2 style={{
                  fontSize: '1.45rem',
                  fontWeight: '800',
                  margin: '0 0 6px 0',
                  color: '#ffffff'
                }}>
                  {currentChapter.title}
                </h2>

                <p style={{ fontSize: '0.86rem', color: '#fbbf24', margin: 0 }}>
                  {currentChapter.subtitle}
                </p>
              </div>

              {/* Jump to Interactive Simulator Button */}
              {onNavigateToTab && currentChapter.relatedTab && (
                <button
                  onClick={() => onNavigateToTab(currentChapter.relatedTab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '9px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 12px rgba(14, 165, 233, 0.35)'
                  }}
                >
                  <Zap size={14} />
                  <span>Open Interactive Tab</span>
                </button>
              )}
            </div>

            {/* Active Engine Perspective Box */}
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: activeEngine === 'mongodb'
                ? 'rgba(16, 185, 129, 0.1)'
                : activeEngine === 'postgres'
                  ? 'rgba(59, 130, 246, 0.1)'
                  : 'rgba(14, 165, 233, 0.1)',
              border: activeEngine === 'mongodb'
                ? '1px solid rgba(16, 185, 129, 0.35)'
                : activeEngine === 'postgres'
                  ? '1px solid rgba(59, 130, 246, 0.35)'
                  : '1px solid rgba(14, 165, 233, 0.35)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>
                  {activeEngine === 'mongodb' ? '🍃' : activeEngine === 'postgres' ? '🐘' : '🐬'}
                </span>
                <div>
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    color: activeEngine === 'mongodb' ? '#34d399' : activeEngine === 'postgres' ? '#60a5fa' : '#38bdf8'
                  }}>
                    {enginePerspective.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#e2e8f0', marginTop: '2px', lineHeight: '1.4' }}>
                    {enginePerspective.note}
                  </div>
                </div>
              </div>
              <span style={{
                fontSize: '0.64rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fbbf24',
                fontFamily: 'var(--font-mono)'
              }}>
                ENGINE: {activeEngine === 'mongodb' ? 'WiredTiger' : activeEngine === 'postgres' ? 'Heap / MVCC' : 'InnoDB'}
              </span>
            </div>

            {/* Key Takeaways Box */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Sparkles size={15} color="#fbbf24" />
                <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase' }}>
                  Core Engineering Takeaways
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {currentChapter.keyTakeaways.map((point, idx) => (
                  <li key={idx} style={{ fontSize: '0.8rem', color: '#f1f5f9', lineHeight: '1.4' }}>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Chapter Sections Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {currentChapter.sections.map((sec, sIdx) => (
                <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: '#e2e8f0',
                    margin: 0,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingBottom: '6px'
                  }}>
                    {sec.heading}
                  </h3>

                  <MarkdownContentRenderer text={sec.content} />

                  {/* Optional Table */}
                  {sec.table && (
                    <div style={{ overflowX: 'auto', margin: '8px 0' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                        <thead>
                          <tr style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
                            {sec.table.headers.map((h, hIdx) => (
                              <th key={hIdx} style={{
                                padding: '8px 12px',
                                textAlign: 'left',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#fbbf24',
                                fontWeight: '700'
                              }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sec.table.rows.map((r, rIdx) => (
                            <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent' }}>
                              {r.map((cell, cIdx) => (
                                <td key={cIdx} style={{
                                  padding: '8px 12px',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  color: cIdx === 0 ? '#38bdf8' : 'var(--text-muted)',
                                  fontWeight: cIdx === 0 ? '600' : '400'
                                }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ============================================================= */}
            {/* INTERACTIVE WIDGETS SECTION ACCORDING TO CURRENT TOPIC & ENGINE */}
            {/* ============================================================= */}
            {currentChapter.id === 'ch-6' && (
              <div style={{
                marginTop: '24px',
                padding: '18px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: activeEngine === 'mongodb' ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                {activeEngine === 'mongodb' ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Cpu size={16} color="#34d399" />
                        <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#34d399', textTransform: 'uppercase' }}>
                          MongoDB WiredTiger Driver Connection Pool (MongoClient)
                        </span>
                      </div>
                      <span style={{ fontSize: '0.66rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        Driver-Managed Socket Pool
                      </span>
                    </div>

                    <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.4' }}>
                      Unlike PostgreSQL which requires PgBouncer for 300+ connections, MongoDB drivers natively maintain an internal pool of sockets (default <code>maxPoolSize: 100</code>). WiredTiger coordinates read/write operations via optimistic tickets (128 read / 128 write tickets) preventing thread contention:
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>maxPoolSize (Default)</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#34d399', fontFamily: 'var(--font-mono)' }}>100 Sockets</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Maximum active socket connections per application process</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>WiredTiger Read Tickets</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>128 Concurrent</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Optimistic read tickets executing simultaneously in RAM</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>WiredTiger Write Tickets</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>128 Concurrent</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Optimistic write tickets committing to journal</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sliders size={16} color="#38bdf8" />
                        <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase' }}>
                          Interactive HikariCP Pool Sizing Calculator ({activeEngine === 'postgres' ? 'PostgreSQL / PgBouncer' : 'MySQL InnoDB'})
                        </span>
                      </div>
                      <span style={{ fontSize: '0.66rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                        Formula: (core_count * 2) + effective_spindle_count
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                          CPU Core Count: <strong>{calcCores} vCPUs</strong>
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={64}
                          value={calcCores}
                          onChange={(e) => setCalcCores(parseInt(e.target.value))}
                          style={{ width: '100%', accentColor: '#38bdf8' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                          Effective Disk Spindles: <strong>{calcSpindles}</strong> (1 for SSD/NVMe)
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={16}
                          value={calcSpindles}
                          onChange={(e) => setCalcSpindles(parseInt(e.target.value))}
                          style={{ width: '100%', accentColor: '#38bdf8' }}
                        />
                      </div>
                    </div>

                    <div style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                        Recommended Maximum Connections per Instance:
                      </span>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                        {(calcCores * 2) + calcSpindles} Connections
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentChapter.id === 'ch-9' && (
              <div style={{
                marginTop: '24px',
                padding: '18px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: activeEngine === 'mongodb' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                {activeEngine === 'mongodb' ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layers size={16} color="#34d399" />
                        <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#34d399', textTransform: 'uppercase' }}>
                          MongoDB WiredTiger ESR Rule (Equality, Sort, Range) Live Tester
                        </span>
                      </div>
                      <span style={{ fontSize: '0.66rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        WiredTiger Engine Indexing Law
                      </span>
                    </div>

                    <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>
                      In WiredTiger, compound indexes must be created following <strong>1. Equality</strong> (exact matches), <strong>2. Sort</strong> (order direction), and <strong>3. Range</strong> (inequalities) to avoid memory-heavy <code>SORT</code> stages. Test index ordering combinations below:
                    </p>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                      {[
                        { id: 'ESR', label: '1. ESR Order: { status: 1, created_at: -1, price: 1 } (Optimal)' },
                        { id: 'ERS', label: '2. ERS Order: { status: 1, price: 1, created_at: -1 } (Range before Sort)' },
                        { id: 'SER', label: '3. SER Order: { created_at: -1, status: 1, price: 1 } (Sort before Equality)' },
                        { id: 'RES', label: '4. RES Order: { price: 1, status: 1, created_at: -1 } (Range Leading)' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          id={`esr-btn-${opt.id}`}
                          onClick={() => setEsrOrder(opt.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: esrOrder === opt.id ? '700' : '500',
                            cursor: 'pointer',
                            border: `1px solid ${esrOrder === opt.id ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                            background: esrOrder === opt.id ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0,0,0,0.3)',
                            color: esrOrder === opt.id ? '#ffffff' : 'var(--text-dim)'
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    <div style={{
                      padding: '14px',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.4)',
                      border: `1px solid ${esrStatus.color}40`
                    }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: '800', color: esrStatus.color, marginBottom: '6px' }}>
                        {esrStatus.badge}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#e2e8f0', marginBottom: '8px', lineHeight: '1.4' }}>
                        {esrStatus.desc}
                      </div>
                      <div style={{
                        fontSize: '0.72rem',
                        fontFamily: 'Consolas, monospace',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: 'rgba(0,0,0,0.5)',
                        color: '#38bdf8'
                      }}>
                        explain("executionStats") → {esrStatus.pipeline}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <GitBranch size={16} color="#fbbf24" />
                        <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase' }}>
                          Leftmost Prefix Rule Interactive Tester ({activeEngine === 'postgres' ? 'PostgreSQL' : 'MySQL InnoDB'})
                        </span>
                      </div>
                      <span style={{ fontSize: '0.66rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        Relational B+Tree Rule
                      </span>
                    </div>

                    <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      Index defined on: <code style={{ color: '#38bdf8' }}>(customer_id, order_date, status)</code>. Select which columns your SQL query includes in the WHERE clause:
                    </p>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                      <button
                        onClick={() => setFilterCustomer(!filterCustomer)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          border: `1px solid ${filterCustomer ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                          background: filterCustomer ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0,0,0,0.3)',
                          color: filterCustomer ? '#ffffff' : 'var(--text-dim)'
                        }}
                      >
                        1. customer_id (Leading) {filterCustomer ? '✓' : ''}
                      </button>

                      <button
                        onClick={() => setFilterDate(!filterDate)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          border: `1px solid ${filterDate ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                          background: filterDate ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0,0,0,0.3)',
                          color: filterDate ? '#ffffff' : 'var(--text-dim)'
                        }}
                      >
                        2. order_date {filterDate ? '✓' : ''}
                      </button>

                      <button
                        onClick={() => setFilterStatus(!filterStatus)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          border: `1px solid ${filterStatus ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                          background: filterStatus ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0,0,0,0.3)',
                          color: filterStatus ? '#ffffff' : 'var(--text-dim)'
                        }}
                      >
                        3. status {filterStatus ? '✓' : ''}
                      </button>
                    </div>

                    <div style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.4)',
                      border: `1px solid ${prefixStatus.color}40`
                    }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: '800', color: prefixStatus.color, marginBottom: '4px' }}>
                        {prefixStatus.result}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {prefixStatus.desc}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================= */}
            {/* CHAPTER 12 INTERACTIVE WIDGET: CHIRP SHARDING & SALTING LAB  */}
            {/* ============================================================= */}
            {currentChapter.id === 'ch-12' && (
              <div style={{
                marginTop: '28px',
                padding: '22px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Boxes size={18} color="#818cf8" />
                    <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#a5b4fc', textTransform: 'uppercase' }}>
                      🐤 Interactive Lab: John & Allan's "Chirp" Sharding Engine
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.66rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#c7d2fe', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
                      Transcript Case Study
                    </span>
                    <button
                      onClick={() => setTutorialTabMode('sharding_qa')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <HelpCircle size={12} />
                      <span>Open 10 Sharding Q&A</span>
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.5' }}>
                  Simulate the architectural decisions from the Chirp scaling masterclass: test the <strong>5 Golden Properties of Shard Keys</strong>, simulate <strong>Deterministic Modulo Routing</strong>, test <strong>Pop Star Lena's Hotspot & Write Salting</strong>, and observe the <strong>80% Resharding Disaster</strong> vs <strong>Consistent Hashing</strong>.
                </p>

                {/* SECTION 1: SHARD KEY 5 GOLDEN RULES TESTER */}
                <div style={{ marginBottom: '22px', background: 'rgba(0, 0, 0, 0.35)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#38bdf8', marginBottom: '8px', textTransform: 'uppercase' }}>
                    1. Test Shard Key Candidates Against the 5 Golden Rules:
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {[
                      { id: 'user_id', label: '1. user_id (Recommended)', color: '#10b981' },
                      { id: 'country', label: '2. country (Geographic)', color: '#ef4444' },
                      { id: 'signup_year', label: '3. signup_year (Temporal)', color: '#ef4444' },
                      { id: 'username', label: '4. username (Mutable handle)', color: '#f59e0b' }
                    ].map(cand => (
                      <button
                        key={cand.id}
                        id={`shard-cand-${cand.id}`}
                        onClick={() => setShardingCandidateKey(cand.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontWeight: shardingCandidateKey === cand.id ? '700' : '500',
                          cursor: 'pointer',
                          border: `1px solid ${shardingCandidateKey === cand.id ? cand.color : 'rgba(255,255,255,0.1)'}`,
                          background: shardingCandidateKey === cand.id ? `${cand.color}25` : 'rgba(0,0,0,0.3)',
                          color: shardingCandidateKey === cand.id ? '#ffffff' : 'var(--text-muted)'
                        }}
                      >
                        {cand.label}
                      </button>
                    ))}
                  </div>

                  <div style={{
                    padding: '14px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.4)',
                    border: `1px solid ${shardCandidateData.color}40`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: '800', color: shardCandidateData.color }}>
                        {shardCandidateData.status}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: `${shardCandidateData.color}20`, color: shardCandidateData.color }}>
                        {shardCandidateData.score}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.72rem', marginTop: '10px' }}>
                      <div style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Cardinality:</span> <strong style={{ color: '#ffffff' }}>{shardCandidateData.cardinality}</strong>
                      </div>
                      <div style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Distribution:</span> <strong style={{ color: '#ffffff' }}>{shardCandidateData.distribution}</strong>
                      </div>
                      <div style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Query Alignment:</span> <strong style={{ color: '#ffffff' }}>{shardCandidateData.queryPattern}</strong>
                      </div>
                      <div style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Immutability:</span> <strong style={{ color: '#ffffff' }}>{shardCandidateData.immutability}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: CHIRP USER ROUTING & LENA CELEBRITY SALTING */}
                <div style={{ marginBottom: '22px', background: 'rgba(0, 0, 0, 0.35)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#fbbf24', marginBottom: '8px', textTransform: 'uppercase' }}>
                    2. Live Routing & Celebrity Hotspot Salting Tester:
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Quick Select User:</span>
                    {[
                      { id: '41', label: 'Chris (ID 41)' },
                      { id: '18', label: 'Leo (ID 18)' },
                      { id: '99', label: 'Martin (ID 99)' },
                      { id: '500', label: '⭐ Lena Pop Star (ID 500 — 40M Followers)' }
                    ].map(u => (
                      <button
                        key={u.id}
                        onClick={() => setChirpTestUser(u.id)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: chirpTestUser === u.id ? '700' : '500',
                          background: chirpTestUser === u.id ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                          color: chirpTestUser === u.id ? '#fbbf24' : 'var(--text-muted)',
                          border: `1px solid ${chirpTestUser === u.id ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
                          cursor: 'pointer'
                        }}
                      >
                        {u.label}
                      </button>
                    ))}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Cluster Shards:</span>
                      {[4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => setShardingClusterNodes(n)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: shardingClusterNodes === n ? '700' : '500',
                            background: shardingClusterNodes === n ? '#6366f1' : 'transparent',
                            color: '#ffffff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer'
                          }}
                        >
                          {n} Nodes
                        </button>
                      ))}
                    </div>
                  </div>

                  {chirpTestUser === '500' && (
                    <div style={{ marginBottom: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#fbbf24', marginBottom: '6px' }}>
                        Celebrity Hotspot Protection Strategy:
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setCelebrityStrategy('unprotected')}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: celebrityStrategy === 'unprotected' ? '700' : '500',
                            background: celebrityStrategy === 'unprotected' ? '#ef4444' : 'rgba(0,0,0,0.3)',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          💥 1. Unprotected (Hotspot Disaster)
                        </button>
                        <button
                          onClick={() => setCelebrityStrategy('salted_three_tier')}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: celebrityStrategy === 'salted_three_tier' ? '700' : '500',
                            background: celebrityStrategy === 'salted_three_tier' ? '#10b981' : 'rgba(0,0,0,0.3)',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          🛡️ 2. 3-Tier Fix (Dedicated Shard 4 + Cache + Salted Keys 500-1..10)
                        </button>
                      </div>
                    </div>
                  )}

                  <div style={{
                    padding: '14px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.4)',
                    border: `1px solid ${chirpRoutingSimulation.color}40`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: '800', color: chirpRoutingSimulation.color }}>
                        Target: {chirpRoutingSimulation.target}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {chirpRoutingSimulation.recommendation}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '0.72rem', marginBottom: '8px' }}>
                      <div style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Read Traffic:</span> <strong style={{ color: '#ffffff' }}>{chirpRoutingSimulation.reads}</strong>
                      </div>
                      <div style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Write Traffic:</span> <strong style={{ color: '#ffffff' }}>{chirpRoutingSimulation.writes}</strong>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.74rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                      {chirpRoutingSimulation.verdict}
                    </div>
                  </div>
                </div>

                {/* SECTION 3: THE 80% RESHARDING DISASTER VS CONSISTENT HASHING */}
                <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#ec4899', textTransform: 'uppercase' }}>
                      3. Scaling from 4 to 5 Shards: The 80% Resharding Disaster
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setReshardMethod('naive_modulo')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '5px',
                          fontSize: '0.7rem',
                          fontWeight: reshardMethod === 'naive_modulo' ? '700' : '500',
                          background: reshardMethod === 'naive_modulo' ? '#ef4444' : 'rgba(255,255,255,0.05)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Naive Modulo (% N)
                      </button>
                      <button
                        onClick={() => setReshardMethod('consistent_ring')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '5px',
                          fontSize: '0.7rem',
                          fontWeight: reshardMethod === 'consistent_ring' ? '700' : '500',
                          background: reshardMethod === 'consistent_ring' ? '#10b981' : 'rgba(255,255,255,0.05)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Consistent Hashing Ring
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {reshardMethod === 'naive_modulo' ? (
                      <span style={{ color: '#f87171' }}>
                        ⚠️ <strong>Naive Modulo Crisis</strong>: Changing from <code>id % 4</code> to <code>id % 5</code> causes <strong>{reshardingComparison.moduloMovedPct}% (16 of 20 users)</strong> to change shards! In production, 80% of all rows must move across the network.
                      </span>
                    ) : (
                      <span style={{ color: '#34d399' }}>
                        ✅ <strong>Consistent Hash Ring</strong>: Adding Shard 5 between Shards 1 and 2 moves only <strong>{reshardingComparison.ringMovedPct}% (4 of 20 users)</strong>. 80% of data remains completely untouched!
                      </span>
                    )}
                  </div>

                  {/* 20 Users Mini Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '6px' }}>
                    {reshardingComparison.results.map(u => {
                      const moved = reshardMethod === 'naive_modulo' ? u.moduloMoved : u.ringMoved;
                      return (
                        <div
                          key={u.id}
                          style={{
                            padding: '6px 4px',
                            borderRadius: '6px',
                            textAlign: 'center',
                            fontSize: '0.68rem',
                            background: moved ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                            border: `1px solid ${moved ? '#ef4444' : '#10b981'}`,
                            color: moved ? '#fca5a5' : '#86efac'
                          }}
                        >
                          <div style={{ fontWeight: '800' }}>U{u.id}</div>
                          <div style={{ fontSize: '0.62rem', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                            {reshardMethod === 'naive_modulo' ? `S${u.oldShard}→S${u.newModuloShard}` : (moved ? 'S1→S5' : `S${u.oldShard}`)}
                          </div>
                          <div style={{ fontSize: '0.58rem', fontWeight: '800' }}>
                            {moved ? 'MOVES' : 'STAYS'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Chapter Navigation Bar (Prev / Next) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {currentIdx > 0 ? (
                <button
                  onClick={() => setSelectedChapId(DATABASE_TUTORIAL_CHAPTERS[currentIdx - 1].id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Ch {DATABASE_TUTORIAL_CHAPTERS[currentIdx - 1].chapterNumber}: {DATABASE_TUTORIAL_CHAPTERS[currentIdx - 1].title.slice(0, 24)}...</span>
                </button>
              ) : <div />}

              {currentIdx < DATABASE_TUTORIAL_CHAPTERS.length - 1 && (
                <button
                  onClick={() => setSelectedChapId(DATABASE_TUTORIAL_CHAPTERS[currentIdx + 1].id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.4) 100%)',
                    color: '#ffffff',
                    border: '1px solid rgba(245, 158, 11, 0.5)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '700'
                  }}
                >
                  <span>Ch {DATABASE_TUTORIAL_CHAPTERS[currentIdx + 1].chapterNumber}: {DATABASE_TUTORIAL_CHAPTERS[currentIdx + 1].title.slice(0, 24)}...</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
