import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student, Company, Allocation } from '../types';
import { Users, Building2, Crown, AlertCircle } from 'lucide-react';

interface WarRoomProps {
  students: Student[];
  companies: Company[];
  allocations: Allocation[];
  isSimulating: boolean;
}

const WarRoom: React.FC<WarRoomProps> = ({ students, companies, allocations, isSimulating }) => {
  // We'll simulate a visual progressive loading even if the logic is instant
  const [displayedAllocations, setDisplayedAllocations] = useState<Allocation[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [processingStep, setProcessingStep] = useState(0);

  useEffect(() => {
    if (isSimulating) {
      setDisplayedAllocations([]);
      setProcessingStep(0);
      
      // Simulate step by step visualization
      const interval = setInterval(() => {
        setProcessingStep(prev => {
           if (prev >= allocations.length) {
             clearInterval(interval);
             setCurrentStudent(null);
             return prev;
           }
           const alloc = allocations[prev];
           setDisplayedAllocations(curr => [...curr, alloc]);
           setCurrentStudent(students.find(s => s.id === alloc.studentId) || null);
           return prev + 1;
        });
      }, 300); // Speed of animation

      return () => clearInterval(interval);
    }
  }, [isSimulating, allocations, students]);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-700 shadow-2xl overflow-hidden relative min-h-[500px] flex flex-col">
       <div className="flex justify-between items-center mb-6 z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
             Live Allocation War Room
          </h2>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded border border-emerald-800">
             STATUS: {isSimulating ? 'ALLOCATING...' : 'IDLE'}
          </div>
       </div>

       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

       <div className="grid grid-cols-12 gap-6 flex-1 z-10">
          {/* Left: Processing Queue */}
          <div className="col-span-3 bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-col">
             <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" /> Queue
             </h3>
             <div className="flex-1 overflow-hidden relative">
                 <AnimatePresence>
                    {currentStudent && (
                        <motion.div 
                           key={currentStudent.id}
                           initial={{ opacity: 0, y: 50, scale: 0.8 }}
                           animate={{ opacity: 1, y: 0, scale: 1 }}
                           exit={{ opacity: 0, y: -50, scale: 1.2 }}
                           className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="bg-indigo-600 p-6 rounded-full shadow-lg shadow-indigo-500/50 w-24 h-24 flex flex-col items-center justify-center text-center border-4 border-indigo-400">
                                <span className="text-2xl font-bold text-white">{currentStudent.cgpa.toFixed(1)}</span>
                                <span className="text-[10px] text-indigo-200 uppercase font-bold mt-1">GPA</span>
                            </div>
                            <div className="absolute -bottom-8 w-full text-center">
                                <p className="text-white font-bold text-sm">{currentStudent.name}</p>
                                <p className="text-slate-400 text-xs">{currentStudent.branch}</p>
                            </div>
                        </motion.div>
                    )}
                 </AnimatePresence>
                 {!currentStudent && !isSimulating && displayedAllocations.length === 0 && (
                     <div className="flex items-center justify-center h-full text-slate-600 text-sm">Waiting to start...</div>
                 )}
                 {!currentStudent && !isSimulating && displayedAllocations.length > 0 && (
                     <div className="flex items-center justify-center h-full text-emerald-500 text-sm font-bold">ALL PROCESSED</div>
                 )}
             </div>
          </div>

          {/* Right: Company Buckets */}
          <div className="col-span-9 grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto war-room-scroll max-h-[500px]">
             {companies.map(company => {
                 const companyAllocations = displayedAllocations.filter(a => a.companyId === company.id);
                 const fillPercentage = (companyAllocations.length / company.seats) * 100;
                 const isFull = companyAllocations.length >= company.seats;

                 return (
                     <div key={company.id} className={`bg-slate-800 rounded-xl p-4 border transition-all duration-300 ${isFull ? 'border-red-500/50 bg-red-900/10' : 'border-slate-700'}`}>
                         <div className="flex justify-between items-start mb-3">
                             <div>
                                 <h4 className="text-white font-bold text-sm truncate">{company.name}</h4>
                                 <p className="text-xs text-slate-400">{companyAllocations.length} / {company.seats} Filled</p>
                             </div>
                             {isFull && <AlertCircle className="w-4 h-4 text-red-500" />}
                         </div>
                         
                         {/* Progress Bar */}
                         <div className="w-full bg-slate-700 h-1.5 rounded-full mb-3 overflow-hidden">
                             <motion.div 
                                className={`h-full ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${fillPercentage}%` }}
                                transition={{ type: "spring", stiffness: 50 }}
                             />
                         </div>

                         {/* Avatars */}
                         <div className="flex flex-wrap gap-1">
                             <AnimatePresence>
                                 {companyAllocations.map(alloc => (
                                     <motion.div 
                                        key={alloc.studentId}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-6 h-6 rounded-full bg-indigo-500 text-white text-[8px] flex items-center justify-center font-bold border border-indigo-300"
                                        title={`${alloc.studentName} (${alloc.studentCgpa})`}
                                     >
                                         {alloc.studentCgpa.toFixed(1)}
                                     </motion.div>
                                 ))}
                             </AnimatePresence>
                         </div>
                     </div>
                 )
             })}
          </div>
       </div>
    </div>
  );
};

export default WarRoom;