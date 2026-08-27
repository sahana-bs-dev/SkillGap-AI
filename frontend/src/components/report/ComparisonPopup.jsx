import React, { useState } from "react";
import "./ComparisonPopup.css";

export default function ComparisonPopup({
  open,
  newAttemptScore,
  pastAttempts = [],
  onCompare,
  onSkip,
}) {
  const [step, setStep] = useState("ask"); // "ask" | "pick"
  const [selectedId, setSelectedId] = useState(
    pastAttempts.length > 0 ? pastAttempts[0].id : null
  );

  if (!open) return null;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup-card">
        {step === "ask" ? (
          <>
            <p className="popup-eyebrow">New analysis complete · {newAttemptScore}%</p>
            <h2 className="popup-title">Compare with a previous match?</h2>
            <p className="popup-subtext">
              See exactly what improved — and what's still missing — against an
              earlier attempt.
            </p>
            <div className="popup-actions">
              <button className="popup-btn popup-btn--ghost" onClick={onSkip}>
                No
              </button>
              <button
                className="popup-btn popup-btn--primary"
                disabled={pastAttempts.length === 0}
                onClick={() => setStep("pick")}
              >
                Yes
              </button>
            </div>
            {pastAttempts.length === 0 && (
              <p className="popup-empty">No previous analyses yet to compare against.</p>
            )}
          </>
        ) : (
          <>
            <p className="popup-eyebrow">Choose an attempt</p>
            <h2 className="popup-title">Compare against which one?</h2>

            <div className="popup-attempt-list">
              {pastAttempts.map((attempt) => (
                <label
                  key={attempt.id}
                  className={`popup-attempt-option ${
                    selectedId === attempt.id ? "popup-attempt-option--selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="pastAttempt"
                    value={attempt.id}
                    checked={selectedId === attempt.id}
                    onChange={() => setSelectedId(attempt.id)}
                  />
                  <span className="popup-attempt-info">
                    <span className="popup-attempt-title">{attempt.jobTitle}</span>
                    <span className="popup-attempt-meta">
                      {formatDate(attempt.date)} · {attempt.score}%
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <div className="popup-actions">
              <button className="popup-btn popup-btn--ghost" onClick={() => setStep("ask")}>
                Back
              </button>
              <button
                className="popup-btn popup-btn--primary"
                onClick={() => onCompare(selectedId)}
              >
                Compare now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}