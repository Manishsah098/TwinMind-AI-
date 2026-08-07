/**
 * TwinMind AI - Digital Twin Page
 */
import { useEffect, useState, useCallback } from 'react'
import {
  ReactFlow, MiniMap, Controls, Background,
  useNodesState, useEdgesState,
  Handle, Position
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import Header from '../components/Layout/Header'
import { getDigitalTwin } from '../services/api'
import { Network, Layers, Sparkles } from 'lucide-react'

// Custom node styling
const NODE_COLORS = {
  company:    { border: '#22d3ee', bg: 'rgba(6,182,212,0.15)', text: '#22d3ee' },
  finance:    { border: '#818cf8', bg: 'rgba(99,102,241,0.15)', text: '#818cf8' },
  sales:      { border: '#34d399', bg: 'rgba(16,185,129,0.15)', text: '#34d399' },
  marketing:  { border: '#c084fc', bg: 'rgba(168,85,247,0.15)', text: '#c084fc' },
  hr:         { border: '#38bdf8', bg: 'rgba(14,165,233,0.15)', text: '#38bdf8' },
  operations: { border: '#2dd4bf', bg: 'rgba(20,184,166,0.15)', text: '#2dd4bf' },
  inventory:  { border: '#4ade80', bg: 'rgba(74,222,128,0.15)', text: '#4ade80' },
  suppliers:  { border: '#fb923c', bg: 'rgba(251,146,60,0.15)', text: '#fb923c' },
  customers:  { border: '#f472b6', bg: 'rgba(244,114,182,0.15)', text: '#f472b6' },
}

function TwinNode({ data, selected }) {
  const colors = NODE_COLORS[data.nodeType] || NODE_COLORS.company
  const isCompany = data.nodeType === 'company'

  return (
    <div
      style={{
        background: colors.bg,
        border: `2px solid ${selected ? colors.border : colors.border + '80'}`,
        borderRadius: isCompany ? 16 : 12,
        padding: isCompany ? '16px 24px' : '12px 18px',
        minWidth: isCompany ? 160 : 130,
        boxShadow: selected ? `0 0 25px ${colors.border}60` : '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: colors.border, border: 'none', width: 8, height: 8 }} />
      <div style={{ color: colors.text, fontWeight: isCompany ? 800 : 700, fontSize: isCompany ? 15 : 13, marginBottom: 4 }}>
        {data.label}
      </div>
      {data.kpis && Object.entries(data.kpis).slice(0, 2).map(([k, v]) => (
        <div key={k} style={{ fontSize: 11, color: '#d1d5db', marginTop: 2, fontWeight: 500 }}>
          <span style={{ color: '#9ca3af' }}>{k}: </span>{v}
        </div>
      ))}
      <Handle type="source" position={Position.Bottom} style={{ background: colors.border, border: 'none', width: 8, height: 8 }} />
    </div>
  )
}

const nodeTypes = { twinNode: TwinNode }

const DEMO_NODES = [
  { id: 'company',    type: 'twinNode', position: { x: 340, y: 30  }, data: { label: 'DemoCorp', nodeType: 'company', kpis: { Revenue: '$10M', Employees: '420' } } },
  { id: 'finance',    type: 'twinNode', position: { x: 40,  y: 190 }, data: { label: 'Finance', nodeType: 'finance', kpis: { Margin: '68%', EBITDA: '$2.2M' } } },
  { id: 'sales',      type: 'twinNode', position: { x: 190, y: 190 }, data: { label: 'Sales', nodeType: 'sales', kpis: { Pipeline: '$4.2M', 'Win Rate': '24%' } } },
  { id: 'marketing',  type: 'twinNode', position: { x: 340, y: 190 }, data: { label: 'Marketing', nodeType: 'marketing', kpis: { CAC: '$320', LTV: '$8K' } } },
  { id: 'hr',         type: 'twinNode', position: { x: 490, y: 190 }, data: { label: 'HR', nodeType: 'hr', kpis: { Employees: '420', Depts: '6' } } },
  { id: 'operations', type: 'twinNode', position: { x: 640, y: 190 }, data: { label: 'Operations', nodeType: 'operations', kpis: { Suppliers: '35', 'Lead Time': '14d' } } },
  { id: 'inventory',  type: 'twinNode', position: { x: 140, y: 370 }, data: { label: 'Inventory', nodeType: 'inventory', kpis: { Value: '$150K', Turnover: '12.4x' } } },
  { id: 'suppliers',  type: 'twinNode', position: { x: 380, y: 370 }, data: { label: 'Suppliers', nodeType: 'suppliers', kpis: { Active: '35', Primary: '8' } } },
  { id: 'customers',  type: 'twinNode', position: { x: 600, y: 370 }, data: { label: 'Customers', nodeType: 'customers', kpis: { Total: '50K', Churn: '2.5%/mo' } } },
]

const DEMO_EDGES = [
  { id: 'e1', source: 'company', target: 'finance', type: 'smoothstep', animated: true },
  { id: 'e2', source: 'company', target: 'sales', type: 'smoothstep', animated: true },
  { id: 'e3', source: 'company', target: 'marketing', type: 'smoothstep', animated: true },
  { id: 'e4', source: 'company', target: 'hr', type: 'smoothstep', animated: true },
  { id: 'e5', source: 'company', target: 'operations', type: 'smoothstep', animated: true },
  { id: 'e6', source: 'sales', target: 'customers', type: 'smoothstep', animated: true },
  { id: 'e7', source: 'marketing', target: 'customers', type: 'smoothstep', animated: true },
  { id: 'e8', source: 'operations', target: 'inventory', type: 'smoothstep', animated: true },
  { id: 'e9', source: 'operations', target: 'suppliers', type: 'smoothstep', animated: true },
  { id: 'e10', source: 'suppliers', target: 'inventory', type: 'smoothstep', animated: false },
]

export default function DigitalTwinPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(DEMO_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(DEMO_EDGES)
  const [selectedNode, setSelectedNode] = useState(null)
  const [kpis, setKpis] = useState({})

  useEffect(() => {
    getDigitalTwin()
      .then((data) => {
        if (data.nodes?.length) setNodes(data.nodes)
        if (data.edges?.length) setEdges(data.edges)
        setKpis(data.kpis || {})
      })
      .catch(() => {
        const demoKpis = {}
        DEMO_NODES.forEach(n => { demoKpis[n.id] = n.data.kpis })
        setKpis(demoKpis)
      })
  }, [])

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node)
  }, [])

  const selectedKpis = selectedNode ? (kpis[selectedNode.id] || selectedNode.data?.kpis || {}) : null

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-dark-950">
      <Header title="Digital Twin Graph" subtitle="Interactive DemoCorp Business Ecosystem — Click nodes to examine live KPIs" />

      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative" style={{ background: '#030712' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
          >
            <Background color="#1a2336" gap={32} size={1.5} />
            <Controls style={{ bottom: 20, right: 20 }} />
            <MiniMap
              nodeColor={(n) => NODE_COLORS[n.data?.nodeType]?.border || '#334155'}
              style={{ background: 'rgba(11,15,25,0.95)', bottom: 20, left: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </ReactFlow>
        </div>

        {/* Side Panel */}
        <div className="w-72 border-l border-white/5 bg-dark-900 p-6 overflow-auto flex-shrink-0">
          {selectedNode ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-cyan-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {selectedNode.data?.label} Node
                </span>
              </div>
              <div className="space-y-3">
                {Object.entries(selectedKpis).map(([k, v]) => (
                  <div key={k} className="metric-card py-3 px-4">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{k}</div>
                    <div className="text-lg font-extrabold text-white mt-1">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <Network size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold">Select Node</p>
              <p className="text-xs mt-1">Click any graph node to inspect live enterprise KPIs</p>
            </div>
          )}

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Enterprise Domains</div>
            {Object.entries(NODE_COLORS).map(([type, { border, text }]) => (
              <div key={type} className="flex items-center gap-2.5 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: border }} />
                <span className="text-xs font-semibold capitalize" style={{ color: text }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
