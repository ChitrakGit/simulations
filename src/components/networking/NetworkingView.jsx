import React, { useState, Suspense, lazy } from 'react';
import NetworkSubHeader, { NETWORKING_SUBTABS } from './NetworkSubHeader';
import SuspenseLoader from '../common/SuspenseLoader';
import ErrorBoundary from '../common/ErrorBoundary';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
const SecurityGroupPortRef = lazy(() => import('./SecurityGroupPortRef'));
const TcpUdpModelExplorer = lazy(() => import('./TcpUdpModelExplorer'));
const IdsIpsVisualizer = lazy(() => import('./IdsIpsVisualizer'));

export default function NetworkingView() {
  const [activeSubTab, setActiveSubTab] = useState('xyflow-simulation'); // 'xyflow-simulation' | 'topology' | 'tcp-udp' | 'ids-ips' | 'google-journey' | 'advance' | 'osi' | 'protocols' | 'ports' | 'terminal' | 'subnet' | 'tutorial'

  const currentIdx = NETWORKING_SUBTABS.findIndex(t => t.id === activeSubTab);
  const currentTab = currentIdx >= 0 ? NETWORKING_SUBTABS[currentIdx] : NETWORKING_SUBTABS[0];
  const prevTab = currentIdx > 0 ? NETWORKING_SUBTABS[currentIdx - 1] : null;
  const nextTab = currentIdx >= 0 && currentIdx < NETWORKING_SUBTABS.length - 1 ? NETWORKING_SUBTABS[currentIdx + 1] : null;

  const navigateToTab = (tabId) => {
    setActiveSubTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Submenu Navigation Bar for Networking */}
      <NetworkSubHeader
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />

      {/* Networking Subtab Views with Dynamic Lazy Suspense */}
      <div style={{ flex: 1 }}>
        <ErrorBoundary
          title={`Error Rendering NetCore ${activeSubTab.toUpperCase()} Module`}
          fallbackMessage="An error occurred while loading this networking module. The networking navigation bar remains fully accessible."
          onReset={() => setActiveSubTab('topology')}
        >
        <Suspense fallback={
          <SuspenseLoader
            label={`Streaming ${activeSubTab.toUpperCase()} Module...`}
            sub="Loading interactive network topology, packet tracers & protocols"
          />
        }>
          {activeSubTab === 'topology' && <NetworkTopologySimulator />}
          {activeSubTab === 'xyflow-simulation' && <NetworkXYFlowSimulator />}
          {activeSubTab === 'tcp-udp' && <TcpUdpModelExplorer />}
          {activeSubTab === 'ids-ips' && <IdsIpsVisualizer />}
          {activeSubTab === 'google-journey' && <GoogleWebRequestJourney />}
          {activeSubTab === 'advance' && (
            <AdvancedProxyLoadBalancerView onNavigateToTutorial={(_chapId) => {
              setActiveSubTab('tutorial');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          )}
          {activeSubTab === 'osi' && <OsiLayerExplorer />}
          {activeSubTab === 'protocols' && <ProtocolVisualizer />}
          {activeSubTab === 'terminal' && <NetworkTerminalSandbox />}
          {activeSubTab === 'subnet' && <SubnetCalculator />}
          {activeSubTab === 'ports' && <SecurityGroupPortRef />}
          {activeSubTab === 'tutorial' && (
            <NetworkingTutorial onNavigateToSimulator={(tab) => {
              setActiveSubTab(tab || 'topology');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          )}
        </Suspense>
        </ErrorBoundary>

        {/* ─── Serialized Module Sequential Stepper Footer ─── */}
        <div className="glass-panel" style={{
          marginTop: '28px',
          padding: '16px 20px',
          borderRadius: '16px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(5, 150, 105, 0.08) 100%)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Previous Module Button */}
          {prevTab ? (
            <button
              onClick={() => navigateToTab(prevTab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <ChevronLeft size={18} color="#94a3b8" />
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Previous Module
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#ffffff' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#34d399', marginRight: '6px' }}>{prevTab.serial}.</span>
                  {prevTab.label}
                </div>
              </div>
            </button>
          ) : (
            <div style={{
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              color: '#64748b',
              fontSize: '0.78rem',
              fontStyle: 'italic'
            }}>
              First Module in Series
            </div>
          )}

          {/* Center: Module Step Indicator & 12 Interactive Serial Pills */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'center',
            flex: '1 1 300px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{
                fontSize: '0.64rem',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '5px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                fontFamily: 'var(--font-mono)'
              }}>
                {currentTab.serial === '📚' ? 'TUTORIAL GUIDE' : `SERIES ${currentTab.serial} / 11`}
              </span>
              <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#ffffff' }}>
                {currentTab.label}
              </span>
            </div>
            
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', maxWidth: '440px' }}>
              {currentTab.desc}
            </div>

            {/* 12 Interactive Step Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {NETWORKING_SUBTABS.map((tab, idx) => {
                const isCur = idx === currentIdx;
                const isPast = idx < currentIdx;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigateToTab(tab.id)}
                    title={tab.serial === '📚' ? `${tab.label} (${tab.badge})` : `${tab.serial}. ${tab.label} (${tab.badge})`}
                    style={{
                      padding: isCur ? '3px 8px' : '3px 5px',
                      borderRadius: '4px',
                      fontSize: '0.66rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: isCur ? '800' : '600',
                      background: isCur
                        ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                        : isPast
                          ? 'rgba(16, 185, 129, 0.18)'
                          : 'rgba(255, 255, 255, 0.05)',
                      color: isCur ? '#ffffff' : isPast ? '#34d399' : '#64748b',
                      border: isCur
                        ? '1px solid #34d399'
                        : isPast
                          ? '1px solid rgba(16, 185, 129, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      boxShadow: isCur ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none'
                    }}
                  >
                    {tab.serial}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next Module Button */}
          {nextTab ? (
            <button
              onClick={() => navigateToTab(nextTab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(56, 189, 248, 0.1) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'right'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(56, 189, 248, 0.2) 100%)';
                e.currentTarget.style.borderColor = '#34d399';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(56, 189, 248, 0.1) 100%)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
              }}
            >
              <div>
                <div style={{ fontSize: '0.68rem', color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Next Module
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#ffffff' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', marginRight: '6px' }}>{nextTab.serial === '📚' ? '📚' : `${nextTab.serial}.`}</span>
                  {nextTab.label}
                </div>
              </div>
              <ChevronRight size={18} color="#34d399" />
            </button>
          ) : (
            <button
              onClick={() => navigateToTab(NETWORKING_SUBTABS[0].id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: '700'
              }}
            >
              Restart Series (01)
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
