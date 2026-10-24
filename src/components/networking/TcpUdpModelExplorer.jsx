import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  Shield,
  Clock,
  Activity,
  Radio,
  RefreshCw,
  Hash,
  Server,
  Globe,
  Network,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  AlertTriangle,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Terminal,
  Cpu,
  FileText
} from 'lucide-react';

// ─── TCP/IP 4-Layer Model Data (RFC 1122) ────────────────────────────────────
const TCP_IP_LAYERS = [
  {
    layer: 4,
    name: 'Application Layer',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    osiMapping: 'OSI Layers 7 + 6 + 5 (Application + Presentation + Session)',
    pdu: 'Data / Messages',
    description: 'The topmost layer where user applications create and consume data. In the TCP/IP model, this single layer combines the OSI Application, Presentation, and Session layers. It handles encoding, TLS encryption, session management, and application protocols like HTTP/3, DNS, and SSH.',
    protocols: [
      { name: 'HTTP / HTTPS', port: '80 / 443', desc: 'Hypertext transfer, REST APIs, TLS encryption' },
      { name: 'DNS', port: '53 (UDP/TCP)', desc: 'Domain name resolution to IP addresses' },
      { name: 'SSH', port: '22', desc: 'Encrypted remote terminal and SFTP transfer' },
      { name: 'SMTP / IMAP', port: '25, 587 / 993', desc: 'Email sending and mailbox sync' },
      { name: 'DHCP', port: '67 / 68 (UDP)', desc: 'Automatic IP address and gateway allocation' },
      { name: 'SNMP', port: '161 / 162 (UDP)', desc: 'Network device metrics and fault monitoring' },
      { name: 'FTP', port: '20 / 21', desc: 'File Transfer Protocol (dual channel)' },
      { name: 'WebSocket', port: '80 / 443', desc: 'Full-duplex real-time bidirectional stream' }
    ],
    keyFunctions: [
      'Data representation, serialization (JSON, Protobuf) and compression (gzip, brotli)',
      'Transport Layer Security (TLS 1.3 handshake, cipher suite negotiation)',
      'Session lifecycle management via socket APIs (socket(), connect(), listen())',
      'User authentication (OAuth2, Kerberos, Bearer tokens)'
    ],
    devices: ['Web Servers (Nginx, Envoy)', 'API Gateways', 'DNS Nameservers (CoreDNS)', 'Mail Relays'],
    realWorldAnalogy: 'The actual letter written inside the envelope — the text, greeting, and contents of the message.'
  },
  {
    layer: 3,
    name: 'Transport Layer',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    osiMapping: 'OSI Layer 4 (Transport)',
    pdu: 'Segment (TCP) / Datagram (UDP)',
    description: 'Provides host-to-host process communication via port numbers (0-65535). Home to TCP (reliable, ordered, connection-oriented) and UDP (fast, stateless, connectionless datagrams). Controls end-to-end flow, congestion, and multiplexing.',
    protocols: [
      { name: 'TCP', port: 'Dynamic (0-65535)', desc: 'Transmission Control: 3-way handshake, sequence ACKs, retransmission' },
      { name: 'UDP', port: 'Dynamic (0-65535)', desc: 'User Datagram: 8-byte header, zero handshake, fire-and-forget' },
      { name: 'QUIC', port: '443/UDP', desc: 'HTTP/3 transport running over UDP with native TLS 1.3 multiplexing' },
      { name: 'SCTP', port: 'Dynamic', desc: 'Stream Control: multi-homing and multi-streaming transport' }
    ],
    keyFunctions: [
      'Port-based process multiplexing (Source Port & Destination Port)',
      'TCP: Sequence numbering, Cumulative ACKs, Sliding Window flow control',
      'Congestion Control algorithms (CUBIC, BBR, Reno, NewReno)',
      'UDP: Lightweight datagram dispatch with minimal 8-byte overhead'
    ],
    devices: ['OS Kernel TCP/IP Stack', 'L4 Load Balancers (HAProxy, IPVS)', 'Stateful Firewalls'],
    realWorldAnalogy: 'The delivery speed and guarantee — Registered Certified Mail with signature (TCP) vs Postcard dropped in mail (UDP).'
  },
  {
    layer: 2,
    name: 'Internet Layer',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    osiMapping: 'OSI Layer 3 (Network)',
    pdu: 'Packet',
    description: 'Handles logical addressing and routing across disparate networks. Encapsulates transport segments into IP packets with 32-bit (IPv4) or 128-bit (IPv6) addresses. Determines optimal next-hop paths via routers using routing protocols (BGP, OSPF).',
    protocols: [
      { name: 'IPv4', port: 'Protocol 0x0800', desc: '32-bit addressing, dotted-decimal format, subnet masks' },
      { name: 'IPv6', port: 'Protocol 0x86DD', desc: '128-bit hexadecimal addressing, native IPSec support' },
      { name: 'ICMPv4 / ICMPv6', port: 'Protocol 1 / 58', desc: 'Diagnostics, Echo Ping, Destination Unreachable, Traceroute' },
      { name: 'ARP', port: 'EtherType 0x0806', desc: 'Resolves IP address to local MAC hardware address' },
      { name: 'IPsec (ESP/AH)', port: 'Protocols 50/51', desc: 'Network-layer tunnel encryption for site-to-site VPNs' }
    ],
    keyFunctions: [
      'Logical routing and next-hop forwarding via IP routing tables',
      'Time-To-Live (TTL / Hop Limit) decrementation to kill routing loops',
      'Packet fragmentation and reassembly when MTU is exceeded',
      'NAT (Network Address Translation) between private RFC 1918 IPs and public WAN IPs'
    ],
    devices: ['Routers', 'Layer 3 Switches', 'NAT Gateways', 'Cloud VPC Virtual Routers'],
    realWorldAnalogy: 'The postal street address and postal sorting hubs that route the envelope across cities and countries.'
  },
  {
    layer: 1,
    name: 'Network Access Layer',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    osiMapping: 'OSI Layers 2 + 1 (Data Link + Physical)',
    pdu: 'Frame & Bits',
    description: 'Combines the physical transmission media (copper, fiber, radio) and local framing (Ethernet 802.3, Wi-Fi 802.11). Uses 48-bit hardware MAC addresses for point-to-point delivery within the local collision/broadcast domain.',
    protocols: [
      { name: 'Ethernet 802.3', port: 'Physical', desc: 'Wired LAN framing, CSMA/CD, 1G/10G/100G BASE-T / Optical' },
      { name: 'Wi-Fi 802.11ax', port: 'Wireless RF', desc: 'Wireless framing, CSMA/CA, 2.4 / 5 / 6 GHz bands' },
      { name: 'VLAN 802.1Q', port: 'Tag 0x8100', desc: 'Virtual LAN encapsulation for broadcast isolation' },
      { name: 'PPP / PPPoE', port: 'Point-to-Point', desc: 'Direct link encapsulation over broadband serial lines' }
    ],
    keyFunctions: [
      'MAC addressing (48-bit Burned-In Address) for local broadcast domains',
      'Frame encapsulation: Preamble, MACs, EtherType, Payload, CRC32 Frame Check Sequence',
      'Media access arbitration (CSMA/CD on Ethernet, CSMA/CA on Wi-Fi)',
      'Signal encoding into voltage changes, photon pulses, or RF modulation'
    ],
    devices: ['NICs (Network Interface Cards)', 'Layer 2 Switches', 'Wireless Access Points', 'Fiber Transceivers (SFP+)'],
    realWorldAnalogy: 'The physical delivery truck, asphalt highways, and physical mailbox where the paper envelope travels.'
  }
];

// ─── TCP Header Fields (20-60 bytes) ─────────────────────────────────────────
const TCP_HEADER_FIELDS = [
  { name: 'Source Port', bits: 16, offset: '0-15', color: '#38bdf8', desc: 'Identifies the sending application (ephemeral port, e.g. 54321)' },
  { name: 'Destination Port', bits: 16, offset: '16-31', color: '#38bdf8', desc: 'Identifies receiving service process (e.g. 80 for HTTP, 443 for HTTPS)' },
  { name: 'Sequence Number', bits: 32, offset: '32-63', color: '#10b981', desc: 'Byte-stream sequence position of the first data byte in this segment' },
  { name: 'Acknowledgment Number', bits: 32, offset: '64-95', color: '#10b981', desc: 'Next expected byte from the sender when ACK flag is set' },
  { name: 'Data Offset', bits: 4, offset: '96-99', color: '#f59e0b', desc: 'Size of TCP header in 32-bit words (5 = 20 bytes min, up to 15 = 60 bytes)' },
  { name: 'Reserved', bits: 3, offset: '100-102', color: '#64748b', desc: 'Reserved for future expansion; must be set to 0' },
  { name: 'Flags (9 bits)', bits: 9, offset: '103-111', color: '#ef4444', desc: 'Control flags: NS, CWR, ECE, URG, ACK, PSH, RST, SYN, FIN' },
  { name: 'Window Size', bits: 16, offset: '112-127', color: '#a855f7', desc: 'Receive buffer capacity (flow control) in bytes (can be scaled via Option)' },
  { name: 'Checksum', bits: 16, offset: '128-143', color: '#06b6d4', desc: 'Mandatory 16-bit 1\'s complement checksum over header + data + pseudo-header' },
  { name: 'Urgent Pointer', bits: 16, offset: '144-159', color: '#64748b', desc: 'Points to last byte of out-of-band urgent data (valid only if URG=1)' },
  { name: 'Options (Variable)', bits: '0-320', offset: '160+', color: '#f97316', desc: 'MSS (Max Segment Size), Window Scale (RFC 7323), SACK, Timestamps' }
];

// ─── UDP Header Fields (8 bytes fixed) ───────────────────────────────────────
const UDP_HEADER_FIELDS = [
  { name: 'Source Port', bits: 16, offset: '0-15', color: '#38bdf8', desc: 'Sending process port number (optional in client, can be 0)' },
  { name: 'Destination Port', bits: 16, offset: '16-31', color: '#38bdf8', desc: 'Receiving service port (e.g. 53 for DNS, 123 for NTP, 51820 for WireGuard)' },
  { name: 'Length', bits: 16, offset: '32-47', color: '#f59e0b', desc: 'Total datagram byte length (8-byte header + payload data), min 8' },
  { name: 'Checksum', bits: 16, offset: '48-63', color: '#06b6d4', desc: 'Optional in IPv4, mandatory in IPv6. Error detection over header + data' }
];

// ─── TCP 11 States ───────────────────────────────────────────────────────────
const TCP_STATES = [
  { state: 'CLOSED', desc: 'No connection exists. Initial passive or reset state.', color: '#64748b' },
  { state: 'LISTEN', desc: 'Server waiting for incoming connection request (passive open).', color: '#a855f7' },
  { state: 'SYN_SENT', desc: 'Client sent SYN, waiting for matching SYN-ACK from server.', color: '#f59e0b' },
  { state: 'SYN_RECEIVED', desc: 'Server received SYN, sent SYN-ACK, awaiting client\'s final ACK.', color: '#f97316' },
  { state: 'ESTABLISHED', desc: 'Connection open. Data transfer active in both directions.', color: '#10b981' },
  { state: 'FIN_WAIT_1', desc: 'Active close: host sent FIN, awaiting ACK of its FIN.', color: '#06b6d4' },
  { state: 'FIN_WAIT_2', desc: 'Received ACK of FIN, awaiting FIN from remote partner.', color: '#0ea5e9' },
  { state: 'CLOSE_WAIT', desc: 'Passive close: received FIN, sent ACK. Waiting for local app to close().', color: '#ec4899' },
  { state: 'CLOSING', desc: 'Simultaneous close: both sides sent FIN at the same time.', color: '#f472b6' },
  { state: 'LAST_ACK', desc: 'Sent local FIN from CLOSE_WAIT, waiting for remote ACK.', color: '#d946ef' },
  { state: 'TIME_WAIT', desc: 'Waits 2×MSL (60-120s) to absorb delayed packets and ensure ACK delivery.', color: '#8b5cf6' }
];

// ─── Scenarios for Packet Tracer & Flow ────────────────────────────────────────
const SCENARIOS = [
  {
    id: 'tcp-handshake',
    title: 'TCP 3-Way Handshake',
    protocol: 'TCP',
    badge: 'Connection Setup',
    badgeColor: '#10b981',
    description: 'The fundamental 3-way synchronization exchange (SYN → SYN-ACK → ACK) that creates a reliable bi-directional TCP session and negotiates ISN sequence numbers and MSS.',
    steps: [
      {
        step: 1,
        title: 'Client sends SYN (Active Open)',
        from: 'Client',
        to: 'Router',
        hopIndex: 0,
        flags: 'SYN',
        seq: 1000,
        ack: 0,
        win: 65535,
        status: 'normal',
        clientState: 'SYN_SENT',
        serverState: 'LISTEN',
        idsStatus: 'Inspecting: SYN packet received. Normal connection request.',
        explanation: 'Client selects random Initial Sequence Number (ISN=1000). Sends SYN=1 packet to initiate connection to Server port 80. State transitions from CLOSED → SYN_SENT.',
        tcpdump: '12:00:00.001 IP 192.168.1.105.54321 > 93.184.216.34.80: Flags [S], seq 1000, win 65535, options [mss 1460,sackOK], length 0',
        packet: {
          l4: { proto: 'TCP', srcPort: 54321, dstPort: 80, seq: 1000, ack: 0, flags: 'SYN (1)', win: 65535, hdrLen: '20 bytes', csum: '0x3a4f' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '192.168.1.105', dstIp: '93.184.216.34', ttl: 64, id: '0x12a4', len: '40 bytes' },
          l2: { srcMac: '00:1A:2B:3C:4D:5E', dstMac: '00:50:56:A1:B2:C3', ethType: '0x0800 (IPv4)' },
          data: '(No payload - TCP connection handshake)'
        }
      },
      {
        step: 2,
        title: 'Router / NAT & Security Gateway forwards SYN',
        from: 'Router',
        to: 'Security',
        hopIndex: 1,
        flags: 'SYN',
        seq: 1000,
        ack: 0,
        win: 65535,
        status: 'normal',
        clientState: 'SYN_SENT',
        serverState: 'LISTEN',
        idsStatus: 'IDS/IPS: Stateful inspection table tracks NEW session. SYN rate normal. Allowed.',
        explanation: 'The NAT router rewrites source IP to public WAN IP (203.0.113.45). The stateful firewall / IDS checks its rule table and creates a half-open tracking entry.',
        tcpdump: '12:00:00.003 IP 203.0.113.45.54321 > 93.184.216.34.80: Flags [S], seq 1000, win 65535, length 0 (NAT Rewritten)',
        packet: {
          l4: { proto: 'TCP', srcPort: 54321, dstPort: 80, seq: 1000, ack: 0, flags: 'SYN (1)', win: 65535, hdrLen: '20 bytes', csum: '0x3a4f' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '203.0.113.45', dstIp: '93.184.216.34', ttl: 63, id: '0x12a4', len: '40 bytes' },
          l2: { srcMac: 'A4:93:3F:11:22:33', dstMac: '52:54:00:12:34:56', ethType: '0x0800 (IPv4)' },
          data: '(No payload - TCP connection handshake)'
        }
      },
      {
        step: 3,
        title: 'Server receives SYN & replies with SYN-ACK',
        from: 'Server',
        to: 'Security',
        hopIndex: 2,
        flags: 'SYN, ACK',
        seq: 4000,
        ack: 1001,
        win: 65535,
        status: 'normal',
        clientState: 'SYN_SENT',
        serverState: 'SYN_RECEIVED',
        idsStatus: 'IDS/IPS: SYN-ACK verified against pending SYN session. State updated.',
        explanation: 'Server receives SYN. Allocates TCB (Transmission Control Block) in SYN queue. Sets own ISN=4000 and acknowledges client\'s sequence (Ack=1001 = 1000+1). State → SYN_RECEIVED.',
        tcpdump: '12:00:00.015 IP 93.184.216.34.80 > 203.0.113.45.54321: Flags [S.], seq 4000, ack 1001, win 65535, options [mss 1460], length 0',
        packet: {
          l4: { proto: 'TCP', srcPort: 80, dstPort: 54321, seq: 4000, ack: 1001, flags: 'SYN=1, ACK=1', win: 65535, hdrLen: '20 bytes', csum: '0x7b1c' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '93.184.216.34', dstIp: '203.0.113.45', ttl: 64, id: '0x99fe', len: '40 bytes' },
          l2: { srcMac: '52:54:00:12:34:56', dstMac: 'A4:93:3F:11:22:33', ethType: '0x0800 (IPv4)' },
          data: '(Handshake ACK of client ISN+1 and server ISN offer)'
        }
      },
      {
        step: 4,
        title: 'Client sends final ACK → Connection ESTABLISHED!',
        from: 'Client',
        to: 'Server',
        hopIndex: 0,
        flags: 'ACK',
        seq: 1001,
        ack: 4001,
        win: 65535,
        status: 'normal',
        clientState: 'ESTABLISHED',
        serverState: 'ESTABLISHED',
        idsStatus: 'IDS/IPS: 3-Way Handshake complete! Session tagged ESTABLISHED in conntrack table.',
        explanation: 'Client receives SYN-ACK. Confirms server is alive and willing to communicate. Sends ACK=4001 (Server ISN+1). Both sides now enter ESTABLISHED state. Socket connect() returns!',
        tcpdump: '12:00:00.028 IP 192.168.1.105.54321 > 93.184.216.34.80: Flags [.], seq 1001, ack 4001, win 65535, length 0 (ESTABLISHED)',
        packet: {
          l4: { proto: 'TCP', srcPort: 54321, dstPort: 80, seq: 1001, ack: 4001, flags: 'ACK=1', win: 65535, hdrLen: '20 bytes', csum: '0x12c4' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '192.168.1.105', dstIp: '93.184.216.34', ttl: 64, id: '0x12a5', len: '40 bytes' },
          l2: { srcMac: '00:1A:2B:3C:4D:5E', dstMac: '00:50:56:A1:B2:C3', ethType: '0x0800 (IPv4)' },
          data: '(Handshake Complete: Stream is now ready for application data)'
        }
      }
    ]
  },
  {
    id: 'tcp-data',
    title: 'TCP Data Transfer & Sliding Window',
    protocol: 'TCP',
    badge: 'Reliable Streaming',
    badgeColor: '#3b82f6',
    description: 'Application sends HTTP GET request. TCP segments the data, assigns sequence numbers, manages receive windows, and calculates checksums for guaranteed delivery.',
    steps: [
      {
        step: 1,
        title: 'Client sends HTTP GET Request (500 Bytes)',
        from: 'Client',
        to: 'Router',
        hopIndex: 0,
        flags: 'PSH, ACK',
        seq: 1001,
        ack: 4001,
        win: 65535,
        status: 'normal',
        clientState: 'ESTABLISHED',
        serverState: 'ESTABLISHED',
        idsStatus: 'IDS: Deep Packet Inspection (DPI) decodes HTTP GET request. No exploit signatures found.',
        explanation: 'Browser writes "GET /index.html HTTP/1.1" into socket. TCP creates segment with PSH flag set to push data to server application immediately without buffering.',
        tcpdump: '12:00:00.040 IP 192.168.1.105.54321 > 93.184.216.34.80: Flags [P.], seq 1001:1501, ack 4001, win 65535, length 500: HTTP: GET /index.html',
        packet: {
          l4: { proto: 'TCP', srcPort: 54321, dstPort: 80, seq: 1001, ack: 4001, flags: 'PSH=1, ACK=1', win: 65535, hdrLen: '20 bytes', csum: '0x6e90' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '192.168.1.105', dstIp: '93.184.216.34', ttl: 64, id: '0x12a6', len: '540 bytes' },
          l2: { srcMac: '00:1A:2B:3C:4D:5E', dstMac: '00:50:56:A1:B2:C3', ethType: '0x0800' },
          data: 'GET /index.html HTTP/1.1\\r\\nHost: example.com\\r\\nUser-Agent: NetCore/1.0\\r\\nAccept: */*\\r\\n\\r\\n'
        }
      },
      {
        step: 2,
        title: 'Server receives Request & returns ACK + HTTP 200 OK',
        from: 'Server',
        to: 'Client',
        hopIndex: 2,
        flags: 'PSH, ACK',
        seq: 4001,
        ack: 1501,
        win: 64000,
        status: 'normal',
        clientState: 'ESTABLISHED',
        serverState: 'ESTABLISHED',
        idsStatus: 'IPS: Response packet inspected. Valid HTTP 200 header and HTML body verified.',
        explanation: 'Server ACKs client bytes (Ack=1501 = 1001+500) and piggybacks the HTTP 200 OK response (1200 bytes) with Seq=4001.',
        tcpdump: '12:00:00.065 IP 93.184.216.34.80 > 192.168.1.105.54321: Flags [P.], seq 4001:5201, ack 1501, win 64000, length 1200: HTTP/1.1 200 OK',
        packet: {
          l4: { proto: 'TCP', srcPort: 80, dstPort: 54321, seq: 4001, ack: 1501, flags: 'PSH=1, ACK=1', win: 64000, hdrLen: '20 bytes', csum: '0x44bf' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '93.184.216.34', dstIp: '192.168.1.105', ttl: 64, id: '0x99ff', len: '1240 bytes' },
          l2: { srcMac: '52:54:00:12:34:56', dstMac: 'A4:93:3F:11:22:33', ethType: '0x0800' },
          data: 'HTTP/1.1 200 OK\\r\\nContent-Type: text/html\\r\\nContent-Length: 1140\\r\\n\\r\\n<!DOCTYPE html><html>...'
        }
      },
      {
        step: 3,
        title: 'Client ACKs response & Window size is updated',
        from: 'Client',
        to: 'Server',
        hopIndex: 0,
        flags: 'ACK',
        seq: 1501,
        ack: 5201,
        win: 65535,
        status: 'normal',
        clientState: 'ESTABLISHED',
        serverState: 'ESTABLISHED',
        idsStatus: 'IDS/IPS: Stream continues healthy. Round-trip latency calculated: 25ms.',
        explanation: 'Client sends pure ACK with Ack=5201 (4001+1200). Server receives confirmation and clears sent buffer bytes.',
        tcpdump: '12:00:00.088 IP 192.168.1.105.54321 > 93.184.216.34.80: Flags [.], seq 1501, ack 5201, win 65535, length 0',
        packet: {
          l4: { proto: 'TCP', srcPort: 54321, dstPort: 80, seq: 1501, ack: 5201, flags: 'ACK=1', win: 65535, hdrLen: '20 bytes', csum: '0x882a' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '192.168.1.105', dstIp: '93.184.216.34', ttl: 64, id: '0x12a7', len: '40 bytes' },
          l2: { srcMac: '00:1A:2B:3C:4D:5E', dstMac: '00:50:56:A1:B2:C3', ethType: '0x0800' },
          data: '(Pure ACK segment confirming 1200 bytes received)'
        }
      }
    ]
  },
  {
    id: 'tcp-loss',
    title: 'TCP Packet Drop & Fast Retransmit',
    protocol: 'TCP',
    badge: 'Reliability in Action',
    badgeColor: '#ef4444',
    description: 'Demonstrates TCP\'s error recovery: an intermediate router drops Segment #2 due to buffer queue overflow. The receiver emits 3 duplicate ACKs, triggering Fast Retransmission!',
    steps: [
      {
        step: 1,
        title: 'Client transmits Segments #1, #2, #3 into pipeline',
        from: 'Client',
        to: 'Router',
        hopIndex: 0,
        flags: 'ACK',
        seq: 1501,
        ack: 5201,
        win: 65535,
        status: 'normal',
        clientState: 'ESTABLISHED',
        serverState: 'ESTABLISHED',
        idsStatus: 'IDS: Monitoring sliding window transmission (3 consecutive segments).',
        explanation: 'Client sends 3 segments of 1000 bytes each: Segment #1 (Seq 1501), Segment #2 (Seq 2501), and Segment #3 (Seq 3501) back-to-back.',
        tcpdump: '12:00:01.000 IP 192.168.1.105.54321 > 93.184.216.34.80: Flags [.], seq 1501:2501, length 1000',
        packet: {
          l4: { proto: 'TCP', srcPort: 54321, dstPort: 80, seq: 1501, ack: 5201, flags: 'ACK=1', win: 65535, hdrLen: '20 bytes', csum: '0x55aa' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '192.168.1.105', dstIp: '93.184.216.34', ttl: 64, id: '0x2001', len: '1040 bytes' },
          l2: { srcMac: '00:1A:2B:3C:4D:5E', dstMac: '00:50:56:A1:B2:C3', ethType: '0x0800' },
          data: '[Chunk 1: 1000 bytes of data payload]'
        }
      },
      {
        step: 2,
        title: '💥 Packet Drop at Router (Buffer Overflow)',
        from: 'Router',
        to: 'Security',
        hopIndex: 1,
        flags: 'ACK (DROPPED)',
        seq: 2501,
        ack: 5201,
        win: 65535,
        status: 'dropped',
        clientState: 'ESTABLISHED',
        serverState: 'ESTABLISHED',
        idsStatus: 'Router RED (Random Early Detection) buffer full. Segment 2501 DROPPED!',
        explanation: 'Segment #2 (Seq 2501) is dropped at the router due to temporary interface buffer exhaustion. Segment #1 and Segment #3 make it through.',
        tcpdump: '12:00:01.005 [ROUTER DROP] Packet Seq 2501-3501 dropped due to egress buffer exhaustion',
        packet: {
          l4: { proto: 'TCP (DROPPED)', srcPort: 54321, dstPort: 80, seq: 2501, ack: 5201, flags: 'ACK=1', win: 65535, hdrLen: '20 bytes', csum: '0x55ab' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '192.168.1.105', dstIp: '93.184.216.34', ttl: 63, id: '0x2002', len: '1040 bytes' },
          l2: { srcMac: 'A4:93:3F:11:22:33', dstMac: '52:54:00:12:34:56', ethType: '0x0800' },
          data: '[Chunk 2: 1000 bytes LOST ON WIRE]'
        }
      },
      {
        step: 3,
        title: 'Server receives out-of-order Segment #3 → sends DupACKs',
        from: 'Server',
        to: 'Client',
        hopIndex: 2,
        flags: 'ACK (DupACK #1)',
        seq: 5201,
        ack: 2501,
        win: 64000,
        status: 'normal',
        clientState: 'ESTABLISHED',
        serverState: 'ESTABLISHED',
        idsStatus: 'IDS: Duplicate ACK detected for sequence 2501. Indicates packet loss in transit.',
        explanation: 'Server receives Segment #3 (Seq 3501) before Segment #2. It cannot ACK 3501 because TCP requires in-order delivery. It repeats ACK=2501 (DupACK) signalling: "I am still missing byte 2501!".',
        tcpdump: '12:00:01.030 IP 93.184.216.34.80 > 192.168.1.105.54321: Flags [.], ack 2501, win 64000, options [sack 3501:4501], length 0 (TCP Dup ACK)',
        packet: {
          l4: { proto: 'TCP', srcPort: 80, dstPort: 54321, seq: 5201, ack: 2501, flags: 'ACK=1 (DupACK)', win: 64000, hdrLen: '20 bytes', csum: '0x19a0' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '93.184.216.34', dstIp: '192.168.1.105', ttl: 64, id: '0x9a01', len: '40 bytes' },
          l2: { srcMac: '52:54:00:12:34:56', dstMac: 'A4:93:3F:11:22:33', ethType: '0x0800' },
          data: '(SACK Option notifies sender: received 3501-4501, but still waiting for 2501)'
        }
      },
      {
        step: 4,
        title: '3 DupACKs received → Fast Retransmit Triggered! ⚡',
        from: 'Client',
        to: 'Server',
        hopIndex: 0,
        flags: 'ACK (Retransmitted)',
        seq: 2501,
        ack: 5201,
        win: 65535,
        status: 'retransmitted',
        clientState: 'ESTABLISHED',
        serverState: 'ESTABLISHED',
        idsStatus: 'IDS: Fast Retransmit of segment 2501 seen. RTO timer cancelled; connection restored.',
        explanation: 'After 3 duplicate ACKs, RFC 5681 Fast Retransmit kicks in immediately — sender retransmits missing Segment 2501 without waiting for the slow Retransmission Timeout (RTO) timer!',
        tcpdump: '12:00:01.045 IP 192.168.1.105.54321 > 93.184.216.34.80: Flags [.], seq 2501:3501, ack 5201, length 1000 [TCP Fast Retransmission]',
        packet: {
          l4: { proto: 'TCP', srcPort: 54321, dstPort: 80, seq: 2501, ack: 5201, flags: 'ACK=1 (Retransmit)', win: 65535, hdrLen: '20 bytes', csum: '0x55ab' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '192.168.1.105', dstIp: '93.184.216.34', ttl: 64, id: '0x2004', len: '1040 bytes' },
          l2: { srcMac: '00:1A:2B:3C:4D:5E', dstMac: '00:50:56:A1:B2:C3', ethType: '0x0800' },
          data: '[Retransmitted Chunk 2: 1000 bytes delivered successfully]'
        }
      }
    ]
  },
  {
    id: 'tcp-teardown',
    title: 'TCP 4-Way Connection Teardown',
    protocol: 'TCP',
    badge: 'Graceful Termination',
    badgeColor: '#ec4899',
    description: 'Clean bi-directional shutdown. Since TCP is full-duplex, each direction of data transfer must be independently shut down with a FIN and acknowledged with an ACK.',
    steps: [
      {
        step: 1,
        title: 'Client sends FIN (Active Close)',
        from: 'Client',
        to: 'Server',
        hopIndex: 0,
        flags: 'FIN, ACK',
        seq: 3501,
        ack: 5201,
        win: 65535,
        status: 'normal',
        clientState: 'FIN_WAIT_1',
        serverState: 'ESTABLISHED',
        idsStatus: 'IDS: Client initiating teardown. Conntrack entry entering closing state.',
        explanation: 'Client application calls close(). TCP sends FIN flag indicating it has no more data to send. Client state: ESTABLISHED → FIN_WAIT_1.',
        tcpdump: '12:00:02.000 IP 192.168.1.105.54321 > 93.184.216.34.80: Flags [F.], seq 3501, ack 5201, win 65535, length 0',
        packet: {
          l4: { proto: 'TCP', srcPort: 54321, dstPort: 80, seq: 3501, ack: 5201, flags: 'FIN=1, ACK=1', win: 65535, hdrLen: '20 bytes', csum: '0x992a' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '192.168.1.105', dstIp: '93.184.216.34', ttl: 64, id: '0x3001', len: '40 bytes' },
          l2: { srcMac: '00:1A:2B:3C:4D:5E', dstMac: '00:50:56:A1:B2:C3', ethType: '0x0800' },
          data: '(FIN: Client has finished sending data)'
        }
      },
      {
        step: 2,
        title: 'Server sends ACK for Client\'s FIN',
        from: 'Server',
        to: 'Client',
        hopIndex: 2,
        flags: 'ACK',
        seq: 5201,
        ack: 3502,
        win: 64000,
        status: 'normal',
        clientState: 'FIN_WAIT_2',
        serverState: 'CLOSE_WAIT',
        idsStatus: 'IDS: Server acknowledges client close. Server application can still flush remaining data.',
        explanation: 'Server acknowledges the FIN (Ack=3502 = 3501+1). Client enters FIN_WAIT_2. Server enters CLOSE_WAIT and notifies local app.',
        tcpdump: '12:00:02.015 IP 93.184.216.34.80 > 192.168.1.105.54321: Flags [.], ack 3502, win 64000, length 0',
        packet: {
          l4: { proto: 'TCP', srcPort: 80, dstPort: 54321, seq: 5201, ack: 3502, flags: 'ACK=1', win: 64000, hdrLen: '20 bytes', csum: '0x12e0' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '93.184.216.34', dstIp: '192.168.1.105', ttl: 64, id: '0x9b01', len: '40 bytes' },
          l2: { srcMac: '52:54:00:12:34:56', dstMac: 'A4:93:3F:11:22:33', ethType: '0x0800' },
          data: '(ACK confirming receipt of client FIN)'
        }
      },
      {
        step: 3,
        title: 'Server finishes and sends its own FIN',
        from: 'Server',
        to: 'Client',
        hopIndex: 2,
        flags: 'FIN, ACK',
        seq: 5201,
        ack: 3502,
        win: 64000,
        status: 'normal',
        clientState: 'FIN_WAIT_2',
        serverState: 'LAST_ACK',
        idsStatus: 'IDS: Server now closing in reverse direction. Conntrack timer set.',
        explanation: 'Server application finishes transmitting all remaining output and calls close(). Server sends FIN flag. State → LAST_ACK.',
        tcpdump: '12:00:02.025 IP 93.184.216.34.80 > 192.168.1.105.54321: Flags [F.], seq 5201, ack 3502, win 64000, length 0',
        packet: {
          l4: { proto: 'TCP', srcPort: 80, dstPort: 54321, seq: 5201, ack: 3502, flags: 'FIN=1, ACK=1', win: 64000, hdrLen: '20 bytes', csum: '0x12e1' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '93.184.216.34', dstIp: '192.168.1.105', ttl: 64, id: '0x9b02', len: '40 bytes' },
          l2: { srcMac: '52:54:00:12:34:56', dstMac: 'A4:93:3F:11:22:33', ethType: '0x0800' },
          data: '(FIN: Server has finished sending data)'
        }
      },
      {
        step: 4,
        title: 'Client sends final ACK → TIME_WAIT (2×MSL)',
        from: 'Client',
        to: 'Server',
        hopIndex: 0,
        flags: 'ACK',
        seq: 3502,
        ack: 5202,
        win: 65535,
        status: 'normal',
        clientState: 'TIME_WAIT (60s)',
        serverState: 'CLOSED',
        idsStatus: 'IDS/IPS: Connection fully torn down. Conntrack state pruned after TIME_WAIT.',
        explanation: 'Client sends final ACK=5202. Server receives ACK and immediately closes. Client enters TIME_WAIT (typically 60-120s) to guarantee server received the ACK and prevent delayed phantom segments from corrupting future connections.',
        tcpdump: '12:00:02.040 IP 192.168.1.105.54321 > 93.184.216.34.80: Flags [.], seq 3502, ack 5202, win 65535, length 0 (TIME_WAIT)',
        packet: {
          l4: { proto: 'TCP', srcPort: 54321, dstPort: 80, seq: 3502, ack: 5202, flags: 'ACK=1', win: 65535, hdrLen: '20 bytes', csum: '0x88bb' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '192.168.1.105', dstIp: '93.184.216.34', ttl: 64, id: '0x3002', len: '40 bytes' },
          l2: { srcMac: '00:1A:2B:3C:4D:5E', dstMac: '00:50:56:A1:B2:C3', ethType: '0x0800' },
          data: '(Final ACK: Server closes immediately; Client holds socket in TIME_WAIT)'
        }
      }
    ]
  },
  {
    id: 'udp-dns',
    title: 'UDP DNS Query & Response',
    protocol: 'UDP',
    badge: 'Zero-Handshake Speed',
    badgeColor: '#f59e0b',
    description: 'Stateless datagram execution: A host queries a DNS server for "api.cloud.internal". Sent immediately in 1 packet, answered in 1 packet. Total wire interaction = 2 packets vs TCP\'s 7+ packets.',
    steps: [
      {
        step: 1,
        title: 'Client sends UDP Datagram to DNS Port 53',
        from: 'Client',
        to: 'Router',
        hopIndex: 0,
        flags: 'UDP (No Flags)',
        seq: 'N/A',
        ack: 'N/A',
        win: 'N/A',
        status: 'normal',
        clientState: 'STATELESS',
        serverState: 'LISTENING (UDP)',
        idsStatus: 'IDS: Standard DNS query detected for domain "api.cloud.internal". No tunneling or exfiltration detected.',
        explanation: 'Application calls getaddrinfo(). Kernel generates an 8-byte UDP header (SrcPort: 59321, DstPort: 53, Len: 44, Csum: 0x4a12) and dispatches it immediately without any handshake.',
        tcpdump: '12:00:03.001 IP 192.168.1.105.59321 > 8.8.8.8.53: 12345+ A? api.cloud.internal. (36)',
        packet: {
          l4: { proto: 'UDP', srcPort: 59321, dstPort: 53, length: '44 bytes', csum: '0x4a12', hdrLen: '8 bytes' },
          l3: { proto: 'IPv4 (0x11)', srcIp: '192.168.1.105', dstIp: '8.8.8.8', ttl: 64, id: '0x4001', len: '64 bytes' },
          l2: { srcMac: '00:1A:2B:3C:4D:5E', dstMac: '00:50:56:A1:B2:C3', ethType: '0x0800' },
          data: 'DNS Query ID: 0x3039 | Flags: Standard Query | Question: api.cloud.internal [Type A, Class IN]'
        }
      },
      {
        step: 2,
        title: 'DNS Server answers with IP: 104.21.45.88',
        from: 'Server',
        to: 'Client',
        hopIndex: 2,
        flags: 'UDP (No Flags)',
        seq: 'N/A',
        ack: 'N/A',
        win: 'N/A',
        status: 'normal',
        clientState: 'STATELESS',
        serverState: 'LISTENING (UDP)',
        idsStatus: 'IDS/IPS: DNS response matched query ID 0x3039. Answer validated and delivered in 14ms.',
        explanation: 'DNS Server reads query from UDP socket, looks up record, and replies with a single UDP datagram. No handshake was made, and no teardown is needed. Transaction complete in 1 RTT!',
        tcpdump: '12:00:03.015 IP 8.8.8.8.53 > 192.168.1.105.59321: 12345 1/0/0 A 104.21.45.88 (52)',
        packet: {
          l4: { proto: 'UDP', srcPort: 53, dstPort: 59321, length: '60 bytes', csum: '0x99f4', hdrLen: '8 bytes' },
          l3: { proto: 'IPv4 (0x11)', srcIp: '8.8.8.8', dstIp: '192.168.1.105', ttl: 56, id: '0x8811', len: '80 bytes' },
          l2: { srcMac: '52:54:00:12:34:56', dstMac: 'A4:93:3F:11:22:33', ethType: '0x0800' },
          data: 'DNS Answer: api.cloud.internal -> 104.21.45.88 (TTL: 300s) | Authoritative Answer: No'
        }
      }
    ]
  },
  {
    id: 'udp-stream',
    title: 'UDP Real-Time Audio (VoIP) & Loss Tolerance',
    protocol: 'UDP',
    badge: 'Real-Time Streaming',
    badgeColor: '#a855f7',
    description: 'Real-time RTP voice stream (Opus codec). When packet #2 is dropped by wireless interference, the audio call continues uninterrupted without stalling or waiting for retransmissions!',
    steps: [
      {
        step: 1,
        title: 'Host sends Voice Packet #1 (Seq 101, Timestamp 960)',
        from: 'Client',
        to: 'Router',
        hopIndex: 0,
        flags: 'UDP / RTP',
        seq: 'RTP 101',
        ack: 'None',
        win: 'None',
        status: 'normal',
        clientState: 'STREAMING',
        serverState: 'STREAMING',
        idsStatus: 'IDS: Real-time RTP media stream detected. QoS Expedited Forwarding (DSCP EF) tagged.',
        explanation: 'VoIP software encodes 20ms of audio (Opus 48kHz, 160 bytes) and fires UDP datagram to Port 5004.',
        tcpdump: '12:00:04.000 IP 192.168.1.105.5004 > 93.184.216.34.5004: UDP, length 172 (RTP seq=101, ts=960)',
        packet: {
          l4: { proto: 'UDP (RTP)', srcPort: 5004, dstPort: 5004, length: '172 bytes', csum: '0x2211', hdrLen: '8 bytes' },
          l3: { proto: 'IPv4 (0x11)', srcIp: '192.168.1.105', dstIp: '93.184.216.34', ttl: 64, id: '0x5001', len: '192 bytes' },
          l2: { srcMac: '00:1A:2B:3C:4D:5E', dstMac: '00:50:56:A1:B2:C3', ethType: '0x0800' },
          data: 'RTP Header (V2, PT=111 Opus) | Audio Samples: [0x7f, 0x81, 0x84, 0x88, 0x90...]'
        }
      },
      {
        step: 2,
        title: '💥 Voice Packet #2 DROPPED by Wi-Fi packet error',
        from: 'Router',
        to: 'Security',
        hopIndex: 1,
        flags: 'UDP (LOST)',
        seq: 'RTP 102',
        ack: 'None',
        win: 'None',
        status: 'dropped',
        clientState: 'STREAMING',
        serverState: 'STREAMING',
        idsStatus: 'Packet lost in wireless hop. UDP has NO ACK or retransmit mechanism — caller will hear subtle PLC concealment.',
        explanation: 'Packet #2 is dropped by RF interference. Because UDP has no sequence tracking or retransmission at the transport layer, sender has NO IDEA the packet was lost and sends no retransmit.',
        tcpdump: '12:00:04.020 [WIFI LOSS] UDP Packet RTP seq=102 dropped over wireless link (CRC fail)',
        packet: {
          l4: { proto: 'UDP (LOST)', srcPort: 5004, dstPort: 5004, length: '172 bytes', csum: '0x0000', hdrLen: '8 bytes' },
          l3: { proto: 'IPv4 (0x11)', srcIp: '192.168.1.105', dstIp: '93.184.216.34', ttl: 63, id: '0x5002', len: '192 bytes' },
          l2: { srcMac: 'A4:93:3F:11:22:33', dstMac: '52:54:00:12:34:56', ethType: '0x0800' },
          data: '[Lost 20ms audio frame — voice codec will interpolate silence using PLC]'
        }
      },
      {
        step: 3,
        title: 'Voice Packet #3 arrives → Stream continues smoothly! 🎙️',
        from: 'Server',
        to: 'Client',
        hopIndex: 2,
        flags: 'UDP / RTP',
        seq: 'RTP 103',
        ack: 'None',
        win: 'None',
        status: 'normal',
        clientState: 'STREAMING',
        serverState: 'STREAMING',
        idsStatus: 'IDS: Stream health: 99.1% delivery. Zero buffer stalls or Head-of-Line blocking.',
        explanation: 'Receiver plays Voice Packet #3 without waiting for the lost Packet #2. The user hears continuous speech without lag or stutter. This is why VoIP and gaming choose UDP over TCP!',
        tcpdump: '12:00:04.040 IP 192.168.1.105.5004 > 93.184.216.34.5004: UDP, length 172 (RTP seq=103, ts=1920)',
        packet: {
          l4: { proto: 'UDP (RTP)', srcPort: 5004, dstPort: 5004, length: '172 bytes', csum: '0x2213', hdrLen: '8 bytes' },
          l3: { proto: 'IPv4 (0x11)', srcIp: '192.168.1.105', dstIp: '93.184.216.34', ttl: 64, id: '0x5003', len: '192 bytes' },
          l2: { srcMac: '52:54:00:12:34:56', dstMac: 'A4:93:3F:11:22:33', ethType: '0x0800' },
          data: 'RTP Header (V2, PT=111 Opus) | Audio Samples: [0x92, 0x95, 0x99, 0xa0...]'
        }
      }
    ]
  },
  {
    id: 'ids-ips-synflood',
    title: 'Security: TCP SYN Flood Attack & IDS vs IPS',
    protocol: 'SECURITY',
    badge: 'IDS vs IPS in Action',
    badgeColor: '#dc2626',
    description: 'An attacker floods the server with forged TCP SYN packets to exhaust the backlog connection queue. Compare how a passive IDS only logs alerts while an active inline IPS blocks the threat!',
    steps: [
      {
        step: 1,
        title: 'Attacker blasts 10,000 spoofed SYN packets / second',
        from: 'Client',
        to: 'Router',
        hopIndex: 0,
        flags: 'SYN (Attack Flood)',
        seq: 9999,
        ack: 0,
        win: 1024,
        status: 'normal',
        clientState: 'ATTACKING',
        serverState: 'LISTEN',
        idsStatus: 'IDS: High SYN anomaly rate detected (>10,000 syn/sec) with randomized source IPs.',
        explanation: 'Attacker script sends high-rate SYN packets with fake, unroutable source IPs (e.g. 198.51.100.x). The server will send SYN-ACKs into the void and leave sockets in SYN_RECEIVED until queue fills.',
        tcpdump: '12:00:05.001 IP 198.51.100.77.44122 > 93.184.216.34.80: Flags [S], seq 9999, win 1024, length 0 [TCP SYN Flood Burst]',
        packet: {
          l4: { proto: 'TCP (MALICIOUS)', srcPort: 44122, dstPort: 80, seq: 9999, ack: 0, flags: 'SYN=1', win: 1024, hdrLen: '20 bytes', csum: '0xdead' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '198.51.100.77 (Spoofed)', dstIp: '93.184.216.34', ttl: 128, id: '0x6666', len: '40 bytes' },
          l2: { srcMac: '00:1A:2B:3C:4D:5E', dstMac: '00:50:56:A1:B2:C3', ethType: '0x0800' },
          data: '(SYN Flood Attack: No intention of completing 3-way handshake)'
        }
      },
      {
        step: 2,
        title: 'Security Gateway inspects packet with IDS & IPS rules',
        from: 'Router',
        to: 'Security',
        hopIndex: 1,
        flags: 'SYN (Inspection)',
        seq: 9999,
        ack: 0,
        win: 1024,
        status: 'alert_by_ids',
        clientState: 'ATTACKING',
        serverState: 'PROTECTED',
        idsStatus: 'RULE MATCH: alert tcp any any -> any 80 (msg:"SYN Flood Attack"; threshold:type both, track by_dst, count 50, seconds 1; sid:100001;)',
        explanation: 'Signature engine matches Snort/Suricata Rule #100001. Threshold of 50 SYNs/sec breached. System generates high-severity SIEM alert.',
        tcpdump: '12:00:05.002 [SURICATA ALERT] [1:100001:1] POTENTIAL TCP SYN FLOOD DETECTED [Classification: Denial of Service] [Priority: 1]',
        packet: {
          l4: { proto: 'TCP (INSPECTED)', srcPort: 44122, dstPort: 80, seq: 9999, ack: 0, flags: 'SYN=1', win: 1024, hdrLen: '20 bytes', csum: '0xdead' },
          l3: { proto: 'IPv4 (0x06)', srcIp: '198.51.100.77', dstIp: '93.184.216.34', ttl: 127, id: '0x6666', len: '40 bytes' },
          l2: { srcMac: 'A4:93:3F:11:22:33', dstMac: '52:54:00:12:34:56', ethType: '0x0800' },
          data: '[Attack signature matched: Snort Rule SID:100001 triggered]'
        }
      },
      {
        step: 3,
        title: '🛡️ Inline IPS Action: Drop Packet & Activate SYN Cookies',
        from: 'Security',
        to: 'Server',
        hopIndex: 2,
        flags: 'PACKET BLOCKED',
        seq: 'BLOCKED',
        ack: 'BLOCKED',
        win: 'BLOCKED',
        status: 'blocked_by_ips',
        clientState: 'ATTACKING',
        serverState: 'PROTECTED',
        idsStatus: 'IPS ACTION: In-line packet DROPPED. Source rate-limited. SYN Cookie protection active.',
        explanation: 'Passive IDS would only write a log entry while the server crashes. Active IPS drops the packets before they reach the server, sends TCP RST to attacker, and enables SYN Cookies!',
        tcpdump: '12:00:05.003 [IPS INLINE DROP] Packet dropped by iptables/nftables SYN-proxy module. Server protected.',
        packet: {
          l4: { proto: 'TCP (BLOCKED)', srcPort: 44122, dstPort: 80, seq: 'DROPPED', ack: 'DROPPED', flags: 'BLOCKED', win: 0, hdrLen: 'N/A', csum: 'N/A' },
          l3: { proto: 'IPv4', srcIp: '198.51.100.77', dstIp: '93.184.216.34', ttl: 0, id: '0x0000', len: '0' },
          l2: { srcMac: 'BLOCKED', dstMac: 'BLOCKED', ethType: 'DROPPED' },
          data: '[INLINE IPS BLOCKED THIS PACKET — SERVER NEVER SAW MALICIOUS SYN]'
        }
      }
    ]
  }
];

// ─── TCP vs UDP Comparison Matrix ────────────────────────────────────────────
const COMPARISON = [
  { feature: 'Connection Architecture', tcp: 'Connection-oriented (Requires 3-way handshake before data)', udp: 'Connectionless (Sends data immediately without setup)' },
  { feature: 'Delivery Guarantee', tcp: 'Guaranteed delivery via sequence ACKs & retransmission', udp: 'Best-effort delivery; packets can be lost silently' },
  { feature: 'Packet Ordering', tcp: 'Guaranteed in-order delivery; reconstructs byte stream', udp: 'No ordering; datagrams can arrive out of order' },
  { feature: 'Header Overhead', tcp: '20 to 60 bytes (flags, window, options, sequence numbers)', udp: 'Fixed 8 bytes (Src Port, Dst Port, Length, Checksum)' },
  { feature: 'Flow Control', tcp: 'Yes: Sliding Window advertises receiver buffer capacity', udp: 'None: Sender can overwhelm receiver socket buffer' },
  { feature: 'Congestion Control', tcp: 'Yes: CUBIC, BBR, Reno adjust transmission rate on drop', udp: 'None: Leaves rate pacing entirely to application' },
  { feature: 'Transmission Speed', tcp: 'Slower due to handshake, ACKs, retransmits, and windowing', udp: 'Fastest possible: minimal kernel overhead, immediate dispatch' },
  { feature: 'Broadcast / Multicast', tcp: 'Unicast only (point-to-point connection)', udp: 'Full Unicast, Multicast (IGMP), and Broadcast support' },
  { feature: 'State Tracking', tcp: 'Stateful: 11 connection states tracked in OS kernel TCB', udp: 'Stateless: Zero kernel state preserved between datagrams' },
  { feature: 'Data Boundaries', tcp: 'Stream-oriented: Application reads continuous byte stream', udp: 'Message-oriented: Preserves exact datagram boundaries' },
  { feature: 'Error Recovery', tcp: 'Automatic Fast Retransmit (3 DupACKs) & RTO timeout', udp: 'None in protocol (must be implemented in application layer)' },
  { feature: 'Real-World Protocols', tcp: 'HTTP/1.1, HTTP/2, HTTPS, SSH, SMTP, IMAP, MySQL, Postgres', udp: 'DNS, DHCP, NTP, SNMP, VoIP (SIP/RTP), QUIC (HTTP/3), WireGuard' }
];

export default function TcpUdpModelExplorer() {
  const [activeTab, setActiveTab] = useState('tracer'); // 'tracer' | 'tcpip' | 'tcp-deep' | 'udp-deep' | 'ids-ips' | 'compare'
  
  // Packet Tracer State
  const [activeScenarioId, setActiveScenarioId] = useState('tcp-handshake');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5, 1, 2
  const [selectedLayerInspect, setSelectedLayerInspect] = useState('l4'); // 'l4' | 'l3' | 'l2' | 'data'
  const [securityFilterMode, setSecurityFilterMode] = useState('ips'); // 'ids' | 'ips'

  // Model state
  const [selectedTcpIpLayer, setSelectedTcpIpLayer] = useState(3);
  const timerRef = useRef(null);

  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];
  const currentStep = activeScenario.steps[currentStepIndex] || activeScenario.steps[0];
  const selectedLayerData = TCP_IP_LAYERS.find(l => l.layer === selectedTcpIpLayer) || TCP_IP_LAYERS[1];

  // Auto playback loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 2800 / playbackSpeed;
      timerRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < activeScenario.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, activeScenario.steps.length]);

  const handleNextStep = () => {
    if (currentStepIndex < activeScenario.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleScenarioSelect = (scenarioId) => {
    setIsPlaying(false);
    setActiveScenarioId(scenarioId);
    setCurrentStepIndex(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* ─── Hero Header & View Mode Switcher ─────────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '22px 24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.08) 50%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.4)',
              flexShrink: 0
            }}>
              <Layers size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{
                  fontSize: '1.35rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '-0.01em'
                }}>
                  TCP/IP & UDP Architecture & Packet Tracer
                </h1>
                <span className="badge" style={{
                  background: 'rgba(16, 185, 129, 0.18)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontSize: '0.68rem',
                  fontWeight: '700'
                }}>
                  L4 Transport Engine
                </span>
                <span className="badge" style={{
                  background: 'rgba(59, 130, 246, 0.18)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  fontSize: '0.68rem',
                  fontWeight: '700'
                }}>
                  RFC 793 / 768 / 1122
                </span>
                <span className="badge" style={{
                  background: 'rgba(239, 68, 68, 0.18)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  fontSize: '0.68rem',
                  fontWeight: '700'
                }}>
                  IDS / IPS Inline Defense
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Interactive protocol engine with packet tracer animations, header dissection, connection state machines, and threat prevention.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Navigation Tabs ────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '18px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {[
            { id: 'tracer', label: 'Flow & Packet Tracer', color: '#10b981', icon: Activity, badge: 'Live Simulator' },
            { id: 'tcpip', label: 'TCP/IP 4-Layer Model', color: '#3b82f6', icon: Layers, badge: 'Architecture' },
            { id: 'tcp-deep', label: 'TCP Deep Dive', color: '#6366f1', icon: Cpu, badge: '11 States' },
            { id: 'udp-deep', label: 'UDP Deep Dive', color: '#f59e0b', icon: Zap, badge: '8-Byte Header' },
            { id: 'ids-ips', label: 'IDS & IPS Security', color: '#ef4444', icon: ShieldAlert, badge: 'Inline vs SPAN' },
            { id: 'compare', label: 'TCP vs UDP Matrix', color: '#a855f7', icon: RefreshCw, badge: 'Side-by-Side' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '9px 15px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive
                    ? `linear-gradient(135deg, ${tab.color}, ${tab.color}bb)`
                    : 'rgba(0, 0, 0, 0.35)',
                  border: isActive
                    ? `1px solid ${tab.color}`
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? `0 0 16px ${tab.color}44` : 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.62rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#ffffff' : 'var(--text-dim)'
                }}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 1: PACKET TRACER & FLOW SIMULATOR (FEATURED FIRST)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tracer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Scenario Selector Ribbon */}
          <div className="glass-panel" style={{
            padding: '16px 20px',
            borderRadius: '14px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Flow & Protocol Scenario:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Security Node:</span>
                <button
                  onClick={() => setSecurityFilterMode('ids')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: securityFilterMode === 'ids' ? '700' : '500',
                    background: securityFilterMode === 'ids' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(0, 0, 0, 0.3)',
                    color: securityFilterMode === 'ids' ? '#60a5fa' : 'var(--text-dim)',
                    border: securityFilterMode === 'ids' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer'
                  }}
                >
                  Passive IDS (Alert Only)
                </button>
                <button
                  onClick={() => setSecurityFilterMode('ips')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: securityFilterMode === 'ips' ? '700' : '500',
                    background: securityFilterMode === 'ips' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0, 0, 0, 0.3)',
                    color: securityFilterMode === 'ips' ? '#f87171' : 'var(--text-dim)',
                    border: securityFilterMode === 'ips' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer'
                  }}
                >
                  Active IPS (Inline Drop)
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              {SCENARIOS.map((sc) => {
                const isSelected = sc.id === activeScenarioId;
                return (
                  <button
                    key={sc.id}
                    onClick={() => handleScenarioSelect(sc.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: isSelected ? `${sc.badgeColor}18` : 'rgba(0, 0, 0, 0.35)',
                      border: isSelected ? `2px solid ${sc.badgeColor}` : '1px solid rgba(255, 255, 255, 0.06)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: sc.badgeColor }}>
                        {sc.protocol}
                      </span>
                      <span style={{
                        fontSize: '0.6rem',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        background: `${sc.badgeColor}20`,
                        color: sc.badgeColor,
                        fontWeight: '600'
                      }}>
                        {sc.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: isSelected ? '700' : '600', color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                      {sc.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── Packet Tracer Interactive Wire Visualizer Canvas ───────────── */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Top Bar with Step counter and Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '14px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: activeScenario.badgeColor,
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {currentStep.step}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                    {currentStep.title}
                  </h3>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Step {currentStepIndex + 1} of {activeScenario.steps.length} · {activeScenario.title}
                </div>
              </div>

              {/* Playback Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: currentStepIndex === 0 ? '#475569' : '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '0.76rem',
                    fontWeight: '600'
                  }}
                >
                  ◀ Prev
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '6px',
                    background: isPlaying ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    boxShadow: isPlaying ? '0 0 14px rgba(239, 68, 68, 0.4)' : '0 0 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isPlaying ? 'Pause' : 'Play Flow'}</span>
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={currentStepIndex === activeScenario.steps.length - 1}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: currentStepIndex === activeScenario.steps.length - 1 ? '#475569' : '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: currentStepIndex === activeScenario.steps.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.76rem',
                    fontWeight: '600'
                  }}
                >
                  Next ▶
                </button>

                <button
                  onClick={handleReset}
                  title="Reset to Step 1"
                  style={{
                    padding: '7px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#94a3b8',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={14} />
                </button>

                {/* Speed selector */}
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value={0.5}>0.5x Speed</option>
                  <option value={1}>1.0x Normal</option>
                  <option value={2}>2.0x Fast</option>
                </select>
              </div>
            </div>

            {/* 4-Node Network Topology Diagram */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.6fr 1.2fr 0.6fr 1.2fr 0.6fr 1.2fr',
              alignItems: 'center',
              margin: '24px 0',
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              overflowX: 'auto'
            }}>
              {/* NODE 1: Client Host */}
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: currentStep.from === 'Client' || currentStep.to === 'Client'
                  ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                border: currentStep.from === 'Client' || currentStep.to === 'Client'
                  ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: currentStep.from === 'Client' || currentStep.to === 'Client'
                  ? '0 0 16px rgba(59, 130, 246, 0.3)' : 'none',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Terminal size={16} color="#3b82f6" />
                  <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#ffffff' }}>Client Host</span>
                </div>
                <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#93c5fd' }}>192.168.1.105</div>
                <div style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>Port: 54321 (Ephemeral)</div>
                <div style={{
                  marginTop: '8px',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  fontSize: '0.64rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-mono)'
                }}>
                  State: {currentStep.clientState}
                </div>
              </div>

              {/* Wire 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  height: '3px',
                  width: '100%',
                  background: currentStep.hopIndex === 0
                    ? 'linear-gradient(90deg, #3b82f6, #10b981)'
                    : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: currentStep.hopIndex === 0 ? '0 0 10px #3b82f6' : 'none'
                }} />
                <span style={{ fontSize: '0.6rem', color: currentStep.hopIndex === 0 ? '#34d399' : '#475569', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                  LAN Hop
                </span>
              </div>

              {/* NODE 2: Gateway & NAT Router */}
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: currentStep.from === 'Router' || currentStep.to === 'Router'
                  ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                border: currentStep.from === 'Router' || currentStep.to === 'Router'
                  ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: currentStep.from === 'Router' || currentStep.to === 'Router'
                  ? '0 0 16px rgba(16, 185, 129, 0.3)' : 'none',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Network size={16} color="#10b981" />
                  <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#ffffff' }}>NAT Router</span>
                </div>
                <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>192.168.1.1 (LAN)</div>
                <div style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>WAN: 203.0.113.45</div>
                <div style={{
                  marginTop: '8px',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  fontSize: '0.64rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-mono)'
                }}>
                  L3 Forwarding / NAT
                </div>
              </div>

              {/* Wire 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  height: '3px',
                  width: '100%',
                  background: currentStep.hopIndex === 1
                    ? 'linear-gradient(90deg, #10b981, #ef4444)'
                    : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: currentStep.hopIndex === 1 ? '0 0 10px #ef4444' : 'none'
                }} />
                <span style={{ fontSize: '0.6rem', color: currentStep.hopIndex === 1 ? '#f87171' : '#475569', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                  Security Link
                </span>
              </div>

              {/* NODE 3: Security Inspection Gateway (IDS / IPS) */}
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: currentStep.status === 'blocked_by_ips'
                  ? 'rgba(220, 38, 38, 0.25)'
                  : currentStep.status === 'alert_by_ids'
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'rgba(15, 23, 42, 0.6)',
                border: currentStep.status === 'blocked_by_ips'
                  ? '2px solid #ef4444'
                  : currentStep.status === 'alert_by_ids'
                    ? '2px solid #f59e0b'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: currentStep.status === 'blocked_by_ips' ? '0 0 18px rgba(239, 68, 68, 0.5)' : 'none',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
                  <ShieldAlert size={16} color={currentStep.status === 'blocked_by_ips' ? '#ef4444' : '#f59e0b'} />
                  <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#ffffff' }}>
                    {securityFilterMode === 'ips' ? 'Active IPS Engine' : 'Passive IDS Tap'}
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#fca5a5' }}>
                  {securityFilterMode === 'ips' ? 'Inline Inspection' : 'SPAN / Out-of-band'}
                </div>
                <div style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                  Snort / Suricata
                </div>
                <div style={{
                  marginTop: '8px',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  background: currentStep.status === 'blocked_by_ips' ? '#ef4444' : 'rgba(245, 158, 11, 0.2)',
                  color: currentStep.status === 'blocked_by_ips' ? '#ffffff' : '#fbbf24',
                  fontSize: '0.64rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {currentStep.status === 'blocked_by_ips' ? 'ACTION: DROP 🛑' : 'INSPECT: PASS ✅'}
                </div>
              </div>

              {/* Wire 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  height: '3px',
                  width: '100%',
                  background: currentStep.hopIndex === 2
                    ? 'linear-gradient(90deg, #ef4444, #a855f7)'
                    : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: currentStep.hopIndex === 2 ? '0 0 10px #a855f7' : 'none'
                }} />
                <span style={{ fontSize: '0.6rem', color: currentStep.hopIndex === 2 ? '#c084fc' : '#475569', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                  WAN / Server
                </span>
              </div>

              {/* NODE 4: Destination Server */}
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: currentStep.from === 'Server' || currentStep.to === 'Server'
                  ? 'rgba(168, 85, 247, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                border: currentStep.from === 'Server' || currentStep.to === 'Server'
                  ? '2px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: currentStep.from === 'Server' || currentStep.to === 'Server'
                  ? '0 0 16px rgba(168, 85, 247, 0.3)' : 'none',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Server size={16} color="#a855f7" />
                  <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#ffffff' }}>Target Server</span>
                </div>
                <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#d8b4fe' }}>93.184.216.34</div>
                <div style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>Port: 80 / 443 / 53</div>
                <div style={{
                  marginTop: '8px',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  color: '#c084fc',
                  fontSize: '0.64rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-mono)'
                }}>
                  State: {currentStep.serverState}
                </div>
              </div>
            </div>

            {/* In-Flight Packet Banner */}
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: currentStep.status === 'dropped'
                ? 'rgba(239, 68, 68, 0.15)'
                : currentStep.status === 'blocked_by_ips'
                  ? 'rgba(220, 38, 38, 0.25)'
                  : currentStep.status === 'retransmitted'
                    ? 'rgba(245, 158, 11, 0.15)'
                    : 'rgba(16, 185, 129, 0.12)',
              border: `1px solid ${
                currentStep.status === 'dropped' || currentStep.status === 'blocked_by_ips'
                  ? '#ef4444' : currentStep.status === 'retransmitted' ? '#f59e0b' : '#10b981'
              }`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge" style={{
                  background: '#000000',
                  color: currentStep.status === 'dropped' ? '#ef4444' : '#34d399',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: '800'
                }}>
                  {currentStep.flags}
                </span>
                <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#ffffff' }}>
                  {currentStep.from} → {currentStep.to}
                </span>
                {currentStep.seq !== 'N/A' && (
                  <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#93c5fd' }}>
                    Seq={currentStep.seq} · Ack={currentStep.ack} · Win={currentStep.win}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {currentStep.status === 'dropped' && (
                  <span style={{ color: '#ef4444', fontWeight: '800', fontSize: '0.78rem' }}>
                    ❌ PACKET DROPPED
                  </span>
                )}
                {currentStep.status === 'blocked_by_ips' && (
                  <span style={{ color: '#fca5a5', fontWeight: '800', fontSize: '0.78rem' }}>
                    🛑 BLOCKED BY INLINE IPS
                  </span>
                )}
                {currentStep.status === 'retransmitted' && (
                  <span style={{ color: '#fbbf24', fontWeight: '800', fontSize: '0.78rem' }}>
                    ⚡ FAST RETRANSMISSION
                  </span>
                )}
                {currentStep.status === 'normal' && (
                  <span style={{ color: '#34d399', fontWeight: '700', fontSize: '0.76rem' }}>
                    ✓ In Flight / Delivered
                  </span>
                )}
              </div>
            </div>

            {/* Explanation Box */}
            <div style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '18px',
              lineHeight: '1.6',
              fontSize: '0.82rem',
              color: '#e2e8f0'
            }}>
              <strong style={{ color: '#38bdf8' }}>Kernel & Wire Explanation: </strong>
              {currentStep.explanation}
              <div style={{ marginTop: '8px', fontSize: '0.76rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} color="#f59e0b" />
                <span><strong>Security Inspection:</strong> {currentStep.idsStatus}</span>
              </div>
            </div>

            {/* Tcpdump / Wireshark Live Packet Snippet */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: '#090d16',
              border: '1px solid #1e293b',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              color: '#34d399',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ color: '#64748b' }}># tcpdump -nnvvv -i eth0: </span>
              {currentStep.tcpdump}
            </div>
          </div>

          {/* ─── Layer Dissector / Packet Header Inspector ──────────────────── */}
          <div className="glass-panel" style={{
            padding: '22px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(59, 130, 246, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} color="#38bdf8" />
                <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  Packet Dissector — Byte-Level Header Breakdown
                </h4>
              </div>

              {/* Layer Tabs */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'l4', label: 'Layer 4 (Transport)', color: '#10b981' },
                  { id: 'l3', label: 'Layer 3 (Internet)', color: '#3b82f6' },
                  { id: 'l2', label: 'Layer 2 (Ethernet)', color: '#8b5cf6' },
                  { id: 'data', label: 'Payload Data', color: '#ef4444' }
                ].map(l => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLayerInspect(l.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: selectedLayerInspect === l.id ? '700' : '500',
                      background: selectedLayerInspect === l.id ? `${l.color}25` : 'rgba(0,0,0,0.3)',
                      color: selectedLayerInspect === l.id ? l.color : 'var(--text-muted)',
                      border: selectedLayerInspect === l.id ? `1px solid ${l.color}` : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer'
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dissector content */}
            {selectedLayerInspect === 'l4' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {Object.entries(currentStep.packet.l4).map(([key, val]) => (
                  <div key={key} style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      {key}
                    </div>
                    <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#34d399', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      {String(val)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedLayerInspect === 'l3' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {Object.entries(currentStep.packet.l3).map(([key, val]) => (
                  <div key={key} style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      {key}
                    </div>
                    <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#60a5fa', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      {String(val)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedLayerInspect === 'l2' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {Object.entries(currentStep.packet.l2).map(([key, val]) => (
                  <div key={key} style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      {key}
                    </div>
                    <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#a78bfa', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      {String(val)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedLayerInspect === 'data' && (
              <div style={{
                padding: '14px',
                borderRadius: '8px',
                background: '#090d16',
                border: '1px solid #1e293b',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: '#f87171',
                lineHeight: '1.6'
              }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '6px' }}>Encapsulated Application Layer Payload:</div>
                {currentStep.packet.data}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 2: TCP/IP 4-LAYER MODEL ARCHITECTURE
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tcpip' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.1fr) minmax(440px, 1.9fr)',
            gap: '20px',
            alignItems: 'start'
          }}>
            {/* Left: Interactive 4-Layer Stack */}
            <div className="glass-panel" style={{
              padding: '20px',
              borderRadius: '16px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '10px'
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ffffff' }}>
                  TCP/IP Protocol Hierarchy (RFC 1122)
                </span>
                <span style={{ fontSize: '0.68rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                  4 Layers
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {TCP_IP_LAYERS.map(l => {
                  const isSelected = l.layer === selectedTcpIpLayer;
                  return (
                    <div
                      key={l.layer}
                      onClick={() => setSelectedTcpIpLayer(l.layer)}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        background: isSelected ? `${l.color}20` : 'rgba(0, 0, 0, 0.35)',
                        border: isSelected ? `2px solid ${l.color}` : '1px solid rgba(255, 255, 255, 0.06)',
                        boxShadow: isSelected ? `0 0 16px ${l.glowColor}` : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          background: `${l.color}25`,
                          color: l.color,
                          fontWeight: '900',
                          fontSize: '0.86rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          L{l.layer}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: isSelected ? '800' : '600', color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                            {l.name}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                            PDU: <strong style={{ color: l.color }}>{l.pdu}</strong>
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.64rem', color: 'var(--text-dim)' }}>
                        {l.osiMapping.split('(')[0].trim()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Encapsulation Pipeline Visualizer */}
              <div style={{
                marginTop: '18px',
                padding: '14px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Packet Encapsulation Pipeline:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ padding: '6px', borderRadius: '4px', background: '#ef444420', color: '#f87171', border: '1px solid #ef444440', textAlign: 'center' }}>
                    [Data Payload]
                  </div>
                  <div style={{ textAlign: 'center', color: '#64748b' }}>↓ Encapsulate in TCP/UDP Segment</div>
                  <div style={{ padding: '6px', borderRadius: '4px', background: '#10b98120', color: '#34d399', border: '1px solid #10b98140', textAlign: 'center' }}>
                    [TCP/UDP Hdr (20B/8B)] + [Data Payload]
                  </div>
                  <div style={{ textAlign: 'center', color: '#64748b' }}>↓ Encapsulate in IP Packet</div>
                  <div style={{ padding: '6px', borderRadius: '4px', background: '#3b82f620', color: '#60a5fa', border: '1px solid #3b82f640', textAlign: 'center' }}>
                    [IP Hdr (20B)] + [TCP/UDP Segment]
                  </div>
                  <div style={{ textAlign: 'center', color: '#64748b' }}>↓ Encapsulate in Ethernet Frame</div>
                  <div style={{ padding: '6px', borderRadius: '4px', background: '#8b5cf620', color: '#a78bfa', border: '1px solid #8b5cf640', textAlign: 'center' }}>
                    [Ethernet Hdr (14B)] + [IP Packet] + [FCS (4B)]
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Layer Inspector Details */}
            <div className="glass-panel" style={{
              padding: '24px',
              borderRadius: '16px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: `1px solid ${selectedLayerData.color}44`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${selectedLayerData.color}, ${selectedLayerData.color}88)`,
                    color: '#ffffff',
                    fontWeight: '900',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 16px ${selectedLayerData.glowColor}`
                  }}>
                    L{selectedLayerData.layer}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                      {selectedLayerData.name}
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: selectedLayerData.color, fontWeight: '600' }}>
                      {selectedLayerData.osiMapping}
                    </div>
                  </div>
                </div>
                <span className="badge" style={{
                  background: `${selectedLayerData.color}20`,
                  color: selectedLayerData.color,
                  border: `1px solid ${selectedLayerData.color}40`,
                  fontSize: '0.72rem'
                }}>
                  PDU: {selectedLayerData.pdu}
                </span>
              </div>

              <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: '1.65', marginBottom: '16px' }}>
                {selectedLayerData.description}
              </p>

              {/* Analogy Box */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: `${selectedLayerData.color}10`,
                border: `1px solid ${selectedLayerData.color}30`,
                marginBottom: '18px',
                fontSize: '0.78rem',
                color: '#cbd5e1'
              }}>
                <strong style={{ color: selectedLayerData.color }}>Real-World Analogy: </strong>
                {selectedLayerData.realWorldAnalogy}
              </div>

              {/* Protocols Table */}
              <div style={{ marginBottom: '18px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Prominent Protocols at Layer {selectedLayerData.layer}:
                </span>
                <div style={{
                  marginTop: '8px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-dim)' }}>Protocol</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-dim)' }}>Port / Type</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-dim)' }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedLayerData.protocols.map((p, i) => (
                        <tr key={i} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                          <td style={{ padding: '8px 10px', fontWeight: '700', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{p.name}</td>
                          <td style={{ padding: '8px 10px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{p.port}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Core Functions */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Core Functions & Responsibilities:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                  {selectedLayerData.keyFunctions.map((fn, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                      <CheckCircle2 size={14} color={selectedLayerData.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{fn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 3: TCP DEEP DIVE (HEADERS, FLAGS, 11 STATES, SLIDING WINDOW)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tcp-deep' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* TCP Header Bit Layout */}
          <div className="glass-panel" style={{
            padding: '22px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(59, 130, 246, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Hash size={18} color="#3b82f6" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  TCP Segment Header — 20 Bytes Fixed (up to 60 with Options)
                </h3>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                RFC 793 / 1323
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {TCP_HEADER_FIELDS.map((f, i) => (
                <div key={i} style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: `1px solid ${f.color}30`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff' }}>{f.name}</span>
                    <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', padding: '1px 5px', borderRadius: '3px', background: `${f.color}20`, color: f.color }}>
                      {f.bits} bits [{f.offset}]
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* TCP Flags */}
            <div style={{
              marginTop: '18px',
              padding: '16px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#fca5a5', marginBottom: '10px', textTransform: 'uppercase' }}>
                The 9 TCP Control Flags:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                {[
                  { f: 'SYN', d: 'Synchronize ISN', c: '#10b981' },
                  { f: 'ACK', d: 'Acknowledgment valid', c: '#3b82f6' },
                  { f: 'FIN', d: 'Finish connection', c: '#ef4444' },
                  { f: 'RST', d: 'Reset connection', c: '#dc2626' },
                  { f: 'PSH', d: 'Push data immediately', c: '#f59e0b' },
                  { f: 'URG', d: 'Urgent pointer valid', c: '#f97316' },
                  { f: 'ECE', d: 'ECN-Echo congestion', c: '#06b6d4' },
                  { f: 'CWR', d: 'Congestion reduced', c: '#0ea5e9' },
                  { f: 'NS', d: 'Nonce Sum (RFC 3540)', c: '#64748b' }
                ].map(flag => (
                  <div key={flag.f} style={{
                    padding: '8px',
                    borderRadius: '6px',
                    background: `${flag.c}15`,
                    border: `1px solid ${flag.c}30`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: '800', color: flag.c, fontFamily: 'var(--font-mono)' }}>
                      {flag.f}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {flag.d}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TCP 11-State Connection State Machine */}
          <div className="glass-panel" style={{
            padding: '22px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(168, 85, 247, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '12px'
            }}>
              <RefreshCw size={18} color="#a855f7" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                TCP 11-State Connection State Machine
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              {TCP_STATES.map((st, i) => (
                <div key={i} style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: `1px solid ${st.color}30`
                }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: `${st.color}20`,
                    color: st.color,
                    fontWeight: '800',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: '6px'
                  }}>
                    {st.state}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {st.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 4: UDP DEEP DIVE (8-BYTE HEADER & DATAGRAM MODEL)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'udp-deep' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{
            padding: '22px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Zap size={22} color="#f59e0b" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                UDP Architecture — Minimal 8-Byte Datagram Overhead
              </h3>
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                RFC 768
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: '1.65', marginBottom: '20px' }}>
              UDP eliminates all connection setup, ACK sequencing, flow control, and state machine overhead. A datagram is constructed by prepending just <strong style={{ color: '#fbbf24' }}>8 bytes</strong> to the application message and dispatched directly to the IP layer. This minimal overhead enables sub-millisecond execution times.
            </p>

            {/* UDP 8-byte layout grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              marginBottom: '20px'
            }}>
              {UDP_HEADER_FIELDS.map((f, i) => (
                <div key={i} style={{
                  padding: '16px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', color: f.color, fontFamily: 'var(--font-mono)' }}>
                    {f.name} (16 bits)
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Bits [{f.offset}]
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Comparison with TCP Overhead */}
            <div style={{
              padding: '14px 18px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.8rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>UDP Header: </span>
                <strong style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>8 Bytes</strong>
              </div>
              <span style={{ color: '#64748b' }}>vs</span>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>TCP Header: </span>
                <strong style={{ color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>20-60 Bytes</strong>
              </div>
              <span style={{ color: '#64748b' }}>→</span>
              <div style={{ color: '#34d399', fontWeight: '700' }}>
                UDP saves 12 to 52 bytes of bandwidth on EVERY SINGLE PACKET
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 5: IDS & IPS SECURITY DEEP DIVE (INLINE VS SPAN/TAP)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ids-ips' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <ShieldAlert size={24} color="#ef4444" />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  Intrusion Detection System (IDS) vs Intrusion Prevention System (IPS)
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#fca5a5' }}>
                  Network Layer 4-7 Threat Detection & Automated Inline Blocking
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '18px' }}>
              {/* IDS Column */}
              <div style={{
                padding: '18px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Eye size={18} color="#3b82f6" />
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: '#60a5fa' }}>
                    IDS (Passive / Out-of-Band)
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Topology:</strong> Connects via SPAN (Switch Port Analyzer) mirror ports or optical test taps (TAPs). Sits out-of-band.</div>
                  <div><strong>Action:</strong> Inspects copied packets, detects anomalies, and generates SIEM/Syslog alerts. Does NOT stop or alter packets.</div>
                  <div><strong>Latency Impact:</strong> <span style={{ color: '#34d399', fontWeight: '700' }}>Zero latency impact</span> on active network traffic. If IDS crashes, traffic continues unhindered.</div>
                  <div><strong>Risk:</strong> Cannot prevent real-time zero-day attacks or single-packet exploits before they hit the target server.</div>
                  <div><strong>Popular Tools:</strong> Snort (IDS mode), Zeek (Bro), Suricata (passive mode).</div>
                </div>
              </div>

              {/* IPS Column */}
              <div style={{
                padding: '18px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <ShieldCheck size={18} color="#ef4444" />
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: '#f87171' }}>
                    IPS (Active / Inline)
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Topology:</strong> Sits directly in-line ("bump-in-the-wire") between routers, firewalls, and server clusters.</div>
                  <div><strong>Action:</strong> Real-time packet inspection. Drops malicious packets, resets TCP connections (TCP RST injection), and dynamically updates ACL blocklists.</div>
                  <div><strong>Latency Impact:</strong> Adds microsecond latency for deep packet inspection. Hardware bypass switches required to prevent single point of failure.</div>
                  <div><strong>Risk:</strong> False positives can inadvertently block legitimate customer traffic.</div>
                  <div><strong>Popular Tools:</strong> Suricata (inline mode), Cisco Firepower, Palo Alto Threat Prevention.</div>
                </div>
              </div>
            </div>

            {/* Signature Example */}
            <div style={{
              marginTop: '20px',
              padding: '14px',
              borderRadius: '10px',
              background: '#090d16',
              border: '1px solid #1e293b'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                Real Snort / Suricata Attack Detection Rule Example:
              </div>
              <code style={{ fontSize: '0.76rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                drop tcp any any -&gt; $HOME_NET 80 (msg:"TCP SYN Flood Attack Detected"; flags:S; threshold:type both, track by_src, count 100, seconds 1; classtype:denial-of-service; sid:1000001; rev:1;)
              </code>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 6: TCP vs UDP COMPARISON MATRIX
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'compare' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          overflowX: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <RefreshCw size={20} color="#a855f7" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              TCP vs UDP Architecture Comparison Matrix
            </h3>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.4)' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Feature</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: '#60a5fa', textTransform: 'uppercase', fontSize: '0.72rem' }}>TCP (Transmission Control)</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: '#fbbf24', textTransform: 'uppercase', fontSize: '0.72rem' }}>UDP (User Datagram)</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  background: i % 2 === 0 ? 'rgba(0, 0, 0, 0.2)' : 'transparent'
                }}>
                  <td style={{ padding: '10px 14px', fontWeight: '700', color: '#e2e8f0', whiteSpace: 'nowrap' }}>{row.feature}</td>
                  <td style={{ padding: '10px 14px', color: '#93c5fd', lineHeight: '1.45' }}>{row.tcp}</td>
                  <td style={{ padding: '10px 14px', color: '#fde68a', lineHeight: '1.45' }}>{row.udp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
