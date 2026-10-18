import React, { useState } from 'react';
import {
  Layers,
  HardDrive,
  Sparkles,
  Copy,
  Check,
  TrendingDown,
  AlertTriangle,
  Package
} from 'lucide-react';

export default function DockerImagesGuide({ onNavigateToSimulator }) {
  const [activeSubTab, setActiveSubTab] = useState('layers'); // 'layers' | 'storage' | 'optimization'
  const [copiedSnippet, setCopiedSnippet] = useState(null);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(3);
  const [activeBaseImage, setActiveBaseImage] = useState('alpine');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // Sample Dockerfile layers with OverlayFS breakdown
  const DOCKERFILE_LAYERS = [
    {
      id: 0,
      instruction: 'FROM alpine:3.19',
      layerType: 'lowerdir (Base Layer)',
      size: '7.38 MB',
      digest: 'sha256:4abcf20661432f...',
      description: 'Minimal Alpine Linux root filesystem including musl libc, apk package manager, and core utilities.',
      isCached: true,
      category: 'OS Rootfs'
    },
    {
      id: 1,
      instruction: 'RUN apk add --no-cache nodejs npm',
      layerType: 'lowerdir (Read-Only Diff)',
      size: '42.1 MB',
      digest: 'sha256:8f2a1b9c4d3e...',
      description: 'Installs Node.js runtime and npm binaries into /usr/bin. --no-cache eliminates local apk package index cache, saving ~15MB.',
      isCached: true,
      category: 'Runtime'
    },
    {
      id: 2,
      instruction: 'WORKDIR /app && COPY package*.json ./',
      layerType: 'lowerdir (Dependency Manifest)',
      size: '4.2 KB',
      digest: 'sha256:d41d8cd98f00...',
      description: 'Copies ONLY package manifests first. As long as dependencies do not change, Docker reuses this cached layer during builds!',
      isCached: true,
      category: 'Dependencies'
    },
    {
      id: 3,
      instruction: 'RUN npm ci --only=production',
      layerType: 'lowerdir (Node Modules)',
      size: '28.4 MB',
      digest: 'sha256:e3b0c44298fc...',
      description: 'Strict clean install of production node_modules. Cached as long as package-lock.json remains untouched.',
      isCached: true,
      category: 'Dependencies'
    },
    {
      id: 4,
      instruction: 'COPY . .',
      layerType: 'lowerdir (Application Code)',
      size: '1.2 MB',
      digest: 'sha256:ca978112ca1b...',
      description: 'Copies application JavaScript source files. Placed near the bottom of Dockerfile because source changes frequently and invalidates cache below it.',
      isCached: false,
      category: 'Source Code'
    },
    {
      id: 5,
      instruction: 'CONTAINER RUNTIME (upperdir)',
      layerType: 'upperdir (Read-Write Container Layer)',
      size: '0 B (Initial)',
      digest: 'ephemeral-session-uuid',
      description: 'Thin writable scratch layer created when the container starts. Logs, temporary files, and runtime writes happen here via Copy-on-Write (CoW).',
      isCached: false,
      isRuntime: true,
      category: 'Writable Scratch'
    }
  ];

  const BASE_IMAGES = {
    ubuntu: {
      name: 'Ubuntu 24.04 LTS',
      size: '78 MB',
      vulns: '12-25 CVEs (Typical)',
      libc: 'glibc',
      pros: 'Maximum compatibility with compiled C/C++ libraries, standard tools included (curl, bash, apt).',
      cons: 'Heavy footprint, slower pull times in CI/CD, larger attack surface.'
    },
    debian: {
      name: 'Debian 12-slim (Bookworm)',
      size: '35 MB',
      vulns: '5-12 CVEs',
      libc: 'glibc',
      pros: 'Standard glibc binary compatibility with stripped-down documentation and unused locales.',
      cons: 'Slightly larger than Alpine, contains some unused system utilities.'
    },
    alpine: {
      name: 'Alpine Linux 3.19',
      size: '7.38 MB',
      vulns: '0-2 CVEs (Near Zero)',
      libc: 'musl libc',
      pros: 'Incredible speed, tiny disk footprint, near-zero baseline CVE vulnerabilities.',
      cons: 'Uses musl libc instead of glibc; some native compiled binaries (e.g. sharp, grpc) require recompilation.'
    },
    distroless: {
      name: 'Google Distroless (Static / Nodejs)',
      size: '2.5 MB - 30 MB',
      vulns: '0 CVEs',
      libc: 'Minimal glibc runtime',
      pros: 'Contains ONLY application and runtime dependencies. No shell (/bin/sh), no package manager (apt/apk). Hackers cannot run bash commands even if container is compromised!',
      cons: 'No interactive shell for debugging (requires ephemeral debug containers).'
    },
    scratch: {
      name: 'scratch (Empty Image)',
      size: '0 MB',
      vulns: '0 CVEs (Absolute Zero)',
      libc: 'None',
      pros: 'Completely blank image (zero bytes). Perfect for statically compiled Go, Rust, or C++ binaries with zero external dependencies.',
      cons: 'No OS utilities, no CA certificates (must be explicitly copied in if making HTTPS calls).'
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* SECTION HEADER */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(99, 102, 241, 0.08) 100%)',
        border: '1px solid rgba(14, 165, 233, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', fontSize: '0.72rem' }}>
                Module 2
              </span>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontSize: '0.72rem' }}>
                Deep Dive Architecture
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package size={24} color="#38bdf8" />
              Docker Images: Layers, Storage & Optimization
            </h2>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Master immutable layer stacking (OverlayFS), host storage engines (<code>/var/lib/docker/overlay2</code>), and multi-stage build optimization techniques.
            </div>
          </div>

          {/* Sub-tab Navigation Pills */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.4)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {[
              { id: 'layers', label: '1. Image Layers (OverlayFS)', icon: Layers },
              { id: 'storage', label: '2. Image Storage (/var/lib)', icon: HardDrive },
              { id: 'optimization', label: '3. Image Optimization & Multi-Stage', icon: Sparkles }
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
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)' : 'transparent',
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

      {/* SUBTAB 1: IMAGE LAYERS */}
      {activeSubTab === 'layers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Theory Card */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#38bdf8', marginTop: 0, marginBottom: '10px' }}>
              How Docker Image Layers Work: OverlayFS & Copy-on-Write (CoW)
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              A Docker image is <strong>not</strong> a single monolithic virtual hard disk. It is a cryptographic stack of <strong>immutable, read-only tarball diffs</strong> unified at runtime by the Linux kernel storage driver (<strong>OverlayFS</strong>).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginTop: '16px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <div style={{ fontWeight: '700', color: '#38bdf8', fontSize: '0.88rem', marginBottom: '4px' }}>
                  1. lowerdir (Image Layers)
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  Every line in a <code>Dockerfile</code> (e.g. <code>FROM</code>, <code>RUN</code>, <code>COPY</code>) generates an immutable, read-only directory stacked from bottom to top. Lower layers are completely shared across different images and containers on the host.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontWeight: '700', color: '#34d399', fontSize: '0.88rem', marginBottom: '4px' }}>
                  2. upperdir (Container Writable Layer)
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  When a container starts, Docker places a thin, writeable scratch directory on top. All new files created during runtime (logs, cache, uploads) are saved strictly inside <code>upperdir</code>.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontWeight: '700', color: '#fbbf24', fontSize: '0.88rem', marginBottom: '4px' }}>
                  3. Copy-on-Write (CoW) Mechanism
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  If a container process modifies a file from a read-only lower layer, OverlayFS copies the file up to <code>upperdir</code> before modifying it. The underlying image layer remains pristine and untouched for other containers!
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Layer Visualizer */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                  Interactive Layer Stack Explorer (Production Node.js Example)
                </h4>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Click any layer in the stack below to inspect its OverlayFS role, SHA256 caching status, and footprint.
                </div>
              </div>
              <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.7rem' }}>
                6 Stacked Layers
              </span>
            </div>

            {/* Stack Visualizer */}
            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '8px' }}>
              {DOCKERFILE_LAYERS.map((layer) => {
                const isSelected = selectedLayerIndex === layer.id;
                const isUpper = layer.isRuntime;

                return (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedLayerIndex(layer.id)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: isSelected
                        ? (isUpper ? 'rgba(16, 185, 129, 0.2)' : 'rgba(14, 165, 233, 0.25)')
                        : (isUpper ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0, 0, 0, 0.45)'),
                      border: isSelected
                        ? (isUpper ? '1.5px solid #10b981' : '1.5px solid #38bdf8')
                        : (isUpper ? '1px dashed rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)'),
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: isUpper ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.2)',
                        color: isUpper ? '#34d399' : '#38bdf8',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'monospace'
                      }}>
                        L{layer.id}
                      </span>
                      <div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.84rem', fontWeight: '700', color: isUpper ? '#34d399' : '#ffffff' }}>
                          {layer.instruction}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          {layer.layerType}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="badge" style={{
                        background: layer.isCached ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: layer.isCached ? '#34d399' : '#fbbf24',
                        fontSize: '0.66rem'
                      }}>
                        {layer.isCached ? 'CACHED' : (isUpper ? 'EPHEMERAL WRITE' : 'BUILD ON CHANGE')}
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: isUpper ? '#34d399' : '#cbd5e1', fontWeight: '700' }}>
                        {layer.size}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Layer Details Panel */}
            {selectedLayerIndex !== null && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                fontSize: '0.82rem',
                lineHeight: 1.6
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <strong style={{ color: '#38bdf8', fontSize: '0.9rem' }}>
                    Layer Details: {DOCKERFILE_LAYERS[selectedLayerIndex].instruction}
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                    Digest: {DOCKERFILE_LAYERS[selectedLayerIndex].digest}
                  </span>
                </div>
                <div style={{ color: '#cbd5e1' }}>
                  {DOCKERFILE_LAYERS[selectedLayerIndex].description}
                </div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: '700' }}>Cache Rule:</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {selectedLayerIndex <= 3
                      ? 'Reused across all builds if package.json and Dockerfile base lines are unchanged.'
                      : (selectedLayerIndex === 4
                        ? 'Invalidates cache on every git commit because source files change constantly.'
                        : 'Discarded automatically when container is destroyed with docker rm.')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: IMAGE STORAGE */}
      {activeSubTab === 'storage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#38bdf8', marginTop: 0, marginBottom: '10px' }}>
              Where Docker Stores Images: The Linux Host Filesystem
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              On Linux (and inside the Docker Desktop WSL2 / Hypervisor VM), all image layers, manifests, and containers are stored under <code>/var/lib/docker/</code>.
            </p>

            {/* Storage Directory Architecture */}
            <div style={{
              marginTop: '16px',
              padding: '16px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              color: '#a7f3d0',
              lineHeight: 1.6
            }}>
              <div style={{ color: '#38bdf8', fontWeight: '700', marginBottom: '8px' }}>
                📁 /var/lib/docker/ Directory Topology:
              </div>
              <div>├── <strong style={{ color: '#fbbf24' }}>overlay2/</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# The actual layer diff directories (lowerdir, diff, link, work)</div>
              <div>│&nbsp;&nbsp; ├── [layer-hash-1]/diff/ # Files added or modified by this specific layer</div>
              <div>│&nbsp;&nbsp; ├── [layer-hash-2]/diff/</div>
              <div>│&nbsp;&nbsp; └── l/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Short symlinks to avoid kernel mount arg limit length</div>
              <div>├── <strong style={{ color: '#38bdf8' }}>image/overlay2/</strong> &nbsp;&nbsp;&nbsp;# Layerdb & metadata: connects image tags to sha256 layer hashes</div>
              <div>├── <strong style={{ color: '#34d399' }}>containers/</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Container metadata: config.v2.json, hostconfig.json, stdout logs</div>
              <div>├── <strong style={{ color: '#c084fc' }}>volumes/</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Named persistent Docker volumes (/var/lib/docker/volumes/_data)</div>
              <div>└── <strong style={{ color: '#f87171' }}>buildkit/</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Modern BuildKit build cache & snapshot database</div>
            </div>
          </div>

          {/* Storage Management & Inspection Commands */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', marginTop: 0, marginBottom: '14px' }}>
              Essential Image Storage & Reclamation Commands
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {[
                {
                  cmd: 'docker system df',
                  desc: 'Inspect exact disk space consumed by Images, Containers, Local Volumes, and Build Cache.',
                  tag: 'Disk Audit'
                },
                {
                  cmd: 'docker image inspect <image-name>',
                  desc: 'Inspect architecture (amd64/arm64), RootFS layers array, environment variables, entrypoint, and exposed ports in JSON.',
                  tag: 'Deep Inspect'
                },
                {
                  cmd: 'docker history <image-name> --no-trunc',
                  desc: 'View every single layer command, creation date, size, and author that formed the final image.',
                  tag: 'Layer Audit'
                },
                {
                  cmd: 'docker image prune -a --filter "until=72h"',
                  desc: 'Safely removes all dangling and unreferenced images not associated with a running container created more than 72 hours ago.',
                  tag: 'Cleanup'
                },
                {
                  cmd: 'docker system prune --volumes -f',
                  desc: 'Complete storage sweep: removes all stopped containers, unused networks, dangling images, and anonymous volumes.',
                  tag: 'Emergency Wipe'
                }
              ].map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', fontSize: '0.68rem' }}>
                      {item.tag}
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.cmd, `img-cmd-${idx}`)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}
                    >
                      {copiedSnippet === `img-cmd-${idx}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedSnippet === `img-cmd-${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre style={{ margin: '0 0 6px 0', padding: '8px 10px', background: 'rgba(0,0,0,0.6)', borderRadius: '6px', color: '#a7f3d0', fontFamily: 'monospace', fontSize: '0.78rem', overflowX: 'auto' }}>
                    {item.cmd}
                  </pre>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: IMAGE OPTIMIZATION */}
      {activeSubTab === 'optimization' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Base Image Comparison */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#38bdf8', marginTop: 0, marginBottom: '6px' }}>
              Base Image Shootout: Choosing the Right Foundation
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              The base image you choose in <code>FROM</code> determines 80% of your container's attack surface and build size.
            </p>

            {/* Base Image Selector Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {Object.keys(BASE_IMAGES).map((key) => {
                const b = BASE_IMAGES[key];
                const isSelected = activeBaseImage === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveBaseImage(key)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? '700' : '500',
                      background: isSelected ? 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#ffffff' : 'var(--text-dim)',
                      border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer'
                    }}
                  >
                    {b.name} ({b.size})
                  </button>
                );
              })}
            </div>

            {/* Selected Base Image Breakdown */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.5)',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px',
              fontSize: '0.82rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>Disk Footprint:</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#34d399', fontFamily: 'monospace' }}>
                  {BASE_IMAGES[activeBaseImage].size}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>Vulnerability Baseline:</span>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fbbf24' }}>
                  {BASE_IMAGES[activeBaseImage].vulns}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>C Runtime Library:</span>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#38bdf8', fontFamily: 'monospace' }}>
                  {BASE_IMAGES[activeBaseImage].libc}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
                <div style={{ color: '#a7f3d0', marginBottom: '4px' }}>
                  <strong>✅ Best For:</strong> {BASE_IMAGES[activeBaseImage].pros}
                </div>
                <div style={{ color: '#fca5a5' }}>
                  <strong>⚠️ Trade-off:</strong> {BASE_IMAGES[activeBaseImage].cons}
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Stage Build Tutorial */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingDown size={18} color="#34d399" />
                The Gold Standard: Multi-Stage Builds (1.2GB → 18MB)
              </h4>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.72rem' }}>
                98.5% Size Reduction
              </span>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
              In traditional Dockerfiles, compilers (npm, gcc, go, python-dev) and build SDKs linger in the final production image. <strong>Multi-stage builds</strong> solve this by building your app in a heavy compiler stage, then copying <em>only</em> the compiled output into a lean production stage.
            </p>

            <div style={{ position: 'relative' }}>
              <pre style={{
                margin: 0,
                padding: '16px',
                background: 'rgba(0, 0, 0, 0.75)',
                borderRadius: '10px',
                color: '#a7f3d0',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                lineHeight: 1.55,
                overflowX: 'auto'
              }}>
{`# ==========================================
# STAGE 1: HEAVY BUILDER (Node.js SDK ~1.1GB)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests first for maximum layer cache reuse
COPY package*.json ./
RUN npm ci

# Copy source and build production TypeScript / bundle
COPY . .
RUN npm run build && npm prune --production

# ==========================================
# STAGE 2: LEAN PRODUCTION RUNTIME (~35MB)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

# Set non-root production user for security
ENV NODE_ENV=production
USER node

# Copy ONLY compiled dist files and production node_modules from Stage 1
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]`}
              </pre>
              <button
                onClick={() => copyToClipboard(`# Multi-stage Dockerfile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build && npm prune --production\n\nFROM node:20-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nUSER node\nCOPY --from=builder --chown=node:node /app/dist ./dist\nCOPY --from=builder --chown=node:node /app/node_modules ./node_modules\nEXPOSE 3000\nCMD ["node", "dist/index.js"]`, 'multi-stage-dockerfile')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copiedSnippet === 'multi-stage-dockerfile' ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copiedSnippet === 'multi-stage-dockerfile' ? 'Copied' : 'Copy Dockerfile'}</span>
              </button>
            </div>

            {/* .dockerignore Checklist */}
            <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
              <div style={{ fontWeight: '700', color: '#fbbf24', fontSize: '0.84rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={15} />
                Never Forget .dockerignore!
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                Always add <code>node_modules</code>, <code>.git</code>, <code>.env</code>, <code>*.log</code>, and <code>coverage</code> to your <code>.dockerignore</code> file. Failing to do so bloats the initial build context by hundreds of megabytes and accidentally leaks private API keys into public image layers!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
