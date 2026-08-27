import { useState, useEffect } from "react";
import "./UploadPage.css";
import { analyzeResume, getAnalysisHistory } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const [resumeMode, setResumeMode] = useState("upload");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAnalysisHistory()
      .then((history) => setRecentAnalyses(history.slice(0, 5)))
      .catch(() => setRecentAnalyses([]));
  }, []);
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

    function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
                  {item.company} · {formatDate(item.date)}
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