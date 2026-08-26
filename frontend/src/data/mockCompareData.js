// Temporary mock data — shaped the way we expect the history/comparison API
// to eventually respond. Swap `mockComparison` for a real API response
// (see services/api.js) once the backend endpoints are ready.

export const mockAnalysisHistory = [
  {
    id: "atmpt_001",
    jobTitle: "React Developer — Junior",
    company: "",
    date: "2026-08-02",
    score: 72,
    matched: ["React", "JavaScript", "Git"],
    missing: ["Testing", "TypeScript", "CI/CD"],
  },
  {
    id: "atmpt_002",
    jobTitle: "Frontend Developer Intern — Nova Labs",
    company: "Nova Labs",
    date: "2026-08-18",
    score: 78,
    matched: ["React", "JavaScript", "Git", "REST APIs"],
    missing: ["Jest", "CI/CD", "TypeScript"],
  },
  {
    id: "atmpt_003",
    jobTitle: "Frontend Engineer — Aster",
    company: "Aster",
    date: "2026-08-24",
    score: 81,
    matched: ["React", "JavaScript", "Git", "REST APIs", "TypeScript"],
    missing: ["CI/CD", "GraphQL"],
  },
];

// A ready-made pair for previewing CompareView on its own
export const mockComparison = {
  attemptA: mockAnalysisHistory[0],
  attemptB: mockAnalysisHistory[1],
};