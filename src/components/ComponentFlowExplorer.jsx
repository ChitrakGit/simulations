import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Terminal,
  Server,
  Layers,
  Anchor,
  Zap,
  ShieldCheck,
  Box,
  Network,
  Cable,
  Shield,
  HardDrive,
  Cpu,
  Activity,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Sliders
} from 'lucide-react';
import {
  DOCKER_COMPONENTS,
  INTERACTION_FLOWS,
  COMPONENT_ZONES
} from '../data/dockerComponentsData';
import SuspenseLoader from './common/SuspenseLoader';

// Map icon strings to Lucide components
const ICON_MAP = {
  Terminal: Terminal,
  Server: Server,
  Layers: Layers,
  Anchor: Anchor,
  Zap: Zap,
  ShieldCheck: ShieldCheck,
  Box: Box,
  Network: Network,
  Cable: Cable,
  Shield: Shield,
  HardDrive: HardDrive,
  Cpu: Cpu,
  Activity: Activity
};

const DockerXYFlowSimulator = React.lazy(() => import('./docker/DockerXYFlowSimulator'));

export default function ComponentFlowExplorer() {
  const [selectedFlowId, setSelectedFlowId] = useState(INTERACTION_FLOWS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5x, 1x, 2x
  const [selectedComponentId, setSelectedComponentId] = useState('dockerd');
  const [activeZone, setActiveZone] = useState('all');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [viewMode, setViewMode] = useState('xyflow'); // 'xyflow' | 'flow' | 'matrix'

  const timerRef = useRef(null);

  const activeFlow = useMemo(() => {
    return INTERACTION_FLOWS.find(f => f.id === selectedFlowId) || INTERACTION_FLOWS[0];
  }, [selectedFlowId]);

  const currentStep = activeFlow.steps[currentStepIndex] || activeFlow.steps[0];

  const selectedComponent = useMemo(() => {
    return DOCKER_COMPONENTS.find(c => c.id === selectedComponentId) || DOCKER_COMPONENTS[0];
  }, [selectedComponentId]);

  // Handle flow selection
  const handleSelectFlow = (flowId) => {
    setSelectedFlowId(flowId);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      const interval = 2800 / playbackSpeed;
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < activeFlow.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, activeFlow.steps.length]);

  const handleNextStep = () => {
    if (currentStepIndex < activeFlow.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleCopyCommand = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  // Helper to render icon
  const renderIcon = (name, size = 18, color = 'currentColor') => {
    const Component = ICON_MAP[name] || Box;
    return <Component size={size} color={color} />;
  };

  // Filtered components based on zone filter
  const filteredComponents = useMemo(() => {
    if (activeZone === 'all') return DOCKER_COMPONENTS;
    if (activeZone === 'host-hardware') {
      return DOCKER_COMPONENTS.filter(c => ['host', 'hardware'].includes(c.category));
    }
    return DOCKER_COMPONENTS.filter(c => c.category === activeZone);
  }, [activeZone]);

  const sourceComponent = DOCKER_COMPONENTS.find(c => c.id === currentStep.source);
  const targetComponent = DOCKER_COMPONENTS.find(c => c.id === currentStep.target);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* SECTION HEADER & HERO */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(99, 102, 241, 0.05) 50%, rgba(168, 85, 247, 0.08) 100%)',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge" style={{
                background: 'rgba(14, 165, 233, 0.2)',
                color: '#38bdf8',
                border: '1px solid rgba(14, 165, 233, 0.4)'
              }}>
                Component Flow & Topology
              </span>
              <span className="badge" style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                13 System Subsystems
              </span>
            </div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #ffffff, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Docker Architecture & Component Interaction Flow
            </h1>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.92rem',
              maxWidth: '860px',
              margin: 0,
              lineHeight: 1.5
            }}>
              Explore how the <strong>Docker Client</strong>, <strong>dockerd</strong>, <strong>containerd</strong>, <strong>containerd-shim</strong>, <strong>runc</strong>, <strong>Linux Bridge (docker0)</strong>, <strong>veth pairs</strong>, <strong>iptables NAT</strong>, and <strong>OverlayFS</strong> interact across process, network, and silicon boundaries during real-world container operations.
            </p>
          </div>

          {/* View mode toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0,0,0,0.4)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setViewMode('xyflow')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: viewMode === 'xyflow' ? '700' : '400',
                color: viewMode === 'xyflow' ? '#ffffff' : 'var(--text-muted)',
                background: viewMode === 'xyflow' ? 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)' : 'transparent',
                boxShadow: viewMode === 'xyflow' ? '0 2px 10px rgba(13, 183, 237, 0.35)' : 'none'
              }}
            >
              <Zap size={14} color={viewMode === 'xyflow' ? '#ffffff' : '#38bdf8'} />
              <span>xyflow Canvas</span>
              <span style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(255,255,255,0.2)' }}>
                Node Graph
              </span>
            </button>
            <button
              onClick={() => setViewMode('flow')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: viewMode === 'flow' ? '600' : '400',
                color: viewMode === 'flow' ? '#ffffff' : 'var(--text-muted)',
                background: viewMode === 'flow' ? 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)' : 'transparent',
                boxShadow: viewMode === 'flow' ? '0 2px 10px rgba(13, 183, 237, 0.3)' : 'none'
              }}
            >
              <Share2 size={14} />
              <span>Step-by-Step Flow Map</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: viewMode === 'matrix' ? '600' : '400',
                color: viewMode === 'matrix' ? '#ffffff' : 'var(--text-muted)',
                background: viewMode === 'matrix' ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' : 'transparent',
                boxShadow: viewMode === 'matrix' ? '0 2px 10px rgba(168, 85, 247, 0.3)' : 'none'
              }}
            >
              <Sliders size={14} />
              <span>Interaction Matrix</span>
            </button>
          </div>
        </div>

        {/* FLOW SCENARIO SELECTOR TABS (ONLY IN FLOW MODE) */}
        {viewMode === 'flow' && (
          <div style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}>
            {INTERACTION_FLOWS.map((flow) => {
              const isSelected = flow.id === selectedFlowId;
              return (
                <button
                  key={flow.id}
                  onClick={() => handleSelectFlow(flow.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    whiteSpace: 'nowrap',
                    fontSize: '0.84rem',
                    fontWeight: isSelected ? '600' : '400',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? `1px solid ${flow.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isSelected ? `0 0 16px ${flow.color}40` : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: flow.color,
                    boxShadow: `0 0 8px ${flow.color}`
                  }} />
                  <span>{flow.title}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    color: flow.color,
                    fontFamily: 'monospace'
                  }}>
                    {flow.steps.length} hops
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* VIEW MODE 0: XYFLOW NODE CANVAS SIMULATOR */}
      {viewMode === 'xyflow' && (
        <React.Suspense fallback={
          <SuspenseLoader
            label="Streaming Docker xyflow Canvas..."
            sub="Loading interactive container nodes, bridge networks & DNAT packet flow"
          />
        }>
          <DockerXYFlowSimulator />
        </React.Suspense>
      )}

      {/* VIEW MODE 1: INTERACTIVE FLOW & TOPOLOGY CANVAS */}
      {viewMode === 'flow' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* STEP CONTROLS & ACTIVE INTERACTION BANNER */}
          <div className="glass-panel" style={{
            padding: '20px 24px',
            borderRadius: '16px',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(7, 10, 18, 0.95) 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}>
            {/* Top row: Flow info and playback controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: activeFlow.color,
                    fontWeight: '700'
                  }}>
                    {activeFlow.badge}
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>•</span>
                  <code style={{
                    fontSize: '0.82rem',
                    color: '#38bdf8',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {activeFlow.command}
                  </code>
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Hop {currentStep.stepIndex} of {activeFlow.steps.length}: {currentStep.title}
                </div>
              </div>

              {/* Player buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleReset}
                  className="btn btn-secondary"
                  title="Reset to beginning"
                  style={{ padding: '8px 12px' }}
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="btn btn-secondary"
                  title="Previous Step"
                  style={{ padding: '8px 12px', opacity: currentStepIndex === 0 ? 0.4 : 1 }}
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: isPlaying ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.86rem',
                    boxShadow: isPlaying ? '0 0 16px rgba(245, 158, 11, 0.4)' : '0 0 16px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                  <span>{isPlaying ? 'Pause Flow' : 'Play Flow'}</span>
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={currentStepIndex === activeFlow.steps.length - 1}
                  className="btn btn-secondary"
                  title="Next Step"
                  style={{ padding: '8px 12px', opacity: currentStepIndex === activeFlow.steps.length - 1 ? 0.4 : 1 }}
                >
                  Next →
                </button>

                {/* Speed toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  background: 'rgba(0,0,0,0.4)',
                  padding: '2px',
                  borderRadius: '6px',
                  marginLeft: '4px'
                }}>
                  {[0.5, 1, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: playbackSpeed === spd ? '700' : '400',
                        color: playbackSpeed === spd ? '#ffffff' : 'var(--text-dim)',
                        background: playbackSpeed === spd ? 'rgba(56, 189, 248, 0.25)' : 'transparent'
                      }}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle row: Interactive Source -> Target Wire Banner */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(200px, 1fr) auto minmax(200px, 1fr)',
              gap: '16px',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '14px 20px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              {/* Source node */}
              <div
                onClick={() => sourceComponent && setSelectedComponentId(sourceComponent.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${sourceComponent?.color || 'transparent'}60`
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: `${sourceComponent?.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${sourceComponent?.color}`
                }}>
                  {sourceComponent && renderIcon(sourceComponent.iconName, 18, sourceComponent.color)}
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Source Component</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: sourceComponent?.color }}>
                    {sourceComponent?.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sourceComponent?.hostPath}</div>
                </div>
              </div>

              {/* Wire / Protocol Pulse */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '0 12px'
              }}>
                <div style={{
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  color: '#38bdf8',
                  background: 'rgba(14, 165, 233, 0.15)',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  textAlign: 'center'
                }}>
                  {currentStep.mechanism}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: '100%',
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '40px', height: '2px', background: 'linear-gradient(to right, transparent, #38bdf8)' }} />
                  <ArrowRight size={18} color="#38bdf8" />
                  <div style={{ width: '40px', height: '2px', background: 'linear-gradient(to left, transparent, #38bdf8)' }} />
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                  {currentStep.protocol}
                </div>
              </div>

              {/* Target node */}
              <div
                onClick={() => targetComponent && setSelectedComponentId(targetComponent.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${targetComponent?.color || 'transparent'}60`
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: `${targetComponent?.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${targetComponent?.color}`
                }}>
                  {targetComponent && renderIcon(targetComponent.iconName, 18, targetComponent.color)}
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target Component</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: targetComponent?.color }}>
                    {targetComponent?.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{targetComponent?.hostPath}</div>
                </div>
              </div>
            </div>

            {/* Step description and technical data payload */}
            <div style={{
              marginTop: '14px',
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(280px, 1fr)',
              gap: '16px',
              alignItems: 'start'
            }}>
              <div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '6px' }}>
                  {currentStep.description}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Under the Hood: </strong>
                  {currentStep.details}
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '8px',
                padding: '10px 14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#a7f3d0'
              }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Live Data Payload / Syscall Frame:
                </div>
                <div style={{ wordBreak: 'break-all', lineHeight: 1.4 }}>
                  {currentStep.dataPayload}
                </div>
              </div>
            </div>

            {/* Stepper progress dots */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px'
            }}>
              {activeFlow.steps.map((step, idx) => {
                const isStepActive = idx === currentStepIndex;
                const isStepPast = idx < currentStepIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    title={`Jump to Hop ${idx + 1}: ${step.title}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      border: 'none',
                      background: isStepActive ? activeFlow.color : isStepPast ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                      color: isStepActive ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '0.72rem',
                      fontWeight: isStepActive ? '700' : '400',
                      boxShadow: isStepActive ? `0 0 12px ${activeFlow.color}80` : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{idx + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TWO-COLUMN LAYOUT: ARCHITECTURE TOPOLOGY CANVAS & DEEP INSPECTOR */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(420px, 1.8fr) minmax(360px, 1.2fr)',
            gap: '24px',
            alignItems: 'start'
          }}>
            {/* LEFT: COMPONENT TOPOLOGY GRID */}
            <div className="glass-panel" style={{
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)'
            }}>
              {/* Zone Filter Chips */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Docker System Subsystems
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {COMPONENT_ZONES.map(zone => {
                    const isZoneActive = activeZone === zone.id;
                    return (
                      <button
                        key={zone.id}
                        onClick={() => setActiveZone(zone.id)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.74rem',
                          fontWeight: isZoneActive ? '600' : '400',
                          background: isZoneActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: isZoneActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                          color: isZoneActive ? '#38bdf8' : 'var(--text-muted)'
                        }}
                      >
                        {zone.label} ({zone.count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topology Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '14px'
              }}>
                {filteredComponents.map((comp) => {
                  const isSelected = selectedComponentId === comp.id;
                  const isSource = currentStep.source === comp.id;
                  const isTarget = currentStep.target === comp.id;
                  const isActiveInFlow = isSource || isTarget;

                  return (
                    <div
                      key={comp.id}
                      onClick={() => setSelectedComponentId(comp.id)}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        background: isSelected
                          ? 'rgba(14, 165, 233, 0.12)'
                          : isActiveInFlow
                          ? `${comp.color}15`
                          : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected
                          ? `1px solid ${comp.color}`
                          : isActiveInFlow
                          ? `2px solid ${comp.color}`
                          : '1px solid rgba(255, 255, 255, 0.07)',
                        boxShadow: isActiveInFlow
                          ? `0 0 20px ${comp.color}50`
                          : isSelected
                          ? `0 0 14px ${comp.color}30`
                          : 'none',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Active Hop Badge */}
                      {isSource && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          background: comp.color,
                          color: '#070a12',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          ACTIVE SOURCE
                        </div>
                      )}
                      {isTarget && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          background: comp.color,
                          color: '#070a12',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          ACTIVE TARGET
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: `${comp.color}25`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${comp.color}60`
                        }}>
                          {renderIcon(comp.iconName, 18, comp.color)}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '0.88rem',
                            fontWeight: '700',
                            color: isSelected ? '#ffffff' : 'var(--text-main)'
                          }}>
                            {comp.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {comp.subtitle}
                          </div>
                        </div>
                      </div>

                      <div style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-dim)',
                        lineHeight: 1.35,
                        marginBottom: '10px'
                      }}>
                        {comp.role.length > 115 ? `${comp.role.slice(0, 115)}...` : comp.role}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.68rem',
                        color: 'var(--text-dim)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        paddingTop: '8px'
                      }}>
                        <code style={{ color: comp.color }}>{comp.shortName}</code>
                        <span>Click to inspect →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: COMPONENT DEEP DIVE INSPECTOR */}
            <div className="glass-panel" style={{
              padding: '24px',
              borderRadius: '16px',
              border: `1px solid ${selectedComponent.color}50`,
              boxShadow: `0 0 24px ${selectedComponent.color}20`,
              position: 'sticky',
              top: '90px'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: `${selectedComponent.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${selectedComponent.color}`,
                  boxShadow: `0 0 16px ${selectedComponent.color}40`
                }}>
                  {renderIcon(selectedComponent.iconName, 24, selectedComponent.color)}
                </div>
                <div>
                  <div style={{
                    fontSize: '1.15rem',
                    fontWeight: '800',
                    color: '#ffffff',
                    letterSpacing: '-0.01em'
                  }}>
                    {selectedComponent.name}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: selectedComponent.color, fontWeight: '500' }}>
                    {selectedComponent.subtitle}
                  </div>
                </div>
              </div>

              {/* Role description */}
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                marginBottom: '16px',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                {selectedComponent.role}
              </div>

              {/* Key metadata grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '3px' }}>
                    Host Binary / Module Path:
                  </div>
                  <code style={{
                    fontSize: '0.78rem',
                    color: '#38bdf8',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '3px 8px',
                    borderRadius: '5px',
                    display: 'block'
                  }}>
                    {selectedComponent.hostPath}
                  </code>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '3px' }}>
                    Supported Protocols & Sockets:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {selectedComponent.protocols.map((proto, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.72rem',
                        padding: '2px 7px',
                        borderRadius: '5px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-main)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}>
                        {proto}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core responsibilities checklist */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Execution Responsibilities:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedComponent.responsibilities.map((resp, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '8px',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.35
                    }}>
                      <CheckCircle2 size={13} color={selectedComponent.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Syscalls & Low-Level API */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Primary Syscalls & Kernel Primitives:
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.74rem',
                  color: '#f472b6'
                }}>
                  {selectedComponent.syscalls.map((sc, idx) => (
                    <div key={idx} style={{ lineHeight: 1.3 }}>• {sc}</div>
                  ))}
                </div>
              </div>

              {/* Live Host Inspection Command */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.74rem',
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  marginBottom: '4px'
                }}>
                  <span>Inspect on Live Linux Host:</span>
                  <button
                    onClick={() => handleCopyCommand(selectedComponent.inspectCommand)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedCmd ? '#10b981' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.7rem'
                    }}
                  >
                    {copiedCmd ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre style={{
                  margin: 0,
                  padding: '8px 10px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  color: '#38bdf8',
                  overflowX: 'auto',
                  border: '1px solid rgba(56, 189, 248, 0.2)'
                }}>
                  {selectedComponent.inspectCommand}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: INTERACTION MATRIX TABLE */}
      {viewMode === 'matrix' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 6px 0' }}>
              Docker Subsystem Interaction & Boundary Matrix
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Direct mapping of inter-process, network, filesystem, and hardware communication pathways across all Docker components.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{
                  borderBottom: '1px solid var(--border-focus)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: 'var(--text-muted)',
                  fontSize: '0.76rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <th style={{ padding: '12px 16px' }}>Source Component</th>
                  <th style={{ padding: '12px 16px' }}>Destination Component</th>
                  <th style={{ padding: '12px 16px' }}>Mechanism / IPC Channel</th>
                  <th style={{ padding: '12px 16px' }}>Protocol & Format</th>
                  <th style={{ padding: '12px 16px' }}>Latency / Overhead</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    src: 'Docker Client (CLI)',
                    srcColor: '#38bdf8',
                    dst: 'Docker Daemon (dockerd)',
                    dstColor: '#0ea5e9',
                    mechanism: 'Unix Domain Socket (/var/run/docker.sock)',
                    protocol: 'HTTP/1.1 REST API (JSON)',
                    overhead: '< 0.5 ms (zero network stack)'
                  },
                  {
                    src: 'Docker Daemon (dockerd)',
                    srcColor: '#0ea5e9',
                    dst: 'containerd',
                    dstColor: '#6366f1',
                    mechanism: 'Unix Socket (/run/containerd/containerd.sock)',
                    protocol: 'gRPC over HTTP/2 (Protocol Buffers)',
                    overhead: '< 0.2 ms (binary proto)'
                  },
                  {
                    src: 'containerd',
                    srcColor: '#6366f1',
                    dst: 'containerd-shim',
                    dstColor: '#8b5cf6',
                    mechanism: 'fork() / clone() & TTRPC Socket',
                    protocol: 'TTRPC (low-memory RPC)',
                    overhead: '~ 5-10 ms (process spawn)'
                  },
                  {
                    src: 'containerd-shim',
                    srcColor: '#8b5cf6',
                    dst: 'runc (OCI Runtime)',
                    dstColor: '#a855f7',
                    mechanism: 'execve("/usr/bin/runc")',
                    protocol: 'OCI Runtime Specification v1.0',
                    overhead: '~ 10-15 ms (binary exec)'
                  },
                  {
                    src: 'runc (OCI Runtime)',
                    srcColor: '#a855f7',
                    dst: 'Host Linux Kernel',
                    dstColor: '#ec4899',
                    mechanism: 'clone(), unshare(), pivot_root() Syscalls',
                    protocol: 'Linux Kernel ABI (Ring 0 transition)',
                    overhead: '< 50 µs per syscall'
                  },
                  {
                    src: 'Host Linux Kernel',
                    srcColor: '#ec4899',
                    dst: 'Motherboard Silicon Hardware',
                    dstColor: '#f97316',
                    mechanism: 'CPU MMU page walks, NVMe DMA, NIC IRQs',
                    protocol: 'PCIe Gen 5 Bus, DDR5 channels',
                    overhead: 'Nanosecond silicon speed'
                  },
                  {
                    src: 'Container App (PID 1)',
                    srcColor: '#10b981',
                    dst: 'Virtual Ethernet Pair (veth)',
                    dstColor: '#eab308',
                    mechanism: 'Kernel sk_buff network packet queue',
                    protocol: 'TCP/IP Ethernet 802.3',
                    overhead: '< 10 µs (zero-copy memory)'
                  },
                  {
                    src: 'Virtual Ethernet Pair (veth)',
                    srcColor: '#eab308',
                    dst: 'Linux Bridge (docker0)',
                    dstColor: '#f59e0b',
                    mechanism: 'Bridge forwarding database (FDB)',
                    protocol: 'Layer 2 Ethernet Switching',
                    overhead: '< 5 µs'
                  },
                  {
                    src: 'Linux Bridge (docker0)',
                    srcColor: '#f59e0b',
                    dst: 'iptables / Netfilter NAT',
                    dstColor: '#ef4444',
                    mechanism: 'Netfilter kernel hooks (PREROUTING/POSTROUTING)',
                    protocol: 'DNAT & MASQUERADE (SNAT)',
                    overhead: '< 15 µs connection tracking'
                  },
                  {
                    src: 'Container App (PID 1)',
                    srcColor: '#10b981',
                    dst: 'OverlayFS Storage Driver',
                    dstColor: '#06b6d4',
                    mechanism: 'Linux VFS File Operations (read/write)',
                    protocol: 'Copy-on-Write (copy-up from lowerdir to upperdir)',
                    overhead: 'Direct NVMe speed on upperdir'
                  }
                ].map((row, idx) => (
                  <tr key={idx} style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                  }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: row.srcColor }}>
                      {row.src}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: row.dstColor }}>
                      {row.dst}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                      {row.mechanism}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                      {row.protocol}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#34d399', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                      {row.overhead}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
