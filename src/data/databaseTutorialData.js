// =========================================================================
// DATABASE TUTORIAL CURRICULUM DATA (Derived from doc/database.md)
// 15 Comprehensive Chapters categorized into Basic, Intermediate, and Advanced
// Covers: Fundamentals, Normalization (1NF-5NF), Connections, Query Execution,
// Relational Algebra, Join Algorithms, Scaling, Sharding, Indexing, and MVCC
// =========================================================================

export const DATABASE_TUTORIAL_LEVELS = [
  { id: 'all', label: 'All Levels', count: 15 },
  { id: 'basic', label: '🟢 Basic / Fundamentals', badge: 'Chapters 1-4', count: 4, color: '#10b981' },
  { id: 'intermediate', label: '🟡 Intermediate / Architecture', badge: 'Chapters 5-10', count: 6, color: '#f59e0b' },
  { id: 'advanced', label: '🔴 Advanced / Distributed & Internals', badge: 'Chapters 11-15', count: 5, color: '#ef4444' }
];

export const DATABASE_TUTORIAL_CHAPTERS = [
  // =========================================================================
  // 🟢 LEVEL 1: BASIC / FUNDAMENTALS (Chapters 1 - 4)
  // =========================================================================
  {
    id: 'ch-1',
    chapterNumber: 1,
    level: 'basic',
    levelLabel: '🟢 Basic',
    title: 'Database Fundamentals & Storage Paradigms',
    subtitle: 'What is a DBMS, RDBMS vs NoSQL categories, ACID guarantees, and Core Relational Terminology',
    readTime: '6 min read',
    relatedTab: 'guide',
    tags: ['DBMS', 'RDBMS', 'NoSQL', 'ACID', 'Keys', 'Data Models'],
    summary: 'A database is an organized collection of data managed by a DBMS. Learn the architectural differences between relational tables, document stores, key-value caches, graph networks, and the fundamental ACID guarantees that keep enterprise data safe.',
    keyTakeaways: [
      'A DBMS (PostgreSQL, MySQL, MongoDB) manages physical storage, security, concurrent transactions, and query compilation.',
      'Relational databases excel at structured schemas and relational joins; Document stores (MongoDB) excel at flexible hierarchical documents; Key-Value (Redis) excels at ultra-fast lookups.',
      'ACID guarantees: Atomicity (all-or-nothing), Consistency (rules hold), Isolation (concurrent safety), Durability (survives crashes via WAL/redo log).',
      'Understand Candidate Keys vs Primary Keys vs Foreign Keys vs Surrogate and Natural Keys.'
    ],
    sections: [
      {
        heading: '1.1 What is a Database & DBMS?',
        content: `A **database** is an organized collection of data stored electronically. A **DBMS** (Database Management System) is the software suite that handles storage, retrieval, concurrency, recovery, and security on disk and memory (e.g., PostgreSQL, MySQL, SQL Server, MongoDB, Oracle).

Without a DBMS, applications would have to manage raw disk files, deal with concurrent read/write race conditions, prevent corrupt half-written files during server crashes, and build custom search indices from scratch.`
      },
      {
        heading: '1.2 Major Database Categories',
        content: `Modern software architectures leverage polyglot persistence, selecting the database type that best matches the workload:`,
        table: {
          headers: ['Type', 'Examples', 'Data Model', 'Best Suited For'],
          rows: [
            ['Relational (RDBMS)', 'PostgreSQL, MySQL, SQL Server', 'Structured tables, rows, columns', 'Transactional systems (OLTP), strong consistency, complex multi-table joins'],
            ['Document Store', 'MongoDB (WiredTiger Storage Engine), CouchDB', 'JSON/BSON hierarchical documents', 'Rapid schema iteration, nested arrays/objects, content management'],
            ['Key-Value', 'Redis, DynamoDB, Memcached', 'Key → Arbitrary Value / Hashes', 'High-throughput caching, session storage, distributed rate limiters'],
            ['Wide-Column', 'Apache Cassandra, ScyllaDB, HBase', 'Column families, multi-dimensional maps', 'High-volume write logging, telemetry, IoT sensor time-series'],
            ['Graph DB', 'Neo4j, Amazon Neptune', 'Nodes, directed edges, properties', 'Social networks, recommendation engines, fraud detection rings'],
            ['Time-Series', 'TimescaleDB, InfluxDB', 'Timestamped numeric data streams', 'DevOps metrics, APM tracing, financial ticker feeds'],
            ['Search Engine', 'Elasticsearch, OpenSearch', 'Inverted token indexes', 'Full-text search, log aggregation, autocomplete analyzers'],
            ['Distributed SQL (NewSQL)', 'CockroachDB, TiDB, Google Spanner', 'Relational tables on distributed Raft consensus', 'Global horizontal scale with strong ACID SQL semantics']
          ]
        }
      },
      {
        heading: '1.3 The ACID Properties in Action',
        content: `ACID guarantees form the backbone of reliable transactional data processing:

- **A — Atomicity**: A transaction is atomic—either all statements commit together, or the entire transaction aborts and rolls back completely.
- **C — Consistency**: A transaction transitions the database from one valid state to another, strictly enforcing all constraints (Foreign Keys, NOT NULL, CHECK, UNIQUE).
- **I — Isolation**: Concurrent transactions execute without cross-talk or race conditions. Read levels dictate whether one transaction sees another uncommitted write.
- **D — Durability**: Once committed, the write is written to non-volatile storage (via Write-Ahead Logging / Redo Log) and will survive hardware crashes and power outages.`
      },
      {
        heading: '1.4 Relational Keys Reference',
        content: `Keys define identity and integrity within relational tables:

- **Primary Key (PK)**: Uniquely identifies each row; cannot contain NULL.
- **Foreign Key (FK)**: References the Primary Key of another table, enforcing referential integrity.
- **Candidate Key**: Any minimal set of columns that can uniquely identify a row.
- **Super Key**: Any set of attributes that uniquely identifies a row (may contain redundant columns).
- **Surrogate Key**: An artificial synthetic identifier (e.g., auto-increment \`BIGINT\`, \`UUIDv7\`).
- **Natural Key**: A real-world attribute that is inherently unique (e.g., email address, ISBN, tax ID).`
      }
    ]
  },
  {
    id: 'ch-2',
    chapterNumber: 2,
    level: 'basic',
    levelLabel: '🟢 Basic',
    title: 'Database Normalization (1NF → 3NF)',
    subtitle: 'Eliminating the three anomalies (Insertion, Update, Deletion) through functional dependency decomposition',
    readTime: '8 min read',
    relatedTab: 'normalization',
    tags: ['1NF', '2NF', '3NF', 'Functional Dependency', 'Anomalies', 'Decomposition'],
    summary: 'Normalization is the structured discipline of decomposing tables to reduce data redundancy and eliminate update anomalies. Walk through 1NF (atomic cells), 2NF (no partial dependencies on composite keys), and 3NF (no transitive dependencies) using a real e-commerce example.',
    keyTakeaways: [
      'The 3 Database Anomalies: Insertion anomaly (cannot add data without extra info), Update anomaly (must change multiple rows or risk inconsistency), Deletion anomaly (deleting one fact accidentally deletes another).',
      'Functional Dependency X → Y: If two tuples agree on column X, they must strictly agree on column Y.',
      '1NF: Every cell holds a single atomic scalar value; each row has a primary key.',
      '2NF: Must be in 1NF and have NO partial dependencies—every non-key column depends on the ENTIRE composite key.',
      '3NF: Must be in 2NF and have NO transitive dependencies—non-key attributes depend only on the key ("the key, the whole key, and nothing but the key").'
    ],
    sections: [
      {
        heading: '2.1 The Three Database Anomalies',
        content: `Consider this poorly designed unnormalized table combining students and course data:

\`\`\`
| student_id | student_name | course_id | course_name | instructor | instructor_phone |
| 1          | Asha         | C101      | Databases   | Dr. Rao    | 98xxxx01         |
| 2          | Ravi         | C101      | Databases   | Dr. Rao    | 98xxxx01         |
| 1          | Asha         | C102      | Networks    | Dr. Sen    | 98xxxx02         |
\`\`\`

1. **Insertion Anomaly**: You cannot add a new course until a student enrolls in it, because \`student_id\` cannot be null in the primary key.
2. **Update Anomaly**: If Dr. Rao changes phone numbers, you must update multiple rows. If one row is missed, the database becomes corrupt and contradictory.
3. **Deletion Anomaly**: If Asha drops \`C102\`, deleting the last row also destroys the record that the Networks course and Dr. Sen exist!`
      },
      {
        heading: '2.2 First Normal Form (1NF)',
        content: `**Rule**:
- Each column must hold a single **atomic** value (no comma-separated lists, arrays, or JSON blocks).
- Every row must be unique and identifiable by a Primary Key.

❌ **Violates 1NF**:
\`\`\`
| order_id | customer | products          |
| 1        | Asha     | Pen, Book, Bag    |
\`\`\`

✅ **Complies with 1NF**:
\`\`\`
| order_id | customer | product |
| 1        | Asha     | Pen     |
| 1        | Asha     | Book    |
| 1        | Asha     | Bag     |
\`\`\``
      },
      {
        heading: '2.3 Second Normal Form (2NF)',
        content: `**Rule**:
- Must be in 1NF.
- **No Partial Dependencies**: Every non-key attribute must depend on the *entire* composite key, not just a subset of it. (Only applies to tables with composite primary keys!)

❌ **Violates 2NF** (Primary Key = \`{order_id, product_id}\`):
\`\`\`
| order_id (PK) | product_id (PK) | product_name | quantity |
| 1             | P101            | Laptop       | 2        |
\`\`\`
Here, \`product_name\` depends ONLY on \`product_id\`, which is only part of the composite key.

✅ **Decomposed into 2NF**:
\`\`\`sql
-- Table 1: products
CREATE TABLE products (
  product_id   VARCHAR(20) PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL
);

-- Table 2: order_items
CREATE TABLE order_items (
  order_id   INT,
  product_id VARCHAR(20) REFERENCES products(product_id),
  quantity   INT NOT NULL,
  PRIMARY KEY (order_id, product_id)
);
\`\`\``
      },
      {
        heading: '2.4 Third Normal Form (3NF)',
        content: `**Rule**:
- Must be in 2NF.
- **No Transitive Dependencies**: Non-key attributes must depend *only on the primary key*, not on other non-key attributes (\`A → B → C\`).

❌ **Violates 3NF**:
\`\`\`
| emp_id (PK) | emp_name | dept_id | dept_name    |
| 1           | Asha     | D01     | Engineering  |
\`\`\`
Here: \`emp_id → dept_id\` and \`dept_id → dept_name\`. Therefore, \`dept_name\` is transitively dependent on \`emp_id\`.

✅ **Decomposed into 3NF**:
\`\`\`sql
CREATE TABLE departments (
  dept_id   VARCHAR(10) PRIMARY KEY,
  dept_name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
  emp_id   INT PRIMARY KEY,
  emp_name VARCHAR(100) NOT NULL,
  dept_id  VARCHAR(10) REFERENCES departments(dept_id)
);
\`\`\`

> 💡 **Classic Memory Aid**: *"Every non-key attribute must provide a fact about **the key, the whole key, and nothing but the key**, so help me Codd."*`
      }
    ]
  },
  {
    id: 'ch-3',
    chapterNumber: 3,
    level: 'basic',
    levelLabel: '🟢 Basic',
    title: 'Database Engine Connections & Security',
    subtitle: 'Wire protocols, process vs thread concurrency, secure connection strings, and language client drivers',
    readTime: '7 min read',
    relatedTab: 'connections',
    tags: ['TCP', 'Wire Protocol', 'Postmaster', 'psycopg', 'JDBC', 'Security', 'SQL Injection'],
    summary: 'When an application issues a query, it communicates across a TCP or Unix domain socket via a binary wire protocol. Learn the connection lifecycle, concurrency models across PostgreSQL and MySQL, and production-ready connection examples in Python, Node.js, and Java.',
    keyTakeaways: [
      'A database connection requires TCP 3-way handshake, TLS negotiation, authentication (SCRAM-SHA-256), and server session allocation.',
      'PostgreSQL uses a process-per-connection model (heavy, ~5-10MB/conn); MySQL uses a thread-per-connection model; Redis uses a single-threaded event loop.',
      'Standard default ports: PostgreSQL (5432), MySQL (3306), MongoDB (27017), Redis (6379), SQL Server (1433).',
      'Always use parameterized queries/prepared statements to prevent SQL Injection vulnerability.'
    ],
    sections: [
      {
        heading: '3.1 The Wire Protocol & Connection Lifecycle',
        content: `Clients communicate with database engines through a structured state machine over TCP or Unix sockets:

1. **TCP 3-Way Handshake**: Client initiates SYN to target host:port.
2. **TLS Handshake**: Encrypted tunnel negotiated (TLS 1.3 recommended).
3. **Startup Frame**: Client transmits protocol version (e.g. PG v3.0), user, and target database.
4. **Authentication**: Challenge-response exchange (e.g., SCRAM-SHA-256 in Postgres, \`caching_sha2_password\` in MySQL).
5. **Session Allocation**: Engine assigns an internal worker process or thread, initializing session parameters (\`work_mem\`, transaction isolation level).
6. **Query Loop**: Client sends query frames; server parses, executes, and streams back tabular rows.
7. **Termination**: Client sends close message; server deallocates session memory buffers.`
      },
      {
        heading: '3.2 Concurrency Architecture by Engine',
        content: `Different database engines use distinct OS concurrency architectures:

- **PostgreSQL (Process-per-connection)**: The \`postmaster\` process calls \`accept()\` and \`fork()\` to spawn a dedicated backend process for each client. Each connection consumes ~5–10 MB of OS memory. Exceeding a few hundred connections degrades throughput without a pooler.
- **MySQL / InnoDB (Thread-per-connection)**: Uses OS threads rather than processes. Lighter memory footprint, but thread context-switching still limits single-node scale to 1,000–3,000 concurrent threads.
- **MongoDB (Thread Pool + Async I/O)**: Spawns worker threads from an internal pool to handle client requests.
- **Redis (Single-Threaded Event Loop)**: Executes commands on a single thread using non-blocking \`epoll\`, eliminating lock contention and context-switching.`
      },
      {
        heading: '3.3 Production Connection Code Snippets',
        content: `**Python (psycopg3 Connection Pool)**:
\`\`\`python
import os
from psycopg_pool import ConnectionPool

pool = ConnectionPool(
    conninfo=os.environ["DATABASE_URL"],
    min_size=2,
    max_size=10,
    timeout=5.0
)

# Borrow connection from pool
with pool.connection() as conn:
    with conn.cursor() as cur:
        # Parameterized query protects against SQL Injection!
        cur.execute("SELECT id, name, email FROM users WHERE id = %s", (42,))
        user = cur.fetchone()
        print(user)
\`\`\`

**Node.js (pg Pool)**:
\`\`\`javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const { rows } = await pool.query(
  'SELECT id, name, email FROM users WHERE id = $1',
  [42]
);
\`\`\`

**Java (HikariCP)**:
\`\`\`java
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:postgresql://host:5432/mydb");
config.setUsername(System.getenv("DB_USER"));
config.setPassword(System.getenv("DB_PASS"));
config.setMaximumPoolSize(10);
config.setConnectionTimeout(5000);

HikariDataSource ds = new HikariDataSource(config);
try (Connection conn = ds.getConnection();
     PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?")) {
    ps.setInt(1, 42);
    ResultSet rs = ps.executeQuery();
}
\`\`\``
      },
      {
        heading: '3.4 Security & SQL Injection Defense',
        content: `Never concatenate strings into dynamic SQL queries:

\`\`\`python
# ❌ VULNERABLE TO SQL INJECTION:
# An attacker inputting: "admin' OR '1'='1" bypasses all auth!
cur.execute(f"SELECT * FROM users WHERE username = '{username}'")

# ✅ SAFE: Parameterized Query
# The engine compiles the query structure first; input is treated strictly as data literals.
cur.execute("SELECT * FROM users WHERE username = %s", (username,))
\`\`\`

Always enforce **least privilege** (separate read-only reporting roles from read-write application users), require **TLS encryption in transit** (\`sslmode=verify-full\`), and keep databases in **private subnets** with zero public internet ingress.`
      }
    ]
  },
  {
    id: 'ch-4',
    chapterNumber: 4,
    level: 'basic',
    levelLabel: '🟢 Basic',
    title: 'Indexing 101: Fundamentals & B-Tree Concept',
    subtitle: 'Why table scans fail at scale, B-Tree O(log N) lookups, and primary vs unique vs foreign key indexes',
    readTime: '6 min read',
    relatedTab: 'indexing',
    tags: ['Indexing', 'B-Tree', 'Seq Scan', 'Index Scan', 'Primary Key', 'Foreign Key'],
    summary: 'An index is an auxiliary data structure on disk that enables the database engine to find specific rows in logarithmic time rather than scanning every block on disk. Understand when to index, the trade-off of slower writes, and why foreign keys must always be indexed.',
    keyTakeaways: [
      'Without an index, querying 10,000,000 rows requires a Sequential Scan: O(N) disk page reads.',
      'A B-Tree index allows the engine to jump directly to target rows in 3 to 4 page reads: O(log N).',
      'The indexing trade-off: Fast reads vs slower writes (every INSERT, UPDATE, DELETE must update every index on the table).',
      'Foreign Key columns are not automatically indexed by most engines—always add indexes on FK columns to prevent full-table locks during cascading deletes and joins.'
    ],
    sections: [
      {
        heading: '4.1 What is an Index?',
        content: `An **index** is a sorted auxiliary data structure maintained by the database engine that stores indexed column values alongside physical pointers to the actual table rows (Tuple IDs / CTID in Postgres, or Primary Key values in InnoDB).

Like the alphabetical index at the back of a physical book:
- **Without an index**: You must read every page from start to finish to find a topic (**Sequential Scan: O(N)**).
- **With an index**: You look up the term in the index, get the page number, and jump directly there (**Index Scan: O(log N)**).`
      },
      {
        heading: '4.2 The Cost-Benefit Trade-Off',
        content: `Every index comes with a write penalty:

| ✅ Benefits | ❌ Costs |
|---|---|
| Radically faster \`SELECT\`, \`WHERE\`, \`JOIN\`, \`ORDER BY\` | Extra disk and RAM space |
| Enforces data uniqueness (\`UNIQUE\` constraints) | **Slower writes**: \`INSERT\`, \`UPDATE\`, and \`DELETE\` must maintain each index structure |
| Instant \`MIN()\` and \`MAX()\` evaluations | Cache pollution if indexes exceed available RAM |

> 💡 **Golden Rule**: Index what you query frequently; do not blindly index every column.`
      },
      {
        heading: '4.3 Basic Index Types by Role',
        content: `\`\`\`sql
-- 1. Primary Key: Automatically creates a unique B-Tree index
ALTER TABLE users ADD PRIMARY KEY (id);

-- 2. Unique Index: Guarantees unique values across the table
CREATE UNIQUE INDEX idx_users_email ON users (email);

-- 3. Standard Secondary Index
CREATE INDEX idx_orders_customer_id ON orders (customer_id);

-- 4. Foreign Key Index: ALWAYS index foreign keys!
-- Speeds up JOIN operations and prevents table-wide locking during parent row deletes
CREATE INDEX idx_order_items_product_id ON order_items (product_id);
\`\`\`

**Dropping & Inspecting Indexes**:
\`\`\`sql
-- PostgreSQL
SELECT * FROM pg_indexes WHERE tablename = 'users';
DROP INDEX idx_orders_customer_id;

-- MySQL
SHOW INDEX FROM users;
DROP INDEX idx_orders_customer_id ON orders;
\`\`\``
      }
    ]
  },

  // =========================================================================
  // 🟡 LEVEL 2: INTERMEDIATE / ARCHITECTURE (Chapters 5 - 10)
  // =========================================================================
  {
    id: 'ch-5',
    chapterNumber: 5,
    level: 'intermediate',
    levelLabel: '🟡 Intermediate',
    title: 'Advanced Normalization (BCNF, 4NF, 5NF) & Denormalization',
    subtitle: 'Boyce-Codd Normal Form, multi-valued dependencies, and when to deliberately break the rules for read performance',
    readTime: '8 min read',
    relatedTab: 'normalization',
    tags: ['BCNF', '4NF', '5NF', 'Denormalization', 'OLTP', 'OLAP', 'Materialized Views'],
    summary: 'When 3NF is not enough: learn Boyce-Codd Normal Form (BCNF) for overlapping candidate keys and 4NF for multi-valued dependencies. Then explore the engineering science of deliberate denormalization: materialized views, summary tables, and precomputed aggregates for high-scale reads.',
    keyTakeaways: [
      'BCNF: For every non-trivial functional dependency X → Y, X must be a super key. Eliminates anomalies when overlapping candidate keys exist.',
      '4NF: Eliminates multi-valued dependencies (MVDs) where independent sets of facts (e.g. skills × spoken languages) multiply redundantly.',
      'Normalization favors write integrity; Denormalization favors read latency.',
      'Denormalization strategies: precomputed counters, materialized views, summary rollups, and JSON columns for sparse attributes.'
    ],
    sections: [
      {
        heading: '5.1 Boyce-Codd Normal Form (BCNF)',
        content: `**Rule**: A table is in BCNF if for every non-trivial functional dependency \`X → Y\`, **X is a super key**.

BCNF is a stricter version of 3NF. They only diverge when a table possesses **multiple overlapping candidate keys**.

❌ **Violates BCNF**:
Consider a school table where each teacher teaches only one subject, but multiple teachers can teach that subject:
\`\`\`
| student (PK) | subject (PK) | teacher |
| Asha         | DB           | Rao     |
| Ravi         | DB           | Rao     |
| Asha         | Networks     | Sen     |
\`\`\`
Dependency: \`teacher → subject\`, but \`teacher\` is NOT a super key!

✅ **Decomposed into BCNF**:
\`\`\`sql
-- Table 1: teacher assignment
CREATE TABLE teacher_subject (
  teacher VARCHAR(50) PRIMARY KEY,
  subject VARCHAR(50) NOT NULL
);

-- Table 2: student enrollments
CREATE TABLE student_teacher (
  student VARCHAR(50),
  teacher VARCHAR(50) REFERENCES teacher_subject(teacher),
  PRIMARY KEY (student, teacher)
);
\`\`\``
      },
      {
        heading: '5.2 Fourth Normal Form (4NF)',
        content: `**Rule**: Must be in BCNF and contain **no Multi-Valued Dependencies (MVDs)**.

An MVD (\`A ↠ B\`) occurs when two independent multi-valued facts depend on the same entity.

❌ **Violates 4NF**:
An employee has multiple independent skills AND speaks multiple languages:
\`\`\`
| employee | skill  | language |
| Asha     | SQL    | English  |
| Asha     | SQL    | Hindi    |
| Asha     | Python | English  |
| Asha     | Python | Hindi    |
\`\`\`
Every skill must be paired with every language, causing combinatorial row explosion.

✅ **Decomposed into 4NF**:
\`\`\`sql
CREATE TABLE employee_skills (
  employee VARCHAR(50),
  skill    VARCHAR(50),
  PRIMARY KEY (employee, skill)
);

CREATE TABLE employee_languages (
  employee VARCHAR(50),
  language VARCHAR(50),
  PRIMARY KEY (employee, language)
);
\`\`\``
      },
      {
        heading: '5.3 Deliberate Denormalization Strategies',
        content: `High-scale production systems rarely stay 100% normalized. While OLTP demands normalized write safety, OLAP and heavy read endpoints require pre-joined data:

| Technique | Example | Trade-off |
|---|---|---|
| **Duplicate Columns** | Store \`customer_name\` directly in \`orders\` | Eliminates JOIN during order listings; risk of stale name on update |
| **Precomputed Counters** | \`likes_count\` in \`posts\` table | Instant retrieval; must be kept in sync via transactions or triggers |
| **Materialized Views** | Precomputed monthly sales aggregate table | Blazing fast analytical reads; requires asynchronous refresh scheduling |
| **JSON Columns** | \`attributes JSONB\` for e-commerce specs | Infinite schema flexibility; harder to index and enforce foreign key constraints |

> 💡 **Architectural Rule**: *Normalize first to understand the data domain, then denormalize deliberately only after profiling real query bottlenecks.*`
      }
    ]
  },
  {
    id: 'ch-6',
    chapterNumber: 6,
    level: 'intermediate',
    levelLabel: '🟡 Intermediate',
    title: 'Connection Pooling Architecture & Proxies',
    subtitle: 'HikariCP sizing mathematics, avoiding connection leaks, PgBouncer pooling modes, and RDS Proxy',
    readTime: '7 min read',
    relatedTab: 'connections',
    tags: ['Connection Pool', 'HikariCP', 'PgBouncer', 'RDS Proxy', 'ProxySQL', 'Session Leak'],
    summary: 'Opening a fresh TCP/TLS connection for every API request takes 20-100ms and rapidly overwhelms the database. Learn connection pool sizing formulas, how connection leaks take down services, and how PgBouncer and RDS Proxy multiplex thousands of clients into dozens of database threads.',
    keyTakeaways: [
      'Connection setup is expensive: TCP handshake + TLS + Auth + Worker process initialization consumes 20-100ms.',
      'HikariCP / Postgres Sizing Formula: pool_size ≈ (core_count * 2) + effective_spindle_count. A pool of 10-20 connections per instance often outperforms hundreds.',
      'Total Database Connections = (Pool Size per Pod) * (Number of Pods). 50 pods * 20 conn = 1,000 DB connections!',
      'PgBouncer Modes: Session pooling (connection kept until client disconnects), Transaction pooling (connection returned as soon as COMMIT/ROLLBACK occurs), Statement pooling.'
    ],
    sections: [
      {
        heading: '6.1 The Cost of Unpooled Connections',
        content: `Without pooling, every HTTP request performs a cold connection setup:
\`\`\`
App Request ──▶ TCP SYN/ACK (1 RTT) ──▶ TLS Handshake (2 RTT) ──▶ Auth (1 RTT) ──▶ Query ──▶ FIN/RST
\`\`\`
Total setup latency is **20–100 ms** per request before executing a single line of SQL!

Under load, opening 500 connections simultaneously forces the database OS to thrash CPU context-switching, swap memory buffers, and run out of file descriptors.`
      },
      {
        heading: '6.2 The HikariCP Pool Sizing Formula',
        content: `Engineers often assume "more connections = faster performance". In reality, excess connections cause lock contention, CPU cache misses, and disk I/O queue stalls.

The proven empirical sizing formula:
\`\`\`
pool_size = (CPU Core Count × 2) + effective_spindle_count
\`\`\`

For an 8-core server backed by an SSD (spindle count = 1):
\`\`\`
pool_size = (8 × 2) + 1 = 17 connections
\`\`\`
A pool of 17 dedicated connections running at 100% saturation will process more transactions per second with lower p99 latency than 500 connections fighting for CPU time slices.`
      },
      {
        heading: '6.3 External Connection Poolers (PgBouncer & RDS Proxy)',
        content: `In microservice and serverless architectures (e.g. AWS Lambda, Kubernetes pods), having 100 containers with pools of 10 creates 1,000 database connections.

To prevent connection exhaustion, place a lightweight proxy in front of the database:

| Pooler | Supported Engine | Architecture & Features |
|---|---|---|
| **PgBouncer** | PostgreSQL | Extremely lightweight C daemon; multiplexes thousands of incoming connections into 20-50 physical PostgreSQL backends |
| **AWS RDS Proxy** | PostgreSQL & MySQL | Managed AWS pooling layer; handles automatic failover routing, IAM auth, and Lambda connection bursts |
| **ProxySQL** | MySQL & MariaDB | Advanced routing proxy; supports read/write query splitting, query caching, and connection pooling |

**PgBouncer Pooling Modes**:
- **Session Pooling**: Connection assigned for the entire duration of the client connection. Safest, but lowest multiplexing.
- **Transaction Pooling**: Connection borrowed only while a transaction is actively open (\`BEGIN ... COMMIT\`). Once committed, the connection returns to the pool immediately. **Best balance for high scale!**
- **Statement Pooling**: Connection returned after every single SQL statement. Multi-statement transactions are prohibited.`
      }
    ]
  },
  {
    id: 'ch-7',
    chapterNumber: 7,
    level: 'intermediate',
    levelLabel: '🟡 Intermediate',
    title: 'Query Execution Pipeline & Relational Algebra',
    subtitle: 'From SQL text to Abstract Syntax Tree, Query Tree binder, Cost-Based Optimizer, and Volcano Iterator model',
    readTime: '9 min read',
    relatedTab: 'query',
    tags: ['Relational Algebra', 'AST', 'Query Tree', 'CBO', 'Volcano Model', 'Pushdown'],
    summary: 'Discover what happens under the hood when a database executes a query: Lexing & parsing into an AST, semantic binding, algebraic rewriting, cost-based physical plan compilation, and the Volcano iterator model (open/next/close) pulling row streams through the buffer pool.',
    keyTakeaways: [
      '5-Stage Pipeline: Parser (syntax) → Analyzer/Binder (catalog validation) → Rewriter (view inlining) → Optimizer (CBO physical plan) → Executor (streaming rows).',
      'Relational Algebra is the mathematical foundation: σ (selection/filter), π (projection/columns), ⨝ (join), γ (group by), τ (order by).',
      'The Volcano Iterator Model: Every physical operator implements open(), next(), and close(), pulling tuples on-demand.',
      'Selection Pushdown: Moving filters (σ) below joins (⨝) dramatically minimizes intermediate tuple volumes.'
    ],
    sections: [
      {
        heading: '7.1 The 5-Stage Execution Pipeline',
        content: `When you execute a query, it traverses five distinct internal stages:

1. **Parser (Lexer + Bison/Yacc Grammar)**: Converts raw SQL text into an **Abstract Syntax Tree (AST)**. Validates syntax rules and flags grammatical errors.
2. **Analyzer / Semantic Binder**: Validates table names, column existence, data types, and user permissions against the **System Catalog**. Transforms AST into a validated **Query Tree**.
3. **Rewriter**: Applies database rules, inlines view definitions, and rewrites recursive subqueries.
4. **Cost-Based Optimizer (CBO)**: Generates mathematically equivalent physical execution plans, calculates estimated I/O and CPU costs using catalog statistics, and selects the cheapest **Physical Execution Plan**.
5. **Executor**: Runs the compiled plan using the Volcano iterator model, streaming tuples from the Buffer Pool and storage engine back to the wire protocol socket.`
      },
      {
        heading: '7.2 Relational Algebra Operators Reference',
        content: `The database optimizer treats SQL as declarative relational algebra:

| Operator | Symbol | SQL Equivalent | Meaning |
|---|---|---|---|
| **Selection** | **σ (sigma)** | \`WHERE\` | Filters **rows** matching a boolean predicate |
| **Projection** | **π (pi)** | \`SELECT col1, col2\` | Extracts specific **columns** |
| **Theta Join** | **⨝θ** | \`JOIN ... ON condition\` | Cartesian product filtered by a join condition |
| **Semi-Join** | **⋉** | \`WHERE EXISTS (...)\` | Rows from left table that have at least one match on right |
| **Anti-Join** | **▷** | \`WHERE NOT EXISTS (...)\` | Rows from left table that have NO matches on right |
| **Grouping** | **γ (gamma)** | \`GROUP BY\` | Groups rows and computes aggregates (\`SUM\`, \`AVG\`, \`COUNT\`) |
| **Sort** | **τ (tau)** | \`ORDER BY\` | Sorts resulting tuples |`
      },
      {
        heading: '7.3 Optimization: Pushdown Rewriting',
        content: `Consider this relational query:
\`\`\`sql
SELECT e.name, d.dept_name
FROM employees e JOIN departments d ON e.dept_id = d.dept_id
WHERE e.salary > 50000 AND d.location = 'Kolkata';
\`\`\`

**Naive Unoptimized Algebra**:
\`\`\`
π e.name, d.dept_name (
  σ e.salary > 50000 ∧ d.location = 'Kolkata' (
    employees ⨝ e.dept_id = d.dept_id departments
  )
)
\`\`\`
*Problem*: The join must compare all 100,000 employees against all 5,000 departments before filtering!

**Optimized Pushdown Algebra**:
\`\`\`
π e.name, d.dept_name (
  σ e.salary > 50000 (employees)
    ⨝ e.dept_id = d.dept_id
  σ d.location = 'Kolkata' (departments)
)
\`\`\`
*Optimization*: Selections (σ) are pushed down *before* the join. The join processes only the 2,000 qualifying employees and 3 qualifying departments!`
      },
      {
        heading: '7.4 The Volcano Iterator Model',
        content: `Most relational database executors use the classic **Volcano Iterator Model**:

Each physical plan node exposes three methods:
- \`open()\`: Allocates memory buffers, initializes child operators, builds hash tables if needed.
- \`next()\`: Returns the single next tuple, or \`NULL\` when exhausted.
- \`close()\`: Frees state and cleans up resources.

The client pulls results lazily from the root node:
\`\`\`
Project.next()
  └── HashJoin.next()
        ├── Filter.next() ──▶ IndexScan.next()   (probe stream)
        └── Hash.next() ────▶ SeqScan.next()     (build table)
\`\`\``
      }
    ]
  },
  {
    id: 'ch-8',
    chapterNumber: 8,
    level: 'intermediate',
    levelLabel: '🟡 Intermediate',
    title: 'Join Algorithms & Reading EXPLAIN Plans',
    subtitle: 'Nested Loop, Hash Join, Sort-Merge Join, and dissecting EXPLAIN ANALYZE execution red flags',
    readTime: '9 min read',
    relatedTab: 'query',
    tags: ['EXPLAIN', 'Hash Join', 'Nested Loop', 'Sort-Merge', 'Seq Scan', 'Cost Model'],
    summary: 'Master how database engines execute joins in physical memory and how to dissect EXPLAIN ANALYZE execution trees. Learn the distinct trade-offs of Nested Loop, Hash Join, and Sort-Merge Join, and identify critical production red flags like massive filter drops and disk spills.',
    keyTakeaways: [
      'Nested Loop Join: Loops over outer rows and searches inner index. Best for small outer set + indexed inner key: O(N * log M).',
      'Hash Join: Builds in-memory hash table on the smaller input, then probes with the larger input: O(N + M). Ideal for large unsorted equality joins.',
      'Sort-Merge Join: Sorts both inputs on the join key, then merges in lockstep. Best when inputs are already sorted by an index.',
      'EXPLAIN ANALYZE executes the query and reports actual time/rows. Always read innermost indented nodes first.',
      'Red Flags: "Rows Removed by Filter" is huge (missing index), "Sort Method: external merge Disk" (work_mem too small), Big gap between estimated and actual rows (stale statistics).'
    ],
    sections: [
      {
        heading: '8.1 The 3 Fundamental Join Algorithms',
        content: `| Algorithm | How It Works | Time Complexity | Best Suited For |
|---|---|---|---|
| **Nested Loop Join** | For each row in outer table, perform index lookup on inner table | O(N × log M) with index | Small outer set (e.g. 50 rows) joining against indexed table |
| **Hash Join** | Phase 1 (Build): Read smaller table into in-memory hash table.<br>Phase 2 (Probe): Stream larger table, hash join key, find matches | O(N + M) | Large unsorted datasets with equality predicates (\`=\`) |
| **Sort-Merge Join** | Sort both relations by join key, then scan both concurrently like merging two sorted arrays | O(N log N + M log M) | Large inputs that are already sorted by indexes or range joins |`
      },
      {
        heading: '8.2 How to Read an EXPLAIN ANALYZE Plan',
        content: `Run \`EXPLAIN (ANALYZE, BUFFERS)\` in PostgreSQL or \`EXPLAIN ANALYZE\` in MySQL:

\`\`\`
Hash Join  (cost=12.40..145.20 rows=80 width=64) (actual time=0.3..2.1 rows=75 loops=1)
  Hash Cond: (e.dept_id = d.dept_id)
  ->  Seq Scan on employees e  (cost=0.00..120.00 rows=2000 ...)
        Filter: (salary > 50000)
        Rows Removed by Filter: 8000
  ->  Hash  (cost=11.00..11.00 rows=3 ...)
        ->  Seq Scan on departments d  (cost=0.00..11.00 rows=3 ...)
              Filter: (location = 'Kolkata')
Planning Time: 0.2 ms
Execution Time: 2.3 ms
\`\`\`

**Key Reading Rules**:
1. **Read Innermost First**: The most indented nodes execute first (here, \`Seq Scan on departments\` builds the hash table, followed by \`Seq Scan on employees\` probing it).
2. **Cost vs Actual**: \`cost=12.40..145.20\` is the planner's heuristic estimate. \`actual time=0.3..2.1 rows=75\` is ground reality measured during actual execution.`
      },
      {
        heading: '8.3 Production EXPLAIN Red Flags',
        content: `Look for these telltale performance bottlenecks in query plans:

- 🚩 **Huge "Rows Removed by Filter"**:
  In the plan above, \`Rows Removed by Filter: 8000\`. The engine read 10,000 rows from disk into memory only to discard 80%! An index on \`salary\` eliminates reading those blocks.
- 🚩 **Sort Method: External Merge Disk**:
  Occurs when an \`ORDER BY\` or Hash Join exceeds \`work_mem\` and spills temporary files to disk. Fix: Increase \`work_mem\` or create an index matching the sort key.
- 🚩 **Massive Gap: Estimated vs Actual Rows**:
  If the planner estimates 1 row but the query actually returns 500,000 rows, table statistics are stale. The CBO will pick catastrophic Nested Loop plans. Fix: Run \`ANALYZE employees;\`.`
      },
      {
        heading: '8.4 SQL Written Order vs Logical Evaluation Order',
        content: `SQL is *written* in one order, but the engine *evaluates* it in a different logical order:

\`\`\`
1. FROM / JOIN      ← Locate base relations and compute joins
2. WHERE            ← Filter individual rows (σ)
3. GROUP BY         ← Aggregate rows into buckets (γ)
4. HAVING           ← Filter aggregated buckets
5. SELECT           ← Project columns (π), evaluate scalar expressions & aliases
6. DISTINCT         ← Deduplicate rows
7. ORDER BY         ← Sort results (τ)
8. LIMIT / OFFSET   ← Slice window of rows
\`\`\`

> 💡 **Why Aliases Fail in WHERE**: You cannot write \`WHERE annual_salary > 100000\` using a \`SELECT (salary * 12) AS annual_salary\` alias, because \`WHERE\` is evaluated at Step 2, while aliases are created at Step 5!`
      }
    ]
  },
  {
    id: 'ch-9',
    chapterNumber: 9,
    level: 'intermediate',
    levelLabel: '🟡 Intermediate',
    title: 'B-Tree & Composite Indexing Masterclass',
    subtitle: 'B+Tree fanout, leftmost prefix rule, equality before range, covering indexes with INCLUDE, and clustered vs heap tables',
    readTime: '9 min read',
    relatedTab: 'indexing',
    tags: ['B+Tree', 'Composite Index', 'Prefix Rule', 'Covering Index', 'INCLUDE', 'Clustered Index'],
    summary: 'A deep architectural dive into B+Trees: why disk page sizing creates high fanout and shallow trees (depth 3-4 holds billions of rows), the critical Leftmost Prefix Rule for composite indexes, the Equality Before Range rule, covering indexes, and Clustered InnoDB vs Heap PostgreSQL storage.',
    keyTakeaways: [
      'B+Tree structure: Internal nodes store navigation keys; Leaf nodes store keys + row pointers and form a doubly linked list for fast range scans.',
      'High Fan-Out: With ~500 keys per 8KB/16KB page, a 4-level tree indexes over 62 billion records in just 4 disk reads.',
      'Leftmost Prefix Rule: An index on (A, B, C) can satisfy queries filtering on (A), (A, B), or (A, B, C), but CANNOT satisfy queries filtering only on (B) or (C).',
      'Rule of Thumb: Put Equality columns FIRST, followed by Range columns in composite indexes.',
      'Covering Index (INCLUDE): Stores extra projection columns in leaf nodes, allowing Index-Only Scans with zero table heap lookups.'
    ],
    sections: [
      {
        heading: '9.1 B+Tree Architecture & High Fan-Out',
        content: `Unlike binary search trees, a **B+Tree** is an ordered multi-way search tree where each node matches an OS disk page (8 KB in PostgreSQL, 16 KB in MySQL InnoDB):

\`\`\`
                     [ 50 | 100 ]                      ← Root Node
                   ╱      │      ╲
        [ 10 | 25 ]   [ 60 | 80 ]   [ 120 | 150 ]      ← Internal Nodes
          ╱    ╲         ╱   ╲         ╱     ╲
     [Leaf 1] ↔ [Leaf 2] ↔ [Leaf 3] ↔ [Leaf 4] ↔ [Leaf 5]  ← Leaves (Doubly Linked)
\`\`\`

**Why B+Trees Dominate Database Engines**:
1. **Shallow Depth**: Because an 8 KB page holds ~500 keys (fanout = 500), depth 3 holds $500^3 = 125,000,000$ rows! The entire internal tree fits in the RAM Buffer Pool.
2. **Linked Leaf Chain**: Leaves form a doubly linked list. Range queries (\`WHERE age BETWEEN 20 AND 30\`) locate the first key in $O(\\log N)$ and then simply walk the leaves sequentially.`
      },
      {
        heading: '9.2 Composite Indexes & The Leftmost Prefix Rule',
        content: `Consider a composite index created on three columns:
\`\`\`sql
CREATE INDEX idx_orders_filter ON orders (customer_id, order_date, status);
\`\`\`
The index is sorted primarily by \`customer_id\`, then by \`order_date\` within each customer, and finally by \`status\`.

| Query Predicate | Can Use Index? | Explanation |
|---|---|---|
| \`WHERE customer_id = 5\` | ✅ YES | Matches leading column |
| \`WHERE customer_id = 5 AND order_date = '2026-01-01'\` | ✅ YES | Matches leading 2 columns |
| \`WHERE customer_id = 5 AND order_date > '2026-01-01' AND status = 'COMPLETED'\` | ⚠️ PARTIAL | Uses \`customer_id\` and \`order_date\`; \`status\` must be filtered in-memory |
| \`WHERE order_date = '2026-01-01'\` | ❌ NO | Skips leading column \`customer_id\`; cannot use tree navigation! |
| \`WHERE status = 'COMPLETED'\` | ❌ NO | Skips leading columns; forces full table scan |

> 🔑 **Equality Before Range Rule**:
> Always place columns queried with equality (\`=\`) **first**, and columns queried with ranges (\`>\`, \`<\`, \`BETWEEN\`) **last**. A B-Tree can only effectively use one range column for index navigation.`
      },
      {
        heading: '9.3 Covering Indexes & Index-Only Scans',
        content: `Normally, an index scan finds the row pointer in the B-Tree, then performs a random I/O read to fetch the actual table heap page.

If the index stores **all columns required by the query**, the engine performs an **Index-Only Scan** with ZERO table page reads!

\`\`\`sql
-- Query
SELECT customer_id, order_date, total_amount
FROM orders
WHERE customer_id = 42;

-- Covering Index with INCLUDE (PostgreSQL 11+ & SQL Server)
CREATE INDEX idx_orders_covering
ON orders (customer_id, order_date)
INCLUDE (total_amount);
\`\`\`
The \`INCLUDE\` column \`total_amount\` is stored only in the leaf nodes. It does not bloat the internal branch keys, nor does it affect sorting.`
      },
      {
        heading: '9.4 Clustered Index (InnoDB) vs Heap Tables (PostgreSQL)',
        content: `| Architecture | MySQL InnoDB | PostgreSQL |
|---|---|---|
| **Table Storage** | The table **IS** a clustered B+Tree index organized by Primary Key | The table is an unordered **Heap file** of 8KB disk pages |
| **Primary Key Lookup** | Direct single B-Tree lookup (leaf contains full row data) | Traverses PK index → gets Tuple ID (CTID) → reads heap page |
| **Secondary Indexes** | Leaf stores secondary key + **Primary Key value** (requires double lookup) | Leaf stores secondary key + direct **Heap CTID** pointer |
| **Design Rule** | Keep Primary Keys small and auto-incrementing! Random UUID PKs cause severe page splits and fragmentation | Free to use UUIDs; table heap does not reorder on inserts |`
      }
    ]
  },
  {
    id: 'ch-10',
    chapterNumber: 10,
    level: 'intermediate',
    levelLabel: '🟡 Intermediate',
    title: 'SARGability & Query Writing Best Practices',
    subtitle: 'Search ARGument able queries, avoiding function wraps, implicit casts, and Keyset vs OFFSET pagination',
    readTime: '7 min read',
    relatedTab: 'indexing',
    tags: ['SARGable', 'Keyset Pagination', 'OFFSET', 'Expression Index', 'Optimization'],
    summary: 'A query is SARGable (Search ARGument able) when the DBMS engine can directly utilize an index for search. Discover common anti-patterns that silently break index usage (functions on columns, arithmetic, type mismatches), expression indexes, and why OFFSET pagination destroys deep page performance.',
    keyTakeaways: [
      'SARGable: The predicate compares the raw indexed column directly without wrapping it in functions or arithmetic.',
      'Non-SARGable: WHERE YEAR(created_at) = 2026 prevents index use. SARGable rewrite: WHERE created_at >= \'2026-01-01\' AND created_at < \'2027-01-01\'.',
      'Expression / Functional Index: If you must query with a function (e.g. LOWER(email)), create an expression index: CREATE INDEX idx_lower_email ON users (LOWER(email)).',
      'Pagination: OFFSET 1000000 forces the engine to read and discard 1,000,000 rows. Use Keyset / Seek Pagination (WHERE id > last_seen_id) for O(1) performance.'
    ],
    sections: [
      {
        heading: '10.1 SARGable vs Non-SARGable Predicates',
        content: `When a column is modified inside a \`WHERE\` clause, the database cannot use index tree traversal and must scan every row:

| ❌ Non-SARGable (Forces Full Table Scan) | ✅ SARGable Rewrite (Uses Index Scan) |
|---|---|
| \`WHERE YEAR(order_date) = 2026\` | \`WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'\` |
| \`WHERE salary * 1.10 > 55000\` | \`WHERE salary > 50000\` |
| \`WHERE LOWER(email) = 'asha@x.com'\` | Use expression index or case-insensitive collation (\`citext\`) |
| \`WHERE name LIKE '%tech%'\` | Leading wildcard cannot use B-Tree; use Full-Text or GIN trigram index |
| \`WHERE phone = 9876543210\` (\`phone\` is \`VARCHAR\`) | \`WHERE phone = '9876543210'\` (Implicit cast prevents index use) |`
      },
      {
        heading: '10.2 Expression / Functional Indexes',
        content: `If your application frequently searches with a function, create an **expression index**:

\`\`\`sql
-- ❌ Plain index on email is ignored by LOWER(email):
SELECT * FROM users WHERE LOWER(email) = 'asha@company.com';

-- ✅ PostgreSQL Expression Index:
CREATE INDEX idx_users_lower_email ON users (LOWER(email));

-- ✅ MySQL 8.0+ Functional Index:
CREATE INDEX idx_users_lower_email ON users ((LOWER(email)));
\`\`\``
      },
      {
        heading: '10.3 The OFFSET Trap vs Keyset Pagination',
        content: `\`OFFSET\` pagination causes linear latency degradation as users paginate deeper:

\`\`\`sql
-- ❌ OFFSET PAGINATION:
-- The engine must read 1,000,020 rows from disk, sort them, and discard the first 1,000,000!
SELECT * FROM posts ORDER BY id LIMIT 20 OFFSET 1000000;
\`\`\`

**The Solution: Keyset (Seek) Pagination**:
Pass the last seen identifier from the previous page:
\`\`\`sql
-- ✅ KEYSET (SEEK) PAGINATION:
-- Directly navigates the B-Tree index to id > 1000000 and grabs the next 20 rows in 0.2 ms!
SELECT * FROM posts
WHERE id > :last_seen_id
ORDER BY id
LIMIT 20;
\`\`\``
      }
    ]
  },

  // =========================================================================
  // 🔴 LEVEL 3: ADVANCED / DISTRIBUTED & INTERNALS (Chapters 11 - 15)
  // =========================================================================
  {
    id: 'ch-11',
    chapterNumber: 11,
    level: 'advanced',
    levelLabel: '🔴 Advanced',
    title: 'Vertical vs Horizontal Scaling Architecture',
    subtitle: 'Scale up limits, streaming replication, asynchronous vs synchronous quorums, and table partitioning',
    readTime: '9 min read',
    relatedTab: 'scaling',
    tags: ['Scaling', 'Replication', 'WAL Streaming', 'Partitioning', 'Read Replicas', 'Split-Brain'],
    summary: 'Evaluate the engineering trade-offs of Vertical Scaling (Scale Up) vs Horizontal Scaling (Scale Out). Master primary-replica streaming replication, understand replication lag and the read-your-writes anomaly, and implement declarative table partitioning.',
    keyTakeaways: [
      'Vertical Scaling (Bigger RAM, NVMe, CPU) is the first step: preserves ACID joins, zero app complexity, but has a hardware ceiling and single point of failure.',
      'Horizontal Scaling: Adds machines. Progressive path: Caching (Redis) → Read Replicas → Table Partitioning → Sharding.',
      'Replication Modes: Asynchronous (fastest, small data loss risk on primary crash), Synchronous (waits for replica ACK, higher write latency), Quorum/Semi-sync.',
      'Replication Lag Gotcha: Read-your-writes anomaly (user posts a comment, reads from a lagging replica, comment disappears). Fix: Route user reads to primary for 5 seconds.',
      'Declarative Partitioning splits huge tables on a single server into smaller physical child tables by range, list, or hash.'
    ],
    sections: [
      {
        heading: '11.1 Vertical Scaling (Scale Up) & Tuning',
        content: `Vertical scaling increases single-instance hardware capacity (e.g. upgrading to an AWS \`r6i.16xlarge\` with 64 vCPUs and 512 GB RAM).

**Advantages**: Zero application refactoring, native cross-table ACID joins remain simple, zero network latency between nodes.

**Tuning checklist before upgrading hardware**:
- **Buffer Pool**: Set \`shared_buffers\` to ~25% RAM in Postgres (relying on OS Page Cache) or \`innodb_buffer_pool_size\` to 50–75% RAM in MySQL.
- **Query Optimization**: Adding missing indexes yields 10x–100x performance gains compared to a 2x hardware upgrade.
- **WAL Throughput**: Place Write-Ahead Logs on dedicated high-IOPS NVMe drives.`
      },
      {
        heading: '11.2 Primary-Replica Streaming Replication',
        content: `\`\`\`
       writes ────────▶ ┌───────────────┐
                        │    PRIMARY    │
                        └───────┬───────┘
                  WAL / Binlog Streaming Protocol
               ┌────────────────┼────────────────┐
               ▼                ▼                ▼
         ┌───────────┐    ┌───────────┐    ┌───────────┐
 reads ─▶│ Replica 1 │    │ Replica 2 │    │ Replica 3 │
         └───────────┘    └───────────┘    └───────────┘
\`\`\`

- **Asynchronous Replication**: The Primary commits locally, returns success to the client, and ships WAL asynchronously. Blazing fast, but un-replicated commits can be lost during hardware crash failover.
- **Synchronous Replication**: The Primary blocks until at least one replica confirms WAL persistence. Guarantees zero data loss, but client write latency increases.
- **The "Read-Your-Writes" Trap**: If a user updates their profile and immediately refreshes the page, the read may hit a replica lagging by 500ms, showing old data!
  *Fixes*: Route reads from the active author to the Primary for a 5-second window, or pass causal LSN/GTID tokens.`
      },
      {
        heading: '11.3 Declarative Table Partitioning (Single Node)',
        content: `Partitioning splits a massive multi-terabyte table into smaller physical partitions on the same instance:

\`\`\`sql
-- PostgreSQL Declarative Range Partitioning
CREATE TABLE audit_events (
  id         BIGSERIAL,
  created_at TIMESTAMPTZ NOT NULL,
  event_data JSONB
) PARTITION BY RANGE (created_at);

CREATE TABLE audit_events_2026_01 PARTITION OF audit_events
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE audit_events_2026_02 PARTITION OF audit_events
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
\`\`\`

**Benefits**:
- **Partition Pruning**: Queries filtering by date scan ONLY the relevant partition table, ignoring all other years/months.
- **Instant Data Archiving**: Drop historical data instantly via \`DROP TABLE audit_events_2024_01;\` without generating massive \`DELETE\` vacuum overhead.`
      }
    ]
  },
  {
    id: 'ch-12',
    chapterNumber: 12,
    level: 'advanced',
    levelLabel: '🔴 Advanced',
    title: 'Database Sharding & Horizontal Scale (Chirp App Case Study)',
    subtitle: 'From Single Server & Replication Write Limits to Modulo Hashing, the 5 Golden Rules of Shard Keys, Celebrity Salting, and Consistent Hash Rings',
    readTime: '12 min read',
    relatedTab: 'scaling',
    tags: ['Sharding', 'Consistent Hashing', 'Shard Key', 'Celebrity Problem', 'Salting', 'Scatter-Gather', 'Virtual Nodes'],
    summary: 'Master database sharding through John and Allan\'s social app "Chirp". Trace why read replicas fail to scale writes due to like-counter race conditions, how modulo sharding distributes rows, the 5 golden rules of shard keys, how write salting tames pop-star hotspots, and how consistent hashing with virtual nodes eliminates the 80% resharding disaster.',
    keyTakeaways: [
      'Why Replicas Fail for Writes: Scaling reads with replicas works, but writes cannot be split across replicas without split-brain anomalies (e.g. two concurrent likes at count 99 increment to 100 on both machines instead of 101).',
      'Horizontal Sharding: Splits rows across independent physical database instances running identical schemas, creating multiple independent primaries.',
      'The 5 Golden Rules of Shard Keys: 1. High Cardinality, 2. Even Distribution, 3. Access Pattern Alignment, 4. Immutability, and 5. Collocation (co-locating users, chirps, and likes on the same shard).',
      'Deterministic Hashing: Strings/emails must use persistent deterministic hashing (e.g. MurmurHash, MD5, MongoDB Hashed Sharding) rather than language-randomized hashes (like Python hash()).',
      'The 4 Sharding Strategies: Hashed Sharding, Range Sharding (banking dates), Directory Sharding (enterprise tenant lookup), and Geographic/Regional Sharding.',
      'The Celebrity Problem (Hotspots): A 40M follower user (Lena) melts a shard. Solved by a 3-tier approach: Dedicated Shard (Directory) + In-Memory Cache (Redis) + Write Key Salting (splitting likes into keys 500-1..500-10).',
      'The Resharding Disaster: Naive modulo (hash % N) forces 80% (16/20) of all existing data to move when adding Shard 5. Consistent Hashing with virtual nodes moves only 1/N (20%) of keys without global rehashing.'
    ],
    sections: [
      {
        heading: '12.1 The Chirp Scaling Journey: From Single Box to Vertical Limit',
        content: `Imagine John and Allan launch a social application called **Chirp** where users post short public messages and follow each other.
On launch day, a few hundred users run on **1 application server and 1 database machine**:
- \`users\` table: stores \`id\`, \`username\`, and \`follower_count\`.
- \`chirps\` table: stores \`id\`, \`author_id\`, \`content\`, and \`created_at\`.

Every interaction is either a **read** (opening Chris's profile or reading Leo's posts) or a **write** (inserting a new post, following a friend, or liking a chirp).

### The Growth Trajectory:
- **200 → 2,000 users**: System runs smoothly.
- **2,000 → 200,000 users**: Queries slow down; John and Allan rent a larger database instance with more RAM and NVMe IOPS (**Vertical Scaling / Scale Up**).
- **Millions of users**: Profile load times jump from **30 ms to 3+ seconds**. Queries queue up. But they already rent the largest, most expensive database instance offered by the cloud provider. **Vertical scaling has hit its absolute hardware ceiling.**`
      },
      {
        heading: '12.2 Why Replication Cannot Scale Writes: The Inconsistency Trap',
        content: `Industry best practice is to deploy **Read Replicas**—one primary database with two or three copies that stream updates from the primary:
\`\`\`
Client Reads  ──────▶ Distributed across Primary + Replicas (3x Read Capacity!)
Client Writes ──────▶ ONLY Primary Database
\`\`\`

Spreading read queries across replicas rescues read latency! But Chirp receives tens of thousands of writes per minute during live events, and write queries start failing.

### Why Can't Writes Be Distributed Across Replicas?
Consider this real-world concurrency trap:
1. Leo posts a funny message. His chirp is currently sitting at **99 likes**.
2. Two users, Chris and Martin, click the **Like** button at the exact same millisecond.
3. Chris's like is routed to the **Primary Database**. The counter increments from **99 → 100**.
4. Martin's like is routed to a **Read Replica**. That replica also has the count at 99, so it increments from **99 → 100**.
5. Both machines report 100 likes, **but the true count should be 101!**
6. Similarly, if the Primary updates $x = 7 \to 9$ while a replica simultaneously updates $x = 7 \to 10$, the database state is corrupt and non-deterministic.

> [!IMPORTANT]
> **The Golden Law of Replication**: Reads scale horizontally with replicas, but **all writes must serialize through a single Primary source of truth**. When writes exceed what one machine can handle, **Sharding** is the only architectural solution.`
      },
      {
        heading: '12.3 What is Sharding & The Modulo Remainder Rule',
        content: `**Sharding** (Horizontal Scaling) means splitting your rows across many smaller, independent machines so that no single machine holds all the data.
- Each individual machine is called a **Shard**.
- Every shard runs the exact same table structure (**identical schema**).
- Leo's row lives entirely on Shard 0; Chris's row lives on Shard 3.

### The Naive Modulo Rule (4 Shards):
John and Allan deploy 4 database machines and pick a simple rule:
$$\\text{Shard Number} = \\text{user\\_id} \\pmod 4$$

Because we divide by 4, the remainder is always **0, 1, 2, or 3**:
- \`user_id = 1\` $\\to 1 \\pmod 4 = \\mathbf{1}$ (Shard 1)
- \`user_id = 2\` $\\to 2 \\pmod 4 = \\mathbf{2}$ (Shard 2)
- \`user_id = 3\` $\\to 3 \\pmod 4 = \\mathbf{3}$ (Shard 3)
- \`user_id = 4\` $\\to 4 \\pmod 4 = \\mathbf{0}$ (Shard 0)

With data divided across 4 machines, Chirp suddenly has **4 independent primary databases**, quadrupling write throughput!`
      },
      {
        heading: '12.4 The 5 Golden Rules of Shard Key Selection',
        content: `The column chosen to divide data is called the **Shard Key**. Choosing a shard key is an architectural one-way door; changing it later requires scanning and migrating every row in the entire cluster!

Evaluate every shard key candidate against these **5 Golden Properties**:

| # | Golden Property | Why It Matters & Chirp Example |
|---|---|---|
| **1** | **High Cardinality** | Must have millions of distinct values. Sharding by \`country\` (~200 countries) across 64 shards causes India/US shards to melt under massive population skew while Greenland sits empty. \`user_id\` has millions of unique values. |
| **2** | **Uniform Distribution** | Values must spread evenly. Sharding by \`signup_year\` means 95% of current writes flood into the active year's shard while past years sit cold. \`user_id\` increments monotonically ($0, 1, 2, 3, 0...$) distributing writes evenly. |
| **3** | **Access Pattern Alignment** | Query predicates must match the key. If 95% of queries ask *"give me posts by this user"*, sharding by \`user_id\` targets 1 shard. Sharding by \`post_id\` forces catastrophic **Scatter-Gather** across all shards! |
| **4** | **Immutability** | Value must NEVER change. If Chris changes his \`username\`, his data must be copied to another shard and deleted from the old shard. A mid-flight network crash corrupts his account. \`user_id\` is permanent. |
| **5** | **Collocation (Co-location)** | Related tables must live together. By sharding \`users\`, \`chirps\`, and \`likes\` all on \`user_id\`, Chris's profile, his chirps, and his likes all land on Shard 3. Fetching his entire feed requires **zero cross-shard network joins**! |

\`\`\`
Scatter-Gather Anti-Pattern (Querying without Shard Key):
Client ──▶ Router ──┬──▶ Shard 0 (reads 12 ms) ──┐
                    ├──▶ Shard 1 (reads 450 ms) ─┼──▶ Merge & Sort ──▶ Client (450 ms)
                    └──▶ Shard 2 (reads 15 ms) ──┘
*Total latency is bounded by the slowest shard (Shard 1 tail latency)!*
\`\`\``
      },
      {
        heading: '12.5 Non-Numeric Keys & Deterministic Hashing',
        content: `What if the shard key is an email address (\`chris@gmail.com\`) or username? You cannot divide a string by 4.
We use a **Hash Function** that deterministically converts any arbitrary input into a consistent integer:

$$\\text{Shard Number} = \\text{Hash}(\\text{shard\\_key}) \\pmod {\\text{num\\_shards}}$$

### Why Python's Built-in \`hash()\` is Dangerous for Sharding:
In Python, \`hash("chris@gmail.com")\` returns a different integer every time the program restarts! Python injects a randomized secret salt at startup for hash-DoS security. Using this in production would send Chris to Shard 1 on Monday and Shard 3 on Tuesday.

### Production Hash Requirements:
Real database engines (such as **MongoDB Hashed Sharding** or Cassandra Murmur3) use **deterministic cryptographic or non-cryptographic hash functions** (MD5, MurmurHash3, CityHash):
1. **Deterministic**: Same key always produces the exact same integer across all servers and restarts.
2. **Avalanche Effect**: Adjacent inputs (\`user_id 41\` and \`user_id 42\`) produce wildly divergent hashes, preventing localized disk clustering.`
      },
      {
        heading: '12.6 The 4 Sharding Strategies: Hash, Range, Directory & Regional',
        content: `1. **Hashed Sharding**:
   - Computes $\\text{Hash}(K) \\pmod N$.
   - *Best For*: Point lookups by ID, social media profiles, even key distribution.
   - *Weakness*: Inefficient for range queries (\`WHERE created_at BETWEEN X AND Y\`).

2. **Range-Based Sharding**:
   - Shard 1: Jan–Mar transactions; Shard 2: Apr–Jun transactions.
   - *Best For*: Banking, accounting audits, and time-series where queries ask for localized date ranges.
   - *Weakness*: Write hotspot on the newest active range shard.

3. **Directory / Lookup Sharding**:
   - A central lookup table maps specific entities to target shards.
   - *Best For*: B2B SaaS where one "whale" enterprise customer has 50,000 employees while standard tenants have 50. You can dedicate an entire shard to that single customer with 1 table row.
   - *Weakness*: The directory is a critical single point of failure and extra lookup hop.

4. **Geographic / Regional Sharding (Two-Tier)**:
   - Tier 1: User country routes to an AWS region (e.g. Europe vs US) for low latency and **GDPR data sovereignty compliance**.
   - Tier 2: Inside Europe, \`hash(user_id)\` evenly spreads European users across European shards.`
      },
      {
        heading: '12.7 Routing Layer Architecture (3 Placement Options)',
        content: `When a request arrives, which component computes the hash and forwards the query?

\`\`\`
1. Client-Side Routing:  Client App Microservice ──── direct socket ────▶ Shard 3
2. Proxy-Side Routing:   Client App ──▶ mongos / ProxySQL ──▶ Evaluates Key ──▶ Shard 3
3. Database-Side Routing: Client App ──▶ Shard 1 ── gossip/internal forward ──▶ Shard 3
\`\`\`

| Location | How It Works | Strengths | Trade-Offs |
|---|---|---|---|
| **1. Application-Level** | Each microservice (Profile, Feed, Likes) computes \`hash(id) % N\` directly. | Zero extra network hops; lowest possible latency. | Changing shard count requires redeploying all microservices; risk of config drift/split-brain. |
| **2. Proxy-Level** | Stateless proxy (e.g. \`mongos\` router, Vitess, ProxySQL) sits between app and shards. | Single centralized configuration; transparent to app code. | Extra network hop (+0.5 ms); proxy can become a bottleneck unless clustered. |
| **3. Database-Level** | App queries any random shard; that shard internally forwards to the owner (Cassandra, CockroachDB). | Zero proxy setup; simple client driver. | Internal hops consume database CPU; less control over routing logic. |`
      },
      {
        heading: '12.8 The Celebrity Problem (Hotspots) & The 3-Tier Fix',
        content: `What happens when pop star **Lena** (40 million followers) signs up?
Her \`user_id\` hashes to **Shard 2**. Each shard handles 100,000 reads/sec max.
When Lena posts a chirp, millions of fans rush to view her profile:
- **Shard 2 is drowning at 100k+ reads/sec**, dropping packets.
- **Shards 0, 1, and 3 are sitting virtually idle at 20k reads/sec**.
- Normal users who happen to share Shard 2 with Lena experience complete application downtime!

### The 3-Tier Engineering Remedy:
1. **Tier 1: Dedicated Shard (Directory Override)**:
   - Insert an override in the routing layer: If \`user_id == Lena (500)\`, route directly to dedicated **Shard 4**.
   - Isolates Lena's blast radius so ordinary users on Shard 2 are never impacted.
2. **Tier 2: In-Memory Read Caching (Redis/Memcached)**:
   - Lena's profile and posts are stored in a distributed Redis cache cluster.
   - 99% of read requests are answered from RAM in 0.5 ms without ever touching Shard 4.
3. **Tier 3: Write Key Salting (For Massive Concurrent Likes)**:
   - Cache solves reads, but what about **writes** when millions of users like Lena's chirp simultaneously?
   - **Salting**: Append a random suffix between 1 and 10 to her user ID: \`500-1\`, \`500-2\` ... \`500-10\`.
   - Because hash functions have the avalanche effect, these 10 keys hash to **different existing shards** (Shard 0, Shard 1, Shard 2, Shard 3)!
   - Each shard absorbs 10% of Lena's write likes instead of Shard 4 taking 100%.
   - **Reading Total Likes**: To display the like counter, the router reads all 10 salted keys and sums them together.`
      },
      {
        heading: '12.9 The Naive Modulo Resharding Disaster',
        content: `As Chirp grows, Shards 0 through 3 reach 90% disk capacity. John and Allan decide to add a **5th Shard**.
Under naive modulo, the formula changes from $\\text{id} \\pmod 4$ to $\\text{id} \\pmod 5$:

\`\`\`
User ID | Old Formula (id % 4) | New Formula (id % 5) | Data Must Move?
--------|----------------------|----------------------|----------------
User 1  | Shard 1              | Shard 1              | No (Stays)
User 5  | Shard 1              | Shard 0              | ⚠️ YES (Moves)
User 8  | Shard 0              | Shard 3              | ⚠️ YES (Moves)
User 12 | Shard 0              | Shard 2              | ⚠️ YES (Moves)
User 20 | Shard 0              | Shard 0              | No (Stays)
\`\`\`

> [!CAUTION]
> In a test of 20 users, **16 out of 20 users (80%) changed shards!**
> Adding just 1 machine caused **80% of all data in the entire database to move across the network**.
> In a production cluster with billions of rows, this causes multi-hour downtime, massive network saturation, and lock starvation.`
      },
      {
        heading: '12.10 Consistent Hashing Ring & Virtual Nodes',
        content: `**Consistent Hashing** eliminates the 80% resharding disaster:
1. Map all possible hash values (e.g. $0$ to $2^{32}-1$) onto a continuous circular **Hash Ring**.
2. Place the physical Shard nodes at specific hash positions on the ring.
3. To place a user, hash their \`user_id\` and find its coordinate on the ring.
4. **The Clockwise Rule**: Walk clockwise along the ring; the first shard node you encounter owns that user!

\`\`\`
           [0 / 2³²-1]
           Shard 0
         /         \\
     Shard 3       Shard 1
         \\         /
           Shard 2
\`\`\`

### Adding Shard 4 onto the Ring:
Place the new Shard between Shard 1 and Shard 2.
- Only the keys between Shard 1 and Shard 4 move to the new shard.
- Chris on Shard 3 does NOT move. Leo on Shard 0 does NOT move!
- **Only $\\frac{1}{N}$ (20%) of keys move instead of 80%!**

### The Virtual Nodes (vnodes) Solution:
Placing physical nodes directly on the ring can lead to non-uniform arc lengths (one shard owning 60% of the ring). Furthermore, if Shard 2 crashes, its entire load cascades onto Shard 3.

**Virtual Nodes**:
- Each physical machine is mapped to **10–200 virtual positions** around the ring (e.g. \`Shard0_v1\`, \`Shard0_v2\` ...).
- Partitions become small and evenly interleaved across the entire circle.
- When adding a new physical shard, it takes small slices from all existing machines.
- If a physical machine fails, its load is split evenly across all remaining surviving nodes!`
      }
    ]
  },
  {
    id: 'ch-13',
    chapterNumber: 13,
    level: 'advanced',
    levelLabel: '🔴 Advanced',
    title: 'Specialized Index Types Beyond B-Tree',
    subtitle: 'GIN, GiST, BRIN, Bitmap, Vector HNSW/IVF in pgvector, and B-Tree vs LSM-Tree storage',
    readTime: '9 min read',
    relatedTab: 'indexing',
    tags: ['GIN', 'GiST', 'BRIN', 'pgvector', 'HNSW', 'LSM-Tree', 'RocksDB'],
    summary: 'While B-Trees excel for scalar numbers and strings, modern workloads require specialized data structures. Master PostgreSQL GIN for JSONB and full-text search, BRIN for billions of time-series rows, Vector HNSW embeddings, and B-Tree update-in-place vs LSM-Tree sequential writes.',
    keyTakeaways: [
      'GIN (Generalized Inverted Index): Maps individual array elements, JSON keys, or text tokens to row CTIDs. Essential for JSONB (@>) and trigram search.',
      'BRIN (Block Range Index): Stores min/max values for ranges of physical disk blocks. Indexes billions of append-only time-series rows in just a few kilobytes of RAM!',
      'Vector Indexes (HNSW / IVF): Approximate Nearest Neighbor search on high-dimensional AI vector embeddings for RAG and semantic retrieval.',
      'B-Tree vs LSM-Tree: B-Trees do random I/O updates in-place (best for read-heavy OLTP); LSM-Trees write sequentially to memory MemTables and flush immutable SSTables (best for write-heavy logging).'
    ],
    sections: [
      {
        heading: '13.1 PostgreSQL Specialized Index Arsenal',
        content: `\`\`\`sql
-- 1. GIN (Generalized Inverted Index) on JSONB
CREATE INDEX idx_orders_json ON orders USING GIN (metadata jsonb_path_ops);
-- Blazing fast key/value containment lookup:
SELECT * FROM orders WHERE metadata @> '{"status": "expedited", "vip": true}';

-- 2. GIN Trigram Fuzzy Substring Search (pg_trgm)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);
-- Fast ILIKE with wildcards on both ends!
SELECT * FROM users WHERE name ILIKE '%antigravity%';

-- 3. BRIN (Block Range Index) for Multi-Gigabyte Time-Series
-- Instead of indexing every row, BRIN stores min/max dates for every 128 disk blocks
CREATE INDEX idx_telemetry_ts ON telemetry USING BRIN (recorded_at);

-- 4. HNSW Vector Index for AI Embeddings (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE INDEX idx_docs_embedding ON documents 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);
\`\`\``
      },
      {
        heading: '13.2 B-Tree vs LSM-Tree Storage Comparison',
        content: `\`\`\`
B-Tree (In-Place Page Updates):
Write ──▶ Find Disk Page ──▶ Overwrite 8KB block (Random I/O, Page Splits)

LSM-Tree (Log-Structured Merge Tree):
Write ──▶ Append to WAL (Sequential I/O) + Write to MemTable (RAM)
            │ (when MemTable fills)
            ▼
          Flush to L0 SSTable files on disk ──▶ Background Compaction ──▶ L1 ──▶ L2
\`\`\`

| Dimension | B-Tree Engine (Postgres, InnoDB) | LSM-Tree Engine (RocksDB, Cassandra) |
|---|---|---|
| **Write Performance** | Moderate (Random I/O, page writes, locking) | **Extremely High** (Sequential append-only writes) |
| **Read Performance** | **Predictable $O(\\log N)$** single lookup | Must check MemTable + Bloom filters + SSTable levels |
| **Write Amplification** | Higher (full page rewritten for single row change) | Moderate to high during background merge compactions |
| **Ideal Workloads** | Transactional OLTP (e-commerce, banking) | Write-heavy telemetry, timeseries, event sourcing |`
      }
    ]
  },
  {
    id: 'ch-14',
    chapterNumber: 14,
    level: 'advanced',
    levelLabel: '🔴 Advanced',
    title: 'Transactions, Isolation Levels & MVCC Internals',
    subtitle: 'Dirty reads, phantoms, write skew, two-phase locking, PostgreSQL xmin/xmax tuple headers, and WAL durability',
    readTime: '10 min read',
    relatedTab: 'transactions',
    tags: ['ACID', 'MVCC', 'xmin', 'xmax', 'Isolation Levels', 'WAL', 'Vacuum', 'Deadlock'],
    summary: 'Deep dive into transaction isolation and concurrency control. Explore the 4 ANSI isolation levels and their concurrency anomalies (dirty read, non-repeatable read, phantom, write skew), Multi-Version Concurrency Control (MVCC) tuple headers (xmin/xmax), and Write-Ahead Log crash recovery.',
    keyTakeaways: [
      'Concurrency Anomalies: Dirty read (reading uncommitted data), Non-repeatable read (row values change mid-transaction), Phantom read (new rows appear in range), Write skew (disjoint writes violate a shared business invariant).',
      'Isolation Levels: Read Uncommitted, Read Committed (PostgreSQL default), Repeatable Read (MySQL InnoDB default), Serializable.',
      'MVCC Principle: Readers never block writers; writers never block readers.',
      'PostgreSQL Tuples: Every row stores xmin (creating transaction ID) and xmax (deleting/updating transaction ID) to determine visibility snapshots without table locks.',
      'Durability via WAL: Transactions append changes to the sequential Write-Ahead Log on disk before modifying dirty pages in memory.'
    ],
    sections: [
      {
        heading: '14.1 Concurrency Anomalies & Isolation Matrix',
        content: `| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Write Skew |
|---|---|---|---|---|
| **Read Uncommitted** | ⚠️ Allowed | ⚠️ Allowed | ⚠️ Allowed | ⚠️ Allowed |
| **Read Committed** *(PG Default)* | ❌ Prevented | ⚠️ Allowed | ⚠️ Allowed | ⚠️ Allowed |
| **Repeatable Read** *(InnoDB Default)*| ❌ Prevented | ❌ Prevented | ❌ Prevented (Snapshot)* | ⚠️ Allowed |
| **Serializable** | ❌ Prevented | ❌ Prevented | ❌ Prevented | ❌ Prevented |

> 💡 **Write Skew Example**: Two doctors on on-call shift concurrently request leave. Rule: At least one doctor must remain on call. Both check \`SELECT COUNT(*) WHERE on_call = true\` (returns 2). Both execute \`UPDATE doctor SET on_call = false\`. Under Repeatable Read, both commit—leaving ZERO doctors on call! Only **Serializable** prevents write skew.`
      },
      {
        heading: '14.2 PostgreSQL MVCC: xmin & xmax Internals',
        content: `PostgreSQL implements **Multi-Version Concurrency Control (MVCC)** without overwriting data blocks in-place:

Every table tuple header contains hidden metadata fields:
- \`xmin\`: The Transaction ID (XID) that inserted the row.
- \`xmax\`: The Transaction ID that deleted or replaced the row (0 if live).

\`\`\`sql
-- Inspect MVCC tuple versions in PostgreSQL:
SELECT xmin, xmax, ctid, id, name, salary FROM employees;
\`\`\`

When a row is updated (\`UPDATE employees SET salary = 60000 WHERE id = 1\`):
1. The engine does NOT mutate the existing row.
2. It sets \`xmax = current_xid\` on the old tuple (marking it expired).
3. It inserts a BRAND NEW tuple with \`xmin = current_xid, xmax = 0\`.
4. Concurrent read transactions compare their private snapshot against \`xmin\` and \`xmax\` to see the version of data valid at their transaction start!

**Vacuuming Dead Tuples**:
Old row versions remain on disk as **dead tuples**. The background \`VACUUM\` daemon scans pages and marks dead tuple space as reusable for future inserts.`
      },
      {
        heading: '14.3 Durability & The Write-Ahead Log (WAL)',
        content: `How does a database guarantee durability without writing random 8KB disk blocks synchronously on every transaction commit?

\`\`\`
Transaction Commit ──▶ Append Record to WAL ──▶ fsync() to Disk ──▶ Return Success
                                  │
                       (Background Checkpoint)
                                  ▼
                 Flush Dirty Pages from Buffer Pool to Data Files
\`\`\`

1. **Sequential Append**: The Write-Ahead Log (WAL / Redo Log) is strictly append-only. Sequential disk writes achieve maximum IOPS.
2. **Crash Recovery (REDO)**: If the host loses power before dirty memory pages are flushed to the data files, the engine reboots, replays the sequential WAL from the last checkpoint, and reconstructs the committed state with 100% fidelity.`
      }
    ]
  },
  {
    id: 'ch-15',
    chapterNumber: 15,
    level: 'advanced',
    levelLabel: '🔴 Advanced',
    title: 'Architecture Cheat Sheet & Engineering Learning Roadmap',
    subtitle: 'One-page system design reference, troubleshooting decision matrix, and structured 4-stage engineer mastery path',
    readTime: '8 min read',
    relatedTab: 'guide',
    tags: ['Cheat Sheet', 'Roadmap', 'System Design', 'Troubleshooting', 'Resources'],
    summary: 'Consolidate the entire database mastery curriculum into an actionable one-page engineering cheat sheet, a production troubleshooting decision tree, and a 4-stage study roadmap (Foundations → Working Engineer → Internals → Scale & Distribution).',
    keyTakeaways: [
      'Troubleshooting flow: High latency → Check slow query log → Run EXPLAIN ANALYZE → Add composite/covering index → Refresh stale statistics.',
      'Architecture flow: Scale Vertically first → Add Connection Pooling (PgBouncer) → Add Redis caching → Add Read Replicas → Partition tables → Shard horizontally.',
      '4-Stage Learning Roadmap: Foundations (SQL, ER, Normalization) → Working Engineer (Indexing, Transactions, HikariCP) → Internals (CBO, Storage engines, WAL) → Scale (Consistent Hashing, Consensus, Distributed SQL).'
    ],
    sections: [
      {
        heading: '15.1 Production Troubleshooting Decision Tree',
        content: `\`\`\`
🚨 Database Experiencing High Query Latency?
 ├── 1. Check Execution Plan: Run EXPLAIN (ANALYZE, BUFFERS)
 │    ├── Seq Scan on big table? ────────▶ Add B-Tree Index on WHERE / JOIN columns
 │    ├── High "Rows Removed by Filter"? ─▶ Create Composite Index (Equality before Range)
 │    ├── Sort Method: External Disk? ───▶ Increase work_mem or create sorted index
 │    └── Estimated Rows << Actual Rows? ─▶ Run ANALYZE to refresh histogram statistics
 │
 ├── 2. Query is optimized, but Database CPU / RAM is 100% Saturated?
 │    ├── Connections > 500? ────────────▶ Deploy PgBouncer / RDS Proxy (size pool to ~2x cores)
 │    ├── Read-heavy workload (90% reads)?▶ Introduce Redis Cache-Aside & Read Replicas
 │    ├── Storage > 5 TB on single node? ─▶ Partition historical data by range or shard by tenant_id
 │    └── Write-heavy single primary? ───▶ Shard with Consistent Hashing ring or migrate to Distributed SQL
\`\`\``
      },
      {
        heading: '15.2 The 4-Stage Database Engineering Roadmap',
        content: `### 📌 Stage 1: Foundations (Weeks 1–2)
- ANSI SQL Fluency: \`JOIN\`, \`GROUP BY\`, \`HAVING\`, Subqueries, CTEs, Window Functions (\`ROW_NUMBER()\`, \`RANK()\`).
- Relational Modeling: Primary & Foreign Keys, Constraints, Normalization up to 3NF.
- CRUD access patterns and schema design for e-commerce or social networks.

### 📌 Stage 2: Working Software Engineer (Weeks 3–6)
- Indexing fundamentals: B-Tree navigation, Leftmost Prefix Rule, Covering Indexes (\`INCLUDE\`).
- Query plans: Reading and optimizing \`EXPLAIN ANALYZE\`.
- Transactions: ACID, Isolation Levels (Read Committed vs Repeatable Read), Row locking (\`SELECT FOR UPDATE\`).
- Connection management: Client pooling (HikariCP, psycopg3), connection leak prevention.

### 📌 Stage 3: Database Internals & Performance (Months 2–3)
- Query Optimizer: Relational Algebra trees, Cost-Based Optimizer, Join algorithms (Nested Loop, Hash, Sort-Merge).
- Storage engines: In-memory Buffer Pool, Dirty page flushing, Write-Ahead Logging (WAL), Checkpoints.
- Specialized Indexes: GIN for JSONB and trigram search, BRIN for time-series, pgvector for AI embeddings.
- Table partitioning, Vacuuming, and Bloat management.

### 📌 Stage 4: Scale, Distributed Data & NewSQL (Ongoing)
- Replication architectures: Primary-Replica, Streaming WAL, Asynchronous vs Synchronous quorums, Failover automation.
- Sharding: Range vs Hash vs Consistent Hashing with virtual nodes, Shard key selection, Cross-shard join handling.
- CAP & PACELC theorems, Distributed Transactions (2PC vs Saga pattern).
- Distributed SQL engines: Google Spanner, CockroachDB, TiDB, Citus for PostgreSQL.`
      },
      {
        heading: '15.3 Recommended Reading List',
        content: `1. ***Designing Data-Intensive Applications*** by Martin Kleppmann (The gold standard for distributed systems, replication, and storage).
2. ***Database System Concepts*** by Silberschatz, Korth, and Sudarshan (The definitive computer science textbook on relational algebra and query optimization).
3. ***Use The Index, Luke!*** by Markus Winand (Free online guide to SQL indexing and performance).
4. ***High Performance MySQL*** by Silvia Botros & Jeremy Tinley (In-depth MySQL/InnoDB operational tuning).
5. ***The Art of PostgreSQL*** by Dimitri Fontaine (Deep PostgreSQL idioms and relational query design).`
      }
    ]
  }
];

// =========================================================================
// DATABASE SHARDING INTERACTIVE Q&A / INTERVIEW QUESTIONS (Transcript-Aligned)
// 10 Comprehensive Questions & Answers from the Chirp Scaling Case Study
// =========================================================================
export const DATABASE_SHARDING_TUTORIAL_QA = [
  {
    id: 'qa-1',
    category: 'Fundamentals',
    difficulty: '🟢 Beginner / Fundamentals',
    question: 'Why can Read Replicas scale read queries, but completely fail to scale write operations?',
    shortAnswer: 'Concurrent writes to replicas cause split-brain data corruption (e.g. like counts incrementing to 100 on both machines instead of 101). All writes must serialize through a single Primary source of truth.',
    fullAnswer: `When traffic grows, adding read replicas allows the system to spread \`SELECT\` queries across 3 or 4 machines, reducing query latency.

However, replicas **cannot accept independent writes** without violating consistency:
1. **The Like Counter Race Condition**: Suppose Leo's chirp has 99 likes. Chris and Martin tap "Like" at the exact same millisecond. Chris's request hits the Primary, incrementing the counter from 99 to 100. Martin's request hits a Replica that also held 99, incrementing to 100. Both nodes report 100 likes, but the true count is 101!
2. **Variable Collisions**: If the Primary updates $x = 7 \\to 9$ while a replica simultaneously updates $x = 7 \\to 10$, the database enters a conflicted split-brain state with no single source of truth.

Therefore, every write must flow exclusively to the **single Primary database**, which eventually reaches its physical CPU, RAM, and disk I/O limits. **Sharding is the only way to scale writes horizontally by creating multiple independent primaries.**`,
    takeaway: 'Replicas scale read throughput; Sharding is mandatory to scale write throughput.',
    codeExample: `// Write Bottleneck: 1 Primary handles 100% of INSERT / UPDATE traffic
// Sharding Solution: 4 Shards = 4 Independent Primaries, each handling 25% of writes`
  },
  {
    id: 'qa-2',
    category: 'Architecture',
    difficulty: '🟢 Beginner',
    question: 'What is Database Sharding, and how does the naive modulo remainder formula divide users?',
    shortAnswer: 'Sharding splits database rows across multiple independent machines running identical schemas. Under naive modulo, Shard = user_id % num_shards.',
    fullAnswer: `**Sharding** is horizontal database scaling where no single machine holds the entire dataset. Instead, rows are partitioned across multiple machines called **Shards**.

Key architectural properties:
- **Identical Schema**: Every shard runs the same tables, columns, indexes, and constraints.
- **Independent Execution**: Each shard is a full database server with its own memory buffer pool and CPU.

### The Naive Modulo Remainder Rule (e.g. 4 Shards):
$$\\text{Shard Number} = \\text{user\\_id} \\pmod 4$$
Because any integer divided by 4 leaves a remainder of $0, 1, 2,$ or $3$:
- User ID 1 $\\to 1 \\pmod 4 = 1$ (Shard 1)
- User ID 2 $\\to 2 \\pmod 4 = 2$ (Shard 2)
- User ID 3 $\\to 3 \\pmod 4 = 3$ (Shard 3)
- User ID 4 $\\to 4 \\pmod 4 = 0$ (Shard 0)

Routing is instantaneous: to find User 41, the router evaluates $41 \\pmod 4 = 1$ and connects straight to Shard 1 without querying other machines.`,
    takeaway: 'Sharding distributes rows across independent database servers running identical schemas.',
    codeExample: `const targetShard = userId % 4; // Remainder: 0 -> Shard 0, 1 -> Shard 1, etc.`
  },
  {
    id: 'qa-3',
    category: 'Key Design',
    difficulty: '🟡 Intermediate',
    question: 'What are the 5 Golden Rules for selecting a production Shard Key?',
    shortAnswer: '1. High Cardinality, 2. Even Distribution, 3. Access Pattern Alignment, 4. Immutability, and 5. Collocation of related tables.',
    fullAnswer: `The shard key determines where every row lives. Choosing the wrong key is devastating because changing it later requires full cluster data rebalancing.

The 5 Golden Rules:
1. **High Cardinality**: The key must have millions of distinct values. Sharding by \`country\` (~200 values) causes India/US shards to melt under massive population skew while Greenland sits empty.
2. **Even / Uniform Distribution**: Values must spread writes evenly over time. Sharding by \`signup_year\` causes 95% of all new writes to hammer the current year's shard, leaving older shards cold. Sequential \`user_id\` distributes writes cyclically across all shards.
3. **Access Pattern Alignment**: Query filters must match the shard key. If 95% of queries ask for a user's data, sharding by \`user_id\` routes queries to 1 target shard. Sharding by \`post_id\` forces catastrophic **Scatter-Gather** across all shards.
4. **Immutability**: The key value must NEVER change. If a user changes their \`username\`, their entire history must be copied to another shard and deleted from the old shard. A network failure midway corrupts data.
5. **Collocation (Co-location)**: Related records must live on the same physical machine to enable local joins without distributed network latency.`,
    takeaway: 'A great shard key has high cardinality, uniform distribution, immutability, aligns with queries, and co-locates related data.',
    codeExample: `// ✅ user_id: High cardinality, immutable, uniform, matches queries
// ❌ country: Low cardinality, massive population skew
// ❌ signup_year: Severe temporal write hotspot on active year`
  },
  {
    id: 'qa-4',
    category: 'Performance',
    difficulty: '🟡 Intermediate',
    question: 'What is Collocation (Co-location), and why is it critical in multi-table databases?',
    shortAnswer: 'Collocation stores related tables (users, posts, likes) on the same shard using a shared shard key, allowing full entity lookups with zero cross-shard network joins.',
    fullAnswer: `Real applications have multiple relational tables. In Chirp:
- \`users\` table (profiles)
- \`chirps\` table (posts)
- \`likes\` table (reactions)

### The Un-collocated Anti-Pattern:
If we shard \`users\` by \`user_id\`, but shard \`chirps\` by \`post_id\`:
- Chris's user row lives on **Shard 3**.
- Chris's 1,000 chirps are scattered across **Shard 0, Shard 1, Shard 2, and Shard 3**.
- Opening Chris's profile requires querying all shards over the network and stitching the pieces together in application memory.

### The Collocated Solution:
Shard **all three tables by \`user_id\`**:
- Chris's profile row is on **Shard 3**.
- Every chirp written by Chris has \`author_id = Chris\` and lands on **Shard 3**.
- Every like given by Chris lands on **Shard 3**.
- When Chris loads his profile and feed, the application queries **only Shard 3**, executing blazing-fast local joins with zero cross-network latency!`,
    takeaway: 'Always shard child tables by the parent entity key so related data sits on one physical machine.',
    codeExample: `// Collocated Schema Design:
// users TABLE  -> Sharded by user_id
// chirps TABLE -> Sharded by author_id (user_id)
// likes TABLE  -> Sharded by user_id`
  },
  {
    id: 'qa-5',
    category: 'Hashing',
    difficulty: '🟡 Intermediate',
    question: 'Why is Python\'s built-in hash() function dangerous for sharding, and what must be used instead?',
    shortAnswer: 'Python randomizes its internal hash seed on every process restart for security. Production sharding requires deterministic algorithms (e.g. MurmurHash3, MD5) that return the exact same integer permanently.',
    fullAnswer: `Non-numeric shard keys like email addresses (\`chris@gmail.com\`) or UUIDs cannot be divided by 4 directly. A hash function turns any string into an integer.

### The Python \`hash()\` Trap:
If you run Python:
\`\`\`python
# Process Run 1:
hash("chris@gmail.com") % 4 # -> Returns 3 (Stored on Shard 3)

# Server Restarts (New Process Run 2):
hash("chris@gmail.com") % 4 # -> Returns 1 (Looks on Shard 1! Data is lost!)
\`\`\`
Python intentionally mixes a randomized seed at startup to prevent Hash-DoS algorithmic complexity attacks. This makes the built-in \`hash()\` fatal for persistent database routing.

### The Production Requirement:
Production database routers (MongoDB, Cassandra, Vitess) use **deterministic, persistent hash algorithms**:
- **MD5 / SHA-256** (Cryptographic, slower)
- **MurmurHash3 / CityHash / xxHash** (Non-cryptographic, ultra-fast, excellent avalanche distribution)
- **MongoDB Hashed Sharding**: Uses MD5-based deterministic hashing to ensure key $K$ yields identical values across all nodes permanently.`,
    takeaway: 'Never use language-randomized hashes; always use deterministic persistent hash functions like MurmurHash3.',
    codeExample: `// Deterministic Hashing Example:
import murmurhash from 'murmurhash';
const shardId = Math.abs(murmurhash.v3("chris@gmail.com")) % numShards;`
  },
  {
    id: 'qa-6',
    category: 'Strategies',
    difficulty: '🟡 Intermediate',
    question: 'Compare the 4 fundamental Sharding Strategies (Hash, Range, Directory, Regional).',
    shortAnswer: 'Hashed: uniform spread; Range: localized ranges with write hotspot; Directory: lookup table for custom sizing; Regional: 2-tier for latency and GDPR compliance.',
    fullAnswer: `| Strategy | Mechanism | Best Use Case | Main Limitation |
|---|---|---|---|
| **1. Hashed Sharding** | $\\text{Hash}(K) \\pmod N$ | Social media, user profiles, OLTP point queries | Inefficient for range scans (\`WHERE created_at BETWEEN X AND Y\`) |
| **2. Range Sharding** | Contiguous ranges ($1-100k, 100k-200k$) | Financial audits, date-based transaction history | Write hotspot on the newest active range shard |
| **3. Directory Sharding** | Central lookup table maps ID $\\to$ Shard | B2B SaaS with giant "whale" enterprise accounts | Directory table is a single point of failure and extra lookup hop |
| **4. Regional Sharding** | Multi-level: Country $\\to$ Region, then Hash | Global applications, low latency, GDPR data sovereignty | Cross-region queries and user relocations are complex |

### The Two-Tier Regional Hybrid:
- **Tier 1 (Region)**: European users route to AWS Frankfurt (\`eu-central-1\`), satisfying European data privacy laws.
- **Tier 2 (Hashed)**: Within Frankfurt, \`hash(user_id) % 8\` uniformly spreads European users across 8 local shards.`,
    takeaway: 'Choose Hashed for uniform point queries, Range for date scans, Directory for enterprise tenants, and Regional for GDPR.',
    codeExample: `// Directory Sharding:
// Enterprise Tenant (50,000 employees) -> Dedicated Shard 5
// Standard Tenants (50 employees)       -> Shared Shards 0-4`
  },
  {
    id: 'qa-7',
    category: 'Hotspots',
    difficulty: '🔴 Advanced',
    question: 'What is the "Celebrity Problem" in sharding, and how does the 3-Tier engineering fix solve it?',
    shortAnswer: 'A celebrity with 40M followers drives 100k reads/sec, melting their assigned shard. Solved by: 1. Dedicated Shard (Directory), 2. Redis In-Memory Cache for reads, and 3. Write Key Salting for concurrent likes.',
    fullAnswer: `Even with uniform hashing, user activity is NOT uniform. Pop star **Lena** has 40 million followers and lands on **Shard 2**.
When Lena posts a chirp:
- Shard 2 is swamped with **100,000+ reads per second**, maxing out its CPU and dropping packets.
- Shards 0, 1, and 3 are receiving only **20,000 reads/sec**.
- Regular users who share Shard 2 with Lena experience complete downtime.

### The 3-Tier Solution:
1. **Tier 1: Dedicated Shard (Directory Override)**:
   - Configure the router: If \`user_id == 500 (Lena)\`, send queries to **Shard 4 (Dedicated)**.
   - Isolates Lena's blast radius so ordinary users on Shard 2 are never impacted.
2. **Tier 2: In-Memory Read Caching (Redis/Memcached)**:
   - Lena's profile and recent posts are cached in distributed Redis clusters.
   - 99% of read requests are answered from RAM in sub-millisecond time without touching Shard 4.
3. **Tier 3: Write Key Salting (For Concurrent Writes)**:
   - Cache solves reads, but what happens when 5 million users tap "Like" on Lena's post in 10 seconds?
   - Caching cannot solve database writes! Writes must use **Salting**.`,
    takeaway: 'Isolate celebrity read load with dedicated shards + Redis cache; distribute celebrity write load with key salting.',
    codeExample: `// Routing Decision Tree:
// 1. Check Redis Cache -> HIT? Return immediately.
// 2. Is Lena Likes Write? -> Pick random salt (500-1..10) -> Send to Shard.
// 3. Is Lena Profile? -> Send to Dedicated Shard 4.
// 4. Normal User? -> hash(id) % 4 -> Send to standard Shard.`
  },
  {
    id: 'qa-8',
    category: 'Hotspots',
    difficulty: '🔴 Advanced',
    question: 'How does Write Key Salting distribute massive concurrent writes across existing shards?',
    shortAnswer: 'Salting appends a random suffix (e.g. 500-1 to 500-10) to the hot key. The hash function spreads these 10 keys across existing shards, turning a single write hotspot into 10 distributed writes.',
    fullAnswer: `When millions of users like Lena's post (\`author_id = 500\`), sending all likes to Shard 4 will cause row lock contention and disk write exhaustion.

### The Salting Mechanism:
Instead of saving every like under the single key \`500\`, the application appends a random salt number between 1 and 10:
$$\\text{Salted Keys: } \\mathbf{500\\text{-}1}, \\mathbf{500\\text{-}2}, \\mathbf{500\\text{-}3} \\dots \\mathbf{500\\text{-}10}$$

1. Because hash functions have the **avalanche effect**, these 10 distinct strings hash to completely different numbers!
2. \`500-1\` lands on Shard 0, \`500-2\` lands on Shard 1, \`500-3\` lands on Shard 2, and \`500-4\` lands on Shard 3.
3. Each shard handles only **10% of Lena's write likes** instead of one machine crashing under 100%.

### Reading the Total Like Count:
To display the like counter, the router performs a **Scatter-Gather** across the 10 salted keys and sums them together:
$$\\text{Total Likes} = \\sum_{i=1}^{10} \\text{Likes}(\\text{key } 500\\text{-}i)$$
We only salt hot keys (celebrities) because Chris only gets 5 likes and does not need the scatter-gather read overhead.`,
    takeaway: 'Salting trades slightly slower read aggregation for massive horizontal write scalability on hot keys.',
    codeExample: `// Write Path (Fast distributed write):
const randomSalt = Math.floor(Math.random() * 10) + 1;
db.likes.insert({ key: \`\${authorId}-\${randomSalt}\`, likerId });

// Read Path (Sum 10 keys):
const total = await Promise.all([1..10].map(s => db.likes.count({ key: \`\${authorId}-\${s}\` })))
  .then(counts => counts.reduce((a, b) => a + b, 0));`
  },
  {
    id: 'qa-9',
    category: 'Resharding',
    difficulty: '🔴 Advanced',
    question: 'Why does naive modulo sharding (hash % N) cause an 80% Resharding Disaster when adding a shard?',
    shortAnswer: 'Because N is part of the formula, changing from N=4 to N=5 changes the remainder for ~80% of all existing records, forcing massive cross-cluster data migration.',
    fullAnswer: `Suppose Chirp runs on 4 shards using $\\text{id} \\pmod 4$. As user storage fills up, John and Allan add a 5th machine and update the formula to $\\text{id} \\pmod 5$.

### The Modulo Remapping Math:
Consider 20 users:
- User 1: $1 \\pmod 4 = 1 \\implies 1 \\pmod 5 = 1$ (Stays on Shard 1)
- User 5: $5 \\pmod 4 = 1 \\implies 5 \\pmod 5 = 0$ (⚠️ Moves from Shard 1 to Shard 0)
- User 8: $8 \\pmod 4 = 0 \\implies 8 \\pmod 5 = 3$ (⚠️ Moves from Shard 0 to Shard 3)
- User 12: $12 \\pmod 4 = 0 \\implies 12 \\pmod 5 = 2$ (⚠️ Moves from Shard 0 to Shard 2)

Statistically, **$\\frac{N-1}{N} = \\frac{4}{5} = 80\\%$ of all rows change shards!**
If your database has 1 billion rows:
- **800,000,000 rows must be read from disk**, serialized, transferred over the network, inserted into new shards, and deleted from old shards.
- The network becomes saturated, disk IOPS hit 100%, and the application faces hours of degraded performance or downtime.`,
    takeaway: 'Naive modulo sharding embeds the node count into the routing formula, making cluster expansion catastrophic.',
    codeExample: `// When N changes from 4 to 5:
// 16 out of 20 keys (80%) must migrate to another server!
// Solution: Consistent Hashing moves only 1/N (20%) of keys.`
  },
  {
    id: 'qa-10',
    category: 'Consistent Hashing',
    difficulty: '🔴 Advanced',
    question: 'How does Consistent Hashing on a 360° Ring with Virtual Nodes solve the resharding problem?',
    shortAnswer: 'Consistent hashing maps keys and nodes onto a circular ring. Adding a node only moves keys between immediate neighbors (1/N of keys). Virtual nodes ensure uniform partition sizes and balance failover load.',
    fullAnswer: `**Consistent Hashing** decouples the routing formula from the total number of shards:

### 1. The 360° Hash Ring:
1. Map the hash space (e.g. $0$ to $2^{32}-1$) onto a continuous circle where $2^{32}-1$ connects back to $0$.
2. Hash the shard server names and place them at points on the circle.
3. To route a key: compute $\\text{hash}(\\text{user\\_id})$ and find its location on the ring.
4. **Clockwise Rule**: Walk clockwise along the ring; the first physical shard node you encounter owns that user.

### 2. Adding a New Shard:
Place Shard 4 between Shard 1 and Shard 2 on the ring.
- Only the keys between Shard 1 and Shard 4 migrate to the new shard!
- Keys on Shard 0, Shard 2, and Shard 3 remain completely undisturbed.
- **Only $\\frac{1}{N}$ (20%) of keys move instead of 80%!**

### 3. The Power of Virtual Nodes (vnodes):
Placing few physical nodes on the ring leads to non-uniform arc lengths (one shard owning 60% of the circle). Furthermore, if Shard 2 dies, its entire load cascades onto Shard 3, triggering a cascading outage.

**Virtual Nodes**:
- Assign each physical machine **100+ virtual tokens** spread evenly across the circle.
- Partitions become small and uniformly distributed.
- If physical Machine B dies, its virtual nodes are scattered around the ring, distributing its failover load **evenly across ALL remaining surviving machines**!`,
    takeaway: 'Consistent Hashing with virtual nodes ensures only 1/N keys move on resize and failover load distributes evenly.',
    codeExample: `// Consistent Hash Ring Clockwise Lookup:
function getShard(key, ring) {
  const hash = murmurhash.v3(key);
  // Find first node with position >= hash (wrapping clockwise)
  return ring.find(node => node.pos >= hash) || ring[0];
}`
  }
];

