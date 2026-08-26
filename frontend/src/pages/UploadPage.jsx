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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) setResumeFile(file);
  }

  async function handleRunAnalysis() {
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

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const data = await analyzeResume({
        resumeFile: resumeMode === "upload" ? resumeFile : null,
        resumeText: resumeMode === "paste" ? resumeText : "",
        jdText,
      });
      // Take the user straight to the Report page with the parsed text.
      // Once the real AI matcher (Phase 3 backend) exists, its result
      // will be passed here too instead of ReportPage using mock data.
      navigate("/report", {
        state: { resumeText: data.resume_text, jdText: data.jd_text },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        <button className="btn-accent" onClick={handleRunAnalysis} disabled={loading}>
          {loading ? "Analyzing…" : "Run analysis →"}
        </button>
      </div>

      {error && (
        <p style={{ color: "#F0596B", fontSize: "13px", marginBottom: "20px" }}>
          {error}
        </p>
      )}

      {/* Temporary success preview — Phase 3 replaces this with the real Report page */}
      {result && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <h3>Parsed successfully ✅</h3>
          <p className="hint">This confirms the backend received and parsed your input.</p>
          <p style={{ fontSize: "13px", marginTop: "10px" }}>
            <strong>Resume text (preview):</strong>
            <br />
            {result.resume_text.slice(0, 200)}...
          </p>
        </div>
      )}

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