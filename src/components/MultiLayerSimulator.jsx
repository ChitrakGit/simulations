import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Terminal, 
  Cpu, 
  Server, 
  Box, 
  Microchip, 
  Zap, 
  Activity, 
  Shield, 
  CheckCircle2
} from 'lucide-react';
import { ARCHITECTURE_LAYERS } from '../data/dockerCommands';

export default function MultiLayerSimulator({ 
  command, 
  allCommands,
  onSelectCommand 
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5, 1, 2
  const [activeInspectorTab, setActiveInspectorTab] = useState('trace'); // trace, hardware, architecture
  const [selectedLayerDetail, setSelectedLayerDetail] = useState(null);

  const steps = command?.simulation?.steps || [];
  const activeStep = steps[currentStepIndex] || steps[0];

  // Auto-playback timer
  useEffect(() => {
    let timer;
    if (isPlaying && steps.length > 0) {
      const stepDuration = 2800 / playbackSpeed;
      timer = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, stepDuration);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed]);

  // Reset to step 0 when command changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [command?.id]);

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const getLayerIcon = (id, size = 18) => {
    switch (id) {
      case 'client': return <Terminal size={size} />;
      case 'host': return <Server size={size} />;
      case 'kernel': return <Cpu size={size} />;
      case 'motherboard': return <Microchip size={size} />;
      case 'app': return <Box size={size} />;
      default: return <Activity size={size} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Controller Bar */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Command Selector & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
          }}>
            <Zap size={22} color="white" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Simulating Command:</span>
              <span className={`badge badge-${command?.category || 'basic'}`}>
                {command?.category}
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.94rem',
              fontWeight: '600',
              color: '#38bdf8'
            }}>
              $ {command?.command}
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Quick Command Dropdown */}
          <select
            value={command?.id}
            onChange={(e) => {
              const found = allCommands.find(c => c.id === e.target.value);
              if (found) onSelectCommand(found);
            }}
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontFamily: 'inherit',
              outline: 'none',
              maxWidth: '220px'
            }}
          >
            {allCommands.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#0b0f19' }}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Speed Controller */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            padding: '2px'
          }}>
            {[0.5, 1, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: playbackSpeed === speed ? '700' : '400',
                  color: playbackSpeed === speed ? '#38bdf8' : 'var(--text-dim)',
                  background: playbackSpeed === speed ? 'rgba(56, 189, 248, 0.15)' : 'transparent'
                }}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Step Back */}
          <button
            onClick={handleStepBack}
            disabled={currentStepIndex === 0}
            className="btn-secondary"
            style={{ padding: '7px 10px', opacity: currentStepIndex === 0 ? 0.4 : 1 }}
            title="Step Back"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn-primary"
            style={{ padding: '7px 16px', minWidth: '95px' }}
          >
            {isPlaying ? (
              <>
                <Pause size={15} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={15} />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={handleStepForward}
            disabled={currentStepIndex === steps.length - 1}
            className="btn-secondary"
            style={{ padding: '7px 10px', opacity: currentStepIndex === steps.length - 1 ? 0.4 : 1 }}
            title="Step Forward"
          >
            <ChevronRight size={16} />
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="btn-secondary"
            style={{ padding: '7px 10px' }}
            title="Reset Simulation"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Progress Bar of Simulation Stages */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0 4px'
      }}>
        {steps.map((st, i) => {
          const isPassed = i <= currentStepIndex;
          const isCurrent = i === currentStepIndex;
          return (
            <div
              key={i}
              onClick={() => {
                setCurrentStepIndex(i);
                setIsPlaying(false);
              }}
              style={{
                flex: 1,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{
                height: '6px',
                borderRadius: '3px',
                background: isCurrent 
                  ? 'linear-gradient(to right, #0db7ed, #a855f7)' 
                  : isPassed 
                    ? '#0db7ed' 
                    : 'rgba(255, 255, 255, 0.1)',
                boxShadow: isCurrent ? '0 0 10px rgba(13, 183, 237, 0.7)' : 'none',
                transition: 'all 0.3s ease'
              }} />
              <span style={{
                fontSize: '0.68rem',
                color: isCurrent ? '#38bdf8' : isPassed ? 'var(--text-muted)' : 'var(--text-dim)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: isCurrent ? '600' : '400'
              }}>
                {i + 1}. {st.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Simulation Viewport: 2 Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.25fr)',
        gap: '20px'
      }}>
        {/* Left Column: Vertical Multi-Layer Stack Diagram */}
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Activity size={14} color="#38bdf8" />
              Hierarchical Architecture Stack
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Click any layer to inspect internals
            </span>
          </div>

          {/* 5 Architecture Layer Cards */}
          {ARCHITECTURE_LAYERS.map((layer) => {
            const isCurrentlyActive = activeStep?.layerId === layer.id;
            return (
              <div
                key={layer.id}
                onClick={() => setSelectedLayerDetail(layer)}
                style={{
                  background: isCurrentlyActive 
                    ? 'rgba(14, 165, 233, 0.16)' 
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isCurrentlyActive 
                    ? `1.5px solid ${layer.color}` 
                    : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: isCurrentlyActive ? `0 0 25px ${layer.glow}` : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isCurrentlyActive ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                {/* Active Pulse Ring */}
                {isCurrentlyActive && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      color: layer.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      ACTIVE STAGE
                    </span>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: layer.color,
                      boxShadow: `0 0 8px ${layer.color}`
                    }} className="pulse-glow" />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: isCurrentlyActive ? layer.color : 'rgba(255, 255, 255, 0.06)',
                    color: isCurrentlyActive ? '#ffffff' : layer.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isCurrentlyActive ? `0 0 14px ${layer.color}` : 'none'
                  }}>
                    {getLayerIcon(layer.id)}
                  </div>

                  <div>
                    <div style={{
                      fontWeight: '700',
                      fontSize: '0.92rem',
                      color: isCurrentlyActive ? '#ffffff' : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {layer.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isCurrentlyActive ? layer.color : 'var(--text-dim)', fontWeight: '500' }}>
                      {layer.sub}
                    </div>
                  </div>
                </div>

                {/* Micro Description */}
                <div style={{
                  fontSize: '0.76rem',
                  color: isCurrentlyActive ? 'var(--text-main)' : 'var(--text-muted)',
                  marginTop: '8px',
                  lineHeight: 1.4
                }}>
                  {layer.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Step Execution Breakdown & Live Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Active Step Highlight Card */}
          <div className="glass-panel" style={{
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            background: 'linear-gradient(135deg, rgba(13, 19, 34, 0.85) 0%, rgba(19, 28, 49, 0.95) 100%)',
            boxShadow: '0 0 25px rgba(13, 183, 237, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-basic" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  Stage {currentStepIndex + 1} of {steps.length}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Layer: {activeStep?.layerName}
                </span>
              </div>

              {activeStep?.statusBadge && (
                <span style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  color: '#c084fc',
                  fontWeight: '600',
                  border: '1px solid rgba(168, 85, 247, 0.3)'
                }}>
                  {activeStep.statusBadge}
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
              {activeStep?.title}
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              {activeStep?.description}
            </p>
          </div>

          {/* Inspector Tabs (Trace Logs / Hardware & PMU / Architectural Guide) */}
          <div className="glass-panel" style={{
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Inspector Tab Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'rgba(0, 0, 0, 0.4)'
            }}>
              <button
                onClick={() => setActiveInspectorTab('trace')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  fontSize: '0.8rem',
                  fontWeight: activeInspectorTab === 'trace' ? '600' : '400',
                  color: activeInspectorTab === 'trace' ? '#38bdf8' : 'var(--text-muted)',
                  borderBottom: activeInspectorTab === 'trace' ? '2px solid #38bdf8' : '2px solid transparent',
                  background: activeInspectorTab === 'trace' ? 'rgba(56, 189, 248, 0.08)' : 'transparent'
                }}
              >
                <Terminal size={14} />
                <span>Kernel strace & dmesg Trace</span>
              </button>

              <button
                onClick={() => setActiveInspectorTab('hardware')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  fontSize: '0.8rem',
                  fontWeight: activeInspectorTab === 'hardware' ? '600' : '400',
                  color: activeInspectorTab === 'hardware' ? '#f59e0b' : 'var(--text-muted)',
                  borderBottom: activeInspectorTab === 'hardware' ? '2px solid #f59e0b' : '2px solid transparent',
                  background: activeInspectorTab === 'hardware' ? 'rgba(245, 158, 11, 0.08)' : 'transparent'
                }}
              >
                <Microchip size={14} />
                <span>Motherboard Bus & Ring 0 Activity</span>
              </button>

              <button
                onClick={() => setActiveInspectorTab('architecture')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  fontSize: '0.8rem',
                  fontWeight: activeInspectorTab === 'architecture' ? '600' : '400',
                  color: activeInspectorTab === 'architecture' ? '#a855f7' : 'var(--text-muted)',
                  borderBottom: activeInspectorTab === 'architecture' ? '2px solid #a855f7' : '2px solid transparent',
                  background: activeInspectorTab === 'architecture' ? 'rgba(168, 85, 247, 0.08)' : 'transparent'
                }}
              >
                <Shield size={14} />
                <span>Namespaces & Cgroups Specs</span>
              </button>
            </div>

            {/* Inspector Tab Content View */}
            <div style={{ padding: '16px', minHeight: '190px' }}>
              {activeInspectorTab === 'trace' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      Synchronized OS Syscall Intercepts (PID {14800 + currentStepIndex * 20})
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Syscall Succeeded
                    </span>
                  </div>

                  <pre style={{
                    background: '#040711',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.8rem',
                    color: '#7dd3fc',
                    lineHeight: 1.6,
                    margin: 0,
                    overflowX: 'auto'
                  }}>
                    {activeStep?.kernelLogs || '// Initializing kernel trace...'}
                  </pre>
                </div>
              )}

              {activeInspectorTab === 'hardware' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '10px'
                  }}>
                    <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>CPU Privilege Mode</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f59e0b' }}>
                        {activeStep?.layerId === 'motherboard' || activeStep?.layerId === 'kernel' ? 'Ring 0 (Kernel)' : 'Ring 3 (User Space)'}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Memory Controller</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#38bdf8' }}>
                        MMU Page Tables Active
                      </div>
                    </div>

                    <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Storage Controller</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#10b981' }}>
                        PCIe NVMe DMA Direct
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.06)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    fontSize: '0.82rem',
                    color: '#fde68a'
                  }}>
                    <strong>Hardware Activity:</strong> {activeStep?.hardwareActivity || 'Direct hardware clock cycles and memory allocation.'}
                  </div>
                </div>
              )}

              {activeInspectorTab === 'architecture' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ color: '#a855f7', fontWeight: '600' }}>PID Namespace:</span> Isolated container process tree
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ color: '#0db7ed', fontWeight: '600' }}>NET Namespace:</span> Virtual eth0 + docker0 bridge
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>MNT Namespace:</span> OverlayFS layered rootfs
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ color: '#f59e0b', fontWeight: '600' }}>Cgroups v2:</span> CFS CPU throttle & RAM ceilings
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Layer Detail Drawer Modal */}
      {selectedLayerDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '600px',
            width: '100%',
            padding: '28px',
            borderRadius: '20px',
            border: `1.5px solid ${selectedLayerDetail.color}`,
            boxShadow: `0 0 35px ${selectedLayerDetail.glow}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: selectedLayerDetail.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getLayerIcon(selectedLayerDetail.id, 22)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    {selectedLayerDetail.name}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: selectedLayerDetail.color }}>
                    {selectedLayerDetail.sub}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedLayerDetail(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-main)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              {selectedLayerDetail.desc}
            </p>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5
            }}>
              <strong style={{ color: 'var(--text-main)' }}>Role in Containerization:</strong> In Docker\'s architecture, this tier guarantees that user applications remain completely isolated while sharing the host bare-metal performance without hypervisor guest OS emulation overhead.
            </div>

            <button
              onClick={() => setSelectedLayerDetail(null)}
              className="btn-primary"
              style={{ alignSelf: 'flex-end', marginTop: '8px' }}
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
