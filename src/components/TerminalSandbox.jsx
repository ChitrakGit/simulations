import React, { useState, useRef, useEffect } from 'react';
import { Zap, CornerDownLeft } from 'lucide-react';

export default function TerminalSandbox({ allCommands, onSelectAndSimulate }) {
  const [inputCommand, setInputCommand] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'DockerCore Interactive CLI Sandbox initialized. Docker Daemon v27.0.3 online.' },
    { type: 'system', text: 'Type any Docker command below or click a quick shortcut to run real-time hardware execution.' }
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleExecute = (cmdToRun) => {
    const rawCmd = (cmdToRun || inputCommand).trim();
    if (!rawCmd) return;

    if (rawCmd.toLowerCase() === 'clear') {
      setHistory([]);
      setInputCommand('');
      return;
    }

    if (rawCmd.toLowerCase() === 'help') {
      setHistory(prev => [
        ...prev,
        { type: 'user', text: rawCmd },
        { 
          type: 'system', 
          text: 'Available test commands: docker run, docker ps, docker stop, docker start, docker exec, docker stats, docker inspect, docker images, docker pull, docker network create, docker volume create, etc.' 
        }
      ]);
      setInputCommand('');
      return;
    }

    // Add to history
    setHistory(prev => [...prev, { type: 'user', text: rawCmd }]);
    setCommandHistory(prev => [rawCmd, ...prev]);
    setHistoryPointer(-1);

    // Find closest command match
    const matched = allCommands.find(c => 
      c.command.toLowerCase() === rawCmd.toLowerCase() ||
      c.command.toLowerCase().includes(rawCmd.toLowerCase()) ||
      rawCmd.toLowerCase().includes(c.id.replace('docker-', ''))
    );

    if (matched) {
      setHistory(prev => [
        ...prev,
        { type: 'output', text: matched.sampleOutput || 'Command executed successfully.' },
        { type: 'action', text: `Triggering Motherboard-to-Application Simulation for: ${matched.name}`, command: matched }
      ]);
    } else {
      setHistory(prev => [
        ...prev,
        { 
          type: 'error', 
          text: `Command recognized as Docker syntax. Matching standard simulation template for "docker run"...` 
        },
        { 
          type: 'action', 
          text: 'Triggering Motherboard-to-Application Simulation for: Run Container with Port Forwarding', 
          command: allCommands[0] 
        }
      ]);
    }

    setInputCommand('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyPointer < commandHistory.length - 1) {
        const nextPointer = historyPointer + 1;
        setHistoryPointer(nextPointer);
        setInputCommand(commandHistory[nextPointer]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer > 0) {
        const nextPointer = historyPointer - 1;
        setHistoryPointer(nextPointer);
        setInputCommand(commandHistory[nextPointer]);
      } else if (historyPointer === 0) {
        setHistoryPointer(-1);
        setInputCommand('');
      }
    }
  };

  const presets = [
    'docker run -d -p 80:80 --name web-nginx nginx:alpine',
    'docker ps -a',
    'docker exec -it web-nginx /bin/sh',
    'docker stats --no-stream',
    'docker run -d --memory="512m" --cpus="1.5" nginx:alpine',
    'docker system prune -a --volumes'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Quick Launch Presets */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Quick Test Shortcuts (Click to execute & simulate):
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputCommand(preset);
                handleExecute(preset);
              }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.76rem',
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#7dd3fc',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Zap size={12} color="#38bdf8" />
              <span>{preset}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Window */}
      <div className="glass-panel" style={{
        background: '#040711',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Terminal Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '8px', fontFamily: 'var(--font-mono)' }}>
              bash - docker-cli sandbox (linux x86_64)
            </span>
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            Type 'help' or 'clear'
          </div>
        </div>

        {/* Terminal Content Stream */}
        <div 
          onClick={() => inputRef.current?.focus()}
          style={{
            padding: '18px 20px',
            minHeight: '380px',
            maxHeight: '520px',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.84rem',
            lineHeight: 1.6,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            cursor: 'text'
          }}
        >
          {history.map((item, idx) => {
            if (item.type === 'user') {
              return (
                <div key={idx} style={{ display: 'flex', gap: '8px', color: '#f1f5f9' }}>
                  <span style={{ color: '#0db7ed', fontWeight: '700', userSelect: 'none' }}>root@docker-host:~$</span>
                  <span>{item.text}</span>
                </div>
              );
            }
            if (item.type === 'system') {
              return (
                <div key={idx} style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  [system] {item.text}
                </div>
              );
            }
            if (item.type === 'output') {
              return (
                <pre key={idx} style={{ color: '#6ee7b7', margin: 0, overflowX: 'auto' }}>
                  {item.text}
                </pre>
              );
            }
            if (item.type === 'action') {
              return (
                <div key={idx} style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  margin: '4px 0'
                }}>
                  <span style={{ color: '#c084fc', fontSize: '0.8rem' }}>
                    ⚡ {item.text}
                  </span>
                  <button
                    onClick={() => onSelectAndSimulate(item.command)}
                    className="btn-primary"
                    style={{ padding: '4px 12px', fontSize: '0.74rem' }}
                  >
                    View Simulation Visualizer
                  </button>
                </div>
              );
            }
            if (item.type === 'error') {
              return (
                <div key={idx} style={{ color: '#fbbf24' }}>
                  {item.text}
                </div>
              );
            }
            return null;
          })}

          {/* Active Input Line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ color: '#0db7ed', fontWeight: '700', userSelect: 'none' }}>root@docker-host:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="e.g. docker run -d -p 80:80 nginx:alpine"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                color: '#ffffff'
              }}
            />
            <button
              onClick={() => handleExecute()}
              className="btn-primary"
              style={{ padding: '4px 10px', fontSize: '0.74rem', gap: '4px' }}
            >
              <span>Run</span>
              <CornerDownLeft size={12} />
            </button>
          </div>

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
