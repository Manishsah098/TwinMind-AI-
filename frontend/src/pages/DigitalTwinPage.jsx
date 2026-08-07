/**
 * TwinMind AI - Digital Twin Page
 * Interactive React Flow visualization of DemoCorp's business graph
 */
import { useEffect, useState, useCallback } from 'react'
import ReactFlow, {
  MiniMap, Controls, Background,
  useNodesState, useEdgesState, addEdge,
  Handle, Position
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import Header from '../components/Layout/Header'
import { getDigitalTwin } from '../services/api'

// Node colors per type
const NODE_COLORS = {
  company:    { border: '#22d3ee', bg: 'rgba(6,182,212,0.1)', text: '#22d3ee' },
  finance:    { border: '#818cf8', bg: 'rgba(99,102,241,0.1)', text: '#818cf8' },
  sales:      { border: '#34d399', bg: 'rgba(16,185,129,0.1)', text: '#34d399' },
  marketing:  { border: '#c084fc', bg: 'rgba(168,85,247,0.1)', text: '#c084fc' },
  hr:         { border: '#38bdf8', bg: 'rgba(14,165,233,0.1)', text: '#38bdf8' },
  operations: { border: '#2dd4bf', bg: 'rgba(20,184,166,0.1)', text: '#2dd4bf' },
  inventory:  { border: '#4ade80', bg: 'rgba(74,222,128,0.1)', text: '#4ade80' },
  suppliers:  { border: '#fb923c', bg: 'rgba(251,146,60,0.1)', text: '#fb923c' },
  customers:  { border: '#f472b6', bg: 'rgba(244,114,182,0.1)', text: '#f472b6' },
}

// Custom node component
function TwinNode({ data, selected }) {
  const colors = NODE_COLORS[data.nodeType] || NODE_COLORS.company
  const isCompany = data.nodeType === 'company'

  return (
    <div
      style={{
        background: colors.bg,
        border: `1.5px solid ${selected ? colors.border : colors.border + '60'}`,
        borderRadius: isCompany ? 12 : 10,
        padding: isCompany ? '14px 20px' : '10px 14px',
        minWidth: isCompany ? 140 : 110,
        boxShadow: selected ? `0 0 20px ${colors.border}40` : 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: colors.border, border: 'none', width: 6, height: 6 }} />
      <div style={{ color: colors.text, fontWeight: isCompany ? 700 : 600, fontSize: isCompany ? 14 : 12, marginBottom: 2 }}>
        {data.label}
      </div>
      {data.kpis && Object.entries(data.kpis).slice(0, 2).map(([k, v]) => (
        <div key={k} style={{ fontSize: 10, color: 'rgba(148,163,184,0.8)', marginTop: 2 }}>
          <span style={{ color: 'rgba(100,116,139,0.8)' }}>{k}: </span>{v}
        </div>
      ))}
      <Handle type="source" position={Position.Bottom} style={{ background: colors.border, border: 'none', width: 6, height: 6 }} />
    </div>
  )
}

const nodeTypes = { twinNode: TwinNode }

// Demo fallback data
const DEMO_NODES = [
  { id: 'company',    type: 'twinNode', position: { x: 300, y: 30  }, data: { label: 'DemoCorp', nodeType: 'company', kpis: { Revenue: '$10M', Employees: '420' } } },
  { id: 'finance',    type: 'twinNode', position: { x: 40,  y: 180 }, data: { label: 'Finance', nodeType: 'finance', kpis: { Margin: '68%', EBITDA: '$2.2M' } } },
  { id: 'sales',      type: 'twinNode', position: { x: 180, y: 180 }, data: { label: 'Sales', nodeType: 'sales', kpis: { Pipeline: '$4.2M', 'Win Rate': '24%' } } },
  { id: 'marketing',  type: 'twinNode', position: { x: 320, y: 180 }, data: { label: 'Marketing', nodeType: 'marketing', kpis: { CAC: '$320', LTV: '$8K' } } },
  { id: 'hr',         type: 'twinNode', position: { x: 460, y: 180 }, data: { label: 'HR', nodeType: 'hr', kpis: { Employees: '420', Depts: '6' } } },
  { id: 'operations', type: 'twinNode', position: { x: 600, y: 180 }, data: { label: 'Operations', nodeType: 'operations', kpis: { Suppliers: '35', 'Lead Time': '14d' } } },
  { id: 'inventory',  type: 'twinNode', position: { x: 120, y: 350 }, data: { label: 'Inventory', nodeType: 'inventory', kpis: { Value: '$150K', Turnover: '12.4x' } } },
  { id: 'suppliers',  type: 'twinNode', position: { x: 350, y: 350 }, data: { label: 'Suppliers', nodeType: 'suppliers', kpis: { Active: '35', Primary: '8' } } },
  { id: 'customers',  type: 'twinNode', position: { x: 560, y: 350 }, data: { label: 'Customers', nodeType: 'customers', kpis: { Total: '50K', Churn: '2.5%/mo' } } },
]

const DEMO_EDGES = [
  { id: 'e1', source: 'company', target: 'finance', type: 'smoothstep', animated: true, style: { stroke: 'rgba(34,211,238,0.3)' } },
  { id: 'e2', source: 'company', target: 'sales', type: 'smoothstep', animated: true, style: { stroke: 'rgba(34,211,238,0.3)' } },
  { id: 'e3', source: 'company', target: 'marketing', type: 'smoothstep', animated: true, style: { stroke: 'rgba(34,211,238,0.3)' } },
  { id: 'e4', source: 'company', target: 'hr', type: 'smoothstep', animated: true, style: { stroke: 'rgba(34,211,238,0.3)' } },
  { id: 'e5', source: 'company', target: 'operations', type: 'smoothstep', animated: true, style: { stroke: 'rgba(34,211,238,0.3)' } },
  { id: 'e6', source: 'sales', target: 'customers', type: 'smoothstep', animated: true, style: { stroke: 'rgba(52,211,153,0.3)' } },
  { id: 'e7', source: 'marketing', target: 'customers', type: 'smoothstep', animated: true, style: { stroke: 'rgba(192,132,252,0.3)' } },
  { id: 'e8', source: 'operations', target: 'inventory', type: 'smoothstep', animated: true, style: { stroke: 'rgba(45,212,191,0.3)' } },
  { id: 'e9', source: 'operations', target: 'suppliers', type: 'smoothstep', animated: true, style: { stroke: 'rgba(45,212,191,0.3)' } },
  { id: 'e10', source: 'suppliers', target: 'inventory', type: 'smoothstep', animated: false, style: { stroke: 'rgba(251,146,60,0.3)' } },
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
        // Use demo nodes (already set as default)
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
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
      <Header title="Digital Twin" subtitle="Interactive DemoCorp business graph — click any node to explore KPIs" />

      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* React Flow Canvas */}
        <div className="flex-1" style={{ background: '#020617' }}>
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
            <Background color="#1e293b" gap={32} size={1} />
            <Controls style={{ bottom: 20, right: 20 }} />
            <MiniMap
              nodeColor={(n) => NODE_COLORS[n.data?.nodeType]?.border || '#334155'}
              style={{ background: 'rgba(15,23,42,0.9)', bottom: 20, left: 20 }}
            />
          </ReactFlow>
        </div>

        {/* KPI Panel */}
        <div className="w-64 border-l border-white/5 bg-slate-900 p-4 overflow-auto flex-shrink-0">
          {selectedNode ? (
            <div className="animate-slide-in">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                {selectedNode.data?.label} — KPIs
              </div>
              <div className="space-y-2">
                {Object.entries(selectedKpis).map(([k, v]) => (
                  <div key={k} className="metric-card py-3 px-4">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{k}</div>
                    <div className="text-base font-bold text-white mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-600">
              <div className="text-3xl mb-3">↑</div>
              <p className="text-sm">Click a node to view its KPIs</p>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">Legend</div>
            {Object.entries(NODE_COLORS).map(([type, { border, text }]) => (
              <div key={type} className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: border }} />
                <span className="text-[11px] capitalize" style={{ color: text }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
