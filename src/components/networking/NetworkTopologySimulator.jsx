import React, { useState, useEffect } from 'react';
import {
  NETWORK_TOPOLOGY_NODES,
  NETWORK_SIMULATION_FLOWS
} from '../../data/networkingData';
import {
  Laptop,
  Network,
  Router,
  Globe,
  Database,
  Server,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Radio,
  Share2,
  Cpu,
  Layers,
  Terminal,
  Info
} from 'lucide-react';

export default function NetworkTopologySimulator() {
  const [selectedFlowId, setSelectedFlowId] = useState('flow-web-request');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState('client_pc');

  const currentFlow = NETWORK_SIMULATION_FLOWS.find(f => f.id === selectedFlowId) || NETWORK_SIMULATION_FLOWS[0];
  const currentStep = currentFlow.steps[currentStepIndex] || currentFlow.steps[0];
  const totalSteps = currentFlow.steps.length;

  // Auto-play effect
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps]);

  // Reset step when flow changes
  const handleSelectFlow = (flowId) => {
    setSelectedFlowId(flowId);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
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

  const getNodeIcon = (iconName, size = 20, color = '#ffffff') => {
    switch (iconName) {
      case 'Laptop': return <Laptop size={size} color={color} />;
      case 'Network': return <Network size={size} color={color} />;
      case 'Router': return <Router size={size} color={color} />;
      case 'Globe': return <Globe size={size} color={color} />;
      case 'Database': return <Database size={size} color={color} />;
      case 'Server': return <Server size={size} color={color} />;
      default: return <Server size={size} color={color} />;
    }
  };

  const selectedNode = NETWORK_TOPOLOGY_NODES.find(n => n.id === selectedNodeId) || NETWORK_TOPOLOGY_NODES[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner: Controls & Flow Selector */}
      <div className="glass-panel" style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
              }}>
                <Network size={20} color="#ffffff" />
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  Interactive Network Packet Tracer
                  <span className="badge" style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    fontSize: '0.7rem'
                  }}>
                    Live Hop-by-Hop Trace
                  </span>
                </h2>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Simulate physical frames, IP routing, NAT rewrites, DNS resolution, and TCP/TLS socket handshakes across distributed network devices.
                </p>
              </div>
            </div>
          </div>

          {/* Stepper Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '7px 12px',
                fontSize: '0.82rem',
                opacity: currentStepIndex === 0 ? 0.4 : 1,
                cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={16} />
              Prev Hop
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                fontSize: '0.82rem',
                background: isPlaying
                  ? 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)'
                  : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                boxShadow: isPlaying ? '0 0 14px rgba(244, 63, 94, 0.4)' : '0 0 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              {isPlaying ? 'Pause' : 'Auto Play'}
            </button>

            <button
              onClick={handleNextStep}
              disabled={currentStepIndex === totalSteps - 1}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '7px 12px',
                fontSize: '0.82rem',
                opacity: currentStepIndex === totalSteps - 1 ? 0.4 : 1,
                cursor: currentStepIndex === totalSteps - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Next Hop
              <ChevronRight size={16} />
            </button>

            <button
              onClick={handleReset}
              className="btn btn-secondary"
              title="Reset Packet to Origin"
              style={{ padding: '7px 10px', fontSize: '0.82rem' }}
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Flow Selection Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '10px'
        }}>
          {NETWORK_SIMULATION_FLOWS.map((flow) => {
            const isSelected = flow.id === selectedFlowId;
            return (
              <div
                key={flow.id}
                onClick={() => handleSelectFlow(flow.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                  border: isSelected ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 16px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: isSelected ? '#34d399' : '#e2e8f0'
                  }}>
                    {flow.title}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: isSelected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                    color: isSelected ? '#ffffff' : 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {flow.steps.length} Hops
                  </span>
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: isSelected ? '#a7f3d0' : 'var(--text-dim)',
                  marginBottom: '6px'
                }}>
                  $ {flow.command}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {flow.summary}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Visual Topology Canvas */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(7, 10, 18, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Topology Diagram Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          paddingBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={16} color="#34d399" />
            <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff' }}>
              Physical & Logical Topology Layout
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              (Click any node to inspect device details & routing table)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)'
            }}>
              Hop {currentStepIndex + 1} of {totalSteps}
            </span>
            <div style={{
              width: '120px',
              height: '6px',
              borderRadius: '3px',
              background: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
                background: 'linear-gradient(90deg, #059669 0%, #34d399 100%)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Distributed Nodes Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '14px',
          position: 'relative',
          padding: '10px 0'
        }}>
          {NETWORK_TOPOLOGY_NODES.map((node, idx) => {
            const isSource = currentStep.source === node.id;
            const isTarget = currentStep.target === node.id;
            const isSelected = selectedNodeId === node.id;
            const isActiveInHop = isSource || isTarget;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 12px',
                  borderRadius: '12px',
                  background: isActiveInHop
                    ? (isSource ? 'rgba(56, 189, 248, 0.12)' : 'rgba(16, 185, 129, 0.15)')
                    : (isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.6)'),
                  border: isSource
                    ? '2px solid #38bdf8'
                    : isTarget
                    ? '2px solid #10b981'
                    : isSelected
                    ? '1px solid rgba(255, 255, 255, 0.25)'
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: isSource
                    ? '0 0 20px rgba(56, 189, 248, 0.35)'
                    : isTarget
                    ? '0 0 20px rgba(16, 185, 129, 0.35)'
                    : 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.25s ease',
                  textAlign: 'center'
                }}
              >
                {/* Active Packet Indicator Pill */}
                {isSource && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(2, 132, 199, 0.6)'
                  }}>
                    TRANSMITTER (SRC)
                  </div>
                )}
                {isTarget && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    background: '#059669',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(5, 150, 105, 0.6)'
                  }}>
                    RECEIVER (DST)
                  </div>
                )}

                {/* Node Icon Box */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${node.color}33 0%, ${node.color}11 100%)`,
                  border: `1px solid ${node.color}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  boxShadow: `0 0 14px ${node.color}22`
                }}>
                  {getNodeIcon(node.iconName, 22, node.color)}
                </div>

                {/* Node Name */}
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '4px',
                  lineHeight: '1.2'
                }}>
                  {node.name}
                </span>

                {/* Node IP or Type */}
                <span style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: node.color,
                  marginBottom: '4px'
                }}>
                  {node.ip || node.lanIp || node.asn}
                </span>

                {/* Node Subnet or MAC */}
                <span style={{
                  fontSize: '0.64rem',
                  color: 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {node.mac ? node.mac : (node.ports ? `Ports: ${node.ports.join(', ')}` : node.subnet)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live In-Flight Packet Inspector Card */}
        <div style={{
          marginTop: '20px',
          padding: '16px 20px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge" style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                fontSize: '0.72rem',
                fontWeight: '700'
              }}>
                {currentStep.protocolBadge}
              </span>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#ffffff',
                margin: 0
              }}>
                {currentStep.title}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Layer:</span>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: '600',
                color: '#34d399',
                fontFamily: 'var(--font-mono)'
              }}>
                {currentStep.osiLayer}
              </span>
            </div>
          </div>

          <p style={{
            margin: 0,
            fontSize: '0.84rem',
            color: '#e2e8f0',
            lineHeight: '1.5'
          }}>
            {currentStep.description}
          </p>

          {/* Captured Packet Frame Inspector */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            overflowX: 'auto'
          }}>
            <Radio size={15} color="#34d399" />
            <span style={{ color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.68rem', fontWeight: '700' }}>
              Payload Wire Capture:
            </span>
            <span style={{ color: '#38bdf8' }}>
              {currentStep.packetPayload}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Node Detail Inspector & Packet State Flow */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.2fr)',
        gap: '20px'
      }}>
        {/* Left: Selected Node Hardware & Kernel Interface Specs */}
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Cpu size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '0.96rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Device Subsystem Inspector: {selectedNode.name}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.3)',
              fontSize: '0.78rem'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Device Category:</span>
              <span style={{ color: '#ffffff', fontWeight: '600', textTransform: 'capitalize' }}>{selectedNode.type}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.3)',
              fontSize: '0.78rem'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>IP Configuration:</span>
              <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                {selectedNode.ip || (selectedNode.lanIp ? `LAN: ${selectedNode.lanIp} | WAN: ${selectedNode.wanIp}` : 'N/A (L2 Switching)')}
              </span>
            </div>

            {selectedNode.mac && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                fontSize: '0.78rem'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Hardware MAC (EUI-48):</span>
                <span style={{ color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>{selectedNode.mac}</span>
              </div>
            )}

            {selectedNode.gateway && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                fontSize: '0.78rem'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Default Gateway:</span>
                <span style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>{selectedNode.gateway}</span>
              </div>
            )}

            <div style={{
              marginTop: '6px',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.05)',
              border: '1px solid rgba(56, 189, 248, 0.15)',
              fontSize: '0.76rem',
              color: 'var(--text-muted)',
              lineHeight: '1.45'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: '600', marginBottom: '4px' }}>
                <Info size={14} /> Device Role & Architecture:
              </div>
              {selectedNode.description}
            </div>
          </div>
        </div>

        {/* Right: Hop Timeline Execution Log */}
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={18} color="#10b981" />
              <h3 style={{ fontSize: '0.96rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                Packet Hop Progression Sequence
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Click any hop to inspect
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto' }}>
            {currentFlow.steps.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;

              return (
                <div
                  key={step.stepNumber}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setIsPlaying(false);
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: isCurrent
                      ? 'rgba(16, 185, 129, 0.2)'
                      : isPast
                      ? 'rgba(255, 255, 255, 0.04)'
                      : 'rgba(0, 0, 0, 0.2)',
                    border: isCurrent
                      ? '1px solid #10b981'
                      : '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isCurrent
                      ? '#10b981'
                      : isPast
                      ? '#059669'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {step.stepNumber}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.8rem',
                      fontWeight: isCurrent ? '700' : '500',
                      color: isCurrent ? '#ffffff' : (isPast ? '#cbd5e1' : 'var(--text-muted)'),
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      {step.protocolBadge} • {step.osiLayer.split('(')[0]}
                    </div>
                  </div>

                  {isCurrent && (
                    <span style={{
                      fontSize: '0.65rem',
                      color: '#34d399',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      Current
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
