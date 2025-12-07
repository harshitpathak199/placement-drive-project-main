import React from 'react';
import { Users, Building2, BrainCircuit, ArrowRight, ShieldCheck, GraduationCap, Briefcase } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'admin' | 'student' | 'company') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-emerald-500/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-1.5 text-xs font-bold text-indigo-400 uppercase tracking-widest backdrop-blur-sm">
          <BrainCircuit className="w-3 h-3" />
          AI-Powered Allocation
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
          TalentLink <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Pro</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          The next-generation campus placement ecosystem. Automate merit-based matching, simulate allocation logic, and empower students with AI insights.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {/* Admin Card */}
        <button 
          onClick={() => onNavigate('admin')}
          className="group relative bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-indigo-500/50 rounded-3xl p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
          <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
             <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">Admin Portal</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Manage recruiting companies, run allocation algorithms, visualize data in the War Room, and generate executive reports.
          </p>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm group-hover:translate-x-2 transition-transform">
            Enter Dashboard <ArrowRight className="w-4 h-4" />
          </div>
        </button>

         {/* Company Card */}
         <button 
          onClick={() => onNavigate('company')}
          className="group relative bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-blue-500/50 rounded-3xl p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
             <Briefcase className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">Recruiter Portal</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Post new jobs, define hiring criteria (CGPA, Branch), set seat capacity, and specify work modes (Remote/WFO).
          </p>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm group-hover:translate-x-2 transition-transform">
            Post Jobs <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Student Card */}
        <button 
          onClick={() => onNavigate('student')}
          className="group relative bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-emerald-500/50 rounded-3xl p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/20"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
             <GraduationCap className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">Student Portal</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Register profile, upload academic data, set "Dream Job" priorities, and check eligibility using AI.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm group-hover:translate-x-2 transition-transform">
            Student Login <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      <div className="absolute bottom-6 text-slate-600 text-xs font-medium">
        © 2025 TalentLink Pro Systems. Secured by Gemini AI.
      </div>
    </div>
  );
};

export default LandingPage;