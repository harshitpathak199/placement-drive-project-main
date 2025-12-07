import React from 'react';
import { Company, Student } from '../types';
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, ZAxis, Tooltip, Scatter, Cell } from 'recharts';

interface DemandHeatmapProps {
  companies: Company[];
  students: Student[];
}

const DemandHeatmap: React.FC<DemandHeatmapProps> = ({ companies, students }) => {
  
  const data = companies.map(c => {
    // Calculate demand: count how many students have this company in their top 3 preferences
    const demandCount = students.filter(s => s.preferences.slice(0, 3).includes(c.id)).length;
    return {
      name: c.name,
      x: demandCount, // X-Axis: Popularity
      y: c.minCgpa,   // Y-Axis: Difficulty
      z: c.seats,     // Z-Axis: Size (Seats)
      fill: demandCount > 15 ? '#f43f5e' : demandCount > 8 ? '#f59e0b' : '#10b981'
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg text-xs">
          <p className="font-bold text-slate-800 mb-1">{d.name}</p>
          <p className="text-slate-600">Top 3 Pref Count: <span className="font-bold">{d.x} students</span></p>
          <p className="text-slate-600">Cutoff: <span className="font-bold">{d.y} CGPA</span></p>
          <p className="text-slate-600">Seats: <span className="font-bold">{d.z}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden h-96">
      <div className="flex justify-between items-start mb-4">
         <div>
            <h3 className="text-lg font-bold text-slate-900">Competition Heatmap</h3>
            <p className="text-sm text-slate-500">Bubble Size = Seats Available • Color = Demand Intensity</p>
         </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <XAxis type="number" dataKey="x" name="Demand" unit=" applicants" stroke="#94a3b8" tick={{fontSize: 10}} label={{ value: 'Student Demand (Top 3 Prefs)', position: 'insideBottom', offset: -10, fontSize: 10 }} />
          <YAxis type="number" dataKey="y" name="CGPA" unit="" stroke="#94a3b8" tick={{fontSize: 10}} domain={['dataMin - 0.5', 'dataMax + 0.5']} label={{ value: 'CGPA Cutoff', angle: -90, position: 'insideLeft', fontSize: 10 }} />
          <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Seats" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
          <Scatter name="Companies" data={data} fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DemandHeatmap;