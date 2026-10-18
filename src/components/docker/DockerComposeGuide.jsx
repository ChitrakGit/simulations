import React, { useState } from 'react';
import {
  FileCode,
  Network,
  HardDrive,
  Shield,
  Terminal,
  Copy,
  Check
} from 'lucide-react';

export default function DockerComposeGuide() {
  const [activeSubTab, setActiveSubTab] = useState('commands'); // 'commands' | 'networking' | 'storage' | 'security'
  const [copiedSnippet, setCopiedSnippet] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const COMPOSE_COMMANDS = [
    {
      cmd: 'docker compose up -d',
      desc: 'Builds, creates, attaches to networks/volumes, and starts all services defined in compose.yaml in the background (detached mode).',
      badge: 'Launch',
      color: '#10b981'
    },
    {
      cmd: 'docker compose down -v',
      desc: 'Stops and tears down containers, networks, and removes named volumes (-v) created by the project for a 100% clean reset.',
      badge: 'Teardown',
      color: '#ef4444'
    },
    {
      cmd: 'docker compose ps -a',
      desc: 'Lists the status, health checks, ports, and container IDs of all services managed by this Compose project.',
      badge: 'Status',
      color: '#38bdf8'
    },
    {
      cmd: 'docker compose logs -f --tail=100 [service]',
      desc: 'Follows real-time aggregated or per-service stdout/stderr logs with timestamps and color-coded prefixes.',
      badge: 'Logging',
      color: '#fbbf24'
    },
    {
      cmd: 'docker compose exec <service> sh',
      desc: 'Spawns an interactive shell inside a running service container for debugging or ad-hoc database queries.',
      badge: 'Shell',
      color: '#a855f7'
    },
    {
      cmd: 'docker compose build --no-cache',
      desc: 'Forces a fresh rebuild of all service Dockerfiles without using cached image layers.',
      badge: 'Rebuild',
      color: '#06b6d4'
    },
    {
      cmd: 'docker compose restart <service>',
      desc: 'Restarts a specific service (e.g. reload Nginx configuration or reboot a crashed API worker).',
      badge: 'Restart',
      color: '#ec4899'
    },
    {
      cmd: 'docker compose config',
      desc: 'Validates syntax, parses .env variables, and outputs the resolved configuration for CI/CD linting.',
      badge: 'Validation',
      color: '#34d399'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* SECTION HEADER */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(99, 102, 241, 0.08) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontSize: '0.72rem' }}>
                Module 4
              </span>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontSize: '0.72rem' }}>
                Multi-Container Orchestration
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileCode size={24} color="#fbbf24" />
              Docker Compose: Commands, Networking, Storage & Production Security
            </h2>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Define and run multi-container Docker applications with declarative YAML configs, multi-tier network segregation, and production secret management.
            </div>
          </div>

          {/* Sub-tab Navigation Pills */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.4)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', flexWrap: 'wrap' }}>
            {[
              { id: 'commands', label: '1. Compose Commands', icon: Terminal },
              { id: 'networking', label: '2. Compose Networking', icon: Network },
              { id: 'storage', label: '3. Compose Storage', icon: HardDrive },
              { id: 'security', label: '4. Compose Security & Secrets', icon: Shield }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    background: isActive ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SUBTAB 1: COMPOSE COMMANDS */}
      {activeSubTab === 'commands' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fbbf24', marginTop: 0, marginBottom: '6px' }}>
              Docker Compose CLI Lifecycle Cheatsheet
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              Instead of running a dozen separate <code>docker run</code> and <code>docker network create</code> commands manually, Docker Compose coordinates your entire multi-container topology using one simple configuration file (<code>compose.yaml</code>).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {COMPOSE_COMMANDS.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="badge" style={{ background: `${item.color}20`, color: item.color, fontSize: '0.7rem' }}>
                        {item.badge}
                      </span>
                      <button
                        onClick={() => copyToClipboard(item.cmd, `comp-cmd-${idx}`)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}
                      >
                        {copiedSnippet === `comp-cmd-${idx}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                        <span>{copiedSnippet === `comp-cmd-${idx}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre style={{ margin: '0 0 8px 0', padding: '8px 10px', background: 'rgba(0,0,0,0.6)', borderRadius: '6px', color: '#a7f3d0', fontFamily: 'monospace', fontSize: '0.82rem', overflowX: 'auto' }}>
                      {item.cmd}
                    </pre>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: COMPOSE NETWORKING */}
      {activeSubTab === 'networking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fbbf24', marginTop: 0, marginBottom: '6px' }}>
              Docker Compose Multi-Tier Network Segmentation
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              By default, Compose puts all services on a single bridge network named <code>&lt;project&gt;_default</code>. In production, enterprise applications use <strong>network segmentation</strong>: separating the public-facing frontend web tier from the sensitive internal database tier.
            </p>

            {/* Architecture Diagram */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.55)',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.8rem',
              fontFamily: 'monospace'
            }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', padding: '10px 14px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ color: '#38bdf8', fontWeight: '700' }}>[Public User]</span><br />
                Port :80 / :443
              </div>
              <div style={{ color: 'var(--text-dim)' }}>➔ (frontend-net) ➔</div>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '10px 14px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ color: '#34d399', fontWeight: '700' }}>[API Backend]</span><br />
                Both frontend & backend nets
              </div>
              <div style={{ color: 'var(--text-dim)' }}>➔ (backend-net) ➔</div>
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '10px 14px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ color: '#f87171', fontWeight: '700' }}>[Postgres Database]</span><br />
                NO host ports, backend-net ONLY!
              </div>
            </div>

            {/* compose.yaml Example */}
            <div style={{ position: 'relative' }}>
              <pre style={{
                margin: 0,
                padding: '16px',
                background: 'rgba(0, 0, 0, 0.75)',
                borderRadius: '10px',
                color: '#a7f3d0',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                lineHeight: 1.55,
                overflowX: 'auto'
              }}>
{`services:
  # Public reverse proxy / web server
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    networks:
      - frontend-net
    depends_on:
      - api

  # API server connects to BOTH networks to bridge traffic
  api:
    build: ./api
    networks:
      - frontend-net
      - backend-net
    environment:
      # Reaches database by service name automatically via DNS!
      DATABASE_URL: postgres://user:secret@db:5432/app_db

  # Database connects strictly to isolated backend-net
  db:
    image: postgres:16-alpine
    networks:
      - backend-net
    # NOTICE: No 'ports:' block! DB is 100% inaccessible from the outside Internet!
    volumes:
      - db_data:/var/lib/postgresql/data

networks:
  frontend-net:
    driver: bridge
  backend-net:
    driver: bridge

volumes:
  db_data:`}
              </pre>
              <button
                onClick={() => copyToClipboard(`services:\n  web:\n    image: nginx:alpine\n    ports:\n      - "80:80"\n    networks:\n      - frontend-net\n  api:\n    build: ./api\n    networks:\n      - frontend-net\n      - backend-net\n  db:\n    image: postgres:16-alpine\n    networks:\n      - backend-net\n    volumes:\n      - db_data:/var/lib/postgresql/data\nnetworks:\n  frontend-net:\n  backend-net:\nvolumes:\n  db_data:`, 'compose-net')}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '6px 12px', color: '#ffffff', cursor: 'pointer', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {copiedSnippet === 'compose-net' ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copiedSnippet === 'compose-net' ? 'Copied' : 'Copy YAML'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: COMPOSE STORAGE */}
      {activeSubTab === 'storage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fbbf24', marginTop: 0, marginBottom: '6px' }}>
              Docker Compose Storage: Named Volumes vs Host Bind Mounts
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              Compose cleanly separates ephemeral container code from persistent state using named volumes declared at the root <code>volumes:</code> level and bind mounts for real-time development reloading.
            </p>

            <div style={{ position: 'relative' }}>
              <pre style={{
                margin: 0,
                padding: '16px',
                background: 'rgba(0, 0, 0, 0.75)',
                borderRadius: '10px',
                color: '#a7f3d0',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                lineHeight: 1.55,
                overflowX: 'auto'
              }}>
{`services:
  backend:
    build: .
    volumes:
      # 1. BIND MOUNT (Host directory into container for live hot reloading)
      - ./src:/app/src
      # 2. ANONYMOUS VOLUME (Protects container node_modules from being overwritten by host)
      - /app/node_modules
      # 3. READ-ONLY BIND MOUNT (Config files that container must not modify)
      - ./nginx.conf:/etc/nginx/nginx.conf:ro

  database:
    image: postgres:16
    volumes:
      # 4. NAMED VOLUME (Persistent database storage managed by Docker daemon)
      - pgdata:/var/lib/postgresql/data

# Top-level named volumes declaration
volumes:
  pgdata:
    driver: local`}
              </pre>
              <button
                onClick={() => copyToClipboard(`services:\n  backend:\n    volumes:\n      - ./src:/app/src\n      - /app/node_modules\n      - ./nginx.conf:/etc/nginx/nginx.conf:ro\n  database:\n    volumes:\n      - pgdata:/var/lib/postgresql/data\nvolumes:\n  pgdata:`, 'compose-storage')}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '6px 12px', color: '#ffffff', cursor: 'pointer', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {copiedSnippet === 'compose-storage' ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copiedSnippet === 'compose-storage' ? 'Copied' : 'Copy YAML'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: COMPOSE SECURITY */}
      {activeSubTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fbbf24', marginTop: 0, marginBottom: '6px' }}>
              Docker Compose Production Security: Secrets & Zero-Trust Hardening
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              Passing plain-text passwords in <code>environment:</code> or <code>.env</code> is a severe vulnerability because anyone running <code>docker inspect</code> or viewing container logs can read your production credentials. Use <strong>Docker Compose Secrets</strong> to mount credentials strictly in memory.
            </p>

            <div style={{ position: 'relative' }}>
              <pre style={{
                margin: 0,
                padding: '16px',
                background: 'rgba(0, 0, 0, 0.75)',
                borderRadius: '10px',
                color: '#a7f3d0',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                lineHeight: 1.55,
                overflowX: 'auto'
              }}>
{`services:
  api:
    image: my-secure-api:latest
    
    # 1. Non-root user execution (UID:GID)
    user: "1001:1001"

    # 2. Immutable read-only root filesystem
    read_only: true

    # 3. Mount temporary writable directories strictly in RAM (tmpfs)
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=64m
      - /app/cache:rw,noexec,nosuid,size=32m

    # 4. Strip dangerous Linux capabilities
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE

    # 5. Prevent setuid privilege escalation
    security_opt:
      - no-new-privileges:true

    # 6. Secure Secrets: mounted in RAM at /run/secrets/db_password
    secrets:
      - db_password

    # 7. Strict resource constraints
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 512M

# Declarative secrets loaded from local host files (or Swarm secret store)
secrets:
  db_password:
    file: ./secrets/db_password.txt`}
              </pre>
              <button
                onClick={() => copyToClipboard(`services:\n  api:\n    image: my-secure-api:latest\n    user: "1001:1001"\n    read_only: true\n    tmpfs:\n      - /tmp:rw,noexec,nosuid,size=64m\n    cap_drop:\n      - ALL\n    cap_add:\n      - NET_BIND_SERVICE\n    security_opt:\n      - no-new-privileges:true\n    secrets:\n      - db_password\nsecrets:\n  db_password:\n    file: ./secrets/db_password.txt`, 'compose-security')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copiedSnippet === 'compose-security' ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copiedSnippet === 'compose-security' ? 'Copied' : 'Copy Hardened Compose'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
