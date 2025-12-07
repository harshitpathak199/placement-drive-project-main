import React from 'react';

const AlgorithmFlowchart: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-8">
         <div>
            <h3 className="text-xl font-bold text-slate-900">Algorithm Logic Flow</h3>
            <p className="text-slate-500 text-sm mt-1">Visualizing the serial dictatorship mechanism used for merit-based allocation.</p>
         </div>
         <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            100% Deterministic
         </div>
      </div>
      
      <div className="w-full overflow-x-auto flex justify-center pb-4">
        <svg width="850" height="400" viewBox="0 0 850 400" className="min-w-[850px]">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Paths */}
          {/* Start to Sort */}
          <path d="M 80 180 L 140 180" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowhead)" />
          
          {/* Sort to Loop */}
          <path d="M 260 180 L 320 180" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Loop to Decision */}
          <path d="M 440 180 L 500 180" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Decision YES to Allocate */}
          <path d="M 560 180 L 640 180" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <text x="590" y="170" fontSize="10" fill="#10b981" fontWeight="bold">MATCH</text>

          {/* Decision NO to Next Pref */}
          <path d="M 530 210 L 530 280 L 400 280 L 380 220" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" fill="none" />
          <text x="540" y="240" fontSize="10" fill="#f43f5e" fontWeight="bold">NO MATCH</text>

          {/* Allocate to End Loop */}
          <path d="M 760 180 L 800 180" stroke="#cbd5e1" strokeWidth="2" />
          
          {/* Nodes */}
          
          {/* Node 1: Start */}
          <circle cx="50" cy="180" r="30" fill="white" stroke="#64748b" strokeWidth="2" style={{ filter: 'url(#shadow)' }} />
          <text x="50" y="184" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569">START</text>

          {/* Node 2: Sort */}
          <rect x="140" y="150" width="120" height="60" rx="10" fill="url(#grad1)" style={{ filter: 'url(#shadow)' }} />
          <text x="200" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">Sort by Merit</text>
          <text x="200" y="195" textAnchor="middle" fontSize="10" fill="#e0e7ff">CGPA Descending</text>

          {/* Node 3: Student Loop */}
          <rect x="320" y="150" width="120" height="60" rx="10" fill="white" stroke="#4f46e5" strokeWidth="2" style={{ filter: 'url(#shadow)' }} />
          <text x="380" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e293b">Select Student</text>
          <text x="380" y="195" textAnchor="middle" fontSize="10" fill="#64748b">Top of List</text>

          {/* Node 4: Decision (Diamond) */}
          <polygon points="530,130 580,180 530,230 480,180" fill="white" stroke="#f59e0b" strokeWidth="2" style={{ filter: 'url(#shadow)' }} />
          <text x="530" y="175" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">Check</text>
          <text x="530" y="190" textAnchor="middle" fontSize="9" fill="#64748b">Eligibility</text>

          {/* Node 5: Allocate */}
          <rect x="640" y="150" width="120" height="60" rx="10" fill="#10b981" style={{ filter: 'url(#shadow)' }} />
          <text x="700" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">Allocate Seat</text>
          <text x="700" y="195" textAnchor="middle" fontSize="10" fill="#ecfdf5">Reduce Capacity</text>

          {/* Legend/Info Area */}
          <g transform="translate(50, 320)">
             <rect width="750" height="60" rx="8" fill="#f8fafc" stroke="#e2e8f0" />
             <text x="20" y="25" fontSize="11" fontWeight="bold" fill="#475569">CRITERIA CHECKLIST:</text>
             <circle cx="20" cy="45" r="3" fill="#6366f1" />
             <text x="30" y="48" fontSize="11" fill="#64748b">Seat Available</text>
             
             <circle cx="120" cy="45" r="3" fill="#6366f1" />
             <text x="130" y="48" fontSize="11" fill="#64748b">CGPA ≥ Cutoff</text>
             
             <circle cx="220" cy="45" r="3" fill="#6366f1" />
             <text x="230" y="48" fontSize="11" fill="#64748b">Branch Allowed</text>
             
             <circle cx="330" cy="45" r="3" fill="#6366f1" />
             <text x="340" y="48" fontSize="11" fill="#64748b">All Skills Match</text>

             <rect x="550" y="15" width="180" height="30" rx="4" fill="#fff" stroke="#cbd5e1" />
             <text x="565" y="34" fontSize="10" fill="#64748b">Tie-Breaker: Name A-Z</text>
          </g>

        </svg>
      </div>
    </div>
  );
};

export default AlgorithmFlowchart;