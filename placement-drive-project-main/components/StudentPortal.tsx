import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Student, Company } from '../types';
import { GripVertical, AlertCircle, CheckCircle2, Search, ArrowUp, ArrowDown, LogOut, Briefcase, MapPin } from 'lucide-react';
import { checkStudentEligibility } from '../services/geminiService';

interface StudentPortalProps {
  students: Student[];
  companies: Company[];
  onUpdatePreferences: (studentId: string, newPrefs: string[]) => void;
  currentStudentId?: string; // Optional: If passed, locks the view to this student
  onLogout?: () => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ students, companies, onUpdatePreferences, currentStudentId, onLogout }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(currentStudentId || students[0]?.id || '');
  const [verdict, setVerdict] = useState<string>("");
  const [checking, setChecking] = useState(false);
  const [targetCompanyId, setTargetCompanyId] = useState<string>(companies[0]?.id || '');

  // If currentStudentId changes (e.g. login), update selection
  useEffect(() => {
    if (currentStudentId) setSelectedStudentId(currentStudentId);
  }, [currentStudentId]);

  const currentStudent = students.find(s => s.id === selectedStudentId);

  // Local state for preferences to allow optimistic UI updates
  const handleMove = (index: number, direction: -1 | 1) => {
    if (!currentStudent) return;
    const newPrefs = [...currentStudent.preferences];
    if (index + direction < 0 || index + direction >= newPrefs.length) return;
    
    // Swap
    [newPrefs[index], newPrefs[index + direction]] = [newPrefs[index + direction], newPrefs[index]];
    onUpdatePreferences(currentStudent.id, newPrefs);
  };

  const handleCheckEligibility = async () => {
    if (!currentStudent || !targetCompanyId) return;
    setChecking(true);
    setVerdict("");
    const company = companies.find(c => c.id === targetCompanyId);
    if (company) {
        const result = await checkStudentEligibility(currentStudent, company);
        setVerdict(result);
    }
    setChecking(false);
  };

  if (!currentStudent) return <div className="p-10 text-center">Please load data or register first.</div>;

  return (
    <div className="space-y-8 animate-in fade-in">
        {/* Header / Identity Selector */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-slate-900">Student Portal</h2>
                <p className="text-sm text-slate-500">Manage your priority stack and check eligibility.</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg">
                    <span className="text-xs font-bold uppercase text-slate-500">Logged in as:</span>
                    {currentStudentId ? (
                        <span className="font-bold text-indigo-700 px-2">{currentStudent.name}</span>
                    ) : (
                        <select 
                            value={selectedStudentId} 
                            onChange={(e) => { setSelectedStudentId(e.target.value); setVerdict(""); }}
                            className="bg-transparent font-bold text-indigo-700 outline-none cursor-pointer"
                        >
                            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.branch})</option>)}
                        </select>
                    )}
                </div>
                {onLogout && (
                    <button onClick={onLogout} className="text-slate-400 hover:text-rose-500 transition-colors" title="Logout">
                        <LogOut className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preference Builder */}
            <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</div>
                    Dream Job Priority Stack
                </h3>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-4">Reorder your preferences. The algorithm will try to place you in your top choice first.</p>
                    <div className="space-y-2">
                        {currentStudent.preferences.length === 0 ? (
                           <div className="text-center py-8 text-slate-400 text-sm">
                               No preferences set yet. Use the Eligibility Checker to find companies.
                           </div> 
                        ) : (
                            currentStudent.preferences.map((compId, index) => {
                                const company = companies.find(c => c.id === compId);
                                if (!company) return null;
                                return (
                                    <div key={company.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-400 text-xs">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">{company.name}</div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3"/> {company.role || 'Role N/A'}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {company.workMode || 'Site'}</span>
                                                    <span>•</span>
                                                    <span>Min GPA: {company.minCgpa}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleMove(index, -1)} disabled={index === 0} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 disabled:opacity-30">
                                                <ArrowUp className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => handleMove(index, 1)} disabled={index === currentStudent.preferences.length - 1} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 disabled:opacity-30">
                                                <ArrowDown className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* AI Eligibility Checker */}
            <div className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</div>
                     "Am I Eligible?" AI Checker
                </h3>
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl">
                    <p className="text-indigo-100 text-sm mb-4">Select a target company to get an instant AI assessment of your chances.</p>
                    
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-indigo-200">Target Company</label>
                        <select 
                            value={targetCompanyId}
                            onChange={(e) => setTargetCompanyId(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:bg-white/20 transition-all font-bold"
                        >
                            {companies.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name} - {c.role}</option>)}
                        </select>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={handleCheckEligibility}
                                disabled={checking}
                                className="flex-1 bg-white text-indigo-600 font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {checking ? <span className="animate-spin">⌛</span> : <Search className="w-4 h-4" />}
                                {checking ? 'Analyzing...' : 'Check Eligibility'}
                            </button>
                            
                            {/* Quick Add Preference Button */}
                            {!currentStudent.preferences.includes(targetCompanyId) && (
                                <button
                                    onClick={() => onUpdatePreferences(currentStudent.id, [...currentStudent.preferences, targetCompanyId])}
                                    className="px-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 rounded-xl text-emerald-200 font-bold text-xl flex items-center justify-center transition-colors"
                                    title="Add to Priority Stack"
                                >
                                    +
                                </button>
                            )}
                        </div>
                    </div>

                    {verdict && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                        >
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-white text-sm mb-1">AI Verdict</h4>
                                    <p className="text-sm text-indigo-100 leading-relaxed">{verdict}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default StudentPortal;