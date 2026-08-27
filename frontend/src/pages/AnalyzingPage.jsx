import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { analyzeResume } from "../services/api";
import "./AnalyzingPage.css";

const STEPS = [
  { icon: "📄", label: "Reading your resume" },
  { icon: "📋", label: "Parsing job description" },
  { icon: "🔍", label: "Comparing skills" },
  { icon: "✨", label: "Finalizing your report" },
];

const STEP_INTERVAL_MS = 2500;

export default function AnalyzingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const input = location.state;

  const [stepIndex, setStepIndex] = useState(0);
  const [longWait, setLongWait] = useState(false);
  const ranOnce = useRef(false);

  useEffect(() => {
    if (!input) navigate("/upload");
  }, [input, navigate]);

  useEffect(() => {
    if (stepIndex >= STEPS.length - 1) return;
    const timer = setTimeout(() => setStepIndex((i) => i + 1), STEP_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  useEffect(() => {
    if (stepIndex < STEPS.length - 1) return;
    const timer = setTimeout(() => setLongWait(true), 4000);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  useEffect(() => {
    if (!input || ranOnce.current) return;
    ranOnce.current = true;

    analyzeResume(input)
      .then((data) => navigate("/report", { state: data }))
      .catch((err) => navigate("/upload", { state: { analysisError: err.message } }));
  }, [input, navigate]);

  if (!input) return null;

  const progressPct = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="analyzing-page">
      <div className="analyzing-card">
        <div className="orbit">
          <div className="orbit-ring" />
          <div className="orbit-core">{STEPS[stepIndex].icon}</div>
        </div>

        <h2>Analyzing your fit</h2>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <ul className="step-list">
          {STEPS.map((step, i) => (
            <li
              key={step.label}
              className={
                i < stepIndex ? "step done" : i === stepIndex ? "step active" : "step pending"
              }
            >
              <span className="step-icon">
                {i < stepIndex ? "✓" : step.icon}
              </span>
              <span className="step-text">{step.label}</span>
            </li>
          ))}
        </ul>

        {longWait && (
          <p className="long-wait-note">
            Still working — larger resumes or job descriptions can take a little longer.
          </p>
        )}
      </div>
    </div>
  );
}