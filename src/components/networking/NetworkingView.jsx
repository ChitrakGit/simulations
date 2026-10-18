import React, { useState, Suspense, lazy } from 'react';
import NetworkSubHeader from './NetworkSubHeader';
import SuspenseLoader from '../common/SuspenseLoader';

// Dynamic lazy-loaded components for per-selection streaming
const NetworkTopologySimulator = lazy(() => import('./NetworkTopologySimulator'));
const NetworkXYFlowSimulator = lazy(() => import('./NetworkXYFlowSimulator'));
const GoogleWebRequestJourney = lazy(() => import('./GoogleWebRequestJourney'));
const AdvancedProxyLoadBalancerView = lazy(() => import('./AdvancedProxyLoadBalancerView'));
const OsiLayerExplorer = lazy(() => import('./OsiLayerExplorer'));
const ProtocolVisualizer = lazy(() => import('./ProtocolVisualizer'));
const NetworkTerminalSandbox = lazy(() => import('./NetworkTerminalSandbox'));
const SubnetCalculator = lazy(() => import('./SubnetCalculator'));
const NetworkingTutorial = lazy(() => import('./NetworkingTutorial'));

export default function NetworkingView() {
  const [activeSubTab, setActiveSubTab] = useState('xyflow-simulation'); // 'xyflow-simulation' | 'topology' | 'google-journey' | 'advance' | 'osi' | 'protocols' | 'terminal' | 'subnet' | 'tutorial'

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Submenu Navigation Bar for Networking */}
      <NetworkSubHeader
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />

      {/* Networking Subtab Views with Dynamic Lazy Suspense */}
      <div style={{ flex: 1 }}>
        <Suspense fallback={
          <SuspenseLoader
            label={`Streaming ${activeSubTab.toUpperCase()} Module...`}
            sub="Loading interactive network topology, packet tracers & protocols"
          />
        }>
          {activeSubTab === 'topology' && <NetworkTopologySimulator />}
          {activeSubTab === 'xyflow-simulation' && <NetworkXYFlowSimulator />}
          {activeSubTab === 'google-journey' && <GoogleWebRequestJourney />}
          {activeSubTab === 'advance' && (
            <AdvancedProxyLoadBalancerView onNavigateToTutorial={(chapId) => {
              setActiveSubTab('tutorial');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          )}
          {activeSubTab === 'osi' && <OsiLayerExplorer />}
          {activeSubTab === 'protocols' && <ProtocolVisualizer />}
          {activeSubTab === 'terminal' && <NetworkTerminalSandbox />}
          {activeSubTab === 'subnet' && <SubnetCalculator />}
          {activeSubTab === 'tutorial' && (
            <NetworkingTutorial onNavigateToSimulator={(tab) => {
              setActiveSubTab(tab || 'topology');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
