import React, { useState } from 'react';
import { NETWORK_PROTOCOLS } from '../../data/networkingData';
import {
  Radio,
  CheckCircle2,
  Activity,
  Terminal
} from 'lucide-react';

export default function ProtocolVisualizer() {
  const [selectedProtocolId, setSelectedProtocolId] = useState('tcp');

  const selectedProto = NETWORK_PROTOCOLS.find(p => p.id === selectedProtocolId) || NETWORK_PROTOCOLS[0];

  // Specific sequence flows for key protocols
  const protocolFlows = {
    tcp: [
      { step: 1, from: 'Client (Ephemeral Port)', to: 'Server (Port 443)', label: 'SYN (Seq = 100)', desc: 'Client requests connection synchronization with initial sequence number 100.' },
      { step: 2, from: 'Server (Port 443)', to: 'Client', label: 'SYN-ACK (Seq = 300, Ack = 101)', desc: 'Server acknowledges client Seq+1 and sends its own initial sequence number 300.' },
      { step: 3, from: 'Client', to: 'Server (Port 443)', label: 'ACK (Seq = 101, Ack = 301)', desc: 'Client acknowledges server sequence number. Connection is now ESTABLISHED.' },
      { step: 4, from: 'Client / Server', to: 'Both Hosts', label: 'Data Transfer (Pushed Segments)', desc: 'Bi-directional ordered streaming of application data with sliding window flow control.' }
    ],
    udp: [
      { step: 1, from: 'Client Application', to: 'OS UDP Socket', label: '0-RTT Socket Write', desc: 'No handshake required. Application immediately writes datagram to socket.' },
      { step: 2, from: 'Client', to: 'Remote Target (e.g. 8.8.8.8:53)', label: 'Raw UDP Datagram (8B Header)', desc: 'Carries Source Port, Dest Port, Length, Checksum, and Payload directly.' },
      { step: 3, from: 'Remote Server', to: 'Client', label: 'Response Datagram (if applicable)', desc: 'Connectionless response. Zero state maintained on either endpoint.' }
    ],
    dns: [
      { step: 1, from: 'Client Browser', to: 'OS Stub Resolver', label: 'Check Local Cache & Hosts', desc: 'Checks in-memory DNS cache and /etc/hosts for cached IP address.' },
      { step: 2, from: 'OS Resolver', to: 'Recursive DNS (8.8.8.8:53)', label: 'UDP Query: A? example.com', desc: 'Sends standard recursive query across internet to upstream DNS server.' },
      { step: 3, from: 'Recursive Resolver', to: 'Root & TLD Servers', label: 'Iterative Hierarchical Lookup', desc: 'Resolver queries Root (.) -> .com TLD -> Authoritative Nameserver.' },
      { step: 4, from: 'Recursive DNS', to: 'Client', label: 'DNS Response: 93.184.216.34', desc: 'Returns resolved IPv4 record with TTL (300 seconds) for caching.' }
    ],
    arp: [
      { step: 1, from: 'Client PC (192.168.1.10)', to: 'LAN Broadcast (FF:FF:FF:FF:FF:FF)', label: 'ARP Request (Broadcast)', desc: 'Who has 192.168.1.1? Tell 192.168.1.10 (Target MAC: 00:00:00:00:00:00).' },
      { step: 2, from: 'Local Switch', to: 'All Switch Ports', label: 'L2 Frame Flooding', desc: 'Switch receives broadcast address and floods frame to all connected ports.' },
      { step: 3, from: 'Gateway Router (192.168.1.1)', to: 'Client PC (Unicast)', label: 'ARP Reply: 00:50:56:C0:00:01', desc: 'Target device answers with its hardware MAC address directly to client.' },
      { step: 4, from: 'Client Kernel', to: 'Local ARP Table Cache', label: 'Kernel Cache Inserted', desc: 'Client stores MAC in arp table (`arp -a`) for subsequent IP communications.' }
    ],
    dhcp: [
      { step: 1, from: 'Client (0.0.0.0:68)', to: 'Broadcast (255.255.255.255:67)', label: 'DHCP DISCOVER', desc: 'New device joins network with no IP and broadcasts a discover message looking for any DHCP server.' },
      { step: 2, from: 'DHCP Server (192.168.1.1:67)', to: 'Client (Broadcast / Unicast)', label: 'DHCP OFFER (192.168.1.50)', desc: 'Server reserves an available IP lease and offers it to the client MAC with mask and gateway.' },
      { step: 3, from: 'Client', to: 'DHCP Server', label: 'DHCP REQUEST', desc: 'Client formally accepts the offer and requests the assigned IP configuration.' },
      { step: 4, from: 'DHCP Server', to: 'Client', label: 'DHCP ACK (Lease Confirmed)', desc: 'Server finalizes lease, commits IP in lease table, and client activates network interface.' }
    ],
    icmp: [
      { step: 1, from: 'Client Host', to: 'Target Host (8.8.8.8)', label: 'Echo Request (Type 8, Code 0)', desc: 'Sends ICMP probe with 32/64 byte payload, sequence counter, and timestamp.' },
      { step: 2, from: 'Intermediate Routers', to: 'Next Hop', label: 'TTL Decrement (Hop by Hop)', desc: 'Each router decrements IP header TTL by 1. If TTL hits 0, returns Type 11 Time Exceeded.' },
      { step: 3, from: 'Target Host', to: 'Client Host', label: 'Echo Reply (Type 0, Code 0)', desc: 'Target kernel receives probe and reflects back an identical echo reply.' },
      { step: 4, from: 'Client Host', to: 'Terminal Output', label: 'Round-Trip Time Computed', desc: 'Client subtracts send timestamp from receive timestamp to calculate RTT latency (e.g. 11.8ms).' }
    ]
  };

  const activeFlow = protocolFlows[selectedProtocolId] || protocolFlows.tcp;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.25)'
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
              background: 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(168, 85, 247, 0.4)'
            }}>
              <Radio size={22} color="#ffffff" />
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
                Network Protocols & Handshake Sequence Visualizer
                <span className="badge" style={{
                  background: 'rgba(168, 85, 247, 0.2)',
                  color: '#c084fc',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  fontSize: '0.7rem'
                }}>
                  TCP / UDP / DNS / ARP / DHCP / ICMP
                </span>
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Inspect the internal state machines, message exchanges, and packet overhead of core internet protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Protocol Selector Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
          flexWrap: 'wrap'
        }}>
          {NETWORK_PROTOCOLS.map((proto) => {
            const isSelected = proto.id === selectedProtocolId;
            return (
              <button
                key={proto.id}
                onClick={() => setSelectedProtocolId(proto.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  background: isSelected ? proto.color : 'rgba(0, 0, 0, 0.3)',
                  border: isSelected ? `1px solid ${proto.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 14px ${proto.color}55` : 'none'
                }}
              >
                {proto.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Sequence Flow Diagram & Protocol Technical Specs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(380px, 1.4fr) minmax(320px, 1fr)',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Column: Sequence Diagram Flow */}
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
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color={selectedProto.color} />
              <span style={{ fontSize: '0.94rem', fontWeight: '700', color: '#ffffff' }}>
                {selectedProto.name} — Sequence Exchange Diagram
              </span>
            </div>
            <span style={{
              fontSize: '0.68rem',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)'
            }}>
              {activeFlow.length} Exchange Steps
            </span>
          </div>

          {/* Sequence Steps Flow Visualizer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeFlow.map((step, idx) => (
              <div
                key={step.step}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: selectedProto.color,
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {step.step}
                    </span>
                    <span style={{
                      fontSize: '0.86rem',
                      fontWeight: '700',
                      color: '#ffffff',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {step.label}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.7rem',
                    color: selectedProto.color,
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: `${selectedProto.color}15`
                  }}>
                    {step.from} → {step.to}
                  </span>
                </div>

                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.45',
                  paddingLeft: '30px'
                }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Protocol Specifications & Capabilities */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: `1px solid ${selectedProto.color}44`
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '12px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                {selectedProto.name}
              </h3>
              <span style={{ fontSize: '0.72rem', color: selectedProto.color, fontWeight: '700' }}>
                {selectedProto.layer}
              </span>
            </div>
            <span style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#cbd5e1'
            }}>
              Overhead: {selectedProto.overhead}
            </span>
          </div>

          {/* Summary */}
          <p style={{
            fontSize: '0.84rem',
            color: '#e2e8f0',
            lineHeight: '1.55',
            marginBottom: '16px'
          }}>
            {selectedProto.summary}
          </p>

          {/* Key Architectural Features */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Core Features & Mechanisms:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {selectedProto.features.map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.76rem', color: '#cbd5e1' }}>
                  <CheckCircle2 size={14} color={selectedProto.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Ports & Use Cases */}
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.74rem'
          }}>
            <div style={{ color: 'var(--text-dim)', fontWeight: '700', marginBottom: '4px' }}>
              Common Ports & Services:
            </div>
            <div style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {selectedProto.portExamples}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
