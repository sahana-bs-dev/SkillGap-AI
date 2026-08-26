import { useLocation, useNavigate } from "react-router-dom";
import "./ReportPage.css";

// Mock AI-matcher output for now — swap this for the real analysis result
// once your friend's Phase 3 backend (AI matcher) endpoint is ready.
const MOCK_ANALYSIS = {
  jobTitle: "Frontend Developer Intern",
  company: "Nova Labs",
  score: 78,
  summary:
    "Your resume covers most of the core stack this role asks for. The biggest opportunity is testing and deployment experience — closing that would move this from a good match to a strong one.",
  matched: ["React.js", "JavaScript (ES6+)", "Git & version control", "REST API integration", "Team collaboration"],
  missing: [
    { skill: "Unit testing (Jest)", fix: "Add a Jest test suite to one existing project and mention it in your bullet points." },
    { skill: "CI/CD basics", fix: "Set up a simple GitHub Actions workflow on a personal repo — even auto-deploy counts." },
    { skill: "TypeScript", fix: "Convert one small project file-by-file to TypeScript to build a real talking point." },
  ],
};

export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Real parsed text from the Upload page (Phase 2), passed via navigation state.
  const { resumeText, jdText } = location.state || {};
  const analysis = MOCK_ANALYSIS; // TODO: replace with real AI matcher response

  // Ring math: circumference = 2 * π * r (r = 62, matching the blueprint)
  const circumference = 2 * Math.PI * 62;
  const dashOffset = circumference * (1 - analysis.score / 100);

  return (
    <div className="report-page">
      <div className="report-head">
        <div>
          <div className="eyebrow">Analysis report</div>
          <h2>{analysis.jobTitle} — {analysis.company}</h2>
          <div className="report-meta">Based on your uploaded resume and pasted job description</div>
        </div>
      </div>

      <div className="gauge-card">
        <div className="ring-wrap">
          <svg viewBox="0 0 150 150" width="150" height="150">
            <circle cx="75" cy="75" r="62" fill="none" stroke="#E4DFFA" strokeWidth="16" />
            <circle
              cx="75" cy="75" r="62" fill="none" stroke="#7C6FE8" strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 75 75)"
            />
          </svg>
          <div className="ring-readout">
            <div className="num">{analysis.score}%</div>
            <div className="lbl">Match</div>
          </div>
        </div>
        <div className="gauge-copy">
          <h3>Solid overlap, a few gaps worth closing</h3>
          <p>{analysis.summary}</p>
        </div>
      </div>

      <div className="skills-grid">
        <div className="skills-col match">
          <h4><span className="sticker match">✓ Matched</span></h4>
          {analysis.matched.map((skill) => (
            <div className="skill-row" key={skill}>{skill}</div>
          ))}
        </div>
        <div className="skills-col gap">
          <h4><span className="sticker gap">! Missing</span></h4>
          {analysis.missing.map((item) => (
            <div key={item.skill}>
              <div className="skill-row">{item.skill}</div>
              <div className="skill-fix"><b>Fix:</b> {item.fix}</div>
            </div>
          ))}
        </div>
      </div>

      {(resumeText || jdText) && (
        <div className="compare-strip">
          <h4>Your submitted text</h4>
          <div className="diff-grid">
            <div className="diff-block">
              <div className="diff-label">Your resume</div>
              <div className="diff-text">{resumeText ? resumeText.slice(0, 300) + "..." : "—"}</div>
            </div>
            <div className="diff-block">
              <div className="diff-label">Job description</div>
              <div className="diff-text">{jdText || "—"}</div>
            </div>
          </div>
        </div>
      )}

      <button className="btn-ghost" onClick={() => navigate("/upload")}>
        ← Back to upload
      </button>
    </div>
  );
}