import React, { useState } from 'react';
import {
  BookOpen,
  Terminal,
  Cpu,
  Layers,
  Server,
  HardDrive,
  Shield,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ArrowRight,
  Monitor,
  Laptop,
  Zap,
  BarChart3,
  Clock,
  Boxes,
  Rocket,
  ChevronRight,
  FileCode,
  Sparkles,
  Network,
  Package
} from 'lucide-react';
import SuspenseLoader from './common/SuspenseLoader';

const DockerImagesGuide = React.lazy(() => import('./docker/DockerImagesGuide'));
const DockerContainersGuide = React.lazy(() => import('./docker/DockerContainersGuide'));
const DockerComposeGuide = React.lazy(() => import('./docker/DockerComposeGuide'));

export default function DockerTutorial({ onNavigateToSimulator }) {
  const [activeModule, setActiveModule] = useState('all'); // 'all' | 'intro' | 'images' | 'containers' | 'compose'
  const [activeInstallPlatform, setActiveInstallPlatform] = useState('windows'); // 'windows' | 'mac' | 'linux'
  const [copiedSnippet, setCopiedSnippet] = useState(null);
  const [activeChartMetric, setActiveChartMetric] = useState('startup'); // 'startup' | 'ram' | 'storage' | 'cpu' | 'density'
  const [selectedDriver, setSelectedDriver] = useState('bridge');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const COMPARISON_METRICS = {
    startup: {
      title: 'Startup & Boot Time',
      unit: 'Seconds',
      subtitle: 'How long until the application is ready to serve traffic',
      containerVal: '0.2s',
      containerPercent: 4,
      containerColor: '#10b981',
      vmVal: '45.0s',
      vmPercent: 90,
      vmColor: '#ef4444',
      ratioNote: 'Containers start ~225x faster because they do not boot a duplicate guest operating system!'
    },
    ram: {
      title: 'Base Memory (RAM) Overhead',
      unit: 'Megabytes',
      subtitle: 'Idling memory consumption before user workload begins',
      containerVal: '15 MB',
      containerPercent: 3,
      containerColor: '#10b981',
      vmVal: '1,500 MB',
      vmPercent: 95,
      vmColor: '#ef4444',
      ratioNote: 'Containers share host kernel memory; VMs duplicate full guest kernel & system daemons in RAM.'
    },
    storage: {
      title: 'Disk Storage Footprint',
      unit: 'Megabytes / Gigabytes',
      subtitle: 'Storage required on host drive per isolated environment',
      containerVal: '85 MB',
      containerPercent: 5,
      containerColor: '#10b981',
      vmVal: '20,000 MB (20GB)',
      vmPercent: 95,
      vmColor: '#ef4444',
      ratioNote: 'Docker image layers are shared across containers; VMs duplicate entire virtual hard disks (.vmdk/.vhdx).'
    },
    cpu: {
      title: 'CPU Performance Overhead',
      unit: '% Lost to Virtualization',
      subtitle: 'Percentage of CPU clock cycles lost to virtualization layer translation',
      containerVal: '0.5% (Near Native)',
      containerPercent: 5,
      containerColor: '#10b981',
      vmVal: '12.0% (Hypervisor)',
      vmPercent: 75,
      vmColor: '#ef4444',
      ratioNote: 'Containers execute directly on CPU silicon Ring 3; VMs trap privileged instructions into hypervisor VMX root mode.'
    },
    density: {
      title: 'Instance Density per Server',
      unit: 'Instances on 32GB RAM Host',
      subtitle: 'Maximum number of concurrent isolated applications running on one physical machine',
      containerVal: '350+ Containers',
      containerPercent: 95,
      containerColor: '#10b981',
      vmVal: '12 - 16 VMs',
      vmPercent: 12,
      vmColor: '#ef4444',
      ratioNote: 'Container density is over 20x higher, slashing cloud infrastructure compute bills.'
    }
  };

  const selectedMetric = COMPARISON_METRICS[activeChartMetric];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* HERO BANNER */}
      <div className="glass-panel" style={{
        padding: '32px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(14, 165, 233, 0.08) 50%, rgba(99, 102, 241, 0.08) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span className="badge" style={{
            background: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            fontSize: '0.74rem'
          }}>
            Docker 101 Handbook
          </span>
          <span className="badge" style={{
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            fontSize: '0.74rem'
          }}>
            Architecture, VMs & Install
          </span>
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: '800',
          letterSpacing: '-0.02em',
          margin: '0 0 10px 0',
          background: 'linear-gradient(to right, #ffffff, #fbbf24, #38bdf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Docker Fundamentals, Hypervisor Architecture & Installation
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.96rem',
          maxWidth: '880px',
          margin: '0 0 20px 0',
          lineHeight: 1.6
        }}>
          Learn what Docker is, why it transformed modern software engineering, how containers compare with Virtual Machines (VMs) and Hypervisors through visual graphs, and how to install Docker on Windows, macOS, and Linux.
        </p>

        {/* Module Master Navigation Switcher */}
        <div style={{
          marginTop: '18px',
          marginBottom: '16px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          background: 'rgba(0, 0, 0, 0.45)',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {[
            { id: 'all', label: 'All Modules (Complete Handbook)', badge: '10 Sections' },
            { id: 'intro', label: '1. Intro, VMs & Install', badge: 'Sec 1-7' },
            { id: 'images', label: '2. Docker Images', badge: 'Layers, Storage, Optimize' },
            { id: 'containers', label: '3. Docker Containers', badge: 'Lifecycle, Net, Storage, Sec' },
            { id: 'compose', label: '4. Docker Compose', badge: 'Commands, Multi-Tier, Secrets' }
          ].map(m => {
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)' : 'transparent',
                  border: isActive ? '1px solid #38bdf8' : '1px solid transparent',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 0 16px rgba(14, 165, 233, 0.35)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{m.label}</span>
                <span style={{
                  fontSize: '0.66rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? '#ffffff' : 'var(--text-dim)'
                }}>
                  {m.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Table of Contents Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { label: '1. What is Docker?', href: '#what-is-docker', mod: 'intro' },
            { label: '2. How Docker Helps Us', href: '#how-docker-helps', mod: 'intro' },
            { label: '3. Containers vs VMs', href: '#vms-vs-containers', mod: 'intro' },
            { label: '4. Hypervisor Mechanics', href: '#hypervisor-mechanics', mod: 'intro' },
            { label: '5. How to Install Docker', href: '#how-to-install', mod: 'intro' },
            { label: '6. Hello-World Verification', href: '#hello-world', mod: 'intro' },
            { label: '7. Docker Networking Drivers', href: '#docker-networking', mod: 'intro' },
            { label: '8. Docker Images', href: '#docker-images', mod: 'images' },
            { label: '9. Docker Containers', href: '#docker-containers', mod: 'containers' },
            { label: '10. Docker Compose', href: '#docker-compose', mod: 'compose' }
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={() => {
                if (activeModule !== 'all' && activeModule !== item.mod) {
                  setActiveModule('all');
                }
              }}
              style={{
                fontSize: '0.76rem',
                color: 'var(--text-main)',
                textDecoration: 'none',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>{item.label}</span>
              <ChevronRight size={12} color="var(--text-dim)" />
            </a>
          ))}
        </div>
      </div>

      {/* SECTIONS 1 - 7: INTRO, VMS, HYPERVISORS, INSTALL & NETWORKING */}
      {(activeModule === 'all' || activeModule === 'intro') && (
        <>
          {/* SECTION 1: WHAT IS DOCKER? */}
          <section id="what-is-docker" className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Boxes size={20} color="#38bdf8" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                  1. What is Docker?
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Standardized software packaging and execution platform
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              <strong>Docker</strong> is an open-source platform that enables developers to package an application along with all of its dependencies, runtimes, system libraries, configuration files, and tools into a single lightweight, self-contained executable unit called a <strong>Container</strong>.
            </p>

            {/* The Shipping Container Metaphor */}
            <div style={{
              background: 'rgba(14, 165, 233, 0.08)',
              border: '1px solid rgba(14, 165, 233, 0.25)',
              borderRadius: '12px',
              padding: '18px 20px',
              marginBottom: '20px'
            }}>
              <div style={{ fontWeight: '700', color: '#38bdf8', fontSize: '0.92rem', marginBottom: '6px' }}>
                🚢 The Real-World Metaphor: Standardized Shipping Containers
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                Before the 1950s, transporting goods required custom crating, manual loading, and frequent cargo damage. The invention of the standardized steel intermodal shipping container revolutionized global trade: ships, trains, cranes, and trucks only needed to know how to move the standard container box, regardless of whether it contained bananas, computers, or automobiles.
                <br /><br />
                <strong>Docker did the exact same thing for software.</strong> The cloud, the server, or the local developer laptop only needs to know how to execute the Docker container, regardless of whether it contains Python 3.12, Node.js, Java, PostgreSQL, or Nginx.
              </div>
            </div>

            {/* 3 Core Concepts: Image vs Container vs Registry */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FileCode size={18} color="#38bdf8" />
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#ffffff' }}>Docker Image</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  The <strong>blueprint or recipe</strong>. An immutable, read-only template built from a <code>Dockerfile</code>. Contains application source code, system binaries, libraries, and instructions.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Zap size={18} color="#10b981" />
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#ffffff' }}>Docker Container</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  The <strong>running instance</strong> of an image. If the image is a class, the container is an instantiated object in memory. Has its own isolated network, process tree, and writable filesystem scratch layer.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Server size={18} color="#a855f7" />
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#ffffff' }}>Docker Registry (Hub)</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  The <strong>library or marketplace</strong> (like Docker Hub, GitHub Container Registry, AWS ECR). Stores and distributes millions of pre-packaged images across the world with one <code>docker pull</code>.
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: HOW DOCKER HELPS US */}
          <section id="how-docker-helps" className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Rocket size={20} color="#34d399" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                  2. How Docker Helps Us: The 6 Superpowers
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Why millions of companies and developers rely on Docker daily
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {[
                {
                  title: 'Eliminates "It Works On My Machine!"',
                  desc: 'No more debugging missing DLLs, conflicting Python/Node versions, or differing OS packages between developer laptops and production servers. If it runs in the container, it runs anywhere identically.',
                  color: '#38bdf8',
                  icon: Sparkles
                },
                {
                  title: 'Ultra-Fast Millisecond Spin-Up',
                  desc: 'Because a container is merely a bounded OS process rather than a virtual machine booting an entire kernel, containers launch in 50 to 500 milliseconds, enabling instant autoscaling.',
                  color: '#10b981',
                  icon: Clock
                },
                {
                  title: 'Massive Hardware Cost Savings',
                  desc: 'A single 32GB server can host 300+ containers because they share the host OS kernel and memory page cache, whereas the same hardware could only handle 10-15 heavy virtual machines.',
                  color: '#f59e0b',
                  icon: BarChart3
                },
                {
                  title: 'Microservices & Process Isolation',
                  desc: 'Enables splitting monolithic apps into independently scaled microservices (Frontend, API, Auth, Database). If one container crashes or exhausts memory, neighbors remain completely unaffected.',
                  color: '#a855f7',
                  icon: Shield
                },
                {
                  title: 'Instant Production Rollbacks',
                  desc: 'Every image build produces an immutable cryptographic SHA256 digest and semantic tag. If a bug reaches production, rolling back to the previous known-good image takes literally 2 seconds.',
                  color: '#ec4899',
                  icon: Zap
                },
                {
                  title: 'Multi-Cloud Portability',
                  desc: 'Avoid vendor lock-in. A container tested on your local laptop runs with zero modifications on AWS ECS/EKS, Google Cloud GKE/Cloud Run, Microsoft Azure AKS, or on-premise bare-metal servers.',
                  color: '#06b6d4',
                  icon: Monitor
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: `${item.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={16} color={item.color} />
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>
                        {item.title}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {item.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: HOW DOCKER WORKS WITH HYPERVISOR & VM TECHNOLOGY [GRAPH & CHARTS] */}
          <section id="vms-vs-containers" className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={20} color="#c084fc" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                  3. Containers vs Virtual Machines (VMs) & Hypervisors
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Side-by-side structural comparison and comparative benchmark graphs
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Understanding the architectural difference between <strong>Virtual Machines (VMs)</strong> and <strong>Docker Containers</strong> is the cornerstone of modern DevOps.
            </p>

            {/* SIDE-BY-SIDE ARCHITECTURAL TOPOLOGY GRAPH */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
              marginBottom: '28px'
            }}>
              {/* ARCHITECTURE 1: TRADITIONAL VIRTUAL MACHINES (HEAVY) */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1.5px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#f87171' }}>
                    Traditional Virtual Machines (VMs)
                  </div>
                  <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', fontSize: '0.68rem' }}>
                    Hardware Virtualization (Heavy)
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Every VM bundles an entire copy of an operating system, its own kernel, device drivers, and dedicated RAM/disk allocation.
                </div>

                {/* Stack Visualizer */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                  <div style={{ background: 'rgba(239, 68, 68, 0.25)', border: '1px solid #ef4444', padding: '10px', borderRadius: '6px', textAlign: 'center', color: '#ffffff' }}>
                    App A (Port 80) &nbsp;|&nbsp; App B (Port 443)
                  </div>
                  <div style={{ background: 'rgba(239, 68, 68, 0.18)', border: '1px solid rgba(239, 68, 68, 0.5)', padding: '8px', borderRadius: '6px', textAlign: 'center', color: '#fca5a5' }}>
                    Bins & System Libraries (Python, Node, glibc)
                  </div>
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.35)',
                    border: '1.5px solid #ef4444',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#ffffff',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)'
                  }}>
                    <strong>[!] DUPLICATE GUEST OS (Full Linux / Windows Kernel)</strong>
                    <div style={{ fontSize: '0.7rem', color: '#fca5a5', marginTop: '2px' }}>Consumes 1GB - 4GB RAM + 10GB-30GB Disk just to idle!</div>
                  </div>
                  <div style={{ background: 'rgba(168, 85, 247, 0.2)', border: '1px solid #a855f7', padding: '10px', borderRadius: '6px', textAlign: 'center', color: '#c084fc' }}>
                    Hypervisor (Type-1/Type-2: VMware, VirtualBox, KVM, Hyper-V)
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '10px', borderRadius: '6px', textAlign: 'center', color: '#ffffff' }}>
                    Host Operating System & Physical Motherboard Hardware
                  </div>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#fca5a5', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px' }}>
                  ⚠️ Drawback: Massive RAM/CPU waste, slow minutes-long booting, huge virtual disk images.
                </div>
              </div>

              {/* ARCHITECTURE 2: DOCKER CONTAINERIZATION (LIGHTWEIGHT) */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1.5px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#34d399' }}>
                    Docker Containers
                  </div>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', fontSize: '0.68rem' }}>
                    OS Process Isolation (Lightweight)
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Containers share the host operating system kernel directly. No guest OS, no duplicate kernel, near-zero startup time!
                </div>

                {/* Stack Visualizer */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #10b981', padding: '10px', borderRadius: '6px', textAlign: 'center', color: '#ffffff' }}>
                      Container A<br /><span style={{ fontSize: '0.68rem', color: '#6ee7b7' }}>App + Libs Only</span>
                    </div>
                    <div style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #10b981', padding: '10px', borderRadius: '6px', textAlign: 'center', color: '#ffffff' }}>
                      Container B<br /><span style={{ fontSize: '0.68rem', color: '#6ee7b7' }}>App + Libs Only</span>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(14, 165, 233, 0.25)',
                    border: '1.5px solid #0ea5e9',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#ffffff',
                    boxShadow: '0 0 10px rgba(14, 165, 233, 0.3)'
                  }}>
                    <strong>Docker Engine (dockerd, containerd, runc)</strong>
                    <div style={{ fontSize: '0.7rem', color: '#7dd3fc', marginTop: '2px' }}>Manages Linux Namespaces & cgroups v2 resource limits</div>
                  </div>
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid #10b981',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#34d399'
                  }}>
                    <strong>SINGLE SHARED HOST LINUX KERNEL (Ring 0)</strong>
                    <div style={{ fontSize: '0.7rem', color: '#6ee7b7', marginTop: '2px' }}>Zero guest OS duplicate overhead! All containers share 1 kernel.</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '10px', borderRadius: '6px', textAlign: 'center', color: '#ffffff' }}>
                    Host Operating System & Physical Motherboard Hardware
                  </div>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#6ee7b7', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px' }}>
                  ✅ Winner: Starts in 100ms, consumes 10-30MB RAM base, shares image layers via OverlayFS.
                </div>
              </div>
            </div>

            {/* COMPARATIVE METRICS BAR GRAPH CHART */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
                    Interactive Comparative Benchmark Chart
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Select a performance metric to see the comparative benchmark graph
                  </div>
                </div>

                {/* Metric Selector Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    { id: 'startup', label: 'Startup Time' },
                    { id: 'ram', label: 'RAM Overhead' },
                    { id: 'storage', label: 'Storage Size' },
                    { id: 'cpu', label: 'CPU Efficiency' },
                    { id: 'density', label: 'Server Density' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setActiveChartMetric(m.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.76rem',
                        fontWeight: activeChartMetric === m.id ? '700' : '400',
                        color: activeChartMetric === m.id ? '#ffffff' : 'var(--text-dim)',
                        background: activeChartMetric === m.id ? 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)' : 'rgba(255,255,255,0.04)',
                        border: activeChartMetric === m.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer'
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIVE METRIC GRAPH DISPLAY */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38bdf8' }}>
                      {selectedMetric.title}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedMetric.subtitle}</div>
                  </div>
                  <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                    Unit: {selectedMetric.unit}
                  </span>
                </div>

                {/* Docker Container Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Boxes size={14} /> Docker Container
                    </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#34d399', fontSize: '0.9rem' }}>
                      {selectedMetric.containerVal}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '22px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '6px', overflow: 'hidden', padding: '2px' }}>
                    <div style={{
                      width: `${Math.max(selectedMetric.containerPercent, 6)}%`,
                      height: '100%',
                      background: 'linear-gradient(to right, #059669, #10b981)',
                      borderRadius: '4px',
                      boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>

                {/* Virtual Machine Bar */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Server size={14} /> Virtual Machine (VM)
                    </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#f87171', fontSize: '0.9rem' }}>
                      {selectedMetric.vmVal}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '22px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '6px', overflow: 'hidden', padding: '2px' }}>
                    <div style={{
                      width: `${Math.max(selectedMetric.vmPercent, 6)}%`,
                      height: '100%',
                      background: 'linear-gradient(to right, #b91c1c, #ef4444)',
                      borderRadius: '4px',
                      boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>

                {/* Takeaway Note */}
                <div style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '0.8rem',
                  color: '#bae6fd'
                }}>
                  💡 <strong>Architectural Takeaway:</strong> {selectedMetric.ratioNote}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: HOW DOCKER WORKS INSIDE AN OS WITH VM TECHNOLOGY */}
          <section id="hypervisor-mechanics" className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Monitor size={20} color="#06b6d4" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                  4. How Docker Works Inside Windows & macOS with Hypervisor MicroVMs
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Why and how Docker uses hypervisors when you are NOT running native Linux
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              A common question is: <em>"If Docker doesn't use VMs, why does Docker Desktop on Windows and Mac require WSL2 or a Hypervisor?"</em>
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '700', color: '#06b6d4', fontSize: '0.9rem', marginBottom: '6px' }}>
                  The Challenge: The Kernel Mismatch
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Docker containers run compiled Linux ELF executables and require Linux system calls (<code>clone</code>, <code>pivot_root</code>, <code>unshare</code>, <code>cgroups</code>). Windows has an NT Kernel; macOS has an XNU/Darwin kernel. Neither natively understands Linux syscalls.
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '700', color: '#06b6d4', fontSize: '0.9rem', marginBottom: '6px' }}>
                  The Solution: Lightweight MicroVM
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  On Windows, Microsoft Hyper-V runs <strong>WSL2</strong> (Windows Subsystem for Linux), booting a custom Linux kernel in less than 1 second. On macOS, Docker Desktop uses Apple's native <strong>Virtualization.framework</strong> to run a tailored Alpine Linux microVM.
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '700', color: '#06b6d4', fontSize: '0.9rem', marginBottom: '6px' }}>
                  The Zero-Overhead Bridge (vsock)
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  The Docker CLI running on Windows or Mac connects across the hypervisor boundary to <code>dockerd</code> using <strong>AF_VSOCK</strong> (Virtual Sockets) or named pipes (<code>\\.\pipe\docker_engine</code>). It communicates with zero TCP network stack delay.
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: HOW TO INSTALL DOCKER */}
          <section id="how-to-install" className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Download size={20} color="#fbbf24" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                  5. How to Install Docker (Step-by-Step for All Platforms)
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Official installation instructions with one-click copyable terminal commands
                </div>
              </div>
            </div>

            {/* Platform Switcher Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              {[
                { id: 'windows', label: 'Windows 10 / 11 (WSL2)', icon: Monitor },
                { id: 'mac', label: 'macOS (Apple Silicon & Intel)', icon: Laptop },
                { id: 'linux', label: 'Linux (Ubuntu / Debian / RHEL)', icon: Server }
              ].map(p => {
                const Icon = p.icon;
                const isActive = activeInstallPlatform === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveInstallPlatform(p.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: isActive ? '700' : '500',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                      background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)' : 'rgba(255, 255, 255, 0.04)',
                      border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 0 16px rgba(13, 183, 237, 0.35)' : 'none'
                    }}
                  >
                    <Icon size={16} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* WINDOWS INSTALLATION GUIDE */}
            {activeInstallPlatform === 'windows' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '700' }}>
                  Installing Docker Desktop on Windows 10 & 11 via WSL2 Backend
                </div>

                {/* Prerequisites */}
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontWeight: '700', color: '#fbbf24', fontSize: '0.82rem', marginBottom: '6px' }}>
                    Prerequisites Checklist:
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    • Windows 11 64-bit: Home, Pro, Enterprise, or Windows 10 64-bit (Build 19044+)<br />
                    • Hardware virtualization enabled in BIOS/UEFI (Intel VT-x or AMD-V)<br />
                    • Minimum 4GB system RAM (8GB+ recommended)
                  </div>
                </div>

                {/* Step 1: Enable WSL2 */}
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
                    Step 1: Install WSL 2 (Windows Subsystem for Linux) in PowerShell (Admin):
                  </div>
                  <div style={{ position: 'relative' }}>
                    <pre style={{ margin: 0, padding: '12px', background: 'rgba(0, 0, 0, 0.65)', borderRadius: '8px', color: '#a7f3d0', fontFamily: 'monospace', fontSize: '0.8rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                      wsl --install
                    </pre>
                    <button
                      onClick={() => copyToClipboard('wsl --install', 'wsl-install')}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: '#ffffff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedSnippet === 'wsl-install' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedSnippet === 'wsl-install' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Step 2: Download Docker Desktop */}
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
                    Step 2: Download & Run Docker Desktop Installer:
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Download the official installer binary from Docker.com:
                  </div>
                  <a
                    href="https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '0.84rem',
                      fontWeight: '700'
                    }}
                  >
                    <Download size={16} />
                    <span>Download Docker Desktop for Windows (.exe)</span>
                  </a>
                </div>

                {/* Step 3: Winget package manager alternative */}
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
                    Or Install via Windows Package Manager (Winget):
                  </div>
                  <div style={{ position: 'relative' }}>
                    <pre style={{ margin: 0, padding: '12px', background: 'rgba(0, 0, 0, 0.65)', borderRadius: '8px', color: '#a7f3d0', fontFamily: 'monospace', fontSize: '0.8rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                      winget install Docker.DockerDesktop
                    </pre>
                    <button
                      onClick={() => copyToClipboard('winget install Docker.DockerDesktop', 'winget-install')}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: '#ffffff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedSnippet === 'winget-install' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedSnippet === 'winget-install' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MACOS INSTALLATION GUIDE */}
            {activeInstallPlatform === 'mac' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '700' }}>
                  Installing Docker Desktop on macOS (Apple Silicon M1/M2/M3 & Intel)
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontWeight: '700', color: '#fbbf24', fontSize: '0.82rem', marginBottom: '6px' }}>
                    Prerequisites:
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    • macOS version 12 (Monterey) or newer<br />
                    • 4GB RAM minimum
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
                    Method 1: Install with Homebrew (Fastest):
                  </div>
                  <div style={{ position: 'relative' }}>
                    <pre style={{ margin: 0, padding: '12px', background: 'rgba(0, 0, 0, 0.65)', borderRadius: '8px', color: '#a7f3d0', fontFamily: 'monospace', fontSize: '0.8rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                      brew install --cask docker
                    </pre>
                    <button
                      onClick={() => copyToClipboard('brew install --cask docker', 'brew-install')}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: '#ffffff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedSnippet === 'brew-install' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedSnippet === 'brew-install' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
                    Method 2: Official DMG Installers:
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a
                      href="https://desktop.docker.com/mac/main/arm64/Docker.dmg"
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '8px', color: '#ffffff', textDecoration: 'none', fontSize: '0.82rem', border: '1px solid var(--border-subtle)' }}
                    >
                      <Download size={15} />
                      <span>Mac with Apple Silicon (M1/M2/M3) .dmg</span>
                    </a>
                    <a
                      href="https://desktop.docker.com/mac/main/amd64/Docker.dmg"
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '8px', color: '#ffffff', textDecoration: 'none', fontSize: '0.82rem', border: '1px solid var(--border-subtle)' }}
                    >
                      <Download size={15} />
                      <span>Mac with Intel Chip .dmg</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* LINUX INSTALLATION GUIDE */}
            {activeInstallPlatform === 'linux' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '700' }}>
                  Installing Docker Engine (Native CE) on Ubuntu & Debian
                </div>

                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
                    Single-Script Automated Official Install (Convenience Script):
                  </div>
                  <div style={{ position: 'relative' }}>
                    <pre style={{ margin: 0, padding: '12px', background: 'rgba(0, 0, 0, 0.65)', borderRadius: '8px', color: '#a7f3d0', fontFamily: 'monospace', fontSize: '0.8rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                      curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
                    </pre>
                    <button
                      onClick={() => copyToClipboard('curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh', 'linux-script')}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: '#ffffff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedSnippet === 'linux-script' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedSnippet === 'linux-script' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
                    Post-Install: Run Docker without sudo (Add user to docker group):
                  </div>
                  <div style={{ position: 'relative' }}>
                    <pre style={{ margin: 0, padding: '12px', background: 'rgba(0, 0, 0, 0.65)', borderRadius: '8px', color: '#a7f3d0', fontFamily: 'monospace', fontSize: '0.8rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                      sudo usermod -aG docker $USER && newgrp docker
                    </pre>
                    <button
                      onClick={() => copyToClipboard('sudo usermod -aG docker $USER && newgrp docker', 'linux-group')}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: '#ffffff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedSnippet === 'linux-group' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedSnippet === 'linux-group' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 6: HELLO-WORLD VERIFICATION */}
          <section id="hello-world" className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={20} color="#34d399" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                  6. Verify Installation with Hello-World
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Test your freshly installed Docker environment
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
              Open your terminal (PowerShell, Command Prompt, macOS Terminal, or Linux Bash) and run:
            </div>

            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <pre style={{ margin: 0, padding: '14px 18px', background: 'rgba(0, 0, 0, 0.75)', borderRadius: '10px', color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.85rem', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                docker run hello-world
              </pre>
              <button
                onClick={() => copyToClipboard('docker run hello-world', 'run-hello')}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '6px 12px', color: '#ffffff', cursor: 'pointer', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {copiedSnippet === 'run-hello' ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copiedSnippet === 'run-hello' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Expected Terminal Output preview */}
            <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'monospace', fontSize: '0.75rem', color: '#a7f3d0' }}>
              <div style={{ color: 'var(--text-dim)', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                Expected Terminal Output:
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>
                {`Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db297d0c729: Pull complete 
Digest: sha256:7e9b6e7f23242d925129b49fadc1720f1883aa3d81b95fcae1378d381ba9377a
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.`}
              </pre>
            </div>

            {/* Next step button */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={onNavigateToSimulator}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.86rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(13, 183, 237, 0.4)'
                }}
              >
                <span>Explore Commands & Live Multi-Layer Simulator</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* SECTION 7: DOCKER NETWORKING & BUILT-IN DRIVERS */}
          <section id="docker-networking" className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Network size={20} color="#38bdf8" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                    7. Docker Networking &amp; Built-in Drivers
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    The Complete Set of Built-in Docker Network Drivers
                  </div>
                </div>
              </div>
              <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.4)', fontSize: '0.72rem' }}>
                6 Official Drivers
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '18px' }}>
              Docker provides a pluggable network architecture managed by <strong>libnetwork</strong>. Each driver dictates how containers communicate with one another, with the host machine, and with outside physical networks.
            </p>

            {/* Driver Quick Selector Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {[
                { id: 'bridge', label: 'bridge (Default)' },
                { id: 'host', label: 'host (High Perf)' },
                { id: 'none', label: 'none (Isolated)' },
                { id: 'overlay', label: 'overlay (Multi-host)' },
                { id: 'macvlan', label: 'macvlan (Direct MAC)' },
                { id: 'ipvlan', label: 'ipvlan (Parent MAC)' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDriver(d.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: selectedDriver === d.id ? '700' : '500',
                    background: selectedDriver === d.id ? 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)' : 'rgba(255, 255, 255, 0.06)',
                    color: selectedDriver === d.id ? '#ffffff' : 'var(--text-dim)',
                    border: selectedDriver === d.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Complete Table */}
            <div style={{ overflowX: 'auto', marginBottom: '18px' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)'
              }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.05)', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '12px 14px', color: '#38bdf8' }}>Driver</th>
                    <th style={{ padding: '12px 14px', color: '#cbd5e1' }}>Primary Use Case</th>
                    <th style={{ padding: '12px 14px', color: '#34d399' }}>Network Isolation</th>
                    <th style={{ padding: '12px 14px', color: '#fbbf24' }}>Routing Method</th>
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
                    const isSelected = selectedDriver === row.driver;
                    return (
                      <tr
                        key={row.driver}
                        onClick={() => setSelectedDriver(row.driver)}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          background: isSelected ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '12px 14px', fontWeight: '700', color: isSelected ? '#38bdf8' : '#ffffff' }}>
                          <code>{row.driver}</code>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{row.useCase}</td>
                        <td style={{ padding: '12px 14px', color: '#34d399' }}>{row.isolation}</td>
                        <td style={{ padding: '12px 14px', color: '#fbbf24' }}>{row.routing}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Selected Driver Deep Dive */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              fontSize: '0.82rem',
              lineHeight: '1.6'
            }}>
              <strong style={{ color: '#38bdf8', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>
                Driver Details: <code>docker run --network {selectedDriver}</code>
              </strong>

              {selectedDriver === 'bridge' && (
                <div>
                  <span style={{ color: '#cbd5e1' }}>
                    The default driver. Docker creates a Linux software bridge (<code>docker0</code>) on the host with an internal private subnet (typically <code>172.17.0.0/16</code>).
                    Containers get a <code>veth</code> pair connecting their internal <code>eth0</code> to <code>docker0</code>.
                    Communication outside the host is handled via iptables NAT (MASQUERADE).
                  </span>
                  <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.76rem', color: '#34d399' }}>
                    $ docker network create --driver bridge app-net<br />
                    $ docker run -d --network app-net -p 8080:80 nginx
                  </div>
                </div>
              )}

              {selectedDriver === 'host' && (
                <div>
                  <span style={{ color: '#cbd5e1' }}>
                    Removes all network namespace isolation between the container and the host machine.
                    The container does not receive its own IP address; instead, processes bind directly to the host's physical network interfaces.
                    Provides maximum raw network throughput and lowest latency at the expense of port collision risk.
                  </span>
                  <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.76rem', color: '#34d399' }}>
                    $ docker run -d --network host --name high-throughput-proxy nginx
                  </div>
                </div>
              )}

              {selectedDriver === 'none' && (
                <div>
                  <span style={{ color: '#cbd5e1' }}>
                    Attaches the container to its own isolated network stack with only the local loopback interface (<code>127.0.0.1</code>).
                    The container has zero access to external network devices or other containers. Ideal for batch crunching, offline compilers, or strict air-gapped security boundaries.
                  </span>
                  <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.76rem', color: '#34d399' }}>
                    $ docker run --rm --network none alpine ip addr
                  </div>
                </div>
              )}

              {selectedDriver === 'overlay' && (
                <div>
                  <span style={{ color: '#cbd5e1' }}>
                    Enables seamless communication between containers running across multiple different physical or virtual Docker hosts without host-level routing.
                    Leverages <strong>VXLAN encapsulation</strong> (UDP port 4789). Commonly used in Docker Swarm and distributed microservice clusters.
                  </span>
                  <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.76rem', color: '#34d399' }}>
                    $ docker network create -d overlay --attachable swarm-net
                  </div>
                </div>
              )}

              {selectedDriver === 'macvlan' && (
                <div>
                  <span style={{ color: '#cbd5e1' }}>
                    Assigns a distinct MAC address to each container, making it appear directly as a physical hardware device on the physical network.
                    The host interface acts as a Layer 2 bridge. Suitable for legacy enterprise systems, network monitoring appliances, or subnets requiring static IP assignments from external DHCP.
                  </span>
                  <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.76rem', color: '#34d399' }}>
                    $ docker network create -d macvlan --subnet=192.168.1.0/24 --gateway=192.168.1.1 -o parent=eth0 direct-lan
                  </div>
                </div>
              )}

              {selectedDriver === 'ipvlan' && (
                <div>
                  <span style={{ color: '#cbd5e1' }}>
                    Similar to macvlan, but all endpoints share the parent interface's MAC address while having unique IP addresses.
                    Crucial for virtualized hosts, public cloud VMs, or enterprise switches where strict MAC learning limits or port security rules prevent multiple MAC addresses on a single port.
                  </span>
                  <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.76rem', color: '#34d399' }}>
                    $ docker network create -d ipvlan -o ipvlan_mode=l2 --subnet=192.168.10.0/24 -o parent=eth0 ipvlan-net
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* SECTION 8: DOCKER IMAGES (Layers, Storage, Optimization) */}
      {(activeModule === 'all' || activeModule === 'images') && (
        <section id="docker-images">
          <React.Suspense fallback={<SuspenseLoader label="Streaming Docker Images Guide..." sub="Loading OverlayFS CoW mechanics, manifests & multi-stage builds" />}>
            <DockerImagesGuide onNavigateToSimulator={onNavigateToSimulator} />
          </React.Suspense>
        </section>
      )}

      {/* SECTION 9: DOCKER CONTAINERS (Lifecycle, Resources, Networking, Storage, Security) */}
      {(activeModule === 'all' || activeModule === 'containers') && (
        <section id="docker-containers">
          <React.Suspense fallback={<SuspenseLoader label="Streaming Docker Containers Guide..." sub="Loading cgroups v2, iptables port forward & network drivers" />}>
            <DockerContainersGuide />
          </React.Suspense>
        </section>
      )}

      {/* SECTION 10: DOCKER COMPOSE (Commands, Networking, Storage, Security) */}
      {(activeModule === 'all' || activeModule === 'compose') && (
        <section id="docker-compose">
          <React.Suspense fallback={<SuspenseLoader label="Streaming Docker Compose Guide..." sub="Loading multi-container compose networks, secrets & volumes" />}>
            <DockerComposeGuide />
          </React.Suspense>
        </section>
      )}
    </div>
  );
}
