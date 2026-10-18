import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Globe,
  Network,
  Share2,
  Terminal,
  Activity,
  Layers,
  Radio,
  Sliders,
  Cable,
  Router,
  Server,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

export default function NetworkSubHeader({ activeSubTab, setActiveSubTab }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const subTabs = [
    { id: 'topology', label: 'Topology & Packet Tracer', icon: Network, badge: 'Live Tracer' },
    { id: 'xyflow-simulation', label: 'xyflow Simulation', icon: Zap, badge: 'Dual Flow', isXyflow: true },
    { id: 'google-journey', label: 'https WEB Flow', icon: Globe, badge: 'TCP+TLS+Page' },
    { id: 'advance', label: 'ADVANCE: Proxy & LB', icon: Server, badge: 'Doc Lab', isAdvance: true },
    { id: 'osi', label: 'OSI & TCP/IP 7 Layers', icon: Layers, badge: 'Encapsulation' },
    { id: 'protocols', label: 'Protocols Explorer', icon: Radio, badge: 'TCP/DNS/ARP' },
    { id: 'terminal', label: 'Network CLI Sandbox', icon: Terminal, badge: 'ping/dig' },
    { id: 'subnet', label: 'Subnet & CIDR Guide', icon: Sliders, badge: 'Calculator' },
    { id: 'tutorial', label: 'Tutorial Doc', icon: BookOpen, badge: '22 Chapters' }
  ];

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

            let textColor = 'var(--text-muted)';
            let iconColor = '#94a3b8';
            let bg = 'rgba(255, 255, 255, 0.03)';
            let border = '1px solid rgba(255, 255, 255, 0.06)';
            let shadow = 'none';
            let badgeBg = 'rgba(255, 255, 255, 0.06)';
            let badgeColor = 'var(--text-dim)';

            if (isAdvance) {
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
            }

            if (isActive) {
              textColor = '#ffffff';
              iconColor = '#ffffff';
              badgeBg = 'rgba(255, 255, 255, 0.25)';
              badgeColor = '#ffffff';

              if (isAdvance) {
                bg = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
                border = '1px solid #c084fc';
                shadow = '0 2px 14px rgba(168, 85, 247, 0.45)';
              } else if (isXyflow) {
                bg = 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)';
                border = '1px solid #38bdf8';
                shadow = '0 2px 14px rgba(6, 182, 212, 0.5)';
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

