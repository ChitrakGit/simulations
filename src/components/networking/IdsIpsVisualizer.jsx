import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Eye,
  Lock,
  Zap,
  Server,
  Terminal,
  Activity,
  RefreshCw,
  Radio,
  CheckCircle2,
  XCircle,
  FileText,
  Filter,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Ban,
  Cpu,
  Network,
  Sliders,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';

// ─── Attack Scenarios for Interactive Lab ─────────────────────────────────────
const ATTACK_SCENARIOS = [
  {
    id: 'syn-flood',
    title: 'TCP SYN Flood (DoS Attack)',
    category: 'Layer 4 DoS',
    severity: 'CRITICAL',
    severityColor: '#ef4444',
    attacker: { ip: '198.51.100.77 (Spoofed)', port: '44122', tool: 'hping3 --flood -S -p 80' },
    target: { ip: '10.0.1.50 (Web Cluster)', port: '80 (HTTP)' },
    signature: 'alert tcp any any -> $HTTP_SERVERS 80 (flags:S; threshold:type both, track by_dst, count 50, seconds 1; msg:"DOS TCP SYN Flood Attempt"; sid:1000001;)',
    payloadPreview: 'TCP Header: Flags [SYN=1, ACK=0], Win=1024, Seq=94827104. Zero payload, forged source IPs.',
    description: 'The attacker floods the web server with thousands of spoofed TCP SYN packets per second without ever sending the completing ACK. The server allocates memory in its SYN backlog queue for each half-open connection until memory is exhausted and legitimate users are locked out.',
    idsOutcome: {
      action: 'ALERT LOGGED (PASSIVE)',
      status: 'Server Crashes ❌',
      serverHealth: 15,
      trafficImpact: 'Attacking packets reach the server completely unhindered. SYN queue fills in 3.2 seconds. Web server stops answering legitimate user requests.',
      siemAlert: '[ALERT] [1:1000001:1] DOS TCP SYN Flood Attempt [Priority: 1] 198.51.100.77:44122 -> 10.0.1.50:80 | Rate: 14,200 pkts/sec'
    },
    ipsOutcome: {
      action: 'INLINE DROP + SYN COOKIES (ACTIVE)',
      status: 'Server Protected ✅',
      serverHealth: 98,
      trafficImpact: 'Inline IPS inspects wire traffic, detects threshold breach at packet #50, and instantly drops all subsequent flood packets. It activates kernel SYN Cookies, keeping server queue clean.',
      siemAlert: '[BLOCKED] [1:1000001:1] DOS TCP SYN Flood Attempt - INLINE DROP TRIGGERED. 14,150 packets discarded. Server queue load: 3%.'
    }
  },
  {
    id: 'port-scan',
    title: 'Reconnaissance: Nmap Xmas Tree Scan',
    category: 'Reconnaissance',
    severity: 'HIGH',
    severityColor: '#f97316',
    attacker: { ip: '203.0.113.88', port: '51234', tool: 'nmap -sX -T4 10.0.1.50' },
    target: { ip: '10.0.1.50', port: 'Ports 1-1024' },
    signature: 'alert tcp any any -> $HOME_NET any (flags:FPU; msg:"SCAN Nmap Xmas Tree Probe Detected"; classtype:attempted-recon; sid:1000002;)',
    payloadPreview: 'TCP Header: Flags [FIN=1, PSH=1, URG=1]. Illegal flag combination designed to bypass naive stateless packet filters.',
    description: 'An attacker sends non-standard TCP packets with FIN, PSH, and URG flags all lit up like a Christmas tree. RFC 793 dictates that closed ports reply with RST, while open ports drop the packet silently, allowing stealth port mapping.',
    idsOutcome: {
      action: 'ALERT GENERATED (PASSIVE)',
      status: 'Reconnaissance Succeeded ⚠️',
      serverHealth: 90,
      trafficImpact: 'IDS logs an alert for the SOC team. However, the probe packets reach the target hosts. The attacker successfully maps out all open ports (22, 80, 443, 3306).',
      siemAlert: '[ALERT] [1:1000002:1] SCAN Nmap Xmas Tree Probe Detected [Priority: 2] from 203.0.113.88. Target mapped 14 open services.'
    },
    ipsOutcome: {
      action: 'DROP PACKET + DYNAMIC IP QUARANTINE (ACTIVE)',
      status: 'Reconnaissance Blinded ✅',
      serverHealth: 100,
      trafficImpact: 'IPS drops the illicit FIN+PSH+URG packets at the perimeter. It dynamically injects an iptables/nftables drop rule for 203.0.113.88 for 60 minutes. Nmap receives 100% filter timeout.',
      siemAlert: '[BLOCKED] [1:1000002:1] SCAN Nmap Xmas Tree Probe - INLINE DROP. Attacker IP 203.0.113.88 placed in 60-min jail.'
    }
  },
  {
    id: 'sqli',
    title: 'Web Exploitation: SQL Injection (SQLi)',
    category: 'Application (L7)',
    severity: 'CRITICAL',
    severityColor: '#ef4444',
    attacker: { ip: '198.51.100.42', port: '38192', tool: 'sqlmap -u "http://target/api/user"' },
    target: { ip: '10.0.1.50 (API Gateway)', port: '443 (HTTPS / HTTP)' },
    signature: 'alert tcp any any -> $HTTP_SERVERS $HTTP_PORTS (content:"UNION SELECT"; nocase; pcre:"/UNION\\s+SELECT\\s+.*FROM/i"; msg:"EXPLOIT SQL Injection Union Attempt"; sid:1000003;)',
    payloadPreview: 'GET /api/user?id=1%20UNION%20SELECT%20username,password_hash%20FROM%20users-- HTTP/1.1\\r\\nHost: api.target.com',
    description: 'The adversary crafts malicious SQL statements into an HTTP request query parameter to manipulate the backend database parser, bypass authentication, and extract sensitive database records.',
    idsOutcome: {
      action: 'ALERT LOGGED (PASSIVE)',
      status: 'Data Breach Occurred ❌',
      serverHealth: 60,
      trafficImpact: 'IDS inspects the HTTP stream and triggers a critical SIEM alert. But since IDS cannot stop the stream, the SQL command executes on MySQL/PostgreSQL. 40,000 user credentials exfiltrated.',
      siemAlert: '[ALERT] [1:1000003:1] EXPLOIT SQL Injection Union Attempt [Priority: 1] from 198.51.100.42. Backend DB returned 40,000 rows.'
    },
    ipsOutcome: {
      action: 'TCP RST INJECTION + HTTP 403 (ACTIVE)',
      status: 'Exploit Blocked ✅',
      serverHealth: 100,
      trafficImpact: 'Inline Deep Packet Inspection (DPI) detects the regex signature inside the TCP stream before forwarding it to the web server. IPS injects a TCP RST to kill the session and returns HTTP 403 Forbidden.',
      siemAlert: '[BLOCKED] [1:1000003:1] EXPLOIT SQL Injection Union - SESSION TERMINATED via TCP RST. Web server unaffected.'
    }
  },
  {
    id: 'dns-tunnel',
    title: 'Data Exfiltration: DNS Tunneling',
    category: 'Covert Channel',
    severity: 'HIGH',
    severityColor: '#f97316',
    attacker: { ip: '10.0.1.105 (Compromised Host)', port: '59124', tool: 'iodine / dnscat2 client' },
    target: { ip: '8.8.8.8 -> 198.51.100.99 (Rogue Nameserver)', port: '53 (UDP)' },
    signature: 'alert udp $HOME_NET any -> any 53 (byte_test:1,>,60,12; content:"|00 01|"; msg:"COVERT DNS Tunneling High Length Query"; sid:1000004;)',
    payloadPreview: 'DNS Query: MFRGGZDFMY2TINBUGUYDCMZ...exfil.attacker-c2.net [Type TXT, Class IN]. High entropy Base64 chunks.',
    description: 'A compromised internal machine encodes stolen sensitive corporate documents into chunked subdomains of DNS queries. Since outbound UDP 53 is almost universally permitted through firewalls, data slips through undetected by traditional ACLs.',
    idsOutcome: {
      action: 'ENTROPY ALERT (PASSIVE)',
      status: 'Data Exfiltrated ⚠️',
      serverHealth: 85,
      trafficImpact: 'IDS calculates high Shannon entropy in DNS query labels and flags suspicious tunneling. However, 8.4 MB of customer payment records have already left the network.',
      siemAlert: '[ALERT] [1:1000004:1] COVERT DNS Tunneling High Length Query [Priority: 2] Host 10.0.1.105 sent 1,240 covert TXT queries.'
    },
    ipsOutcome: {
      action: 'UDP SINKHOLE + PACKET DROP (ACTIVE)',
      status: 'Exfiltration Neutralized ✅',
      serverHealth: 100,
      trafficImpact: 'IPS inspects DNS packet size and entropy thresholds. Queries exceeding label length thresholds are dropped immediately. Rogue domain "attacker-c2.net" is sinkholed to 127.0.0.1.',
      siemAlert: '[BLOCKED] [1:1000004:1] COVERT DNS Tunneling - UDP PACKETS DROPPED. Domain attacker-c2.net sinkholed. 0 bytes leaked.'
    }
  },
  {
    id: 'c2-beacon',
    title: 'Malware: C2 Beaconing (Command & Control)',
    category: 'Malware / APT',
    severity: 'CRITICAL',
    severityColor: '#ef4444',
    attacker: { ip: '198.51.100.200 (Adversary C2 Server)', port: '8443', tool: 'Cobalt Strike Malleable C2' },
    target: { ip: '10.0.1.112 (Workstation)', port: '49200 (TCP)' },
    signature: 'alert tcp $HOME_NET any -> $EXTERNAL_NET 8443 (content:"/submit.php?id="; nocase; flow:established,to_server; msg:"MALWARE Cobalt Strike Beacon Activity"; sid:1000005;)',
    payloadPreview: 'POST /submit.php?id=849201 HTTP/1.1\\r\\nHost: cloud-cdn-sync.com\\r\\nUser-Agent: Mozilla/5.0... Encrypted beacon heartbeat.',
    description: 'Ransomware or advanced persistent threat (APT) agent on an internal workstation periodically contacts an external adversary controller every 30 seconds to receive commands and upload system credentials.',
    idsOutcome: {
      action: 'ANOMALY ALERT (PASSIVE)',
      status: 'Adversary Controls Host ❌',
      serverHealth: 50,
      trafficImpact: 'IDS logs the recurring beacon pattern after 45 minutes of analysis. Meanwhile, the attacker has executed PowerShell scripts and initiated lateral movement to the domain controller.',
      siemAlert: '[ALERT] [1:1000005:1] MALWARE Cobalt Strike Beacon Activity [Priority: 1] Host 10.0.1.112 beaconing to 198.51.100.200.'
    },
    ipsOutcome: {
      action: 'CONNECTION RESET + VLAN ISOLATION (ACTIVE)',
      status: 'Infection Quarantined ✅',
      serverHealth: 100,
      trafficImpact: 'IPS matches the malleable C2 URI signature on the very first beacon. It sends a TCP RST in both directions, severing the connection, and triggers an API call to isolate the host\'s switch port.',
      siemAlert: '[BLOCKED] [1:1000005:1] MALWARE Cobalt Strike Beacon - TCP RST SENT. Host 10.0.1.112 isolated into Quarantine VLAN 99.'
    }
  }
];

// ─── Snort / Suricata Rule Syntax Breakdown ──────────────────────────────────
const RULE_COMPONENTS = [
  { part: 'Action', code: 'alert / drop / reject / pass / log', desc: 'What the engine does when the packet matches: alert (IDS), drop/reject (IPS), pass (whitelist).' },
  { part: 'Protocol', code: 'tcp / udp / icmp / ip / http / dns', desc: 'Layer 3/4 or application protocol to decode and evaluate.' },
  { part: 'Source IP & Port', code: 'any any / $HOME_NET 80 / !192.168.1.0/24', desc: 'Origin of packet. Supports CIDR blocks, port ranges, negation (!), and environment variables.' },
  { part: 'Direction', code: '-> (unidirectional) / <> (bidirectional)', desc: 'Direction of traffic flow from source to destination.' },
  { part: 'Dest IP & Port', code: '$EXTERNAL_NET any / $HTTP_SERVERS 443', desc: 'Destination host and listening port range to inspect.' },
  { part: 'Rule Options', code: '(msg:"..."; content:"..."; sid:100001;)', desc: 'Deep packet inspection logic: keywords, hex patterns, PCRE regex, flow state, metadata, SID.' }
];

// ─── Sample Rules for Interactive Tester ──────────────────────────────────────
const SAMPLE_RULES = [
  {
    sid: 100001,
    name: 'Detect TCP SYN Flood',
    action: 'drop',
    rule: 'drop tcp any any -> $HTTP_SERVERS 80 (flags:S; threshold:type both, track by_dst, count 50, seconds 1; msg:"DOS TCP SYN Flood In-Line Block"; sid:100001; rev:1;)',
    targetType: 'Layer 4 Transport',
    behavior: 'Drops incoming TCP packets with SYN flag when rate exceeds 50 packets/sec to target web server.'
  },
  {
    sid: 100002,
    name: 'Block SQL Injection in HTTP GET/POST',
    action: 'drop',
    rule: 'drop tcp any any -> $HTTP_SERVERS $HTTP_PORTS (content:"UNION SELECT"; nocase; msg:"EXPLOIT SQLi UNION query attempt"; sid:100002; rev:2;)',
    targetType: 'Layer 7 Application',
    behavior: 'Inspects HTTP payload for case-insensitive string "UNION SELECT" and immediately drops packet.'
  },
  {
    sid: 100003,
    name: 'Detect Nmap Stealth Xmas Scan',
    action: 'alert',
    rule: 'alert tcp any any -> $HOME_NET any (flags:FPU; msg:"SCAN Nmap Xmas scan flag anomaly"; classtype:attempted-recon; sid:100003; rev:1;)',
    targetType: 'Layer 4 Protocol Anomaly',
    behavior: 'Triggers high-priority security alert when a packet arrives with illegal FIN, PSH, and URG flags set simultaneously.'
  },
  {
    sid: 100004,
    name: 'Block DNS Amplification & Exfiltration',
    action: 'reject',
    rule: 'reject udp $HOME_NET any -> any 53 (byte_test:1,>,60,12; msg:"COVERT DNS Tunneling Length Breach"; sid:100004; rev:1;)',
    targetType: 'Layer 7 Protocol',
    behavior: 'Inspects UDP length byte at offset 12 in DNS queries. If query name length exceeds 60 bytes, sends ICMP Port Unreachable.'
  }
];

export default function IdsIpsVisualizer() {
  const [activeTab, setActiveTab] = useState('lab'); // 'lab' | 'ids-arch' | 'ips-arch' | 'rules' | 'matrix'
  
  // Interactive Lab State
  const [activeScenarioId, setActiveScenarioId] = useState('syn-flood');
  const [activeMode, setActiveMode] = useState('ips'); // 'ids' | 'ips'
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: Idle, 1: Attacking, 2: Inspected, 3: Outcome
  const [packetPosition, setPacketPosition] = useState(0); // 0 to 100%
  const [customRuleText, setCustomRuleText] = useState(SAMPLE_RULES[0].rule);
  const [selectedRuleSid, setSelectedRuleSid] = useState(100001);

  const activeScenario = ATTACK_SCENARIOS.find(s => s.id === activeScenarioId) || ATTACK_SCENARIOS[0];
  const simTimerRef = useRef(null);

  // Trigger attack animation
  const handleTriggerAttack = () => {
    setIsSimulating(true);
    setSimulationStep(1);
    setPacketPosition(15);

    // Step 2: Packet reaches Security Gateway
    setTimeout(() => {
      setSimulationStep(2);
      setPacketPosition(50);
    }, 900);

    // Step 3: Security Decision (IDS alert or IPS drop/forward)
    setTimeout(() => {
      setSimulationStep(3);
      if (activeMode === 'ids') {
        setPacketPosition(85); // Reaches server
      } else {
        setPacketPosition(50); // Blocked at gateway
      }
      setIsSimulating(false);
    }, 1900);
  };

  const handleResetSim = () => {
    setIsSimulating(false);
    setSimulationStep(0);
    setPacketPosition(0);
  };

  const currentOutcome = activeMode === 'ids' ? activeScenario.idsOutcome : activeScenario.ipsOutcome;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* ─── Top Banner ─────────────────────────────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '22px 24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(245, 158, 11, 0.08) 50%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
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
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(239, 68, 68, 0.45)',
              flexShrink: 0
            }}>
              <ShieldAlert size={26} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{
                  fontSize: '1.38rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '-0.01em'
                }}>
                  IDS & IPS Threat Defense Center
                </h1>
                <span className="badge" style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.45)',
                  fontSize: '0.68rem',
                  fontWeight: '700'
                }}>
                  Intrusion Detection vs Prevention
                </span>
                <span className="badge" style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.45)',
                  fontSize: '0.68rem',
                  fontWeight: '700'
                }}>
                  Snort / Suricata Rules Engine
                </span>
                <span className="badge" style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.45)',
                  fontSize: '0.68rem',
                  fontWeight: '700'
                }}>
                  Inline vs Out-of-Band
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Master Network Security: Explore passive out-of-band monitoring (IDS) vs active inline blocking (IPS), simulate real-world cyber attacks, and write deep packet inspection rules.
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
            { id: 'lab', label: 'Interactive Attack & Defense Lab', color: '#ef4444', icon: Activity, badge: 'Live Simulator' },
            { id: 'ids-arch', label: 'IDS Architecture & Mechanics', color: '#3b82f6', icon: Eye, badge: 'Passive / SPAN' },
            { id: 'ips-arch', label: 'IPS Architecture & Mechanics', color: '#10b981', icon: ShieldCheck, badge: 'Active / Inline' },
            { id: 'rules', label: 'Snort / Suricata Rules Lab', color: '#f59e0b', icon: Terminal, badge: 'Rule Syntax' },
            { id: 'matrix', label: 'IDS vs IPS Feature Matrix', color: '#a855f7', icon: RefreshCw, badge: 'Comparison' }
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
          VIEW 1: INTERACTIVE ATTACK & DEFENSE LAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'lab' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Attack Scenario Switcher */}
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
                Select Cyber Attack Scenario:
              </span>
              
              {/* IDS vs IPS Mode Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: '600' }}>Active Defense:</span>
                <button
                  onClick={() => { setActiveMode('ids'); handleResetSim(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: activeMode === 'ids' ? '800' : '500',
                    background: activeMode === 'ids' ? 'linear-gradient(135deg, #2563eb, #3b82f6)' : 'rgba(0, 0, 0, 0.4)',
                    color: activeMode === 'ids' ? '#ffffff' : 'var(--text-muted)',
                    border: activeMode === 'ids' ? '1px solid #60a5fa' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: activeMode === 'ids' ? '0 0 14px rgba(59, 130, 246, 0.4)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={13} />
                  <span>Passive IDS (Alert Only)</span>
                </button>

                <button
                  onClick={() => { setActiveMode('ips'); handleResetSim(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: activeMode === 'ips' ? '800' : '500',
                    background: activeMode === 'ips' ? 'linear-gradient(135deg, #dc2626, #ef4444)' : 'rgba(0, 0, 0, 0.4)',
                    color: activeMode === 'ips' ? '#ffffff' : 'var(--text-muted)',
                    border: activeMode === 'ips' ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: activeMode === 'ips' ? '0 0 14px rgba(239, 68, 68, 0.4)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <ShieldCheck size={13} />
                  <span>Active IPS (Inline Drop)</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
              {ATTACK_SCENARIOS.map(sc => {
                const isSelected = sc.id === activeScenarioId;
                return (
                  <button
                    key={sc.id}
                    onClick={() => { setActiveScenarioId(sc.id); handleResetSim(); }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 0, 0, 0.35)',
                      border: isSelected ? `2px solid ${sc.severityColor}` : '1px solid rgba(255, 255, 255, 0.06)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: sc.severityColor, fontWeight: '700' }}>
                        {sc.category}
                      </span>
                      <span style={{
                        fontSize: '0.6rem',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        background: `${sc.severityColor}20`,
                        color: sc.severityColor,
                        fontWeight: '800'
                      }}>
                        {sc.severity}
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

          {/* ─── Attack Simulation Canvas ───────────────────────────────────── */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)',
            border: activeMode === 'ips' ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(59, 130, 246, 0.35)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Simulation Header with Launch Action */}
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
                  <AlertTriangle size={18} color={activeScenario.severityColor} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                    {activeScenario.title}
                  </h3>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Target: {activeScenario.target.ip}:{activeScenario.target.port} · Source: {activeScenario.attacker.ip}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleTriggerAttack}
                  disabled={isSimulating}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: isSimulating
                      ? 'rgba(100, 116, 139, 0.3)'
                      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: isSimulating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    boxShadow: '0 0 16px rgba(239, 68, 68, 0.45)'
                  }}
                >
                  <Zap size={14} />
                  <span>{isSimulating ? 'Transmitting Attack...' : 'Launch Attack'}</span>
                </button>

                <button
                  onClick={handleResetSim}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#94a3b8',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer'
                  }}
                  title="Reset Simulator"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Network Topology Visualizer Canvas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr 1.4fr 0.8fr 1.2fr',
              alignItems: 'center',
              margin: '24px 0',
              padding: '20px 16px',
              borderRadius: '12px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflowX: 'auto'
            }}>
              {/* NODE 1: Attacker / Adversary */}
              <div style={{
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(220, 38, 38, 0.15)',
                border: '2px solid #ef4444',
                boxShadow: simulationStep >= 1 ? '0 0 18px rgba(239, 68, 68, 0.4)' : 'none',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Terminal size={18} color="#ef4444" />
                  <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#ffffff' }}>Attacker Host</span>
                </div>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#fca5a5' }}>
                  {activeScenario.attacker.ip}
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Tool: {activeScenario.attacker.tool}
                </div>
                <div style={{
                  marginTop: '8px',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  background: 'rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  fontSize: '0.65rem',
                  fontWeight: '700'
                }}>
                  {simulationStep >= 1 ? 'TRANSMITTING EXPLOIT' : 'STANDBY'}
                </div>
              </div>

              {/* Wire 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  height: '4px',
                  width: '100%',
                  background: simulationStep >= 1
                    ? 'linear-gradient(90deg, #ef4444, #f59e0b)'
                    : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: simulationStep >= 1 ? '0 0 10px #ef4444' : 'none'
                }} />
                <span style={{ fontSize: '0.62rem', color: simulationStep >= 1 ? '#f87171' : '#475569', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                  WAN Ingress
                </span>
              </div>

              {/* NODE 2: Security Engine (IDS or IPS) */}
              <div style={{
                padding: '16px',
                borderRadius: '10px',
                background: activeMode === 'ips' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                border: activeMode === 'ips' ? '2px solid #ef4444' : '2px solid #3b82f6',
                boxShadow: simulationStep >= 2 ? (activeMode === 'ips' ? '0 0 20px rgba(239, 68, 68, 0.45)' : '0 0 20px rgba(59, 130, 246, 0.45)') : 'none',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
                  {activeMode === 'ips' ? <ShieldCheck size={18} color="#ef4444" /> : <Eye size={18} color="#3b82f6" />}
                  <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#ffffff' }}>
                    {activeMode === 'ips' ? 'Inline IPS Engine' : 'Passive IDS Tap'}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: activeMode === 'ips' ? '#fca5a5' : '#93c5fd' }}>
                  {activeMode === 'ips' ? 'Bump-in-the-Wire Bridge' : 'SPAN / Mirror Port'}
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Suricata / Snort 3 DPI
                </div>
                <div style={{
                  marginTop: '8px',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  background: simulationStep >= 2
                    ? (activeMode === 'ips' ? '#ef4444' : '#2563eb')
                    : 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: '800'
                }}>
                  {simulationStep === 0 && 'READY'}
                  {simulationStep === 1 && 'INSPECTING INGRESS...'}
                  {simulationStep >= 2 && (activeMode === 'ips' ? 'ACTION: DROP 🛑' : 'ACTION: ALERT 📝')}
                </div>
              </div>

              {/* Wire 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  height: '4px',
                  width: '100%',
                  background: simulationStep === 3 && activeMode === 'ids'
                    ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                    : simulationStep >= 2 && activeMode === 'ips'
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: simulationStep === 3 && activeMode === 'ids' ? '0 0 10px #ef4444' : 'none'
                }} />
                <span style={{
                  fontSize: '0.62rem',
                  color: simulationStep === 3 && activeMode === 'ids'
                    ? '#ef4444'
                    : simulationStep >= 2 && activeMode === 'ips'
                      ? '#64748b'
                      : '#475569',
                  marginTop: '4px',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {activeMode === 'ips' && simulationStep >= 2 ? 'TRAFFIC BLOCKED' : 'LAN Delivery'}
                </span>
              </div>

              {/* NODE 3: Target Server & Database */}
              <div style={{
                padding: '16px',
                borderRadius: '10px',
                background: simulationStep === 3 && activeMode === 'ids'
                  ? 'rgba(220, 38, 38, 0.25)'
                  : 'rgba(16, 185, 129, 0.15)',
                border: simulationStep === 3 && activeMode === 'ids'
                  ? '2px solid #ef4444'
                  : '2px solid #10b981',
                boxShadow: simulationStep === 3 && activeMode === 'ids' ? '0 0 20px rgba(239, 68, 68, 0.5)' : 'none',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Server size={18} color={simulationStep === 3 && activeMode === 'ids' ? '#ef4444' : '#10b981'} />
                  <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#ffffff' }}>Target Web Server</span>
                </div>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                  {activeScenario.target.ip}
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Port: {activeScenario.target.port}
                </div>
                <div style={{
                  marginTop: '8px',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  background: simulationStep === 3 && activeMode === 'ids' ? '#ef4444' : 'rgba(16, 185, 129, 0.25)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: '800'
                }}>
                  {simulationStep === 3 ? currentOutcome.status : 'HEALTH: 100%'}
                </div>
              </div>
            </div>

            {/* Real-Time Outcome & Diagnostic Breakdown */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.8fr',
              gap: '16px',
              marginTop: '16px'
            }}>
              {/* Left: Server Health & Status Box */}
              <div style={{
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Server Health Score:
                  </span>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: '900',
                    fontFamily: 'var(--font-mono)',
                    color: (simulationStep === 3 ? currentOutcome.serverHealth : 100) > 70 ? '#34d399' : '#ef4444'
                  }}>
                    {simulationStep === 3 ? currentOutcome.serverHealth : 100}%
                  </span>
                </div>

                {/* Health Bar */}
                <div style={{
                  height: '8px',
                  width: '100%',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${simulationStep === 3 ? currentOutcome.serverHealth : 100}%`,
                    background: (simulationStep === 3 ? currentOutcome.serverHealth : 100) > 70
                      ? 'linear-gradient(90deg, #10b981, #34d399)'
                      : 'linear-gradient(90deg, #ef4444, #dc2626)',
                    transition: 'all 0.5s ease'
                  }} />
                </div>

                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {simulationStep === 3 ? currentOutcome.trafficImpact : 'Click "Launch Attack" above to simulate the packet transmission.'}
                </div>
              </div>

              {/* Right: Security Gateway Action & SIEM Log */}
              <div style={{
                padding: '16px',
                borderRadius: '10px',
                background: '#090d16',
                border: '1px solid #1e293b',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      SOC / SIEM Live Event Log:
                    </span>
                    <span className="badge" style={{
                      background: activeMode === 'ips' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: activeMode === 'ips' ? '#f87171' : '#60a5fa',
                      fontSize: '0.62rem'
                    }}>
                      {activeMode.toUpperCase()} Engine Active
                    </span>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: simulationStep >= 2
                      ? (activeMode === 'ips' ? '#34d399' : '#fbbf24')
                      : '#64748b',
                    lineHeight: '1.5'
                  }}>
                    {simulationStep >= 2
                      ? currentOutcome.siemAlert
                      : 'Listening on interface eth0... System operational. 0 alerts in last 60 seconds.'}
                  </div>
                </div>

                {/* Packet payload preview */}
                <div style={{
                  marginTop: '12px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#94a3b8',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{ color: '#ef4444' }}>RAW WIRE PAYLOAD: </span>
                  {activeScenario.payloadPreview}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 2: IDS ARCHITECTURE & MECHANICS DEEP DIVE
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ids-arch' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <Eye size={24} color="#3b82f6" />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  Intrusion Detection System (IDS) — Passive Out-of-Band Architecture
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#93c5fd' }}>
                  Zero-Latency Visibility · Forensic Capture · Anomaly & Signature Correlation
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: '1.65', marginBottom: '20px' }}>
              An Intrusion Detection System operates as a <strong style={{ color: '#60a5fa' }}>passive listener</strong> connected to network switches via SPAN (Switch Port Analyzer) mirror ports or optical Test Access Points (TAPs). Because it sits completely out of the critical packet forwarding path, it introduces <strong style={{ color: '#34d399' }}>0.0 milliseconds of network latency</strong> and can never bring down customer traffic if it crashes.
            </p>

            {/* 4 Core IDS Detection Engines */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {[
                {
                  title: '1. Signature-Based Detection',
                  color: '#3b82f6',
                  icon: FileText,
                  desc: 'Matches packet payloads, headers, and port numbers against a database of known exploit signatures (e.g. Snort SID rules, CVE regex patterns). Fast and deterministic with virtually zero false positives for known exploits.'
                },
                {
                  title: '2. Anomaly / Heuristic Detection',
                  color: '#10b981',
                  icon: Activity,
                  desc: 'Establishes a baseline of normal network behavior (bandwidth, packet rates, typical protocol distribution). Alerts when traffic deviates statistically (e.g. sudden surge in outbound UDP or abnormal off-hours SSH activity).'
                },
                {
                  title: '3. Protocol State Analysis',
                  color: '#f59e0b',
                  icon: Cpu,
                  desc: 'Verifies strict RFC protocol compliance. Detects invalid TCP state transitions (such as data sent before handshake), illegal flag permutations, overlapping IP fragments (Teardrop attacks), or malformed HTTP headers.'
                },
                {
                  title: '4. Network vs Host IDS (NIDS vs HIDS)',
                  color: '#a855f7',
                  icon: Server,
                  desc: 'NIDS (Zeek, Snort) inspects traffic at the subnet/VLAN level across all machines. HIDS (Wazuh, OSSEC) runs locally on servers, monitoring system calls, kernel logs, file integrity (FIM), and auth logs directly.'
                }
              ].map((engine, i) => {
                const Icon = engine.icon;
                return (
                  <div key={i} style={{
                    padding: '16px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: `1px solid ${engine.color}30`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Icon size={16} color={engine.color} />
                      <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#ffffff' }}>{engine.title}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {engine.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* How SPAN / TAP Works Diagram */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: '#090d16',
              border: '1px solid #1e293b'
            }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '700' }}>
                Physical Deployment: SPAN Port Mirroring vs Optical TAP
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <div style={{ fontWeight: '800', color: '#60a5fa', marginBottom: '6px' }}>Switch SPAN Port (Port Mirroring)</div>
                  <div>Switch copies incoming and outgoing packets from production ports to a dedicated monitor port connected to the IDS. If switch CPU gets overloaded, SPAN packets are dropped first to prioritize production forwarding.</div>
                </div>
                <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontWeight: '800', color: '#34d399', marginBottom: '6px' }}>Passive Optical TAP (Test Access Point)</div>
                  <div>A physical hardware splitter inserted into the fiber link. It splits light 70/30 (70% continues to production, 30% splits to IDS). 100% full-duplex packet capture with zero switch CPU load.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 3: IPS ARCHITECTURE & MECHANICS DEEP DIVE
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ips-arch' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <ShieldCheck size={24} color="#ef4444" />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  Intrusion Prevention System (IPS) — Active In-Line Architecture
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#fca5a5' }}>
                  Real-Time Deep Packet Inspection · TCP RST Tear-Down · Automatic Threat Neutralization
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: '1.65', marginBottom: '20px' }}>
              Unlike passive IDS, an Intrusion Prevention System is placed directly <strong style={{ color: '#ef4444' }}>in-line</strong> ("bump-in-the-wire") between network segments. Every single packet must pass through the IPS inspection engine before being forwarded. If an attack signature or anomaly is detected, the packet is instantly discarded before it ever reaches the target host.
            </p>

            {/* 4 Active Defense Techniques */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {[
                {
                  title: '1. Inline Packet Drop',
                  color: '#ef4444',
                  icon: Ban,
                  desc: 'Silently discards matching malicious packets at the wire. The sender receives no acknowledgment, and the target server never sees the packet. Prevents single-packet exploits from executing.'
                },
                {
                  title: '2. TCP RST Session Reset',
                  color: '#f97316',
                  icon: RotateCcw,
                  desc: 'Forges a TCP RST packet and injects it to both the attacker and the server. This immediately tears down the stateful socket connection on both ends, freeing up server buffers.'
                },
                {
                  title: '3. Dynamic Firewall Rate Limiting',
                  color: '#f59e0b',
                  icon: Sliders,
                  desc: 'Automatically communicates with edge routers and firewalls via API to dynamically insert temporary ACL drop rules for offending source IP subnets for 15, 30, or 60 minutes.'
                },
                {
                  title: '4. Fail-Open Hardware Bypass',
                  color: '#10b981',
                  icon: Zap,
                  desc: 'Enterprise IPS appliances use specialized NICs with physical relays. If power fails or the software daemon crashes, the relay physically snaps closed, allowing traffic to flow through without interruption.'
                }
              ].map((tech, i) => {
                const Icon = tech.icon;
                return (
                  <div key={i} style={{
                    padding: '16px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: `1px solid ${tech.color}30`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Icon size={16} color={tech.color} />
                      <span style={{ fontSize: '0.86rem', fontWeight: '800', color: '#ffffff' }}>{tech.title}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {tech.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 4: SNORT & SURICATA RULES LAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'rules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Rule Structure Breakdown Ribbon */}
          <div className="glass-panel" style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(245, 158, 11, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Terminal size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Snort & Suricata Rule Syntax Anatomy
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              {RULE_COMPONENTS.map((comp, i) => (
                <div key={i} style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase' }}>
                    {comp.part}
                  </div>
                  <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', margin: '4px 0' }}>
                    {comp.code}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                    {comp.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Rule Tester */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#ffffff', marginBottom: '14px' }}>
              Real-World IDS / IPS Production Rule Examples:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SAMPLE_RULES.map(rule => (
                <div key={rule.sid} style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: rule.action === 'drop' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge" style={{
                        background: rule.action === 'drop' ? '#ef4444' : '#2563eb',
                        color: '#ffffff',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        fontWeight: '800'
                      }}>
                        {rule.action.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff' }}>{rule.name}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                      SID: {rule.sid} · {rule.targetType}
                    </span>
                  </div>

                  <div style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    background: '#090d16',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.76rem',
                    color: '#34d399',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    marginBottom: '8px'
                  }}>
                    {rule.rule}
                  </div>

                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    <strong>Execution Behavior:</strong> {rule.behavior}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 5: IDS vs IPS DETAILED COMPARISON MATRIX
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'matrix' && (
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
              IDS vs IPS Technical Specification & Operational Matrix
            </h3>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.4)' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>Feature</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: '#60a5fa', textTransform: 'uppercase', fontSize: '0.72rem' }}>Intrusion Detection (IDS)</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: '#f87171', textTransform: 'uppercase', fontSize: '0.72rem' }}>Intrusion Prevention (IPS)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { f: 'Network Placement', ids: 'Passive, out-of-band (connected to SPAN / mirror port or optical TAP)', ips: 'Active, in-line ("bump-in-the-wire") between routers/switches' },
                { f: 'Primary Objective', ids: 'Monitor, detect, analyze, alert SOC analysts, log for forensics', ips: 'Prevent, block, drop malicious packets, tear down attacker sockets' },
                { f: 'Wire Latency Overhead', ids: '0.0 ms (Zero latency impact on live network traffic)', ips: 'Microseconds (adds minimal processing delay for DPI inspection)' },
                { f: 'Failure Impact', ids: 'Fail-Open: If IDS crashes, production traffic is completely unaffected', ips: 'Risk of outage unless equipped with hardware bypass relays' },
                { f: 'False Positive Impact', ids: 'Low risk: Causes noise in SOC alerts, but never disrupts users', ips: 'High risk: False positive blocks legitimate customer transactions' },
                { f: 'Response Time', ids: 'Post-event (Alert delivered seconds to minutes after packet crosses)', ips: 'Real-time (Packet dropped before reaching target NIC)' },
                { f: 'Active Mitigation', ids: 'None built-in (relies on manual SOC analyst response or SOAR script)', ips: 'Automatic packet drop, TCP RST injection, dynamic ACL block' },
                { f: 'SSL/TLS Inspection', ids: 'Passive tap cannot decrypt ephemeral DH/ECDHE keys without proxy', ips: 'Can act as SSL forward proxy to decrypt, inspect, and re-encrypt' },
                { f: 'Leading Open-Source', ids: 'Zeek (Bro), Snort (passive mode), Suricata (tap mode)', ips: 'Suricata (inline AF_PACKET/NFQueue), Snort 3 (inline DAQ)' },
                { f: 'Enterprise Solutions', ids: 'Darktrace, Vectra AI, Corelight', ips: 'Palo Alto Threat Prevention, Fortinet FortiGuard, Cisco Firepower' }
              ].map((row, i) => (
                <tr key={i} style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  background: i % 2 === 0 ? 'rgba(0, 0, 0, 0.2)' : 'transparent'
                }}>
                  <td style={{ padding: '10px 14px', fontWeight: '700', color: '#e2e8f0', whiteSpace: 'nowrap' }}>{row.f}</td>
                  <td style={{ padding: '10px 14px', color: '#93c5fd', lineHeight: '1.45' }}>{row.ids}</td>
                  <td style={{ padding: '10px 14px', color: '#fca5a5', lineHeight: '1.45' }}>{row.ips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
