import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Terminal,
  Layers,
  Server,
  Globe,
  Network,
  Shield,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Radio,
  Router,
  Search,
  Sliders,
  Share2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function NetworkingTutorial({ onNavigateToSimulator }) {
  const [activeLevel, setActiveLevel] = useState('all'); // 'all' | 'beginner' | 'intermediate' | 'advanced' | 'widgets'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSnippet, setCopiedSnippet] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState('ch-1'); // Default open Chapter 1
  const [completedChapters, setCompletedChapters] = useState({ 'ch-1': true });

  // Interactive Chapter Widgets State
  // Ch 1: Bandwidth / Latency calculator
  const [calcBandwidthMbps, setCalcBandwidthMbps] = useState(100);
  const [calcLatencyMs, setCalcLatencyMs] = useState(30);
  const [calcFileSizeMb, setCalcFileSizeMb] = useState(50);

  // Ch 2: Topology Switcher
  const [selectedTopology, setSelectedTopology] = useState('spine-leaf');

  // Ch 4: Encapsulation Stepper
  const [encapStep, setEncapStep] = useState(7); // 7 down to 1

  // Ch 5: IPv6 Compressor
  const [ipv6Input, setIpv6Input] = useState('2001:0db8:0000:0000:0000:ff00:0042:8329');

  // Ch 7: CIDR Subnet Calculator
  const [sampleCidr, setSampleCidr] = useState(26);

  // Ch 8: Longest Prefix Match test
  const [testIpForRoute, setTestIpForRoute] = useState('10.1.5.24');

  // Ch 9: DHCP DORA Stepper
  const [doraStep, setDoraStep] = useState(1);

  // Ch 10: TCP Handshake Stepper
  const [tcpHandshakeStep, setTcpHandshakeStep] = useState(0);

  // Ch 11: Wi-Fi band
  const [wifiBand, setWifiBand] = useState('5ghz');

  // Ch 12: Security attack selector
  const [selectedAttack, setSelectedAttack] = useState('arp-spoof');

  // Ch 15: STP root election
  const [switchPriorityA, setSwitchPriorityA] = useState(32768);
  const [switchPriorityB, setSwitchPriorityB] = useState(4096);

  // Ch 17: Nines availability slider
  const [availabilityPct, setAvailabilityPct] = useState(99.99);

  // Ch 21: Troubleshooting Symptom
  const [selectedSymptom, setSelectedSymptom] = useState('apipa');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const toggleChapterComplete = (id, e) => {
    e.stopPropagation();
    setCompletedChapters(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    setExpandedChapter('all');
  };

  const collapseAll = () => {
    setExpandedChapter(null);
  };

  // Helper for IPv6 zero-compression display
  const compressIPv6 = (ip) => {
    try {
      const parts = ip.split(':').map(p => p.replace(/^0+/, '') || '0');
      const joined = parts.join(':');
      // replace longest run of :0: with ::
      return joined.replace(/(?:^|:)0(?::0)+(?::|$)/, '::');
    } catch {
      return ip;
    }
  };

  // Ch 17: Calculate downtime per year
  const calculatedDowntime = useMemo(() => {
    const fractionDown = (100 - availabilityPct) / 100;
    const secondsPerYear = 365.25 * 24 * 3600;
    const downSecs = fractionDown * secondsPerYear;
    if (downSecs >= 86400) {
      return `${(downSecs / 86400).toFixed(2)} days / year`;
    } else if (downSecs >= 3600) {
      return `${(downSecs / 3600).toFixed(2)} hours / year`;
    } else if (downSecs >= 60) {
      return `${(downSecs / 60).toFixed(2)} minutes / year`;
    } else {
      return `${downSecs.toFixed(2)} seconds / year`;
    }
  }, [availabilityPct]);

  // Ch 7: CIDR calculations
  const cidrInfo = useMemo(() => {
    const hostBits = 32 - sampleCidr;
    const totalIps = Math.pow(2, hostBits);
    const usableHosts = sampleCidr >= 31 ? (sampleCidr === 31 ? 2 : 1) : Math.max(0, totalIps - 2);

    // Calculate mask octets
    let maskInt = 0;
    for (let i = 0; i < sampleCidr; i++) {
      maskInt |= (1 << (31 - i));
    }
    const o1 = (maskInt >>> 24) & 255;
    const o2 = (maskInt >>> 16) & 255;
    const o3 = (maskInt >>> 8) & 255;
    const o4 = maskInt & 255;
    const maskStr = `${o1}.${o2}.${o3}.${o4}`;
    const wildcardStr = `${255 - o1}.${255 - o2}.${255 - o3}.${255 - o4}`;

    return {
      maskStr,
      wildcardStr,
      totalIps,
      usableHosts,
      hostBits
    };
  }, [sampleCidr]);

  // All 22 Chapters from doc/networking DOC.md with deeply interactive widgets
  const chapters = [
    {
      id: 'ch-1',
      num: 1,
      level: 'beginner',
      title: 'What is a Network?',
      summary: 'Host, Node, Client, Server, Bandwidth vs Throughput, Latency, Jitter, Packet Loss, and Protocols.',
      tags: ['Foundations', 'Bandwidth', 'Latency', 'Jitter', 'Packets'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.6' }}>
            A <strong>network</strong> is two or more devices connected together to share data, messages, and resources. The internet itself is a global, decentralized "network of networks".
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '10px'
          }}>
            {[
              { term: 'Host / Node', meaning: 'Any network-addressable device (PC, phone, server, IoT device, printer)' },
              { term: 'Client', meaning: 'Device or application that requests a service (e.g. Chrome browser)' },
              { term: 'Server', meaning: 'Device or software daemon that provides a service (e.g. NGINX web server)' },
              { term: 'Packet', meaning: 'Small unit of data formatted with headers and payload sent across links' },
              { term: 'Bandwidth', meaning: 'Theoretical maximum link capacity (e.g. 1 Gbps fiber link)' },
              { term: 'Throughput', meaning: 'Actual real-world payload data transferred per second (e.g. 840 Mbps)' },
              { term: 'Latency (RTT)', meaning: 'Time taken for a packet to travel from source to destination and back' },
              { term: 'Jitter', meaning: 'Variation in latency over consecutive packets (crucial for VoIP & gaming)' },
              { term: 'Packet Loss', meaning: 'Percentage of sent packets dropped due to buffer congestion or noise' },
              { term: 'Protocol', meaning: 'Standard agreed set of rules and syntax for communication (HTTP, TCP, IP)' }
            ].map(item => (
              <div key={item.term} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#34d399', marginBottom: '2px' }}>{item.term}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.meaning}</div>
              </div>
            ))}
          </div>

          {/* Interactive Widget: Bandwidth & Latency Calculator */}
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(0, 0, 0, 0.5) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Zap size={16} color="#34d399" />
              <strong style={{ fontSize: '0.86rem', color: '#34d399' }}>Interactive Widget: Bandwidth, Latency &amp; Transfer Time Calculator</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  <span>Link Bandwidth:</span>
                  <span style={{ color: '#38bdf8', fontWeight: '700' }}>{calcBandwidthMbps} Mbps</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={calcBandwidthMbps}
                  onChange={(e) => setCalcBandwidthMbps(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  <span>Round-Trip Latency:</span>
                  <span style={{ color: '#fbbf24', fontWeight: '700' }}>{calcLatencyMs} ms</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="300"
                  value={calcLatencyMs}
                  onChange={(e) => setCalcLatencyMs(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#fbbf24', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  <span>File Size:</span>
                  <span style={{ color: '#a855f7', fontWeight: '700' }}>{calcFileSizeMb} MB</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={calcFileSizeMb}
                  onChange={(e) => setCalcFileSizeMb(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#a855f7', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.4)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Pure Serialization Time: </span>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>{((calcFileSizeMb * 8) / calcBandwidthMbps).toFixed(2)} sec</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>BDP (In-Flight Buffer): </span>
                <span style={{ color: '#34d399', fontWeight: '700' }}>{((calcBandwidthMbps * 1e6 * (calcLatencyMs / 1000)) / (8 * 1024)).toFixed(0)} KB</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>User-Perceived Time: </span>
                <span style={{ color: '#f59e0b', fontWeight: '700' }}>{(((calcFileSizeMb * 8) / calcBandwidthMbps) + (calcLatencyMs / 1000 * 3)).toFixed(2)} sec</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ch-2',
      num: 2,
      level: 'beginner',
      title: 'Network Types & Topologies',
      summary: 'PAN, LAN, MAN, WAN, WLAN, SAN and topologies: Bus, Star, Ring, Mesh, Hybrid, and Spine-Leaf.',
      tags: ['LAN', 'WAN', 'Topologies', 'Mesh', 'Spine-Leaf'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '0.86rem', color: '#38bdf8', margin: '0 0 8px 0' }}>Network Types by Geographic Scope:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
              {[
                { type: 'PAN', scope: 'Personal (a few meters)', ex: 'Bluetooth earbuds, smart watch' },
                { type: 'LAN', scope: 'Building or campus', ex: 'Home Wi-Fi, office Ethernet network' },
                { type: 'MAN', scope: 'City-wide metro', ex: 'Municipal dark-fiber ring, cable ISP' },
                { type: 'WAN', scope: 'Country or global', ex: 'The public Internet, corporate SD-WAN' },
                { type: 'WLAN', scope: 'Wireless local network', ex: 'IEEE 802.11ax Wi-Fi access points' },
                { type: 'SAN', scope: 'Dedicated storage network', ex: 'Fibre Channel / iSCSI block storage' }
              ].map(t => (
                <div key={t.type} style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#38bdf8', fontSize: '0.82rem' }}>{t.type}</strong>
                    <span style={{ fontSize: '0.64rem', color: 'var(--text-dim)' }}>{t.scope}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{t.ex}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Topology Switcher */}
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(0, 0, 0, 0.5) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 size={16} color="#38bdf8" />
                <strong style={{ fontSize: '0.86rem', color: '#38bdf8' }}>Interactive Topology Explorer</strong>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['star', 'mesh', 'bus', 'ring', 'spine-leaf'].map(top => (
                  <button
                    key={top}
                    onClick={() => setSelectedTopology(top)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: selectedTopology === top ? '700' : '500',
                      background: selectedTopology === top ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)',
                      color: selectedTopology === top ? '#070a12' : '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    {top}
                  </button>
                ))}
              </div>
            </div>

            {selectedTopology === 'star' && (
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', fontSize: '0.78rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                <strong style={{ color: '#38bdf8' }}>Star Topology:</strong> All host nodes connect directly to a central switch or hub.<br />
                <span style={{ color: '#34d399' }}>✓ Pros:</span> Easy to manage, cabling failure only disconnects one host, easily expandable.<br />
                <span style={{ color: '#f87171' }}>✗ Cons:</span> Central switch is a single point of failure (SPOF). High total cabling required.
              </div>
            )}

            {selectedTopology === 'mesh' && (
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', fontSize: '0.78rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                <strong style={{ color: '#a855f7' }}>Full Mesh Topology:</strong> Every device connects directly to every other device: <code>Links = N*(N-1)/2</code>.<br />
                <span style={{ color: '#34d399' }}>✓ Pros:</span> Maximum fault tolerance, no single point of failure, multiple redundant paths.<br />
                <span style={{ color: '#f87171' }}>✗ Cons:</span> Extremely expensive; quadratic link scaling makes it impractical for large LANs.
              </div>
            )}

            {selectedTopology === 'bus' && (
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', fontSize: '0.78rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                <strong style={{ color: '#f59e0b' }}>Bus Topology:</strong> All devices tap into a single shared coaxial trunk cable with 50Ω terminators.<br />
                <span style={{ color: '#34d399' }}>✓ Pros:</span> Cheap, minimal cabling required (historical 10BASE2).<br />
                <span style={{ color: '#f87171' }}>✗ Cons:</span> A single cable break halts the whole bus; high packet collision rates with CSMA/CD.
              </div>
            )}

            {selectedTopology === 'ring' && (
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', fontSize: '0.78rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                <strong style={{ color: '#ec4899' }}>Ring Topology:</strong> Each node connects to exactly two neighbors forming a closed loop (e.g. Token Ring or SONET).<br />
                <span style={{ color: '#34d399' }}>✓ Pros:</span> Deterministic token-passing performance under heavy loads.<br />
                <span style={{ color: '#f87171' }}>✗ Cons:</span> One cable break breaks the token cycle (unless dual counter-rotating rings like FDDI are deployed).
              </div>
            )}

            {selectedTopology === 'spine-leaf' && (
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', fontSize: '0.78rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                <strong style={{ color: '#34d399' }}>Spine-Leaf Clos Fabric (Modern Cloud Data Centers):</strong> Every leaf switch connects to every spine switch.<br />
                <span style={{ color: '#34d399' }}>✓ Pros:</span> Guaranteed 1-hop latency between any two rack servers. Non-blocking high bandwidth with Equal-Cost Multi-Path (ECMP).<br />
                <span style={{ color: '#f87171' }}>✗ Cons:</span> Requires massive amounts of fiber transceiver cabling in the data center.
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'ch-3',
      num: 3,
      level: 'beginner',
      title: 'Network Devices & Physical Cabling',
      summary: 'Hubs, Switches, Routers, L3 Switches, Firewalls, Load Balancers, Cat6 Copper, Multimode & Single-Mode Fiber.',
      tags: ['Hardware', 'Switches', 'Routers', 'Fiber', 'Cat6a'],
      hasWidget: false,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h4 style={{ fontSize: '0.86rem', color: '#fbbf24', margin: '0 0 8px 0' }}>Network Devices by OSI Layer:</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '8px'
            }}>
              {[
                { dev: 'Hub', layer: 'L1 Physical', func: 'Repeats electrical signals to all ports (obsolete collision hub)' },
                { dev: 'Switch', layer: 'L2 Data Link', func: 'Inspects MAC addresses and switches frames via ASIC hardware' },
                { dev: 'Router', layer: 'L3 Network', func: 'Routes packets across distinct subnets using IP routing tables' },
                { dev: 'Layer 3 Switch', layer: 'L2 & L3', func: 'Switches and routes inter-VLAN traffic at line-rate silicon speed' },
                { dev: 'Access Point (AP)', layer: 'L1 & L2', func: 'Bridges wireless 802.11 radio frames to 802.3 Ethernet' },
                { dev: 'Firewall', layer: 'L3 to L7', func: 'Stateful connection tracking & deep packet inspection filtering' },
                { dev: 'Load Balancer', layer: 'L4 to L7', func: 'Distributes incoming traffic across backend server pools' },
                { dev: 'IDS / IPS', layer: 'L3 to L7', func: 'Inspects signatures and heuristics to detect and block malicious traffic' }
              ].map(d => (
                <div key={d.dev} style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#fbbf24', fontSize: '0.82rem' }}>{d.dev}</strong>
                    <span style={{ fontSize: '0.64rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{d.layer}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{d.func}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.86rem', color: '#34d399', margin: '0 0 8px 0' }}>Physical Cabling &amp; Media Standards:</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem'
            }}>
              <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>Cat5e / Cat6 Copper</span>
                <div style={{ color: '#cbd5e1', fontSize: '0.7rem', marginTop: '2px' }}>1 to 10 Gbps Ethernet LAN • Max 100 meters (attenuation limit)</div>
              </div>
              <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ color: '#34d399', fontWeight: '700' }}>Multimode Fiber (OM3/OM4)</span>
                <div style={{ color: '#cbd5e1', fontSize: '0.7rem', marginTop: '2px' }}>50µm core, LED/VCSEL light • Up to 550m in datacenters (100 Gbps)</div>
              </div>
              <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ color: '#f59e0b', fontWeight: '700' }}>Single-Mode Fiber (OS2)</span>
                <div style={{ color: '#cbd5e1', fontSize: '0.7rem', marginTop: '2px' }}>9µm core, laser light • Long haul telco spans (10 km to 80 km)</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ch-4',
      num: 4,
      level: 'beginner',
      title: 'The OSI (7 Layers) and TCP/IP (4 Layers) Models',
      summary: 'Encapsulation, Protocol Data Units (Bits, Frame, Packet, Segment, Data), mnemonics, and layer-by-layer header wrapping.',
      tags: ['OSI Model', 'TCP/IP', 'Encapsulation', 'PDU'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.6' }}>
            Data traveling down the networking stack gets wrapped with protocol headers at each tier (<strong>Encapsulation</strong>), and unwrapped on the receiver (<strong>Decapsulation</strong>).
          </p>

          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', fontSize: '0.78rem', color: '#cbd5e1' }}>
            <span style={{ color: '#c084fc', fontWeight: '700' }}>OSI Mnemonics: </span><br />
            • Top to Bottom (7 &rarr; 1): <strong>All People Seem To Need Data Processing</strong><br />
            • Bottom to Top (1 &rarr; 7): <strong>Please Do Not Throw Sausage Pizza Away</strong>
          </div>

          {/* Interactive Encapsulation Stepper */}
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(0, 0, 0, 0.5) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} color="#c084fc" />
                <strong style={{ fontSize: '0.86rem', color: '#c084fc' }}>Interactive Encapsulation Stepper: Layer {encapStep}</strong>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setEncapStep(Math.min(7, encapStep + 1))}
                  disabled={encapStep === 7}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                >
                  &uarr; Up (Decapsulate)
                </button>
                <button
                  onClick={() => setEncapStep(Math.max(1, encapStep - 1))}
                  disabled={encapStep === 1}
                  className="btn btn-primary"
                  style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                >
                  &darr; Down (Encapsulate)
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { num: 7, name: 'Application', pdu: 'Data', color: '#ef4444', desc: 'HTTP request: "GET /index.html HTTP/1.1"' },
                { num: 6, name: 'Presentation', pdu: 'Data', color: '#f97316', desc: 'TLS 1.3 AES-GCM 256-bit ciphertext encryption' },
                { num: 5, name: 'Session', pdu: 'Data', color: '#f59e0b', desc: 'Socket connection state management' },
                { num: 4, name: 'Transport', pdu: 'Segment', color: '#10b981', desc: 'Adds TCP Header: Source Port 54321, Dest Port 443, Seq=100' },
                { num: 3, name: 'Network', pdu: 'Packet', color: '#06b6d4', desc: 'Adds IP Header: Source 192.168.1.50, Dest 142.250.190.46, TTL 64' },
                { num: 2, name: 'Data Link', pdu: 'Frame', color: '#6366f1', desc: 'Adds Ethernet Header (Source/Dest MAC) + CRC-32 Trailer' },
                { num: 1, name: 'Physical', pdu: 'Bits', color: '#8b5cf6', desc: 'Modulates bits (01011001) onto optical fiber light or copper voltage' }
              ].map(layer => {
                const isCurrent = encapStep === layer.num;
                const isIncluded = encapStep <= layer.num;
                return (
                  <div
                    key={layer.num}
                    onClick={() => setEncapStep(layer.num)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: isCurrent ? `${layer.color}35` : isIncluded ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.2)',
                      border: isCurrent ? `1px solid ${layer.color}` : '1px solid transparent',
                      cursor: 'pointer',
                      opacity: isIncluded ? 1 : 0.4
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '4px',
                        background: layer.color,
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {layer.num}
                      </span>
                      <strong style={{ color: layer.color, fontSize: '0.8rem', minWidth: '100px' }}>{layer.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>[{layer.pdu}]</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'right' }}>{layer.desc}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigateToSimulator && onNavigateToSimulator('osi')}
              className="btn btn-secondary"
              style={{ fontSize: '0.76rem', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Layers size={14} color="#34d399" />
              Open Interactive OSI 7-Layer Simulator
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'ch-5',
      num: 5,
      level: 'beginner',
      title: 'IP Addressing: IPv4, IPv6, Subnets & MAC Addresses',
      summary: '32-bit vs 128-bit addresses, RFC 1918 private ranges (10/8, 172.16/12, 192.168/16), loopback, APIPA, and IPv6 zero compression.',
      tags: ['IPv4', 'IPv6', 'RFC 1918', 'MAC Address', 'Ports'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <strong style={{ color: '#38bdf8', fontSize: '0.82rem' }}>RFC 1918 Private Ranges (Non-routable on WAN):</strong>
              <div style={{ marginTop: '6px', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#cbd5e1', lineHeight: '1.5' }}>
                • <code>10.0.0.0/8</code> (10.0.0.0 – 10.255.255.255)<br />
                • <code>172.16.0.0/12</code> (172.16.0.0 – 172.31.255.255)<br />
                • <code>192.168.0.0/16</code> (192.168.0.0 – 192.168.255.255)
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <strong style={{ color: '#fbbf24', fontSize: '0.82rem' }}>Special Purpose IPv4 Addresses:</strong>
              <div style={{ marginTop: '6px', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#cbd5e1', lineHeight: '1.5' }}>
                • <code>127.0.0.1</code> : Localhost / Loopback<br />
                • <code>169.254.0.0/16</code> : APIPA (Self-assigned when DHCP fails)<br />
                • <code>0.0.0.0/0</code> : Default route wildcard<br />
                • <code>100.64.0.0/10</code> : CGNAT (Carrier-Grade NAT)
              </div>
            </div>
          </div>

          {/* Interactive IPv6 Zero Compressor */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#38bdf8', marginBottom: '8px' }}>
              Interactive IPv6 Zero-Compression Tool:
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                value={ipv6Input}
                onChange={(e) => setIpv6Input(e.target.value)}
                placeholder="2001:0db8:0000:0000:0000:ff00:0042:8329"
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: '#ffffff',
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <button
                onClick={() => setIpv6Input('2001:0db8:0000:0000:0000:0000:0000:0001')}
                className="btn btn-secondary"
                style={{ fontSize: '0.7rem' }}
              >
                Sample ::1
              </button>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
              Compressed Shorthand: <strong style={{ color: '#34d399' }}>{compressIPv6(ipv6Input)}</strong>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ch-6',
      num: 6,
      level: 'beginner',
      title: 'Essential Protocols Directory',
      summary: 'HTTP (80), HTTPS (443), DNS (53), DHCP (67/68), SSH (22), FTP (21), SMTP (25), NTP (123), SNMP (161), and ICMP.',
      tags: ['Protocols', 'Ports', 'HTTP', 'HTTPS', 'DNS', 'DHCP'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '8px'
          }}>
            {[
              { proto: 'HTTPS (443)', type: 'TCP', desc: 'Secure web encrypted with TLS 1.3' },
              { proto: 'HTTP (80)', type: 'TCP', desc: 'Unencrypted plain web requests' },
              { proto: 'DNS (53)', type: 'UDP/TCP', desc: 'Domain name resolution to IP addresses' },
              { proto: 'DHCP (67/68)', type: 'UDP', desc: 'Automatic dynamic IP host configuration' },
              { proto: 'SSH (22)', type: 'TCP', desc: 'Secure cryptographic terminal shell login' },
              { proto: 'NTP (123)', type: 'UDP', desc: 'Sub-millisecond clock synchronization' },
              { proto: 'SMTP (25/587)', type: 'TCP', desc: 'Email transfer and relaying' },
              { proto: 'BGP (179)', type: 'TCP', desc: 'Autonomous system routing across the Internet' },
              { proto: 'SNMP (161)', type: 'UDP', desc: 'Network device monitoring and metrics' },
              { proto: 'ICMP (Ping)', type: 'L3 IP', desc: 'Echo requests and diagnostic alerts' }
            ].map(p => (
              <div key={p.proto} style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#34d399', fontSize: '0.8rem' }}>{p.proto}</strong>
                  <span style={{ fontSize: '0.64rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{p.type}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigateToSimulator && onNavigateToSimulator('protocols')}
              className="btn btn-secondary"
              style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Radio size={14} color="#10b981" />
              Open Protocols Explorer
            </button>
            <button
              onClick={() => onNavigateToSimulator && onNavigateToSimulator('google-journey')}
              className="btn btn-primary"
              style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Globe size={14} color="#ffffff" />
              View End-to-End "https WEB Flow" Simulator
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'ch-7',
      num: 7,
      level: 'intermediate',
      title: 'Subnetting, CIDR & VLSM In Depth',
      summary: 'CIDR masks (/8 to /32), formulas, block size calculation, Variable Length Subnet Masking (VLSM), and supernetting.',
      tags: ['Subnetting', 'CIDR', 'VLSM', 'Subnet Calculator'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#e2e8f0', lineHeight: '1.6' }}>
            Subnetting divides a large network into smaller broadcast domains. The golden formula for usable host count is:
            <code style={{ color: '#fbbf24', marginLeft: '6px', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              Usable Hosts = 2^(host bits) - 2
            </code> (minus 2 for the Network Address and Broadcast Address).
          </p>

          {/* Interactive Live CIDR Calculator */}
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(245, 158, 11, 0.35)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#fbbf24' }}>
                Interactive CIDR Subnet Calculator: /{sampleCidr}
              </span>
              <span style={{ fontSize: '0.74rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                {cidrInfo.usableHosts.toLocaleString()} Usable Hosts
              </span>
            </div>

            <input
              type="range"
              min="8"
              max="32"
              value={sampleCidr}
              onChange={(e) => setSampleCidr(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '8px',
              marginTop: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem'
            }}>
              <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.4)' }}>
                <span style={{ color: 'var(--text-dim)' }}>Subnet Mask: </span>
                <span style={{ color: '#38bdf8' }}>{cidrInfo.maskStr}</span>
              </div>
              <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.4)' }}>
                <span style={{ color: 'var(--text-dim)' }}>Wildcard Mask: </span>
                <span style={{ color: '#fbbf24' }}>{cidrInfo.wildcardStr}</span>
              </div>
              <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.4)' }}>
                <span style={{ color: 'var(--text-dim)' }}>Total Addresses: </span>
                <span style={{ color: '#a855f7' }}>{cidrInfo.totalIps.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToSimulator && onNavigateToSimulator('subnet')}
            className="btn btn-secondary"
            style={{ fontSize: '0.76rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sliders size={14} color="#f59e0b" />
            Launch Full Subnet &amp; CIDR Calculator
          </button>
        </div>
      )
    },
    {
      id: 'ch-8',
      num: 8,
      level: 'intermediate',
      title: 'Routing & Switching: Forwarding Tables & Administrative Distance',
      summary: 'MAC address learning/flooding, longest prefix match, administrative distance (Connected 0, Static 1, eBGP 20, OSPF 110, iBGP 200).',
      tags: ['Routing', 'Switching', 'Longest Prefix Match', 'Administrative Distance'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#e2e8f0', lineHeight: '1.5' }}>
            Switches forward frames by matching destination MAC in the <strong>MAC Address Table (FDB)</strong>. Routers forward packets by matching destination IP against their <strong>Routing Table</strong> using <strong>Longest Prefix Match</strong>.
          </p>

          {/* Interactive Longest Prefix Match Tester */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#38bdf8', marginBottom: '8px' }}>
              Interactive Longest Prefix Match Evaluator:
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                value={testIpForRoute}
                onChange={(e) => setTestIpForRoute(e.target.value)}
                placeholder="10.1.5.24"
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: '#ffffff',
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <button
                onClick={() => setTestIpForRoute('10.1.200.5')}
                className="btn btn-secondary"
                style={{ fontSize: '0.7rem' }}
              >
                Sample 10.1.x
              </button>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              Matched Route in Table: <strong style={{ color: '#34d399' }}>10.1.0.0/16 via 192.168.1.3 (eth0)</strong><br />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                Rule: /16 (16-bit match) is more specific than 10.0.0.0/8 (8-bit match) and 0.0.0.0/0 (0-bit match). Longest prefix always wins!
              </span>
            </div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#cbd5e1' }}>
            <span style={{ color: '#38bdf8' }}>Administrative Distance (AD):</span> Connected (0) &gt; Static (1) &gt; eBGP (20) &gt; EIGRP (90) &gt; OSPF (110) &gt; RIP (120) &gt; iBGP (200). Lower AD wins!
          </div>
        </div>
      )
    },
    {
      id: 'ch-9',
      num: 9,
      level: 'intermediate',
      title: 'NAT, DHCP & DNS in Depth',
      summary: 'SNAT vs DNAT vs PAT (NAT Overload), DHCP 4-stage DORA process, DNS hierarchical resolution and record types (A, AAAA, CNAME, MX, TXT).',
      tags: ['NAT', 'PAT', 'DHCP', 'DORA', 'DNS'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Interactive DHCP DORA Stepper */}
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(0, 0, 0, 0.5) 100%)',
            border: '1px solid rgba(236, 72, 153, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong style={{ fontSize: '0.84rem', color: '#ec4899' }}>Interactive DHCP DORA Process (Step {doraStep} of 4)</strong>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4].map(s => (
                  <button
                    key={s}
                    onClick={() => setDoraStep(s)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: 'none',
                      background: doraStep === s ? '#ec4899' : 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {doraStep === 1 && (
              <div style={{ fontSize: '0.76rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                <strong style={{ color: '#ec4899' }}>1. Discover:</strong> Client broadcasts <code>0.0.0.0:68 &rarr; 255.255.255.255:67</code> asking: "Are there any DHCP servers on this network?"
              </div>
            )}
            {doraStep === 2 && (
              <div style={{ fontSize: '0.76rem', color: '#38bdf8', lineHeight: '1.5' }}>
                <strong style={{ color: '#38bdf8' }}>2. Offer:</strong> DHCP Server replies with offered IP <code>192.168.1.100</code>, mask <code>/24</code>, gateway <code>192.168.1.1</code>, and lease time 86400s.
              </div>
            )}
            {doraStep === 3 && (
              <div style={{ fontSize: '0.76rem', color: '#fbbf24', lineHeight: '1.5' }}>
                <strong style={{ color: '#fbbf24' }}>3. Request:</strong> Client broadcasts formally requesting the offered IP <code>192.168.1.100</code> to inform all other potential servers.
              </div>
            )}
            {doraStep === 4 && (
              <div style={{ fontSize: '0.76rem', color: '#34d399', lineHeight: '1.5' }}>
                <strong style={{ color: '#34d399' }}>4. Acknowledge:</strong> Server commits the binding into its lease database and confirms with a DHCPACK. Client configures its interface!
              </div>
            )}
          </div>

          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <strong style={{ color: '#38bdf8', fontSize: '0.82rem' }}>DNS Resolution Chain:</strong>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '4px' }}>
              Client Stub Resolver &rarr; Recursive DNS (8.8.8.8) &rarr; Root Server (.) &rarr; TLD Server (.com) &rarr; Authoritative Server (example.com).
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ch-10',
      num: 10,
      level: 'intermediate',
      title: 'TCP vs UDP in Depth: Handshakes, Windowing & QUIC',
      summary: 'TCP 3-way handshake (SYN, SYN-ACK, ACK), teardown, sliding window flow control, congestion avoidance (CUBIC, BBR), and UDP 0-RTT HTTP/3 QUIC.',
      tags: ['TCP', 'UDP', 'QUIC', 'Handshake', 'HTTP/3'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Interactive TCP Handshake Simulator */}
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(0, 0, 0, 0.5) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong style={{ fontSize: '0.84rem', color: '#34d399' }}>Interactive TCP 3-Way Handshake</strong>
              <button
                onClick={() => setTcpHandshakeStep((tcpHandshakeStep + 1) % 4)}
                className="btn btn-primary"
                style={{ fontSize: '0.72rem', padding: '4px 10px' }}
              >
                {tcpHandshakeStep === 3 ? 'Reset Handshake' : 'Next Packet &rarr;'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
              <div style={{ padding: '8px 12px', borderRadius: '6px', background: tcpHandshakeStep >= 1 ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)', color: tcpHandshakeStep >= 1 ? '#38bdf8' : 'var(--text-dim)' }}>
                1. Client &rarr; Server [SYN] Seq=1000, Win=65535, MSS=1460 (SYN_SENT)
              </div>
              <div style={{ padding: '8px 12px', borderRadius: '6px', background: tcpHandshakeStep >= 2 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)', color: tcpHandshakeStep >= 2 ? '#fbbf24' : 'var(--text-dim)' }}>
                2. Server &rarr; Client [SYN, ACK] Seq=5000, Ack=1001, Win=65535 (SYN_RCVD)
              </div>
              <div style={{ padding: '8px 12px', borderRadius: '6px', background: tcpHandshakeStep >= 3 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.04)', color: tcpHandshakeStep >= 3 ? '#34d399' : 'var(--text-dim)' }}>
                3. Client &rarr; Server [ACK] Seq=1001, Ack=5001 (ESTABLISHED!)
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToSimulator && onNavigateToSimulator('protocols')}
            className="btn btn-secondary"
            style={{ fontSize: '0.76rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Radio size={14} color="#10b981" />
            Open Interactive Protocols Explorer
          </button>
        </div>
      )
    },
    {
      id: 'ch-11',
      num: 11,
      level: 'intermediate',
      title: 'Wireless Networking: Wi-Fi Standards & Security',
      summary: '802.11n (Wi-Fi 4), 802.11ac (Wi-Fi 5), 802.11ax (Wi-Fi 6/6E), 802.11be (Wi-Fi 7), 2.4/5/6 GHz spectrum, and WPA3 security.',
      tags: ['Wireless', 'Wi-Fi 6', 'Wi-Fi 7', 'WPA3', 'OFDMA'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
            {[
              { id: '2.4ghz', label: '2.4 GHz Band' },
              { id: '5ghz', label: '5 GHz Band' },
              { id: '6ghz', label: '6 GHz (Wi-Fi 6E/7)' }
            ].map(b => (
              <button
                key={b.id}
                onClick={() => setWifiBand(b.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: wifiBand === b.id ? '700' : '500',
                  background: wifiBand === b.id ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)',
                  color: wifiBand === b.id ? '#070a12' : '#ffffff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          {wifiBand === '2.4ghz' && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              <strong style={{ color: '#38bdf8' }}>2.4 GHz Band:</strong> High wall penetration, long range. However, it is heavily congested by Bluetooth and microwaves. Only 3 non-overlapping 20 MHz channels (1, 6, 11).
            </div>
          )}
          {wifiBand === '5ghz' && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              <strong style={{ color: '#34d399' }}>5 GHz Band:</strong> Faster transmission, wider channel bonding (40, 80, 160 MHz). Lower wall penetration than 2.4 GHz. Up to 25+ non-overlapping channels.
            </div>
          )}
          {wifiBand === '6ghz' && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              <strong style={{ color: '#a855f7' }}>6 GHz Band (Wi-Fi 6E &amp; Wi-Fi 7):</strong> Pristine spectrum without legacy device drag. Massive 320 MHz channels, 4096-QAM modulation, multi-gigabit throughput.
            </div>
          )}
        </div>
      )
    },
    {
      id: 'ch-12',
      num: 12,
      level: 'intermediate',
      title: 'Network Security Fundamentals & Common Attacks',
      summary: 'The CIA triad, Firewalls (Stateless vs Stateful vs NGFW), attacks and defenses: DoS/DDoS, MitM, ARP spoofing, DNS poisoning, and BGP hijacking.',
      tags: ['Security', 'Firewalls', 'DDoS', 'MitM', 'ARP Spoofing', 'BGP Hijacking'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Interactive Attack and Defense Switcher */}
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(0, 0, 0, 0.5) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              <strong style={{ fontSize: '0.84rem', color: '#f87171' }}>Interactive Attack &amp; Defense Selector</strong>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { id: 'arp-spoof', label: 'ARP Spoofing' },
                  { id: 'dns-poison', label: 'DNS Poisoning' },
                  { id: 'bgp-hijack', label: 'BGP Hijack' },
                  { id: 'ddos', label: 'DDoS Flooding' }
                ].map(att => (
                  <button
                    key={att.id}
                    onClick={() => setSelectedAttack(att.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: selectedAttack === att.id ? '700' : '500',
                      background: selectedAttack === att.id ? '#ef4444' : 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {att.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedAttack === 'arp-spoof' && (
              <div style={{ fontSize: '0.76rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                <strong style={{ color: '#f87171' }}>Attack Mechanism:</strong> Attacker broadcasts unsolicited ARP replies binding their own MAC address to the default gateway IP, intercepting local LAN frames.<br />
                <strong style={{ color: '#34d399' }}>Standard Defense:</strong> Dynamic ARP Inspection (DAI) on managed switches coupled with DHCP Snooping.
              </div>
            )}
            {selectedAttack === 'dns-poison' && (
              <div style={{ fontSize: '0.76rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                <strong style={{ color: '#f87171' }}>Attack Mechanism:</strong> Attacker races recursive DNS resolvers with spoofed DNS query responses to inject malicious IP addresses into cache.<br />
                <strong style={{ color: '#34d399' }}>Standard Defense:</strong> DNSSEC cryptographic signatures, source port randomization, and DNS-over-HTTPS (DoH).
              </div>
            )}
            {selectedAttack === 'bgp-hijack' && (
              <div style={{ fontSize: '0.76rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                <strong style={{ color: '#f87171' }}>Attack Mechanism:</strong> A rogue Autonomous System advertises a more specific IP prefix (e.g. /24) to divert global traffic across the internet.<br />
                <strong style={{ color: '#34d399' }}>Standard Defense:</strong> RPKI (Resource Public Key Infrastructure) Route Origin Authorizations (ROAs).
              </div>
            )}
            {selectedAttack === 'ddos' && (
              <div style={{ fontSize: '0.76rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                <strong style={{ color: '#f87171' }}>Attack Mechanism:</strong> Botnets flood targets with SYN floods, UDP amplification, or HTTP GET attacks exceeding link capacity.<br />
                <strong style={{ color: '#34d399' }}>Standard Defense:</strong> BGP Anycast scrubbing centers (Cloudflare, AWS Shield), SYN cookies, rate limiting.
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'ch-13',
      num: 13,
      level: 'intermediate',
      title: 'Essential Command-Line Tools & Diagnostics',
      summary: 'ping, traceroute, mtr, dig, curl, ip, ss, netstat, nmap, netcat (nc), and tcpdump with copyable snippets.',
      tags: ['CLI Tools', 'ping', 'traceroute', 'dig', 'nmap', 'tcpdump'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { cmd: 'ping -c 4 8.8.8.8', desc: 'Test ICMP reachability and round-trip latency' },
            { cmd: 'traceroute 1.1.1.1', desc: 'Hop-by-hop router path discovery using incrementing TTL' },
            { cmd: 'dig +short example.com', desc: 'Direct DNS query for domain A-record' },
            { cmd: 'ss -tulpn', desc: 'Display listening TCP/UDP sockets and process IDs in Linux' },
            { cmd: 'nmap -sV -p 1-1000 host', desc: 'Service and version port scan across first 1000 ports' },
            { cmd: 'tcpdump -i eth0 port 53 -nn', desc: 'Live packet capture filtering on DNS traffic' }
          ].map(c => (
            <div key={c.cmd} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div>
                <span style={{ color: '#34d399', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: '700' }}>$ {c.cmd}</span>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{c.desc}</div>
              </div>
              <button
                onClick={() => copyToClipboard(c.cmd, c.cmd)}
                style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer' }}
              >
                {copiedSnippet === c.cmd ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              </button>
            </div>
          ))}

          <button
            onClick={() => onNavigateToSimulator && onNavigateToSimulator('terminal')}
            className="btn btn-secondary"
            style={{ fontSize: '0.76rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Terminal size={14} color="#34d399" />
            Open Interactive Network CLI Sandbox
          </button>
        </div>
      )
    },
    {
      id: 'ch-14',
      num: 14,
      level: 'advanced',
      title: 'Advanced Routing: OSPF (Link-State) & BGP (Path-Vector)',
      summary: 'Dijkstra SPF algorithm, Area 0, DR/BDR, Autonomous Systems (ASN), eBGP vs iBGP, and the 9-step BGP best-path decision algorithm.',
      tags: ['OSPF', 'BGP', 'Dijkstra', 'Autonomous System', 'BGP Best Path'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#e2e8f0', lineHeight: '1.5' }}>
            <strong>BGP (Border Gateway Protocol)</strong> powers the entire global internet. When a router receives multiple paths to a destination IP prefix, it runs the standardized <strong>BGP Best-Path Decision Algorithm</strong>:
          </p>

          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.45)', border: '1px solid rgba(168, 85, 247, 0.3)', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            <strong style={{ color: '#c084fc' }}>BGP Best-Path Order:</strong><br />
            1. Highest <strong>Weight</strong> (Cisco proprietary)<br />
            2. Highest <strong>Local Preference</strong> (default 100)<br />
            3. Locally originated route<br />
            4. Shortest <strong>AS_PATH</strong> (fewest AS hops)<br />
            5. Lowest <strong>Origin</strong> (IGP &lt; EGP &lt; Incomplete)<br />
            6. Lowest <strong>MED</strong> (Multi-Exit Discriminator)<br />
            7. Prefer <strong>eBGP</strong> over iBGP<br />
            8. Lowest IGP metric to BGP next-hop<br />
            9. Lowest Router ID
          </div>
        </div>
      )
    },
    {
      id: 'ch-15',
      num: 15,
      level: 'advanced',
      title: 'VLANs, 802.1Q Trunking & Spanning Tree (STP/RSTP)',
      summary: 'Broadcast isolation, 802.1Q tag insertion, native VLAN, STP loop prevention, Root Bridge election, and LACP link aggregation.',
      tags: ['VLAN', '802.1Q', 'STP', 'RSTP', 'LACP'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#e2e8f0' }}>
            Without <strong>Spanning Tree Protocol (STP / 802.1w RSTP)</strong>, redundant switch links cause catastrophic broadcast storms and MAC table thrashing that take down entire enterprise networks in seconds.
          </p>

          {/* Interactive STP Root Bridge Election Calculator */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <strong style={{ fontSize: '0.82rem', color: '#818cf8', display: 'block', marginBottom: '8px' }}>
              Interactive STP Root Bridge Election:
            </strong>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Switch A Bridge Priority:</span>
                <select
                  value={switchPriorityA}
                  onChange={(e) => setSwitchPriorityA(parseInt(e.target.value, 10))}
                  style={{ width: '100%', background: '#070a12', color: '#ffffff', padding: '4px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.74rem', marginTop: '2px' }}
                >
                  <option value={32768}>32768 (Default)</option>
                  <option value={4096}>4096 (High Priority)</option>
                  <option value={61440}>61440 (Low Priority)</option>
                </select>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Switch B Bridge Priority:</span>
                <select
                  value={switchPriorityB}
                  onChange={(e) => setSwitchPriorityB(parseInt(e.target.value, 10))}
                  style={{ width: '100%', background: '#070a12', color: '#ffffff', padding: '4px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.74rem', marginTop: '2px' }}
                >
                  <option value={32768}>32768 (Default)</option>
                  <option value={4096}>4096 (High Priority)</option>
                  <option value={61440}>61440 (Low Priority)</option>
                </select>
              </div>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
              Elected STP Root Bridge: <strong style={{ color: '#34d399' }}>{switchPriorityA < switchPriorityB ? 'Switch A' : switchPriorityB < switchPriorityA ? 'Switch B' : 'Tie breaker: Lowest MAC Address wins!'}</strong> (Lowest bridge priority wins)
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ch-16',
      num: 16,
      level: 'advanced',
      title: 'VPNs, IPsec, WireGuard & VXLAN Overlays',
      summary: 'Site-to-site vs remote access, IPsec IKEv2 / ESP, WireGuard ChaCha20/Curve25519, and VXLAN Layer-2 over Layer-3 overlays.',
      tags: ['VPN', 'IPsec', 'WireGuard', 'VXLAN', 'Encapsulation'],
      hasWidget: false,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
            <div style={{ padding: '10px 12px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <strong style={{ color: '#38bdf8', fontSize: '0.8rem' }}>WireGuard</strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Modern ~4,000 LOC kernel implementation using Curve25519 &amp; ChaCha20-Poly1305. Instant cryptographic handshake.</div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <strong style={{ color: '#10b981', fontSize: '0.8rem' }}>VXLAN Overlays</strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Encapsulates Layer-2 Ethernet frames inside Layer-3 UDP packets (port 4789), scaling to 16 million VLAN VNIs in data centers!</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ch-17',
      num: 17,
      level: 'advanced',
      title: 'Load Balancing, Anycast & High Availability ("Nines")',
      summary: 'L4 vs L7 load balancing, BGP Anycast routing, ECMP, health checks, and the High Availability "Nines" uptime breakdown.',
      tags: ['Load Balancing', 'Anycast', 'HA', 'Uptime', 'ECMP'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Interactive Nines Calculator */}
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(0, 0, 0, 0.5) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '0.84rem', color: '#38bdf8' }}>Interactive High Availability SLA Calculator: {availabilityPct}%</strong>
              <span style={{ fontSize: '0.74rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                Max Downtime: {calculatedDowntime}
              </span>
            </div>
            <input
              type="range"
              min="90"
              max="99.999"
              step="0.001"
              value={availabilityPct}
              onChange={(e) => setAvailabilityPct(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '8px',
            fontFamily: 'var(--font-mono)'
          }}>
            {[
              { nines: '99% (Two 9s)', down: '3.65 days / yr', color: '#f87171' },
              { nines: '99.9% (Three 9s)', down: '8.76 hours / yr', color: '#fbbf24' },
              { nines: '99.99% (Four 9s)', down: '52.6 mins / yr', color: '#34d399' },
              { nines: '99.999% (Five 9s)', down: '5.26 mins / yr', color: '#38bdf8' }
            ].map(ha => (
              <div key={ha.nines} style={{ padding: '8px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.4)', textAlign: 'center' }}>
                <div style={{ color: ha.color, fontSize: '0.76rem', fontWeight: '800' }}>{ha.nines}</div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>{ha.down}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateToSimulator && onNavigateToSimulator('advance')}
            className="btn btn-primary"
            style={{
              fontSize: '0.78rem',
              alignSelf: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              border: 'none',
              marginTop: '4px'
            }}
          >
            <Server size={14} color="#ffffff" />
            <span>Launch ADVANCE: Proxy, Reverse Proxy &amp; Load Balancer Lab</span>
          </button>
        </div>
      )
    },
    {
      id: 'ch-18',
      num: 18,
      level: 'advanced',
      title: 'Quality of Service (QoS) & Traffic Engineering',
      summary: 'Classification (DSCP EF 46 for VoIP), queuing algorithms (LLQ, CBWFQ), traffic shaping vs policing, and WRED.',
      tags: ['QoS', 'DSCP', 'VoIP', 'Traffic Shaping'],
      hasWidget: false,
      content: (
        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.5' }}>
          • <strong>VoIP SLA Targets:</strong> One-way latency &lt; 150ms, Jitter &lt; 30ms, Packet Loss &lt; 1%. Marked with <strong>DSCP EF (Expedited Forwarding, decimal 46)</strong> in IP header ToS field.<br />
          • <strong>Traffic Shaping vs Policing:</strong> Shaping buffers burst traffic to smooth transmission rate; Policing hard-drops packets exceeding contracted bandwidth.
        </div>
      )
    },
    {
      id: 'ch-19',
      num: 19,
      level: 'advanced',
      title: 'Network Automation, NetDevOps & SDN',
      summary: 'Ansible, Terraform, Python (Netmiko, NAPALM), NETCONF/YANG, gNMI streaming telemetry, and CI/CD validation.',
      tags: ['Automation', 'Ansible', 'Python', 'YANG', 'SDN'],
      hasWidget: false,
      content: (
        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.5' }}>
          • <strong>Infrastructure as Code (IaC):</strong> Modern networks are defined in Git repositories as declarative YAML/JSON data models (YANG) and provisioned automatically via NetBox, Ansible, and Terraform.<br />
          • <strong>SDN Centralization:</strong> Separates Control Plane (BGP/OSPF route computation) from Data Plane (line-rate packet forwarding ASICs).
        </div>
      )
    },
    {
      id: 'ch-20',
      num: 20,
      level: 'advanced',
      title: 'Cloud, Container & Zero Trust Networking',
      summary: 'AWS VPC / Azure VNet / GCP VPC, Kubernetes CNI plugins (Cilium, Calico), eBPF kernel tracing, and Zero Trust Architecture (ZTNA).',
      tags: ['Cloud Networking', 'AWS VPC', 'Kubernetes CNI', 'Cilium', 'eBPF', 'Zero Trust'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            • <strong>eBPF Kernel Networking:</strong> Cilium leverages eBPF bytecode loaded directly into the Linux kernel socket layer, bypassing traditional iptables overhead for microsecond container pod routing.<br />
            • <strong>Zero Trust Architecture (ZTNA):</strong> "Never trust, always verify". Replaces perimeter corporate VPNs with identity-authenticated microsegmentation and mTLS service meshes (Istio).
          </div>

          {/* The Complete Set of Built-in Docker Network Drivers Table */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(14, 165, 233, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong style={{ fontSize: '0.84rem', color: '#38bdf8' }}>
                The Complete Set of Built-in Docker Network Drivers
              </strong>
              <span style={{ fontSize: '0.64rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', fontWeight: '700' }}>
                Docker Engine
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '8px 10px', color: '#38bdf8' }}>Driver</th>
                    <th style={{ padding: '8px 10px', color: '#cbd5e1' }}>Primary Use Case</th>
                    <th style={{ padding: '8px 10px', color: '#34d399' }}>Network Isolation</th>
                    <th style={{ padding: '8px 10px', color: '#fbbf24' }}>Routing Method</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { driver: 'bridge', useCase: 'Standalone containers on a single host.', isolation: 'High (Internal private subnet).', routing: 'NAT / Port mapping.' },
                    { driver: 'host', useCase: 'Maximum raw network performance.', isolation: 'None (Shares host network stack).', routing: 'Direct host ports.' },
                    { driver: 'none', useCase: 'Completely isolated tasks/batch jobs.', isolation: 'Absolute isolation.', routing: 'Loopback interface only.' },
                    { driver: 'overlay', useCase: 'Multi-host routing & Swarm clusters.', isolation: 'High (Encrypted virtual network).', routing: 'VXLAN tunnel across hosts.' },
                    { driver: 'macvlan', useCase: 'Legacy apps needing direct physical network access.', isolation: 'Low (Visible as physical devices).', routing: 'Unique MAC assigned to each container.' },
                    { driver: 'ipvlan', useCase: 'High-density spaces where MAC addresses are limited.', isolation: 'Low (Shares parent MAC).', routing: 'Unique IP assigned directly to container.' }
                  ].map(row => (
                    <tr key={row.driver} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '8px 10px', color: '#38bdf8', fontWeight: '700' }}><code>{row.driver}</code></td>
                      <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.useCase}</td>
                      <td style={{ padding: '8px 10px', color: '#34d399' }}>{row.isolation}</td>
                      <td style={{ padding: '8px 10px', color: '#fbbf24' }}>{row.routing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ch-21',
      num: 21,
      level: 'advanced',
      title: 'Troubleshooting Methodology & Layer Checklist',
      summary: 'Step-by-step triage flow: ping 127.0.0.1 -> own IP -> gateway -> 8.8.8.8 -> google.com -> curl -> traceroute.',
      tags: ['Troubleshooting', 'Triage Flow', 'Methodology'],
      hasWidget: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Interactive Network Diagnostic Troubleshooter */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(0, 0, 0, 0.5) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <strong style={{ fontSize: '0.84rem', color: '#34d399', display: 'block', marginBottom: '8px' }}>
              Interactive Network Symptom Troubleshooter:
            </strong>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {[
                { id: 'apipa', label: 'Gets 169.254.x.x' },
                { id: 'dns', label: 'Ping IP works, name fails' },
                { id: 'timeout', label: 'Connection timed out' },
                { id: 'mtu', label: 'Large file transfer hangs' }
              ].map(sym => (
                <button
                  key={sym.id}
                  onClick={() => setSelectedSymptom(sym.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: selectedSymptom === sym.id ? '700' : '500',
                    background: selectedSymptom === sym.id ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                    color: selectedSymptom === sym.id ? '#070a12' : '#ffffff',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {sym.label}
                </button>
              ))}
            </div>

            {selectedSymptom === 'apipa' && (
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#fbbf24' }}>Cause:</strong> DHCP server unreachable or IP pool exhausted.<br />
                <strong style={{ color: '#38bdf8' }}>Diagnostic Command:</strong> <code>ipconfig /renew</code> or check DHCP server relay configuration.
              </div>
            )}
            {selectedSymptom === 'dns' && (
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#fbbf24' }}>Cause:</strong> DNS resolver misconfigured, unreachable, or port 53 UDP blocked.<br />
                <strong style={{ color: '#38bdf8' }}>Diagnostic Command:</strong> <code>nslookup example.com 8.8.8.8</code> or <code>dig @8.8.8.8 example.com</code>.
              </div>
            )}
            {selectedSymptom === 'timeout' && (
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#fbbf24' }}>Cause:</strong> Firewall silently dropping packets or missing return route.<br />
                <strong style={{ color: '#38bdf8' }}>Diagnostic Command:</strong> <code>traceroute &lt;target&gt;</code> or check security groups / iptables rules.
              </div>
            )}
            {selectedSymptom === 'mtu' && (
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#fbbf24' }}>Cause:</strong> MTU/MSS mismatch with Path MTU Discovery (PMTUD) blocked by ICMP filter.<br />
                <strong style={{ color: '#38bdf8' }}>Diagnostic Command:</strong> <code>ping -s 1472 -M do &lt;target&gt;</code> (test DF Don't Fragment bit).
              </div>
            )}
          </div>

          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.5)', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            <strong style={{ color: '#34d399' }}>Fast 7-Step Triage Flow for "I can't reach X":</strong><br />
            1. <code style={{ color: '#38bdf8' }}>ping 127.0.0.1</code> &rarr; Is local TCP/IP kernel stack intact?<br />
            2. <code style={{ color: '#38bdf8' }}>ping &lt;own IP&gt;</code> &rarr; Is physical NIC configured &amp; UP?<br />
            3. <code style={{ color: '#38bdf8' }}>ping 192.168.1.1</code> &rarr; Can we reach default gateway on local LAN?<br />
            4. <code style={{ color: '#38bdf8' }}>ping 8.8.8.8</code> &rarr; Is public internet reachable by IP?<br />
            5. <code style={{ color: '#38bdf8' }}>ping google.com</code> &rarr; Is DNS name resolution working?<br />
            6. <code style={{ color: '#38bdf8' }}>curl -v https://site</code> &rarr; Is TLS handshake &amp; HTTP application healthy?<br />
            7. <code style={{ color: '#38bdf8' }}>traceroute &lt;target&gt;</code> &rarr; Where exactly along the path does routing drop?
          </div>
        </div>
      )
    },
    {
      id: 'ch-22',
      num: 22,
      level: 'advanced',
      title: 'Learning Path & Industry Certifications',
      summary: 'Study roadmaps: CompTIA Network+, Cisco CCNA, CCNP, CCIE, AWS Advanced Networking, recommended books, and lab emulators.',
      tags: ['Roadmap', 'Certifications', 'CCNA', 'Network+', 'Labs'],
      hasWidget: false,
      content: (
        <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.6' }}>
          • <strong>Certification Path:</strong> CompTIA Network+ (Foundations) &rarr; Cisco CCNA (Enterprise Routing &amp; Switching) &rarr; CCNP / AWS Advanced Networking Specialty &rarr; CCIE.<br />
          • <strong>Recommended Emulators:</strong> Cisco Packet Tracer (Beginner), GNS3 &amp; EVE-NG (Intermediate), Containerlab + FRRouting (Production Linux/Cloud).<br />
          • <strong>Core Literature:</strong> <em>Computer Networking: A Top-Down Approach</em> (Kurose &amp; Ross), <em>TCP/IP Illustrated Vol. 1</em> (Stevens), <em>Internet Routing Architectures</em> (Halabi).
        </div>
      )
    }
  ];

  // Filtered chapters based on level, widget, and search query
  const filteredChapters = useMemo(() => {
    return chapters.filter(ch => {
      if (activeLevel === 'widgets' && !ch.hasWidget) return false;
      if (activeLevel !== 'all' && activeLevel !== 'widgets' && ch.level !== activeLevel) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = ch.title.toLowerCase().includes(q);
        const matchSummary = ch.summary.toLowerCase().includes(q);
        const matchTags = ch.tags.some(t => t.toLowerCase().includes(q));
        return matchTitle || matchSummary || matchTags;
      }
      return true;
    });
  }, [activeLevel, searchQuery]);

  const completedCount = Object.values(completedChapters).filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 18px rgba(16, 185, 129, 0.4)'
            }}>
              <BookOpen size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  Computer Networking: Beginner to Advanced Guide
                </h2>
                <span className="badge" style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontSize: '0.68rem',
                  fontWeight: '700'
                }}>
                  Interactive 22 Chapters
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Based on <code style={{ color: '#38bdf8' }}>doc/networking DOC.md</code> with real-time interactive widgets, CIDR calculators, BGP decision engine, and diagnostic flows.
              </p>
            </div>
          </div>

          {/* Quick Jump Buttons to Live Simulators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigateToSimulator && onNavigateToSimulator('topology')}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Network size={14} color="#34d399" />
              <span>Packet Tracer</span>
            </button>
            <button
              onClick={() => onNavigateToSimulator && onNavigateToSimulator('google-journey')}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Globe size={14} color="#38bdf8" />
              <span>https WEB Flow</span>
            </button>
            <button
              onClick={() => onNavigateToSimulator && onNavigateToSimulator('advance')}
              className="btn btn-secondary"
              style={{
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(168, 85, 247, 0.45)',
                color: '#e2e8f0'
              }}
            >
              <Server size={14} color="#c084fc" />
              <span>ADVANCE: Proxy &amp; LB</span>
            </button>
          </div>
        </div>

        {/* Level Filters, Progress Bar & Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {/* Level Filter Pills */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
            gap: '2px'
          }}>
            {[
              { id: 'all', label: 'All Topics (22)' },
              { id: 'beginner', label: '🔰 Beginner (1–6)' },
              { id: 'intermediate', label: '⚡ Intermediate (7–13)' },
              { id: 'advanced', label: '🚀 Advanced (14–22)' },
              { id: 'widgets', label: '⚙ Interactive Widgets Only' }
            ].map(lvl => (
              <button
                key={lvl.id}
                onClick={() => setActiveLevel(lvl.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: activeLevel === lvl.id ? '700' : '500',
                  color: activeLevel === lvl.id ? '#ffffff' : 'var(--text-muted)',
                  background: activeLevel === lvl.id ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {/* Expand/Collapse All and Reading Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={expandedChapter === 'all' ? collapseAll : expandAll}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.74rem',
                color: '#e2e8f0',
                cursor: 'pointer'
              }}
            >
              {expandedChapter === 'all' ? 'Collapse All' : 'Expand All'}
            </button>

            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              width: '260px'
            }}>
              <Search size={14} color="var(--text-dim)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chapters, BGP, CIDR, ports..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.8rem'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Grid / Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredChapters.map((ch) => {
          const isExpanded = expandedChapter === 'all' || expandedChapter === ch.id;
          const isCompleted = completedChapters[ch.id];

          return (
            <div
              key={ch.id}
              style={{
                borderRadius: '14px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: isExpanded ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                boxShadow: isExpanded ? '0 0 20px rgba(16, 185, 129, 0.15)' : 'none'
              }}
            >
              {/* Chapter Header (Click to expand/collapse) */}
              <div
                onClick={() => setExpandedChapter(isExpanded && expandedChapter !== 'all' ? null : ch.id)}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: isExpanded ? 'rgba(16, 185, 129, 0.06)' : 'transparent',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: ch.level === 'beginner' ? '#38bdf822' : ch.level === 'intermediate' ? '#f59e0b22' : '#a855f722',
                    color: ch.level === 'beginner' ? '#38bdf8' : ch.level === 'intermediate' ? '#fbbf24' : '#c084fc',
                    border: `1px solid ${ch.level === 'beginner' ? '#38bdf855' : ch.level === 'intermediate' ? '#f59e0b55' : '#a855f755'}`,
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {ch.num}
                  </span>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                        {ch.title}
                      </h3>
                      <span style={{
                        fontSize: '0.62rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        fontWeight: '700',
                        background: ch.level === 'beginner' ? 'rgba(56, 189, 248, 0.2)' : ch.level === 'intermediate' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                        color: ch.level === 'beginner' ? '#38bdf8' : ch.level === 'intermediate' ? '#fbbf24' : '#c084fc'
                      }}>
                        {ch.level}
                      </span>
                      {ch.hasWidget && (
                        <span style={{
                          fontSize: '0.62rem',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: '700',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#34d399',
                          border: '1px solid rgba(16, 185, 129, 0.4)'
                        }}>
                          ⚡ Interactive Widget
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {ch.summary}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {ch.tags.slice(0, 2).map(tag => (
                      <span key={tag} style={{
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-dim)'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => toggleChapterComplete(ch.id, e)}
                    title={isCompleted ? 'Mark as unread' : 'Mark as read'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: isCompleted ? '#34d399' : 'var(--text-dim)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <CheckCircle2 size={18} />
                  </button>

                  {isExpanded ? <ChevronUp size={18} color="#34d399" /> : <ChevronDown size={18} color="var(--text-dim)" />}
                </div>
              </div>

              {/* Chapter Expandable Content */}
              {isExpanded && (
                <div style={{
                  padding: '20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  background: 'rgba(0, 0, 0, 0.25)'
                }}>
                  {ch.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Master Cheat Sheet Summary Card */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(7, 10, 18, 0.98) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Zap size={20} color="#34d399" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
            Master Networking Cheat Sheet Quick Reference
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '10px'
        }}>
          {[
            { concept: 'OSI 7 Layers', rule: '7 Application, 6 Presentation, 5 Session, 4 Transport, 3 Network, 2 Data Link, 1 Physical' },
            { concept: 'Switch vs Router', rule: 'Switch forwards by MAC address (L2); Router forwards by IP address (L3)' },
            { concept: 'Private RFC 1918 IPs', rule: '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16' },
            { concept: 'Usable Hosts Formula', rule: '2^(host bits) - 2 (minus network address & broadcast address)' },
            { concept: 'TCP Handshake', rule: 'SYN -> SYN-ACK -> ACK' },
            { concept: 'DHCP Process', rule: 'Discover -> Offer -> Request -> Acknowledge (DORA)' },
            { concept: 'Routing Priority', rule: 'Longest prefix match > lowest administrative distance > best metric' },
            { concept: 'OSPF', rule: 'Link-state, Area 0 backbone, cost metric, Dijkstra SPF algorithm' },
            { concept: 'BGP', rule: 'Path-vector, TCP port 179, global internet routing between Autonomous Systems' },
            { concept: 'Spanning Tree (STP)', rule: 'Elects root bridge (lowest priority + MAC); blocks redundant paths to prevent loops' },
            { concept: 'Default MTU', rule: '1500 bytes (standard Ethernet frame payload)' },
            { concept: 'Big Three Ports', rule: '22 SSH, 53 DNS, 443 HTTPS' },
            { concept: 'First Debugging Step', rule: 'Ask: What changed? Check physical layer link lights first!' }
          ].map(rule => (
            <div key={rule.concept} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#38bdf8', marginBottom: '3px' }}>
                {rule.concept}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
                {rule.rule}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
