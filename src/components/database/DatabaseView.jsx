import React, { useState, Suspense, lazy } from 'react';
import DatabaseHeader from './DatabaseHeader';
import SuspenseLoader from '../common/SuspenseLoader';

// Dynamic lazy-loaded database sub-modules
const DatabaseXYFlowSimulator = lazy(() => import('./DatabaseXYFlowSimulator'));
const QueryExecutionExplorer = lazy(() => import('./QueryExecutionExplorer'));
const NormalizationExplorer = lazy(() => import('./NormalizationExplorer'));
const IndexingExplorer = lazy(() => import('./IndexingExplorer'));
const ScalingShardingExplorer = lazy(() => import('./ScalingShardingExplorer'));
const TransactionsExplorer = lazy(() => import('./TransactionsExplorer'));
const ConnectionsExplorer = lazy(() => import('./ConnectionsExplorer'));
const DatabaseGuideRoadmap = lazy(() => import('./DatabaseGuideRoadmap'));
const DatabaseTutorial = lazy(() => import('./DatabaseTutorial'));

export default function DatabaseView({
  activeEngine: propEngine,
  setActiveEngine: propSetEngine,
  activeTab: propTab,
  setActiveTab: propSetTab
}) {
  const [internalEngine, setInternalEngine] = useState('sql');
  const activeEngine = propEngine !== undefined ? propEngine : internalEngine;
  const setActiveEngine = propSetEngine !== undefined ? propSetEngine : setInternalEngine;

  const [internalTab, setInternalTab] = useState('flow');
  const activeTab = propTab !== undefined ? propTab : internalTab;
  const setActiveTab = propSetTab !== undefined ? propSetTab : setInternalTab;

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Database Module Subheader with Submenus for [SQL, MONGODB, postgress] */}
      <DatabaseHeader
        activeEngine={activeEngine}
        setActiveEngine={setActiveEngine}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Dynamic Lazy-Loaded Views */}
      <div style={{ flex: 1 }}>
        <Suspense fallback={
          <SuspenseLoader
            label={`Streaming DataCore ${activeTab.toUpperCase()} Engine Module...`}
            sub={`Compiling ${activeEngine.toUpperCase()} internals, query graphs, and architectural models`}
          />
        }>
          {activeTab === 'flow' && (
            <DatabaseXYFlowSimulator activeEngine={activeEngine} />
          )}

          {activeTab === 'query' && (
            <QueryExecutionExplorer activeEngine={activeEngine} />
          )}

          {activeTab === 'normalization' && (
            <NormalizationExplorer activeEngine={activeEngine} />
          )}

          {activeTab === 'indexing' && (
            <IndexingExplorer activeEngine={activeEngine} />
          )}

          {activeTab === 'scaling' && (
            <ScalingShardingExplorer activeEngine={activeEngine} />
          )}

          {activeTab === 'transactions' && (
            <TransactionsExplorer activeEngine={activeEngine} />
          )}

          {activeTab === 'connections' && (
            <ConnectionsExplorer activeEngine={activeEngine} />
          )}

          {activeTab === 'guide' && (
            <DatabaseGuideRoadmap activeEngine={activeEngine} />
          )}

          {activeTab === 'tutorial' && (
            <DatabaseTutorial
              onNavigateToTab={setActiveTab}
              activeEngine={activeEngine}
              setActiveEngine={setActiveEngine}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}
