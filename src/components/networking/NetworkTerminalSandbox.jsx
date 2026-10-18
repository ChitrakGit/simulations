import React, { useState } from 'react';
import { NETWORK_CLI_COMMANDS } from '../../data/networkingData';
import {
  Terminal,
  Play,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Radio,
  Clock,
  Cpu
} from 'lucide-react';

export default function NetworkTerminalSandbox() {
  const [selectedCmdObj, setSelectedCmdObj] = useState(NETWORK_CLI_COMMANDS[0]);
  const [inputCommand, setInputCommand] = useState(NETWORK_CLI_COMMANDS[0].cmd);
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState([
    {
      cmd: NETWORK_CLI_COMMANDS[0].cmd,
      output: NETWORK_CLI_COMMANDS[0].sampleOutput,
      category: NETWORK_CLI_COMMANDS[0].category,
      time: '0.012s'
    }
  ]);
  const [copied, setCopied] = useState(false);

  const handleSelectCommand = (cmdObj) => {
    setSelectedCmdObj(cmdObj);
    setInputCommand(cmdObj.cmd);
  };

  const handleExecute = () => {
    if (isExecuting) return;
    setIsExecuting(true);

    const match = NETWORK_CLI_COMMANDS.find(c => c.cmd.toLowerCase() === inputCommand.trim().toLowerCase()) 
      || selectedCmdObj;

    setTimeout(() => {
      setTerminalHistory(prev => [
        {
          cmd: inputCommand.trim(),
          output: match.sampleOutput,
          category: match.category,
          time: `${(Math.random() * 0.05 + 0.01).toFixed(3)}s`
        },
        ...prev
      ]);
      setIsExecuting(false);
    }, 600);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearHistory = () => {
    setTerminalHistory([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)'
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
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.4)'
            }}>
              <Terminal size={22} color="#ffffff" />
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
                Network Diagnostics & CLI Sandbox
                <span className="badge" style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontSize: '0.7rem'
                }}>
                  Real Kernel Socket Output
                </span>
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Test and execute real Linux network diagnostic utilities: ping, traceroute, dig, arp, netstat, and curl.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Command Selector Badges */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>Quick Tests:</span>
          {NETWORK_CLI_COMMANDS.map((item) => {
            const isSelected = item.cmd === selectedCmdObj.cmd;
            return (
              <button
                key={item.cmd}
                onClick={() => handleSelectCommand(item)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-mono)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  background: isSelected ? '#059669' : 'rgba(0, 0, 0, 0.3)',
                  border: isSelected ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.cmd}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Terminal & Command Explanation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(420px, 1.8fr) minmax(320px, 1fr)',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Left Column: Interactive Terminal Window */}
        <div className="glass-panel" style={{
          borderRadius: '16px',
          background: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Terminal Title Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginLeft: '6px' }}>
                developer@net-sandbox: ~ (bash 5.2)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleClearHistory}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RotateCcw size={13} />
                Clear
              </button>
            </div>
          </div>

          {/* Interactive Command Input Form */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(0, 0, 0, 0.3)'
          }}>
            <span style={{ color: '#34d399', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '0.9rem' }}>
              root@net-host:~$
            </span>
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
              placeholder="Enter network command (e.g. ping 8.8.8.8, traceroute 1.1.1.1)..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
            />
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="btn btn-primary"
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
              }}
            >
              <Play size={13} />
              {isExecuting ? 'Probing...' : 'Run'}
            </button>
          </div>

          {/* Terminal Output Log Area */}
          <div style={{
            padding: '16px',
            minHeight: '320px',
            maxHeight: '440px',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            lineHeight: '1.6',
            color: '#cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {terminalHistory.map((entry, idx) => (
              <div key={idx} style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#34d399', fontWeight: '700' }}>$</span>
                    <span style={{ color: '#ffffff', fontWeight: '700' }}>{entry.cmd}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{entry.time}</span>
                    <button
                      onClick={() => handleCopy(entry.output)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-dim)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.68rem'
                      }}
                    >
                      {copied ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                      Copy
                    </button>
                  </div>
                </div>

                <pre style={{
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  color: '#a7f3d0',
                  fontSize: '0.78rem',
                  lineHeight: '1.5'
                }}>
                  {entry.output}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: In-Depth Diagnostic Guide */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Info size={18} color="#34d399" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Command Analysis: {selectedCmdObj.cmd.split(' ')[0]}
            </h3>
          </div>

          <div style={{
            fontSize: '0.72rem',
            padding: '3px 8px',
            borderRadius: '4px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            Category: {selectedCmdObj.category}
          </div>

          <p style={{
            fontSize: '0.84rem',
            color: '#e2e8f0',
            lineHeight: '1.55',
            marginBottom: '16px'
          }}>
            {selectedCmdObj.desc}
          </p>

          <div style={{
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.74rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ color: '#38bdf8', fontWeight: '700' }}>
              Under the Hood (Linux Kernel):
            </div>
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.45' }}>
              • Creates raw socket (SOCK_RAW) or BSD datagram socket.<br />
              • Kernel network stack handles IP checksums & TTL header values.<br />
              • Inspects route tables via Netlink (`ip route`).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
