import React, { useState, useMemo, useEffect } from 'react';
import {
  Server,
  Shield,
  Activity,
  Network,
  Check,
  Copy,
  RefreshCw,
  Zap,
  Layers,
  Play,
  BookOpen
} from 'lucide-react';

export default function AdvancedProxyLoadBalancerView({ onNavigateToTutorial }) {
  // Navigation tabs within the ADVANCE section
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'l4-vs-l7' | 'configs' | 'advanced-topics' | 'interview'

  // Architecture Simulation State
  const [simMode, setSimMode] = useState('load-balancer'); // 'forward-proxy' | 'reverse-proxy' | 'load-balancer'
  const [lbAlgorithm, setLbAlgorithm] = useState('round-robin'); // 'round-robin' | 'weighted' | 'least-conn' | 'ip-hash' | 'random'
  const [stickySessions, setStickySessions] = useState(false);
  const selectedClientIp = '203.0.113.19';
  const [clientPath, setClientPath] = useState('/api/users');

  // Backend server cluster states
  const [servers, setServers] = useState([
    { id: 1, name: 'Web Server 1', ip: '10.0.0.11:8080', weight: 3, healthy: true, activeConn: 14, requestsServed: 42, isBackup: false },
    { id: 2, name: 'Web Server 2', ip: '10.0.0.12:8080', weight: 1, healthy: true, activeConn: 28, requestsServed: 35, isBackup: false },
    { id: 3, name: 'Web Server 3', ip: '10.0.0.13:8080', weight: 1, healthy: true, activeConn: 8, requestsServed: 29, isBackup: false },
    { id: 4, name: 'Backup Server', ip: '10.0.0.14:8080', weight: 1, healthy: true, activeConn: 0, requestsServed: 0, isBackup: true }
  ]);

  // Request simulation trace
  const [lastRequestTrace, setLastRequestTrace] = useState(null);
  const [totalRequests, setTotalRequests] = useState(106);
  const [roundRobinIndex, setRoundRobinIndex] = useState(0);

  // Forward Proxy Simulator State
  const [fpTestUrl, setFpTestUrl] = useState('https://news.ycombinator.com');
  const [fpCachedUrls, setFpCachedUrls] = useState(['https://news.ycombinator.com', 'https://wikipedia.org']);
  const fpBlockedDomains = ['facebook.com', 'tiktok.com', 'gambling.net'];
  const [fpTrace, setFpTrace] = useState(null);

  // Copy helper
  const [copiedSnippet, setCopiedSnippet] = useState(null);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // Toggle server health (Kill / Recover)
  const toggleServerHealth = (id) => {
    setServers(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, healthy: !s.healthy, activeConn: s.healthy ? 0 : 5 };
      }
      return s;
    }));
  };

  // Send request through the simulated architecture
  const handleSendRequest = () => {
    const timestamp = new Date().toLocaleTimeString();
    setTotalRequests(prev => prev + 1);

    if (simMode === 'forward-proxy') {
      const isBlocked = fpBlockedDomains.some(d => fpTestUrl.toLowerCase().includes(d));
      const isCached = fpCachedUrls.includes(fpTestUrl);

      if (isBlocked) {
        setFpTrace({
          status: '403 Forbidden',
          cache: 'BLOCKED',
          time: timestamp,
          detail: `Squid Access Control List (ACL) blocked destination domain matching policy`,
          ipSeenByDest: 'N/A'
        });
      } else if (isCached) {
        setFpTrace({
          status: '200 OK (Cache HIT)',
          cache: 'HIT',
          time: timestamp,
          detail: `Served directly from Forward Proxy disk cache. 0ms egress latency!`,
          ipSeenByDest: '10.0.0.1 (Proxy Internal IP)'
        });
      } else {
        setFpTrace({
          status: '200 OK (Cache MISS)',
          cache: 'MISS',
          time: timestamp,
          detail: `Proxy opened outbound socket, fetched content, and saved copy to local cache`,
          ipSeenByDest: '198.51.100.1 (Proxy Public Egress IP)'
        });
        setFpCachedUrls(prev => [...prev, fpTestUrl]);
      }
      return;
    }

    if (simMode === 'reverse-proxy') {
      let routedTarget = '10.0.0.11:3000 (API Microservice)';
      if (clientPath.startsWith('/app')) routedTarget = '10.0.0.12:80 (Web UI Service)';
      if (clientPath.startsWith('/static')) routedTarget = 'NGINX Local Memory (/var/www/static)';

      setLastRequestTrace({
        mode: 'reverse-proxy',
        time: timestamp,
        clientIp: selectedClientIp,
        path: clientPath,
        proxyIp: '198.51.100.5 (Public Ingress)',
        targetServer: routedTarget,
        tlsTerminated: true,
        headersInjected: {
          'Host': 'example.com',
          'X-Forwarded-For': selectedClientIp,
          'X-Forwarded-Proto': 'https',
          'X-Real-IP': selectedClientIp
        },
        status: '200 OK'
      });
      return;
    }

    // Load Balancer Mode
    const primaryActive = servers.filter(s => !s.isBackup && s.healthy);
    const backupActive = servers.filter(s => s.isBackup && s.healthy);

    let chosenServer = null;

    if (primaryActive.length === 0) {
      if (backupActive.length > 0) {
        chosenServer = backupActive[0];
      } else {
        // All dead! 503 Service Unavailable
        setLastRequestTrace({
          mode: 'load-balancer',
          time: timestamp,
          status: '503 Service Unavailable',
          error: 'No healthy upstream backends available in the pool!',
          chosenServer: null
        });
        return;
      }
    } else {
      if (stickySessions) {
        // Stick to Server 1 if healthy, else fallback
        chosenServer = primaryActive.find(s => s.id === 1) || primaryActive[0];
      } else if (lbAlgorithm === 'round-robin') {
        const nextIdx = roundRobinIndex % primaryActive.length;
        chosenServer = primaryActive[nextIdx];
        setRoundRobinIndex(prev => prev + 1);
      } else if (lbAlgorithm === 'weighted') {
        // Higher weight has more probability
        const pool = [];
        primaryActive.forEach(s => {
          for (let i = 0; i < s.weight; i++) pool.push(s);
        });
        chosenServer = pool[Math.floor(Math.random() * pool.length)];
      } else if (lbAlgorithm === 'least-conn') {
        // Server with lowest active connections
        chosenServer = [...primaryActive].sort((a, b) => a.activeConn - b.activeConn)[0];
      } else if (lbAlgorithm === 'ip-hash') {
        // Deterministic hash based on client IP
        let hash = 0;
        for (let i = 0; i < selectedClientIp.length; i++) {
          hash = (hash << 5) - hash + selectedClientIp.charCodeAt(i);
        }
        const idx = Math.abs(hash) % primaryActive.length;
        chosenServer = primaryActive[idx];
      } else {
        // Random / Power of two choices
        if (primaryActive.length === 1) {
          chosenServer = primaryActive[0];
        } else {
          const s1 = primaryActive[Math.floor(Math.random() * primaryActive.length)];
          const s2 = primaryActive[Math.floor(Math.random() * primaryActive.length)];
          chosenServer = s1.activeConn <= s2.activeConn ? s1 : s2;
        }
      }
    }

    // Update chosen server metrics
    setServers(prev => prev.map(s => {
      if (s.id === chosenServer.id) {
        return {
          ...s,
          requestsServed: s.requestsServed + 1,
          activeConn: s.activeConn + 1
        };
      }
      return s;
    }));

    setLastRequestTrace({
      mode: 'load-balancer',
      time: timestamp,
      clientIp: selectedClientIp,
      chosenServer: chosenServer.name,
      chosenIp: chosenServer.ip,
      isBackup: chosenServer.isBackup,
      algorithmUsed: lbAlgorithm,
      cookieInjected: stickySessions ? `SERVERID=s${chosenServer.id}` : null,
      status: '200 OK'
    });
  };

  // Recover all servers
  const recoverAllServers = () => {
    setServers(prev => prev.map(s => ({ ...s, healthy: true })));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner Header */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        boxShadow: '0 0 24px rgba(168, 85, 247, 0.12)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
            }}>
              <Server size={26} color="#ffffff" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                  ADVANCE: Proxy, Reverse Proxy &amp; Load Balancer
                </h2>
                <span className="badge" style={{
                  background: 'rgba(168, 85, 247, 0.25)',
                  color: '#c084fc',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  fontSize: '0.68rem',
                  fontWeight: '700'
                }}>
                  Layer 4 &amp; Layer 7 Distributed Architecture
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Based on <code style={{ color: '#c084fc' }}>doc/Proxy reverse proxy load balancer.md</code> with interactive traffic routing, failover, NGINX/HAProxy labs, and interview cheat sheets.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigateToTutorial && onNavigateToTutorial('ch-17')}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <BookOpen size={14} color="#34d399" />
              <span>Networking Tutorial Docs</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.45)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          flexWrap: 'wrap',
          gap: '4px'
        }}>
          {[
            { id: 'simulator', label: '⚡ Interactive Architecture Studio' },
            { id: 'l4-vs-l7', label: '⚖ L4 vs L7 Comparison' },
            { id: 'configs', label: '🛠 Production Configs (NGINX/HAProxy/Squid)' },
            { id: 'advanced-topics', label: '🚀 Advanced Topics (WAF/CDN/Mesh/eBPF)' },
            { id: 'interview', label: '🎓 Interview & Revision Points' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: activeTab === tab.id ? '700' : '500',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' : 'transparent',
                boxShadow: activeTab === tab.id ? '0 2px 10px rgba(168, 85, 247, 0.4)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: INTERACTIVE ARCHITECTURAL SIMULATION STUDIO */}
      {activeTab === 'simulator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Architecture Mode Selector */}
          <div className="glass-panel" style={{
            padding: '16px 20px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(15, 23, 42, 0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#cbd5e1' }}>Select Simulation Mode:</span>
              <div style={{
                display: 'flex',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '3px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                {[
                  { id: 'forward-proxy', label: '🛡️ Forward Proxy', desc: 'Acts for the Client' },
                  { id: 'reverse-proxy', label: '⚡ Reverse Proxy', desc: 'Acts for the Server' },
                  { id: 'load-balancer', label: '⚖️ Load Balancer', desc: 'Balances Server Pool' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSimMode(m.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: simMode === m.id ? '700' : '500',
                      color: simMode === m.id ? '#ffffff' : 'var(--text-dim)',
                      background: simMode === m.id ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSendRequest}
              className="btn btn-primary"
              style={{
                padding: '8px 18px',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
              }}
            >
              <Play size={14} color="#ffffff" fill="#ffffff" />
              <span>Send Test Request</span>
            </button>
          </div>

          {/* Quick Comparison Rule Callout */}
          <div style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            fontSize: '0.8rem',
            color: '#e2e8f0',
            lineHeight: '1.5'
          }}>
            {simMode === 'forward-proxy' && (
              <span>
                <strong style={{ color: '#38bdf8' }}>Forward Proxy Concept:</strong> Sits in front of internal clients. Clients send requests to the proxy; the proxy forwards them to the internet on their behalf. <em>Hides client identity, filters blocked sites, and caches content.</em>
              </span>
            )}
            {simMode === 'reverse-proxy' && (
              <span>
                <strong style={{ color: '#38bdf8' }}>Reverse Proxy Concept:</strong> Sits in front of backend servers. External clients talk only to the proxy; the proxy forwards to internal backends. <em>Hides backend IP addresses, terminates TLS, rewrites URLs, and injects X-Forwarded headers.</em>
              </span>
            )}
            {simMode === 'load-balancer' && (
              <span>
                <strong style={{ color: '#38bdf8' }}>Load Balancer Concept:</strong> A specialized reverse proxy that distributes traffic across a pool of backend servers for high availability, fault tolerance, and horizontal scalability.
              </span>
            )}
          </div>

          {/* MODE 1: FORWARD PROXY INTERACTIVE VIEW */}
          {simMode === 'forward-proxy' && (
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                  Forward Proxy Flow &amp; Filtering (Squid / Corporate Edge)
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  Client IP (192.168.1.50) &rarr; [Forward Proxy 10.0.0.1] &rarr; Public Internet
                </span>
              </div>

              {/* URL Input and Controls */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={fpTestUrl}
                  onChange={(e) => setFpTestUrl(e.target.value)}
                  placeholder="Enter target URL..."
                  style={{
                    flex: 1,
                    minWidth: '240px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                <button
                  onClick={() => setFpTestUrl('https://facebook.com')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.74rem' }}
                >
                  Test Blocked Domain
                </button>
                <button
                  onClick={() => setFpTestUrl('https://wikipedia.org')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.74rem' }}
                >
                  Test Cached Domain
                </button>
              </div>

              {/* Visual Flow diagram */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: '700', marginBottom: '4px' }}>1. Local Host (Client)</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>IP: 192.168.1.50</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px' }}>Configured with HTTP_PROXY=http://10.0.0.1:3128</div>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: '700', marginBottom: '4px' }}>2. Squid Forward Proxy</div>
                  <div style={{ fontSize: '0.72rem', color: '#ffffff' }}>Egress Public IP: 198.51.100.1</div>
                  <div style={{ fontSize: '0.68rem', color: '#34d399', marginTop: '4px' }}>✓ Policy Filtering • Cache Memory • Activity Audit</div>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#a855f7', fontWeight: '700', marginBottom: '4px' }}>3. Internet Destination</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Target: {fpTestUrl}</div>
                  <div style={{ fontSize: '0.68rem', color: '#38bdf8', marginTop: '4px' }}>Sees Proxy IP: 198.51.100.1 (Client IP is 100% hidden!)</div>
                </div>
              </div>

              {/* Last Trace Result */}
              {fpTrace && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: fpTrace.cache === 'BLOCKED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.12)',
                  border: fpTrace.cache === 'BLOCKED' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#cbd5e1'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: fpTrace.cache === 'BLOCKED' ? '#f87171' : '#34d399' }}>
                      Status: {fpTrace.status}
                    </strong>
                    <span style={{ color: 'var(--text-dim)' }}>{fpTrace.time}</span>
                  </div>
                  <div>{fpTrace.detail}</div>
                  <div style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    Destination Server Received Client IP: <strong style={{ color: '#38bdf8' }}>{fpTrace.ipSeenByDest}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: REVERSE PROXY INTERACTIVE VIEW */}
          {simMode === 'reverse-proxy' && (
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                  Reverse Proxy &amp; Gateway (NGINX / Envoy)
                </h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['/api/users', '/app/dashboard', '/static/logo.png'].map(p => (
                    <button
                      key={p}
                      onClick={() => setClientPath(p)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: clientPath === p ? '700' : '500',
                        background: clientPath === p ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)',
                        color: clientPath === p ? '#070a12' : '#ffffff',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Routing Map */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: '700', marginBottom: '4px' }}>Public Client Browser</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Client IP: {selectedClientIp}</div>
                  <div style={{ fontSize: '0.68rem', color: '#34d399', marginTop: '4px' }}>Speaks HTTPS (TLS 1.3) &rarr; Requesting {clientPath}</div>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.35)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#c084fc', fontWeight: '700', marginBottom: '4px' }}>NGINX Reverse Proxy (Edge)</div>
                  <div style={{ fontSize: '0.72rem', color: '#ffffff' }}>Public IP: 198.51.100.5 (Port 443)</div>
                  <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginTop: '4px' }}>
                    • TLS Decryption (Offload)<br />
                    • Injects <code>X-Forwarded-For</code><br />
                    • Path Routing: <code>location {clientPath.split('/')[1] ? `/${clientPath.split('/')[1]}/` : '/'}</code>
                  </div>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: '700', marginBottom: '4px' }}>Internal Backend Service</div>
                  <div style={{ fontSize: '0.72rem', color: '#ffffff' }}>
                    {clientPath.startsWith('/api') && '10.0.0.11:3000 (Go / Node.js API)'}
                    {clientPath.startsWith('/app') && '10.0.0.12:80 (React SSR Web UI)'}
                    {clientPath.startsWith('/static') && 'NGINX Local SSD (/var/www)'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Receives plain HTTP over private VPC LAN (Zero public IP exposed!)
                  </div>
                </div>
              </div>

              {/* Injected Headers Inspector */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.5)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                color: '#cbd5e1'
              }}>
                <strong style={{ color: '#38bdf8' }}>Headers Injected by Reverse Proxy to Backend:</strong>
                <div style={{ marginTop: '6px', lineHeight: '1.6' }}>
                  • <span style={{ color: '#fbbf24' }}>X-Forwarded-For:</span> {selectedClientIp}<br />
                  • <span style={{ color: '#fbbf24' }}>X-Forwarded-Proto:</span> https (informs app that user connected securely)<br />
                  • <span style={{ color: '#fbbf24' }}>X-Real-IP:</span> {selectedClientIp}<br />
                  • <span style={{ color: '#fbbf24' }}>Host:</span> example.com
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: LOAD BALANCER INTERACTIVE VIEW */}
          {simMode === 'load-balancer' && (
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                    Load Balancer Cluster (HAProxy / AWS ALB)
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Total Requests Processed: <strong style={{ color: '#38bdf8' }}>{totalRequests}</strong>
                  </div>
                </div>

                {/* LB Algorithm Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Algorithm:</span>
                  <select
                    value={lbAlgorithm}
                    onChange={(e) => setLbAlgorithm(e.target.value)}
                    style={{
                      background: '#070a12',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '0.74rem'
                    }}
                  >
                    <option value="round-robin">Round Robin (1-by-1)</option>
                    <option value="weighted">Weighted Round Robin (Weight 3 vs 1)</option>
                    <option value="least-conn">Least Connections (Fewest active)</option>
                    <option value="ip-hash">IP Hash (Deterministic per Client)</option>
                    <option value="random">Power of Two Choices</option>
                  </select>

                  {/* Sticky Session Toggle */}
                  <button
                    onClick={() => setStickySessions(!stickySessions)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: stickySessions ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: stickySessions ? '#34d399' : 'var(--text-dim)',
                      cursor: 'pointer'
                    }}
                  >
                    {stickySessions ? '✓ Sticky Sessions (Cookie ON)' : 'Sticky Sessions (OFF)'}
                  </button>

                  <button
                    onClick={recoverAllServers}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                  >
                    <RefreshCw size={12} />
                    <span>Recover All</span>
                  </button>
                </div>
              </div>

              {/* Server Cluster Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
                marginBottom: '16px'
              }}>
                {servers.map((srv) => (
                  <div
                    key={srv.id}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      background: !srv.healthy
                        ? 'rgba(239, 68, 68, 0.1)'
                        : srv.isBackup
                        ? 'rgba(245, 158, 11, 0.08)'
                        : 'rgba(0, 0, 0, 0.45)',
                      border: !srv.healthy
                        ? '1px solid rgba(239, 68, 68, 0.4)'
                        : srv.isBackup
                        ? '1px dashed rgba(245, 158, 11, 0.4)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '0.82rem', color: srv.healthy ? '#ffffff' : '#f87171' }}>
                        {srv.name} {srv.isBackup && '(Hot Standby)'}
                      </strong>
                      <span style={{
                        fontSize: '0.64rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontWeight: '700',
                        background: srv.healthy ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: srv.healthy ? '#34d399' : '#f87171'
                      }}>
                        {srv.healthy ? 'HEALTHY (200 OK)' : 'DOWN (CRASHED)'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      IP: {srv.ip} • Weight: {srv.weight}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#cbd5e1', marginTop: '8px' }}>
                      <span>Active Connections: <strong style={{ color: '#38bdf8' }}>{srv.activeConn}</strong></span>
                      <span>Requests: <strong style={{ color: '#34d399' }}>{srv.requestsServed}</strong></span>
                    </div>

                    <div style={{ marginTop: '10px', display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => toggleServerHealth(srv.id)}
                        style={{
                          flex: 1,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          border: 'none',
                          cursor: 'pointer',
                          background: srv.healthy ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: srv.healthy ? '#f87171' : '#34d399'
                        }}
                      >
                        {srv.healthy ? 'Simulate Failure' : 'Heal Server'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Last Load Balancer Trace */}
              {lastRequestTrace && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: lastRequestTrace.status.includes('503') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(168, 85, 247, 0.1)',
                  border: lastRequestTrace.status.includes('503') ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(168, 85, 247, 0.3)',
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#cbd5e1'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: lastRequestTrace.status.includes('503') ? '#f87171' : '#c084fc' }}>
                      Latest Traffic Event: {lastRequestTrace.status}
                    </strong>
                    <span style={{ color: 'var(--text-dim)' }}>{lastRequestTrace.time}</span>
                  </div>

                  {lastRequestTrace.chosenServer ? (
                    <div>
                      Routed to: <strong style={{ color: '#34d399' }}>{lastRequestTrace.chosenServer}</strong> ({lastRequestTrace.chosenIp})
                      via algorithm <strong style={{ color: '#38bdf8' }}>{lastRequestTrace.algorithmUsed}</strong>
                      {lastRequestTrace.cookieInjected && (
                        <span> • Cookie Injected: <code style={{ color: '#fbbf24' }}>{lastRequestTrace.cookieInjected}</code></span>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: '#f87171' }}>{lastRequestTrace.error}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LAYER 4 VS LAYER 7 COMPARISON */}
      {activeTab === 'l4-vs-l7' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '12px' }}>
              Layer 4 (Transport) vs Layer 7 (Application) Load Balancing
            </h3>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.6' }}>
              Load balancers operate at different layers of the OSI stack. Choosing between L4 and L7 is one of the most critical architecture decisions in cloud and data center design.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '14px',
              marginTop: '16px'
            }}>
              {/* L4 Box */}
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Zap size={18} color="#38bdf8" />
                  <strong style={{ fontSize: '0.92rem', color: '#38bdf8' }}>Layer 4 (Transport Level)</strong>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  • <strong>Works with:</strong> IP addresses and TCP/UDP ports only.<br />
                  • <strong>Can read HTTP?:</strong> No. Treats traffic as an opaque byte stream.<br />
                  • <strong>Routing decisions:</strong> IP + Port only. Fast hashing (e.g. 5-tuple).<br />
                  • <strong>TLS handling:</strong> Passthrough (end-to-end encryption to backend).<br />
                  • <strong>Speed:</strong> Blazing fast. Millions of packets/sec with zero CPU parsing.<br />
                  • <strong>Use cases:</strong> Databases, game servers, raw TCP/UDP, streaming, VoIP.<br />
                  • <strong>Examples:</strong> AWS NLB (Network Load Balancer), HAProxy (TCP mode), LVS/IPVS.
                </div>
              </div>

              {/* L7 Box */}
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Layers size={18} color="#c084fc" />
                  <strong style={{ fontSize: '0.92rem', color: '#c084fc' }}>Layer 7 (Application Level)</strong>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  • <strong>Works with:</strong> Full HTTP/HTTPS headers, URLs, cookies, query parameters.<br />
                  • <strong>Can read HTTP?:</strong> Yes! Inspects JSON, cookies, paths, HTTP methods.<br />
                  • <strong>Routing decisions:</strong> Route <code>/api</code> to API pods, <code>/static</code> to cache.<br />
                  • <strong>TLS handling:</strong> Termination (decrypts TLS, re-encrypts if needed).<br />
                  • <strong>Speed:</strong> Higher processing overhead per request.<br />
                  • <strong>Use cases:</strong> Microservices, web apps, REST/GraphQL APIs, gRPC.<br />
                  • <strong>Examples:</strong> AWS ALB (Application Load Balancer), NGINX, HAProxy (HTTP mode), Envoy.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTION CONFIGURATION LAB */}
      {activeTab === 'configs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            {
              id: 'nginx-reverse',
              title: '1. NGINX as a Reverse Proxy',
              desc: 'Terminates connection on port 80 and passes traffic to a local Node.js or Go application running on port 3000.',
              code: `server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`
            },
            {
              id: 'nginx-lb',
              title: '2. NGINX as an Upstream Load Balancer',
              desc: 'Distributes traffic across three upstream web nodes with weights and automatic hot-standby backup failover.',
              code: `upstream backend {
    least_conn;                          # algorithm (default: round robin)
    server 10.0.0.11:8080 weight=3;
    server 10.0.0.12:8080;
    server 10.0.0.13:8080 backup;        # used only if others fail
    keepalive 32;
}

server {
    listen 80;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_next_upstream error timeout http_502 http_503;
    }
}`
            },
            {
              id: 'haproxy-lb',
              title: '3. HAProxy High-Performance Load Balancer with Health Checks',
              desc: 'Round-robin load balancing with active HTTP /health status monitoring and backend backup failover.',
              code: `frontend http_in
    bind *:80
    default_backend web_servers

backend web_servers
    balance roundrobin
    option httpchk GET /health
    http-check expect status 200
    server web1 10.0.0.11:8080 check
    server web2 10.0.0.12:8080 check
    server web3 10.0.0.13:8080 check backup`
            },
            {
              id: 'haproxy-sticky',
              title: '4. HAProxy Sticky Sessions with Injected Cookies',
              desc: 'Injects a SERVERID cookie so returning users are always routed back to the exact same server instance.',
              code: `backend web_servers
    balance roundrobin
    cookie SERVERID insert indirect nocache
    server web1 10.0.0.11:8080 check cookie s1
    server web2 10.0.0.12:8080 check cookie s2`
            },
            {
              id: 'squid-forward',
              title: '5. Squid Forward Proxy with Domain Access Control',
              desc: 'Corporate edge forward proxy blocking restricted social media domains while allowing internal LAN subnet.',
              code: `http_port 3128
acl localnet src 192.168.0.0/16
acl blocked_sites dstdomain .facebook.com .tiktok.com
http_access deny blocked_sites
http_access allow localnet
http_access deny all`
            },
            {
              id: 'docker-compose-lb',
              title: '6. Docker Compose: NGINX Balancing 3 App Replicas',
              desc: 'Production-ready container architecture scaling 3 application pods behind an NGINX reverse proxy.',
              code: `services:
  app:
    image: myapp:latest
    deploy:
      replicas: 3
    networks: [backend]

  nginx:
    image: nginx:stable
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on: [app]
    networks: [backend]

networks:
  backend:`
            }
          ].map(cfg => (
            <div key={cfg.id} style={{
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#38bdf8' }}>{cfg.title}</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{cfg.desc}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(cfg.code, cfg.id)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.72rem'
                  }}
                >
                  {copiedSnippet === cfg.id ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                  <span>{copiedSnippet === cfg.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre style={{
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '12px',
                borderRadius: '8px',
                margin: 0,
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                color: '#34d399',
                overflowX: 'auto'
              }}>
                <code>{cfg.code}</code>
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: ADVANCED TOPICS (WAF / CDN / SERVICE MESH / eBPF) */}
      {activeTab === 'advanced-topics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              title: 'CDN (Content Delivery Network)',
              color: '#38bdf8',
              points: [
                'Geographically distributed edge caches running as high-scale reverse proxies close to end users.',
                'Key metrics: Cache Hit Ratio, TTL expiration, Instant Purge/Invalidation, Origin Shield.',
                'Tools: Cloudflare, Fastly, AWS CloudFront, Akamai.'
              ]
            },
            {
              title: 'API Gateway vs Load Balancer',
              color: '#fbbf24',
              points: [
                'Load Balancers know how to distribute TCP/HTTP traffic; API Gateways understand API semantics (JWTs, API keys, rate limit quotas, JSON schema validation).',
                'Tools: Kong, AWS API Gateway, Apigee, Tyk.'
              ]
            },
            {
              title: 'WAF (Web Application Firewall)',
              color: '#f87171',
              points: [
                'Inspects Layer 7 payloads for OWASP Top 10 vulnerabilities (SQL Injection, XSS, CSRF, malicious bots).',
                'Operates in Detection-only mode (logs alerts) or Blocking mode (returns 403 Forbidden).',
                'Tools: ModSecurity (OWASP CRS), Cloudflare WAF, AWS WAF.'
              ]
            },
            {
              title: 'Service Mesh & Sidecar Proxies',
              color: '#a855f7',
              points: [
                'Manages microservice east-west traffic inside Kubernetes clusters using Envoy sidecars deployed in every pod.',
                'Provides automatic mTLS mutual authentication, circuit breaking, and distributed tracing (OpenTelemetry).',
                'Tools: Istio, Linkerd, Cilium Service Mesh.'
              ]
            },
            {
              title: 'Common HTTP Gateway Errors & Fixes',
              color: '#ec4899',
              points: [
                '502 Bad Gateway: Upstream server is dead, crashed, or port closed.',
                '503 Service Unavailable: All backends failed health checks or connection pool exhausted.',
                '504 Gateway Timeout: Upstream server took longer than proxy_read_timeout (slow DB query).',
                'Redirect Loops: Backend app thinks user is on HTTP because proxy terminates TLS without passing X-Forwarded-Proto.'
              ]
            },
            {
              title: 'eBPF & Kernel-Level XDP Load Balancing',
              color: '#34d399',
              points: [
                'Facebook Katran and Cilium bypass Linux iptables using eBPF bytecode executed directly on the physical NIC driver (XDP layer).',
                'Processes tens of millions of packets per second with minimal CPU overhead and Maglev consistent hashing.'
              ]
            }
          ].map(top => (
            <div key={top.title} style={{
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '16px'
            }}>
              <strong style={{ fontSize: '0.88rem', color: top.color, display: 'block', marginBottom: '8px' }}>
                {top.title}
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                {top.points.map((pt, i) => (
                  <div key={i}>• {pt}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: INTERVIEW & REVISION POINTS */}
      {activeTab === 'interview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '14px' }}>
              Essential Interview &amp; Revision Principles
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem'
            }}>
              {[
                { rule: 'Proxy vs Reverse Proxy', desc: 'Forward proxy acts on behalf of the client; Reverse proxy acts on behalf of the server.' },
                { rule: 'Load Balancer Identity', desc: 'A load balancer is simply a specialized reverse proxy with multi-backend algorithms.' },
                { rule: 'L4 vs L7', desc: 'L4 balances by IP/port (fast, opaque); L7 balances by URL, headers, cookies (smart, full inspection).' },
                { rule: 'Sticky Sessions Trade-off', desc: 'Sticky sessions defeat even balancing; prefer stateless apps with Redis session storage.' },
                { rule: 'Critical Headers', desc: 'Always configure X-Forwarded-For and X-Forwarded-Proto so backends log real client IPs.' },
                { rule: 'Health Checks', desc: 'Active HTTP probes automatically remove failing backends before user requests fail.' },
                { rule: 'High Availability', desc: 'Make the LB itself redundant using VRRP, Keepalived, Floating IPs, or BGP Anycast.' },
                { rule: 'Error Codes', desc: '502 = bad upstream response, 503 = no backend available, 504 = upstream timeout.' }
              ].map(item => (
                <div key={item.rule} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ color: '#38bdf8', fontWeight: '700', marginBottom: '3px' }}>{item.rule}</div>
                  <div style={{ color: '#cbd5e1' }}>{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Production Architecture Pipeline Stack */}
            <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#c084fc', marginBottom: '8px' }}>
                Standard Modern Production Architecture Pipeline:
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem'
              }}>
                <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#38bdf822', color: '#38bdf8', border: '1px solid #38bdf855' }}>Client Browser</span>
                <span style={{ color: 'var(--text-dim)' }}>&rarr;</span>
                <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#f59e0b22', color: '#f59e0b', border: '1px solid #f59e0b55' }}>CDN / WAF (Cloudflare)</span>
                <span style={{ color: 'var(--text-dim)' }}>&rarr;</span>
                <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#10b98122', color: '#10b981', border: '1px solid #10b98155' }}>L4/L7 Load Balancer (AWS ALB)</span>
                <span style={{ color: 'var(--text-dim)' }}>&rarr;</span>
                <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#a855f722', color: '#a855f7', border: '1px solid #a855f755' }}>NGINX Ingress / Reverse Proxy</span>
                <span style={{ color: 'var(--text-dim)' }}>&rarr;</span>
                <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#ec489922', color: '#ec4899', border: '1px solid #ec489955' }}>App Microservice Pods</span>
                <span style={{ color: 'var(--text-dim)' }}>&rarr;</span>
                <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#38bdf822', color: '#38bdf8', border: '1px solid #38bdf855' }}>PostgreSQL / Redis Cluster</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
