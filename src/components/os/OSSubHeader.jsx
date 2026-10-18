import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Cpu,
  Network,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Zap,
  FolderTree
} from 'lucide-react';

import { OS_FLAVORS } from '../../data/osData';

export default function OSSubHeader({
  activeOS,
  setActiveOS,
  activeSubTab,
  setActiveSubTab
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const subTabs = [
    { id: 'motherboard', label: 'Motherboard & NIC Flow', icon: Zap, badge: 'xyflow & Dual Mode', isXyflow: true },
    { id: 'kernel', label: 'Kernel & Subsystems Tree', icon: FolderTree, badge: '2.1.1 — 2.3.9' },
    { id: 'tutorial', label: 'OS Master Tutorial', icon: BookOpen, badge: '7 Chapters' }
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

  return (
    <header className="glass-panel" style={{
      top: 12,
      zIndex: 40,
      margin: '0 auto 24px auto',
      maxWidth: '1440px',
      padding: '14px 20px',
      borderRadius: '16px',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(15, 23, 42, 0.92) 100%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* TOP ROW: Brand Title & OS Flavor Selector (2.1 Linux, 2.2 Windows, 2.3 macOS) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Domain Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(168, 85, 247, 0.45)',
            flexShrink: 0
          }}>
            <Cpu size={22} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '1.18rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to right, #ffffff, #c084fc, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                OSCore Simulator
              </span>
              <span style={{
                fontSize: '0.64rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(168, 85, 247, 0.25)',
                color: '#e9d5ff',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                textTransform: 'uppercase'
              }}>
                Operating System Internals
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              From CPU Registers & Motherboard Buses to Kernel Syscalls & Network Card
            </div>
          </div>
        </div>

        {/* 3 OS FLAVOR SELECTOR (Linux, Windows, macOS) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.45)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {OS_FLAVORS.map((os) => {
            const isSel = os.id === activeOS;
            return (
              <button
                key={os.id}
                onClick={() => setActiveOS(os.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: isSel ? '700' : '500',
                  color: isSel ? '#ffffff' : 'var(--text-muted)',
                  background: isSel ? os.accentGradient : 'transparent',
                  border: isSel ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
                  cursor: 'pointer',
                  boxShadow: isSel ? '0 2px 12px rgba(168, 85, 247, 0.4)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{os.name.split(' ')[0]}</span>
                <span style={{
                  fontSize: '0.62rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: isSel ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                  color: isSel ? '#ffffff' : os.color,
                  fontWeight: '700'
                }}>
                  {os.id.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM ROW: Submenu Navigation Tabs */}
      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
        {canScrollLeft && (
          <button
            onClick={handleScrollLeft}
            style={{
              position: 'absolute',
              left: 0,
              zIndex: 10,
              width: '28px',
              height: '34px',
              borderRadius: '6px 0 0 6px',
              background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.8))',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRight: 'none',
              color: '#c084fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <nav
          ref={scrollContainerRef}
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
            border: '1px solid var(--border-subtle)'
          }}
        >
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : '#c084fc',
                  background: isActive
                    ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
                    : 'rgba(168, 85, 247, 0.1)',
                  boxShadow: isActive ? '0 2px 14px rgba(168, 85, 247, 0.45)' : 'none',
                  border: isActive ? '1px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.25)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.18s ease'
                }}
              >
                <Icon size={15} color={isActive ? '#ffffff' : '#c084fc'} />
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.64rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontWeight: '600',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(168, 85, 247, 0.25)',
                  color: isActive ? '#ffffff' : '#e9d5ff'
                }}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {canScrollRight && (
          <button
            onClick={handleScrollRight}
            style={{
              position: 'absolute',
              right: 0,
              zIndex: 10,
              width: '28px',
              height: '34px',
              borderRadius: '0 6px 6px 0',
              background: 'linear-gradient(to left, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.8))',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderLeft: 'none',
              color: '#c084fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </header>
  );
}
