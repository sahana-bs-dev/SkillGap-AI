import { useState } from "react";
import "./UploadPage.css";
import { analyzeResume } from "../services/api";
import { useNavigate } from "react-router-dom";

// Mock data for now — swap this for a real API call (e.g. getRecentAnalyses())
// once your friend's history endpoint is live in Phase 2/4
const MOCK_RECENT_ANALYSES = [
  { id: 1, jobTitle: "Frontend Developer Intern", company: "Zenith Labs", score: 78, date: "2026-08-22" },
  { id: 2, jobTitle: "Software Engineer - New Grad", company: "Orbit Systems", score: 61, date: "2026-08-18" },
  { id: 3, jobTitle: "React Developer", company: "Fern & Co", score: 85, date: "2026-08-14" },
];

export default function UploadPage() {
  const [resumeMode, setResumeMode] = useState("upload");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [recentAnalyses, setRecentAnalyses] = useState(MOCK_RECENT_ANALYSES);

  const navigate = useNavigate();

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) setResumeFile(file);
  }

  function handleRunAnalysis() {
  if (resumeMode === "upload" && !resumeFile) {
    alert("Please upload a resume file first.");
    return;
  }
  if (resumeMode === "paste" && !resumeText.trim()) {
    alert("Please paste your resume text first.");
    return;
  }
  if (!jdText.trim()) {
    alert("Please paste the job description first.");
    return;
  }

  navigate("/analyzing", { state: { resumeFile, resumeText, jdText } });
}

  function scoreClass(score) {
    if (score >= 75) return "score-high";
    if (score >= 50) return "score-mid";
    return "score-low";
  }

  return (
    <div className="upload-page">
      <div className="page-head">
        <div className="eyebrow">New analysis</div>
        <h2>Paste your resume and the job description</h2>
      </div>

      <div className="upload-grid">
        <div className="card">
          <h3>Your resume</h3>
          <p className="hint">Upload a file or paste the text directly.</p>
          <div className="input-toggle">
            <span
              className={resumeMode === "upload" ? "active" : ""}
              onClick={() => setResumeMode("upload")}
            >
              Upload file
            </span>
            <span
              className={resumeMode === "paste" ? "active" : ""}
              onClick={() => setResumeMode("paste")}
            >
              Paste text
            </span>
          </div>

          {resumeMode === "upload" ? (
            <label className="dropzone" style={{ cursor: "pointer", display: "block" }}>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div className="icon">⇪</div>
              {resumeFile ? resumeFile.name : "Drag a PDF or DOCX here, or click to browse"}
            </label>
          ) : (
            <textarea
              className="mock"
              placeholder="Paste your resume text here…"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            ></textarea>
          )}
        </div>

        <div className="card">
          <h3>Job description</h3>
          <p className="hint">Paste the JD text from the listing.</p>
          <textarea
            className="mock"
            placeholder="Paste the job description here…"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="run-row">
        <button className="btn-accent" onClick={handleRunAnalysis}>
  Run analysis →
</button>
      </div>
    
      <div className="eyebrow">Recent analyses</div>
      <div className="recent-list">
        {recentAnalyses.length === 0 ? (
          <p className="hint">No analyses yet — run your first one above.</p>
        ) : (
          recentAnalyses.map((item) => (
            <div className="recent-item" key={item.id}>
              <div className="recent-info">
                <div className="recent-title">{item.jobTitle}</div>
                <div className="recent-meta">
                  {item.company} · {item.date}
                </div>
              </div>
              <div className={`recent-score ${scoreClass(item.score)}`}>
                {item.score}%
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}