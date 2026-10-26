// =========================================================================
// DATABASE ARCHITECTURE, ENGINES, QUERY EXECUTION & SHARDING DATA
// Complete models for SQL (Standard/MySQL), PostgreSQL, and MongoDB
// Covering: Fundamentals, Normalization, Connections, Query Execution (Algebra/Trees),
// Scaling, Sharding, Indexing (B-Tree/LSM), Transactions (ACID/MVCC), and Flow
// =========================================================================

export const DATABASE_ENGINES = [
  {
    id: 'sql',
    name: 'SQL (MySQL InnoDB Engine)',
    engineName: 'MySQL 8.x / InnoDB Engine',
    storageEngineName: 'InnoDB',
    type: 'Relational DBMS (RDBMS) • ACID Compliant',
    color: '#0284c7',
    accentGradient: 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)',
    badge: 'InnoDB Storage Engine',
    badgeColor: '#e0f2fe',
    icon: 'Database',
    tagline: 'Standard relational model with structured tables, SQL dialect, declarative joins, and InnoDB clustered B+Trees',
    specs: {
      concurrencyModel: 'Thread-per-connection (Lightweight worker threads; ~1-3 MB/conn; thread cache)',
      storageEngine: 'InnoDB (Index-Organized Clustered B+Tree on Primary Key; 16KB pages)',
      bufferPool: 'innodb_buffer_pool_size (Allocates 50%–75% of total host RAM; 5/8 young + 3/8 old LRU sublists)',
      transactionSupport: 'Full ACID via Undo Logs (Rollback) & Redo Logs (WAL); Doublewrite Buffer',
      crashRecovery: 'Redo Log (circular disk buffer) + Doublewrite Buffer + Undo Logs',
      rowPointer: 'Secondary index points to Primary Key value (requires 2nd lookup in clustered B+Tree)',
      mvccImplementation: 'In-place updates; older tuple versions stored in Undo Log Rollback Segments (DB_ROLL_PTR chain backward); Purge threads',
      defaultIsolation: 'Repeatable Read (uses Next-Key gap locks to prevent phantoms)',
      queryOptimizer: 'Cost-Based Optimizer (CBO) with index statistics',
      specializedIndexes: 'B+Tree, Full-Text, Spatial (R-Tree), Hash (Memory Engine)',
      shardingApproach: 'Application-level or Vitess / ProxySQL middleware',
      wireProtocolPort: 'TCP Port 3306 (MySQL Client/Server Protocol)',
      connectionStrings: 'mysql://user:password@host:3306/dbname?ssl-mode=REQUIRED'
    }
  },
  {
    id: 'postgres',
    name: 'PostgreSQL (Heap Engine & MVCC)',
    engineName: 'PostgreSQL 16.x / Heap Engine',
    storageEngineName: 'Heap Storage Engine',
    type: 'Advanced Object-Relational (ORDBMS) • Extensible',
    color: '#336791',
    accentGradient: 'linear-gradient(135deg, #2b567d 0%, #4a84b8 100%)',
    badge: 'Heap & MVCC Engine',
    badgeColor: '#dbeafe',
    icon: 'Server',
    tagline: 'World\'s most advanced open-source DB with process-per-conn, MVCC tuples, GIN/GiST/BRIN indexes, and pgvector',
    specs: {
      concurrencyModel: 'Process-per-connection (Postmaster forks backend process; ~5-10MB/conn; PgBouncer pooler mandatory in prod)',
      storageEngine: 'Heap Tables (Unordered 8KB block frames + ctid tuple pointers (block, offset) + independent secondary indexes)',
      bufferPool: 'shared_buffers (~25% RAM) + relies on Linux OS Page Cache (effective_cache_size)',
      transactionSupport: 'Full ACID via Write-Ahead Log (WAL) & sequential pg_wal segment files with fsync()',
      crashRecovery: 'Write-Ahead Log (WAL) written to sequential pg_wal segment files',
      rowPointer: 'Secondary index points directly to physical tuple address ctid (block, offset)',
      mvccImplementation: 'Out-of-place updates; writes new tuple versions into Heap (xmin/xmax headers); cleaned asynchronously by VACUUM daemon; HOT optimization',
      defaultIsolation: 'Read Committed (Snapshot Isolation on each statement; Repeatable Read is snapshot for tx)',
      queryOptimizer: 'Advanced Cost-Based Optimizer + GEQO (Genetic Evolutionary Query Optimizer for 12+ table joins) + JIT LLVM compiler',
      specializedIndexes: 'B-Tree, Hash, GIN, GiST, BRIN, SP-GiST, pgvector (HNSW/IVFFlat)',
      shardingApproach: 'Declarative Range/Hash Partitioning, Foreign Data Wrappers (postgres_fdw), or Citus extension',
      wireProtocolPort: 'TCP Port 5432 (Frontend/Backend Protocol v3.0)',
      connectionStrings: 'postgresql://user:password@host:5432/dbname?sslmode=require'
    }
  },
  {
    id: 'mongodb',
    name: 'MongoDB (WiredTiger Storage Engine)',
    engineName: 'MongoDB 7.x / WiredTiger Engine',
    storageEngineName: 'WiredTiger',
    type: 'Distributed Document NoSQL • Flexible Schema',
    color: '#059669',
    accentGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    badge: 'WiredTiger Storage Engine',
    badgeColor: '#d1fae5',
    icon: 'Layers',
    tagline: 'Distributed JSON-like BSON document database powered by WiredTiger with snappy compression, document-level concurrency, checkpointing & native sharding',
    specs: {
      concurrencyModel: 'Thread-per-connection (Driver-managed pool by default; lightweight thread workers)',
      storageEngine: 'WiredTiger Storage Engine (Compressed B-Trees + in-memory cache, Snappy/Zlib compression)',
      bufferPool: 'WiredTiger Cache (50% RAM - 1GB) + Filesystem cache',
      transactionSupport: 'Multi-document ACID transactions with WiredTiger snapshot isolation',
      crashRecovery: 'Journaling (WiredTiger WAL) + periodic checkpoints (every 60s or 2GB dirty data)',
      rowPointer: 'BSON Document ObjectId (_id) or secondary index pointing to record store',
      mvccImplementation: 'WiredTiger in-memory transaction snapshots with history store',
      defaultIsolation: 'Read Concern "local" / "majority", Write Concern "w: majority"',
      queryOptimizer: 'Plan Cache & Heuristic/Empirical candidate plan evaluation',
      specializedIndexes: 'Single field, Compound, Multikey (arrays), Text, Geospatial (2dsphere), Hashed, Wildcard',
      shardingApproach: 'Native Distributed Sharding: mongos Query Router + Config Server Replica Set + Shards',
      wireProtocolPort: 'TCP Port 27017 (OP_MSG BSON Protocol)',
      connectionStrings: 'mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority'
    }
  }
];

// =========================================================================
// 1. DATABASE FUNDAMENTALS
// =========================================================================
export const FUNDAMENTALS_DATA = {
  overview: {
    title: '1. Database Fundamentals',
    summary: 'A database is an organized collection of data, managed by software called a DBMS (Database Management System). Modern systems range from ACID relational engines to high-throughput distributed document clusters.',
    dbmsTypes: [
      {
        type: 'Relational (RDBMS)',
        examples: 'PostgreSQL, MySQL, Oracle, SQL Server',
        dataModel: 'Tables, rows (tuples), columns (attributes)',
        strengths: 'Strict schema, relational integrity, ACID guarantees, complex joins, secondary indexes',
        bestFor: 'Financial systems, e-commerce transactions, enterprise ERP/CRM'
      },
      {
        type: 'Document Store (NoSQL)',
        examples: 'MongoDB (WiredTiger Storage Engine), CouchDB, Amazon DocumentDB',
        dataModel: 'JSON / BSON hierarchical documents',
        strengths: 'Flexible schema, polymorphic records, embedded subdocuments, native sharding',
        bestFor: 'Content management, product catalogs, user profiles, mobile apps'
      },
      {
        type: 'Key-Value Store',
        examples: 'Redis, AWS DynamoDB, Memcached, etcd',
        dataModel: 'Key → Opaque / Typed Value',
        strengths: 'Sub-millisecond latency, massive IOPS, in-memory architectures',
        bestFor: 'Session caching, leaderboard scores, distributed rate limiting'
      },
      {
        type: 'Wide-Column Store',
        examples: 'Apache Cassandra, ScyllaDB, HBase',
        dataModel: 'Rows with sparse, dynamic column families',
        strengths: 'High write throughput, linear horizontal scalability, no single point of failure',
        bestFor: 'Time-series sensor telemetry, audit logs, messaging apps'
      },
      {
        type: 'Graph Database',
        examples: 'Neo4j, AWS Neptune, ArangoDB',
        dataModel: 'Nodes, Directed Edges, Properties',
        strengths: 'Index-free adjacency, fast relationship path traversal (O(1) pointer hops)',
        bestFor: 'Social networks, fraud detection, recommendation engines, knowledge graphs'
      },
      {
        type: 'Distributed / NewSQL',
        examples: 'CockroachDB, Google Cloud Spanner, TiDB, YugabyteDB',
        dataModel: 'Relational SQL over distributed consensus (Raft / Paxos)',
        strengths: 'Horizontal scale-out with full ACID transactions and SQL semantics',
        bestFor: 'Global multi-region transactional applications'
      }
    ],
    acid: [
      {
        letter: 'A',
        name: 'Atomicity',
        desc: 'All-or-nothing execution. If any query inside a transaction fails, all previous writes are reverted (rolled back).',
        tech: 'Undo logs (MySQL InnoDB), MVCC dead-tuple cleanup (PostgreSQL), Oplog (MongoDB).'
      },
      {
        letter: 'C',
        name: 'Consistency',
        desc: 'Transactions bring the database from one valid state to another, maintaining all schema constraints (NOT NULL, FK, CHECK).',
        tech: 'Constraint validation triggers, schema validation rules, declarative checks.'
      },
      {
        letter: 'I',
        name: 'Isolation',
        desc: 'Concurrent transactions execute without stepping on each other, producing results equivalent to sequential execution.',
        tech: '2-Phase Locking (2PL), MVCC snapshots, Next-Key gap locks, SSI (Serializable Snapshot Isolation).'
      },
      {
        letter: 'D',
        name: 'Durability',
        desc: 'Once committed, written data is permanent and will survive crashes, power outages, and OS restarts.',
        tech: 'Write-Ahead Logging (WAL), fsync() flushing to NVMe storage before transaction acknowledgement.'
      }
    ],
    relationalKeys: [
      { term: 'Primary Key (PK)', meaning: 'A unique identifier for each tuple; strictly NOT NULL and indexed by default.' },
      { term: 'Foreign Key (FK)', meaning: 'Column referencing the PK of another table, ensuring referential integrity.' },
      { term: 'Candidate Key', meaning: 'Any minimal superkey capable of uniquely identifying every row in a table.' },
      { term: 'Super Key', meaning: 'Any set of attributes that uniquely identifies a row (may contain redundant fields).' },
      { term: 'Composite Key', meaning: 'A key formed by concatenating two or more columns (e.g., order_id + product_id).' },
      { term: 'Surrogate Key', meaning: 'An artificial synthetic identifier with no business meaning (auto-increment BIGINT or UUIDv7).' },
      { term: 'Natural Key', meaning: 'A real-world unique attribute (e.g., social security number, vehicle VIN, email).' }
    ]
  }
};

// =========================================================================
// 2. NORMALIZATION & SCHEMA DESIGN
// =========================================================================
export const NORMALIZATION_DATA = {
  anomalies: [
    {
      type: 'Insertion Anomaly',
      problem: 'Cannot record a new course until a student enrolls in it, because student_id is required in the primary key.',
      solution: 'Split students and courses into separate tables.'
    },
    {
      type: 'Update Anomaly',
      problem: 'Changing Dr. Rao\'s phone number requires modifying 10,000 student enrollment rows; missing one causes data inconsistency.',
      solution: 'Store instructor details in a dedicated instructors table.'
    },
    {
      type: 'Deletion Anomaly',
      problem: 'Deleting the last student enrolled in Course C102 unintentionally deletes the fact that Course C102 and Dr. Sen exist!',
      solution: 'Decouple student enrollments from course definitions via a bridge/junction table.'
    }
  ],
  normalForms: [
    {
      form: '1NF: First Normal Form',
      rule: 'Each cell must hold a single atomic value (no arrays, CSV strings, or nested repeating groups). Every row must have a unique identifier.',
      badExample: 'orders(order_id: 1, customer: "Asha", products: "Pen, Book, Bag")',
      goodExample: 'orders(order_id: 1, customer: "Asha", product: "Pen")\norders(order_id: 1, customer: "Asha", product: "Book")\norders(order_id: 1, customer: "Asha", product: "Bag")'
    },
    {
      form: '2NF: Second Normal Form',
      rule: 'Must be in 1NF and have NO partial dependencies: every non-key attribute must depend on the whole composite key, not just part of it.',
      badExample: 'order_items(order_id PK, product_id PK, product_name, quantity)\n-> product_name depends solely on product_id, not order_id!',
      goodExample: 'products(product_id PK, product_name)\norder_items(order_id PK, product_id PK, quantity)'
    },
    {
      form: '3NF: Third Normal Form',
      rule: 'Must be in 2NF and have NO transitive dependencies: non-key attributes must depend solely on the primary key, not on another non-key column.',
      badExample: 'employees(emp_id PK, name, dept_id, dept_name)\n-> emp_id -> dept_id -> dept_name (transitive!)',
      goodExample: 'employees(emp_id PK, name, dept_id FK)\ndepartments(dept_id PK, dept_name)\n\n"Every non-key attribute must provide a fact about the key, the whole key, and nothing but the key, so help me Codd!"'
    },
    {
      form: 'BCNF: Boyce-Codd Normal Form',
      rule: 'Stricter 3NF: For every functional dependency X -> Y, X must be a super key. Prevents anomalies with overlapping candidate keys.',
      badExample: 'teaching(student, subject, teacher) where teacher -> subject, but teacher is not a super key alone.',
      goodExample: 'teacher_subject(teacher PK, subject)\nstudent_teacher(student PK, teacher PK)'
    },
    {
      form: '4NF: Fourth Normal Form',
      rule: 'Must be in BCNF and eliminate multi-valued dependencies (MVDs) where independent 1-to-many relationships share one table.',
      badExample: 'person_info(person, skill, language) -> storing every Cartesian combination of skills and spoken languages.',
      goodExample: 'person_skills(person PK, skill PK)\nperson_languages(person PK, language PK)'
    },
    {
      form: '5NF: Fifth Normal Form',
      rule: 'Project-Join Normal Form: Data cannot be decomposed into smaller tables and rejoined without losing integrity, unless implied by candidate keys.',
      badExample: 'Complex ternary relationships (Supplier-Part-Project) with circular join dependencies.',
      goodExample: 'Rarely applied in everyday OLTP; handled at 3NF/BCNF in 99% of production systems.'
    }
  ],
  workedExample: {
    rawTable: {
      name: 'Unnormalized Orders (0NF)',
      headers: ['order_id', 'order_date', 'customer_name', 'customer_email', 'items'],
      sampleRow: ['101', '2026-03-15', 'Asha Sharma', 'asha@domain.io', 'Laptop(1)@1200, Mouse(2)@25, USB-C Cable(3)@15']
    },
    normalizedTables: [
      {
        name: 'customers (3NF)',
        schema: 'customer_id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(255) UNIQUE'
      },
      {
        name: 'products (3NF)',
        schema: 'product_id SERIAL PRIMARY KEY, name VARCHAR(100), price NUMERIC(10,2)'
      },
      {
        name: 'orders (3NF)',
        schema: 'order_id SERIAL PRIMARY KEY, customer_id INT REFERENCES customers, order_date DATE'
      },
      {
        name: 'order_items (3NF)',
        schema: 'order_id INT REFERENCES orders, product_id INT REFERENCES products, quantity INT, unit_price NUMERIC(10,2), PRIMARY KEY(order_id, product_id)'
      }
    ]
  },
  denormalizationTradeoffs: [
    { strategy: 'Duplicate Columns', example: 'Store customer_name directly inside orders', benefit: 'Avoids JOIN on read path', drawback: 'Risk of stale data if customer changes name' },
    { strategy: 'Precomputed Aggregates', example: 'Store order_total column instead of SUM()', benefit: 'O(1) invoice display', drawback: 'Must be transactional updated with items' },
    { strategy: 'Materialized Views', example: 'Nightly sales rollup by territory', benefit: 'Blazing fast analytics queries', drawback: 'Requires REFRESH MATERIALIZED VIEW strategy' },
    { strategy: 'JSONB Document Columns', example: 'Store variable attributes in JSONB (PG/MySQL)', benefit: 'Schema flexibility without altering DDL', drawback: 'Harder to index and enforce foreign key constraints' }
  ]
};

// =========================================================================
// 3. DATABASE ENGINE CONNECTIONS & POOLING
// =========================================================================
export const CONNECTIONS_DATA = {
  lifecycle: [
    { step: 1, title: 'TCP Handshake', desc: 'Client initiates 3-way SYN -> SYN-ACK -> ACK on engine port (PG 5432, MySQL 3306, Mongo 27017).' },
    { step: 2, title: 'TLS Negotiation', desc: 'Client and server negotiate cipher suites and verify SSL certificates (sslmode=verify-full recommended).' },
    { step: 3, title: 'Startup Handshake', desc: 'Client sends protocol version, intended database name, and client runtime flags.' },
    { step: 4, title: 'Authentication', desc: 'Server challenges client; credentials checked via SCRAM-SHA-256 (PG) or caching_sha2_password (MySQL).' },
    { step: 5, title: 'Worker Allocation', desc: 'Engine allocates a worker process (PostgreSQL fork) or thread (MySQL/Mongo) + memory state buffers.' },
    { step: 6, title: 'Query Loop', desc: 'Client sends SQL/wire message; engine parses, plans, executes, and streams row packets back.' },
    { step: 7, title: 'Termination / Close', desc: 'Client sends close packet; engine releases worker buffers and frees file descriptors.' }
  ],
  concurrencyModels: [
    { engine: 'PostgreSQL', model: 'Process per connection', memoryPerConn: '~5MB - 10MB+', takeaway: 'Heavy context switching if >200 conns; PgBouncer proxy is mandatory.' },
    { engine: 'MySQL / InnoDB', model: 'Thread per connection', memoryPerConn: '~1MB - 3MB', takeaway: 'Lighter than processes; enterprise thread pool plugin prevents thrashing.' },
    { engine: 'MongoDB', model: 'Thread pool per connection', memoryPerConn: '~1MB', takeaway: 'Drivers maintain client-side connection pools out of the box.' },
    { engine: 'Redis', model: 'Single-threaded event loop (epoll)', memoryPerConn: '~100KB', takeaway: 'Extremely high connection counts supported with zero lock contention.' }
  ],
  poolSizing: {
    formula: 'pool_size ≈ (core_count × 2) + effective_spindle_count',
    explanation: 'A 16-core CPU server with NVMe SSDs (1 spindle equivalent) needs around (16 × 2) + 1 = 33 connections! Creating 1000 connections causes severe CPU cache eviction, spinlock contention, and memory exhaustion.'
  },
  codeSamples: {
    python: `import os
from psycopg_pool import ConnectionPool

# Initialize Connection Pool
pool = ConnectionPool(
    conninfo=os.environ["DATABASE_URL"],
    min_size=2,
    max_size=10,
    timeout=5.0  # max seconds to wait for a free conn
)

with pool.connection() as conn:
    with conn.cursor() as cur:
        # Parameterized query protects against SQL Injection
        cur.execute("SELECT id, name, email FROM users WHERE id = %s", (42,))
        user = cur.fetchone()
# Connection is automatically returned to the pool`,
    node: `const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Parameterized prepared query
const { rows } = await pool.query(
  'SELECT id, name, email FROM users WHERE id = $1',
  [42]
);`,
    java: `HikariConfig cfg = new HikariConfig();
cfg.setJdbcUrl("jdbc:postgresql://host:5432/db");
cfg.setUsername(System.getenv("DB_USER"));
cfg.setPassword(System.getenv("DB_PASS"));
cfg.setMaximumPoolSize(10);
cfg.setConnectionTimeout(5000);

HikariDataSource ds = new HikariDataSource(cfg);

try (Connection c = ds.getConnection();
     PreparedStatement ps = c.prepareStatement("SELECT * FROM users WHERE id = ?")) {
    ps.setInt(1, 42);
    ResultSet rs = ps.executeQuery();
}`
  },
  pgBouncerModes: [
    { mode: 'Session Pooling', behavior: 'Connection returned to pool only when client disconnects.', tradeoff: 'Least multiplexing; safe for all session-level features.' },
    { mode: 'Transaction Pooling', behavior: 'Connection returned as soon as COMMIT or ROLLBACK occurs.', tradeoff: 'Best multiplexing! Prohibits session variables (SET) and advisory locks.' },
    { mode: 'Statement Pooling', behavior: 'Connection returned after every individual SQL statement.', tradeoff: 'No multi-statement transactions allowed; strictly for simple read-only queries.' }
  ]
};

// =========================================================================
// 4. QUERY EXECUTION PROCESS & RELATIONAL ALGEBRA
// =========================================================================
export const QUERY_EXECUTION_DATA = {
  pipeline: [
    {
      step: 1,
      name: 'PARSER',
      input: 'Raw SQL text',
      output: 'Abstract Syntax Tree (AST) / Parse Tree',
      desc: 'Lexical analysis (tokenizing) and syntax verification. Fails immediately on syntax typos like "SELCT" or mismatched parentheses.',
      color: '#38bdf8'
    },
    {
      step: 2,
      name: 'ANALYZER / BINDER',
      input: 'Parse Tree',
      output: 'Semantic Query Tree',
      desc: 'Resolves table & column identifiers against the System Catalog (pg_class, information_schema). Checks column data types, table existence, and client user permissions.',
      color: '#818cf8'
    },
    {
      step: 3,
      name: 'REWRITER',
      input: 'Semantic Query Tree',
      output: 'Rewritten Query Tree',
      desc: 'Applies database rules, inlines SQL views, expands generated columns, and simplifies constant expressions (e.g., "1 + 1" -> "2").',
      color: '#a855f7'
    },
    {
      step: 4,
      name: 'OPTIMIZER (Planner)',
      input: 'Rewritten Logical Query Tree',
      output: 'Optimal Physical Execution Plan',
      desc: 'Translates to relational algebra. Uses Cost-Based Optimizer (CBO) and statistics (NDV, histograms, MCV) to evaluate join orders and choose index scans vs seq scans.',
      color: '#f59e0b'
    },
    {
      step: 5,
      name: 'EXECUTOR',
      input: 'Physical Plan',
      output: 'Result Set Tuples (Streamed to Client)',
      desc: 'Executes the plan using the Iterator (Volcano) Model: open() / next() / close(). Pulls row pages through the Buffer Pool and disk cache.',
      color: '#10b981'
    }
  ],
  relationalAlgebra: [
    { symbol: 'σ (sigma)', name: 'Selection', sql: 'WHERE condition', desc: 'Filters rows that satisfy predicate condition P. Reduces row cardinality.' },
    { symbol: 'π (pi)', name: 'Projection', sql: 'SELECT col1, col2', desc: 'Selects specific columns and discards unwanted attributes.' },
    { symbol: 'ρ (rho)', name: 'Rename', sql: 'AS alias', desc: 'Renames a relation or attribute for self-joins or disambiguation.' },
    { symbol: '⨝ (bowtie)', name: 'Natural Join', sql: 'NATURAL JOIN', desc: 'Equi-join on all columns that share the same name in both tables.' },
    { symbol: '⨝θ (theta join)', name: 'Theta Join', sql: 'JOIN ... ON condition', desc: 'Cartesian product followed by selection on predicate θ.' },
    { symbol: '⋉ (semi-join)', name: 'Semi-Join', sql: 'WHERE EXISTS (...) / IN', desc: 'Returns rows from left table that have at least one match on right, without duplicating rows.' },
    { symbol: '▷ (anti-join)', name: 'Anti-Join', sql: 'WHERE NOT EXISTS (...)', desc: 'Returns rows from left table that have zero matches in the right table.' },
    { symbol: '⟕ / ⟖ / ⟗', name: 'Outer Joins', sql: 'LEFT / RIGHT / FULL OUTER JOIN', desc: 'Preserves unmatched rows from one or both relations, padding missing attributes with NULLs.' },
    { symbol: 'γ (gamma)', name: 'Aggregation', sql: 'GROUP BY + aggregate', desc: 'Groups rows by attributes and computes functions like SUM(), AVG(), COUNT().' },
    { symbol: 'τ (tau)', name: 'Sort', sql: 'ORDER BY col ASC/DESC', desc: 'Sorts rows into ordered sequence via in-memory quicksort or external merge sort.' },
    { symbol: '∪ (cup)', name: 'Union', sql: 'UNION', desc: 'Combines tuples from two union-compatible relations, removing duplicates.' },
    { symbol: '∩ (cap)', name: 'Intersection', sql: 'INTERSECT', desc: 'Returns only tuples present in both relations.' },
    { symbol: '− (minus)', name: 'Difference', sql: 'EXCEPT / MINUS', desc: 'Returns tuples present in relation 1 that are absent from relation 2.' },
    { symbol: '÷ (divide)', name: 'Division', sql: 'Double NOT EXISTS ("for all")', desc: 'Finds entities associated with all members of a target set.' }
  ],
  joinAlgorithms: [
    {
      name: 'Nested Loop Join',
      complexity: 'O(N × M) or O(N × log M) with inner index',
      howItWorks: 'For each outer row, inspects every row of the inner table or performs an index probe.',
      bestWhen: 'Outer relation is very small (<100 rows) and inner relation has a selective B-Tree index on the join key.'
    },
    {
      name: 'Hash Join',
      complexity: 'O(N + M)',
      howItWorks: 'Phase 1 (Build): Scans small table and builds in-memory hash table on join key.\nPhase 2 (Probe): Scans large table, hashes join key, probes hash table, and emits matches.',
      bestWhen: 'Large unsorted tables with equality join predicates (=). Grace hash join spills to disk if memory exceeds work_mem.'
    },
    {
      name: 'Sort-Merge Join',
      complexity: 'O(N log N + M log M)',
      howItWorks: 'Both inputs are sorted on the join key, then walked in parallel like two zipper teeth.',
      bestWhen: 'Inputs are already ordered by indexes or query requires ORDER BY matching the join key.'
    }
  ],
  logicalProcessingOrder: [
    { step: 1, clause: 'FROM / JOIN', desc: 'Identify target tables, evaluate cartesian products and join conditions.' },
    { step: 2, clause: 'WHERE', desc: 'Filter individual rows (σ) before grouping. Aliases defined in SELECT are not yet available!' },
    { step: 3, clause: 'GROUP BY', desc: 'Group filtered rows into buckets (γ) sharing common group keys.' },
    { step: 4, clause: 'HAVING', desc: 'Filter grouped buckets based on aggregate conditions (e.g., HAVING COUNT(*) > 5).' },
    { step: 5, clause: 'SELECT', desc: 'Project columns (π), compute expressions, window functions, and assign column aliases.' },
    { step: 6, clause: 'DISTINCT', desc: 'Eliminate duplicate rows from the projected result set.' },
    { step: 7, clause: 'ORDER BY', desc: 'Sort the resulting tuples (τ). Column aliases defined in SELECT are valid here!' },
    { step: 8, clause: 'LIMIT / OFFSET', desc: 'Discard leading offset rows and slice the top N rows for pagination.' }
  ]
};

// =========================================================================
// 5. SCALING & SHARDING
// =========================================================================
export const SCALING_SHARDING_DATA = {
  verticalVsHorizontal: {
    vertical: {
      title: 'Vertical Scaling (Scale UP)',
      desc: 'Add more CPU cores, RAM, and faster NVMe IOPS to a single server.',
      pros: ['Zero application architecture changes', 'Keeps ACID & joins trivially simple', 'No cross-network latency'],
      cons: ['Hardware ceiling (maximum instance size)', 'Single Point of Failure (SPOF)', 'Exponential cost curve at the high end']
    },
    horizontal: {
      title: 'Horizontal Scaling (Scale OUT)',
      desc: 'Distribute data and queries across multiple independent servers.',
      pros: ['Virtually unbounded storage & write capacity', 'High availability and fault tolerance', 'Linear commodity hardware cost'],
      cons: ['Cross-shard joins are slow or impossible', 'Distributed transactions (2PC/Sagas) are complex', 'Operational resharding overhead']
    }
  },
  scalingRoadmap: [
    '1. Optimize slow queries & add missing indexes (10-100x speedup)',
    '2. Implement connection pooling (HikariCP / PgBouncer)',
    '3. Introduce Cache-Aside layer (Redis) for hot read keys',
    '4. Scale vertically (upgrade RAM / NVMe storage & tune buffer pool)',
    '5. Add Read Replicas with Read/Write splitting (proxy or driver)',
    '6. Partition large single-server tables by range or date',
    '7. Split by domain (functional database separation / microservices)',
    '8. Shard horizontally across independent nodes or adopt NewSQL'
  ],
  shardingStrategies: [
    {
      name: 'Range-Based Sharding',
      how: 'Data partitioned by key range: Shard 1 (IDs 1 - 1M), Shard 2 (IDs 1M - 2M).',
      pros: 'Simple; efficient for range scans (BETWEEN / date ranges).',
      cons: 'Write Hotspots! Sequential auto-increment IDs always write to the latest shard.'
    },
    {
      name: 'Hash-Based Sharding (mod N)',
      how: 'shard = hash(shard_key) % N.',
      pros: 'Uniform, even distribution of writes across all shards.',
      cons: 'Resharding nightmare! Changing N from 3 to 4 remaps ~75% of all keys.'
    },
    {
      name: 'Consistent Hashing (Hash Ring)',
      how: 'Keys and virtual nodes (vnodes) mapped onto a 360° circular hash ring.',
      pros: 'Adding/removing a node only moves 1/N of keys! Used by DynamoDB, Cassandra, Redis Cluster.',
      cons: 'Slightly higher routing metadata management.'
    },
    {
      name: 'Directory / Lookup Sharding',
      how: 'A central metadata lookup table maps tenant_id -> shard_node_id.',
      pros: 'Ultimate flexibility: move high-traffic "whale" tenants to dedicated hardware.',
      cons: 'Lookup service is a critical performance bottleneck and SPOF (requires caching).'
    },
    {
      name: 'Geo-Based Sharding',
      how: 'Data partitioned by user geographic region (EU -> Frankfurt, APAC -> Singapore).',
      pros: 'Low localized latency and regulatory GDPR data residency compliance.',
      cons: 'Uneven regional traffic loads; cross-region joins are very slow.'
    }
  ],
  shardKeyCriteria: [
    { property: 'High Cardinality', reason: 'Must have millions of distinct values (e.g., user_id or uuid) to spread rows evenly.' },
    { property: 'Even Distribution', reason: 'Avoids hot shards where one key gets 80% of traffic (the "celebrity problem").' },
    { property: 'Present in Most Queries', reason: 'Enables targeted single-shard routing, avoiding slow scatter-gather broadcast queries.' },
    { property: 'Immutability', reason: 'Changing a shard key requires deleting the row from Shard A and inserting it into Shard B.' },
    { property: 'Non-Monotonic', reason: 'Timestamp or auto-increment ID alone will direct 100% of writes to a single active node.' }
  ]
};

// =========================================================================
// 6. INDEXING MASTERCLASS
// =========================================================================
export const INDEXING_DATA = {
  btreeVsLsm: {
    btree: {
      name: 'B+Tree Index (In-Place Updates)',
      complexity: 'Search: O(log N) • Insert: O(log N) • Delete: O(log N)',
      mechanism: 'Balanced multi-way search tree. Leaf nodes are doubly linked lists. Internal nodes contain routing keys.',
      writeCost: 'Random I/O: updates modify 8KB/16KB disk pages in place, causing page splits and fragmentation.',
      readCost: 'Sub-millisecond: predictable 3-4 page reads even on billions of rows.',
      engines: 'PostgreSQL, MySQL InnoDB, SQL Server, Oracle, SQLite'
    },
    lsm: {
      name: 'LSM-Tree (Log-Structured Merge-Tree)',
      complexity: 'Write: O(1) sequential append • Read: O(levels) with Bloom filters',
      mechanism: 'Writes append to an in-memory MemTable + WAL. When MemTable fills, flushed to immutable SSTables on disk.',
      writeCost: 'High throughput sequential I/O! Background compaction merges SSTables.',
      readCost: 'Reads may check MemTable + Bloom Filters + multiple SSTable disk levels.',
      engines: 'RocksDB, Apache Cassandra, ScyllaDB, LevelDB, CockroachDB (Pebble)'
    }
  },
  indexTypes: [
    { type: 'B-Tree / B+Tree', bestFor: 'Equality (=), range (<, >, BETWEEN), prefix matching (LIKE "abc%"), and ORDER BY sorting.', complexity: 'O(log N)', engines: 'All RDBMS' },
    { type: 'Hash Index', bestFor: 'Ultra-fast exact equality lookups (=). No range scans or sorting supported.', complexity: 'O(1)', engines: 'PostgreSQL, MySQL MEMORY, Redis' },
    { type: 'GIN (Generalized Inverted)', bestFor: 'Composite attributes: JSONB keys, arrays, full-text search tsvector, and trigram wildcard LIKE "%abc%".', complexity: 'O(keys)', engines: 'PostgreSQL' },
    { type: 'GiST (Generalized Search Tree)', bestFor: 'Geometric objects, PostGIS geospatial coordinates, range intervals, and k-nearest neighbor (k-NN).', complexity: 'O(log N)', engines: 'PostgreSQL' },
    { type: 'BRIN (Block Range Index)', bestFor: 'Massive, append-only naturally ordered time-series tables. Stores min/max per 128-page block range.', complexity: 'O(blocks)', engines: 'PostgreSQL' },
    { type: 'Bitmap Index', bestFor: 'Low-cardinality columns (e.g., gender, marital_status) in data warehouses for fast bitwise AND/OR scans.', complexity: 'O(bits)', engines: 'Oracle' },
    { type: 'Vector (HNSW / IVF)', bestFor: 'Approximate Nearest Neighbor (ANN) search over high-dimensional AI text/image embeddings.', complexity: 'O(log N) approx', engines: 'PostgreSQL (pgvector), Pinecone' },
    { type: 'Columnstore', bestFor: 'Analytical OLAP queries aggregating millions of rows (SUM, AVG) with column compression.', complexity: 'O(N/compression)', engines: 'ClickHouse, SQL Server, Snowflake' }
  ],
  sargabilityExamples: [
    {
      bad: "WHERE YEAR(created_at) = 2026",
      good: "WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'",
      why: "Wrapping a column in a function prevents index range scans (forces Full Table Scan)."
    },
    {
      bad: "WHERE salary + 5000 > 60000",
      good: "WHERE salary > 55000",
      why: "Isolate the indexed column on one side of the operator."
    },
    {
      bad: "WHERE name LIKE '%son'",
      good: "Use GIN trigram index or reverse-string index (e.g. LIKE 'nos%')",
      why: "B-Tree indexes cannot use leading wildcard '%...' because sort order starts at the prefix."
    },
    {
      bad: "WHERE phone = 9876543210 (phone is VARCHAR)",
      good: "WHERE phone = '9876543210'",
      why: "Data type mismatch causes implicit CAST(phone AS INT), disabling index lookup."
    }
  ]
};

// =========================================================================
// 7. TRANSACTIONS, CONCURRENCY & MVCC
// =========================================================================
export const TRANSACTIONS_DATA = {
  anomalies: [
    {
      id: 'dirty_read',
      name: 'Dirty Read',
      desc: 'Transaction A reads data written by Transaction B before Transaction B commits. If B rolls back, A holds phantom invalid data.',
      prevention: 'Read Committed or higher.'
    },
    {
      id: 'non_repeatable_read',
      name: 'Non-Repeatable Read',
      desc: 'Transaction A reads row X. Transaction B modifies or deletes row X and commits. Transaction A re-reads row X and observes different values.',
      prevention: 'Repeatable Read or higher.'
    },
    {
      id: 'phantom_read',
      name: 'Phantom Read',
      desc: 'Transaction A executes a range query (e.g., SELECT * WHERE age > 30). Transaction B inserts a new row satisfying the predicate and commits. Transaction A re-executes and sees a new "phantom" row.',
      prevention: 'Serializable (or Repeatable Read with Gap Locking / Snapshot Isolation).'
    },
    {
      id: 'lost_update',
      name: 'Lost Update',
      desc: 'Two concurrent transactions read balance = $100. Both subtract $20 and commit. Balance ends at $80 instead of $60 because write 2 overwrote write 1.',
      prevention: 'SELECT ... FOR UPDATE or Optimistic Locking with a version column.'
    },
    {
      id: 'write_skew',
      name: 'Write Skew',
      desc: 'Two transactions read overlapping data and write disjoint rows, violating an invariant (e.g., at least one doctor must be on call; both doctors check, see 2 on call, and both take leave).',
      prevention: 'True Serializable isolation level.'
    }
  ],
  isolationMatrix: [
    { level: 'Read Uncommitted', dirtyRead: 'YES (Allowed)', nonRepeatable: 'YES', phantom: 'YES', engines: 'MySQL (rarely used)' },
    { level: 'Read Committed', dirtyRead: 'NO (Prevented)', nonRepeatable: 'YES', phantom: 'YES', engines: 'PostgreSQL default, SQL Server, Oracle' },
    { level: 'Repeatable Read', dirtyRead: 'NO', nonRepeatable: 'NO', phantom: 'Engine-dependent*', engines: 'MySQL InnoDB default (uses gap locks)' },
    { level: 'Serializable', dirtyRead: 'NO', nonRepeatable: 'NO', phantom: 'NO', engines: 'PostgreSQL SSI, SQLite, Spanner' }
  ],
  mvccVsLocking: {
    mvcc: 'Multi-Version Concurrency Control (PostgreSQL & MySQL InnoDB): Readers do NOT block writers, and writers do NOT block readers! Each transaction sees a consistent snapshot. Old tuple versions are cleaned up asynchronously (VACUUM in PG, Purge thread in MySQL).',
    locking: 'Two-Phase Locking (2PL): Growing phase acquires shared/exclusive locks; shrinking phase releases them upon commit. Strict, but prone to lock contention and deadlocks.'
  }
};

// =========================================================================
// 8. COMPLETE DATABASE ARCHITECTURE REFERENCE (From doc/database_architecture_reference.md)
// PostgreSQL (Heap & MVCC) & MySQL (InnoDB) Architectural Master Reference
// =========================================================================
export const DATABASE_ARCHITECTURE_REFERENCE = {
  metadata: {
    title: 'PostgreSQL (Heap & MVCC) & MySQL (InnoDB) Architectural Reference',
    version: 'PostgreSQL 16.x & MySQL 8.x / InnoDB',
    source: 'doc/database_architecture_reference.md',
    tagline: 'Comprehensive systems engineering reference for storage models, memory architectures, connection lifecycles, query pipelines, indexing, and MVCC concurrency.'
  },

  // Section 1: Engine Architecture & Core Specifications (13-dimension comparison)
  engineComparisonMatrix: [
    {
      dimension: 'DBMS Classification',
      mysql: 'Relational DBMS (RDBMS) • ACID Compliant',
      postgres: 'Advanced Object-Relational (ORDBMS) • Extensible',
      impact: 'Postgres supports custom types, operators, foreign data wrappers, and rich procedural languages.'
    },
    {
      dimension: 'Primary Storage Engine',
      mysql: 'InnoDB (Index-Organized Clustered B+Tree on Primary Key)',
      postgres: 'Heap Table (Unordered 8KB block frames + independent secondary indexes)',
      impact: 'InnoDB stores rows inside PK leaf pages; Postgres stores rows in arbitrary heap blocks addressed by ctid.'
    },
    {
      dimension: 'Concurrency / Worker Model',
      mysql: 'Thread-per-connection (Lightweight worker threads in single mysqld process)',
      postgres: 'Process-per-connection (Postmaster forks backend process per client)',
      impact: 'Postgres uses ~5-10MB/conn and requires PgBouncer proxy; MySQL uses ~1-3MB stack per thread.'
    },
    {
      dimension: 'Memory per Connection',
      mysql: '~1 MB – 3 MB (sort_buffer, join_buffer, read_buffer)',
      postgres: '~5 MB – 10 MB+ (work_mem, temp_buffers, private catalog caches)',
      impact: 'Unpooled Postgres servers thrash under >200 concurrent connections due to context-switching overhead.'
    },
    {
      dimension: 'Default Isolation Level',
      mysql: 'REPEATABLE READ (Prevents phantoms via Next-Key Gap Locks)',
      postgres: 'READ COMMITTED (Statement-level snapshot; Repeatable Read is Tx-level)',
      impact: 'MySQL prevents phantom rows out of the box; Postgres takes a fresh MVCC snapshot on each SQL statement.'
    },
    {
      dimension: 'Buffer Cache Architecture',
      mysql: 'innodb_buffer_pool_size (Allocates 50%–75% of total host RAM; 5/8 young + 3/8 old LRU)',
      postgres: 'shared_buffers (25% RAM) + relies on Linux OS Page Cache (effective_cache_size)',
      impact: 'Postgres avoids double-buffering by pairing shared_buffers with kernel page cache.'
    },
    {
      dimension: 'Crash Recovery & Durability',
      mysql: 'Redo Log (circular disk buffer) + Doublewrite Buffer + Undo Logs',
      postgres: 'Write-Ahead Log (WAL) written to sequential pg_wal segment files with fsync()',
      impact: 'MySQL Doublewrite Buffer prevents torn page corruptions during power failures.'
    },
    {
      dimension: 'Row Pointer Mechanism',
      mysql: 'Secondary index points to Primary Key value (requires 2nd lookup in clustered B+Tree)',
      postgres: 'Secondary index points directly to physical tuple address ctid (block, offset)',
      impact: 'Postgres index probes are direct 1-step; MySQL secondary lookups require primary key tree traversal.'
    },
    {
      dimension: 'MVCC Implementation',
      mysql: 'In-place updates; old tuple versions stored in Undo Log Rollback Segments (DB_ROLL_PTR)',
      postgres: 'Out-of-place updates; writes new tuple versions into Heap (xmin/xmax); cleaned by VACUUM',
      impact: 'Postgres heap bloat requires autovacuum tuning; MySQL avoids table bloat but can suffer long undo purge delays.'
    },
    {
      dimension: 'Default Wire Protocol Port',
      mysql: 'TCP 3306 (MySQL Client/Server Protocol)',
      postgres: 'TCP 5432 (PostgreSQL Frontend/Backend Protocol v3.0)',
      impact: 'Standard firewall, security group, and proxy routing ports.'
    },
    {
      dimension: 'Query Optimizer',
      mysql: 'Cost-Based Optimizer (CBO) with index statistics & histograms',
      postgres: 'Cost-Based Optimizer + GEQO (Genetic Evolutionary Query Optimizer for 12+ joins) + JIT LLVM',
      impact: 'Postgres compiles complex queries to machine code with LLVM and optimizes massive multi-table join trees.'
    },
    {
      dimension: 'Specialized Indexes',
      mysql: 'B+Tree, Full-Text, Spatial (R-Tree), Hash (Memory Engine)',
      postgres: 'B-Tree, Hash, GIN (JSONB/arrays), GiST (geo/KNN), BRIN (massive append-only), pgvector',
      impact: 'Postgres native GIN and pgvector power modern JSON document queries and AI vector search without external search engines.'
    },
    {
      dimension: 'Standard Connection String',
      mysql: 'mysql://user:pass@host:3306/db?ssl-mode=REQUIRED',
      postgres: 'postgresql://user:pass@host:5432/db?sslmode=require',
      impact: 'Uniform connection URIs for application client drivers.'
    }
  ],

  // Section 2: Connection Lifecycle & Concurrency Models
  connectionLifecycle: {
    handshakeStages: [
      { step: 1, name: 'TCP Handshake', port: 'Port 3306 / 5432', desc: 'Client initiates 3-way SYN → SYN-ACK → ACK to establish network socket.' },
      { step: 2, name: 'TLS Negotiation', port: 'TLS 1.3 / SSL', desc: 'Cipher suite exchange, public key agreement, and SSL certificate verification.' },
      { step: 3, name: 'Protocol Startup', port: 'Protocol v3.0 / Wire', desc: 'Client announces protocol version, target database, client encoding (UTF8), and session parameters.' },
      { step: 4, name: 'Authentication Challenge', port: 'SCRAM / SHA-256', desc: 'Server challenges client: SCRAM-SHA-256 (PostgreSQL) or caching_sha2_password (MySQL).' },
      { step: 5, name: 'Worker Allocation', port: 'Process / Thread', desc: 'Postmaster forks OS backend process; MySQL assigns worker thread from thread pool. Allocates private session memory.' },
      { step: 6, name: 'Query Execution Loop', port: 'SQL Stream', desc: 'Client submits query string; engine parses, plans, executes, and streams binary row packets back.' },
      { step: 7, name: 'Connection Termination', port: 'Close Packet', desc: 'Client sends close packet; engine releases worker buffers, closes file descriptors, and decrements connection counter.' }
    ],
    concurrencyDetails: {
      postgres: {
        model: 'Process-per-Connection',
        mechanism: 'Postmaster daemon executes fork() for each incoming TCP socket.',
        memory: '5 MB – 10 MB+ private RAM per backend process (work_mem, temp_buffers, private catalogs).',
        ceiling: 'Running >200–500 active processes causes severe OS context-switching overhead and CPU cache line eviction.',
        solution: 'PgBouncer connection pooler in Transaction Pooling mode is mandatory.'
      },
      mysql: {
        model: 'Thread-per-Connection',
        mechanism: 'Single mysqld multi-threaded server process. Maps client socket to worker thread.',
        memory: '1 MB – 3 MB private stack and session buffers (sort_buffer_size, join_buffer_size).',
        ceiling: 'Beyond 1,000 active threads, scheduler thrashing can degrade throughput.',
        solution: 'Thread pool plugin (MySQL Enterprise or MariaDB/Percona) maintains a bounded worker pool.'
      }
    },
    poolSizingFormula: {
      formula: 'connections ≈ (CPU Cores × 2) + Effective Spindle Count',
      source: 'HikariCP / PostgreSQL Empirical Benchmark',
      example: 'A dedicated database server with 16 CPU cores and NVMe SSD storage (1 spindle equivalent) reaches peak throughput at (16 × 2) + 1 = 33 connections!',
      warning: 'Opening 1,000 connections does not increase speed; it causes disk queue saturation, CPU context switching, spinlock contention, and memory exhaustion.'
    },
    pgBouncerModes: [
      {
        mode: 'Transaction Pooling (Recommended)',
        badge: 'Production Default',
        desc: 'Server connection is borrowed only for the duration of a transaction block (BEGIN ... COMMIT). Returned immediately upon commit.',
        benefits: 'Thousands of microservice pods can share 30–50 backend connections with sub-millisecond pool reuse.',
        limitations: 'Prohibits session-level state (SET timezone, LISTEN/NOTIFY, unnamed prepared statements).'
      },
      {
        mode: 'Session Pooling',
        badge: 'Legacy Compatibility',
        desc: 'A backend connection is bound to a client upon login and held until explicit disconnect.',
        benefits: 'Supports all session-level variables, temporary tables, and advisory locks.',
        limitations: 'Least multiplexing efficiency; connection count equals client count.'
      },
      {
        mode: 'Statement Pooling',
        badge: 'Micro-Query Only',
        desc: 'Connection is returned to pool after every individual SQL statement.',
        benefits: 'Zero connection hoarding.',
        limitations: 'Multi-statement transactions are strictly prohibited; read-only simple queries only.'
      }
    ]
  },

  // Section 3: Storage Engine & On-Disk Layout
  storageEngineLayout: {
    mysqlInnoDB: {
      type: 'Index-Organized Clustered Table',
      pageSize: '16 KB default (innodb_page_size)',
      structure: 'Primary Key B+Tree. Leaf nodes contain the ACTUAL full user row data in sorted order. Leaf pages form a doubly linked list.',
      secondaryIndex: 'A secondary index on (email) stores the email value + Primary Key (id). Querying non-indexed columns requires a Double Lookup (probe secondary B+Tree -> get PK -> probe clustered B+Tree).',
      bufferPool: 'Managed via LRU cache split into Young sublist (5/8) and Old sublist (3/8). Prevents full table scans from flushing hot working pages.',
      doublewriteBuffer: 'Writes pages to contiguous doublewrite disk buffer before writing to tablespace data files. Protects against torn pages during OS crashes.'
    },
    postgresHeap: {
      type: 'Heap Table (Unordered Disk Blocks)',
      pageSize: '8 KB fixed block frames',
      structure: 'Unordered collection of 8KB disk blocks. Every row has a physical coordinate: ctid = (block_number, tuple_offset).',
      secondaryIndex: 'All indexes (Primary Key, B-Tree, GIN, GiST) are secondary indexes pointing directly to the row\'s physical ctid.',
      hotOptimization: 'Heap-Only Tuples (HOT): When an update does not touch indexed columns and fits in the same 8KB page, creates an in-page pointer chain (old ctid -> new ctid). Secondary indexes are NOT touched, eliminating index bloat and write amplification!',
      spaceMaps: 'Free Space Map (FSM) tracks available byte capacity per block. Visibility Map (VM) tracks blocks where all tuples are older than active transactions, enabling fast Index-Only Scans.'
    },
    offPageStorage: {
      postgresTOAST: 'The Oversized-Attribute Storage Technique: Fixed 8KB pages prevent rows from spanning pages. Columns exceeding ~2KB (TEXT, JSONB, bytea) are compressed and chunked into a hidden TOAST table; main heap stores an OID pointer.',
      mysqlOffPage: 'InnoDB stores the first 768 bytes of large VARCHAR/BLOB columns inline in the clustered index leaf page, and overflows the rest to external unclustered pages.'
    }
  },

  // Section 4: MVCC & Transaction Isolation Deep Dive
  mvccDeepDive: {
    goldenRule: 'Readers never block Writers. Writers never block Readers. Writers only block Writers competing for the exact same row.',
    mechanisms: {
      mysql: {
        name: 'InnoDB Undo Log Rollback Segments',
        style: 'In-place updates with backward delta chain',
        how: 'Updates overwrite row in place in the clustered index leaf page. Old column versions are written to Undo Log pages. Row header contains DB_TRX_ID and DB_ROLL_PTR pointing backward to reconstruct older snapshots.',
        cleanup: 'Purge background threads delete Undo Log pages once no active transaction holds an older read view.'
      },
      postgres: {
        name: 'Heap Tuple Versions (Append-Only)',
        style: 'Out-of-place append with tuple header tracking',
        how: 'Updates write a brand-new tuple into the 8KB heap block. Row header stores xmin (inserting Tx ID) and xmax (updating/deleting Tx ID, 0 if active). Visibility determined by comparing xmin/xmax to transaction snapshot.',
        cleanup: 'VACUUM background daemon scans heap pages and marks dead tuples (xmax < oldest active Tx) as reusable space.'
      }
    },
    innodbLockingModes: [
      { name: 'Record Lock', desc: 'Locks the specific index record in the B+Tree leaf page.' },
      { name: 'Gap Lock', desc: 'Locks the open space between index records (or before first / after last) to prevent concurrent inserts into the gap.' },
      { name: 'Next-Key Lock', desc: 'A Record Lock combined with a Gap Lock on the space immediately preceding the record. Default in Repeatable Read to eliminate phantom reads!' },
      { name: 'Intention Locks (IS / IX)', desc: 'Table-level flags indicating a transaction plans to acquire row-level shared (IS) or exclusive (IX) locks downstream.' }
    ],
    xidWraparound: {
      problem: 'PostgreSQL transaction IDs (xmin/xmax) are 32-bit unsigned integers (~4.2 billion capacity). At high write rates, IDs wrap around back to zero. Old rows would appear to be created in the "future" and vanish!',
      solution: 'autovacuum freezes old tuples by setting a special Frozen infomask bit. Frozen tuples are globally visible to all transactions regardless of current XID. autovacuum_freeze_max_age ensures emergency vacuum runs before wraparound occurs.'
    }
  },

  // Section 5: Indexing Systems & Sargability Rules
  indexingMasterclass: {
    typesTable: [
      { type: 'B+Tree / B-Tree', mysql: 'Default (Clustered & Secondary)', postgres: 'Default (Standard secondary)', complexity: 'O(log N)', bestFor: 'Equality (=), range (<, >, BETWEEN), sorting (ORDER BY), prefix (LIKE "abc%").' },
      { type: 'Hash Index', mysql: 'Memory Engine only (Adaptive Hash internally)', postgres: 'Native index type (USING hash)', complexity: 'O(1)', bestFor: 'Exact equality lookups (=). No range scans, no sorting.' },
      { type: 'GIN (Generalized Inverted)', mysql: 'Not Available', postgres: 'Supported (USING gin)', complexity: 'O(keys)', bestFor: 'Multivalued data: JSONB attributes (@>), Arrays (&&), full-text search (tsvector), Trigram wildcard (LIKE "%abc%").' },
      { type: 'GiST (Generalized Search Tree)', mysql: 'Spatial R-Tree (GEOMETRY only)', postgres: 'Supported (USING gist)', complexity: 'O(log N)', bestFor: 'Geometric coordinates, PostGIS spatial queries (ST_DWithin), range types (daterange), k-NN nearest neighbor.' },
      { type: 'BRIN (Block Range Index)', mysql: 'Not Available', postgres: 'Supported (USING brin)', complexity: 'O(blocks)', bestFor: 'Massive append-only tables (billions of rows) physically ordered by date/ID. Stores min/max per 128 heap blocks (tiny footprint!).' },
      { type: 'Vector Index (HNSW / IVFFlat)', mysql: 'Third-party plugin', postgres: 'Native via pgvector extension', complexity: 'O(log N) approx', bestFor: 'AI semantic vector embeddings, similarity search (<-> L2 distance, cosine similarity).' }
    ],
    leftmostPrefixRule: {
      indexDef: 'CREATE INDEX idx_users ON users (status, created_at, user_id);',
      usable1: 'WHERE status = "active" AND created_at > "2026-01-01"  -->  USES (status + created_at)',
      usable2: 'WHERE status = "pending"  -->  USES (status prefix)',
      unusable: 'WHERE created_at > "2026-01-01"  -->  UNUSABLE! (Missing leftmost column status -> Full Table Scan)'
    },
    advancedStrategies: [
      { name: 'Covering Indexes (INCLUDE)', desc: 'Appends non-key columns to leaf nodes without adding them to search tree (CREATE INDEX idx ON t (email) INCLUDE (last_login)). Enables Index-Only Scans with zero heap lookups.' },
      { name: 'Partial Indexes (PostgreSQL)', desc: 'Indexes only rows matching a predicate (CREATE INDEX idx ON users (email) WHERE status = "active"). Saves gigabytes of disk and memory.' },
      { name: 'Expression / Functional Indexes', desc: 'Indexes function return value rather than raw column (CREATE INDEX idx ON users (LOWER(email))). Enables fast case-insensitive lookups.' }
    ],
    sargabilityCode: [
      {
        bad: "WHERE YEAR(created_at) = 2026",
        good: "WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'",
        reason: "Function wrapping column invalidates index range scan, forcing full sequential scan."
      },
      {
        bad: "WHERE salary + 5000 > 60000",
        good: "WHERE salary > 55000",
        reason: "Arithmetic on column prevents index probe. Isolate column on one side of operator."
      },
      {
        bad: "WHERE email LIKE '%@gmail.com'",
        good: "WHERE email_reversed LIKE 'moc.liamg@%'  -- or GIN trigram index",
        reason: "Leading wildcard disables B-Tree prefix search because sort starts from leftmost character."
      },
      {
        bad: "WHERE phone = 9876543210  -- (phone is VARCHAR)",
        good: "WHERE phone = '9876543210'",
        reason: "Data type mismatch triggers implicit CAST(phone AS INT), disabling index seek."
      }
    ]
  },

  // Section 6: Query Execution Pipeline & Relational Algebra
  queryPipeline: {
    stages: [
      { num: 1, name: 'PARSER', action: 'Lexical analysis & grammar syntax verification -> Abstract Syntax Tree (AST).' },
      { num: 2, name: 'ANALYZER / BINDER', action: 'Identifier resolution against System Catalogs, type checks, schema permissions.' },
      { num: 3, name: 'REWRITER', action: 'View expansion, rule application, constant folding ("1 + 1" -> 2).' },
      { num: 4, name: 'OPTIMIZER (Planner)', action: 'Translates to Relational Algebra; Cost-Based Optimizer (CBO) picks index/scan paths & join order.' },
      { num: 5, name: 'EXECUTOR', action: 'Volcano Iterator Model [open() -> next() -> close()] streaming row tuples to client socket.' }
    ],
    relationalAlgebraSymbols: [
      { symbol: 'σ (sigma)', name: 'Selection', sql: 'WHERE condition', purpose: 'Filters rows matching predicate σ_P(R). Reduces row cardinality.' },
      { symbol: 'π (pi)', name: 'Projection', sql: 'SELECT col1, col2', purpose: 'Selects specific columns and discards unwanted attributes.' },
      { symbol: 'ρ (rho)', name: 'Rename', sql: 'AS alias', purpose: 'Renames a relation or attribute for disambiguation.' },
      { symbol: '⨝θ (bowtie)', name: 'Theta Join', sql: 'JOIN ... ON condition', purpose: 'Cross product followed by selection on join predicate θ.' },
      { symbol: '⋉ (semi-join)', name: 'Semi-Join', sql: 'WHERE EXISTS (...)', purpose: 'Returns left rows with ≥1 right match without duplicating rows.' },
      { symbol: '▷ (anti-join)', name: 'Anti-Join', sql: 'WHERE NOT EXISTS (...)', purpose: 'Returns left rows with 0 matches in the right table.' },
      { symbol: '⟕ / ⟖ / ⟗', name: 'Outer Joins', sql: 'LEFT / RIGHT / FULL JOIN', purpose: 'Preserves unmatched rows, padding missing columns with NULL.' },
      { symbol: 'γ (gamma)', name: 'Aggregation', sql: 'GROUP BY + SUM()', purpose: 'Groups rows by keys and evaluates aggregate functions.' },
      { symbol: 'τ (tau)', name: 'Sort', sql: 'ORDER BY col', purpose: 'Orders tuples via in-memory quicksort or external disk merge sort.' }
    ],
    logicalOrder: [
      'FROM / JOIN', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'DISTINCT', 'ORDER BY', 'LIMIT / OFFSET'
    ],
    logicalOrderRule: 'Column aliases assigned in SELECT cannot be referenced in WHERE because WHERE executes BEFORE SELECT projects output attributes!',
    advancedExecution: {
      parallelism: 'Dividing large sequential scans, hash joins, and aggregations across multiple background worker threads (max_parallel_workers_per_gather in PG).',
      jitCompilation: 'PostgreSQL 11+ uses LLVM to Just-In-Time compile complex SQL expressions directly into native x86/ARM machine code at query execution time.'
    }
  },

  // Section 7: Physical Join Algorithms
  physicalJoins: [
    {
      name: 'Nested Loop Join',
      complexity: 'O(N × M) raw, or O(N × log M) with inner index',
      codeSnippet: `For each outer_row in OuterTable:\n    For each inner_row in InnerTable (or index probe):\n        If join_condition(outer_row, inner_row) matches:\n            emit(outer_row + inner_row)`,
      optimalWhen: 'Outer table is small (<100 rows) and inner table has a selective B-Tree index on the join key (Index Nested Loop Join).'
    },
    {
      name: 'Hash Join',
      complexity: 'O(N + M) linear time',
      codeSnippet: `Phase 1 (Build):\n    Scan smaller table (Outer) -> Populate in-memory Hash Table\nPhase 2 (Probe):\n    Scan larger table (Inner) -> Probe Hash Table for matching buckets -> Emit matches`,
      optimalWhen: 'Large unsorted tables with equality join predicates (ON a.id = b.id). Grace Hash Join spills partitions to disk if work_mem is exceeded.'
    },
    {
      name: 'Sort-Merge Join',
      complexity: 'O(N log N + M log M) with sorting; O(N + M) if pre-sorted',
      codeSnippet: `Phase 1 (Sort):\n    Sort OuterTable and InnerTable on join_key (if not index-ordered)\nPhase 2 (Merge):\n    Walk both sorted streams in lockstep (zipper merge) -> Emit matches`,
      optimalWhen: 'Input sets are pre-ordered by indexes or the query includes ORDER BY matching the join key.'
    }
  ],

  // Section 8: Replication, Partitioning & Scaling Topologies
  replicationAndScaling: {
    horizontalVsVertical: {
      vertical: {
        title: 'Vertical Scaling (Scale UP)',
        pros: 'Keeps ACID, relational joins, and foreign keys completely intact. Zero application code changes.',
        cons: 'Hardware ceiling, Single Point of Failure (SPOF), exponential cost curve at high end.'
      },
      horizontal: {
        title: 'Horizontal Scaling (Scale OUT)',
        pros: 'Virtually unbounded storage, massive write throughput, commodity hardware economics.',
        cons: 'Distributed joins require scatter-gather queries; Two-Phase Commit (2PC) adds latency.'
      }
    },
    partitioningTypes: [
      { name: 'Range Partitioning', desc: 'Split by date or sequential ID (orders_2026_q1, orders_2026_q2). Efficient for dropping old data (DROP TABLE vs slow DELETE).' },
      { name: 'List Partitioning', desc: 'Split by explicit discrete values (country IN ("US", "CA")).' },
      { name: 'Hash Partitioning', desc: 'Split evenly across partitions using internal hash modulus (MOD(hash(user_id), 8)).' }
    ],
    mysqlHA: {
      binlog: 'Binary Log (binlog) supporting Row-based (RBR), Statement-based (SBR), or Mixed replication.',
      semisync: 'Primary waits for at least one replica to acknowledge receipt of binlog event into relay log before returning success.',
      galera: 'Group Replication / Galera Cluster: Multi-primary or single-primary Paxos-based consensus cluster.',
      orchestrator: 'Standard industry topology manager for MySQL automated master discovery and failover.'
    },
    postgresHA: {
      streaming: 'Physical Streaming Replication streams exact byte-level WAL records (pg_wal) to standby nodes.',
      synchronous: 'Configurable via synchronous_commit = on | remote_apply and synchronous_standby_names = "FIRST 1 (s1, s2)".',
      logical: 'Publish/Subscribe model (CREATE PUBLICATION / CREATE SUBSCRIPTION) for selective table replication, zero-downtime upgrades, and Kafka streaming.',
      patroni: 'Industry standard for PostgreSQL HA. Uses distributed consensus (etcd, Consul, ZooKeeper) for split-brain-proof automatic leader election and failover.'
    }
  },

  // Section 9: Production Parameter Tuning Reference
  productionTuning: {
    mysql: {
      filename: 'my.cnf',
      configText: `[mysqld]
# 1. Memory Buffers (Target: 60-75% dedicated server RAM)
innodb_buffer_pool_size         = 24G
innodb_buffer_pool_instances     = 8           # Reduce lock contention on pool mutexes
innodb_log_buffer_size          = 64M

# 2. Transaction Log & Durability
innodb_log_file_size            = 2G          # Larger log reduces dirty page checkpoint flushing
innodb_flush_log_at_trx_commit  = 1           # Strict ACID (flush to disk on every commit)
sync_binlog                     = 1           # Strict binlog durability

# 3. Disk I/O Tuning (NVMe SSD)
innodb_flush_method             = O_DIRECT    # Bypass OS cache to avoid double buffering
innodb_io_capacity              = 10000       # Target IOPS for background flushing
innodb_io_capacity_max          = 20000

# 4. Connection & Concurrency
max_connections                 = 500
thread_cache_size               = 64`,
      parameters: [
        { name: 'innodb_buffer_pool_size', val: '24G', desc: 'Main data & index RAM cache (allocate 60-75% of server RAM).' },
        { name: 'innodb_buffer_pool_instances', val: '8', desc: 'Splits pool into multiple instances to eliminate mutex lock contention on multicore CPUs.' },
        { name: 'innodb_log_file_size', val: '2G', desc: 'Larger redo log smooths out dirty page checkpoint flushes during write spikes.' },
        { name: 'innodb_flush_log_at_trx_commit', val: '1', desc: 'Strict ACID: fsyncs redo log to disk on every single transaction commit.' },
        { name: 'sync_binlog', val: '1', desc: 'Strict binlog durability: synchronizes binary log to disk after every commit.' },
        { name: 'innodb_flush_method', val: 'O_DIRECT', desc: 'Bypasses Linux OS filesystem cache to avoid double-buffering with buffer pool.' },
        { name: 'innodb_io_capacity', val: '10000', desc: 'Tells InnoDB background writer threads the available NVMe SSD IOPS throughput.' }
      ]
    },
    postgres: {
      filename: 'postgresql.conf',
      configText: `# 1. Memory Architecture
shared_buffers                  = 8GB         # 25% of 32GB RAM
effective_cache_size            = 24GB        # Hint to optimizer of OS Page Cache capacity
work_mem                        = 64MB        # Memory per sort/hash operation (per query node!)
maintenance_work_mem            = 2GB         # Accelerates CREATE INDEX and VACUUM

# 2. WAL & Durability
wal_level                       = replica
max_wal_size                    = 16GB
min_wal_size                    = 2GB
checkpoint_completion_target    = 0.9         # Smooths I/O by spreading checkpoint writes over 90% of interval
synchronous_commit              = on

# 3. Disk Planner Costs (NVMe SSD Tuning)
random_page_cost                = 1.1         # Lower cost tells planner SSD random reads are near-equal to sequential
seq_page_cost                   = 1.0

# 4. Background Autovacuum Tuning
autovacuum                      = on
autovacuum_max_workers          = 4
autovacuum_vacuum_cost_limit    = 1000        # Increase throughput for high-write tables`,
      parameters: [
        { name: 'shared_buffers', val: '8GB', desc: 'PostgreSQL internal memory buffer (typically 25% of total system RAM).' },
        { name: 'effective_cache_size', val: '24GB', desc: 'Planner hint indicating combined shared_buffers and Linux OS page cache availability (50-75% RAM).' },
        { name: 'work_mem', val: '64MB', desc: 'Private RAM per sort/hash node. Complex queries with 4 joins can allocate 4 × 64MB per connection!' },
        { name: 'maintenance_work_mem', val: '2GB', desc: 'Dedicated memory for maintenance operations like CREATE INDEX, VACUUM, and ALTER TABLE.' },
        { name: 'checkpoint_completion_target', val: '0.9', desc: 'Spreads dirty page writing over 90% of the checkpoint interval, eliminating I/O spikes.' },
        { name: 'random_page_cost', val: '1.1', desc: 'SSD optimization: Tells planner that random reads on NVMe are almost as fast as sequential reads (seq_page_cost = 1.0).' },
        { name: 'autovacuum_vacuum_cost_limit', val: '1000', desc: 'Increases autovacuum throttling limit to prevent dead tuple table bloat on high-write systems.' }
      ]
    }
  }
};

