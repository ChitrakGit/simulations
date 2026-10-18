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
  Terminal,
  Server,
  Layers,
  Network,
  Cpu,
  HardDrive,
  Shield,
  Activity,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Info,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Globe,
  Sliders,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';

// ==========================================
// 1. CUSTOM NODE COMPONENTS FOR DOCKER FLOW
// ==========================================

// Custom Node: Client / User
const ClientNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)',
    border: selected || data.isActive ? '2px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.4)',
    boxShadow: data.isActive ? '0 0 20px rgba(56, 189, 248, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.4)',
    minWidth: '180px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#38bdf8', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Left} style={{ background: '#38bdf8', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Terminal size={16} color="#38bdf8" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{data.sub}</div>
      </div>
    </div>
    {data.detail && (
      <div style={{ fontSize: '0.72rem', color: '#cbd5e1', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
        {data.detail}
      </div>
    )}
  </div>
);

// Custom Node: Daemon / Middleware
const DaemonNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)',
    border: selected || data.isActive ? '2px solid #0ea5e9' : '1px solid rgba(14, 165, 233, 0.4)',
    boxShadow: data.isActive ? '0 0 20px rgba(14, 165, 233, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.4)',
    minWidth: '200px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#0ea5e9', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#0ea5e9', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#0ea5e9', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Top} style={{ background: '#0ea5e9', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Server size={16} color="#0ea5e9" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{data.sub}</div>
      </div>
    </div>
    {data.detail && (
      <div style={{ fontSize: '0.72rem', color: '#a7f3d0', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
        {data.detail}
      </div>
    )}
  </div>
);

// Custom Node: Networking (iptables / Bridge / veth)
const NetworkNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)',
    border: selected || data.isActive ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.4)',
    boxShadow: data.isActive ? '0 0 20px rgba(16, 185, 129, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.4)',
    minWidth: '200px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#10b981', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#10b981', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Top} style={{ background: '#10b981', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#10b981', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Network size={16} color="#34d399" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{data.sub}</div>
      </div>
    </div>
    {data.detail && (
      <div style={{ fontSize: '0.72rem', color: '#fef08a', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
        {data.detail}
      </div>
    )}
  </div>
);

// Custom Node: Image Layer / Storage (OverlayFS)
const ImageLayerNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
    border: selected || data.isActive ? '2px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.4)',
    boxShadow: data.isActive ? '0 0 20px rgba(245, 158, 11, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.4)',
    minWidth: '210px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#f59e0b', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#f59e0b', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Top} style={{ background: '#f59e0b', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Bottom} style={{ background: '#f59e0b', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Layers size={16} color="#fbbf24" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{data.sub}</div>
      </div>
    </div>
    {data.detail && (
      <div style={{ fontSize: '0.72rem', color: '#fca5a5', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
        {data.detail}
      </div>
    )}
  </div>
);

// Custom Node: Container Instance
const ContainerNode = ({ data, selected }) => (
  <div style={{
    padding: '14px 18px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #a855f7' : '1px solid rgba(168, 85, 247, 0.4)',
    boxShadow: data.isActive ? '0 0 25px rgba(168, 85, 247, 0.7)' : '0 6px 16px rgba(0, 0, 0, 0.5)',
    minWidth: '220px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#a855f7', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#a855f7', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Top} style={{ background: '#a855f7', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#a855f7', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(168, 85, 247, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Zap size={18} color="#c084fc" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.92rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.7rem', color: '#c084fc' }}>{data.sub}</div>
      </div>
    </div>
    {data.detail && (
      <div style={{ fontSize: '0.74rem', color: '#a7f3d0', background: 'rgba(0,0,0,0.5)', padding: '6px 10px', borderRadius: 6, fontFamily: 'monospace' }}>
        {data.detail}
      </div>
    )}
  </div>
);

const nodeTypes = {
  client: ClientNode,
  daemon: DaemonNode,
  network: NetworkNode,
  imageLayer: ImageLayerNode,
  container: ContainerNode
};

// ==========================================
// 2. SIMULATION SCENARIO DEFINITIONS
// ==========================================

export default function DockerXYFlowSimulator() {
  const [activeScenario, setActiveScenario] = useState('networking'); // 'networking' | 'image-to-container' | 'unified'
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState(null);
  const [copiedSnippet, setCopiedSnippet] = useState(null);
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

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // Scenario 1: Docker Ingress Networking & Port Forwarding
  const NETWORKING_SCENARIO = useMemo(() => {
    const rawNodes = [
      {
        id: 'external-client',
        type: 'client',
        position: { x: 50, y: 150 },
        data: {
          label: '1. External Browser / Client',
          sub: 'Public Internet Traffic',
          detail: 'GET http://host:8080/ (TCP SYN)',
          tech: 'Physical user machine or remote curl client initiating inbound HTTP connection to host IP on port 8080.'
        }
      },
      {
        id: 'host-nic',
        type: 'network',
        position: { x: 320, y: 150 },
        data: {
          label: '2. Host Physical NIC (eth0)',
          sub: 'Linux Ingress Interface',
          detail: 'IP: 192.168.1.100:8080',
          tech: 'Receives the Ethernet frame. The Linux kernel parses the IP/TCP header and passes it to Netfilter hook.'
        }
      },
      {
        id: 'iptables-dnat',
        type: 'network',
        position: { x: 600, y: 150 },
        data: {
          label: '3. iptables Netfilter (DNAT)',
          sub: 'DOCKER Chain PREROUTING',
          detail: 'DNAT: 8080 ➔ 172.17.0.2:80',
          tech: 'Docker installs a PREROUTING DNAT rule. Packets arriving at host port 8080 have their destination IP rewritten to container private IP 172.17.0.2:80.'
        }
      },
      {
        id: 'docker0-bridge',
        type: 'network',
        position: { x: 880, y: 150 },
        data: {
          label: '4. Linux Bridge (docker0)',
          sub: 'Software Layer 2 Switch',
          detail: '172.17.0.1/16 (Bridge MAC Table)',
          tech: 'Linux kernel virtual Ethernet switch. Forwards Layer 2 Ethernet frames based on target container MAC address to the veth endpoint.'
        }
      },
      {
        id: 'veth-pair',
        type: 'network',
        position: { x: 880, y: 340 },
        data: {
          label: '5. Virtual Ethernet (veth pair)',
          sub: 'Bidirectional Virtual Wire',
          detail: 'vethXXXX (Host) ⇄ eth0 (Container)',
          tech: 'Two peer virtual interfaces created in tandem. Packets injected into vethXXXX on the host bridge emerge inside container eth0 instantly.'
        }
      },
      {
        id: 'container-netns',
        type: 'daemon',
        position: { x: 580, y: 340 },
        data: {
          label: '6. Container Network NS (NETNS)',
          sub: 'Isolated Network Stack',
          detail: 'eth0: 172.17.0.2/16 | lo: 127.0.0.1',
          tech: 'Isolated network namespace partitioned by clone(CLONE_NEWNET). Owns its private loopback, interface routing table, and socket descriptors.'
        }
      },
      {
        id: 'container-app',
        type: 'container',
        position: { x: 280, y: 340 },
        data: {
          label: '7. Container Web Server (nginx)',
          sub: 'Application Socket Listener',
          detail: 'Listening on 0.0.0.0:80 (PID 1)',
          tech: 'Processes the HTTP request payload and streams back the HTTP 200 OK response through the veth wire back to the client.'
        }
      }
    ];

    const rawEdges = [
      { id: 'e1', source: 'external-client', target: 'host-nic', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
      { id: 'e2', source: 'host-nic', target: 'iptables-dnat', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },
      { id: 'e3', source: 'iptables-dnat', target: 'docker0-bridge', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },
      { id: 'e4', source: 'docker0-bridge', target: 'veth-pair', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
      { id: 'e5', source: 'veth-pair', target: 'container-netns', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } },
      { id: 'e6', source: 'container-netns', target: 'container-app', animated: true, style: { stroke: '#c084fc', strokeWidth: 2 } }
    ];

    const steps = [
      {
        title: 'Step 1: Client Inbound Request',
        nodeId: 'external-client',
        edgeId: 'e1',
        desc: 'Browser generates an HTTP GET request packet addressed to http://192.168.1.100:8080/.'
      },
      {
        title: 'Step 2: Host Physical Interface Ingress',
        nodeId: 'host-nic',
        edgeId: 'e2',
        desc: 'Host network card receives frame. Linux kernel initiates packet routing through Netfilter PREROUTING table.'
      },
      {
        title: 'Step 3: Netfilter DNAT Rewriting',
        nodeId: 'iptables-dnat',
        edgeId: 'e3',
        desc: 'iptables rule matches destination port 8080 and replaces destination IP with container IP 172.17.0.2:80.'
      },
      {
        title: 'Step 4: docker0 Bridge Forwarding',
        nodeId: 'docker0-bridge',
        edgeId: 'e4',
        desc: 'Bridge inspects ARP/FDB table and dispatches the Ethernet frame into the connected veth peer port.'
      },
      {
        title: 'Step 5: veth Tunnel Traversal',
        nodeId: 'veth-pair',
        edgeId: 'e5',
        desc: 'Frame traverses the virtual ethernet cable crossing the boundary between host root namespace and container namespace.'
      },
      {
        title: 'Step 6: Container NETNS Reception',
        nodeId: 'container-netns',
        edgeId: 'e6',
        desc: 'Container kernel stack receives packet on eth0, unwraps TCP header, and signals the listening socket.'
      },
      {
        title: 'Step 7: Application Socket Servicing',
        nodeId: 'container-app',
        edgeId: null,
        desc: 'Nginx process accepts socket connection, handles HTTP request, and transmits HTTP 200 OK response.'
      }
    ];

    return { rawNodes, rawEdges, steps };
  }, []);

  // Scenario 2: Docker Image to Container Lifecycle Flow
  const IMAGE_CONTAINER_SCENARIO = useMemo(() => {
    const rawNodes = [
      {
        id: 'docker-cli',
        type: 'client',
        position: { x: 50, y: 120 },
        data: {
          label: '1. Docker CLI (Client)',
          sub: 'User Command Line',
          detail: 'docker run -d -p 80:80 my-app',
          tech: 'Parses command line flags, serializes JSON HTTP request, sends over /var/run/docker.sock.'
        }
      },
      {
        id: 'dockerd',
        type: 'daemon',
        position: { x: 340, y: 120 },
        data: {
          label: '2. Docker Engine (dockerd)',
          sub: 'Daemon REST API',
          detail: 'POST /v1.44/containers/create',
          tech: 'Authenticates request, checks local image cache, dispatches container lifecycle task to containerd over gRPC.'
        }
      },
      {
        id: 'containerd',
        type: 'daemon',
        position: { x: 640, y: 120 },
        data: {
          label: '3. containerd Daemon',
          sub: 'Container Supervisor',
          detail: 'gRPC Container Service',
          tech: 'Manages OCI image unpack, snapshot storage plugins (OverlayFS), and delegates execution to OCI runc.'
        }
      },
      {
        id: 'image-layers',
        type: 'imageLayer',
        position: { x: 940, y: 120 },
        data: {
          label: '4. Image Layers (lowerdir)',
          sub: 'OverlayFS Read-Only Storage',
          detail: '/var/lib/docker/overlay2/[hash]',
          tech: 'Stacked immutable image tarball layers containing base Alpine Linux OS, Node.js runtime, and compiled app files.'
        }
      },
      {
        id: 'runc-engine',
        type: 'daemon',
        position: { x: 940, y: 320 },
        data: {
          label: '5. OCI runc Runtime',
          sub: 'Low-Level Kernel Invoker',
          detail: 'Syscalls: clone(), pivot_root()',
          tech: 'Low-level OCI CLI that calls Linux kernel syscalls to create namespaces (PID, NET, MNT, UTS, IPC) and cgroups.'
        }
      },
      {
        id: 'cgroups-v2',
        type: 'network',
        position: { x: 640, y: 320 },
        data: {
          label: '6. Linux cgroups v2 & Security',
          sub: 'Resource & Syscall Bounding',
          detail: 'Memory: 512m | CPUs: 1.5 | Seccomp',
          tech: 'Applies hardware boundaries to /sys/fs/cgroup/ and attaches Seccomp BPF filter to restrict privileged syscalls.'
        }
      },
      {
        id: 'container-instance',
        type: 'container',
        position: { x: 340, y: 320 },
        data: {
          label: '7. Running Container (PID 1)',
          sub: 'upperdir Writable Scratch',
          detail: 'Merged RootFS View (OverlayFS)',
          tech: 'Container process boots inside isolated rootfs. Read operations access lowerdir; write operations save to upperdir via CoW.'
        }
      }
    ];

    const rawEdges = [
      { id: 'e1', source: 'docker-cli', target: 'dockerd', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
      { id: 'e2', source: 'dockerd', target: 'containerd', animated: true, style: { stroke: '#0ea5e9', strokeWidth: 2 } },
      { id: 'e3', source: 'containerd', target: 'image-layers', animated: true, style: { stroke: '#fbbf24', strokeWidth: 2 } },
      { id: 'e4', source: 'image-layers', target: 'runc-engine', animated: true, style: { stroke: '#fbbf24', strokeWidth: 2 } },
      { id: 'e5', source: 'runc-engine', target: 'cgroups-v2', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
      { id: 'e6', source: 'cgroups-v2', target: 'container-instance', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } }
    ];

    const steps = [
      {
        title: 'Step 1: User Command Dispatched',
        nodeId: 'docker-cli',
        edgeId: 'e1',
        desc: 'CLI serializes user flags into an HTTP POST request and writes it to the Unix socket /var/run/docker.sock.'
      },
      {
        title: 'Step 2: dockerd Routing & Validation',
        nodeId: 'dockerd',
        edgeId: 'e2',
        desc: 'Docker daemon authenticates client, allocates metadata ID, and dispatches container creation to containerd.'
      },
      {
        title: 'Step 3: containerd Layer Assembly',
        nodeId: 'containerd',
        edgeId: 'e3',
        desc: 'containerd asks OverlayFS snapshotter to mount the lowerdir read-only image layers into a unified rootfs.'
      },
      {
        title: 'Step 4: OverlayFS Layer Stacking',
        nodeId: 'image-layers',
        edgeId: 'e4',
        desc: 'Kernel mounts lowerdir diffs together and creates a dedicated upperdir for ephemeral container writes.'
      },
      {
        title: 'Step 5: OCI runc Syscall Execution',
        nodeId: 'runc-engine',
        edgeId: 'e5',
        desc: 'runc executes clone(CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWNS) and pivot_root() into the OverlayFS rootfs.'
      },
      {
        title: 'Step 6: cgroups v2 Hardware Limiting',
        nodeId: 'cgroups-v2',
        edgeId: 'e6',
        desc: 'Kernel binds process PID to cgroups controllers (memory.max, cpu.max) and drops unneeded capabilities.'
      },
      {
        title: 'Step 7: Container Active Execution',
        nodeId: 'container-instance',
        edgeId: null,
        desc: 'Process executes application entrypoint as PID 1. The container is now in the "Running" state!'
      }
    ];

    return { rawNodes, rawEdges, steps };
  }, []);

  // Scenario 3: Unified End-to-End Topology (Network + Image + Container)
  const UNIFIED_SCENARIO = useMemo(() => {
    const rawNodes = [
      {
        id: 'u-client',
        type: 'client',
        position: { x: 50, y: 80 },
        data: {
          label: 'Client Browser',
          sub: 'Inbound Request',
          detail: 'http://localhost:8080',
          tech: 'User browser hitting public host port.'
        }
      },
      {
        id: 'u-dnat',
        type: 'network',
        position: { x: 300, y: 80 },
        data: {
          label: 'iptables DNAT',
          sub: 'Port Forwarding',
          detail: ':8080 ➔ 172.17.0.2:80',
          tech: 'Netfilter translates host port 8080 into container private port 80.'
        }
      },
      {
        id: 'u-bridge',
        type: 'network',
        position: { x: 550, y: 80 },
        data: {
          label: 'docker0 Bridge',
          sub: 'Virtual L2 Switch',
          detail: '172.17.0.1/16',
          tech: 'Routes Ethernet frames to container virtual interface.'
        }
      },
      {
        id: 'u-veth',
        type: 'network',
        position: { x: 800, y: 80 },
        data: {
          label: 'veth Pair (Virtual Wire)',
          sub: 'Kernel Tunnel',
          detail: 'vethXXXX ⇄ eth0',
          tech: 'Direct virtual cable bridging host to container namespace.'
        }
      },
      {
        id: 'u-container',
        type: 'container',
        position: { x: 800, y: 260 },
        data: {
          label: 'Container Web Process (PID 1)',
          sub: 'Isolated Sandbox',
          detail: 'Port 80 Listener (nginx)',
          tech: 'Bounded by PID/NET namespaces and cgroups v2 memory limits.'
        }
      },
      {
        id: 'u-upperdir',
        type: 'network',
        position: { x: 550, y: 260 },
        data: {
          label: 'upperdir (Writable Scratch)',
          sub: 'Ephemeral Storage',
          detail: 'CoW File Modifications',
          tech: 'Stores runtime log writes, uploads, and temporary caches.'
        }
      },
      {
        id: 'u-lowerdir',
        type: 'imageLayer',
        position: { x: 300, y: 260 },
        data: {
          label: 'lowerdir (Image Layers)',
          sub: 'Immutable OverlayFS',
          detail: 'sha256:4abcf... (Alpine + Nginx)',
          tech: 'Read-only base image layers shared across all containers on host.'
        }
      }
    ];

    const rawEdges = [
      { id: 'ue1', source: 'u-client', target: 'u-dnat', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
      { id: 'ue2', source: 'u-dnat', target: 'u-bridge', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },
      { id: 'ue3', source: 'u-bridge', target: 'u-veth', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
      { id: 'ue4', source: 'u-veth', target: 'u-container', animated: true, style: { stroke: '#c084fc', strokeWidth: 2 } },
      { id: 'ue5', source: 'u-container', target: 'u-upperdir', animated: true, style: { stroke: '#fbbf24', strokeWidth: 2 } },
      { id: 'ue6', source: 'u-upperdir', target: 'u-lowerdir', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } }
    ];

    const steps = [
      {
        title: 'Step 1: Inbound Web Traffic',
        nodeId: 'u-client',
        edgeId: 'ue1',
        desc: 'Client browser sends HTTP request hitting physical host port 8080.'
      },
      {
        title: 'Step 2: Netfilter DNAT Rewrite',
        nodeId: 'u-dnat',
        edgeId: 'ue2',
        desc: 'iptables DNAT rewrites destination to container IP 172.17.0.2:80.'
      },
      {
        title: 'Step 3: docker0 Bridge Forwarding',
        nodeId: 'u-bridge',
        edgeId: 'ue3',
        desc: 'Bridge inspects MAC table and dispatches frame to container veth.'
      },
      {
        title: 'Step 4: veth Tunnel to Container',
        nodeId: 'u-veth',
        edgeId: 'ue4',
        desc: 'Virtual ethernet pair delivers packet into container network namespace.'
      },
      {
        title: 'Step 5: Container Process Execution',
        nodeId: 'u-container',
        edgeId: 'ue5',
        desc: 'Nginx process serves static files read from immutable lowerdir image layers.'
      },
      {
        title: 'Step 6: Ephemeral Logging to upperdir',
        nodeId: 'u-upperdir',
        edgeId: 'ue6',
        desc: 'Access logs (access.log) are written strictly to upperdir via Copy-on-Write.'
      },
      {
        title: 'Step 7: Immutable Lower Layer Safety',
        nodeId: 'u-lowerdir',
        edgeId: null,
        desc: 'Underlying image layers remain completely untouched and cached on disk.'
      }
    ];

    return { rawNodes, rawEdges, steps };
  }, []);

  // Scenario 4: Multi-Container DNS & Service Discovery (127.0.0.11)
  const DNS_DISCOVERY_SCENARIO = useMemo(() => {
    const rawNodes = [
      {
        id: 'dns-client-app',
        type: 'client',
        position: { x: 50, y: 150 },
        data: {
          label: '1. Web App (api-service)',
          sub: 'User-Defined Bridge Network',
          detail: '172.20.0.2 on custom-net',
          tech: 'App issues DNS lookup for hostname "postgres-db" (e.g. getaddrinfo("postgres-db", 5432)).'
        }
      },
      {
        id: 'dns-resolver-netns',
        type: 'network',
        position: { x: 340, y: 150 },
        data: {
          label: '2. Netns DNS Trap (127.0.0.11)',
          sub: 'Embedded DNS Interception',
          detail: 'UDP :53 ➔ 127.0.0.11:53',
          tech: 'In user-defined networks, /etc/resolv.conf points to 127.0.0.11. Netfilter traps query into Docker internal resolver.'
        }
      },
      {
        id: 'dns-engine-registry',
        type: 'daemon',
        position: { x: 630, y: 150 },
        data: {
          label: '3. Docker Engine DNS Resolver',
          sub: 'libnetwork Service Registry',
          detail: 'A Record: postgres-db ➔ 172.20.0.3',
          tech: 'Docker internal resolver inspects active containers and aliases on custom-net, returning 172.20.0.3 in 0.2ms.'
        }
      },
      {
        id: 'dns-virtual-switch',
        type: 'network',
        position: { x: 630, y: 340 },
        data: {
          label: '4. Bridge Switch (br-custom)',
          sub: 'Direct L2 Ethernet Switching',
          detail: 'veth_api ⇄ br-custom ⇄ veth_db',
          tech: 'Direct Layer 2 MAC switching across container veth interfaces without NAT, port publishing, or host interface exposure.'
        }
      },
      {
        id: 'dns-target-db',
        type: 'container',
        position: { x: 340, y: 340 },
        data: {
          label: '5. Postgres DB (postgres-db)',
          sub: 'Isolated Backend Container',
          detail: '172.20.0.3:5432 (Internal Only)',
          tech: 'Postgres receives TCP connection on port 5432 and serves queries. External internet users cannot reach this container.'
        }
      }
    ];

    const rawEdges = [
      { id: 'de1', source: 'dns-client-app', target: 'dns-resolver-netns', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
      { id: 'de2', source: 'dns-resolver-netns', target: 'dns-engine-registry', animated: true, style: { stroke: '#0ea5e9', strokeWidth: 2 } },
      { id: 'de3', source: 'dns-engine-registry', target: 'dns-virtual-switch', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
      { id: 'de4', source: 'dns-virtual-switch', target: 'dns-target-db', animated: true, style: { stroke: '#c084fc', strokeWidth: 2 } }
    ];

    const steps = [
      {
        title: 'Step 1: Hostname Resolution Query',
        nodeId: 'dns-client-app',
        edgeId: 'de1',
        desc: 'Web App queries for host "postgres-db" according to /etc/resolv.conf nameserver 127.0.0.11.'
      },
      {
        title: 'Step 2: Embedded DNS Interception',
        nodeId: 'dns-resolver-netns',
        edgeId: 'de2',
        desc: 'Loopback socket traps DNS packet and delivers it to the Docker libnetwork embedded DNS thread.'
      },
      {
        title: 'Step 3: libnetwork Service Registry Resolution',
        nodeId: 'dns-engine-registry',
        edgeId: 'de3',
        desc: 'Embedded DNS resolves "postgres-db" to IP 172.20.0.3, sending the DNS A-record response.'
      },
      {
        title: 'Step 4: Direct L2 Virtual Switch Routing',
        nodeId: 'dns-virtual-switch',
        edgeId: 'de4',
        desc: 'Web app initiates TCP connection to 172.20.0.3:5432. br-custom switches frames with zero NAT overhead.'
      },
      {
        title: 'Step 5: Database Connection Established',
        nodeId: 'dns-target-db',
        edgeId: null,
        desc: 'Postgres accepts socket connection. Secure internal multi-container communication is complete!'
      }
    ];

    return { rawNodes, rawEdges, steps };
  }, []);

  // Scenario 5: Sidecar Shared Network Namespace (--network container:app)
  const SIDECAR_SCENARIO = useMemo(() => {
    const rawNodes = [
      {
        id: 'sc-cli',
        type: 'client',
        position: { x: 50, y: 150 },
        data: {
          label: '1. User Docker Command',
          sub: 'CLI Invocation',
          detail: 'docker run --network container:web-app netshoot',
          tech: 'Instructs Docker to link the new container directly to the existing container network namespace.'
        }
      },
      {
        id: 'sc-dockerd',
        type: 'daemon',
        position: { x: 330, y: 150 },
        data: {
          label: '2. Docker Engine (dockerd)',
          sub: 'Netns Descriptor Lookup',
          detail: '/proc/[web_pid]/ns/net',
          tech: 'Docker inspects primary web-app container PID and identifies its Linux kernel network namespace file descriptor.'
        }
      },
      {
        id: 'sc-runc',
        type: 'daemon',
        position: { x: 610, y: 150 },
        data: {
          label: '3. OCI runc Runtime',
          sub: 'Syscall Execution',
          detail: 'setns(fd, CLONE_NEWNET)',
          tech: 'Calls setns() syscall to attach the sidecar process directly to the existing netns instead of creating a new one.'
        }
      },
      {
        id: 'sc-shared-netns',
        type: 'network',
        position: { x: 890, y: 150 },
        data: {
          label: '4. Shared Network Stack (NETNS)',
          sub: 'Unified Network Boundary',
          detail: 'IP: 172.20.0.5 | lo: 127.0.0.1 | Port 80',
          tech: 'Both containers now share the EXACT same IP address, routing table, firewall, and localhost loopback interface.'
        }
      },
      {
        id: 'sc-primary-app',
        type: 'container',
        position: { x: 890, y: 340 },
        data: {
          label: '5. Primary Web App (Nginx)',
          sub: 'Serving on 0.0.0.0:80',
          detail: 'PID 1 inside container PID ns',
          tech: 'Main production workload handling client requests over shared eth0 interface.'
        }
      },
      {
        id: 'sc-sidecar-agent',
        type: 'container',
        position: { x: 610, y: 340 },
        data: {
          label: '6. Sidecar Agent (netshoot / Envoy)',
          sub: 'Shared Localhost Communication',
          detail: 'curl http://127.0.0.1:80 (Zero NAT)',
          tech: 'Sidecar can sniff packets with tcpdump -i eth0 or proxy traffic over localhost. This is the foundation of Kubernetes Pods!'
        }
      }
    ];

    const rawEdges = [
      { id: 'se1', source: 'sc-cli', target: 'sc-dockerd', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
      { id: 'se2', source: 'sc-dockerd', target: 'sc-runc', animated: true, style: { stroke: '#0ea5e9', strokeWidth: 2 } },
      { id: 'se3', source: 'sc-runc', target: 'sc-shared-netns', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
      { id: 'se4', source: 'sc-shared-netns', target: 'sc-primary-app', animated: true, style: { stroke: '#c084fc', strokeWidth: 2 } },
      { id: 'se5', source: 'sc-primary-app', target: 'sc-sidecar-agent', animated: true, style: { stroke: '#fbbf24', strokeWidth: 2 } }
    ];

    const steps = [
      {
        title: 'Step 1: Sidecar Command Dispatched',
        nodeId: 'sc-cli',
        edgeId: 'se1',
        desc: 'User runs sidecar container with --network container:web-app flag.'
      },
      {
        title: 'Step 2: Target Netns File Descriptor Retrieved',
        nodeId: 'sc-dockerd',
        edgeId: 'se2',
        desc: 'dockerd resolves primary container PID and reads /proc/[pid]/ns/net descriptor.'
      },
      {
        title: 'Step 3: runc Executes setns(CLONE_NEWNET)',
        nodeId: 'sc-runc',
        edgeId: 'se3',
        desc: 'runc attaches the new sidecar process to the existing network namespace.'
      },
      {
        title: 'Step 4: Shared Network Stack Activated',
        nodeId: 'sc-shared-netns',
        edgeId: 'se4',
        desc: 'Both containers share the exact same IP (172.20.0.5), loopback, and ports.'
      },
      {
        title: 'Step 5: Zero-Overhead Localhost & Sniffing Access',
        nodeId: 'sc-sidecar-agent',
        edgeId: 'se5',
        desc: 'Sidecar accesses http://127.0.0.1:80 at memory speed or debugs traffic with tcpdump!'
      }
    ];

    return { rawNodes, rawEdges, steps };
  }, []);

  // Determine active scenario data
  const currentScenarioData = useMemo(() => {
    if (activeScenario === 'networking') return NETWORKING_SCENARIO;
    if (activeScenario === 'image-to-container') return IMAGE_CONTAINER_SCENARIO;
    if (activeScenario === 'dns-discovery') return DNS_DISCOVERY_SCENARIO;
    if (activeScenario === 'sidecar-namespace') return SIDECAR_SCENARIO;
    return UNIFIED_SCENARIO;
  }, [activeScenario, NETWORKING_SCENARIO, IMAGE_CONTAINER_SCENARIO, DNS_DISCOVERY_SCENARIO, SIDECAR_SCENARIO, UNIFIED_SCENARIO]);

  // React Flow state hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(currentScenarioData.rawNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentScenarioData.rawEdges);

  // Sync nodes and edges whenever scenario or currentStepIndex changes
  useEffect(() => {
    const activeStep = currentScenarioData.steps[currentStepIndex];
    const activeNodeId = activeStep?.nodeId;
    const activeEdgeId = activeStep?.edgeId;

    setNodes(
      currentScenarioData.rawNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isActive: node.id === activeNodeId
        }
      }))
    );

    setEdges(
      currentScenarioData.rawEdges.map(edge => ({
        ...edge,
        animated: edge.id === activeEdgeId,
        style: {
          ...edge.style,
          stroke: edge.id === activeEdgeId ? '#f59e0b' : (edge.style?.stroke || '#0ea5e9'),
          strokeWidth: edge.id === activeEdgeId ? 4 : 2
        }
      }))
    );

    // Auto set drawer if node active
    const matchingNode = currentScenarioData.rawNodes.find(n => n.id === activeNodeId);
    if (matchingNode) {
      setSelectedNodeData(matchingNode.data);
    }
  }, [activeScenario, currentStepIndex, currentScenarioData, setNodes, setEdges]);

  // Reset step index when switching scenario
  const handleScenarioChange = (scenarioKey) => {
    setActiveScenario(scenarioKey);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Playback timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= currentScenarioData.steps.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentScenarioData]);

  // Node click handler
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeData(node.data);
  }, []);

  const currentStep = currentScenarioData.steps[currentStepIndex] || currentScenarioData.steps[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER & SCENARIO SELECTOR */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(14, 165, 233, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', fontSize: '0.72rem' }}>
                xyflow Interactive Canvas
              </span>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.72rem' }}>
                Real-Time Node Visualizer
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={24} color="#38bdf8" />
              Docker Core: Interactive xyflow Architecture Simulator
            </h2>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Interactive node-based canvas powered by <code>@xyflow/react</code>. Trace network packet hopping, OverlayFS image layer stacking, and container process execution in real time!
            </div>
          </div>

          {/* Scenario Switcher Buttons */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap' }}>
            {[
              { id: 'networking', label: '1. Ingress Port Forwarding (DNAT)', icon: Network },
              { id: 'dns-discovery', label: '2. Embedded DNS (127.0.0.11)', icon: Globe },
              { id: 'sidecar-namespace', label: '3. Sidecar Shared Network (Pod Model)', icon: Shield },
              { id: 'image-to-container', label: '4. Image to Container Execution', icon: Layers },
              { id: 'unified', label: '5. Unified Topology Canvas', icon: Activity }
            ].map(s => {
              const Icon = s.icon;
              const isActive = activeScenario === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleScenarioChange(s.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={14} />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Step Tracker & Playback Controls Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'rgba(0, 0, 0, 0.45)',
          padding: '12px 16px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Active Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#0284c7',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace'
            }}>
              {currentStepIndex + 1}
            </span>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#ffffff' }}>
                {currentStep.title}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#a7f3d0' }}>
                {currentStep.desc}
              </div>
            </div>
          </div>

          {/* Controls: Play, Step, Reset */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: isPlaying ? 'rgba(239, 68, 68, 0.25)' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                border: isPlaying ? '1px solid #ef4444' : 'none',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.78rem'
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause' : 'Play Flow'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex((prev) => (prev + 1) % currentScenarioData.steps.length);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                fontSize: '0.76rem'
              }}
            >
              <SkipForward size={14} />
              <span>Next Hop</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(0);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-dim)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                cursor: 'pointer',
                fontSize: '0.74rem'
              }}
              title="Reset to Step 1"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* REACT FLOW CANVAS CONTAINER */}
      <div style={{
        height: isFullscreen ? '100vh' : '540px',
        width: isFullscreen ? '100vw' : '100%',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 99999 : 1,
        borderRadius: isFullscreen ? 0 : '16px',
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1px solid rgba(14, 165, 233, 0.35)',
        background: '#070a12',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
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
                color: '#38bdf8',
                border: '1px solid rgba(14, 165, 233, 0.4)',
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
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#1e293b" gap={20} size={1.5} />
          <Controls style={{ background: 'rgba(15, 23, 42, 0.85)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', fill: '#38bdf8' }} />
          {/* Compact MiniMap */}
          <MiniMap
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              width: 105,
              height: 65
            }}
            nodeColor={(node) => {
              if (node.type === 'client') return '#38bdf8';
              if (node.type === 'daemon') return '#0ea5e9';
              if (node.type === 'network') return '#10b981';
              if (node.type === 'imageLayer') return '#f59e0b';
              if (node.type === 'container') return '#a855f7';
              return '#64748b';
            }}
            zoomable={false}
            pannable={false}
          />

          <Panel position="top-right">
            <div style={{
              background: 'rgba(0, 0, 0, 0.75)',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontSize: '0.72rem',
              color: '#38bdf8',
              fontFamily: 'monospace',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>💡 Click any node to inspect Linux kernel internals</span>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* INSPECTOR DRAWER FOR SELECTED NODE */}
      {selectedNodeData && (
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: '14px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Info size={18} color="#38bdf8" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  {selectedNodeData.label}
                </h4>
                <div style={{ fontSize: '0.74rem', color: '#38bdf8' }}>
                  {selectedNodeData.sub}
                </div>
              </div>
            </div>

            <div style={{ fontFamily: 'monospace', fontSize: '0.76rem', background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: '6px', color: '#a7f3d0' }}>
              {selectedNodeData.detail}
            </div>
          </div>

          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
            {selectedNodeData.tech}
          </p>
        </div>
      )}
    </div>
  );
}
