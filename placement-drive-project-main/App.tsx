import React, { useState } from 'react';
import { 
  Users, Building2, Play, RefreshCw, BarChart2, CheckCircle2, XCircle, BrainCircuit, 
  Table, Search, Bell, Settings, ChevronRight, GraduationCap, FileText, TrendingUp,
  LayoutDashboard, PieChart, Mail, Send, Lightbulb, Target, ArrowUpRight, MonitorPlay,
  Shuffle, Home, Briefcase
} from 'lucide-react';
import { Company, Student, Allocation } from './types';
import { runAllocationAlgorithm, runStableMatchingAlgorithm, generateDummyData } from './services/logic';
import { generatePlacementInsights } from './services/geminiService';
import AllocationStats from './components/AllocationStats';
import NetworkGraph from './components/NetworkGraph';
import AlgorithmFlowchart from './components/AlgorithmFlowchart';
import WarRoom from './components/WarRoom';
import DemandHeatmap from './components/DemandHeatmap';
import StudentPortal from './components/StudentPortal';
import LandingPage from './components/LandingPage';
import StudentRegistration from './components/StudentRegistration';
import CompanyPortal from './components/CompanyPortal';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'landing' | 'admin' | 'student' | 'company'>('landing');
  const [studentViewMode, setStudentViewMode] = useState<'register' | 'portal'>('register');
  const [currentStudentId, setCurrentStudentId] = useState<string | undefined>(undefined);

  // Data State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [unplaced, setUnplaced] = useState<Student[]>([]);
  
  // Admin UI State
  const [activeTab, setActiveTab] = useState<'setup' | 'results' | 'insights'>('setup');
  const [isSimulating, setIsSimulating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emailsSent, setEmailsSent] = useState(false);
  const [algorithmType, setAlgorithmType] = useState<'greedy' | 'stable'>('greedy');
  const [showWarRoom, setShowWarRoom] = useState(false);
  
  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("Placement Drive 2025: Eligibility & Schedule");
  const [emailBody, setEmailBody] = useState(`Dear Student,

You have been identified as an eligible candidate for the upcoming Campus Placement Drive based on your academic profile.

Please log in to the portal to view participating companies and confirm your interview slots.

Best Regards,
TalentLink Pro Team`);

  // --- Handlers ---

  const handleNavigate = (view: 'admin' | 'student' | 'company') => {
    // If navigating to admin or company, ensure data is loaded for demo purposes if empty
    if ((view === 'admin' || view === 'company') && companies.length === 0) {
        handleLoadDummyData();
    }
    setCurrentView(view);
    if (view === 'student') {
        // Reset student flow
        setStudentViewMode('register');
        setCurrentStudentId(undefined);
    }
  };

  const handleGoHome = () => {
    setCurrentView('landing');
  };

  const handleLoadDummyData = () => {
    const { dummyCompanies, dummyStudents } = generateDummyData();
    setCompanies(dummyCompanies);
    setStudents(dummyStudents);
    setAllocations([]);
    setUnplaced([]);
    setAiAnalysis("");
    setEmailsSent(false);
  };

  // Student Registration Flow
  const handleStudentRegister = (newStudent: Student) => {
    // If no companies exist, load them so the student has something to see
    if (companies.length === 0) {
        const { dummyCompanies } = generateDummyData();
        setCompanies(dummyCompanies);
    }
    
    setStudents(prev => [...prev, newStudent]);
    setCurrentStudentId(newStudent.id);
    setStudentViewMode('portal');
  };

  const handleStudentLoadDemo = () => {
     handleLoadDummyData();
     setStudentViewMode('portal');
  };

  const handleCompanyPostJob = (updatedCompany: Company) => {
    setCompanies(prev => {
        const exists = prev.find(c => c.id === updatedCompany.id);
        if (exists) {
            return prev.map(c => c.id === updatedCompany.id ? updatedCompany : c);
        } else {
            return [...prev, updatedCompany];
        }
    });
  };

  const handleRunAllocation = () => {
    setIsSimulating(true);
    setEmailsSent(false);
    
    // War Room mode needs immediate data for animation, but logic runs fast
    const logic = algorithmType === 'greedy' ? runAllocationAlgorithm : runStableMatchingAlgorithm;
    const result = logic(students, companies);
    
    setAllocations(result.allocations);
    setUnplaced(result.unplaced);
    
    if (!showWarRoom) {
        setTimeout(() => {
            setIsSimulating(false);
            setActiveTab('results');
        }, 1500);
    } else {
        setTimeout(() => setIsSimulating(false), 8000); 
    }
  };

  const handleUpdatePreferences = (studentId: string, newPrefs: string[]) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, preferences: newPrefs } : s));
  };

  const handleOpenEmailModal = () => {
    if (students.length === 0) return;
    setIsEmailModalOpen(true);
  };

  const handleSendEmails = () => {
    setIsEmailModalOpen(false);
    setEmailsSent(true);
  };

  const handleGenerateInsights = async () => {
    setIsAnalyzing(true);
    const analysis = await generatePlacementInsights(allocations, unplaced, companies);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  // --- Rendering Helpers (Same as before) ---
  const getCompanyIconColor = (name: string) => {
    if (name.includes('Google')) return 'bg-blue-100 text-blue-600';
    if (name.includes('Microsoft')) return 'bg-sky-100 text-sky-600';
    if (name.includes('Amazon')) return 'bg-orange-100 text-orange-600';
    if (name.includes('Tesla')) return 'bg-red-100 text-red-600';
    return 'bg-indigo-100 text-indigo-600';
  };

  const getBranchBadgeColor = (branch: string) => {
    switch (branch) {
      case 'CSE': return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'ECE': return 'bg-purple-50 text-purple-700 ring-purple-600/20';
      case 'MECH': return 'bg-orange-50 text-orange-700 ring-orange-600/20';
      case 'CIVIL': return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      case 'EEE': return 'bg-green-50 text-green-700 ring-green-600/20';
      default: return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    }
  };

  const getInitials = (name: string) => name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-100 text-red-700 border-red-200', 'bg-orange-100 text-orange-700 border-orange-200',
      'bg-amber-100 text-amber-700 border-amber-200', 'bg-green-100 text-green-700 border-green-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200', 'bg-teal-100 text-teal-700 border-teal-200',
      'bg-cyan-100 text-cyan-700 border-cyan-200', 'bg-sky-100 text-sky-700 border-sky-200',
      'bg-blue-100 text-blue-700 border-blue-200', 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-violet-100 text-violet-700 border-violet-200', 'bg-purple-100 text-purple-700 border-purple-200',
      'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200', 'bg-pink-100 text-pink-700 border-pink-200',
      'bg-rose-100 text-rose-700 border-rose-200',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  const Avatar = ({ name, className = "w-10 h-10 text-sm" }: { name: string, className?: string }) => {
    const colorClass = getAvatarColor(name);
    return (
       <div className={`${className} rounded-full flex items-center justify-center font-bold shadow-sm border ${colorClass}`}>
          {getInitials(name)}
       </div>
    );
  };

  const EmptyState = ({ title, message, icon: Icon }: any) => (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 mx-auto max-w-2xl text-center shadow-sm">
        <div className="bg-gradient-to-tr from-indigo-50 to-purple-50 p-6 rounded-full mb-6 relative group">
            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Icon className="w-10 h-10 text-indigo-600 relative z-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">{message}</p>
        <button 
            onClick={handleLoadDummyData} 
            className="mt-8 text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-2 group-hover:gap-3 transition-all"
        >
            Load sample data to preview <ChevronRight className="w-4 h-4" />
        </button>
    </div>
  );

  const SummaryCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-50 text-slate-500 rounded-lg">{subtext}</span>
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-500 font-medium">{title}</div>
    </div>
  );

  const InsightCard = ({ title, content, icon: Icon, colorClass, type = 'text' }: any) => (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all h-full">
        <div className="flex items-center gap-3 mb-4">
            <div className={`p-2.5 rounded-lg ${colorClass} bg-opacity-10`}>
                <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{title}</h3>
        </div>
        
        {type === 'list' ? (
            <ul className="space-y-3">
                {content.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                        <div className={`mt-1.5 min-w-[6px] h-1.5 rounded-full ${colorClass.replace('bg-', 'bg-')}`}></div>
                        {item}
                    </li>
                ))}
            </ul>
        ) : type === 'highlight' ? (
             <div className="flex flex-col justify-between h-32">
                 <p className="text-slate-600 font-medium leading-relaxed">{content}</p>
                 <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mt-4">
                     VIEW DETAILS <ArrowUpRight className="w-3 h-3" />
                 </div>
             </div>
        ) : (
            <p className="text-slate-600 text-sm leading-7 font-medium">{content}</p>
        )}
    </div>
  );

  const renderAiContent = () => {
    try {
        const data = JSON.parse(aiAnalysis);
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <InsightCard title="Executive Summary" content={data.executive_summary} icon={FileText} colorClass="bg-indigo-500" />
                </div>
                <div className="lg:col-span-1">
                     <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <h3 className="text-indigo-100 font-bold text-xs uppercase tracking-widest mb-2">Efficiency Score</h3>
                        <div className="text-6xl font-black mb-1">{data.success_score}<span className="text-2xl text-indigo-300 font-medium">/10</span></div>
                        <p className="text-sm font-medium text-indigo-200 bg-white/10 px-3 py-1 rounded-full">{data.market_trend}</p>
                     </div>
                </div>
                <InsightCard title="Key Highlights" content={data.key_highlights} icon={Target} colorClass="bg-emerald-500" type="list" />
                <InsightCard title="Strategic Recommendations" content={data.strategic_recommendations} icon={Lightbulb} colorClass="bg-amber-500" type="list" />
                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-center h-full">
                    <h4 className="font-bold text-slate-900 mb-2">Export Analysis</h4>
                    <p className="text-xs text-slate-500 mb-4">Download this report as PDF for departmental meetings.</p>
                    <button className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-2 rounded-xl text-sm hover:bg-slate-100 transition-colors">Download PDF</button>
                </div>
            </div>
        );
    } catch (e) {
        return (
            <div className="bg-white rounded-2xl p-8 border border-slate-200">
                <div className="prose prose-indigo max-w-none"><ReactMarkdown>{aiAnalysis}</ReactMarkdown></div>
            </div>
        );
    }
  };

  // --- Sub-Render Functions for Admin Panel ---

  const renderSetup = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-xl shadow-indigo-200">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-20"><BrainCircuit className="w-96 h-96" /></div>
        <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold mb-3">TalentLink Pro Dashboard 2025</h2>
            <p className="text-indigo-100 text-lg mb-6">Manage student registrations, skill prerequisites, and execute the intelligent merit-based allocation algorithm.</p>
            <div className="flex gap-4">
                 <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg"><Building2 className="w-5 h-5 text-indigo-200" /><span className="font-semibold">{companies.length} Companies</span></div>
                 <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg"><Users className="w-5 h-5 text-indigo-200" /><span className="font-semibold">{students.length} Students</span></div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            {companies.length > 0 && <AlgorithmFlowchart />}
            {companies.length > 0 && students.length > 0 && <DemandHeatmap companies={companies} students={students} />}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Building2 className="w-5 h-5 text-indigo-600" /> Participating Recruiters</h2>
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-3 font-semibold">Company</th>
                        <th className="px-6 py-3 font-semibold">Position</th>
                        <th className="px-6 py-3 font-semibold">Criteria</th>
                        <th className="px-6 py-3 font-semibold">Skills</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {companies.length === 0 ? (<tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No data loaded</td></tr>) : (companies.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${getCompanyIconColor(c.name)}`}>{c.name[0]}</div>
                                    <div><div className="font-bold text-slate-900">{c.name}</div><div className="text-xs text-slate-500 font-medium">{c.seats} Seats Available</div></div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div>
                                    <div className="font-bold text-slate-800">{c.role || 'N/A'}</div>
                                    <div className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 mt-1">{c.workMode || 'N/A'}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2"><span className="text-xs text-slate-400 font-semibold uppercase w-12">CGPA</span><span className="text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{c.minCgpa.toFixed(1)}</span></div>
                                    <div className="flex gap-1 flex-wrap">{c.allowedBranches.map(b => (<span key={b} className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${getBranchBadgeColor(b)}`}>{b}</span>))}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-1 flex-wrap">{c.requiredSkills.length > 0 ? (c.requiredSkills.map(skill => (<span key={skill} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium border border-indigo-100">{skill}</span>))) : (<span className="text-xs text-slate-400 italic">No specific prerequisites</span>)}</div>
                            </td>
                        </tr>
                    )))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>

        <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-600" /> Top Candidates</h2>
                </div>
                <div className="overflow-y-auto custom-scrollbar flex-1 max-h-[600px] p-2 space-y-1">
                    {students.length === 0 ? (<div className="text-center py-12 text-slate-400 text-sm">No students registered</div>) : (students.slice(0, 15).map((s, idx) => (
                        <div key={s.id} className="flex flex-col p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-default group border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-3 mb-2">
                                <Avatar name={s.name} />
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-slate-900 text-sm truncate">{s.name}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-2"><span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getBranchBadgeColor(s.branch)}`}>{s.branch}</span></div>
                                </div>
                                <div className="text-right"><div className="font-bold text-indigo-600 text-sm">{s.cgpa.toFixed(2)}</div><div className="text-[10px] text-slate-400 font-medium uppercase">GPA</div></div>
                            </div>
                            <div className="flex flex-wrap gap-1 pl-12">
                                {s.skills.slice(0, 3).map(skill => (<span key={skill} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{skill}</span>))}
                                {s.skills.length > 3 && (<span className="text-[10px] text-slate-400 px-1">+{s.skills.length - 3}</span>)}
                            </div>
                        </div>
                    )))}
                    {students.length > 15 && (<div className="text-center py-4 text-xs font-semibold text-indigo-600 uppercase tracking-widest">+ {students.length - 15} More Students</div>)}
                </div>
             </div>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {allocations.length === 0 && !isSimulating ? (
        <EmptyState title="Ready to Allocate" message="The system is prepped with student data and company requirements. Run the intelligent matching algorithm to generate assignments." icon={Play} />
      ) : (
        <>
          {emailsSent && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800 animate-in slide-in-from-top-2">
                <div className="bg-emerald-100 p-2 rounded-full"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
                <div><h4 className="font-bold text-sm">Call Letters Dispatched Successfully!</h4><p className="text-xs text-emerald-600 mt-0.5">Official selection emails and joining instructions have been sent to {students.length} eligible candidates via the department mail server.</p></div>
            </div>
          )}

          <div className="flex justify-between items-center">
             <div className="flex gap-2"><h2 className="text-xl font-bold text-slate-900">Allocation Results</h2><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold self-center">Final List</span></div>
             {!emailsSent && (<button onClick={handleOpenEmailModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all"><Mail className="w-4 h-4" /> Send Call Letters</button>)}
              {emailsSent && (<button disabled className="bg-slate-100 text-slate-400 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-not-allowed"><Send className="w-4 h-4" /> Letters Sent</button>)}
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Algorithm:</span>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                      <button onClick={() => setAlgorithmType('greedy')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${algorithmType === 'greedy' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Greedy (Merit)</button>
                      <button onClick={() => setAlgorithmType('stable')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${algorithmType === 'stable' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Stable Matching</button>
                  </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-sm font-bold text-slate-500">Live Simulation:</span>
                 <button onClick={() => { setShowWarRoom(!showWarRoom); handleRunAllocation(); }} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showWarRoom ? 'bg-indigo-600' : 'bg-slate-200'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showWarRoom ? 'translate-x-6' : 'translate-x-1'}`} /></button>
              </div>
          </div>

          <AnimatePresence>
            {showWarRoom && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <WarRoom students={students} companies={companies} allocations={allocations} isSimulating={isSimulating} />
                </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <SummaryCard title="Total Eligible Students" value={students.length} icon={Users} color="bg-emerald-500" subtext="Registered Candidates" />
             <SummaryCard title="Not Eligible / Unplaced" value={unplaced.length} icon={XCircle} color="bg-rose-500" subtext="Pending Placement" />
             <SummaryCard title="Participating Recruiters" value={companies.length} icon={Building2} color="bg-blue-500" subtext="Companies" />
             <SummaryCard title="Avg CGPA" value={(allocations.reduce((acc, curr) => acc + curr.studentCgpa, 0) / Math.max(allocations.length, 1)).toFixed(2)} icon={TrendingUp} color="bg-amber-500" subtext="Placed Students" />
          </div>

          <AllocationStats allocations={allocations} unplaced={unplaced} companies={companies} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white flex justify-between items-center"><h3 className="text-base font-bold text-emerald-900 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Confirmed Placements</h3></div>
              <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                {allocations.map((a, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3"><Avatar name={a.studentName} /><div><div className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">{a.studentName}</div><div className="text-xs text-slate-500 font-medium mt-0.5">{a.studentBranch} • GPA {a.studentCgpa}</div></div></div>
                    <div className="text-right"><div className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 shadow-sm text-indigo-700 mb-1">{a.companyName}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-rose-50 to-white flex justify-between items-center"><h3 className="text-base font-bold text-rose-900 flex items-center gap-2"><XCircle className="w-5 h-5 text-rose-600" /> Review Required</h3></div>
               <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                {unplaced.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3"><Avatar name={s.name} /><div><div className="font-bold text-slate-800 text-sm group-hover:text-rose-700 transition-colors">{s.name}</div><div className="text-xs text-slate-500 font-medium mt-0.5">{s.branch}</div></div></div>
                    <div className="text-right"><div className="font-mono text-sm font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md inline-block mb-1">{s.cgpa.toFixed(2)}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {allocations.length === 0 ? (
         <EmptyState title="Analysis Locked" message="Advanced network topology and AI insights are available once an allocation simulation has been completed." icon={BrainCircuit} />
      ) : (
        <>
          <div className="bg-white p-1 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="bg-slate-50/50 p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Placement Topology</h2>
                <p className="text-sm text-slate-500 mt-1">Interactive force-directed graph visualizing the student-company ecosystem.</p>
             </div>
            <NetworkGraph allocations={allocations} companies={companies} unplaced={unplaced} />
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-indigo-100 shadow-xl bg-white">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-white pointer-events-none"></div>
             <div className="relative p-8 md:p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200"><BrainCircuit className="w-8 h-8 text-white" /></div>
                        <div><h2 className="text-2xl font-bold text-slate-900">Gemini Intelligence</h2><p className="text-slate-600 font-medium">AI-driven executive summary and strategic insights.</p></div>
                    </div>
                    <button onClick={handleGenerateInsights} disabled={isAnalyzing} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-xl shadow-slate-200 flex items-center gap-3 disabled:opacity-50 hover:-translate-y-1 active:translate-y-0">
                        {isAnalyzing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Data...</> : <><FileText className="w-4 h-4" /> Generate Report</>}
                    </button>
                </div>
                {aiAnalysis ? renderAiContent() : (<div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-slate-400"><div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4"><BrainCircuit className="w-10 h-10 text-slate-300" /></div><p className="font-semibold text-lg text-slate-600">No analysis generated yet</p><p className="text-sm">Click "Generate Report" to process the data with Gemini.</p></div>)}
            </div>
          </div>
        </>
      )}
    </div>
  );

  // --- Main Render Flow ---

  if (currentView === 'landing') {
    return <LandingPage onNavigate={handleNavigate} />;
  }
  
  // Render Company Portal
  if (currentView === 'company') {
      return (
          <>
            <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={handleGoHome} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                            <Home className="w-4 h-4" /> Home
                        </button>
                    </div>
                </div>
            </header>
            <div className="py-10 px-4">
                <CompanyPortal companies={companies} onPostJob={handleCompanyPostJob} />
            </div>
          </>
      )
  }

  return (
    <div className="pb-20 relative">
      {/* Email Modal */}
      {isEmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Mail className="w-5 h-5 text-indigo-600" /> Compose Call Letter</h3>
                      <button onClick={() => setIsEmailModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><XCircle className="w-5 h-5" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3 text-sm text-slate-600 bg-indigo-50 p-3 rounded-lg border border-indigo-100"><Users className="w-4 h-4 text-indigo-600" /><span>Sending to <span className="font-bold text-indigo-700">{students.length} Eligible Candidates</span></span></div>
                      <div className="space-y-1"><label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Subject</label><input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-semibold text-slate-900 bg-slate-50/50 focus:bg-white" /></div>
                      <div className="space-y-1"><label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Message Body</label><textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={8} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900 resize-none font-sans font-medium bg-slate-50/50 focus:bg-white leading-relaxed" /></div>
                  </div>
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                      <button onClick={() => setIsEmailModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">Cancel</button>
                      <button onClick={handleSendEmails} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all"><Send className="w-4 h-4" /> Send Letters</button>
                  </div>
              </div>
          </div>
      )}

      {/* Glass Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleGoHome} className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200 hover:scale-105 transition-transform"><Building2 className="w-6 h-6 text-white" /></button>
            <div>
                 <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">TalentLink Pro</h1>
                 <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                     {currentView === 'admin' ? 'Admin Portal' : 'Student Portal'}
                 </span>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-12 hidden md:block">
            {currentView === 'admin' && (
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input type="text" placeholder="Search candidate or company..." className="w-full bg-slate-100/50 border border-transparent focus:border-indigo-100 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner" />
                </div>
            )}
          </div>

          <div className="flex items-center gap-5">
             {currentView === 'admin' && (
                 <>
                    {students.length === 0 ? (
                        <button onClick={handleLoadDummyData} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm">
                        <RefreshCw className="w-4 h-4 text-indigo-500" /> Load Sample Data
                        </button>
                    ) : (
                    <button onClick={handleRunAllocation} disabled={isSimulating} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-70 hover:-translate-y-0.5 active:translate-y-0">
                        {isSimulating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Allocating...</> : <><Play className="w-4 h-4 fill-current" /> Run Allocation</>}
                    </button>
                    )}
                 </>
             )}

             {currentView === 'student' && studentViewMode === 'portal' && (
                 <button onClick={() => setStudentViewMode('register')} className="text-sm font-bold text-slate-600 hover:text-indigo-600">Register New</button>
             )}
             
             <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
             
             <div className="flex items-center gap-4 pl-1">
                 <button onClick={handleGoHome} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                    <Home className="w-4 h-4" /> Home
                 </button>
                 <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-md flex items-center justify-center text-indigo-700 font-bold">
                    {currentView === 'admin' ? 'AD' : 'ST'}
                 </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {currentView === 'student' ? (
            studentViewMode === 'register' ? (
                <StudentRegistration onRegister={handleStudentRegister} onLoadDemo={handleStudentLoadDemo} />
            ) : (
                <StudentPortal 
                    students={students} 
                    companies={companies} 
                    onUpdatePreferences={handleUpdatePreferences} 
                    currentStudentId={currentStudentId}
                    onLogout={() => { setStudentViewMode('register'); setCurrentStudentId(undefined); }}
                />
            )
        ) : (
            <>
                {/* Admin Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Placement Drive 2025</h1>
                        <p className="text-slate-500 font-medium mt-1">Computer Science & Engineering Department</p>
                    </div>
                    
                    <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex">
                        {[
                            { id: 'setup', label: 'Data Setup', icon: LayoutDashboard },
                            { id: 'results', label: 'Results', icon: BarChart2 },
                            { id: 'insights', label: 'Analysis', icon: BrainCircuit }
                        ].map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-300' : 'text-slate-400'}`} /> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="min-h-[600px]">
                {activeTab === 'setup' && renderSetup()}
                {activeTab === 'results' && renderResults()}
                {activeTab === 'insights' && renderInsights()}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default App;