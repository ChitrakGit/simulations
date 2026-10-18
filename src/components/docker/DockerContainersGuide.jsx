import React, { useState } from 'react';
import {
  Boxes,
  Activity,
  Cpu,
  Network,
  HardDrive,
  Shield,
  Copy,
  Check,
  AlertOctagon,
  ArrowRight,
  Terminal,
  Zap,
  Lock,
  Play,
  Pause,
  Square,
  RefreshCw,
  Sliders,
  Globe,
  Share2,
  AlertTriangle,
  Eye
} from 'lucide-react';

export default function DockerContainersGuide() {
  const [activeSubTab, setActiveSubTab] = useState('lifecycle'); // 'lifecycle' | 'resources' | 'networking' | 'storage' | 'security'
  const [copiedSnippet, setCopiedSnippet] = useState(null);
  const [selectedState, setSelectedState] = useState('running');
  const [selectedNetMode, setSelectedNetMode] = useState('bridge'); // 'bridge' | 'host' | 'none' | 'container'
  const [allocRam, setAllocRam] = useState(512);
  const [allocCpus, setAllocCpus] = useState(1.5);
  const [readOnlyStorage, setReadOnlyStorage] = useState(true);
  const [dropCaps, setDropCaps] = useState(true);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const LIFECYCLE_STATES = {
    created: {
      name: 'Created',
      color: '#f59e0b',
      badge: 'Allocated in Memory',
      desc: 'The container metadata, namespaces, and writable layer are initialized, but no host processes have been spawned yet.',
      cmdTrigger: 'docker create --name my-app nginx',
      nextTransitions: ['running (docker start)', 'dead / removed (docker rm)']
    },
    running: {
      name: 'Running',
      color: '#10b981',
      badge: 'Active PID 1',
      desc: 'Container PID 1 is actively running inside its isolated namespaces. CPU and memory cgroups actively constrain usage.',
      cmdTrigger: 'docker start my-app  OR  docker run -d my-app',
      nextTransitions: ['paused (docker pause)', 'exited (docker stop / app exit)', 'restarting (docker restart)']
    },
    paused: {
      name: 'Paused',
      color: '#38bdf8',
      badge: 'cgroups Freezing',
      desc: 'All processes are frozen in place using the Linux cgroups freezer subsystem (SIGSTOP). Memory remains allocated, but 0 CPU cycles are consumed.',
      cmdTrigger: 'docker pause my-app',
      nextTransitions: ['running (docker unpause)', 'exited (docker kill)']
    },
    restarting: {
      name: 'Restarting',
      color: '#a855f7',
      badge: 'Restart Policy Loop',
      desc: 'The container crashed or stopped and the Docker daemon is applying its restart policy (--restart unless-stopped).',
      cmdTrigger: 'Automatic restart trigger or docker restart',
      nextTransitions: ['running (boot succeeded)', 'dead (crash loop limit)']
    },
    exited: {
      name: 'Exited / Stopped',
      color: '#94a3b8',
      badge: 'Process Terminated',
      desc: 'PID 1 terminated gracefully (SIGTERM -> exit 0) or crashed (exit 1/137). The filesystem and logs remain intact for inspection.',
      cmdTrigger: 'docker stop my-app  (SIGTERM -> 10s -> SIGKILL)',
      nextTransitions: ['running (docker start)', 'removed (docker rm)']
    },
    dead: {
      name: 'Dead',
      color: '#ef4444',
      badge: 'Unrecoverable State',
      desc: 'Daemon error or locked resources prevented clean cleanup. The container cannot be restarted and must be forced removed.',
      cmdTrigger: 'Kernel resource exhaustion or daemon lock',
      nextTransitions: ['removed (docker rm -f)']
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* SECTION HEADER */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(14, 165, 233, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.72rem' }}>
                Module 3
              </span>
              <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: '0.72rem' }}>
                Runtime Operations
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Boxes size={24} color="#34d399" />
              Docker Containers: Lifecycle, Resources, Networking, Storage & Security
            </h2>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Master runtime process management, Linux cgroups resource limits, virtual networking, volume persistence, and hardened rootless security.
            </div>
          </div>

          {/* Sub-tab Navigation Pills */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.4)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap' }}>
            {[
              { id: 'lifecycle', label: '1. Lifecycle', icon: Activity },
              { id: 'resources', label: '2. Resources (cgroups)', icon: Cpu },
              { id: 'networking', label: '3. Networking', icon: Network },
              { id: 'storage', label: '4. Storage & Volumes', icon: HardDrive },
              { id: 'security', label: '5. Security Hardening', icon: Shield }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    background: isActive ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SUBTAB 1: LIFECYCLE */}
      {activeSubTab === 'lifecycle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#34d399', marginTop: 0, marginBottom: '6px' }}>
              The 6 Container Lifecycle States & Signal Flow
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '18px' }}>
              A container transitions through well-defined operating system states. When you run <code>docker stop</code>, Docker sends <strong>SIGTERM (signal 15)</strong> to container PID 1, waits 10 seconds for graceful shutdown, and escalates to <strong>SIGKILL (signal 9)</strong> if the process hangs.
            </p>

            {/* Interactive State Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px', marginBottom: '20px' }}>
              {Object.keys(LIFECYCLE_STATES).map((key) => {
                const s = LIFECYCLE_STATES[key];
                const isSelected = selectedState === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedState(key)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: isSelected ? `${s.color}25` : 'rgba(0, 0, 0, 0.4)',
                      border: isSelected ? `1.5px solid ${s.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: '800', color: isSelected ? '#ffffff' : s.color }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {s.badge}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected State Spotlight */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.55)',
              padding: '18px',
              borderRadius: '12px',
              border: `1px solid ${LIFECYCLE_STATES[selectedState].color}40`,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '800', color: LIFECYCLE_STATES[selectedState].color }}>
                  State Analysis: {LIFECYCLE_STATES[selectedState].name.toUpperCase()}
                </span>
                <span className="badge" style={{ background: `${LIFECYCLE_STATES[selectedState].color}20`, color: LIFECYCLE_STATES[selectedState].color, fontSize: '0.7rem' }}>
                  {LIFECYCLE_STATES[selectedState].badge}
                </span>
              </div>

              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {LIFECYCLE_STATES[selectedState].desc}
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.6)', padding: '10px 14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#a7f3d0' }}>
                <span style={{ color: '#fbbf24', fontWeight: '700' }}>Command Trigger: </span>
                {LIFECYCLE_STATES[selectedState].cmdTrigger}
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                <strong>Valid Transitions: </strong>
                {LIFECYCLE_STATES[selectedState].nextTransitions.join('  ➔  ')}
              </div>
            </div>

            {/* Common Exit Codes Table */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '10px' }}>
                Common Docker Container Exit Codes (Triage Cheatsheet)
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '8px 12px', color: '#38bdf8' }}>Exit Code</th>
                      <th style={{ padding: '8px 12px', color: '#ffffff' }}>Status / Reason</th>
                      <th style={{ padding: '8px 12px', color: '#a7f3d0' }}>Diagnostic Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { code: '0', reason: 'Success', desc: 'Process completed execution normally (e.g. batch task finished, clean SIGTERM handle).' },
                      { code: '1', reason: 'Application Error', desc: 'Unhandled exception, missing file, syntax crash, or exit(1) raised in code.' },
                      { code: '137 (128+9)', reason: 'OOMKilled / SIGKILL', desc: 'Container exceeded cgroup memory limit (--memory) and Linux OOM-Killer killed it immediately.' },
                      { code: '139 (128+11)', reason: 'SIGSEGV', desc: 'Segmentation fault in binary attempting to read unmapped virtual memory address.' },
                      { code: '143 (128+15)', reason: 'SIGTERM', desc: 'Gracefully stopped by Docker daemon or orchestrator (docker stop).' }
                    ].map(row => (
                      <tr key={row.code} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '8px 12px', color: '#fbbf24', fontWeight: '700' }}>{row.code}</td>
                        <td style={{ padding: '8px 12px', color: '#ffffff' }}>{row.reason}</td>
                        <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: RESOURCES */}
      {activeSubTab === 'resources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#34d399', marginTop: 0, marginBottom: '6px' }}>
              Resource Constraints: Linux cgroups v2 Memory & CPU Throttling
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '18px' }}>
              Without resource constraints, a single runaway container with a memory leak can starve the host OS and crash all neighboring containers. Docker enforces strict hardware bounds via Linux <strong>Control Groups (cgroups v2)</strong>.
            </p>

            {/* Interactive Resource Flag Generator */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.45)',
              padding: '18px',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              marginBottom: '20px'
            }}>
              <div style={{ fontWeight: '700', color: '#38bdf8', fontSize: '0.9rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} />
                Interactive cgroup Flag Configurator:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                {/* RAM Limit Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-main)' }}>Max RAM Limit (<code>--memory</code>):</span>
                    <span style={{ color: '#34d399', fontWeight: '700', fontFamily: 'monospace' }}>{allocRam} MB</span>
                  </div>
                  <input
                    type="range"
                    min="128"
                    max="4096"
                    step="128"
                    value={allocRam}
                    onChange={(e) => setAllocRam(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    If exceeded, container receives exit code 137 (OOMKilled).
                  </div>
                </div>

                {/* CPU Quota Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-main)' }}>CPU Allocation (<code>--cpus</code>):</span>
                    <span style={{ color: '#fbbf24', fontWeight: '700', fontFamily: 'monospace' }}>{allocCpus} Cores</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="8"
                    step="0.5"
                    value={allocCpus}
                    onChange={(e) => setAllocCpus(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Kernel allocates CFS scheduler quota (e.g. 150ms per 100ms period).
                  </div>
                </div>
              </div>

              {/* Generated Command Output */}
              <div style={{ position: 'relative' }}>
                <pre style={{
                  margin: 0,
                  padding: '12px 14px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  borderRadius: '8px',
                  color: '#a7f3d0',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  overflowX: 'auto'
                }}>
                  {`docker run -d --name secure-api \\\n  --memory="${allocRam}m" \\\n  --memory-swap="${allocRam * 2}m" \\\n  --cpus="${allocCpus}" \\\n  --pids-limit=100 \\\n  nginx:alpine`}
                </pre>
                <button
                  onClick={() => copyToClipboard(`docker run -d --name secure-api --memory="${allocRam}m" --memory-swap="${allocRam * 2}m" --cpus="${allocCpus}" --pids-limit=100 nginx:alpine`, 'resource-cmd')}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: '#ffffff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {copiedSnippet === 'resource-cmd' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  <span>{copiedSnippet === 'resource-cmd' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Live Monitoring Commands */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
                Monitoring Container Resource Consumption
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px' }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.8rem', fontWeight: '700' }}>
                    docker stats
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Live streaming terminal dashboard of CPU %, Memory usage / Limit, Network I/O, and Block I/O.
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.8rem', fontWeight: '700' }}>
                    docker top &lt;container&gt;
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Inspect the running Linux processes, PIDs, and CPU user times executing inside the container.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: NETWORKING */}
      {activeSubTab === 'networking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#34d399', marginTop: 0, marginBottom: '6px' }}>
              Container Networking: Modes, DNS Discovery, DOCKER-USER Firewall & Linux Kernel Triage
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '18px' }}>
              Docker containers communicate using <strong>libnetwork</strong> virtual network drivers and Linux kernel network namespaces (<code>CLONE_NEWNET</code>). Below is the comprehensive architectural guide to network modes, embedded DNS, firewall protection, and low-level kernel triage.
            </p>

            {/* PART 1: THE 4 CONTAINER NETWORK MODES INTERACTIVE SELECTOR */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.45)',
              padding: '18px',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              marginBottom: '20px'
            }}>
              <div style={{ fontWeight: '700', color: '#38bdf8', fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 size={16} />
                <span>The 4 Container Network Modes (--network &lt;mode&gt;):</span>
              </div>

              {/* Mode Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                {[
                  { id: 'bridge', name: '1. bridge (Default)', tag: 'Isolated veth switch', color: '#38bdf8' },
                  { id: 'host', name: '2. host (Direct)', tag: 'Zero NAT / Max Perf', color: '#10b981' },
                  { id: 'none', name: '3. none (Air-Gapped)', tag: 'Loopback 127.0.0.1 only', color: '#94a3b8' },
                  { id: 'container', name: '4. container:app (Sidecar)', tag: 'Shared Pod Namespace', color: '#c084fc' }
                ].map(m => {
                  const isSel = selectedNetMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedNetMode(m.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: isSel ? `${m.color}25` : 'rgba(0,0,0,0.4)',
                        border: isSel ? `1.5px solid ${m.color}` : '1px solid rgba(255,255,255,0.08)',
                        color: isSel ? '#ffffff' : 'var(--text-muted)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontWeight: '700', fontSize: '0.82rem', color: isSel ? m.color : '#ffffff' }}>{m.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>{m.tag}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Mode Deep Dive */}
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
                {selectedNetMode === 'bridge' && (
                  <div>
                    <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.84rem', marginBottom: '4px' }}>
                      bridge Mode: Private Software Switch & Port Forwarding
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      The default driver. Docker provisions an internal Linux bridge (<code>docker0</code>) on the host with private subnet <code>172.17.0.0/16</code>. Containers get a <code>veth</code> pair connecting their internal <code>eth0</code> to <code>docker0</code>. Public ingress is achieved through iptables DNAT rules (-p 8080:80).
                    </div>
                  </div>
                )}
                {selectedNetMode === 'host' && (
                  <div>
                    <div style={{ color: '#10b981', fontWeight: '700', fontSize: '0.84rem', marginBottom: '4px' }}>
                      host Mode: Bypass Network Namespace Isolation
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      Removes all network namespace isolation between container and host. Container does not receive a private IP address; processes bind directly to host interfaces. Eliminates iptables NAT overhead for maximum throughput, but risks port collisions.
                    </div>
                  </div>
                )}
                {selectedNetMode === 'none' && (
                  <div>
                    <div style={{ color: '#94a3b8', fontWeight: '700', fontSize: '0.84rem', marginBottom: '4px' }}>
                      none Mode: Completely Air-Gapped Network Stack
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      Container receives a private network namespace equipped only with the local loopback interface (<code>127.0.0.1</code>). Zero inbound or outbound access. Ideal for confidential cryptographic calculations, offline build compilers, and batch jobs.
                    </div>
                  </div>
                )}
                {selectedNetMode === 'container' && (
                  <div>
                    <div style={{ color: '#c084fc', fontWeight: '700', fontSize: '0.84rem', marginBottom: '4px' }}>
                      container:&lt;name&gt; Mode: Sidecar Pattern & Shared Network Namespace
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      Attaches the new container directly to the existing network namespace of a target container using the Linux <code>setns(CLONE_NEWNET)</code> syscall. Both containers share the EXACT same IP address, routing table, and <code>localhost (127.0.0.1)</code>. This is the exact architectural primitive behind <strong>Kubernetes Pods</strong>!
                    </div>
                  </div>
                )}
              </div>

              {/* Mode Command Snippet */}
              <div style={{ position: 'relative' }}>
                <pre style={{
                  margin: 0,
                  padding: '12px 14px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  borderRadius: '8px',
                  color: '#a7f3d0',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  overflowX: 'auto'
                }}>
                  {selectedNetMode === 'bridge' && 'docker run -d --name web -p 8080:80 --network bridge nginx:alpine'}
                  {selectedNetMode === 'host' && 'docker run -d --name proxy --network host nginx:alpine'}
                  {selectedNetMode === 'none' && 'docker run --rm --network none alpine ip addr'}
                  {selectedNetMode === 'container' && '# 1. Run main app\ndocker run -d --name web-api nginx:alpine\n# 2. Attach sidecar debugger sharing localhost\ndocker run --rm -it --network container:web-api nicolaka/netshoot curl http://localhost:80'}
                </pre>
                <button
                  onClick={() => copyToClipboard(
                    selectedNetMode === 'bridge' ? 'docker run -d --name web -p 8080:80 --network bridge nginx:alpine' :
                    selectedNetMode === 'host' ? 'docker run -d --name proxy --network host nginx:alpine' :
                    selectedNetMode === 'none' ? 'docker run --rm --network none alpine ip addr' :
                    'docker run --rm -it --network container:web-api nicolaka/netshoot curl http://localhost:80',
                    'net-mode-cmd'
                  )}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: '#ffffff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {copiedSnippet === 'net-mode-cmd' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  <span>{copiedSnippet === 'net-mode-cmd' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* PART 2: EMBEDDED DNS & MULTI-NETWORK SEGMENTATION */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                <div style={{ fontWeight: '700', color: '#38bdf8', fontSize: '0.88rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={15} />
                  <span>1. Automatic Embedded DNS (127.0.0.11)</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  When containers join a <strong>user-defined bridge network</strong> (<code>docker network create my-net</code>), Docker runs an embedded DNS resolver at <code>127.0.0.11</code>. Containers ping each other directly by container name without hardcoding IP addresses. In default <code>docker0</code> bridge, automatic DNS resolution is DISABLED for legacy reasons.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                <div style={{ fontWeight: '700', color: '#fbbf24', fontSize: '0.88rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Network size={15} />
                  <span>2. Port Mapping (-p host:container DNAT)</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Containers run on private subnets (e.g. <code>172.18.0.2</code>). Running <code>-p 8080:80</code> instructs Docker to install an iptables <strong>DNAT rule</strong> in the <code>DOCKER</code> chain: traffic hitting host port 8080 is rewritten into the container's port 80.
                </div>
              </div>
            </div>

            {/* Multi-Network Workflow Snippet */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: '700', marginBottom: '6px' }}>
                Production Pattern: Connecting a Container to Multiple Isolated Networks
              </div>
              <pre style={{
                margin: 0,
                padding: '14px',
                background: 'rgba(0,0,0,0.7)',
                borderRadius: '8px',
                color: '#a7f3d0',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                border: '1px solid var(--border-subtle)',
                lineHeight: 1.5
              }}>
{`# 1. Create two isolated networks (frontend public, backend private)
docker network create frontend-net
docker network create --internal backend-net   # --internal disables outbound WAN routing

# 2. Database connects ONLY to backend-net (completely unreachable from public host)
docker run -d --name postgres-db --network backend-net postgres:16

# 3. API gateway connects to frontend-net, then dynamically attaches to backend-net
docker run -d --name api-gateway --network frontend-net -p 80:8000 my-api
docker network connect backend-net api-gateway

# Now api-gateway can reach postgres-db by name, while external users cannot!`}
              </pre>
              <button
                onClick={() => copyToClipboard(`# Multi-network connection pattern\ndocker network create frontend-net\ndocker network create --internal backend-net\ndocker run -d --name postgres-db --network backend-net postgres:16\ndocker run -d --name api-gateway --network frontend-net -p 80:8000 my-api\ndocker network connect backend-net api-gateway`, 'multi-net-snippet')}
                style={{ position: 'absolute', top: '30px', right: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: '#ffffff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {copiedSnippet === 'multi-net-snippet' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copiedSnippet === 'multi-net-snippet' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* PART 3: FIREWALLS, IPTABLES & THE CRITICAL DOCKER-USER CHAIN */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px' }}>
                <AlertTriangle size={18} />
                <span>Security Warning: The UFW Firewall Bypass Trap & DOCKER-USER Chain</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '12px' }}>
                <strong>The Trap:</strong> Docker manipulates iptables rules directly in the <code>nat</code> PREROUTING table. This table is evaluated <em>before</em> UFW (Uncomplicated Firewall) or firewalld filter rules! Running <code>docker run -p 8080:80</code> exposes the port to the public internet <strong>even if UFW default policy is DROP or deny!</strong>
                <br /><br />
                <strong>The Fix:</strong> All custom host firewall rules MUST be added to the <strong><code>DOCKER-USER</code></strong> iptables chain. Docker calls <code>DOCKER-USER</code> before any internal routing and never overwrites it on daemon restarts.
              </div>

              <div style={{ position: 'relative' }}>
                <pre style={{
                  margin: 0,
                  padding: '12px',
                  background: 'rgba(0,0,0,0.8)',
                  borderRadius: '8px',
                  color: '#fca5a5',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  lineHeight: 1.5
                }}>
{`# 1. Block all external public access to container ports from eth0 except trusted subnet
sudo iptables -I DOCKER-USER -i eth0 ! -s 203.0.113.0/24 -j DROP

# 2. Best Practice: Bind sensitive databases strictly to host localhost (127.0.0.1)
docker run -d --name secure-pg -p 127.0.0.1:5432:5432 postgres:16

# 3. Check live DOCKER-USER chain packet hit counters
sudo iptables -L DOCKER-USER -n -v --line-numbers`}
                </pre>
                <button
                  onClick={() => copyToClipboard(`sudo iptables -I DOCKER-USER -i eth0 ! -s 203.0.113.0/24 -j DROP\ndocker run -d --name secure-pg -p 127.0.0.1:5432:5432 postgres:16\nsudo iptables -L DOCKER-USER -n -v --line-numbers`, 'docker-user-snippet')}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: '#ffffff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {copiedSnippet === 'docker-user-snippet' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  <span>{copiedSnippet === 'docker-user-snippet' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* PART 4: LOW-LEVEL LINUX KERNEL TRIAGE CHEATSHEET */}
            <div>
              <div style={{ fontWeight: '700', color: '#38bdf8', fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={16} />
                <span>Low-Level Linux Kernel Triage & Troubleshooting Playbook:</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.8rem', fontWeight: '700' }}>
                    sudo nsenter -t $PID -n ip addr
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Enter container network namespace directly from host kernel without executing any shell inside container.
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.8rem', fontWeight: '700' }}>
                    docker run --rm -it --net container:&lt;id&gt; nicolaka/netshoot
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Zero-touch diagnostic toolbox (tcpdump, dig, curl, iperf3, nmap) injected into target container network stack.
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.8rem', fontWeight: '700' }}>
                    sudo tcpdump -i docker0 -nn -vv
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Sniff raw Ethernet frames and TCP/IP packets entering and leaving the software bridge.
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.8rem', fontWeight: '700' }}>
                    ping -M do -s 1472 8.8.8.8
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Test Path MTU. If small packets work but TLS handshakes hang, lower MTU in <code>daemon.json</code> or network driver opts.
                  </div>
                </div>
              </div>

              {/* Swarm Overlay Ports Quick Reference */}
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.78rem' }}>
                <div style={{ fontWeight: '700', color: '#fbbf24', marginBottom: '6px' }}>
                  Swarm & Multi-Host Overlay Network Required Firewall Ports:
                </div>
                <div style={{ color: 'var(--text-muted)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span>• <strong>Port 2377 TCP:</strong> Cluster management</span>
                  <span>• <strong>Port 7946 TCP/UDP:</strong> Node gossip control plane</span>
                  <span>• <strong>Port 4789 UDP:</strong> VXLAN data plane traffic</span>
                  <span>• <strong>IP Protocol 50 (ESP):</strong> IPsec encrypted overlays</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: STORAGE */}
      {activeSubTab === 'storage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#34d399', marginTop: 0, marginBottom: '6px' }}>
              Container Storage: Ephemeral Scratch vs Volumes vs Bind Mounts vs tmpfs
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              Containers are designed to be <strong>stateless and ephemeral</strong>. If a container crashes and is deleted, any data saved inside its root filesystem is destroyed forever. To persist data, Docker provides three distinct storage mechanisms:
            </p>

            {/* 3 Storage Types Comparison Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(14, 165, 233, 0.08)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ color: '#38bdf8', fontSize: '0.9rem' }}>1. Named Volumes (Best for Prod)</strong>
                  <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', fontSize: '0.66rem' }}>Managed by Docker</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Stored in <code>/var/lib/docker/volumes/</code>. Completely managed by Docker daemon, independent of container lifecycle, fastest I/O performance on Windows/Mac, easy to back up and migrate.
                </div>
                <div style={{ marginTop: '10px', fontFamily: 'monospace', fontSize: '0.72rem', color: '#a7f3d0', background: 'rgba(0,0,0,0.5)', padding: '6px 8px', borderRadius: '6px' }}>
                  docker run -v db_data:/var/lib/postgresql/data postgres
                </div>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ color: '#fbbf24', fontSize: '0.9rem' }}>2. Bind Mounts (Best for Dev)</strong>
                  <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontSize: '0.66rem' }}>Host Directory</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Directly maps a directory on the host computer (e.g. <code>$(pwd)/src</code>) into the container. When you edit code in VS Code on your laptop, the changes instantly reflect inside the container without rebuilding.
                </div>
                <div style={{ marginTop: '10px', fontFamily: 'monospace', fontSize: '0.72rem', color: '#a7f3d0', background: 'rgba(0,0,0,0.5)', padding: '6px 8px', borderRadius: '6px' }}>
                  docker run -v $(pwd)/src:/app/src:ro node:20
                </div>
              </div>

              <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ color: '#c084fc', fontSize: '0.9rem' }}>3. tmpfs Mounts (In-Memory)</strong>
                  <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontSize: '0.66rem' }}>RAM Only</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Stored strictly in host RAM memory. Never written to the host SSD/HDD. When the container stops, data vanishes immediately. Ideal for temporary decryption keys, session caches, and sensitive tokens.
                </div>
                <div style={{ marginTop: '10px', fontFamily: 'monospace', fontSize: '0.72rem', color: '#a7f3d0', background: 'rgba(0,0,0,0.5)', padding: '6px 8px', borderRadius: '6px' }}>
                  docker run --mount type=tmpfs,target=/app/cache nginx
                </div>
              </div>
            </div>

            {/* Volume Backup & Restore Recipe */}
            <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.84rem', marginBottom: '8px' }}>
                Production Volume Backup & Restore Pipeline
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: '700' }}>Backup Volume to Tarball:</span>
                  <pre style={{ margin: '4px 0 0 0', padding: '8px', background: 'rgba(0,0,0,0.6)', borderRadius: '6px', color: '#a7f3d0', fontFamily: 'monospace', fontSize: '0.74rem' }}>
                    docker run --rm -v db_data:/data -v $(pwd):/backup alpine tar czvf /backup/db_backup.tar.gz -C /data .
                  </pre>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: '700' }}>Restore Tarball into Volume:</span>
                  <pre style={{ margin: '4px 0 0 0', padding: '8px', background: 'rgba(0,0,0,0.6)', borderRadius: '6px', color: '#a7f3d0', fontFamily: 'monospace', fontSize: '0.74rem' }}>
                    docker run --rm -v db_data:/data -v $(pwd):/backup alpine tar xzvf /backup/db_backup.tar.gz -C /data
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: SECURITY */}
      {activeSubTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#34d399', marginTop: 0, marginBottom: '6px' }}>
              Container Security Hardening: The 6 Production Rules
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              By default, Docker containers run as Linux <code>root</code> (UID 0) with a default seccomp profile and partial capabilities. If a zero-day exploit breaches your application process, the attacker can attempt container escape. Follow these 6 rules for zero-trust hardening.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              {[
                {
                  rule: '1. Never Run as Root (Non-Root User)',
                  desc: 'Always declare USER 1001:1001 in your Dockerfile or pass --user 1001:1001. A non-root container process cannot manipulate host devices or install packages even if compromised.',
                  flag: '--user 1001:1001'
                },
                {
                  rule: '2. Drop All Linux Capabilities',
                  desc: 'Linux root possesses dozens of POSIX capabilities (e.g. CAP_SYS_ADMIN, CAP_NET_RAW). Strip them all and only grant what is strictly required to bind ports.',
                  flag: '--cap-drop ALL --cap-add NET_BIND_SERVICE'
                },
                {
                  rule: '3. Read-Only Root Filesystem',
                  desc: 'Prevent attackers from writing malicious web shells, cryptominers, or backdoors to disk by mounting rootfs as completely immutable.',
                  flag: '--read-only --tmpfs /tmp'
                },
                {
                  rule: '4. Block Privilege Escalation',
                  desc: 'Prevent child processes from obtaining more privileges than their parent via setuid binaries (e.g. sudo, su, ping).',
                  flag: '--security-opt no-new-privileges:true'
                },
                {
                  rule: '5. Seccomp Syscall Filtering',
                  desc: 'Restricts which Linux kernel syscalls can be executed by container processes, blocking dangerous syscalls like reboot, sys_ptrace, and kexec.',
                  flag: '--security-opt seccomp=default.json'
                },
                {
                  rule: '6. Vulnerability Scanning (Docker Scout)',
                  desc: 'Run automated CVE image analysis before pushing to production registries to detect vulnerable OpenSSL, glibc, or npm dependencies.',
                  flag: 'docker scout cves <image-name>'
                }
              ].map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(0, 0, 0, 0.45)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.86rem', marginBottom: '6px' }}>
                    {item.rule}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '8px' }}>
                    {item.desc}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: '#a7f3d0', background: 'rgba(0,0,0,0.6)', padding: '6px 8px', borderRadius: '6px' }}>
                    {item.flag}
                  </div>
                </div>
              ))}
            </div>

            {/* Fully Hardened Production Command Example */}
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#34d399', marginBottom: '6px' }}>
                Complete Hardened Production Docker Run Command:
              </div>
              <pre style={{
                margin: 0,
                padding: '14px',
                background: 'rgba(0, 0, 0, 0.75)',
                borderRadius: '8px',
                color: '#a7f3d0',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                lineHeight: 1.55,
                overflowX: 'auto'
              }}>
{`docker run -d --name production-hardened-api \\
  --user 1001:1001 \\
  --cap-drop ALL \\
  --cap-add NET_BIND_SERVICE \\
  --read-only \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --security-opt no-new-privileges:true \\
  --memory 512m \\
  --cpus 1.5 \\
  -p 80:80 \\
  my-app:v1.0`}
              </pre>
              <button
                onClick={() => copyToClipboard(`docker run -d --name production-hardened-api \\\n  --user 1001:1001 \\\n  --cap-drop ALL \\\n  --cap-add NET_BIND_SERVICE \\\n  --read-only \\\n  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\\n  --security-opt no-new-privileges:true \\\n  --memory 512m \\\n  --cpus 1.5 \\\n  -p 80:80 \\\n  my-app:v1.0`, 'hardened-run')}
                style={{ position: 'absolute', top: '30px', right: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: '#ffffff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {copiedSnippet === 'hardened-run' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copiedSnippet === 'hardened-run' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
