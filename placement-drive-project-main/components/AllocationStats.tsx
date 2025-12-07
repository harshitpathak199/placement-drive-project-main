import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, Area 
} from 'recharts';
import { Allocation, Student, Company } from '../types';

interface AllocationStatsProps {
  allocations: Allocation[];
  unplaced: Student[];
  companies: Company[];
}

const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b']; // Indigo, Rose, Emerald, Amber

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 border border-slate-100 shadow-xl rounded-xl">
        <p className="text-sm font-bold text-slate-800 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1 last:mb-0">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className="text-slate-600 font-medium">{entry.name}:</span>
            <span className="text-slate-900 font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AllocationStats: React.FC<AllocationStatsProps> = ({ allocations, unplaced, companies }) => {
  
  // Data for Pie Chart (Placed vs Unplaced)
  const pieData = [
    { name: 'Placed', value: allocations.length },
    { name: 'Unplaced', value: unplaced.length }
  ];

  // Data for Bar Chart (Company Fill Rate)
  const barData = companies.map(c => {
    const filled = allocations.filter(a => a.companyId === c.id).length;
    return {
      name: c.name,
      Filled: filled,
      Capacity: c.seats
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Placement Rate Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
           <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.4z"/></svg>
        </div>
        <div className="flex justify-between items-center mb-6 relative z-10">
           <div>
             <h3 className="text-lg font-bold text-slate-800">Placement Success</h3>
             <p className="text-sm text-slate-500">Distribution of candidates</p>
           </div>
           <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold">
              {allocations.length > 0 ? `${Math.round((allocations.length / (allocations.length + unplaced.length)) * 100)}%` : '0%'} 
              <span>Rate</span>
           </div>
        </div>
        <div className="h-72 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                 <filter id="shadow" height="200%">
                    <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.15"/>
                 </filter>
              </defs>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                style={{ filter: 'url(#shadow)' }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Utilization Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
           <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        </div>
        <div className="flex justify-between items-center mb-6 relative z-10">
           <div>
              <h3 className="text-lg font-bold text-slate-800">Company Capacity</h3>
              <p className="text-sm text-slate-500">Filled vs Total Seats</p>
           </div>
        </div>
        <div className="h-72 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barSize={24}
            >
              <defs>
                <linearGradient id="colorFilled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="colorCapacity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e2e8f0" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#f1f5f9" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 4 }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Filled" fill="url(#colorFilled)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Capacity" fill="url(#colorCapacity)" radius={[6, 6, 0, 0]} /> 
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AllocationStats;