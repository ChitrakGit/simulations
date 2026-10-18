// Comprehensive Computer Networking & Protocols Simulation Data
// Covers OSI 7-Layer, TCP/IP Stack, Packet Tracer, Routing, Protocols, and CLI Commands

export const OSI_LAYERS = [
  {
    layerNumber: 7,
    name: 'Application Layer',
    shortName: 'L7 Application',
    pdu: 'Data',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    protocols: ['HTTP/HTTPS', 'DNS', 'SSH', 'FTP', 'SMTP', 'DHCP', 'WebSocket'],
    summary: 'Direct user and software interface: formats HTTP requests, DNS domain queries, and secure shell streams.',
    description: 'The layer closest to the end user. When you enter a URL in a browser, the Application layer generates an HTTP/1.1 or HTTP/2 request payload (e.g. GET /index.html) or initiates a DNS domain query.',
    headerFields: ['HTTP Request Headers', 'Content-Type', 'Host: example.com', 'Authorization'],
    devices: ['Web Browsers', 'Web Servers', 'API Gateways', 'Load Balancers (L7)'],
    troubleshooting: 'curl -I, telnet, dig, nslookup'
  },
  {
    layerNumber: 6,
    name: 'Presentation Layer',
    shortName: 'L6 Presentation',
    pdu: 'Formatted Data',
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    protocols: ['TLS / SSL', 'JSON', 'XML', 'JPEG', 'GZIP', 'ASCII'],
    summary: 'Data syntax, translation, compression, and TLS 1.3 cryptographic encryption/decryption.',
    description: 'Translates raw application data into standardized formats. Negotiates TLS 1.3 cipher suites (e.g. TLS_AES_256_GCM_SHA384) to encrypt plaintext payloads before transmission over public networks.',
    headerFields: ['TLS Record Header', 'Cipher Suite', 'Initialization Vector (IV)', 'Encrypted Payload'],
    devices: ['TLS Termination Proxies', 'Compression Engines'],
    troubleshooting: 'openssl s_client -connect, curl -v'
  },
  {
    layerNumber: 5,
    name: 'Session Layer',
    shortName: 'L5 Session',
    pdu: 'Session Data',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    protocols: ['POSIX Sockets', 'NetBIOS', 'RPC', 'SOCKS5', 'PPTP'],
    summary: 'Manages dialogues, connection sessions, checkpoints, and graceful connection teardowns.',
    description: 'Establishes, coordinates, and terminates connections between local and remote applications. In modern operating systems, the Session layer is largely implemented via the BSD socket API (socket(), connect(), close()).',
    headerFields: ['Socket File Descriptors', 'Session IDs', 'Keep-Alive Timers'],
    devices: ['Operating System Socket Subsystem', 'Session Border Controllers'],
    troubleshooting: 'netstat -an, ss -tuln'
  },
  {
    layerNumber: 4,
    name: 'Transport Layer',
    shortName: 'L4 Transport',
    pdu: 'Segment (TCP) / Datagram (UDP)',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    protocols: ['TCP', 'UDP', 'QUIC', 'SCTP'],
    summary: 'End-to-end process-to-process delivery: source/destination ports, sequence numbers, ACKs, flow control.',
    description: 'Handles end-to-end communication between specific application processes using Port numbers (0 - 65535). TCP guarantees ordered, reliable, error-checked delivery via sequence numbers and windowing; UDP provides ultra-fast connectionless transmission.',
    headerFields: ['Source Port (e.g. 54321)', 'Destination Port (80 / 443)', 'Sequence Number', 'Ack Number', 'TCP Flags (SYN, ACK, FIN, RST)', 'Window Size'],
    devices: ['Operating System TCP/IP Stack', 'L4 Load Balancers (HAProxy, Envoy)', 'Stateful Firewalls'],
    troubleshooting: 'nc -zv, telnet, nmap, tcptraceroute'
  },
  {
    layerNumber: 3,
    name: 'Network Layer',
    shortName: 'L3 Network',
    pdu: 'Packet',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    protocols: ['IPv4', 'IPv6', 'ICMP (Ping)', 'IPsec', 'BGP', 'OSPF'],
    summary: 'Host-to-host logical addressing and global packet routing across interconnected subnets.',
    description: 'Responsible for logical packet addressing across intermediate networks. Routers inspect the destination IP address against their routing tables to forward the packet hop-by-hop toward its final destination, decrementing the Time-to-Live (TTL).',
    headerFields: ['Source IP (e.g. 192.168.1.10)', 'Destination IP (e.g. 140.82.121.4)', 'Time To Live (TTL: 64)', 'Protocol (6=TCP, 17=UDP, 1=ICMP)', 'Header Checksum'],
    devices: ['Routers', 'Layer-3 Switches', 'NAT Gateways'],
    troubleshooting: 'ping, traceroute, ip route, route -n'
  },
  {
    layerNumber: 2,
    name: 'Data Link Layer',
    shortName: 'L2 Data Link',
    pdu: 'Frame',
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    protocols: ['Ethernet (IEEE 802.3)', 'Wi-Fi (802.11)', 'ARP', 'VLAN (802.1Q)'],
    summary: 'Node-to-node physical transfer on the local link: MAC addresses, switch frame forwarding, and CRC.',
    description: 'Enables node-to-node frame delivery within the same local broadcast domain. Network switches maintain Forwarding Information Bases (FDB / MAC address tables) to switch frames directly to the appropriate physical switch port based on destination MAC.',
    headerFields: ['Preamble', 'Destination MAC (48-bit)', 'Source MAC (48-bit)', 'EtherType (0x0800=IPv4, 0x0806=ARP)', 'Frame Check Sequence (CRC32 FCS)'],
    devices: ['Network Switches (L2)', 'Wireless Access Points (APs)', 'Bridge Interfaces (docker0)'],
    troubleshooting: 'arp -a, ip link, ethtool, bridge link'
  },
  {
    layerNumber: 1,
    name: 'Physical Layer',
    shortName: 'L1 Physical',
    pdu: 'Bits (0s & 1s)',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    protocols: ['1000BASE-T (Gigabit Ethernet)', '10GBASE-SR (Optical Fiber)', 'NRZ', 'Manchester Encoding', 'PAM-4'],
    summary: 'Raw bitstream transmission over physical copper wires, fiber-optic light pulses, or radio RF frequencies.',
    description: 'Converts digital binary bits (0s and 1s) into electrical voltage signals (e.g. +1V / -1V), light wavelengths inside fiber-optic glass strands, or electromagnetic radio waves.',
    headerFields: ['Voltage Pulses', 'Clock Synchronization Pulses', 'Optical Photons'],
    devices: ['Physical NIC PHY', 'Fiber Transceivers (SFP+)', 'CAT6 Copper Cables', 'Repeaters & Hubs'],
    troubleshooting: 'ethtool eth0, link carrier state, cable testers'
  }
];

export const NETWORK_TOPOLOGY_NODES = [
  {
    id: 'client_pc',
    name: 'Client PC (Developer Host)',
    type: 'host',
    ip: '192.168.1.10',
    subnet: '192.168.1.0/24',
    mac: '00:1A:2B:3C:4D:5E',
    gateway: '192.168.1.1',
    dns: '8.8.8.8',
    color: '#38bdf8',
    iconName: 'Laptop',
    description: 'Local workstation initiating web requests, DNS lookups, and socket connections.'
  },
  {
    id: 'local_switch',
    name: 'Layer-2 Gigabit Switch',
    type: 'switch',
    ip: 'Unmanaged L2',
    mac: '00:26:44:11:22:33',
    color: '#818cf8',
    iconName: 'Network',
    description: 'Hardware switch operating at Layer 2. Learns MAC addresses and switches frames with sub-microsecond latency.'
  },
  {
    id: 'default_router',
    name: 'Default Gateway & NAT Firewall',
    type: 'router',
    lanIp: '192.168.1.1',
    wanIp: '203.0.113.45',
    mac: '00:50:56:C0:00:01',
    color: '#f59e0b',
    iconName: 'Router',
    description: 'Boundary router connecting local LAN to the internet. Performs Network Address Translation (NAT) and packet filtering.'
  },
  {
    id: 'isp_core',
    name: 'ISP Backbone & Tier-1 Transit',
    type: 'backbone',
    ip: '198.51.100.1',
    asn: 'AS15169',
    color: '#a855f7',
    iconName: 'Globe',
    description: 'Global optical internet backbone routing packets across continents via BGP (Border Gateway Protocol).'
  },
  {
    id: 'dns_server',
    name: 'Recursive DNS Resolver',
    type: 'server',
    ip: '8.8.8.8',
    mac: '00:00:0C:07:AC:01',
    port: 53,
    color: '#06b6d4',
    iconName: 'Database',
    description: 'Recursive DNS server resolving human-readable domain names (e.g. example.com) to target IP addresses.'
  },
  {
    id: 'web_server',
    name: 'Origin Web Server (Target)',
    type: 'server',
    ip: '93.184.216.34',
    domain: 'example.com',
    ports: [80, 443],
    mac: '00:1E:67:89:AB:CD',
    color: '#10b981',
    iconName: 'Server',
    description: 'Target production web server hosting Nginx/Node.js application, listening for TLS HTTPS requests.'
  }
];

export const NETWORK_SIMULATION_FLOWS = [
  {
    id: 'flow-web-request',
    title: 'Complete Web Request Lifecycle (DNS + TCP + TLS + HTTP)',
    command: 'curl -I https://example.com',
    summary: 'Watch an end-to-end web request travel from DNS lookup through TCP 3-way handshake, TLS 1.3 encryption, and HTTP GET.',
    badge: 'Full Web Stack',
    color: '#38bdf8',
    steps: [
      {
        stepNumber: 1,
        source: 'client_pc',
        target: 'local_switch',
        title: 'Step 1: DNS Query Generation & Switch Ingress',
        osiLayer: 'L7 Application -> L4 UDP -> L3 IP -> L2 Frame',
        description: 'Client PC checks local cache, finds no record for example.com, and constructs a UDP DNS query packet addressed to 8.8.8.8:53.',
        packetPayload: 'UDP SrcPort: 54120 -> DstPort: 53 | DNS Query: A? example.com',
        protocolBadge: 'DNS / UDP'
      },
      {
        stepNumber: 2,
        source: 'local_switch',
        target: 'default_router',
        title: 'Step 2: Switch Forwards Frame to Default Gateway',
        osiLayer: 'L2 Data Link (Ethernet MAC Forwarding)',
        description: 'Switch inspects destination MAC (00:50:56:C0:00:01) in its FDB table and forwards the frame out port 1 to the default gateway router.',
        packetPayload: 'Ethernet Frame: SrcMAC: 00:1A:2B... -> DstMAC: 00:50:56... (Gateway)',
        protocolBadge: 'L2 Ethernet'
      },
      {
        stepNumber: 3,
        source: 'default_router',
        target: 'dns_server',
        title: 'Step 3: Router NATs & Queries 8.8.8.8 DNS Server',
        osiLayer: 'L3 Network (SNAT & WAN Routing)',
        description: 'Router rewrites source IP from private 192.168.1.10 to public 203.0.113.45 via SNAT/MASQUERADE and routes packet across ISP backbone to Google DNS.',
        packetPayload: 'IPv4 Src: 203.0.113.45 -> Dst: 8.8.8.8 (TTL: 63)',
        protocolBadge: 'IPv4 Routing / NAT'
      },
      {
        stepNumber: 4,
        source: 'dns_server',
        target: 'client_pc',
        title: 'Step 4: DNS Server Returns IP: 93.184.216.34',
        osiLayer: 'L7 DNS Response',
        description: '8.8.8.8 resolves the domain A-record and sends UDP DNS Response: "example.com IN A 93.184.216.34 (TTL 300s)". Client caches the IP in memory.',
        packetPayload: 'DNS Response: example.com -> 93.184.216.34 (Cached in host resolver)',
        protocolBadge: 'DNS Answer'
      },
      {
        stepNumber: 5,
        source: 'client_pc',
        target: 'web_server',
        title: 'Step 5: TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK)',
        osiLayer: 'L4 Transport (TCP State Machine)',
        description: 'Client sends TCP SYN (Seq=0) to 93.184.216.34:443. Web server responds with TCP SYN-ACK (Seq=0, Ack=1). Client confirms with ACK. Socket is ESTABLISHED.',
        packetPayload: 'TCP Handshake: [SYN] -> [SYN, ACK] -> [ACK] (Window=65535, MSS=1460)',
        protocolBadge: 'TCP Handshake'
      },
      {
        stepNumber: 6,
        source: 'client_pc',
        target: 'web_server',
        title: 'Step 6: TLS 1.3 Cryptographic Handshake',
        osiLayer: 'L6 Presentation (TLS 1.3 Encryption)',
        description: 'Client and Server exchange ClientHello and ServerHello with Diffie-Hellman keys. Symmetric AES-GCM session keys are generated in under 1 RTT.',
        packetPayload: 'TLS 1.3: ClientHello -> ServerHello (X25519 Key Exchange) -> Cipher: AES_128_GCM',
        protocolBadge: 'TLS 1.3 Encrypted'
      },
      {
        stepNumber: 7,
        source: 'web_server',
        target: 'client_pc',
        title: 'Step 7: HTTP GET / & 200 OK Response Delivery',
        osiLayer: 'L7 Application (Encrypted HTTPS Data)',
        description: 'Client sends encrypted HTTP/2 GET request. Web server reads from disk/cache and streams back 200 OK with HTML content. Request completes!',
        packetPayload: 'HTTP/2 200 OK | Content-Type: text/html | Content-Length: 1256 bytes',
        protocolBadge: 'HTTP 200 OK'
      }
    ]
  },
  {
    id: 'flow-icmp-ping',
    title: 'ICMP Ping Echo Request & Reply',
    command: 'ping -c 1 8.8.8.8',
    summary: 'Trace how ICMP Echo Request is constructed, routed across hops with TTL decrement, and receives an Echo Reply.',
    badge: 'Network Diagnostics',
    color: '#10b981',
    steps: [
      {
        stepNumber: 1,
        source: 'client_pc',
        target: 'default_router',
        title: 'Step 1: Client Crafts ICMP Type 8 Echo Request',
        osiLayer: 'L3 Network (ICMP)',
        description: 'Client creates ICMP packet (Type 8, Code 0, Identifier=0x1a2b, Seq=1) with 32-byte payload. Sets IP header TTL=64.',
        packetPayload: 'ICMP Echo Request: Type=8, Code=0, Seq=1, TTL=64',
        protocolBadge: 'ICMP Request'
      },
      {
        stepNumber: 2,
        source: 'default_router',
        target: 'isp_core',
        title: 'Step 2: Router Decrements TTL to 63 & Forwards',
        osiLayer: 'L3 Network Routing',
        description: 'Router receives packet, decrements TTL from 64 to 63, recalculates IP header checksum, and forwards out WAN interface to ISP.',
        packetPayload: 'IPv4 Packet: TTL=63 (Checksum recomputed)',
        protocolBadge: 'TTL Decrement'
      },
      {
        stepNumber: 3,
        source: 'isp_core',
        target: 'dns_server',
        title: 'Step 3: Packet Reaches 8.8.8.8 & Kernel Answers',
        osiLayer: 'L3 Network',
        description: 'Target server 8.8.8.8 kernel receives ICMP Echo Request, swaps source and destination IPs, and generates ICMP Type 0 Echo Reply.',
        packetPayload: 'ICMP Echo Reply: Type=0, Code=0, Seq=1, TTL=118',
        protocolBadge: 'ICMP Reply'
      },
      {
        stepNumber: 4,
        source: 'dns_server',
        target: 'client_pc',
        title: 'Step 4: Client Receives Reply & Computes RTT (12.4ms)',
        osiLayer: 'L3 Network / Socket',
        description: 'Client workstation receives the reply packet, matches Sequence Number 1, and calculates Round-Trip Time: time=12.4 ms.',
        packetPayload: '64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=12.4 ms',
        protocolBadge: 'Ping Success'
      }
    ]
  },
  {
    id: 'flow-arp-discovery',
    title: 'ARP Address Resolution (IP to MAC Discovery)',
    command: 'arp -a (Who has 192.168.1.1? Tell 192.168.1.10)',
    summary: 'Trace Layer-2 Ethernet broadcast flooding to discover the physical MAC address of a target local IP.',
    badge: 'Layer-2 Resolution',
    color: '#f59e0b',
    steps: [
      {
        stepNumber: 1,
        source: 'client_pc',
        target: 'local_switch',
        title: 'Step 1: Client Broadcasts ARP Request to FF:FF:FF:FF:FF:FF',
        osiLayer: 'L2 Broadcast Frame',
        description: 'Client needs to send data to default gateway 192.168.1.1 but has no MAC in its ARP table. It sends a broadcast frame to all devices on the LAN.',
        packetPayload: 'ARP Request: Who has 192.168.1.1? Tell 192.168.1.10 (Target MAC: 00:00:00:00:00:00)',
        protocolBadge: 'ARP Broadcast'
      },
      {
        stepNumber: 2,
        source: 'local_switch',
        target: 'default_router',
        title: 'Step 2: Switch Floods Broadcast to All Switch Ports',
        osiLayer: 'L2 Ethernet Switching',
        description: 'Switch receives destination FF:FF:FF:FF:FF:FF and floods the frame out of every single active port on the VLAN.',
        packetPayload: 'Switch Port Flooding: Frame sent out ports 1, 2, 3, 4',
        protocolBadge: 'Switch Flood'
      },
      {
        stepNumber: 3,
        source: 'default_router',
        target: 'local_switch',
        title: 'Step 3: Target Router Replies with Unicast ARP Reply',
        osiLayer: 'L2 Unicast Frame',
        description: 'Router 192.168.1.1 recognizes its own IP and responds directly to client MAC: "192.168.1.1 is at 00:50:56:C0:00:01".',
        packetPayload: 'ARP Reply: 192.168.1.1 is at 00:50:56:C0:00:01 (Unicast to 00:1A:2B:3C:4D:5E)',
        protocolBadge: 'ARP Unicast'
      },
      {
        stepNumber: 4,
        source: 'local_switch',
        target: 'client_pc',
        title: 'Step 4: Client Caches Router MAC in Local ARP Table',
        osiLayer: 'Host ARP Cache',
        description: 'Client stores entry in kernel ARP table: ? (192.168.1.1) at 00:50:56:c0:00:01 [ether] on eth0. Future frames are sent directly!',
        packetPayload: 'ARP Table Updated: 192.168.1.1 -> 00:50:56:c0:00:01',
        protocolBadge: 'ARP Cached'
      }
    ]
  }
];

export const NETWORK_PROTOCOLS = [
  {
    id: 'tcp',
    name: 'TCP (Transmission Control Protocol)',
    layer: 'Layer 4 Transport',
    color: '#10b981',
    summary: 'Connection-oriented, reliable protocol with ordered byte streams, windowing, and congestion control.',
    features: [
      '3-Way Handshake connection establishment (SYN -> SYN-ACK -> ACK)',
      'Sequence and Acknowledgment numbers guarantee no packet loss',
      'Sliding Window algorithm for dynamic flow control',
      'Congestion Control algorithms (CUBIC, BBR) prevent bufferbloat'
    ],
    portExamples: 'HTTP (80), HTTPS (443), SSH (22), MySQL (3306), PostgreSQL (5432)',
    overhead: '20 bytes header minimum (up to 60 bytes with options)'
  },
  {
    id: 'udp',
    name: 'UDP (User Datagram Protocol)',
    layer: 'Layer 4 Transport',
    color: '#38bdf8',
    summary: 'Connectionless, lightweight protocol prioritizing low latency over reliability. Zero handshake overhead.',
    features: [
      'No handshake: immediate packet transmission (0-RTT)',
      'No retransmissions: ideal for audio/video streaming and gaming',
      'Tiny 8-byte fixed header footprint',
      'Supports IP Multicast and Broadcast'
    ],
    portExamples: 'DNS (53), DHCP (67/68), NTP (123), WireGuard VPN (51820), QUIC/HTTP3 (443)',
    overhead: 'Fixed 8 bytes header'
  },
  {
    id: 'dns',
    name: 'DNS (Domain Name System)',
    layer: 'Layer 7 Application',
    color: '#06b6d4',
    summary: 'The phonebook of the Internet: resolves human names (google.com) into numerical IP addresses (142.250.190.46).',
    features: [
      'Hierarchical tree: Root (.) -> TLD (.com) -> Authoritative (example.com)',
      'Record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (SPF/DKIM)',
      'Time-To-Live (TTL) caching for lightning-fast subsequent lookups',
      'Port 53 UDP for normal queries, TCP for large responses (>512B) and zone transfers'
    ],
    portExamples: 'UDP/TCP Port 53, DoH (DNS over HTTPS :443)',
    overhead: 'Lightweight binary payload'
  },
  {
    id: 'arp',
    name: 'ARP (Address Resolution Protocol)',
    layer: 'Layer 2 / Layer 3 Glue',
    color: '#f59e0b',
    summary: 'Maps known Layer-3 IP addresses to physical Layer-2 hardware MAC addresses on local Ethernet networks.',
    features: [
      'Broadcast requests (FF:FF:FF:FF:FF:FF) query all LAN nodes',
      'Unicast responses deliver the physical 48-bit MAC address',
      'Operating systems cache results in the kernel ARP table (`arp -a`)',
      'Essential link between software IP routing and physical Ethernet framing'
    ],
    portExamples: 'EtherType 0x0806 (runs directly over Ethernet, no IP header)',
    overhead: '28 bytes payload'
  },
  {
    id: 'dhcp',
    name: 'DHCP (Dynamic Host Configuration Protocol)',
    layer: 'Layer 7 Application (UDP)',
    color: '#ec4899',
    summary: 'Automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to client devices.',
    features: [
      'DORA Process: Discover -> Offer -> Request -> Acknowledge',
      'Eliminates manual IP configuration conflicts',
      'Dynamic lease expiration and renewal timers',
      'Provides Option 3 (Router), Option 6 (DNS Servers), Option 15 (Domain Name)'
    ],
    portExamples: 'UDP Port 67 (Server) / Port 68 (Client)',
    overhead: 'UDP broadcast envelope'
  },
  {
    id: 'icmp',
    name: 'ICMP (Internet Control Message Protocol)',
    layer: 'Layer 3 Network',
    color: '#a855f7',
    summary: 'Network diagnostic and error reporting protocol. Used by ping (echo) and traceroute (TTL expired).',
    features: [
      'Type 8 (Echo Request) & Type 0 (Echo Reply) power `ping` utility',
      'Type 11 (Time Exceeded) allows `traceroute` to map intermediate routers',
      'Type 3 (Destination Unreachable) reports closed ports or down links',
      'Type 3 Code 4 (Fragmentation Needed) enables Path MTU Discovery'
    ],
    portExamples: 'IP Protocol 1 (no transport port)',
    overhead: '8 bytes ICMP header + original IP header'
  }
];

export const NETWORK_CLI_COMMANDS = [
  {
    cmd: 'ping -c 4 8.8.8.8',
    category: 'Connectivity',
    desc: 'Test network reachability, packet loss, and round-trip time (RTT) to a remote host via ICMP echo packets.',
    sampleOutput: `PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=11.8 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=12.1 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=11.6 ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=118 time=12.0 ms

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 11.621/11.892/12.115/0.187 ms`
  },
  {
    cmd: 'traceroute 1.1.1.1',
    category: 'Routing',
    desc: 'Trace the exact hop-by-hop router path packets travel across the internet using incrementing TTL packets.',
    sampleOutput: `traceroute to 1.1.1.1 (1.1.1.1), 30 hops max, 60 byte packets
 1  _gateway (192.168.1.1)  1.214 ms  1.180 ms  1.155 ms
 2  10.128.0.1 (10.128.0.1)  4.321 ms  4.290 ms  4.260 ms
 3  172.30.4.1 (172.30.4.1)  8.120 ms  8.090 ms  8.060 ms
 4  one.one.one.one (1.1.1.1)  12.450 ms  12.410 ms  12.380 ms`
  },
  {
    cmd: 'dig +short example.com',
    category: 'DNS',
    desc: 'Query DNS name servers directly to resolve domain names to IP addresses with raw DNS record details.',
    sampleOutput: `93.184.216.34`
  },
  {
    cmd: 'arp -a',
    category: 'Layer-2',
    desc: 'Display the operating system kernel ARP cache table mapping local IP addresses to physical MAC addresses.',
    sampleOutput: `? (192.168.1.1) at 00:50:56:c0:00:01 [ether] on eth0
? (192.168.1.254) at 00:1e:67:89:ab:cd [ether] on eth0`
  },
  {
    cmd: 'netstat -tuln',
    category: 'Sockets',
    desc: 'List all active listening TCP and UDP sockets and port numbers on the local system.',
    sampleOutput: `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN     
udp        0      0 0.0.0.0:68              0.0.0.0:*                          `
  },
  {
    cmd: 'curl -I https://example.com',
    category: 'Application (HTTP)',
    desc: 'Fetch HTTP/HTTPS response headers from a web server without downloading the body.',
    sampleOutput: `HTTP/2 200 
content-type: text/html; charset=UTF-8
server: ECS (dcb/7F3B)
date: Sun, 18 Oct 2026 01:25:00 GMT
cache-control: max-age=604800
content-length: 1256`
  }
];

export const SUBNET_PRESETS = [
  { cidr: '/24', mask: '255.255.255.0', totalIps: 256, usableIps: 254, useCase: 'Standard office or home LAN subnet' },
  { cidr: '/16', mask: '255.255.0.0', totalIps: 65536, usableIps: 65534, useCase: 'Docker default bridge (172.17.0.0/16) & enterprise cloud VPCs' },
  { cidr: '/28', mask: '255.255.255.240', totalIps: 16, usableIps: 14, useCase: 'Small microservice cluster or database subnet' },
  { cidr: '/30', mask: '255.255.255.252', totalIps: 4, usableIps: 2, useCase: 'Point-to-point router-to-router link (P2P)' },
  { cidr: '/32', mask: '255.255.255.255', totalIps: 1, usableIps: 1, useCase: 'Single host route / loopback IP address' }
];
