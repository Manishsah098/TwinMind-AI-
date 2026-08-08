/**
 * TwinMind AI - Digital Twin Page (Clean Professional Light)
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
import { Network } from 'lucide-react'

const NODE_COLORS = {
  company:    { border: '#2563eb', bg: 'rgba(37,99,235,0.08)',  text: '#1e40af' },
  finance:    { border: '#4f46e5', bg: 'rgba(79,70,229,0.08)',  text: '#3730a3' },
  sales:      { border: '#059669', bg: 'rgba(5,150,105,0.08)',  text: '#065f46' },
  marketing:  { border: '#7c3aed', bg: 'rgba(124,58,237,0.08)', text: '#5b21b6' },
  hr:         { border: '#0284c7', bg: 'rgba(2,132,199,0.08)',  text: '#075985' },
  operations: { border: '#0d9488', bg: 'rgba(13,148,136,0.08)', text: '#115e59' },
  inventory:  { border: '#16a34a', bg: 'rgba(22,163,74,0.08)',  text: '#14532d' },
  suppliers:  { border: '#d97706', bg: 'rgba(217,119,6,0.08)',  text: '#92400e' },
  customers:  { border: '#db2777', bg: 'rgba(219,39,119,0.08)', text: '#9d174d' },
}

function TwinNode({ data, selected }) {
  const colors = NODE_COLORS[data.nodeType] || NODE_COLORS.company
  const isCompany = data.nodeType === 'company'

  return (
    <div
      style={{
        background: selected ? colors.bg : '#ffffff',
        border: `2px solid ${selected ? colors.border : colors.border + '60'}`,
        borderRadius: isCompany ? 16 : 12,
        padding: isCompany ? '16px 24px' : '12px 18px',
        minWidth: isCompany ? 160 : 130,
        boxShadow: selected
          ? `0 8px 24px ${colors.border}30`
          : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
      }}
    >
      <Handle type="target" position={Position.Top}
        style={{ background: colors.border, border: '2px solid white', width: 10, height: 10 }} />
      <div style={{ color: colors.text, fontWeight: isCompany ? 800 : 700,
        fontSize: isCompany ? 15 : 13, marginBottom: 4 }}>
        {data.label}
      </div>
      {data.kpis && Object.entries(data.kpis).slice(0, 2).map(([k, v]) => (
        <div key={k} style={{ fontSize: 11, color: '#64748b', marginTop: 2, fontWeight: 600 }}>
          <span style={{ color: '#94a3b8' }}>{k}: </span>{v}
        </div>
      ))}
      <Handle type="source" position={Position.Bottom}
        style={{ background: colors.border, border: '2px solid white', width: 10, height: 10 }} />
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
  { id: 'e1', source: 'company', target: 'finance', type: 'smoothstep', animated: true, style: { stroke: '#2563eb80', strokeWidth: 2 } },
  { id: 'e2', source: 'company', target: 'sales', type: 'smoothstep', animated: true, style: { stroke: '#2563eb80', strokeWidth: 2 } },
  { id: 'e3', source: 'company', target: 'marketing', type: 'smoothstep', animated: true, style: { stroke: '#2563eb80', strokeWidth: 2 } },
  { id: 'e4', source: 'company', target: 'hr', type: 'smoothstep', animated: true, style: { stroke: '#2563eb80', strokeWidth: 2 } },
  { id: 'e5', source: 'company', target: 'operations', type: 'smoothstep', animated: true, style: { stroke: '#2563eb80', strokeWidth: 2 } },
  { id: 'e6', source: 'sales', target: 'customers', type: 'smoothstep', animated: true, style: { stroke: '#05996980', strokeWidth: 2 } },
  { id: 'e7', source: 'marketing', target: 'customers', type: 'smoothstep', animated: true, style: { stroke: '#7c3aed80', strokeWidth: 2 } },
  { id: 'e8', source: 'operations', target: 'inventory', type: 'smoothstep', animated: true, style: { stroke: '#0d948880', strokeWidth: 2 } },
  { id: 'e9', source: 'operations', target: 'suppliers', type: 'smoothstep', animated: true, style: { stroke: '#0d948880', strokeWidth: 2 } },
  { id: 'e10', source: 'suppliers', target: 'inventory', type: 'smoothstep', animated: false, style: { stroke: '#d9770680', strokeWidth: 2 } },
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
  const selColors = selectedNode ? (NODE_COLORS[selectedNode.data?.nodeType] || NODE_COLORS.company) : null

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      <Header title="Digital Twin Graph" subtitle="Interactive DemoCorp Business Ecosystem — Click nodes to examine live KPIs" />

      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative">
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
            <Background color="#e2e8f0" gap={28} size={1.5} />
            <Controls style={{ bottom: 20, right: 20 }} />
            <MiniMap
              nodeColor={(n) => NODE_COLORS[n.data?.nodeType]?.border || '#94a3b8'}
              style={{
                background: '#ffffff',
                bottom: 20, left: 20,
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}
            />
          </ReactFlow>
        </div>

        {/* Side Panel */}
        <div className="w-72 border-l border-slate-200 bg-white p-6 overflow-auto flex-shrink-0 shadow-inner">
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Selected Node</div>
                <div className="text-lg font-extrabold text-slate-900"
                  style={{ color: selColors?.text }}>{selectedNode.data?.label}</div>
              </div>
              <div className="space-y-3">
                {Object.entries(selectedKpis).map(([k, v]) => (
                  <div key={k} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{k}</div>
                    <div className="text-lg font-extrabold text-slate-900 mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <Network size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold text-slate-600">Select a Node</p>
              <p className="text-xs mt-1 text-slate-400">Click any graph node to inspect live enterprise KPIs</p>
            </div>
          )}

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Enterprise Domains</div>
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
