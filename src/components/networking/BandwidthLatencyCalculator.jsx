import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Zap,
  Wifi,
  Server,
  HardDrive,
  Clock,
  ArrowRight,
  Play,
  RotateCcw,
  Layers,
  Activity,
  CheckCircle2,
  Info,
  Gauge,
  Radio,
  Sliders,
  Sparkles
} from 'lucide-react';

// Preset real-world network profiles
const NETWORK_PROFILES = [
  {
    id: '4g',
    name: '4G LTE Mobile',
    icon: '📱',
    bandwidth: 30, // Mbps
    latency: 55, // ms
    loss: 0.5, // %
    desc: 'Cellular wireless with moderate latency and packet jitter'
  },
  {
    id: '5g',
    name: '5G Ultra-Wideband',
    icon: '⚡',
    bandwidth: 350,
    latency: 14,
    loss: 0.1,
    desc: 'Next-gen mmWave / mid-band wireless with sub-15ms latency'
  },
  {
    id: 'cable',
    name: 'Home Broadband',
    icon: '🏠',
    bandwidth: 100,
    latency: 22,
    loss: 0.2,
    desc: 'Standard DOCSIS 3.1 cable or VDSL home internet'
  },
  {
    id: 'fiber',
    name: 'Gigabit Fiber',
    icon: '🚀',
    bandwidth: 1000,
    latency: 4,
    loss: 0.0,
    desc: 'FTTH symmetric fiber link with ultra-low latency'
  },
  {
    id: 'starlink',
    name: 'Starlink Satellite',
    icon: '🛰️',
    bandwidth: 150,
    latency: 48,
    loss: 0.8,
    desc: 'Low Earth Orbit (LEO) satellite constellation'
  },
  {
    id: 'wan',
    name: 'Transatlantic WAN',
    icon: '🌐',
    bandwidth: 250,
    latency: 140,
    loss: 0.1,
    desc: 'Cross-continental subsea optical fiber (London ↔ NYC)'
  },
  {
    id: 'datacenter',
    name: 'Datacenter 10G',
    icon: '🏢',
    bandwidth: 10000,
    latency: 0.5,
    loss: 0.0,
    desc: 'Intra-rack DAC or optical Spine-Leaf fabric'
  }
];

// File size quick presets
const FILE_PRESETS = [
  { label: 'Webpage (3 MB)', sizeMb: 3 },
  { label: 'High-Res Photo (20 MB)', sizeMb: 20 },
  { label: 'Short Video (100 MB)', sizeMb: 100 },
  { label: '4K Movie (1.5 GB)', sizeMb: 1536 },
  { label: 'ISO Image (4 GB)', sizeMb: 4096 }
];

export default function BandwidthLatencyCalculator() {
  // Calculator States
  const [bandwidthMbps, setBandwidthMbps] = useState(100);
  const [latencyMs, setLatencyMs] = useState(25);
  const [fileSizeMb, setFileSizeMb] = useState(50);
  const [packetLossPct, setPacketLossPct] = useState(0);
  const [activeProfileId, setActiveProfileId] = useState('cable');

  // Simulation State
  const [simState, setSimState] = useState('idle'); // 'idle' | 'handshake' | 'tls' | 'streaming' | 'complete'
  const [simProgress, setSimProgress] = useState(0); // 0 to 100
  const [simPhaseLabel, setSimPhaseLabel] = useState('');
  const [elapsedSimTime, setElapsedSimTime] = useState(0);
  const animFrameRef = useRef(null);

  // Apply a network profile
  const handleSelectProfile = (profile) => {
    setActiveProfileId(profile.id);
    setBandwidthMbps(profile.bandwidth);
    setLatencyMs(profile.latency);
    setPacketLossPct(profile.loss);
    handleResetSimulation();
  };

  // Calculations
  const metrics = useMemo(() => {
    // 1. Serialization (Transmission) Time: T_tx = (Size in bits) / (Bandwidth in bps)
    const fileBits = fileSizeMb * 8 * 1024 * 1024;
    const bandwidthBps = bandwidthMbps * 1000 * 1000;
    const serializationSec = fileBits / bandwidthBps;

    // 2. Handshake Overhead (3 RTTs: TCP SYN/ACK, TLS 1.3 Key Exchange, HTTP GET + TTFB)
    const rttSec = latencyMs / 1000;
    const handshakeSec = rttSec * 3;

    // 3. Loss impact penalty (rough Mathis formula modeling throughput ceiling under loss)
    // If loss > 0, throughput is bounded: Throughput <= (MSS / RTT) * (C / sqrt(loss))
    let lossPenaltySec = 0;
    if (packetLossPct > 0) {
      // Retransmissions + TCP congestion window backoff
      const retransmissions = (fileSizeMb * 1024 * 1024 / 1460) * (packetLossPct / 100);
      lossPenaltySec = retransmissions * (rttSec * 1.5);
    }

    // 4. Total User-Perceived Transfer Time
    const totalSec = serializationSec + handshakeSec + lossPenaltySec;

    // 5. Bandwidth-Delay Product (BDP)
    // BDP = Bandwidth (bps) * RTT (s) in bits -> bytes -> KB / MB
    const bdpBits = bandwidthBps * rttSec;
    const bdpBytes = bdpBits / 8;
    const bdpKb = bdpBytes / 1024;
    const bdpMb = bdpKb / 1024;

    // 6. Packet Count (based on Standard Ethernet 1500B MTU / 1460B TCP MSS)
    const mssBytes = 1460;
    const totalPackets = Math.ceil((fileSizeMb * 1024 * 1024) / mssBytes);

    // 7. Breakdown Percentages
    const txShare = Math.max(0, Math.min(100, (serializationSec / totalSec) * 100));
    const latencyShare = Math.max(0, Math.min(100, ((handshakeSec + lossPenaltySec) / totalSec) * 100));

    // Formatted time helper
    const formatTime = (sec) => {
      if (sec < 0.001) return `${(sec * 1000000).toFixed(1)} µs`;
      if (sec < 1) return `${(sec * 1000).toFixed(1)} ms`;
      if (sec < 60) return `${sec.toFixed(2)} sec`;
      const mins = Math.floor(sec / 60);
      const remSec = (sec % 60).toFixed(1);
      return `${mins}m ${remSec}s`;
    };

    return {
      serializationSec,
      serializationFormatted: formatTime(serializationSec),
      handshakeSec,
      handshakeFormatted: formatTime(handshakeSec),
      lossPenaltySec,
      lossPenaltyFormatted: formatTime(lossPenaltySec),
      totalSec,
      totalFormatted: formatTime(totalSec),
      bdpKb,
      bdpMb,
      bdpFormatted: bdpMb >= 1 ? `${bdpMb.toFixed(2)} MB` : `${bdpKb.toFixed(1)} KB`,
      totalPackets,
      txShare: txShare.toFixed(1),
      latencyShare: latencyShare.toFixed(1)
    };
  }, [bandwidthMbps, latencyMs, fileSizeMb, packetLossPct]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Run Animated Transfer Simulation
  const handleStartSimulation = () => {
    if (simState === 'streaming' || simState === 'handshake' || simState === 'tls') return;

    setSimState('handshake');
    setSimProgress(0);
    setElapsedSimTime(0);
    setSimPhaseLabel('Phase 1/3: TCP 3-Way Handshake (SYN → SYN-ACK → ACK)...');

    // Simulate in accelerated time (max 4.5 seconds for visual demonstration)
    const startTime = performance.now();
    const simDurationMs = Math.min(4200, Math.max(1800, metrics.totalSec * 800));

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(100, (elapsed / simDurationMs) * 100);
      const simulatedSeconds = (progress / 100) * metrics.totalSec;

      setSimProgress(progress);
      setElapsedSimTime(simulatedSeconds);

      if (progress < 25) {
        setSimState('handshake');
        setSimPhaseLabel(`Phase 1/3: TCP 3-Way Handshake (~${(metrics.handshakeSec * 0.33 * 1000).toFixed(0)}ms)`);
      } else if (progress < 45) {
        setSimState('tls');
        setSimPhaseLabel(`Phase 2/3: TLS 1.3 Key Exchange & Negotiated Cipher (~${(metrics.handshakeSec * 0.67 * 1000).toFixed(0)}ms)`);
      } else if (progress < 100) {
        setSimState('streaming');
        const streamedMb = ((progress - 45) / 55) * fileSizeMb;
        setSimPhaseLabel(`Phase 3/3: Streaming Payload (${streamedMb.toFixed(1)} MB / ${fileSizeMb} MB) @ ${bandwidthMbps} Mbps`);
      } else {
        setSimState('complete');
        setSimPhaseLabel(`✅ Transfer Complete! Delivered ${fileSizeMb} MB across ${metrics.totalPackets.toLocaleString()} packets.`);
        return;
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  const handleResetSimulation = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setSimState('idle');
    setSimProgress(0);
    setElapsedSimTime(0);
    setSimPhaseLabel('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      padding: '20px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.35)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
    }}>
      {/* ─── Header & Description ───────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <Zap size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '0.94rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.01em' }}>
              Interactive Widget: Bandwidth, Latency &amp; Transfer Time Calculator
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Calculate transmission time, RTT handshake delays, and Bandwidth-Delay Product (BDP) with live simulations
            </div>
          </div>
        </div>

        <button
          onClick={handleResetSimulation}
          title="Reset Simulation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'var(--text-dim)',
            fontSize: '0.74rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
        >
          <RotateCcw size={14} />
          Reset Defaults
        </button>
      </div>

      {/* ─── Real-World Network Scenario Presets ────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: '700', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
          <Sparkles size={14} />
          <span>Quick Connection Scenarios:</span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '8px'
        }}>
          {NETWORK_PROFILES.map(prof => {
            const isSelected = activeProfileId === prof.id;
            return (
              <button
                key={prof.id}
                onClick={() => handleSelectProfile(prof)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 0, 0, 0.45)',
                  border: isSelected ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 0 12px rgba(16, 185, 129, 0.25)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span style={{ fontSize: '1rem' }}>{prof.icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: isSelected ? '#34d399' : '#e2e8f0' }}>
                    {prof.name}
                  </span>
                </div>
                <div style={{ fontSize: '0.67rem', color: isSelected ? '#6ee7b7' : 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  {prof.bandwidth >= 1000 ? `${prof.bandwidth / 1000} Gbps` : `${prof.bandwidth} Mbps`} · {prof.latency}ms
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Interactive Parameter Controls Grid ───────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '14px',
        padding: '16px',
        borderRadius: '10px',
        background: 'rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.07)'
      }}>
        {/* Control 1: Bandwidth */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', color: '#cbd5e1', fontWeight: '600' }}>Link Bandwidth:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                min="1"
                max="10000"
                value={bandwidthMbps}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                  setBandwidthMbps(val);
                  setActiveProfileId(null);
                  handleResetSimulation();
                }}
                style={{
                  width: '64px',
                  padding: '2px 6px',
                  borderRadius: '5px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: '700' }}>Mbps</span>
            </div>
          </div>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={bandwidthMbps > 1000 ? 1000 : bandwidthMbps}
            onChange={(e) => {
              setBandwidthMbps(parseInt(e.target.value, 10));
              setActiveProfileId(null);
              handleResetSimulation();
            }}
            style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', color: 'var(--text-dim)' }}>
            <span>10 Mbps</span>
            <span>250 Mbps</span>
            <span>500 Mbps</span>
            <span>1000 Mbps</span>
          </div>
        </div>

        {/* Control 2: Latency (RTT) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', color: '#cbd5e1', fontWeight: '600' }}>Round-Trip Latency (RTT):</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                min="1"
                max="1000"
                value={latencyMs}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                  setLatencyMs(val);
                  setActiveProfileId(null);
                  handleResetSimulation();
                }}
                style={{
                  width: '56px',
                  padding: '2px 6px',
                  borderRadius: '5px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  color: '#fbbf24',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: '700' }}>ms</span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="300"
            step="1"
            value={latencyMs > 300 ? 300 : latencyMs}
            onChange={(e) => {
              setLatencyMs(parseInt(e.target.value, 10));
              setActiveProfileId(null);
              handleResetSimulation();
            }}
            style={{ width: '100%', accentColor: '#fbbf24', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', color: 'var(--text-dim)' }}>
            <span>1 ms (LAN)</span>
            <span>30 ms (Metro)</span>
            <span>100 ms (WAN)</span>
            <span>300 ms (Global)</span>
          </div>
        </div>

        {/* Control 3: File Size */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', color: '#cbd5e1', fontWeight: '600' }}>Transfer Payload Size:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                min="1"
                max="10000"
                value={fileSizeMb}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                  setFileSizeMb(val);
                  handleResetSimulation();
                }}
                style={{
                  width: '60px',
                  padding: '2px 6px',
                  borderRadius: '5px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: '#c084fc',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: '700' }}>MB</span>
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="500"
            step="5"
            value={fileSizeMb > 500 ? 500 : fileSizeMb}
            onChange={(e) => {
              setFileSizeMb(parseInt(e.target.value, 10));
              handleResetSimulation();
            }}
            style={{ width: '100%', accentColor: '#a855f7', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', color: 'var(--text-dim)' }}>
            <span>5 MB</span>
            <span>100 MB</span>
            <span>250 MB</span>
            <span>500 MB</span>
          </div>
        </div>
      </div>

      {/* ─── File Size Quick Presets Pill Bar ───────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Quick File Sizes:</span>
        {FILE_PRESETS.map(preset => (
          <button
            key={preset.label}
            onClick={() => {
              setFileSizeMb(preset.sizeMb);
              handleResetSimulation();
            }}
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              background: fileSizeMb === preset.sizeMb ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: fileSizeMb === preset.sizeMb ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.1)',
              color: fileSizeMb === preset.sizeMb ? '#c084fc' : '#cbd5e1',
              fontSize: '0.68rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* ─── Calculated Metrics Dashboard (4 Cards) ────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '10px'
      }}>
        {/* Metric 1: Serialization Time */}
        <div style={{
          padding: '12px 14px',
          borderRadius: '10px',
          background: 'rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(56, 189, 248, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', marginBottom: '4px' }}>
            <Activity size={15} />
            <span style={{ fontSize: '0.74rem', fontWeight: '700' }}>Pure Serialization Time</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
            {metrics.serializationFormatted}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Time to push all {fileSizeMb} MB onto wire at {bandwidthMbps} Mbps ({metrics.txShare}% of transfer)
          </div>
        </div>

        {/* Metric 2: Handshake & Propagation Delay */}
        <div style={{
          padding: '12px 14px',
          borderRadius: '10px',
          background: 'rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(251, 191, 36, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', marginBottom: '4px' }}>
            <Clock size={15} />
            <span style={{ fontSize: '0.74rem', fontWeight: '700' }}>Handshake &amp; TTFB Delay</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
            {metrics.handshakeFormatted}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            3 × RTT overhead: TCP 3-way handshake + TLS key exchange + TTFB
          </div>
        </div>

        {/* Metric 3: Bandwidth-Delay Product (BDP) */}
        <div style={{
          padding: '12px 14px',
          borderRadius: '10px',
          background: 'rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(52, 211, 153, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', marginBottom: '4px' }}>
            <Layers size={15} />
            <span style={{ fontSize: '0.74rem', fontWeight: '700' }}>BDP (In-Flight Capacity)</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
            {metrics.bdpFormatted}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Required TCP Socket Buffer (SO_RCVBUF) to prevent sender stall
          </div>
        </div>

        {/* Metric 4: Total User-Perceived Transfer Time */}
        <div style={{
          padding: '12px 14px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(0, 0, 0, 0.5) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', marginBottom: '4px' }}>
            <Gauge size={15} />
            <span style={{ fontSize: '0.74rem', fontWeight: '700' }}>Total Perceived Time</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
            {metrics.totalFormatted}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            ~{metrics.totalPackets.toLocaleString()} packets (1460B MSS Ethernet)
          </div>
        </div>
      </div>

      {/* ─── Visual Bandwidth Pipe & Latency Tube ───────────────── */}
      <div style={{
        padding: '14px',
        borderRadius: '10px',
        background: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HardDrive size={15} color="#38bdf8" />
            <span style={{ fontWeight: '700', color: '#cbd5e1' }}>Client (Sender)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
            <span style={{ color: '#38bdf8' }}>Pipe Width: {bandwidthMbps} Mbps</span>
            <span style={{ color: '#fbbf24' }}>Pipe Delay: {latencyMs} ms RTT</span>
            <span style={{ color: '#34d399' }}>Capacity: {metrics.bdpFormatted}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: '700', color: '#cbd5e1' }}>Server (Receiver)</span>
            <Server size={15} color="#34d399" />
          </div>
        </div>

        {/* Dynamic Pipe Graphic */}
        <div style={{
          position: 'relative',
          height: '42px',
          borderRadius: '8px',
          background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
          border: '1px dashed rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '0 12px'
        }}>
          {/* Animated packets in pipe */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(90deg, rgba(56, 189, 248, 0.3) 0, rgba(56, 189, 248, 0.3) 12px, transparent 12px, transparent 24px)',
            animation: simState === 'streaming' ? 'flowPipe 0.5s linear infinite' : 'none',
            opacity: simState === 'streaming' ? 1 : 0.25
          }} />

          {/* Progress bar overlay during simulation */}
          {simProgress > 0 && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${simProgress}%`,
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.4) 0%, rgba(52, 211, 153, 0.7) 100%)',
              transition: 'width 0.1s linear',
              boxShadow: '0 0 16px rgba(52, 211, 153, 0.6)'
            }} />
          )}

          {/* Center Info in Pipe */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: '#ffffff',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'
          }}>
            {simState === 'idle' ? (
              <span>Physical Wire: Bandwidth-Delay Product = {metrics.bdpFormatted} in-flight bits</span>
            ) : (
              <span>{simPhaseLabel} ({simProgress.toFixed(0)}%)</span>
            )}
          </div>
        </div>

        {/* Simulation Controls & Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleStartSimulation}
              disabled={simState === 'handshake' || simState === 'tls' || simState === 'streaming'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: simState === 'complete' ? '#059669' : '#10b981',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.76rem',
                fontWeight: '700',
                cursor: (simState === 'handshake' || simState === 'tls' || simState === 'streaming') ? 'not-allowed' : 'pointer',
                opacity: (simState === 'handshake' || simState === 'tls' || simState === 'streaming') ? 0.6 : 1,
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <Play size={14} fill="#ffffff" />
              {simState === 'idle' ? 'Run Live Transfer Simulation' : simState === 'complete' ? 'Re-run Simulation' : 'Transferring...'}
            </button>

            {simState !== 'idle' && (
              <button
                onClick={handleResetSimulation}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  fontSize: '0.74rem',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
            )}
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            Simulated Elapsed: <strong style={{ color: '#fbbf24' }}>{elapsedSimTime.toFixed(2)}s</strong> / {metrics.totalFormatted}
          </div>
        </div>
      </div>

      {/* ─── Educational Takeaways Callout ─────────────────────── */}
      <div style={{
        padding: '12px 14px',
        borderRadius: '8px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderLeft: '3px solid #10b981',
        fontSize: '0.74rem',
        color: '#cbd5e1',
        lineHeight: '1.5'
      }}>
        <div style={{ fontWeight: '700', color: '#34d399', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={14} />
          <span>Key Networking Insight: Bandwidth vs Latency Dominance</span>
        </div>
        <div>
          {fileSizeMb <= 5 ? (
            <span>
              For small web transfers (e.g. {fileSizeMb} MB), <strong>latency and handshakes dominate {metrics.latencyShare}%</strong> of the perceived delay! Upgrading from 100 Mbps to 1 Gbps won't make small API calls noticeably faster—reducing RTT (via CDN edge caching) will.
            </span>
          ) : (
            <span>
              For large bulk transfers (e.g. {fileSizeMb} MB), <strong>serialization delay dominates {metrics.txShare}%</strong> of the transfer time. Raw bandwidth is the primary bottleneck. However, if your TCP buffer (`SO_RCVBUF`) is smaller than the BDP ({metrics.bdpFormatted}), the sender will stall waiting for ACKs regardless of link speed!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
