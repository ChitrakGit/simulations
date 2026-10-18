import React, { useState, useMemo } from 'react';
import { SUBNET_PRESETS } from '../../data/networkingData';
import {
  Sliders,
  Binary,
  Network,
  Box
} from 'lucide-react';

export default function SubnetCalculator() {
  const [ipInput, setIpInput] = useState('192.168.1.0');
  const [selectedCidr, setSelectedCidr] = useState(24);

  // Compute subnet math
  const subnetMath = useMemo(() => {
    const cidr = parseInt(selectedCidr, 10);
    const totalIps = Math.pow(2, 32 - cidr);
    const usableIps = cidr >= 31 ? (cidr === 31 ? 2 : 1) : totalIps - 2;

    // Convert CIDR to dotted mask
    let maskInt = 0;
    for (let i = 0; i < cidr; i++) {
      maskInt |= (1 << (31 - i));
    }
    const maskOctets = [
      (maskInt >>> 24) & 255,
      (maskInt >>> 16) & 255,
      (maskInt >>> 8) & 255,
      maskInt & 255
    ];
    const maskStr = maskOctets.join('.');

    // Wildcard mask
    const wildcardStr = maskOctets.map(o => 255 - o).join('.');

    // Parse base IP
    const baseOctets = ipInput.split('.').map(o => parseInt(o, 10) || 0);
    while (baseOctets.length < 4) baseOctets.push(0);

    const baseInt = ((baseOctets[0] << 24) | (baseOctets[1] << 16) | (baseOctets[2] << 8) | baseOctets[3]) >>> 0;
    const networkInt = (baseInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;

    const intToIp = (val) => [
      (val >>> 24) & 255,
      (val >>> 16) & 255,
      (val >>> 8) & 255,
      val & 255
    ].join('.');

    const networkIp = intToIp(networkInt);
    const broadcastIp = intToIp(broadcastInt);
    const firstUsable = cidr >= 31 ? networkIp : intToIp(networkInt + 1);
    const lastUsable = cidr >= 31 ? broadcastIp : intToIp(broadcastInt - 1);

    // 32-bit binary string
    let binaryMask = '';
    for (let i = 0; i < 32; i++) {
      if (i > 0 && i % 8 === 0) binaryMask += ' ';
      binaryMask += i < cidr ? '1' : '0';
    }

    return {
      cidr,
      maskStr,
      wildcardStr,
      totalIps: totalIps.toLocaleString(),
      usableIps: usableIps.toLocaleString(),
      networkIp,
      broadcastIp,
      firstUsable,
      lastUsable,
      binaryMask
    };
  }, [ipInput, selectedCidr]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(245, 158, 11, 0.4)'
            }}>
              <Sliders size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: '#ffffff',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                IPv4 Subnet & CIDR Calculation Engine
                <span className="badge" style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  fontSize: '0.7rem'
                }}>
                  32-Bit Binary Masking
                </span>
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Calculate network boundaries, broadcast addresses, usable host scopes, and container bridge networking layouts.
              </p>
            </div>
          </div>
        </div>

        {/* Subnet Presets */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px',
          marginTop: '16px'
        }}>
          {SUBNET_PRESETS.map((p) => {
            const cidrNum = parseInt(p.cidr.replace('/', ''), 10);
            const isSelected = selectedCidr === cidrNum;
            return (
              <div
                key={p.cidr}
                onClick={() => setSelectedCidr(cidrNum)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                  border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: '800', color: isSelected ? '#fbbf24' : '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    {p.cidr}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                    {p.usableIps.toLocaleString()} Hosts
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {p.useCase}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Controls & Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(340px, 1.2fr) minmax(360px, 1.8fr)',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Column: Interactive Inputs & CIDR Slider */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '0.96rem', fontWeight: '700', color: '#ffffff', marginBottom: '16px', marginTop: 0 }}>
            Subnet Parameters
          </h3>

          {/* IP Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Base IP Address:
            </label>
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="192.168.1.0"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* CIDR Range Slider */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                CIDR Prefix Length:
              </label>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                /{selectedCidr}
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="32"
              value={selectedCidr}
              onChange={(e) => setSelectedCidr(parseInt(e.target.value, 10))}
              style={{
                width: '100%',
                accentColor: '#f59e0b',
                cursor: 'pointer'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>/8 (Class A)</span>
              <span>/16 (Class B)</span>
              <span>/24 (Class C)</span>
              <span>/32 (Host)</span>
            </div>
          </div>

          {/* Binary Mask Visualization */}
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
              <Binary size={14} color="#f59e0b" />
              <span>32-Bit Binary Subnet Mask:</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              color: '#fbbf24',
              letterSpacing: '0.06em',
              wordBreak: 'break-all'
            }}>
              {subnetMath.binaryMask}
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', marginTop: '6px' }}>
              <strong style={{ color: '#fbbf24' }}>{selectedCidr}</strong> network bits, <strong style={{ color: '#34d399' }}>{32 - selectedCidr}</strong> host bits
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Results Matrix */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '12px'
          }}>
            <h3 style={{ fontSize: '0.96rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Calculated Subnet Topology
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              {subnetMath.networkIp}/{subnetMath.cidr}
            </span>
          </div>

          {/* Results Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Network Address:</div>
              <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                {subnetMath.networkIp}
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Broadcast Address:</div>
              <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#f87171', fontFamily: 'var(--font-mono)' }}>
                {subnetMath.broadcastIp}
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>First Usable Host:</div>
              <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                {subnetMath.firstUsable}
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Last Usable Host:</div>
              <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                {subnetMath.lastUsable}
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Subnet Netmask:</div>
              <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                {subnetMath.maskStr}
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Usable Host Count:</div>
              <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {subnetMath.usableIps} hosts
              </div>
            </div>
          </div>

          {/* Docker Network Connection Note */}
          <div style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'rgba(14, 165, 233, 0.08)',
            border: '1px solid rgba(14, 165, 233, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <Box size={18} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ fontSize: '0.76rem', color: '#e2e8f0', lineHeight: '1.45' }}>
              <strong style={{ color: '#38bdf8' }}>How Docker Uses Subnets:</strong> By default, Docker creates the <code style={{ color: '#fbbf24' }}>docker0</code> bridge with subnet <code style={{ color: '#fbbf24' }}>172.17.0.0/16</code> (65,534 usable IPs). The daemon claims <code style={{ color: '#fbbf24' }}>172.17.0.1</code> as the default gateway, assigning subsequent IPs (<code style={{ color: '#fbbf24' }}>172.17.0.2</code>, <code style={{ color: '#fbbf24' }}>172.17.0.3</code>) to spun up containers!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
