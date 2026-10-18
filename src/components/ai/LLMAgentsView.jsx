import React, { useState } from 'react';
import {
  Bot,
  Brain,
  Sparkles,
  Search,
  Database,
  ArrowRight,
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  FileText,
  Key,
  Layers,
  Code2,
  Zap,
  Info
} from 'lucide-react';

export default function LLMAgentsView() {
  const [activeTab, setActiveTab] = useState('rag'); // 'rag' | 'agent' | 'embeddings'
  const [currentRagStep, setCurrentRagStep] = useState(0);
  const [userQuery, setUserQuery] = useState('How does Docker cgroups v2 control container CPU limits?');
  const [agentStep, setAgentStep] = useState(0);

  // RAG Pipeline Steps
  const ragSteps = [
    {
      num: 1,
      title: 'User Query & Embedding Vectorization',
      badge: 'Step 1: Embedding Model',
      desc: 'User submits natural language query. An embedding model (e.g. text-embedding-3-small) converts text into a high-dimensional dense vector representation (1536 dimensions).',
      codeSnippet: `const queryVector = await openai.embeddings.create({\n  model: "text-embedding-3-small",\n  input: query\n}); // Output: [0.0124, -0.0451, 0.0892, ... 1536 dims]`,
      metric: '1536 float32 dimensions'
    },
    {
      num: 2,
      title: 'Vector Database Cosine Similarity Search',
      badge: 'Step 2: Vector DB ANN Search',
      desc: 'The query vector is queried against a Vector Database (Qdrant, Pinecone, or pgvector using HNSW indexing) to find the top-K chunks with highest cosine similarity.',
      codeSnippet: `SELECT chunk_text, 1 - (embedding <=> query_vec) AS similarity\nFROM knowledge_chunks\nORDER BY embedding <=> query_vec\nLIMIT 3;`,
      metric: 'Cosine Similarity: 0.942 (Top Chunk)'
    },
    {
      num: 3,
      title: 'Context Retrieval & Augmented Prompt Assembly',
      badge: 'Step 3: Prompt Augmentation',
      desc: 'The top matching documentation chunks are retrieved and injected into the LLM system prompt as verified ground-truth context.',
      codeSnippet: `const augmentedPrompt = \`Use only the following context to answer:\n---\nContext: \${retrievedChunks.join("\\n")}\n---\nQuestion: \${userQuery}\`;`,
      metric: '3 relevant chunks retrieved'
    },
    {
      num: 4,
      title: 'LLM Generation & Grounded Response',
      badge: 'Step 4: LLM Generation',
      desc: 'The LLM synthesizes an accurate, citation-backed response based strictly on the retrieved context, preventing hallucinations.',
      codeSnippet: `Response: "In Docker cgroups v2, CPU limits are configured in /sys/fs/cgroup/<id>/cpu.max with quota and period values. For example, '20000 100000' limits usage to 20% of 1 CPU core."`,
      metric: 'Tokens: 142 • Grounded: 100%'
    }
  ];

  // Agentic ReAct Loop Steps
  const agentSteps = [
    {
      num: 1,
      type: 'Thought',
      content: 'The user wants to deploy a Node.js app with Redis. I need to first check if Redis is currently running on the server.',
      color: '#38bdf8'
    },
    {
      num: 2,
      type: 'Action (Tool Call)',
      tool: 'docker_ps(filter="redis")',
      content: 'Executing tool: docker_ps(filter="name=redis")',
      color: '#f59e0b'
    },
    {
      num: 3,
      type: 'Observation (Tool Output)',
      content: 'Result: No container matching "redis" is running. Exit code: 0, Output: []',
      color: '#10b981'
    },
    {
      num: 4,
      type: 'Thought',
      content: 'Redis is not running. I should spin up a Redis container using "docker run -d --name redis-cache -p 6379:6379 redis:alpine".',
      color: '#38bdf8'
    },
    {
      num: 5,
      type: 'Action (Tool Call)',
      tool: 'docker_run(image="redis:alpine", name="redis-cache", ports=["6379:6379"])',
      content: 'Executing tool: docker_run(...)',
      color: '#f59e0b'
    },
    {
      num: 6,
      type: 'Observation (Tool Output)',
      content: 'Result: Container ID d8e74a12bf99 spawned successfully. Port 6379 mapped.',
      color: '#10b981'
    },
    {
      num: 7,
      type: 'Final Answer',
      content: 'Redis container is now active (ID: d8e74a12bf99) and listening on port 6379. Ready for Node.js app deployment!',
      color: '#ec4899'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(236, 72, 153, 0.25)'
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
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(236, 72, 153, 0.4)'
            }}>
              <Bot size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  LLM Agents & RAG Architecture Simulator
                </h2>
                <span className="badge" style={{
                  background: 'rgba(236, 72, 153, 0.2)',
                  color: '#f472b6',
                  border: '1px solid rgba(236, 72, 153, 0.4)',
                  fontSize: '0.68rem',
                  fontWeight: '700'
                }}>
                  Vectors, ReAct & Tool Use
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Simulate how Retrieval-Augmented Generation (RAG) and Autonomous AI Agents plan, call tools, and retrieve semantic vector context.
              </p>
            </div>
          </div>

          {/* Subtabs Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              onClick={() => setActiveTab('rag')}
              style={{
                padding: '7px 14px',
                borderRadius: '7px',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'rag' ? '700' : '500',
                color: activeTab === 'rag' ? '#ffffff' : 'var(--text-muted)',
                background: activeTab === 'rag' ? 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              RAG Pipeline
            </button>
            <button
              onClick={() => setActiveTab('agent')}
              style={{
                padding: '7px 14px',
                borderRadius: '7px',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'agent' ? '700' : '500',
                color: activeTab === 'agent' ? '#ffffff' : 'var(--text-muted)',
                background: activeTab === 'agent' ? 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Agentic ReAct Loop
            </button>
            <button
              onClick={() => setActiveTab('embeddings')}
              style={{
                padding: '7px 14px',
                borderRadius: '7px',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'embeddings' ? '700' : '500',
                color: activeTab === 'embeddings' ? '#ffffff' : 'var(--text-muted)',
                background: activeTab === 'embeddings' ? 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Vector Embeddings
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: RAG PIPELINE SIMULATOR */}
      {activeTab === 'rag' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Query Bar */}
          <div className="glass-panel" style={{
            padding: '16px 20px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <Search size={18} color="#ec4899" />
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask a technical query to test RAG pipeline..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={() => setCurrentRagStep((prev) => (prev + 1) % 4)}
              className="btn btn-primary"
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)'
              }}
            >
              Step Forward
            </button>
          </div>

          {/* RAG 4-Stage Interactive Pipeline */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px'
          }}>
            {ragSteps.map((st, idx) => {
              const isCurrent = idx === currentRagStep;
              const isPast = idx < currentRagStep;

              return (
                <div
                  key={st.num}
                  onClick={() => setCurrentRagStep(idx)}
                  style={{
                    padding: '18px 16px',
                    borderRadius: '12px',
                    background: isCurrent
                      ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)'
                      : 'rgba(15, 23, 42, 0.6)',
                    border: isCurrent
                      ? '2px solid #ec4899'
                      : isPast
                      ? '1px solid #10b981'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isCurrent ? '0 0 20px rgba(236, 72, 153, 0.3)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: isCurrent ? '#ec4899' : (isPast ? '#10b981' : 'rgba(255, 255, 255, 0.1)'),
                      color: '#ffffff',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {st.num}
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      color: isCurrent ? '#f472b6' : 'var(--text-dim)'
                    }}>
                      {st.metric}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                    {st.title}
                  </h3>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
                    {st.desc}
                  </p>

                  <pre style={{
                    margin: 0,
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#cbd5e1',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {st.codeSnippet}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: AGENTIC REACT LOOP (Thought -> Action -> Observation) */}
      {activeTab === 'agent' && (
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
            marginBottom: '18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '12px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Autonomous Agent Execution: ReAct Loop (Reasoning & Tool Execution)
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Goal: "Deploy high-availability Node.js backend with an active Redis cache container"
              </span>
            </div>
            <button
              onClick={() => setAgentStep((prev) => (prev + 1) % agentSteps.length)}
              className="btn btn-primary"
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)'
              }}
            >
              Step ReAct
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {agentSteps.slice(0, agentStep + 1).map((st) => (
              <div
                key={st.num}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  borderLeft: `4px solid ${st.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    color: st.color,
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {st.type}
                  </span>
                  {st.tool && (
                    <span style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#fbbf24',
                      background: 'rgba(245, 158, 11, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      Tool: {st.tool}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: '1.45' }}>
                  {st.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: VECTOR EMBEDDINGS & SIMILARITY */}
      {activeTab === 'embeddings' && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff', marginBottom: '14px', marginTop: 0 }}>
            Vector Similarity & Cosine Distance Demonstration
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Semantic search maps phrases into geometric vector space. Words with similar meanings have smaller angular distances (higher cosine similarity, where 1.0 is identical).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '16px' }}>
            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
                Query: "Docker container CPU limit"
              </div>
              <div style={{ fontSize: '0.74rem', color: '#34d399', marginBottom: '4px' }}>
                Match: "cgroups v2 cpu.max resource quotas"
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                Cosine Similarity: 0.941 (High Semantic Match)
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
                Query: "Docker container CPU limit"
              </div>
              <div style={{ fontSize: '0.74rem', color: '#fbbf24', marginBottom: '4px' }}>
                Match: "Kubernetes pod resource requests"
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                Cosine Similarity: 0.782 (Moderate Related Match)
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#38bdf8', marginBottom: '6px' }}>
                Query: "Docker container CPU limit"
              </div>
              <div style={{ fontSize: '0.74rem', color: '#f87171', marginBottom: '4px' }}>
                Match: "French vanilla gelato recipe"
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                Cosine Similarity: 0.084 (Zero Semantic Relevance)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
