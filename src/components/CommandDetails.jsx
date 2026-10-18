import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Zap, 
  HelpCircle, 
  Terminal, 
  Cpu, 
  AlertTriangle, 
  Lightbulb,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function CommandDetails({ command, onLaunchSimulation }) {
  const [copied, setCopied] = useState(false);
  const [activeTokenIndex, setActiveTokenIndex] = useState(0);

  if (!command) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Select a Docker command from the list on the left to inspect its detailed breakdown and motherboard-to-application execution simulation.
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(command.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Color tokens by type
  const getTokenStyle = (type, isSelected) => {
    switch (type) {
      case 'binary':
        return {
          bg: isSelected ? 'rgba(56, 189, 248, 0.3)' : 'rgba(56, 189, 248, 0.12)',
          color: '#38bdf8',
          border: 'rgba(56, 189, 248, 0.4)'
        };
      case 'subcommand':
      case 'command':
        return {
          bg: isSelected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.12)',
          color: '#34d399',
          border: 'rgba(16, 185, 129, 0.4)'
        };
      case 'flag':
        return {
          bg: isSelected ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.12)',
          color: '#c084fc',
          border: 'rgba(168, 85, 247, 0.4)'
        };
      case 'image':
      case 'argument':
        return {
          bg: isSelected ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.12)',
          color: '#fbbf24',
          border: 'rgba(245, 158, 11, 0.4)'
        };
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.08)',
          color: '#f1f5f9',
          border: 'var(--border-subtle)'
        };
    }
  };

  const selectedToken = command.syntaxTokens?.[activeTokenIndex] || command.syntaxTokens?.[0];

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      maxHeight: 'calc(100vh - 210px)',
      overflowY: 'auto'
    }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className={`badge badge-${command.category}`}>
              {command.category}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Category ID: {command.category.toUpperCase()}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
            {command.name}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {command.summary}
          </p>
        </div>

        {/* Action Button: Launch Simulation */}
        <button
          onClick={() => onLaunchSimulation(command)}
          className="btn-primary pulse-glow"
          style={{
            padding: '10px 20px',
            fontSize: '0.9rem'
          }}
        >
          <Zap size={16} />
          <span>Launch Execution Simulator</span>
        </button>
      </div>

      {/* Main Command Bar with Copy Button */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.65)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto' }}>
          <span style={{ color: '#0db7ed', fontWeight: '700', userSelect: 'none' }}>#</span>
          <code style={{ fontSize: '0.95rem', color: '#7dd3fc', whiteSpace: 'nowrap' }}>
            {command.command}
          </code>
        </div>

        <button
          onClick={handleCopy}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
        >
          {copied ? (
            <>
              <Check size={14} color="#10b981" />
              <span style={{ color: '#10b981' }}>Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy CLI</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Syntax Token Breakdown */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)'
          }}>
            Interactive Syntax Breakdown (Click Any Token)
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            Select flag or argument to view parameters
          </span>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '12px',
          background: 'rgba(0, 0, 0, 0.35)',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)'
        }}>
          {command.syntaxTokens?.map((token, idx) => {
            const isSelected = activeTokenIndex === idx;
            const style = getTokenStyle(token.type, isSelected);
            return (
              <button
                key={idx}
                onClick={() => setActiveTokenIndex(idx)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.84rem',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: style.bg,
                  color: style.color,
                  border: `1px solid ${isSelected ? style.color : style.border}`,
                  boxShadow: isSelected ? `0 0 12px ${style.bg}` : 'none',
                  fontWeight: isSelected ? '700' : '500',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)'
                }}
              >
                {token.text}
              </button>
            );
          })}
        </div>

        {/* Selected Token Inspector Card */}
        {selectedToken && (
          <div style={{
            marginTop: '8px',
            padding: '12px 14px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderLeft: '3px solid #38bdf8',
            borderRadius: '0 8px 8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <code style={{ fontSize: '0.88rem', fontWeight: '700', color: '#38bdf8' }}>
                  {selectedToken.text}
                </code>
                <span className="tag-pill" style={{ textTransform: 'capitalize' }}>
                  {selectedToken.type}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {selectedToken.desc}
              </p>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
              Token {activeTokenIndex + 1} of {command.syntaxTokens.length}
            </span>
          </div>
        )}
      </div>

      {/* Detailed Technical Description */}
      <div>
        <h4 style={{
          fontSize: '0.8rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-muted)',
          marginBottom: '8px'
        }}>
          How Docker Executes This Command
        </h4>
        <div style={{
          fontSize: '0.86rem',
          color: 'var(--text-main)',
          lineHeight: 1.6,
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '14px 16px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)'
        }}>
          {command.detailedDescription}
        </div>
      </div>

      {/* Flags & Parameters Table */}
      {command.flagsBreakdown && command.flagsBreakdown.length > 0 && (
        <div>
          <h4 style={{
            fontSize: '0.8rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            marginBottom: '8px'
          }}>
            Common Flags & Options Matrix
          </h4>
          <div style={{
            overflowX: 'auto',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '600', width: '28%' }}>Flag</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '600' }}>Description</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: '600', width: '22%' }}>Default</th>
                </tr>
              </thead>
              <tbody>
                {command.flagsBreakdown.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', color: '#c084fc', fontWeight: '500' }}>
                      {item.flag}
                    </td>
                    <td style={{ padding: '9px 14px', color: 'var(--text-main)' }}>
                      {item.desc}
                    </td>
                    <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                      {item.default}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Realistic Terminal Output */}
      {command.sampleOutput && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Terminal size={14} color="#0db7ed" />
            <span style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)'
            }}>
              Expected Terminal Output
            </span>
          </div>
          <div style={{
            background: '#040711',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f43f5e' }} />
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginLeft: '8px', fontFamily: 'var(--font-mono)' }}>
                bash - stdout
              </span>
            </div>
            <pre style={{
              padding: '12px 14px',
              fontSize: '0.8rem',
              color: '#a7f3d0',
              overflowX: 'auto',
              lineHeight: 1.5,
              margin: 0
            }}>
              {command.sampleOutput}
            </pre>
          </div>
        </div>
      )}

      {/* Production Pro Tips */}
      {command.tips && command.tips.length > 0 && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '10px',
          padding: '14px 16px',
          display: 'flex',
          gap: '12px'
        }}>
          <Lightbulb size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.84rem', color: '#fbbf24', marginBottom: '4px' }}>
              Production Engineering Tips
            </div>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              {command.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
