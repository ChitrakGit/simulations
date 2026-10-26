import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import MainNavigation from './components/navigation/MainNavigation';
import SimuCoreHubHome from './components/navigation/SimuCoreHubHome';
import SuspenseLoader from './components/common/SuspenseLoader';
import ErrorBoundary from './components/common/ErrorBoundary';
import { DOCKER_COMMANDS } from './data/dockerCommands';

// Dynamic lazy-loaded modules for per-user-selection dynamic rendering
const Header = lazy(() => import('./components/Header'));
const CommandList = lazy(() => import('./components/CommandList'));
const CommandDetails = lazy(() => import('./components/CommandDetails'));
const MultiLayerSimulator = lazy(() => import('./components/MultiLayerSimulator'));
const ArchitectureExplorer = lazy(() => import('./components/ArchitectureExplorer'));
const TerminalSandbox = lazy(() => import('./components/TerminalSandbox'));
const ComponentFlowExplorer = lazy(() => import('./components/ComponentFlowExplorer'));
const DockerTutorial = lazy(() => import('./components/DockerTutorial'));
const NetworkingView = lazy(() => import('./components/networking/NetworkingView'));
const OSView = lazy(() => import('./components/os/OSView'));
const LLMAgentsView = lazy(() => import('./components/ai/LLMAgentsView'));
const DatabaseView = lazy(() => import('./components/database/DatabaseView'));

export default function App() {
  // Top-Level Module Routing: null (Learn by Simulation default view) | 'docker' | 'networking' | 'os' | 'databases'
  const [activeDomain, setActiveDomain] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const cleanHash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
      const parts = cleanHash.split('/');
      const primary = parts[0];
      if (primary === 'databases' || primary === 'database') return 'databases';
      if (primary === 'networking') return 'networking';
      if (primary === 'os' || primary === 'operating-system') return 'os';
      if (primary === 'docker' || primary === 'tools') return 'docker';
    }
    return null; // By default show only "Learn by Simulation" menu section!
  });

  // Active database engine state: 'sql' | 'postgres' | 'mongodb'
  const [activeDatabaseEngine, setActiveDatabaseEngine] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const cleanHash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
      const parts = cleanHash.split('/');
      if (parts[0] === 'databases' || parts[0] === 'database') {
        const enginePart = parts[1] || '';
        if (enginePart.includes('postgres')) return 'postgres';
        if (enginePart.includes('mongo')) return 'mongodb';
        if (enginePart.includes('sql')) return 'sql';
      }
    }
    return 'sql';
  });

  // Active database topic tab state: 'flow' | 'query' | 'normalization' | 'indexing' | 'scaling' | 'transactions' | 'connections' | 'guide' | 'tutorial'
  const [activeDatabaseTab, setActiveDatabaseTab] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const cleanHash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
      const parts = cleanHash.split('/');
      if (parts[0] === 'databases' || parts[0] === 'database') {
        const tabPart = parts[2] || parts[1] || '';
        if (tabPart.includes('tut')) return 'tutorial';
        if (tabPart.includes('arch') || tabPart.includes('ref')) return 'architecture';
        if (tabPart.includes('query')) return 'query';
        if (tabPart.includes('norm') || tabPart.includes('schema')) return 'normalization';
        if (tabPart.includes('index')) return 'indexing';
        if (tabPart.includes('scale') || tabPart.includes('shard')) return 'scaling';
        if (tabPart.includes('trans') || tabPart.includes('mvcc') || tabPart.includes('acid')) return 'transactions';
        if (tabPart.includes('conn') || tabPart.includes('pool')) return 'connections';
        if (tabPart.includes('guide') || tabPart.includes('roadmap')) return 'guide';
        if (tabPart.includes('flow')) return 'flow';
      }
    }
    return 'flow';
  });

  // Sync URL hash with active domain, engine & topic
  useEffect(() => {
    const handleHashChange = () => {
      const cleanHash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
      if (!cleanHash) {
        return;
      }
      const parts = cleanHash.split('/');
      const primary = parts[0];

      if (primary === 'databases' || primary === 'database') {
        setActiveDomain('databases');
        const enginePart = parts[1] || '';
        if (enginePart.includes('postgres')) {
          setActiveDatabaseEngine('postgres');
        } else if (enginePart.includes('mongo')) {
          setActiveDatabaseEngine('mongodb');
        } else if (enginePart.includes('sql')) {
          setActiveDatabaseEngine('sql');
        }

        const tabPart = parts[2] || '';
        if (tabPart.includes('tut')) setActiveDatabaseTab('tutorial');
        else if (tabPart.includes('arch') || tabPart.includes('ref')) setActiveDatabaseTab('architecture');
        else if (tabPart.includes('query')) setActiveDatabaseTab('query');
        else if (tabPart.includes('norm') || tabPart.includes('schema')) setActiveDatabaseTab('normalization');
        else if (tabPart.includes('index')) setActiveDatabaseTab('indexing');
        else if (tabPart.includes('scale') || tabPart.includes('shard')) setActiveDatabaseTab('scaling');
        else if (tabPart.includes('trans') || tabPart.includes('mvcc') || tabPart.includes('acid')) setActiveDatabaseTab('transactions');
        else if (tabPart.includes('conn') || tabPart.includes('pool')) setActiveDatabaseTab('connections');
        else if (tabPart.includes('guide') || tabPart.includes('roadmap')) setActiveDatabaseTab('guide');
        else if (tabPart.includes('flow')) setActiveDatabaseTab('flow');
      } else if (primary === 'networking') {
        setActiveDomain('networking');
      } else if (primary === 'os' || primary === 'operating-system') {
        setActiveDomain('os');
      } else if (primary === 'docker' || primary === 'tools') {
        setActiveDomain('docker');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const domainTitles = {
      docker: 'Docker & Containers — Learn by Simulation',
      networking: 'Networking & Distributed Systems — Learn by Simulation',
      os: 'Operating Systems & Hardware — Learn by Simulation',
      databases: 'Databases & Distributed Sharding — Learn by Simulation',
      'llm-agents': 'AI & LLM Workflows — Learn by Simulation',
    };
    if (activeDomain && domainTitles[activeDomain]) {
      document.title = domainTitles[activeDomain];
    } else {
      document.title = 'Learn by Simulation — Interactive Systems, Architecture & Engineering Platform';
    }

    if (activeDomain === 'networking') {
      window.location.hash = 'networking';
    } else if (activeDomain === 'docker') {
      window.location.hash = 'docker';
    } else if (activeDomain === 'os') {
      window.location.hash = 'os';
    } else if (activeDomain === 'databases' || activeDomain === 'database') {
      window.location.hash = `databases/${activeDatabaseEngine}/${activeDatabaseTab}`;
    } else if (activeDomain === null && window.location.hash) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }, [activeDomain, activeDatabaseEngine, activeDatabaseTab]);

  // Docker Module States
  const [activeTab, setActiveTab] = useState('commands'); // 'commands' | 'components' | 'simulator' | 'architecture' | 'terminal' | 'tutorial'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'basic' | 'intermediate' | 'advanced'
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommandId, setSelectedCommandId] = useState('docker-run');

  // Filter commands by search query, category, and tag
  const filteredCommands = useMemo(() => {
    return DOCKER_COMMANDS.filter((cmd) => {
      // Category filter
      if (selectedCategory !== 'all' && cmd.category !== selectedCategory) {
        return false;
      }
      // Tag filter
      if (selectedTag !== 'all' && !cmd.tags.includes(selectedTag)) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = cmd.name.toLowerCase().includes(q);
        const matchesCommand = cmd.command.toLowerCase().includes(q);
        const matchesSummary = cmd.summary.toLowerCase().includes(q);
        const matchesTags = cmd.tags.some(t => t.toLowerCase().includes(q));
        const matchesTokens = cmd.syntaxTokens?.some(t => t.text.toLowerCase().includes(q) || t.desc?.toLowerCase().includes(q));
        return matchesName || matchesCommand || matchesSummary || matchesTags || matchesTokens;
      }
      return true;
    });
  }, [selectedCategory, selectedTag, searchQuery]);

  const selectedCommand = useMemo(() => {
    return DOCKER_COMMANDS.find(c => c.id === selectedCommandId) || DOCKER_COMMANDS[0];
  }, [selectedCommandId]);

  const handleLaunchSimulation = (cmd) => {
    if (cmd) {
      setSelectedCommandId(cmd.id);
    }
    setActiveTab('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top-Level Master Navigation Hub: Switch between Docker, Networking, Linux, etc. */}
      <div style={{ paddingTop: '12px' }}>
        <MainNavigation
          activeDomain={activeDomain}
          setActiveDomain={setActiveDomain}
          activeDatabaseEngine={activeDatabaseEngine}
          setActiveDatabaseEngine={setActiveDatabaseEngine}
          activeDatabaseTab={activeDatabaseTab}
          setActiveDatabaseTab={setActiveDatabaseTab}
        />
      </div>

      {/* DEFAULT VIEW: SIMUCORE HUB TOPIC SELECTION PORTAL */}
      {activeDomain === null && (
        <main style={{ flex: 1 }}>
          <SimuCoreHubHome onSelectTopic={(topicId) => {
            setActiveDomain(topicId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        </main>
      )}

      {/* DOMAIN 1: DOCKER & CONTAINER ARCHITECTURE SUITE */}
      {activeDomain === 'docker' && (
        <Suspense fallback={
          <SuspenseLoader
            label="Streaming Docker Architecture Suite..."
            sub="Loading interactive container engine, OverlayFS storage & hardware cgroups"
          />
        }>
          {/* Docker Submenu Header */}
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalCommandsCount={DOCKER_COMMANDS.length}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Docker Main Views */}
          <main className="container-xl" style={{ flex: 1, paddingBottom: '40px' }}>
            <ErrorBoundary
              title="Docker Simulator Error"
              fallbackMessage="An error occurred inside the Docker tools module. You can reload or switch tabs."
              onReset={() => setActiveTab('commands')}
            >
              <Suspense fallback={
                <SuspenseLoader
                  label={`Loading ${activeTab.toUpperCase()} View...`}
                  sub="Streaming interactive visualizers & execution sandbox"
                />
              }>
                {/* SUBTAB 1: COMMANDS & DETAILED BREAKDOWN VIEW */}
                {activeTab === 'commands' && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(400px, 1.85fr)',
                    gap: '24px',
                    alignItems: 'start'
                  }}>
                    {/* Left Column: Command List & Categories */}
                    <CommandList
                      commands={filteredCommands}
                      selectedCommand={selectedCommand}
                      onSelectCommand={(cmd) => setSelectedCommandId(cmd.id)}
                      onLaunchSimulation={handleLaunchSimulation}
                      activeCategory={selectedCategory}
                      setActiveCategory={setSelectedCategory}
                      activeTag={selectedTag}
                      setActiveTag={setSelectedTag}
                    />

                    {/* Right Column: In-Depth Breakdown of Selected Command */}
                    <CommandDetails
                      command={selectedCommand}
                      onLaunchSimulation={handleLaunchSimulation}
                    />
                  </div>
                )}

                {/* SUBTAB 2: COMPONENT FLOW & ARCHITECTURE TOPOLOGY EXPLORER */}
                {activeTab === 'components' && (
                  <ComponentFlowExplorer />
                )}

                {/* SUBTAB 3: MULTI-LAYER EXECUTION SIMULATOR */}
                {activeTab === 'simulator' && (
                  <MultiLayerSimulator
                    command={selectedCommand}
                    allCommands={DOCKER_COMMANDS}
                    onSelectCommand={(cmd) => setSelectedCommandId(cmd.id)}
                  />
                )}

                {/* SUBTAB 4: LINUX & HARDWARE ARCHITECTURE EXPLORER */}
                {activeTab === 'architecture' && (
                  <ArchitectureExplorer />
                )}

                {/* SUBTAB 5: INTERACTIVE CLI TERMINAL SANDBOX */}
                {activeTab === 'terminal' && (
                  <TerminalSandbox
                    allCommands={DOCKER_COMMANDS}
                    onSelectAndSimulate={handleLaunchSimulation}
                  />
                )}

                {/* SUBTAB 6: DOCKER TUTORIAL, HYPERVISOR ARCHITECTURE & INSTALLATION */}
                {activeTab === 'tutorial' && (
                  <DockerTutorial onNavigateToSimulator={() => {
                    setActiveTab('commands');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} />
                )}
              </Suspense>
            </ErrorBoundary>
          </main>
        </Suspense>
      )}

      {/* DOMAIN 2: COMPUTER NETWORKING & OSI/TCP-IP SUITE */}
      {activeDomain === 'networking' && (
        <main className="container-xl" style={{ flex: 1, paddingBottom: '40px' }}>
          <ErrorBoundary
            title="NetCore Networking Suite Error"
            fallbackMessage="An error occurred inside the Networking module. You can reload or choose another topic."
            onReset={() => setActiveDomain(null)}
          >
            <Suspense fallback={
              <SuspenseLoader
                label="Streaming NetCore Networking Suite..."
                sub="Loading OSI 7-Layer, xyflow Packet Tracer & Distributed Protocols"
              />
            }>
              <NetworkingView />
            </Suspense>
          </ErrorBoundary>
        </main>
      )}

      {/* DOMAIN 3: LLM AGENTS, RAG & VECTOR EMBEDDINGS */}
      {(activeDomain === 'llm-agents' || activeDomain === 'LLM-agents-preview') && (
        <main className="container-xl" style={{ flex: 1, paddingBottom: '40px' }}>
          <ErrorBoundary
            title="AgentCore Suite Error"
            fallbackMessage="An error occurred inside the LLM Agents module."
            onReset={() => setActiveDomain(null)}
          >
            <Suspense fallback={<SuspenseLoader label="Streaming AgentCore Suite..." />}>
              <LLMAgentsView />
            </Suspense>
          </ErrorBoundary>
        </main>
      )}

      {/* DOMAIN 4: DATABASES, SQL & NOSQL MONGODB */}
      {(activeDomain === 'databases' || activeDomain === 'Database-preview') && (
        <main className="container-xl" style={{ flex: 1, paddingBottom: '40px' }}>
          <ErrorBoundary
            title="Database Simulator Error"
            fallbackMessage="An error occurred inside the database module. You can reload or select another module from the top navigation."
            onReset={() => setActiveDatabaseTab('flow')}
          >
            <Suspense fallback={<SuspenseLoader label="Streaming DataCore Suite..." />}>
              <DatabaseView
                activeEngine={activeDatabaseEngine}
                setActiveEngine={setActiveDatabaseEngine}
                activeTab={activeDatabaseTab}
                setActiveTab={setActiveDatabaseTab}
              />
            </Suspense>
          </ErrorBoundary>
        </main>
      )}

      {/* DOMAIN 5: OPERATING SYSTEM (LINUX, WINDOWS, MACOS) & HARDWARE BUS SUITE */}
      {(activeDomain === 'os' || activeDomain === 'operating-system') && (
        <main className="container-xl" style={{ flex: 1, paddingBottom: '40px' }}>
          <ErrorBoundary
            title="OSCore Operating System Suite Error"
            fallbackMessage="An error occurred inside the Operating System module."
            onReset={() => setActiveDomain(null)}
          >
            <Suspense fallback={
              <SuspenseLoader
                label="Streaming OSCore Operating System Suite..."
                sub="Loading Linux, Windows & macOS Kernel Internals, Motherboard Buses & Internet Card"
              />
            }>
              <OSView />
            </Suspense>
          </ErrorBoundary>
        </main>
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 10, 18, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'var(--text-dim)',
        marginTop: 'auto'
      }}>
        <div className="container-xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            {activeDomain === null && (
              <span>
                <strong>Learn by Simulation Platform</strong> — Modular dynamic execution environment with on-demand component rendering.
              </span>
            )}
            {activeDomain === 'docker' && (
              <span>
                <strong>DockerCore Interactive Platform</strong> — Comprehensive Docker Commands Cheat Sheet & OS/Hardware Execution Simulation Engine.
              </span>
            )}
            {activeDomain === 'networking' && (
              <span>
                <strong>NetCore Distributed Simulator</strong> — Interactive OSI 7-Layer, Packet Tracer & Protocol Diagnostics Engine.
              </span>
            )}
            {(activeDomain === 'os' || activeDomain === 'operating-system') && (
              <span>
                <strong>OSCore Simulator Platform</strong> — Comprehensive Operating System Architecture, Motherboard Bus Pipelines & Internet Card Flow.
              </span>
            )}
            {(activeDomain === 'llm-agents' || activeDomain === 'LLM-agents-preview') && (
              <span>
                <strong>AgentCore AI Platform</strong> — Interactive LLM Agentic Loops, RAG Pipelines & Vector Embeddings Engine.
              </span>
            )}
            {(activeDomain === 'databases' || activeDomain === 'Database-preview') && (
              <span>
                <strong>DataCore Database Engine</strong> — Relational SQL B-Trees, ACID Transactions & MongoDB Sharded Clusters.
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Built with React 19 & Vanilla Modern CSS</span>
            <span>•</span>
            <a 
              href="https://phoenixnap.com/kb/docker-commands-cheat-sheet" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#38bdf8', textDecoration: 'none' }}
            >
              PhoenixNAP Reference Cheat Sheet
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
