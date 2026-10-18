import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Shield, 
  Network, 
  HardDrive, 
  Activity, 
  Terminal, 
  Server,
  Box,
  Monitor,
  Laptop,
  Cable
} from 'lucide-react';

export default function ArchitectureExplorer() {
  const [selectedTopic, setSelectedTopic] = useState('hypervisor');
  const [deviceOsMode, setDeviceOsMode] = useState('hypervisor'); // 'hypervisor' (Windows/macOS) | 'native' (Linux)
  const [selectedNetworkDriver, setSelectedNetworkDriver] = useState('bridge');

  const topics = [
    {
      id: 'hypervisor',
      name: 'Device OS & Hypervisor Bridge',
      icon: <Monitor size={18} />,
      color: '#06b6d4',
      summary: 'How Docker connects the host device OS to dockerd via WSL2, Hyper-V, and Virtual Sockets.'
    },
    {
      id: 'namespaces',
      name: 'Linux Namespaces',
      icon: <Layers size={18} />,
      color: '#38bdf8',
      summary: 'Virtualizes and isolates process trees, networks, mount points, hostnames, and IPC.'
    },
    {
      id: 'cgroups',
      name: 'Control Groups (cgroups v2)',
      icon: <Cpu size={18} />,
      color: '#a855f7',
      summary: 'Enforces hardware limits on CPU shares, memory ceilings, IO bandwidth, and thread limits.'
    },
    {
      id: 'overlayfs',
      name: 'OverlayFS Layered Storage',
      icon: <HardDrive size={18} />,
      color: '#10b981',
      summary: 'Copy-on-write filesystem merging read-only image layers with an ephemeral writeable diff.'
    },
    {
      id: 'networking',
      name: 'Docker Networking & Drivers',
      icon: <Network size={18} />,
      color: '#0ea5e9',
      summary: 'Built-in drivers (bridge, host, overlay, macvlan, ipvlan), veth pairs, docker0, and iptables DNAT.'
    },
    {
      id: 'security',
      name: 'Seccomp & Capabilities',
      icon: <Shield size={18} />,
      color: '#f59e0b',
      summary: 'Dropping Linux root capabilities and filtering dangerous syscalls via Berkeley Packet Filters.'
    },
    {
      id: 'hardware',
      name: 'Motherboard & CPU Ring 0/3',
      icon: <Activity size={18} />,
      color: '#f43f5e',
      summary: 'Bare-metal hardware execution: CPU privilege rings, MMU page tables, and PCIe DMA.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Intro Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-intermediate" style={{ fontSize: '0.7rem' }}>
            System Internals & Virtualization
          </span>
          <span className="badge" style={{ fontSize: '0.7rem', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
            Device OS ↔ Hypervisor ↔ Linux Engine
          </span>
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
          Docker Internal Architecture & Kernel Primitives
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          Containers are <strong>not virtual machines</strong>—they are ordinary Linux processes isolated by kernel <strong>Namespaces</strong> and constrained by <strong>cgroups v2</strong>. When running on non-Linux devices (Windows or macOS), Docker utilizes a lightweight <strong>Type-1 / MicroVM Hypervisor (WSL2 / Hyper-V / Virtualization.framework)</strong> to host the Linux kernel and daemon while seamlessly bridging to the client host OS.
        </p>

        {/* Topic Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          marginTop: '18px'
        }}>
          {topics.map(t => {
            const isSelected = selectedTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? `1.5px solid ${t.color}` : '1px solid var(--border-subtle)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  textAlign: 'left',
                  boxShadow: isSelected ? `0 0 15px ${t.color}33` : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ color: t.color }}>{t.icon}</div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '600' }}>{t.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MINI SECTION: DEVICE OS, HYPERVISOR & DOCKER CONNECTION BRIDGE */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        borderRadius: '16px',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(15, 23, 42, 0.8) 50%, rgba(14, 165, 233, 0.06) 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Mini Section Header & Mode Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Monitor size={18} color="#06b6d4" />
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Device OS ↔ Hypervisor ↔ Docker Connection Topology
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Interactive view of how the client host OS connects across the hypervisor boundary to the Docker daemon (`dockerd`).
            </div>
          </div>

          {/* Toggle between Non-Linux (WSL2/Hypervisor) and Native Linux */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setDeviceOsMode('hypervisor')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: deviceOsMode === 'hypervisor' ? '700' : '400',
                color: deviceOsMode === 'hypervisor' ? '#ffffff' : 'var(--text-dim)',
                background: deviceOsMode === 'hypervisor' ? 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)' : 'transparent',
                boxShadow: deviceOsMode === 'hypervisor' ? '0 0 12px rgba(6, 182, 212, 0.4)' : 'none',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <Monitor size={14} />
              <span>Windows / macOS (Hypervisor / WSL2 Mode)</span>
            </button>

            <button
              onClick={() => setDeviceOsMode('native')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: deviceOsMode === 'native' ? '700' : '400',
                color: deviceOsMode === 'native' ? '#ffffff' : 'var(--text-dim)',
                background: deviceOsMode === 'native' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                boxShadow: deviceOsMode === 'native' ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <Laptop size={14} />
              <span>Native Linux (Direct Kernel Mode)</span>
            </button>
          </div>
        </div>

        {/* VISUAL PIPELINE FLOW OF NODES */}
        {deviceOsMode === 'hypervisor' ? (
          /* WINDOWS / MACOS (HYPERVISOR MODE) */
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              alignItems: 'stretch',
              marginBottom: '20px'
            }}>
              {/* NODE 1: Device Installed OS */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '12px',
                padding: '16px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Monitor size={18} color="#38bdf8" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase' }}>Layer 1: Host Device</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>Device Installed OS</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>
                    Windows 11 (NT Kernel) or macOS (Darwin/XNU). Runs desktop IDEs, browsers, and user shells.
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px' }}>
                  PowerShell / zsh / bash
                </div>
              </div>

              {/* NODE 2: Host Docker Client */}
              <div style={{
                background: 'rgba(14, 165, 233, 0.08)',
                border: '1px solid rgba(14, 165, 233, 0.35)',
                borderRadius: '12px',
                padding: '16px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Terminal size={18} color="#0ea5e9" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#0ea5e9', fontWeight: '700', textTransform: 'uppercase' }}>Layer 2: User CLI</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>Docker Client (Host)</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>
                    Native CLI executable (<code>docker.exe</code>) on the host OS. Formats REST JSON commands.
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#0ea5e9', fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px' }}>
                  \\.\pipe\docker_engine
                </div>
              </div>

              {/* NODE 3: Hypervisor Bridge (WSL2 / Hyper-V) */}
              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1.5px solid #a855f7',
                borderRadius: '12px',
                padding: '16px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 0 16px rgba(168, 85, 247, 0.25)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '10px',
                  fontSize: '0.62rem',
                  fontWeight: '800',
                  background: '#a855f7',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  textTransform: 'uppercase'
                }}>
                  Hypervisor Boundary
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Layers size={18} color="#c084fc" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: '700', textTransform: 'uppercase' }}>Layer 3: MicroVM</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>WSL2 / Hyper-V</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>
                    Type-1 / MicroVM layer running tailored Linux kernel. Uses AF_VSOCK (virtual socket) and VirtioFS.
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#c084fc', fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px' }}>
                  AF_VSOCK & VirtioFS
                </div>
              </div>

              {/* NODE 4: Docker Daemon inside VM */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '12px',
                padding: '16px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Server size={18} color="#10b981" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>Layer 4: Engine Core</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>dockerd in Linux VM</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>
                    Runs inside the Linux utility VM. Manages containerd, runc, OverlayFS, and bridge networking.
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#10b981', fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px' }}>
                  /run/containerd.sock
                </div>
              </div>

              {/* NODE 5: Containers & Application */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '12px',
                padding: '16px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box size={18} color="#f59e0b" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: '700', textTransform: 'uppercase' }}>Layer 5: Workload</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>Linux Containers</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>
                    Isolated applications executing within Linux namespaces and cgroups v2 inside the VM.
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px' }}>
                  PID 1 / eth0 / OverlayFS
                </div>
              </div>
            </div>

            {/* Hypervisor Communication Channels Explanation Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px'
            }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: '#06b6d4', fontWeight: '700', fontSize: '0.84rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cable size={14} /> 1. Control Socket: AF_VSOCK & Named Pipe
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                  Commands typed in PowerShell or CMD travel across <code>\\.\pipe\docker_engine</code> into WSL2 via <strong>AF_VSOCK</strong> (hypervisor virtual sockets), completely bypassing network TCP overhead.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: '#10b981', fontWeight: '700', fontSize: '0.84rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HardDrive size={14} /> 2. Filesystem Sharing: VirtioFS & 9P
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                  When bind-mounting <code>-v C:\projects:/app</code>, VirtioFS shares Windows host files directly into the Linux VM at <code>/mnt/c/projects</code> with real-time page cache coherency.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: '#a855f7', fontWeight: '700', fontSize: '0.84rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Network size={14} /> 3. Network Proxy: Localhost Forwarding
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                  A port proxy (WSL2 virtual switch / vpnkit) listens on host <code>localhost:8080</code> and transparently routes incoming packets into the Linux VM's <code>docker0</code> bridge.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* NATIVE LINUX (BARE-METAL MODE) */
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              alignItems: 'stretch',
              marginBottom: '20px'
            }}>
              {/* NODE 1: Native Linux Host */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1.5px solid #10b981',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Laptop size={18} color="#10b981" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>Host Operating System</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>Native Linux OS</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>
                    Ubuntu, Debian, RHEL, Arch Linux. The device kernel IS the container kernel. <strong>Zero hypervisor required!</strong>
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#10b981', fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px' }}>
                  Kernel: Linux 6.x
                </div>
              </div>

              {/* NODE 2: Native Docker Client */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Terminal size={18} color="#38bdf8" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase' }}>CLI Tool</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>Docker Client (/usr/bin/docker)</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>
                    Connects directly to local UNIX domain socket <code>/var/run/docker.sock</code> without crossing any VM or hypervisor boundary.
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px' }}>
                  /var/run/docker.sock
                </div>
              </div>

              {/* NODE 3: Native Daemon */}
              <div style={{
                background: 'rgba(14, 165, 233, 0.08)',
                border: '1px solid rgba(14, 165, 233, 0.35)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Server size={18} color="#0ea5e9" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#0ea5e9', fontWeight: '700', textTransform: 'uppercase' }}>Systemd Service</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>dockerd Daemon</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>
                    Runs as native host system daemon. Communicates via containerd and OCI runc directly on the host OS.
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#0ea5e9', fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px' }}>
                  systemctl start docker
                </div>
              </div>

              {/* NODE 4: Native Containers */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box size={18} color="#f59e0b" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: '700', textTransform: 'uppercase' }}>Bare-Metal Process</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>Isolated Container Tasks</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>
                    Direct execution on physical CPU Silicon Ring 3. Zero virtualization penalty, 100% bare-metal performance.
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px' }}>
                  Native Ring 3 Execution
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '0.8rem',
              color: '#a7f3d0'
            }}>
              <strong>Native Linux Advantage:</strong> On Linux, Docker containers share the exact same kernel as the host OS. There are no virtual machines, no second-level page tables, and no disk/socket translation overheads. Syscalls like <code>clone()</code> and <code>epoll_wait()</code> run straight on the CPU silicon.
            </div>
          </div>
        )}
      </div>

      {/* DEEP-DIVE CONTENT PANEL */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>
        {/* TOPIC 0: HYPERVISOR & DEVICE OS BRIDGE */}
        {selectedTopic === 'hypervisor' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Monitor size={24} color="#06b6d4" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Device OS & Hypervisor Integration: How Docker Runs on Windows & macOS
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Because Docker containers execute native Linux binaries (ELF format) and rely strictly on Linux kernel system calls (<code>clone</code>, <code>pivot_root</code>, <code>cgroup2fs</code>), non-Linux host operating systems cannot execute them directly on their native kernels (Windows NT or macOS Darwin). Docker bridges this gap using specialized Type-1 micro-hypervisors.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#06b6d4', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  1. Windows WSL2 & Hyper-V Architecture
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Docker Desktop for Windows leverages the <strong>Windows Subsystem for Linux 2 (WSL2)</strong> engine. Under the hood, Microsoft Hyper-V spins up a lightweight Utility VM running a real Microsoft-maintained Linux kernel that boots in under 1 second and consumes dynamically allocated RAM.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#06b6d4', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  2. macOS Virtualization.framework
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  On macOS (Intel and Apple Silicon M1/M2/M3), Docker Desktop uses Apple's native <strong>Virtualization.framework</strong> (or HyperKit). It executes an optimized Alpine Linux kernel inside a hypervisor sandbox with direct ARM64 / x86_64 CPU core mapping.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#06b6d4', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  3. AF_VSOCK (Zero-Network Sockets)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  The host <code>docker.exe</code> CLI does not need to send packets over regular TCP networks to reach the daemon. It communicates through <strong>AF_VSOCK</strong> (Virtual Socket), an ultra-fast inter-process communication bus designed specifically for hypervisor-to-guest communications.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#06b6d4', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  4. VirtioFS Cross-OS Filesystem Sharing
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  When mounting local host code (e.g. <code>C:\my-app</code> or <code>/Users/name/app</code>), Docker uses <strong>VirtioFS</strong>. It passes filesystem calls through shared memory, providing high-speed file watching and near-native read/write bandwidth.
                </div>
              </div>
            </div>

            {/* Architecture Comparison Table */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Architecture Comparison: Device OS vs Hypervisor vs Docker
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-focus)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '8px 12px' }}>Platform</th>
                      <th style={{ padding: '8px 12px' }}>Device OS Kernel</th>
                      <th style={{ padding: '8px 12px' }}>Hypervisor Layer</th>
                      <th style={{ padding: '8px 12px' }}>Docker Daemon Host</th>
                      <th style={{ padding: '8px 12px' }}>Client-Daemon Bridge</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '8px 12px', fontWeight: '700', color: '#10b981' }}>Linux (Bare-Metal)</td>
                      <td style={{ padding: '8px 12px' }}>Linux Kernel (Ring 0)</td>
                      <td style={{ padding: '8px 12px', color: 'var(--text-dim)' }}>None (Direct)</td>
                      <td style={{ padding: '8px 12px' }}>Direct on Host OS</td>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>/var/run/docker.sock</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '8px 12px', fontWeight: '700', color: '#38bdf8' }}>Windows 10 / 11</td>
                      <td style={{ padding: '8px 12px' }}>Windows NT Kernel</td>
                      <td style={{ padding: '8px 12px' }}>Microsoft Hyper-V (WSL2)</td>
                      <td style={{ padding: '8px 12px' }}>WSL2 Linux MicroVM</td>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>\\.\pipe\docker_engine / vsock</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', fontWeight: '700', color: '#a855f7' }}>macOS (Intel & M-Series)</td>
                      <td style={{ padding: '8px 12px' }}>macOS Darwin (XNU)</td>
                      <td style={{ padding: '8px 12px' }}>Virtualization.framework</td>
                      <td style={{ padding: '8px 12px' }}>Alpine Linux VM</td>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>/var/run/docker.sock / vpnkit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TOPIC 1: NAMESPACES */}
        {selectedTopic === 'namespaces' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={24} color="#38bdf8" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
                The 6 Fundamental Linux Namespaces
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Linux namespaces wrap a global system resource in an abstraction that makes it appear to the processes within the namespace that they have their own isolated instance of the resource.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  1. PID (Process ID)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  The container entrypoint process is mapped to PID 1 inside the container, giving it init responsibilities, while appearing as an ordinary host PID (e.g. PID 14820) to the host kernel.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  2. NET (Network Stack)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Isolates IP addresses, IP routing tables, port bindings, firewall rules, and network devices. The container gets its own virtual loopback (<code>lo</code>) and <code>eth0</code> interfaces.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  3. MNT (Mount Points)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Isolates the filesystem mount table. The container root (<code>/</code>) is decoupled from the host root via <code>pivot_root()</code> syscall, mounting the combined OverlayFS layers.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  4. UTS (Unix Timesharing)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Isolates the system hostname and NIS domain name. A container can assign its own hostname without changing the physical host's hostname.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  5. IPC (Inter-Process Comm)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Isolates System V IPC messages and POSIX shared memory (<code>/dev/shm</code>). Prevents rogue processes from reading another container's shared memory buffers.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  6. USER (User IDs & GIDs)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Maps container user IDs to distinct host user IDs (e.g. root UID 0 inside container can map to unprivileged UID 100000 on the host).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOPIC 2: CGROUPS */}
        {selectedTopic === 'cgroups' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={24} color="#a855f7" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Control Groups (cgroups v2) Hardware Enforcement
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              While namespaces govern <strong>what a process can see</strong>, cgroups govern <strong>how much hardware a process can use</strong>. Docker uses the unified cgroup v2 hierarchy mounted under <code>/sys/fs/cgroup/system.slice/</code>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#c084fc', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  CPU Controller (<code>cpu.max</code>)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Enforces CFS quota and period. Format: <code>$QUOTA $PERIOD</code> (e.g. <code>150000 100000</code> allows 1.5 cores). Tasks that exceed their quota are throttled by the scheduler.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#c084fc', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  Memory Controller (<code>memory.max</code>)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Hard resident memory ceiling. If container memory hits this limit, the Linux kernel invokes <code>mem_cgroup_out_of_memory()</code> and terminates the process with exit code 137.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#c084fc', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  PID Controller (<code>pids.max</code>)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Limits max concurrent process tasks. Prevents catastrophic fork-bomb attacks from starving the host OS of PID table entries.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#c084fc', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  Core Pinning (<code>cpuset.cpus</code>)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Restricts threads exclusively to physical CPU core numbers (e.g. <code>0,2</code> or <code>0-3</code>). Bypasses thread migration across different CPU sockets.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOPIC 3: OVERLAYFS */}
        {selectedTopic === 'overlayfs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HardDrive size={24} color="#10b981" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
                OverlayFS: Layered Copy-on-Write Storage
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Docker images are composed of immutable layers. When you run a container, Docker stacks an ephemeral read-write layer on top using Linux OverlayFS.
            </p>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '18px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#34d399', fontWeight: '700' }}>[MERGED VIEW]</span> `/var/lib/docker/overlay2/[id]/merged`
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>What the container process sees as its root filesystem (/)</div>
              </div>

              <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>▲ Stacks Together Via Linux VFS Mount ▲</div>

              <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#fbbf24', fontWeight: '700' }}>[UPPERDIR - Writable Layer]</span> `/var/lib/docker/overlay2/[id]/diff`
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Captures all container file writes, edits, and deletions (whiteouts). Deleted when container is removed.</div>
              </div>

              <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>[LOWERDIR - Read-Only Image Layers]</span> Layer 1 (Node.js), Layer 2 (Ubuntu Base)
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Shared across multiple containers simultaneously without duplication.</div>
              </div>
            </div>
          </div>
        )}

        {/* TOPIC 4: NETWORKING */}
        {selectedTopic === 'networking' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Network size={24} color="#0ea5e9" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Docker Networking: Built-in Drivers, veth Pairs, & iptables NAT
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              How does network traffic move from the physical host Ethernet card into an isolated container? Docker connects isolated Network namespaces using virtual Ethernet (<code>veth</code>) tunnel pairs.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  1. Virtual Cable: veth Pair
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Acts like a bi-directional software Ethernet wire. One end lives inside the container netns as <code>eth0</code>; the other end lives on the host attached to <code>docker0</code> bridge.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  2. Linux Bridge: docker0
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  A virtual software Ethernet switch operating at Layer 2 (MAC addressing) that forwards frames between all connected containers on <code>172.17.0.0/16</code>.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  3. iptables NAT & Port Forwarding
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  When <code>-p 80:80</code> is given, Docker installs a Linux Netfilter DNAT rule: packets hitting host port 80 are rewritten to target container IP <code>172.17.0.2:80</code>.
                </div>
              </div>
            </div>

            {/* The Complete Set of Built-in Docker Network Drivers */}
            <div style={{
              marginTop: '10px',
              padding: '20px',
              borderRadius: '14px',
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(14, 165, 233, 0.35)',
              boxShadow: '0 0 20px rgba(14, 165, 233, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Network size={18} color="#38bdf8" />
                    The Complete Set of Built-in Docker Network Drivers
                  </h4>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Core Linux network drivers implemented by Docker daemon (<code>libnetwork</code>)
                  </div>
                </div>
                <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.4)', fontSize: '0.68rem', fontWeight: '700' }}>
                  6 Native Drivers
                </span>
              </div>

              {/* Driver Quick Selector Buttons */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {[
                  { id: 'bridge', label: 'bridge (Default)' },
                  { id: 'host', label: 'host (High Perf)' },
                  { id: 'none', label: 'none (Isolated)' },
                  { id: 'overlay', label: 'overlay (Swarm/VXLAN)' },
                  { id: 'macvlan', label: 'macvlan (Direct MAC)' },
                  { id: 'ipvlan', label: 'ipvlan (Parent MAC)' }
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedNetworkDriver(d.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: selectedNetworkDriver === d.id ? '700' : '500',
                      background: selectedNetworkDriver === d.id ? 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)' : 'rgba(255, 255, 255, 0.06)',
                      color: selectedNetworkDriver === d.id ? '#ffffff' : 'var(--text-dim)',
                      border: selectedNetworkDriver === d.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Complete Comparison Table */}
              <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <th style={{ padding: '10px 12px', color: '#38bdf8' }}>Driver</th>
                      <th style={{ padding: '10px 12px', color: '#cbd5e1' }}>Primary Use Case</th>
                      <th style={{ padding: '10px 12px', color: '#34d399' }}>Network Isolation</th>
                      <th style={{ padding: '10px 12px', color: '#fbbf24' }}>Routing Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        driver: 'bridge',
                        useCase: 'Standalone containers on a single host.',
                        isolation: 'High (Internal private subnet).',
                        routing: 'NAT / Port mapping.'
                      },
                      {
                        driver: 'host',
                        useCase: 'Maximum raw network performance.',
                        isolation: 'None (Shares host network stack).',
                        routing: 'Direct host ports.'
                      },
                      {
                        driver: 'none',
                        useCase: 'Completely isolated tasks/batch jobs.',
                        isolation: 'Absolute isolation.',
                        routing: 'Loopback interface only.'
                      },
                      {
                        driver: 'overlay',
                        useCase: 'Multi-host routing & Swarm clusters.',
                        isolation: 'High (Encrypted virtual network).',
                        routing: 'VXLAN tunnel across hosts.'
                      },
                      {
                        driver: 'macvlan',
                        useCase: 'Legacy apps needing direct physical network access.',
                        isolation: 'Low (Visible as physical devices).',
                        routing: 'Unique MAC assigned to each container.'
                      },
                      {
                        driver: 'ipvlan',
                        useCase: 'High-density spaces where MAC addresses are limited.',
                        isolation: 'Low (Shares parent MAC).',
                        routing: 'Unique IP assigned directly to container.'
                      }
                    ].map((row) => {
                      const isSelected = selectedNetworkDriver === row.driver;
                      return (
                        <tr
                          key={row.driver}
                          onClick={() => setSelectedNetworkDriver(row.driver)}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            background: isSelected ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <td style={{ padding: '10px 12px', fontWeight: '700', color: isSelected ? '#38bdf8' : '#ffffff' }}>
                            <code>{row.driver}</code>
                          </td>
                          <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{row.useCase}</td>
                          <td style={{ padding: '10px 12px', color: '#34d399' }}>{row.isolation}</td>
                          <td style={{ padding: '10px 12px', color: '#fbbf24' }}>{row.routing}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Selected Driver Detailed Architecture Spotlight */}
              <div style={{
                padding: '14px 16px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontSize: '0.78rem',
                lineHeight: '1.6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ color: '#38bdf8', fontSize: '0.84rem' }}>
                    Active Driver Inspector: <code>docker run --network {selectedNetworkDriver}</code>
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    libnetwork provider
                  </span>
                </div>

                {selectedNetworkDriver === 'bridge' && (
                  <div>
                    <span style={{ color: '#cbd5e1' }}>
                      Creates a private internal subnet (default: <code>172.17.0.0/16</code>) linked via virtual ethernet (<code>veth</code>) pairs to the Linux bridge <code>docker0</code>.
                      Outbound traffic traverses the physical network via iptables MASQUERADE (SNAT), while inbound traffic requires explicit port mappings (<code>-p 8080:80</code>) translated via DNAT.
                    </span>
                    <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#34d399' }}>
                      $ docker network create --driver bridge my-app-net
                    </div>
                  </div>
                )}

                {selectedNetworkDriver === 'host' && (
                  <div>
                    <span style={{ color: '#cbd5e1' }}>
                      Bypasses container network isolation completely. The container shares the host's exact network namespace (no private IP or virtual interface).
                      If a container process listens on port 80, it binds directly to port 80 on the physical host machine, eliminating all NAT packet traversal overhead.
                    </span>
                    <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#34d399' }}>
                      $ docker run -d --network host --name high-perf-proxy nginx
                    </div>
                  </div>
                )}

                {selectedNetworkDriver === 'none' && (
                  <div>
                    <span style={{ color: '#cbd5e1' }}>
                      Gives the container its own isolated network namespace with only a loopback interface (<code>127.0.0.1</code>) and zero external network interfaces.
                      Ideal for high-security cryptographic batch tasks, batch compilation, or offline air-gapped data transformations.
                    </span>
                    <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#34d399' }}>
                      $ docker run --rm --network none alpine ifconfig
                    </div>
                  </div>
                )}

                {selectedNetworkDriver === 'overlay' && (
                  <div>
                    <span style={{ color: '#cbd5e1' }}>
                      Spans across multiple physical Docker hosts or Kubernetes/Swarm nodes. Encapsulates Layer-2 container Ethernet frames inside Layer-3 UDP packets (port 4789) using <strong>VXLAN overlays</strong>.
                      Supports optional on-wire IPsec encryption (AES-GCM) so containers on Host A can talk securely to containers on Host B across untrusted cloud networks.
                    </span>
                    <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#34d399' }}>
                      $ docker network create -d overlay --opt encrypted multi-host-net
                    </div>
                  </div>
                )}

                {selectedNetworkDriver === 'macvlan' && (
                  <div>
                    <span style={{ color: '#cbd5e1' }}>
                      Assigns a unique, distinct hardware MAC address to each container from the host physical network interface (e.g. <code>eth0</code>).
                      To external enterprise switches and routers, every container appears as a physical hardware server on the LAN with its own assigned DHCP/static IP.
                    </span>
                    <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#34d399' }}>
                      $ docker network create -d macvlan --subnet=192.168.1.0/24 -o parent=eth0 physical-net
                    </div>
                  </div>
                )}

                {selectedNetworkDriver === 'ipvlan' && (
                  <div>
                    <span style={{ color: '#cbd5e1' }}>
                      Similar to macvlan, but all containers share the parent physical interface's MAC address while having unique IP addresses.
                      Essential for environments where switches limit MAC address table capacity or cloud security policies block unfamiliar MAC addresses.
                    </span>
                    <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#34d399' }}>
                      $ docker network create -d ipvlan -o ipvlan_mode=l2 --subnet=192.168.10.0/24 -o parent=eth0 ip-pool
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TOPIC 5: SECURITY */}
        {selectedTopic === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={24} color="#f59e0b" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Zero-Trust Container Security: Capabilities & Seccomp
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Even if a container process runs as <code>root</code> (UID 0), Docker restricts its powers via Linux Capabilities and Seccomp BPF syscall filters to prevent container breakout exploits.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#fbbf24', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  Linux Capabilities (Dropped by Default)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Docker drops dangerous capabilities such as <code>CAP_SYS_ADMIN</code>, <code>CAP_SYS_MODULE</code> (loading kernel drivers), <code>CAP_SYS_RAWIO</code> (direct hardware bus writes), and <code>CAP_SYS_BOOT</code>.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#fbbf24', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  Seccomp BPF Syscall Whitelist
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Out of ~450 Linux system calls, Docker's default seccomp profile disables over 40 dangerous syscalls (like <code>reboot</code>, <code>kexec_load</code>, <code>swapon</code>, <code>clone3</code> with new user namespaces).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOPIC 6: HARDWARE */}
        {selectedTopic === 'hardware' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={24} color="#f43f5e" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Motherboard & Hardware Level Execution (Ring 0 vs Ring 3)
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Unlike virtual machines (which incur heavy CPU context switching into hypervisor VMX root mode), container instructions run natively on the CPU at bare-metal silicon speeds.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#f43f5e', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  CPU Privilege Ring 3 (User Space)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  Application code inside the container (e.g. Nginx, Python, Node.js) executes in unprivileged CPU Ring 3, unable to access physical motherboard hardware directly.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#f43f5e', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  CPU Privilege Ring 0 (Kernel Space)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  When the container invokes a syscall (<code>write</code>, <code>epoll_wait</code>), the CPU switches via <code>sysenter</code>/<code>syscall</code> instruction into Ring 0, where the host Linux kernel executes the request.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#f43f5e', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  MMU & TLB Virtual Memory
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  The CPU Memory Management Unit (MMU) uses ordinary host page tables with CR3 register base address. No nested second-level page table (EPT/NPT) latency penalty!
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: '#f43f5e', fontWeight: '700', fontSize: '0.92rem', marginBottom: '4px' }}>
                  Direct Memory Access (DMA)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  NVMe flash storage and network controllers use PCIe bus DMA to transfer packets and file buffers directly into physical DDR5 RAM without CPU cycle burning.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
