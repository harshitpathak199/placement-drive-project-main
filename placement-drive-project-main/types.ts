export enum Branch {
  CSE = 'CSE',
  ECE = 'ECE',
  MECH = 'MECH',
  CIVIL = 'CIVIL',
  EEE = 'EEE'
}

export type WorkMode = 'Remote' | 'On-Site' | 'Hybrid';

export interface Company {
  id: string;
  name: string;
  minCgpa: number;
  seats: number;
  allowedBranches: Branch[];
  requiredSkills: string[]; 
  description?: string;
  role: string; // e.g. "Software Engineer"
  workMode: WorkMode; // e.g. "Remote"
}

export interface Student {
  id: string;
  name: string;
  cgpa: number;
  branch: Branch;
  skills: string[]; 
  preferences: string[]; 
}

export interface Allocation {
  studentId: string;
  studentName: string;
  studentBranch: Branch;
  studentCgpa: number;
  companyId: string;
  companyName: string;
}

export interface SimulationStats {
  totalStudents: number;
  placedStudents: number;
  placementRate: number;
  avgCgpaPlaced: number;
  branchWisePlacement: Record<string, number>;
}