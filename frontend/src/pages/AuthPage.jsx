import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import "./AuthPage.css";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
    <section className="screen-auth">
      <div className="auth-brand">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="content">
          <div className="mark">✦ SkillGap AI</div>
          <h1>See exactly what's missing between your resume and the job.</h1>
          <p className="sub">
            Paste a resume and a job description. Get a match score, what already
            fits, what's missing, and how to fix it — built for freshers applying
            to their first roles.
          </p>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <div className="auth-toggle">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Log in
            </button>
            <button
              className={mode === "signup" ? "active" : ""}
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </div>

          {mode === "login" ? <LoginForm /> : <SignupForm />}

          <p className="auth-note">
            Your past analyses are saved to your account so you can track
            improvement over time.
          </p>
        </div>
      </div>
    </section>
  );
}