import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Globe,
  Network,
  Terminal,
  Layers,
  Radio,
  Sliders,
  Router,
  Server,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  ShieldAlert
} from 'lucide-react';

// ─── 12 Serialized Networking Modules Definition ─────────────────────────────
export const NETWORKING_SUBTABS = [
  { id: 'tutorial', serial: '📚', label: 'Tutorial Doc', icon: BookOpen, badge: '22 Chapters', isTutorial: true, desc: '22 comprehensive guided chapters with interactive widgets' },
  { id: 'topology', serial: '01', label: 'Topology & Packet Tracer', icon: Network, badge: 'Live Tracer', desc: 'Interactive topology builder, switch/router flows & packet tracing' },
  { id: 'xyflow-simulation', serial: '02', label: 'xyflow Simulation', icon: Zap, badge: 'Dual Flow', isXyflow: true, desc: 'Interactive node graph simulation with dual packet flows' },
  { id: 'tcp-udp', serial: '03', label: 'TCP/IP & UDP Models', icon: Layers, badge: 'Flow & Tracer', isTcpUdp: true, desc: 'Comparative transport models, 3-way handshake & UDP streaming' },
  { id: 'ids-ips', serial: '04', label: 'IDS & IPS Defense', icon: ShieldAlert, badge: 'Threat Block', isIdsIps: true, desc: 'Signature and anomaly threat detection, inline vs out-of-band' },
  { id: 'google-journey', serial: '05', label: 'https WEB Flow', icon: Globe, badge: 'TCP+TLS+Page', desc: 'End-to-end journey of a web request from browser to server' },
  { id: 'advance', serial: '06', label: 'ADVANCE: Proxy & LB', icon: Server, badge: 'Doc Lab', isAdvance: true, desc: 'Reverse proxying, Layer 4/7 load balancing & HAProxy architectures' },
  { id: 'osi', serial: '07', label: 'OSI & TCP/IP 7 Layers', icon: Layers, badge: 'Encapsulation', desc: 'Protocol Data Units, header encapsulation and layer responsibilities' },
  { id: 'protocols', serial: '08', label: 'Protocols Explorer', icon: Radio, badge: 'TCP/DNS/ARP', desc: 'Deep dive into fundamental network protocols and packet headers' },
  { id: 'terminal', serial: '09', label: 'Network CLI Sandbox', icon: Terminal, badge: 'ping/dig', desc: 'Real-time network diagnostic CLI utilities with simulated output' },
  { id: 'subnet', serial: '10', label: 'Calculators & Subnet', icon: Sliders, badge: 'Calculators', desc: 'IPv4 subnetting & CIDR masks, plus Bandwidth, Latency & Transfer Time calculator' },
  { id: 'ports', serial: '11', label: 'Ports & SG Rules', icon: Shield, badge: '28 Protocols', isPorts: true, desc: 'AWS Security Group rules, port ranges & modal inspector' }
];

export default function NetworkSubHeader({ activeSubTab, setActiveSubTab }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const subTabs = NETWORKING_SUBTABS;
  const currentIdx = subTabs.findIndex(t => t.id === activeSubTab);
  const currentTab = currentIdx >= 0 ? subTabs[currentIdx] : subTabs[0];
  const prevTab = currentIdx > 0 ? subTabs[currentIdx - 1] : null;
  const nextTab = currentIdx >= 0 && currentIdx < subTabs.length - 1 ? subTabs[currentIdx + 1] : null;

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  }, [activeSubTab]);

  return (
    <header className="glass-panel" style={{
      top: 12,
      zIndex: 40,
      margin: '0 auto 24px auto',
      maxWidth: '1440px',
      padding: '14px 20px',
      borderRadius: '16px',
      border: '1px solid rgba(16, 185, 129, 0.25)',
      background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <style>{`
        .network-nav-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .network-nav-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }
        .network-nav-scroll::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.35);
          border-radius: 4px;
        }
        .network-nav-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.65);
        }
      `}</style>

      {/* TOP ROW: Title & Live Network State Ticker */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Domain Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)',
            flexShrink: 0
          }}>
            <Globe size={22} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '1.18rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to right, #ffffff, #34d399, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                NetCore Simulator
              </span>
              <span className="badge" style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                fontSize: '0.65rem'
              }}>
                OSI & Distributed Systems
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              From Physical Silicon & Copper to Application Layer Protocols
            </div>
          </div>
        </div>

        {/* Live Network State Ticker */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#34d399' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
            Link: eth0 UP (1000 Mbps)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Router size={12} color="#f59e0b" />
            GW: 192.168.1.1
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Server size={12} color="#06b6d4" />
            DNS: 8.8.8.8
          </span>
          <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>
            MTU: 1500
          </span>
        </div>
      </div>

      {/* ─── SERIALIZED MODULE PIPELINE TRACKER ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '7px 12px',
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '9px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.74rem'
      }}>
        {/* Left: Serial indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.62rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '800',
            padding: '2px 7px',
            borderRadius: '4px',
            background: 'rgba(16, 185, 129, 0.18)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            letterSpacing: '0.04em'
          }}>
            {currentTab?.serial === '📚' ? 'TUTORIAL GUIDE' : 'SERIAL PIPELINE'}
          </span>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>
            {currentTab?.serial === '📚' ? 'Curriculum' : <>Module <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{currentTab?.serial}</strong> / 11:</>}
          </span>
          <span style={{ color: '#38bdf8', fontWeight: '700' }}>
            {currentTab?.label}
          </span>
          <span style={{
            fontSize: '0.64rem',
            padding: '1px 6px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.06)',
            color: 'var(--text-muted)'
          }}>
            {currentTab?.badge}
          </span>
        </div>

        {/* Right: Quick sequential step controls & 12-segment progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => prevTab && setActiveSubTab(prevTab.id)}
            disabled={!prevTab}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '5px',
              background: prevTab ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: prevTab ? '#cbd5e1' : '#475569',
              fontSize: '0.70rem',
              fontWeight: '600',
              cursor: prevTab ? 'pointer' : 'not-allowed',
              opacity: prevTab ? 1 : 0.35,
              transition: 'all 0.15s ease'
            }}
            title={prevTab ? `Previous: ${prevTab.serial === '📚' ? '📚' : `${prevTab.serial}.`} ${prevTab.label}` : 'First module'}
          >
            <ChevronLeft size={13} />
            Prev
          </button>

          {/* 12-Segment Progress Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {subTabs.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id)}
                title={t.serial === '📚' ? `${t.label} (${t.badge})` : `Module ${t.serial}: ${t.label} (${t.badge})`}
                style={{
                  width: idx === currentIdx ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: idx === currentIdx ? '#10b981' : idx < currentIdx ? '#059669' : 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: idx === currentIdx ? '0 0 8px rgba(16, 185, 129, 0.8)' : 'none'
                }}
              />
            ))}
          </div>

          <button
            onClick={() => nextTab && setActiveSubTab(nextTab.id)}
            disabled={!nextTab}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '5px',
              background: nextTab ? 'rgba(16, 185, 129, 0.16)' : 'transparent',
              border: nextTab ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: nextTab ? '#34d399' : '#475569',
              fontSize: '0.70rem',
              fontWeight: '700',
              cursor: nextTab ? 'pointer' : 'not-allowed',
              opacity: nextTab ? 1 : 0.35,
              transition: 'all 0.15s ease'
            }}
            title={nextTab ? `Next: ${nextTab.serial === '📚' ? '📚' : `${nextTab.serial}.`} ${nextTab.label}` : 'Last module'}
          >
            Next
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* FULL-WIDTH SCROLLABLE SUBMENU NAVIGATION TABS (Same Width as glass-panel) */}
      <div style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={handleScrollLeft}
            aria-label="Scroll Tabs Left"
            style={{
              position: 'absolute',
              left: 0,
              zIndex: 10,
              width: '28px',
              height: '34px',
              borderRadius: '6px 0 0 6px',
              background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.8))',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRight: 'none',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              transition: 'all 0.15s ease'
            }}
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Submenu Navigation Tabs */}
        <nav
          ref={scrollContainerRef}
          className="network-nav-scroll"
          style={{
            width: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.45)',
            padding: '6px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(16, 185, 129, 0.35) rgba(0, 0, 0, 0.25)',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            const isAdvance = tab.isAdvance || tab.id === 'advance';
            const isXyflow = tab.isXyflow || tab.id === 'xyflow-simulation';
            const isPorts = tab.isPorts || tab.id === 'ports';
            const isTcpUdp = tab.isTcpUdp || tab.id === 'tcp-udp';
            const isIdsIps = tab.isIdsIps || tab.id === 'ids-ips';
            const isTutorial = tab.isTutorial || tab.id === 'tutorial';

            let textColor = 'var(--text-muted)';
            let iconColor = '#94a3b8';
            let bg = 'rgba(255, 255, 255, 0.03)';
            let border = '1px solid rgba(255, 255, 255, 0.06)';
            let shadow = 'none';
            let badgeBg = 'rgba(255, 255, 255, 0.06)';
            let badgeColor = 'var(--text-dim)';

            if (isTutorial) {
              textColor = '#38bdf8';
              iconColor = '#38bdf8';
              bg = 'rgba(14, 165, 233, 0.12)';
              border = '1px solid rgba(14, 165, 233, 0.35)';
              badgeBg = 'rgba(14, 165, 233, 0.25)';
              badgeColor = '#bae6fd';
            } else if (isAdvance) {
              textColor = '#c084fc';
              iconColor = '#c084fc';
              bg = 'rgba(168, 85, 247, 0.12)';
              border = '1px solid rgba(168, 85, 247, 0.3)';
              badgeBg = 'rgba(168, 85, 247, 0.25)';
              badgeColor = '#e9d5ff';
            } else if (isXyflow) {
              textColor = '#38bdf8';
              iconColor = '#38bdf8';
              bg = 'rgba(6, 182, 212, 0.12)';
              border = '1px solid rgba(56, 189, 248, 0.35)';
              badgeBg = 'rgba(6, 182, 212, 0.25)';
              badgeColor = '#bae6fd';
            } else if (isPorts) {
              textColor = '#fca5a5';
              iconColor = '#fca5a5';
              bg = 'rgba(239, 68, 68, 0.10)';
              border = '1px solid rgba(239, 68, 68, 0.3)';
              badgeBg = 'rgba(239, 68, 68, 0.2)';
              badgeColor = '#fecaca';
            } else if (isTcpUdp) {
              textColor = '#34d399';
              iconColor = '#34d399';
              bg = 'rgba(16, 185, 129, 0.12)';
              border = '1px solid rgba(16, 185, 129, 0.35)';
              badgeBg = 'rgba(16, 185, 129, 0.25)';
              badgeColor = '#a7f3d0';
            } else if (isIdsIps) {
              textColor = '#f87171';
              iconColor = '#f87171';
              bg = 'rgba(239, 68, 68, 0.12)';
              border = '1px solid rgba(239, 68, 68, 0.35)';
              badgeBg = 'rgba(239, 68, 68, 0.25)';
              badgeColor = '#fca5a5';
            }

            if (isActive) {
              textColor = '#ffffff';
              iconColor = '#ffffff';
              badgeBg = 'rgba(255, 255, 255, 0.25)';
              badgeColor = '#ffffff';

              if (isTutorial) {
                bg = 'linear-gradient(135deg, #0284c7 0%, #0db7ed 100%)';
                border = '1px solid #38bdf8';
                shadow = '0 2px 14px rgba(14, 165, 233, 0.45)';
              } else if (isAdvance) {
                bg = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
                border = '1px solid #c084fc';
                shadow = '0 2px 14px rgba(168, 85, 247, 0.45)';
              } else if (isXyflow) {
                bg = 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)';
                border = '1px solid #38bdf8';
                shadow = '0 2px 14px rgba(6, 182, 212, 0.5)';
              } else if (isPorts) {
                bg = 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)';
                border = '1px solid #fca5a5';
                shadow = '0 2px 14px rgba(239, 68, 68, 0.45)';
              } else if (isTcpUdp) {
                bg = 'linear-gradient(135deg, #059669 0%, #0284c7 100%)';
                border = '1px solid #34d399';
                shadow = '0 2px 14px rgba(16, 185, 129, 0.45)';
              } else if (isIdsIps) {
                bg = 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)';
                border = '1px solid #f87171';
                shadow = '0 2px 14px rgba(239, 68, 68, 0.5)';
              } else {
                bg = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
                border = '1px solid #34d399';
                shadow = '0 2px 12px rgba(16, 185, 129, 0.35)';
              }
            }

            return (
              <button
                key={tab.id}
                data-active={isActive ? 'true' : 'false'}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? '700' : '500',
                  color: textColor,
                  background: bg,
                  boxShadow: shadow,
                  border: border,
                  cursor: 'pointer',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.18s ease'
                }}
              >
                {/* Serial index badge */}
                <span style={{
                  fontSize: '0.64rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '800',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.07)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                  letterSpacing: '0.02em',
                  lineHeight: 1
                }}>
                  {tab.serial}
                </span>

                <Icon size={15} color={iconColor} />
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.64rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontWeight: '600',
                  background: badgeBg,
                  color: badgeColor
                }}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={handleScrollRight}
            aria-label="Scroll Tabs Right"
            style={{
              position: 'absolute',
              right: 0,
              zIndex: 10,
              width: '28px',
              height: '34px',
              borderRadius: '0 6px 6px 0',
              background: 'linear-gradient(to left, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.8))',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderLeft: 'none',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              transition: 'all 0.15s ease'
            }}
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </header>
  );
}

