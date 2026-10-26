# ⚡ Learn by Simulation — Interactive Systems, Docker, Database & Networking Simulator

> An interactive, visual systems-engineering platform that bridges computer science theory—hardware architectures, Linux kernel internals, container runtimes, database storage engines, distributed sharding, and networking stacks—with live, interactive node-based simulators and hands-on learning labs.

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![XYFlow](https://img.shields.io/badge/@xyflow/react-12.12-ff0072?logo=diagram-next&logoColor=white)](https://reactflow.dev/)
[![Lucide](https://img.shields.io/badge/Icons-Lucide--React-f59e0b)](https://lucide.dev/)
[![Oxlint](https://img.shields.io/badge/Linter-Oxlint-ff4f8b)](https://oxc.rs/)

---

## 🌟 Overview & Key Features

**Learn by Simulation** is built for engineers, system architects, and students who want to understand *how computers, operating systems, databases, and containers actually work under the hood*. Instead of static text or passive videos, every component is rendered as an interactive, stateful simulation.

### 1. 🐳 DockerCore — OS & Container Engine Simulator
* **Motherboard to Container Visualization**: Inspect how CPU registers, RAM banks, and OS kernel namespaces (`pid`, `net`, `mnt`, `ipc`, `uts`, `user`) work with `cgroups` to enforce resource boundaries.
* **Multi-Layer Runtime Hierarchy**: Step through container execution:
  $$\text{CLI Client} \longrightarrow \text{dockerd} \longrightarrow \text{containerd} \longrightarrow \text{containerd-shim} \longrightarrow \text{runc} \longrightarrow \text{Linux Kernel}$$
* **Storage Drivers (Overlay2)**: Visualize `lowerdir` (read-only image layers), `upperdir` (writable container layer), and `merged` mount points with Copy-on-Write (CoW) semantics.
* **Interactive Terminal & Cheat Sheet**: Run Docker commands with live terminal feedback, parameter builders, and architecture spotlights.

---

### 2. 🗄️ DataCore — Database Engines & Distributed Sharding
Simulate relational and NoSQL storage engines with engine-specific runtime perspectives:
* **Engine Switcher**:
  * 🐬 **MySQL 8.x (InnoDB)**: Clustered B+Tree tables, Redo/Undo logs, Leftmost prefix index rule, Next-Key locking.
  * 🐘 **PostgreSQL 16.x (Heap & MVCC)**: Unordered 8KB Heap page frames, `xmin`/`xmax` tuple visibility, autovacuum, GIN/BRIN/pgvector.
  * 🍃 **MongoDB 7.x (WiredTiger)**: Document-level lock-free cache, ESR (Equality, Sort, Range) rule, Snappy-compressed B-Trees.

#### 🔄 Interactive XYFlow Architectural Data Flows:
1. **Engine & Query Pipeline**: AST parsing, logical plan, cost-based optimizer (CBO), execution engine, buffer pool LRU cache, and WAL disk flushing.
2. **Chirp App Sharding & Routing Flow**:
   * Complete 10-node data flow based on the *Chirp* scaling narrative.
   * Client Microservices $\to$ Redis Cache $\to$ Routing Proxy (`mongos`) $\to$ Deterministic Hash Engine $\to$ Shards 0–3.
   * **Celebrity Hotspot Shield**: Dedicated Shard 4 for Lena (40M followers) + Redis sub-ms RAM cache + Write Key Salting (`500-1` to `500-10`) to eliminate single-shard lock contention.
3. **Consistent Hashing & Virtual Nodes Ring**:
   * Circular 360° Hash Ring ($0$ to $2^{32}-1$) with clockwise key traversal.
   * Node addition showing $1/N$ ($20\%$) migration versus the devastating $80\%$ naive modulo resharding disaster.
   * Virtual nodes (`vnodes`) demonstrating failover load balancing across surviving nodes.
4. **B+Tree Clustered Index Traversal**: Binary search traversal from Root node $\to$ Internal index pages $\to$ Leaf data row pages.

#### 📚 15-Chapter Master Curriculum & Interactive Labs:
* Fully structured curriculum from `doc/database.md`: Normalization (1NF through 5NF), HikariCP pool sizing formula, ESR compound index rules, MVCC, and ACID transaction isolation.
* **Interactive Chirp Sharding Lab (Chapter 12)**:
  * 5 Golden Rules Shard Key Candidate Evaluator (`user_id`, `country`, `signup_year`, `username`).
  * Live Routing & Hotspot Calculator for Chris (41), Leo (18), Martin (99), and Lena (500).
  * 20-User Resharding Matrix visually contrasting Naive Modulo vs Consistent Hashing.
* **Interactive Sharding Q&A Masterclass**: 10 comprehensive interview questions with short TL;DR answers, full architectural analysis, code snippets with copy button, key takeaways, and progress mastery tracking.

---

### 3. 🌐 NetCore — Networking & Distributed Systems
* **Interactive OSI 7-Layer Stack**: Traversal from Physical bitstream $\to$ Data Link $\to$ Network (IP) $\to$ Transport (TCP/UDP) $\to$ Application (HTTP/TLS).
* **TCP Handshake & Teardown**: Interactive SYN $\to$ SYN-ACK $\to$ ACK state machine and 4-way FIN teardown.
* **Reverse Proxies & Load Balancers**: Nginx, HAProxy, and Envoy routing algorithms (Round Robin, Least Connections, IP Hash) based on `doc/Proxy reverse proxy load balancer.md`.
* **DNS Resolution & Subnet Calculators**: Recursive root hints $\to$ TLD $\to$ Authoritative name server, plus interactive CIDR subnet masks.

---

### 4. 💻 OSCore — Operating System & Kernel Internals
* **System Call Dispatch**: User mode (Ring 3) to Kernel mode (Ring 0) transitions via `syscall` / interrupt vectors.
* **Process Scheduler**: Multi-level feedback queue (MLFQ), CFS (Completely Fair Scheduler), and context switching cost.
* **Virtual Memory & MMU**: Page table lookups, TLB cache hits/misses, and page fault handling.

---

## 🚀 Quickstart Guide

### Prerequisites
Make sure you have installed:
* [Node.js](https://nodejs.org/) (Version **18.x**, **20.x**, or newer)
* `npm` (comes with Node.js) or `pnpm` / `yarn`

### 1. Clone & Navigate to Project
```bash
git clone https://github.com/your-username/simulations.git
cd simulations
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
The application will launch with instant Hot Module Replacement (HMR) at:
```
http://localhost:5173/
```

### 4. Build for Production
To generate an optimized production bundle:
```bash
npm run build
```
The output will be placed in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

### 6. Lint the Codebase
Fast linter powered by Oxlint:
```bash
npm run lint
```

---

## 🧭 Application URL Routing

Learn by Simulation supports deep linking via hash-based URLs:

| Route Hash | Module & View |
|---|---|
| `#/` | **Learn by Simulation**: Main portal and interactive domain index |
| `#/docker` | **DockerCore**: Container architecture, commands & lifecycle |
| `#/databases/sql` | **DataCore**: MySQL 8.x InnoDB clustered B+Tree engine |
| `#/databases/postgres` | **DataCore**: PostgreSQL 16.x Heap & MVCC engine |
| `#/databases/mongodb` | **DataCore**: MongoDB 7.x WiredTiger document engine |
| `#/databases/mongodb/flow` | **XYFlow Simulator**: Chirp Sharding & Consistent Hash Ring flows |
| `#/databases/mongodb/tutorial` | **Database Tutorial**: 15 Chapters & Sharding Q&A Masterclass |
| `#/networking` | **NetCore**: OSI layers, TCP handshake, proxy/load balancers |
| `#/os` | **OSCore**: Kernel syscalls, virtual memory, and process scheduler |

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework**: [React 19](https://react.dev/) (`react`, `react-dom`)
* **Build Tool**: [Vite 8](https://vitejs.dev/) with `@vitejs/plugin-react`
* **Flow & Diagramming Engine**: [@xyflow/react](https://reactflow.dev/) (React Flow v12)
* **Iconography**: [Lucide React](https://lucide.dev/)
* **Typography**: Google Fonts (*Outfit* for UI headers, *JetBrains Mono* for code/metrics)
* **Styling**: Vanilla CSS design tokens with sleek dark mode, glassmorphism panels, and GPU-accelerated micro-animations (`src/index.css`)
* **Code Linter**: [Oxlint](https://oxc.rs/)

---

## 📁 Repository Structure

```
simulations/
├── doc/                                # Engineering documentation & cheat sheets
│   ├── database.md                     # Complete database master curriculum (1NF-5NF, MVCC, B+Tree)
│   ├── Docker networking beginner to advanced.md
│   ├── Proxy reverse proxy load balancer.md
│   ├── docker cpu and memory.md
│   └── docker volums.md
├── public/                             # Public static assets & icons
├── src/
│   ├── assets/                         # SVG icons, diagrams, logos
│   ├── components/
│   │   ├── common/                     # Reusable UI widgets (SuspenseLoader, Minimap, Fullscreen)
│   │   ├── database/                   # Database simulation views & components
│   │   │   ├── DatabaseHeader.jsx      # Submenu navigation for SQL, Postgres, MongoDB
│   │   │   ├── DatabaseView.jsx        # Lazy-loaded tab router
│   │   │   ├── DatabaseXYFlowSimulator.jsx # Chirp Sharding & Consistent Hash Ring flows
│   │   │   ├── DatabaseTutorial.jsx    # 15 Chapters curriculum & Chapter 12 Chirp lab
│   │   │   ├── DatabaseShardingQA.jsx  # 10 Transcript-aligned Q&A with mastery tracking
│   │   │   ├── NormalizationExplorer.jsx # 1NF to 5NF visual decomposer
│   │   │   ├── IndexingExplorer.jsx    # B+Tree leftmost prefix and composite index visualizer
│   │   │   ├── ScalingShardingExplorer.jsx # Horizontal vs Vertical sharding explorer
│   │   │   └── TransactionsExplorer.jsx # ACID, WAL redo logs, undo rollback logs
│   │   ├── docker/                     # Docker engine, motherboard, and runtime simulators
│   │   │   ├── DockerXYFlowSimulator.jsx
│   │   │   ├── DockerMotherboardView.jsx
│   │   │   └── DockerTutorial.jsx
│   │   ├── networking/                 # OSI model, TCP 3-way handshake, Proxy simulations
│   │   │   └── NetworkingView.jsx
│   │   ├── os/                         # OS kernel, system calls, virtual memory MMU
│   │   │   └── OSView.jsx
│   │   └── navigation/                 # Top-level Learn by Simulation menu & routing
│   │       ├── MainNavigation.jsx
│   │       └── SimuCoreHubHome.jsx
│   ├── data/
│   │   ├── databaseData.js             # Engine architectures (InnoDB, Heap, WiredTiger)
│   │   ├── databaseTutorialData.js     # 15 Chapters curriculum & DATABASE_SHARDING_TUTORIAL_QA
│   │   └── dockerCommands.js           # Docker commands metadata & hardware impact
│   ├── App.jsx                         # Top-level domain router
│   ├── index.css                       # Modern glassmorphism design tokens & styles
│   └── main.jsx                        # Application root entry point
├── index.html                          # HTML shell with Google Fonts
├── package.json                        # Project metadata & scripts
└── vite.config.js                      # Vite build configuration
```

---

## 💡 Keyboard Shortcuts & Interactive Tips

* **Minimap Fullscreen Mode**: Click the **Fullscreen** button on any XYFlow simulator minimap to expand the graph to full viewport. Press **`Esc`** or click the close button (**`✕`**) to return.
* **Interactive Step Navigation**: Use **`Next Step`** / **`Prev Step`** or the **`Play/Pause`** button in the playback bar to step through live packet routing and database engine execution stages.
* **Clickable Architecture Nodes**: Click on any node in the XYFlow canvas to open an inspection drawer showing its role, hardware metrics, and execution syntax.

---

## 📜 License
This project is open-source and intended for educational study and engineering simulations.
