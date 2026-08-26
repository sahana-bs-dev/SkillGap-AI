import { useLocation, useNavigate } from "react-router-dom";
import "./ReportPage.css";

function summaryFor(score) {
  if (score >= 85) return "Strong match — your resume aligns closely with this role's requirements.";
  if (score >= 65) return "Solid overlap, a few gaps worth closing to strengthen your fit.";
  if (score >= 40) return "Partial match — there are some meaningful gaps to address before applying.";
  return "This role has significant requirements not yet reflected in your resume.";
}

export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  // Guard: someone landed here directly without running an analysis
  if (!data) {
    return (
      <div className="report-page">
        <p className="hint">No analysis found. Run one from the Upload page first.</p>
        <button className="btn-ghost" onClick={() => navigate("/upload")}>
          ← Back to upload
        </button>
      </div>
    );
  }

  const analysis = {
    jobTitle: "Resume analysis",
    company: "",
    score: data.match_score,
    summary: summaryFor(data.match_score),
    matched: data.matching_points,
    missing: data.suggestions.map((s) => ({ skill: s.missing_skill, fix: s.suggestion })),
  };

  const resumeText = data.resume_text;
  const jdText = data.jd_text;

  // Ring math: circumference = 2 * π * r (r = 62, matching the blueprint)
  const circumference = 2 * Math.PI * 62;
  const dashOffset = circumference * (1 - analysis.score / 100);

  return (
    <div className="report-page">
      <div className="report-head">
        <div>
          <div className="eyebrow">Analysis report</div>
          <h2>{analysis.company ? `${analysis.jobTitle} — ${analysis.company}` : analysis.jobTitle}</h2>
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
            <div className="skill-row" key={skill}>
              <span className="skill-dot match-dot" />
              <span className="skill-name">{skill}</span>
            </div>
          ))}
        </div>
        <div className="skills-col gap">
          <h4><span className="sticker gap">! Missing</span></h4>
          {analysis.missing.map((item) => (
            <div className="skill-row" key={item.skill}>
              <span className="skill-dot gap-dot" />
              <span className="skill-name">{item.skill}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="suggestions-block">
        <h4><span className="sticker suggest">↗ Suggestions</span></h4>
        <div className="suggestions-list">
          {analysis.missing.map((item) => (
            <div className="suggestion-card" key={item.skill}>
              <div className="suggestion-skill">{item.skill}</div>
              <div className="suggestion-fix">{item.fix}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-ghost" onClick={() => navigate("/upload")}>
        ← Back to upload
      </button>
    </div>
  );
}