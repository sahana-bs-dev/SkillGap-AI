import React from "react";
import "./CompareView.css";
import { mockComparison } from "../../data/mockCompareData";

/**
 * CompareView
 * Side-by-side comparison of two saved analyses.
 *
 * Props:
 *  - attemptA, attemptB: {
 *      id, jobTitle, date, score,
 *      matched: string[], missing: string[]
 *    }
 *
 * When no props are passed, falls back to mock data so this
 * component can be dropped into ComparePage.jsx and previewed
 * immediately, before the history API is wired up.
 */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function AttemptCard({ attempt, attemptLabel }) {
  const scoreClass = attempt.score >= 75 ? "score-high" : "score-low";

  return (
    <div className="compare-card">
      <p className="compare-card__meta">
        {attemptLabel} · {formatDate(attempt.date).toUpperCase()}
      </p>

      <p className={`compare-card__score ${scoreClass}`}>{attempt.score}%</p>

      <div className="compare-card__section">
        <p className="compare-card__section-label compare-card__section-label--matched">
          ✓ Matched
        </p>
        <div className="tag-list">
          {attempt.matched.map((skill) => (
            <span key={skill} className="tag tag--matched">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="compare-card__section">
        <p className="compare-card__section-label compare-card__section-label--missing">
          ! Missing
        </p>
        <div className="tag-list">
          {attempt.missing.map((skill) => (
            <span key={skill} className="tag tag--missing">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CompareView({ attemptA, attemptB }) {
  const a = attemptA || mockComparison.attemptA;
  const b = attemptB || mockComparison.attemptB;

  const delta = b.score - a.score;
  const deltaPositive = delta >= 0;

  return (
    <div className="compare-view">
      <p className="compare-view__eyebrow">Compare History</p>
      <h1 className="compare-view__title">
        {a.jobTitle} <span className="compare-view__vs">vs</span> {b.jobTitle}
      </h1>

      <div className="compare-view__row">
        <AttemptCard attempt={a} attemptLabel="Attempt 1" />

        <div className="compare-view__divider">
          <span className={`delta-badge ${deltaPositive ? "delta-badge--up" : "delta-badge--down"}`}>
            {deltaPositive ? "+" : ""}
            {delta}% {deltaPositive ? "↑" : "↓"}
          </span>
          <div className="compare-view__divider-line" />
        </div>

        <AttemptCard attempt={b} attemptLabel="Attempt 2" />
      </div>
    </div>
  );
}