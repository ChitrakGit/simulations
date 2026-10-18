import React, { useState } from 'react';
import { OSI_LAYERS } from '../../data/networkingData';
import {
  Layers,
  ArrowDown,
  ArrowUp,
  Cpu,
  ShieldCheck,
  Terminal,
  Activity,
  Server,
  Radio,
  FileCode,
  CheckCircle2,
  HelpCircle,
  Hash,
  Share2
} from 'lucide-react';

export default function OsiLayerExplorer() {
  const [selectedLayerNumber, setSelectedLayerNumber] = useState(7);
  const [viewMode, setViewMode] = useState('osi'); // 'osi' (7 layers) | 'tcpip' (4 layers)
  const [packetDirection, setPacketDirection] = useState('encapsulation'); // 'encapsulation' (down L7->L1) | 'decapsulation' (up L1->L7)

  const selectedLayer = OSI_LAYERS.find(l => l.layerNumber === selectedLayerNumber) || OSI_LAYERS[0];

  // TCP/IP Model Mapping
  const tcpIpLayers = [
    {
      name: 'Application Layer',
      osiEquivalent: 'Layers 7, 6, 5 (Application, Presentation, Session)',
      pdu: 'Data',
      protocols: ['HTTP/HTTPS', 'DNS', 'SSH', 'TLS', 'WebSocket', 'SMTP'],
      color: '#ef4444'
    },
    {
      name: 'Transport Layer',
      osiEquivalent: 'Layer 4 (Transport)',
      pdu: 'Segment / Datagram',
      protocols: ['TCP', 'UDP', 'QUIC', 'SCTP'],
      color: '#10b981'
    },
    {
      name: 'Internet Layer',
      osiEquivalent: 'Layer 3 (Network)',
      pdu: 'Packet',
      protocols: ['IPv4', 'IPv6', 'ICMP', 'IPsec', 'BGP'],
      color: '#06b6d4'
    },
    {
      name: 'Network Access / Link Layer',
      osiEquivalent: 'Layers 2, 1 (Data Link & Physical)',
      pdu: 'Frame & Bits',
      protocols: ['Ethernet (802.3)', 'Wi-Fi (802.11)', 'ARP', 'Optical Fiber PHY'],
      color: '#8b5cf6'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.25)'
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
              background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(6, 182, 212, 0.4)'
            }}>
              <Layers size={22} color="#ffffff" />
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
                OSI 7-Layer & TCP/IP Architecture Explorer
                <span className="badge" style={{
                  background: 'rgba(6, 182, 212, 0.2)',
                  color: '#38bdf8',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  fontSize: '0.7rem'
                }}>
                  Protocol Stacks & PDU
                </span>
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Understand packet encapsulation (headers prepended on transmission) and decapsulation (headers stripped on reception).
              </p>
            </div>
          </div>

          {/* Model Switcher & Direction Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* View Mode Toggle */}
            <div style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <button
                onClick={() => setViewMode('osi')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: viewMode === 'osi' ? '700' : '500',
                  color: viewMode === 'osi' ? '#ffffff' : 'var(--text-muted)',
                  background: viewMode === 'osi' ? '#0284c7' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                OSI 7-Layers
              </button>
              <button
                onClick={() => setViewMode('tcpip')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: viewMode === 'tcpip' ? '700' : '500',
                  color: viewMode === 'tcpip' ? '#ffffff' : 'var(--text-muted)',
                  background: viewMode === 'tcpip' ? '#059669' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                TCP/IP 4-Layers
              </button>
            </div>

            {/* Encapsulation / Decapsulation Direction */}
            <button
              onClick={() => setPacketDirection(prev => prev === 'encapsulation' ? 'decapsulation' : 'encapsulation')}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.78rem'
              }}
            >
              {packetDirection === 'encapsulation' ? <ArrowDown size={14} color="#38bdf8" /> : <ArrowUp size={14} color="#34d399" />}
              <span>{packetDirection === 'encapsulation' ? 'Encapsulation (L7 → L1)' : 'Decapsulation (L1 → L7)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(340px, 1.1fr) minmax(420px, 1.9fr)',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Column: Stack Layers Representation */}
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '10px'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
              {viewMode === 'osi' ? 'OSI 7-Layer Protocol Stack' : 'TCP/IP Model Protocol Stack'}
            </span>
            <span style={{
              fontSize: '0.68rem',
              color: packetDirection === 'encapsulation' ? '#38bdf8' : '#34d399',
              fontWeight: '700',
              fontFamily: 'var(--font-mono)'
            }}>
              {packetDirection === 'encapsulation' ? '↓ Outgoing Packet' : '↑ Incoming Packet'}
            </span>
          </div>

          {/* OSI 7-Layer Interactive Stack */}
          {viewMode === 'osi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {OSI_LAYERS.map((layer) => {
                const isSelected = layer.layerNumber === selectedLayerNumber;
                return (
                  <div
                    key={layer.layerNumber}
                    onClick={() => setSelectedLayerNumber(layer.layerNumber)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: isSelected
                        ? `linear-gradient(135deg, ${layer.color}25 0%, rgba(15, 23, 42, 0.9) 100%)`
                        : 'rgba(0, 0, 0, 0.3)',
                      border: isSelected ? `2px solid ${layer.color}` : '1px solid rgba(255, 255, 255, 0.06)',
                      boxShadow: isSelected ? `0 0 16px ${layer.glowColor}` : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: `${layer.color}22`,
                        border: `1px solid ${layer.color}55`,
                        color: layer.color,
                        fontWeight: '800',
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        L{layer.layerNumber}
                      </div>

                      <div>
                        <div style={{
                          fontSize: '0.86rem',
                          fontWeight: isSelected ? '700' : '600',
                          color: isSelected ? '#ffffff' : '#cbd5e1'
                        }}>
                          {layer.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                          PDU: <strong style={{ color: layer.color }}>{layer.pdu}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '0.64rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-dim)'
                      }}>
                        {layer.protocols.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TCP/IP 4-Layer Interactive Stack */}
          {viewMode === 'tcpip' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tcpIpLayers.map((layer, idx) => (
                <div
                  key={layer.name}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${layer.color}15 0%, rgba(15, 23, 42, 0.9) 100%)`,
                    border: `1px solid ${layer.color}44`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: layer.color }}>
                      Layer {4 - idx}: {layer.name}
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff'
                    }}>
                      PDU: {layer.pdu}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Maps to: <strong style={{ color: '#cbd5e1' }}>{layer.osiEquivalent}</strong>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    Protocols: {layer.protocols.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Encapsulation Visualizer Pipeline */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Packet Encapsulation Wrap Sequence:
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              <span style={{ padding: '4px 6px', borderRadius: '4px', background: '#6366f133', color: '#818cf8' }}>[Eth Header]</span>
              <span style={{ padding: '4px 6px', borderRadius: '4px', background: '#06b6d433', color: '#22d3ee' }}>[IP Header]</span>
              <span style={{ padding: '4px 6px', borderRadius: '4px', background: '#10b98133', color: '#34d399' }}>[TCP Header]</span>
              <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#ef444433', color: '#f87171' }}>[HTTP Payload]</span>
              <span style={{ padding: '4px 6px', borderRadius: '4px', background: '#6366f133', color: '#818cf8' }}>[CRC FCS]</span>
            </div>
          </div>
        </div>

        {/* Right Column: Layer In-Depth Technical Inspector */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: `1px solid ${selectedLayer.color}44`
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${selectedLayer.color} 0%, ${selectedLayer.color}99 100%)`,
                color: '#ffffff',
                fontWeight: '900',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 16px ${selectedLayer.glowColor}`
              }}>
                L{selectedLayer.layerNumber}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  {selectedLayer.name}
                </h3>
                <span style={{ fontSize: '0.75rem', color: selectedLayer.color, fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                  Unit of Data (PDU): {selectedLayer.pdu}
                </span>
              </div>
            </div>

            <span className="badge" style={{
              background: `${selectedLayer.color}22`,
              color: selectedLayer.color,
              border: `1px solid ${selectedLayer.color}55`,
              fontSize: '0.72rem'
            }}>
              OSI Layer {selectedLayer.layerNumber}
            </span>
          </div>

          {/* Description & Role */}
          <p style={{
            fontSize: '0.86rem',
            color: '#e2e8f0',
            lineHeight: '1.6',
            marginBottom: '16px'
          }}>
            {selectedLayer.description}
          </p>

          {/* Key Protocols */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Standard Protocols:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {selectedLayer.protocols.map(proto => (
                <span
                  key={proto}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#ffffff'
                  }}
                >
                  {proto}
                </span>
              ))}
            </div>
          </div>

          {/* Header Fields Formatted Breakdown */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Encapsulated Header Fields:
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '8px',
              marginTop: '6px'
            }}>
              {selectedLayer.headerFields.map(field => (
                <div
                  key={field}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.74rem',
                    color: '#cbd5e1',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Hash size={13} color={selectedLayer.color} />
                  <span>{field}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hardware & Intermediate Devices */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Hardware & Software Devices Operating at this Layer:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {selectedLayer.devices.map(dev => (
                <span
                  key={dev}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: `${selectedLayer.color}15`,
                    border: `1px solid ${selectedLayer.color}35`,
                    fontSize: '0.74rem',
                    color: selectedLayer.color
                  }}
                >
                  {dev}
                </span>
              ))}
            </div>
          </div>

          {/* Diagnostic & Troubleshooting Commands */}
          <div style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={15} color="#34d399" />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>CLI Troubleshooting:</span>
              <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                $ {selectedLayer.troubleshooting}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
