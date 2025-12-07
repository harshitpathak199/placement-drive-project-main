import React, { useState } from 'react';
import { Branch, Student } from '../types';
import { Upload, User, BookOpen, Code, ChevronRight } from 'lucide-react';

interface StudentRegistrationProps {
  onRegister: (student: Student) => void;
  onLoadDemo: () => void;
}

const StudentRegistration: React.FC<StudentRegistrationProps> = ({ onRegister, onLoadDemo }) => {
  const [formData, setFormData] = useState({
    name: '',
    cgpa: '',
    branch: Branch.CSE,
    skills: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `s-new-${Date.now()}`,
      name: formData.name,
      cgpa: parseFloat(formData.cgpa),
      branch: formData.branch,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      preferences: [] // Will be set in portal
    };
    onRegister(newStudent);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-10">
            <Upload className="w-48 h-48" />
          </div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">Candidate Registration</h2>
          <p className="text-slate-400 relative z-10">Upload your academic profile to participate in the placement drive.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">CGPA</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    min="0"
                    max="10"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold"
                    placeholder="0.00"
                    value={formData.cgpa}
                    onChange={e => setFormData({...formData, cgpa: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Branch</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold appearance-none"
                    value={formData.branch}
                    onChange={e => setFormData({...formData, branch: e.target.value as Branch})}
                  >
                    {Object.values(Branch).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Technical Skills</label>
              <div className="relative">
                <Code className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <textarea 
                  required
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="e.g. Python, React, SQL (Comma separated)"
                  value={formData.skills}
                  onChange={e => setFormData({...formData, skills: e.target.value})}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Separate multiple skills with commas.</p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button 
              type="button" 
              onClick={onLoadDemo}
              className="text-slate-500 hover:text-indigo-600 text-sm font-bold transition-colors"
            >
              Skip & Load Demo Profile
            </button>
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 hover:-translate-y-0.5 transition-all"
            >
              Upload Data & Enter <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistration;