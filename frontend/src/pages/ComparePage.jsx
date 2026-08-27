import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CompareView from "../components/compare/CompareView";
import { getAnalysisById } from "../services/api";
import "./ComparePage.css";

/**
 * ComparePage
 * Route: /compare?a=<attemptId>&b=<attemptId>
 *
 * Reads which two attempts to compare from the URL, loads them, and
 * renders CompareView.
 */

function fetchAttemptById(id) {
  return getAnalysisById(id).catch(() => null);
}

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const idA = searchParams.get("a");
  const idB = searchParams.get("b");

  const [status, setStatus] = useState("loading"); // loading | ready | error | missing-params
  const [attemptA, setAttemptA] = useState(null);
  const [attemptB, setAttemptB] = useState(null);

  useEffect(() => {
    if (!idA || !idB) {
      setStatus("missing-params");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    Promise.all([fetchAttemptById(idA), fetchAttemptById(idB)])
      .then(([a, b]) => {
        if (cancelled) return;
        if (!a || !b) {
          setStatus("error");
          return;
        }
        setAttemptA(a);
        setAttemptB(b);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [idA, idB]);

  if (status === "loading") {
    return (
      <div className="compare-page-state">
        <p>Loading comparison…</p>
      </div>
    );
  }

  if (status === "missing-params") {
    return (
      <div className="compare-page-state">
        <p>Pick two analyses from your history to compare.</p>
        <button className="compare-page-link" onClick={() => navigate("/history")}>
          Go to history
        </button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="compare-page-state">
        <p>We couldn't load one of those analyses. It may have been deleted.</p>
        <button className="compare-page-link" onClick={() => navigate("/history")}>
          Back to history
        </button>
      </div>
    );
  }

  return <CompareView attemptA={attemptA} attemptB={attemptB} />;
}