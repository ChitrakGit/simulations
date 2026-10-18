import React, { useState, Suspense, lazy } from 'react';
import OSSubHeader from './OSSubHeader';
import SuspenseLoader from '../common/SuspenseLoader';

// Dynamic lazy-loaded OS components to prevent webpage crashing & optimize memory
const OSMotherboardSimulator = lazy(() => import('./OSMotherboardSimulator'));
const OSKernelExplorer = lazy(() => import('./OSKernelExplorer'));
const OSTutorial = lazy(() => import('./OSTutorial'));

export default function OSView() {
  const [activeOS, setActiveOS] = useState('linux'); // 'linux' | 'windows' | 'macos'
  const [activeSubTab, setActiveSubTab] = useState('motherboard'); // 'motherboard' | 'kernel' | 'tutorial'

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* OS Navigation Header with OS Switcher & Subtabs */}
      <OSSubHeader
        activeOS={activeOS}
        setActiveOS={setActiveOS}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />

      {/* Dynamic Lazy-Loaded OS Views */}
      <div style={{ flex: 1 }}>
        <Suspense fallback={
          <SuspenseLoader
            label={`Streaming OSCore ${activeSubTab.toUpperCase()} Module...`}
            sub={`Loading ${activeOS.toUpperCase()} kernel structures, hardware buses & execution engines`}
          />
        }>
          {activeSubTab === 'motherboard' && (
            <OSMotherboardSimulator activeOS={activeOS} />
          )}

          {activeSubTab === 'kernel' && (
            <OSKernelExplorer activeOS={activeOS} setActiveOS={setActiveOS} />
          )}

          {activeSubTab === 'tutorial' && (
            <OSTutorial onNavigateToSimulator={(tab) => {
              setActiveSubTab(tab || 'motherboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
