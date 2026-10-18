import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Activity,
  Layers,
  Database,
  Server,
  Cpu,
  ShieldCheck,
  Zap,
  Info,
  Maximize2,
  Minimize2,
  X,
  Sliders,
  CheckCircle2,
  GitBranch,
  Network
} from 'lucide-react';

// Custom Node Component for high visual polish
function DatabaseNode({ data }) {
  const isSelected = data.isActive;
  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: '12px',
      background: isSelected
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)'
        : 'rgba(15, 23, 42, 0.85)',
      border: `2px solid ${isSelected ? data.color || '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
      boxShadow: isSelected
        ? `0 0 24px ${data.color || '#38bdf8'}60, 0 8px 20px rgba(0,0,0,0.5)`
        : '0 4px 14px rgba(0, 0, 0, 0.3)',
      minWidth: '190px',
      maxWidth: '260px',
      color: '#f8fafc',
      fontFamily: 'inherit',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}>
      <Handle type="target" position={Position.Top} style={{ background: data.color || '#38bdf8' }} />
      <Handle type="target" position={Position.Left} style={{ background: data.color || '#38bdf8' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{
          fontSize: '0.62rem',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: data.color || '#38bdf8',
          background: `${data.color || '#38bdf8'}18`,
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          {data.subType || 'Stage'}
        </span>
        {isSelected && (
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: data.color || '#38bdf8',
            boxShadow: `0 0 8px ${data.color || '#38bdf8'}`
          }} />
        )}
      </div>

      <div style={{ fontSize: '0.86rem', fontWeight: '800', marginBottom: '4px', color: '#ffffff' }}>
        {data.label}
      </div>

      <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: '1.4' }}>
        {data.desc}
      </div>

      {data.badge && (
        <div style={{
          marginTop: '8px',
          fontSize: '0.65rem',
          fontFamily: 'var(--font-mono)',
          padding: '2px 6px',
          borderRadius: '4px',
          background: 'rgba(0, 0, 0, 0.4)',
          color: '#e2e8f0',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {data.badge}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: data.color || '#38bdf8' }} />
      <Handle type="source" position={Position.Right} style={{ background: data.color || '#38bdf8' }} />
    </div>
  );
}

const nodeTypes = {
  dbNode: DatabaseNode
};

// ==========================================
// SCENARIO DIAGRAM DEFINITIONS
// ==========================================
const FLOW_SCENARIOS = {
  engine_pipeline: {
    id: 'engine_pipeline',
    title: 'DB Engine & Query Execution Calling Graph',
    subtitle: 'Step-by-step internal pipeline from Client TCP -> Listener -> Worker -> Parser -> Analyzer -> Rewriter -> CBO -> Volcano Executor -> Buffer Pool -> WAL',
    steps: [
      {
        step: 1,
        nodeId: 'client',
        title: 'Application Client & Driver',
        call: 'conn = pool.acquire(); conn.send(queryPacket);',
        desc: 'App issues SQL query via socket wire protocol (SCRAM authenticated TCP connection).',
        metric: 'Wire Packet: "SELECT name, salary FROM employees WHERE salary > 50000"',
        detail: 'The application thread borrows a connection from the local pool (e.g. HikariCP or psycopg_pool) and sends an encoded wire protocol frame across a TCP/Unix socket.'
      },
      {
        step: 2,
        nodeId: 'listener',
        title: 'Engine Listener / Postmaster',
        call: 'epoll_wait() -> accept() -> assign worker',
        desc: 'Postmaster / Listener accepts socket and delegates to assigned worker process or thread.',
        metric: 'Port 5432 / 3306 • Session State Initialized',
        detail: 'PostgreSQL forks a dedicated backend process; MySQL assigns an idle worker from the thread pool. The session receives private work_mem allocations and transaction state.'
      },
      {
        step: 3,
        nodeId: 'parser',
        title: 'Parser (Lexer + Bison Grammar)',
        call: 'raw_parser("SELECT...") -> ParseTree (AST)',
        desc: 'Lexical analysis splits string into tokens; parser enforces grammar rules.',
        metric: 'AST Generated • Syntax validated (0.04 ms)',
        detail: 'Constructs the raw Abstract Syntax Tree (AST). Validates SQL grammar rules and flags syntax errors (e.g. mismatched parentheses or reserved word typos).'
      },
      {
        step: 4,
        nodeId: 'analyzer',
        title: 'Analyzer & Semantic Binder',
        call: 'parse_analyze(parseTree) -> QueryTree',
        desc: 'Resolves table & column names against System Catalog (pg_class, pg_attribute).',
        metric: 'Confirmed: "employees.salary" exists and is numeric',
        detail: 'Checks semantic correctness: confirms user permissions, resolves table names and column datatypes from the data dictionary catalog, and binds variables.'
      },
      {
        step: 5,
        nodeId: 'rewriter',
        title: 'Query Rewriter',
        call: 'pg_rewrite_query() -> Inlined QueryTree',
        desc: 'Expands database views, applies RLS policies, and folds constant expressions (1+1 -> 2).',
        metric: 'View inlining & constant simplification complete',
        detail: 'Applies database rewrite rules, expands views into base tables, injects Row-Level Security (RLS) filters, and eliminates tautologies.'
      },
      {
        step: 6,
        nodeId: 'optimizer',
        title: 'Cost-Based Optimizer (CBO Planner)',
        call: 'standard_planner() -> eval_cost() -> Best Plan',
        desc: 'Applies relational algebra pushdown (σ, π). Evaluates statistics (NDV, histograms) to choose Index Scan vs Seq Scan.',
        metric: 'Cost: 8.43 (Index Scan chosen over Seq Scan: cost 120.0)',
        detail: 'Generates equivalent logical plans, estimates I/O and CPU costs using catalog table histograms and selectivity heuristics, and selects the cheapest physical plan.'
      },
      {
        step: 7,
        nodeId: 'executor',
        title: 'Volcano Executor (Iterator Model)',
        call: 'ExecScan() -> ExecHashJoin() -> open() / next() / close()',
        desc: 'Pulls row tuples demand-driven from child operators using Volcano iterator next() loop.',
        metric: 'Pulls matching tuples through buffer cache',
        detail: 'The parent operator calls next() on its children. Index Scan reads B-Tree leaf pointers; Filter drops non-matching rows; Project extracts requested columns.'
      },
      {
        step: 8,
        nodeId: 'buffer_pool',
        title: 'Buffer Pool & Cache Manager',
        call: 'ReadBuffer() -> check clock-sweep LRU -> Hit/Miss',
        desc: 'Checks in-memory shared_buffers. If page is cached, returns instantly; else triggers disk read.',
        metric: 'Buffer Cache Hit Ratio: 99.4% (8 KB Page #412)',
        detail: 'Manages pages in RAM. Employs Clock-sweep or 2Q LRU eviction. Dirty pages are marked for background writer flushing.'
      },
      {
        step: 9,
        nodeId: 'wal_disk',
        title: 'Storage Engine & WAL (Redo Log)',
        call: 'XLogInsert() -> write() -> fdatasync() -> disk NVMe',
        desc: 'Durability guarantee: data modifications append to Write-Ahead Log before commit acknowledgment.',
        metric: 'Sequential write fsync: 0.12 ms • NVMe storage',
        detail: 'WAL records are written sequentially with fsync() guarantees. In crash scenarios, the redo log is replayed from the last checkpoint to recover clean state.'
      }
    ],
    nodes: [
      { id: 'client', position: { x: 50, y: 50 }, data: { label: 'Application Client', subType: 'Client Tier', desc: 'Driver with connection pool', badge: 'TCP Socket / Wire Protocol', color: '#0ea5e9' } },
      { id: 'listener', position: { x: 340, y: 50 }, data: { label: 'Engine Listener', subType: 'Network Daemon', desc: 'Postmaster / Thread pool', badge: 'Port 5432 / 3306', color: '#6366f1' } },
      { id: 'parser', position: { x: 630, y: 50 }, data: { label: '1. SQL Parser', subType: 'Frontend Engine', desc: 'Lexer & AST builder', badge: 'Parse Tree AST', color: '#38bdf8' } },
      { id: 'analyzer', position: { x: 630, y: 190 }, data: { label: '2. Analyzer / Binder', subType: 'Semantic Phase', desc: 'Catalog type & schema checks', badge: 'Semantic Query Tree', color: '#818cf8' } },
      { id: 'rewriter', position: { x: 630, y: 330 }, data: { label: '3. Query Rewriter', subType: 'Rule System', desc: 'Inlines views & folds constants', badge: 'Rewritten Plan', color: '#a855f7' } },
      { id: 'optimizer', position: { x: 340, y: 330 }, data: { label: '4. Cost Optimizer (CBO)', subType: 'Planner Engine', desc: 'Relational algebra & cost model', badge: 'Cheapest Physical Plan', color: '#f59e0b' } },
      { id: 'executor', position: { x: 50, y: 330 }, data: { label: '5. Volcano Executor', subType: 'Runtime Engine', desc: 'open() / next() / close() iterator', badge: 'Operator Pull Pipeline', color: '#10b981' } },
      { id: 'buffer_pool', position: { x: 50, y: 470 }, data: { label: '6. Buffer Pool', subType: 'Memory Cache', desc: 'Shared buffers & page table', badge: '8 KB / 16 KB Page Frames', color: '#ec4899' } },
      { id: 'wal_disk', position: { x: 340, y: 470 }, data: { label: '7. Storage & WAL', subType: 'Durability', desc: 'Write-Ahead Log + Tablespace', badge: 'fsync() NVMe Redo Log', color: '#f43f5e' } }
    ],
    edges: [
      { id: 'e1', source: 'client', target: 'listener', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e2', source: 'listener', target: 'parser', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e3', source: 'parser', target: 'analyzer', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e4', source: 'analyzer', target: 'rewriter', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e5', source: 'rewriter', target: 'optimizer', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e6', source: 'optimizer', target: 'executor', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e7', source: 'executor', target: 'buffer_pool', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'e8', source: 'buffer_pool', target: 'wal_disk', animated: true, markerEnd: { type: MarkerType.ArrowClosed } }
    ]
  },

  sharding_cluster: {
    id: 'sharding_cluster',
    title: 'Chirp App Sharding & Routing Data Flow',
    subtitle: 'From Client Microservices -> Redis Cache -> Sharding Proxy -> Deterministic Hashing -> Shards 0-3, Dedicated Celebrity Shard 4, and Salted Writes',
    steps: [
      {
        step: 1,
        nodeId: 'client_app',
        title: 'Chirp Microservices Client Tier',
        call: 'profileService.get({ user_id: 41 }) // Chris',
        desc: 'Profile microservice issues targeted read query for Chris (user_id = 41).',
        metric: 'Shard Key: user_id 41 (High Cardinality)',
        detail: 'The app accesses Chris\'s data. Because query predicates match the shard key, the system can route directly to one shard instead of broadcasting.'
      },
      {
        step: 2,
        nodeId: 'routing_proxy',
        title: 'Routing Proxy Layer (mongos / ProxySQL)',
        call: 'proxy.evaluateRoute(user_id = 41)',
        desc: 'Routing proxy checks if key is celebrity, checks if salted, or forwards to hash evaluator.',
        metric: 'Single-Shard Direct Route (0.05 ms)',
        detail: 'The routing layer keeps centralized shard boundaries. Normal users follow the deterministic hash rule, while celebrity IDs trigger directory overrides.'
      },
      {
        step: 3,
        nodeId: 'hash_engine',
        title: 'Deterministic Hash & Modulo Engine',
        call: 'hash(41) % 4 -> 4,821,371 % 4 = 3',
        desc: 'Computes persistent hash: user_id 41 maps to Shard 3. user_id 18 (Leo) maps to Shard 0.',
        metric: 'Persistent Murmur3 Hash (Not randomized Python hash)',
        detail: 'Deterministic hashing guarantees the same input always yields the same shard number across all servers and restarts, while adjacent IDs disperse evenly.'
      },
      {
        step: 4,
        nodeId: 'shard_3',
        title: 'Shard 3: Chris\'s Collocated Data Node',
        call: 'shard3.users.find({ id: 41 }) + chirps.find({ author_id: 41 })',
        desc: 'Chris\'s user profile, chirps, and likes all reside on Shard 3 (Collocation).',
        metric: '100% Local Join • Zero Cross-Shard Network Latency',
        detail: 'Because users, chirps, and likes are all sharded by user_id, fetching Chris\'s entire profile and feed requires querying only Shard 3 with zero network scatter-gather!'
      },
      {
        step: 5,
        nodeId: 'shard_0',
        title: 'Shard 0: Leo\'s Node (Primary Writes vs Replicas)',
        call: 'shard0.primary.incrementLikes(post_id: 99 -> 100)',
        desc: 'When Chris likes Leo\'s chirp (sitting at 99 likes), write MUST go to Shard 0 Primary.',
        metric: 'Write Serialization • Prevents 99->100 Replica Race Condition',
        detail: 'If writes went to replicas, Chris and Martin liking simultaneously would both see 99->100. Serializing writes to the Primary guarantees the true count is 101.'
      },
      {
        step: 6,
        nodeId: 'read_cache',
        title: 'Redis In-Memory Cache (Celebrity Read Shield)',
        call: 'cache.get("celebrity:500:chirps") -> HIT (0.3 ms)',
        desc: 'Pop star Lena (40M followers) posts a chirp. 100,000 reads/sec hit Redis RAM.',
        metric: '99.4% Cache Hit Ratio • Protects Shard 4 from Melting',
        detail: 'In-memory caching handles massive read volume so fans read directly from RAM without touching the database storage engine.'
      },
      {
        step: 7,
        nodeId: 'shard_4_celebrity',
        title: 'Shard 4: Dedicated Celebrity Shard (Directory Sharding)',
        call: 'directory.lookup(500) -> Dedicated Shard 4',
        desc: 'Directory routing rule overrides Lena\'s ID (500) to Shard 4, isolating her from normal users.',
        metric: 'Blast Radius Contained • Shards 0-3 Stay Normal at 20k reads/s',
        detail: 'By giving Lena a dedicated shard via Directory Sharding, her massive traffic stops degrading ordinary users who would otherwise share Shard 2.'
      },
      {
        step: 8,
        nodeId: 'salt_collector',
        title: 'Write Key Salting & Scatter-Gather Summation',
        call: 'likes.insert({ key: "500-" + rand(1..10) }) -> sum(all 10 keys)',
        desc: 'Millions of concurrent likes on Lena\'s chirp are salted (500-1..500-10) and spread across Shards 0-3.',
        metric: '10x Write Concurrency • Scatter-Gather Reads Sum Count',
        detail: 'Salting appends 1..10 to Lena\'s ID. The 10 keys hash to different shards, spreading the write load. Reading the total count queries all 10 keys and sums them.'
      }
    ],
    nodes: [
      { id: 'client_app', position: { x: 40, y: 180 }, data: { label: 'Chirp Client Services', subType: 'Microservices', desc: 'Profile, Feed & Likes API clients', badge: 'Chirp App Client', color: '#0ea5e9' } },
      { id: 'read_cache', position: { x: 300, y: 30 }, data: { label: 'Redis In-Memory Cache', subType: 'Read Shield', desc: 'Answers 99% of Lena\'s 40M follower reads', badge: 'Sub-ms RAM Cache', color: '#ec4899' } },
      { id: 'routing_proxy', position: { x: 300, y: 220 }, data: { label: 'Routing Proxy Layer', subType: 'mongos / ProxySQL', desc: 'Evaluates Shard Key & Directory Overrides', badge: 'Stateless Router', color: '#6366f1' } },
      { id: 'hash_engine', position: { x: 300, y: 410 }, data: { label: 'Deterministic Hash Engine', subType: 'MurmurHash3 / MD5', desc: 'hash(id) % 4 (avalanche distribution)', badge: 'Hash Evaluator', color: '#818cf8' } },
      { id: 'shard_0', position: { x: 620, y: 40 }, data: { label: 'Shard 0 (Leo: id 18)', subType: 'Physical Primary', desc: 'Owns user_id 18 % 4 = 0 (Chirp Primary)', badge: 'Primary + 2 Replicas', color: '#10b981' } },
      { id: 'shard_1', position: { x: 620, y: 170 }, data: { label: 'Shard 1 (Standard Users)', subType: 'Physical Primary', desc: 'Owns remainder 1 rows (Uniform Spread)', badge: 'Primary + 2 Replicas', color: '#38bdf8' } },
      { id: 'shard_2', position: { x: 620, y: 300 }, data: { label: 'Shard 2 (Standard Users)', subType: 'Physical Primary', desc: 'Owns remainder 2 rows (Normal Users)', badge: 'Primary + 2 Replicas', color: '#38bdf8' } },
      { id: 'shard_3', position: { x: 620, y: 430 }, data: { label: 'Shard 3 (Chris: id 41)', subType: 'Physical Primary', desc: 'Collocated Users, Chirps & Likes for id 41', badge: 'Primary + 2 Replicas', color: '#10b981' } },
      { id: 'shard_4_celebrity', position: { x: 920, y: 100 }, data: { label: 'Shard 4 (Lena Dedicated)', subType: 'Directory Shard', desc: 'Isolated celebrity shard for Lena (40M fans)', badge: 'Dedicated Shard', color: '#f59e0b' } },
      { id: 'salt_collector', position: { x: 920, y: 350 }, data: { label: 'Salted Likes Aggregator', subType: 'Scatter-Gather', desc: 'Sums salted keys 500-1 through 500-10', badge: 'Scatter-Gather Sum', color: '#f43f5e' } }
    ],
    edges: [
      { id: 'ce1', source: 'client_app', target: 'read_cache', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'ce2', source: 'client_app', target: 'routing_proxy', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'ce3', source: 'routing_proxy', target: 'hash_engine', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'ce4', source: 'hash_engine', target: 'shard_0', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'ce5', source: 'hash_engine', target: 'shard_1', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'ce6', source: 'hash_engine', target: 'shard_2', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'ce7', source: 'hash_engine', target: 'shard_3', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'ce8', source: 'routing_proxy', target: 'shard_4_celebrity', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'ce9', source: 'routing_proxy', target: 'salt_collector', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'ce10', source: 'salt_collector', target: 'shard_0', markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'ce11', source: 'salt_collector', target: 'shard_3', markerEnd: { type: MarkerType.ArrowClosed } }
    ]
  },

  consistent_hash_ring: {
    id: 'consistent_hash_ring',
    title: 'Consistent Hashing & Virtual Nodes Data Flow',
    subtitle: 'Circular 360° Hash Ring (0 to 2³²-1), Clockwise Seek, 1/N Re-sharding, and Virtual Node Load Balancing',
    steps: [
      {
        step: 1,
        nodeId: 'ring_client',
        title: 'Client Request: User ID 41 (Chris)',
        call: 'hash("user_41") -> 3,141,592,653',
        desc: 'Client initiates query. Key is mapped to coordinate 3,141,592,653 on the 0 to 2³²-1 hash circle.',
        metric: 'Point on Ring: 263° Angle',
        detail: 'The hash function projects all keys onto a circular continuous coordinate space where 2³²-1 wraps back to 0.'
      },
      {
        step: 2,
        nodeId: 'ring_traversal',
        title: 'Clockwise Traversal Seek',
        call: 'ring.findFirstClockwiseNode(hash = 3.14B)',
        desc: 'Router travels clockwise from 263° until hitting the first physical or virtual shard token.',
        metric: 'Encountered: Node 3 Virtual Token',
        detail: 'Every key is assigned to the nearest node located clockwise along the circumference of the circle.'
      },
      {
        step: 3,
        nodeId: 'node_add_migrate',
        title: 'Cluster Scaling: Adding Shard 5',
        call: 'ring.insertNode(Shard_5) -> moves 1/N keys',
        desc: 'New Shard 5 inserts between Shard 1 and Shard 2. Only keys in that arc migrate to Shard 5.',
        metric: 'Only 20% Keys Move (Compared to 80% with Modulo % N!)',
        detail: 'Chris on Shard 3 and Leo on Shard 0 never move! Consistent hashing eliminates the devastating 80% resharding disaster.'
      },
      {
        step: 4,
        nodeId: 'vnodes_balance',
        title: 'Virtual Nodes (vnodes) Balance & Failover',
        call: '100 vnodes per physical server',
        desc: 'Each physical machine is mapped to 100 positions around the ring, preventing non-uniform arc hot spots.',
        metric: 'Failover evenly distributed across remaining 4 nodes',
        detail: 'If Shard 2 crashes, its load is split evenly across all surviving machines rather than crashing its immediate clockwise neighbor.'
      }
    ],
    nodes: [
      { id: 'ring_client', position: { x: 50, y: 150 }, data: { label: 'Client Application', subType: 'Hash Request', desc: 'Key: "user_41" -> 3.14 Billion', badge: 'Key Coordinate', color: '#0ea5e9' } },
      { id: 'ring_traversal', position: { x: 330, y: 150 }, data: { label: '360° Circular Ring', subType: 'Routing Rule', desc: 'Clockwise walk to nearest token', badge: '0 to 2³²-1 Range', color: '#6366f1' } },
      { id: 'node_add_migrate', position: { x: 620, y: 60 }, data: { label: '1/N Resharding Migration', subType: 'Add / Remove Node', desc: 'Only adjacent arc moves (20% keys)', badge: 'Zero Global Rehash', color: '#10b981' } },
      { id: 'vnodes_balance', position: { x: 620, y: 240 }, data: { label: 'Virtual Nodes (vnodes)', subType: 'Load Equalizer', desc: '100 tokens/node prevents hot arcs', badge: 'Balanced Failover', color: '#f59e0b' } }
    ],
    edges: [
      { id: 'cr1', source: 'ring_client', target: 'ring_traversal', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'cr2', source: 'ring_traversal', target: 'node_add_migrate', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'cr3', source: 'ring_traversal', target: 'vnodes_balance', animated: true, markerEnd: { type: MarkerType.ArrowClosed } }
    ]
  },

  btree_traversal: {
    id: 'btree_traversal',
    title: 'B+Tree Index Hierarchy Traversal Flow',
    subtitle: 'Logarithmic search traversing from Root Node Page -> Branch Pages -> Leaf Page Linked List -> Heap Tuple',
    steps: [
      {
        step: 1,
        nodeId: 'btree_query',
        title: 'Search Predicate: email = "asha@x.com"',
        call: 'IndexScan(users_email_idx, "asha@x.com")',
        desc: 'Engine initiates B-Tree lookup for key "asha@x.com".',
        metric: 'Target key hash / lexical value computed',
        detail: 'The optimizer chose an Index Scan. Instead of scanning 1,000,000 table pages, the engine traverses the index depth in O(log N) time.'
      },
      {
        step: 2,
        nodeId: 'root_page',
        title: 'B+Tree Root Page (Page #1)',
        call: 'BinarySearch(["H", "P"]) -> branch page #4',
        desc: 'Inspects root routing keys. "asha" precedes "H", branch to left sub-tree.',
        metric: '1 Disk Block Read (In-Memory Buffer Cache)',
        detail: 'The root page is almost always pinned in RAM. It guides the search down to intermediate branch pages.'
      },
      {
        step: 3,
        nodeId: 'branch_page',
        title: 'Intermediate Branch Page (Page #4)',
        call: 'BinarySearch(["B", "E"]) -> leaf page #12',
        desc: 'Examines secondary boundaries. "asha" lies between "A" and "B", branch to Leaf #12.',
        metric: 'Fan-out of 500+ items per page',
        detail: 'Branch nodes hold keys and child page pointers, but never table row data. High fan-out keeps tree depth shallow (depth 3 can index 125 million rows).'
      },
      {
        step: 4,
        nodeId: 'leaf_page',
        title: 'Leaf Page #12 (Linked List)',
        call: 'BinarySearch("asha@x.com") -> TID (Block 412, Offset 8)',
        desc: 'Finds matching key entry in leaf node and retrieves tuple pointer (ctid / TID).',
        metric: 'Found TID: Page #412, Item #8',
        detail: 'Leaf pages in B+Trees are chained via doubly linked lists. This enables blazing-fast range scans without re-traversing the root.'
      },
      {
        step: 5,
        nodeId: 'heap_page',
        title: 'Table Heap Page #412',
        call: 'ReadBuffer(heap, 412) -> return Row Tuple',
        desc: 'Engine fetches actual table row from heap block #412 and checks MVCC visibility.',
        metric: 'Row payload returned: (101, "Asha", "asha@x.com")',
        detail: 'In PostgreSQL, all secondary indexes point to heap TIDs. In MySQL InnoDB, secondary indexes point to the Clustered Primary Key value.'
      }
    ],
    nodes: [
      { id: 'btree_query', position: { x: 50, y: 150 }, data: { label: 'Query Predicate', subType: 'Search Argument', desc: 'WHERE email = "asha@x.com"', badge: 'Equality Filter', color: '#0ea5e9' } },
      { id: 'root_page', position: { x: 320, y: 150 }, data: { label: 'B+Tree Root Node', subType: 'Level 0', desc: 'Top router keys [H | P]', badge: 'Page #1 (RAM Pinned)', color: '#38bdf8' } },
      { id: 'branch_page', position: { x: 580, y: 50 }, data: { label: 'Branch Node [A - G]', subType: 'Level 1', desc: 'Directs to leaf range [A - D]', badge: 'Page #4', color: '#818cf8' } },
      { id: 'leaf_page', position: { x: 840, y: 50 }, data: { label: 'Leaf Page #12', subType: 'Level 2 (Leaves)', desc: 'Key "asha@x.com" -> TID #412:8', badge: 'Doubly Linked List', color: '#10b981' } },
      { id: 'heap_page', position: { x: 840, y: 220 }, data: { label: 'Heap Table Block #412', subType: 'Storage Heap', desc: 'Extracts full row tuple', badge: 'Tuple Item #8', color: '#f59e0b' } }
    ],
    edges: [
      { id: 'bt1', source: 'btree_query', target: 'root_page', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'bt2', source: 'root_page', target: 'branch_page', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'bt3', source: 'branch_page', target: 'leaf_page', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: 'bt4', source: 'leaf_page', target: 'heap_page', animated: true, markerEnd: { type: MarkerType.ArrowClosed } }
    ]
  }
};

export default function DatabaseXYFlowSimulator({ activeEngine = 'sql' }) {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState(() => {
    if (activeEngine === 'mongodb') return 'sharding_cluster';
    return 'engine_pipeline';
  });
  const [viewMode, setViewMode] = useState('xyflow'); // 'xyflow' | 'stepper'
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.5x, 1x, 2x
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Synchronize scenario when database engine changes
  useEffect(() => {
    if (activeEngine === 'mongodb') {
      setSelectedScenarioKey('sharding_cluster');
      setCurrentStepIndex(0);
    } else if (activeEngine === 'postgres' || activeEngine === 'sql') {
      setSelectedScenarioKey('engine_pipeline');
      setCurrentStepIndex(0);
    }
  }, [activeEngine]);

  // Handle ESC key for exiting full screen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Lock body scroll during full screen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);

  const activeScenario = FLOW_SCENARIOS[selectedScenarioKey] || FLOW_SCENARIOS.engine_pipeline;

  // Setup nodes & edges for xyflow
  const initialNodes = useMemo(() => {
    const currentStep = activeScenario.steps[currentStepIndex];
    return activeScenario.nodes.map(node => {
      const isCurrentActive = currentStep && currentStep.nodeId === node.id;
      return {
        ...node,
        type: 'dbNode',
        data: {
          ...node.data,
          isActive: isCurrentActive
        }
      };
    });
  }, [activeScenario, currentStepIndex]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(activeScenario.edges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(activeScenario.edges);
  }, [initialNodes, activeScenario, setNodes, setEdges]);

  // Stepper Autoplay Timer
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      const intervalMs = 2600 / speed;
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= activeScenario.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, speed, activeScenario.steps.length]);

  const handleNextStep = () => {
    if (currentStepIndex < activeScenario.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const currentStep = activeScenario.steps[currentStepIndex] || activeScenario.steps[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Simulator Control Header */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Scenario Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Flow Scenario:
          </span>

          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.35)', padding: '3px', borderRadius: '10px' }}>
            <button
              onClick={() => { setSelectedScenarioKey('engine_pipeline'); setCurrentStepIndex(0); setIsPlaying(false); }}
              style={{
                padding: '6px 12px',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: selectedScenarioKey === 'engine_pipeline' ? '700' : '500',
                color: selectedScenarioKey === 'engine_pipeline' ? '#ffffff' : 'var(--text-muted)',
                background: selectedScenarioKey === 'engine_pipeline' ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              1. Engine & Query Pipeline
            </button>

            <button
              onClick={() => { setSelectedScenarioKey('sharding_cluster'); setCurrentStepIndex(0); setIsPlaying(false); }}
              style={{
                padding: '6px 12px',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: selectedScenarioKey === 'sharding_cluster' ? '700' : '500',
                color: selectedScenarioKey === 'sharding_cluster' ? '#ffffff' : 'var(--text-muted)',
                background: selectedScenarioKey === 'sharding_cluster' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              2. Chirp Sharding Data Flow
            </button>

            <button
              onClick={() => { setSelectedScenarioKey('consistent_hash_ring'); setCurrentStepIndex(0); setIsPlaying(false); }}
              style={{
                padding: '6px 12px',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: selectedScenarioKey === 'consistent_hash_ring' ? '700' : '500',
                color: selectedScenarioKey === 'consistent_hash_ring' ? '#ffffff' : 'var(--text-muted)',
                background: selectedScenarioKey === 'consistent_hash_ring' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              3. Consistent Hash Ring & VNodes
            </button>

            <button
              onClick={() => { setSelectedScenarioKey('btree_traversal'); setCurrentStepIndex(0); setIsPlaying(false); }}
              style={{
                padding: '6px 12px',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: selectedScenarioKey === 'btree_traversal' ? '700' : '500',
                color: selectedScenarioKey === 'btree_traversal' ? '#ffffff' : 'var(--text-muted)',
                background: selectedScenarioKey === 'btree_traversal' ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              4. B+Tree Index Traversal
            </button>
          </div>
        </div>

        {/* View Toggle (xyflow vs Step Flow) & Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* xyflow / Stepper Switcher */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setViewMode('xyflow')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: viewMode === 'xyflow' ? '700' : '500',
                color: viewMode === 'xyflow' ? '#ffffff' : 'var(--text-muted)',
                background: viewMode === 'xyflow' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Interactive Canvas (xyflow)
            </button>
            <button
              onClick={() => setViewMode('stepper')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: viewMode === 'stepper' ? '700' : '500',
                color: viewMode === 'stepper' ? '#ffffff' : 'var(--text-muted)',
                background: viewMode === 'stepper' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Sequential Stepper Flow
            </button>
          </div>

          {/* Stepper Buttons */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: '700',
              color: '#ffffff',
              background: isPlaying ? '#ef4444' : '#10b981',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: currentStepIndex === 0 ? 'var(--text-dim)' : '#ffffff',
              border: 'none',
              cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={15} />
          </button>

          <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Step {currentStepIndex + 1} / {activeScenario.steps.length}
          </span>

          <button
            onClick={handleNextStep}
            disabled={currentStepIndex === activeScenario.steps.length - 1}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: currentStepIndex === activeScenario.steps.length - 1 ? 'var(--text-dim)' : '#ffffff',
              border: 'none',
              cursor: currentStepIndex === activeScenario.steps.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronRight size={15} />
          </button>

          <button
            onClick={handleReset}
            title="Reset to Step 1"
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: xyflow Interactive Canvas */}
      {viewMode === 'xyflow' && (
        <div style={{
          height: isFullscreen ? '100vh' : '540px',
          width: isFullscreen ? '100vw' : '100%',
          position: isFullscreen ? 'fixed' : 'relative',
          top: isFullscreen ? 0 : 'auto',
          left: isFullscreen ? 0 : 'auto',
          zIndex: isFullscreen ? 99999 : 1,
          borderRadius: isFullscreen ? 0 : '16px',
          overflow: 'hidden',
          border: isFullscreen ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
          background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #070a12 100%)'
        }}>
          {/* Top-Right Floating Controls (Full Screen Toggle & ESC Close) */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {isFullscreen ? (
              <>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  color: '#94a3b8',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)'
                }}>
                  Press <kbd style={{ color: '#ffffff', background: 'rgba(255, 255, 255, 0.2)', padding: '2px 5px', borderRadius: '4px' }}>ESC</kbd> to exit
                </span>
                <button
                  id="xyflow-exit-fullscreen-btn"
                  onClick={() => setIsFullscreen(false)}
                  title="Close Full Screen (ESC)"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '0.78rem',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.45)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <X size={15} />
                  <span>Close (Exit Full Screen)</span>
                </button>
              </>
            ) : (
              <button
                id="xyflow-fullscreen-btn"
                onClick={() => setIsFullscreen(true)}
                title="View Graph in Full Screen"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  fontSize: '0.76rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Maximize2 size={13} />
                <span>Full Screen</span>
              </button>
            )}
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Background color="#38bdf8" gap={20} size={1} opacity={0.12} />
            <Controls style={{ background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px' }} />
            {/* Compact MiniMap */}
            <MiniMap
              nodeColor={(n) => n.data?.color || '#38bdf8'}
              style={{
                background: 'rgba(15, 23, 42, 0.88)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                width: 105,
                height: 65
              }}
              zoomable={false}
              pannable={false}
            />
          </ReactFlow>

          {/* Active Step Overlay Card */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            maxWidth: '460px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
            borderRadius: '12px',
            padding: '14px 18px',
            zIndex: 10,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase' }}>
                Stage #{currentStep.step}: {currentStep.title}
              </span>
              <span style={{ fontSize: '0.66rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                Active Execution Pulse
              </span>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#f1f5f9', marginBottom: '6px', lineHeight: '1.4' }}>
              {currentStep.desc}
            </div>

            <div style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              padding: '6px 8px',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.5)',
              color: '#fbbf24',
              marginBottom: '6px'
            }}>
              {currentStep.call}
            </div>

            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              <strong>Execution Metric:</strong> {currentStep.metric}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Sequential Stepper Pipeline View */}
      {viewMode === 'stepper' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.4fr)',
          gap: '18px'
        }}>
          {/* Step Selector List */}
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
              Pipeline Stages Calling Hierarchy:
            </div>

            {activeScenario.steps.map((st, idx) => {
              const isCur = idx === currentStepIndex;
              return (
                <div
                  key={st.step}
                  onClick={() => { setCurrentStepIndex(idx); setIsPlaying(false); }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: isCur ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isCur ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: isCur ? '800' : '600', color: isCur ? '#38bdf8' : '#e2e8f0' }}>
                      Stage {st.step}: {st.title}
                    </span>
                    <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: isCur ? '#34d399' : 'var(--text-dim)' }}>
                      {isCur ? 'ACTIVE' : `Step ${idx + 1}`}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {st.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Step Deep Dive Card */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge" style={{ background: '#38bdf825', color: '#38bdf8', border: '1px solid #38bdf850', fontSize: '0.7rem' }}>
                  Stage {currentStep.step} of {activeScenario.steps.length}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  {currentStep.title}
                </h3>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: '700' }}>
                Calling Sequence
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Kernel / Engine Function Call Signature:
              </div>
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: '#fbbf24'
              }}>
                {currentStep.call}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Operational Overview:
              </div>
              <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: '1.6', margin: 0 }}>
                {currentStep.detail}
              </p>
            </div>

            <div style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              fontSize: '0.76rem',
              color: '#38bdf8',
              lineHeight: '1.5'
            }}>
              <strong>Execution Metric & Buffer State:</strong> {currentStep.metric}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
