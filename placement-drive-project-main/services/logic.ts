import { Student, Company, Allocation, WorkMode } from '../types';

/**
 * Runs a merit-based greedy allocation algorithm (Serial Dictatorship).
 * This ensures 100% accuracy based on Merit-First principles.
 */
export const runAllocationAlgorithm = (
  students: Student[],
  companies: Company[]
): { allocations: Allocation[]; unplaced: Student[]; companyFillStatus: Record<string, number> } => {
  
  const availableSeats: Record<string, number> = {};
  companies.forEach(c => {
    availableSeats[c.id] = c.seats;
  });

  // Sort students by CGPA descending (Merit-based)
  const sortedStudents = [...students].sort((a, b) => {
    if (Math.abs(b.cgpa - a.cgpa) > 0.0001) {
        return b.cgpa - a.cgpa;
    }
    return a.name.localeCompare(b.name);
  });

  const allocations: Allocation[] = [];
  const unplaced: Student[] = [];

  for (const student of sortedStudents) {
    let placed = false;

    if (student.preferences && student.preferences.length > 0) {
        for (const companyId of student.preferences) {
            const company = companies.find(c => c.id === companyId);
            
            if (!company) continue;

            const seatsLeft = availableSeats[companyId];
            const isEligibleCgpa = student.cgpa >= company.minCgpa;
            const isEligibleBranch = company.allowedBranches.includes(student.branch);
            
            // Robust Skill Matching
            const studentSkillsNorm = new Set(student.skills.map(s => s.toLowerCase().trim()));
            const hasRequiredSkills = company.requiredSkills.length === 0 || 
                company.requiredSkills.every(reqSkill => studentSkillsNorm.has(reqSkill.toLowerCase().trim()));

            if (seatsLeft > 0 && isEligibleCgpa && isEligibleBranch && hasRequiredSkills) {
                allocations.push({
                studentId: student.id,
                studentName: student.name,
                studentBranch: student.branch,
                studentCgpa: student.cgpa,
                companyId: company.id,
                companyName: company.name
                });
                
                availableSeats[companyId]--;
                placed = true;
                break;
            }
        }
    }

    if (!placed) {
      unplaced.push(student);
    }
  }

  return { allocations, unplaced, companyFillStatus: availableSeats };
};

/**
 * Runs a Stable Matching Algorithm (Gale-Shapley Variant).
 */
export const runStableMatchingAlgorithm = (
  students: Student[],
  companies: Company[]
): { allocations: Allocation[]; unplaced: Student[]; companyFillStatus: Record<string, number> } => {
  
  const companyAllocations: Record<string, {studentId: string, cgpa: number}[]> = {};
  companies.forEach(c => companyAllocations[c.id] = []);

  const freeStudents = [...students];
  const studentProposals: Record<string, number> = {}; 
  students.forEach(s => studentProposals[s.id] = 0);

  while (freeStudents.length > 0) {
    const student = freeStudents.shift()!;
    
    if (studentProposals[student.id] >= student.preferences.length) {
      continue;
    }

    const companyId = student.preferences[studentProposals[student.id]];
    studentProposals[student.id]++; 

    const company = companies.find(c => c.id === companyId);
    if (!company) {
       freeStudents.unshift(student);
       continue;
    }

    const isEligibleCgpa = student.cgpa >= company.minCgpa;
    const isEligibleBranch = company.allowedBranches.includes(student.branch);
    const studentSkillsNorm = new Set(student.skills.map(s => s.toLowerCase().trim()));
    const hasRequiredSkills = company.requiredSkills.length === 0 || 
        company.requiredSkills.every(reqSkill => studentSkillsNorm.has(reqSkill.toLowerCase().trim()));

    if (!isEligibleCgpa || !isEligibleBranch || !hasRequiredSkills) {
       freeStudents.unshift(student);
       continue;
    }

    const currentMatches = companyAllocations[companyId];
    
    if (currentMatches.length < company.seats) {
      currentMatches.push({ studentId: student.id, cgpa: student.cgpa });
      currentMatches.sort((a, b) => a.cgpa - b.cgpa);
    } else {
      const worstMatch = currentMatches[0];
      
      if (student.cgpa > worstMatch.cgpa) {
        const displacedStudentId = worstMatch.studentId;
        const displacedStudent = students.find(s => s.id === displacedStudentId);
        
        currentMatches.shift();
        currentMatches.push({ studentId: student.id, cgpa: student.cgpa });
        currentMatches.sort((a, b) => a.cgpa - b.cgpa);

        if (displacedStudent) freeStudents.unshift(displacedStudent);
      } else {
        freeStudents.unshift(student);
      }
    }
  }

  const allocations: Allocation[] = [];
  Object.keys(companyAllocations).forEach(cId => {
     const cName = companies.find(c => c.id === cId)?.name || '';
     companyAllocations[cId].forEach(match => {
        const s = students.find(stud => stud.id === match.studentId);
        if (s) {
          allocations.push({
             studentId: s.id,
             studentName: s.name,
             studentBranch: s.branch,
             studentCgpa: s.cgpa,
             companyId: cId,
             companyName: cName
          });
        }
     });
  });

  const unplaced = students.filter(s => !allocations.find(a => a.studentId === s.id));
  const companyFillStatus: Record<string, number> = {};
  companies.forEach(c => companyFillStatus[c.id] = companyAllocations[c.id].length);

  return { allocations, unplaced, companyFillStatus };
};

// Helper to generate dummy data
export const generateDummyData = () => {
  const branches = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'];
  const techSkills = ['Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'AWS', 'Data Structures', 'Machine Learning'];
  
  const dummyCompanies: Company[] = [
    { id: 'c1', name: 'Google', minCgpa: 9.0, seats: 3, allowedBranches: ['CSE', 'ECE'] as any, requiredSkills: ['Data Structures', 'Python'], role: 'SDE-I', workMode: 'Hybrid' },
    { id: 'c2', name: 'Microsoft', minCgpa: 8.5, seats: 4, allowedBranches: ['CSE', 'ECE', 'EEE'] as any, requiredSkills: ['C++', 'SQL'], role: 'Software Engineer', workMode: 'On-Site' },
    { id: 'c3', name: 'Amazon', minCgpa: 8.0, seats: 5, allowedBranches: ['CSE', 'ECE', 'EEE', 'MECH'] as any, requiredSkills: ['Java', 'AWS'], role: 'Cloud Associate', workMode: 'Remote' },
    { id: 'c4', name: 'TCS', minCgpa: 6.5, seats: 10, allowedBranches: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'] as any, requiredSkills: ['SQL'], role: 'System Engineer', workMode: 'On-Site' },
    { id: 'c5', name: 'Tesla', minCgpa: 8.5, seats: 2, allowedBranches: ['MECH', 'EEE', 'ECE'] as any, requiredSkills: ['Python', 'C++'], role: 'Firmware Engineer', workMode: 'On-Site' },
    { id: 'c6', name: 'L&T', minCgpa: 7.0, seats: 6, allowedBranches: ['CIVIL', 'MECH'] as any, requiredSkills: [], role: 'Graduate Trainee', workMode: 'On-Site' }, 
  ];

  const dummyStudents: Student[] = [];
  const names = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Diya', 'Saanvi', 'Ananya', 'Aadhya', 'Pari', 'Saanvi', 'Myra', 'Riya', 'Kavya', 'Anika', 'Rohan', 'Vikram', 'Neha', 'Pooja', 'Rahul', 'Suresh', 'Manoj', 'Karan', 'Simran', 'Priya'];
  
  for (let i = 0; i < 40; i++) {
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const cgpa = parseFloat((6 + Math.random() * 4).toFixed(2));
    
    const shuffledCompanies = [...dummyCompanies].sort(() => 0.5 - Math.random());
    const preferences = shuffledCompanies.map(c => c.id);

    const shuffledSkills = [...techSkills].sort(() => 0.5 - Math.random());
    const studentSkills = shuffledSkills.slice(0, 4 + Math.floor(Math.random() * 4));

    dummyStudents.push({
      id: `s${i + 1}`,
      name: `${names[i % names.length]} ${String.fromCharCode(65 + (i % 26))}.`,
      branch: branch as any,
      cgpa,
      skills: studentSkills,
      preferences
    });
  }

  return { dummyCompanies, dummyStudents };
};