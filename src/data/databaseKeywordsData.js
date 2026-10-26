// =========================================================================
// DATABASE KEYWORDS, OPERATORS & METHODS REFERENCE DATA
// Curated for MySQL (InnoDB), PostgreSQL, and MongoDB
// Includes syntax, purpose, engine mechanics, and real-world practical examples
// =========================================================================

export const DATABASE_KEYWORDS_CATEGORIES = [
  { id: 'all', label: 'All Keywords (40+)', icon: 'Sparkles' },
  { id: 'dml', label: 'MySQL: DML (Data Manipulation)', engine: 'sql' },
  { id: 'ddl', label: 'MySQL: DDL (Data Definition)', engine: 'sql' },
  { id: 'tcl_dcl', label: 'MySQL: TCL & DCL (Transactions)', engine: 'sql' },
  { id: 'clauses', label: 'MySQL: Query Clauses & Operators', engine: 'sql' },
  { id: 'pg_advanced', label: 'PostgreSQL: Advanced & Keywords', engine: 'postgres' },
  { id: 'pg_admin', label: 'PostgreSQL: Admin & Maintenance', engine: 'postgres' },
  { id: 'mongo_methods', label: 'MongoDB: Collection Functions (CRUD/Index)', engine: 'mongodb' },
  { id: 'mongo_cursor', label: 'MongoDB: Cursor Methods (Chained)', engine: 'mongodb' },
  { id: 'mongo_query', label: 'MongoDB: Query Selectors ($gt, $in, $or)', engine: 'mongodb' },
  { id: 'mongo_element', label: 'MongoDB: Element & Array ($elemMatch)', engine: 'mongodb' },
  { id: 'mongo_update', label: 'MongoDB: Update Operators ($set, $push)', engine: 'mongodb' },
  { id: 'mongo_agg', label: 'MongoDB: Aggregation Pipeline Stages', engine: 'mongodb' },
  { id: 'utility', label: 'SQL Diagnostics & EXPLAIN', engine: 'all' }
];

export const DATABASE_KEYWORDS_DATA = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. MYSQL: DATA MANIPULATION LANGUAGE (DML)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mysql-select',
    keyword: 'SELECT',
    category: 'dml',
    categoryLabel: 'Data Manipulation (DML)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Retrieves rows and columns from one or more tables or views.',
    syntax: 'SELECT column1, column2, ... FROM table_name WHERE condition;',
    example: `-- Retrieve active users ordered by signup date with pagination
SELECT id, username, email, created_at
FROM users
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;`,
    outputNote: 'Returns tabular result set. In MySQL InnoDB, reads take shared read view or MVCC snapshot.'
  },
  {
    id: 'mysql-insert',
    keyword: 'INSERT (INTO, VALUES)',
    category: 'dml',
    categoryLabel: 'Data Manipulation (DML)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Adds one or more new rows into a database table.',
    syntax: 'INSERT INTO table_name (col1, col2, ...) VALUES (val1, val2, ...);',
    example: `-- Single row and multi-row bulk insert
INSERT INTO users (username, email, role, status)
VALUES 
  ('alex_dev', 'alex@example.com', 'admin', 'active'),
  ('carol_qa', 'carol@example.com', 'tester', 'pending');`,
    outputNote: 'Query OK, 2 rows affected. Recorded into InnoDB Redo Log buffer.'
  },
  {
    id: 'mysql-update',
    keyword: 'UPDATE (SET)',
    category: 'dml',
    categoryLabel: 'Data Manipulation (DML)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Modifies existing rows in a table matching a WHERE clause.',
    syntax: 'UPDATE table_name SET col1 = val1, col2 = val2 WHERE condition;',
    example: `-- Update status and timestamp for a customer order
UPDATE orders
SET status = 'shipped',
    tracking_number = 'TRK9823412',
    updated_at = NOW()
WHERE order_id = 1042 AND status = 'processing';`,
    outputNote: 'InnoDB performs in-place update and writes previous row image into Undo Log.'
  },
  {
    id: 'mysql-delete',
    keyword: 'DELETE (FROM)',
    category: 'dml',
    categoryLabel: 'Data Manipulation (DML)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Removes rows that satisfy the WHERE condition from a table.',
    syntax: 'DELETE FROM table_name WHERE condition;',
    example: `-- Purge expired guest sessions older than 7 days
DELETE FROM sessions 
WHERE user_type = 'guest' 
  AND last_accessed < NOW() - INTERVAL 7 DAY;`,
    outputNote: 'Rows are marked as deleted (delete mark flag) in InnoDB B+Tree pages.'
  },
  {
    id: 'mysql-replace',
    keyword: 'REPLACE',
    category: 'dml',
    categoryLabel: 'Data Manipulation (DML)',
    engine: 'sql',
    engineLabel: 'MySQL Specific',
    engineBadgeColor: '#0284c7',
    description: 'MySQL extension that operates like INSERT, except that if an old row has the same PRIMARY KEY or UNIQUE index, the old row is deleted before the new row is inserted.',
    syntax: 'REPLACE INTO table_name (col1, col2) VALUES (val1, val2);',
    example: `-- Replace user preference record if key already exists
REPLACE INTO user_preferences (user_id, dark_mode, locale, updated_at)
VALUES (105, 1, 'en_US', NOW());`,
    outputNote: 'Returns 1 row affected if inserted, or 2 rows affected if an existing row was deleted and replaced.'
  },
  {
    id: 'mysql-do',
    keyword: 'DO',
    category: 'dml',
    categoryLabel: 'Data Manipulation (DML)',
    engine: 'sql',
    engineLabel: 'MySQL Specific',
    engineBadgeColor: '#0284c7',
    description: 'Executes expressions without returning a result table; faster than SELECT when you only care about side-effects.',
    syntax: 'DO expr1, expr2, ...;',
    example: `-- Pause execution for 2 seconds or release advisory lock
DO SLEEP(2);
DO RELEASE_LOCK('nightly_data_pipeline_lock');`,
    outputNote: 'Useful in stored procedures, trigger logic, and concurrency locks.'
  },
  {
    id: 'mysql-call',
    keyword: 'CALL',
    category: 'dml',
    categoryLabel: 'Data Manipulation (DML)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Invokes a previously defined stored procedure, optionally passing in and receiving output parameters.',
    syntax: 'CALL procedure_name(arg1, arg2, @out_param);',
    example: `-- Call financial settlement procedure
SET @status = '';
CALL sp_process_monthly_billing('2026-10-01', @status);
SELECT @status AS settlement_status;`,
    outputNote: 'Executes pre-compiled routine server-side inside MySQL memory space.'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 1. MYSQL: DATA DEFINITION LANGUAGE (DDL)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mysql-create',
    keyword: 'CREATE',
    category: 'ddl',
    categoryLabel: 'Data Definition (DDL)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Creates databases, tables, indexes, views, stored procedures, functions, or triggers.',
    syntax: 'CREATE [DATABASE|TABLE|INDEX|VIEW|PROCEDURE] name (...);',
    example: `-- Create relational users table with primary key and index
CREATE TABLE products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
    outputNote: 'Allocates InnoDB tablespace (.ibd) and clustered B+Tree root page.'
  },
  {
    id: 'mysql-alter',
    keyword: 'ALTER',
    category: 'ddl',
    categoryLabel: 'Data Definition (DDL)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Modifies table schema, columns, constraints, or database properties.',
    syntax: 'ALTER TABLE table_name ADD|DROP|MODIFY COLUMN ...;',
    example: `-- Add column with online non-blocking DDL
ALTER TABLE products 
  ADD COLUMN discount_pct DECIMAL(5,2) DEFAULT 0.00 AFTER price,
  ALGORITHM=INPLACE, 
  LOCK=NONE;`,
    outputNote: 'MySQL 8.0 Instant DDL applies metadata change instantly without table rewrite.'
  },
  {
    id: 'mysql-drop',
    keyword: 'DROP',
    category: 'ddl',
    categoryLabel: 'Data Definition (DDL)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Permanently deletes an entire database, table, index, or view along with all its data and definitions.',
    syntax: 'DROP TABLE [IF EXISTS] table_name;',
    example: `-- Safely drop obsolete staging table and foreign keys
DROP TABLE IF EXISTS staging_imported_orders;`,
    outputNote: 'Deallocates disk pages and invalidates buffer pool cache entries.'
  },
  {
    id: 'mysql-truncate',
    keyword: 'TRUNCATE',
    category: 'ddl',
    categoryLabel: 'Data Definition (DDL)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Completely drops and recreates a table. Far faster than DELETE because it does not log individual row deletions and resets AUTO_INCREMENT counters.',
    syntax: 'TRUNCATE TABLE table_name;',
    example: `-- Reset staging table and auto-increment identity
TRUNCATE TABLE temp_etl_raw_payloads;`,
    outputNote: 'Cannot be rolled back in MySQL! Cannot run if referenced by active FOREIGN KEY.'
  },
  {
    id: 'mysql-rename',
    keyword: 'RENAME',
    category: 'ddl',
    categoryLabel: 'Data Definition (DDL)',
    engine: 'sql',
    engineLabel: 'MySQL Specific',
    engineBadgeColor: '#0284c7',
    description: 'Atomically renames one or more tables; useful for zero-downtime blue/green table deployments.',
    syntax: 'RENAME TABLE old_name TO new_name [, old_name2 TO new_name2];',
    example: `-- Atomic swap of production table with newly populated shadow table
RENAME TABLE 
  orders TO orders_backup_october,
  orders_staging TO orders;`,
    outputNote: 'Executes atomically with table lock so readers never see missing tables.'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 1. MYSQL: DATA CONTROL (DCL) & TRANSACTION CONTROL (TCL)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mysql-grant-revoke',
    keyword: 'GRANT & REVOKE',
    category: 'tcl_dcl',
    categoryLabel: 'Data Control (DCL)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Assigns (GRANT) or revokes (REVOKE) database privileges and access rights to specific database users or roles.',
    syntax: 'GRANT privileges ON db.table TO user@host; \nREVOKE privileges ON db.table FROM user@host;',
    example: `-- Grant least-privilege read access to backend reporting service
GRANT SELECT ON production_db.* TO 'reporting_svc'@'10.240.%.%';
REVOKE DROP, ALTER ON production_db.* FROM 'reporting_svc'@'10.240.%.%';
FLUSH PRIVILEGES;`,
    outputNote: 'Writes permissions to mysql.db and mysql.tables_priv grant tables.'
  },
  {
    id: 'mysql-commit-rollback',
    keyword: 'COMMIT & ROLLBACK',
    category: 'tcl_dcl',
    categoryLabel: 'Transaction Control (TCL)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'COMMIT makes all transaction modifications permanent to storage. ROLLBACK discards all uncommitted modifications using the undo logs.',
    syntax: 'COMMIT; \nROLLBACK;',
    example: `-- Complete an atomic bank account funds transfer
START TRANSACTION;
UPDATE accounts SET balance = balance - 250.00 WHERE id = 101;
UPDATE accounts SET balance = balance + 250.00 WHERE id = 202;
COMMIT;`,
    outputNote: 'COMMIT flushes Redo Log buffer to disk (innodb_flush_log_at_trx_commit).'
  },
  {
    id: 'mysql-savepoint',
    keyword: 'SAVEPOINT',
    category: 'tcl_dcl',
    categoryLabel: 'Transaction Control (TCL)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Creates an intermediate bookmark within a transaction so you can partially roll back without aborting the entire transaction.',
    syntax: 'SAVEPOINT savepoint_name; \nROLLBACK TO SAVEPOINT savepoint_name;',
    example: `-- Savepoint for partial rollback
START TRANSACTION;
INSERT INTO audit_log (event) VALUES ('started');
SAVEPOINT step_before_payment;
UPDATE payments SET status = 'failed' WHERE id = 999;
ROLLBACK TO SAVEPOINT step_before_payment;
COMMIT;`,
    outputNote: 'Releases only the locks acquired after the declared savepoint.'
  },
  {
    id: 'mysql-start-transaction',
    keyword: 'START TRANSACTION',
    category: 'tcl_dcl',
    categoryLabel: 'Transaction Control (TCL)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Begins a new explicit ACID transaction and suspends AUTOCOMMIT mode for subsequent statements.',
    syntax: 'START TRANSACTION [WITH CONSISTENT SNAPSHOT] [READ ONLY | READ WRITE];',
    example: `-- Consistent read snapshot for consistent point-in-time backup
START TRANSACTION WITH CONSISTENT SNAPSHOT;
SELECT COUNT(*) FROM ledger_entries;
SELECT SUM(amount) FROM ledger_entries;
COMMIT;`,
    outputNote: 'WITH CONSISTENT SNAPSHOT creates an InnoDB read view immediately.'
  },
  {
    id: 'mysql-set-transaction',
    keyword: 'SET TRANSACTION',
    category: 'tcl_dcl',
    categoryLabel: 'Transaction Control (TCL)',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Configures the isolation level (READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE) globally or for the next transaction.',
    syntax: 'SET [GLOBAL | SESSION] TRANSACTION ISOLATION LEVEL level;',
    example: `-- Set transaction isolation level for high-throughput analytics
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
SELECT * FROM sales_facts;
COMMIT;`,
    outputNote: 'Default in MySQL InnoDB is REPEATABLE READ (uses Next-Key gap locking).'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 1. MYSQL: QUERY CLAUSES & OPERATORS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mysql-where-group-having',
    keyword: 'WHERE, GROUP BY, HAVING',
    category: 'clauses',
    categoryLabel: 'Query Clauses',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'WHERE filters rows before grouping. GROUP BY groups rows by unique column values. HAVING filters the aggregated summary rows post-grouping.',
    syntax: 'SELECT col, AGG(col) FROM tbl WHERE condition GROUP BY col HAVING agg_condition;',
    example: `-- Identify departments spending over $500,000 in salary on active staff
SELECT department_id, COUNT(*) AS headcount, AVG(salary) AS avg_sal, SUM(salary) AS total_budget
FROM employees
WHERE is_active = TRUE
GROUP BY department_id
HAVING SUM(salary) > 500000;`,
    outputNote: 'WHERE cannot evaluate aggregates like SUM() or COUNT(); HAVING can.'
  },
  {
    id: 'mysql-order-limit-offset',
    keyword: 'ORDER BY, LIMIT, OFFSET',
    category: 'clauses',
    categoryLabel: 'Query Clauses',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'ORDER BY specifies sort order (ASC or DESC). LIMIT and OFFSET bound the count and starting offset of rows returned (pagination).',
    syntax: 'SELECT ... ORDER BY column [ASC|DESC] LIMIT count OFFSET skip_rows;',
    example: `-- Top 5 highest revenue products on page 2 (skipping top 5)
SELECT id, title, revenue
FROM product_analytics
ORDER BY revenue DESC
LIMIT 5 OFFSET 5;`,
    outputNote: 'High offsets (e.g. OFFSET 100000) scan and discard rows; keyset pagination is preferred.'
  },
  {
    id: 'mysql-join-types',
    keyword: 'JOIN (INNER, LEFT, RIGHT, CROSS)',
    category: 'clauses',
    categoryLabel: 'Query Clauses',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Combines columns from two tables based on a related column predicate (ON or USING).',
    syntax: 'SELECT ... FROM tbl1 [INNER|LEFT|RIGHT|CROSS] JOIN tbl2 ON tbl1.id = tbl2.ref_id;',
    example: `-- LEFT JOIN to find users who have never placed an order
SELECT u.id, u.username, u.email, o.order_id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.order_id IS NULL;`,
    outputNote: 'INNER JOIN matches both sides. LEFT JOIN preserves all left rows, filling NULL for misses.'
  },
  {
    id: 'mysql-union',
    keyword: 'UNION & UNION ALL',
    category: 'clauses',
    categoryLabel: 'Query Clauses',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Combines the result sets of two or more SELECT queries into a single output. UNION removes duplicates via sort/hash; UNION ALL retains all rows (faster).',
    syntax: 'SELECT ... UNION [ALL] SELECT ...;',
    example: `-- Combine domestic and international shipments without duplicate filtering overhead
SELECT tracking_no, 'domestic' AS type, created_at FROM domestic_shipments
UNION ALL
SELECT tracking_no, 'international' AS type, created_at FROM international_shipments
ORDER BY created_at DESC;`,
    outputNote: 'Always prefer UNION ALL if results are known to be distinct to save sorting cost.'
  },
  {
    id: 'mysql-pattern-matching',
    keyword: 'LIKE, RLIKE, REGEXP',
    category: 'clauses',
    categoryLabel: 'Query Clauses',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'LIKE matches wildcard patterns (% and _). RLIKE and REGEXP match POSIX regular expressions.',
    syntax: 'column LIKE pattern | column REGEXP regex_pattern',
    example: `-- Search for emails ending with university domains
SELECT username, email 
FROM users 
WHERE email LIKE '%.edu' 
   OR email REGEXP '^[a-z0-9._%+-]+@(mit|stanford|harvard)\\.edu$';`,
    outputNote: 'Prefix patterns like LIKE "abc%" can use B+Tree indexes. "%abc" causes full index scan.'
  },
  {
    id: 'mysql-case-when',
    keyword: 'CASE, WHEN, THEN, ELSE, END',
    category: 'clauses',
    categoryLabel: 'Query Clauses',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'Provides conditional if-then-else branching logic inside queries and projection lists.',
    syntax: 'CASE WHEN cond1 THEN val1 WHEN cond2 THEN val2 ELSE default_val END',
    example: `-- Categorize order priority tier dynamically
SELECT order_id, total,
  CASE 
    WHEN total >= 1000 THEN 'Platinum VIP'
    WHEN total >= 250 THEN 'Gold Tier'
    WHEN total >= 50 THEN 'Silver Tier'
    ELSE 'Standard'
  END AS customer_tier
FROM orders;`,
    outputNote: 'Can also be used inside aggregates: SUM(CASE WHEN status="paid" THEN 1 ELSE 0 END).'
  },
  {
    id: 'mysql-exists-in',
    keyword: 'EXISTS & IN',
    category: 'clauses',
    categoryLabel: 'Query Clauses',
    engine: 'sql',
    engineLabel: 'MySQL / Standard SQL',
    engineBadgeColor: '#0284c7',
    description: 'EXISTS tests whether a correlated subquery returns at least one row. IN tests if an operand matches any value in a list or subquery.',
    syntax: 'WHERE EXISTS (SELECT 1 FROM ...) | WHERE column IN (val1, val2, ...);',
    example: `-- Efficient semi-join: find customers who placed an order in 2026
SELECT c.id, c.company_name
FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o 
  WHERE o.customer_id = c.id 
    AND o.created_at >= '2026-01-01'
);`,
    outputNote: 'EXISTS short-circuits as soon as the first matching tuple is found.'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 1. MYSQL: UTILITY & INFORMATION
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mysql-show-describe',
    keyword: 'SHOW & DESCRIBE (DESC)',
    category: 'utility',
    categoryLabel: 'Utility & Diagnostics',
    engine: 'sql',
    engineLabel: 'MySQL Specific',
    engineBadgeColor: '#0284c7',
    description: 'SHOW inspects metadata, runtime engines, status counters, and schemas. DESCRIBE displays table column definitions, types, nullability, and keys.',
    syntax: 'SHOW [TABLES|DATABASES|STATUS|VARIABLES|PROCESSLIST]; \nDESCRIBE table_name;',
    example: `-- Inspect table schema and active server threads
DESCRIBE users;
SHOW PROCESSLIST;
SHOW ENGINE INNODB STATUS;`,
    outputNote: 'SHOW ENGINE INNODB STATUS reveals deadlocks, transaction list, and buffer pool hit rate.'
  },
  {
    id: 'mysql-explain',
    keyword: 'EXPLAIN',
    category: 'utility',
    categoryLabel: 'Utility & Diagnostics',
    engine: 'sql',
    engineLabel: 'MySQL / PostgreSQL',
    engineBadgeColor: '#0284c7',
    description: 'Displays the execution plan computed by the Cost-Based Optimizer, detailing index usage, join order, rows examined, and temporary table allocations.',
    syntax: 'EXPLAIN [FORMAT=JSON | ANALYZE] SELECT ...;',
    example: `-- Analyze query execution tree with actual runtime metrics
EXPLAIN ANALYZE 
SELECT u.username, COUNT(o.id)
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2026-01-01'
GROUP BY u.id;`,
    outputNote: 'Look for "type: ALL" (full table scan) vs "type: ref/range" (index scan).'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. POSTGRESQL: ADVANCED & POSTGRES-SPECIFIC KEYWORDS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'pg-returning',
    keyword: 'RETURNING',
    category: 'pg_advanced',
    categoryLabel: 'PostgreSQL Specific',
    engine: 'postgres',
    engineLabel: 'PostgreSQL Advanced',
    engineBadgeColor: '#336791',
    description: 'Returns computed values, auto-generated sequence IDs, or modified columns directly from INSERT, UPDATE, or DELETE statements without a secondary SELECT query.',
    syntax: 'INSERT INTO ... VALUES (...) RETURNING column1, column2, ...;',
    example: `-- Create customer and obtain the serial ID and generated UUID immediately
INSERT INTO customers (name, email, plan)
VALUES ('Acme Corp', 'contact@acme.com', 'enterprise')
RETURNING id, uuid, created_at;`,
    outputNote: 'Saves an entire roundtrip network latency packet to the database server.'
  },
  {
    id: 'pg-with-cte',
    keyword: 'WITH (Common Table Expressions & RECURSIVE)',
    category: 'pg_advanced',
    categoryLabel: 'PostgreSQL Specific',
    engine: 'postgres',
    engineLabel: 'PostgreSQL / Modern SQL',
    engineBadgeColor: '#336791',
    description: 'Defines temporary auxiliary named result sets (CTEs) for modular query architecture, writable CTEs, and recursive hierarchy traversals.',
    syntax: 'WITH [RECURSIVE] cte_name AS (SELECT ...) SELECT * FROM cte_name;',
    example: `-- Recursively traverse employee management organizational tree
WITH RECURSIVE org_chart AS (
  SELECT id, name, manager_id, 1 AS depth
  FROM employees
  WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, oc.depth + 1
  FROM employees e
  INNER JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT depth, LPAD(name, LENGTH(name) + (depth * 2), ' ') AS employee_hierarchy
FROM org_chart
ORDER BY depth, id;`,
    outputNote: 'PostgreSQL 12+ supports `AS MATERIALIZED` or `AS NOT MATERIALIZED` to guide optimizer inlining.'
  },
  {
    id: 'pg-ilike',
    keyword: 'ILIKE & SIMILAR TO',
    category: 'pg_advanced',
    categoryLabel: 'PostgreSQL Specific',
    engine: 'postgres',
    engineLabel: 'PostgreSQL Specific',
    engineBadgeColor: '#336791',
    description: 'ILIKE performs case-insensitive pattern matching. SIMILAR TO matches SQL standard regular expressions.',
    syntax: 'column ILIKE pattern | column SIMILAR TO regex;',
    example: `-- Case-insensitive match on search keywords
SELECT id, title, author
FROM books
WHERE title ILIKE '%postgresql%'
  AND isbn SIMILAR TO '%(978|979)-[0-9]{10}%';`,
    outputNote: 'Can be accelerated with pg_trgm (trigram) GIN/GiST indexes in PostgreSQL.'
  },
  {
    id: 'pg-window-over-partition',
    keyword: 'WINDOW, OVER, PARTITION BY',
    category: 'pg_advanced',
    categoryLabel: 'PostgreSQL Specific',
    engine: 'postgres',
    engineLabel: 'PostgreSQL / SQL Standard',
    engineBadgeColor: '#336791',
    description: 'Executes analytical calculations across a set of table rows related to the current row without collapsing rows like GROUP BY does.',
    syntax: 'SELECT func() OVER (PARTITION BY col ORDER BY col [frame]) FROM ...;',
    example: `-- Calculate running total and department salary rank
SELECT 
  employee_id, department, salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank,
  SUM(salary) OVER (PARTITION BY department ORDER BY hire_date) as dept_running_total
FROM employees;`,
    outputNote: 'Supports explicit WINDOW clauses: `WINDOW w AS (PARTITION BY department ORDER BY salary DESC)`.'
  },
  {
    id: 'pg-filter',
    keyword: 'FILTER (WHERE ...)',
    category: 'pg_advanced',
    categoryLabel: 'PostgreSQL Specific',
    engine: 'postgres',
    engineLabel: 'PostgreSQL Standard',
    engineBadgeColor: '#336791',
    description: 'Selective aggregation clause that restricts rows processed by an aggregate function to those that satisfy the predicate.',
    syntax: 'aggregate_func(col) FILTER (WHERE condition)',
    example: `-- Pivot status counts into single row without messy CASE statements
SELECT 
  tenant_id,
  COUNT(*) AS total_orders,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed_count,
  COUNT(*) FILTER (WHERE status = 'refunded') AS refunded_count,
  AVG(amount) FILTER (WHERE status = 'completed') AS avg_completed_value
FROM orders
GROUP BY tenant_id;`,
    outputNote: 'Clean standard SQL syntax; far more readable and faster than SUM(CASE ...).'
  },
  {
    id: 'pg-lateral',
    keyword: 'LATERAL',
    category: 'pg_advanced',
    categoryLabel: 'PostgreSQL Specific',
    engine: 'postgres',
    engineLabel: 'PostgreSQL Advanced',
    engineBadgeColor: '#336791',
    description: 'Allows subqueries in the FROM clause to reference columns provided by preceding items in the FROM list (correlated inline queries).',
    syntax: 'FROM table_a a, LATERAL (SELECT ... WHERE ref = a.id) b',
    example: `-- Top 3 most recent comments for every blog post
SELECT p.id, p.title, c.comment_id, c.author, c.created_at
FROM posts p
CROSS JOIN LATERAL (
  SELECT comment_id, author, created_at
  FROM comments
  WHERE post_id = p.id
  ORDER BY created_at DESC
  LIMIT 3
) c;`,
    outputNote: 'Acts like a foreach loop over each outer row, ideal for top-N-per-category queries.'
  },
  {
    id: 'pg-coalesce-nullif-cast',
    keyword: 'COALESCE, NULLIF, CAST (::)',
    category: 'pg_advanced',
    categoryLabel: 'PostgreSQL Specific',
    engine: 'postgres',
    engineLabel: 'PostgreSQL / SQL Standard',
    engineBadgeColor: '#336791',
    description: 'COALESCE returns the first non-null argument. NULLIF returns NULL if both arguments are equal. CAST (or `::`) converts data types.',
    syntax: 'COALESCE(val1, val2, fallback) | NULLIF(a, b) | expression::type',
    example: `-- Guard against division by zero and provide fallback labels
SELECT 
  account_id,
  COALESCE(display_name, company_name, 'Unknown Entity') AS customer_name,
  total_revenue / NULLIF(total_transactions, 0) AS avg_ticket_size,
  '2026-10-26'::date AS report_date,
  metadata->>'plan_code'::text AS plan
FROM billing_accounts;`,
    outputNote: 'PostgreSQL double-colon `::` is a convenient shorthand for `CAST(expr AS type)`.'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. POSTGRESQL: ADMINISTRATIVE & UTILITY COMMANDS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'pg-vacuum',
    keyword: 'VACUUM',
    category: 'pg_admin',
    categoryLabel: 'PostgreSQL Administration',
    engine: 'postgres',
    engineLabel: 'PostgreSQL Admin',
    engineBadgeColor: '#336791',
    description: 'Reclaims storage occupied by dead tuple versions created by UPDATEs and DELETEs in Heap pages, and prevents transaction ID wraparound (wraparound vacuum).',
    syntax: 'VACUUM [ ( { FULL | FREEZE | VERBOSE | ANALYZE } [, ...] ) ] [ table_name ];',
    example: `-- Reclaim dead tuple space and refresh table statistics
VACUUM (VERBOSE, ANALYZE) customer_orders;`,
    outputNote: 'Regular VACUUM does not lock the table against concurrent reads or writes.'
  },
  {
    id: 'pg-analyze-reindex',
    keyword: 'ANALYZE & REINDEX',
    category: 'pg_admin',
    categoryLabel: 'PostgreSQL Administration',
    engine: 'postgres',
    engineLabel: 'PostgreSQL Admin',
    engineBadgeColor: '#336791',
    description: 'ANALYZE collects distribution statistics about table contents for the Cost-Based Optimizer (CBO). REINDEX rebuilds bloated or corrupted indexes.',
    syntax: 'ANALYZE [table_name]; \nREINDEX [TABLE|INDEX] CONCURRENTLY name;',
    example: `-- Update query optimizer statistics and rebuild bloated B-Tree
ANALYZE users;
REINDEX TABLE CONCURRENTLY user_sessions;`,
    outputNote: 'CONCURRENTLY allows normal queries to continue without taking an exclusive write lock.'
  },
  {
    id: 'pg-cluster-copy',
    keyword: 'CLUSTER & COPY',
    category: 'pg_admin',
    categoryLabel: 'PostgreSQL Administration',
    engine: 'postgres',
    engineLabel: 'PostgreSQL Admin',
    engineBadgeColor: '#336791',
    description: 'CLUSTER physically reorders table heap pages based on an index. COPY streams high-speed bulk data between tables and files.',
    syntax: 'CLUSTER table_name USING index_name; \nCOPY table TO/FROM file WITH (...);',
    example: `-- High-performance CSV export and index re-clustering
CLUSTER orders USING idx_orders_created_at;

COPY (SELECT * FROM orders WHERE created_at >= '2026-01-01') 
TO '/var/data/orders_2026.csv' 
WITH (FORMAT csv, HEADER true, DELIMITER ',');`,
    outputNote: 'COPY bypasses normal INSERT parse overhead; optimal for multi-gigabyte ETL loading.'
  },
  {
    id: 'pg-listen-notify',
    keyword: 'LISTEN & NOTIFY',
    category: 'pg_admin',
    categoryLabel: 'PostgreSQL Administration',
    engine: 'postgres',
    engineLabel: 'PostgreSQL Admin',
    engineBadgeColor: '#336791',
    description: 'Native asynchronous publish/subscribe inter-process communication mechanism built directly into PostgreSQL.',
    syntax: 'LISTEN channel_name; \nNOTIFY channel_name, payload;',
    example: `-- Receiver process:
LISTEN order_dispatched;

-- Trigger or worker sender process:
NOTIFY order_dispatched, '{"order_id": 1042, "status": "shipped"}';`,
    outputNote: 'Enables real-time websocket pushes without polling databases repeatedly.'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. MONGODB: A. CORE MONGODB FUNCTIONS (COLLECTION METHODS)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mongo-find-read-methods',
    keyword: 'find(), findOne(), distinct(), countDocuments()',
    category: 'mongo_methods',
    categoryLabel: 'MongoDB Collection Methods (Query)',
    engine: 'mongodb',
    engineLabel: 'MongoDB Collection Methods',
    engineBadgeColor: '#059669',
    description: 'Core read methods called on collections. find() returns a cursor; findOne() returns a single document; distinct() finds unique field values; countDocuments() counts matches.',
    syntax: 'db.collection.find(query, projection)\ndb.collection.findOne(query)\ndb.collection.distinct(field, query)\ndb.collection.countDocuments(query)',
    example: `-- Read queries with projection, distinct field extraction, and exact count
// Find active users with projected fields (excluding _id)
db.users.find(
  { status: "active", age: { $gte: 21 } },
  { username: 1, email: 1, _id: 0 }
);

// Find single user document by email
db.users.findOne({ email: "alex@example.com" });

// Extract distinct product categories currently in stock
db.products.distinct("category", { inStock: true });

// Count high-value orders completed in 2026
db.orders.countDocuments({ status: "completed", amount: { $gte: 1000 } });`,
    outputNote: 'find() returns a cursor that does not load all documents into RAM at once.'
  },
  {
    id: 'mongo-estimated-document-count',
    keyword: 'estimatedDocumentCount()',
    category: 'mongo_methods',
    categoryLabel: 'MongoDB Collection Methods (Query)',
    engine: 'mongodb',
    engineLabel: 'MongoDB Collection Methods',
    engineBadgeColor: '#059669',
    description: 'Returns a fast, approximate count of all documents in a collection by reading collection metadata rather than scanning documents or indexes.',
    syntax: 'db.collection.estimatedDocumentCount([options])',
    example: `-- Fast O(1) collection size estimate for monitoring dashboards
const totalLogs = db.audit_logs.estimatedDocumentCount();
print("Approximate total audit logs:", totalLogs);`,
    outputNote: 'Runs in O(1) constant time without scanning B-Trees. Does not take query filter arguments.'
  },
  {
    id: 'mongo-insert-methods',
    keyword: 'insertOne() & insertMany()',
    category: 'mongo_methods',
    categoryLabel: 'MongoDB Collection Methods (Create)',
    engine: 'mongodb',
    engineLabel: 'MongoDB Collection Methods',
    engineBadgeColor: '#059669',
    description: 'Inserts single or multiple BSON documents into a collection. insertMany() supports { ordered: false } for high-throughput batching.',
    syntax: 'db.collection.insertOne(doc, options)\ndb.collection.insertMany([doc1, doc2, ...], options)',
    example: `-- Single and batch document insertion
// Insert single product with embedded sub-documents
db.products.insertOne({
  sku: "KB-RGB-PRO",
  title: "Mechanical Wireless Keyboard",
  price: 149.99,
  specs: { switches: "Cherry MX Brown", batteryHours: 72 },
  tags: ["peripherals", "wireless", "gaming"],
  createdAt: new Date()
});

// Bulk insert telemetry records with unordered parallel execution
db.telemetry.insertMany([
  { deviceId: "node-01", tempC: 24.5, recordedAt: new Date() },
  { deviceId: "node-02", tempC: 28.1, recordedAt: new Date() }
], { ordered: false });`,
    outputNote: 'Unordered insertMany continues processing subsequent documents even if one fails a unique constraint.'
  },
  {
    id: 'mongo-update-methods',
    keyword: 'updateOne(), updateMany(), replaceOne()',
    category: 'mongo_methods',
    categoryLabel: 'MongoDB Collection Methods (Update)',
    engine: 'mongodb',
    engineLabel: 'MongoDB Collection Methods',
    engineBadgeColor: '#059669',
    description: 'updateOne modifies the first matching document; updateMany modifies all matching documents; replaceOne replaces the entire document content while preserving the _id.',
    syntax: 'db.collection.updateOne(filter, update, options)\ndb.collection.updateMany(filter, update, options)\ndb.collection.replaceOne(filter, replacement, options)',
    example: `-- Target updates vs full document replacement
// Update single user profile with timestamp
db.users.updateOne(
  { _id: ObjectId("654a1b2c3d4e5f6a7b8c9d0e") },
  { 
    $set: { "profile.verified": true },
    $currentDate: { lastUpdated: true }
  }
);

// Apply a 15% discount to all clearance inventory
db.products.updateMany(
  { category: "clearance" },
  { 
    $mul: { price: 0.85 },
    $set: { discounted: true }
  }
);

// Completely replace a document structure
db.user_configs.replaceOne(
  { userId: "u_42" },
  { userId: "u_42", theme: "solarized-dark", fontSize: 14, v: 2 }
);`,
    outputNote: 'WiredTiger storage engine performs document-level concurrency locks during write operations.'
  },
  {
    id: 'mongo-find-and-modify-methods',
    keyword: 'findOneAndUpdate() & findOneAndReplace()',
    category: 'mongo_methods',
    categoryLabel: 'MongoDB Collection Methods (Atomic)',
    engine: 'mongodb',
    engineLabel: 'MongoDB Collection Methods',
    engineBadgeColor: '#059669',
    description: 'Atomically finds a document, updates/replaces it, and returns either the original (pre-modification) or the updated (post-modification) document in a single atomic step.',
    syntax: 'db.collection.findOneAndUpdate(filter, update, { returnDocument: "after"|"before", upsert: true })\ndb.collection.findOneAndReplace(filter, replacement, options)',
    example: `-- Atomic sequence counter generator (avoids race conditions)
const counterDoc = db.counters.findOneAndUpdate(
  { _id: "invoice_seq" },
  { $inc: { seqValue: 1 } },
  { returnDocument: "after", upsert: true }
);

print("Generated Invoice Number:", counterDoc.seqValue);`,
    outputNote: 'Essential for atomic ticket reservations, auto-increment sequences, and state-machine transitions.'
  },
  {
    id: 'mongo-delete-methods',
    keyword: 'deleteOne(), deleteMany(), findOneAndDelete()',
    category: 'mongo_methods',
    categoryLabel: 'MongoDB Collection Methods (Delete)',
    engine: 'mongodb',
    engineLabel: 'MongoDB Collection Methods',
    engineBadgeColor: '#059669',
    description: 'deleteOne removes one matching document. deleteMany removes all matches. findOneAndDelete atomically finds, deletes, and returns the removed document.',
    syntax: 'db.collection.deleteOne(filter)\ndb.collection.deleteMany(filter)\ndb.collection.findOneAndDelete(filter, options)',
    example: `-- Delete expired sessions or pop high-priority job from queue
// Remove single user session
db.sessions.deleteOne({ sessionToken: "expired_token_hash" });

// Purge all guest carts older than 30 days
db.carts.deleteMany({
  userType: "guest",
  updatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
});

// Pop and return next pending task atomically
const job = db.task_queue.findOneAndDelete(
  { status: "queued" },
  { sort: { priority: -1, createdAt: 1 } }
);`,
    outputNote: 'findOneAndDelete provides FIFO queue popping semantics with zero race conditions.'
  },
  {
    id: 'mongo-bulkwrite-watch',
    keyword: 'bulkWrite() & watch()',
    category: 'mongo_methods',
    categoryLabel: 'MongoDB Advanced Methods',
    engine: 'mongodb',
    engineLabel: 'MongoDB Advanced',
    engineBadgeColor: '#059669',
    description: 'bulkWrite performs multiple heterogenous write operations (insert, update, delete) in a single round-trip. watch() opens a Change Stream to stream real-time database mutations.',
    syntax: 'db.collection.bulkWrite([ operations ], options)\ndb.collection.watch([ pipeline ], options)',
    example: `-- Mixed bulk operations and Real-time Change Streams
// Heterogenous bulk write
db.orders.bulkWrite([
  { insertOne: { document: { orderId: 901, total: 45.00 } } },
  { updateOne: { filter: { orderId: 899 }, update: { $set: { status: "shipped" } } } },
  { deleteOne: { filter: { orderId: 750 } } }
], { ordered: false });

// Watch for live inserts/updates via MongoDB Change Streams
const changeStream = db.orders.watch([
  { $match: { "operationType": { $in: ["insert", "update"] } } }
]);
changeStream.on("change", (event) => {
  console.log("Real-time DB Mutation:", event.documentKey, event.operationType);
});`,
    outputNote: 'Change Streams require a Replica Set or Sharded Cluster backed by the WiredTiger oplog.'
  },
  {
    id: 'mongo-index-management-methods',
    keyword: 'createIndex(), createIndexes(), dropIndex(), getIndexes()',
    category: 'mongo_methods',
    categoryLabel: 'MongoDB Index Management',
    engine: 'mongodb',
    engineLabel: 'MongoDB Index Management',
    engineBadgeColor: '#059669',
    description: 'Methods for building, inspecting, and dropping B-Tree indexes on single, compound, multikey, TTL, and text fields.',
    syntax: 'db.collection.createIndex(keys, options)\ndb.collection.dropIndex(name)\ndb.collection.getIndexes()',
    example: `-- Build compound, unique, and TTL self-expiring indexes
// Compound index with ascending customerId and descending date:
db.orders.createIndex(
  { customerId: 1, orderDate: -1 },
  { name: "idx_cust_date" }
);

// Unique index on email:
db.users.createIndex(
  { email: 1 }, 
  { unique: true, name: "idx_unique_email" }
);

// TTL index to automatically purge temp tokens after 24 hours:
db.auth_tokens.createIndex(
  { createdAt: 1 }, 
  { expireAfterSeconds: 86400 }
);

// Inspect all existing indexes:
db.orders.getIndexes();`,
    outputNote: 'MongoDB builds indexes in the background without blocking concurrent reads or writes.'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. MONGODB: B. CURSOR METHODS (CHAINED TO find())
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mongo-cursor-sort-limit-skip',
    keyword: 'sort(), limit(), skip()',
    category: 'mongo_cursor',
    categoryLabel: 'MongoDB Cursor Methods',
    engine: 'mongodb',
    engineLabel: 'MongoDB Cursor Methods',
    engineBadgeColor: '#059669',
    description: 'Chained to find() queries to control result ordering, batch limit size, and offset pagination.',
    syntax: 'db.collection.find(...).sort({ field: 1|-1 }).skip(n).limit(n)',
    example: `-- Paginate top-rated electronics on page 3 (skipping first 40)
db.products.find({ category: "electronics" })
  .sort({ rating: -1, price: 1 })
  .skip(40)
  .limit(20);`,
    outputNote: 'Always ensure sort fields are covered by an index to avoid in-memory 32MB sort limit errors.'
  },
  {
    id: 'mongo-cursor-toarray-foreach-map',
    keyword: 'toArray(), forEach(), map()',
    category: 'mongo_cursor',
    categoryLabel: 'MongoDB Cursor Methods',
    engine: 'mongodb',
    engineLabel: 'MongoDB Cursor Methods',
    engineBadgeColor: '#059669',
    description: 'toArray loads all cursor documents into a JavaScript array. forEach iterates each doc with a callback. map transforms each doc into a new array.',
    syntax: 'cursor.toArray() \ncursor.forEach(fn) \ncursor.map(fn)',
    example: `-- Extract data using cursor evaluation helpers
// Extract array of email addresses from cursor
const emailList = db.users.find({ status: "active" })
  .map(user => user.email);

// Iterate through pending jobs without loading entire table into RAM
db.jobs.find({ status: "pending" })
  .forEach(job => {
    print("Dispatching job ID:", job._id);
  });`,
    outputNote: 'toArray() fetches all matching documents into Node.js/client memory; use with caution on large sets.'
  },
  {
    id: 'mongo-cursor-hint-explain-collation',
    keyword: 'hint(), explain(), collation()',
    category: 'mongo_cursor',
    categoryLabel: 'MongoDB Cursor Methods',
    engine: 'mongodb',
    engineLabel: 'MongoDB Cursor Methods',
    engineBadgeColor: '#059669',
    description: 'hint() forces MongoDB optimizer to use a specific index. explain() outputs the execution plan and stages. collation() specifies language-specific sorting rules.',
    syntax: 'db.col.find(...).hint("index_name").explain("executionStats")\ndb.col.find(...).collation({ locale: "fr", strength: 1 })',
    example: `-- Force index usage and inspect execution metrics
// Force specific compound index and get execution details:
db.orders.find({ customerId: 402, status: "shipped" })
  .hint("idx_cust_date")
  .explain("executionStats");

// Case-insensitive accent-neutral collation search:
db.customers.find({ lastName: "côte" })
  .collation({ locale: "fr", strength: 1 });`,
    outputNote: 'explain("executionStats") reveals keysExamined, docsExamined, and IXSCAN vs COLLSCAN.'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. MONGODB: C. QUERY OPERATORS (COMPARISON, LOGICAL, ARRAY & ELEMENT)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mongo-comparison-selectors',
    keyword: '$eq, $gt, $gte, $lt, $lte, $ne, $in, $nin',
    category: 'mongo_query',
    categoryLabel: 'MongoDB Query Selectors',
    engine: 'mongodb',
    engineLabel: 'MongoDB (MQL)',
    engineBadgeColor: '#059669',
    description: 'Comparison operators for matching field values against primitives, ranges, or sets.',
    syntax: '{ field: { $operator: value } }',
    example: `-- Find active products priced between $50 and $250 in selected categories
db.products.find({
  status: { $eq: "active" },
  price: { $gte: 50, $lte: 250 },
  category: { $in: ["electronics", "audio", "peripherals"] },
  sku: { $nin: ["DISCONTINUED_A", "DISCONTINUED_B"] }
});`,
    outputNote: 'B-Tree single or compound indexes can be utilized to satisfy comparison ranges.'
  },
  {
    id: 'mongo-logical-selectors',
    keyword: '$and, $or, $not, $nor',
    category: 'mongo_query',
    categoryLabel: 'MongoDB Query Selectors',
    engine: 'mongodb',
    engineLabel: 'MongoDB (MQL)',
    engineBadgeColor: '#059669',
    description: 'Combines multiple query conditions with boolean logic.',
    syntax: '{ $or: [ { cond1 }, { cond2 } ] }',
    example: `-- Find customers who either have low loyalty points or are flagged for review
db.customers.find({
  $or: [
    { points: { $lt: 100 } },
    { reviewFlag: true }
  ],
  $nor: [
    { accountType: "test" }
  ]
});`,
    outputNote: '$or can evaluate separate indexes for each branch clause.'
  },
  {
    id: 'mongo-exists-type-expr',
    keyword: '$exists, $type, $expr, $regex, $text, $mod',
    category: 'mongo_element',
    categoryLabel: 'MongoDB Element & Eval',
    engine: 'mongodb',
    engineLabel: 'MongoDB (MQL)',
    engineBadgeColor: '#059669',
    description: '$exists checks field presence. $type tests BSON type. $expr compares fields within the same doc. $regex matches patterns. $text queries text index. $mod performs modulo.',
    syntax: '{ field: { $exists: boolean } } | { $expr: { $gt: ["$fieldA", "$fieldB"] } }',
    example: `-- Department expense check comparing two fields in the same document
db.departments.find({
  taxIdentifier: { $exists: true },
  phone: { $type: "string" },
  $expr: {
    $gt: ["$actualExpenses", "$allocatedBudget"]
  },
  email: { $regex: /@acme\.com$/i }
});`,
    outputNote: '$expr allows column-to-column comparisons similar to SQL `WHERE colA > colB`.'
  },
  {
    id: 'mongo-array-operators',
    keyword: '$all, $elemMatch, $size',
    category: 'mongo_element',
    categoryLabel: 'MongoDB Array Operators',
    engine: 'mongodb',
    engineLabel: 'MongoDB (MQL)',
    engineBadgeColor: '#059669',
    description: '$all checks if an array contains all specified elements. $elemMatch matches documents if an array element satisfies multiple criteria. $size matches exact array length.',
    syntax: '{ tags: { $all: ["a", "b"] } } | { array: { $elemMatch: { ... } } }',
    example: `-- Find students scoring over 85 in Math and having exactly 3 enrolled courses
db.students.find({
  grades: {
    $elemMatch: { subject: "Math", score: { $gte: 85 } }
  },
  courses: { $size: 3 },
  skills: { $all: ["JavaScript", "Docker"] }
});`,
    outputNote: 'Without $elemMatch, query could match subject="Math" on item 1 and score>=85 on item 2.'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. MONGODB: C. UPDATE OPERATORS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mongo-set-unset-inc-mul',
    keyword: '$set, $unset, $inc, $mul, $rename, $min, $max',
    category: 'mongo_update',
    categoryLabel: 'MongoDB Update Operators',
    engine: 'mongodb',
    engineLabel: 'MongoDB Update Operators',
    engineBadgeColor: '#059669',
    description: 'Modifies specific fields without replacing the entire document. $set assigns, $unset removes, $inc increments, $mul multiplies, $rename renames, $min/$max bounds values.',
    syntax: '{ $set: { f: v }, $inc: { count: 1 }, $unset: { obsolete: "" }, $max: { high: 100 } }',
    example: `-- Atomically increment views, set verified flag, and update high score
db.user_profiles.updateOne(
  { _id: ObjectId("654a1b2c3d4e5f6a7b8c9d0e") },
  {
    $set: { lastLogin: new Date(), "status.online": true },
    $inc: { loginCount: 1, rewardPoints: 25 },
    $unset: { temporaryVerificationToken: "" },
    $max: { highestScore: 9800 }
  }
);`,
    outputNote: 'Document updates in WiredTiger engine are atomic on a per-document basis.'
  },
  {
    id: 'mongo-array-updates',
    keyword: '$push, $pull, $addToSet, $pop',
    category: 'mongo_update',
    categoryLabel: 'MongoDB Update Operators',
    engine: 'mongodb',
    engineLabel: 'MongoDB Update Operators',
    engineBadgeColor: '#059669',
    description: 'Array modification operators: $push appends, $pull removes matching elements, $addToSet appends only if not already present (set uniqueness), and $pop removes first or last items.',
    syntax: '{ $push: { arr: val } } | { $addToSet: { arr: unique_val } } | { $pull: { arr: cond } }',
    example: `-- Add a new comment and unique tag to blog post
db.posts.updateOne(
  { _id: 1042 },
  {
    $push: {
      comments: {
        author: "DevUser",
        text: "Great indexing breakdown!",
        postedAt: new Date()
      }
    },
    $addToSet: { tags: "performance" },
    $pull: { flaggedReasons: "spam" }
  }
);`,
    outputNote: 'Combine $push with `$slice` or `$sort` to maintain fixed-size capped sub-arrays.'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. MONGODB: D. AGGREGATION PIPELINE STAGES (USED IN aggregate())
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mongo-match-group-project',
    keyword: '$match, $group, $project',
    category: 'mongo_agg',
    categoryLabel: 'MongoDB Aggregation Pipeline',
    engine: 'mongodb',
    engineLabel: 'MongoDB Pipeline',
    engineBadgeColor: '#059669',
    description: 'Core aggregation stages: $match filters documents (SQL WHERE), $group groups by specified _id and computes aggregates (SQL GROUP BY), $project reshapes fields.',
    syntax: 'db.col.aggregate([ { $match: ... }, { $group: ... }, { $project: ... } ])',
    example: `-- Compute monthly sales and average order value per country
db.orders.aggregate([
  { 
    $match: { 
      status: "completed", 
      orderDate: { $gte: ISODate("2026-01-01") } 
    } 
  },
  {
    $group: {
      _id: "$shippingAddress.country",
      totalRevenue: { $sum: "$totalAmount" },
      averageOrder: { $avg: "$totalAmount" },
      orderCount: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      country: "$_id",
      totalRevenue: { $round: ["$totalRevenue", 2] },
      averageOrder: { $round: ["$averageOrder", 2] },
      orderCount: 1
    }
  }
]);`,
    outputNote: 'Place $match at the very beginning of the pipeline to leverage indexes.'
  },
  {
    id: 'mongo-unwind-lookup',
    keyword: '$unwind & $lookup',
    category: 'mongo_agg',
    categoryLabel: 'MongoDB Aggregation Pipeline',
    engine: 'mongodb',
    engineLabel: 'MongoDB Pipeline',
    engineBadgeColor: '#059669',
    description: '$unwind deconstructs an array field from input documents to output a document for each element. $lookup performs a left outer join to an unsharded collection (SQL LEFT JOIN).',
    syntax: '{ $unwind: "$arrayField" } \n{ $lookup: { from: "col", localField: "a", foreignField: "b", as: "c" } }',
    example: `-- Join orders to customers collection and unwind line items
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  { $unwind: "$items" },
  {
    $project: {
      orderId: "$_id",
      customerName: "$customer.name",
      customerEmail: "$customer.email",
      itemSku: "$items.sku",
      quantity: "$items.qty"
    }
  }
]);`,
    outputNote: 'Analogous to SQL JOIN, but outputs joined documents as embedded array.'
  },
  {
    id: 'mongo-sort-limit-skip-addfields-out',
    keyword: '$sort, $limit, $skip, $addFields ($set), $out',
    category: 'mongo_agg',
    categoryLabel: 'MongoDB Aggregation Pipeline',
    engine: 'mongodb',
    engineLabel: 'MongoDB Pipeline',
    engineBadgeColor: '#059669',
    description: '$sort orders documents. $skip & $limit paginate. $addFields (or $set) adds computed fields. $out writes the aggregation results into an output collection.',
    syntax: '{ $sort: { field: -1 } }, { $addFields: { ... } }, { $out: "target_collection" }',
    example: `-- Calculate profit margin and materialize top 100 products to summary collection
db.products.aggregate([
  {
    $addFields: {
      profitMargin: { 
        $divide: [{ $subtract: ["$sellingPrice", "$costPrice"] }, "$sellingPrice"] 
      }
    }
  },
  { $sort: { profitMargin: -1 } },
  { $limit: 100 },
  { $out: "top_margin_products_cache" }
]);`,
    outputNote: '$out creates or atomically replaces the target collection.'
  }
];
