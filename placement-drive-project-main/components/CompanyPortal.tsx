import React, { useState, useEffect } from 'react';
import { Company, Branch, WorkMode } from '../types';
import { Briefcase, Building2, MapPin, Laptop, Users, Save, Plus, ArrowRight } from 'lucide-react';

interface CompanyPortalProps {
  companies: Company[];
  onPostJob: (company: Company) => void;
}

const CompanyPortal: React.FC<CompanyPortalProps> = ({ companies, onPostJob }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [companyNameInput, setCompanyNameInput] = useState('');
  
  const [formData, setFormData] = useState<Company>({
    id: '',
    name: '',
    role: '',
    seats: 0,
    minCgpa: 0,
    workMode: 'On-Site',
    allowedBranches: [],
    requiredSkills: []
  });

  const [skillsInput, setSkillsInput] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyNameInput.trim()) return;

    const existingCompany = companies.find(c => c.name.toLowerCase() === companyNameInput.toLowerCase());
    
    if (existingCompany) {
      setFormData(existingCompany);
      setSkillsInput(existingCompany.requiredSkills.join(', '));
    } else {
      // Initialize new company form
      setFormData({
        id: `c-new-${Date.now()}`,
        name: companyNameInput,
        role: '',
        seats: 5,
        minCgpa: 7.0,
        workMode: 'On-Site',
        allowedBranches: [],
        requiredSkills: []
      });
      setSkillsInput('');
    }
    setIsLoggedIn(true);
  };

  const handleBranchToggle = (branch: Branch) => {
    setFormData(prev => {
      const branches = prev.allowedBranches.includes(branch)
        ? prev.allowedBranches.filter(b => b !== branch)
        : [...prev.allowedBranches, branch];
      return { ...prev, allowedBranches: branches };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCompany: Company = {
      ...formData,
      requiredSkills: skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
    };
    onPostJob(updatedCompany);
    alert('Job posting updated successfully!');
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-indigo-900 p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 z-0"></div>
             <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Recruiter Login</h2>
                <p className="text-indigo-200 text-sm">Access your company dashboard to manage hiring drives.</p>
             </div>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="text" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold transition-all"
                        placeholder="e.g. Acme Corp"
                        value={companyNameInput}
                        onChange={(e) => setCompanyNameInput(e.target.value)}
                    />
                </div>
             </div>
             <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
                Continue to Dashboard <ArrowRight className="w-4 h-4" />
             </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xl">
                        {formData.name[0]}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{formData.name}</h2>
                        <p className="text-sm text-slate-500 font-medium">Job Configuration Portal</p>
                    </div>
                </div>
                <button onClick={() => setIsLoggedIn(false)} className="text-sm font-bold text-slate-500 hover:text-indigo-600">Switch Company</button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Role & Work Mode */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Position Details
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Job Role / Title</label>
                            <input 
                                type="text" 
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                                placeholder="e.g. Software Development Engineer"
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Work Mode</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select 
                                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold appearance-none"
                                        value={formData.workMode}
                                        onChange={e => setFormData({...formData, workMode: e.target.value as WorkMode})}
                                    >
                                        <option value="On-Site">On-Site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Vacancy (Seats)</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="number" 
                                        min="1"
                                        required
                                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                                        value={formData.seats}
                                        onChange={e => setFormData({...formData, seats: parseInt(e.target.value) || 0})}
                                    />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Laptop className="w-4 h-4" /> Eligibility Criteria
                    </h3>

                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Minimum CGPA Cutoff</label>
                            <input 
                                type="number" 
                                step="0.1"
                                min="0"
                                max="10"
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                                value={formData.minCgpa}
                                onChange={e => setFormData({...formData, minCgpa: parseFloat(e.target.value) || 0})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Allowed Branches</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(Branch).map(branch => (
                                    <button
                                        key={branch}
                                        type="button"
                                        onClick={() => handleBranchToggle(branch)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                            formData.allowedBranches.includes(branch)
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                                            : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                                        }`}
                                    >
                                        {branch}
                                    </button>
                                ))}
                            </div>
                        </div>

                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Required Skills</label>
                            <textarea 
                                rows={2}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm"
                                placeholder="e.g. Java, Python, AWS (Comma separated)"
                                value={skillsInput}
                                onChange={e => setSkillsInput(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="md:col-span-2 pt-6 border-t border-slate-100 flex justify-end">
                    <button 
                        type="submit" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 hover:-translate-y-0.5 transition-all"
                    >
                        <Save className="w-5 h-5" />
                        Save Job Posting
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default CompanyPortal;