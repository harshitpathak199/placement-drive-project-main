import { GoogleGenAI } from "@google/genai";
import { Allocation, Student, Company } from "../types";

const initializeGenAI = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generatePlacementInsights = async (
  allocations: Allocation[],
  unplaced: Student[],
  companies: Company[]
): Promise<string> => {
  const ai = initializeGenAI();
  if (!ai) return "API Key is missing. Unable to generate insights.";

  const stats = {
    totalAllocated: allocations.length,
    totalStudents: allocations.length + unplaced.length,
    placementRate: ((allocations.length / (allocations.length + unplaced.length)) * 100).toFixed(1) + '%',
    avgCgpa: (allocations.reduce((acc, curr) => acc + curr.studentCgpa, 0) / Math.max(allocations.length, 1)).toFixed(2),
    companyUtilization: companies.map(c => ({ name: c.name, filled: allocations.filter(a => a.companyId === c.id).length, total: c.seats }))
  };

  const prompt = `
    Analyze the following campus placement simulation data and provide a structured JSON response for a dashboard.
    
    Data:
    ${JSON.stringify(stats, null, 2)}

    Return ONLY a valid JSON object (no markdown formatting, no backticks) with the following structure:
    {
      "executive_summary": "A concise 2-sentence overview of the placement drive performance.",
      "market_trend": "One specific observation about company demand or student performance (e.g. 'High demand for CSE students').",
      "key_highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
      "strategic_recommendations": ["Recommendation 1", "Recommendation 2"],
      "success_score": "A score from 1-10 based on efficiency"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    return response.text || "{}";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "{}";
  }
};

export const checkStudentEligibility = async (student: Student, company: Company): Promise<string> => {
  const ai = initializeGenAI();
  if (!ai) return "Unable to check eligibility.";

  const prompt = `
    You are a Placement Officer AI. Check if the following student is a good fit for the company based on the provided data.
    
    Student: ${student.name}, CGPA: ${student.cgpa}, Branch: ${student.branch}, Skills: ${student.skills.join(', ')}
    Company: ${company.name}, Min CGPA: ${company.minCgpa}, Allowed Branches: ${company.allowedBranches.join(', ')}, Required Skills: ${company.requiredSkills.join(', ')}

    Analyze 3 things:
    1. Merit Check (CGPA)
    2. Branch Eligibility
    3. Skill Match
    
    Return a short, direct "Verdict" in 2 sentences max. Start with "Eligible" or "Not Eligible" or "Risky".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    return "AI Service Unavailable.";
  }
};