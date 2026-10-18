import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
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
  Radio,
  Sliders,
  Zap,
  Activity,
  Maximize2,
  X
} from 'lucide-react';

// ==========================================
// 1. CUSTOM NODE TYPES FOR NETWORK TOPOLOGY
// ==========================================

// Client / Workstation Node
const ClientNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.35)',
    boxShadow: data.isActive ? '0 0 22px rgba(56, 189, 248, 0.65)' : '0 4px 12px rgba(0, 0, 0, 0.4)',
    minWidth: '190px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#38bdf8', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Left} style={{ background: '#38bdf8', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Laptop size={16} color="#38bdf8" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{data.sub}</div>
      </div>
    </div>
    {data.detail && (
      <div style={{ fontSize: '0.72rem', color: '#bae6fd', background: 'rgba(0,0,0,0.45)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
        {data.detail}
      </div>
    )}
  </div>
);

// Switch Node (Layer 2)
const SwitchNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #818cf8' : '1px solid rgba(99, 102, 241, 0.35)',
    boxShadow: data.isActive ? '0 0 22px rgba(129, 140, 248, 0.65)' : '0 4px 12px rgba(0, 0, 0, 0.4)',
    minWidth: '190px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#818cf8', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#818cf8', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Top} style={{ background: '#818cf8', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#818cf8', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Network size={16} color="#818cf8" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#a5b4fc' }}>{data.sub}</div>
      </div>
    </div>
    {data.detail && (
      <div style={{ fontSize: '0.72rem', color: '#c7d2fe', background: 'rgba(0,0,0,0.45)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
        {data.detail}
      </div>
    )}
  </div>
);

// Router & NAT Gateway Node (Layer 3)
const RouterNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #fbbf24' : '1px solid rgba(245, 158, 11, 0.35)',
    boxShadow: data.isActive ? '0 0 22px rgba(251, 191, 36, 0.65)' : '0 4px 12px rgba(0, 0, 0, 0.4)',
    minWidth: '200px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#fbbf24', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#fbbf24', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#fbbf24', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Top} style={{ background: '#fbbf24', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Router size={16} color="#fbbf24" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#fde68a' }}>{data.sub}</div>
      </div>
    </div>
    {data.detail && (
      <div style={{ fontSize: '0.72rem', color: '#fef3c7', background: 'rgba(0,0,0,0.45)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
        {data.detail}
      </div>
    )}
  </div>
);

// DNS Resolver Node
const DnsNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #22d3ee' : '1px solid rgba(6, 182, 212, 0.35)',
    boxShadow: data.isActive ? '0 0 22px rgba(34, 211, 238, 0.65)' : '0 4px 12px rgba(0, 0, 0, 0.4)',
    minWidth: '190px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#22d3ee', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#22d3ee', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Top} style={{ background: '#22d3ee', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#22d3ee', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Database size={16} color="#22d3ee" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#a5f3fc' }}>{data.sub}</div>
      </div>
    </div>
    {data.detail && (
      <div style={{ fontSize: '0.72rem', color: '#cffafe', background: 'rgba(0,0,0,0.45)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
        {data.detail}
      </div>
    )}
  </div>
);

// Server Node (Web Server / Database / Cloud Target)
const ServerNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #34d399' : '1px solid rgba(16, 185, 129, 0.35)',
    boxShadow: data.isActive ? '0 0 22px rgba(52, 211, 153, 0.65)' : '0 4px 12px rgba(0, 0, 0, 0.4)',
    minWidth: '200px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#34d399', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#34d399', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Top} style={{ background: '#34d399', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#34d399', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Server size={16} color="#34d399" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>{data.sub}</div>
      </div>
    </div>
    {data.detail && (
      <div style={{ fontSize: '0.72rem', color: '#d1fae5', background: 'rgba(0,0,0,0.45)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
        {data.detail}
      </div>
    )}
  </div>
);

// Reverse Proxy & Load Balancer Node
const ProxyNode = ({ data, selected }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: selected || data.isActive ? '2px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.35)',
    boxShadow: data.isActive ? '0 0 22px rgba(192, 132, 252, 0.65)' : '0 4px 12px rgba(0, 0, 0, 0.4)',
    minWidth: '200px',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    transition: 'all 0.2s ease'
  }}>
    <Handle type="target" position={Position.Left} style={{ background: '#c084fc', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Right} style={{ background: '#c084fc', width: 8, height: 8 }} />
    <Handle type="target" position={Position.Top} style={{ background: '#c084fc', width: 8, height: 8 }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#c084fc', width: 8, height: 8 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Sliders size={16} color="#c084fc" />
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '0.86rem' }}>{data.label}</div>
        <div style={{ fontSize: '0.68rem', color: '#e9d5ff' }}>{data.sub}</div>
      </div>
    </div>
    {data.detail && (
      <div style={{ fontSize: '0.72rem', color: '#f3e8ff', background: 'rgba(0,0,0,0.45)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
        {data.detail}
      </div>
    )}
  </div>
);

const nodeTypes = {
  client: ClientNode,
  switch: SwitchNode,
  router: RouterNode,
  dns: DnsNode,
  server: ServerNode,
  proxy: ProxyNode
};

// ==========================================
// 2. COMPREHENSIVE NETWORKING SCENARIOS
// ==========================================

export default function NetworkXYFlowSimulator() {
  const [viewMode, setViewMode] = useState('xyflow'); // 'xyflow' | 'default'
  const [activeScenario, setActiveScenario] = useState('flow-web-request');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedNodeData, setSelectedNodeData] = useState(null);
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

  // Scenario 1: Complete Web Request (DNS + TCP + TLS + HTTP)
  const SCENARIO_WEB_REQUEST = useMemo(() => {
    const rawNodes = [
      {
        id: 'client_pc',
        type: 'client',
        position: { x: 50, y: 140 },
        data: {
          label: 'Client Workstation',
          sub: 'LAN Host (192.168.1.10)',
          detail: 'MAC: 00:1A:2B:3C:4D:5E',
          role: 'End-user browser originating web request',
          tech: 'Constructs DNS UDP query, executes TCP 3-way handshake, negotiates TLS 1.3 session keys, and issues HTTP/2 GET.'
        }
      },
      {
        id: 'local_switch',
        type: 'switch',
        position: { x: 320, y: 140 },
        data: {
          label: 'Layer-2 Gigabit Switch',
          sub: 'VLAN 10 Broadcast Domain',
          detail: 'FDB MAC Forwarding',
          role: 'Switches Ethernet frames by destination MAC',
          tech: 'Operates at Layer 2. Uses MAC address table (FDB) to switch frames directly between port 1 and uplink port 24.'
        }
      },
      {
        id: 'default_router',
        type: 'router',
        position: { x: 600, y: 140 },
        data: {
          label: 'NAT Gateway & Firewall',
          sub: 'GW: 192.168.1.1 | WAN: 198.51.100.2',
          detail: 'Stateful PAT / SNAT Table',
          role: 'Subnet gateway & public IP translator',
          tech: 'Performs Port Address Translation (PAT). Rewrites private 192.168.1.10 to public WAN IP 198.51.100.2, decrementing TTL.'
        }
      },
      {
        id: 'dns_server',
        type: 'dns',
        position: { x: 600, y: 340 },
        data: {
          label: 'DNS Recursive Resolver',
          sub: 'Google Public DNS (8.8.8.8)',
          detail: 'UDP Port 53 | A Record Cache',
          role: 'Hostname to IP Address Resolution',
          tech: 'Accepts query for "example.com", checks cache, queries authoritative TLD nameservers, returns 142.250.190.46.'
        }
      },
      {
        id: 'isp_core',
        type: 'router',
        position: { x: 880, y: 140 },
        data: {
          label: 'ISP Backbone (Tier-1)',
          sub: 'BGP AS15169 Autonomous Transit',
          detail: 'Optical Fiber DWDM Trunk',
          role: 'Global Internet Autonomous System Transit',
          tech: 'BGP border routers evaluate AS-PATH and forward IP packets across global fiber trunks at terabit speeds.'
        }
      },
      {
        id: 'web_server',
        type: 'server',
        position: { x: 1160, y: 140 },
        data: {
          label: 'Origin Cloud Server',
          sub: 'Target Host (142.250.190.46)',
          detail: 'TCP Port 443 (HTTPS/TLS)',
          role: 'Application Server & Static Content',
          tech: 'Listens on 0.0.0.0:443. Completes TCP handshake, terminates TLS encryption, and responds with HTTP/2 200 OK.'
        }
      }
    ];

    const rawEdges = [
      { id: 'e1', source: 'client_pc', target: 'local_switch', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
      { id: 'e2', source: 'local_switch', target: 'default_router', animated: true, style: { stroke: '#818cf8', strokeWidth: 2 } },
      { id: 'e3', source: 'default_router', target: 'dns_server', animated: true, style: { stroke: '#22d3ee', strokeWidth: 2 } },
      { id: 'e4', source: 'default_router', target: 'isp_core', animated: true, style: { stroke: '#fbbf24', strokeWidth: 2 } },
      { id: 'e5', source: 'isp_core', target: 'web_server', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } }
    ];

    const steps = [
      {
        stepNumber: 1,
        title: 'Step 1: DNS Query Generation & Switch Ingress',
        nodeId: 'client_pc',
        edgeId: 'e1',
        layer: 'L7 App ➔ L4 UDP ➔ L3 IP ➔ L2 Frame',
        desc: 'Browser checks local DNS cache. On cache miss, it crafts a UDP packet to 8.8.8.8:53 asking for the A record of example.com.'
      },
      {
        stepNumber: 2,
        title: 'Step 2: Layer-2 Frame Switching to Gateway',
        nodeId: 'local_switch',
        edgeId: 'e2',
        layer: 'L2 Ethernet Frame Switching',
        desc: 'Switch reads destination MAC 00:50:56:C0:00:01 in its FDB table and delivers the frame directly to the router LAN port.'
      },
      {
        stepNumber: 3,
        title: 'Step 3: Gateway NAT Rewrite & DNS Dispatch',
        nodeId: 'default_router',
        edgeId: 'e3',
        layer: 'L3 Network NAT / Masquerade',
        desc: 'Gateway inspects routing table, rewrites source IP to 198.51.100.2 (SNAT), and queries DNS resolver at 8.8.8.8:53.'
      },
      {
        stepNumber: 4,
        title: 'Step 4: DNS Resolution Returns 142.250.190.46',
        nodeId: 'dns_server',
        edgeId: 'e3',
        layer: 'L7 DNS Response Payload',
        desc: 'DNS resolver answers with IP 142.250.190.46 (TTL 300s). Client caches record and prepares for TCP connection.'
      },
      {
        stepNumber: 5,
        title: 'Step 5: TCP 3-Way Handshake Across ISP Core',
        nodeId: 'isp_core',
        edgeId: 'e4',
        layer: 'L4 Transport (TCP SYN / SYN-ACK / ACK)',
        desc: 'Client initiates TCP handshake: SYN (Seq=0) ➔ SYN-ACK (Seq=0, Ack=1) ➔ ACK (Seq=1, Ack=1). Socket state enters ESTABLISHED.'
      },
      {
        stepNumber: 6,
        title: 'Step 6: TLS 1.3 Cryptographic Key Exchange',
        nodeId: 'web_server',
        edgeId: 'e5',
        layer: 'L6 Presentation (TLS 1.3 Encryption)',
        desc: 'Client and server exchange Diffie-Hellman keys and verify digital X.509 certificate. Symmetric encryption session keys are activated.'
      },
      {
        stepNumber: 7,
        title: 'Step 7: HTTP/2 GET Request & 200 OK Delivery',
        nodeId: 'web_server',
        edgeId: null,
        layer: 'L7 Application (HTTP/2 Stream)',
        desc: 'Client transmits encrypted HTTP/2 GET /index.html. Server serves 200 OK response payload with compressed HTML bytes!'
      }
    ];

    return { rawNodes, rawEdges, steps };
  }, []);

  // Scenario 2: ICMP Ping Echo Request & Reply
  const SCENARIO_ICMP_PING = useMemo(() => {
    const rawNodes = [
      {
        id: 'ping_client',
        type: 'client',
        position: { x: 60, y: 150 },
        data: {
          label: 'Client PC (192.168.1.10)',
          sub: 'ICMP Echo Origin',
          detail: 'ping -c 1 8.8.8.8',
          role: 'Generates ICMP Type 8 packet',
          tech: 'Creates raw socket, formats ICMP header (Type=8, Code=0, Seq=1, Identifier=0x4a), records transmit timestamp.'
        }
      },
      {
        id: 'ping_switch',
        type: 'switch',
        position: { x: 330, y: 150 },
        data: {
          label: 'Local Switch',
          sub: 'Ethernet L2 Segment',
          detail: 'Port 1 ➔ Port 24 Uplink',
          role: 'Switches Ethernet frame to router',
          tech: 'Forwards frame based on MAC address table with zero buffering delay.'
        }
      },
      {
        id: 'ping_router',
        type: 'router',
        position: { x: 600, y: 150 },
        data: {
          label: 'Gateway Router',
          sub: 'IP Forwarding Engine',
          detail: 'TTL: 64 ➔ 63 (Checksum)',
          role: 'TTL decrement & WAN routing',
          tech: 'Decrements Time-to-Live from 64 to 63, verifies TTL > 0, recomputes IPv4 header checksum, passes to WAN.'
        }
      },
      {
        id: 'ping_isp',
        type: 'router',
        position: { x: 870, y: 150 },
        data: {
          label: 'Transit ISP Router',
          sub: 'Core Routing Hop',
          detail: 'TTL: 63 ➔ 62',
          role: 'Backbone IP transit',
          tech: 'Performs longest-prefix match in FIB and routes packet toward Google Anycast IP.'
        }
      },
      {
        id: 'ping_target',
        type: 'server',
        position: { x: 1140, y: 150 },
        data: {
          label: 'Target Host (8.8.8.8)',
          sub: 'Kernel ICMP Responder',
          detail: 'ICMP Type 0 Echo Reply',
          role: 'Generates Echo Reply packet',
          tech: 'Operating system kernel responds immediately to ICMP Type 8 by returning identical payload with Type 0 (Echo Reply).'
        }
      }
    ];

    const rawEdges = [
      { id: 'pe1', source: 'ping_client', target: 'ping_switch', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
      { id: 'pe2', source: 'ping_switch', target: 'ping_router', animated: true, style: { stroke: '#818cf8', strokeWidth: 2 } },
      { id: 'pe3', source: 'ping_router', target: 'ping_isp', animated: true, style: { stroke: '#fbbf24', strokeWidth: 2 } },
      { id: 'pe4', source: 'ping_isp', target: 'ping_target', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } }
    ];

    const steps = [
      {
        stepNumber: 1,
        title: 'Step 1: Client Crafts ICMP Type 8 Request',
        nodeId: 'ping_client',
        edgeId: 'pe1',
        layer: 'L3 Network (ICMP Type 8)',
        desc: 'Client builds ICMP Echo Request packet with 32-byte timestamp payload and sets initial IP TTL to 64.'
      },
      {
        stepNumber: 2,
        title: 'Step 2: Local Switch Frame Traversal',
        nodeId: 'ping_switch',
        edgeId: 'pe2',
        layer: 'L2 Ethernet Frame',
        desc: 'Switch pushes the frame to the default gateway MAC address without modifying IP headers.'
      },
      {
        stepNumber: 3,
        title: 'Step 3: Router Decrements TTL 64 ➔ 63',
        nodeId: 'ping_router',
        edgeId: 'pe3',
        layer: 'L3 Network Forwarding',
        desc: 'Router decrements TTL from 64 to 63, verifies packet health, and forwards to the upstream ISP.'
      },
      {
        stepNumber: 4,
        title: 'Step 4: ISP Backbone Anycast Routing',
        nodeId: 'ping_isp',
        edgeId: 'pe4',
        layer: 'L3 Anycast BGP Routing',
        desc: 'ISP delivers the packet to the nearest physical datacenter hosting the 8.8.8.8 Anycast IP.'
      },
      {
        stepNumber: 5,
        title: 'Step 5: Target Host Returns Echo Reply (RTT: 12ms)',
        nodeId: 'ping_target',
        edgeId: null,
        layer: 'L3 Network (ICMP Type 0 Reply)',
        desc: 'Target kernel crafts ICMP Type 0 Reply. Client calculates Round-Trip Time: time=12.4 ms!'
      }
    ];

    return { rawNodes, rawEdges, steps };
  }, []);

  // Scenario 3: ARP Address Resolution (IP to MAC Discovery)
  const SCENARIO_ARP = useMemo(() => {
    const rawNodes = [
      {
        id: 'arp_client',
        type: 'client',
        position: { x: 80, y: 150 },
        data: {
          label: 'Client PC (192.168.1.10)',
          sub: 'ARP Cache Miss',
          detail: 'MAC: 00:1A:2B:3C:4D:5E',
          role: 'Needs MAC for 192.168.1.1',
          tech: 'Checks kernel ARP table (`arp -n`). Entry absent. Prepares L2 broadcast to FF:FF:FF:FF:FF:FF.'
        }
      },
      {
        id: 'arp_switch',
        type: 'switch',
        position: { x: 380, y: 150 },
        data: {
          label: 'L2 Switch (Broadcast Flood)',
          sub: 'Floods to all VLAN ports',
          detail: 'Ports 1, 2, 3, 4 Flooding',
          role: 'Broadcast frame replication',
          tech: 'Broadcast destination MAC causes the switch to duplicate the frame out of every active switch port.'
        }
      },
      {
        id: 'arp_printer',
        type: 'client',
        position: { x: 680, y: 60 },
        data: {
          label: 'Network Printer (192.168.1.25)',
          sub: 'Ignores ARP Request',
          detail: 'IP Mismatch ➔ Drop',
          role: 'Silent discard',
          tech: 'Inspects Target IP in ARP payload (192.168.1.1). Mismatches own IP (192.168.1.25). Silently drops packet.'
        }
      },
      {
        id: 'arp_gateway',
        type: 'router',
        position: { x: 680, y: 240 },
        data: {
          label: 'Gateway Router (192.168.1.1)',
          sub: 'Matches Target IP',
          detail: 'MAC: 00:50:56:C0:00:01',
          role: 'Generates Unicast ARP Reply',
          tech: 'Recognizes its own IP, learns client MAC, and replies with unicast frame: "192.168.1.1 is at 00:50:56:C0:00:01".'
        }
      }
    ];

    const rawEdges = [
      { id: 'ae1', source: 'arp_client', target: 'arp_switch', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
      { id: 'ae2', source: 'arp_switch', target: 'arp_printer', animated: true, style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,5' } },
      { id: 'ae3', source: 'arp_switch', target: 'arp_gateway', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
      { id: 'ae4', source: 'arp_gateway', target: 'arp_switch', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },
      { id: 'ae5', source: 'arp_switch', target: 'arp_client', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } }
    ];

    const steps = [
      {
        stepNumber: 1,
        title: 'Step 1: Client Broadcasts ARP Request',
        nodeId: 'arp_client',
        edgeId: 'ae1',
        layer: 'L2 Broadcast (FF:FF:FF:FF:FF:FF)',
        desc: 'Client transmits: "Who has 192.168.1.1? Tell 192.168.1.10". Destination MAC is Ethernet broadcast.'
      },
      {
        stepNumber: 2,
        title: 'Step 2: Switch Floods Broadcast to All Ports',
        nodeId: 'arp_switch',
        edgeId: 'ae2',
        layer: 'L2 Multi-Port Switch Flooding',
        desc: 'Switch receives broadcast and replicates the frame to port 2 (Printer) and port 3 (Gateway).'
      },
      {
        stepNumber: 3,
        title: 'Step 3: Printer Inspects & Drops Frame',
        nodeId: 'arp_printer',
        edgeId: 'ae3',
        layer: 'IP Address Mismatch Handling',
        desc: 'Printer inspects Target IP 192.168.1.1, notices it does not match its own IP, and silently discards the frame.'
      },
      {
        stepNumber: 4,
        title: 'Step 4: Gateway Router Unicast ARP Reply',
        nodeId: 'arp_gateway',
        edgeId: 'ae4',
        layer: 'L2 Unicast ARP Reply Frame',
        desc: 'Router recognizes its IP and replies: "192.168.1.1 is at 00:50:56:C0:00:01". Frame is sent unicast to client MAC.'
      },
      {
        stepNumber: 5,
        title: 'Step 5: Client Updates Kernel ARP Table',
        nodeId: 'arp_client',
        edgeId: 'ae5',
        layer: 'Kernel ARP Cache Injection',
        desc: 'Client caches entry in kernel table: `? (192.168.1.1) at 00:50:56:c0:00:01 [ether] on eth0`. Direct communication unlocked!'
      }
    ];

    return { rawNodes, rawEdges, steps };
  }, []);

  // Scenario 4: Reverse Proxy & L7 Load Balancer Ingress
  const SCENARIO_REVERSE_PROXY = useMemo(() => {
    const rawNodes = [
      {
        id: 'rp_client',
        type: 'client',
        position: { x: 50, y: 150 },
        data: {
          label: 'External User (Browser)',
          sub: 'Public IP: 203.0.113.45',
          detail: 'GET /api/v1/users (HTTPS)',
          role: 'Inbound HTTPS client traffic',
          tech: 'Initiates connection to single public edge domain api.example.com on port 443.'
        }
      },
      {
        id: 'rp_proxy',
        type: 'proxy',
        position: { x: 350, y: 150 },
        data: {
          label: 'Nginx / Traefik Proxy',
          sub: 'L7 Load Balancer & SSL Edge',
          detail: 'TLS Termination | Round Robin',
          role: 'Decouples clients from backends',
          tech: 'Terminates TLS certificate, checks HTTP Host header, balances upstream traffic across internal microservices.'
        }
      },
      {
        id: 'rp_backend1',
        type: 'server',
        position: { x: 680, y: 60 },
        data: {
          label: 'API Server Instance 1',
          sub: 'Internal IP: 10.0.1.10:8080',
          detail: 'Active Node (Round Robin)',
          role: 'Stateless Node.js/Go Microservice',
          tech: 'Processes JSON API payloads, executes business logic, communicates with internal database.'
        }
      },
      {
        id: 'rp_backend2',
        type: 'server',
        position: { x: 680, y: 240 },
        data: {
          label: 'API Server Instance 2',
          sub: 'Internal IP: 10.0.1.11:8080',
          detail: 'Replica Node (Health Checked)',
          role: 'High-availability replica',
          tech: 'Health checked every 5 seconds. Ready to take over traffic seamlessly if Instance 1 crashes.'
        }
      },
      {
        id: 'rp_redis',
        type: 'dns',
        position: { x: 980, y: 150 },
        data: {
          label: 'Shared Redis Cache',
          sub: '10.0.2.5:6379 (In-Memory)',
          detail: 'Sub-millisecond Session Store',
          role: 'Centralized session state',
          tech: 'Enables stateless API servers to authenticate users and share cached database queries at 0.1ms latency.'
        }
      }
    ];

    const rawEdges = [
      { id: 're1', source: 'rp_client', target: 'rp_proxy', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
      { id: 're2', source: 'rp_proxy', target: 'rp_backend1', animated: true, style: { stroke: '#c084fc', strokeWidth: 2 } },
      { id: 're3', source: 'rp_proxy', target: 'rp_backend2', animated: false, style: { stroke: '#64748b', strokeWidth: 1 } },
      { id: 're4', source: 'rp_backend1', target: 'rp_redis', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } }
    ];

    const steps = [
      {
        stepNumber: 1,
        title: 'Step 1: Public HTTPS Request Ingress',
        nodeId: 'rp_client',
        edgeId: 're1',
        layer: 'Public Internet Ingress (Port 443)',
        desc: 'Client connects to public reverse proxy IP. Edge firewall validates TCP SYN and admits packet.'
      },
      {
        stepNumber: 2,
        title: 'Step 2: TLS Termination & Path Routing',
        nodeId: 'rp_proxy',
        edgeId: 're2',
        layer: 'L7 Reverse Proxy Decryption',
        desc: 'Proxy terminates TLS, decrypts payload, inspects Host: api.example.com, and applies weighted Round-Robin.'
      },
      {
        stepNumber: 3,
        title: 'Step 3: Upstream Proxy Forwarding to Instance 1',
        nodeId: 'rp_backend1',
        edgeId: 're2',
        layer: 'Private Microservice Proxying',
        desc: 'Proxy forwards HTTP request to internal private IP 10.0.1.10:8080 with X-Forwarded-For header preserved.'
      },
      {
        stepNumber: 4,
        title: 'Step 4: In-Memory Session Validation with Redis',
        nodeId: 'rp_redis',
        edgeId: 're4',
        layer: 'Internal Cache Protocol',
        desc: 'API server checks session token in Redis cache (10.0.2.5:6379). User authenticated in 0.2ms.'
      },
      {
        stepNumber: 5,
        title: 'Step 5: Response Streamed Back to Client',
        nodeId: 'rp_client',
        edgeId: null,
        layer: 'HTTP/2 200 OK Response Stream',
        desc: 'Backend streams JSON response to proxy; proxy re-encrypts over TLS and delivers HTTP 200 OK to the client!'
      }
    ];

    return { rawNodes, rawEdges, steps };
  }, []);

  // Scenario 5: BGP Autonomous System (AS) Inter-Domain Routing
  const SCENARIO_BGP = useMemo(() => {
    const rawNodes = [
      {
        id: 'bgp_src',
        type: 'client',
        position: { x: 50, y: 150 },
        data: {
          label: 'Enterprise AS (AS64512)',
          sub: 'Origin Border Router',
          detail: 'Prefix: 198.51.100.0/24',
          role: 'Customer Autonomous System',
          tech: 'Advertises IP prefix via eBGP to upstream transit providers with BGP Local Preference.'
        }
      },
      {
        id: 'bgp_isp1',
        type: 'router',
        position: { x: 330, y: 150 },
        data: {
          label: 'Tier-2 Transit ISP',
          sub: 'AS174 (Cogent Core)',
          detail: 'eBGP Peering Session',
          role: 'Regional Transit Provider',
          tech: 'Appends AS174 to AS-PATH, enforces routing policies, exports prefix to global Tier-1 settlement-free peers.'
        }
      },
      {
        id: 'bgp_tier1',
        type: 'router',
        position: { x: 620, y: 150 },
        data: {
          label: 'Tier-1 Global Backbone',
          sub: 'AS3356 (Lumen / Level3)',
          detail: 'Subsea Fiber Cable Trunk',
          role: 'Global Internet Core',
          tech: 'Settlement-free peering. Carries full global BGP routing table (~950,000 IPv4 prefixes) across continents.'
        }
      },
      {
        id: 'bgp_isp2',
        type: 'router',
        position: { x: 910, y: 150 },
        data: {
          label: 'Cloud Edge AS (AS15169)',
          sub: 'Google Edge BGP Router',
          detail: 'Shortest AS-PATH Match',
          role: 'Destination Autonomous System',
          tech: 'Receives packet, terminates BGP exterior routing, hands off packet to internal IGP (IS-IS/OSPF).'
        }
      },
      {
        id: 'bgp_target',
        type: 'server',
        position: { x: 1190, y: 150 },
        data: {
          label: 'Cloud Datacenter Host',
          sub: 'Origin Cluster (142.250.190.46)',
          detail: 'BGP Anycast Destination',
          role: 'Destination Workload Server',
          tech: 'Packet arrives at target server rack within 18ms of global transit across 4 autonomous systems.'
        }
      }
    ];

    const rawEdges = [
      { id: 'be1', source: 'bgp_src', target: 'bgp_isp1', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
      { id: 'be2', source: 'bgp_isp1', target: 'bgp_tier1', animated: true, style: { stroke: '#fbbf24', strokeWidth: 2 } },
      { id: 'be3', source: 'bgp_tier1', target: 'bgp_isp2', animated: true, style: { stroke: '#818cf8', strokeWidth: 2 } },
      { id: 'be4', source: 'bgp_isp2', target: 'bgp_target', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } }
    ];

    const steps = [
      {
        stepNumber: 1,
        title: 'Step 1: Enterprise Border Router Egress',
        nodeId: 'bgp_src',
        edgeId: 'be1',
        layer: 'eBGP Autonomous System Peering',
        desc: 'Enterprise router checks BGP routing table, selects lowest AS-PATH exit hop, and transmits packet to Tier-2 ISP.'
      },
      {
        stepNumber: 2,
        title: 'Step 2: Tier-2 Transit Provider Routing',
        nodeId: 'bgp_isp1',
        edgeId: 'be2',
        layer: 'BGP Attribute Evaluation (MED & LocalPref)',
        desc: 'Transit router evaluates shortest path, appends AS174 to BGP AS-PATH, and injects into Tier-1 peering exchange.'
      },
      {
        stepNumber: 3,
        title: 'Step 3: Global Tier-1 Backbone Subsea Transit',
        nodeId: 'bgp_tier1',
        edgeId: 'be3',
        layer: 'Settlement-Free Global Transit',
        desc: 'Packet traverses transoceanic DWDM subsea optical fiber trunk between continental routing nodes.'
      },
      {
        stepNumber: 4,
        title: 'Step 4: Destination Cloud Autonomous System Ingress',
        nodeId: 'bgp_isp2',
        edgeId: 'be4',
        layer: 'BGP Ingress & Anycast Routing',
        desc: 'Cloud edge router receives packet, matches destination prefix /24, and hands off to internal OSPF datacenter fabric.'
      },
      {
        stepNumber: 5,
        title: 'Step 5: Final Delivery to Target Server Rack',
        nodeId: 'bgp_target',
        edgeId: null,
        layer: 'Intra-Datacenter L2/L3 Delivery',
        desc: 'Top-of-Rack switch delivers packet to target bare-metal blade. Inter-domain BGP routing is complete!'
      }
    ];

    return { rawNodes, rawEdges, steps };
  }, []);

  // Determine active scenario data
  const currentScenarioData = useMemo(() => {
    switch (activeScenario) {
      case 'flow-icmp-ping': return SCENARIO_ICMP_PING;
      case 'flow-arp-discovery': return SCENARIO_ARP;
      case 'flow-reverse-proxy': return SCENARIO_REVERSE_PROXY;
      case 'flow-bgp-routing': return SCENARIO_BGP;
      case 'flow-web-request':
      default:
        return SCENARIO_WEB_REQUEST;
    }
  }, [activeScenario, SCENARIO_WEB_REQUEST, SCENARIO_ICMP_PING, SCENARIO_ARP, SCENARIO_REVERSE_PROXY, SCENARIO_BGP]);

  // React Flow state hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(currentScenarioData.rawNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentScenarioData.rawEdges);

  // Sync nodes and edges whenever scenario or step index changes
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

  // Scenario changer
  const handleScenarioChange = (scenarioKey) => {
    setActiveScenario(scenarioKey);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Playback timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      const delay = 2600 / playbackSpeed;
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= currentScenarioData.steps.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, delay);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentScenarioData]);

  // Node click handler
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeData(node.data);
  }, []);

  const currentStep = currentScenarioData.steps[currentStepIndex] || currentScenarioData.steps[0];
  const totalSteps = currentScenarioData.steps.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* HEADER & CONTROLS BANNER */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(14, 165, 233, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        {/* Title & View Mode Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.72rem' }}>
                xyflow Interactive Node Canvas
              </span>
              <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: '0.72rem' }}>
                Dual-View Simulation Engine
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={24} color="#34d399" />
              Networking: xyflow Packet Tracer & Multi-Flow Simulator
            </h2>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Step through network packets, L2 Ethernet switching, L3 routing, NAT translations, DNS queries, and TLS 1.3 handshakes across distributed architectures!
            </div>
          </div>

          {/* DUAL VIEW MODE TOGGLE: xyflow vs Default Flow */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.55)',
            padding: '5px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              onClick={() => setViewMode('xyflow')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '7px',
                fontSize: '0.82rem',
                fontWeight: viewMode === 'xyflow' ? '700' : '500',
                background: viewMode === 'xyflow' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'transparent',
                color: viewMode === 'xyflow' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: viewMode === 'xyflow' ? '0 2px 10px rgba(16, 185, 129, 0.4)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Zap size={15} />
              <span>xyflow Canvas (Node Graph)</span>
            </button>

            <button
              onClick={() => setViewMode('default')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '7px',
                fontSize: '0.82rem',
                fontWeight: viewMode === 'default' ? '700' : '500',
                background: viewMode === 'default' ? 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)' : 'transparent',
                color: viewMode === 'default' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: viewMode === 'default' ? '0 2px 10px rgba(14, 165, 233, 0.4)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Activity size={15} />
              <span>Default Flow (Step Topology)</span>
            </button>
          </div>
        </div>

        {/* 5 SCENARIO SELECTION BUTTONS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '10px',
          marginBottom: '18px'
        }}>
          {[
            { id: 'flow-web-request', label: '1. Web Request (DNS+TCP+TLS)', sub: 'Full Web Lifecycle', icon: Globe, color: '#38bdf8' },
            { id: 'flow-icmp-ping', label: '2. ICMP Ping Request & Reply', sub: 'TTL Decrement & RTT', icon: Radio, color: '#10b981' },
            { id: 'flow-arp-discovery', label: '3. ARP Address Resolution', sub: 'IP to MAC Broadcast', icon: Network, color: '#fbbf24' },
            { id: 'flow-reverse-proxy', label: '4. Reverse Proxy & L7 LB', sub: 'SSL Edge & Upstream Pool', icon: Sliders, color: '#c084fc' },
            { id: 'flow-bgp-routing', label: '5. BGP Inter-Domain Routing', sub: 'Autonomous System Transit', icon: Router, color: '#f97316' }
          ].map(s => {
            const Icon = s.icon;
            const isSel = activeScenario === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleScenarioChange(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: isSel ? `${s.color}22` : 'rgba(0, 0, 0, 0.4)',
                  border: isSel ? `1.5px solid ${s.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSel ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: isSel ? s.color : 'rgba(255, 255, 255, 0.06)',
                  color: isSel ? '#000000' : s.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={16} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.82rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: isSel ? s.color : 'var(--text-dim)', marginTop: '2px' }}>
                    {s.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* STEP CONTROLS & PLAYBACK BAR */}
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
              background: '#059669',
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
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff' }}>
                {currentStep.title}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#34d399' }}>
                {currentStep.layer} • Hop {currentStepIndex + 1} of {totalSteps}
              </div>
            </div>
          </div>

          {/* Action Buttons: Play/Pause, Step, Reset, Speed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Speed Selector */}
            <div style={{ display: 'flex', gap: '3px', background: 'rgba(0,0,0,0.5)', padding: '3px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              {[0.5, 1, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  style={{
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: playbackSpeed === speed ? '700' : '500',
                    background: playbackSpeed === speed ? 'rgba(52, 211, 153, 0.25)' : 'transparent',
                    color: playbackSpeed === speed ? '#34d399' : 'var(--text-dim)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Prev Hop */}
            <button
              onClick={() => setCurrentStepIndex(prev => Math.max(prev - 1, 0))}
              disabled={currentStepIndex === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: currentStepIndex === 0 ? 'var(--text-dim)' : '#ffffff',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.76rem',
                cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '6px',
                background: isPlaying ? 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                fontWeight: '700',
                border: 'none',
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: isPlaying ? '0 0 12px rgba(244, 63, 94, 0.4)' : '0 0 12px rgba(16, 185, 129, 0.4)'
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause' : 'Play Flow'}</span>
            </button>

            {/* Next Hop */}
            <button
              onClick={() => setCurrentStepIndex(prev => Math.min(prev + 1, totalSteps - 1))}
              disabled={currentStepIndex === totalSteps - 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: currentStepIndex === totalSteps - 1 ? 'var(--text-dim)' : '#ffffff',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.76rem',
                cursor: currentStepIndex === totalSteps - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
              title="Reset to Step 1"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: XYFLOW NODE CANVAS GRAPH                          */}
      {/* ========================================================= */}
      {viewMode === 'xyflow' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedNodeData ? '1fr 340px' : '1fr', gap: '16px' }}>
          {/* React Flow Canvas Window */}
          <div className="glass-panel" style={{
            height: isFullscreen ? '100vh' : '560px',
            width: isFullscreen ? '100vw' : '100%',
            position: isFullscreen ? 'fixed' : 'relative',
            top: isFullscreen ? 0 : 'auto',
            left: isFullscreen ? 0 : 'auto',
            zIndex: isFullscreen ? 99999 : 1,
            borderRadius: isFullscreen ? 0 : '16px',
            overflow: 'hidden',
            border: isFullscreen ? 'none' : '1px solid rgba(16, 185, 129, 0.25)',
            background: 'rgba(10, 15, 29, 0.95)'
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
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
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
              <Background color="#10b981" gap={24} size={1} style={{ opacity: 0.15 }} />
              <Controls style={{ background: 'rgba(15, 23, 42, 0.85)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
              {/* Compact MiniMap */}
              <MiniMap
                nodeColor={(n) => {
                  if (n.type === 'client') return '#38bdf8';
                  if (n.type === 'switch') return '#818cf8';
                  if (n.type === 'router') return '#fbbf24';
                  if (n.type === 'dns') return '#22d3ee';
                  if (n.type === 'proxy') return '#c084fc';
                  return '#34d399';
                }}
                style={{
                  background: 'rgba(15, 23, 42, 0.88)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  width: 105,
                  height: 65
                }}
                zoomable={false}
                pannable={false}
              />

              {/* Floating Canvas Top Overlay: Live Packet Description */}
              <Panel position="top-center">
                <div style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(12px)',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                  maxWidth: '750px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#a7f3d0', marginBottom: '2px' }}>
                    {currentStep.desc}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Click any node on the canvas to inspect its IP, MAC, ports, and operating system forwarding table!
                  </div>
                </div>
              </Panel>
            </ReactFlow>
          </div>

          {/* Node Inspector Side Drawer */}
          {selectedNodeData && (
            <div className="glass-panel" style={{
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              height: '560px',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.7rem' }}>
                  Node Inspector
                </span>
                <button
                  onClick={() => setSelectedNodeData(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  ✕
                </button>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                  {selectedNodeData.label}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '600' }}>
                  {selectedNodeData.sub}
                </div>
              </div>

              {selectedNodeData.detail && (
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  color: '#a7f3d0'
                }}>
                  {selectedNodeData.detail}
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Device Role:
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                  {selectedNodeData.role}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Technical Mechanics:
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45, background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                  {selectedNodeData.tech}
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  Active Hop: <strong>{currentStep.title}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: DEFAULT STEP FLOW (LINEAR TOPOLOGY & PAYLOADS)    */}
      {/* ========================================================= */}
      {viewMode === 'default' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Step Timeline Card */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={18} color="#34d399" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                    {currentStep.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
                    {currentStep.layer}
                  </div>
                </div>
              </div>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.74rem' }}>
                Hop {currentStepIndex + 1} of {totalSteps}
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '20px' }}>
              {currentStep.desc}
            </p>

            {/* Linear Step Navigator Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {currentScenarioData.steps.map((st, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isPast = idx < currentStepIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: isCurrent ? 'linear-gradient(135deg, rgba(5, 150, 105, 0.35) 0%, rgba(16, 185, 129, 0.2) 100%)' : 'rgba(0, 0, 0, 0.35)',
                      border: isCurrent ? '1.5px solid #34d399' : isPast ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isCurrent ? '#ffffff' : 'var(--text-muted)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', fontWeight: '700', color: isCurrent ? '#34d399' : isPast ? '#a7f3d0' : 'var(--text-dim)', marginBottom: '2px' }}>
                      HOP {idx + 1}
                    </div>
                    <div style={{ fontSize: '0.76rem', fontWeight: isCurrent ? '700' : '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {st.title.replace(/^Step \d+:\s*/, '')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Device Topology Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px'
          }}>
            {currentScenarioData.rawNodes.map(node => {
              const isActive = node.id === currentStep.nodeId;
              return (
                <div
                  key={node.id}
                  style={{
                    background: isActive ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.85) 100%)' : 'rgba(0,0,0,0.4)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: isActive ? '2px solid #34d399' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isActive ? '0 0 20px rgba(52, 211, 153, 0.4)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: '800', fontSize: '0.88rem', color: isActive ? '#34d399' : '#ffffff', marginBottom: '4px' }}>
                    {node.data.label}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8', marginBottom: '8px' }}>
                    {node.data.sub}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    {node.data.role}
                  </div>
                  {node.data.detail && (
                    <div style={{ fontSize: '0.7rem', color: '#a7f3d0', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 4, marginTop: '8px', fontFamily: 'monospace' }}>
                      {node.data.detail}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
