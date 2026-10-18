import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  Cpu,
  HardDrive,
  Network,
  Terminal,
  Activity,
  Layers,
  ShieldCheck,
  Radio,
  Zap,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  Maximize2,
  Minimize2,
  X,
  Copy,
  Check,
  Sliders,
  Server,
  Cable,
  Boxes,
  Monitor
} from 'lucide-react';

import { OS_SIMULATION_SCENARIOS, HARDWARE_COMPONENTS } from '../../data/osData';

// ==========================================
// 1. CUSTOM NODES FOR MOTHERBOARD & OS FLOW
// ==========================================

// Shell / User Process Node
const ShellNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.35)',
    boxShadow: data.isActive ? '0 0 24px rgba(56, 189, 248, 0.7)' : '0 4px 14px rgba(0, 0, 0, 0.45)',
    minWidth: '190px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#38bdf8', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Left} style={{ background: '#38bdf8', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Terminal size={16} color="#38bdf8" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{data.sub}</div>
      </div>
    </div>
    <div style={{ fontSize: '0.72rem', color: '#bae6fd', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
      {data.detail || 'Ring 3 • User Mode Space'}
    </div>
  </div>
);

// CPU & Core Execution Node
const CpuNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.35)',
    boxShadow: data.isActive ? '0 0 24px rgba(168, 85, 247, 0.7)' : '0 4px 14px rgba(0, 0, 0, 0.45)',
    minWidth: '200px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#c084fc', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#c084fc', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#c084fc', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Top} style={{ background: '#c084fc', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Cpu size={16} color="#c084fc" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#c084fc' }}>{data.sub}</div>
      </div>
    </div>
    <div style={{ fontSize: '0.72rem', color: '#e9d5ff', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
      {data.detail || 'ALU • Registers • CR3'}
    </div>
  </div>
);

// Operating System Kernel Node (Ring 0)
const KernelNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #f472b6' : '1px solid rgba(236, 72, 153, 0.35)',
    boxShadow: data.isActive ? '0 0 24px rgba(244, 114, 182, 0.7)' : '0 4px 14px rgba(0, 0, 0, 0.45)',
    minWidth: '205px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#f472b6', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#f472b6', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#f472b6', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Top} style={{ background: '#f472b6', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(236, 72, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Layers size={16} color="#f472b6" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#f472b6' }}>{data.sub}</div>
      </div>
    </div>
    <div style={{ fontSize: '0.72rem', color: '#fbcfe8', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
      {data.detail || 'Ring 0 • Syscall & Network'}
    </div>
  </div>
);

// DDR5 RAM & Memory Controller Node
const RamNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #34d399' : '1px solid rgba(16, 185, 129, 0.35)',
    boxShadow: data.isActive ? '0 0 24px rgba(52, 211, 153, 0.7)' : '0 4px 14px rgba(0, 0, 0, 0.45)',
    minWidth: '200px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#34d399', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#34d399', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Top} style={{ background: '#34d399', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#34d399', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Boxes size={16} color="#34d399" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#34d399' }}>{data.sub}</div>
      </div>
    </div>
    <div style={{ fontSize: '0.72rem', color: '#a7f3d0', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
      {data.detail || 'DDR5 • Page Tables • sk_buff'}
    </div>
  </div>
);

// PCIe 5.0 Motherboard Bus Node
const PcieNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #818cf8' : '1px solid rgba(99, 102, 241, 0.35)',
    boxShadow: data.isActive ? '0 0 24px rgba(129, 140, 248, 0.7)' : '0 4px 14px rgba(0, 0, 0, 0.45)',
    minWidth: '200px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#818cf8', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#818cf8', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Top} style={{ background: '#818cf8', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#818cf8', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Cable size={16} color="#818cf8" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#818cf8' }}>{data.sub}</div>
      </div>
    </div>
    <div style={{ fontSize: '0.72rem', color: '#c7d2fe', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
      {data.detail || '32 GT/s • DMA Bus Master'}
    </div>
  </div>
);

// Internet Card (NIC) Node
const NicNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #fbbf24' : '1px solid rgba(245, 158, 11, 0.35)',
    boxShadow: data.isActive ? '0 0 24px rgba(251, 191, 36, 0.7)' : '0 4px 14px rgba(0, 0, 0, 0.45)',
    minWidth: '210px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#fbbf24', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#fbbf24', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Network size={16} color="#fbbf24" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#fbbf24' }}>{data.sub}</div>
      </div>
    </div>
    <div style={{ fontSize: '0.72rem', color: '#fde68a', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
      {data.detail || '10G PHY • MAC • TX/RX Ring'}
    </div>
  </div>
);

// Storage / NVMe SSD Node
const StorageNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #38bdf8' : '1px solid rgba(14, 165, 233, 0.35)',
    boxShadow: data.isActive ? '0 0 24px rgba(56, 189, 248, 0.7)' : '0 4px 14px rgba(0, 0, 0, 0.45)',
    minWidth: '200px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#38bdf8', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#38bdf8', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Top} style={{ background: '#38bdf8', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HardDrive size={16} color="#38bdf8" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#38bdf8' }}>{data.sub}</div>
      </div>
    </div>
    <div style={{ fontSize: '0.72rem', color: '#bae6fd', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
      {data.detail || 'PCIe 4.0 NVMe SSD'}
    </div>
  </div>
);

const nodeTypes = {
  shellNode: ShellNode,
  cpuNode: CpuNode,
  kernelNode: KernelNode,
  ramNode: RamNode,
  pcieNode: PcieNode,
  nicNode: NicNode,
  storageNode: StorageNode
};

export default function OSMotherboardSimulator({ activeOS = 'linux' }) {
  // Mode switcher: 'xyflow' | 'default'
  const [simulationMode, setSimulationMode] = useState('xyflow');
  const [selectedScenarioId, setSelectedScenarioId] = useState(OS_SIMULATION_SCENARIOS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedComponentId, setSelectedComponentId] = useState('hw-cpu');
  const [copiedInfo, setCopiedInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle ESC key for exiting full screen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Lock body scroll during full screen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);

  const scenario = useMemo(() => {
    return OS_SIMULATION_SCENARIOS.find(s => s.id === selectedScenarioId) || OS_SIMULATION_SCENARIOS[0];
  }, [selectedScenarioId]);

  const currentStep = scenario.steps[currentStepIndex] || scenario.steps[0];

  // Auto-play timer
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= scenario.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2600 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, scenario.steps.length]);

  // Build ReactFlow Nodes for Motherboard & OS Pipeline
  const initialNodes = useMemo(() => {
    const activeNodes = currentStep.activeNodes || [];

    return [
      {
        id: 'node-shell',
        type: 'shellNode',
        position: { x: 40, y: 140 },
        data: {
          label: activeOS === 'windows' ? 'PowerShell 7+' : 'Bash / Zsh Shell',
          sub: 'User-Space Application Process',
          detail: 'PID 4289 • Ring 3 User Mode',
          isActive: activeNodes.includes('node-shell')
        }
      },
      {
        id: 'node-cpu',
        type: 'cpuNode',
        position: { x: 310, y: 140 },
        data: {
          label: 'CPU Core Execution Unit',
          sub: 'ALU • Registers • MMU',
          detail: 'RIP=0x401020 • RSP=0x7ffd01 • CR3',
          isActive: activeNodes.includes('node-cpu')
        }
      },
      {
        id: 'node-kernel',
        type: 'kernelNode',
        position: { x: 590, y: 140 },
        data: {
          label: `${activeOS.toUpperCase()} Kernel Space`,
          sub: 'Syscalls, CFS & TCP/IP Stack',
          detail: 'Ring 0 Supervisor • sk_buff / IRP',
          isActive: activeNodes.includes('node-kernel')
        }
      },
      {
        id: 'node-ram',
        type: 'ramNode',
        position: { x: 880, y: 140 },
        data: {
          label: 'DDR5 System RAM',
          sub: 'Dual-Channel 6400 MT/s',
          detail: 'Page Tables • DMA Buffer Caches',
          isActive: activeNodes.includes('node-ram')
        }
      },
      {
        id: 'node-pcie',
        type: 'pcieNode',
        position: { x: 590, y: 340 },
        data: {
          label: 'Motherboard PCIe 5.0 Bus',
          sub: 'Root Complex & Bus Matrix',
          detail: '32 GT/s • Bus Master DMA Engine',
          isActive: activeNodes.includes('node-pcie')
        }
      },
      {
        id: 'node-nic',
        type: 'nicNode',
        position: { x: 920, y: 340 },
        data: {
          label: 'Gigabit/10G Internet Card (NIC)',
          sub: 'PCIe Add-in Card on Motherboard',
          detail: 'MAC Controller • TX/RX Rings • PHY',
          isActive: activeNodes.includes('node-nic')
        }
      },
      {
        id: 'node-storage',
        type: 'storageNode',
        position: { x: 260, y: 340 },
        data: {
          label: 'PCIe 4.0 NVMe SSD',
          sub: 'Block Storage Device',
          detail: 'Submission / Completion Queues',
          isActive: activeNodes.includes('node-storage')
        }
      }
    ];
  }, [currentStep, activeOS]);

  // Build animated edges for current step
  const initialEdges = useMemo(() => {
    const step = currentStepIndex;

    return [
      {
        id: 'e-shell-cpu',
        source: 'node-shell',
        target: 'node-cpu',
        animated: step === 0,
        style: { stroke: step === 0 ? '#38bdf8' : 'rgba(56, 189, 248, 0.3)', strokeWidth: step === 0 ? 3 : 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' }
      },
      {
        id: 'e-cpu-kernel',
        source: 'node-cpu',
        target: 'node-kernel',
        animated: step === 1,
        style: { stroke: step === 1 ? '#c084fc' : 'rgba(192, 132, 252, 0.3)', strokeWidth: step === 1 ? 3 : 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#c084fc' }
      },
      {
        id: 'e-kernel-ram',
        source: 'node-kernel',
        target: 'node-ram',
        animated: step === 2 || step === 3,
        style: { stroke: (step === 2 || step === 3) ? '#34d399' : 'rgba(52, 211, 153, 0.3)', strokeWidth: (step === 2 || step === 3) ? 3 : 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#34d399' }
      },
      {
        id: 'e-ram-pcie',
        source: 'node-ram',
        target: 'node-pcie',
        animated: step === 4,
        style: { stroke: step === 4 ? '#818cf8' : 'rgba(129, 140, 248, 0.3)', strokeWidth: step === 4 ? 3 : 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' }
      },
      {
        id: 'e-pcie-nic',
        source: 'node-pcie',
        target: 'node-nic',
        animated: step === 4 || step === 5,
        style: { stroke: (step === 4 || step === 5) ? '#fbbf24' : 'rgba(251, 191, 36, 0.3)', strokeWidth: (step === 4 || step === 5) ? 3 : 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fbbf24' }
      },
      {
        id: 'e-nic-kernel',
        source: 'node-nic',
        target: 'node-kernel',
        animated: step === 6,
        style: { stroke: step === 6 ? '#ec4899' : 'rgba(236, 72, 153, 0.3)', strokeWidth: step === 6 ? 3 : 1.5, strokeDasharray: '4 4' },
        label: step === 6 ? 'MSI-X Interrupt' : '',
        labelStyle: { fill: '#f472b6', fontSize: 10, fontWeight: 700 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' }
      },
      {
        id: 'e-storage-pcie',
        source: 'node-storage',
        target: 'node-pcie',
        animated: selectedScenarioId === 'sim-process-fork-exec' && step === 2,
        style: { stroke: 'rgba(56, 189, 248, 0.3)', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' }
      }
    ];
  }, [currentStepIndex, selectedScenarioId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Selected hardware component detail
  const selectedHw = useMemo(() => {
    return HARDWARE_COMPONENTS.find(h => h.id === selectedComponentId) || HARDWARE_COMPONENTS[0];
  }, [selectedComponentId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. TOP HEADER & SIMULATION MODE SELECTOR */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        borderRadius: '16px',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{
                background: 'rgba(168, 85, 247, 0.2)',
                color: '#c084fc',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                fontSize: '0.74rem'
              }}>
                Motherboard & Hardware Bus Simulator
              </span>
              <span className="badge" style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                fontSize: '0.74rem'
              }}>
                Dual-Mode: xyflow & Step Flow
              </span>
              <span className="badge" style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.74rem',
                textTransform: 'uppercase'
              }}>
                Active OS: {activeOS}
              </span>
            </div>

            <h1 style={{
              fontSize: '1.65rem',
              fontWeight: '800',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #ffffff, #c084fc, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Command Execution, Motherboard Buses & Internet Card Flow
            </h1>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              maxWidth: '920px',
              margin: 0,
              lineHeight: 1.5
            }}>
              Simulate low-level operating system execution: CPU register pipelines, kernel syscall interrupts, DDR5 memory translation, PCIe Direct Memory Access (DMA), and physical transmission across the Internet Card (NIC).
            </p>
          </div>

          {/* DUAL MODE SWITCHER: XYFLOW VS DEFAULT FLOW */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0,0,0,0.45)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              onClick={() => setSimulationMode('xyflow')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: simulationMode === 'xyflow' ? '700' : '500',
                color: simulationMode === 'xyflow' ? '#ffffff' : 'var(--text-muted)',
                background: simulationMode === 'xyflow' ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' : 'transparent',
                border: simulationMode === 'xyflow' ? '1px solid #c084fc' : '1px solid transparent',
                cursor: 'pointer',
                boxShadow: simulationMode === 'xyflow' ? '0 2px 12px rgba(168, 85, 247, 0.4)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Zap size={14} />
              <span>xyflow Canvas (Node Graph)</span>
            </button>

            <button
              onClick={() => setSimulationMode('default')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: simulationMode === 'default' ? '700' : '500',
                color: simulationMode === 'default' ? '#ffffff' : 'var(--text-muted)',
                background: simulationMode === 'default' ? 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)' : 'transparent',
                border: simulationMode === 'default' ? '1px solid #38bdf8' : '1px solid transparent',
                cursor: 'pointer',
                boxShadow: simulationMode === 'default' ? '0 2px 12px rgba(6, 182, 212, 0.4)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Activity size={14} />
              <span>Default Flow (Step Topology)</span>
            </button>
          </div>
        </div>

        {/* 2. SCENARIO SELECTOR CHIPS */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {OS_SIMULATION_SCENARIOS.map((sc) => {
            const isSel = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  whiteSpace: 'nowrap',
                  fontSize: '0.82rem',
                  fontWeight: isSel ? '700' : '500',
                  color: isSel ? '#ffffff' : 'var(--text-muted)',
                  background: isSel ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSel ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{sc.title}</span>
                <span style={{
                  fontSize: '0.64rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: isSel ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSel ? '#ffffff' : 'var(--text-dim)'
                }}>
                  {sc.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. STEP PLAYBACK CONTROLS BAR */}
        <div style={{
          marginTop: '16px',
          padding: '12px 18px',
          borderRadius: '12px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#a855f7',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.78rem',
              fontWeight: '800'
            }}>
              {currentStepIndex + 1}
            </span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#f8fafc' }}>
                Step {currentStepIndex + 1} of {scenario.steps.length}: {currentStep.title}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#c084fc' }}>
                Hardware: {currentStep.hardware} • Software: {currentStep.software}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Speed Multiplier */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '2px' }}>
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  style={{
                    padding: '3px 7px',
                    fontSize: '0.72rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: playbackSpeed === spd ? '#a855f7' : 'transparent',
                    color: playbackSpeed === spd ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontWeight: '700'
                  }}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Prev Button */}
            <button
              onClick={() => setCurrentStepIndex(p => Math.max(0, p - 1))}
              disabled={currentStepIndex === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: currentStepIndex === 0 ? 'var(--text-dim)' : '#ffffff',
                cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                fontSize: '0.78rem'
              }}
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                background: isPlaying ? '#ec4899' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: '700'
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause' : 'Play Flow'}</span>
            </button>

            {/* Next Button */}
            <button
              onClick={() => setCurrentStepIndex(p => Math.min(scenario.steps.length - 1, p + 1))}
              disabled={currentStepIndex === scenario.steps.length - 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: currentStepIndex === scenario.steps.length - 1 ? 'var(--text-dim)' : '#ffffff',
                cursor: currentStepIndex === scenario.steps.length - 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.78rem'
              }}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>

            {/* Reset Button */}
            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              title="Reset to initial hop"
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN VIEW CANVAS: DUAL MODE (XYFLOW OR DEFAULT FLOW) */}
      {simulationMode === 'xyflow' ? (
        <div style={{
          position: isFullscreen ? 'fixed' : 'relative',
          top: isFullscreen ? 0 : 'auto',
          left: isFullscreen ? 0 : 'auto',
          width: isFullscreen ? '100vw' : '100%',
          height: isFullscreen ? '100vh' : '560px',
          zIndex: isFullscreen ? 99999 : 1,
          borderRadius: isFullscreen ? 0 : '16px',
          border: isFullscreen ? 'none' : '1px solid rgba(168, 85, 247, 0.3)',
          background: 'radial-gradient(ellipse at center, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%)',
          overflow: 'hidden'
        }}>
          {/* Top-Right Floating Controls (Full Screen Toggle & ESC Close) */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {isFullscreen ? (
              <>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  color: '#94a3b8',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)'
                }}>
                  Press <kbd style={{ color: '#ffffff', background: 'rgba(255, 255, 255, 0.2)', padding: '2px 5px', borderRadius: '4px' }}>ESC</kbd> to exit
                </span>
                <button
                  id="xyflow-exit-fullscreen-btn"
                  onClick={() => setIsFullscreen(false)}
                  title="Close Full Screen (ESC)"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '0.78rem',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.45)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <X size={15} />
                  <span>Close (Exit Full Screen)</span>
                </button>
              </>
            ) : (
              <button
                id="xyflow-fullscreen-btn"
                onClick={() => setIsFullscreen(true)}
                title="View Graph in Full Screen"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: '#c084fc',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  fontSize: '0.76rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Maximize2 size={13} />
                <span>Full Screen</span>
              </button>
            )}
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.5}
            maxZoom={1.5}
          >
            <Background color="#7c3aed" gap={20} size={1} opacity={0.15} />
            <Controls style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
            {/* Compact MiniMap */}
            <MiniMap
              style={{
                background: 'rgba(15, 23, 42, 0.88)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                width: 105,
                height: 65
              }}
              nodeColor={(n) => {
                if (n.id === 'node-cpu') return '#c084fc';
                if (n.id === 'node-ram') return '#34d399';
                if (n.id === 'node-nic') return '#fbbf24';
                if (n.id === 'node-kernel') return '#f472b6';
                return '#38bdf8';
              }}
              zoomable={false}
              pannable={false}
            />

            {/* In-Canvas Telemetry HUD Panel */}
            <Panel position="top-center">
              <div style={{
                background: 'rgba(15, 23, 42, 0.88)',
                backdropFilter: 'blur(10px)',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: '0.82rem',
                color: '#e2e8f0',
                maxWidth: '680px'
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                <div>
                  <strong>{currentStep.action}</strong>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      ) : (
        /* DEFAULT STEP FLOW MODE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Step Narrative Card */}
          <div className="glass-panel" style={{
            padding: '20px 24px',
            borderRadius: '16px',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#38bdf8" />
                <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff' }}>
                  {currentStep.title}
                </span>
              </div>
              <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                Hop {currentStepIndex + 1} of {scenario.steps.length}
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 16px 0' }}>
              {currentStep.action}
            </p>

            {/* Telemetry Breakdown Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '14px',
              borderRadius: '10px',
              fontFamily: 'monospace',
              fontSize: '0.78rem'
            }}>
              {Object.entries(currentStep.telemetry || {}).map(([key, value]) => (
                <div key={key}>
                  <div style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.68rem', marginBottom: '2px' }}>
                    {key}
                  </div>
                  <div style={{ color: '#38bdf8', fontWeight: '700' }}>
                    {String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linear Hop Cards Pipeline */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px'
          }}>
            {scenario.steps.map((st, i) => {
              const isCurrent = i === currentStepIndex;
              const isPassed = i < currentStepIndex;
              return (
                <div
                  key={i}
                  onClick={() => setCurrentStepIndex(i)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: isCurrent
                      ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)'
                      : (isPassed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)'),
                    border: isCurrent
                      ? '1px solid #c084fc'
                      : (isPassed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)'),
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      color: isCurrent ? '#c084fc' : (isPassed ? '#34d399' : '#64748b')
                    }}>
                      HOP {i + 1}
                    </span>
                    {isPassed && <CheckCircle2 size={13} color="#34d399" />}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: isCurrent ? '#ffffff' : '#cbd5e1', marginBottom: '4px' }}>
                    {st.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {st.hardware}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. HARDWARE COMPONENT INSPECTOR DRAWER (MOTHERBOARD & INTERNET CARD) */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.85)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={20} color="#a855f7" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
              Motherboard Hardware Inspector & Bus Architecture
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Click hardware module to inspect physical properties
          </span>
        </div>

        {/* Component Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
          {HARDWARE_COMPONENTS.map((hw) => {
            const isSel = hw.id === selectedComponentId;
            return (
              <button
                key={hw.id}
                onClick={() => setSelectedComponentId(hw.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: isSel ? '700' : '500',
                  color: isSel ? '#ffffff' : 'var(--text-muted)',
                  background: isSel ? `${hw.color}25` : 'rgba(255, 255, 255, 0.04)',
                  border: isSel ? `1px solid ${hw.color}` : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {hw.name}
              </button>
            );
          })}
        </div>

        {/* Selected Component Detail Box */}
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: `1px solid ${selectedHw.color}40`,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '800', fontSize: '0.98rem', color: selectedHw.color }}>
              {selectedHw.name}
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '4px',
              background: `${selectedHw.color}20`,
              color: selectedHw.color
            }}>
              {selectedHw.category}
            </span>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
            {selectedHw.details}
          </p>
        </div>
      </div>
    </div>
  );
}
