import React, { useState, useEffect } from 'react';
import {
  Globe,
  Laptop,
  Router,
  Server,
  Cpu,
  Database,
  Shield,
  Lock,
  Key,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
  Radio,
  Search,
  Layers,
  Send,
  Download,
  Info,
  Sliders,
  Terminal,
  Activity
} from 'lucide-react';

export default function GoogleWebRequestJourney() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeModalInfo, setActiveModalInfo] = useState(null); // Node or step object when clicked
  const [userQuery, setUserQuery] = useState('');

  // 9 Complete Steps from typing https://www.google.com to rendered page
  const steps = [
    {
      id: 'step-1',
      stepNum: 1,
      title: 'URL Parsing, HSTS Check & DNS Resolution',
      shortTitle: 'DNS & HSTS',
      activeNode: 'browser',
      from: 'Browser (User Interface)',
      to: 'OS DNS Resolver',
      layer: 'L7 Application (DNS & Browser Engine)',
      icon: Search,
      color: '#38bdf8',
      summary: 'User types "https://www.google.com" in address bar. Browser enforces HTTPS via preloaded HSTS and queries DNS for IP.',
      details: `When you hit Enter, Google Chrome first verifies the URL protocol. Because "google.com" is on the preloaded HSTS (HTTP Strict Transport Security) list, the browser strictly enforces HTTPS over port 443, eliminating plaintext HTTP redirects.
      
The browser checks its in-memory DNS cache (chrome://net-internals/#dns). If not found, it calls the operating system's getaddrinfo() stub resolver, which queries upstream DNS servers (e.g. 8.8.8.8) to resolve "www.google.com" to Google's Anycast IPv4 address 142.250.190.46 (or IPv6 2607:f8b0:4005:805::2004).`,
      headers: [
        { label: 'Scheme', value: 'https://' },
        { label: 'Host', value: 'www.google.com' },
        { label: 'Port', value: '443 (HTTPS default)' },
        { label: 'HSTS Status', value: 'Enforced (max-age=31536000)' },
        { label: 'DNS Query', value: 'A? www.google.com -> 142.250.190.46' }
      ],
      packetCapture: 'UDP 192.168.1.10:54120 -> 8.8.8.8:53 | DNS Query: A? www.google.com | Response: 142.250.190.46 (TTL 300s)',
      hopping: 'Workstation OS -> Local DNS Cache -> Router UDP relay -> Google Public DNS 8.8.8.8'
    },
    {
      id: 'step-2',
      stepNum: 2,
      title: 'OS Socket Creation & ARP Default Gateway Resolution',
      shortTitle: 'Socket & ARP',
      activeNode: 'os_kernel',
      from: 'Host OS Kernel',
      to: 'Local WiFi / Gateway Router',
      layer: 'L2 Data Link & L3 Network (Kernel Netlink)',
      icon: Cpu,
      color: '#818cf8',
      summary: 'OS allocates a TCP socket descriptor and resolves the physical MAC address of the local gateway router using ARP.',
      details: `The browser invokes the kernel system call socket(AF_INET, SOCK_STREAM, 0) to obtain an OS socket file descriptor. The kernel inspects its local routing table (ip route).

Because 142.250.190.46 does not belong to the local subnet 192.168.1.0/24, packets must be forwarded to the default gateway (192.168.1.1). The kernel queries its ARP cache (arp -a). If missing, an ARP broadcast frame (Who has 192.168.1.1?) is flooded across the LAN. The gateway replies with its 48-bit MAC address 00:50:56:C0:00:01.`,
      headers: [
        { label: 'Socket Call', value: 'socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)' },
        { label: 'Local IP', value: '192.168.1.10 (Private RFC 1918)' },
        { label: 'Gateway IP', value: '192.168.1.1' },
        { label: 'Gateway MAC', value: '00:50:56:C0:00:01' },
        { label: 'EtherType', value: '0x0800 (IPv4 Datagram)' }
      ],
      packetCapture: 'Ethernet II: Src: 00:1A:2B:3C:4D:5E -> Dst: 00:50:56:C0:00:01 | ARP Reply: 192.168.1.1 is at 00:50:56:C0:00:01',
      hopping: 'NIC eth0 PHY -> CAT6 Twisted Pair Copper / 5GHz Wi-Fi Radio -> Router Switch Port 1'
    },
    {
      id: 'step-3',
      stepNum: 3,
      title: 'Router Ingress, NAT Translation & Optical ISP Transit',
      shortTitle: 'NAT & ISP Backbone',
      activeNode: 'router',
      from: 'Gateway Router',
      to: 'ISP Backbone / BGP Routers',
      layer: 'L3 Network (SNAT & BGP Anycast Routing)',
      icon: Router,
      color: '#f59e0b',
      summary: 'Home router rewrites private IP to public WAN IP using NAT (SNAT), decrements TTL, and routes packets into fiber ISP backbones.',
      details: `The home/office router receives the packet from the LAN interface. Because private IP addresses cannot be routed across the public internet, the router performs Source Network Address Translation (SNAT / PAT).
      
It maps 192.168.1.10:52410 to its public IP 203.0.113.45:49152, storing this in its NAT connection state table. The router decrements the IP header Time-To-Live (TTL 64 -> 63) and recalculates the header checksum. The packet then travels across fiber optic lines, through multiple Autonomous Systems (AS) via BGP (Border Gateway Protocol) toward Google's Anycast edge router.`,
      headers: [
        { label: 'Pre-NAT Src', value: '192.168.1.10:52410 (Private)' },
        { label: 'Post-NAT Src', value: '203.0.113.45:49152 (Public WAN)' },
        { label: 'Target Destination', value: '142.250.190.46:443 (Google Anycast)' },
        { label: 'IP TTL', value: '63 (Decremented by 1 hop)' },
        { label: 'Routing Protocol', value: 'eBGP (AS15169 Google LLC)' }
      ],
      packetCapture: 'IPv4: Src: 203.0.113.45 -> Dst: 142.250.190.46 | Protocol: 6 (TCP) | TTL: 63 | Length: 60 bytes',
      hopping: 'Local Router WAN -> ISP CMTS/OLT -> Regional Core Router -> Google Edge POP (Point of Presence)'
    },
    {
      id: 'step-4',
      stepNum: 4,
      title: 'TCP 3-Way Handshake Connection Establishment',
      shortTitle: 'TCP Handshake',
      activeNode: 'google_edge',
      from: 'Client Browser',
      to: 'Google Frontend (GFE)',
      layer: 'L4 Transport (TCP State Machine)',
      icon: Activity,
      color: '#10b981',
      summary: 'Client and Google Frontend establish a reliable, sequenced, bi-directional TCP socket via SYN, SYN-ACK, and ACK.',
      details: `Before sending encrypted data, TCP must establish a connection:
1. SYN (Synchronize): Client sends TCP SYN packet with random Initial Sequence Number (e.g. Seq=1000), MSS=1460, Window Scale, and SACK-Permitted.
2. SYN-ACK: Google Frontend (GFE) responds with SYN-ACK (Seq=5000, Ack=1001).
3. ACK: Client confirms receipt with ACK (Seq=1001, Ack=5001).
      
Both client and server allocate TCP socket control blocks. The connection state transitions to ESTABLISHED in exactly 1 RTT (Round Trip Time, ~12ms).`,
      headers: [
        { label: 'Step 1 (Client->Server)', value: '[SYN] Seq=1000, Ack=0, Win=65535, MSS=1460' },
        { label: 'Step 2 (Server->Client)', value: '[SYN, ACK] Seq=5000, Ack=1001, Win=65535' },
        { label: 'Step 3 (Client->Server)', value: '[ACK] Seq=1001, Ack=5001' },
        { label: 'TCP State', value: 'ESTABLISHED' },
        { label: 'Latency (RTT)', value: '11.8 ms' }
      ],
      packetCapture: 'TCP 203.0.113.45:49152 -> 142.250.190.46:443 [SYN] Seq=1000 | [SYN-ACK] | [ACK]',
      hopping: 'Bi-directional round-trip across optical undersea fiber to nearest Google Frontend (GFE) Edge'
    },
    {
      id: 'step-5',
      stepNum: 5,
      title: 'TLS 1.3 Cryptographic Handshake & Key Derivation',
      shortTitle: 'TLS 1.3 Handshake',
      activeNode: 'google_edge',
      from: 'Client Browser',
      to: 'Google Frontend (GFE)',
      layer: 'L6 Presentation (TLS 1.3 Cryptography)',
      icon: Lock,
      color: '#a855f7',
      summary: 'Negotiates symmetric encryption keys in 1 RTT using Elliptic Curve Diffie-Hellman (X25519) and verifies Google certificate.',
      details: `To protect passwords, cookies, and queries from eavesdropping, TLS 1.3 negotiates end-to-end encryption:
1. ClientHello: Client sends supported cipher suites (TLS_AES_256_GCM_SHA384), SNI (www.google.com), and its public ephemeral Diffie-Hellman key share (Curve X25519).
2. ServerHello: GFE selects cipher suite and returns its ephemeral key share.
3. Encrypted Server Data: Server sends its X.509 Certificate signed by Google Trust Services CA.
      
Both sides derive identical symmetric encryption keys without ever sending the secret over the wire! All subsequent packets are encrypted with AES-256-GCM.`,
      headers: [
        { label: 'TLS Protocol', value: 'TLSv1.3 (RFC 8446)' },
        { label: 'Cipher Suite', value: 'TLS_AES_256_GCM_SHA384' },
        { label: 'Key Exchange', value: 'ECDHE with Curve X25519' },
        { label: 'Server Certificate', value: 'CN=*.google.com, Issued by GTS CA 1C3' },
        { label: 'Encryption', value: '256-Bit Symmetric AES-GCM' }
      ],
      packetCapture: 'TLSv1.3 Record: Handshake (ClientHello -> ServerHello) | Cipher: AES_256_GCM | KeyShare: X25519',
      hopping: 'Encrypted payload stream verified by Google Edge SSL Termination Proxy'
    },
    {
      id: 'step-6',
      stepNum: 6,
      title: 'HTTP/2 Encrypted HTTPS Request Delivery (GET /)',
      shortTitle: 'HTTP/2 Request',
      activeNode: 'google_edge',
      from: 'Client Browser',
      to: 'Google Frontend (GFE)',
      layer: 'L7 Application (HTTP/2 Binary Framing)',
      icon: Send,
      color: '#06b6d4',
      summary: 'Browser transmits encrypted HTTP/2 binary HEADERS frame requesting the Google homepage root route "/".',
      details: `Now that TLS 1.3 is active, the browser sends the actual web request using HTTP/2 binary framing. Unlike old HTTP/1.1 plaintext, HTTP/2 compresses headers using HPACK and multiplexes streams.
      
The request includes pseudo-headers (:method=GET, :path=/, :scheme=https, :authority=www.google.com) and standard headers like User-Agent, Accept-Encoding (gzip, deflate, br, zstd for Brotli compression), and any existing session cookies.`,
      headers: [
        { label: ':method', value: 'GET' },
        { label: ':scheme', value: 'https' },
        { label: ':authority', value: 'www.google.com' },
        { label: ':path', value: '/' },
        { label: 'accept-encoding', value: 'gzip, deflate, br, zstd' },
        { label: 'sec-ch-ua', value: '"Chromium";v="128", "Google Chrome";v="128"' }
      ],
      packetCapture: 'HTTP/2 Frame: HEADERS (Stream ID: 1, End Stream: true) | Length: 284 bytes (Encrypted with TLS 1.3)',
      hopping: 'Client Socket Buffer -> Kernel TCP Out Queue -> WAN Transit -> Google Frontend GFE'
    },
    {
      id: 'step-7',
      stepNum: 7,
      title: 'Google Datacenter Processing & Brotli Compression',
      shortTitle: 'Google Backend',
      activeNode: 'google_backend',
      from: 'Google Frontend (GFE)',
      to: 'Search Index & Serving Cluster',
      layer: 'L7 Datacenter Application Layer',
      icon: Database,
      color: '#ec4899',
      summary: 'Google Frontend routes request over internal high-speed Jupiter SDN to search clusters, renders HTML, and compresses with Brotli.',
      details: `Google Frontend (GFE) terminates the external client connection and issues an internal gRPC remote procedure call across Google's 100Gbps+ internal Jupiter SDN network to the Web Search serving cluster.
      
Google's backend services check user location (to serve appropriate country domain, doodle logo, and language), verify search index caches, and assemble the homepage HTML template. The backend applies Brotli compression (content-encoding: br), shrinking the payload from ~240KB to ~68KB for maximum transfer speed.`,
      headers: [
        { label: 'Internal RPC', value: 'Google Stubby / gRPC over Jupiter SDN' },
        { label: 'Status', value: '200 OK' },
        { label: 'Content-Type', value: 'text/html; charset=UTF-8' },
        { label: 'Content-Encoding', value: 'br (Brotli high-ratio compression)' },
        { label: 'Server', value: 'gws (Google Web Server)' },
        { label: 'Processing Time', value: '14 ms' }
      ],
      packetCapture: 'Internal Backend Stream: gRPC SearchServing.GetHome() -> Status 200 OK (Brotli Compressed: 68,412 bytes)',
      hopping: 'GFE Load Balancer -> Borg Cluster Container Pod -> Google Search Index In-Memory Cache'
    },
    {
      id: 'step-8',
      stepNum: 8,
      title: 'Return Response Hopping & Router Inbound DNAT',
      shortTitle: 'Return Hopping & DNAT',
      activeNode: 'router',
      from: 'Google Server',
      to: 'Gateway Router & Client PC',
      layer: 'L3 Network & L4 Transport (Inbound Packet Processing)',
      icon: Download,
      color: '#34d399',
      summary: 'Google streams TCP packets carrying HTTP 200 OK. Router translates public WAN destination back to private client IP via DNAT.',
      details: `Google Frontend sends multiple TCP packet segments carrying the encrypted Brotli HTML stream. The packets transit the internet backbones and arrive at the client's home router WAN interface (203.0.113.45:49152).
      
The router inspects its stateful NAT table, matches the active TCP tuple, and performs Destination NAT (DNAT): rewriting destination 203.0.113.45:49152 back to the internal workstation IP 192.168.1.10:52410. The router wraps the packet into an Ethernet frame addressed to client MAC 00:1A:2B:3C:4D:5E and transmits it onto the local LAN.`,
      headers: [
        { label: 'Inbound WAN Dst', value: '203.0.113.45:49152' },
        { label: 'Post-DNAT Dst', value: '192.168.1.10:52410 (Client Workstation)' },
        { label: 'TCP Flags', value: '[PSH, ACK] Stream Transmission' },
        { label: 'Payload Size', value: '68,412 bytes in 48 TCP segments' },
        { label: 'Integrity', value: 'TCP Checksum & TLS HMAC Verified' }
      ],
      packetCapture: 'IPv4: Src: 142.250.190.46:443 -> Dst: 192.168.1.10:52410 | HTTP/2 200 OK (DATA Frame Stream ID 1)',
      hopping: 'Google Optical Egress -> ISP Backbone -> Home Gateway Router (DNAT) -> Workstation NIC Ring Buffer'
    },
    {
      id: 'step-9',
      stepNum: 9,
      title: 'Browser Blink Rendering Engine & Final Page Display',
      shortTitle: 'Page Render Complete',
      activeNode: 'browser',
      from: 'Client OS Kernel Buffer',
      to: 'Browser Blink / V8 Engine (Display)',
      layer: 'L7 Browser Rendering Pipeline (DOM, CSSOM & GPU Paint)',
      icon: Globe,
      color: '#38bdf8',
      summary: 'Browser decrypts bytes, decompresses Brotli, parses HTML/CSS/JS, computes layout, and paints the Google homepage on the screen!',
      details: `The browser receives the decrypted HTML stream from the socket. Chrome's Blink rendering engine initiates the critical rendering path:
1. HTML Tokenizer & DOM Construction: Converts HTML tags into DOM nodes.
2. CSS Parser & CSSOM: Parses style blocks into CSS Object Model.
3. Render Tree: Combines DOM and CSSOM, ignoring hidden elements (display: none).
4. Layout (Reflow): Calculates the exact geometrical coordinates and dimensions of the Google search input, buttons, and logo.
5. GPU Paint & Composite: Skia graphics library and GPU rasterize tiles into visible pixels on your monitor! The Google search homepage is live and ready for search queries!`,
      headers: [
        { label: 'Status', value: '200 OK (Rendered in 240ms)' },
        { label: 'DOM Nodes', value: '842 elements parsed' },
        { label: 'Page Title', value: 'Google' },
        { label: 'Search Input', value: 'Interactive (<input name="q">)' },
        { label: 'V8 Engine', value: 'JavaScript compiled with Turbofan JIT' }
      ],
      packetCapture: 'Blink Render Pipeline: ParseHTML -> BuildDOM -> RecalcStyle -> Layout -> CompositeLayers -> GPU Display',
      hopping: 'Kernel Socket Buffer -> Chrome Renderer Process -> GPU Compositor -> Monitor Pixels'
    }
  ];

  // Graph topology nodes
  const graphNodes = [
    {
      id: 'browser',
      name: 'Client Browser',
      subtext: 'Chrome / Firefox',
      ip: '192.168.1.10',
      icon: Laptop,
      color: '#38bdf8',
      desc: 'Workstation web browser initiating requests, managing TLS cryptographic state, and executing the Blink rendering pipeline.'
    },
    {
      id: 'os_kernel',
      name: 'Host OS Kernel',
      subtext: 'TCP/IP Socket Subsystem',
      ip: 'Kernel BSD Sockets',
      icon: Cpu,
      color: '#818cf8',
      desc: 'Operating system network stack managing socket allocations, ARP cache lookups, routing table policies, and NIC ring buffers.'
    },
    {
      id: 'router',
      name: 'Gateway & NAT Router',
      subtext: 'Port Address Translation',
      ip: '192.168.1.1 / 203.0.113.45',
      icon: Router,
      color: '#f59e0b',
      desc: 'Performs bidirectional NAT (SNAT outbound, DNAT return), packet firewall filtering, and packet forwarding across ISP optical lines.'
    },
    {
      id: 'google_edge',
      name: 'Google Frontend (GFE)',
      subtext: 'Anycast Edge / TLS Proxy',
      ip: '142.250.190.46:443',
      icon: Server,
      color: '#10b981',
      desc: 'Google Edge Point of Presence terminating TCP and TLS 1.3 handshakes with ultra-low latency and reverse-proxying into internal clusters.'
    },
    {
      id: 'google_backend',
      name: 'Google Search Backend',
      subtext: 'Borg Cluster / Jupiter SDN',
      ip: 'Internal Jupiter SDN',
      icon: Database,
      color: '#ec4899',
      desc: 'Massively distributed datacenter search indexing and rendering clusters assembling dynamic HTML results and applying Brotli compression.'
    }
  ];

  const currentStepData = steps[currentStep];

  // Auto-play timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
            }}>
              <Globe size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  margin: 0
                }}>
                  The Complete Journey of "https://www.google.com"
                </h2>
                <span className="badge" style={{
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  fontSize: '0.68rem',
                  fontWeight: '700'
                }}>
                  Browser → Router → GFE → Rendering
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Step-by-step visual trace of DNS, ARP, NAT routing, TCP 3-way handshake, TLS 1.3 encryption, and HTML page rendering.
              </p>
            </div>
          </div>

          {/* Stepper Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '7px 12px',
                fontSize: '0.82rem',
                opacity: currentStep === 0 ? 0.4 : 1,
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={16} />
              Prev Step
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
                  : 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                boxShadow: isPlaying ? '0 0 14px rgba(244, 63, 94, 0.4)' : '0 0 14px rgba(56, 189, 248, 0.4)'
              }}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              {isPlaying ? 'Pause' : 'Auto Play'}
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '7px 12px',
                fontSize: '0.82rem',
                opacity: currentStep === steps.length - 1 ? 0.4 : 1,
                cursor: currentStep === steps.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Next Step
              <ChevronRight size={16} />
            </button>

            <button
              onClick={handleReset}
              className="btn btn-secondary"
              title="Reset to Step 1"
              style={{ padding: '7px 10px', fontSize: '0.82rem' }}
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* 9-Step Horizontal Progress Tracker */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)',
          gap: '6px',
          marginTop: '18px'
        }}>
          {steps.map((st, idx) => {
            const isCurrent = idx === currentStep;
            const isCompleted = idx < currentStep;

            return (
              <div
                key={st.id}
                onClick={() => {
                  setCurrentStep(idx);
                  setIsPlaying(false);
                }}
                style={{
                  padding: '8px 6px',
                  borderRadius: '8px',
                  background: isCurrent
                    ? 'rgba(56, 189, 248, 0.25)'
                    : isCompleted
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(0, 0, 0, 0.3)',
                  border: isCurrent
                    ? '2px solid #38bdf8'
                    : isCompleted
                    ? '1px solid #10b981'
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: isCurrent ? '0 0 12px rgba(56, 189, 248, 0.3)' : 'none'
                }}
              >
                <div style={{
                  fontSize: '0.64rem',
                  fontWeight: '800',
                  color: isCurrent ? '#38bdf8' : (isCompleted ? '#34d399' : 'var(--text-dim)'),
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '2px'
                }}>
                  Step {st.stepNum}
                </div>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: isCurrent ? '700' : '500',
                  color: isCurrent ? '#ffffff' : (isCompleted ? '#e2e8f0' : 'var(--text-muted)'),
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {st.shortTitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flow Graph Diagram (Nodes with Interactive Modals) */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(7, 10, 18, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          paddingBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
              Physical & Logical Flow Graph Architecture
            </span>
            <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: '600' }}>
              (Click any node or icon to see detailed info & close)
            </span>
          </div>

          <div style={{
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)'
          }}>
            Active Target: <strong style={{ color: '#38bdf8' }}>{currentStepData.from} → {currentStepData.to}</strong>
          </div>
        </div>

        {/* Node Network Visual Diagram */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          alignItems: 'center',
          position: 'relative'
        }}>
          {graphNodes.map((node) => {
            const Icon = node.icon;
            const isActive = currentStepData.activeNode === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setActiveModalInfo({ type: 'node', data: node })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 14px',
                  borderRadius: '14px',
                  background: isActive
                    ? `linear-gradient(135deg, ${node.color}25 0%, rgba(15, 23, 42, 0.9) 100%)`
                    : 'rgba(15, 23, 42, 0.65)',
                  border: isActive ? `2px solid ${node.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isActive ? `0 0 22px ${node.color}44` : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                {/* Active Indicator Pulse */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    background: node.color,
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    boxShadow: `0 0 10px ${node.color}88`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    Processing
                  </div>
                )}

                {/* Node Icon Box */}
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: `${node.color}22`,
                  border: `1px solid ${node.color}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  boxShadow: `0 0 14px ${node.color}33`
                }}>
                  <Icon size={22} color={node.color} />
                </div>

                {/* Node Title */}
                <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
                  {node.name}
                </span>

                <span style={{ fontSize: '0.7rem', color: node.color, fontWeight: '600', marginBottom: '4px' }}>
                  {node.subtext}
                </span>

                <span style={{ fontSize: '0.66rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  {node.ip}
                </span>

                <div style={{
                  marginTop: '8px',
                  fontSize: '0.64rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Info size={11} color={node.color} />
                  <span>Click for specs</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Step Card & Wire Capture */}
        <div style={{
          marginTop: '22px',
          padding: '20px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(7, 10, 18, 0.95) 100%)',
          border: `1px solid ${currentStepData.color}55`,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: currentStepData.color,
                color: '#ffffff',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.86rem'
              }}>
                {currentStepData.stepNum}
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  {currentStepData.title}
                </h3>
                <span style={{ fontSize: '0.72rem', color: currentStepData.color, fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                  {currentStepData.layer}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveModalInfo({ type: 'step', data: currentStepData })}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.78rem'
              }}
            >
              <Info size={14} color={currentStepData.color} />
              <span>Inspect Full RFC Details</span>
            </button>
          </div>

          <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: '1.6', margin: 0 }}>
            {currentStepData.details}
          </p>

          {/* Formatted Headers & Payload Matrix */}
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Packet & Protocol Headers Exchanged:
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '8px',
              marginTop: '6px'
            }}>
              {currentStepData.headers.map((h, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '0.74rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>{h.label}:</span>
                  <span style={{ color: currentStepData.color, fontFamily: 'var(--font-mono)', fontWeight: '600' }}>{h.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wire Capture & Hopping Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(240px, 1fr)',
            gap: '12px'
          }}>
            <div style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem'
            }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem', fontWeight: '700', marginBottom: '4px' }}>
                Wire Hex/ASCII Packet Capture:
              </div>
              <div style={{ color: '#38bdf8', wordBreak: 'break-all' }}>
                {currentStepData.packetCapture}
              </div>
            </div>

            <div style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.74rem'
            }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem', fontWeight: '700', marginBottom: '4px' }}>
                Physical & Hop Path:
              </div>
              <div style={{ color: '#a78bfa', lineHeight: '1.4' }}>
                {currentStepData.hopping}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Browser Rendering Viewport Preview */}
      <div className="glass-panel" style={{
        padding: '20px',
        borderRadius: '16px',
        background: '#0a0e17',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Browser Mock Chrome Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 12px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {/* Traffic Light Dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          </div>

          {/* Browser Address Bar */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)'
          }}>
            <Lock size={13} color="#10b981" />
            <span style={{ color: '#10b981', fontWeight: '700' }}>https://</span>
            <span style={{ color: '#ffffff' }}>www.google.com</span>
            <span style={{ color: 'var(--text-dim)', marginLeft: 'auto', fontSize: '0.7rem' }}>
              TLS 1.3 • X25519 • HTTP/2
            </span>
          </div>

          {/* Loading Progress Indicator */}
          <div style={{
            width: '100px',
            height: '4px',
            borderRadius: '2px',
            background: 'rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              background: currentStep === 8 ? '#10b981' : '#38bdf8',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Viewport Render: Loading vs Google Search Homepage */}
        <div style={{
          minHeight: '280px',
          borderRadius: '12px',
          background: '#202124',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative'
        }}>
          {currentStep < 8 ? (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '3px solid rgba(56, 189, 248, 0.2)',
                borderTopColor: '#38bdf8',
                animation: 'spin 1s linear infinite'
              }} />
              <div style={{ color: '#cbd5e1', fontSize: '0.86rem', fontWeight: '600' }}>
                Connecting to Google Servers...
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
                {currentStepData.title}
              </div>
            </div>
          ) : (
            /* Fully Rendered Google Search Page Mockup */
            <div style={{
              width: '100%',
              maxWidth: '580px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              animation: 'fadeIn 0.4s ease'
            }}>
              {/* Google Colorful Logo */}
              <div style={{
                fontSize: '2.8rem',
                fontWeight: '700',
                letterSpacing: '-0.04em',
                userSelect: 'none',
                fontFamily: 'Roboto, sans-serif'
              }}>
                <span style={{ color: '#4285F4' }}>G</span>
                <span style={{ color: '#EA4335' }}>o</span>
                <span style={{ color: '#FBBC05' }}>o</span>
                <span style={{ color: '#4285F4' }}>g</span>
                <span style={{ color: '#34A853' }}>l</span>
                <span style={{ color: '#EA4335' }}>e</span>
              </div>

              {/* Search Pill Input Box */}
              <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 18px',
                borderRadius: '24px',
                background: '#303134',
                border: '1px solid #5f6368',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                <Search size={18} color="#9aa0a6" />
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Search Google or type a URL..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '0.9rem'
                  }}
                />
                <Radio size={16} color="#4285F4" />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: '#303134',
                  color: '#e8eaed',
                  fontSize: '0.8rem',
                  border: '1px solid transparent',
                  cursor: 'pointer'
                }}>
                  Google Search
                </button>
                <button style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: '#303134',
                  color: '#e8eaed',
                  fontSize: '0.8rem',
                  border: '1px solid transparent',
                  cursor: 'pointer'
                }}>
                  I'm Feeling Lucky
                </button>
              </div>

              <div style={{ fontSize: '0.74rem', color: '#9aa0a6' }}>
                Google offered in: <span style={{ color: '#8ab4f8', cursor: 'pointer' }}>Español</span> • <span style={{ color: '#8ab4f8', cursor: 'pointer' }}>Français</span> • <span style={{ color: '#8ab4f8', cursor: 'pointer' }}>Deutsch</span> • <span style={{ color: '#8ab4f8', cursor: 'pointer' }}>日本語</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Modal / Pop-up Info Text with Close Button */}
      {activeModalInfo && (
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
          <div style={{
            width: '100%',
            maxWidth: '620px',
            background: '#0d1322',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '18px',
            boxShadow: '0 0 35px rgba(56, 189, 248, 0.25)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Info size={18} color="#38bdf8" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                    {activeModalInfo.type === 'node'
                      ? `Device Subsystem: ${activeModalInfo.data.name}`
                      : `Protocol Step: ${activeModalInfo.data.title}`}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                    {activeModalInfo.type === 'node' ? activeModalInfo.data.ip : activeModalInfo.data.layer}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveModalInfo(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: '1.6', margin: 0 }}>
                {activeModalInfo.type === 'node' ? activeModalInfo.data.desc : activeModalInfo.data.details}
              </p>

              {activeModalInfo.type === 'step' && (
                <>
                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '700', marginBottom: '6px' }}>
                      Key Headers Exchanged:
                    </div>
                    {activeModalInfo.data.headers.map((h, idx) => (
                      <div key={idx} style={{ fontSize: '0.74rem', color: '#cbd5e1', marginBottom: '3px' }}>
                        <strong style={{ color: '#38bdf8' }}>{h.label}:</strong> {h.value}
                      </div>
                    ))}
                  </div>

                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem'
                  }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '700', marginBottom: '6px' }}>
                      Wire Frame Capture:
                    </div>
                    <div style={{ color: '#34d399' }}>{activeModalInfo.data.packetCapture}</div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer with Close Button */}
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              background: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setActiveModalInfo(null)}
                className="btn btn-secondary"
                style={{ padding: '6px 16px', fontSize: '0.82rem' }}
              >
                Close Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
